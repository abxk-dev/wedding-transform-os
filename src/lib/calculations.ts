import { MealEntry, DailyData } from './types';
import { AGE, HEIGHT_CM, SEX } from './constants';

// Mifflin-St Jeor equation for BMR
export function calculateBMR(weight: number, age: number = AGE, height: number = HEIGHT_CM, sex: string = SEX): number {
  if (sex === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

// TDEE with activity multiplier
// Sedentary=1.2, Light=1.375, Moderate=1.55, Active=1.725
export function calculateTDEE(weight: number, activityLevel: number = 1.55): number {
  return Math.round(calculateBMR(weight) * activityLevel);
}

// Calorie target for gradual deficit (500-750 kcal deficit for ~0.5-0.75 kg/week loss)
export function calculateCalorieTarget(weight: number, deficit: number = 600): number {
  const tdee = calculateTDEE(weight);
  return Math.max(1500, Math.round(tdee - deficit));
}

// Macro split: 30% protein, 40% carbs, 30% fats
export function calculateMacros(calories: number, proteinTarget: number) {
  const proteinCals = proteinTarget * 4;
  const fatsCals = Math.round(calories * 0.3);
  const carbsCals = calories - proteinCals - fatsCals;

  return {
    protein: proteinTarget,
    carbs: Math.round(carbsCals / 4),
    fats: Math.round(fatsCals / 9),
  };
}

// Sum daily nutrition from meals
export function sumDailyNutrition(meals: MealEntry[]) {
  return meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fats: acc.fats + meal.fats,
      fiber: acc.fiber + meal.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 }
  );
}

// Calculate daily completion percentage
export function calculateCompletion(data: DailyData): number {
  const checklistDone = data.checklist.filter(i => i.checked).length;
  const skinDone = data.skinCare.filter(i => i.checked).length;
  const total = data.checklist.length + data.skinCare.length;
  if (total === 0) return 0;
  return Math.round(((checklistDone + skinDone) / total) * 100);
}

// Weight change from start
export function weightChange(current: number, starting: number): number {
  return Math.round((current - starting) * 10) / 10;
}

// BMI
export function calculateBMI(weight: number, heightCm: number = HEIGHT_CM): number {
  const heightM = heightCm / 100;
  return Math.round((weight / (heightM * heightM)) * 10) / 10;
}

// Days remaining in program
export function daysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// Days until wedding
export function daysUntilWedding(weddingDate: string): number {
  const wedding = new Date(weddingDate);
  const now = new Date();
  const diff = wedding.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

// Program day number (1-55)
export function programDay(startDate: string, currentDate: string): number {
  const start = new Date(startDate);
  const current = new Date(currentDate);
  const diff = current.getTime() - start.getTime();
  return Math.max(1, Math.min(55, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1));
}
