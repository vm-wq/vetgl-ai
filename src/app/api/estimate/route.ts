import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callClaude } from '@/lib/ai/anthropic';

export interface EstimateService {
  name: string;
  category: string;
  price_low: number;
  price_high: number;
  quantity: number;
}

export interface Estimate {
  services: EstimateService[];
  total_low: number;
  total_high: number;
  notes?: string;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { description, species, case_id, model, from_case } = await req.json();

    // If from_case is true, fetch case context from messages
    let caseDescription = description;
    let caseSpecies = species;

    if (from_case && case_id) {
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('case_id', case_id)
        .order('created_at', { ascending: true });

      if (!msgError && messages?.length) {
        const conversationText = messages
          .map((m) => `${m.role === 'user' ? 'Veterinário' : 'AI'}: ${m.content}`)
          .join('\n\n');

        caseDescription = conversationText;
      }
    }

    if (!caseDescription) {
      return NextResponse.json(
        { error: 'Clinical description is required' },
        { status: 400 }
      );
    }

    const prompt = `Você é um veterinário em uma clínica de emergência nos EUA (Greenlight Pet Hospital).

Com base na descrição clínica abaixo, gere uma estimativa de tratamento realista e COMPLETA.
FILOSOFIA: Sempre sugira o painel COMPLETO de serviços que seria apropriado para este caso. O veterinário pode depois remover serviços conforme necessário, mas comece com uma proposta abrangente.

Espécie: ${caseSpecies || 'Cão'}
Descrição: ${caseDescription}

Gere a estimativa no seguinte formato JSON:
{
  "services": [
    { "name": "Nome do serviço", "category": "Categoria", "price_low": 100, "price_high": 150, "quantity": 1 }
  ],
  "total_low": 0,
  "total_high": 0,
  "notes": "Notas adicionais"
}

Inclua TODOS os serviços necessários para este caso: consulta de emergência/especializada, painel de exames apropriado, imagens diagnósticas, medicações, procedimentos, hospitalização/internação se necessário, follow-up.
Use preços em USD compatíveis com clínicas de emergência nos EUA.
Responda APENAS com o JSON válido, sem texto adicional.`;

    const content = await callClaude(
      [{ role: 'user', content: prompt }],
      'Você é um assistente veterinário especializado em estimativas de tratamento realistas. Considere todos os custos envolvidos em um caso clínico.',
      model || 'claude-sonnet-4-20250514'
    );

    let estimate: Estimate | null = null;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        estimate = JSON.parse(jsonMatch[0]);
      }
    } catch {
      estimate = null;
    }

    // Save if case_id provided
    if (case_id && estimate) {
      const { error: saveError } = await supabase
        .from('estimates')
        .insert({
          case_id,
          user_id: user.id,
          species: species || null,
          services: estimate.services || [],
          total_low: estimate.total_low || 0,
          total_high: estimate.total_high || 0,
          notes: estimate.notes || null,
        });

      if (saveError) {
        console.error('Error saving estimate:', saveError);
      }
    }

    return NextResponse.json({
      estimate,
      raw: content,
      success: true,
      saved: !!case_id,
    });
  } catch (error) {
    console.error('Estimate error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: `Erro ao gerar estimativa: ${errorMessage}` },
      { status: 500 }
    );
  }
}
