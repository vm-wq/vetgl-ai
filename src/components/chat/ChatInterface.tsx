'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { MessageBubble } from './MessageBubble';
import { InputBar } from './InputBar';
import { TypingIndicator } from './TypingIndicator';
import { createClient } from '@/lib/supabase/client';
import {
  AlertCircle,
  Stethoscope,
  Zap,
  Activity,
  ClipboardList,
  Plus,
  ChevronRight,
  Trash2,
  Edit2,
  Calendar,
} from 'lucide-react';

interface ChatInterfaceProps {
  caseId?: string;
  initialMessages?: any[];
}

interface CaseItem {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

const QUICK_ACTIONS = [
  {
    icon: AlertCircle,
    label: 'Protocolo de Emergência',
    query: 'Como procedo com um paciente em estado de emergência?',
  },
  {
    icon: Activity,
    label: 'Calcular Dose',
    query: 'Preciso calcular a dose correta de um medicamento. Como faço?',
  },
  {
    icon: ClipboardList,
    label: 'Triagem ABCDE',
    query: 'Explique o protocolo de triagem ABCDE para pacientes críticos',
  },
  {
    icon: Stethoscope,
    label: 'SOAP Note',
    query: 'Como estruturar uma nota clínica SOAP (Subjetivo, Objetivo, Avaliação, Plano)?',
  },
  {
    icon: Zap,
    label: 'Diagnóstico',
    query: 'Ajude-me a pensar através do diagnóstico diferencial para este caso.',
  },
  {
    icon: Activity,
    label: 'Medicação',
    query: 'Quais são as opções de medicação apropriadas para este caso?',
  },
  {
    icon: ClipboardList,
    label: 'Estimativa',
    query: 'Como fazer uma estimativa de custos para o tratamento?',
  },
  {
    icon: Stethoscope,
    label: 'Protocolo de Cuidados',
    query: 'Qual é o protocolo recomendado para cuidados pós-operatórios?',
  },
];

export function ChatInterface({ caseId: initialCaseId, initialMessages }: ChatInterfaceProps) {
  const {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    clearMessages,
    stopGeneration,
    loadMessages,
    loadCaseMessages,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [currentCaseId, setCurrentCaseId] = useState<string | undefined>(initialCaseId);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loadingCases, setLoadingCases] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load cases list
  const loadCases = async () => {
    try {
      setLoadingCases(true);
      const supabase = await createClient();
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select(`
          id,
          title,
          created_at,
          updated_at,
          messages(count)
        `)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (casesError) throw casesError;

      const formattedCases: CaseItem[] = (casesData || []).map((c: any) => ({
        id: c.id,
        title: c.title || 'Sem título',
        created_at: c.created_at,
        updated_at: c.updated_at,
        message_count: c.messages?.[0]?.count || 0,
      }));

      setCases(formattedCases);
    } catch (err) {
      console.error('Error loading cases:', err);
    } finally {
      setLoadingCases(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadCases();
  }, []);

  // Load messages when case changes
  useEffect(() => {
    if (currentCaseId) {
      loadCaseMessages(currentCaseId);
    }
  }, [currentCaseId, loadCaseMessages]);

  // Load initial messages if provided
  useEffect(() => {
    if (initialMessages && !currentCaseId) {
      loadMessages(initialMessages);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isStreaming]);

  const handleNewConversation = () => {
    clearMessages();
    setCurrentCaseId(undefined);
    loadCases();
  };

  const handleSelectCase = (caseId: string) => {
    setCurrentCaseId(caseId);
  };

  const handleSendMessage = (
    content: string,
    attachments?: { type: string; url: string; name: string }[]
  ) => {
    setLocalError(null);
    sendMessage(content, 'claude-sonnet-4-20250514', currentCaseId, true, attachments);
  };

  const handleQuickAction = (query: string) => {
    setLocalError(null);
    sendMessage(query, 'claude-sonnet-4-20250514', currentCaseId, true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;

    return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex h-full w-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Conversation Sidebar */}
      <aside
        className={`w-80 bg-[var(--bg-sidebar)] border-r border-[var(--border-primary)] flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 lg:static lg:translate-x-0`}
      >
        {/* Header with New Conversation button */}
        <div className="p-4 border-b border-[var(--border-primary)]">
          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-bubble-user)] font-medium transition-colors"
          >
            <Plus size={18} />
            Nova Conversa
          </button>
        </div>

        {/* Cases List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-3 space-y-2">
            {cases.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-[var(--text-secondary)]">Nenhuma conversa ainda</p>
              </div>
            ) : (
              cases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  onClick={() => handleSelectCase(caseItem.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all group ${
                    currentCaseId === caseItem.id
                      ? 'bg-[var(--accent-light)] text-[var(--accent)]'
                      : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{caseItem.title}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-[var(--text-secondary)]">
                        <Calendar size={12} />
                        <span>{formatDate(caseItem.updated_at)}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-xs bg-[var(--bg-primary)] px-2 py-1 rounded font-medium">
                      {caseItem.message_count}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Close Button (Mobile) */}
        <div className="border-t border-[var(--border-primary)] p-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-full text-center py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Fechar
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6">
              {/* Logo/Header */}
              <div className="mb-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Stethoscope className="text-[var(--accent)]" size={32} />
                  <h1 className="text-4xl font-bold text-[var(--text-primary)]">VETGL.AI</h1>
                </div>
                <p className="text-[var(--text-secondary)] text-lg">
                  Seu assistente clínico inteligente para veterinária
                </p>
                <p className="text-[var(--text-tertiary)] text-sm mt-2">
                  Baseado em protocolos clínicos e literatura científica
                </p>
              </div>

              {/* Quick Actions */}
              <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QUICK_ACTIONS.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuickAction(action.query)}
                      disabled={isLoading}
                      className="flex items-start gap-3 p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] hover:border-[var(--accent)] hover:bg-[var(--bg-tertiary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
                    >
                      <Icon className="text-[var(--accent)] flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-medium text-[var(--text-primary)] text-sm">
                          {action.label}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
                          {action.query}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isStreaming && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Error display */}
          {(error || localError) && (
            <div className="mx-4 my-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg flex gap-3">
              <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
              <div>
                <p className="text-red-800 dark:text-red-200 text-sm font-medium">Erro</p>
                <p className="text-red-700 dark:text-red-300 text-xs mt-1">
                  {error || localError}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <InputBar
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onStop={stopGeneration}
        />
      </div>

      {/* Mobile Sidebar Toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-24 right-4 z-30 lg:hidden p-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors"
          title="Abrir conversa anterior"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
