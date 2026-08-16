'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Ruler, Plus } from 'lucide-react';
import { getMeasurements, logMeasurements } from '@/lib/storage';
import { getToday, formatDateShort } from '@/lib/dates';
import { BodyMeasurements } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function MeasurementChart() {
  const [data, setData] = useState<BodyMeasurements[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newWaist, setNewWaist] = useState('');
  const [newChest, setNewChest] = useState('');
  const [newArms, setNewArms] = useState('');

  useEffect(() => { setData(getMeasurements()); }, []);

  const handleSave = () => {
    const waist = parseFloat(newWaist);
    const chest = parseFloat(newChest);
    const arms = parseFloat(newArms);
    if (waist > 0 && chest > 0 && arms > 0) {
      logMeasurements(getToday(), { waist, chest, arms });
      setData(getMeasurements());
      setDialogOpen(false);
      setNewWaist(''); setNewChest(''); setNewArms('');
    }
  };

  const chartData = data.map(d => ({
    date: formatDateShort(d.date),
    Waist: d.waist, Chest: d.chest, Arms: d.arms,
  }));

  const latest = data[data.length - 1];
  const first = data[0];

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-1.5 px-3 sm:px-6 pt-3 sm:pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
            <Ruler className="h-4 w-4 text-emerald-500" />
            Body Measurements
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
              <button className="h-7 px-2 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Plus className="h-3 w-3" /> Add
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Log Measurements (cm)</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><label className="text-xs text-gray-500">Waist</label><Input type="number" placeholder="cm" value={newWaist} onChange={e => setNewWaist(e.target.value)} /></div>
                <div><label className="text-xs text-gray-500">Chest</label><Input type="number" placeholder="cm" value={newChest} onChange={e => setNewChest(e.target.value)} /></div>
                <div><label className="text-xs text-gray-500">Arms</label><Input type="number" placeholder="cm" value={newArms} onChange={e => setNewArms(e.target.value)} /></div>
                <Button onClick={handleSave} className="w-full bg-emerald-500 hover:bg-emerald-600">Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-2 sm:px-6 pb-3">
        {latest && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: 'Waist', value: latest.waist, diff: first ? latest.waist - first.waist : 0, good: 'lower' },
              { label: 'Chest', value: latest.chest, diff: first ? latest.chest - first.chest : 0, good: 'higher' },
              { label: 'Arms', value: latest.arms, diff: first ? latest.arms - first.arms : 0, good: 'higher' },
            ].map(m => (
              <div key={m.label} className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-[10px] text-gray-500">{m.label}</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{m.value}</p>
                {m.diff !== 0 && (
                  <p className={`text-[10px] ${(m.good === 'lower' ? m.diff < 0 : m.diff > 0) ? 'text-emerald-500' : 'text-red-500'}`}>
                    {m.diff > 0 ? '+' : ''}{m.diff.toFixed(1)} cm
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        {chartData.length > 1 ? (
          <div className="h-44 sm:h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.85)', border: 'none', borderRadius: '8px', fontSize: '11px', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="Waist" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Chest" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Arms" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">Add measurements to see chart</p>
        )}
      </CardContent>
    </Card>
  );
}
