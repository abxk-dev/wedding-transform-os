'use client';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

export default function StatCard({ label, value, unit, icon: Icon, iconColor = 'text-emerald-500', trend, onClick }: StatCardProps) {
  return (
    <Card
      className={`bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
              {unit && <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>}
            </div>
            {trend && (
              <p className={`text-xs mt-1 ${trend.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                {trend.isPositive ? '↓' : '↑'} {Math.abs(trend.value)} kg
              </p>
            )}
          </div>
          {Icon && (
            <div className={`p-2 rounded-xl bg-gray-50 dark:bg-gray-800 ${iconColor}`}>
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
