
import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';

interface CustomDatePickerProps {
  value: string | undefined;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Chọn ngày',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // State for the calendar view (navigating months/years)
  const [viewDate, setViewDate] = useState(new Date());
  
  // State for the temporary selection before clicking OK
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize view based on value prop
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        setViewDate(date);
        setTempSelectedDate(date);
      }
    } else {
      // If no value, reset temp but keep view on today or keep view as is
      setTempSelectedDate(null);
    }
  }, [value, isOpen]);

  // Handle click outside to close (without saving if OK wasn't clicked)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateForDisplay = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('vi-VN').format(date); // dd/mm/yyyy
  };

  const formatDateForValue = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // --- Navigation Logic ---
  const handlePrevYear = () => {
    setViewDate(new Date(viewDate.getFullYear() - 1, viewDate.getMonth(), 1));
  };
  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };
  const handleNextYear = () => {
    setViewDate(new Date(viewDate.getFullYear() + 1, viewDate.getMonth(), 1));
  };

  // --- Selection Logic ---
  const handleDayClick = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setTempSelectedDate(newDate);
  };

  const handleNowClick = () => {
    const now = new Date();
    setViewDate(now);
    setTempSelectedDate(now);
  };

  const handleOkClick = () => {
    if (tempSelectedDate) {
      onChange(formatDateForValue(tempSelectedDate));
    } else {
        onChange(''); // Clear if nothing selected
    }
    setIsOpen(false);
  };

  // --- Calendar Grid Generation ---
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 = Sunday
  };

  const renderCalendar = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Empty slots for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const currentDayDate = new Date(year, month, d);
      const isSelected = tempSelectedDate && 
        currentDayDate.getDate() === tempSelectedDate.getDate() &&
        currentDayDate.getMonth() === tempSelectedDate.getMonth() &&
        currentDayDate.getFullYear() === tempSelectedDate.getFullYear();
        
      const isToday = new Date().toDateString() === currentDayDate.toDateString();

      days.push(
        <button
          key={d}
          onClick={() => handleDayClick(d)}
          className={`h-8 w-8 rounded-full text-sm flex items-center justify-center transition-colors
            ${isSelected 
                ? 'bg-blue-600 text-white font-bold shadow-md' 
                : isToday 
                    ? 'border border-blue-600 text-blue-600 font-bold bg-blue-50'
                    : 'text-slate-700 hover:bg-slate-100'
            }
          `}
        >
          {d}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Input Field Trigger */}
      <div 
        className={`relative flex items-center cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <input
          type="text"
          readOnly
          value={formatDateForDisplay(value)}
          placeholder={placeholder}
          className={`w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:border-blue-500 outline-none shadow-sm cursor-pointer bg-white ${disabled ? 'bg-slate-50' : ''}`}
        />
        <Icons.Calendar size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
      </div>

      {/* Popup */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-[300px] animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header: Navigation */}
          <div className="flex justify-between items-center mb-4">
             <div className="flex gap-1">
                <button onClick={handlePrevYear} title="Lùi 1 năm" className="p-1 hover:bg-slate-100 rounded text-slate-500"><Icons.ChevronsLeft size={18}/></button>
                <button onClick={handlePrevMonth} title="Lùi 1 tháng" className="p-1 hover:bg-slate-100 rounded text-slate-500"><Icons.ChevronLeft size={18}/></button>
             </div>
             
             <div className="font-bold text-slate-800">
                Tháng {viewDate.getMonth() + 1}, {viewDate.getFullYear()}
             </div>

             <div className="flex gap-1">
                <button onClick={handleNextMonth} title="Tiến 1 tháng" className="p-1 hover:bg-slate-100 rounded text-slate-500"><Icons.ChevronRight size={18}/></button>
                <button onClick={handleNextYear} title="Tiến 1 năm" className="p-1 hover:bg-slate-100 rounded text-slate-500"><Icons.ChevronsRight size={18}/></button>
             </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => (
                <div key={d} className="text-xs font-bold text-slate-400 h-6 flex items-center justify-center">{d}</div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
             {renderCalendar()}
          </div>

          {/* Footer: Now & OK */}
          <div className="flex justify-between items-center border-t border-slate-100 pt-3">
             <button 
                onClick={handleNowClick}
                className="text-xs font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
             >
                Hôm nay
             </button>
             <button 
                onClick={handleOkClick}
                className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded shadow-sm transition-colors"
             >
                OK
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
