import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callClaude } from '@/lib/ai/anthropic';
import { getOptimalModel } from '@/lib/ai/model-router';

export interface DischargeInstructions {
  diagnosis_summary: string;
  medications: string;
  home_care: string;
  warning_signs: string;
  follow_up: string;
  restrictions?: string;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { soap, species, patient_name, model, case_id } = await req.json();

    if (!soap) {
      return NextResponse.json(
        { error: 'SOAP note is required' },
        { status: 400 }
      );
    }

    const prompt = `Você é um veterinário experiente criando instruções de alta para o tutor de um paciente.

Dados do paciente:
- Espécie: ${species || 'Não especificada'}
- Nome: ${patient_name || 'Não informado'}

SOAP:
S: ${soap?.subjective || 'N/A'}
O: ${soap?.objective || 'N/A'}
A: ${soap?.assessment || 'N/A'}
P: ${soap?.plan || 'N/A'}

Gere instruções de alta completas e claras para o tutor, em linguagem acessível e empática. Inclua:

1. Resumo do diagnóstico em linguagem simples
2. Medicações prescritas com dosagens e frequência
3. Cuidados em casa
4. Sinais de alerta para retorno imediato
5. Data de retorno recomendada
6. Restrições de atividade/dieta se aplicável

Use formatação clara com seções bem definidas.`;

    const selectedModel = model || getOptimalModel('discharge');
    const content = await callClaude(
      [{ role: 'user', content: prompt }],
      'Você é um assistente veterinário especializado em comunicação com tutores de animais. Crie instruções claras, empáticas e fáceis de entender.',
      selectedModel
    );

    // Save if case_id provided
    if (case_id) {
      const { error: saveError } = await supabase
        .from('discharge_instructions')
        .insert({
          case_id,
          user_id: user.id,
          patient_name: patient_name || null,
          species: species || null,
          instructions: content,
        });

      if (saveError) {
        console.error('Error saving discharge instructions:', saveError);
      }
    }

    return NextResponse.json({
      instructions: content,
      success: true,
      saved: !!case_id,
    });
  } catch (error) {
    console.error('Discharge instructions error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: `Erro ao gerar instruções de alta: ${errorMessage}` },
      { status: 500 }
    );
  }
}
