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
    <header className="h-16 md:h-18 w-full sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm px-4 md:px-2 flex items-center justify-between shadow-sm/30 shrink-0 transition-all">
      
      {/* Overlay for visual effect */}
      {isUserMenuOpen && createPortal(
        <div 
          className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[1px]"
        />,
        document.body
      )}

      {/* LEFT: Sidebar Toggle */}
      <div className="flex items-center shrink-0">
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleSidebar}
            className="text-slate-500 hover:bg-slate-100 relative overflow-hidden"
            title={isMobileMenuOpen ? "Close Menu" : (isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar")}
        >
            {/* Desktop: Expand Icon - Show when sidebar is collapsed */}
            <IconLayoutSidebarLeftExpand className={cn(
              "h-5 w-5 md:h-6 md:w-6 absolute transition-[transform,opacity] duration-300 ease-in-out hidden lg:block origin-center",
              isSidebarCollapsed 
                ? "opacity-100 rotate-0 scale-100" 
                : "opacity-0 rotate-180 scale-90"
            )} 
              style={{ willChange: 'transform, opacity' }}
            />
            {/* Desktop: Collapse Icon - Show when sidebar is expanded */}
            <IconLayoutSidebarLeftCollapse className={cn(
              "h-5 w-5 md:h-6 md:w-6 absolute transition-[transform,opacity] duration-300 ease-in-out hidden lg:block origin-center",
              isSidebarCollapsed 
                ? "opacity-0 -rotate-180 scale-90" 
                : "opacity-100 rotate-0 scale-100"
            )} 
              style={{ willChange: 'transform, opacity' }}
            />
            {/* Mobile: Menu Icon - Show when mobile menu is closed */}
            <IconLayoutSidebarLeftCollapse className={cn(
              "h-5 w-5 md:h-6 md:w-6 absolute transition-[transform,opacity] duration-300 ease-in-out lg:hidden origin-center",
              isMobileMenuOpen 
                ? "opacity-0 rotate-180 scale-90" 
                : "opacity-100 rotate-0 scale-100"
            )} 
              style={{ willChange: 'transform, opacity' }}
            />
            {/* Mobile: X Icon - Show when mobile menu is open */}
            <X className={cn(
              "h-5 w-5 md:h-6 md:w-6 absolute transition-[transform,opacity] duration-300 ease-in-out lg:hidden origin-center",
              isMobileMenuOpen 
                ? "opacity-100 rotate-0 scale-100" 
                : "opacity-0 -rotate-180 scale-90"
            )} 
              style={{ willChange: 'transform, opacity' }}
            />
        </Button>
      </div>

      {/* CENTER: Global Search (Expanded) - Responsive */}
      <div className="flex-1 flex justify-center px-3 md:px-6 lg:px-8 relative z-20">
        <SearchDropdown />
      </div>

      {/* RIGHT: Notifications & Profile - Responsive */}
      <div className="flex items-center gap-2 md:gap-3 lg:gap-4 shrink-0 relative z-20">
        
        {/* Notifications */}
        <NotificationsDropdown
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onToggle={() => setIsNotificationsOpen(!isNotificationsOpen)}
        />

        {/* thêm thanh dọc để phân chia */}
        <div className="w-px h-8 bg-slate-300"></div>
        
        {/* User Profile Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:bg-slate-50 p-1.5 rounded-full border border-transparent hover:border-slate-200 transition-all select-none group"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <div className="h-9 w-9 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <User className="h-5 w-5" />
            </div>
            <div className="hidden xl:block text-left pr-2">
               <p className="text-sm font-semibold text-slate-700 leading-none group-hover:text-slate-900">Dr. A. Smith</p>
               <p className="text-xs text-slate-500 leading-tight mt-0.5">QA Manager</p>
            </div>
          </div>

          {/* Dropdown Menu */}
          {isUserMenuOpen && createPortal(
            <div
                ref={menuDropdownRef}
                className="fixed w-56 origin-top-right bg-white border border-slate-200 rounded-md shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200 z-50"
                style={{
                    top: `${userMenuRef.current?.getBoundingClientRect().bottom! + window.scrollY + 8}px`,
                    right: `${window.innerWidth - userMenuRef.current?.getBoundingClientRect().right! - window.scrollX}px`
                }}
            >
               <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900">Dr. A. Smith</p>
                  <p className="text-xs text-slate-500 truncate">a.smith@qualiguard.eu</p>
               </div>
               <div className="py-1">
                 <button 
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary flex items-center transition-colors"
                    onClick={() => {
                      console.log('Profile clicked, navigating...');
                      setIsUserMenuOpen(false);
                      onNavigateToProfile?.();
                    }}
                 >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                 </button>
               </div>
               <div className="border-t border-slate-100 py-1">
                 <button 
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                    onClick={() => {
                      console.log('Logout clicked');
                      setIsUserMenuOpen(false);
                      onLogout?.();
                    }}
                 >
                    <IconLogout className="h-4 w-4 mr-2" />
                    Logout
                 </button>
               </div>
            </div>,
            document.body
          )}
        </div>

      </div>
    </header>
  );
};
