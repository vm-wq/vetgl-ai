'use client';

import React, { useState } from 'react';
import { Clock, ChevronRight, Plus, AlertCircle } from 'lucide-react';

export interface TreatmentEntry {
  id: string;
  case_id: string;
  patient_name: string;
  species: string;
  chief_complaint: string;
  admitted_at: string;
  status: 'admitted' | 'treating' | 'discharged';
  treatments?: string[];
  vitals?: Record<string, any>;
}

interface TreatmentBoardProps {
  entries: TreatmentEntry[];
  onStatusChange?: (entryId: string, newStatus: 'admitted' | 'treating' | 'discharged') => Promise<void>;
  onAddTreatment?: (entryId: string) => void;
  onAddVitals?: (entryId: string) => void;
  onGenerateSOAP?: (entryId: string) => void;
  onViewDetails?: (entryId: string) => void;
  loading?: boolean;
}

function calculateTimeInHours(admittedAt: string): number {
  const admitted = new Date(admittedAt);
  const now = new Date();
  return Math.floor((now.getTime() - admitted.getTime()) / (1000 * 60 * 60));
}

function formatTimeInHours(hours: number): string {
  if (hours < 1) return '< 1h';
  if (hours === 1) return '1h';
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function TreatmentBoard({
  entries,
  onStatusChange,
  onAddTreatment,
  onAddVitals,
  onGenerateSOAP,
  onViewDetails,
  loading = false,
}: TreatmentBoardProps) {
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);

  const admittedEntries = entries.filter((e) => e.status === 'admitted');
  const treatingEntries = entries.filter((e) => e.status === 'treating');
  const dischargedEntries = entries.filter((e) => e.status === 'discharged');

  const CardContent = ({ entry }: { entry: TreatmentEntry }) => {
    const timeInHours = calculateTimeInHours(entry.admitted_at);

    return (
      <div
        className="bg-white rounded-lg border-l-4 border-l-blue-500 p-4 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setSelectedEntry(entry.id)}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-bold text-gray-900">{entry.patient_name}</h4>
            <p className="text-sm text-gray-600">
              {entry.species} • {entry.chief_complaint}
            </p>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
            {formatTimeInHours(timeInHours)}
          </span>
        </div>

        {/* Treatments */}
        {entry.treatments && entry.treatments.length > 0 && (
          <div className="mb-3 pb-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-600 mb-2">Tratamentos Aplicados:</p>
            <div className="space-y-1">
              {entry.treatments.slice(0, 2).map((treatment, idx) => (
                <p key={idx} className="text-xs text-gray-700 flex items-center gap-1">
                  <span className="text-green-600">✓</span>
                  {treatment}
                </p>
              ))}
              {entry.treatments.length > 2 && (
                <p className="text-xs text-gray-500 italic">
                  +{entry.treatments.length - 2} outro(s)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddVitals?.(entry.id);
            }}
            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded transition-colors"
          >
            + Vitais
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddTreatment?.(entry.id);
            }}
            className="text-xs bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1 rounded transition-colors"
          >
            + Tratamento
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGenerateSOAP?.(entry.id);
            }}
            className="text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 px-2 py-1 rounded transition-colors"
          >
            Gerar SOAP
          </button>
        </div>

        {/* Move Button */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          {entry.status === 'admitted' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange?.(entry.id, 'treating');
              }}
              className="w-full text-xs bg-orange-500 hover:bg-orange-600 text-white py-1 rounded flex items-center justify-center gap-1 transition-colors"
            >
              Mover para Em Tratamento
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
          {entry.status === 'treating' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange?.(entry.id, 'discharged');
              }}
              className="w-full text-xs bg-green-500 hover:bg-green-600 text-white py-1 rounded flex items-center justify-center gap-1 transition-colors"
            >
              Mover para Alta
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const Column = ({
    title,
    entries: columnEntries,
    color,
  }: {
    title: string;
    entries: TreatmentEntry[];
    color: string;
  }) => (
    <div className="flex-1 min-h-screen bg-gray-50 rounded-lg p-4 flex flex-col">
      <div className={`flex items-center gap-2 mb-4 pb-3 border-b-2 ${color}`}>
        <div className={`w-3 h-3 rounded-full ${color.replace('border', 'bg')}`}></div>
        <h3 className="font-bold text-gray-900">
          {title} ({columnEntries.length})
        </h3>
      </div>

      <div className="space-y-3 flex-1">
        {columnEntries.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Nenhum paciente</p>
          </div>
        ) : (
          columnEntries.map((entry) => <CardContent key={entry.id} entry={entry} />)
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Quadro de Internados</h2>
            <p className="text-blue-100 text-sm mt-1">
              Arraste pacientes entre colunas conforme sua evolução
            </p>
          </div>
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Paciente
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="p-4 grid grid-cols-3 gap-4">
        <Column title="Admitidos" entries={admittedEntries} color="border-red-500" />
        <Column title="Em Tratamento" entries={treatingEntries} color="border-yellow-500" />
        <Column title="Alta" entries={dischargedEntries} color="border-green-500" />
      </div>

      {/* Empty State */}
      {entries.length === 0 && (
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum paciente internado</h3>
          <p className="text-gray-500">Os pacientes internados aparecerão aqui</p>
        </div>
      )}
    </div>
  );
}

export default TreatmentBoard;
