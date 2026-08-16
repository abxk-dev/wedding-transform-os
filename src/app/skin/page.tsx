'use client';
import SkinRoutine from '@/components/skin/SkinRoutine';
import { Sparkles } from 'lucide-react';

export default function SkinPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-emerald-500" />
          Skin Care
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          AM/PM routines, pigmentation care, and skin health tips.
        </p>
      </div>
      <SkinRoutine />
    </div>
  );
}
