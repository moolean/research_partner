/**
 * Global State Management with Zustand
 */
import { create } from 'zustand';
import type { APIConfig, Document, Analysis, ChatMessage } from '../types/api';

interface AppState {
  // API Configuration
  apiConfig: APIConfig | null;
  setApiConfig: (config: APIConfig) => void;

  // Current Document
  currentDocument: Document | null;
  setCurrentDocument: (doc: Document | null) => void;

  // Analysis
  analysis: Analysis | null;
  setAnalysis: (analysis: Analysis | null) => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;

  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  selectedAnnotation: number | null;
  setSelectedAnnotation: (index: number | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // API Configuration
  apiConfig: null,
  setApiConfig: (config) => set({ apiConfig: config }),

  // Current Document
  currentDocument: null,
  setCurrentDocument: (doc) => set({ currentDocument: doc }),

  // Analysis
  analysis: null,
  setAnalysis: (analysis) => set({ analysis }),

  // Chat
  chatMessages: [],
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),
  clearChat: () => set({ chatMessages: [] }),

  // UI State
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  selectedAnnotation: null,
  setSelectedAnnotation: (index) => set({ selectedAnnotation: index }),
}));
