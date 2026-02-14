import { useState, useEffect, useCallback } from 'react';
import { HistoryItem, SavedItem, UserSettings } from '@/types';
import { useLocalStorage } from './useLocalStorage';
import { apiClient } from '@/lib/api';

/**
 * Custom hook for managing brief-related data
 * Currently uses localStorage, will switch to API calls when backend is ready
 */
export function useBriefData() {
    const [history, setHistory] = useLocalStorage<HistoryItem[]>('briefHistory', []);
    const [savedItems, setSavedItems] = useLocalStorage<SavedItem[]>('savedBriefs', []);
    const [settings, setSettings] = useLocalStorage<UserSettings>('userSettings', {
        theme: 'system',
        defaultAudience: 'executives',
        autoSave: false,
        notifications: {
            email: true,
            push: false,
        },
        language: 'en',
        maxHistoryItems: 50,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // History operations
    const addToHistory = useCallback((item: Omit<HistoryItem, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'lastViewed'>) => {
        const newItem: HistoryItem = {
            ...item,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            viewCount: 1,
            lastViewed: new Date(),
        };

        setHistory((prev) => {
            const updated = [newItem, ...prev].slice(0, settings.maxHistoryItems);
            return updated;
        });

        return newItem;
    }, [setHistory, settings.maxHistoryItems]);

    const deleteHistoryItem = useCallback((id: string) => {
        setHistory((prev) => prev.filter((item) => item.id !== id));
    }, [setHistory]);

    const clearHistory = useCallback(() => {
        setHistory([]);
    }, [setHistory]);

    const updateHistoryView = useCallback((id: string) => {
        setHistory((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, viewCount: item.viewCount + 1, lastViewed: new Date() }
                    : item
            )
        );
    }, [setHistory]);

    // Saved items operations
    const saveItem = useCallback((briefId: string, notes?: string) => {
        const historyItem = history.find((item) => item.id === briefId);
        if (!historyItem) {
            setError('Brief not found in history');
            return;
        }

        const savedItem: SavedItem = {
            ...historyItem,
            savedAt: new Date(),
            notes,
            isSaved: true,
        };

        setSavedItems((prev) => {
            const exists = prev.find((item) => item.id === briefId);
            if (exists) {
                return prev.map((item) => (item.id === briefId ? savedItem : item));
            }
            return [savedItem, ...prev];
        });

        // Update history to reflect saved status
        setHistory((prev) =>
            prev.map((item) => (item.id === briefId ? { ...item, isSaved: true } : item))
        );
    }, [history, setSavedItems, setHistory]);

    const unsaveItem = useCallback((id: string) => {
        setSavedItems((prev) => prev.filter((item) => item.id !== id));
        setHistory((prev) =>
            prev.map((item) => (item.id === id ? { ...item, isSaved: false } : item))
        );
    }, [setSavedItems, setHistory]);

    const updateSavedNotes = useCallback((id: string, notes: string) => {
        setSavedItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, notes } : item))
        );
    }, [setSavedItems]);

    // Settings operations
    const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
    }, [setSettings]);

    // Search functionality
    const searchHistory = useCallback((query: string) => {
        if (!query.trim()) return history;

        const lowerQuery = query.toLowerCase();
        return history.filter(
            (item) =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.originalText.toLowerCase().includes(lowerQuery) ||
                item.simplifiedText.toLowerCase().includes(lowerQuery) ||
                item.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
    }, [history]);

    const searchSaved = useCallback((query: string) => {
        if (!query.trim()) return savedItems;

        const lowerQuery = query.toLowerCase();
        return savedItems.filter(
            (item) =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.originalText.toLowerCase().includes(lowerQuery) ||
                item.simplifiedText.toLowerCase().includes(lowerQuery) ||
                item.notes?.toLowerCase().includes(lowerQuery) ||
                item.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
    }, [savedItems]);

    return {
        // Data
        history,
        savedItems,
        settings,
        isLoading,
        error,

        // History operations
        addToHistory,
        deleteHistoryItem,
        clearHistory,
        updateHistoryView,

        // Saved operations
        saveItem,
        unsaveItem,
        updateSavedNotes,

        // Settings operations
        updateSettings,

        // Search
        searchHistory,
        searchSaved,
    };
}
