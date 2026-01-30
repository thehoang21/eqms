import React, { useState, useEffect, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { cn } from '../utils';

export interface MultiSelectOption {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export interface MultiSelectProps {
  label?: string;
  value: (string | number)[];
  onChange: (values: (string | number)[]) => void;
  options: MultiSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  triggerClassName?: string;
  enableSearch?: boolean;
  disabled?: boolean;
  maxVisibleRows?: number;
  rowHeight?: number;
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
  maxVisibleRows = 5,
  rowHeight = 40,
  maxVisibleTags = 2,
}) => {
  const selectId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = enableSearch
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const selectedOptions = options.filter((opt) => value.includes(opt.value));
  const visibleTags = selectedOptions.slice(0, maxVisibleTags);
  const remainingCount = selectedOptions.length - maxVisibleTags;

  // Calculate dropdown position
  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  // Handle open/close
  const handleOpen = () => {
    if (disabled) return;
    updatePosition();
    setIsOpen(true);
    setSearchQuery("");
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery("");
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

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      handleClose();
    };

    // Delay to avoid catching the opening click
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && enableSearch && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, enableSearch]);

  // Update position on scroll/resize
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  // Close other dropdowns
  useEffect(() => {
    const handleCloseOthers = (e: CustomEvent<{ id: string }>) => {
      if (e.detail.id !== selectId && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('select-open' as any, handleCloseOthers);
    return () => window.removeEventListener('select-open' as any, handleCloseOthers);
  }, [selectId, isOpen]);

  const handleTriggerClick = () => {
    if (isOpen) {
      handleClose();
    } else {
      window.dispatchEvent(new CustomEvent('select-open', { detail: { id: selectId } }));
      handleOpen();
    }
  };

  const searchHeight = enableSearch ? 56 : 0;
  const dropdownMaxHeight = maxVisibleRows * rowHeight + searchHeight + 8;

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {label && (
        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        disabled={disabled}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm transition-colors",
          "min-h-[44px]",
          disabled
            ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
            : isOpen
            ? "border-emerald-500 ring-2 ring-emerald-500/20"
            : "border-slate-200 hover:border-slate-400",
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
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200"
                >
                  <span className="truncate max-w-[100px]">{option.label}</span>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveTag(option.value, e)}
                    className="hover:bg-emerald-100 rounded p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {remainingCount > 0 && (
                <span className="text-xs text-slate-500">+{remainingCount} more</span>
              )}
            </>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform shrink-0 ml-2",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="fixed bg-white rounded-lg border border-slate-200 shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150"
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
            zIndex: 50,
            maxHeight: dropdownMaxHeight,
          }}
        >
          {/* Search */}
          {enableSearch && (
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full h-10 pl-9 pr-3 text-[16px] sm:text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                />
              </div>
            </div>
          )}

          {/* Options */}
          <div 
            className="overflow-y-auto overscroll-contain"
            style={{ maxHeight: maxVisibleRows * rowHeight }}
          >
            {filteredOptions.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleToggleOption(option.value)}
                    className={cn(
                      "flex w-full items-center px-3 text-sm transition-colors",
                      "min-h-[40px] hover:bg-slate-50 active:bg-slate-100",
                      isSelected && "bg-emerald-50 text-emerald-700"
                    )}
                    style={{ height: rowHeight }}
                  >
                    <span className="flex-1 text-left truncate">{option.label}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                  </button>
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
