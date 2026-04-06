export type UserRole = 'admin' | 'veterinarian' | 'technician';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Case {
  id: string;
  user_id: string;
  title: string;
  species?: string;
  patient_name?: string;
  status: 'active' | 'closed' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  case_id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model_used?: string;
  attachments?: Attachment[];
  created_at: string;
}

export interface Attachment {
  type: 'image' | 'file' | 'audio';
  url: string;
  name: string;
  size?: number;
}

export interface Recording {
  id: string;
  case_id?: string;
  user_id: string;
  audio_url: string;
  transcript?: string;
  duration: number;
  created_at: string;
}

export interface SOAPNote {
  id: string;
  case_id: string;
  user_id: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  created_at: string;
}

export interface Estimate {
  id: string;
  case_id?: string;
  user_id: string;
  services: EstimateService[];
  total_low: number;
  total_high: number;
  status: 'draft' | 'sent' | 'approved' | 'declined';
  created_at: string;
}

export interface EstimateService {
  name: string;
  category: string;
  price_low: number;
  price_high: number;
  quantity: number;
}

export interface AuditEntry {
  id: string;
  user_id: string;
  case_id?: string;
  category: string;
  query_summary: string;
  model_used: string;
  created_at: string;
}

export interface QuizScore {
  id: string;
  user_id: string;
  specialty: string;
  score: number;
  total: number;
  xp_earned?: number;
  difficulty?: string;
  created_at: string;
}

export interface Document {
  id: string;
  uploaded_by: string;
  title: string;
  file_url: string;
  doc_type: 'protocol' | 'company_doc' | 'reference' | 'training';
  hospital_id?: string;
  created_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  content: string;
  chunk_index: number;
  metadata?: Record<string, unknown>;
  similarity?: number;
}

export interface Hospital {
  id: string;
  name: string;
  city: string;
  state: string;
  created_at: string;
}

export type AIModel = 'claude-sonnet-4-20250514' | 'claude-opus-4-20250514' | 'gpt-4o' | 'gpt-4o-mini';

export interface ChatRequest {
  messages: { role: string; content: string }[];
  model: AIModel;
  case_id?: string;
  use_rag?: boolean;
}
