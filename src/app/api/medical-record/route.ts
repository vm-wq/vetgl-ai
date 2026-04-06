import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callClaude } from '@/lib/ai/anthropic';

export interface MedicalRecord {
  identificacao: {
    paciente?: string;
    especie?: string;
    raca?: string;
    idade?: string;
    peso?: string;
    sexo?: string;
    tutor?: string;
  };
  anamnese: string;
  exame_fisico: string;
  exames_complementares: string;
  diagnostico: {
    principal: string;
    diferenciais: string[];
  };
  tratamento: {
    prescricao: string[];
    procedimentos: string[];
    orientacoes: string[];
  };
  evolucao: string;
  observacoes: string;
  nivel_confianca: 'ALTO' | 'MODERADO' | 'BAIXO';
  resumo: string;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { case_id } = await req.json();

    if (!case_id) {
      return NextResponse.json({ error: 'case_id is required' }, { status: 400 });
    }

    // Fetch all messages for the case
    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('case_id', case_id)
      .order('created_at', { ascending: true });

    if (msgError || !messages?.length) {
      return NextResponse.json(
        { error: 'Nenhuma mensagem encontrada para este caso' },
        { status: 404 }
      );
    }

    // Build conversation context
    const conversationText = messages
      .map((m) => `${m.role === 'user' ? 'Veterinário' : 'AI'}: ${m.content}`)
      .join('\n\n');

    const prompt = `Com base na seguinte conversa clínica, gere um PRONTUÁRIO MÉDICO VETERINÁRIO completo e estruturado em formato JSON.

CONVERSA:
${conversationText}

Retorne APENAS um JSON válido com esta estrutura:
{
  "identificacao": {
    "paciente": "nome do animal (se mencionado)",
    "especie": "espécie",
    "raca": "raça (se mencionada)",
    "idade": "idade (se mencionada)",
    "peso": "peso (se mencionado)",
    "sexo": "sexo/status reprodutivo (se mencionado)",
    "tutor": "nome do tutor (se mencionado)"
  },
  "anamnese": "história clínica completa extraída da conversa",
  "exame_fisico": "achados do exame físico (se mencionados na conversa)",
  "exames_complementares": "exames solicitados ou resultados mencionados",
  "diagnostico": {
    "principal": "diagnóstico principal ou hipótese mais provável",
    "diferenciais": ["diagnósticos diferenciais mencionados"]
  },
  "tratamento": {
    "prescricao": ["medicamentos prescritos com doses"],
    "procedimentos": ["procedimentos realizados ou recomendados"],
    "orientacoes": ["orientações ao tutor"]
  },
  "evolucao": "evolução do caso (se houver follow-up na conversa)",
  "observacoes": "notas adicionais relevantes",
  "nivel_confianca": "ALTO | MODERADO | BAIXO",
  "resumo": "Resumo em 2-3 linhas do caso completo"
}`;

    const response = await callClaude(
      [{ role: 'user', content: prompt }],
      'Você é um sistema de geração de prontuários veterinários. Extraia informações da conversa e gere prontuários estruturados. Retorne APENAS JSON válido.',
      'claude-sonnet-4-20250514'
    );

    // Parse JSON from response
    let record: MedicalRecord | null = null;
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      record = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      record = null;
    }

    if (!record) {
      return NextResponse.json(
        { error: 'Erro ao processar resposta do AI' },
        { status: 500 }
      );
    }

    // Save to database (using existing tables or JSONB)
    const { data: savedRecord, error: saveError } = await supabase
      .from('medical_records')
      .insert({
        case_id,
        content: record,
        generated_by: 'claude-sonnet-4-20250514',
      })
      .select()
      .single();

    if (saveError) {
      // Table might not exist yet, return the record anyway
      console.error('Error saving medical record:', saveError);
      return NextResponse.json({ record, saved: false, warning: 'Prontuário gerado mas não salvo no banco de dados' });
    }

    return NextResponse.json({
      record: savedRecord?.content || record,
      id: savedRecord?.id,
      saved: true,
    });
  } catch (error) {
    console.error('Medical record error:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar prontuário' },
      { status: 500 }
    );
  }
}
