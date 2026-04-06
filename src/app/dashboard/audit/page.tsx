'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuditEntry } from '@/types';
import { Download, Filter, Calendar } from 'lucide-react';

export default function AuditPage() {
  const supabase = createClient();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('month');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const categories = ['chat', 'soap', 'estimate', 'triage', 'recording', 'protocol'];

  // Check admin status and fetch entries
  useEffect(() => {
    checkAdminAndFetch();
  }, [dateRange, selectedCategory]);

  async function checkAdminAndFetch() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // Check if admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      const adminStatus = profile?.role === 'admin';
      setIsAdmin(adminStatus);

      if (!adminStatus) return;

      // Fetch audit entries
      const now = new Date();
      let fromDate = new Date();

      switch (dateRange) {
        case 'today':
          fromDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          fromDate.setDate(fromDate.getDate() - 7);
          break;
        case 'month':
          fromDate.setMonth(fromDate.getMonth() - 1);
          break;
      }

      let query = supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false });

      if (dateRange !== 'all') {
        query = query.gte('created_at', fromDate.toISOString());
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching audit entries:', error);
    } finally {
      setLoading(false);
    }
  }

  function exportToCSV() {
    if (entries.length === 0) return;

    const headers = ['Data', 'Usuário', 'Categoria', 'Resumo Consulta', 'Modelo', 'ID Caso'];
    const csvContent = [
      headers.join(','),
      ...entries.map((e) =>
        [
          new Date(e.created_at).toLocaleString('pt-BR'),
          e.user_id,
          e.category,
          `"${e.query_summary.replace(/"/g, '""')}"`,
          e.model_used,
          e.case_id || '-',
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit-log-${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  }

  // Calculate stats
  const stats = {
    totalQueries: entries.length,
    queriestoday: entries.filter((e) => {
      const today = new Date();
      const entryDate = new Date(e.created_at);
      return (
        entryDate.getDate() === today.getDate() &&
        entryDate.getMonth() === today.getMonth() &&
        entryDate.getFullYear() === today.getFullYear()
      );
    }).length,
    mostUsedModel: entries.length > 0 ? getMostUsedModel() : '-',
  };

  function getMostUsedModel() {
    const modelCount: Record<string, number> = {};
    entries.forEach((e) => {
      modelCount[e.model_used] = (modelCount[e.model_used] || 0) + 1;
    });
    return Object.entries(modelCount).sort(([, a], [, b]) => b - a)[0]?.[0] || '-';
  }

  // Pagination
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  const paginatedEntries = entries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-slate-200 mb-3">Acesso Negado</h1>
          <p className="text-slate-400 mb-6">
            Você não tem permissão para acessar esta página. Apenas administradores podem
            visualizar logs de auditoria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Log de Auditoria</h1>
          <p className="text-slate-400">Visualize e analise a atividade do sistema</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm font-medium mb-1">Total de Consultas</p>
            <p className="text-2xl font-bold text-teal-400">{stats.totalQueries}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm font-medium mb-1">Consultas Hoje</p>
            <p className="text-2xl font-bold text-teal-400">{stats.queriestoday}</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm font-medium mb-1">Modelo Mais Usado</p>
            <p className="text-lg font-bold text-teal-400 truncate">{stats.mostUsedModel}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-500" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 hover:border-teal-500 focus:border-teal-500 focus:outline-none transition-colors"
              >
                <option value="all">Todas as Categorias</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-500" />
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value as typeof dateRange);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 hover:border-teal-500 focus:border-teal-500 focus:outline-none transition-colors"
              >
                <option value="today">Hoje</option>
                <option value="week">Última Semana</option>
                <option value="month">Último Mês</option>
                <option value="all">Todos os Tempos</option>
              </select>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            disabled={entries.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
          >
            <Download className="w-5 h-5" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-teal-400 animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Carregando auditoria...</p>
            </div>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <h2 className="text-xl font-semibold text-slate-100 mb-2">
                Nenhum registro encontrado
              </h2>
              <p className="text-slate-400">
                Nenhuma atividade foi registrada no período selecionado.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-slate-100">
                  <thead className="bg-slate-700/50 border-b border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-200">
                        Data
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-200">
                        Usuário
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-200">
                        Categoria
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-200">
                        Resumo Consulta
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-200">
                        Modelo
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-slate-200">
                        ID Caso
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {paginatedEntries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          {new Date(entry.created_at).toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">
                          {entry.user_id.slice(0, 8)}...
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-teal-600/20 text-teal-400 rounded text-xs font-medium border border-teal-500/30">
                            {entry.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-xs truncate">
                          {entry.query_summary}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">
                          {entry.model_used}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">
                          {entry.case_id ? entry.case_id.slice(0, 8) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-slate-400 text-sm">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
                  {Math.min(currentPage * itemsPerPage, entries.length)} de {entries.length}{' '}
                  resultados
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Anterior
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-teal-600/30 text-teal-400 border border-teal-500'
                            : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-teal-500'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Próximo
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
