'use client';

import { useState, useMemo } from 'react';
import { Search, Download, Printer, Calculator } from 'lucide-react';
import {
  ALL_DRUGS,
  DRUG_CATEGORIES,
  getDrugsByCategory,
  FLUID_CALCULATORS,
  Drug,
} from '@/lib/data/drug-database';

export interface DrugCalculatorProps {
  onSelectDrug?: (drugName: string, dose: string) => void;
}

export default function DrugCalculator({ onSelectDrug }: DrugCalculatorProps) {
  const [weight, setWeight] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat'>('dog');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Emergência');
  const [activeTab, setActiveTab] = useState<'drugs' | 'calculators'>('drugs');
  const [criMode, setCriMode] = useState(false);
  const [criRate, setCriRate] = useState('');
  const [concentration, setConcentration] = useState('');
  const [fluidCalcParams, setFluidCalcParams] = useState<Record<string, number>>(
    {}
  );

  // Get drugs for current category
  const categoryDrugs = useMemo(
    () => getDrugsByCategory(selectedCategory),
    [selectedCategory]
  );

  // Filter drugs by search
  const filteredDrugs = useMemo(() => {
    return categoryDrugs.filter((drug) =>
      drug.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categoryDrugs, search]);

  const calculateDose = (drug: Drug) => {
    if (!weight) return null;

    const w = parseFloat(weight);
    const doseData = drug[species];

    if (!doseData) return null;

    const minDose = (doseData.min * w).toFixed(2);
    const maxDose = (doseData.max * w).toFixed(2);
    const displayDose =
      minDose === maxDose
        ? `${minDose} ${doseData.unit}`
        : `${minDose} - ${maxDose} ${doseData.unit}`;

    return {
      min: minDose,
      max: maxDose,
      unit: doseData.unit,
      route: doseData.route,
      frequency: doseData.frequency,
      displayDose,
    };
  };

  const calculateCRI = () => {
    if (!weight || !criRate || !concentration) return null;

    const w = parseFloat(weight);
    const rate = parseFloat(criRate); // mcg/kg/min
    const conc = parseFloat(concentration); // mg/mL

    const mgPerMinute = (w * rate) / 1000;
    const mLPerMinute = mgPerMinute / conc;
    const mLPerHour = Math.round(mLPerMinute * 60 * 100) / 100;

    return {
      mLPerHour,
      mLPerMinute: (Math.round(mLPerMinute * 1000) / 1000).toFixed(3),
      doseMgPerMin: (Math.round(mgPerMinute * 100) / 100).toFixed(2),
    };
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="rounded-full px-2 py-1 text-xs font-semibold text-red-100"
            style={{ backgroundColor: 'var(--priority-critical, #991b1b)' }}>
            Crítico
          </span>
        );
      case 'caution':
        return (
          <span className="rounded-full px-2 py-1 text-xs font-semibold text-orange-100"
            style={{ backgroundColor: 'var(--priority-caution, #92400e)' }}>
            Cuidado
          </span>
        );
      default:
        return (
          <span className="rounded-full px-2 py-1 text-xs font-semibold text-green-100"
            style={{ backgroundColor: 'var(--priority-normal, #15803d)' }}>
            Normal
          </span>
        );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    let csv =
      'Medicamento,Categoria,Indicação,Rota,Dose (Cão),Dose (Gato),Frequência,Prioridade\n';
    filteredDrugs.forEach((drug) => {
      const dogDose = drug.dog
        ? `${drug.dog.min}-${drug.dog.max} ${drug.dog.unit}`
        : 'N/A';
      const catDose = drug.cat
        ? `${drug.cat.min}-${drug.cat.max} ${drug.cat.unit}`
        : 'N/A';
      csv += `"${drug.name}","${drug.category}","${drug.indication}","${dogDose}","${catDose}","${drug.priority || 'normal'}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'drug-database.csv';
    a.click();
  };

  return (
    <div
      className="w-full rounded-lg border p-6 space-y-6"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-primary)',
      }}>
      <div>
        <h2
          className="text-xl font-semibold mb-2"
          style={{ color: 'var(--accent)' }}>
          Calculadora de Doses
        </h2>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm">
          Base de dados com 100+ medicamentos veterinários
        </p>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-primary)' }}>
            Peso (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0.0"
            className="w-full rounded-lg border px-4 py-2"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-primary)' }}>
            Espécie
          </label>
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value as 'dog' | 'cat')}
            className="w-full rounded-lg border px-4 py-2"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
            }}>
            <option value="dog">Cão</option>
            <option value="cat">Gato</option>
          </select>
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-primary)' }}>
            Buscar Medicamento
          </label>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3"
              style={{ color: 'var(--text-secondary)' }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full rounded-lg border pl-10 pr-4 py-2"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <button
          onClick={() => setActiveTab('drugs')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'drugs'
              ? 'border-b-2'
              : ''
          }`}
          style={{
            color: activeTab === 'drugs' ? 'var(--accent)' : 'var(--text-secondary)',
            borderColor: activeTab === 'drugs' ? 'var(--accent)' : 'transparent',
          }}>
          Medicamentos
        </button>
        <button
          onClick={() => setActiveTab('calculators')}
          className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'calculators'
              ? 'border-b-2'
              : ''
          }`}
          style={{
            color: activeTab === 'calculators' ? 'var(--accent)' : 'var(--text-secondary)',
            borderColor: activeTab === 'calculators' ? 'var(--accent)' : 'transparent',
          }}>
          <Calculator size={18} /> Calculadores
        </button>
      </div>

      {/* Drugs Tab */}
      {activeTab === 'drugs' && (
        <>
          {/* Category selector */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}>
              Categoria
            </label>
            <div className="flex flex-wrap gap-2">
              {DRUG_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearch('');
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category ? 'ring-2' : ''
                  }`}
                  style={{
                    backgroundColor:
                      selectedCategory === category
                        ? 'var(--accent)'
                        : 'var(--bg-primary)',
                    color:
                      selectedCategory === category
                        ? 'white'
                        : 'var(--text-secondary)',
                    borderColor:
                      selectedCategory === category ? 'var(--accent)' : 'var(--border-primary)',
                    border: '1px solid',
                  }}>
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* CRI Mode Toggle */}
          <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <input
              type="checkbox"
              id="cri-mode"
              checked={criMode}
              onChange={(e) => setCriMode(e.target.checked)}
              className="w-4 h-4"
            />
            <label
              htmlFor="cri-mode"
              className="text-sm font-medium cursor-pointer"
              style={{ color: 'var(--text-primary)' }}>
              Modo CRI (Infusão de Taxas Contínuas)
            </label>
          </div>

          {criMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-primary)' }}>
                  Taxa (mcg/kg/min)
                </label>
                <input
                  type="number"
                  value={criRate}
                  onChange={(e) => setCriRate(e.target.value)}
                  placeholder="ex: 5"
                  className="w-full rounded border px-3 py-2"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-primary)' }}>
                  Concentração (mg/mL)
                </label>
                <input
                  type="number"
                  value={concentration}
                  onChange={(e) => setConcentration(e.target.value)}
                  placeholder="ex: 1"
                  step="0.1"
                  className="w-full rounded border px-3 py-2"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-primary)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          )}

          {criMode && calculateCRI() && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)', borderLeft: '4px solid var(--accent)' }}>
              <h4 className="font-semibold mb-2" style={{ color: 'var(--accent)' }}>
                Resultado CRI:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Taxa em mL/hr</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
                    {calculateCRI()?.mLPerHour} mL/hr
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Taxa em mL/min</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
                    {calculateCRI()?.mLPerMinute} mL/min
                  </p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Dose mg/min</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
                    {calculateCRI()?.doseMgPerMin} mg/min
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--accent)' }}>
              <Printer size={18} /> Imprimir
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--accent)', opacity: 0.8 }}>
              <Download size={18} /> Exportar CSV
            </button>
          </div>

          {/* Drugs table */}
          {filteredDrugs.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border-primary)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <th
                      className="px-4 py-3 text-left text-sm font-semibold"
                      style={{ color: 'var(--text-primary)' }}>
                      Medicamento
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-semibold"
                      style={{ color: 'var(--text-primary)' }}>
                      Indicação
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-semibold"
                      style={{ color: 'var(--text-primary)' }}>
                      Rota
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-semibold"
                      style={{ color: 'var(--text-primary)' }}>
                      Dose
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-semibold"
                      style={{ color: 'var(--text-primary)' }}>
                      Frequência
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-semibold"
                      style={{ color: 'var(--text-primary)' }}>
                      Prioridade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrugs.map((drug) => {
                    const dose = calculateDose(drug);
                    return (
                      <tr
                        key={drug.name}
                        style={{
                          borderBottomColor: 'var(--border-primary)',
                          borderBottom: '1px solid var(--border-primary)',
                        }}
                        className="hover:opacity-80 transition-opacity">
                        <td
                          className="px-4 py-3 text-sm"
                          style={{ color: 'var(--text-primary)' }}>
                          {drug.name}
                        </td>
                        <td
                          className="px-4 py-3 text-sm"
                          style={{ color: 'var(--text-secondary)' }}>
                          {drug.indication}
                        </td>
                        <td
                          className="px-4 py-3 text-sm"
                          style={{ color: 'var(--text-secondary)' }}>
                          {dose?.route || 'N/A'}
                        </td>
                        <td
                          className="px-4 py-3 text-sm font-semibold"
                          style={{ color: 'var(--accent)' }}>
                          {dose ? dose.displayDose : 'Insira peso'}
                        </td>
                        <td
                          className="px-4 py-3 text-sm"
                          style={{ color: 'var(--text-secondary)' }}>
                          {dose?.frequency || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {getPriorityBadge(drug.priority)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className="p-4 rounded-lg text-center"
              style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-secondary)' }}>
              Nenhum medicamento encontrado
            </div>
          )}

          {/* Notes section */}
          {filteredDrugs.length > 0 && filteredDrugs.some((d) => d.notes || d.contraindications) && (
            <div className="p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--accent)' }}>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--accent)' }}>
                Observações e Contraindicações
              </h3>
              <div className="space-y-2 text-sm">
                {filteredDrugs
                  .filter((d) => d.notes || d.contraindications)
                  .map((drug) => (
                    <div key={drug.name}>
                      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {drug.name}:
                      </p>
                      {drug.notes && (
                        <p style={{ color: 'var(--text-secondary)' }}>
                          Nota: {drug.notes}
                        </p>
                      )}
                      {drug.contraindications && (
                        <p style={{ color: '#ef4444' }}>
                          Contraindicações: {drug.contraindications}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Calculators Tab */}
      {activeTab === 'calculators' && (
        <div className="space-y-4">
          {FLUID_CALCULATORS.map((calc) => {
            const result = calc.calculate(weight ? parseFloat(weight) : 0, fluidCalcParams);
            return (
              <div
                key={calc.name}
                className="p-4 rounded-lg border"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-primary)',
                }}>
                <h3
                  className="font-semibold mb-3"
                  style={{ color: 'var(--accent)' }}>
                  {calc.name}
                </h3>

                {calc.name === 'Correção Desidratação' && (
                  <div className="mb-3">
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--text-primary)' }}>
                      Percentual de Desidratação (%)
                    </label>
                    <input
                      type="number"
                      value={fluidCalcParams.dehydration || 5}
                      onChange={(e) =>
                        setFluidCalcParams({
                          ...fluidCalcParams,
                          dehydration: parseFloat(e.target.value) || 5,
                        })
                      }
                      min="1"
                      max="15"
                      className="w-full md:w-48 rounded border px-3 py-2"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                )}

                {calc.name === 'MER - Energia de Manutenção' && (
                  <div className="mb-3">
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: 'var(--text-primary)' }}>
                      Nível de Atividade
                    </label>
                    <select
                      value={fluidCalcParams.activity || 1.5}
                      onChange={(e) =>
                        setFluidCalcParams({
                          ...fluidCalcParams,
                          activity: parseFloat(e.target.value),
                        })
                      }
                      className="w-full md:w-48 rounded border px-3 py-2"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        borderColor: 'var(--border-primary)',
                        color: 'var(--text-primary)',
                      }}>
                      <option value="1">Acamado/Pós-cirurgia</option>
                      <option value="1.5">Sedentário</option>
                      <option value="2">Normal</option>
                      <option value="3">Muito Ativo</option>
                    </select>
                  </div>
                )}

                {calc.name === 'Toxicidade Chocolate' && (
                  <div className="mb-3 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: 'var(--text-primary)' }}>
                          Quantidade (g)
                        </label>
                        <input
                          type="number"
                          value={fluidCalcParams.grams || 100}
                          onChange={(e) =>
                            setFluidCalcParams({
                              ...fluidCalcParams,
                              grams: parseFloat(e.target.value) || 100,
                            })
                          }
                          className="w-full rounded border px-3 py-2"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-primary)',
                            color: 'var(--text-primary)',
                          }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-sm font-medium mb-2"
                          style={{ color: 'var(--text-primary)' }}>
                          Tipo de Chocolate
                        </label>
                        <select
                          value={fluidCalcParams.chocolateType || 1}
                          onChange={(e) =>
                            setFluidCalcParams({
                              ...fluidCalcParams,
                              chocolateType: parseFloat(e.target.value),
                            })
                          }
                          className="w-full rounded border px-3 py-2"
                          style={{
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-primary)',
                            color: 'var(--text-primary)',
                          }}>
                          <option value="1">Leite</option>
                          <option value="2">Escuro</option>
                          <option value="3">Baker (Puro)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {weight && (
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      borderLeft: '4px solid var(--accent)',
                    }}>
                    <p
                      className="text-lg font-bold"
                      style={{ color: 'var(--accent)' }}>
                      {result.value} {result.unit}
                    </p>
                    <p
                      className="text-xs mt-2"
                      style={{ color: 'var(--text-secondary)' }}>
                      {result.details}
                    </p>
                  </div>
                )}

                {!weight && (
                  <p
                    className="text-sm"
                    style={{ color: 'var(--text-secondary)' }}>
                    Insira o peso para calcular
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
