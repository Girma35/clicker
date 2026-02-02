# 🔥 Power Features Guide (v2.0 Elite)

## Welcome to the ELITE Scraper!

Your scraper now has **Elite Features** powered by Gemini AI and advanced automation.

---

## 🔮 **Elite Feature #1: Gemini AI Field Detection**

### What It Does
**Intelligently identifies what you are scraping!**

Using the Gemini Pro API, the scraper analyzes your selected elements to determine if they are prices, product titles, dates, or emails.

### How it works:
- Automatically analyzes every captured element.
- Labels elements in the sidebar with their detected type (e.g., `h1 (Product Title)`).
- Increases accuracy of structured data extraction.

---

## 🔄 **Elite Feature #2: Auto-Pagination**

### What It Does
**Scrapes multiple pages automatically!**

Click the **"Pages"** button in the sidebar to start auto-pagination. The scraper will find the "Next" button and cycle through pages while capturing data.

---

## ♾️ **Elite Feature #3: Infinite Scroll Support**

### What It Does
**Perfect for social media and modern list feeds!**

Click the **"Scroll"** button. The scraper will smoothly scroll to the bottom, wait for content to load, and automatically capture new items that match your pattern.

---

## ⏺️ **Elite Feature #4: Workflow Recorder**

### What It Does
**Automate repetitive sequences!**

Click **"Record"** to start recording your actions (clicks, inputs, scrolls). Stop recording to save the workflow. You can replay these sequences to get back to specific data views instantly.

---

## 🚀 **Feature #1: Smart Pattern Detection**

### What It Does
**Captures ALL similar elements with ONE click!**

Instead of clicking 100 product cards individually, click ONE and capture all 100 at once!

### How to Use

1. **Start scraping** (click "Start Scraping")
2. **Hold Ctrl (or Cmd on Mac)** 
3. **Click ANY element** you want to capture
4. **Watch the magic!** ✨

The scraper will:
- Find all similar elements on the page
- Highlight them all
- Capture them all automatically
- Show you a notification with the count

### Example Use Cases

**E-commerce Sites**:
- Ctrl+Click one product → Captures ALL products
- Ctrl+Click one price → Captures ALL prices
- Ctrl+Click one review → Captures ALL reviews

**News Sites**:
- Ctrl+Click one article title → Captures ALL titles
- Ctrl+Click one author → Captures ALL authors
- Ctrl+Click one date → Captures ALL dates

**Social Media**:
- Ctrl+Click one post → Captures ALL posts
- Ctrl+Click one username → Captures ALL usernames
- Ctrl+Click one timestamp → Captures ALL timestamps

### What It Detects

The pattern detector looks for:
1. **Same class name** (most reliable)
2. **Same tag + parent structure**
3. **Similar attributes** (data-* attributes)
4. **Similar structure** (same number of children)

### Console Output

Watch the console for:
```
🔥 Pattern detection activated!
✨ Found 24 similar elements!
Selector: .product-card
🎉 Captured 24 elements using pattern detection!
```

---

## 📊 **Feature #2: Table Scraper**

### What It Does
**Scrapes entire HTML tables instantly!**

No more clicking each cell - capture the whole table structure at once!

### How to Use

1. **Start scraping**
2. **Hold Alt**
3. **Click ANY cell** in the table
4. **Boom!** Entire table captured

The scraper will:
- Detect the table
- Extract headers
- Extract all rows
- Preserve structure
- Export as CSV-ready data

### Example Use Cases

**Data Tables**:
- Product comparison tables
- Pricing tables
- Statistics tables
- Schedule tables

**Lists**:
- Directory listings
- Contact lists
- Inventory lists
- Leaderboards

### Console Output

```
📊 Table detection activated!
✨ Found table: 10 rows × 5 columns
🎉 Captured table with 10 rows!
```

### Export

Table data exports perfectly to CSV:
- Headers become column names
- Rows become data rows
- Ready for Excel/Google Sheets

---

## 💡 **Feature #3: Smart Data Extraction**

### What It Does
**Automatically extracts structured data from elements!**

The scraper now recognizes and extracts:
- 💰 **Prices**: $99.99, €50, £25.50
- 📅 **Dates**: 2026-02-02, Feb 2 2026
- 📧 **Emails**: user@example.com
- 📞 **Phone numbers**: (123) 456-7890
- 🔗 **Links**: All href attributes
- 🖼️ **Images**: All src attributes

### How It Works

Automatically! Just capture elements normally and the scraper will:
1. Extract the text content
2. Find all links inside
3. Find all images inside
4. Detect prices in the text
5. Detect dates in the text
6. Detect emails in the text
7. Detect phone numbers in the text

### Example

Capture a product card and get:
```json
{
  "text": "Premium Widget - $99.99",
  "links": ["https://example.com/product/123"],
  "images": ["https://example.com/img/widget.jpg"],
  "prices": ["$99.99"],
  "dates": [],
  "emails": ["support@example.com"],
  "phones": []
}
```

---

## ⌨️ **Keyboard Shortcuts**

| Shortcut | Action |
|----------|--------|
| **Click** | Capture single element |
| **Ctrl+Click** | 🔥 Pattern detection (capture all similar) |
| **Alt+Click** | 📊 Table scraping (capture entire table) |
| **ESC** | Stop scraping |

