/**
 * AI Memory System for VETGL.AI
 * Inspired by Mem0 — learns from conversations and stores preferences/protocols
 */

import { createClient } from '@/lib/supabase/server';
import { callClaude } from './anthropic';

export interface AIMemory {
  id?: string;
  hospital_id?: string;
  user_id?: string;
  key: string;
  value: string;
  category: 'preference' | 'protocol' | 'fact' | 'drug_preference' | 'patient_history';
  relevance_score: number;
  access_count: number;
  last_accessed?: string;
  created_at?: string;
}

/**
 * Extract memorable facts from a conversation
 */
export async function extractMemories(
  conversationText: string,
  userId: string,
  hospitalId?: string
): Promise<AIMemory[]> {
  try {
    const prompt = `Analise esta conversa veterinária e extraia FATOS IMPORTANTES que devemos memorizar para futuras consultas.

CONVERSA:
${conversationText}

Extraia APENAS fatos que sejam úteis para consultas futuras, como:
- Preferências do veterinário (ex: "Dr. Silva prefere Meloxicam para gatos")
- Protocolos da clínica (ex: "GreenLight usa Propofol para indução")
- Histórico de pacientes (ex: "Max, Golden Retriever de 8 anos, tem hipotireoidismo")
- Alergias ou reações anteriores
- Dosagens preferidas

Retorne APENAS um array JSON:
[
  {
    "key": "chave descritiva curta",
    "value": "fato completo",
    "category": "preference|protocol|fact|drug_preference|patient_history"
  }
]

Se não houver fatos importantes, retorne: []`;

    const response = await callClaude(
      [{ role: 'user', content: prompt }],
      'Você é um sistema de extração de memória. Retorne APENAS JSON válido.',
      'claude-sonnet-4-20250514'
    );

    try {
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      const memories: any[] = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

      return memories.map((m) => ({
        user_id: userId,
        hospital_id: hospitalId,
        key: m.key,
        value: m.value,
        category: m.category || 'fact',
        relevance_score: 1.0,
        access_count: 0,
      }));
    } catch {
      return [];
    }
  } catch (error) {
    console.error('Error extracting memories:', error);
    return [];
  }
}

/**
 * Store memories in the database
 */
export async function storeMemories(
  memories: AIMemory[],
  useServiceRole: boolean = false
): Promise<void> {
  if (!memories.length) return;

  try {
    const supabase = await createClient();

    for (const memory of memories) {
      // Check for existing similar memory
      const { data: existing } = await supabase
        .from('ai_memories')
        .select('id, access_count')
        .eq('key', memory.key)
        .eq('user_id', memory.user_id)
        .maybeSingle();

      if (existing) {
        // Update existing
        await supabase
          .from('ai_memories')
          .update({
            value: memory.value,
            relevance_score: Math.min(memory.relevance_score + 0.1, 2.0),
            access_count: (existing.access_count || 0) + 1,
            last_accessed: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        // Insert new
        await supabase.from('ai_memories').insert(memory);
      }
    }
  } catch (error) {
    console.error('Error storing memories:', error);
  }
}

/**
 * Retrieve relevant memories for a query
 */
export async function retrieveMemories(
  userId: string,
  query?: string,
  limit: number = 10
): Promise<AIMemory[]> {
  try {
    const supabase = await createClient();

    let queryBuilder = supabase
      .from('ai_memories')
      .select('*')
      .eq('user_id', userId)
      .order('relevance_score', { ascending: false })
      .order('last_accessed', { ascending: false })
      .limit(limit);

    if (query) {
      queryBuilder = queryBuilder.or(`key.ilike.%${query}%,value.ilike.%${query}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error retrieving memories:', error);
      return [];
    }

    // Update access count for retrieved memories
    if (data?.length) {
      for (const memory of data) {
        await supabase
          .from('ai_memories')
          .update({
            access_count: (memory.access_count || 0) + 1,
            last_accessed: new Date().toISOString(),
          })
          .eq('id', memory.id);
      }
    }

    return data || [];
  } catch (error) {
    console.error('Error retrieving memories:', error);
    return [];
  }
}

/**
 * Build memory context for system prompt injection
 */
export async function buildMemoryContext(userId: string): Promise<string> {
  const memories = await retrieveMemories(userId);
  if (!memories.length) return '';

  const grouped = memories.reduce(
    (acc, m) => {
      const cat = m.category || 'fact';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(m.value);
      return acc;
    },
    {} as Record<string, string[]>
  );

  let context = '\n\n--- MEMÓRIA DO SISTEMA ---\n';

  if (grouped.protocol?.length) {
    context += '\nProtocolos da Clínica:\n' + grouped.protocol.map((p) => `- ${p}`).join('\n');
  }
  if (grouped.preference?.length) {
    context += '\nPreferências do Veterinário:\n' + grouped.preference.map((p) => `- ${p}`).join('\n');
  }
  if (grouped.drug_preference?.length) {
    context += '\nPreferências Farmacológicas:\n' + grouped.drug_preference.map((p) => `- ${p}`).join('\n');
  }
  if (grouped.patient_history?.length) {
    context += '\nHistórico de Pacientes:\n' + grouped.patient_history.map((p) => `- ${p}`).join('\n');
  }
  if (grouped.fact?.length) {
    context += '\nFatos Relevantes:\n' + grouped.fact.map((p) => `- ${p}`).join('\n');
  }

  context += '\n--- FIM DA MEMÓRIA ---\n';
  return context;
}

/**
 * Apply relevance decay to memories
 * Should be called periodically (e.g., daily cron job)
 */
export async function applyRelevanceDecay(): Promise<void> {
  try {
    const supabase = await createClient();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Reduce relevance of old, unused memories
    const { data: oldMemories } = await supabase
      .from('ai_memories')
      .select('id, relevance_score')
      .lt('last_accessed', thirtyDaysAgo.toISOString())
      .gt('relevance_score', 0.1);

    if (oldMemories?.length) {
      for (const memory of oldMemories) {
        await supabase
          .from('ai_memories')
          .update({ relevance_score: Math.max(memory.relevance_score * 0.9, 0.1) })
          .eq('id', memory.id);
      }
    }
  } catch (error) {
    console.error('Error applying relevance decay:', error);
  }
}

export default {
  extractMemories,
  storeMemories,
  retrieveMemories,
  buildMemoryContext,
  applyRelevanceDecay,
};
