'use client';

import EstimateBuilder from '@/components/clinical/EstimateBuilder';


export default function EstimatesPage() {
  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold text-teal-500">Construtor de Orçamentos</h1>
        <p className="mt-2 text-gray-400">
          Crie e gerencie orçamentos de serviços veterinários para clientes
        </p>
      </div>

      <EstimateBuilder />
    </div>
  );
}
