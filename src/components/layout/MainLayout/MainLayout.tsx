import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { NetworkStatusMonitor } from '@/components/NetworkStatusMonitor';
import { useResponsiveSidebar } from './useResponsiveSidebar';
import { useNavigation } from './useNavigation';
import { resetViewportZoom, isIOSSafari } from '@/utils/viewport';
import { cn } from '@/components/ui/utils';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarCollapsed, isMobileMenuOpen, toggleSidebar, closeMobileMenu } = useResponsiveSidebar();
  const { activeId, handleNavigate } = useNavigation();
  const [isIOS, setIsIOS] = useState(false);

  // Detect iOS Safari on mount
  useEffect(() => {
    setIsIOS(isIOSSafari());
  }, []);

  // Reset viewport zoom on mount (fixes iOS Safari auto-zoom after login)
  useEffect(() => {
    if (isIOSSafari()) {
      // Small delay to ensure the page has rendered
      const timer = setTimeout(() => {
        resetViewportZoom();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleLogout = () => {
    // Clear any auth tokens/session data here if needed
    console.log('Logging out...');
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div 
      className={cn(
        "flex h-screen w-screen bg-slate-50 font-sans text-slate-900 overflow-hidden",
        isIOS && "ios-layout-container"
      )}
      style={{
        // Use dvh for iOS Safari dynamic viewport
        height: '100dvh',
        // Fallback for older browsers
        minHeight: '100vh',
        // iOS Safari fix: use -webkit-fill-available
        ...(isIOS && {
          height: '-webkit-fill-available',
          position: 'fixed' as const,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }),
      }}
    >
      {/* Network Status Monitor - Global */}
      <NetworkStatusMonitor />
      
      {/* Sidebar - Off-canvas on mobile, sticky on desktop */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        activeId={activeId}
        onNavigate={handleNavigate}
        isMobileOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        onToggleSidebar={toggleSidebar}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header - Fixed at top */}
        <Header 
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          isMobileMenuOpen={isMobileMenuOpen}
          onNavigateToProfile={() => navigate('/profile')}
          onLogout={handleLogout}
        />

        {/* Scrollable Content Area */}
        <div 
          className={cn(
            "flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar",
            isIOS && "ios-scroll-container"
          )}
          style={{
            paddingLeft: 'var(--safe-area-inset-left)',
            paddingRight: 'var(--safe-area-inset-right)',
            // iOS Safari fix: enable momentum scrolling
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Main Content: Responsive padding */}
          <main className="w-full p-4 md:p-6 lg:p-8 pb-6">
            <div className="w-full max-w-[1920px] mx-auto space-y-4 md:space-y-6">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Footer - Always visible */}
        <Footer />
      </div>
    </div>
  );
};
