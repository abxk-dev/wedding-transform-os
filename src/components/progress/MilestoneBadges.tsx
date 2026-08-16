'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Flame, Zap, Trophy, Crown } from 'lucide-react';
import { getStreak } from '@/lib/storage';
import { MILESTONE_BADGES } from '@/lib/constants';
import { StreakData } from '@/lib/types';

const iconMap: Record<string, typeof Flame> = { flame: Flame, zap: Zap, trophy: Trophy, crown: Crown, award: Award };

export default function MilestoneBadges() {
  const [streak, setStreak] = useState<StreakData>({ current: 0, best: 0, lastDate: '' });

  useEffect(() => { setStreak(getStreak()); }, []);

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-1.5 px-3 sm:px-6 pt-3 sm:pt-4">
        <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
          <Award className="h-4 w-4 text-emerald-500" />
          Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-3 sm:px-6 pb-3">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
          {MILESTONE_BADGES.map(badge => {
            const Icon = iconMap[badge.icon] || Award;
            const unlocked = streak.best >= badge.days;
            return (
              <div
                key={badge.id}
                className={`flex flex-col items-center gap-1 p-1.5 sm:p-2 rounded-xl transition-all ${
                  unlocked
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30'
                    : 'bg-gray-50 dark:bg-gray-800 opacity-50'
                }`}
              >
                <div className={`p-1.5 rounded-full ${unlocked ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  <Icon className={`h-3.5 w-3.5 ${unlocked ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`} />
                </div>
                <span className="text-[9px] sm:text-[10px] font-medium text-center leading-tight text-gray-700 dark:text-gray-300">
                  {badge.label}
                </span>
                {!unlocked && <span className="text-[8px] text-gray-400">{badge.days}d</span>}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
