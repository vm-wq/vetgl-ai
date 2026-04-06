'use client';

import { useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  model_used?: string;
  attachments?: { type: string; url: string; name: string }[];
  created_at: string;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const loadCaseMessages = useCallback(async (caseId: string) => {
    try {
      const supabase = await createClient();
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      const msgs: ChatMessage[] = (data || []).map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        model_used: m.model_used,
        attachments: m.attachments || [],
        created_at: m.created_at,
      }));

      setMessages(msgs);
      return msgs;
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Erro ao carregar mensagens');
      return [];
    }
  }, []);

  const sendMessage = useCallback(async (
    content: string,
    model: string = 'claude-sonnet-4-20250514',
    caseId?: string,
    useRag: boolean = true,
    attachments?: { type: string; url: string; name: string }[]
  ) => {
    setError(null);

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      attachments,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setIsStreaming(true);

    // Add placeholder for assistant message
    const assistantId = crypto.randomUUID();
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      model_used: model,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      abortRef.current = new AbortController();

      const allMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages,
          model,
          case_id: caseId,
          use_rag: useRag,
          stream: true,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erro ao enviar mensagem');
      }

      const contentType = response.headers.get('content-type') || '';

      if (contentType.includes('text/event-stream') && response.body) {
        // Streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullContent += parsed.content;
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === assistantId
                        ? { ...m, content: fullContent }
                        : m
                    )
                  );
                }
                if (parsed.model) {
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === assistantId
                        ? { ...m, model_used: parsed.model }
                        : m
                    )
                  );
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }
      } else {
        // Non-streaming fallback
        const data = await response.json();
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantId
              ? { ...m, content: data.content, model_used: data.model }
              : m
          )
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Remove empty assistant message on abort
        setMessages(prev => prev.filter(m => m.id !== assistantId || m.content));
        return;
      }
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      // Remove empty assistant message on error
      setMessages(prev => prev.filter(m => m.id !== assistantId || m.content));
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
    setIsStreaming(false);
  }, []);

  const loadMessages = useCallback((msgs: ChatMessage[]) => {
    setMessages(msgs);
  }, []);

  return {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    clearMessages,
    stopGeneration,
    loadMessages,
    loadCaseMessages,
  };
}
