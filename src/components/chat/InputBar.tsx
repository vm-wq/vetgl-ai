'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Camera, Mic, X, Square } from 'lucide-react';

interface InputBarProps {
  onSendMessage: (content: string, attachments?: { type: string; url: string; name: string }[]) => void;
  isLoading: boolean;
  onStop?: () => void;
}

export function InputBar({ onSendMessage, isLoading, onStop }: InputBarProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<{ type: string; url: string; name: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
    }
  }, [content]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!content.trim() || isLoading) return;
    onSendMessage(content, attachments);
    setContent('');
    setAttachments([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target?.result as string;
          setAttachments(prev => [...prev, {
            type: file.type,
            url,
            name: file.name,
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setAttachments(prev => [...prev, {
          type: 'image/jpeg',
          url,
          name: `camera-${Date.now()}.jpg`,
        }]);
      };
      reader.readAsDataURL(file);
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  const handleMicToggle = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          audioChunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setAttachments(prev => [...prev, {
            type: 'audio/webm',
            url,
            name: `audio-${Date.now()}.webm`,
          }]);
          stream.getTracks().forEach(track => track.stop());
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      } catch (error) {
        console.error('Erro ao acessar microfone:', error);
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="border-t border-[var(--border-primary)] bg-[var(--bg-primary)] p-4">
      {/* Attachment preview */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((att, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-lg px-3 py-2 text-xs text-[var(--text-secondary)]"
            >
              <span className="truncate">{att.name}</span>
              <button
                onClick={() => removeAttachment(idx)}
                className="hover:text-[var(--accent)] transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex gap-3 items-flex-end">
        {/* Text input */}
        <div className="flex-1 flex items-center gap-2 bg-[var(--bg-input)] rounded-2xl px-4 py-2 border border-[var(--border-primary)] focus-within:border-[var(--accent)]">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Descreva o caso, sintomas ou pergunte sobre protocolos..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)] outline-none resize-none max-h-32 text-sm"
            rows={1}
          />
          <div className="flex gap-2 text-[var(--text-secondary)]">
            {/* File upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="hover:text-[var(--accent)] transition-colors disabled:opacity-50 p-1"
              title="Anexar arquivo"
            >
              <Paperclip size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />

            {/* Camera */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isLoading}
              className="hover:text-[var(--accent)] transition-colors disabled:opacity-50 p-1"
              title="Capturar foto"
            >
              <Camera size={18} />
            </button>
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              className="hidden"
            />

            {/* Microphone */}
            <button
              onClick={handleMicToggle}
              disabled={isLoading}
              className={`transition-colors p-1 ${
                isRecording
                  ? 'text-red-500 animate-pulse'
                  : 'hover:text-[var(--accent)] disabled:opacity-50'
              }`}
              title={isRecording ? 'Parar gravação' : 'Gravar áudio'}
            >
              <Mic size={18} />
            </button>
          </div>
        </div>

        {/* Send or Stop button */}
        {isLoading ? (
          <button
            onClick={onStop}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 transition-colors text-white"
            title="Parar geração"
          >
            <Square size={18} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!content.trim()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-[var(--bg-tertiary)] disabled:text-[var(--text-tertiary)] transition-colors text-[var(--text-bubble-user)]"
            title="Enviar mensagem (Enter)"
          >
            <Send size={18} />
          </button>
        )}
      </div>

      {/* Helper text */}
      <p className="text-xs text-[var(--text-tertiary)] mt-2">
        Pressione <kbd className="bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded text-[var(--text-secondary)] font-mono">Enter</kbd> para enviar,{' '}
        <kbd className="bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded text-[var(--text-secondary)] font-mono">Shift + Enter</kbd> para quebra de linha
      </p>
    </div>
  );
}
