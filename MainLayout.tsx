import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Layout/Footer';
import { AppRoutes } from './MainLayout/AppRoutes';
import { useResponsiveSidebar } from './MainLayout/useResponsiveSidebar';
import { useNavigation } from './MainLayout/useNavigation';

export const MainLayout: React.FC = () => {
  const { isSidebarCollapsed, isMobileMenuOpen, toggleSidebar, setIsMobileMenuOpen } = useResponsiveSidebar();
  const { activeId, handleNavigate } = useNavigation();

  return (
    <div className="flex h-screen w-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar - Responsive */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        activeId={activeId}
        onNavigate={handleNavigate}
      />

      {/* Mobile Overlay when sidebar is visible on mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full transition-all duration-300 ease-in-out">
        {/* Header - Sticky with responsive height */}
        <Header 
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Main Content: Responsive padding */}
          <main className="w-full p-4 md:p-6 lg:p-8 pb-6">
            <div className="w-full max-w-[1920px] mx-auto space-y-4 md:space-y-6">
              <AppRoutes />
            </div>
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};