import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronRight, X } from 'lucide-react';
import { NavItem } from '@/types';
import { NAV_CONFIG } from '@/app/constants';
import { cn } from '@/components/ui/utils';
import logoFull from '@/assets/images/logo_nobg.png';
import logoCollapsed from '@/assets/images/LOGO.png';
import { IconChevronLeft } from '@tabler/icons-react';

// Constants
const ANIMATION_EASING = 'cubic-bezier(0.4,0,0.2,1)';
const BOUNCE_EASING = 'cubic-bezier(0.68,-0.55,0.265,1.55)';
const BASE_PADDING = 12;
const LEVEL_PADDING = 16;

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
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({
  isCollapsed,
  activeId,
  onNavigate,
  isMobileOpen,
  onClose,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Auto-expand parent items when activeId changes
  useEffect(() => {
    const parentIds = findParentIds(NAV_CONFIG, activeId);
    if (parentIds.length > 0) {
      setExpandedItems((prev) => Array.from(new Set([...prev, ...parentIds])));
    }
  }, [activeId]);

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
    const activeClass = level === 0 ? "text-primary font-medium bg-slate-50" : "text-primary font-bold";
    const inactiveClass = "text-slate-600 hover:bg-slate-50 hover:text-slate-900";

    return (
      <div key={item.id} className="w-full relative">
        {!isCollapsed && level > 0 && (
          <div 
            className="absolute left-4 top-0 bottom-0 border-l border-slate-200 w-px" 
            style={{ left: `${level * LEVEL_PADDING}px` }}
          />
        )}

        <button
          onClick={(e) => isCollapsed && hasChildren ? toggleExpand(item.id, e) : handleItemClick(item)}
          className={cn(
            "w-full flex items-center group relative overflow-visible z-10 outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
            `transition-all duration-300 ease-[${ANIMATION_EASING}]`,
            "py-2.5 md:py-3",
            isActive ? activeClass : inactiveClass,
            isCollapsed ? "justify-center px-0" : "justify-start pr-3",
            (!isCollapsed && level === 0 && isActive) && "rounded-r-md ml-0.5"
          )}
          style={{ paddingLeft: isCollapsed ? 0 : `${paddingLeft}px` }}
        >
          {level === 0 && isActive && (
            <div 
              className={`absolute left-0 top-0 bottom-0 w-1 bg-primary transition-all duration-300 ease-[${ANIMATION_EASING}]`}
              style={{ animation: `scaleIn 0.3s ${ANIMATION_EASING}` }}
            />
          )}

          <div 
            className={cn(
              "flex items-center justify-center relative",
              `transition-all duration-300 ease-[${ANIMATION_EASING}]`,
              isCollapsed ? "w-full" : "w-auto"
            )}
            style={{ willChange: 'transform' }}
          >
            {Icon && (
              <Icon 
                className={cn(
                  "shrink-0 h-5 w-5",
                  `transition-all duration-300 ease-[${ANIMATION_EASING}]`,
                  "group-hover:scale-110",
                  isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-900"
                )} 
              />
            )}
            {!Icon && level > 0 && !isCollapsed && (
              <div className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-primary" : "bg-slate-300")} />
            )}
            {isCollapsed && (
              <div 
                className="absolute left-full ml-2 px-3 py-1.5 bg-slate-800 text-white text-xs md:text-sm rounded pointer-events-none whitespace-nowrap z-50 shadow-lg font-medium group-hover:opacity-100 group-hover:translate-x-0"
                style={{
                  opacity: 0,
                  transform: 'translateX(-8px)',
                  transition: `opacity 0.2s ${ANIMATION_EASING} 0.1s, transform 0.2s ${ANIMATION_EASING} 0.1s`,
                }}
              >
                {item.label}
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-slate-800" />
              </div>
            )}
          </div>

          <div 
            className={cn(
              "overflow-hidden whitespace-nowrap",
              `transition-all duration-300 ease-[${ANIMATION_EASING}]`,
              isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
            )}
            style={{ willChange: 'max-width, opacity, margin' }}
          >
            <span className={cn("truncate block text-sm", isActive && level === 0 && "font-semibold")}>
              {item.label}
            </span>
          </div>

          {hasChildren && (
            <div
              onClick={(e) => !isCollapsed && toggleExpand(item.id, e)}
              className={cn(
                "rounded-md hover:bg-slate-200 ml-auto flex items-center justify-center h-6 w-6",
                `transition-all duration-300 ease-[${ANIMATION_EASING}]`,
                isCollapsed ? "max-w-0 opacity-0 -translate-x-2 overflow-hidden" : "max-w-6 opacity-100 translate-x-0"
              )}
              style={{ willChange: 'transform, opacity' }}
            >
              <ChevronRight 
                className={cn(
                  "h-4 w-4 text-slate-400",
                  `transition-transform duration-300 ease-[${BOUNCE_EASING}]`,
                  isExpanded ? "rotate-90" : "rotate-0"
                )} 
              />
            </div>
          )}
        </button>

        {hasChildren && (
          <div 
            className={cn(
              "grid",
              `transition-all duration-300 ease-[${ANIMATION_EASING}]`,
              (!isCollapsed && isExpanded) ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
            style={{ willChange: 'grid-template-rows, opacity' }}
          >
            <div className="overflow-hidden">
              <div className="relative pb-1">
                {item.children?.map((child) => renderMenuItem(child, level + 1))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }, [expandedItems, activeId, isCollapsed, toggleExpand, handleItemClick]);

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          style={{ animation: `fadeIn 0.25s ${ANIMATION_EASING}` }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-slate-200 h-screen flex flex-col shadow-lg",
          "fixed top-0 left-0 z-50 lg:sticky lg:z-30",
          isCollapsed ? "w-20" : "w-[280px]",
          "transition-all",
          `duration-300 ease-[${ANIMATION_EASING}]`,
          `lg:duration-350 lg:ease-[${ANIMATION_EASING}]`,
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "lg:shadow-sm",
          !isCollapsed && "hover:shadow-md"
        )}
        style={{ willChange: 'transform, width' }}
      >
        {/* Header / Logo Area */}
        <div 
          className={cn(
            "h-16 md:h-18 flex items-center border-b border-slate-100 bg-white relative",
            `transition-all duration-300 ease-[${ANIMATION_EASING}]`,
            isCollapsed ? "justify-center px-0" : "justify-start px-4"
          )}
        >
          <div className="flex items-center overflow-hidden w-full justify-center">
            <div 
              className={cn(
                "flex items-center justify-center shrink-0 z-10",
                `transition-all duration-300 ease-[${ANIMATION_EASING}]`,
                isCollapsed ? "h-10 w-10" : "h-12 w-auto"
              )}
            >
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
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
          <nav className="space-y-1 px-2">
            {NAV_CONFIG.map((item) => renderMenuItem(item))}
          </nav>
        </div>
      </aside>
    </>
  );
});