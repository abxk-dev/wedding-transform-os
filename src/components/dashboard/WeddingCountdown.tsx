'use client';
import { WEDDING_DATE } from '@/lib/constants';
import { daysUntilWedding } from '@/lib/calculations';
import { Heart } from 'lucide-react';

export default function WeddingCountdown() {
  const daysLeft = daysUntilWedding(WEDDING_DATE);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-4 sm:p-6 text-white">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8 sm:-translate-y-12 sm:translate-x-12" />
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6 sm:translate-y-8 sm:-translate-x-8" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1.5">
          <Heart className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
          <span className="text-xs sm:text-sm font-medium opacity-90">Wedding Countdown</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl sm:text-5xl font-bold">{daysLeft}</span>
          <span className="text-base sm:text-lg opacity-90">days to go</span>
        </div>
        <p className="text-xs sm:text-sm opacity-80 mt-1.5 leading-relaxed">
          {daysLeft > 30
            ? 'Stay consistent. Every day counts.'
            : daysLeft > 14
            ? 'Final stretch. Push through.'
            : daysLeft > 7
            ? 'Almost there. Maintain discipline.'
            : 'Final days. Trust the process.'}
        </p>
      </div>
    </div>
  );
}
