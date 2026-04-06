'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Case } from '@/types';
import {
  Plus,
  Search,
  Archive,
  Trash2,
  MessageSquare,
  Filter,
  Grid,
  List as ListIcon,
} from 'lucide-react';

export default function CasesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed' | 'archived'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch cases
  useEffect(() => {
    fetchCases();
  }, [statusFilter]);

  async function fetchCases() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      let query = supabase
        .from('cases')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createNewCase() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('cases')
        .insert([
          {
            user_id: user.id,
            title: 'Novo Caso',
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        router.push(`/dashboard?case=${data.id}`);
      }
    } catch (error) {
      console.error('Error creating case:', error);
    }
  }

  async function deleteCase(id: string) {
    if (!confirm('Tem certeza que deseja deletar este caso?')) return;

    try {
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCases(cases.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Error deleting case:', error);
    }
  }

  async function updateCaseStatus(id: string, newStatus: Case['status']) {
    try {
      const { error } = await supabase
        .from('cases')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setCases(
        cases.map((c) =>
          c.id === id ? { ...c, status: newStatus } : c
        )
      );
    } catch (error) {
      console.error('Error updating case:', error);
    }
  }

  const filteredCases = cases.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.title.toLowerCase().includes(term) ||
      (c.patient_name && c.patient_name.toLowerCase().includes(term))
    );
  });

  const getStatusColor = (status: Case['status']) => {
    switch (status) {
      case 'active':
        return 'bg-teal-600/20 text-teal-400 border border-teal-500/30';
      case 'closed':
        return 'bg-blue-600/20 text-blue-400 border border-blue-500/30';
      case 'archived':
        return 'bg-slate-600/20 text-slate-400 border border-slate-500/30';
      default:
        return 'bg-slate-600/20 text-slate-400';
    }
  };

  const getStatusLabel = (status: Case['status']) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'closed':
        return 'Fechado';
      case 'archived':
        return 'Arquivado';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full p-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-teal-400 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Carregando casos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Casos</h1>
            <p className="text-slate-400">Gerencie todos os seus casos veterinários</p>
          </div>
          <button
            onClick={createNewCase}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Novo Caso
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Search */}
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por título ou paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Filter and View Buttons */}
          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as typeof statusFilter)
                }
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 hover:border-teal-500 focus:border-teal-500 focus:outline-none transition-colors"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="closed">Fechados</option>
                <option value="archived">Arquivados</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-teal-600/30 text-teal-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-teal-600/30 text-teal-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {filteredCases.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-slate-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-100 mb-2">
                Nenhum caso encontrado
              </h2>
              <p className="text-slate-400 mb-6">
                Crie seu primeiro caso para começar a gerenciar pacientes
              </p>
              <button
                onClick={createNewCase}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium"
              >
                Criar Primeiro Caso
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-teal-500/30 transition-colors cursor-pointer group"
              >
                <div
                  onClick={() => router.push(`/dashboard?case=${c.id}`)}
                  className="mb-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-100 group-hover:text-teal-400 transition-colors flex-1 truncate">
                      {c.title}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ml-2 ${getStatusColor(c.status)}`}>
                      {getStatusLabel(c.status)}
                    </span>
                  </div>

                  {c.patient_name && (
                    <p className="text-slate-400 text-sm mb-2">
                      <span className="font-medium">Paciente:</span> {c.patient_name}
                    </p>
                  )}

                  {c.species && (
                    <p className="text-slate-400 text-sm mb-3">
                      <span className="font-medium">Espécie:</span> {c.species}
                    </p>
                  )}

                  <p className="text-slate-500 text-xs">
                    {new Date(c.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (c.status !== 'archived') {
                        updateCaseStatus(c.id, 'archived');
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-sm transition-colors"
                    title="Arquivar"
                  >
                    <Archive className="w-4 h-4" />
                    <span className="hidden sm:inline">Arquivar</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      deleteCase(c.id);
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-sm transition-colors"
                    title="Deletar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                onClick={() => router.push(`/dashboard?case=${c.id}`)}
                className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-teal-500/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-slate-100 group-hover:text-teal-400 transition-colors truncate">
                      {c.title}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                      {c.patient_name && (
                        <p className="text-slate-400 text-sm truncate">
                          <span className="font-medium">Paciente:</span> {c.patient_name}
                        </p>
                      )}
                      {c.species && (
                        <p className="text-slate-400 text-sm truncate">
                          <span className="font-medium">Espécie:</span> {c.species}
                        </p>
                      )}
                      <p className="text-slate-500 text-xs whitespace-nowrap">
                        {new Date(c.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getStatusColor(c.status)}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {getStatusLabel(c.status)}
                  </span>

                  {/* Quick Actions */}
                  <div
                    className="flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (c.status !== 'archived') {
                          updateCaseStatus(c.id, 'archived');
                        }
                      }}
                      className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
                      title="Arquivar"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        deleteCase(c.id);
                      }}
                      className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
