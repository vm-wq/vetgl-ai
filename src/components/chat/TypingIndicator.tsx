'use client';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <div className="flex items-center gap-1 bg-[var(--bg-bubble-assistant)] rounded-2xl px-4 py-3">
        <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-[var(--accent)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        <span className="ml-2 text-sm text-[var(--text-bubble-assistant)]">Analisando
          <span className="blinking-cursor" />
        </span>
      </div>
    </div>
  );
}
