import { useState, useEffect } from 'react';

/**
 * Custom hook to manage responsive sidebar behavior
 * - Tablet Portrait: Auto-collapse
 * - Tablet Landscape & Desktop: Auto-expand
 * - Mobile: Close menu
 */
export const useResponsiveSidebar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
