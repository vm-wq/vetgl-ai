/**
 * RAG (Retrieval Augmented Generation) System
 * Manages document storage, chunking, embedding, and retrieval from Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { generateEmbedding } from './openai';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface DocumentChunk {
  id?: string;
  document_id: string;
  content: string;
  embedding?: number[];
  chunk_index: number;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface SearchResult {
  content: string;
  similarity: number;
  metadata?: Record<string, unknown>;
  source?: string;
}

/**
 * Search clinic documents by semantic similarity
 * Uses embeddings for intelligent retrieval
 * @param query - Search query
 * @param matchCount - Number of results to return
 * @param threshold - Similarity threshold (0.7 default)
 * @returns Array of relevant document chunks
 */
export async function searchDocuments(
  query: string,
  matchCount: number = 5,
  threshold: number = 0.7
): Promise<SearchResult[]> {
  try {
    const embedding = await generateEmbedding(query);

    const { data, error } = await supabaseAdmin.rpc('match_documents', {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: matchCount,
    });

    if (error) {
      console.error('RAG search error:', error);
      return [];
    }

    return (data || []).map((result: any) => ({
      content: result.content,
      similarity: result.similarity,
      metadata: result.metadata,
      source: result.document_id,
    }));
  } catch (error) {
    console.error('Error searching documents:', error);
    return [];
  }
}

/**
 * Build RAG context string from document chunks
 * Formats chunks for injection into system prompt
 * @param chunks - Array of document chunks
 * @returns Formatted context string
 */
export function buildRAGContext(
  chunks: { content: string; metadata?: Record<string, unknown> }[]
): string {
  if (!chunks.length) return '';

  const context = chunks
    .map(
      (chunk, i) => `[Documento ${i + 1}]: ${chunk.content}`
    )
    .join('\n\n');

  return `\n\n--- CONTEXTO DOS DOCUMENTOS DA CLÍNICA ---\n${context}\n--- FIM DO CONTEXTO ---\n`;
}

/**
 * Upload and chunk a document into the RAG system
 * Breaks large documents into overlapping chunks for better retrieval
 * @param documentId - Unique identifier for the document
 * @param text - Full text of the document
 * @param chunkSize - Words per chunk (default: 500)
 * @param overlap - Overlapping words between chunks (default: 50)
 * @returns Number of chunks created
 */
export async function uploadAndChunkDocument(
  documentId: string,
  text: string,
  chunkSize: number = 500,
  overlap: number = 50
): Promise<number> {
  try {
    // Split text into words
    const words = text.split(/\s+/);
    const chunks: string[] = [];

    // Create overlapping chunks
    for (let i = 0; i < words.length; i += chunkSize - overlap) {
      const chunk = words.slice(i, i + chunkSize).join(' ');
      if (chunk.trim()) {
        chunks.push(chunk);
      }
    }

    // Generate embeddings and store chunks
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await generateEmbedding(chunks[i]);

      const { error } = await supabaseAdmin.from('document_chunks').insert({
        document_id: documentId,
        content: chunks[i],
        embedding,
        chunk_index: i,
        metadata: {
          word_count: chunks[i].split(/\s+/).length,
          chunk_number: i + 1,
          total_chunks: chunks.length,
        },
      });

      if (error) {
        console.error(
          `Error inserting chunk ${i} for document ${documentId}:`,
          error
        );
      }
    }

    return chunks.length;
  } catch (error) {
    console.error('Error uploading and chunking document:', error);
    throw error;
  }
}

/**
 * Get metadata about a document
 * @param documentId - Document identifier
 * @returns Document metadata and chunk count
 */
export async function getDocumentMetadata(
  documentId: string
): Promise<{ chunks: number; words: number; lastUpdated: string } | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('document_chunks')
      .select('chunk_index, metadata')
      .eq('document_id', documentId)
      .order('chunk_index', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return null;
    }

    const lastChunk = data[0];
    const totalChunks = (lastChunk.metadata?.total_chunks as number) || 0;
    const totalWords = (lastChunk.metadata?.word_count as number) || 0;

    return {
      chunks: totalChunks,
      words: totalWords,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting document metadata:', error);
    return null;
  }
}

/**
 * Delete a document and all its chunks from the RAG system
 * @param documentId - Document identifier
 * @returns Success status
 */
export async function deleteDocument(documentId: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('document_chunks')
      .delete()
      .eq('document_id', documentId);

    if (error) {
      console.error('Error deleting document:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
}

/**
 * Search for documents by keyword
 * Text search in addition to semantic search
 * @param keyword - Keyword to search for
 * @param limit - Maximum results
 * @returns Array of matching chunks
 */
export async function searchByKeyword(
  keyword: string,
  limit: number = 10
): Promise<SearchResult[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('document_chunks')
      .select('content, metadata, document_id')
      .textSearch('content', keyword)
      .limit(limit);

    if (error) {
      console.error('Error searching by keyword:', error);
      return [];
    }

    return (data || []).map((result: any) => ({
      content: result.content,
      similarity: 1.0,
      metadata: result.metadata,
      source: result.document_id,
    }));
  } catch (error) {
    console.error('Error searching by keyword:', error);
    return [];
  }
}

/**
 * Hybrid search combining semantic and keyword search
 * Returns combined results sorted by relevance
 * @param query - Search query
 * @param limit - Maximum results
 * @returns Array of search results
 */
export async function hybridSearch(
  query: string,
  limit: number = 5
): Promise<SearchResult[]> {
  try {
    const [semanticResults, keywordResults] = await Promise.all([
      searchDocuments(query, limit),
      searchByKeyword(query, limit),
    ]);

    // Combine and deduplicate results
    const combined = new Map<string, SearchResult>();

    semanticResults.forEach((result) => {
      combined.set(result.content.substring(0, 50), {
        ...result,
        similarity: result.similarity * 1.5, // Weight semantic results
      });
    });

    keywordResults.forEach((result) => {
      const key = result.content.substring(0, 50);
      if (combined.has(key)) {
        const existing = combined.get(key)!;
        existing.similarity += result.similarity * 0.5;
      } else {
        combined.set(key, result);
      }
    });

    // Sort by similarity and return top results
    return Array.from(combined.values())
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  } catch (error) {
    console.error('Error in hybrid search:', error);
    return [];
  }
}

export default {
  searchDocuments,
  buildRAGContext,
  uploadAndChunkDocument,
  getDocumentMetadata,
  deleteDocument,
  searchByKeyword,
  hybridSearch,
};
