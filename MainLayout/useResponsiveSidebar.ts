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
      
      // Mobile & Tablet: Don't auto-collapse, use mobile menu instead
      if (width < 1024) {
        setIsSidebarCollapsed(false); // Keep expanded when showing mobile menu
      }
      // Desktop: Use collapse state
      else {
        setIsMobileMenuOpen(false); // Close mobile menu on desktop
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    const width = window.innerWidth;
    
    // On mobile: toggle mobile menu
    if (width < 1024) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
    // On desktop: toggle collapse
    else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return {
    isSidebarCollapsed,
    isMobileMenuOpen,
    toggleSidebar,
    setIsMobileMenuOpen,
    closeMobileMenu,
  };
};
