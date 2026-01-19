/**
 * PWA Registration and Management
 * Handles service worker registration, updates, and PWA install prompts
 */

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let swRegistration: ServiceWorkerRegistration | null = null;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[PWA] Service workers are not supported');
    return;
  }

  try {
    swRegistration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
      updateViaCache: 'none', // Always check for updates
    });

    console.log('[PWA] Service worker registered successfully:', swRegistration);

    // Check for updates every hour
    setInterval(() => {
      swRegistration?.update();
    }, 60 * 60 * 1000);

    // Handle updates
    swRegistration.addEventListener('updatefound', () => {
      const newWorker = swRegistration?.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available, show update notification
            showUpdateNotification();
          }
        });
      }
    });

    // Check if there's an update waiting
    if (swRegistration.waiting) {
      showUpdateNotification();
    }

  } catch (error) {
    console.error('[PWA] Service worker registration failed:', error);
  }
}

/**
 * Unregister service worker (for debugging)
 */
export async function unregisterServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    for (const registration of registrations) {
      await registration.unregister();
      console.log('[PWA] Service worker unregistered');
    }
  } catch (error) {
    console.error('[PWA] Service worker unregistration failed:', error);
  }
}

/**
 * Show update notification when new version is available
 */
function showUpdateNotification(): void {
  // You can integrate with your toast/notification system
  if (window.confirm('A new version is available. Reload to update?')) {
    skipWaiting();
  }
}

/**
 * Skip waiting and activate new service worker
 */
export function skipWaiting(): void {
  if (swRegistration?.waiting) {
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
  
  // Reload page after service worker is activated
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

/**
 * Clear all caches (for debugging)
 */
export async function clearCaches(): Promise<void> {
  if (!('caches' in window)) {
    return;
  }

  try {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
    console.log('[PWA] All caches cleared');
  } catch (error) {
    console.error('[PWA] Failed to clear caches:', error);
  }
}

/**
 * Get service worker version
 */
export async function getServiceWorkerVersion(): Promise<string | null> {
  if (!swRegistration?.active) {
    return null;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data.version);
    };

    swRegistration.active?.postMessage(
      { type: 'GET_VERSION' },
      [messageChannel.port2]
    );
  });
}

// ==================== PWA Install Prompt ====================

/**
 * Initialize PWA install prompt
 */
export function initializePWAPrompt(): void {
  // Capture the install prompt event
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    console.log('[PWA] Install prompt captured');
    
    // Show custom install button/banner
    showInstallButton();
  });

  // Track successful installations
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] App installed successfully');
    deferredPrompt = null;
    hideInstallButton();
    
    // Track analytics
    trackPWAInstall();
  });
}

/**
 * Show PWA install prompt
 */
export async function showPWAInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    console.warn('[PWA] Install prompt not available');
    return false;
  }

  try {
    // Show the install prompt
    await deferredPrompt.prompt();
    
    // Wait for user response
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`[PWA] User ${outcome} the install prompt`);
    
    deferredPrompt = null;
    
    return outcome === 'accepted';
  } catch (error) {
    console.error('[PWA] Install prompt failed:', error);
    return false;
  }
}

/**
 * Check if app is installed
 */
export function isPWAInstalled(): boolean {
  // Check if running in standalone mode
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // Check iOS
  if ((navigator as any).standalone === true) {
    return true;
  }

  return false;
}

/**
 * Check if install prompt is available
 */
export function canShowInstallPrompt(): boolean {
  return deferredPrompt !== null;
}

/**
 * Show install button in UI
 */
function showInstallButton(): void {
  // Dispatch custom event to show install button
  window.dispatchEvent(new CustomEvent('pwa:installable'));
}

/**
 * Hide install button in UI
 */
function hideInstallButton(): void {
  // Dispatch custom event to hide install button
  window.dispatchEvent(new CustomEvent('pwa:installed'));
}

/**
 * Track PWA installation (analytics)
 */
function trackPWAInstall(): void {
  // Integrate with your analytics
  console.log('[PWA] Installation tracked');
  
  // Example: Google Analytics (if available)
  if (typeof (window as any).gtag !== 'undefined') {
    (window as any).gtag('event', 'pwa_install', {
      event_category: 'PWA',
      event_label: 'App Installed',
    });
  }
}

// ==================== Push Notifications ====================

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('[PWA] Notifications not supported');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  if (!swRegistration) {
    console.warn('[PWA] Service worker not registered');
    return null;
  }

  try {
    const permission = await requestNotificationPermission();
    
    if (permission !== 'granted') {
      console.warn('[PWA] Notification permission denied');
      return null;
    }

    // Get existing subscription or create new one
    let subscription = await swRegistration.pushManager.getSubscription();
    
    if (!subscription) {
      // Replace with your VAPID public key
      const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY';
      
      subscription = await swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
      });
      
      console.log('[PWA] Push subscription created:', subscription);
    }

    // Send subscription to your server
    await sendSubscriptionToServer(subscription);
    
    return subscription;
  } catch (error) {
    console.error('[PWA] Push subscription failed:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<boolean> {
  if (!swRegistration) {
    return false;
  }

  try {
    const subscription = await swRegistration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      console.log('[PWA] Unsubscribed from push notifications');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[PWA] Unsubscribe failed:', error);
    return false;
  }
}

/**
 * Send subscription to server
 */
async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
  try {
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
    
    console.log('[PWA] Subscription sent to server');
  } catch (error) {
    console.error('[PWA] Failed to send subscription to server:', error);
  }
}

/**
 * Convert VAPID key to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// ==================== Background Sync ====================

/**
 * Register background sync
 */
export async function registerBackgroundSync(tag: string): Promise<void> {
  if (!swRegistration) {
    console.warn('[PWA] Service worker not registered');
    return;
  }

  if (!('sync' in swRegistration)) {
    console.warn('[PWA] Background sync not supported');
    return;
  }

  try {
    await (swRegistration as any).sync.register(tag);
    console.log(`[PWA] Background sync registered: ${tag}`);
  } catch (error) {
    console.error('[PWA] Background sync registration failed:', error);
  }
}

/**
 * Register periodic background sync (experimental)
 */
export async function registerPeriodicSync(tag: string, minInterval: number): Promise<void> {
  if (!swRegistration) {
    console.warn('[PWA] Service worker not registered');
    return;
  }

  if (!('periodicSync' in swRegistration)) {
    console.warn('[PWA] Periodic sync not supported');
    return;
  }

  try {
    const status = await navigator.permissions.query({
      name: 'periodic-background-sync' as PermissionName,
    });

    if (status.state === 'granted') {
      await (swRegistration as any).periodicSync.register(tag, {
        minInterval: minInterval,
      });
      
      console.log(`[PWA] Periodic sync registered: ${tag}`);
    }
  } catch (error) {
    console.error('[PWA] Periodic sync registration failed:', error);
  }
}

// ==================== Export All ====================

export const PWA = {
  // Service Worker
  registerServiceWorker,
  unregisterServiceWorker,
  skipWaiting,
  clearCaches,
  getServiceWorkerVersion,
  
  // Install Prompt
  initializePWAPrompt,
  showPWAInstallPrompt,
  isPWAInstalled,
  canShowInstallPrompt,
  
  // Push Notifications
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  
  // Background Sync
  registerBackgroundSync,
  registerPeriodicSync,
};

export default PWA;
