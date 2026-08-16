import { FoodItem, WorkoutPlan, NotificationSetting } from './types';

export const PROGRAM_START = '2026-08-17';
export const PROGRAM_END = '2026-10-10';
export const WEDDING_DATE = '2026-10-11';
export const TOTAL_DAYS = 55;

export const STARTING_WEIGHT = 89;
export const HEIGHT_CM = 175; // 5'9"
export const AGE = 26;
export const SEX = 'male';

export const DEFAULT_TARGETS = {
  calories: 1900,
  protein: 130,
  water: 3000, // ml
  steps: 8500,
  sleep: 8,
};

export const FOOD_DATABASE: FoodItem[] = [
  // Breakfast
  { id: 'f1', name: 'Besan Chilla (2) + Curd', calories: 320, protein: 18, carbs: 30, fats: 12, fiber: 4, portion: '2 chillas + 100g curd', category: 'breakfast' },
  { id: 'f2', name: 'Moong Dal Chilla + Paneer', calories: 350, protein: 22, carbs: 28, fats: 14, fiber: 5, portion: '2 chillas + 50g paneer', category: 'breakfast' },
  { id: 'f3', name: 'Oats + Milk + Chia Seeds', calories: 380, protein: 16, carbs: 48, fats: 12, fiber: 8, portion: '60g oats + 200ml milk + 10g chia', category: 'breakfast' },
  { id: 'f4', name: 'Vegetable Dalia', calories: 280, protein: 10, carbs: 42, fats: 6, fiber: 6, portion: '1 bowl (200g)', category: 'breakfast' },
  { id: 'f5', name: 'Paneer Bhurji + Roti', calories: 400, protein: 24, carbs: 32, fats: 18, fiber: 4, portion: '100g paneer + 2 roti', category: 'breakfast' },
  { id: 'f6', name: 'Tofu Bhurji + Toast', calories: 310, protein: 20, carbs: 28, fats: 12, fiber: 5, portion: '100g tofu + 2 toast', category: 'breakfast' },
  { id: 'f7', name: 'Peanut Butter Banana Toast', calories: 350, protein: 12, carbs: 42, fats: 14, fiber: 6, portion: '2 toast + 20g PB + 1 banana', category: 'breakfast' },
  { id: 'f8', name: 'Sprouts Salad + Curd', calories: 250, protein: 14, carbs: 28, fats: 6, fiber: 8, portion: '150g sprouts + 80g curd', category: 'breakfast' },

  // Lunch
  { id: 'f9', name: 'Dal + Roti + Sabzi + Curd', calories: 520, protein: 22, carbs: 62, fats: 16, fiber: 10, portion: '1 bowl dal + 2 roti + sabzi + 80g curd', category: 'lunch' },
  { id: 'f10', name: 'Rajma + Rice + Salad', calories: 480, protein: 18, carbs: 68, fats: 10, fiber: 12, portion: '1 bowl rajma + 1 cup rice + salad', category: 'lunch' },
  { id: 'f11', name: 'Chole + Rice + Salad', calories: 460, protein: 16, carbs: 64, fats: 10, fiber: 11, portion: '1 bowl chole + 1 cup rice + salad', category: 'lunch' },
  { id: 'f12', name: 'Paneer + Vegetables + Roti', calories: 450, protein: 24, carbs: 36, fats: 20, fiber: 6, portion: '100g paneer + veggies + 2 roti', category: 'lunch' },
  { id: 'f13', name: 'Tofu + Vegetables + Roti', calories: 380, protein: 22, carbs: 34, fats: 14, fiber: 7, portion: '120g tofu + veggies + 2 roti', category: 'lunch' },
  { id: 'f14', name: 'Soy Chunks + Roti + Salad', calories: 420, protein: 30, carbs: 40, fats: 10, fiber: 8, portion: '60g soy chunks + 2 roti + salad', category: 'lunch' },
  { id: 'f15', name: 'Khichdi + Curd + Pickle', calories: 400, protein: 14, carbs: 58, fats: 10, fiber: 6, portion: '1.5 bowl khichdi + 80g curd', category: 'lunch' },
  { id: 'f16', name: 'Paneer Tikka + Salad + Roti', calories: 440, protein: 26, carbs: 32, fats: 20, fiber: 5, portion: '100g paneer tikka + 2 roti + salad', category: 'lunch' },

  // Snacks
  { id: 'f17', name: 'Mixed Fruit (1 bowl)', calories: 120, protein: 2, carbs: 28, fats: 1, fiber: 4, portion: '200g mixed fruit', category: 'snack' },
  { id: 'f18', name: 'Roasted Chana', calories: 160, protein: 8, carbs: 20, fats: 4, fiber: 6, portion: '50g', category: 'snack' },
  { id: 'f19', name: 'Greek Yogurt', calories: 100, protein: 10, carbs: 6, fats: 4, fiber: 0, portion: '100g', category: 'snack' },
  { id: 'f20', name: 'Buttermilk', calories: 60, protein: 4, carbs: 6, fats: 2, fiber: 0, portion: '250ml', category: 'snack' },
  { id: 'f21', name: 'Pumpkin Seeds', calories: 170, protein: 9, carbs: 4, fats: 14, fiber: 2, portion: '30g', category: 'snack' },
  { id: 'f22', name: 'Mixed Nuts', calories: 180, protein: 6, carbs: 6, fats: 16, fiber: 2, portion: '30g', category: 'snack' },
  { id: 'f23', name: 'Banana + Peanut Butter', calories: 200, protein: 6, carbs: 28, fats: 8, fiber: 4, portion: '1 banana + 15g PB', category: 'snack' },
  { id: 'f24', name: 'Protein Shake (Whey)', calories: 150, protein: 25, carbs: 6, fats: 2, fiber: 0, portion: '1 scoop + 250ml water', category: 'snack' },
  { id: 'f25', name: 'Makhana (Roasted)', calories: 100, protein: 4, carbs: 14, fats: 2, fiber: 2, portion: '30g', category: 'snack' },

  // Dinner
  { id: 'f26', name: 'Dal + Vegetables + Roti', calories: 420, protein: 18, carbs: 48, fats: 14, fiber: 8, portion: '1 bowl dal + veggies + 2 roti', category: 'dinner' },
  { id: 'f27', name: 'Tofu + Vegetables (Stir-fry)', calories: 300, protein: 20, carbs: 18, fats: 14, fiber: 6, portion: '120g tofu + mixed veggies', category: 'dinner' },
  { id: 'f28', name: 'Soy Chunks + Salad', calories: 280, protein: 26, carbs: 16, fats: 8, fiber: 6, portion: '50g soy chunks + large salad', category: 'dinner' },
  { id: 'f29', name: 'Moong Dal + Vegetables', calories: 320, protein: 16, carbs: 38, fats: 8, fiber: 10, portion: '1 bowl moong dal + veggies', category: 'dinner' },
  { id: 'f30', name: 'Paneer Bhurji + Salad', calories: 350, protein: 22, carbs: 12, fats: 22, fiber: 4, portion: '100g paneer + salad', category: 'dinner' },
  { id: 'f31', name: 'Vegetable Soup + Toast', calories: 200, protein: 6, carbs: 28, fats: 6, fiber: 4, portion: '1 bowl soup + 2 toast', category: 'dinner' },
  { id: 'f32', name: 'Palak Paneer + Roti', calories: 420, protein: 22, carbs: 34, fats: 20, fiber: 6, portion: '1 bowl palak paneer + 2 roti', category: 'dinner' },
];

