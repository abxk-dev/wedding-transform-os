import { DailyData, WeightEntry, BodyMeasurements, AppSettings, StreakData, ProgressPhoto, ChecklistItem, SkinCareItem } from './types';
import { CHECKLIST_ITEMS, SKIN_CARE_ITEMS, DEFAULT_TARGETS, DEFAULT_NOTIFICATIONS, STARTING_WEIGHT, PROGRAM_START, PROGRAM_END, WEDDING_DATE } from './constants';

const KEYS = {
  DAILY: 'transform_daily_',
  WEIGHT: 'transform_weight_log',
  MEASUREMENTS: 'transform_measurements',
  PHOTOS: 'transform_photos',
  SETTINGS: 'transform_settings',
  STREAK: 'transform_streak',
  INITIALIZED: 'transform_initialized_v2',
};

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage write failed:', e);
  }
}

// Daily data
export function getDailyData(date: string): DailyData {
  const existing = getItem<DailyData | null>(KEYS.DAILY + date, null);
  if (existing) return existing;

  return {
    date,
    checklist: CHECKLIST_ITEMS.map(item => ({ ...item, checked: false })),
    meals: [],
    workout: null,
    skinCare: [
      ...SKIN_CARE_ITEMS.am.map(i => ({ ...i, checked: false })),
      ...SKIN_CARE_ITEMS.pm.map(i => ({ ...i, checked: false })),
    ],
    water: 0,
    steps: 0,
    sleep: 0,
    weight: null,
    notes: '',
  };
}

export function saveDailyData(date: string, data: DailyData): void {
  setItem(KEYS.DAILY + date, data);
}

export function updateChecklistItem(date: string, itemId: string, checked: boolean): DailyData {
  const data = getDailyData(date);
  data.checklist = data.checklist.map(item =>
    item.id === itemId ? { ...item, checked } : item
  );
  saveDailyData(date, data);
  return data;
}

export function updateSkinCareItem(date: string, itemId: string, checked: boolean): DailyData {
  const data = getDailyData(date);
  data.skinCare = data.skinCare.map(item =>
    item.id === itemId ? { ...item, checked } : item
  );
  saveDailyData(date, data);
  return data;
}

export function updateDailyField(date: string, field: keyof DailyData, value: number | string): DailyData {
  const data = getDailyData(date);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (data as any)[field] = value;
  saveDailyData(date, data);
  return data;
}

export function addMeal(date: string, meal: DailyData['meals'][0]): DailyData {
  const data = getDailyData(date);
  data.meals.push(meal);
  saveDailyData(date, data);
  return data;
}

export function removeMeal(date: string, mealId: string): DailyData {
  const data = getDailyData(date);
  data.meals = data.meals.filter(m => m.id !== mealId);
  saveDailyData(date, data);
  return data;
}

export function saveWorkout(date: string, workout: DailyData['workout']): DailyData {
  const data = getDailyData(date);
  data.workout = workout;
  saveDailyData(date, data);
  return data;
}

// Weight log
export function getWeightLog(): WeightEntry[] {
  return getItem<WeightEntry[]>(KEYS.WEIGHT, []);
}

export function logWeight(date: string, weight: number): WeightEntry[] {
  const log = getWeightLog();
  const existing = log.findIndex(e => e.date === date);
  if (existing >= 0) {
    log[existing].weight = weight;
  } else {
    log.push({ date, weight });
  }
  log.sort((a, b) => a.date.localeCompare(b.date));
  setItem(KEYS.WEIGHT, log);
  return log;
}

// Body measurements
export function getMeasurements(): BodyMeasurements[] {
  return getItem<BodyMeasurements[]>(KEYS.MEASUREMENTS, []);
}

export function logMeasurements(date: string, data: Omit<BodyMeasurements, 'date'>): BodyMeasurements[] {
  const log = getMeasurements();
  const existing = log.findIndex(e => e.date === date);
  const entry = { date, ...data };
  if (existing >= 0) {
    log[existing] = entry;
  } else {
    log.push(entry);
  }
  log.sort((a, b) => a.date.localeCompare(b.date));
  setItem(KEYS.MEASUREMENTS, log);
  return log;
}

// Progress photos
export function getPhotos(): ProgressPhoto[] {
  return getItem<ProgressPhoto[]>(KEYS.PHOTOS, []);
}

export function addPhoto(photo: ProgressPhoto): ProgressPhoto[] {
  const photos = getPhotos();
  photos.push(photo);
  setItem(KEYS.PHOTOS, photos);
  return photos;
}

// Settings
export function getSettings(): AppSettings {
  return getItem<AppSettings>(KEYS.SETTINGS, {
    notifications: DEFAULT_NOTIFICATIONS,
    targets: DEFAULT_TARGETS,
    startingWeight: STARTING_WEIGHT,
    currentWeight: STARTING_WEIGHT,
    weddingDate: WEDDING_DATE,
    programStart: PROGRAM_START,
    programEnd: PROGRAM_END,
  });
}

export function saveSettings(settings: AppSettings): void {
  setItem(KEYS.SETTINGS, settings);
}

