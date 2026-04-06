import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadAndChunkDocument } from '@/lib/ai/rag';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = (formData.get('title') as string) || file?.name || 'Documento sem título';
    const docType = (formData.get('doc_type') as string) || 'protocol';
    const hospitalId = (formData.get('hospital_id') as string) || null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Upload file to Supabase Storage
    const fileName = `${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName);

    // Create document record
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .insert({
        uploaded_by: user.id,
        title,
        file_url: urlData.publicUrl,
        doc_type: docType,
        hospital_id: hospitalId,
        file_name: fileName,
      })
      .select()
      .single();

    if (docError) {
      console.error('Document record error:', docError);
      throw docError;
    }

    // Extract text from file
    let text = '';
    try {
      text = await file.text();
    } catch {
      // If text() fails, try with file content
      const arrayBuffer = await file.arrayBuffer();
      text = new TextDecoder().decode(arrayBuffer);
    }

    if (!text.trim()) {
      return NextResponse.json(
        { error: 'Document appears to be empty or unreadable' },
        { status: 400 }
      );
    }

    // Chunk and embed
    const chunkCount = await uploadAndChunkDocument(doc.id, text);

    return NextResponse.json({
      document: doc,
      chunks_created: chunkCount,
      file_size: file.size,
      message: `Documento "${title}" processado com sucesso com ${chunkCount} chunks`,
      success: true,
    });
  } catch (error) {
    console.error('RAG upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: `Erro ao processar documento: ${errorMessage}` },
      { status: 500 }
    );
  }
}
