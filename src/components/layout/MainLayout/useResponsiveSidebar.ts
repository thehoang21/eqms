import { useState, useEffect, useCallback, useRef } from 'react';

// Breakpoint constant for consistency
const DESKTOP_BREAKPOINT = 1024;

// Debounce utility for resize events
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Custom hook to manage responsive sidebar behavior
 * - Mobile & Tablet (< 1024px): Use mobile menu overlay
 * - Desktop (≥ 1024px): Use collapsible sidebar
 * 
 * @returns Sidebar state and control functions
 */
export const useResponsiveSidebar = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isDesktopRef = useRef(window.innerWidth >= DESKTOP_BREAKPOINT);

  useEffect(() => {
    // Optimized resize handler with debounce
    const handleResize = debounce(() => {
      const width = window.innerWidth;
      const isDesktop = width >= DESKTOP_BREAKPOINT;
      const wasDesktop = isDesktopRef.current;
      
      // Only update state on breakpoint transition to avoid unnecessary re-renders
      if (isDesktop !== wasDesktop) {
        isDesktopRef.current = isDesktop;
        
        if (isDesktop) {
          // Switched to desktop: close mobile menu
          setIsMobileMenuOpen(false);
        } else {
          // Switched to mobile: reset collapse state
          setIsSidebarCollapsed(false);
        }
      }
    }, 150); // 150ms debounce for smooth performance

    // Initial check
    const initialWidth = window.innerWidth;
    isDesktopRef.current = initialWidth >= DESKTOP_BREAKPOINT;
    
    if (initialWidth < DESKTOP_BREAKPOINT) {
      setIsSidebarCollapsed(false);
    }

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoized toggle function to prevent re-renders
  const toggleSidebar = useCallback(() => {
    const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
    
    if (isDesktop) {
      // Desktop: toggle collapse state
      setIsSidebarCollapsed(prev => !prev);
    } else {
      // Mobile: toggle menu visibility
      setIsMobileMenuOpen(prev => !prev);
    }
  }, []);

  // Memoized close function
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return {
    isSidebarCollapsed,
    isMobileMenuOpen,
    toggleSidebar,
    setIsMobileMenuOpen,
    closeMobileMenu,
  };
};
