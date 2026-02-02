// Sidebar UI logic

import { formatTimestamp, truncateText } from '../shared/utils.js';

class SidebarUI {
    constructor() {
        this.isActive = false;
        this.currentMode = 'hover';
        this.currentSession = null;
        this.sessionStartTime = 0;
        this.timerInterval = null;

        // Automation states
        this.isPaginating = false;
        this.isScrolling = false;
        this.isRecording = false;

        this.initializeElements();
        this.setupEventListeners();
        this.setupMessageListener();
        this.loadCurrentPage();
        this.checkAutomationState();
    }

    async checkAutomationState() {
        const response = await chrome.runtime.sendMessage({ type: 'GET_AUTOMATION' });
        if (response && response.automation) {
            const auth = response.automation;
            this.isPaginating = auth.isPaginating;
            this.isScrolling = auth.isScrolling;

            this.paginationBtn.classList.toggle('active', this.isPaginating);
            this.scrollBtn.classList.toggle('active', this.isScrolling);
        }
    }

    initializeElements() {
        this.toggleBtn = document.getElementById('toggleBtn');
        this.statusDot = document.getElementById('statusDot');
        this.statusText = document.getElementById('statusText');
        this.pageUrl = document.getElementById('pageUrl');
        this.elementCount = document.getElementById('elementCount');
        this.sessionTime = document.getElementById('sessionTime');
        this.previewCard = document.getElementById('previewCard');
        this.elementsList = document.getElementById('elementsList');
        this.elementBadge = document.getElementById('elementBadge');
        this.saveBtn = document.getElementById('saveBtn');
        this.dashboardBtn = document.getElementById('dashboardBtn');
        this.modeButtons = document.querySelectorAll('.mode-btn');

        // Advanced tool buttons
        this.paginationBtn = document.getElementById('paginationBtn');
        this.scrollBtn = document.getElementById('scrollBtn');
        this.recordBtn = document.getElementById('recordBtn');
    }

