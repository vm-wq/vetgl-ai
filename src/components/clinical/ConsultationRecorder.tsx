'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Pause, Play, Download, FileText, Send } from 'lucide-react';

export interface ConsultationRecorderProps {
  onTranscriptionComplete?: (transcript: string) => void;
  onGenerateSOAP?: (transcript: string) => void;
}

export default function ConsultationRecorder({
  onTranscriptionComplete,
  onGenerateSOAP,
}: ConsultationRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Erro ao acessar o microfone. Verifique as permissões.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  };

  const downloadRecording = () => {
    if (audioRef.current && audioRef.current.src) {
      const a = document.createElement('a');
      a.href = audioRef.current.src;
      a.download = `consultation_${Date.now()}.webm`;
      a.click();
    }
  };

  const transcribeAudio = async () => {
    if (!audioRef.current || !audioRef.current.src) {
      alert('Nenhuma gravação disponível');
      return;
    }

    setIsTranscribing(true);
    try {
      // Simulated transcription - in production, this would call your API
      const mockTranscript = `[Transcrição da consulta veterinária]

Veterinário: Bom dia, como posso ajudar você e seu pet hoje?

Proprietário: Meu cão não está bem, tem vômitos desde ontem.

Veterinário: Entendo. Há quanto tempo começou? Alguma outra mudança de comportamento?

Proprietário: Começou ontem à noite, e ele está mais fraco.

Veterinário: Vou fazer o exame físico agora. [Exame realizado]

Veterinário: Os sinais vitais estão dentro do normal. Recomendo alguns exames complementares.
`;

      setTranscript(mockTranscript);
      onTranscriptionComplete?.(mockTranscript);
      setShowTranscript(true);
    } catch (error) {
      console.error('Erro na transcrição:', error);
      alert('Erro ao transcrever');
    } finally {
      setIsTranscribing(false);
    }
  };

  const generateSOAP = () => {
    if (!transcript) {
      alert('Nenhuma transcrição disponível');
      return;
    }
    onGenerateSOAP?.(transcript);
  };

  return (
    <div className="w-full space-y-6 rounded-lg border border-slate-700 bg-slate-900 p-6">
      <div>
        <h2 className="text-xl font-semibold text-teal-500">
          Gravador de Consulta
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Grave, transcreva e gere notas SOAP automaticamente
        </p>
      </div>

      {/* Recording controls */}
      <div className="space-y-4 rounded-lg bg-slate-800 p-6">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            {isRecording && (
              <div className="h-3 w-3 animate-pulse rounded-full bg-red-500"></div>
            )}
            <span className="text-2xl font-bold text-teal-400 font-mono">
              {formatTime(recordingTime)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center gap-2 rounded-lg bg-red-700 px-6 py-3 text-white hover:bg-red-600"
            >
              <Mic size={20} /> Iniciar
            </button>
          ) : (
            <>
              {!isPaused ? (
                <button
                  onClick={pauseRecording}
                  className="flex items-center gap-2 rounded-lg bg-yellow-700 px-6 py-3 text-white hover:bg-yellow-600"
                >
                  <Pause size={20} /> Pausar
                </button>
              ) : (
                <button
                  onClick={resumeRecording}
                  className="flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-white hover:bg-blue-600"
                >
                  <Play size={20} /> Retomar
                </button>
              )}

              <button
                onClick={stopRecording}
                className="flex items-center gap-2 rounded-lg bg-slate-700 px-6 py-3 text-white hover:bg-slate-600"
              >
                <Square size={20} /> Parar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Playback */}
      {!isRecording && audioRef.current?.src && (
        <div className="space-y-3 rounded-lg bg-slate-800 p-4">
          <div className="text-sm font-semibold text-gray-200">
            Reproduzir Gravação
          </div>
          <audio ref={audioRef} controls className="w-full" />
          <button
            onClick={downloadRecording}
            className="flex items-center gap-2 rounded-lg bg-purple-700 px-4 py-2 text-white hover:bg-purple-600"
          >
            <Download size={18} /> Baixar Áudio
          </button>
        </div>
      )}

      {/* Transcription */}
      <div className="space-y-3 rounded-lg bg-slate-800 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-200">
            Transcrição
          </div>
          {isTranscribing && (
            <span className="text-xs text-teal-400">Transcrevendo...</span>
          )}
        </div>

        {!showTranscript ? (
          <button
            onClick={transcribeAudio}
            disabled={isRecording || !audioRef.current?.src || isTranscribing}
            className="w-full rounded-lg bg-blue-700 px-4 py-2 text-white disabled:opacity-50 hover:bg-blue-600"
          >
            Transcrever Áudio
          </button>
        ) : (
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            rows={6}
            className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-white focus:border-teal-500 focus:outline-none"
          />
        )}
      </div>

      {/* Action buttons */}
      {showTranscript && (
        <div className="flex flex-wrap gap-2 border-t border-slate-700 pt-4">
          <button
            onClick={generateSOAP}
            className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-600"
          >
            <FileText size={18} /> Gerar SOAP
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(transcript);
              alert('Transcrição copiada!');
            }}
            className="flex items-center gap-2 rounded-lg bg-purple-700 px-4 py-2 text-white hover:bg-purple-600"
          >
            <Send size={18} /> Copiar
          </button>
        </div>
      )}

      {/* Info */}
      <div className="rounded-lg bg-slate-800 p-3 text-xs text-gray-400">
        <p>
          Permissão de microfone necessária. A transcrição usa reconhecimento de
          voz.
        </p>
      </div>
    </div>
  );
}
