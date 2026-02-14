// Types for Executive Briefs Application

export interface BriefItem {
    id: string;
    title: string;
    originalText: string;
    simplifiedText: string;
    audience: string;
    createdAt: Date;
    updatedAt: Date;
    isSaved: boolean;
    tags?: string[];
}

export interface HistoryItem extends BriefItem {
    viewCount: number;
    lastViewed: Date;
}

export interface SavedItem extends BriefItem {
    savedAt: Date;
    notes?: string;
}

export interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    defaultAudience: string;
    autoSave: boolean;
    notifications: {
        email: boolean;
        push: boolean;
    };
    apiKey?: string;
    language: string;
    maxHistoryItems: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
