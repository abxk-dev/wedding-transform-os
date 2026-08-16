'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UtensilsCrossed, Plus, Trash2, Search } from 'lucide-react';
import { FOOD_DATABASE } from '@/lib/constants';
import { getDailyData, addMeal, removeMeal, getSettings } from '@/lib/storage';
import { sumDailyNutrition } from '@/lib/calculations';
import { getToday } from '@/lib/dates';
import { FoodItem, MealEntry, DailyData } from '@/lib/types';
import ProgressRing from '@/components/shared/ProgressRing';

export default function MealLogger() {
  const [data, setData] = useState<DailyData | null>(null);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealEntry['mealType']>('breakfast');
  const [targets, setTargets] = useState({ calories: 1900, protein: 130 });

  useEffect(() => {
    const d = getDailyData(getToday());
    setData(d);
    const s = getSettings();
    setTargets({ calories: s.targets.calories, protein: s.targets.protein });
  }, []);

  const filteredFoods = FOOD_DATABASE.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddFood = (food: FoodItem) => {
    const meal: MealEntry = {
      id: `meal-${Date.now()}`,
      name: food.name,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
      fiber: food.fiber,
      portion: food.portion,
      mealType: selectedMealType,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = addMeal(getToday(), meal);
    setData(updated);
    setDialogOpen(false);
    setSearch('');
  };

  const handleRemoveMeal = (mealId: string) => {
    const updated = removeMeal(getToday(), mealId);
    setData(updated);
  };

  if (!data) return null;

  const nutrition = sumDailyNutrition(data.meals);
  const caloriePct = targets.calories > 0 ? Math.min(100, Math.round((nutrition.calories / targets.calories) * 100)) : 0;
  const proteinPct = targets.protein > 0 ? Math.min(100, Math.round((nutrition.protein / targets.protein) * 100)) : 0;

  const mealTypes: { key: MealEntry['mealType']; label: string }[] = [
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'snack', label: 'Snacks' },
    { key: 'dinner', label: 'Dinner' },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Macro Summary */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-around gap-2">
            <div className="flex flex-col items-center">
              <ProgressRing value={caloriePct} size={60} strokeWidth={5}>
                <span className="text-[10px] font-bold text-gray-900 dark:text-white">{caloriePct}%</span>
              </ProgressRing>
              <p className="text-[10px] text-gray-500 mt-1">Calories</p>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{nutrition.calories}/{targets.calories}</p>
            </div>
            <div className="flex flex-col items-center">
              <ProgressRing value={proteinPct} size={60} strokeWidth={5} color="#3b82f6">
                <span className="text-[10px] font-bold text-gray-900 dark:text-white">{proteinPct}%</span>
              </ProgressRing>
              <p className="text-[10px] text-gray-500 mt-1">Protein</p>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{nutrition.protein}g/{targets.protein}g</p>
            </div>
            <div className="flex flex-col gap-1 text-center">
              <div>
                <p className="text-[10px] text-gray-500">Carbs</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white">{nutrition.carbs}g</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Fats</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white">{nutrition.fats}g</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Fiber</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white">{nutrition.fiber}g</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Sections */}
      {mealTypes.map(({ key, label }) => {
        const meals = data.meals.filter(m => m.mealType === key);
        const totalCals = meals.reduce((sum, m) => sum + m.calories, 0);
        const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);

        return (
          <Card key={key} className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-1.5 px-3 sm:px-6 pt-3 sm:pt-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs sm:text-sm flex items-center gap-1.5">
                  <UtensilsCrossed className="h-3.5 w-3.5 text-emerald-500" />
                  {label}
                </CardTitle>
                <div className="flex items-center gap-1.5">
                  {totalCals > 0 && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{totalCals}kcal</Badge>}
                  {totalProtein > 0 && <Badge variant="outline" className="text-[10px] px-1.5 py-0">{totalProtein}g</Badge>}
                  <Dialog open={dialogOpen && selectedMealType === key} onOpenChange={(open) => {
                    setDialogOpen(open);
                    if (open) setSelectedMealType(key);
                  }}>
                    <DialogTrigger>
                      <button className="h-7 w-7 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add {label}</DialogTitle>
                      </DialogHeader>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search foods..."
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <div className="space-y-1.5 mt-2">
                        {filteredFoods
                          .filter(f => f.category === key || search.length > 0)
                          .map(food => (
                            <button
                              key={food.id}
                              onClick={() => handleAddFood(food)}
                              className="w-full text-left p-2.5 sm:p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-800"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{food.name}</p>
                                  <p className="text-[10px] text-gray-500 truncate">{food.portion}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{food.calories}</p>
                                  <p className="text-[10px] text-emerald-600">{food.protein}g</p>
                                </div>
                              </div>
                            </button>
                          ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 px-3 sm:px-6 pb-3">
              {meals.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-gray-500 py-1.5">No meals logged</p>
              ) : (
                <div className="space-y-1.5">
                  {meals.map(meal => (
                    <div key={meal.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">{meal.name}</p>
                        <p className="text-[10px] text-gray-500">{meal.portion} · {meal.time}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-xs font-semibold text-gray-900 dark:text-white">{meal.calories}</p>
                          <p className="text-[10px] text-emerald-600">{meal.protein}g</p>
                        </div>
                        <button
                          className="h-6 w-6 flex items-center justify-center rounded text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                          onClick={() => handleRemoveMeal(meal.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
