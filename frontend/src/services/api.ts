/**
 * API Service for backend communication
 */
import axios from 'axios';
import type { APIConfig, Document, Analysis, ChatResponse } from '../types/api';

const API_BASE_URL = '/api';

class APIService {
  /**
   * Upload a PDF file
   */
  async uploadPDF(file: File): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post<Document>(
      `${API_BASE_URL}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  }

  /**
   * Process an arxiv paper
   */
  async processArxiv(arxivUrl: string, apiConfig: APIConfig): Promise<Document> {
    const response = await axios.post<Document>(`${API_BASE_URL}/arxiv`, {
      arxiv_url: arxivUrl,
      api_config: apiConfig,
    });

    return response.data;
  }

  /**
   * Analyze a document
   */
  async analyzeDocument(documentId: string, apiConfig: APIConfig): Promise<Analysis> {
    const response = await axios.post<Analysis>(
      `${API_BASE_URL}/analyze`,
      null,
      {
        params: {
          document_id: documentId,
        },
        data: {
          api_config: apiConfig,
        },
      }
    );

    return response.data;
  }

  /**
   * Send a chat message
   */
  async sendChatMessage(
    sessionId: string,
    message: string,
    apiConfig: APIConfig
  ): Promise<ChatResponse> {
    const response = await axios.post<ChatResponse>(`${API_BASE_URL}/chat`, {
      session_id: sessionId,
      message,
      api_config: apiConfig,
    });

    return response.data;
  }

  /**
   * Create WebSocket connection for streaming chat
   */
  createChatWebSocket(sessionId: string): WebSocket {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/chat/${sessionId}`;
    return new WebSocket(wsUrl);
  }
}

export const apiService = new APIService();
