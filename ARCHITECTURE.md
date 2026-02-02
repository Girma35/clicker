# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Chrome Browser                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Web Page   │         │   Sidebar    │                  │
│  │              │         │   (Panel)    │                  │
│  │  ┌────────┐  │         │              │                  │
│  │  │Content │  │◄────────┤  Controls    │                  │
│  │  │Script  │  │         │  Preview     │                  │
│  │  │        │  │         │  Stats       │                  │
│  │  │Injector│  │         │  Elements    │                  │
│  │  └────┬───┘  │         └──────┬───────┘                  │
│  │       │      │                │                           │
│  │   Highlights │                │                           │
│  │   Captures   │                │                           │
│  └───────┼──────┘                │                           │
│          │                       │                           │
│          │    ┌──────────────────┼────────────┐             │
│          │    │                  │            │             │
│          └────►  Background      ◄────────────┘             │
│               │  Service Worker  │                           │
│               │                  │                           │
│               │  • Orchestrator  │                           │
│               │  • Message Router│                           │
│               │  • Session Mgmt  │                           │
│               └────────┬─────────┘                           │
│                        │                                     │
│                        ▼                                     │
│               ┌─────────────────┐                            │
│               │ Chrome Storage  │                            │
│               │                 │                            │
│               │  • Sessions     │                            │
│               │  • Settings     │                            │
│               │  • Elements     │                            │
│               └─────────────────┘                            │
│                        │                                     │
│                        ▼                                     │
│               ┌─────────────────┐                            │
│               │   Dashboard     │                            │
│               │                 │                            │
│               │  • View Sessions│                            │
│               │  • Export Data  │                            │
│               │  • Manage       │                            │
│               └─────────────────┘                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Interaction Flow

```
User Hovers/Clicks Element
         │
         ▼
Content Script Detects
         │
         ▼
Extract Element Data
  • CSS Selector
  • XPath
  • Text Content
  • Attributes
  • Bounding Box
         │
         ▼
Send to Background Worker
         │
         ▼
Background Adds to Session
         │
         ▼
Broadcast to Sidebar
         │
         ▼
Sidebar Updates UI
  • Preview
  • Stats
  • Element List
```

### 2. Session Save Flow

```
User Clicks "Save Session"
         │
         ▼
Sidebar Sends Save Message
         │
         ▼
Background Worker Receives
         │
         ▼
Store in Chrome Storage
         │
         ▼
Confirm Success
         │
         ▼
Show Notification
```

### 3. Dashboard View Flow

```
User Opens Dashboard
         │
         ▼
Request Sessions from Storage
         │
         ▼
Background Retrieves Data
         │
         ▼
Dashboard Renders Sessions
         │
         ▼
User Selects Session
         │
         ▼
Display Element Details
         │
         ▼
Export Options Available
```

## Component Responsibilities

### Content Script (`content/injector.ts`)

**Role**: The scraper brain running inside web pages

**Responsibilities**:
- Listen to mouse movement
- Detect hovered DOM nodes
- Generate CSS selectors and XPath
- Extract element data
- Highlight elements visually
- Send structured messages to background

**Key Features**:
- No HTTP fetching
- Works within browser security
- Real-time element detection
- Visual feedback

### Background Service Worker (`background/service-worker.ts`)

**Role**: Central orchestrator and message router

**Responsibilities**:
- Route messages between components
- Manage active sessions
- Coordinate storage operations
- Handle export requests
- Broadcast state updates

**Key Features**:
- Stateless at runtime
- Stateful via storage
- Central communication hub

### Sidebar UI (`sidebar/`)

**Role**: Control panel and live feedback

**Responsibilities**:
- Display scraping status
- Show live preview
- Control scraping modes
- Trigger save/export
- Display statistics

**Key Features**:
- Mobile-phone-like design
- Real-time updates
- Interactive controls
- Visual feedback

### Dashboard (`dashboard/`)

**Role**: Session management interface

**Responsibilities**:
- List all sessions
- Display session details
- Export functionality
- Search and filter
- Delete sessions

**Key Features**:
- Full-page interface
- Detailed view
- Export to JSON/CSV
- Session management

### Storage Layer (`storage/index.ts`)

