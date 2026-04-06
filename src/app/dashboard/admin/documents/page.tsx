'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Document, DocumentChunk } from '@/types';
import { Upload, Trash2, Search, Loader, FileText } from 'lucide-react';

export default function DocumentsPage() {
  const supabase = createClient();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DocumentChunk[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    docType: 'protocol' as Document['doc_type'],
    file: null as File | null,
  });

  // Check admin status and fetch documents
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

      // Fetch documents
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.file || !formData.title) {
      alert('Preencha título e selecione um arquivo');
      return;
    }

    if (!formData.file.name.endsWith('.txt') && !formData.file.name.endsWith('.md')) {
      alert('Apenas arquivos .txt e .md são suportados');
      return;
    }

    try {
      setUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Upload file to storage
      const fileName = `${Date.now()}-${formData.file.name}`;
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(`public/${fileName}`, formData.file);

      if (uploadError) throw uploadError;

      // Get file URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(`public/${fileName}`);

      // Read file content for chunking
      const fileContent = await formData.file.text();

      // Create document record
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert([
          {
            uploaded_by: user.id,
            title: formData.title,
            file_url: urlData.publicUrl,
            doc_type: formData.docType,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (docError) throw docError;

      // Create document chunks (simple split by paragraphs)
      const chunks = fileContent.split('\n\n').filter((c) => c.trim());
      const chunkRecords = chunks.map((content, index) => ({
        document_id: docData.id,
        content,
        chunk_index: index,
        created_at: new Date().toISOString(),
      }));

      if (chunkRecords.length > 0) {
        const { error: chunkError } = await supabase
          .from('document_chunks')
          .insert(chunkRecords);

        if (chunkError) throw chunkError;
      }

      // Reset form and refresh
      setFormData({ title: '', docType: 'protocol', file: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await checkAdminAndFetch();
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Erro ao fazer upload: ' + (error as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteDocument(id: string, fileUrl: string) {
    if (
      !confirm(
        'Tem certeza que deseja deletar este documento? Esta ação não pode ser desfeita.'
      )
    ) {
      return;
    }

    try {
      // Delete from storage
      const fileName = fileUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from('documents').remove([`public/${fileName}`]);
      }

      // Delete document record (chunks will cascade delete)
      const { error } = await supabase.from('documents').delete().eq('id', id);

      if (error) throw error;

      setDocuments(documents.filter((d) => d.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Erro ao deletar documento: ' + (error as Error).message);
    }
  }

  async function handleSearchDocuments(e: React.FormEvent) {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);

      // Simple text search in document chunks
      const { data, error } = await supabase
        .from('document_chunks')
        .select('*')
        .ilike('content', `%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Error searching documents:', error);
    } finally {
      setIsSearching(false);
    }
  }

  if (!isAdmin && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full p-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-slate-200 mb-3">Acesso Negado</h1>
          <p className="text-slate-400 mb-6">
            Você não tem permissão para acessar esta página. Apenas administradores podem
            gerenciar documentos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 p-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Gerenciamento de Documentos</h1>
          <p className="text-slate-400 mb-6">
            Faça upload e gerencie documentos para RAG (Retrieval-Augmented Generation)
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Fazer Upload de Documento</h2>
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-100 mb-2">
                Título do Documento *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                placeholder="Ex: Protocolo de Cirurgia Veterinária"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-100 mb-2">
                  Tipo de Documento *
                </label>
                <select
                  value={formData.docType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      docType: e.target.value as Document['doc_type'],
                    })
                  }
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-teal-500 transition-colors"
                >
                  <option value="protocol">Protocolo</option>
                  <option value="company_doc">Documento da Empresa</option>
                  <option value="reference">Referência</option>
                  <option value="training">Treinamento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-100 mb-2">
                  Arquivo *
                </label>
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md"
                    onChange={(e) =>
                      setFormData({ ...formData, file: e.target.files?.[0] || null })
                    }
                    className="hidden"
                    disabled={uploading}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 hover:border-teal-500 focus:outline-none focus:border-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formData.file ? formData.file.name : 'Selecionar arquivo (.txt ou .md)'}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 text-sm">
                Formatos suportados: .txt e .md. Análise de PDF em breve.
              </p>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              {uploading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Fazer Upload
                </>
              )}
            </button>
          </form>
        </div>

        {/* Search Form */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-slate-100 mb-3">Testar Busca</h3>
          <form onSubmit={handleSearchDocuments} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar nos documentos..."
              className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Buscar
            </button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-teal-400 animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400">Carregando documentos...</p>
            </div>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              Resultados da Busca ({searchResults.length})
            </h3>
            <div className="space-y-3 mb-8">
              {searchResults.map((chunk) => (
                <div key={chunk.id} className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                  <p className="text-slate-300 text-sm line-clamp-3">{chunk.content}</p>
                  <p className="text-slate-500 text-xs mt-2">
                    ID do Documento: {chunk.document_id.slice(0, 8)}...
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-700 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Documentos</h3>
            </div>
          </>
        ) : null}

        {documents.length === 0 && searchResults.length === 0 ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-100 mb-2">
                Nenhum documento encontrado
              </h2>
              <p className="text-slate-400">
                Comece fazendo upload de documentos para usar com o sistema de RAG.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-teal-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-slate-100 truncate">
                        {doc.title}
                      </h3>
                      <span className="px-2 py-1 bg-teal-600/20 text-teal-400 rounded text-xs font-medium border border-teal-500/30 whitespace-nowrap">
                        {doc.doc_type === 'protocol'
                          ? 'Protocolo'
                          : doc.doc_type === 'company_doc'
                            ? 'Empresa'
                            : doc.doc_type === 'reference'
                              ? 'Referência'
                              : 'Treinamento'}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-slate-400 text-sm">
                      <p>
                        <span className="font-medium">Enviado por:</span> {doc.uploaded_by.slice(0, 8)}...
                      </p>
                      <p>
                        {new Date(doc.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteDocument(doc.id, doc.file_url)}
                    className="p-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded transition-colors flex-shrink-0"
                    title="Deletar documento"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
