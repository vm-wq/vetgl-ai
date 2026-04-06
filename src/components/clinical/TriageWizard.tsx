'use client';

import { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Send,
  Download,
  Printer,
  Zap,
} from 'lucide-react';

interface TriageStep {
  letter: string;
  name: string;
  description: string;
  questions: TriageQuestion[];
}

interface TriageQuestion {
  id: string;
  question: string;
  type: 'yes-no' | 'severity' | 'text' | 'number';
  weight: number; // 0-3
}

interface TriageResponse {
  [key: string]: string | number | boolean;
}

export interface TriageWizardProps {
  onConsultAI?: (triageData: TriageWizardData) => void;
  onExport?: (triageData: TriageWizardData) => void;
}

export interface TriageWizardData {
  timestamp: string;
  step: string;
  responses: TriageResponse;
  score: number;
  urgencyLevel: number;
  urgencyLabel: string;
  notes?: string;
}

const TRIAGE_STEPS: TriageStep[] = [
  {
    letter: 'A',
    name: 'Vias Aéreas',
    description: 'Avaliar patência e obstrução das vias aéreas',
    questions: [
      {
        id: 'a1',
        question: 'Vias aéreas estão patentes?',
        type: 'yes-no',
        weight: 3,
      },
      {
        id: 'a2',
        question: 'Há sinais de obstrução (estridor, sibilância)?',
        type: 'yes-no',
        weight: 3,
      },
      {
        id: 'a3',
        question: 'Há inchaço de vias aéreas ou língua?',
        type: 'yes-no',
        weight: 3,
      },
      {
        id: 'a4',
        question: 'Intubação será necessária?',
        type: 'yes-no',
        weight: 3,
      },
    ],
  },
  {
    letter: 'B',
    name: 'Respiração',
    description: 'Avaliar frequência, esforço e sons respiratórios',
    questions: [
      {
        id: 'b1',
        question: 'Frequência respiratória normal (Cão: 15-30; Gato: 20-40)?',
        type: 'yes-no',
        weight: 2,
      },
      {
        id: 'b2',
        question: 'Presença de dispneia (dificuldade respiratória)?',
        type: 'yes-no',
        weight: 3,
      },
      {
        id: 'b3',
        question: 'Ausculta pulmonar clara bilateral?',
        type: 'yes-no',
        weight: 2,
      },
      {
        id: 'b4',
        question: 'Cianose presente?',
        type: 'yes-no',
        weight: 3,
      },
      {
        id: 'b5',
        question: 'Oxigênio suplementar foi iniciado?',
        type: 'yes-no',
        weight: 1,
      },
    ],
  },
  {
    letter: 'C',
    name: 'Circulação',
    description: 'Avaliar frequência cardíaca, pulso e perfusão',
    questions: [
      {
        id: 'c1',
        question: 'Frequência cardíaca normal (Cão: 60-140; Gato: 140-220)?',
        type: 'yes-no',
        weight: 2,
      },
      {
        id: 'c2',
        question: 'Qualidade do pulso adequada (forte e regular)?',
        type: 'yes-no',
        weight: 2,
      },
      {
        id: 'c3',
        question: 'Tempo de enchimento capilar (TPC) < 2 segundos?',
        type: 'yes-no',
        weight: 2,
      },
      {
        id: 'c4',
        question: 'Mucosas rosadas?',
        type: 'yes-no',
        weight: 2,
      },
      {
        id: 'c5',
        question: 'Acesso IV foi estabelecido?',
        type: 'yes-no',
        weight: 1,
      },
      {
        id: 'c6',
        question: 'Reanimação com fluidos foi iniciada?',
        type: 'yes-no',
        weight: 1,
      },
    ],
  },
  {
    letter: 'D',
    name: 'Deficiência Neurológica',
    description: 'Avaliar consciência, pupilas e postura',
    questions: [
      {
        id: 'd1',
        question: 'Estado mental: Alerta, responsivo ou inconsciente?',
        type: 'severity',
        weight: 2,
      },
      {
        id: 'd2',
        question: 'Reflexos pupilares presentes bilateralmente?',
        type: 'yes-no',
        weight: 2,
      },
      {
        id: 'd3',
        question: 'Sinais de atividade convulsiva?',
        type: 'yes-no',
        weight: 3,
      },
      {
        id: 'd4',
        question: 'Inclinação de cabeça ou nistagmo?',
        type: 'yes-no',
        weight: 2,
      },
    ],
  },
  {
    letter: 'E',
    name: 'Exposição/Exame',
    description: 'Avaliar ferimentos, fraturas e abdômen',
    questions: [
      {
        id: 'e1',
        question: 'Exame físico completo foi realizado?',
        type: 'yes-no',
        weight: 1,
      },
      {
        id: 'e2',
        question: 'Feridas ou lacerações presentes?',
        type: 'yes-no',
        weight: 2,
      },
      {
        id: 'e3',
        question: 'Fraturas suspeitas?',
        type: 'yes-no',
        weight: 2,
      },
      {
        id: 'e4',
        question: 'Distensão abdominal?',
        type: 'yes-no',
        weight: 2,
      },
      {
        id: 'e5',
        question: 'Temperatura normal (38-39°C cão/38-39°C gato)?',
        type: 'yes-no',
        weight: 1,
      },
    ],
  },
];