export const CHECKLIST_ITEMS = [
  // Morning
  { id: 'c1', label: 'Wake up', category: 'morning' as const },
  { id: 'c2', label: '500-700 ml water', category: 'morning' as const },
  { id: 'c3', label: '30-45 min brisk walk', category: 'morning' as const },
  { id: 'c4', label: 'Protein-rich breakfast', category: 'morning' as const },
  { id: 'c5', label: 'Skin-care AM', category: 'morning' as const },
  { id: 'c6', label: 'Sunscreen applied', category: 'morning' as const },
  // Day
  { id: 'c7', label: 'Protein target hit', category: 'day' as const },
  { id: 'c8', label: 'Vegetables consumed', category: 'day' as const },
  { id: 'c9', label: '1-2 fruit servings', category: 'day' as const },
  { id: 'c10', label: '2-3 L water', category: 'day' as const },
  { id: 'c11', label: '7,000-10,000 steps', category: 'day' as const },
  { id: 'c12', label: 'No fast food', category: 'day' as const },
  { id: 'c13', label: 'No sugary drinks', category: 'day' as const },
  // Evening
  { id: 'c14', label: 'Workout / active recovery', category: 'evening' as const },
  { id: 'c15', label: 'Skin-care PM', category: 'evening' as const },
  { id: 'c16', label: '7-9 hours sleep', category: 'evening' as const },
  { id: 'c17', label: 'Screen-free wind-down', category: 'evening' as const },
];

