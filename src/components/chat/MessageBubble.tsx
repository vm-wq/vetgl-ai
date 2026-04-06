'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, FileIcon, Image as ImageIcon } from 'lucide-react';
import type { ChatMessage } from '@/hooks/useChat';

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [isCopied, setIsCopied] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 px-4`}>
      <div className={`flex flex-col max-w-md ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Attachments display */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {message.attachments.map((attachment, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-[var(--bg-tertiary)] rounded-lg px-3 py-2 text-xs text-[var(--text-secondary)]"
              >
                {attachment.type.startsWith('image/') ? (
                  <ImageIcon size={14} />
                ) : (
                  <FileIcon size={14} />
                )}
                <span className="truncate">{attachment.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-[var(--bg-bubble-user)] text-[var(--text-bubble-user)] rounded-br-none'
              : 'bg-[var(--bg-bubble-assistant)] text-[var(--text-bubble-assistant)] rounded-bl-none'
          }`}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          ) : (
            <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                  li: ({ node, ...props }) => <li className="text-[var(--text-bubble-assistant)]" {...props} />,
                  code: ({ node, className, children, ...props }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-[var(--accent)] font-mono text-xs" {...props}>{children}</code>
                    ) : (
                      <code className="block bg-[var(--bg-tertiary)] px-3 py-2 rounded my-2 overflow-x-auto font-mono text-xs text-[var(--text-secondary)]" {...props}>{children}</code>
                    );
                  },
                  pre: ({ node, ...props }) => <pre className="block my-2" {...props} />,
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-[var(--accent)] pl-3 my-2 text-[var(--text-secondary)] italic" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-2">
                      <table className="border-collapse border border-[var(--border-primary)]" {...props} />
                    </div>
                  ),
                  thead: ({ node, ...props }) => <thead className="bg-[var(--bg-tertiary)]" {...props} />,
                  th: ({ node, ...props }) => <th className="border border-[var(--border-primary)] px-2 py-1 text-left" {...props} />,
                  td: ({ node, ...props }) => <td className="border border-[var(--border-primary)] px-2 py-1" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-semibold text-[var(--accent)]" {...props} />,
                  em: ({ node, ...props }) => <em className="italic text-[var(--text-secondary)]" {...props} />,
                  h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-3 mb-2 text-[var(--text-primary)]" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-2 mb-1 text-[var(--text-primary)]" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-base font-bold mt-2 mb-1 text-[var(--text-primary)]" {...props} />,
                  a: ({ node, ...props }) => <a className="text-[var(--accent)] underline hover:opacity-80" {...props} />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className={`flex items-center gap-2 mt-1 text-xs text-[var(--text-tertiary)] ${isUser ? 'flex-row-reverse' : ''}`}>
          <span>{formatTime(message.created_at)}</span>
          {message.model_used && (
            <span className="bg-[var(--bg-tertiary)] px-2 py-0.5 rounded text-[var(--accent)] font-mono">
              {message.model_used.replace('claude-', '').replace('gpt-', 'gpt-')}
            </span>
          )}
        </div>

        {/* Copy button (only for assistant messages) */}
        {!isUser && (
          <button
            onClick={handleCopy}
            className="mt-2 text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors p-1"
            title="Copiar mensagem"
          >
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
