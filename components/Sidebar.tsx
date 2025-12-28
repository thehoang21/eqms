import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { NavItem } from '../types';
import { NAV_CONFIG } from '../constants';
import { cn } from './ui/utils';

// 1. IMPORT LOGO: Sử dụng cơ chế import để Vite xử lý hash đường dẫn chính xác
import logoImg from '../assets/images/favicon/document-color-32.png';

interface SidebarProps {
  isCollapsed: boolean;
  activeId: string;
  onNavigate: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  activeId,
  onNavigate,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    const parentIds: string[] = [];
    const findParents = (items: NavItem[], target: string, path: string[]) => {
      for (const item of items) {
        if (item.id === target) {
          parentIds.push(...path);
          return true;
        }
        if (item.children) {
          if (findParents(item.children, target, [...path, item.id])) return true;
        }
      }
      return false;
    };
    findParents(NAV_CONFIG, activeId, []);
    setExpandedItems((prev) => Array.from(new Set([...prev, ...parentIds])));
  }, [activeId]);

  const toggleExpand = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleItemClick = (item: NavItem) => {
    if (item.children && !isCollapsed) {
      setExpandedItems((prev) =>
        prev.includes(item.id) ? prev.filter((i) => i !== item.id) : [...prev, item.id]
      );
    } else {
      onNavigate(item.id);
    }
  };

  const renderMenuItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = activeId === item.id;
    const Icon = item.icon;

    const paddingLeft = isCollapsed ? 0 : (level === 0 ? 12 : (level * 16 + 12));
    const activeClass = level === 0 ? "text-primary font-medium bg-slate-50" : "text-primary font-bold";
    const inactiveClass = "text-slate-600 hover:bg-slate-50 hover:text-slate-900";

    return (
      <div key={item.id} className="w-full relative">
        {!isCollapsed && level > 0 && (
          <div className="absolute left-4 top-0 bottom-0 border-l border-slate-200 w-px" style={{ left: `${(level) * 16}px` }}></div>
        )}

        <button
          onClick={(e) => isCollapsed && hasChildren ? toggleExpand(item.id, e) : handleItemClick(item)}
          className={cn(
            "w-full flex items-center group relative transition-all duration-200 ease-in-out overflow-visible z-10 outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
            "py-2.5 md:py-3",
            isActive ? activeClass : inactiveClass,
            isCollapsed ? "justify-center px-0" : "justify-start pr-3",
            (!isCollapsed && level === 0 && isActive) && "rounded-r-md ml-0.5"
          )}
          style={{ paddingLeft: isCollapsed ? 0 : `${paddingLeft}px` }}
        >
          {level === 0 && isActive && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"></div>
          )}

          <div className={cn("flex items-center justify-center transition-all duration-300 relative", isCollapsed ? "w-full" : "w-auto")}>
            {Icon && (
              <Icon className={cn("shrink-0 transition-colors duration-300 h-5 w-5", isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-900")} />
            )}
            {!Icon && level > 0 && !isCollapsed && (
              <div className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-primary" : "bg-slate-300")}></div>
            )}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-slate-800 text-white text-xs md:text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg transition-opacity duration-200 delay-100 font-medium">
                {item.label}
                <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-slate-800"></div>
              </div>
            )}
          </div>

          <div className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap",
            isCollapsed ? "max-w-0 opacity-0 ml-0" : "max-w-[200px] opacity-100 ml-3"
          )}>
            <span className={cn("truncate block transition-all text-sx md:text-sm", isActive && level === 0 && "font-semibold")}>
              {item.label}
            </span>
          </div>

          {hasChildren && (
            <div
              onClick={(e) => !isCollapsed && toggleExpand(item.id, e)}
              className={cn(
                "rounded-md hover:bg-slate-200 transition-all duration-300 ease-in-out ml-auto flex items-center justify-center h-6 w-6",
                isCollapsed ? "max-w-0 opacity-0 -translate-x-2 overflow-hidden" : "max-w-6 opacity-100 translate-x-0"
              )}
            >
              <ChevronRight className={cn("h-4 w-4 text-slate-400 transition-transform duration-300", isExpanded ? "rotate-90" : "rotate-0")} />
            </div>
          )}
        </button>

        {hasChildren && (
          <div className={cn(
            "grid transition-all duration-300 ease-in-out",
            (!isCollapsed && isExpanded) ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}>
            <div className="overflow-hidden">
              <div className="relative pb-1">
                {item.children?.map((child) => renderMenuItem(child, level + 1))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col transition-all duration-300 ease-in-out z-30 shadow-sm shrink-0",
        // Responsive widths
        isCollapsed ? "w-20" : "w-[280px]",
        // Ensure proper stacking on mobile/tablet
        "md:relative"
      )}
    >
      {/* Header / Logo Area - Responsive */}
      <div className={cn(
        "h-16 md:h-18 flex items-center border-b border-slate-100 bg-white transition-all duration-300 ease-in-out relative",
        isCollapsed ? "justify-center px-0" : "justify-start px-4"
      )}>
        <div className="flex items-center overflow-hidden w-full">
          {/* LOGO CONTAINER */}
          <div className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 z-10",
            isCollapsed ? "mx-auto" : "mr-2"
          )}>
            <img
              src={logoImg} // Sử dụng biến đã import
              alt="Logo"
              className="h-full w-full object-contain"
              // Xử lý lỗi nếu ảnh không tải được
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* TEXT CONTAINER */}
          <div className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap",
            // Sử dụng max-width cụ thể thay vì auto để animation mượt hơn
            isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"
          )}>
            <span className="font-bold text-slate-800 tracking-tight text-lg">
              Quality Management
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
        <nav className="space-y-1 px-2">
          {NAV_CONFIG.map((item) => renderMenuItem(item))}
        </nav>
      </div>
    </aside>
  );
};