# Testing Checklist

Use this checklist to verify all features are working correctly.

## ✅ Pre-Installation Tests

- [ ] Node.js is installed (`node --version`)
- [ ] npm is installed (`npm --version`)
- [ ] Chrome browser is installed (version 96+)

## ✅ Build Tests

- [ ] Run `npm install` - completes without errors
- [ ] Run `npm run build` - completes successfully
- [ ] `dist/` folder is created
- [ ] All required files exist in `dist/`:
  - [ ] manifest.json
  - [ ] background/service-worker.js
  - [ ] content/injector.js
  - [ ] sidebar/sidebar.html, sidebar.css, sidebar.js
  - [ ] dashboard/dashboard.html, dashboard.css, dashboard.js
  - [ ] icons/ folder with all PNG files

## ✅ Extension Installation

- [ ] Open `chrome://extensions/`
- [ ] "Developer mode" is enabled
- [ ] Click "Load unpacked"
- [ ] Select the `dist` folder
- [ ] Extension appears in the list
- [ ] Extension icon appears in toolbar
- [ ] No error messages shown

## ✅ Sidebar UI Tests

### Opening the Sidebar

- [ ] Click extension icon in toolbar
- [ ] Sidebar opens on the right side
- [ ] Sidebar shows "Scraper" header
- [ ] Status shows "Idle" with gray dot
- [ ] "Start Scraping" button is visible
- [ ] Mode selector shows three buttons (Hover/Click/Capture)
- [ ] Stats show "0 Elements" and "0:00 Duration"
- [ ] Preview card shows "No elements captured yet"
- [ ] "Save Session" button is disabled
- [ ] "Dashboard" button is enabled

### UI Appearance

- [ ] Dark mode theme is applied
- [ ] Blue gradient header looks good
- [ ] All text is readable
- [ ] Icons are visible
- [ ] Buttons have hover effects
- [ ] Layout is not broken

## ✅ Scraping Functionality Tests

### Test Page Setup

1. Open a simple test page (e.g., `https://example.com`)
2. Open the sidebar

### Starting Scraping

- [ ] Click "Start Scraping" button
- [ ] Button changes to "Stop Scraping"
- [ ] Button background turns red
- [ ] Status changes to "Scraping Active"
- [ ] Status dot turns green
- [ ] Timer starts counting (0:01, 0:02, etc.)
- [ ] "Save Session" button becomes enabled
- [ ] Cursor changes to crosshair on the page
- [ ] No error messages appear

### Element Highlighting

- [ ] Move cursor over page heading
- [ ] Blue highlight box appears around element
- [ ] Highlight follows cursor smoothly
- [ ] Highlight shows correct element boundaries
- [ ] Highlight disappears when cursor moves away

### Element Capturing

- [ ] Click on the page heading
- [ ] Element is captured (check console for "Element captured:" message)
- [ ] Element count increases to "1"
- [ ] Preview card updates with:
  - [ ] Tag name (e.g., "h1")
  - [ ] Text content
  - [ ] CSS selector
- [ ] Element appears in the list below
- [ ] Captured element shows green checkmark
- [ ] Captured element has green outline

### Multiple Elements

- [ ] Capture 3-5 different elements
- [ ] Element count increases correctly
- [ ] All elements appear in the list
- [ ] Preview shows the last captured element
- [ ] Timer continues running

### Stopping Scraping

- [ ] Click "Stop Scraping" button
- [ ] Button changes back to "Start Scraping"
- [ ] Status changes to "Idle"
- [ ] Status dot turns gray
- [ ] Timer stops
- [ ] Cursor returns to normal
- [ ] Blue highlight disappears
- [ ] Green checkmarks remain on captured elements

## ✅ Mode Switching Tests

- [ ] Start scraping
- [ ] Click "Click" mode button
- [ ] Button highlights (active state)
- [ ] Hover mode button is no longer active
- [ ] Click "Capture" mode button
- [ ] Button highlights
- [ ] Click back to "Hover" mode
- [ ] Mode switches work without errors

## ✅ Session Management Tests

### Saving a Session

- [ ] Capture some elements
- [ ] Click "Save Session" button
- [ ] Success notification appears
- [ ] Notification says "Session saved successfully!"
- [ ] Notification disappears after 3 seconds

### Auto-Save (if enabled)

- [ ] Capture an element
- [ ] Wait a moment
- [ ] Check Dashboard - session should appear automatically

## ✅ Dashboard Tests

### Opening Dashboard

- [ ] Click "Dashboard" button in sidebar
- [ ] New tab opens
- [ ] Dashboard page loads
- [ ] Header shows "Scraper Dashboard"
- [ ] Stats cards are visible

### Stats Display

- [ ] "Total Sessions" shows correct count
- [ ] "Total Elements" shows correct count
- [ ] "Unique Pages" shows correct count
- [ ] Numbers are formatted correctly

### Sessions Table

- [ ] Saved sessions appear in the table
- [ ] Each session shows:
  - [ ] Session title
  - [ ] URL
  - [ ] Timestamp
  - [ ] Element count
  - [ ] View button
  - [ ] Delete button
