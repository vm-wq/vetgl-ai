'use client';

import ConsultationRecorder from '@/components/clinical/ConsultationRecorder';
import SOAPEditor, { SOAPData } from '@/components/clinical/SOAPEditor';
import { useState } from 'react';


export default function RecordingsPage() {
  const [showSOAPEditor, setShowSOAPEditor] = useState(false);
  const [currentSOAP, setCurrentSOAP] = useState<SOAPData | undefined>();

  const handleTranscriptionComplete = (transcript: string) => {
    console.log('Transcription completed:', transcript);
  };

  const handleGenerateSOAP = (transcript: string) => {
    // In a real app, you would parse the transcript and generate SOAP notes
    setCurrentSOAP({
      subjective: 'Baseado na transcrição da consulta',
      objective: 'Análise dos achados clínicos',
      assessment: 'Avaliação e diagnóstico diferencial',
      plan: 'Plano de tratamento recomendado',
    });
    setShowSOAPEditor(true);
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold text-teal-500">Gravador de Consultas</h1>
        <p className="mt-2 text-gray-400">
          Grave, transcreva e gere notas clínicas automaticamente
        </p>
      </div>

      <ConsultationRecorder
        onGenerateSOAP={handleGenerateSOAP}
        onTranscriptionComplete={handleTranscriptionComplete}
      />

      {showSOAPEditor && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-teal-500 mb-4">
            Editar Notas SOAP
          </h2>
          <SOAPEditor
            initialData={currentSOAP}
            onSave={(data) => {
              console.log('SOAP saved:', data);
              alert('Notas SOAP salvas!');
            }}
          />
        </div>
      )}
    </div>
  );
}
