'use client';
import { useState, useEffect } from 'react';
import { generateProgramDates, formatDateShort, formatDayOfWeek, isToday, isPast, getMonthName } from '@/lib/dates';
import { getDailyData, getDayCompletion } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface CalendarGridProps {
  onDaySelect: (date: string) => void;
  selectedDate: string;
}

export default function CalendarGrid({ onDaySelect, selectedDate }: CalendarGridProps) {
  const [dates, setDates] = useState<string[]>([]);
  const [completionMap, setCompletionMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const allDates = generateProgramDates();
    setDates(allDates);
    const map: Record<string, number> = {};
    allDates.forEach(date => {
      const data = getDailyData(date);
      map[date] = getDayCompletion(data);
    });
    setCompletionMap(map);
  }, []);

  const getHeatColor = (pct: number): string => {
    if (pct === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (pct < 25) return 'bg-emerald-100 dark:bg-emerald-900/30';
    if (pct < 50) return 'bg-emerald-200 dark:bg-emerald-800/40';
    if (pct < 75) return 'bg-emerald-300 dark:bg-emerald-700/50';
    if (pct < 100) return 'bg-emerald-400 dark:bg-emerald-600/60';
    return 'bg-emerald-500 dark:bg-emerald-500';
  };

  // Group dates by month
  const monthGroups: Record<string, string[]> = {};
  dates.forEach(date => {
    const month = getMonthName(date);
    if (!monthGroups[month]) monthGroups[month] = [];
    monthGroups[month].push(date);
  });

  let dayNum = 0;

  return (
    <div className="space-y-5">
      {Object.entries(monthGroups).map(([month, monthDates]) => (
        <div key={month}>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">{month}</h3>
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {/* Day headers */}
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <div key={i} className="text-center text-[10px] font-medium text-gray-400 dark:text-gray-500 pb-1">
                {d}
              </div>
            ))}

            {/* Empty cells for alignment */}
            {(() => {
              const firstDay = new Date(monthDates[0] + 'T00:00:00').getDay();
              const offset = firstDay === 0 ? 6 : firstDay - 1;
              return Array.from({ length: offset }, (_, i) => <div key={`empty-${i}`} />);
            })()}

            {/* Date cells */}
            {monthDates.map(date => {
              dayNum++;
              const pct = completionMap[date] || 0;
              const today = isToday(date);
              const selected = date === selectedDate;

              return (
                <button
                  key={date}
                  onClick={() => onDaySelect(date)}
                  className={cn(
                    'relative aspect-square rounded-lg sm:rounded-xl flex flex-col items-center justify-center gap-0 transition-all active:scale-95',
                    getHeatColor(pct),
                    today && 'ring-2 ring-emerald-500 ring-offset-1 dark:ring-offset-gray-900',
                    selected && 'ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-gray-900',
                  )}
                >
                  <span className={cn(
                    'text-[9px] sm:text-[10px] font-medium leading-none',
                    today ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-500 dark:text-gray-400'
                  )}>
                    {formatDateShort(date).split(' ')[0]}
                  </span>
                  <span className="text-[7px] sm:text-[8px] text-gray-400 dark:text-gray-500 leading-none">D{dayNum}</span>
                  {pct > 0 && (
                    <span className="text-[7px] sm:text-[8px] font-medium text-emerald-700 dark:text-emerald-300 leading-none">
                      {pct}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        <span className="text-[10px] text-gray-400">Less</span>
        {[0, 25, 50, 75, 100].map(pct => (
          <div key={pct} className={`w-2.5 h-2.5 rounded-sm ${getHeatColor(pct)}`} />
        ))}
        <span className="text-[10px] text-gray-400">More</span>
      </div>
    </div>
  );
}