**Role**: Data persistence wrapper

**Responsibilities**:
- Save/load sessions
- Manage settings
- Handle storage operations
- Provide data access

**Key Features**:
- Chrome Storage API
- Simple interface
- Error handling

## Message Protocol

### Message Types

```typescript
'TOGGLE_SCRAPER'    // Activate/deactivate scraping
'CHANGE_MODE'       // Switch between hover/click/capture
'ELEMENT_CAPTURED'  // New element captured
'STATE_UPDATE'      // State changed
'SESSION_SAVE'      // Save current session
'SESSION_LOAD'      // Load existing session
'GET_SESSIONS'      // Retrieve all sessions
'EXPORT_DATA'       // Export session data
```

### Message Flow

```
Content Script ──► Background Worker ──► Sidebar
      ▲                    │                 │
      │                    ▼                 │
      │            Chrome Storage            │
      │                                      │
      └──────────────────────────────────────┘
```

## Security Model

### Permissions Used

- **`storage`**: Local data persistence
- **`activeTab`**: Access to current tab
- **`scripting`**: Inject content script
- **`sidePanel`**: Display sidebar UI
- **`<all_urls>`**: Work on any website

### Security Boundaries

1. **No External Requests**: All operations are local
2. **User-Driven**: No autonomous actions
3. **Browser Sandbox**: Respects Chrome security
4. **No Authentication Bypass**: Works with visible content only
5. **Local Storage Only**: No cloud sync by default

## Performance Considerations

### Memory Management

- Sessions stored in Chrome Storage (limited to ~10MB)
- Large datasets may require IndexedDB (future enhancement)
- Active session kept in memory during scraping

### Optimization Strategies

1. **Debounced Hover**: Prevent excessive highlighting
2. **Lazy Loading**: Dashboard loads sessions on demand
3. **Efficient Selectors**: Generate minimal, unique selectors
4. **Batch Updates**: Group UI updates to reduce reflows

## Extension Lifecycle

### Installation

```
User Installs Extension
         │
         ▼
Background Worker Initializes
         │
         ▼
Default Settings Created
         │
         ▼
Extension Icon Appears
```

### Active Usage

```
User Clicks Icon
         │
         ▼
Sidebar Opens
         │
         ▼
Content Script Injected
         │
         ▼
Ready to Scrape
```

### Session Lifecycle

```
Start Scraping
         │
         ▼
Create New Session
         │
         ▼
Capture Elements
         │
         ▼
Stop Scraping
         │
         ▼
Save Session (optional)
         │
         ▼
View in Dashboard
```

## Technology Stack

### Core Technologies

- **Manifest V3**: Latest Chrome extension API
- **TypeScript**: Type-safe development
- **esbuild**: Fast bundling
- **Vanilla JS/CSS**: No framework dependencies

### APIs Used

- **Chrome Extension API**: Core functionality
- **Chrome Storage API**: Data persistence
- **Chrome Tabs API**: Tab management
- **Chrome Runtime API**: Messaging
- **DOM API**: Element interaction

## Design Principles

### 1. Truth-First Architecture

- Browser is the execution environment
- User interaction defines behavior
- No hidden automation
- Transparent operations

### 2. Human-in-the-Loop

- Every action requires user input
- Visual feedback for all operations
- Explainable data extraction
- Ethical by design

### 3. Simplicity

- No complex dependencies
- Clear component boundaries
- Straightforward data flow
- Easy to understand and modify

### 4. Extensibility

- Modular architecture
- Clear interfaces
- Easy to add features
- Plugin-friendly design

## Future Enhancements

### Planned Features

1. **Pattern Detection**: Auto-detect similar elements
2. **IndexedDB Support**: Handle larger datasets
3. **Cloud Sync**: Optional backup to user's storage
4. **Advanced Filters**: Complex element selection
5. **Automation Recording**: Record and replay actions
6. **Collaborative Sessions**: Share sessions with team

### Architectural Improvements

1. **Worker Threads**: Offload heavy processing
2. **Streaming Export**: Handle large datasets
3. **Compression**: Reduce storage footprint
4. **Caching**: Improve performance
5. **Offline Support**: Work without internet

---

**This architecture balances power, simplicity, and ethics.**
