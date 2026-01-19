# Progressive Web App (PWA) Implementation Guide

## 📱 Tổng quan

Ứng dụng **Ngoc Thien Pharma QMS** đã được thiết kế như một **Progressive Web App (PWA)** hoàn chỉnh, cho phép người dùng:

- ✅ **Cài đặt lên màn hình chính** mobile/desktop như ứng dụng native
- ✅ **Hoạt động offline** với service worker caching
- ✅ **Tải nhanh hơn** với caching strategies
- ✅ **Nhận push notifications** (optional)
- ✅ **Background sync** để đồng bộ dữ liệu
- ✅ **Trải nghiệm native-like** với standalone display mode

---

## 🎯 Tính năng PWA đã triển khai

### 1. **Web App Manifest** (`/public/manifest.json`)

```json
{
  "name": "Ngoc Thien Pharma - Quality Management System",
  "short_name": "NTP QMS",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#059669",
  "background_color": "#ffffff"
}
```

**Features:**
- App name và short name
- Custom theme color (emerald-600)
- Standalone display mode (fullscreen như native app)
- Icons đa kích thước (72x72 → 512x512)
- App shortcuts (Dashboard, Tasks, Documents)
- Share target (share files vào app)
- File handlers (mở PDF, DOCX, XLSX)

### 2. **Service Worker** (`/public/service-worker.js`)

**Caching Strategies:**

#### a) **Network First** - Cho API calls
- Ưu tiên network → fallback cache
- Luôn có dữ liệu mới nhất
- Offline mode với cached data

#### b) **Cache First** - Cho images/static assets
- Ưu tiên cache → fallback network
- Tải nhanh từ cache
- Update cache khi fetch mới

#### c) **Stale While Revalidate** - Cho static files
- Return cache ngay lập tức
- Update cache ở background
- Balance giữa speed và freshness

**Features:**
- Auto-update service worker
- Cache versioning (`v1.0.0`)
- Push notifications support
- Background sync
- Periodic sync (experimental)

### 3. **PWA Utilities** (`/src/utils/pwa.ts`)

**Service Worker Management:**
```typescript
import { registerServiceWorker, skipWaiting } from '@/utils/pwa';

// Register SW
await registerServiceWorker();

// Update SW
skipWaiting();
```

**Install Prompt:**
```typescript
import { showPWAInstallPrompt, isPWAInstalled } from '@/utils/pwa';

// Show install dialog
const accepted = await showPWAInstallPrompt();

// Check if installed
if (isPWAInstalled()) {
  console.log('Running as PWA');
}
```

**Push Notifications:**
```typescript
import { subscribeToPushNotifications } from '@/utils/pwa';

// Subscribe to push
const subscription = await subscribeToPushNotifications();
```

### 4. **PWA Install Banner** (`/src/components/PWAInstallBanner.tsx`)

**3 Variants:**

#### a) **Floating Banner** (Default)
```tsx
<PWAInstallBanner variant="floating" autoShow delay={5000} />
```
- Hiển thị ở bottom-right (desktop) hoặc bottom (mobile)
- Auto-show sau 5 giây
- Dismissible với localStorage tracking

#### b) **Inline Banner**
```tsx
<PWAInstallBanner variant="inline" />
```
- Embed trong page content
- Tốt cho landing page hoặc settings

#### c) **Modal Dialog**
```tsx
<PWAInstallBanner variant="modal" />
```
- Full-screen modal với backdrop
- Chi tiết features và benefits

---

## 🚀 Cài đặt và sử dụng

### Bước 1: Generate PWA Icons

Chạy script để tạo tất cả icon sizes từ logo:

```bash
chmod +x scripts/generate-pwa-icons.sh
./scripts/generate-pwa-icons.sh
```

**Icons được tạo:**
- Standard icons: 16x16 → 512x512
- Apple Touch icons: 152x152, 167x167, 180x180
- Microsoft Tile icons: 70x70, 144x144, 150x150, 310x310
- Maskable icons: 192x192, 512x512 (với safe zone)
- Favicon.ico (multi-size)
- Shortcut icons: Dashboard, Tasks, Documents
- Badge icon: 72x72

**Yêu cầu:**
```bash
# Install ImageMagick
brew install imagemagick
```

### Bước 2: Verify PWA Configuration

**Checklist:**
- ✅ `manifest.json` trong `/public/`
- ✅ `service-worker.js` trong `/public/`
- ✅ Icons folder `/public/icons/` với tất cả sizes
- ✅ `index.html` có `<link rel="manifest" href="/manifest.json">`
- ✅ Theme color meta tags
- ✅ Apple touch icon links

### Bước 3: Test PWA Installation

#### Desktop (Chrome/Edge):
1. Mở app trong Chrome
2. Click icon "Install" ở address bar
3. Hoặc click banner "Install App"
4. App sẽ mở như standalone window