const URGENCY_LEVELS = [
  {
    level: 1,
    label: 'Nível 1: Resgate',
    emoji: '🔴',
    color: '#991b1b',
    textColor: '#fca5a5',
    timeframe: 'Atender AGORA',
    description: 'Risco de vida iminente',
  },
  {
    level: 2,
    label: 'Nível 2: Emergência',
    emoji: '🟠',
    color: '#92400e',
    textColor: '#fed7aa',
    timeframe: '< 15 minutos',
    description: 'Muito grave, requer atenção imediata',
  },
  {
    level: 3,
    label: 'Nível 3: Urgente',
    emoji: '🟡',
    color: '#713f12',
    textColor: '#fde047',
    timeframe: '< 30 minutos',
    description: 'Grave, espera controlada possível',
  },
  {
    level: 4,
    label: 'Nível 4: Semi-urgente',
    emoji: '🟢',
    color: '#15803d',
    textColor: '#86efac',
    timeframe: '< 2 horas',
    description: 'Estável, pode aguardar',
  },
  {
    level: 5,
    label: 'Nível 5: Não urgente',
    emoji: '⚪',
    color: '#374151',
    textColor: '#d1d5db',
    timeframe: 'Agendar consulta',
    description: 'Estável, pode ser agendado',
  },
];

