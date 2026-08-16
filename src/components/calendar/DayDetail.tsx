'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Dumbbell, Utensils, Sparkles, Moon, Footprints, Droplets } from 'lucide-react';
import { getDailyData, updateChecklistItem, updateSkinCareItem, getDayCompletion } from '@/lib/storage';
import { formatDate, programDay } from '@/lib/dates';
import { PROGRAM_START } from '@/lib/constants';
import { sumDailyNutrition } from '@/lib/calculations';
import { DailyData } from '@/lib/types';

interface DayDetailProps {
  date: string;
}

export default function DayDetail({ date }: DayDetailProps) {
  const [data, setData] = useState<DailyData | null>(null);
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const d = getDailyData(date);
    setData(d);
    setCompletion(getDayCompletion(d));
  }, [date]);

  const handleChecklistToggle = (itemId: string, checked: boolean) => {
    const updated = updateChecklistItem(date, itemId, checked);
    setData(updated);
    setCompletion(getDayCompletion(updated));
  };

  const handleSkinToggle = (itemId: string, checked: boolean) => {
    const updated = updateSkinCareItem(date, itemId, checked);
    setData(updated);
    setCompletion(getDayCompletion(updated));
  };

  if (!data) return null;

  const nutrition = sumDailyNutrition(data.meals);
  const dayNum = programDay(PROGRAM_START, date);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-500" />
            Day {dayNum} — {formatDate(date)}
          </h2>
        </div>
        <Badge className={completion >= 80 ? 'bg-emerald-500' : completion >= 50 ? 'bg-yellow-500' : 'bg-gray-400'}>
          {completion}% Complete
        </Badge>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/30 rounded-xl">
          <Droplets className="h-4 w-4 text-blue-500 mx-auto mb-1" />
          <p className="text-sm font-bold text-gray-900 dark:text-white">{data.water}ml</p>
          <p className="text-[10px] text-gray-500">Water</p>
        </div>
        <div className="text-center p-2 bg-orange-50 dark:bg-orange-950/30 rounded-xl">
          <Footprints className="h-4 w-4 text-orange-500 mx-auto mb-1" />
          <p className="text-sm font-bold text-gray-900 dark:text-white">{data.steps.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Steps</p>
        </div>
        <div className="text-center p-2 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
          <Moon className="h-4 w-4 text-purple-500 mx-auto mb-1" />
          <p className="text-sm font-bold text-gray-900 dark:text-white">{data.sleep.toFixed(1)}h</p>
          <p className="text-[10px] text-gray-500">Sleep</p>
        </div>
        <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
          <Utensils className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
          <p className="text-sm font-bold text-gray-900 dark:text-white">{nutrition.calories}</p>
          <p className="text-[10px] text-gray-500">Calories</p>
        </div>
      </div>

      {/* Workout */}
      {data.workout && (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Dumbbell className="h-4 w-4 text-emerald-500" />
              Workout — {data.workout.dayType}
              {data.workout.completed && <Badge className="bg-emerald-500 text-[10px]">Done</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-gray-500">Duration: {data.workout.duration} min</p>
          </CardContent>
        </Card>
      )}

      {/* Meals */}
      {data.meals.length > 0 && (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Utensils className="h-4 w-4 text-emerald-500" />
              Meals ({data.meals.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {data.meals.map(meal => (
              <div key={meal.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{meal.name}</p>
                  <p className="text-[10px] text-gray-500">{meal.mealType} · {meal.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{meal.calories} kcal</p>
                  <p className="text-[10px] text-gray-500">{meal.protein}g protein</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Checklist */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Checklist</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-1">
          {data.checklist.map(item => (
            <label key={item.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <Checkbox
                checked={item.checked}
                onCheckedChange={checked => handleChecklistToggle(item.id, checked as boolean)}
                className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />
              <span className={`text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {item.label}
              </span>
            </label>
          ))}
        </CardContent>
      </Card>

      {/* Skincare */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            Skincare
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-1">
          {data.skinCare.map(item => (
            <label key={item.id} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <Checkbox
                checked={item.checked}
                onCheckedChange={checked => handleSkinToggle(item.id, checked as boolean)}
                className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />
              <span className={`text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                {item.label}
              </span>
            </label>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
