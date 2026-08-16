'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Droplets, Footprints, Moon, Edit3, Check, Plus, Minus } from 'lucide-react';
import { getDailyData, updateDailyField, getSettings } from '@/lib/storage';
import { getToday } from '@/lib/dates';

interface StatItem {
  label: string;
  value: number;
  target: number;
  unit: string;
  icon: typeof Droplets;
  iconColor: string;
  bgColor: string;
  field: 'water' | 'steps' | 'sleep';
  step: number;
  format: (v: number) => string;
}

export default function QuickStats() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const data = getDailyData(getToday());
    const settings = getSettings();
    setStats([
      {
        label: 'Water', value: data.water, target: settings.targets.water, unit: 'ml',
        icon: Droplets, iconColor: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        field: 'water', step: 250, format: v => `${v}`
      },
      {
        label: 'Steps', value: data.steps, target: settings.targets.steps, unit: '',
        icon: Footprints, iconColor: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-950/30',
        field: 'steps', step: 500, format: v => v.toLocaleString()
      },
      {
        label: 'Sleep', value: data.sleep, target: settings.targets.sleep, unit: 'hrs',
        icon: Moon, iconColor: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        field: 'sleep', step: 0.5, format: v => v.toFixed(1)
      },
    ]);
  }, []);

  const handleQuickAdjust = (field: string, delta: number) => {
    const data = getDailyData(getToday());
    const current = data[field as keyof typeof data] as number;
    const newVal = Math.max(0, Math.round((current + delta) * 10) / 10);
    updateDailyField(getToday(), field as keyof typeof data, newVal);
    setStats(prev => prev.map(s => s.field === field ? { ...s, value: newVal } : s));
  };

  const handleSaveEdit = (field: string) => {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val >= 0) {
      updateDailyField(getToday(), field as 'water' | 'steps' | 'sleep', val);
      setStats(prev => prev.map(s => s.field === field ? { ...s, value: val } : s));
    }
    setEditing(null);
  };

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {stats.map(stat => {
        const Icon = stat.icon;
        const pct = stat.target > 0 ? Math.min(100, Math.round((stat.value / stat.target) * 100)) : 0;

        return (
          <Card key={stat.field} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardContent className="p-2.5 sm:p-3">
              {/* Header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-3.5 w-3.5 ${stat.iconColor}`} />
                </div>
                <button
                  className="h-5 w-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => {
                    if (editing === stat.field) handleSaveEdit(stat.field);
                    else { setEditValue(stat.value.toString()); setEditing(stat.field); }
                  }}
                >
                  {editing === stat.field ? <Check className="h-3 w-3" /> : <Edit3 className="h-3 w-3" />}
                </button>
              </div>

              {/* Value */}
              {editing === stat.field ? (
                <Input
                  type="number"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  className="h-7 text-sm mb-1"
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleSaveEdit(stat.field)}
                  onBlur={() => handleSaveEdit(stat.field)}
                />
              ) : (
                <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                  {stat.format(stat.value)}
                </p>
              )}

              <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1.5">
                / {stat.format(stat.target)} {stat.unit}
              </p>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 mb-2">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    pct >= 100 ? 'bg-emerald-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Adjust buttons */}
              <div className="flex items-center justify-center gap-1">
                <button
                  className="h-6 w-6 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95"
                  onClick={() => handleQuickAdjust(stat.field, -stat.step)}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <button
                  className="h-6 w-6 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95"
                  onClick={() => handleQuickAdjust(stat.field, stat.step)}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
