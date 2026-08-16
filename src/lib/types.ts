export interface WeightEntry {
  date: string; // YYYY-MM-DD
  weight: number;
}

export interface BodyMeasurements {
  date: string;
  waist: number; // cm
  chest: number;
  arms: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: 'morning' | 'day' | 'evening';
}

export interface MealEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  portion: string;
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  time: string;
}

export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weight: number; // kg
  done: boolean;
}

export interface ExerciseEntry {
  id: string;
  name: string;
  sets: ExerciseSet[];
  notes: string;
}

export interface WorkoutSession {
  date: string;
  dayType: string;
  exercises: ExerciseEntry[];
  completed: boolean;
  duration: number; // minutes
}

export interface SkinCareItem {
  id: string;
  label: string;
  checked: boolean;
  period: 'am' | 'pm';
}

export interface DailyData {
  date: string;
  checklist: ChecklistItem[];
  meals: MealEntry[];
  workout: WorkoutSession | null;
  skinCare: SkinCareItem[];
  water: number; // ml
  steps: number;
  sleep: number; // hours
  weight: number | null;
  notes: string;
}

export interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  time: string; // HH:MM
}

export interface AppSettings {
  notifications: NotificationSetting[];
  targets: {
    calories: number;
    protein: number;
    water: number; // ml
    steps: number;
    sleep: number;
  };
  startingWeight: number;
  currentWeight: number;
  weddingDate: string;
  programStart: string;
  programEnd: string;
}

export interface StreakData {
  current: number;
  best: number;
  lastDate: string;
}

export interface ProgressPhoto {
  date: string;
  dataUrl: string;
  type: 'front' | 'side' | 'back';
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number; // per portion
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  portion: string;
  category: 'breakfast' | 'lunch' | 'snack' | 'dinner';
}

export interface WorkoutPlan {
  week: number;
  day: number;
  dayType: string;
  title: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    rest: string;
    notes?: string;
  }[];
}

export interface WeeklySummary {
  weekNumber: number;
  startDate: string;
  endDate: string;
  avgWeight: number;
  totalWorkouts: number;
  avgCalories: number;
  avgProtein: number;
  avgSleep: number;
  avgSteps: number;
  completionRate: number;
}
