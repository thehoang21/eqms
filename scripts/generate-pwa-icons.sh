#!/bin/bash

# PWA Icon Generator Script
# Generates all required icon sizes for PWA from source logo

SOURCE_LOGO="src/assets/images/logo_doc_nobg.png"
OUTPUT_DIR="public/icons"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "🎨 Generating PWA icons from $SOURCE_LOGO..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is not installed."
    echo "📦 Install with: brew install imagemagick"
    exit 1
fi

# Array of icon sizes
declare -a SIZES=(
    "16:icon-16x16.png"
    "32:icon-32x32.png"
    "72:icon-72x72.png"
    "96:icon-96x96.png"
    "128:icon-128x128.png"
    "144:icon-144x144.png"
    "152:icon-152x152.png"
    "192:icon-192x192.png"
    "384:icon-384x384.png"
    "512:icon-512x512.png"
)

# Generate standard icons (preserve transparency for logo_doc_nobg.png)
echo "📱 Generating standard icons..."
for size_config in "${SIZES[@]}"; do
    IFS=':' read -r size filename <<< "$size_config"
    echo "  ✓ $filename (${size}x${size})"
    convert "$SOURCE_LOGO" -resize "${size}x${size}" -background white -gravity center -extent "${size}x${size}" "$OUTPUT_DIR/$filename"
done

# Generate Apple Touch Icons
echo "🍎 Generating Apple Touch icons..."
convert "$SOURCE_LOGO" -resize "180x180" -background white -gravity center -extent "180x180" "$OUTPUT_DIR/apple-touch-icon.png"
convert "$SOURCE_LOGO" -resize "180x180" -background white -gravity center -extent "180x180" "$OUTPUT_DIR/apple-touch-icon-180x180.png"
convert "$SOURCE_LOGO" -resize "167x167" -background white -gravity center -extent "167x167" "$OUTPUT_DIR/apple-touch-icon-167x167.png"
convert "$SOURCE_LOGO" -resize "152x152" -background white -gravity center -extent "152x152" "$OUTPUT_DIR/apple-touch-icon-152x152.png"

# Generate Microsoft Tile icons
echo "🪟 Generating Microsoft Tile icons..."
convert "$SOURCE_LOGO" -resize "70x70" -background "#059669" -gravity center -extent "70x70" "$OUTPUT_DIR/ms-icon-70x70.png"
convert "$SOURCE_LOGO" -resize "144x144" -background "#059669" -gravity center -extent "144x144" "$OUTPUT_DIR/ms-icon-144x144.png"
convert "$SOURCE_LOGO" -resize "150x150" -background "#059669" -gravity center -extent "150x150" "$OUTPUT_DIR/ms-icon-150x150.png"
convert "$SOURCE_LOGO" -resize "310x310" -background "#059669" -gravity center -extent "310x310" "$OUTPUT_DIR/ms-icon-310x310.png"

# Generate maskable icons (with safe zone padding)
echo "🎭 Generating maskable icons..."
convert "$SOURCE_LOGO" -resize "154x154" -background "#059669" -gravity center -extent "192x192" "$OUTPUT_DIR/icon-192x192-maskable.png"
convert "$SOURCE_LOGO" -resize "410x410" -background "#059669" -gravity center -extent "512x512" "$OUTPUT_DIR/icon-512x512-maskable.png"

# Generate favicon.ico (multiple sizes in one file)
echo "🌐 Generating favicon.ico..."
convert "$SOURCE_LOGO" \
    \( -clone 0 -resize 16x16 \) \
    \( -clone 0 -resize 32x32 \) \
    \( -clone 0 -resize 48x48 \) \
    -delete 0 -alpha off -colors 256 "$OUTPUT_DIR/favicon.ico"

# Generate shortcut icons
echo "🔗 Generating shortcut icons..."
convert "$SOURCE_LOGO" -resize "96x96" "$OUTPUT_DIR/shortcut-dashboard.png"
convert "$SOURCE_LOGO" -resize "96x96" "$OUTPUT_DIR/shortcut-tasks.png"
convert "$SOURCE_LOGO" -resize "96x96" "$OUTPUT_DIR/shortcut-documents.png"

# Generate badge icon
echo "🔔 Generating badge icon..."
convert "$SOURCE_LOGO" -resize "72x72" "$OUTPUT_DIR/badge-72x72.png"

echo ""
echo "✅ Icon generation complete!"
echo "📁 Icons saved to: $OUTPUT_DIR"
echo ""
echo "Generated icons:"
ls -lh "$OUTPUT_DIR"

echo ""
echo "🚀 Next steps:"
echo "1. Review generated icons in $OUTPUT_DIR"
echo "2. Optionally optimize with: npm run optimize-icons"
echo "3. Test PWA installation on mobile devices"
