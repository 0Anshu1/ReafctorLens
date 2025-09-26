import axios from 'axios';
import { AnalysisResult } from '../contexts/AnalysisContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface AnalysisRequest {
  language: string; // primary (legacy) language for server
  legacy: {
    type: 'paste' | 'file' | 'repo';
    content?: string;
    url?: string;
    ref?: string;
    files?: string[];
  };
  refactored: {
    type: 'paste' | 'file' | 'repo';
    content?: string;
    url?: string;
    ref?: string;
    files?: string[];
  };
  options?: {
    mapHints?: Record<string, string>;
    analyzeTests?: boolean;
    runStaticChecks?: boolean;
    includeSecurityScan?: boolean;
    sourceLanguage?: string;
    targetLanguage?: string;
  };
}

export interface AnalysisResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message?: string;
}

export interface AnalysisListResponse {
  analyses: AnalysisResult[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

class AnalysisService {
  async startAnalysis(request: AnalysisRequest): Promise<AnalysisResponse> {
    try {
      const response = await api.post('/analyze', request);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to start analysis');
    }
  }

  async getAnalysis(id: string): Promise<AnalysisResult> {
    try {
      const response = await api.get(`/analyze/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch analysis');
    }
  }

  async getAnalyses(page: number = 1, limit: number = 10): Promise<AnalysisListResponse> {
    try {
      const response = await api.get('/analyze', {
        params: { page, limit },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch analyses');
    }
  }

  async deleteAnalysis(id: string): Promise<void> {
    try {
      await api.delete(`/analyze/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete analysis');
    }
  }

  // File upload helper
  async uploadFiles(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.fileIds;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload files');
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error: any) {
      throw new Error('Service is unavailable');
    }
  }
}

export const analysisService = new AnalysisService();

