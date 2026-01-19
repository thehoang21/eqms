# PWA Quick Start Guide

## 🚀 Cài đặt nhanh PWA cho Ngoc Thien Pharma QMS

### Bước 1: Generate Icons

```bash
# Cấp quyền thực thi cho script
chmod +x scripts/generate-pwa-icons.sh

# Chạy script (yêu cầu ImageMagick)
./scripts/generate-pwa-icons.sh
```

**Nếu chưa có ImageMagick:**
```bash
brew install imagemagick
```

### Bước 2: Verify Configuration

Kiểm tra các file đã được tạo:

```bash
✅ public/manifest.json
✅ public/service-worker.js
✅ public/browserconfig.xml
✅ public/robots.txt
✅ public/icons/ (folder with all icon sizes)
```

### Bước 3: Test Locally

```bash
# Build project
npm run build

# Serve để test
npm run preview

# Mở browser tại https://localhost:5173
```

### Bước 4: Test PWA Installation

#### Desktop (Chrome):
1. Mở app
2. Click icon "Install" ở address bar
3. Hoặc đợi banner hiện sau 5 giây

#### Mobile (Android):
1. Mở Chrome
2. Tap menu → "Add to Home screen"
3. Hoặc tap banner "Install App"

#### iOS:
1. Mở Safari
2. Tap Share → "Add to Home Screen"
3. Icon xuất hiện trên home screen

### Bước 5: Verify Installation

**Check trong Chrome DevTools:**
1. F12 → Application tab
2. Manifest: Xem thông tin manifest
3. Service Workers: Verify đã registered
4. Cache Storage: Xem cached files

**Run Lighthouse:**
1. F12 → Lighthouse tab
2. Select "Progressive Web App"
3. Generate report
4. Target: 100/100 PWA score

---

## 📱 Features đã có sẵn

- ✅ **Install to home screen** - Add như native app
- ✅ **Offline mode** - Hoạt động không cần internet
- ✅ **Fast loading** - Cache static assets
- ✅ **Auto-update** - Service worker tự động update
- ✅ **Push notifications** - Ready (cần backend setup)
- ✅ **Background sync** - Đồng bộ khi có mạng
- ✅ **App shortcuts** - Dashboard, Tasks, Documents
- ✅ **Share target** - Share files vào app

---

## 🎨 Customization

### Thay đổi App Name:
```json
// public/manifest.json
{
  "name": "Tên mới",
  "short_name": "Tên ngắn"
}
```

### Thay đổi Theme Color:
```json
// public/manifest.json
{
  "theme_color": "#màu-của-bạn"
}
```

```html
<!-- index.html -->
<meta name="theme-color" content="#màu-của-bạn" />
```

### Thêm/Bỏ Install Banner:
```tsx
// src/app/App.tsx

// Bỏ banner
{/* <PWAInstallBanner variant="floating" /> */}

// Hoặc thay đổi variant
<PWAInstallBanner variant="modal" />    // Modal dialog
<PWAInstallBanner variant="inline" />   // Inline banner
<PWAInstallBanner variant="floating" /> // Floating (default)
```

---

## 🐛 Troubleshooting

### Service Worker không register
```typescript
// Check console for errors
// Clear cache và reload:
await caches.keys().then(names => 
  names.forEach(name => caches.delete(name))
);
```

### Install prompt không hiện
**Kiểm tra:**
- ✅ HTTPS enabled (hoặc localhost)
- ✅ manifest.json valid
- ✅ Icons đã generate
- ✅ Chưa cài đặt app

### Icons không hiển thị
```bash
# Re-generate icons
./scripts/generate-pwa-icons.sh

# Verify trong public/icons/
ls -la public/icons/
```

---

## 📚 Documentation

Đọc thêm chi tiết trong:
- **PWA_IMPLEMENTATION_GUIDE.md** - Full documentation
- **MOBILE_SIDEBAR_OPTIMIZATION.md** - Mobile optimizations

---

## ✅ Production Checklist

Trước khi deploy:

- [ ] Generate all icons
- [ ] Update manifest.json với production domain
- [ ] Set correct start_url
- [ ] Enable HTTPS
- [ ] Test installation trên multiple devices
- [ ] Run Lighthouse audit (target: PWA 100/100)
- [ ] Test offline functionality
- [ ] Verify auto-update works
- [ ] Setup push notification backend (optional)
- [ ] Configure analytics tracking

---

## 🎯 Next Steps

1. **Test PWA Installation**
   - Desktop Chrome/Edge
   - Android Chrome/Samsung Internet
   - iOS Safari (Add to Home Screen)

2. **Setup Push Notifications** (Optional)
   - Generate VAPID keys
   - Implement backend endpoint
   - Test notifications

3. **Monitor Usage**
   - Track install events
   - Monitor offline usage
   - Analyze performance

---

**Need help?** Check PWA_IMPLEMENTATION_GUIDE.md for detailed docs.