    setupEventListeners() {
        // Toggle scraper
        this.toggleBtn.addEventListener('click', () => {
            this.toggleScraper();
        });

        // Mode selection
        this.modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                this.changeMode(mode);
            });
        });

        // Save session
        this.saveBtn.addEventListener('click', () => {
            this.saveSession();
        });

        // Open dashboard
        this.dashboardBtn.addEventListener('click', () => {
            this.openDashboard();
        });

        // Advanced Tools
        this.paginationBtn.addEventListener('click', () => this.togglePagination());
        this.scrollBtn.addEventListener('click', () => this.toggleInfiniteScroll());
        this.recordBtn.addEventListener('click', () => this.toggleRecording());
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((message) => {
            switch (message.type) {
                case 'ELEMENT_CAPTURED':
                    this.handleElementCaptured(message.payload);
                    break;
                case 'STATE_UPDATE':
                    this.handleStateUpdate(message.payload);
                    break;
                case 'PATTERN_DETECTED':
                    this.handlePatternDetected(message.payload);
                    break;
                case 'TABLE_CAPTURED':
                    this.handleTableCaptured(message.payload);
                    break;
                case 'AI_FIELD_DETECTED':
                    this.handleAIFieldDetected(message.payload);
                    break;
            }
        });
    }

    async loadCurrentPage() {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
            this.pageUrl.textContent = tab.url || 'Unknown page';
            this.pageUrl.title = tab.url || '';
        }
    }

    async toggleScraper() {
        this.isActive = !this.isActive;

        // Update UI
        this.updateToggleButton();
        this.updateStatus();

        // Send message to content script
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            if (tab && tab.id) {
                try {
                    await chrome.tabs.sendMessage(tab.id, {
                        type: 'TOGGLE_SCRAPER',
                        payload: this.isActive
                    });
                } catch (error) {
                    console.error('Error sending message to content script:', error);
                    this.showNotification('Please refresh the page and try again', 'error');
                    this.isActive = !this.isActive;
                    this.updateToggleButton();
                    this.updateStatus();
                    return;
                }
            }
        } catch (error) {
            console.error('Error getting active tab:', error);
            return;
        }

        if (this.isActive) {
            this.startSession();
        } else {
            this.stopSession();
        }
    }

    async changeMode(mode) {
        this.currentMode = mode;
        this.modeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab && tab.id) {
                await chrome.tabs.sendMessage(tab.id, {
                    type: 'CHANGE_MODE',
                    payload: mode
                });
            }
        } catch (error) {
            console.error('Error changing mode:', error);
        }
    }

    // Advanced Automation Handlers
    async togglePagination() {
        if (!this.isActive) {
            this.showNotification('Start scraping first!', 'error');
            return;
        }

        this.isPaginating = !this.isPaginating;
        this.paginationBtn.classList.toggle('active', this.isPaginating);

        const type = this.isPaginating ? 'START_PAGINATION' : 'STOP_PAGINATION';
        await this.sendMessageToActiveTab(type, { maxPages: 5 });
        this.showNotification(this.isPaginating ? 'Auto-pagination started' : 'Auto-pagination stopped', 'success');
    }

    async toggleInfiniteScroll() {
        if (!this.isActive) {
            this.showNotification('Start scraping first!', 'error');
            return;
        }

        this.isScrolling = !this.isScrolling;
        this.scrollBtn.classList.toggle('active', this.isScrolling);

        const type = this.isScrolling ? 'START_INFINITE_SCROLL' : 'STOP_INFINITE_SCROLL';
        await this.sendMessageToActiveTab(type, { maxScrolls: 10 });
        this.showNotification(this.isScrolling ? 'Infinite scroll started' : 'Infinite scroll stopped', 'success');
    }

    async toggleRecording() {
        this.isRecording = !this.isRecording;
        this.recordBtn.classList.toggle('active', this.isRecording);

        const type = this.isRecording ? 'START_RECORDING' : 'STOP_RECORDING';
        const response = await this.sendMessageToActiveTab(type);

        if (!this.isRecording && response?.workflow) {
            this.showNotification('Workflow recorded!', 'success');
            console.log('Recorded Workflow:', response.workflow);
            // In a real app, you'd save this to storage
        } else {
            this.showNotification(this.isRecording ? 'Recording started' : 'Recording stopped', 'success');
        }
    }

    async sendMessageToActiveTab(type, payload = {}) {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab && tab.id) {
                return await chrome.tabs.sendMessage(tab.id, { type, payload });
            }
        } catch (error) {
            console.error(`Error sending ${type}:`, error);
        }
    }

    updateToggleButton() {
        if (this.isActive) {
            this.toggleBtn.classList.add('active');
            this.toggleBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="6" y="6" width="12" height="12"></rect>
        </svg>
        Stop Scraping
      `;
        } else {
            this.toggleBtn.classList.remove('active');
            this.toggleBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Start Scraping
      `;
        }
    }

    updateStatus() {
        if (this.isActive) {
            this.statusDot.classList.add('active');
            this.statusText.textContent = 'Scraping Active';
        } else {
            this.statusDot.classList.remove('active');
            this.statusText.textContent = 'Idle';
        }
    }

    startSession() {
        this.sessionStartTime = Date.now();
        this.currentSession = {
            id: `session-${Date.now()}`,
            url: this.pageUrl.textContent || '',
            title: document.title,
            timestamp: this.sessionStartTime,
            elements: [],
            status: 'active'
        };

        this.timerInterval = window.setInterval(() => {
            this.updateTimer();
        }, 1000);

        this.saveBtn.disabled = false;
    }

    stopSession() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        if (this.currentSession) {
            this.currentSession.status = 'completed';
        }
    }

    updateTimer() {
        if (!this.sessionStartTime) return;
        const elapsed = Math.floor((Date.now() - this.sessionStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        this.sessionTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    handleElementCaptured(elementData) {
        if (!this.currentSession) return;
        this.currentSession.elements.push(elementData);
        this.elementCount.textContent = this.currentSession.elements.length.toString();
        this.elementBadge.textContent = this.currentSession.elements.length.toString();
        this.updatePreview(elementData);
        this.addElementToList(elementData);
    }

    handleAIFieldDetected(payload) {
        // Find the element in the list and update its label
        const items = this.elementsList.querySelectorAll('.element-item');
        for (const item of items) {
            const selector = item.querySelector('.element-selector').textContent;
            if (selector === truncateText(payload.selector, 35)) {
                const tag = item.querySelector('.element-tag');
                tag.textContent = `${tag.textContent} (${payload.aiResult.suggestedLabel})`;
                tag.style.background = 'var(--success)';
                item.title = `AI Reasoning: ${payload.aiResult.reasoning}`;
                break;
            }
        }
    }

    updatePreview(elementData) {
        this.previewCard.innerHTML = `
      <div class="preview-content">
        <span class="preview-tag">${elementData.tagName}</span>
        <div class="preview-text">${truncateText(elementData.text, 100)}</div>
        <div class="preview-selector">${truncateText(elementData.selector, 40)}</div>
      </div>
    `;
    }

    addElementToList(elementData) {
        const item = document.createElement('div');
        item.className = 'element-item';
        const time = new Date(elementData.timestamp).toLocaleTimeString();

        item.innerHTML = `
      <div class="element-header">
        <span class="element-tag">${elementData.tagName}</span>
        <span class="element-time">${time}</span>
      </div>
      <div class="element-text">${truncateText(elementData.text, 60)}</div>
      <div class="element-selector">${truncateText(elementData.selector, 35)}</div>
    `;

        this.elementsList.insertBefore(item, this.elementsList.firstChild);
    }

    async saveSession() {
        if (!this.currentSession) return;
        try {
            await chrome.runtime.sendMessage({
                type: 'SESSION_SAVE',
                payload: this.currentSession
            });
            this.showNotification('Session saved successfully!', 'success');
        } catch (error) {
            console.error('Failed to save session:', error);
            this.showNotification('Failed to save session', 'error');
        }
    }

    openDashboard() {
        chrome.tabs.create({ url: chrome.runtime.getURL('dashboard/dashboard.html') });
    }

    handleStateUpdate(payload) {
        if (payload.session) {
            this.currentSession = payload.session;
            this.elementCount.textContent = payload.session.elements.length.toString();
            this.elementBadge.textContent = payload.session.elements.length.toString();
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
            color: white;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    handlePatternDetected(payload) {
        this.showNotification(`🔥 Pattern: ${payload.count} elements captured!`, 'success');
    }

    handleTableCaptured(payload) {
        this.showNotification(`📊 Table: ${payload.rowCount} rows captured!`, 'success');
    }
}

new SidebarUI();
