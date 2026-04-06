'use client';

import { useState, useMemo } from 'react';
import { Plus, Trash2, Printer, Download } from 'lucide-react';
import { ESTIMATE_SERVICES } from '@/lib/data/estimate-data';

interface EstimateItem {
  id: string;
  name: string;
  low: number;
  high: number;
  quantity: number;
}

export interface EstimateBuilderProps {
  species?: string;
  onComplete?: (items: EstimateItem[]) => void;
}

const CATEGORIES = [
  'diagnostics',
  'procedures',
  'surgery',
  'hospitalization',
  'medications',
  'endoflife',
];

const CATEGORY_NAMES: { [key: string]: string } = {
  diagnostics: 'Diagnósticos',
  procedures: 'Procedimentos',
  surgery: 'Cirurgia',
  hospitalization: 'Internação',
  medications: 'Medicamentos',
  endoflife: 'Fim de Vida',
};

export default function EstimateBuilder({
  species,
  onComplete,
}: EstimateBuilderProps) {
  const [items, setItems] = useState<EstimateItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('diagnostics');

  const categoryServices = useMemo(() => {
    return ESTIMATE_SERVICES[selectedCategory] || [];
  }, [selectedCategory]);

  const addItem = (service: any) => {
    const newItem: EstimateItem = {
      id: `${Date.now()}_${Math.random()}`,
      name: service.name,
      low: service.low,
      high: service.high,
      quantity: 1,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const calculateTotal = () => {
    return {
      low: items.reduce((sum, item) => sum + item.low * item.quantity, 0),
      high: items.reduce((sum, item) => sum + item.high * item.quantity, 0),
    };
  };

  const totals = calculateTotal();

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    let csv = 'Serviço,Categoria,Qtd,Preço Baixo,Preço Alto,Total Baixo,Total Alto\n';
    items.forEach((item) => {
      const category = CATEGORIES.find((cat) =>
        ESTIMATE_SERVICES[cat].some((s) => s.name === item.name)
      );
      csv += `"${item.name}","${category}",${item.quantity},$${item.low},$${item.high},$${item.low * item.quantity},$${item.high * item.quantity}\n`;
    });
    csv += `\n"TOTAL","",,,,${totals.low},${totals.high}\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'estimate.csv';
    a.click();
  };

  return (
    <div className="w-full space-y-6 rounded-lg border border-slate-700 bg-slate-900 p-6">
      <div>
        <h2 className="text-xl font-semibold text-teal-500">
          Construtor de Orçamento
        </h2>
        {species && (
          <p className="mt-1 text-sm text-gray-400">Espécie: {species}</p>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-700 pb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-teal-700 text-white'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            {CATEGORY_NAMES[cat]}
          </button>
        ))}
      </div>

      {/* Service list */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {categoryServices.map((service) => (
          <div
            key={service.name}
            className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-3"
          >
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-200">
                {service.name}
              </div>
              <div className="text-xs text-gray-400">
                ${service.low} - ${service.high}
              </div>
            </div>
            <button
              onClick={() => addItem(service)}
              className="rounded-lg bg-green-700 p-2 text-white hover:bg-green-600"
            >
              <Plus size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Selected items */}
      <div className="space-y-3 rounded-lg bg-slate-800 p-4">
        <h3 className="font-semibold text-gray-200">
          Itens Selecionados ({items.length})
        </h3>

        {items.length === 0 ? (
          <p className="text-sm text-gray-400">
            Nenhum item adicionado. Selecione um serviço acima.
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-700 p-3"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-200">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    ${item.low} - ${item.high} por unidade
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value) || 1)
                    }
                    min="1"
                    className="w-16 rounded border border-slate-600 bg-slate-600 px-2 py-1 text-center text-white text-sm"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-lg bg-red-700 p-2 text-white hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Totals */}
      {items.length > 0 && (
        <div className="rounded-lg bg-teal-900 bg-opacity-30 p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Valor Mínimo:</span>
              <span className="font-semibold text-teal-400">
                ${totals.low.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Valor Máximo:</span>
              <span className="font-semibold text-teal-400">
                ${totals.high.toFixed(2)}
              </span>
            </div>
            <div className="border-t border-teal-700 pt-2">
              <div className="flex justify-between text-base font-bold">
                <span className="text-gray-300">Estimado:</span>
                <span className="text-teal-400">
                  ${((totals.low + totals.high) / 2).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 border-t border-slate-700 pt-4">
        <button
          onClick={handlePrint}
          disabled={items.length === 0}
          className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-white disabled:opacity-50 hover:bg-blue-600"
        >
          <Printer size={18} /> Imprimir
        </button>

        <button
          onClick={handleExport}
          disabled={items.length === 0}
          className="flex items-center gap-2 rounded-lg bg-purple-700 px-4 py-2 text-white disabled:opacity-50 hover:bg-purple-600"
        >
          <Download size={18} /> Exportar CSV
        </button>
      </div>
    </div>
  );
}
