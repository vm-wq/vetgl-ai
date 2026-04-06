'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@/types';
import {
  Plus,
  Trash2,
  Edit2,
  Users as UsersIcon,
} from 'lucide-react';

export default function UsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'veterinarian' as 'admin' | 'veterinarian' | 'technician',
  });

  // Check admin status and fetch users
  useEffect(() => {
    checkAdminAndFetch();
  }, []);

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

      // Fetch users from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.full_name) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      // Create user with password
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: formData.email,
              full_name: formData.full_name,
              role: formData.role,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) throw profileError;

        // Refresh users list
        await checkAdminAndFetch();
        setShowAddForm(false);
        setFormData({
          email: '',
          password: '',
          full_name: '',
          role: 'veterinarian',
        });
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Erro ao adicionar usuário: ' + (error as Error).message);
    }
  }

  async function handleUpdateRole(userId: string, newRole: User['role']) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setEditingId(null);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm('Tem certeza que deseja deletar este usuário? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      // Delete from profiles first (foreign key constraint)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) throw authError;

      setUsers(users.filter((u) => u.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erro ao deletar usuário: ' + (error as Error).message);
    }
  }

  if (!isAdmin && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-slate-200 mb-3">Acesso Negado</h1>
          <p className="text-slate-400 mb-6">
            Você não tem permissão para acessar esta página. Apenas administradores podem
            gerenciar usuários.
          </p>
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
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Gerenciamento de Usuários</h1>
            <p className="text-slate-400">Gerencie usuários e permissões do sistema</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Adicionar Usuário
          </button>
        </div>

        {/* Stats */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-teal-600/20">
            <UsersIcon className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Total de Usuários</p>
            <p className="text-2xl font-bold text-teal-400">{users.length}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Add User Form */}
        {showAddForm && (
          <div className="mb-6 bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-slate-100 mb-4">Adicionar Novo Usuário</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-100 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="usuario@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-100 mb-2">
                  Senha *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-100 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  placeholder="João da Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-100 mb-2">
                  Função
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as typeof formData.role,
                    })
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-teal-500 transition-colors"
                >
                  <option value="veterinarian">Veterinário</option>
                  <option value="technician">Técnico</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium"
                >
                  Adicionar Usuário
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-teal-400 animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Carregando usuários...</p>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center max-w-md">
              <h2 className="text-xl font-semibold text-slate-100 mb-2">
                Nenhum usuário encontrado
              </h2>
              <p className="text-slate-400">
                Comece adicionando o primeiro usuário ao sistema.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-slate-100">
                <thead className="bg-slate-700/50 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-200">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-200">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-200">
                      Função
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-200">
                      Data de Adesão
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-200">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{user.full_name || '-'}</td>
                      <td className="px-4 py-3 text-slate-400">{user.email}</td>
                      <td className="px-4 py-3">
                        {editingId === user.id ? (
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleUpdateRole(
                                user.id,
                                e.target.value as User['role']
                              )
                            }
                            className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-100 focus:outline-none focus:border-teal-500 transition-colors text-sm"
                          >
                            <option value="veterinarian">Veterinário</option>
                            <option value="technician">Técnico</option>
                            <option value="admin">Administrador</option>
                          </select>
                        ) : (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              user.role === 'admin'
                                ? 'bg-purple-600/20 text-purple-400'
                                : user.role === 'technician'
                                  ? 'bg-blue-600/20 text-blue-400'
                                  : 'bg-teal-600/20 text-teal-400'
                            }`}
                          >
                            {user.role === 'admin'
                              ? 'Administrador'
                              : user.role === 'technician'
                                ? 'Técnico'
                                : 'Veterinário'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {editingId === user.id ? (
                            <>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors text-xs"
                              >
                                Salvar
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors text-xs"
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setEditingId(user.id)}
                                className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition-colors"
                                title="Editar função"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition-colors"
                                title="Deletar usuário"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
