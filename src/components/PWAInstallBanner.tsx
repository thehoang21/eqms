import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { cn } from '@/components/ui/utils';
import { showPWAInstallPrompt, isPWAInstalled, canShowInstallPrompt } from '@/utils/pwa';

interface PWAInstallBannerProps {
  className?: string;
  variant?: 'floating' | 'inline' | 'modal';
  autoShow?: boolean;
  delay?: number;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({
  className,
  variant = 'floating',
  autoShow = true,
  delay = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (isPWAInstalled()) {
      return;
    }

    // Check if install prompt is available
    const checkInstallability = () => {
      setCanInstall(canShowInstallPrompt());
    };

    checkInstallability();

    // Listen for installable event
    const handleInstallable = () => {
      setCanInstall(true);
      
      if (autoShow) {
        // Show banner after delay
        setTimeout(() => {
          setIsVisible(true);
        }, delay);
      }
    };

    const handleInstalled = () => {
      setIsVisible(false);
      setCanInstall(false);
    };

    window.addEventListener('pwa:installable', handleInstallable);
    window.addEventListener('pwa:installed', handleInstalled);

    return () => {
      window.removeEventListener('pwa:installable', handleInstallable);
      window.removeEventListener('pwa:installed', handleInstalled);
    };
  }, [autoShow, delay]);

  const handleInstall = async () => {
    setIsInstalling(true);
    
    try {
      const accepted = await showPWAInstallPrompt();
      
      if (accepted) {
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    
    // Store dismissal in localStorage to prevent showing again for 7 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't render if can't install or not visible
  if (!canInstall || !isVisible) {
    return null;
  }

  // Floating banner (bottom of screen)
  if (variant === 'floating') {
    return (
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[100] md:left-auto md:right-6 md:bottom-6 md:max-w-sm",
          "animate-in slide-in-from-bottom-5 duration-300",
          className
        )}
      >
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-2xl border-t md:border md:border-emerald-800 md:rounded-xl overflow-hidden">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="p-5 pr-10">
            {/* Icon */}
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center justify-center h-12 w-12 bg-white/10 rounded-xl shrink-0">
                <Smartphone className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base mb-0.5">Install NTP QMS</h3>
                <p className="text-sm text-emerald-50">Access faster, work offline</p>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-1.5 mb-4 text-sm text-emerald-50">
              <li className="flex items-center gap-2">
                <div className="h-1 w-1 bg-emerald-200 rounded-full" />
                <span>Works offline</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1 w-1 bg-emerald-200 rounded-full" />
                <span>Faster load times</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1 w-1 bg-emerald-200 rounded-full" />
                <span>Add to home screen</span>
              </li>
            </ul>

            {/* Install button */}
            <Button
              onClick={handleInstall}
              disabled={isInstalling}
              className="w-full bg-white text-emerald-700 hover:bg-emerald-50 shadow-lg"
              size="default"
            >
              {isInstalling ? (
                <>
                  <div className="h-4 w-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin mr-2" />
                  Installing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Install App
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Inline banner (for embedding in pages)
  if (variant === 'inline') {
    return (
      <div
        className={cn(
          "bg-gradient-to-r from-emerald-50 to-cyan-50 border border-emerald-200 rounded-xl p-5 relative",
          "animate-in fade-in slide-in-from-top-2 duration-300",
          className
        )}
      >
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-emerald-100 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4 text-slate-600" />
        </button>

        <div className="flex items-start gap-4 pr-8">
          <div className="flex items-center justify-center h-12 w-12 bg-emerald-100 rounded-xl shrink-0">
            <Smartphone className="h-6 w-6 text-emerald-700" />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-slate-900 mb-1">Install NTP QMS App</h3>
            <p className="text-sm text-slate-600 mb-3">
              Get the full experience with offline access and faster performance.
            </p>

            <Button
              onClick={handleInstall}
              disabled={isInstalling}
              variant="default"
              size="sm"
            >
              {isInstalling ? (
                <>
                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Installing...
                </>
              ) : (
                <>
                  <Download className="h-3 w-3 mr-2" />
                  Install Now
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Modal variant
  if (variant === 'modal') {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/50 z-[99] animate-in fade-in duration-200"
          onClick={handleDismiss}
          aria-hidden="true"
        />

        {/* Modal */}
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className={cn(
              "bg-white rounded-2xl shadow-2xl max-w-md w-full",
              "animate-in zoom-in-95 slide-in-from-bottom-2 duration-300",
              className
            )}
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>

            <div className="p-8">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center h-20 w-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
                  <Smartphone className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Install NTP QMS
                </h2>
                <p className="text-slate-600">
                  Add to your home screen for a better experience
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="h-2 w-2 bg-emerald-600 rounded-full" />
                  <span className="text-sm text-slate-700">Work offline without internet</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="h-2 w-2 bg-emerald-600 rounded-full" />
                  <span className="text-sm text-slate-700">Faster loading and performance</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="h-2 w-2 bg-emerald-600 rounded-full" />
                  <span className="text-sm text-slate-700">Quick access from home screen</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button
                  onClick={handleInstall}
                  disabled={isInstalling}
                  variant="default"
                  className="flex-1"
                >
                  {isInstalling ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Installing...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Install
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
};

export default PWAInstallBanner;
