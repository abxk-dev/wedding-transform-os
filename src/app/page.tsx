'use client';
import { useEffect, useState } from 'react';
import WeddingCountdown from '@/components/dashboard/WeddingCountdown';
import WeightCard from '@/components/dashboard/WeightCard';
import CompletionRing from '@/components/dashboard/CompletionRing';
import DailyChecklist from '@/components/dashboard/DailyChecklist';
import QuickStats from '@/components/dashboard/QuickStats';
import StreakCounter from '@/components/dashboard/StreakCounter';
import BeforeSleep from '@/components/dashboard/BeforeSleep';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Target, Dumbbell, Sparkles, Calendar } from 'lucide-react';
import { getDailyData, getSettings, initializeSampleData, updateStreak } from '@/lib/storage';
import { getToday } from '@/lib/dates';
import { calculateCompletion, sumDailyNutrition } from '@/lib/calculations';
import { PROGRAM_START } from '@/lib/constants';
import ProgressRing from '@/components/shared/ProgressRing';

export default function Dashboard() {
  const [completion, setCompletion] = useState(0);
  const [nutrition, setNutrition] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
  const [targets, setTargets] = useState({ calories: 1900, protein: 130 });
  const [workoutDone, setWorkoutDone] = useState(false);
  const [skinDone, setSkinDone] = useState(false);
  const [programStarted, setProgramStarted] = useState(false);

  useEffect(() => {
    initializeSampleData();
    const today = getToday();
    const started = today >= PROGRAM_START;
    setProgramStarted(started);

    if (started) {
      const data = getDailyData(today);
      const settings = getSettings();
      setCompletion(calculateCompletion(data));
      setNutrition(sumDailyNutrition(data.meals));
      setTargets({ calories: settings.targets.calories, protein: settings.targets.protein });
      setWorkoutDone(data.workout?.completed || false);
      setSkinDone(data.skinCare.filter(s => s.checked).length >= 3);
      updateStreak(today);
    }
  }, []);

  const caloriePct = targets.calories > 0 ? Math.min(100, Math.round((nutrition.calories / targets.calories) * 100)) : 0;
  const proteinPct = targets.protein > 0 ? Math.min(100, Math.round((nutrition.protein / targets.protein) * 100)) : 0;

  // Pre-program state
  if (!programStarted) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <WeddingCountdown />
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-900">
          <CardContent className="p-5 sm:p-6 text-center">
            <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-500 mx-auto mb-3" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">Program Starts Tomorrow</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Your 55-day transformation begins on {new Date(PROGRAM_START + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}.
            </p>
            <div className="space-y-2 text-left max-w-sm mx-auto">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Tomorrow you&apos;ll start:</p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5">
                {['Daily checklist tracking', 'Meal logging with macro tracking', 'Workout logging (Upper Body A)', 'Skincare AM/PM routine', 'Water, steps, and sleep tracking'].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <WeightCard />
          <StreakCounter />
        </div>
      </div>
    );
  }

  // Active program
  return (
    <div className="space-y-4 sm:space-y-5">
      <WeddingCountdown />

      {/* Stats Row: stack on mobile, side-by-side on tablet+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <WeightCard />
        <div className="flex flex-col gap-3">
          <CompletionRing value={completion} />
          <StreakCounter />
        </div>
      </div>

      {/* Nutrition */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Nutrition</span>
            </div>
            <Badge variant="outline" className="text-xs">{nutrition.calories}/{targets.calories} kcal</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5">
              <ProgressRing value={caloriePct} size={56} strokeWidth={5} color="#10b981">
                <span className="text-[10px] font-bold text-gray-900 dark:text-white">{caloriePct}%</span>
              </ProgressRing>
              <div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Calories</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{nutrition.calories}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <ProgressRing value={proteinPct} size={56} strokeWidth={5} color="#3b82f6">
                <span className="text-[10px] font-bold text-gray-900 dark:text-white">{proteinPct}%</span>
              </ProgressRing>
              <div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Protein</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{nutrition.protein}g</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="text-center">
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Carbs</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{nutrition.carbs}g</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Fats</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{nutrition.fats}g</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Fiber</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{nutrition.fiber}g</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <QuickStats />

      {/* Status Badges */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant={workoutDone ? 'default' : 'outline'} className={workoutDone ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
          <Dumbbell className="h-3 w-3 mr-1" />{workoutDone ? 'Workout Done' : 'Workout Pending'}
        </Badge>
        <Badge variant={skinDone ? 'default' : 'outline'} className={skinDone ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
          <Sparkles className="h-3 w-3 mr-1" />{skinDone ? 'Skincare Done' : 'Skincare Pending'}
        </Badge>
        <Badge variant="outline">
          <Flame className="h-3 w-3 mr-1 text-orange-500" />
          {completion >= 80 ? 'Great Day' : completion >= 50 ? 'Good Progress' : 'Keep Going'}
        </Badge>
      </div>

      <DailyChecklist />

      {/* Before Sleep */}
      <BeforeSleep />
    </div>
  );
}
