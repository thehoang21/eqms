import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, User, Menu, FileText, AlertTriangle, Settings, LogOut } from 'lucide-react';
import { Button } from './ui/button/Button';
import { cn } from './ui/utils';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarCollapsed }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="h-16 md:h-18 w-full sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm px-4 md:px-6 flex items-center justify-between shadow-sm/30 shrink-0 transition-all">
      
      {/* Overlay to close menus when clicking outside */}
      {(isUserMenuOpen || isSearchFocused) && (
        <div 
          className="fixed inset-0 z-10 bg-transparent"
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsSearchFocused(false);
          }}
        />
      )}

      {/* LEFT: Sidebar Toggle */}
      <div className="flex items-center shrink-0">
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleSidebar}
            className="text-slate-500 hover:bg-slate-100"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
            <Menu className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>

      {/* CENTER: Global Search (Expanded) - Responsive */}
      <div className="flex-1 flex justify-center px-3 md:px-6 lg:px-8 relative z-20">
        <div className="w-full max-w-xl lg:max-w-2xl relative">
            {/* Input Wrapper */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 md:pl-3.5 flex items-center pointer-events-none">
                    <Search className={cn(
                        "h-4 w-4 md:h-5 md:w-5 transition-colors", 
                        isSearchFocused ? "text-primary" : "text-slate-400"
                    )} />
                </div>
                <input
                    ref={searchInputRef}
                    type="text"
                    className={cn(
                        "block w-full pl-10 md:pl-11 pr-12 md:pr-16 py-2 md:py-2.5 rounded-lg border leading-5 transition-all duration-200",
                        "text-sm md:text-[15px]",
                        "placeholder-slate-400 focus:outline-none",
                        isSearchFocused 
                            ? "bg-white ring-2 ring-primary/50 border-primary shadow-lg shadow-primary/5" 
                            : "bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-700"
                    )}
                    placeholder="Search documents, deviations..."
                    onFocus={() => setIsSearchFocused(true)}
                    // Delay blur to allow clicking on results
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <kbd className="hidden md:inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 font-sans">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </div>

            {/* Quick Results Dropdown */}
            {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2">
                        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Recent
                        </div>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors text-left">
                            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <FileText className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">SOP-QA-001</p>
                                <p className="text-xs text-slate-500">Batch Release Procedure</p>
                            </div>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors text-left">
                            <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">DEV-2023-089</p>
                                <p className="text-xs text-slate-500">Temperature Excursion Room 4</p>
                            </div>
                        </button>
                        
                        <div className="px-3 py-2 mt-1 text-xs font-semibold text-slate-400 uppercase tracking-wider border-t border-slate-100">
                            Quick Actions
                        </div>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors text-left">
                            <Settings className="h-4 w-4 text-slate-400 ml-2" />
                            <span>System Configuration</span>
                        </button>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 text-xs text-slate-500 flex justify-between border-t border-slate-100">
                        <span>Press <strong>Enter</strong> to see all results</span>
                        <span><strong>Esc</strong> to close</span>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* RIGHT: Notifications & Profile - Responsive */}
      <div className="flex items-center gap-2 md:gap-3 lg:gap-4 shrink-0 relative z-20">
        
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors"
        >
            <Bell className="h-5 w-5 md:h-6 md:w-6" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border border-white shadow-sm"></span>
        </Button>

        {/* User Profile Dropdown */}
        <div className="relative">
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
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-slate-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-200">
               <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900">Dr. A. Smith</p>
                  <p className="text-xs text-slate-500 truncate">a.smith@qualiguard.eu</p>
               </div>
               <div className="py-1">
                 <button 
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary flex items-center"
                    onClick={() => setIsUserMenuOpen(false)}
                 >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                 </button>
                 <button 
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary flex items-center"
                    onClick={() => setIsUserMenuOpen(false)}
                 >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                 </button>
               </div>
               <div className="border-t border-slate-100 py-1">
                 <button 
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    onClick={() => setIsUserMenuOpen(false)}
                 >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                 </button>
               </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};