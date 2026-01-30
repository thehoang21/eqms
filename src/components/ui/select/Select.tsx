import React, { useState, useEffect, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search } from 'lucide-react';
import { cn } from '../utils'; // Đảm bảo đường dẫn này đúng trong project của bạn

/**
 * Option type for Select component
 */
export interface SelectOption {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

/**
 * Custom Select component with search functionality and portal rendering
 * 
 * @example
 * ```tsx
 * <Select
 *   label="Status"
 *   value={status}
 *   onChange={setStatus}
 *   options={[
 *     { label: "Draft", value: "draft" },
 *     { label: "Active", value: "active" }
 *   ]}
 *   enableSearch
 * />
 * ```
 */
export interface SelectProps {
  /** Label displayed above select */
  label?: string;
  /** Current selected value */
  value: string | number;
  /** Callback when value changes */
  onChange: (value: any) => void;
  /** Array of selectable options */
  options: SelectOption[];
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  /** Additional CSS classes */
  className?: string;
  /** CSS classes for trigger button */
  triggerClassName?: string;
  /** Enable search functionality */
  enableSearch?: boolean;
  /** Disable the select */
  disabled?: boolean;
  /** Maximum visible rows in dropdown (default: 4) */
  maxVisibleRows?: number;
  /** Height of each row in pixels (default: 44) */
  rowHeight?: number;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  className,
  triggerClassName,
  enableSearch = true,
  disabled = false,
  maxVisibleRows = 4, // 1. Mặc định hiển thị tối đa 4 dòng
  rowHeight = 44,    // 2. Chiều cao chuẩn mỗi dòng
}) => {
  const selectId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputMode, setInputMode] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isInteractingWithSearchRef = useRef(false);

  // Listen for custom event to close other dropdowns
  useEffect(() => {
    const handleCloseOtherDropdowns = (event: CustomEvent<{ openId: string }>) => {
      if (event.detail.openId !== selectId && isOpen) {
        setIsOpen(false);
        setInputMode(false);
        setSearchQuery("");
      }
    };

    window.addEventListener('select-dropdown-open' as any, handleCloseOtherDropdowns);
    return () => {
      window.removeEventListener('select-dropdown-open' as any, handleCloseOtherDropdowns);
    };
  }, [selectId, isOpen]);

  const filteredOptions = enableSearch
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const selectedOption = options.find((opt) => opt.value === value);

  // Lock body scroll khi dropdown mở
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const body = document.body;
      
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflowY = 'scroll';
      
      return () => {
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        body.style.overflowY = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Recalculate position khi filtered options thay đổi (khi search)
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const safeMargin = 8; // Safe margin from viewport edges
      
      const searchHeight = enableSearch ? 50 : 0;
      const estimatedDropdownHeight = Math.min(
        filteredOptions.length * rowHeight,
        maxVisibleRows * rowHeight
      ) + searchHeight + 8;
      
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const shouldOpenUpward = spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow;
      
      // Calculate horizontal position - always match trigger width
      let leftPosition = rect.left;
      const dropdownWidth = rect.width;
      
      // Ensure dropdown doesn't overflow right edge
      if (leftPosition + dropdownWidth > viewportWidth - safeMargin) {
        leftPosition = viewportWidth - dropdownWidth - safeMargin;
      }
      // Ensure dropdown doesn't overflow left edge
      if (leftPosition < safeMargin) {
        leftPosition = safeMargin;
      }
      
      setDropdownStyle({
        position: 'fixed',
        top: shouldOpenUpward ? undefined : rect.bottom + 4,
        bottom: shouldOpenUpward ? viewportHeight - rect.top + 4 : undefined,
        left: leftPosition,
        width: dropdownWidth,
        zIndex: 9999,
        maxHeight: shouldOpenUpward 
          ? `${Math.min(spaceAbove - 8, estimatedDropdownHeight)}px`
          : `${Math.min(spaceBelow - 8, estimatedDropdownHeight)}px`,
      });
    }
  }, [isOpen, filteredOptions.length, enableSearch, rowHeight, maxVisibleRows]);

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      if (dropdownRef.current && dropdownRef.current.contains(target)) {
        return;
      }
      
      if (containerRef.current && containerRef.current.contains(target)) {
        return;
      }
      
      setIsOpen(false);
      setInputMode(false);
      setSearchQuery("");
    };
    
    if (isOpen) {
      // Use setTimeout to avoid catching the initial click that opened the dropdown
      const timer = setTimeout(() => {
        // Only use mousedown for desktop - avoid touch events that conflict with iOS input
        document.addEventListener("mousedown", handleClickOutside);
      }, 100); // Increased timeout for iOS
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  // Xử lý scroll/resize window - đóng dropdown khi scroll bên ngoài
  useEffect(() => {
    const handleScroll = (e: Event) => {
      // Cho phép scroll bên trong dropdown
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
        return;
      }
      // Đóng dropdown khi scroll bên ngoài
      if (isOpen) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    const handleResize = () => {
      if (isOpen) {
        setIsOpen(false);
        setInputMode(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // Auto focus trigger input khi vào input mode
  useEffect(() => {
    if (inputMode && enableSearch && triggerInputRef.current) {
      const focusTimeout = setTimeout(() => {
        if (triggerInputRef.current && inputMode) {
          triggerInputRef.current.focus();
          triggerInputRef.current.select();
        }
      }, 100);

      return () => clearTimeout(focusTimeout);
    }
  }, [inputMode, enableSearch]);

  // Tính toán vị trí dropdown với smart positioning
  const handleToggle = () => {
    if (disabled) return;
    
    window.dispatchEvent(new CustomEvent('select-dropdown-open', { detail: { openId: selectId } }));
    
    if (!isOpen) {
      if (enableSearch) {
        setInputMode(true);
      }
      
      if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const safeMargin = 8; // Safe margin from viewport edges
      
      // Tính toán ước lượng chiều cao dropdown
      const searchHeight = enableSearch ? 50 : 0; // Search input + padding
      const estimatedDropdownHeight = Math.min(
        filteredOptions.length * rowHeight,
        maxVisibleRows * rowHeight
      ) + searchHeight + 8; // +8 for padding
      
      // Kiểm tra có đủ không gian phía dưới không
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Quyết định mở lên trên hay xuống dưới
      const shouldOpenUpward = spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow;
      
      // Calculate horizontal position - always match trigger width
      let leftPosition = rect.left;
      const dropdownWidth = rect.width;
      
      // Ensure dropdown doesn't overflow right edge
      if (leftPosition + dropdownWidth > viewportWidth - safeMargin) {
        leftPosition = viewportWidth - dropdownWidth - safeMargin;
      }
      // Ensure dropdown doesn't overflow left edge
      if (leftPosition < safeMargin) {
        leftPosition = safeMargin;
      }
      
      setDropdownStyle({
        position: 'fixed',
        top: shouldOpenUpward ? undefined : rect.bottom + 4,
        bottom: shouldOpenUpward ? viewportHeight - rect.top + 4 : undefined,
        left: leftPosition,
        width: dropdownWidth,
        zIndex: 9999,
        maxHeight: shouldOpenUpward 
          ? `${Math.min(spaceAbove - 8, estimatedDropdownHeight)}px`
          : `${Math.min(spaceBelow - 8, estimatedDropdownHeight)}px`,
      });
      }
    } else {
      setInputMode(false);
      setSearchQuery("");
    }
    
    setIsOpen(!isOpen);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {label && (
        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
          {label}
        </label>
      )}
      
      {/* Trigger - Input or Button */}
      <div className="relative">
        {enableSearch && inputMode ? (
          <div className="relative">
            <input
              ref={triggerInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => {
                if (!isOpen) setIsOpen(true);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
              }}
              placeholder={selectedOption?.label || placeholder}
              disabled={disabled}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              className={cn(
                "flex w-full items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm transition-all duration-200",
                "placeholder:text-slate-400 focus:outline-none",
                "h-11 pr-8",
                disabled
                  ? "bg-slate-50 cursor-not-allowed opacity-60"
                  : "ring-1 ring-emerald-500 border-emerald-500",
                triggerClassName
              )}
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
              }}
            />
            <ChevronDown
              className={cn(
                "h-4 w-4 text-slate-400 transition-transform duration-200 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",
                isOpen && "rotate-180"
              )}
            />
          </div>
        ) : (
          <button
            ref={triggerRef}
            type="button"
            onClick={handleToggle}
            disabled={disabled}
            className={cn(
              "flex w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm transition-all duration-200",
              "placeholder:text-slate-400 focus:outline-none",
              "h-11",
              disabled
                ? "bg-slate-50 cursor-not-allowed opacity-60"
                : isOpen
                ? "ring-1 ring-emerald-500 border-emerald-500"
                : "hover:border-slate-300 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500",
              triggerClassName
            )}
          >
            <div className="flex items-center gap-2 truncate text-slate-900">
              {selectedOption?.icon}
              <span className={cn("truncate", !selectedOption && "text-slate-500")}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0",
                isOpen && "rotate-180"
              )}
            />
          </button>
        )}
      </div>

      {/* Dropdown Portal */}
      {isOpen && createPortal(
        <>
          {/* Invisible backdrop for iOS touch handling */}
          <div 
            className="fixed inset-0"
            style={{ zIndex: 9998 }}
            onTouchStart={(e) => {
              e.preventDefault();
              setIsOpen(false);
              setInputMode(false);
              setSearchQuery("");
            }}
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
              setInputMode(false);
              setSearchQuery("");
            }}
            aria-hidden="true"
          />
          <div 
            ref={dropdownRef}
            style={dropdownStyle}
            className={cn(
              "rounded-md border border-slate-200 bg-white shadow-lg overflow-hidden",
              "animate-in fade-in duration-100",
              dropdownStyle.bottom !== undefined 
                ? "slide-in-from-bottom-2" 
                : "slide-in-from-top-2 zoom-in-95"
            )}
          >
          <div
            className="overflow-y-auto p-1 custom-scrollbar"
            style={{ 
              maxHeight: `${maxVisibleRows * rowHeight}px` 
            }}
          >
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-slate-500">
                No results found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setInputMode(false);
                    setSearchQuery("");
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange(option.value);
                    setIsOpen(false);
                    setInputMode(false);
                    setSearchQuery("");
                  }}
                  style={{ 
                    height: rowHeight,
                    WebkitTapHighlightColor: 'transparent',
                  }} 
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm px-4 text-sm outline-none transition-colors",
                    value === option.value
                      ? "bg-emerald-50 text-emerald-700 font-medium"
                      : "text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-2 flex-1 truncate">
                    {option.icon}
                    <span className="truncate">{option.label}</span>
                  </div>
                  {value === option.value && (
                    <Check className="h-4 w-4 text-emerald-600 ml-2 shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        </>,
        document.body
      )}
    </div>
  );
};