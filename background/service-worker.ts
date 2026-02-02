// Background service worker - orchestrator and message router

import { Message, ScrapingSession, ElementData } from '../shared/schemas';
import { StorageManager } from '../storage/index';
import { generateId } from '../shared/utils';

class BackgroundOrchestrator {
    private activeSessions: Map<number, ScrapingSession> = new Map();

    constructor() {
        this.init();
    }

    private init() {
        this.setupMessageListener();
        this.setupActionListener();
        console.log('Background service worker initialized');
    }

    private setupActionListener() {
        // Open sidebar when extension icon is clicked
        chrome.action.onClicked.addListener(async (tab) => {
            if (tab.id) {
                await chrome.sidePanel.open({ tabId: tab.id });
            }
        });
    }

    private setupMessageListener() {
        chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Keep channel open for async response
        });
    }

    private async handleMessage(message: Message, sender: any, sendResponse: Function) {
        try {
            switch (message.type) {
                case 'ELEMENT_CAPTURED':
                    await this.handleElementCaptured(message.payload, sender.tab?.id);
                    sendResponse({ success: true });
                    break;

                case 'SESSION_SAVE':
                    await this.handleSessionSave(message.payload);
                    sendResponse({ success: true });
                    break;

                case 'SESSION_LOAD':
                    const session = await this.handleSessionLoad(message.payload);
                    sendResponse({ success: true, session });
                    break;

                case 'GET_SESSIONS':
                    const sessions = await StorageManager.getSessions();
                    sendResponse({ success: true, sessions });
                    break;

                case 'EXPORT_DATA':
                    await this.handleExport(message.payload);
                    sendResponse({ success: true });
                    break;

                case 'STATE_UPDATE':
                    // Forward state updates to sidebar
                    this.broadcastToSidebar(message);
                    sendResponse({ success: true });
                    break;

                case 'GET_AUTOMATION':
                    const automation = await StorageManager.getAutomation();
                    sendResponse({ success: true, automation });
                    break;

                case 'SAVE_AUTOMATION':
                    await StorageManager.saveAutomation(message.payload);
                    sendResponse({ success: true });
                    break;

                case 'TOGGLE_SCRAPER':
                    // Forward to content script
                    if (sender.tab?.id) {
                        await chrome.tabs.sendMessage(sender.tab.id, message);
                    }
                    sendResponse({ success: true });
                    break;

                default:
                    sendResponse({ success: false, error: 'Unknown message type' });
            }
        } catch (error) {
            console.error('Error handling message:', error);
            sendResponse({ success: false, error: String(error) });
        }
    }

    private async handleElementCaptured(elementData: ElementData, tabId?: number) {
        if (!tabId) return;

        // Get or create session for this tab
        let session = this.activeSessions.get(tabId);

        if (!session) {
            const tab = await chrome.tabs.get(tabId);
            session = {
                id: generateId(),
                url: tab.url || '',
                title: tab.title || 'Untitled',
                timestamp: Date.now(),
                elements: [],
                status: 'active'
            };
            this.activeSessions.set(tabId, session);
        }

        // Add element to session
        session.elements.push(elementData);
        session.timestamp = Date.now(); // Update timestamp

        // Auto-save if enabled
        const settings = await StorageManager.getSettings();
        if (settings.autoSave) {
            await StorageManager.saveSession(session);
        }

        // Broadcast update to sidebar
        this.broadcastToSidebar({
            type: 'STATE_UPDATE',
            payload: { session }
        });
    }

    private async handleSessionSave(sessionData: ScrapingSession) {
        await StorageManager.saveSession(sessionData);

        // Update active session
        const tabId = Array.from(this.activeSessions.entries())
            .find(([_, session]) => session.id === sessionData.id)?.[0];

        if (tabId) {
            this.activeSessions.set(tabId, sessionData);
        }
    }

    private async handleSessionLoad(sessionId: string): Promise<ScrapingSession | null> {
        return await StorageManager.getSession(sessionId);
    }

    private async handleExport(payload: { sessionId: string; format: 'json' | 'csv' }) {
        const session = await StorageManager.getSession(payload.sessionId);
        if (!session) return;

        // Export logic will be handled by the dashboard
        // This is just a placeholder for future enhancement
        console.log('Export requested:', payload);
    }

    private broadcastToSidebar(message: Message) {
        // Send message to all sidebar instances
        chrome.runtime.sendMessage(message).catch(() => {
            // Sidebar might not be open, ignore error
        });
    }
}

// Initialize the background orchestrator
new BackgroundOrchestrator();
