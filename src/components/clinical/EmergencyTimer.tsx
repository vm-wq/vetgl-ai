'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

export interface EmergencyTimerProps {
  onTimeChange?: (time: number) => void;
}

export default function EmergencyTimer({ onTimeChange }: EmergencyTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'general' | 'cpr' | 'seizure'>('general');
  const [cprCycles, setCprCycles] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Format time display
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Play beep sound (800Hz for 100ms)
  const playBeep = () => {
    try {
      const audioContext =
        audioContextRef.current ||
        new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.1);
    } catch (err) {
      console.log('Audio context error:', err);
    }
  };

  // Play alert sound (1000Hz x 3)
  const playAlert = () => {
    try {
      const audioContext =
        audioContextRef.current ||
        new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      for (let i = 0; i < 3; i++) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.value = 1000;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, audioContext.currentTime + i * 0.3);
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + i * 0.3 + 0.2
        );
        osc.start(audioContext.currentTime + i * 0.3);
        osc.stop(audioContext.currentTime + i * 0.3 + 0.2);
      }
    } catch (err) {
      console.log('Audio context error:', err);
    }
  };

  // Timer tick
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        const newSeconds = prev + 1;
        onTimeChange?.(newSeconds);

        // CPR mode: beep every 120 seconds (2 min cycles)
        if (mode === 'cpr' && newSeconds > 0 && newSeconds % 120 === 0) {
          playBeep();
          setCprCycles(Math.floor(newSeconds / 120));
        }

        // Seizure mode: alert at 5 minutes
        if (mode === 'seizure' && newSeconds === 300) {
          playAlert();
        }

        return newSeconds;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, onTimeChange]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    setCprCycles(0);
    setMode('general');
  };

  const handleStartCPR = () => {
    setSeconds(0);
    setCprCycles(0);
    setMode('cpr');
    setIsRunning(true);
  };

  const handleStartSeizure = () => {
    setSeconds(0);
    setCprCycles(0);
    setMode('seizure');
    setIsRunning(true);
  };

  // Color based on severity
  const getTimerColor = () => {
    if (mode === 'cpr') return 'text-red-500';
    if (mode === 'seizure' && seconds >= 300) return 'text-orange-500';
    return 'text-teal-500';
  };

  const getBackgroundColor = () => {
    if (mode === 'cpr') return 'bg-red-950';
    if (mode === 'seizure' && seconds >= 300) return 'bg-orange-950';
    return 'bg-slate-800';
  };

  return (
    <div className="w-full rounded-lg border border-slate-700 bg-slate-900 p-6">
      <h2 className="mb-4 text-xl font-semibold text-teal-500">
        Cronômetro de Emergência
      </h2>

      {/* Timer display */}
      <div
        className={`mb-6 rounded-lg p-8 text-center ${getBackgroundColor()} transition-colors`}
      >
        <div className={`text-6xl font-bold font-mono ${getTimerColor()}`}>
          {formatTime(seconds)}
        </div>

        {mode === 'cpr' && cprCycles > 0 && (
          <div className="mt-2 text-sm text-gray-300">
            Ciclos de RCP: {cprCycles}
          </div>
        )}

        {mode === 'seizure' && (
          <div className="mt-2 text-sm text-gray-300">
            {seconds < 300 ? 'Alerta em 5 minutos' : 'Alerta de 5+ minutos'}
          </div>
        )}
      </div>

      {/* Mode indicator */}
      {mode !== 'general' && (
        <div className="mb-4 rounded-lg bg-slate-800 p-3 text-center">
          <span className="text-sm font-semibold text-teal-400">
            Modo: {mode === 'cpr' ? 'RCP (2 min ciclos)' : 'Convulsão (alerta 5 min)'}
          </span>
        </div>
      )}

      {/* Control buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-white disabled:opacity-50"
        >
          <Play size={18} /> Iniciar
        </button>

        <button
          onClick={handlePause}
          disabled={!isRunning}
          className="flex items-center gap-2 rounded-lg bg-yellow-700 px-4 py-2 text-white disabled:opacity-50"
        >
          <Pause size={18} /> Pausa
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-600"
        >
          <RotateCcw size={18} /> Reiniciar
        </button>
      </div>

      {/* Preset buttons */}
      <div className="mb-4 flex flex-wrap gap-2 border-t border-slate-700 pt-4">
        <button
          onClick={handleStartCPR}
          className="rounded-lg bg-red-700 px-4 py-2 text-white hover:bg-red-600"
        >
          Iniciar RCP
        </button>

        <button
          onClick={handleStartSeizure}
          className="rounded-lg bg-orange-700 px-4 py-2 text-white hover:bg-orange-600"
        >
          Iniciar Convulsão
        </button>

        <button
          onClick={playBeep}
          className="flex items-center gap-2 rounded-lg bg-purple-700 px-4 py-2 text-white hover:bg-purple-600"
        >
          <Volume2 size={18} /> Teste Beep
        </button>
      </div>

      {/* Info text */}
      <div className="mt-4 text-xs text-gray-400">
        <p>RCP: Beep a cada 2 minutos | Convulsão: Alerta em 5 minutos</p>
      </div>
    </div>
  );
}
