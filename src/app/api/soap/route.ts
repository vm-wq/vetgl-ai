import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callClaude } from '@/lib/ai/anthropic';
import { getOptimalModel } from '@/lib/ai/model-router';

export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { transcript, case_id, model } = await req.json();

    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript or case summary is required' },
        { status: 400 }
      );
    }

    const prompt = `Você é um veterinário experiente. Com base na transcrição/resumo da consulta abaixo, gere uma nota SOAP completa e profissional.

Transcrição/Resumo:
${transcript}

Gere a nota SOAP no seguinte formato JSON:
{
  "subjective": "...",
  "objective": "...",
  "assessment": "...",
  "plan": "..."
}

Responda APENAS com o JSON válido, sem texto adicional.`;

    const selectedModel = model || getOptimalModel('soap');
    const content = await callClaude(
      [{ role: 'user', content: prompt }],
      'Você é um assistente veterinário especializado em documentação clínica SOAP. Gere notas detalhadas, organizadas e clinicamente precisas.',
      selectedModel
    );

    // Try to parse JSON from response
    let soap: SOAPNote | null = null;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        soap = JSON.parse(jsonMatch[0]);
      }
    } catch {
      // If JSON parsing fails, return the raw content in a structured format
      soap = {
        subjective: content,
        objective: '',
        assessment: '',
        plan: '',
      };
    }

    // Save if case_id provided
    if (case_id && soap) {
      const { error: saveError } = await supabase
        .from('soap_notes')
        .insert({
          case_id,
          user_id: user.id,
          subjective: soap.subjective,
          objective: soap.objective,
          assessment: soap.assessment,
          plan: soap.plan,
        });

      if (saveError) {
        console.error('Error saving SOAP note:', saveError);
      }
    }

    return NextResponse.json({
      soap,
      raw: content,
      success: true,
      saved: !!case_id,
    });
  } catch (error) {
    console.error('SOAP generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: `Erro ao gerar SOAP: ${errorMessage}` },
      { status: 500 }
    );
  }
}