- [ ] Sessions are sorted by date (newest first)

### Viewing Session Details

- [ ] Click "View" button on a session
- [ ] Modal opens
- [ ] Modal shows session title
- [ ] URL is displayed
- [ ] Timestamp is shown
- [ ] All captured elements are listed
- [ ] Each element shows:
  - [ ] Tag name
  - [ ] Text content
  - [ ] CSS selector
  - [ ] XPath

### Exporting Data

- [ ] With modal open, click "Export JSON"
- [ ] File downloads
- [ ] File is named correctly (e.g., `scraper-session-2026-02-02.json`)
- [ ] Open file - JSON is valid
- [ ] Click "Export CSV"
- [ ] CSV file downloads
- [ ] Open in spreadsheet - data is correct

### Deleting Sessions

- [ ] Click "Delete" button on a session
- [ ] Confirmation dialog appears
- [ ] Click "OK"
- [ ] Session is removed from list
- [ ] Stats update correctly

### Search Functionality

- [ ] Type in search box
- [ ] Sessions filter as you type
- [ ] Matching sessions remain visible
- [ ] Non-matching sessions are hidden
- [ ] Clear search - all sessions reappear

## ✅ Error Handling Tests

### No Active Tab

- [ ] Close all tabs except extension pages
- [ ] Try to start scraping
- [ ] Appropriate error message appears

### Restricted Pages

- [ ] Open `chrome://extensions/`
- [ ] Try to start scraping
- [ ] Error message appears (content script can't inject)

### Page Refresh During Scraping

- [ ] Start scraping
- [ ] Capture some elements
- [ ] Refresh the page (F5)
- [ ] Extension handles gracefully
- [ ] Can start scraping again after refresh

## ✅ Performance Tests

### Large Number of Elements

- [ ] Capture 20+ elements
- [ ] Sidebar remains responsive
- [ ] Scrolling works smoothly
- [ ] No lag or freezing

### Multiple Sessions

- [ ] Create 10+ sessions
- [ ] Dashboard loads quickly
- [ ] All sessions display correctly
- [ ] No performance issues

## ✅ Browser Compatibility

### Chrome

- [ ] Works on Chrome 96+
- [ ] All features functional
- [ ] No console errors

### Edge (Chromium)

- [ ] Extension loads
- [ ] Basic functionality works
- [ ] (Optional - same engine as Chrome)

## ✅ Keyboard Shortcuts

- [ ] Start scraping
- [ ] Press ESC key
- [ ] Scraping stops
- [ ] UI updates correctly

## ✅ Console Tests

### Content Script Console

Open DevTools on the webpage (F12):

- [ ] "Content scraper initialized" message appears
- [ ] "Highlight overlay created" message appears
- [ ] "Element captured:" messages appear when clicking
- [ ] No error messages

### Sidebar Console

Right-click sidebar → Inspect:

- [ ] "Current tab:" message when toggling
- [ ] "Toggle response:" message appears
- [ ] "Mode changed to:" messages appear
- [ ] No error messages

### Background Console

On `chrome://extensions/` → Extension details → Inspect views: service worker:

- [ ] "Background service worker initialized" message
- [ ] No error messages

## ✅ Visual Regression Tests

### Sidebar Appearance

- [ ] Header gradient looks correct
- [ ] Status bar is visible
- [ ] Buttons are properly styled
- [ ] Stats cards are aligned
- [ ] Preview card has proper spacing
- [ ] Element list scrolls correctly
- [ ] Colors match design (blues, greens, etc.)

### Dashboard Appearance

- [ ] Header is centered
- [ ] Stats cards are in a row
- [ ] Icons have gradient backgrounds
- [ ] Table is properly formatted
- [ ] Modal displays correctly
- [ ] Buttons have proper styling

## ✅ Edge Cases

### Empty Sessions

- [ ] Start and stop scraping without capturing
- [ ] Save session
- [ ] Session appears with 0 elements
- [ ] Can view in dashboard
- [ ] Can delete

### Long Text Content

- [ ] Capture element with very long text
- [ ] Text is truncated in preview
- [ ] Full text visible in dashboard
- [ ] Export includes full text

### Special Characters

- [ ] Capture element with special characters (é, ñ, 中文, etc.)
- [ ] Characters display correctly
- [ ] Export preserves characters

### Same Element Multiple Times

- [ ] Capture the same element twice
- [ ] Both captures are recorded
- [ ] Each has unique timestamp
- [ ] Both appear in list

## ✅ Final Verification

- [ ] All core features work
- [ ] No critical bugs
- [ ] UI looks professional
- [ ] Performance is acceptable
- [ ] Error messages are helpful
- [ ] Documentation is accurate

## 🐛 Bug Reporting Template

If you find a bug, note:

```
**Bug**: [Brief description]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected**: [What should happen]
**Actual**: [What actually happens]
**Console Errors**: [Any error messages]
**Browser**: Chrome [version]
**Extension Version**: 1.0.0
```

---

**Testing Complete! ✅**

If all items are checked, the extension is working correctly!
