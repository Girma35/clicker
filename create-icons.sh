#!/bin/bash

# Simple script to create placeholder icon files
# In production, you would use the generated icon image

ICON_DIR="icons"
mkdir -p "$ICON_DIR"

# Create simple SVG icon as placeholder
cat > "$ICON_DIR/icon.svg" << 'EOF'
<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="64" cy="64" r="60" fill="url(#grad)"/>
  
  <!-- Layered documents -->
  <rect x="35" y="45" width="40" height="50" rx="4" fill="white" opacity="0.3"/>
  <rect x="40" y="40" width="40" height="50" rx="4" fill="white" opacity="0.5"/>
  <rect x="45" y="35" width="40" height="50" rx="4" fill="white"/>
  
  <!-- Lines on front document -->
  <line x1="52" y1="45" x2="78" y2="45" stroke="#3b82f6" stroke-width="2"/>
  <line x1="52" y1="52" x2="78" y2="52" stroke="#3b82f6" stroke-width="2"/>
  <line x1="52" y1="59" x2="70" y2="59" stroke="#3b82f6" stroke-width="2"/>
  
  <!-- Cursor pointer -->
  <path d="M 30 75 L 30 95 L 40 85 L 48 95 L 52 92 L 44 82 L 55 82 Z" fill="#1e293b" stroke="white" stroke-width="2"/>
</svg>
EOF

echo "✓ Created icon.svg"

# Note: To create PNG files at different sizes, you would need ImageMagick or similar
# For now, we'll create a note file
cat > "$ICON_DIR/README.txt" << 'EOF'
Icon Files
==========

To create the required PNG files from icon.svg:

Using ImageMagick (if installed):
  convert icon.svg -resize 16x16 icon16.png
  convert icon.svg -resize 32x32 icon32.png
  convert icon.svg -resize 48x48 icon48.png
  convert icon.svg -resize 128x128 icon128.png

Or use an online converter:
  https://cloudconvert.com/svg-to-png

Required files:
  - icon16.png  (16x16)
  - icon32.png  (32x32)
  - icon48.png  (48x48)
  - icon128.png (128x128)
EOF

echo "✓ Created icons/README.txt with instructions"
echo ""
echo "Note: You'll need to convert the SVG to PNG files manually"
echo "See icons/README.txt for instructions"