export function updateTargets(targets: Partial<AppSettings['targets']>): AppSettings {
  const settings = getSettings();
  settings.targets = { ...settings.targets, ...targets };
  saveSettings(settings);
  return settings;
}

// Streak
export function getStreak(): StreakData {
  return getItem<StreakData>(KEYS.STREAK, { current: 0, best: 0, lastDate: '' });
}

export function updateStreak(date: string): StreakData {
  const streak = getStreak();
  const today = new Date(date);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (streak.lastDate === yesterdayStr || streak.lastDate === date) {
    if (streak.lastDate !== date) {
      streak.current += 1;
    }
  } else {
    streak.current = 1;
  }

  streak.lastDate = date;
  streak.best = Math.max(streak.best, streak.current);
  setItem(KEYS.STREAK, streak);
  return streak;
}

// Completion calculation
export function getDayCompletion(data: DailyData): number {
  const total = data.checklist.length + data.skinCare.length;
  if (total === 0) return 0;
  const done = data.checklist.filter(i => i.checked).length + data.skinCare.filter(i => i.checked).length;
  return Math.round((done / total) * 100);
}

// Clear any data that was incorrectly seeded for future dates
export function clearFutureData(): void {
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(KEYS.DAILY) && key > KEYS.DAILY + today) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));

  // Clear weight/measurement entries with future dates
  const weightLog = getWeightLog().filter(e => e.date <= today);
  setItem(KEYS.WEIGHT, weightLog);
  const measurements = getMeasurements().filter(e => e.date <= today);
  setItem(KEYS.MEASUREMENTS, measurements);
}

// Initialize with sample data — only for dates that have already passed
export function initializeSampleData(): void {
  // Always check and clear future data first
  clearFutureData();

  if (getItem<boolean>(KEYS.INITIALIZED, false)) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(PROGRAM_START);
  startDate.setHours(0, 0, 0, 0);

  // Don't seed anything if program hasn't started yet
  if (today < startDate) {
    setItem(KEYS.INITIALIZED, true);
    return;
  }

  // Seed only past days (not today — user tracks today live)
  const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const seedDays = Math.min(daysPassed, 7); // Seed up to 7 past days

  for (let i = 0; i < seedDays; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const dailyData: DailyData = {
      date: dateStr,
      checklist: CHECKLIST_ITEMS.map((item, idx) => ({
        ...item,
        checked: idx < 12 + Math.floor(Math.random() * 5),
      })),
      meals: [
        { id: `m${i}1`, name: 'Oats + Milk + Chia Seeds', calories: 380, protein: 16, carbs: 48, fats: 12, fiber: 8, portion: '60g oats + 200ml milk', mealType: 'breakfast', time: '08:00' },
        { id: `m${i}2`, name: 'Dal + Roti + Sabzi + Curd', calories: 520, protein: 22, carbs: 62, fats: 16, fiber: 10, portion: '1 bowl + 2 roti', mealType: 'lunch', time: '13:00' },
        { id: `m${i}3`, name: 'Roasted Chana', calories: 160, protein: 8, carbs: 20, fats: 4, fiber: 6, portion: '50g', mealType: 'snack', time: '16:00' },
        { id: `m${i}4`, name: 'Dal + Vegetables + Roti', calories: 420, protein: 18, carbs: 48, fats: 14, fiber: 8, portion: '1 bowl + 2 roti', mealType: 'dinner', time: '20:00' },
      ],
      workout: i % 7 < 5 ? {
        date: dateStr,
        dayType: i % 2 === 0 ? 'upper' : 'lower',
        exercises: [],
        completed: true,
        duration: 45,
      } : null,
      skinCare: [
        ...SKIN_CARE_ITEMS.am.map(s => ({ ...s, checked: Math.random() > 0.2 })),
        ...SKIN_CARE_ITEMS.pm.map(s => ({ ...s, checked: Math.random() > 0.3 })),
      ],
      water: 2200 + Math.floor(Math.random() * 800),
      steps: 6000 + Math.floor(Math.random() * 4000),
      sleep: 6.5 + Math.random() * 2,
      weight: 89 - (i * 0.15),
      notes: '',
    };

    saveDailyData(dateStr, dailyData);
  }

  // Seed weight log for past days only
  if (seedDays > 0) {
    const weightLog: WeightEntry[] = [];
    for (let i = 0; i < seedDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      weightLog.push({
        date: dateStr,
        weight: 89 - (i * 0.15),
      });
    }
    setItem(KEYS.WEIGHT, weightLog);

    // Seed measurements
    setItem(KEYS.MEASUREMENTS, [
      { date: PROGRAM_START, waist: 86, chest: 96, arms: 33 },
    ]);
  }

  setItem(KEYS.INITIALIZED, true);
}

// Export all data as JSON
export function exportAllData(): string {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('transform_')) {
      data[key] = JSON.parse(localStorage.getItem(key) || 'null');
    }
  }
  return JSON.stringify(data, null, 2);
}

// Reset all data
export function resetAllData(): void {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('transform_')) {
      keys.push(key);
    }
  }
  keys.forEach(k => localStorage.removeItem(k));
}
