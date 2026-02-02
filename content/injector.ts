// Content script - the scraper brain that runs in the page context

import { ElementData, Message, ScraperState, AutomationState } from '../shared/schemas';
import { generateCSSSelector, generateXPath } from '../shared/utils';
import { findSimilarElements, extractStructuredData, detectTable, scrapeTable, PatternMatch } from '../shared/patterns';
import { detectFieldType } from '../shared/ai-detector';
import { detectPagination, clickNextPage, scrollNext } from '../shared/pagination';
import { WorkflowRecorder, WorkflowReplayer } from '../shared/workflow-recorder';

class ContentScraper {
    private state: ScraperState = {
        isActive: false,
        mode: 'hover',
        currentSession: null,
        highlightedElement: null
    };

    private automationState: AutomationState = {
        isPaginating: false,
        isScrolling: false
    };

    private highlightOverlay: HTMLDivElement | null = null;
    private selectedElements: Set<Element> = new Set();
    private activePatternSelector: string | null = null;

    private workflowRecorder = new WorkflowRecorder();
    private workflowReplayer = new WorkflowReplayer();

    constructor() {
        this.init();
    }

    private async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    private async initializeComponents() {
        this.createHighlightOverlay();
        this.setupMessageListener();
        this.setupEventListeners();

        // REHYDRATION: Check for active automation tasks
        await this.checkAutomationState();

        console.log('Content scraper initialized and rehydrated');
    }

