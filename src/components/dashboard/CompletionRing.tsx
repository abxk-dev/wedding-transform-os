'use client';
import { Card, CardContent } from '@/components/ui/card';
import ProgressRing from '@/components/shared/ProgressRing';

interface CompletionRingProps {
  value: number;
}

export default function CompletionRing({ value }: CompletionRingProps) {
  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardContent className="p-3 sm:p-4 flex items-center gap-3">
        <ProgressRing value={value} size={56} strokeWidth={6}>
          <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{value}</span>
        </ProgressRing>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Today</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}% done</p>
        </div>
      </CardContent>
    </Card>
  );
}
