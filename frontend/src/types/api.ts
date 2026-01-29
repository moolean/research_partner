/**
 * API Types and Interfaces
 */

export interface APIConfig {
  api_key: string;
  api_base?: string;
  model?: string;
}

export interface Document {
  document_id: string;
  title: string;
  text?: string;
  page_count?: number;
  authors?: string[];
  abstract?: string;
  text_preview?: string;
}

export interface Annotation {
  type: 'concept' | 'finding' | 'methodology' | 'result' | 'insight' | 'general';
  text: string;
  note: string;
  page?: number;
  expanded?: string;
  position?: {
    x: number;
    y: number;
  };
}

export interface Analysis {
  document_id: string;
  summary: string;
  annotations: Annotation[];
  key_insights: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface ChatResponse {
  response: string;
  sources?: string[];
}
