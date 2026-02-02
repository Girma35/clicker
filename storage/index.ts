// Storage layer using Chrome Storage API

import { ScrapingSession, StorageData } from '../shared/schemas';

const STORAGE_KEY = 'scraper_data';

export class StorageManager {
    static async getSessions(): Promise<ScrapingSession[]> {
        const result = await chrome.storage.local.get(STORAGE_KEY);
        const data: StorageData = result[STORAGE_KEY] || { sessions: [], settings: this.getDefaultSettings() };
        return data.sessions || [];
    }

    static async saveSession(session: ScrapingSession): Promise<void> {
        const sessions = await this.getSessions();
        const existingIndex = sessions.findIndex(s => s.id === session.id);

        if (existingIndex >= 0) {
            sessions[existingIndex] = session;
        } else {
            sessions.push(session);
        }

        await this.saveSessions(sessions);
    }

    static async saveSessions(sessions: ScrapingSession[]): Promise<void> {
        const data = await this.getData();
        data.sessions = sessions;
        await chrome.storage.local.set({ [STORAGE_KEY]: data });
    }

    static async deleteSession(sessionId: string): Promise<void> {
        const sessions = await this.getSessions();
        const filtered = sessions.filter(s => s.id !== sessionId);
        await this.saveSessions(filtered);
    }

    static async getSession(sessionId: string): Promise<ScrapingSession | null> {
        const sessions = await this.getSessions();
        return sessions.find(s => s.id === sessionId) || null;
    }

    static async getData(): Promise<StorageData> {
        const result = await chrome.storage.local.get(STORAGE_KEY);
        return result[STORAGE_KEY] || {
            sessions: [],
            settings: this.getDefaultSettings()
        };
    }

    static async getSettings() {
        const data = await this.getData();
        return data.settings;
    }

    static async saveSettings(settings: StorageData['settings']): Promise<void> {
        const data = await this.getData();
        data.settings = settings;
        await chrome.storage.local.set({ [STORAGE_KEY]: data });
    }

    static getDefaultSettings(): StorageData['settings'] {
        return {
            defaultMode: 'hover',
            autoSave: true,
            highlightColor: '#3b82f6'
        };
    }

    static async getAutomation(): Promise<StorageData['automation']> {
        const data = await this.getData();
        return data.automation;
    }

    static async saveAutomation(automation: StorageData['automation']): Promise<void> {
        const data = await this.getData();
        data.automation = automation || undefined;
        await chrome.storage.local.set({ [STORAGE_KEY]: data });
    }

    static async clearAllData(): Promise<void> {
        await chrome.storage.local.remove(STORAGE_KEY);
    }
}
