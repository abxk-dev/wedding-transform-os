'use client';
import WeightChart from '@/components/progress/WeightChart';
import MeasurementChart from '@/components/progress/MeasurementChart';
import ProgressPhotos from '@/components/progress/ProgressPhotos';
import MilestoneBadges from '@/components/progress/MilestoneBadges';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Download, FileText } from 'lucide-react';
import { exportAllData, getDailyData } from '@/lib/storage';
import { generateProgramDates, getWeekNumber, getWeekDates, formatDate, getToday } from '@/lib/dates';

export default function ProgressPage() {
  const handleExportJSON = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transform-os-${getToday()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportWeekly = () => {
    const weekNum = getWeekNumber(getToday());
    const { start, end } = getWeekDates(weekNum);
    const dates = generateProgramDates().filter(d => d >= start && d <= end);

    let summary = `Week ${weekNum}: ${formatDate(start)} - ${formatDate(end)}\n${'='.repeat(40)}\n\n`;
    dates.forEach(date => {
      const d = getDailyData(date);
      const cals = d.meals.reduce((s, m) => s + m.calories, 0);
      const protein = d.meals.reduce((s, m) => s + m.protein, 0);
      summary += `${formatDate(date)}\n  Water: ${d.water}ml | Steps: ${d.steps} | Sleep: ${d.sleep.toFixed(1)}h\n  Cal: ${cals} | Protein: ${protein}g | Workout: ${d.workout?.completed ? 'Done' : 'No'}\n\n`;
    });

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `week-${weekNum}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
          Progress
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Weight, measurements, photos, milestones.</p>
      </div>

      <MilestoneBadges />
      <WeightChart />
      <MeasurementChart />
      <ProgressPhotos />

      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardContent className="p-3 sm:p-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportJSON} className="text-xs h-8">
              <Download className="h-3 w-3 mr-1" /> JSON
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportWeekly} className="text-xs h-8">
              <FileText className="h-3 w-3 mr-1" /> Weekly
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
