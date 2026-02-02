# Interactive Web Scraper

A user-driven, cursor-based Chrome extension for ethical web scraping. This tool puts you in complete control of data extraction through an intuitive, interactive interface.

## 🔥 **NEW! Power Features**

- **🚀 Pattern Detection**: Ctrl+Click to capture ALL similar elements at once (100x faster!)
- **📊 Table Scraper**: Alt+Click to scrape entire HTML tables instantly
- **💡 Smart Data Extraction**: Auto-detect prices, dates, emails, and phone numbers
- **⚡ Bulk Operations**: Capture 100 elements with 1 click instead of 100 clicks

## 🎯 Key Features

- **Cursor-Driven Scraping**: Hover and click to select elements - no coding required
- **Live Preview**: See extracted data in real-time as you scrape
- **Mobile-Style Sidebar**: Beautiful, persistent UI panel for control and feedback
- **Session Management**: Save, view, and export your scraping sessions
- **Multiple Export Formats**: Export data as JSON or CSV
- **Ethical by Design**: User-driven approach avoids aggressive crawling and bot detection

## 🏗️ Architecture

This is a **truth-first** approach to web scraping:

- **Browser is the execution environment** - no headless infrastructure
- **User interaction defines what gets scraped** - cursor/hover/click driven
- **No botting at scale** - human-in-the-loop design
- **Extremely powerful** for research, analysis, and ethical use cases

### Components

```
chrome-extension/
├── manifest.json          # Extension configuration
├── background/            # Service worker (orchestrator)
├── content/               # Content script (scraper brain)
├── sidebar/               # Mobile-style UI panel
├── dashboard/             # Session management page
├── storage/               # Chrome Storage API wrapper
└── shared/                # Schemas and utilities
```

## 🚀 Installation

### From Source

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the extension**:
   ```bash
   npm run build
   ```

3. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist` folder

## 📖 How to Use

### Basic Usage

1. **Activate the Extension**:
   - Click the extension icon in Chrome toolbar
   - The sidebar will open on the right side

2. **Start Scraping**:
   - Click "Start Scraping" in the sidebar
   - Move your cursor over elements on the page
   - Elements will be highlighted as you hover
   - Click to capture an element

3. **View Captured Data**:
   - See live preview in the sidebar
   - View all captured elements in the list
   - Check stats (element count, duration)

4. **Save Your Session**:
   - Click "Save Session" to persist your data
   - Access saved sessions from the Dashboard

5. **Export Data**:
   - Open Dashboard to view all sessions
   - Click on a session to view details
   - Export as JSON or CSV

### 🔥 Power Features

**Pattern Detection** (Capture all similar elements):
- Hold **Ctrl** (or **Cmd** on Mac)
- Click any element
- All similar elements are captured automatically!
- Example: Ctrl+Click one product → captures ALL products

**Table Scraping** (Capture entire tables):
- Hold **Alt**
- Click any cell in a table
- Entire table is captured with structure!
- Perfect for data tables, pricing tables, etc.

**Keyboard Shortcuts**:
- **Click**: Capture single element
- **Ctrl+Click**: Pattern detection (bulk capture)
- **Alt+Click**: Table scraping
- **ESC**: Stop scraping

📚 **See [POWER_GUIDE.md](POWER_GUIDE.md) for detailed power features documentation**

## 🎨 Features in Detail

### Cursor-Driven Interaction

The extension tracks your cursor movement and highlights DOM elements in real-time. This approach:

- ✅ Works on JavaScript-heavy pages automatically
- ✅ No proxy infrastructure needed
- ✅ Dramatically reduces legal risk
- ✅ Extremely transparent and explainable
- ✅ Easy onboarding for non-technical users

### Three Scraping Modes

- **Hover Mode**: Highlight elements as you move your cursor
- **Click Mode**: Capture elements only when clicked
- **Capture Mode**: Advanced selection with children

### Data Extraction

For each element, the extension captures:

- CSS Selector (optimized for uniqueness)
- XPath (fallback selector)
- Text content
- HTML content
- All attributes
- Bounding box coordinates
- Timestamp

### Storage & Sessions

- Sessions are stored locally using Chrome Storage API
- Each session includes:
  - Page URL and title
  - Timestamp
  - All captured elements
  - Session status (active/completed)

## 🎯 Perfect For

- 📊 **Researchers**: Collect data for analysis
- 📰 **Journalists**: Gather information from multiple sources
- 📈 **Analysts**: Extract competitive intelligence
- 🛠️ **Developers**: Test and debug web applications
- 📱 **Product Managers**: Research features and UX patterns
- 🔍 **SEO Teams**: Analyze page structure and content

## 🔒 Ethical & Legal

This extension is designed with ethics in mind:

- **User-driven**: No autonomous crawling
- **Transparent**: You see exactly what's being captured
- **Respectful**: Works within browser security boundaries
- **No bypassing**: Doesn't circumvent authentication or paywalls
- **Human-in-the-loop**: Every action requires user interaction

## 🛠️ Development

### Build Commands

```bash
# One-time build
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch

# Clean build artifacts
npm run clean
```

### Project Structure

- **`background/service-worker.ts`**: Central message router and session manager
- **`content/injector.ts`**: DOM interaction and element detection
- **`sidebar/`**: Control panel UI (HTML/CSS/JS)
- **`dashboard/`**: Session management interface
- **`storage/index.ts`**: Chrome Storage API wrapper
- **`shared/`**: TypeScript schemas and utility functions

## 📦 Technologies

- **TypeScript**: Type-safe development
- **esbuild**: Fast bundling and compilation
- **Chrome Extension Manifest V3**: Latest extension API
- **Chrome Storage API**: Local data persistence
- **Vanilla JS/CSS**: No framework dependencies

## 🎨 Design Philosophy

The UI is designed to be:

- **Premium**: Modern gradients, smooth animations, glassmorphism
- **Mobile-like**: Narrow, vertical sidebar mimicking a phone screen
- **Dark Mode**: Easy on the eyes for extended use
- **Responsive**: Adapts to different screen sizes
- **Intuitive**: Clear visual feedback for all actions

## 🚧 Limitations

This is a **tool**, not a **botnet**:

- ❌ Not for massive-scale scraping
- ❌ Not fully autonomous (by design)
- ❌ Browser memory constraints apply
- ✅ Perfect for research and analysis
- ✅ Ideal for ethical data collection

## 📝 License

MIT License - feel free to use and modify for your needs.

## 🤝 Contributing

Contributions are welcome! This project demonstrates the perfect balance between:

- **AI capabilities**: Code generation, DOM traversal, UI scaffolding
- **Human judgment**: Interaction flow, UX boundaries, ethical defaults

## 🔮 Future Enhancements

Potential features for future versions:

- [x] **Pattern detection** (auto-detect similar elements) ✅ **IMPLEMENTED!**
- [x] **Table scraping** (capture entire tables) ✅ **IMPLEMENTED!**
- [x] **Smart data extraction** (prices, dates, emails) ✅ **IMPLEMENTED!**
- [ ] Pagination handler (auto-click "Next" button)
- [ ] Infinite scroll support
- [ ] Workflow recorder (record and replay)
- [ ] Scheduled scraping reminders
- [ ] Cloud sync for sessions
- [ ] Advanced filtering and search
- [ ] Custom export templates
- [ ] Collaborative sessions

## 📞 Support

For issues, questions, or suggestions, please open an issue on the repository.

---

**Built with ❤️ for ethical web scraping**
