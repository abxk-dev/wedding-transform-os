'use client';
import HealthInfo from '@/components/health/HealthInfo';
import { Heart } from 'lucide-react';

export default function HealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Heart className="h-6 w-6 text-emerald-500" />
          Reproductive Health
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Evidence-based lifestyle habits for overall health and reproductive wellness.
        </p>
      </div>
      <HealthInfo />
    </div>
  );
}
