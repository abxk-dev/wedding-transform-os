'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sparkles, Sun, Moon, AlertTriangle, Info } from 'lucide-react';
import { getDailyData, updateSkinCareItem } from '@/lib/storage';
import { getToday } from '@/lib/dates';
import { SAFETY_COPY } from '@/lib/constants';
import { DailyData } from '@/lib/types';

export default function SkinRoutine() {
  const [data, setData] = useState<DailyData | null>(null);

  useEffect(() => {
    setData(getDailyData(getToday()));
  }, []);

  const handleToggle = (itemId: string, checked: boolean) => {
    const updated = updateSkinCareItem(getToday(), itemId, checked);
    setData(updated);
  };

  if (!data) return null;

  const amItems = data.skinCare.filter(s => s.period === 'am');
  const pmItems = data.skinCare.filter(s => s.period === 'pm');
  const amDone = amItems.filter(s => s.checked).length;
  const pmDone = pmItems.filter(s => s.checked).length;

  const renderRoutine = (title: string, icon: typeof Sun, iconColor: string, items: typeof amItems, done: number, gradient: string, border: string) => (
    <Card className={`bg-gradient-to-br ${gradient} ${border}`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            {(() => { const Icon = icon; return <Icon className={`h-4 w-4 ${iconColor}`} />; })()}
            {title}
          </h3>
          <Badge variant="outline" className="text-xs">{done}/{items.length}</Badge>
        </div>
        <div className="space-y-1">
          {items.map(item => (
            <label
              key={item.id}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-colors active:bg-gray-100 dark:active:bg-gray-800 ${
                item.checked ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-white/60 dark:bg-gray-800/40'
              }`}
            >
              <Checkbox
                checked={item.checked}
                onCheckedChange={checked => handleToggle(item.id, checked as boolean)}
                className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />
              <span className={`text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      {renderRoutine('Morning Routine', Sun, 'text-yellow-500', amItems, amDone,
        'from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20',
        'border-yellow-200 dark:border-yellow-900')}
      {renderRoutine('Evening Routine', Moon, 'text-indigo-500', pmItems, pmDone,
        'from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20',
        'border-indigo-200 dark:border-indigo-900')}

      {/* Pigmentation Tips */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardContent className="p-3 sm:p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            Pigmentation Care
          </h3>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Inner Thighs</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
              <li>Keep dry, loose/breathable underwear</li>
              <li>Reduce friction, moisturize regularly</li>
              <li>Lactic acid or urea lotion (patch test first)</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Underarms</h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
              <li>Gentle cleansing, no harsh scrubbing</li>
              <li>Avoid irritating deodorants</li>
              <li>Moisturize, optional lactic-acid product</li>
            </ul>
          </div>

          <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 py-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <AlertDescription className="text-[11px] text-amber-800 dark:text-amber-200">
              {SAFETY_COPY.skinPigmentation}
            </AlertDescription>
          </Alert>

          <Alert className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 py-2">
            <Info className="h-3.5 w-3.5 text-red-600" />
            <AlertDescription className="text-[11px] text-red-800 dark:text-red-200">
              {SAFETY_COPY.insulinWarning}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
