'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Trophy } from 'lucide-react';
import { getStreak } from '@/lib/storage';
import { StreakData } from '@/lib/types';

export default function StreakCounter() {
  const [streak, setStreak] = useState<StreakData>({ current: 0, best: 0, lastDate: '' });

  useEffect(() => {
    setStreak(getStreak());
  }, []);

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border-orange-200 dark:border-orange-900">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs text-orange-700 dark:text-orange-300">Streak</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{streak.current}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">days</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Trophy className="h-3 w-3" />
            <span>Best: {streak.best}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
