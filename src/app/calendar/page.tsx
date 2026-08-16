'use client';
import { useState, useEffect, useCallback } from 'react';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import DayDetail from '@/components/calendar/DayDetail';
import { getToday } from '@/lib/dates';
import { Calendar, X } from 'lucide-react';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [showDetail, setShowDetail] = useState(false);

  const handleDaySelect = (date: string) => {
    setSelectedDate(date);
    setShowDetail(true);
  };

  const handleClose = useCallback(() => {
    setShowDetail(false);
  }, []);

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (showDetail) {
      document.addEventListener('keydown', handler);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [showDetail, handleClose]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
          55-Day Calendar
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Tap any day for details. Color = completion.
        </p>
      </div>

      <CalendarGrid onDaySelect={handleDaySelect} selectedDate={selectedDate} />

      {/* Bottom Sheet - custom implementation for reliable positioning */}
      {showDetail && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleClose}
          />

          {/* Sheet */}
          <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col">
              {/* Handle bar */}
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Day Details</h2>
                <button
                  onClick={handleClose}
                  className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 py-3 overscroll-contain">
                <DayDetail date={selectedDate} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
