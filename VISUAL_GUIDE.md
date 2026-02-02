# Visual Guide

## 🎨 User Interface Preview

This document shows what the Interactive Web Scraper looks like in action.

## Sidebar Interface

The sidebar is your main control panel while scraping. It appears as a narrow, mobile-phone-like panel on the right side of your browser.

### Key Components:

1. **Header** (Blue Gradient)
   - Extension logo and name
   - Settings button

2. **Status Bar**
   - Green dot when active
   - Current page URL
   - Scraping status

3. **Controls**
   - Start/Stop Scraping button
   - Mode selector (Hover/Click/Capture)

4. **Statistics**
   - Element count
   - Session duration timer

5. **Preview Card**
   - Last captured element
   - Tag name and selector
   - Text content preview

6. **Elements List**
   - All captured elements
   - Scrollable list
   - Click to view details

### Design Features:

- **Dark Mode**: Navy blue background (#0f172a)
- **Gradients**: Blue gradients (#3b82f6 to #2563eb)
- **Glassmorphism**: Translucent cards
- **Smooth Animations**: Micro-interactions
- **Modern Typography**: Clean, readable fonts

## Dashboard Interface

The dashboard is a full-page interface for managing your scraping sessions.

### Key Components:

1. **Header**
   - Dashboard title with icon
   - Refresh and Clear All buttons

2. **Stats Overview** (3 Cards)
   - Total Sessions (Blue icon)
   - Total Elements (Green icon)
   - Unique Pages (Orange icon)

3. **Sessions Table**
   - Session title
   - Target URL
   - Timestamp
   - Element count
   - View and Delete actions

4. **Search & Filter**
   - Search box
   - Filter options

### Design Features:

- **Card-Based Layout**: Modern, organized
- **Colorful Icons**: Gradient backgrounds
- **Hover Effects**: Interactive feedback
- **Responsive**: Works on all screen sizes
- **Clean Typography**: Professional appearance

## Color Palette

### Primary Colors

- **Primary Blue**: `#3b82f6`
- **Primary Dark**: `#2563eb`
- **Primary Light**: `#60a5fa`

### Accent Colors

- **Success Green**: `#10b981`
- **Warning Orange**: `#f59e0b`
- **Danger Red**: `#ef4444`

### Background Colors

- **BG Primary**: `#0f172a` (Navy)
- **BG Secondary**: `#1e293b` (Slate)
- **BG Tertiary**: `#334155` (Gray)

### Text Colors

- **Text Primary**: `#f1f5f9` (White)
- **Text Secondary**: `#cbd5e1` (Light Gray)
- **Text Muted**: `#94a3b8` (Muted Gray)

## Typography

### Font Family

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Sizes

- **Headers**: 20px - 32px
- **Body**: 14px
- **Small**: 11px - 13px
- **Code**: 12px (monospace)

### Font Weights

- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extrabold**: 800

## Component Styles

### Buttons

**Primary Button**
- Background: Blue gradient
- Color: White
- Border Radius: 10px
- Padding: 12px 20px
- Shadow: 0 4px 12px rgba(59, 130, 246, 0.3)
- Hover: Lift effect (-2px)

**Secondary Button**
- Background: Tertiary gray
- Color: Primary text
- Border: 1px solid border color
- Same dimensions as primary

### Cards

**Standard Card**
- Background: Secondary background
- Border: 1px solid border color
- Border Radius: 12px - 16px
- Padding: 20px - 32px
- Shadow: Subtle on hover

**Stat Card**
- Gradient background
- Icon with gradient background
- Large number display
- Small label text

### Input Fields

**Search Box**
- Background: Tertiary gray
- Border: 1px solid border color
- Border Radius: 10px
- Padding: 10px 16px
- Focus: Blue border + shadow

### Lists

**Element List**
- Scrollable container
- Custom scrollbar (6px width)
- Item spacing: 8px
- Hover: Translate right effect

**Session Table**
- Grid layout
- Row hover: Background change
- Action buttons on right
- Responsive columns

## Animations

### Micro-Interactions

1. **Button Hover**
   - Transform: translateY(-2px)
   - Shadow increase
   - Duration: 0.2s

2. **Card Hover**
   - Transform: translateY(-4px)
   - Shadow increase
   - Border color change
   - Duration: 0.3s

3. **List Item Hover**
   - Transform: translateX(4px)
   - Background change
   - Duration: 0.2s

4. **Ripple Effect**
   - On button click
   - Expanding circle
   - Duration: 0.6s

### Page Transitions

1. **Fade In**
   - Opacity: 0 → 1
   - Duration: 0.3s

2. **Slide In**
   - Transform: translateX(-20px) → 0
   - Opacity: 0 → 1
   - Duration: 0.3s

3. **Slide Up**
   - Transform: translateY(20px) → 0
   - Opacity: 0 → 1
   - Duration: 0.3s

### Loading States

1. **Pulse Animation**
   - Status dot
   - Scale: 1 → 1.1 → 1
   - Opacity: 1 → 0.5 → 1
   - Duration: 2s infinite

2. **Spinner**
   - Rotating circle
   - Duration: 1s infinite

## Responsive Design

### Breakpoints

- **Desktop**: > 768px
- **Tablet**: 768px
- **Mobile**: < 768px

### Sidebar

- Fixed width: 380px
- Always visible on desktop
- Collapsible on mobile

### Dashboard

- Max width: 1400px
- Centered with padding
- Responsive grid for stats
- Stacked layout on mobile

## Accessibility

### Color Contrast

- All text meets WCAG AA standards
- High contrast in dark mode
- Clear visual hierarchy

### Interactive Elements

- Focus states for keyboard navigation
- Clear hover states
- Sufficient touch targets (44px min)

### Screen Readers

- Semantic HTML
- ARIA labels where needed
- Descriptive button text

## Best Practices

### Visual Hierarchy

1. **Primary Actions**: Prominent buttons
2. **Secondary Actions**: Subtle buttons
3. **Information**: Cards and lists
4. **Details**: Small text and metadata

### Spacing

- Consistent padding: 12px, 16px, 20px, 24px, 32px
- Margin between sections: 24px - 40px
- Card spacing: 12px - 24px

### Shadows

- Subtle: 0 2px 4px rgba(0,0,0,0.1)
- Medium: 0 4px 12px rgba(0,0,0,0.2)
- Strong: 0 8px 24px rgba(0,0,0,0.3)

## Icon System

### Icon Library

Using inline SVG icons for:
- Navigation
- Actions
- Status indicators
- Decorative elements

### Icon Sizes

- Small: 14px - 16px
- Medium: 18px - 20px
- Large: 24px - 32px
- Extra Large: 48px - 64px

### Icon Colors

- Inherit from parent
- Stroke width: 2px
- Fill: none (outline style)

## State Indicators

### Status Colors

- **Active**: Green (#10b981)
- **Idle**: Gray (#94a3b8)
- **Error**: Red (#ef4444)
- **Warning**: Orange (#f59e0b)

### Visual Feedback

1. **Hover**: Background change
2. **Active**: Border highlight
3. **Selected**: Check mark
4. **Disabled**: Reduced opacity

## Layout Patterns

### Sidebar Layout

```
┌─────────────────┐
│     Header      │
├─────────────────┤
│   Status Bar    │
├─────────────────┤
│    Controls     │
├─────────────────┤
│     Stats       │
├─────────────────┤
│    Preview      │
├─────────────────┤
│    Actions      │
├─────────────────┤
│  Elements List  │
│   (scrollable)  │
└─────────────────┘
```

### Dashboard Layout

```
┌─────────────────────────────────┐
│           Header                │
├─────────────────────────────────┤
│  ┌─────┐  ┌─────┐  ┌─────┐    │
│  │Stat │  │Stat │  │Stat │    │
│  │Card │  │Card │  │Card │    │
│  └─────┘  └─────┘  └─────┘    │
├─────────────────────────────────┤
│      Sessions Table             │
│  ┌───────────────────────────┐ │
│  │ Session Row 1             │ │
│  ├───────────────────────────┤ │
│  │ Session Row 2             │ │
│  ├───────────────────────────┤ │
│  │ Session Row 3             │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

---

**The UI is designed to be premium, professional, and user-friendly!**
