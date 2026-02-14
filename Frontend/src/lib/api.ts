// API client for FastAPI backend integration
import { BriefItem, HistoryItem, SavedItem, UserSettings, ApiResponse } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'An error occurred',
                };
            }

            return {
                success: true,
                data,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    // Brief operations
    async createBrief(originalText: string, audience: string): Promise<ApiResponse<BriefItem>> {
        return this.request<BriefItem>('/briefs', {
            method: 'POST',
            body: JSON.stringify({ originalText, audience }),
        });
    }

    async getBrief(id: string): Promise<ApiResponse<BriefItem>> {
        return this.request<BriefItem>(`/briefs/${id}`);
    }

    // History operations
    async getHistory(limit: number = 50): Promise<ApiResponse<HistoryItem[]>> {
        return this.request<HistoryItem[]>(`/history?limit=${limit}`);
    }

    async deleteHistoryItem(id: string): Promise<ApiResponse<void>> {
        return this.request<void>(`/history/${id}`, {
            method: 'DELETE',
        });
    }

    async clearHistory(): Promise<ApiResponse<void>> {
        return this.request<void>('/history', {
            method: 'DELETE',
        });
    }

    // Saved items operations
    async getSavedItems(): Promise<ApiResponse<SavedItem[]>> {
        return this.request<SavedItem[]>('/saved');
    }

    async saveBrief(id: string, notes?: string): Promise<ApiResponse<SavedItem>> {
        return this.request<SavedItem>('/saved', {
            method: 'POST',
            body: JSON.stringify({ briefId: id, notes }),
        });
    }

    async unsaveBrief(id: string): Promise<ApiResponse<void>> {
        return this.request<void>(`/saved/${id}`, {
            method: 'DELETE',
        });
    }

    async updateSavedNotes(id: string, notes: string): Promise<ApiResponse<SavedItem>> {
        return this.request<SavedItem>(`/saved/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ notes }),
        });
    }

    // Settings operations
    async getSettings(): Promise<ApiResponse<UserSettings>> {
        return this.request<UserSettings>('/settings');
    }

    async updateSettings(settings: Partial<UserSettings>): Promise<ApiResponse<UserSettings>> {
        return this.request<UserSettings>('/settings', {
            method: 'PATCH',
            body: JSON.stringify(settings),
        });
    }

    // NLP operations (for future FastAPI integration)
    async processText(text: string, audience: string): Promise<ApiResponse<{ simplified: string }>> {
        return this.request<{ simplified: string }>('/nlp/simplify', {
            method: 'POST',
            body: JSON.stringify({ text, audience }),
        });
    }
}

export const apiClient = new ApiClient();
