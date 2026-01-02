import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, Clock } from 'lucide-react';
import { cn } from '../utils';
import { Button } from '../button/Button';

interface DateTimePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  placeholder = "Select date & time",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'month' | 'year'>('calendar');
  
  // Initialize state from value or defaults
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => 
    value ? new Date(value) : null
  );
  
  const [viewDate, setViewDate] = useState<Date>(() => 
    value ? new Date(value) : new Date()
  );
  
  const [time, setTime] = useState(() => {
    const d = value ? new Date(value) : new Date();
    if (!value) return { hours: 0, minutes: 0 };
    return { hours: d.getHours(), minutes: d.getMinutes() };
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({ opacity: 0 });

  // Handle positioning
  useLayoutEffect(() => {
    if (isOpen && triggerRef.current) {
      const updatePosition = () => {
        if (!triggerRef.current) return;
        
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        const popoverWidth = 320;
        const popoverHeight = 420;
        
        let left = triggerRect.left;
        let top = triggerRect.bottom + 8;
        
        if (left + popoverWidth > screenWidth - 20) {
          left = screenWidth - popoverWidth - 20;
        }
        
        if (left < 20) left = 20;
        
        if (top + popoverHeight > screenHeight - 20) {
          top = triggerRect.top - popoverHeight - 8;
          if (top < 20) top = triggerRect.bottom + 8;
        }

        setPopoverStyle({
          position: 'fixed',
          top: top,
          left: left,
          zIndex: 9999,
          opacity: 1,
        });
      };

      updatePosition();
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Sync with external value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setSelectedDate(d);
        setViewDate(d);
        setTime({ hours: d.getHours(), minutes: d.getMinutes() });
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  // Reset view mode when opening
  useEffect(() => {
    if (isOpen) {
      setViewMode('calendar');
    }
  }, [isOpen]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setViewDate(newDate);
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewDate);
    newDate.setDate(day);
    setSelectedDate(newDate);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(monthIndex);
    setViewDate(newDate);
    setViewMode('calendar');
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(year);
    setViewDate(newDate);
    setViewMode('calendar');
  };

  const handleTimeChange = (type: 'hours' | 'minutes', val: string) => {
    let num = parseInt(val);
    if (isNaN(num)) return;
    
    if (type === 'hours') {
      num = Math.max(0, Math.min(23, num));
      setTime(prev => ({ ...prev, hours: num }));
    } else {
      num = Math.max(0, Math.min(59, num));
      setTime(prev => ({ ...prev, minutes: num }));
    }
  };

  const handleApply = () => {
    if (selectedDate) {
      const d = new Date(selectedDate);
      d.setHours(time.hours);
      d.setMinutes(time.minutes);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(time.hours).padStart(2, '0');
      const minutes = String(time.minutes).padStart(2, '0');
      
      onChange(`${year}-${month}-${day}T${hours}:${minutes}`);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setSelectedDate(null);
    setIsOpen(false);
  };

  const renderMonthView = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <button 
            onClick={() => setViewMode('calendar')} 
            className="p-1 hover:bg-slate-100 rounded-full text-slate-500"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-semibold text-slate-900 text-sm">Select Month</span>
          <div className="w-6"></div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {months.map((m, idx) => (
            <button
              key={m}
              onClick={() => handleMonthSelect(idx)}
              className={cn(
                "h-10 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors",
                viewDate.getMonth() === idx ? "bg-emerald-50 text-emerald-600" : "text-slate-700"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const currentYear = viewDate.getFullYear();
    const startYear = Math.floor(currentYear / 12) * 12;
    const years = [];
    for (let i = 0; i < 12; i++) {
      years.push(startYear + i);
    }

    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <button 
            onClick={() => {
              const d = new Date(viewDate);
              d.setFullYear(d.getFullYear() - 12);
              setViewDate(d);
            }} 
            className="p-1 hover:bg-slate-100 rounded-full text-slate-500"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-semibold text-slate-900 text-sm">
            {startYear} - {startYear + 11}
          </span>
          <button 
            onClick={() => {
              const d = new Date(viewDate);
              d.setFullYear(d.getFullYear() + 12);
              setViewDate(d);
            }} 
            className="p-1 hover:bg-slate-100 rounded-full text-slate-500"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => handleYearSelect(y)}
              className={cn(
                "h-10 rounded-md text-sm font-medium hover:bg-slate-100 transition-colors",
                viewDate.getFullYear() === y ? "bg-emerald-50 text-emerald-600" : "text-slate-700"
              )}
            >
              {y}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    if (viewMode === 'month') return renderMonthView();
    if (viewMode === 'year') return renderYearView();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === month && 
        selectedDate.getFullYear() === year;

      const isToday = new Date().getDate() === day && 
        new Date().getMonth() === month && 
        new Date().getFullYear() === year;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => handleDateClick(day)}
          className={cn(
            "h-8 w-8 rounded-full text-xs flex items-center justify-center transition-all",
            isSelected 
              ? 'bg-emerald-600 text-white font-semibold shadow-sm hover:bg-emerald-700' 
              : isToday
                ? 'text-emerald-600 font-bold bg-emerald-50 hover:bg-emerald-100'
                : 'text-slate-700 hover:bg-slate-100'
          )}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            type="button"
            onClick={() => navigateMonth('prev')}
            className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setViewMode('month')}
              className="font-semibold text-slate-900 text-sm hover:bg-slate-100 px-2 py-1 rounded transition-colors"
            >
              {monthNames[month]}
            </button>
            <button 
              onClick={() => setViewMode('year')}
              className="font-semibold text-slate-900 text-sm hover:bg-slate-100 px-2 py-1 rounded transition-colors"
            >
              {year}
            </button>
          </div>
          
          <button
            type="button"
            onClick={() => navigateMonth('next')}
            className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
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

  const formatDisplayValue = () => {
    if (!value) return placeholder;
    const d = new Date(value);
    if (isNaN(d.getTime())) return placeholder;
    
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
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
          'flex items-center justify-between gap-2 w-full px-3 py-2 h-11 rounded-md text-sm transition-all duration-200',
          'border bg-white',
          isOpen
            ? 'ring-2 ring-emerald-500 border-emerald-500'
            : 'border-slate-200 hover:border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className={cn(
            "h-4 w-4 shrink-0",
            value ? "text-slate-900" : "text-slate-400"
          )} />
          <span className={cn("truncate", !value && "text-slate-400")}>
            {formatDisplayValue()}
          </span>
        </div>
        <ChevronDown className={cn(
          'h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0', 
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && createPortal(
        <div 
          ref={popoverRef}
          style={popoverStyle}
          className="bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden flex flex-col w-[320px]"
        >
          {renderCalendar()}
          
          <div className="border-t border-slate-100 p-4 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">Time</span>
              <div className="flex items-center gap-1 ml-auto">
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={String(time.hours).padStart(2, '0')}
                    onChange={(e) => handleTimeChange('hours', e.target.value)}
                    className="w-12 h-8 rounded border border-slate-200 text-center text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <span className="text-slate-400">:</span>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={String(time.minutes).padStart(2, '0')}
                    onChange={(e) => handleTimeChange('minutes', e.target.value)}
                    className="w-12 h-8 rounded border border-slate-200 text-center text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClear}
                className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              >
                Clear
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleApply}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={!selectedDate}
                >
                  Apply
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
