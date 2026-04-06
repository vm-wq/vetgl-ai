'use client';

import { useState } from 'react';
import { Save, Copy, Send, FileText } from 'lucide-react';

export interface SOAPData {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface SOAPEditorProps {
  onSave?: (data: SOAPData) => void;
  onSendToChat?: (data: SOAPData) => void;
  initialData?: SOAPData;
}

export default function SOAPEditor({
  onSave,
  onSendToChat,
  initialData,
}: SOAPEditorProps) {
  const [soap, setSOAP] = useState<SOAPData>(
    initialData || {
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
    }
  );

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (
    field: keyof SOAPData,
    value: string
  ) => {
    setSOAP((prev) => ({
      ...prev,
      [field]: value,
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    onSave?.(soap);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCopy = async () => {
    const text = formatForClipboard();
    try {
      await navigator.clipboard.writeText(text);
      alert('Copiado para a área de transferência!');
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleSendToChat = () => {
    onSendToChat?.(soap);
  };

  const formatForClipboard = () => {
    return `SOAP NOTE
=====================================

SUBJECTIVE (S)
${soap.subjective || '(não preenchido)'}

OBJECTIVE (O)
${soap.objective || '(não preenchido)'}

ASSESSMENT (A)
${soap.assessment || '(não preenchido)'}

PLAN (P)
${soap.plan || '(não preenchido)'}

=====================================`;
  };

  const isFilled =
    soap.subjective ||
    soap.objective ||
    soap.assessment ||
    soap.plan;

  return (
    <div className="w-full space-y-6 rounded-lg border border-slate-700 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-teal-500">
            Editor SOAP
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Subjective • Objective • Assessment • Plan
          </p>
        </div>
        {isSaved && (
          <div className="text-sm text-green-400">Salvo!</div>
        )}
      </div>

      {/* Subjective */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-teal-400" />
          <label className="font-semibold text-gray-200">
            S - Subjetivo
          </label>
        </div>
        <textarea
          value={soap.subjective}
          onChange={(e) => handleChange('subjective', e.target.value)}
          placeholder="Queixa principal, histórico da doença atual, duração dos sintomas..."
          rows={4}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
        />
      </div>

      {/* Objective */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-blue-400" />
          <label className="font-semibold text-gray-200">
            O - Objetivo
          </label>
        </div>
        <textarea
          value={soap.objective}
          onChange={(e) => handleChange('objective', e.target.value)}
          placeholder="Sinais vitais, exame físico, resultados de laboratório/diagnóstico..."
          rows={4}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
        />
      </div>

      {/* Assessment */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-orange-400" />
          <label className="font-semibold text-gray-200">
            A - Avaliação
          </label>
        </div>
        <textarea
          value={soap.assessment}
          onChange={(e) => handleChange('assessment', e.target.value)}
          placeholder="Lista de problemas, diagnósticos diferenciais, classificação de urgência..."
          rows={4}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
        />
      </div>

      {/* Plan */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-green-400" />
          <label className="font-semibold text-gray-200">
            P - Plano
          </label>
        </div>
        <textarea
          value={soap.plan}
          onChange={(e) => handleChange('plan', e.target.value)}
          placeholder="Diagnóstico, tratamento, medicamentos, acompanhamento..."
          rows={4}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
        />
      </div>

      {/* Info */}
      <div className="rounded-lg bg-slate-800 p-3 text-sm text-gray-400">
        <p>Preencha cada seção do SOAP. Você pode editar e salvar a qualquer momento.</p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 border-t border-slate-700 pt-4">
        <button
          onClick={handleSave}
          disabled={!isFilled}
          className="flex items-center gap-2 rounded-lg bg-green-700 px-4 py-2 text-white disabled:opacity-50 hover:bg-green-600"
        >
          <Save size={18} /> Salvar
        </button>

        <button
          onClick={handleCopy}
          disabled={!isFilled}
          className="flex items-center gap-2 rounded-lg bg-purple-700 px-4 py-2 text-white disabled:opacity-50 hover:bg-purple-600"
        >
          <Copy size={18} /> Copiar
        </button>

        <button
          onClick={handleSendToChat}
          disabled={!isFilled}
          className="flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-white disabled:opacity-50 hover:bg-teal-600"
        >
          <Send size={18} /> Enviar para Chat
        </button>
      </div>

      {/* Character count */}
      <div className="text-right text-xs text-gray-500">
        {Object.values(soap).join('').length} caracteres
      </div>
    </div>
  );
}
