import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { searchDocuments, hybridSearch } from '@/lib/ai/rag';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query, match_count, search_type } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const matchCount = match_count || 5;
    const searchMode = search_type || 'hybrid'; // 'semantic', 'hybrid'

    let results;
    if (searchMode === 'hybrid') {
      results = await hybridSearch(query, matchCount);
    } else {
      results = await searchDocuments(query, matchCount);
    }

    return NextResponse.json({
      results,
      query,
      count: results.length,
      search_type: searchMode,
      success: true,
    });
  } catch (error) {
    console.error('RAG search error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: `Erro na busca: ${errorMessage}` },
      { status: 500 }
    );
  }
}
