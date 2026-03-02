import React, { useEffect, useRef } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { NetworkStatusMonitor } from '@/components/NetworkStatusMonitor';
import { ScrollToTop } from '@/components/ui/scroll-to-top/ScrollToTop';
import { useResponsiveSidebar } from './useResponsiveSidebar';
import { useNavigation } from './useNavigation';
import { resetViewportZoom, isIOSSafari } from '@/utils/viewport';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarCollapsed, isMobileMenuOpen, toggleSidebar, closeMobileMenu } = useResponsiveSidebar();
  const { activeId, handleNavigate } = useNavigation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset viewport zoom on iOS Safari
  useEffect(() => {
    if (isIOSSafari()) {
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
      className="flex h-dvh w-screen bg-slate-50 font-sans text-slate-900 overflow-hidden"
      style={{
        // Fallback for browsers without dvh support
        minHeight: '100vh',
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

      {/* Mobile Backdrop - Blur effect when sidebar is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-150 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
          style={{
            // Ensure full coverage including safe areas
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header - Pinned at top via flex shrink-0 */}
        <Header 
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          isMobileMenuOpen={isMobileMenuOpen}
          onNavigateToProfile={() => navigate('/profile')}
          onLogout={handleLogout}
        />

        {/* Scrollable Content Area - ONLY this div scrolls */}
        <div
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar"
          style={{
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Main Content: Responsive padding */}
          <main
            className="w-full p-4 md:p-6 lg:p-8 pb-6"
            style={{
              paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
            }}
          >
            <div className="w-full max-w-[1920px] mx-auto space-y-4 md:space-y-6">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Footer - Pinned at bottom via flex shrink-0 */}
        <Footer />
      </div>

      {/* Scroll To Top - Global */}
      <ScrollToTop 
        scrollContainerRef={scrollContainerRef}
        isMobileMenuOpen={isMobileMenuOpen}
      />
    </div>
  );
};
