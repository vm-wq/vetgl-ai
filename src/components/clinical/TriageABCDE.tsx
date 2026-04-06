'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';

interface TriageSection {
  label: string;
  items: string[];
}

const TRIAGE_SECTIONS: { [key: string]: TriageSection } = {
  a: {
    label: 'A - Vias Aéreas',
    items: [
      'Vias aéreas patentes',
      'Obstrução presente',
      'Intubação necessária',
      'Traqueostomia de emergência necessária',
    ],
  },
  b: {
    label: 'B - Respiração',
    items: [
      'FR normal (15-30 cão / 20-40 gato)',
      'Ausculta clara bilateral',
      'Dispneia presente',
      'Oxigênio suplementar iniciado',
      'Toracocentese necessária',
    ],
  },
  c: {
    label: 'C - Circulação',
    items: [
      'FC normal (60-140 cão / 140-220 gato)',
      'Qualidade de pulso adequada',
      'TPC < 2 segundos',
      'Mucosas rosa',
      'Acesso IV estabelecido',
      'Reanimação com fluidos iniciada',
    ],
  },
  d: {
    label: 'D - Incapacidade',
    items: [
      'Consciência: Alerta / Responsivo / Inconsciente',
      'Reflexo pupilar bilateral presente',
      'Atividade convulsiva',
      'Inclinação de cabeça/Nistagmo',
    ],
  },
  e: {
    label: 'E - Exposição',
    items: [
      'Exame completo realizado',
      'Feridas/Lacerações encontradas',
      'Fraturas suspeitas',
      'Temperatura medida',
      'Ultrassom FAST realizado',
    ],
  },
};

const TRIAGE_LEVELS = [
  {
    level: 'Resgate',
    color: 'bg-red-900 text-red-100',
    description: 'Risco de vida iminente',
  },
  {
    level: 'Urgente',
    color: 'bg-orange-900 text-orange-100',
    description: 'Muito grave, requer atención imediata',
  },
  {
    level: 'Semi-urgente',
    color: 'bg-yellow-900 text-yellow-100',
    description: 'Grave, espera controlada',
  },
  {
    level: 'Não urgente',
    color: 'bg-green-900 text-green-100',
    description: 'Estável, pode esperar',
  },
  {
    level: 'Agendado',
    color: 'bg-blue-900 text-blue-100',
    description: 'Procedimento eletivo',
  },
];

export interface TriageABCDEProps {
  onComplete?: (data: TriageData) => void;
  onSendToChat?: (data: TriageData) => void;
}

export interface TriageData {
  a: string[];
  b: string[];
  c: string[];
  d: string[];
  e: string[];
  urgency: string;
  temperature?: number;
  painScore?: number;
}

export default function TriageABCDE({
  onComplete,
  onSendToChat,
}: TriageABCDEProps) {
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [urgency, setUrgency] = useState('Semi-urgente');
  const [temperature, setTemperature] = useState('');
  const [painScore, setPainScore] = useState('');

  const toggleItem = (id: string) => {
    setChecked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getTriageData = (): TriageData => {
    const data: TriageData = {
      a: [],
      b: [],
      c: [],
      d: [],
      e: [],
      urgency,
    };

    if (temperature) data.temperature = parseFloat(temperature);
    if (painScore) data.painScore = parseInt(painScore);

    Object.entries(TRIAGE_SECTIONS).forEach(([section, content]) => {
      content.items.forEach((item, idx) => {
        const checkId = `${section}${idx + 1}`;
        if (checked[checkId]) {
          const key = section as keyof TriageData;
          const arr = data[key];
          if (Array.isArray(arr)) arr.push(item);
        }
      });
    });

    return data;
  };

  const handleSendToChat = () => {
    const data = getTriageData();
    onSendToChat?.(data);
  };

  const handleComplete = () => {
    const data = getTriageData();
    onComplete?.(data);
  };

  const countChecked = Object.values(checked).filter(Boolean).length;

  return (
    <div className="w-full space-y-6 rounded-lg border border-slate-700 bg-slate-900 p-6">
      <div>
        <h2 className="text-xl font-semibold text-teal-500">
          Avaliação ABCDE
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          {countChecked} itens marcados
        </p>
      </div>

      {/* Vitals section */}
      <div className="space-y-4 rounded-lg bg-slate-800 p-4">
        <h3 className="font-semibold text-gray-200">Sinais Vitais</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm text-gray-300">
              Temperatura (°C)
            </label>
            <input
              type="number"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              placeholder="38.5"
              step="0.1"
              className="mt-2 w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300">
              Escala de Dor (0-10)
            </label>
            <input
              type="number"
              value={painScore}
              onChange={(e) => setPainScore(e.target.value)}
              placeholder="5"
              min="0"
              max="10"
              className="mt-2 w-full rounded border border-slate-600 bg-slate-700 px-3 py-2 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ABCDE sections */}
      {Object.entries(TRIAGE_SECTIONS).map(([sectionKey, section]) => (
        <div
          key={sectionKey}
          className="space-y-3 rounded-lg bg-slate-800 p-4"
        >
          <h3 className="font-semibold text-teal-400">{section.label}</h3>
          <div className="space-y-2">
            {section.items.map((item, idx) => {
              const checkId = `${sectionKey}${idx + 1}`;
              return (
                <label
                  key={checkId}
                  className="flex items-start gap-3 rounded p-2 hover:bg-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={checked[checkId] || false}
                    onChange={() => toggleItem(checkId)}
                    className="mt-1 cursor-pointer accent-teal-500"
                  />
                  <span className="text-sm text-gray-300">{item}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Urgency selection */}
      <div className="space-y-3 rounded-lg bg-slate-800 p-4">
        <h3 className="font-semibold text-gray-200">Nível de Urgência</h3>
        <div className="space-y-2">
          {TRIAGE_LEVELS.map((level) => (
            <label
              key={level.level}
              className="flex items-center gap-3 rounded-lg border border-slate-600 p-3 hover:border-teal-500"
            >
              <input
                type="radio"
                name="urgency"
                value={level.level}
                checked={urgency === level.level}
                onChange={(e) => setUrgency(e.target.value)}
                className="accent-teal-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-200">{level.level}</div>
                <div className="text-xs text-gray-400">{level.description}</div>
              </div>
              <span className={`rounded px-2 py-1 text-xs font-semibold ${level.color}`}>
                {level.level}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Summary panel */}
      <div className="rounded-lg bg-teal-900 bg-opacity-30 p-4">
        <div className="flex items-start gap-2">
          <AlertCircle size={20} className="mt-1 text-teal-400" />
          <div>
            <h4 className="font-semibold text-teal-400">Resumo</h4>
            <p className="mt-2 text-sm text-gray-300">
              Nível selecionado: <strong>{urgency}</strong>
            </p>
            <p className="text-sm text-gray-300">
              Total de achados: <strong>{countChecked}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 border-t border-slate-700 pt-4">
        <button
          onClick={handleComplete}
          className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-600"
        >
          <CheckCircle2 size={18} /> Salvar
        </button>
        <button
          onClick={handleSendToChat}
          className="flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-white hover:bg-teal-600"
        >
          <Send size={18} /> Enviar para Chat
        </button>
      </div>
    </div>
  );
}
