-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Users profile table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'veterinarian' CHECK (role IN ('admin', 'veterinarian', 'technician')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Hospitals
CREATE TABLE public.hospitals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cases
CREATE TABLE public.cases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Case',
  species TEXT,
  patient_name TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Messages
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model_used TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Recordings
CREATE TABLE public.recordings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  audio_url TEXT NOT NULL,
  transcript TEXT,
  duration INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SOAP Notes
CREATE TABLE public.soap_notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subjective TEXT NOT NULL DEFAULT '',
  objective TEXT NOT NULL DEFAULT '',
  assessment TEXT NOT NULL DEFAULT '',
  plan TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Estimates
CREATE TABLE public.estimates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_low NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_high NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit Log
CREATE TABLE public.audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  case_id UUID REFERENCES public.cases(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  query_summary TEXT NOT NULL,
  model_used TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quiz Scores
CREATE TABLE public.quiz_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  specialty TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Documents (for RAG)
CREATE TABLE public.documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  doc_type TEXT NOT NULL DEFAULT 'protocol' CHECK (doc_type IN ('protocol', 'company_doc', 'reference', 'training')),
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Document Chunks (for RAG vector search)
CREATE TABLE public.document_chunks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  chunk_index INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create vector similarity search index
CREATE INDEX ON public.document_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Indexes for performance
CREATE INDEX idx_cases_user_id ON public.cases(user_id);
CREATE INDEX idx_cases_status ON public.cases(status);
CREATE INDEX idx_messages_case_id ON public.messages(case_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_recordings_case_id ON public.recordings(case_id);
CREATE INDEX idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at);
CREATE INDEX idx_document_chunks_document_id ON public.document_chunks(document_id);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soap_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all profiles but only update their own
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Cases: users see their own cases, admins see all
CREATE POLICY "Users can view own cases" ON public.cases
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));
CREATE POLICY "Users can create cases" ON public.cases
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own cases" ON public.cases
  FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can delete own cases" ON public.cases
  FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Messages: viewable by case owner or admin
CREATE POLICY "Users can view messages in own cases" ON public.messages
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.cases WHERE cases.id = messages.case_id AND (cases.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ))
  ));
CREATE POLICY "Users can insert messages in own cases" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.cases WHERE cases.id = case_id AND cases.user_id = auth.uid()
  ));

-- Recordings: users see their own
CREATE POLICY "Users can manage own recordings" ON public.recordings
  FOR ALL TO authenticated USING (user_id = auth.uid());

-- SOAP Notes: users see their own
CREATE POLICY "Users can manage own SOAP notes" ON public.soap_notes
  FOR ALL TO authenticated USING (user_id = auth.uid());

-- Estimates: users see their own
CREATE POLICY "Users can manage own estimates" ON public.estimates
  FOR ALL TO authenticated USING (user_id = auth.uid());

-- Audit Log: admins see all, users see own
CREATE POLICY "Users can view own audit entries" ON public.audit_log
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));
CREATE POLICY "Users can insert audit entries" ON public.audit_log
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Quiz Scores: users see their own
CREATE POLICY "Users can manage own quiz scores" ON public.quiz_scores
  FOR ALL TO authenticated USING (user_id = auth.uid());

-- Documents: all authenticated users can read, admins can manage
CREATE POLICY "All users can view documents" ON public.documents
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage documents" ON public.documents
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Document Chunks: all authenticated users can read
CREATE POLICY "All users can view document chunks" ON public.document_chunks
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage document chunks" ON public.document_chunks
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Hospitals: all can read, admins can manage
CREATE POLICY "All users can view hospitals" ON public.hospitals
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage hospitals" ON public.hospitals
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'veterinarian')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Vector similarity search function
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  content TEXT,
  chunk_index INTEGER,
  metadata JSONB,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.content,
    document_chunks.chunk_index,
    document_chunks.metadata,
    1 - (document_chunks.embedding <=> query_embedding) AS similarity
  FROM document_chunks
  WHERE 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
  ORDER BY document_chunks.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Seed Greenlight hospitals
INSERT INTO public.hospitals (name, city, state) VALUES
  ('Greenlight Pet ER - Lake Nona', 'Orlando', 'FL'),
  ('Greenlight Pet ER - Jacksonville', 'Jacksonville', 'FL'),
  ('Greenlight Pet ER - Melbourne', 'Melbourne', 'FL'),
  ('Greenlight Pet ER - Plantation', 'Plantation', 'FL'),
  ('Greenlight Pet ER - Riverview', 'Riverview', 'FL'),
  ('Greenlight Pet ER - Wesley Chapel', 'Wesley Chapel', 'FL'),
  ('Greenlight Pet ER - Arlington', 'Arlington', 'TX'),
  ('Greenlight Pet ER - Dallas', 'Dallas', 'TX'),
  ('Greenlight Pet ER - McKinney', 'McKinney', 'TX'),
  ('Greenlight Pet ER - Sachse', 'Sachse', 'TX'),
  ('Greenlight Pet ER - The Woodlands', 'The Woodlands', 'TX');
