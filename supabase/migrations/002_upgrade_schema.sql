-- Medical Records
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  content JSONB NOT NULL,
  generated_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Quiz Progress (Gamification)
CREATE TABLE IF NOT EXISTS public.quiz_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  xp INTEGER NOT NULL DEFAULT 0,
  level TEXT NOT NULL DEFAULT 'student',
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  badges JSONB DEFAULT '[]'::jsonb,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  last_quiz_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Memories
CREATE TABLE IF NOT EXISTS public.ai_memories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  category TEXT DEFAULT 'fact' CHECK (category IN ('preference', 'protocol', 'fact', 'drug_preference', 'patient_history')),
  relevance_score FLOAT NOT NULL DEFAULT 1.0,
  access_count INTEGER NOT NULL DEFAULT 0,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Treatment Board Entries
CREATE TABLE IF NOT EXISTS public.treatment_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_id UUID REFERENCES public.cases(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted' CHECK (status IN ('admitted', 'treating', 'discharged')),
  treatments JSONB DEFAULT '[]'::jsonb,
  vitals JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  admitted_at TIMESTAMPTZ DEFAULT NOW(),
  discharged_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_medical_records_case_id ON public.medical_records(case_id);
CREATE INDEX IF NOT EXISTS idx_quiz_progress_user_id ON public.quiz_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_memories_user_id ON public.ai_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_memories_category ON public.ai_memories(category);
CREATE INDEX IF NOT EXISTS idx_treatment_entries_status ON public.treatment_entries(status);
CREATE INDEX IF NOT EXISTS idx_treatment_entries_case_id ON public.treatment_entries(case_id);

-- RLS
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_entries ENABLE ROW LEVEL SECURITY;

-- Medical Records policies
CREATE POLICY "Users can view own medical records" ON public.medical_records
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.cases WHERE cases.id = medical_records.case_id AND (cases.user_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ))
  ));

CREATE POLICY "Users can create medical records for own cases" ON public.medical_records
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.cases WHERE cases.id = case_id AND cases.user_id = auth.uid()
  ));

-- Quiz Progress policies
CREATE POLICY "Users can manage own quiz progress" ON public.quiz_progress
  FOR ALL TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users can view all quiz progress for leaderboard" ON public.quiz_progress
  FOR SELECT TO authenticated USING (true);

-- AI Memories policies
CREATE POLICY "Users can view own memories" ON public.ai_memories
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Users can manage own memories" ON public.ai_memories
  FOR ALL TO authenticated USING (user_id = auth.uid());

-- Treatment entries policies
CREATE POLICY "Vets and admins can manage treatment entries" ON public.treatment_entries
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'veterinarian')
  ));
