#!/usr/bin/env python3
"""
Generate Chrome extension icons from base image
"""

from PIL import Image
import os

def create_icons():
    """Create icon files in different sizes"""
    
    # Icon sizes required by Chrome
    sizes = [16, 32, 48, 128]
    
    # Input and output paths
    base_icon = 'icons/base_icon.png'
    
    if not os.path.exists(base_icon):
        print(f"❌ Base icon not found: {base_icon}")
        print("Please ensure the generated icon is copied to icons/base_icon.png")
        return
    
    try:
        # Open base image
        img = Image.open(base_icon)
        
        # Convert to RGBA if needed
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Create icons at different sizes
        for size in sizes:
            # Resize with high-quality resampling
            resized = img.resize((size, size), Image.Resampling.LANCZOS)
            
            # Save
            output_path = f'icons/icon{size}.png'
            resized.save(output_path, 'PNG')
            print(f'✓ Created {output_path} ({size}x{size})')
        
        print('\n✅ All icons created successfully!')
        
    except Exception as e:
        print(f'❌ Error creating icons: {e}')
        print('\nFallback: Creating simple colored squares as placeholders...')
        create_placeholder_icons(sizes)

def create_placeholder_icons(sizes):
    """Create simple placeholder icons if PIL fails"""
    for size in sizes:
        # Create a simple blue square
        img = Image.new('RGBA', (size, size), (59, 130, 246, 255))
        output_path = f'icons/icon{size}.png'
        img.save(output_path, 'PNG')
        print(f'✓ Created placeholder {output_path}')

if __name__ == '__main__':
    create_icons()