#### Mobile (Android):
1. Mở app trong Chrome/Samsung Internet
2. Tap menu → "Add to Home screen"
3. Hoặc tap banner "Install App"
4. Icon xuất hiện trên home screen

#### Mobile (iOS Safari):
1. Mở app trong Safari
2. Tap Share button (square with arrow)
3. Scroll và tap "Add to Home Screen"
4. Icon xuất hiện trên home screen

---

## 📊 PWA Audit với Lighthouse

### Run Lighthouse Audit:

```bash
# Chrome DevTools
1. F12 → Lighthouse tab
2. Select "Progressive Web App"
3. Click "Generate report"
```

**Target Scores:**
- ✅ **PWA:** 100/100
- ✅ **Performance:** 90+/100
- ✅ **Accessibility:** 90+/100
- ✅ **Best Practices:** 95+/100
- ✅ **SEO:** 90+/100

### PWA Checklist:

- ✅ Registers a service worker
- ✅ Responds with 200 when offline
- ✅ Has a web app manifest
- ✅ Configured for custom splash screen
- ✅ Sets theme color
- ✅ Uses HTTPS
- ✅ Redirects HTTP to HTTPS
- ✅ Viewport meta tag
- ✅ Apple touch icon
- ✅ Maskable icon support

---

## 🎨 Customization

### Update App Name:
```json
// manifest.json
{
  "name": "Your Custom Name",
  "short_name": "Short Name"
}
```

### Update Theme Color:
```json
// manifest.json
{
  "theme_color": "#your-color",
  "background_color": "#your-bg-color"
}
```

```html
<!-- index.html -->
<meta name="theme-color" content="#your-color" />
```

### Update Start URL:
```json
// manifest.json
{
  "start_url": "/custom-start"
}
```

### Add Custom Shortcuts:
```json
// manifest.json
{
  "shortcuts": [
    {
      "name": "Custom Action",
      "url": "/custom-url",
      "icons": [{ "src": "/icons/custom.png", "sizes": "96x96" }]
    }
  ]
}
```

### Modify Caching Strategy:

```javascript
// service-worker.js

// Change cache version
const CACHE_VERSION = 'v2.0.0';

// Add more static assets
const STATIC_ASSETS = [
  '/',
  '/custom-page',
  '/custom-asset.js'
];

// Change cache lifetime
const CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
```

---

## 🔔 Push Notifications Setup

### Bước 1: Generate VAPID Keys

```bash
npm install web-push -g
web-push generate-vapid-keys
```

### Bước 2: Update pwa.ts

```typescript
// src/utils/pwa.ts
const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY_HERE';
```

### Bước 3: Backend Implementation

```typescript
// Backend: /api/push/subscribe
app.post('/api/push/subscribe', (req, res) => {
  const subscription = req.body;
  
  // Save subscription to database
  await saveSubscription(subscription);
  
  res.json({ success: true });
});

// Backend: Send notification
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:your@email.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const payload = JSON.stringify({
  title: 'New Document',
  body: 'You have a new document to review',
  icon: '/icons/icon-192x192.png',
  data: { url: '/documents/123' }
});

await webpush.sendNotification(subscription, payload);
```

### Bước 4: Request Permission

```typescript
import { subscribeToPushNotifications } from '@/utils/pwa';

// In your app
const subscription = await subscribeToPushNotifications();
if (subscription) {
  console.log('Subscribed to push notifications');
}
```

---

## 📴 Offline Functionality

### Cached Resources:

**Static Assets:**
- HTML pages
- CSS files
- JavaScript bundles
- Logo và images
- Fonts

**API Responses:**
- `/api/auth/me`
- `/api/dashboard`
- `/api/tasks`
- `/api/documents`

### Offline Behavior:

1. **Navigation:** Cached HTML served
2. **API Calls:** Cached response if available
3. **Images:** Cached images loaded
4. **Failed requests:** Queued for background sync

### Test Offline Mode:

```bash
# Chrome DevTools
1. F12 → Network tab
2. Select "Offline" from throttling dropdown
3. Navigate app - should work with cached data
```

---

## 🔄 Update Flow

### Auto-Update Process:

1. Service worker checks for updates every hour
2. New SW downloads và installs in background
3. When ready, shows "Update available" notification
4. User clicks "Reload to update"
5. New SW activates, page reloads
6. User gets latest version

### Manual Update:

```typescript
import { skipWaiting } from '@/utils/pwa';

// Force update immediately
skipWaiting();
```

### Check Version:

```typescript
import { getServiceWorkerVersion } from '@/utils/pwa';

const version = await getServiceWorkerVersion();
console.log('SW Version:', version); // "v1.0.0"
```

---

## 🐛 Debugging PWA

### Chrome DevTools:

#### Application Tab:
- **Manifest:** View manifest.json
- **Service Workers:** See registered SWs, update/unregister
- **Cache Storage:** Browse cached files
- **IndexedDB:** View stored data
- **Background Services:** Track sync events

#### Console Commands:

