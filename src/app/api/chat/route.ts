import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callClaude } from '@/lib/ai/anthropic';
import { callOpenAI } from '@/lib/ai/openai';
import { buildSystemPrompt } from '@/lib/ai/system-prompt';
import { searchDocuments, buildRAGContext } from '@/lib/ai/rag';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messages, model, case_id, use_rag, stream } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Build system prompt with optional RAG context
    let ragContext = '';
    if (use_rag) {
      const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop();
      if (lastUserMessage) {
        try {
          const chunks = await searchDocuments(lastUserMessage.content);
          ragContext = buildRAGContext(chunks);
        } catch (ragError) {
          console.error('RAG search error:', ragError);
        }
      }
    }

    const systemPrompt = buildSystemPrompt(ragContext);
    let modelUsed = model || 'claude-sonnet-4-20250514';
    const isOpenAI = modelUsed?.startsWith('gpt');

    // Auto-create case if none provided
    let effectiveCaseId = case_id;
    if (!effectiveCaseId) {
      try {
        const lastMsg = messages[messages.length - 1];
        const title = lastMsg.content.substring(0, 80) || 'Chat Rápido';
        const { data: newCase } = await supabase
          .from('cases')
          .insert({ user_id: user.id, title, status: 'active' })
          .select('id')
          .single();
        if (newCase) effectiveCaseId = newCase.id;
      } catch (e) {
        console.error('Error creating case:', e);
      }
    }

    // Streaming for Claude
    if (stream && !isOpenAI) {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          let fullContent = '';
          try {
            const stream = await anthropic.messages.create({
              model: modelUsed,
              max_tokens: 4096,
              system: systemPrompt,
              stream: true,
              messages: messages as Anthropic.Messages.MessageParam[],
            });

            for await (const event of stream) {
              if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                const chunk = event.delta.text;
                fullContent += chunk;
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
                );
              }
            }

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ model: modelUsed })}\n\n`)
            );
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));

            // Save to database
            if (effectiveCaseId) {
              const lastUserMsg = messages[messages.length - 1];
              await supabase.from('messages').insert([
                {
                  case_id: effectiveCaseId,
                  user_id: user.id,
                  role: 'user',
                  content: lastUserMsg.content,
                },
                {
                  case_id: effectiveCaseId,
                  user_id: user.id,
                  role: 'assistant',
                  content: fullContent,
                  model_used: modelUsed,
                },
              ]);
              await supabase.from('audit_log').insert({
                user_id: user.id,
                case_id: effectiveCaseId,
                category: 'chat',
                query_summary: lastUserMsg.content.substring(0, 200),
                model_used: modelUsed,
              });
            }
          } catch (err) {
            console.error('Streaming error:', err);
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ error: 'Erro no streaming' })}\n\n`)
            );
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // Non-streaming fallback
    let content: string;
    try {
      if (isOpenAI) {
        content = await callOpenAI(messages, systemPrompt, modelUsed);
      } else {
        content = await callClaude(messages, systemPrompt, modelUsed);
      }
    } catch (aiError) {
      console.error('AI call error:', aiError);
      throw new Error('Erro ao chamar o serviço de IA');
    }

    // Save to database
    if (effectiveCaseId) {
      try {
        const lastUserMsg = messages[messages.length - 1];
        await supabase.from('messages').insert([
          {
            case_id: effectiveCaseId,
            user_id: user.id,
            role: 'user',
            content: lastUserMsg.content,
          },
          {
            case_id: effectiveCaseId,
            user_id: user.id,
            role: 'assistant',
            content,
            model_used: modelUsed,
          },
        ]);
        await supabase.from('audit_log').insert({
          user_id: user.id,
          case_id: effectiveCaseId,
          category: 'chat',
          query_summary: lastUserMsg.content.substring(0, 200),
          model_used: modelUsed,
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
      }
    }

    return new Response(
      JSON.stringify({ content, model: modelUsed, case_id: effectiveCaseId }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