export const SKIN_CARE_ITEMS = {
  am: [
    { id: 's1', label: 'Gentle cleanser', period: 'am' as const },
    { id: 's2', label: 'Moisturizer', period: 'am' as const },
    { id: 's3', label: 'SPF 30-50 sunscreen', period: 'am' as const },
  ],
  pm: [
    { id: 's4', label: 'Gentle cleanser', period: 'pm' as const },
    { id: 's5', label: 'Moisturizer', period: 'pm' as const },
  ],
};

export const DEFAULT_NOTIFICATIONS: NotificationSetting[] = [
  { id: 'n1', label: 'Morning Water', description: 'Drink 500-700 ml water after waking', enabled: true, time: '07:00' },
  { id: 'n2', label: 'Workout Reminder', description: 'Time for your daily workout', enabled: true, time: '17:30' },
  { id: 'n3', label: 'AM Skincare', description: 'Apply cleanser, moisturizer, sunscreen', enabled: true, time: '07:30' },
  { id: 'n4', label: 'Midday Nudge', description: 'Check water intake and steps', enabled: true, time: '13:00' },
  { id: 'n5', label: 'PM Skincare', description: 'Evening cleanser and moisturizer', enabled: true, time: '21:00' },
  { id: 'n6', label: 'Sleep Wind-down', description: 'Screen off, prepare for sleep', enabled: true, time: '22:00' },
];

