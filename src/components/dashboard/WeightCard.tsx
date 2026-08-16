'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Scale, TrendingDown, Edit3, Check } from 'lucide-react';
import { getWeightLog, logWeight, getSettings } from '@/lib/storage';
import { weightChange } from '@/lib/calculations';
import { getToday } from '@/lib/dates';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export default function WeightCard() {
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [startingWeight, setStartingWeight] = useState(89);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const [chartData, setChartData] = useState<{ date: string; weight: number }[]>([]);

  useEffect(() => {
    const settings = getSettings();
    setStartingWeight(settings.startingWeight);
    const log = getWeightLog();
    if (log.length > 0) {
      setCurrentWeight(log[log.length - 1].weight);
      setChartData(log.slice(-14).map(e => ({
        date: new Date(e.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        weight: e.weight,
      })));
    } else {
      setCurrentWeight(settings.currentWeight);
    }
  }, []);

  const change = weightChange(currentWeight, startingWeight);

  const handleSave = () => {
    const val = parseFloat(editValue);
    if (val > 40 && val < 200) {
      logWeight(getToday(), val);
      setCurrentWeight(val);
      const log = getWeightLog();
      setChartData(log.slice(-14).map(e => ({
        date: new Date(e.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        weight: e.weight,
      })));
    }
    setIsEditing(false);
  };

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Scale className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Weight</span>
          </div>
          <button
            className="h-6 w-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            onClick={() => {
              if (isEditing) handleSave();
              else { setEditValue(currentWeight.toString()); setIsEditing(true); }
            }}
          >
            {isEditing ? <Check className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
          </button>
        </div>

        <div className="flex items-baseline gap-1.5 mb-1">
          {isEditing ? (
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                className="w-20 h-8 text-xl sm:text-2xl font-bold"
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                onBlur={handleSave}
              />
              <span className="text-xs text-gray-500">kg</span>
            </div>
          ) : (
            <>
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{currentWeight.toFixed(1)}</span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">kg</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 mb-2">
          <TrendingDown className={`h-3 w-3 ${change < 0 ? 'text-emerald-500' : 'text-red-500'}`} />
          <span className={`text-xs font-medium ${change < 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {change > 0 ? '+' : ''}{change} kg ({startingWeight} start)
          </span>
        </div>

        {chartData.length > 1 && (
          <div className="h-14 sm:h-16 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" hide />
                <Tooltip
                  contentStyle={{ background: 'rgba(0,0,0,0.85)', border: 'none', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                  labelStyle={{ display: 'none' }}
                />
                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
