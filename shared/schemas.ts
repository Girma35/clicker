// Core data structures for the scraper

export interface ElementData {
  selector: string;
  xpath: string;
  text: string;
  html: string;
  attributes: Record<string, string>;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  timestamp: number;
  tagName: string;
}

export interface ScrapingSession {
  id: string;
  url: string;
  title: string;
  timestamp: number;
  elements: ElementData[];
  status: 'idle' | 'active' | 'paused' | 'completed';
  screenshot?: string;
  htmlSnapshot?: string;
}

export interface ScraperState {
  isActive: boolean;
  mode: 'hover' | 'click' | 'capture';
  currentSession: ScrapingSession | null;
  highlightedElement: ElementData | null;
}

export interface Message {
  type:
  | 'STATE_UPDATE'
  | 'ELEMENT_CAPTURED'
  | 'SESSION_SAVE'
  | 'SESSION_LOAD'
  | 'TOGGLE_SCRAPER'
  | 'CHANGE_MODE'
  | 'EXPORT_DATA'
  | 'GET_SESSIONS'
  | 'PATTERN_DETECTED'
  | 'TABLE_CAPTURED'
  | 'START_RECORDING'
  | 'STOP_RECORDING'
  | 'REPLAY_WORKFLOW'
  | 'START_PAGINATION'
  | 'STOP_PAGINATION'
  | 'START_INFINITE_SCROLL'
  | 'STOP_INFINITE_SCROLL'
  | 'GET_AUTOMATION'
  | 'SAVE_AUTOMATION'
  | 'AI_FIELD_DETECTED';
  payload?: any;
}

export interface ExportFormat {
  format: 'json' | 'csv';
  sessionId: string;
}

export interface AutomationState {
  isPaginating: boolean;
  isScrolling: boolean;
  activePattern?: {
    selector: string;
    count: number;
    confidence: number;
  };
  maxPages?: number;
  currentPage?: number;
}

export interface StorageData {
  sessions: ScrapingSession[];
  automation?: AutomationState;
  settings: {
    defaultMode: 'hover' | 'click' | 'capture';
    autoSave: boolean;
    highlightColor: string;
  };
}