    private async checkAutomationState() {
        try {
            const response = await this.sendMessage({ type: 'GET_AUTOMATION' });
            if (response && response.automation) {
                this.automationState = response.automation;

                if (this.automationState.isPaginating || this.automationState.isScrolling) {
                    this.state.isActive = true;
                    if (this.automationState.activePattern) {
                        this.activePatternSelector = this.automationState.activePattern.selector;
                        // Trigger initial capture on new page
                        setTimeout(() => this.captureAutoPattern(), 2000);

                        // If it's infinite scroll, keep the loop going
                        if (this.automationState.isScrolling) {
                            this.runInfiniteScrollLoop();
                        } else if (this.automationState.isPaginating) {
                            this.runPaginationLoop();
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Failed to load automation state:', e);
        }
    }

    private createHighlightOverlay() {
        if (!document.body) return;
        const existing = document.getElementById('scraper-highlight-overlay');
        if (existing) existing.remove();

        this.highlightOverlay = document.createElement('div');
        this.highlightOverlay.id = 'scraper-highlight-overlay';
        this.highlightOverlay.style.cssText = `
            position: absolute;
            pointer-events: none;
            border: 2px solid #3b82f6;
            background: rgba(59, 130, 246, 0.1);
            z-index: 999999;
            transition: all 0.1s ease;
            display: none;
        `;
        document.body.appendChild(this.highlightOverlay);
    }

    private setupEventListeners() {
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
        document.addEventListener('click', this.handleClick.bind(this), true);
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isActive) this.toggleScraper(false);
        });
    }

    private setupMessageListener() {
        chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
            switch (message.type) {
                case 'TOGGLE_SCRAPER':
                    this.toggleScraper(message.payload);
                    sendResponse({ success: true });
                    break;
                case 'START_PAGINATION':
                    this.startPagination();
                    sendResponse({ success: true });
                    break;
                case 'STOP_PAGINATION':
                    this.stopAutomation();
                    sendResponse({ success: true });
                    break;
                case 'START_INFINITE_SCROLL':
                    this.startInfiniteScroll();
                    sendResponse({ success: true });
                    break;
                case 'STOP_INFINITE_SCROLL':
                    this.stopAutomation();
                    sendResponse({ success: true });
                    break;
                case 'START_RECORDING':
                    this.workflowRecorder.start();
                    sendResponse({ success: true });
                    break;
                case 'STOP_RECORDING':
                    const workflow = this.workflowRecorder.stop();
                    sendResponse({ success: true, workflow });
                    break;
                case 'REPLAY_WORKFLOW':
                    this.workflowReplayer.replay(message.payload, (selector) => {
                        const el = document.querySelector(selector);
                        if (el) this.captureElement(el);
                    });
                    sendResponse({ success: true });
                    break;
            }
            return true;
        });
    }

    private handleMouseMove(event: MouseEvent) {
        if (!this.state.isActive) return;
        const element = event.target as Element;
        if (!element || element === this.highlightOverlay || element.id === 'scraper-highlight-overlay') return;
        this.highlightElement(element);
    }

    private handleClick(event: MouseEvent) {
        if (!this.state.isActive) return;

        const element = event.target as Element;
        if (!element || element.id === 'scraper-highlight-overlay') return;

        event.preventDefault();
        event.stopPropagation();

        this.workflowRecorder.recordScrapeAction(generateCSSSelector(element));

        if (event.ctrlKey || event.metaKey) {
            this.capturePattern(element);
        } else if (event.altKey) {
            this.captureTable(element);
        } else {
            this.captureElement(element);
        }
    }

    private highlightElement(element: Element) {
        if (!this.highlightOverlay) return;
        const rect = element.getBoundingClientRect();
        this.highlightOverlay.style.display = 'block';
        this.highlightOverlay.style.left = `${rect.left + window.scrollX}px`;
        this.highlightOverlay.style.top = `${rect.top + window.scrollY}px`;
        this.highlightOverlay.style.width = `${rect.width}px`;
        this.highlightOverlay.style.height = `${rect.height}px`;
    }

    private async captureElement(element: Element) {
        if (this.selectedElements.has(element)) return;

        const elementData = this.extractElementData(element);
        this.selectedElements.add(element);
        element.classList.add('scraper-selected');

        this.sendMessage({ type: 'ELEMENT_CAPTURED', payload: elementData });

        // AI Field Detection
        detectFieldType(element).then(aiResult => {
            if (aiResult.confidence > 0.6) {
                this.sendMessage({
                    type: 'AI_FIELD_DETECTED',
                    payload: { selector: elementData.selector, aiResult }
                });
            }
        });
    }

    private capturePattern(element: Element) {
        const pattern = findSimilarElements(element);
        if (!pattern || pattern.elements.length <= 1) {
            this.captureElement(element);
            return;
        }

        this.activePatternSelector = pattern.selector;
        this.saveAutomationState();

        pattern.elements.forEach((el, i) => {
            setTimeout(() => this.captureElement(el), i * 30);
        });

        this.sendMessage({
            type: 'PATTERN_DETECTED',
            payload: { count: pattern.elements.length, selector: pattern.selector, confidence: pattern.confidence }
        });
    }

    private captureAutoPattern() {
        if (!this.activePatternSelector) return;
        const elements = Array.from(document.querySelectorAll(this.activePatternSelector));
        const newOnes = elements.filter(el => !this.selectedElements.has(el));
        newOnes.forEach((el, i) => {
            setTimeout(() => this.captureElement(el), i * 30);
        });
    }

    private async captureTable(element: Element) {
        const table = detectTable(element);
        if (!table) return this.captureElement(element);

        const data = scrapeTable(table);
        this.sendMessage({ type: 'TABLE_CAPTURED', payload: { ...data, timestamp: Date.now() } });
        (table as HTMLElement).style.outline = '3px solid #10b981';
    }

    // AUTOMATION LOGIC
    private startPagination() {
        this.automationState.isPaginating = true;
        this.saveAutomationState();
        this.runPaginationLoop();
    }

    private async runPaginationLoop() {
        if (!this.automationState.isPaginating) return;

        console.log('🔄 Pagination step...');
        this.captureAutoPattern();

        // Find next button
        const info = detectPagination();
        if (info.type !== 'none' && info.selector) {
            await new Promise(r => setTimeout(r, 2000)); // Wait before clicking
            await clickNextPage(info.selector);
        } else {
            console.log('Finished pagination - no more buttons');
            this.stopAutomation();
        }
    }

    private startInfiniteScroll() {
        this.automationState.isScrolling = true;
        this.saveAutomationState();
        this.runInfiniteScrollLoop();
    }

    private async runInfiniteScrollLoop() {
        if (!this.automationState.isScrolling) return;

        console.log('♾️ Infinite scroll step...');
        const increased = await scrollNext();
        this.captureAutoPattern();

        if (increased) {
            setTimeout(() => this.runInfiniteScrollLoop(), 2000);
        } else {
            console.log('Finished infinite scroll - reached bottom');
            this.stopAutomation();
        }
    }

    private stopAutomation() {
        this.automationState.isPaginating = false;
        this.automationState.isScrolling = false;
        this.saveAutomationState();
    }

    private saveAutomationState() {
        const payload: AutomationState = {
            ...this.automationState,
            activePattern: this.activePatternSelector ? {
                selector: this.activePatternSelector,
                count: 0,
                confidence: 1
            } : undefined
        };
        this.sendMessage({ type: 'SAVE_AUTOMATION', payload });
    }

    private extractElementData(element: Element): ElementData {
        const rect = element.getBoundingClientRect();
        const structured = extractStructuredData(element);
        return {
            selector: generateCSSSelector(element),
            xpath: generateXPath(element),
            text: element.textContent?.trim() || '',
            html: element.innerHTML,
            attributes: { ...this.getAttributes(element), ...structured as any },
            boundingBox: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            timestamp: Date.now(),
            tagName: element.tagName.toLowerCase()
        };
    }

    private getAttributes(el: Element): Record<string, string> {
        const attrs: Record<string, string> = {};
        for (let i = 0; i < el.attributes.length; i++) {
            attrs[el.attributes[i].name] = el.attributes[i].value;
        }
        return attrs;
    }

    private toggleScraper(active: boolean) {
        this.state.isActive = active;
        document.body.style.cursor = active ? 'crosshair' : 'default';
        if (!active && this.highlightOverlay) {
            this.highlightOverlay.style.display = 'none';
        }
        this.sendMessage({ type: 'STATE_UPDATE', payload: { isActive: active } });
    }

    private async sendMessage(message: Message): Promise<any> {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage(message, (res) => resolve(res));
        });
    }
}

new ContentScraper();
