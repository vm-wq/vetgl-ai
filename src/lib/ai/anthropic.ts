/**
 * Anthropic Claude API Client
 * Handles all interactions with Claude models for VETGL.AI
 */

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export interface MessageParam {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Call Claude with a system prompt and conversation history
 * @param messages - Conversation history
 * @param systemPrompt - System prompt for the model
 * @param model - Model to use (default: claude-sonnet-4-20250514)
 * @returns The assistant's response text
 */
export async function callClaude(
  messages: { role: string; content: string }[],
  systemPrompt: string,
  model: string = 'claude-sonnet-4-20250514'
): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages as Anthropic.Messages.MessageParam[],
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    return textBlock.text;
  } catch (error) {
    console.error('Error calling Claude:', error);
    throw error;
  }
}

/**
 * Call Claude with streaming support for long responses
 * Useful for real-time display of responses in the UI
 */
export async function callClaudeStreaming(
  messages: MessageParam[],
  systemPrompt: string,
  onChunk: (chunk: string) => void,
  model: string = 'claude-sonnet-4-20250514'
): Promise<string> {
  try {
    let fullResponse = '';

    const stream = await anthropic.messages.create({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      stream: true,
      messages: messages as Anthropic.Messages.MessageParam[],
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        onChunk(event.delta.text);
        fullResponse += event.delta.text;
      }
    }

    return fullResponse;
  } catch (error) {
    console.error('Error calling Claude with streaming:', error);
    throw error;
  }
}

/**
 * Analyze a clinical case and return structured assessment
 * Uses the VETGL system prompt for consistency
 */
export async function analyzeClinicalCase(
  caseDescription: string,
  systemPrompt: string,
  conversationHistory: MessageParam[] = []
): Promise<string> {
  const messages: MessageParam[] = [
    ...conversationHistory,
    {
      role: 'user',
      content: caseDescription,
    },
  ];

  return callClaude(messages, systemPrompt);
}

/**
 * Generate a quick triage assessment
 * Returns a brief urgency classification and initial recommendations
 */
export async function triagePatient(
  patientInfo: string,
  systemPrompt: string
): Promise<{
  urgency: 'emergency' | 'urgent' | 'semi-urgent' | 'non-urgent';
  assessment: string;
}> {
  const triagePrompt = `${systemPrompt}

Você está em modo TRIAGEM RÁPIDA. Responda APENAS com:
1. Uma classificação de urgência: 🔴 EMERGÊNCIA | 🟡 URGÊNCIA | 🟢 CONSULTA | ⚪ ELETIVO
2. Justificativa em 2-3 linhas
3. Ações imediatas (máx 3)

Não use o formato completo. Seja conciso.`;

  const response = await callClaude(
    [{ role: 'user', content: patientInfo }],
    triagePrompt
  );

  // Parse urgency from response
  let urgency: 'emergency' | 'urgent' | 'semi-urgent' | 'non-urgent' =
    'non-urgent';
  if (response.includes('🔴') || response.includes('EMERGÊNCIA')) {
    urgency = 'emergency';
  } else if (response.includes('🟡') || response.includes('URGÊNCIA')) {
    urgency = 'urgent';
  } else if (response.includes('🟢') || response.includes('CONSULTA')) {
    urgency = 'semi-urgent';
  }

  return {
    urgency,
    assessment: response,
  };
}

/**
 * Generate medication dosing recommendations
 * Returns safe dosing range with species and route confirmation
 */
export async function calculateDosing(
  drugName: string,
  species: string,
  weight: number,
  systemPrompt: string
): Promise<string> {
  const dosingPrompt = `${systemPrompt}

Você é um farmacologista veterinário. Forneça APENAS:
1. Faixa de dose segura para ${drugName} em ${species} de ${weight}kg
2. Rota(s) recomendada(s)
3. Intervalo de administração
4. CONTRAINDICAÇÕES críticas
5. Monitoramento essencial

Cite sempre a fonte (AAHA, WSAVA, Merck, etc).`;

  return callClaude(
    [
      {
        role: 'user',
        content: `Calculate safe dosing for ${drugName} in a ${weight}kg ${species}`,
      },
    ],
    dosingPrompt
  );
}

export default {
  callClaude,
  callClaudeStreaming,
  analyzeClinicalCase,
  triagePatient,
  calculateDosing,
};
