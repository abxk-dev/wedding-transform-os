'use client';
import WorkoutView from '@/components/workout/WorkoutView';
import { Dumbbell } from 'lucide-react';

export default function WorkoutPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-emerald-500" />
          Workout
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          5-day gym split with progressive overload. Log every set.
        </p>
      </div>
      <WorkoutView />
    </div>
  );
}
