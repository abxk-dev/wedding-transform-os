'use client';
import BeforeSleep from '@/components/dashboard/BeforeSleep';
import { Moon } from 'lucide-react';

export default function SleepPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500" />
          Before Sleep
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          Nightly routine — different tasks every day. Relax, prep, recharge.
        </p>
      </div>
      <BeforeSleep />
    </div>
  );
}
