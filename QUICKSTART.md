# Quick Start Guide

## 🚀 Getting Started in 3 Minutes

### Step 1: Build the Extension

```bash
# Install dependencies
npm install

# Build the extension
npm run build
```

### Step 2: Load in Chrome

1. Open Chrome browser
2. Navigate to `chrome://extensions/`
3. Toggle **"Developer mode"** (top right corner)
4. Click **"Load unpacked"**
5. Select the `dist` folder from this project

### Step 3: Start Scraping!

1. Click the extension icon in your Chrome toolbar
2. The sidebar will open on the right side
3. Click **"Start Scraping"**
4. Move your cursor over elements on any webpage
5. Click to capture elements
6. Click **"Save Session"** when done

## 📊 Viewing Your Data

### Dashboard Access

- Click **"Dashboard"** button in the sidebar
- Or click the extension icon and select "Dashboard"

### Export Options

From the dashboard:
1. Click on any session to view details
2. Click **"Export JSON"** for structured data
3. Click **"Export CSV"** for spreadsheet-compatible format

## 🎯 Usage Tips

### Scraping Modes

- **Hover Mode** (default): Highlights elements as you move
- **Click Mode**: Only captures when you click
- **Capture Mode**: Advanced selection with children

### Best Practices

1. **Start Small**: Test on a simple page first
2. **Be Specific**: Hover carefully to select the right elements
3. **Save Often**: Use the auto-save feature (enabled by default)
4. **Review Data**: Check the preview before saving

### Keyboard Shortcuts

- **ESC**: Stop scraping / deactivate extension
- **Click**: Capture highlighted element

## 🔧 Development Mode

### Watch Mode (Auto-rebuild)

```bash
npm run watch
```

This will automatically rebuild when you make changes to the source files.

### Reload Extension

After making changes:
1. Go to `chrome://extensions/`
2. Click the refresh icon on your extension card
3. Reload the page you're testing on

## 📁 Project Structure

```
scraper/
├── dist/              # Built extension (load this in Chrome)
├── background/        # Service worker
├── content/           # Content script (runs on pages)
├── sidebar/           # Sidebar UI
├── dashboard/         # Dashboard page
├── shared/            # Utilities and schemas
├── storage/           # Storage manager
└── icons/             # Extension icons
```

## 🐛 Troubleshooting

### Extension Won't Load

- Make sure you selected the `dist` folder, not the root folder
- Check that the build completed successfully
- Look for errors in `chrome://extensions/`

### Scraping Not Working

- Make sure you clicked "Start Scraping"
- Check that the page has finished loading
- Try refreshing the page
- Check the browser console for errors (F12)

### No Elements Captured

- Ensure you're clicking on elements (not just hovering)
- Try switching to "Click Mode"
- Some elements may be hidden or inaccessible

### Session Not Saving

- Check Chrome Storage permissions
- Look for errors in the extension's service worker console
- Try manually clicking "Save Session"

## 🎨 Customization

### Highlight Color

Edit `shared/schemas.ts` and change the `highlightColor` in default settings:

```typescript
highlightColor: '#3b82f6'  // Change to your preferred color
```

### Sidebar Position

The sidebar appears on the right by default. Chrome's Side Panel API controls this.

## 📚 Next Steps

1. **Read the full README.md** for detailed documentation
2. **Explore the code** to understand the architecture
3. **Customize** the extension for your needs
4. **Share** your use cases and feedback

## 🆘 Need Help?

- Check the README.md for detailed information
- Review the code comments
- Open an issue on the repository

---

**Happy Scraping! 🎉**