```javascript
// Get all cache names
caches.keys().then(console.log);

// Open specific cache
caches.open('ntp-qms-v1.0.0').then(cache => {
  cache.keys().then(console.log);
});

// Delete all caches
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});

// Unregister all service workers
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(r => r.unregister());
});
```

### Common Issues:

#### Issue: Service worker not updating
**Solution:**
```typescript
// Force update
await navigator.serviceWorker.getRegistration()
  .then(reg => reg?.update());
```

#### Issue: Cached files not updating
**Solution:**
```typescript
import { clearCaches } from '@/utils/pwa';
await clearCaches();
```

#### Issue: Install prompt not showing
**Check:**
- HTTPS enabled
- manifest.json valid
- Icons present
- Not already installed

---

## 📈 Analytics Tracking

### Track PWA Events:

```typescript
// Installation
window.addEventListener('appinstalled', () => {
  gtag('event', 'pwa_install', {
    event_category: 'PWA',
    event_label: 'App Installed'
  });
});

// Standalone mode
if (window.matchMedia('(display-mode: standalone)').matches) {
  gtag('event', 'pwa_usage', {
    event_category: 'PWA',
    event_label: 'Running as PWA'
  });
}

// Offline usage
window.addEventListener('offline', () => {
  gtag('event', 'pwa_offline', {
    event_category: 'PWA',
    event_label: 'App Offline'
  });
});
```

---

## 🌐 Browser Support

### Desktop:
- ✅ **Chrome 67+** - Full support
- ✅ **Edge 79+** - Full support
- ✅ **Firefox 100+** - Partial support (no install prompt)
- ✅ **Safari 15.4+** - Partial support
- ✅ **Opera 54+** - Full support

### Mobile:
- ✅ **Chrome Android** - Full support
- ✅ **Samsung Internet** - Full support
- ✅ **Safari iOS 15.4+** - Add to Home Screen
- ✅ **Firefox Android** - Partial support
- ✅ **Edge Mobile** - Full support

### Features by Browser:

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Install Prompt | ✅ | ✅ | ❌ | ❌ |
| Service Worker | ✅ | ✅ | ✅ | ✅ |
| Push Notifications | ✅ | ✅ | ✅ | ✅ |
| Background Sync | ✅ | ✅ | ❌ | ❌ |
| App Shortcuts | ✅ | ✅ | ❌ | ❌ |
| Share Target | ✅ | ✅ | ❌ | ❌ |

---

## 🔒 Security Best Practices

### 1. HTTPS Required
PWAs **MUST** be served over HTTPS (except localhost for testing)

### 2. Validate manifest.json
```bash
# Test with Chrome DevTools
Application → Manifest → View errors
```

### 3. Service Worker Scope
```javascript
// Limit scope if needed
navigator.serviceWorker.register('/service-worker.js', {
  scope: '/app/' // Only controls /app/* routes
});
```

### 4. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://api.yourbackend.com;">
```

---

## 📦 Production Deployment

### Checklist:

- ✅ Generate all icons (run `generate-pwa-icons.sh`)
- ✅ Update manifest.json với production URLs
- ✅ Set correct `start_url` và `scope`
- ✅ Enable HTTPS
- ✅ Test service worker registration
- ✅ Verify caching strategies
- ✅ Test offline functionality
- ✅ Run Lighthouse audit (target: 100/100 PWA score)
- ✅ Test installation on multiple devices/browsers
- ✅ Setup push notification backend (optional)
- ✅ Configure analytics tracking

### Build Command:

```bash
# Build for production
npm run build

# Serve locally to test PWA
npm run preview

# Test with local HTTPS
npm install -g local-ssl-proxy
local-ssl-proxy --source 443 --target 5173
```

---

## 🎓 Resources

### Documentation:
- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: PWA Training](https://web.dev/progressive-web-apps/)
- [Google Workbox](https://developers.google.com/web/tools/workbox)

### Tools:
- [PWA Builder](https://www.pwabuilder.com/) - Generate PWA assets
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - PWA auditing
- [Maskable.app](https://maskable.app/) - Test maskable icons
- [Web Push Tester](https://web-push-codelab.glitch.me/) - Test push notifications

### Testing:
- [PWA Testing Checklist](https://web.dev/pwa-checklist/)
- [Can I Use - Service Workers](https://caniuse.com/serviceworkers)
- [whatpwacando.today](https://whatpwacando.today/) - PWA feature showcase

---

## 📝 Changelog

### v1.0.0 - PWA Initial Release (January 2026)
- ✨ Full PWA implementation
- ✨ Service worker with caching strategies
- ✨ Web app manifest with shortcuts
- ✨ Install prompt banners (3 variants)
- ✨ Push notifications support
- ✨ Background sync capability
- ✨ Offline functionality
- ✨ Auto-update mechanism
- ✨ PWA utilities library
- ✨ Icon generator script
- ✨ Comprehensive documentation

---

**Created:** January 2026  
**Last Updated:** January 2026  
**Maintained by:** Development Team
