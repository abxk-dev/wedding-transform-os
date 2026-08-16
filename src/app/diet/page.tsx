'use client';
import MealLogger from '@/components/diet/MealLogger';
import { UtensilsCrossed } from 'lucide-react';

export default function DietPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <UtensilsCrossed className="h-6 w-6 text-emerald-500" />
          Diet Tracker
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Log meals, track macros, stay on target. All vegetarian, egg-free options.
        </p>
      </div>
      <MealLogger />
    </div>
  );
}
