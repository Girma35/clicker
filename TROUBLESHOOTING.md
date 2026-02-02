# Troubleshooting Guide

## Common Issues and Solutions

### Issue: "Please refresh the page and try again" error

**Cause**: The content script hasn't been injected into the page yet.

**Solutions**:
1. **Refresh the webpage** you want to scrape (F5 or Ctrl+R)
2. **Reload the extension**:
   - Go to `chrome://extensions/`
   - Click the refresh icon on the extension card
   - Refresh the webpage again

### Issue: Scraping button doesn't work

**Symptoms**: Clicking "Start Scraping" does nothing or shows an error.

**Solutions**:

1. **Check the browser console**:
   - Press F12 to open DevTools
   - Look for error messages in the Console tab
   - Common errors:
     - "Could not establish connection" → Content script not loaded
     - "Cannot read property" → Page not fully loaded

2. **Verify the extension is loaded**:
   - Go to `chrome://extensions/`
   - Make sure the extension is enabled
   - Check for any error messages

3. **Check the page URL**:
   - Content scripts don't work on:
     - `chrome://` pages
     - `chrome-extension://` pages
     - `about:` pages
     - Some restricted sites
   - Try on a regular website like `https://example.com`

### Issue: Elements not highlighting

**Symptoms**: Cursor moves but no blue highlight appears.

**Solutions**:

1. **Verify scraping is active**:
   - Check that the button says "Stop Scraping" (not "Start Scraping")
   - Status should show "Scraping Active" with green dot

2. **Check for conflicting styles**:
   - Some websites may have CSS that conflicts
   - Try on a simpler page first

3. **Inspect the console**:
   - Open DevTools (F12)
   - Look for "Content scraper initialized" message
   - Look for "Highlight overlay created" message

### Issue: Elements captured but not showing in sidebar

**Symptoms**: Clicking elements but sidebar doesn't update.

**Solutions**:

1. **Check message passing**:
   - Open DevTools Console
   - Look for "Element captured:" messages
   - If you see these, the content script is working

2. **Check sidebar console**:
   - Right-click on the sidebar
   - Select "Inspect"
   - Check the Console for errors

3. **Verify session started**:
   - Make sure you clicked "Start Scraping"
   - Check that the timer is running

### Issue: "No active tab found" error

**Cause**: The sidebar can't detect which tab to scrape.

**Solutions**:

1. **Make sure a tab is active**:
   - Click on the tab you want to scrape
   - Wait a moment for it to become active

2. **Try closing and reopening the sidebar**:
   - Click the extension icon to close
   - Click again to reopen

### Issue: Session not saving

**Symptoms**: Clicking "Save Session" but data doesn't persist.

**Solutions**:

1. **Check Chrome Storage**:
   - Go to `chrome://extensions/`
   - Find the extension
   - Click "Details"
   - Check "Storage" section

2. **Verify auto-save is working**:
   - Auto-save is enabled by default
   - Check the Dashboard to see if sessions appear

3. **Check for errors**:
   - Open sidebar DevTools
   - Look for "Failed to save session" errors

### Issue: Dashboard shows no sessions

**Symptoms**: Dashboard is empty even after scraping.

**Solutions**:

1. **Verify sessions were saved**:
   - Check if you clicked "Save Session"
   - Auto-save should work automatically

2. **Refresh the dashboard**:
   - Click the "Refresh" button
   - Or close and reopen the dashboard

3. **Check storage**:
   - Open DevTools on the dashboard
   - Run: `chrome.storage.local.get('scraper_data', console.log)`
   - See if data exists

### Issue: Export not working

**Symptoms**: Clicking export buttons does nothing.

**Solutions**:

1. **Check browser download settings**:
   - Make sure downloads are allowed
   - Check if popup blocker is interfering

2. **Try different export format**:
   - If JSON doesn't work, try CSV
   - Or vice versa

3. **Check console for errors**:
   - Open DevTools on dashboard
   - Look for export-related errors

## Debugging Steps

### Step 1: Verify Extension Installation

```bash
# Check that build was successful
npm run build

# Look for "Build complete!" message
```

### Step 2: Check Extension Status

1. Go to `chrome://extensions/`
2. Find "Interactive Web Scraper"
3. Verify:
   - ✅ Extension is enabled
   - ✅ No error messages
   - ✅ Version shows 1.0.0

### Step 3: Test on Simple Page

1. Open `https://example.com`
2. Click extension icon
3. Click "Start Scraping"
4. Try hovering over the heading
5. Click to capture

### Step 4: Check Console Logs

**Content Script Console** (on the webpage):
```
Content scraper initialized
Highlight overlay created
Element captured: {selector: "...", ...}
```

**Sidebar Console** (inspect sidebar):
```
Current tab: {id: 123, url: "..."}
Toggle response: {success: true}
Mode changed to: hover
```

**Background Console** (on extension page):
```
Background service worker initialized
```

### Step 5: Verify Message Flow

1. Open DevTools on the webpage (F12)
2. Open DevTools on the sidebar (right-click sidebar → Inspect)
3. Click "Start Scraping"
4. Watch both consoles for messages

Expected flow:
```
Sidebar: "Current tab: {...}"
Sidebar: "Toggle response: {success: true}"
Content: "Content scraper initialized"
Content: "Highlight overlay created"
```

## Advanced Debugging

### Enable Verbose Logging

Add this to content script for more logs:

```javascript
// In content/injector.ts
console.log('Mouse move:', event.target);
console.log('Highlighting element:', element);
```

### Check Manifest Permissions

Verify in `manifest.json`:
```json
{
  "permissions": ["storage", "activeTab", "scripting", "sidePanel"],
  "host_permissions": ["<all_urls>"]
}
```

### Inspect Storage

Open DevTools Console and run:

```javascript
// Check all stored data
chrome.storage.local.get(null, (data) => {
  console.log('All storage:', data);
});

// Check specific key
chrome.storage.local.get('scraper_data', (data) => {
  console.log('Scraper data:', data);
});
```

### Clear All Data

If things are broken, try clearing storage:

```javascript
chrome.storage.local.clear(() => {
  console.log('Storage cleared');
});
```

## Known Limitations

1. **Chrome-specific pages**: Won't work on `chrome://` URLs
2. **iframes**: May not work inside iframes
3. **Shadow DOM**: Limited support for shadow DOM elements
4. **Dynamic content**: Some AJAX-loaded content may need page refresh
5. **Protected sites**: Some sites may block extension scripts

## Getting Help

If you're still having issues:

1. **Check the console** for specific error messages
2. **Note the exact steps** that cause the problem
3. **Try on different websites** to isolate the issue
4. **Check Chrome version** (extension requires Chrome 96+)
5. **Review the code** in the relevant component

## Quick Fixes

### Reset Everything

```bash
# Rebuild from scratch
npm run clean
npm run build

# Then reload extension in Chrome
```

### Force Reload Extension

1. Go to `chrome://extensions/`
2. Toggle the extension off and on
3. Or click the refresh icon
4. Refresh any open webpages

### Clear Browser Cache

Sometimes browser cache can cause issues:
1. Press Ctrl+Shift+Delete
2. Clear cached images and files
3. Reload the extension

---

**Most issues can be solved by refreshing the page and reloading the extension!**
