import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar/Sidebar';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { useResponsiveSidebar } from './useResponsiveSidebar';
import { useNavigation } from './useNavigation';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarCollapsed, isMobileMenuOpen, toggleSidebar, closeMobileMenu } = useResponsiveSidebar();
  const { activeId, handleNavigate } = useNavigation();

  const handleLogout = () => {
    // Clear any auth tokens/session data here if needed
    console.log('Logging out...');
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar - Off-canvas on mobile, sticky on desktop */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        activeId={activeId}
        onNavigate={handleNavigate}
        isMobileOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full transition-all duration-300 ease-in-out">
        {/* Header - Sticky with responsive height */}
        <Header 
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          isMobileMenuOpen={isMobileMenuOpen}
          onNavigateToProfile={() => navigate('/profile')}
          onLogout={handleLogout}
        />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Main Content: Responsive padding */}
          <main className="w-full p-4 md:p-6 lg:p-8 pb-6">
            <div className="w-full max-w-[1920px] mx-auto space-y-4 md:space-y-6">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};
