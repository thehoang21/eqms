# PWA Icons Generator Guide

## Overview
Generate all required PWA icons from a single source image (`src/assets/images/pwa.png`).

## Prerequisites

### Option 1: ImageMagick (Recommended)
Install ImageMagick to automatically generate all icon sizes:

**Windows:**
1. Download from: https://imagemagick.org/script/download.php
2. Run installer and **check "Add to PATH"** during installation
3. Restart terminal/PowerShell
4. Verify: `magick -version`

**macOS:**
```bash
brew install imagemagick
```

**Linux:**
```bash
sudo apt-get install imagemagick  # Debian/Ubuntu
sudo yum install imagemagick      # CentOS/RHEL
```

### Option 2: Online Tools (No Installation)
Use these free online tools if you don't want to install ImageMagick:
- **RealFaviconGenerator**: https://realfavicongenerator.net/
- **PWA Builder**: https://www.pwabuilder.com/imageGenerator
- **Favicon.io**: https://favicon.io/

## Usage

### Automatic Generation (Windows)
```powershell
# Run PowerShell script
./scripts/generate-pwa-icons.ps1
```

### Automatic Generation (Mac/Linux)
```bash
# Make script executable
chmod +x scripts/generate-pwa-icons.sh

# Run bash script
./scripts/generate-pwa-icons.sh
```

### Manual Generation (Online)
1. Go to https://realfavicongenerator.net/
2. Upload `src/assets/images/pwa.png`
3. Configure settings:
   - iOS: Use source image
   - Android: Use source image
   - Windows: Use source image
   - Favicon: Use source image
4. Generate icons
5. Download and extract to `public/icons/`

## Generated Files

The script generates these icons:

### Standard PWA Icons
- `icon-16x16.png` - Browser tab
- `icon-32x32.png` - Browser tab (retina)
- `icon-72x72.png` - PWA small
- `icon-96x96.png` - PWA medium
- `icon-128x128.png` - PWA medium
- `icon-144x144.png` - PWA large
- `icon-152x152.png` - PWA large
- `icon-192x192.png` - PWA recommended minimum
- `icon-384x384.png` - PWA recommended
- `icon-512x512.png` - PWA recommended maximum

### Apple Touch Icons
- `apple-touch-icon.png` (180x180)
- `apple-touch-icon-180x180.png` - iPhone Retina
- `apple-touch-icon-167x167.png` - iPad Pro
- `apple-touch-icon-152x152.png` - iPad Retina

### Microsoft Tile Icons
- `ms-icon-70x70.png` - Small tile
- `ms-icon-144x144.png` - Medium tile
- `ms-icon-150x150.png` - Medium tile
- `ms-icon-310x310.png` - Large tile

### Favicon
- `favicon.ico` - Multi-size favicon (16, 32, 48)

## Configuration

### Manifest.json
Icons are already configured in `public/manifest.json`:
```json
{
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### index.html
Add these tags to `index.html` `<head>`:
```html
<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png">

<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.png">
<link rel="apple-touch-icon" sizes="167x167" href="/icons/apple-touch-icon-167x167.png">
<link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152x152.png">

<!-- Microsoft Tiles -->
<meta name="msapplication-TileColor" content="#059669">
<meta name="msapplication-TileImage" content="/icons/ms-icon-144x144.png">
```

## Testing

### Desktop Browsers
1. **Chrome/Edge**: 
   - Open DevTools (F12)
   - Go to Application > Manifest
   - Check icons are loading correctly

2. **Firefox**:
   - Open DevTools (F12)
   - Go to Application > Manifest
   - Check icons

### Mobile
1. Add to Home Screen on iOS/Android
2. Check icon appears correctly
3. Test app launch

### PWA Validation
- **Lighthouse**: Run audit in Chrome DevTools
- **PWA Builder**: https://www.pwabuilder.com/ (paste your URL)

## Troubleshooting

### Icons not showing
1. Clear browser cache
2. Check `public/icons/` folder exists
3. Verify paths in `manifest.json`
4. Check browser console for errors

### ImageMagick not found
- Windows: Reinstall and check "Add to PATH"
- Mac: `brew install imagemagick`
- Linux: `sudo apt-get install imagemagick`

### Online generation alternative
If scripts fail, use online tools:
1. Upload `src/assets/images/pwa.png` to https://realfavicongenerator.net/
2. Download generated files
3. Extract to `public/icons/`

## Best Practices

### Source Image (pwa.png)
- Minimum size: 512x512px (recommended: 1024x1024px)
- Format: PNG with transparency
- Design: Simple, recognizable at small sizes
- Safe area: Keep important elements in center 80%

### Icon Design
- Use solid colors or simple gradients
- Avoid fine details (won't show at small sizes)
- Test at 16x16px to ensure readability
- Consider dark/light mode compatibility

## References
- [PWA Icons Guide](https://web.dev/add-manifest/)
- [Apple Touch Icons](https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/)
- [Microsoft Tiles](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/dn255024(v=vs.85))
