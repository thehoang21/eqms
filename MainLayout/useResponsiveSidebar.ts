import { useState, useEffect } from 'react';

/**
 * Custom hook to manage responsive sidebar behavior
 * - Mobile & Tablet (< 1024px): Auto-collapse sidebar
 * - Desktop (≥ 1024px): Auto-expand sidebar
 */
export const useResponsiveSidebar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      // Mobile & Tablet Portrait: Auto collapse
      if (width < 1024) {
        setIsSidebarCollapsed(true);
        setIsMobileMenuOpen(false);
      }
      // Tablet Landscape & Desktop: Auto expand
      else if (width >= 1024) {
        setIsSidebarCollapsed(false);
        setIsMobileMenuOpen(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return {
    isSidebarCollapsed,
    isMobileMenuOpen,
    toggleSidebar,
    setIsMobileMenuOpen,
  };
};
