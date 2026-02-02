// Dashboard logic

import { formatTimestamp, exportToJSON, exportToCSV, downloadFile } from '../shared/utils.js';

class Dashboard {
  constructor() {
    this.sessions = [];
    this.currentSession = null;

    this.initializeElements();
    this.setupEventListeners();
    this.loadSessions();
  }

  initializeElements() {
    this.totalSessions = document.getElementById('totalSessions');
    this.totalElements = document.getElementById('totalElements');
    this.uniquePages = document.getElementById('uniquePages');
    this.sessionsTable = document.getElementById('sessionsTable');
    this.emptyState = document.getElementById('emptyState');
    this.searchInput = document.getElementById('searchInput');
    this.sessionModal = document.getElementById('sessionModal');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalBody = document.getElementById('modalBody');
    this.modalClose = document.getElementById('modalClose');
    this.exportJsonBtn = document.getElementById('exportJsonBtn');
    this.exportCsvBtn = document.getElementById('exportCsvBtn');
    this.refreshBtn = document.getElementById('refreshBtn');
    this.clearAllBtn = document.getElementById('clearAllBtn');
  }

  setupEventListeners() {
    this.searchInput.addEventListener('input', () => this.filterSessions());
    this.modalClose.addEventListener('click', () => this.closeModal());
    this.sessionModal.addEventListener('click', (e) => {
      if (e.target === this.sessionModal) this.closeModal();
    });
    this.exportJsonBtn.addEventListener('click', () => this.exportSession('json'));
    this.exportCsvBtn.addEventListener('click', () => this.exportSession('csv'));
    this.refreshBtn.addEventListener('click', () => this.loadSessions());
    this.clearAllBtn.addEventListener('click', () => this.clearAllSessions());
  }

  async loadSessions() {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GET_SESSIONS'
      });

      if (response.success) {
        this.sessions = response.sessions || [];
        this.updateStats();
        this.renderSessions();
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  }

  updateStats() {
    const totalElements = this.sessions.reduce((sum, session) => sum + session.elements.length, 0);
    const uniquePages = new Set(this.sessions.map(s => s.url)).size;

    this.totalSessions.textContent = this.sessions.length.toString();
    this.totalElements.textContent = totalElements.toString();
    this.uniquePages.textContent = uniquePages.toString();
  }

  renderSessions() {
    if (this.sessions.length === 0) {
      this.sessionsTable.innerHTML = '';
      this.emptyState.classList.add('show');
      return;
    }

    this.emptyState.classList.remove('show');
    this.sessionsTable.innerHTML = '';

    // Sort by timestamp (newest first)
    const sortedSessions = [...this.sessions].sort((a, b) => b.timestamp - a.timestamp);

    sortedSessions.forEach(session => {
      const row = this.createSessionRow(session);
      this.sessionsTable.appendChild(row);
    });
  }

  createSessionRow(session) {
    const row = document.createElement('div');
    row.className = 'session-row';

    const date = new Date(session.timestamp);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    row.innerHTML = `
      <div class="session-info">
        <div class="session-title">${session.title || 'Untitled Session'}</div>
        <div class="session-url">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          ${session.url}
        </div>
        <div class="session-meta">
          <span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            ${formattedDate} at ${formattedTime}
          </span>
        </div>
      </div>

      <div class="session-stats">
        <div class="stat-badge">
          <span class="stat-badge-value">${session.elements.length}</span>
          <span class="stat-badge-label">Elements</span>
        </div>
      </div>

      <div class="session-actions">
        <button class="action-btn view" title="View Details" data-id="${session.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </button>
        <button class="action-btn delete" title="Delete" data-id="${session.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    `;

    // Add event listeners
    const viewBtn = row.querySelector('.view');
    const deleteBtn = row.querySelector('.delete');

    viewBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.viewSession(session);
    });

    deleteBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (confirm('Are you sure you want to delete this session?')) {
        await this.deleteSession(session.id);
      }
    });

    row.addEventListener('click', () => this.viewSession(session));

    return row;
  }

  viewSession(session) {
    this.currentSession = session;
    this.modalTitle.textContent = session.title || 'Session Details';

    this.modalBody.innerHTML = `
      <div style="margin-bottom: 24px;">
        <div class="element-label">URL</div>
        <div style="color: var(--text-secondary); font-size: 14px; word-break: break-all;">${session.url}</div>
      </div>
      <div style="margin-bottom: 24px;">
        <div class="element-label">Captured: ${new Date(session.timestamp).toLocaleString()}</div>
      </div>
      <div class="element-label" style="margin-bottom: 16px;">Elements (${session.elements.length})</div>
      ${session.elements.map((element, index) => `
        <div class="element-card">
          <div class="element-card-header">
            <span class="element-tag">${element.tagName}</span>
            <span class="element-time">${new Date(element.timestamp).toLocaleTimeString()}</span>
          </div>
          <div class="element-content">
            <div class="element-label">Text Content</div>
            <div class="element-text">${element.text || '<empty>'}</div>
          </div>
          <div class="element-content">
            <div class="element-label">CSS Selector</div>
            <div class="element-selector">${element.selector}</div>
          </div>
          <div class="element-content">
            <div class="element-label">XPath</div>
            <div class="element-selector">${element.xpath}</div>
          </div>
        </div>
      `).join('')}
    `;

    this.sessionModal.classList.add('show');
  }

  closeModal() {
    this.sessionModal.classList.remove('show');
    this.currentSession = null;
  }

  async deleteSession(sessionId) {
    try {
      // Remove from local array
      this.sessions = this.sessions.filter(s => s.id !== sessionId);

      // Update storage
      await chrome.storage.local.set({
        scraper_data: {
          sessions: this.sessions,
          settings: {
            defaultMode: 'hover',
            autoSave: true,
            highlightColor: '#3b82f6'
          }
        }
      });

      this.updateStats();
      this.renderSessions();
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  }

  async clearAllSessions() {
    if (!confirm('Are you sure you want to delete ALL sessions? This cannot be undone.')) {
      return;
    }

    try {
      this.sessions = [];
      await chrome.storage.local.set({
        scraper_data: {
          sessions: [],
          settings: {
            defaultMode: 'hover',
            autoSave: true,
            highlightColor: '#3b82f6'
          }
        }
      });

      this.updateStats();
      this.renderSessions();
    } catch (error) {
      console.error('Failed to clear sessions:', error);
    }
  }

  exportSession(format) {
    if (!this.currentSession) return;

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `scraper-session-${timestamp}.${format}`;

    if (format === 'json') {
      const content = exportToJSON(this.currentSession);
      downloadFile(content, filename, 'application/json');
    } else {
      const content = exportToCSV(this.currentSession.elements);
      downloadFile(content, filename, 'text/csv');
    }
  }

  filterSessions() {
    const query = this.searchInput.value.toLowerCase();

    if (!query) {
      this.renderSessions();
      return;
    }

    const filtered = this.sessions.filter(session =>
      session.title.toLowerCase().includes(query) ||
      session.url.toLowerCase().includes(query)
    );

    // Render filtered sessions
    this.sessionsTable.innerHTML = '';
    filtered.forEach(session => {
      const row = this.createSessionRow(session);
      this.sessionsTable.appendChild(row);
    });

    if (filtered.length === 0) {
      this.emptyState.classList.add('show');
    } else {
      this.emptyState.classList.remove('show');
    }
  }
}

// Initialize dashboard
new Dashboard();
