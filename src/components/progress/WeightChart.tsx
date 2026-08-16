'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale } from 'lucide-react';
import { getWeightLog } from '@/lib/storage';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { STARTING_WEIGHT } from '@/lib/constants';

export default function WeightChart() {
  const [data, setData] = useState<{ date: string; weight: number }[]>([]);

  useEffect(() => {
    const log = getWeightLog();
    setData(log.map(entry => ({
      date: new Date(entry.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      weight: entry.weight,
    })));
  }, []);

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-1.5 px-3 sm:px-6 pt-3 sm:pt-4">
        <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
          <Scale className="h-4 w-4 text-emerald-500" />
          Weight Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-2 sm:px-6 pb-3">
        {data.length > 1 ? (
          <div className="h-44 sm:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.85)', border: 'none', borderRadius: '8px', fontSize: '11px', color: '#fff' }} />
                <ReferenceLine y={STARTING_WEIGHT} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Start', fontSize: 10, fill: '#ef4444' }} />
                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-6">Log weight to see chart</p>
        )}
      </CardContent>
    </Card>
  );
}
