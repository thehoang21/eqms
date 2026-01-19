import React, { useState, useEffect, useRef } from 'react';
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
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = enableSearch
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const selectedOption = options.find((opt) => opt.value === value);

  // Xử lý click ra ngoài để đóng dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xử lý scroll/resize window
  useEffect(() => {
    const handleScrollOrResize = (e: Event) => {
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
        return;
      }
      if (isOpen) setIsOpen(false);
    };

    if (isOpen) {
      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);
    }

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  // Auto focus vào ô search khi mở
  useEffect(() => {
    if (isOpen && enableSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen, enableSearch]);

  // Tính toán vị trí dropdown
  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      });
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
      
      {/* Trigger Button */}
      <button
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
            ? "ring-2 ring-emerald-500 border-emerald-500"
            : "hover:border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
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

      {/* Dropdown Portal */}
      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          style={dropdownStyle}
          className="rounded-md border border-slate-200 bg-white shadow-lg animate-in fade-in zoom-in-95 duration-100 overflow-hidden min-w-[200px]"
        >
          {enableSearch && (
            <div className="flex items-center border-b border-slate-100 px-3 pb-2 pt-3 bg-white">
              <Search className="mr-2 h-4 w-4 text-slate-400 shrink-0 opacity-50" />
              <input
                ref={searchInputRef}
                className="flex h-6 w-full rounded-md bg-transparent py-1 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          
          <div
            className="overflow-y-auto p-1 custom-scrollbar"
            style={{ 
              // 3. Giới hạn chiều cao: Số dòng * Chiều cao 1 dòng
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
                    setSearchQuery("");
                  }}
                  // 4. Gán cứng chiều cao (height) để khớp với rowHeight
                  style={{ height: rowHeight }} 
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
        </div>,
        document.body
      )}
    </div>
  );
};