export const WORKOUT_PLAN: WorkoutPlan[] = [
  // Week 1-2: Foundation
  {
    week: 1, day: 1, dayType: 'upper', title: 'Upper Body A — Foundation',
    exercises: [
      { name: 'Dumbbell Bench Press', sets: 3, reps: '10-12', rest: '90s' },
      { name: 'Bent-Over Dumbbell Row', sets: 3, reps: '10-12', rest: '90s' },
      { name: 'Overhead Dumbbell Press', sets: 3, reps: '10-12', rest: '60s' },
      { name: 'Lat Pulldown', sets: 3, reps: '10-12', rest: '60s' },
      { name: 'Dumbbell Bicep Curl', sets: 2, reps: '12-15', rest: '45s' },
      { name: 'Tricep Rope Pushdown', sets: 2, reps: '12-15', rest: '45s' },
    ],
  },
  {
    week: 1, day: 2, dayType: 'lower', title: 'Lower Body A — Foundation',
    exercises: [
      { name: 'Barbell Back Squat', sets: 3, reps: '8-10', rest: '120s' },
      { name: 'Romanian Deadlift', sets: 3, reps: '10-12', rest: '90s' },
      { name: 'Leg Press', sets: 3, reps: '10-12', rest: '90s' },
      { name: 'Leg Curl', sets: 3, reps: '12-15', rest: '60s' },
      { name: 'Calf Raises', sets: 3, reps: '15-20', rest: '45s' },
    ],
  },
  {
    week: 1, day: 3, dayType: 'cardio', title: 'Active Recovery',
    exercises: [
      { name: 'Brisk Walk', sets: 1, reps: '30-45 min', rest: '-' },
    ],
  },
  {
    week: 1, day: 4, dayType: 'upper', title: 'Upper Body B — Foundation',
    exercises: [
      { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '90s' },
      { name: 'Seated Cable Row', sets: 3, reps: '10-12', rest: '90s' },
      { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '60s' },
      { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '45s' },
      { name: 'Hammer Curls', sets: 2, reps: '12-15', rest: '45s' },
      { name: 'Overhead Tricep Extension', sets: 2, reps: '12-15', rest: '45s' },
    ],
  },
  {
    week: 1, day: 5, dayType: 'lower', title: 'Lower Body B — Foundation',
    exercises: [
      { name: 'Goblet Squat', sets: 3, reps: '10-12', rest: '90s' },
      { name: 'Dumbbell Lunges', sets: 3, reps: '10 each', rest: '90s' },
      { name: 'Leg Extension', sets: 3, reps: '12-15', rest: '60s' },
      { name: 'Hip Thrust', sets: 3, reps: '10-12', rest: '60s' },
      { name: 'Standing Calf Raises', sets: 3, reps: '15-20', rest: '45s' },
    ],
  },
  {
    week: 1, day: 6, dayType: 'cardio', title: 'Cardio + Core',
    exercises: [
      { name: 'Treadmill Walk/Incline', sets: 1, reps: '30 min', rest: '-' },
      { name: 'Plank', sets: 3, reps: '30-45s', rest: '30s' },
      { name: 'Bicycle Crunches', sets: 3, reps: '15 each', rest: '30s' },
      { name: 'Dead Bug', sets: 3, reps: '10 each', rest: '30s' },
    ],
  },
  {
    week: 1, day: 7, dayType: 'rest', title: 'Full Rest',
    exercises: [
      { name: 'Light Walk (optional)', sets: 1, reps: '20-30 min', rest: '-' },
    ],
  },
];

// Week 3-4: Progressive overload (same structure, higher volume)
export const PROGRESSION_NOTES = `
**Weeks 1–2:** Foundation. Learn form, build habit. RPE 6-7.
**Weeks 3–4:** Add 1 set to compound lifts. Increase weight 2.5-5 kg where possible. RPE 7-8.
**Weeks 5–6:** Push progressive overload. Add reps or weight each week. RPE 8-9.
**Weeks 7–8:** Maintain intensity. Focus on consistency and recovery. RPE 8.
**Final 6 days:** Deload slightly. Prioritize sleep, hydration, digestion. No new PRs.
`;

export const SAFETY_COPY = {
  skinPigmentation: 'Patch test first. Stop if burning, rash, or significant irritation occurs.',
  insulinWarning: 'Sudden thick/velvety darkening of neck, armpits, or groin can sometimes indicate insulin resistance and should be medically assessed.',
  reproductiveHealth: 'Masturbation does not permanently reduce sperm production. Short-term changes in semen volume/count can occur depending on ejaculation frequency.',
  supplements: 'Creatine monohydrate (3-5 g/day) supports training performance. It does not directly burn fat or increase sperm count.',
  vitaminWarning: 'Do NOT take Vitamin D, B12, or iron supplements without blood testing and medical guidance.',
  whenToSeeDoctor: 'See a doctor for: persistent/severe skin changes, unexplained symptoms, or fertility concerns lasting >12 months.',
  noPromises: 'Results vary. This app supports healthy habits — it does not guarantee specific weight, skin, or fertility outcomes.',
};

export const MILESTONE_BADGES = [
  { id: 'm1', label: '7-Day Streak', description: '7 consecutive days of tracking', days: 7, icon: 'flame' },
  { id: 'm2', label: '14-Day Streak', description: 'Two weeks of consistency', days: 14, icon: 'zap' },
  { id: 'm3', label: '30-Day Streak', description: 'One month of dedication', days: 30, icon: 'trophy' },
  { id: 'm4', label: '40-Day Streak', description: '40 days of transformation', days: 40, icon: 'crown' },
  { id: 'm5', label: '55-Day Complete', description: 'Program completed!', days: 55, icon: 'award' },
];
