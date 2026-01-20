import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { createPortal } from 'react-dom';
import { NavItem } from '@/types';
import { NAV_CONFIG } from '@/app/constants';
import { cn } from '@/components/ui/utils';
import logoFull from '@/assets/images/logo_nobg.png';
import logoCollapsed from '@/assets/images/LOGO.png';
import './Sidebar.module.css';

// Constants
const BASE_PADDING = 12;
const LEVEL_PADDING = 16;
const MENU_WIDTH = 280;
const MENU_GAP = 8;
const SAFE_PADDING = 16;
const MAX_MENU_HEIGHT = 600;

// Helper function to find parent IDs of active item
const findParentIds = (items: NavItem[], targetId: string, path: string[] = []): string[] => {
  for (const item of items) {
    if (item.id === targetId) return path;
    if (item.children) {
      const result = findParentIds(item.children, targetId, [...path, item.id]);
      if (result.length > 0 || result.length === 0 && item.children.some(c => c.id === targetId)) {
        return [...path, item.id];
      }
    }
  }
  return [];
};

interface SidebarProps {
  isCollapsed: boolean;
  activeId: string;
  onNavigate: (id: string) => void;
  isMobileOpen: boolean;
  onClose: () => void;
  onToggleSidebar: () => void; // Add toggle function
}

