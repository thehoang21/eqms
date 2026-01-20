# PWA Icon Generator Script for Windows (PowerShell)
# Generates all required icon sizes for PWA from source logo

$SOURCE_LOGO = "src/assets/images/pwa.png"
$OUTPUT_DIR = "public/icons"

Write-Host "🎨 Generating PWA icons from $SOURCE_LOGO..." -ForegroundColor Cyan

# Create output directory
if (-not (Test-Path $OUTPUT_DIR)) {
    New-Item -ItemType Directory -Path $OUTPUT_DIR -Force | Out-Null
    Write-Host "✓ Created output directory: $OUTPUT_DIR" -ForegroundColor Green
}

# Check if source file exists
if (-not (Test-Path $SOURCE_LOGO)) {
    Write-Host "❌ Source logo not found: $SOURCE_LOGO" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 This script requires ImageMagick to be installed." -ForegroundColor Yellow
Write-Host "   If not installed, download from: https://imagemagick.org/script/download.php" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔄 Checking for ImageMagick..." -ForegroundColor Cyan

# Check if ImageMagick is installed
$magickInstalled = $false
try {
    $magickVersion = & magick -version 2>$null
    if ($LASTEXITCODE -eq 0) {
        $magickInstalled = $true
        Write-Host "✓ ImageMagick found!" -ForegroundColor Green
    }
} catch {
    # Try older 'convert' command
    try {
        $convertVersion = & convert -version 2>$null
        if ($LASTEXITCODE -eq 0) {
            $magickInstalled = $true
            Write-Host "✓ ImageMagick (convert) found!" -ForegroundColor Green
        }
    } catch {}
}

if (-not $magickInstalled) {
    Write-Host ""
    Write-Host "❌ ImageMagick is not installed or not in PATH." -ForegroundColor Red
    Write-Host ""
    Write-Host "📌 Please install ImageMagick:" -ForegroundColor Yellow
    Write-Host "   1. Download from: https://imagemagick.org/script/download.php" -ForegroundColor White
    Write-Host "   2. During installation, check 'Add to PATH'" -ForegroundColor White
    Write-Host "   3. Restart PowerShell and run this script again" -ForegroundColor White
    Write-Host ""
    Write-Host "📌 Or use online tools:" -ForegroundColor Yellow
    Write-Host "   - https://realfavicongenerator.net/" -ForegroundColor White
    Write-Host "   - https://www.pwabuilder.com/imageGenerator" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "📱 Generating standard icons..." -ForegroundColor Cyan

# Define icon sizes
$iconSizes = @(
    @{Size=16; Name="icon-16x16.png"},
    @{Size=32; Name="icon-32x32.png"},
    @{Size=72; Name="icon-72x72.png"},
    @{Size=96; Name="icon-96x96.png"},
    @{Size=128; Name="icon-128x128.png"},
    @{Size=144; Name="icon-144x144.png"},
    @{Size=152; Name="icon-152x152.png"},
    @{Size=192; Name="icon-192x192.png"},
    @{Size=384; Name="icon-384x384.png"},
    @{Size=512; Name="icon-512x512.png"}
)

# Generate standard icons
foreach ($icon in $iconSizes) {
    $size = $icon.Size
    $filename = $icon.Name
    $outputPath = Join-Path $OUTPUT_DIR $filename
    
    Write-Host "  ✓ $filename (${size}x${size})" -ForegroundColor Green
    
    # Use magick command (ImageMagick v7+)
    & magick $SOURCE_LOGO -resize "${size}x${size}" -background white -gravity center -extent "${size}x${size}" $outputPath 2>$null
    
    if ($LASTEXITCODE -ne 0) {
        # Fallback to convert command (older ImageMagick)
        & convert $SOURCE_LOGO -resize "${size}x${size}" -background white -gravity center -extent "${size}x${size}" $outputPath 2>$null
    }
}

Write-Host ""
Write-Host "🍎 Generating Apple Touch icons..." -ForegroundColor Cyan

# Apple Touch Icons
$appleIcons = @(
    @{Size=180; Name="apple-touch-icon.png"},
    @{Size=180; Name="apple-touch-icon-180x180.png"},
    @{Size=167; Name="apple-touch-icon-167x167.png"},
    @{Size=152; Name="apple-touch-icon-152x152.png"}
)

foreach ($icon in $appleIcons) {
    $size = $icon.Size
    $filename = $icon.Name
    $outputPath = Join-Path $OUTPUT_DIR $filename
    
    Write-Host "  ✓ $filename (${size}x${size})" -ForegroundColor Green
    
    & magick $SOURCE_LOGO -resize "${size}x${size}" -background white -gravity center -extent "${size}x${size}" $outputPath 2>$null
    
    if ($LASTEXITCODE -ne 0) {
        & convert $SOURCE_LOGO -resize "${size}x${size}" -background white -gravity center -extent "${size}x${size}" $outputPath 2>$null
    }
}

Write-Host ""
Write-Host "🪟 Generating Microsoft Tile icons..." -ForegroundColor Cyan

# Microsoft Tile Icons
$msIcons = @(
    @{Size=70; Name="ms-icon-70x70.png"},
    @{Size=144; Name="ms-icon-144x144.png"},
    @{Size=150; Name="ms-icon-150x150.png"},
    @{Size=310; Name="ms-icon-310x310.png"}
)

foreach ($icon in $msIcons) {
    $size = $icon.Size
    $filename = $icon.Name
    $outputPath = Join-Path $OUTPUT_DIR $filename
    
    Write-Host "  ✓ $filename (${size}x${size})" -ForegroundColor Green
    
    & magick $SOURCE_LOGO -resize "${size}x${size}" -background white -gravity center -extent "${size}x${size}" $outputPath 2>$null
    
    if ($LASTEXITCODE -ne 0) {
        & convert $SOURCE_LOGO -resize "${size}x${size}" -background white -gravity center -extent "${size}x${size}" $outputPath 2>$null
    }
}

Write-Host ""
Write-Host "📐 Generating Favicon..." -ForegroundColor Cyan

# Generate favicon.ico
$faviconPath = "public/favicon.ico"
Write-Host "  ✓ favicon.ico (16x16, 32x32, 48x48)" -ForegroundColor Green

& magick $SOURCE_LOGO `( -clone 0 -resize 16x16 `) `( -clone 0 -resize 32x32 `) `( -clone 0 -resize 48x48 `) -delete 0 -colors 256 $faviconPath 2>$null

if ($LASTEXITCODE -ne 0) {
    & convert $SOURCE_LOGO -resize 32x32 $faviconPath 2>$null
}

Write-Host ""
Write-Host "✅ PWA icons generated successfully!" -ForegroundColor Green
Write-Host "📁 Output directory: $OUTPUT_DIR" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Check the generated icons in $OUTPUT_DIR" -ForegroundColor White
Write-Host "   2. Icons are already configured in public/manifest.json" -ForegroundColor White
Write-Host "   3. Test your PWA in browsers" -ForegroundColor White
Write-Host ""
