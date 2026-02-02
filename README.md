# 🖱️ Clicker - Elite AI Web Scraper

A powerful, user-driven, AI-enhanced Chrome extension for ethical web scraping. **Clicker** puts you in complete control of data extraction through an intuitive interface, Gemini AI intelligence, and advanced automation.

---

## 📸 **Screenshots**



---

## ⚡ **Quick Install (No Coding Required)**

If you just want to use the extension without setting up a development environment:

1.  **Download the Extension**: [clicker-extension.zip](clicker-extension.zip) (Download from this repository)
2.  **Unzip the file**: Extract the contents to a folder on your computer.
3.  **Load in Chrome**:
    - Open Chrome and navigate to `chrome://extensions/`
    - Enable **"Developer mode"** (top right toggle)
    - Click **"Load unpacked"**
    - Select the `dist` folder inside the extracted directory.

---

## 🔥 **ELITE Power Features**

- **🤖 Gemini AI Field Detection**: Automatically identifies if elements are prices, titles, dates, or emails using Google's Gemini Pro API.
- **🚀 Pattern Detection**: Ctrl+Click to capture ALL similar elements at once (100x faster!)
- **🔄 Auto-Pagination**: Automatically detects and clicks "Next" buttons to scrape multiple pages.
- **♾️ Infinite Scroll Support**: Smoothly scrolls and auto-captures new content as it loads.
- **⏺️ Workflow Recorder**: Record your clicks and inputs to replay complex scraping sequences.
- **📊 Table Scraper**: Alt+Click to scrape entire HTML tables instantly.

---

## 🎯 Key Features

- **Cursor-Driven Scraping**: Hover and click to select elements - no coding required.
- **Live Preview**: See extracted data in real-time as you scrape.
- **Mobile-Style Sidebar**: Beautiful, premium UI panel for control and feedback.
- **Session Management**: Save, view, and export your scraping sessions.
- **Multiple Export Formats**: Export data as JSON or CSV.
- **Ethical by Design**: User-driven approach avoids aggressive crawling and bot detection.

---

## 🏗️ Architecture

Clicker uses a **truth-first** approach:

- **Browser-Native**: No headless infrastructure needed.
- **Human-in-the-Loop**: User defines what is valuable, AI handles the identification.
- **Secure**: Sensitive keys are managed via `.env` and never pushed to the cloud.

### Project Structure
```
clicker/
├── manifest.json          # Extension configuration
├── background/            # Service worker (orchestrator)
├── content/               # Content script (scraper brain)
├── sidebar/               # Mobile-style UI panel
├── dashboard/             # Session management page
├── shared/                # AI logic, Patterns, and Schemas
└── storage/               # Chrome Storage persistence
```

## 🚀 Development Mode

If you want to contribute or build from source:

1. **Install dependencies**: `npm install`
2. **Setup Env**: Create a `.env` file and add your `GEMINI_API_KEY`.
3. **Build**: `npm run build`
4. **Load**: Load the `dist` folder in `chrome://extensions/`.

## 📖 How to Use

1. **Activate**: Click the **Clicker** icon in your toolbar.
2. **Start**: Click "Start Scraping".
3. **Select**: 
   - **Click**: Capture 1 item.
   - **Ctrl+Click**: Capture all similar items (Patterns).
   - **Alt+Click**: Capture a whole table.
4. **Automate**: Use the **Advanced Tools** (Pages/Scroll) to handle multi-page data.
5. **Export**: Go to the Dashboard and download your data as CSV or JSON.

---

## 🔮 Future Roadmap (v3.0)

- [x] **Pattern detection** ✅
- [x] **Table scraping** ✅
- [x] **Smart data extraction** ✅
- [x] **Auto-Pagination** ✅
- [x] **Infinite scroll** ✅
- [x] **Workflow recorder** ✅
- [ ] Cloud sync for sessions
- [ ] Collaborative team scraping
- [ ] Custom JS action injection

---

**Built with ❤️ for ethical web scraping and AI power.**