export default function TriageWizard({ onConsultAI, onExport }: TriageWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<TriageResponse>({});
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState(false);

  const currentSection = TRIAGE_STEPS[currentStep];
  const progress = ((currentStep + 1) / TRIAGE_STEPS.length) * 100;

  function handleResponse(questionId: string, value: string | number | boolean) {
    setResponses({
      ...responses,
      [questionId]: value,
    });
  }

  function calculateScore(): number {
    let score = 0;
    Object.entries(responses).forEach(([key, value]) => {
      const question = TRIAGE_STEPS.flatMap((s) => s.questions).find((q) => q.id === key);
      if (question) {
        if (key.startsWith('a') || key.startsWith('b') || key.startsWith('c') || key.startsWith('d') || key.startsWith('e')) {
          // Penalize for negative findings
          if (value === false || value === 'No') {
            score += question.weight;
          }
        }
      }
    });
    return score;
  }

  function getUrgencyLevel(score: number): number {
    if (score >= 14) return 1;
    if (score >= 10) return 2;
    if (score >= 6) return 3;
    if (score >= 3) return 4;
    return 5;
  }

  function handleComplete() {
    setCompleted(true);
  }

  function handleConsultAI() {
    const score = calculateScore();
    const urgencyLevel = getUrgencyLevel(score);
    const urgencyData = URGENCY_LEVELS[urgencyLevel - 1];

    const triageData: TriageWizardData = {
      timestamp: new Date().toISOString(),
      step: 'Complete',
      responses,
      score,
      urgencyLevel,
      urgencyLabel: urgencyData.label,
      notes,
    };

    onConsultAI?.(triageData);
  }

  function handleExport() {
    const score = calculateScore();
    const urgencyLevel = getUrgencyLevel(score);
    const urgencyData = URGENCY_LEVELS[urgencyLevel - 1];

    const triageData: TriageWizardData = {
      timestamp: new Date().toISOString(),
      step: 'Complete',
      responses,
      score,
      urgencyLevel,
      urgencyLabel: urgencyData.label,
      notes,
    };

    onExport?.(triageData);

    // Generate PDF/Print
    const printContent = `
AVALIAÇÃO ABCDE - TRIAGEM
Data/Hora: ${new Date().toLocaleString('pt-BR')}

${TRIAGE_STEPS.map((step) => `
${step.letter} - ${step.name}
${step.description}
${step.questions
  .map((q) => `  - ${q.question}: ${responses[q.id] === true ? 'Sim' : responses[q.id] === false ? 'Não' : responses[q.id] || 'N/R'}`)
  .join('\n')}
`).join('\n')}

NÍVEL DE URGÊNCIA: ${urgencyData.label}
Ação: ${urgencyData.timeframe}

Observações: ${notes}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(printContent));
    element.setAttribute('download', `triage_${new Date().getTime()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const score = calculateScore();
  const urgencyLevel = getUrgencyLevel(score);
  const urgencyData = URGENCY_LEVELS[urgencyLevel - 1];

  if (completed) {
    return (
      <div className="w-full rounded-lg border p-6 space-y-6"
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderColor: 'var(--border-primary)',
        }}>
        <div className="text-center">
          <div className="text-6xl mb-4">{urgencyData.emoji}</div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {urgencyData.label}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }} className="text-lg">
            {urgencyData.description}
          </p>
        </div>

        <div className="p-4 rounded-lg" style={{ backgroundColor: urgencyData.color + '30', borderLeft: `4px solid ${urgencyData.color}` }}>
          <p className="font-semibold" style={{ color: urgencyData.textColor }}>
            Ação Recomendada: {urgencyData.timeframe}
          </p>
          <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-2">
            Escore: {score} pontos | Nível: {urgencyLevel}/5
          </p>
        </div>

        {/* Resumo das respostas */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Resumo da Avaliação
          </h3>
          <div className="space-y-2 text-sm">
            {TRIAGE_STEPS.map((step) => (
              <div key={step.letter}>
                <p className="font-medium" style={{ color: 'var(--accent)' }}>
                  {step.letter} - {step.name}
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {step.questions
                    .filter((q) => responses[q.id] !== undefined)
                    .map((q) => `${responses[q.id] === true ? '✓' : '✗'} ${q.question}`)
                    .join(' | ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {notes && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <p className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Observações
            </p>
            <p style={{ color: 'var(--text-secondary)' }}>{notes}</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleConsultAI}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-opacity hover:opacity-90 font-medium"
            style={{ backgroundColor: 'var(--accent)' }}>
            <Zap size={18} /> Consultar IA
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-opacity hover:opacity-90 font-medium"
            style={{ backgroundColor: 'var(--accent)', opacity: 0.8 }}>
            <Download size={18} /> Exportar
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-opacity hover:opacity-90 font-medium"
            style={{ backgroundColor: 'var(--accent)', opacity: 0.8 }}>
            <Printer size={18} /> Imprimir
          </button>
          <button
            onClick={() => {
              setCurrentStep(0);
              setResponses({});
              setNotes('');
              setCompleted(false);
            }}
            className="flex items-center gap-2 rounded-lg px-4 py-2 transition-colors"
            style={{
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
            }}>
            <ChevronLeft size={18} /> Nova Avaliação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg border p-6 space-y-6"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
      }}>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--accent)' }}>
          Assistente de Triagem ABCDE
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Avaliação sistemática do paciente seguindo protocolo ABCDE
        </p>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>
            Etapa {currentStep + 1} de {TRIAGE_STEPS.length}: {currentSection.letter} - {currentSection.name}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-3 rounded-full" style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div
            className="h-3 rounded-full transition-all"
            style={{
              width: `${progress}%`,
              backgroundColor: 'var(--accent)',
            }}
          ></div>
        </div>
      </div>

      {/* Description */}
      <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)', borderLeft: '4px solid var(--accent)' }}>
        <p style={{ color: 'var(--text-primary)' }} className="font-medium">
          {currentSection.description}
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {currentSection.questions.map((question) => (
          <div key={question.id} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <label className="block font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
              {question.question}
            </label>

            {question.type === 'yes-no' && (
              <div className="flex gap-2">
                {[
                  { label: 'Sim', value: true },
                  { label: 'Não', value: false },
                  { label: 'N/R', value: undefined },
                ].map((option) => (
                  <button
                    key={String(option.value)}
                    onClick={() => handleResponse(question.id, option.value || '')}
                    className={`px-4 py-2 rounded transition-colors ${
                      responses[question.id] === option.value
                        ? 'text-white'
                        : ''
                    }`}
                    style={{
                      backgroundColor:
                        responses[question.id] === option.value
                          ? 'var(--accent)'
                          : 'var(--bg-secondary)',
                      color:
                        responses[question.id] === option.value
                          ? 'white'
                          : 'var(--text-primary)',
                      border: '1px solid var(--border-primary)',
                    }}>
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            {question.type === 'severity' && (
              <select
                value={String(responses[question.id] ?? '')}
                onChange={(e) => handleResponse(question.id, e.target.value)}
                className="w-full rounded border px-3 py-2"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)',
                }}>
                <option value="">Selecionar...</option>
                <option value="Alerta">Alerta</option>
                <option value="Responsivo">Responsivo ao estímulo</option>
                <option value="Inconsciente">Inconsciente</option>
              </select>
            )}
          </div>
        ))}
      </div>

      {/* Notes section (last step only) */}
      {currentStep === TRIAGE_STEPS.length - 1 && (
        <div className="space-y-2">
          <label style={{ color: 'var(--text-primary)' }} className="block font-medium">
            Observações Clínicas (Opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Adicione informações relevantes sobre o caso..."
            rows={4}
            className="w-full rounded-lg border p-3"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-2 rounded-lg px-4 py-2 transition-opacity hover:opacity-90 font-medium disabled:opacity-50"
          style={{
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
          }}>
          <ChevronLeft size={18} /> Anterior
        </button>

        {currentStep < TRIAGE_STEPS.length - 1 ? (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-white transition-opacity hover:opacity-90 font-medium"
            style={{ backgroundColor: 'var(--accent)' }}>
            Próxima <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-white transition-opacity hover:opacity-90 font-medium"
            style={{ backgroundColor: 'var(--accent)' }}>
            <CheckCircle2 size={18} /> Completar Avaliação
          </button>
        )}
      </div>
    </div>
  );
}
