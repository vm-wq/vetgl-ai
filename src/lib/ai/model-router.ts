/**
 * Intelligent Model Router for VETGL.AI
 * Routes requests to the optimal AI model based on task type
 */

export type TaskType =
  | 'chat'
  | 'soap'
  | 'estimate'
  | 'discharge'
  | 'triage'
  | 'vision'
  | 'transcription'
  | 'embedding'
  | 'extraction';

export interface ModelRoute {
  primary: string;
  fallback: string;
  reason: string;
}

const MODEL_ROUTES: Record<TaskType, ModelRoute> = {
  chat: {
    primary: 'claude-sonnet-4-20250514',
    fallback: 'gpt-4o',
    reason: 'Claude excels at clinical reasoning and structured responses',
  },
  soap: {
    primary: 'claude-sonnet-4-20250514',
    fallback: 'gpt-4o',
    reason: 'Claude provides more structured clinical documentation',
  },
  estimate: {
    primary: 'claude-sonnet-4-20250514',
    fallback: 'gpt-4o',
    reason: 'Claude better at comprehensive service suggestions',
  },
  discharge: {
    primary: 'claude-sonnet-4-20250514',
    fallback: 'gpt-4o',
    reason: 'Claude for structured medical writing',
  },
  triage: {
    primary: 'claude-sonnet-4-20250514',
    fallback: 'gpt-4o',
    reason: 'Claude for rapid clinical assessment',
  },
  vision: {
    primary: 'gpt-4o',
    fallback: 'gpt-4o-mini',
    reason: 'GPT-4o has superior vision capabilities for radiographs and ultrasounds',
  },
  transcription: {
    primary: 'whisper-1',
    fallback: 'whisper-1',
    reason: 'OpenAI Whisper for audio transcription',
  },
  embedding: {
    primary: 'text-embedding-3-small',
    fallback: 'text-embedding-3-small',
    reason: 'OpenAI embeddings for RAG vector search',
  },
  extraction: {
    primary: 'gpt-4o-mini',
    fallback: 'gpt-4o',
    reason: 'GPT-4o-mini for fast structured extraction',
  },
};

export function getOptimalModel(taskType: TaskType, userOverride?: string): string {
  if (userOverride) return userOverride;
  return MODEL_ROUTES[taskType]?.primary || 'claude-sonnet-4-20250514';
}

export function getFallbackModel(taskType: TaskType): string {
  return MODEL_ROUTES[taskType]?.fallback || 'gpt-4o';
}

export function getModelRoute(taskType: TaskType): ModelRoute {
  return MODEL_ROUTES[taskType] || MODEL_ROUTES.chat;
}

export function isOpenAIModel(model: string): boolean {
  return model.startsWith('gpt') || model.startsWith('text-embedding') || model === 'whisper-1';
}

export function isClaudeModel(model: string): boolean {
  return model.startsWith('claude');
}

export default {
  getOptimalModel,
  getFallbackModel,
  getModelRoute,
  isOpenAIModel,
  isClaudeModel,
};
