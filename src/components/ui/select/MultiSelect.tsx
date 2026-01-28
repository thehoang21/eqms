import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { cn } from '../utils';

/**
 * Option type for MultiSelect component
 */
export interface MultiSelectOption {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

/**
 * Custom MultiSelect component with search functionality and portal rendering
 * Allows selecting multiple options
 * 
 * @example
 * ```tsx
 * <MultiSelect
 *   label="Authors"
 *   value={authors}
 *   onChange={setAuthors}
 *   options={[
 *     { label: "John Doe", value: "john" },
 *     { label: "Jane Smith", value: "jane" }
 *   ]}
 *   enableSearch
 * />
 * ```
 */
export interface MultiSelectProps {
  /** Label displayed above select */
  label?: string;
  /** Current selected values (array) */
  value: (string | number)[];
  /** Callback when values change */
  onChange: (values: (string | number)[]) => void;
  /** Array of selectable options */
  options: MultiSelectOption[];
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
  /** Maximum number of tags to show before "+X more" (default: 2) */
  maxVisibleTags?: number;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
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
  maxVisibleRows = 4,
  rowHeight = 44,
  maxVisibleTags = 2,
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

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  // Recalculate position khi filtered options thay đổi
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const safeMargin = 8;
      
      const searchHeight = enableSearch ? 50 : 0;
      const estimatedDropdownHeight = Math.min(
        filteredOptions.length * rowHeight,
        maxVisibleRows * rowHeight
      ) + searchHeight + 8;
      
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const shouldOpenUpward = spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow;
      
      let leftPosition = rect.left;
      let dropdownWidth = rect.width;
      
      if (viewportWidth < 640) {
        dropdownWidth = Math.min(rect.width, viewportWidth - (safeMargin * 2));
        leftPosition = Math.max(safeMargin, Math.min(rect.left, viewportWidth - dropdownWidth - safeMargin));
      } else {
        if (leftPosition + dropdownWidth > viewportWidth - safeMargin) {
          leftPosition = viewportWidth - dropdownWidth - safeMargin;
        }
        if (leftPosition < safeMargin) {
          leftPosition = safeMargin;
        }
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

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
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
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Scroll/resize handler
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

  // Auto focus search input
  useEffect(() => {
    if (isOpen && enableSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen, enableSearch]);

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const safeMargin = 8;
      
      const searchHeight = enableSearch ? 50 : 0;
      const estimatedDropdownHeight = Math.min(
        filteredOptions.length * rowHeight,
        maxVisibleRows * rowHeight
      ) + searchHeight + 8;
      
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const shouldOpenUpward = spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow;
      
      let leftPosition = rect.left;
      let dropdownWidth = rect.width;
      
      if (viewportWidth < 640) {
        dropdownWidth = Math.min(rect.width, viewportWidth - (safeMargin * 2));
        leftPosition = Math.max(safeMargin, Math.min(rect.left, viewportWidth - dropdownWidth - safeMargin));
      } else {
        if (leftPosition + dropdownWidth > viewportWidth - safeMargin) {
          leftPosition = viewportWidth - dropdownWidth - safeMargin;
        }
        if (leftPosition < safeMargin) {
          leftPosition = safeMargin;
        }
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
    setIsOpen(!isOpen);
  };

  const handleToggleOption = (optionValue: string | number) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemoveTag = (optionValue: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  const visibleTags = selectedOptions.slice(0, maxVisibleTags);
  const remainingCount = selectedOptions.length - maxVisibleTags;

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
          "min-h-[44px]",
          disabled
            ? "bg-slate-50 cursor-not-allowed opacity-60"
            : isOpen
            ? "ring-2 ring-emerald-500 border-emerald-500"
            : "hover:border-slate-300 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500",
          triggerClassName
        )}
      >
        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
          {selectedOptions.length === 0 ? (
            <span className="text-slate-500">{placeholder}</span>
          ) : (
            <>
              {visibleTags.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200"
                >
                  {option.icon}
                  <span className="truncate max-w-[120px]">{option.label}</span>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveTag(option.value, e)}
                    className="hover:bg-emerald-100 rounded-sm p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="text-xs text-slate-600 font-medium">
                  +{remainingCount} more
                </span>
              )}
            </>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Portal */}
      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          style={dropdownStyle}
          className={cn(
            "rounded-md border border-slate-200 bg-white shadow-lg overflow-hidden min-w-[200px]",
            "animate-in fade-in duration-100",
            dropdownStyle.bottom !== undefined 
              ? "slide-in-from-bottom-2" 
              : "slide-in-from-top-2 zoom-in-95"
          )}
        >
          {enableSearch && (
            <div 
              className="flex items-center border-b border-slate-100 px-3 pb-2 pt-3 bg-white"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <Search className="mr-2 h-4 w-4 text-slate-400 shrink-0 opacity-50" />
              <input
                ref={searchInputRef}
                className="flex h-6 w-full rounded-md bg-transparent py-1 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              />
            </div>
          )}
          
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
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <div
                    key={option.value}
                    onClick={() => handleToggleOption(option.value)}
                    style={{ height: rowHeight }}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm px-4 text-sm outline-none transition-colors",
                      isSelected
                        ? "bg-emerald-50 text-emerald-700 font-medium"
                        : "text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-center gap-2 flex-1 truncate">
                      {option.icon}
                      <span className="truncate">{option.label}</span>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-emerald-600 ml-2 shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