interface HoverMenuState {
  isOpen: boolean;
  item: NavItem | null;
  position: { top: number; left: number; showAbove: boolean };
  expandedSubItems: string[];
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({
  isCollapsed,
  activeId,
  onNavigate,
  isMobileOpen,
  onClose,
  onToggleSidebar,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [hoverMenu, setHoverMenu] = useState<HoverMenuState>({
    isOpen: false,
    item: null,
    position: { top: 0, left: 0, showAbove: false },
    expandedSubItems: []
  });

  // Auto-expand parent items when activeId changes
  useEffect(() => {
    const parentIds = findParentIds(NAV_CONFIG, activeId);
    if (parentIds.length > 0) {
      setExpandedItems((prev) => Array.from(new Set([...prev, ...parentIds])));
    }
  }, [activeId]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    // Cleanup on unmount
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // Calculate menu position to prevent viewport overflow
  const calculateMenuPosition = useCallback((rect: DOMRect) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Menu dimensions
    const menuWidth = 280;
    const menuMaxHeight = 400; // Max height estimate
    const safeMargin = 8;
    
    // Check available space around the button
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const spaceRight = viewportWidth - rect.right;
    const spaceLeft = rect.left;
    
    // Determine if menu should show above based on available space
    const shouldShowAbove = spaceBelow < menuMaxHeight && spaceAbove > spaceBelow;
    
    // Horizontal positioning - always to the right of sidebar with gap
    let left: number;
    if (spaceRight >= menuWidth + MENU_GAP) {
      // Show on right side (default)
      left = rect.right + MENU_GAP + window.scrollX;
    } else if (spaceLeft >= menuWidth + MENU_GAP) {
      // Show on left side if no space on right
      left = rect.left - menuWidth - MENU_GAP + window.scrollX;
    } else {
      // Center in viewport if no space on either side
      left = Math.max(safeMargin + window.scrollX, (viewportWidth - menuWidth) / 2 + window.scrollX);
    }
    
    // Ensure menu doesn't overflow horizontally
    if (left + menuWidth > viewportWidth + window.scrollX - safeMargin) {
      left = viewportWidth - menuWidth - safeMargin + window.scrollX;
    }
    if (left < safeMargin + window.scrollX) {
      left = safeMargin + window.scrollX;
    }
    
    // Vertical positioning - align with button center, adjust if needed
    let top: number;
    
    if (shouldShowAbove) {
      // When showing above, position so bottom of menu aligns near bottom of button
      top = rect.bottom + window.scrollY + safeMargin;
    } else {
      // When showing below, align menu top with button top
      top = rect.top + window.scrollY;
    }
    
    // Ensure menu stays within viewport bounds
    const menuEstimatedHeight = Math.min(menuMaxHeight, viewportHeight - 2 * safeMargin);
    
    if (shouldShowAbove) {
      // For showAbove mode, ensure there's enough space above
      const menuBottom = top;
      const menuTop = menuBottom - menuEstimatedHeight;
      
      if (menuTop < window.scrollY + safeMargin) {
        // Not enough space above, adjust to fit
        top = window.scrollY + safeMargin + menuEstimatedHeight;
      }
    } else {
      // For normal mode, ensure menu doesn't overflow bottom
      const menuBottom = top + menuEstimatedHeight;
      
      if (menuBottom > viewportHeight + window.scrollY - safeMargin) {
        // Adjust to fit within viewport
        top = Math.max(
          window.scrollY + safeMargin,
          viewportHeight + window.scrollY - menuEstimatedHeight - safeMargin
        );
      }
    }
    
    return { top, left, showAbove: shouldShowAbove };
  }, []);

  // Handle click on menu item (collapsed mode)
  const handleMenuItemClick = useCallback((item: NavItem, event: React.MouseEvent<HTMLButtonElement>) => {
    if (!isCollapsed || !item.children?.length) return;

    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const position = calculateMenuPosition(rect);
    
    setHoverMenu(prev => {
      // Toggle: close if same item, open if different
      if (prev.isOpen && prev.item?.id === item.id) {
        return { ...prev, isOpen: false };
      }
      return {
        isOpen: true,
        item,
        position,
        expandedSubItems: []
      };
    });
  }, [isCollapsed, calculateMenuPosition]);

  // Memoized toggle handler
  const toggleExpand = useCallback((id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  // Memoized item click handler
  const handleItemClick = useCallback((item: NavItem) => {
    if (item.children && !isCollapsed) {
      setExpandedItems((prev) =>
        prev.includes(item.id) ? prev.filter((i) => i !== item.id) : [...prev, item.id]
      );
    } else {
      onNavigate(item.id);
      onClose();
    }
  }, [isCollapsed, onNavigate, onClose]);

  // Memoized menu item renderer
  const renderMenuItem = useCallback((item: NavItem, level: number = 0) => {
    const hasChildren = Boolean(item.children?.length);
    const isExpanded = expandedItems.includes(item.id);
    const isActive = activeId === item.id;
    const Icon = item.icon;

    const paddingLeft = isCollapsed ? 0 : (level === 0 ? BASE_PADDING : (level * LEVEL_PADDING + BASE_PADDING));

    return (
      <div key={item.id} className="w-full relative">
        {!isCollapsed && level > 0 && (
          <div 
            className="absolute left-4 top-0 bottom-0 border-l border-slate-200 w-px" 
            style={{ left: `${level * LEVEL_PADDING}px` }}
          />
        )}

        <button
          onClick={(e) => {
            if (isCollapsed && hasChildren) {
              handleMenuItemClick(item, e);
            } else {
              handleItemClick(item);
            }
          }}
          className={cn(
            "w-full flex items-center group relative overflow-visible z-10 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20",
            `transition-all duration-200 ease-in-out`,
            // Mobile: Taller touch target (h-12), Desktop: h-11
            "h-12 md:h-11",
            isCollapsed ? "justify-center px-0" : "justify-start pr-3",
            isActive && level === 0
              ? "text-emerald-700 bg-emerald-50"
              : isActive && level > 0
              ? "text-emerald-700 bg-emerald-50/50"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100",
            (!isCollapsed && level === 0 && isActive) && "rounded-lg mx-2"
          )}
          style={{ 
            paddingLeft: isCollapsed ? 0 : `${paddingLeft}px`,
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          {/* Active indicator */}
          {level === 0 && isActive && !isCollapsed && (
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-full bg-emerald-600"
            />
          )}

          {/* Icon */}
          <div 
            className={cn(
              "flex items-center justify-center relative shrink-0",
              isCollapsed ? "w-full" : "w-5"
            )}
          >
            {Icon && (
              <Icon 
                className={cn(
                  "h-5 w-5 transition-colors duration-200",
                  isActive ? "text-emerald-700" : "text-slate-500 group-hover:text-slate-900"
                )} 
              />
            )}
            {!Icon && level > 0 && !isCollapsed && (
              <div className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-emerald-600" : "bg-slate-300")} />
            )}
          </div>

          {/* Label */}
          <div 
            className={cn(
              "overflow-hidden whitespace-nowrap transition-all duration-200",
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
            )}
          >
            <span className={cn(
              "truncate block text-sm",
              isActive ? "font-semibold text-emerald-700" : "font-medium"
            )}>
              {item.label}
            </span>
          </div>

          {/* Chevron for expandable items */}
          {hasChildren && !isCollapsed && (
            <div
              onClick={(e) => toggleExpand(item.id, e)}
              className={cn(
                "rounded-md ml-auto flex items-center justify-center h-6 w-6 transition-all duration-200"
              )}
            >
              <ChevronRight 
                className={cn(
                  "h-4 w-4 text-slate-400 transition-transform duration-300 ease-out",
                  isExpanded && "rotate-90"
                )}
                style={{ willChange: 'transform' }}
              />
            </div>
          )}
        </button>

        {/* Expanded children (only in expanded sidebar) */}
        {hasChildren && !isCollapsed && (
          <div 
            className={cn(
              "grid transition-all duration-200 ease-in-out",
              isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="relative pt-1">
                {item.children?.map((child) => renderMenuItem(child, level + 1))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }, [expandedItems, activeId, isCollapsed, toggleExpand, handleItemClick , handleMenuItemClick, hoverMenu.isOpen, hoverMenu.item, setHoverMenu, onNavigate, onClose]);

  // Handle hover menu sub-item click
  const handleSubItemClick = useCallback((item: NavItem, hasChildren: boolean) => {
    if (hasChildren) {
      setHoverMenu(prev => ({
        ...prev,
        expandedSubItems: prev.expandedSubItems.includes(item.id)
          ? prev.expandedSubItems.filter(id => id !== item.id)
          : [...prev.expandedSubItems, item.id]
      }));
    } else {
      onNavigate(item.id);
      setHoverMenu(prev => ({ ...prev, isOpen: false }));
      onClose();
    }
  }, [onNavigate, onClose]);

  // Render hover menu sub-item
  const renderHoverSubItem = useCallback((item: NavItem, level: number = 1) => {
    const hasChildren = Boolean(item.children?.length);
    const isExpanded = hoverMenu.expandedSubItems.includes(item.id);
    const isActive = activeId === item.id;

    return (
      <div key={item.id} className="w-full">
        <button
          onClick={() => handleSubItemClick(item, hasChildren)}
          className={cn(
            "w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors",
            isActive
              ? "text-slate-900 bg-slate-100 font-medium"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          {level >= 2 && (
            <div className={cn(
              "h-1.5 w-1.5 rounded-full shrink-0",
              isActive ? "bg-emerald-600" : "bg-slate-300"
            )} />
          )}
          <span className={cn(
            "flex-1 text-left",
            level >= 2 ? "ml-0" : "ml-3"
          )}>{item.label}</span>
          {hasChildren && (
            <div className="rounded-md flex items-center justify-center h-6 w-6 transition-all duration-200 shrink-0">
              <ChevronRight 
                className={cn(
                  "h-4 w-4 text-slate-400 transition-transform duration-300 ease-out",
                  isExpanded && "rotate-90"
                )}
                style={{ 
                  willChange: 'transform'
                }}
              />
            </div>
          )}
        </button>

        {hasChildren && (
          <div
            className={cn(
              "grid transition-all duration-200 ease-in-out bg-slate-50/50",
              isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="pl-3 py-1">
                {item.children?.map((child) => renderHoverSubItem(child, level + 1))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }, [hoverMenu.expandedSubItems, activeId, handleSubItemClick]);

  // Hover menu portal component
  const HoverMenuPortal = () => {
    if (!hoverMenu.isOpen || !hoverMenu.item || !isCollapsed) return null;

    return createPortal(
      <>
        {/* Invisible backdrop to detect outside clicks */}
        <div
          className="fixed inset-0 z-[59]"
          onClick={() => setHoverMenu(prev => ({ ...prev, isOpen: false }))}
          aria-hidden="true"
        />
        
        {/* Menu content */}
        <div
          className={cn(
            "fixed z-[60] min-w-[240px] max-w-[280px] bg-white rounded-xl border border-slate-200 shadow-xl",
            hoverMenu.position.showAbove
              ? "animate-in fade-in slide-in-from-bottom-2 duration-200"
              : "animate-in fade-in slide-in-from-left-2 duration-200"
          )}
          style={{
            top: `${hoverMenu.position.top}px`,
            left: `${hoverMenu.position.left}px`,
            transform: hoverMenu.position.showAbove ? 'translateY(-100%)' : 'none',
            maxHeight: 'calc(100vh - 32px)',
          }}
        >
          {/* Menu header */}
          <div className="px-4 py-3 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              {hoverMenu.item.icon && (
                <hoverMenu.item.icon className="h-5 w-5 text-slate-600" />
              )}
              <span className="font-semibold text-sm text-slate-900 truncate">
                {hoverMenu.item.label}
              </span>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            {hoverMenu.item.children?.map((child) => renderHoverSubItem(child))}
          </div>
        </div>
      </>,
      document.body
    );
  };

  return (
    <>
      {/* Hover Menu Portal */}
      <HoverMenuPortal />

      {/* Mobile Overlay Backdrop - Only show on mobile (<768px) */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
          style={{
            WebkitTapHighlightColor: 'transparent'
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-slate-200 flex flex-col shadow-lg md:shadow-sm sidebar-mobile",
          // Mobile: Full viewport height with safe area insets
          "fixed top-0 left-0 bottom-0 z-50",
          // Desktop: Sticky positioning
          "md:sticky md:top-0 md:z-30 md:h-screen",
          // Width
          isCollapsed ? "w-20" : "w-[280px] max-w-[85vw]",
          // Smooth transitions
          "transition-all duration-300 ease-out",
          // Mobile slide animation
          "md:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header / Logo Area */}
        <div 
          className={cn(
            "flex items-center border-b border-slate-100 bg-white relative shrink-0",
            "transition-all duration-300 ease-in-out",
            // Mobile: Higher header with close button
            "h-16 md:h-16",
            isCollapsed ? "justify-center px-0" : "justify-between px-5"
          )}
        >
          {/* Logo */}
          <div className={cn(
            "flex items-center justify-center overflow-hidden transition-all duration-300",
            isCollapsed ? "w-full" : "flex-1"
          )}>
            <div className={cn(
              "flex items-center justify-center shrink-0",
              isCollapsed ? "h-10 w-10" : "h-11 w-auto"
            )}>
              <img
                src={isCollapsed ? logoCollapsed : logoFull}
                alt="Logo"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Close button for mobile */}
          {!isCollapsed && (
            <button
              onClick={onClose}
              className={cn(
                "md:hidden flex items-center justify-center h-10 w-10 rounded-lg",
                "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                "transition-colors duration-200 active:scale-95",
                "-mr-2"
              )}
              aria-label="Close sidebar"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div 
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar",
            // Mobile: More padding for easier scrolling
            "py-4 md:py-3"
          )}
          style={{
            // Smooth scrolling on mobile
            WebkitOverflowScrolling: 'touch',
            // Hide scrollbar on mobile for cleaner look
            scrollbarWidth: 'thin',
          }}
        >
          <nav className={cn(
            // Mobile: Larger spacing between items
            "space-y-1 md:space-y-0.5"
          )}>
            {NAV_CONFIG.map((item) => renderMenuItem(item))}
          </nav>
        </div>
      </aside>
    </>
  );
});