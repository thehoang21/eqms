import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '../../ui/button/Button';
import { cn } from '../../ui/utils';
import { SearchDropdown } from './SearchDropdown';
import { NotificationsDropdown } from './NotificationsDropdown';
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, IconLogout } from '@tabler/icons-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  onNavigateToProfile?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarCollapsed, isMobileMenuOpen, onNavigateToProfile, onLogout }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    if (!isUserMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        userMenuRef.current && !userMenuRef.current.contains(e.target as Node) &&
        menuDropdownRef.current && !menuDropdownRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isUserMenuOpen]);

  return (
    <header 
      className="w-full sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm shrink-0"
      style={{
        // Safe area for notch and Dynamic Island
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        // Min height includes safe area
        minHeight: 'calc(3.5rem + env(safe-area-inset-top, 0px))',
      }}
    >
      
      {/* Overlay for visual effect */}
      {isUserMenuOpen && createPortal(
        <div 
          className="fixed inset-0 z-[39] bg-slate-900/10 backdrop-blur-[1px] animate-in fade-in duration-150"
        />,
        document.body
      )}

      {/* Header Content Container */}
      <div className="h-full flex items-center justify-between gap-1.5 md:gap-2 lg:gap-3 px-3 md:px-4 lg:px-6">

        {/* LEFT: Sidebar Toggle */}
        <div className="flex items-center shrink-0">
          <Button 
              variant="ghost" 
              size="icon-sm"
              onClick={onToggleSidebar}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative overflow-hidden transition-colors"
              title={isMobileMenuOpen ? "Close Menu" : (isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar")}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : (isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar")}
          >
              {/* Tablet/Desktop: Expand Icon - Show when sidebar is collapsed */}
              <IconLayoutSidebarLeftExpand className={cn(
                "h-6 w-6 absolute transition-all duration-300 ease-in-out hidden md:block",
                isSidebarCollapsed 
                  ? "opacity-100 rotate-0 scale-100" 
                  : "opacity-0 rotate-180 scale-90"
              )} />
              {/* Tablet/Desktop: Collapse Icon - Show when sidebar is expanded */}
              <IconLayoutSidebarLeftCollapse className={cn(
                "h-6 w-6 absolute transition-all duration-300 ease-in-out hidden md:block",
                isSidebarCollapsed 
                  ? "opacity-0 -rotate-180 scale-90" 
                  : "opacity-100 rotate-0 scale-100"
              )} />
              {/* Mobile: Menu Icon - Show when mobile menu is closed */}
              <Menu className={cn(
                "h-6 w-6 absolute transition-all duration-300 ease-in-out md:hidden",
                isMobileMenuOpen 
                  ? "opacity-0 rotate-180 scale-90" 
                  : "opacity-100 rotate-0 scale-100"
              )} />
              {/* Mobile: X Icon - Show when mobile menu is open */}
              <X className={cn(
                "h-6 w-6 absolute transition-all duration-300 ease-in-out md:hidden",
                isMobileMenuOpen 
                  ? "opacity-100 rotate-0 scale-100" 
                  : "opacity-0 -rotate-180 scale-90"
              )} />
          </Button>
        </div>

        {/* CENTER: Global Search - Responsive width */}
        <div className="flex-1 flex justify-center max-w-xl lg:max-w-2xl mx-auto">
          <SearchDropdown />
        </div>

        {/* RIGHT: Notifications & Profile */}
        <div className="flex items-center gap-1.5 md:gap-2 lg:gap-3 shrink-0">
          
          {/* Notifications */}
          <NotificationsDropdown
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            onToggle={() => setIsNotificationsOpen(!isNotificationsOpen)}
          />

          {/* Divider - Hidden on mobile */}
          <div className="hidden md:block w-px h-6 bg-slate-200"></div>
          
          {/* User Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button 
              className="flex items-center gap-1.5 md:gap-2 lg:gap-2.5 cursor-pointer hover:bg-slate-50 px-1.5 py-1.5 lg:px-2 lg:py-1.5 rounded-lg border border-transparent hover:border-slate-200 transition-all select-none group"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-label="User menu"
            >
              {/* Avatar */}
              <div className="h-8 w-8 md:h-8 md:w-8 lg:h-10 lg:w-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                <User className="h-4 w-4 md:h-4.5 md:w-4.5 lg:h-5 lg:w-5" />
              </div>
              {/* User Info - Hidden on mobile and tablet */}
              <div className="hidden lg:block text-left pr-1">
                <p className="text-sm font-semibold text-slate-700 leading-tight group-hover:text-slate-900">Nguyễn Thế Hoàng</p>
                <p className="text-xs text-slate-500 leading-tight">QA Manager</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && createPortal(
              <div
                  ref={menuDropdownRef}
                  className="fixed w-56 bg-white border border-slate-200 rounded-lg shadow-lg focus:outline-none animate-in fade-in zoom-in-95 duration-200 z-50"
                  style={{
                      top: `${userMenuRef.current?.getBoundingClientRect().bottom! + window.scrollY + 8}px`,
                      right: `${window.innerWidth - userMenuRef.current?.getBoundingClientRect().right! - window.scrollX}px`
                  }}
              >
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-sm font-semibold text-slate-900 truncate">Dr. A. Smith</p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">a.smith@qualiguard.eu</p>
                </div>
                
                {/* Menu Items */}
                <div className="py-1">
                  <button 
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-3 transition-colors"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigateToProfile?.();
                      }}
                  >
                      <User className="h-5 w-5 shrink-0" />
                      <span>Profile</span>
                  </button>
                </div>
                
                {/* Logout */}
                <div className="border-t border-slate-100 py-1">
                  <button 
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout?.();
                      }}
                  >
                      <IconLogout className="h-5 w-5 shrink-0" />
                      <span>Logout</span>
                  </button>
                </div>
              </div>,
              document.body
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
