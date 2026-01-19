import React, { useEffect } from 'react';
import { AppRoutes } from './routes';
import { ToastProvider } from '@/components/ui/toast';
import PWAInstallBanner from '@/components/PWAInstallBanner';
import { registerServiceWorker, initializePWAPrompt } from '@/utils/pwa';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize PWA features
    const initPWA = async () => {
      try {
        // Register service worker
        await registerServiceWorker();
        console.log('[App] Service worker registered');
        
        // Initialize install prompt
        initializePWAPrompt();
        console.log('[App] PWA install prompt initialized');
      } catch (error) {
        console.error('[App] PWA initialization failed:', error);
      }
    };

    initPWA();

    // Log PWA installation status
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('[App] Running as installed PWA');
    } else {
      console.log('[App] Running in browser');
    }
  }, []);

  return (
    <React.StrictMode>
      <ToastProvider>
        <AppRoutes />
        {/* PWA Install Banner - floating variant */}
        <PWAInstallBanner variant="floating" autoShow delay={5000} />
      </ToastProvider>
    </React.StrictMode>
  );
};

export default App;
