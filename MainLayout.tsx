import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Layout/Footer';
import { BreadcrumbItem } from './types';
import { findNodeAndBreadcrumbs, findNodeByPath, NAV_CONFIG } from './constants';
import { DashboardView } from './features/dashboard';
import { DocumentListView, DocumentsOwnedByMeView, DetailDocumentView } from './features/documents';
import { MyTasksView } from './features/my-tasks';

// Wrapper for Detail View to extract ID from params
const DetailDocumentViewWrapper = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return <DetailDocumentView documentId={id!} onBack={() => navigate(-1)} />;
};

export const MainLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Derive active state from URL
  const activeItem = findNodeByPath(NAV_CONFIG, location.pathname);
  const activeId = activeItem?.id || 'dashboard';

  // Responsive: Auto-collapse sidebar based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // Tablet Portrait: Auto collapse
      if (width >= 768 && width < 1024) {
        setIsSidebarCollapsed(true);
        setIsMobileMenuOpen(false);
      }
      // Tablet Landscape & Desktop: Auto expand
      else if (width >= 1024) {
        setIsSidebarCollapsed(false);
        setIsMobileMenuOpen(false);
      }
      // Mobile: Close menu
      else if (width < 768) {
        setIsMobileMenuOpen(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Derive breadcrumbs from activeId using the recursive helper
  const breadcrumbs: BreadcrumbItem[] = findNodeAndBreadcrumbs(NAV_CONFIG, activeId) || [
    { label: 'Dashboard', id: 'dashboard' },
  ];

  const handleNavigate = (id: string) => {
    const findItem = (items: any[], targetId: string): any => {
      for (const item of items) {
        if (item.id === targetId) return item;
        if (item.children) {
          const found = findItem(item.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const item = findItem(NAV_CONFIG, id);
    if (item?.path) {
      navigate(item.path);
    }
  };

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const UnderConstruction = () => (
    <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
       <div className="mx-auto h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mb-4">
          <span className="text-4xl">🚧</span>
       </div>
       <h2 className="text-xl font-bold text-slate-900">Module Under Construction</h2>
       <p className="text-slate-500 mt-2 max-w-md mx-auto">
          The <strong>{breadcrumbs[breadcrumbs.length - 1]?.label}</strong> module is currently being built. 
          Compliance logic is being implemented.
       </p>
    </div>
  );

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
          onToggleSidebar={handleSidebarToggle}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {/* Main Content: Responsive padding */}
          <main className="w-full p-4 md:p-6 lg:p-8 pb-6">
            <div className="w-full max-w-[1920px] mx-auto space-y-4 md:space-y-6">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardView />} />
                <Route path="/my-tasks" element={<MyTasksView />} />
                
                {/* Document Routes */}
                <Route path="/documents/owned" element={<DocumentsOwnedByMeView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
                <Route path="/documents/all" element={<DocumentListView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
                <Route path="/documents/revisions/*" element={<DocumentListView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
                <Route path="/documents/controlled-copies/*" element={<DocumentListView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
                <Route path="/documents/archived" element={<DocumentListView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
                <Route path="/documents/external" element={<DocumentListView onViewDocument={(id) => navigate(`/documents/${id}`)} />} />
                
                {/* Detail View */}
                <Route path="/documents/:id" element={<DetailDocumentViewWrapper />} />

                {/* Fallback for other routes */}
                <Route path="*" element={<UnderConstruction />} />
              </Routes>
            </div>
          </main>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};