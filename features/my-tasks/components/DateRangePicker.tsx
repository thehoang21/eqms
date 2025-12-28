import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../../../components/ui/utils';
import { Button } from '../../../components/ui/button/Button';

interface DateRangePickerProps {
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  label?: string;
}

interface QuickSelectOption {
  label: string;
  getValue: () => { from: string; to: string };
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFromDate, setTempFromDate] = useState(fromDate);
  const [tempToDate, setTempToDate] = useState(toDate);
  
  // View state - tracks the first month shown
  const [viewDate, setViewDate] = useState(() => {
    if (fromDate) return new Date(fromDate);
    return new Date();
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const quickOptions: QuickSelectOption[] = [
    {
      label: 'Select past 7 days',
      getValue: () => {
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - 7);
        return {
          from: from.toISOString().split('T')[0],
          to: to.toISOString().split('T')[0],
        };
      },
    },
    {
      label: 'Previous 30 days',
      getValue: () => {
        const to = new Date();
        const from = new Date();
        from.setDate(from.getDate() - 30);
        return {
          from: from.toISOString().split('T')[0],
          to: to.toISOString().split('T')[0],
        };
      },
    },
    {
      label: 'Previous 6 months',
      getValue: () => {
        const to = new Date();
        const from = new Date();
        from.setMonth(from.getMonth() - 6);
        return {
          from: from.toISOString().split('T')[0],
          to: to.toISOString().split('T')[0],
        };
      },
    },
    {
      label: 'Previous year',
      getValue: () => {
        const to = new Date();
        const from = new Date();
        from.setFullYear(from.getFullYear() - 1);
        return {
          from: from.toISOString().split('T')[0],
          to: to.toISOString().split('T')[0],
        };
      },
    },
  ];

  // Handle positioning - FIX: Calculate position immediately when opening
  useLayoutEffect(() => {
    if (isOpen && triggerRef.current) {
      const updatePosition = () => {
        if (!triggerRef.current) return;
        
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // Estimated popover dimensions
        const popoverWidth = screenWidth < 1024 ? 450 : 600; // lg breakpoint
        const popoverHeight = 450;
        
        // Adaptive left offset based on screen size
        // iPad (768-1024): 60% offset, Desktop: 40% offset
        const leftOffsetPercent = screenWidth >= 768 && screenWidth < 1024 ? 0.6 : 0.4;
        let left = triggerRect.left - (popoverWidth * leftOffsetPercent);
        let top = triggerRect.bottom + 8;
        
        // Check right overflow
        if (left + popoverWidth > screenWidth - 20) {
          left = triggerRect.right - popoverWidth;
          if (left < 20) {
            left = Math.max(20, (screenWidth - popoverWidth) / 2);
          }
        }
        
        // Check left overflow
        if (left < 20) {
          left = 20;
        }
        
        // Check bottom overflow - show above if needed
        if (top + popoverHeight > screenHeight - 20) {
          top = triggerRect.top - popoverHeight - 8;
          if (top < 20) {
            top = triggerRect.bottom + 8; // fallback to below
          }
        }

        setPopoverStyle({
          position: 'fixed',
          top: top,
          left: left,
          zIndex: 9999,
          opacity: 1,
        });
      };

      // Update immediately without waiting for ref
      updatePosition();
      
      // Also update on scroll/resize
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);

      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Sync temp state when opening
  useEffect(() => {
    if (isOpen) {
      setTempFromDate(fromDate);
      setTempToDate(toDate);
      if (fromDate) {
        setViewDate(new Date(fromDate));
      }
    }
  }, [isOpen, fromDate, toDate]);

  const handleQuickSelect = (option: QuickSelectOption) => {
    const { from, to } = option.getValue();
    setTempFromDate(from);
    setTempToDate(to);
    setViewDate(new Date(from));
  };

  const handleApply = () => {
    onFromDateChange(tempFromDate);
    onToDateChange(tempToDate);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setViewDate(newDate);
  };

  const handleDateClick = (dateStr: string) => {
    if (!tempFromDate || (tempFromDate && tempToDate)) {
      setTempFromDate(dateStr);
      setTempToDate('');
    } else if (tempFromDate && !tempToDate) {
      if (dateStr < tempFromDate) {
        setTempToDate(tempFromDate);
        setTempFromDate(dateStr);
      } else {
        setTempToDate(dateStr);
      }
    }
  };

  const isDateInRange = (dateStr: string) => {
    if (!tempFromDate || !tempToDate) return false;
    return dateStr >= tempFromDate && dateStr <= tempToDate;
  };

  const isStartDate = (dateStr: string) => dateStr === tempFromDate;
  const isEndDate = (dateStr: string) => dateStr === tempToDate;

  const renderCalendar = (monthOffset: number) => {
    const currentMonth = new Date(viewDate);
    currentMonth.setMonth(currentMonth.getMonth() + monthOffset);
    
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const days = [];
    // Empty slots for days before start of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const inRange = isDateInRange(dateStr);
      const isStart = isStartDate(dateStr);
      const isEnd = isEndDate(dateStr);
      const isSelected = isStart || isEnd;

      // Styling logic
      let buttonClass = "h-8 w-8 rounded-full text-xs flex items-center justify-center transition-all z-20 relative";
      
      // Background connector for range
      const isRangeStart = isStart && tempToDate;
      const isRangeEnd = isEnd && tempFromDate;
      const isRangeMiddle = inRange && !isStart && !isEnd;

      days.push(
        <div key={day} className="relative p-0">
          {/* Connecting background strip */}
          {inRange && (
            <div className={cn(
              "absolute top-0 bottom-0 bg-blue-50 z-0",
              isRangeStart ? "left-1/2 right-0 rounded-l-full" : "",
              isRangeEnd ? "left-0 right-1/2 rounded-r-full" : "",
              isRangeMiddle ? "left-0 right-0" : "",
              // If start == end, no strip needed or handled by rounded-full
              (isStart && isEnd) ? "hidden" : ""
            )} />
          )}
          
          <button
            type="button"
            onClick={() => handleDateClick(dateStr)}
            className={cn(
              buttonClass,
              isSelected 
                ? 'bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700' 
                : 'text-slate-700 hover:bg-slate-100',
              isRangeMiddle && 'text-blue-700 font-medium hover:bg-blue-100'
            )}
          >
            {day}
          </button>
        </div>
      );
    }

    return (
      <div className="flex-1 min-w-[240px] max-w-[280px]">
        <div className="flex items-center justify-between mb-3 px-1">
          {monthOffset === 0 ? (
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          ) : <div className="w-6" />}
          
          <span className="font-semibold text-slate-900 text-sm">
            {monthNames[month]} {year}
          </span>
          
          {monthOffset === 0 ? (
            <>
              <button
                type="button"
                onClick={() => navigateMonth('next')}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors lg:hidden"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="w-6 hidden lg:block" />
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-7 gap-0 mb-2">
          {dayNames.map((day, idx) => (
            <div key={idx} className="h-7 flex items-center justify-center text-xs font-medium text-slate-400">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {days}
        </div>
      </div>
    );
  };

  const getDisplayText = () => {
    if (fromDate && toDate) {
      // Format dates to be more readable
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const month = date.toLocaleDateString('en-US', { month: 'short' });
        const day = date.getDate();
        return `${month} ${day}`;
      };
      return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
    }
    return 'Select date range';
  };

  return (
    <div className="relative w-full">
      {label && (
        <label className="text-sm font-medium text-slate-700 mb-1.5 block">
          {label}
        </label>
      )}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-between gap-2 w-full px-4 h-11 rounded-lg text-sm font-medium transition-all',
          'shadow-sm border',
          isOpen
            ? 'bg-blue-50 border-blue-200 text-blue-700 ring-2 ring-blue-100'
            : fromDate && toDate
            ? 'bg-white border-slate-200 text-slate-900 hover:border-slate-300 hover:bg-slate-50'
            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
        )}
      >
        <div className="flex items-center gap-2.5">
          <CalendarIcon className={cn(
            "h-4 w-4",
            isOpen ? "text-blue-600" : fromDate ? "text-slate-600" : "text-slate-400"
          )} />
          <span>{getDisplayText()}</span>
        </div>
        <ChevronDown className={cn(
          'h-4 w-4 transition-transform duration-200', 
          isOpen ? 'rotate-180 text-blue-600' : fromDate ? 'text-slate-500' : 'text-slate-400'
        )} />
      </button>

      {isOpen && createPortal(
        <div 
          ref={popoverRef}
          style={popoverStyle}
          className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row"
        >
          {/* Sidebar */}
          <div className="w-full md:w-44 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50 p-2.5 space-y-0.5">
            {quickOptions.map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickSelect(option)}
                className="w-full text-left px-2.5 py-2 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="p-4">
            <div className="flex flex-col md:flex-row gap-6">
              {renderCalendar(0)}
              <div className="hidden lg:block">
                {renderCalendar(1)}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-400 hidden md:block">
                {tempFromDate && tempToDate ? (
                  <span>Selected: <span className="font-medium text-slate-700">{tempFromDate}</span> to <span className="font-medium text-slate-700">{tempToDate}</span></span>
                ) : 'Please select a range'}
              </div>
              <div className="flex gap-2.5 ml-auto">
                <Button variant="ghost" size="sm" onClick={handleCancel} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs px-4">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleApply} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm px-5 text-xs">
                  Apply dates
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
