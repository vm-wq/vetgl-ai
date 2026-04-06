'use client';

import { useState } from 'react';
import TriageABCDE, { TriageData } from '@/components/clinical/TriageABCDE';
import EmergencyTimer from '@/components/clinical/EmergencyTimer';
import DrugCalculator from '@/components/clinical/DrugCalculator';


export default function ProtocolsPage() {
  const [activeTab, setActiveTab] = useState<'triage' | 'timer' | 'drugs'>('triage');

  const handleTriageSendToChat = (data: TriageData) => {
    console.log('Triage data:', data);
    alert('Dados de triagem enviados para análise!');
  };

  const handleTriageComplete = (data: TriageData) => {
    console.log('Triage completed:', data);
    alert('Avaliação ABCDE salva!');
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold text-teal-500">Ferramentas Clínicas</h1>
        <p className="mt-2 text-gray-400">
          Acesse protocolos e ferramentas de emergência veterinária
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-4">
        <button
          onClick={() => setActiveTab('triage')}
          className={`rounded-lg px-4 py-2 font-medium transition-colors ${
            activeTab === 'triage'
              ? 'bg-teal-700 text-white'
              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
          }`}
        >
          Triagem ABCDE
        </button>
        <button
          onClick={() => setActiveTab('timer')}
          className={`rounded-lg px-4 py-2 font-medium transition-colors ${
            activeTab === 'timer'
              ? 'bg-teal-700 text-white'
              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
          }`}
        >
          Cronômetro
        </button>
        <button
          onClick={() => setActiveTab('drugs')}
          className={`rounded-lg px-4 py-2 font-medium transition-colors ${
            activeTab === 'drugs'
              ? 'bg-teal-700 text-white'
              : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
          }`}
        >
          Calculadora de Doses
        </button>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'triage' && (
          <TriageABCDE
            onSendToChat={handleTriageSendToChat}
            onComplete={handleTriageComplete}
          />
        )}

        {activeTab === 'timer' && (
          <EmergencyTimer />
        )}

        {activeTab === 'drugs' && (
          <DrugCalculator />
        )}
      </div>
    </div>
  );
}