**Mac Users**: Use **Cmd** instead of Ctrl

---

## 🎯 **Power Workflows**

### Workflow 1: Scrape Product Catalog

1. Go to product listing page
2. Start scraping
3. **Ctrl+Click** one product card
4. ✨ All products captured!
5. Save session
6. Export to CSV

**Time saved**: 99% (from 100 clicks to 1 click!)

### Workflow 2: Scrape Comparison Table

1. Find a comparison table
2. Start scraping
3. **Alt+Click** any cell
4. 📊 Entire table captured!
5. Export to CSV
6. Open in Excel

**Time saved**: 100% (instant table extraction!)

### Workflow 3: Scrape Article List

1. Go to news/blog page
2. Start scraping
3. **Ctrl+Click** one article title
4. All titles captured
5. **Ctrl+Click** one date
6. All dates captured
7. Export structured data

**Time saved**: 95%

---

## 📈 **Performance Comparison**

| Task | Old Way | New Way | Improvement |
|------|---------|---------|-------------|
| 100 products | 100 clicks | 1 Ctrl+Click | **100x faster** |
| 50-row table | 250 clicks | 1 Alt+Click | **250x faster** |
| 20 articles | 60 clicks | 2 Ctrl+Clicks | **30x faster** |

---

## 🎨 **Visual Feedback**

### Pattern Detection
- **Blue highlights** on all matching elements
- **Green checkmarks** when captured
- **Notification**: "🔥 Pattern detected! Capturing X elements..."

### Table Scraping
- **Green outline** around the table
- **Notification**: "📊 Table captured! X rows × Y columns"

### Regular Capture
- **Blue highlight** on hover
- **Green checkmark** when captured
- Element added to list

---

## 🔍 **Tips & Tricks**

### Tip 1: Start with Pattern Detection
Always try **Ctrl+Click** first! If it finds a pattern, you save tons of time.

### Tip 2: Check the Console
Open DevTools (F12) to see what the scraper is finding:
- Pattern matches
- Element counts
- Selectors used

### Tip 3: Test on Simple Elements First
Try pattern detection on obvious repeated elements:
- Product cards
- List items
- Article previews
- User profiles

### Tip 4: Combine Features
1. Use pattern detection for repeated elements
2. Use table scraping for tabular data
3. Use regular clicks for unique elements

### Tip 5: Verify Before Exporting
Check the sidebar to see element count - make sure you got everything!

---

## 🐛 **Troubleshooting Power Features**

### Pattern Detection Not Working?

**Problem**: Ctrl+Click only captures one element

**Solutions**:
1. Elements might not be similar enough
2. Try clicking a different element in the pattern
3. Check console for "No pattern found" message
4. Fall back to regular clicking

### Table Scraping Not Working?

**Problem**: Alt+Click doesn't detect table

**Solutions**:
1. Make sure it's an actual `<table>` element
2. Some sites use divs styled as tables
3. Try clicking different cells
4. Check console for "No table found" message

### Too Many Elements Captured?

**Problem**: Pattern detection captured unwanted elements

**Solutions**:
1. Click a more specific element
2. Use regular click mode instead
3. Delete unwanted elements from session

---

## 🎓 **Advanced Techniques**

### Technique 1: Layered Scraping

1. **Ctrl+Click** product cards → Get all products
2. **Ctrl+Click** prices → Get all prices
3. **Ctrl+Click** ratings → Get all ratings
4. Export → Perfect dataset!

### Technique 2: Multi-Page Scraping

1. Scrape page 1 with pattern detection
2. Go to page 2
3. Scrape page 2 with same pattern
4. Continue for all pages
5. One big session with all data!

### Technique 3: Nested Data

1. **Ctrl+Click** parent containers
2. Each container has child data
3. Export preserves hierarchy
4. Process in your favorite tool

---

## 🚀 **What's Next?**

Future power features coming:
- **Pagination handler**: Auto-click "Next" and continue scraping
- **Scroll & load**: Auto-scroll for infinite scroll pages
- **Workflow recorder**: Record and replay scraping actions
- **AI detection**: Smart field recognition (price, title, etc.)

---

## 💪 **You're Now a Power User!**

With these features, you can:
- ✅ Scrape 100x faster
- ✅ Handle complex pages easily
- ✅ Extract structured data automatically
- ✅ Work with tables effortlessly
- ✅ Save hours of manual work

**Go forth and scrape powerfully! 🔥**

---

## 📚 **Quick Reference Card**

```
┌─────────────────────────────────────────┐
│         POWER SCRAPER CHEAT SHEET       │
├─────────────────────────────────────────┤
│                                         │
│  Click           → Capture one element  │
│  Ctrl+Click      → Capture all similar  │
│  Alt+Click       → Capture entire table │
│  ESC             → Stop scraping        │
│                                         │
│  🔥 = Pattern Detection                │
│  📊 = Table Scraping                   │
│  💰 = Price Detection                  │
│  📅 = Date Detection                   │
│  📧 = Email Detection                  │
│                                         │
└─────────────────────────────────────────┘
```

**Happy Power Scraping! 🚀**
