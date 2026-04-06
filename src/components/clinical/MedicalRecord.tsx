'use client';

import React, { useRef } from 'react';
import { Copy, Download, Printer } from 'lucide-react';
import { MedicalRecord } from '@/app/api/medical-record/route';

interface MedicalRecordProps {
  record: MedicalRecord;
  caseId?: string;
}

export function MedicalRecordComponent({ record, caseId }: MedicalRecordProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopyToClipboard = async () => {
    const element = contentRef.current;
    if (!element) return;

    try {
      await navigator.clipboard.writeText(element.innerText);
      alert('Prontuário copiado para a área de transferência');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const element = contentRef.current;
    if (!element) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Prontuário Médico Veterinário</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 20px; }
            .header { border-bottom: 2px solid #007bff; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; page-break-inside: avoid; }
            .section-title {
              background-color: #007bff;
              color: white;
              padding: 8px 12px;
              border-radius: 4px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .field { margin-bottom: 10px; }
            .field-label { font-weight: bold; color: #007bff; }
            .field-value { margin-top: 4px; padding-left: 12px; border-left: 3px solid #007bff; }
            ul, ol { margin: 8px 0; padding-left: 20px; }
            li { margin: 4px 0; }
            .confidence-high { color: #28a745; }
            .confidence-moderate { color: #ffc107; }
            .confidence-low { color: #dc3545; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const confidenceColor = {
    ALTO: 'text-green-600',
    MODERADO: 'text-yellow-600',
    BAIXO: 'text-red-600',
  }[record.nivel_confianca];

  return (
    <div className="medical-record bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with Actions */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Prontuário Médico Veterinário</h2>
          <p className="text-sm text-blue-700 mt-1">Gerado automaticamente pelo sistema VETGL.AI</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopyToClipboard}
            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            title="Copiar para área de transferência"
          >
            <Copy className="w-4 h-4" />
            <span className="text-sm">Copiar</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            title="Imprimir prontuário"
          >
            <Printer className="w-4 h-4" />
            <span className="text-sm">Imprimir</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            title="Exportar como PDF"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">PDF</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="p-6 space-y-6">
        {/* Identificação */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-blue-900 border-b-2 border-blue-300 pb-2">
            Identificação
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {record.identificacao.paciente && (
              <div>
                <p className="text-sm font-semibold text-gray-600">Paciente</p>
                <p className="text-base text-gray-900">{record.identificacao.paciente}</p>
              </div>
            )}
            {record.identificacao.especie && (
              <div>
                <p className="text-sm font-semibold text-gray-600">Espécie</p>
                <p className="text-base text-gray-900">{record.identificacao.especie}</p>
              </div>
            )}
            {record.identificacao.raca && (
              <div>
                <p className="text-sm font-semibold text-gray-600">Raça</p>
                <p className="text-base text-gray-900">{record.identificacao.raca}</p>
              </div>
            )}
            {record.identificacao.idade && (
              <div>
                <p className="text-sm font-semibold text-gray-600">Idade</p>
                <p className="text-base text-gray-900">{record.identificacao.idade}</p>
              </div>
            )}
            {record.identificacao.peso && (
              <div>
                <p className="text-sm font-semibold text-gray-600">Peso</p>
                <p className="text-base text-gray-900">{record.identificacao.peso}</p>
              </div>
            )}
            {record.identificacao.sexo && (
              <div>
                <p className="text-sm font-semibold text-gray-600">Sexo</p>
                <p className="text-base text-gray-900">{record.identificacao.sexo}</p>
              </div>
            )}
            {record.identificacao.tutor && (
              <div className="col-span-2">
                <p className="text-sm font-semibold text-gray-600">Tutor</p>
                <p className="text-base text-gray-900">{record.identificacao.tutor}</p>
              </div>
            )}
          </div>
        </section>

        {/* Anamnese */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-blue-900 border-b-2 border-blue-300 pb-2">
            Anamnese
          </h3>
          <p className="text-gray-800 whitespace-pre-line">{record.anamnese}</p>
        </section>

        {/* Exame Físico */}
        {record.exame_fisico && (
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-blue-900 border-b-2 border-blue-300 pb-2">
              Exame Físico
            </h3>
            <p className="text-gray-800 whitespace-pre-line">{record.exame_fisico}</p>
          </section>
        )}

        {/* Exames Complementares */}
        {record.exames_complementares && (
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-blue-900 border-b-2 border-blue-300 pb-2">
              Exames Complementares
            </h3>
            <p className="text-gray-800 whitespace-pre-line">{record.exames_complementares}</p>
          </section>
        )}

        {/* Diagnóstico */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-blue-900 border-b-2 border-blue-300 pb-2">
            Diagnóstico
          </h3>
          <div>
            <p className="text-sm font-semibold text-gray-600">Principal</p>
            <p className="text-base text-gray-900 mt-1">{record.diagnostico.principal}</p>
          </div>
          {record.diagnostico.diferenciais.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-600">Diagnósticos Diferenciais</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {record.diagnostico.diferenciais.map((diag, idx) => (
                  <li key={idx} className="text-gray-800">
                    {diag}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Tratamento */}
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-blue-900 border-b-2 border-blue-300 pb-2">
            Tratamento
          </h3>

          {record.tratamento.prescricao.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-600">Prescrição</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {record.tratamento.prescricao.map((med, idx) => (
                  <li key={idx} className="text-gray-800">
                    {med}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {record.tratamento.procedimentos.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-600">Procedimentos</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {record.tratamento.procedimentos.map((proc, idx) => (
                  <li key={idx} className="text-gray-800">
                    {proc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {record.tratamento.orientacoes.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-600">Orientações</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                {record.tratamento.orientacoes.map((orient, idx) => (
                  <li key={idx} className="text-gray-800">
                    {orient}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Evolução */}
        {record.evolucao && (
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-blue-900 border-b-2 border-blue-300 pb-2">
              Evolução
            </h3>
            <p className="text-gray-800 whitespace-pre-line">{record.evolucao}</p>
          </section>
        )}

        {/* Observações */}
        {record.observacoes && (
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-blue-900 border-b-2 border-blue-300 pb-2">
              Observações
            </h3>
            <p className="text-gray-800 whitespace-pre-line">{record.observacoes}</p>
          </section>
        )}

        {/* Resumo */}
        <section className="space-y-3 bg-blue-50 border-l-4 border-blue-300 p-4 rounded">
          <p className="text-sm font-semibold text-gray-600">Resumo do Caso</p>
          <p className="text-base text-gray-900">{record.resumo}</p>
        </section>

        {/* Confiança */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm">
            <span className="font-semibold text-gray-600">Nível de Confiança: </span>
            <span className={`font-bold ${confidenceColor}`}>{record.nivel_confianca}</span>
          </div>
          {caseId && (
            <p className="text-xs text-gray-500">ID do Caso: {caseId}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <p className="text-xs text-gray-600 text-center">
          Este prontuário foi gerado automaticamente pelo sistema VETGL.AI e deve ser revisado pelo veterinário responsável.
          Mantenha este documento como parte do registro clínico do paciente.
        </p>
      </div>
    </div>
  );
}

export default MedicalRecordComponent;
