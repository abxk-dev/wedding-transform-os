'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Moon, Sparkles } from 'lucide-react';
import { getDailyData, saveDailyData } from '@/lib/storage';
import { getToday } from '@/lib/dates';
import { DailyData } from '@/lib/types';

interface SleepTask {
  id: string;
  label: string;
  category: 'relax' | 'prep' | 'mind' | 'health' | 'hygiene';
  icon: string;
}

// Full pool of before-sleep tasks
const SLEEP_TASK_POOL: SleepTask[] = [
  // Relax
  { id: 's1', label: 'No screens 30 min before bed', category: 'relax', icon: '📵' },
  { id: 's2', label: 'Listen to calm music or nature sounds', category: 'relax', icon: '🎵' },
  { id: 's3', label: 'Read a physical book for 15 min', category: 'relax', icon: '📖' },
  { id: 's4', label: 'Dim all lights 1 hour before sleep', category: 'relax', icon: '💡' },
  { id: 's5', label: 'No caffeine after 2 PM today', category: 'relax', icon: '☕' },
  { id: 's6', label: 'Drink chamomile or herbal tea', category: 'relax', icon: '🍵' },
  { id: 's7', label: 'No heavy meals 2 hrs before bed', category: 'relax', icon: '🍽️' },
  { id: 's8', label: 'Put phone on DND mode', category: 'relax', icon: '🔕' },

  // Prep
  { id: 's9', label: 'Lay out tomorrow\'s clothes', category: 'prep', icon: '👕' },
  { id: 's10', label: 'Pack gym bag for tomorrow', category: 'prep', icon: '🎒' },
  { id: 's11', label: 'Plan tomorrow\'s meals', category: 'prep', icon: '📝' },
  { id: 's12', label: 'Set alarm for wake-up time', category: 'prep', icon: '⏰' },
  { id: 's13', label: 'Fill water bottle for morning', category: 'prep', icon: '💧' },
  { id: 's14', label: 'Review tomorrow\'s workout plan', category: 'prep', icon: '💪' },
  { id: 's15', label: 'Prep overnight oats or breakfast', category: 'prep', icon: '🥣' },
  { id: 's16', label: 'Check calendar for tomorrow', category: 'prep', icon: '📅' },

  // Mind
  { id: 's17', label: '5 min deep breathing (4-7-8)', category: 'mind', icon: '🫁' },
  { id: 's18', label: 'Write 3 things you\'re grateful for', category: 'mind', icon: '🙏' },
  { id: 's19', label: '2 min body scan meditation', category: 'mind', icon: '🧘' },
  { id: 's20', label: 'Journal: 1 win from today', category: 'mind', icon: '✍️' },
  { id: 's21', label: 'Visualize tomorrow going well', category: 'mind', icon: '🌟' },
  { id: 's22', label: 'Progressive muscle relaxation', category: 'mind', icon: '💆' },
  { id: 's23', label: '5 min gentle stretching', category: 'mind', icon: '🤸' },
  { id: 's24', label: 'Think of 3 positive things from today', category: 'mind', icon: '😊' },

  // Health
  { id: 's25', label: 'Take a warm shower before bed', category: 'health', icon: '🚿' },
  { id: 's26', label: 'Room temperature 18-22°C', category: 'health', icon: '🌡️' },
  { id: 's27', label: 'Use blackout curtains / eye mask', category: 'health', icon: '😴' },
  { id: 's28', label: 'No vigorous exercise 2 hrs before bed', category: 'health', icon: '🏃' },
  { id: 's29', label: 'Limit water intake 1 hr before bed', category: 'health', icon: '💧' },
  { id: 's30', label: 'Check: 7+ hours of sleep planned?', category: 'health', icon: '✅' },

  // Hygiene
  { id: 's31', label: 'Brush teeth + floss', category: 'hygiene', icon: '🪥' },
  { id: 's32', label: 'Apply moisturizer (face + body)', category: 'hygiene', icon: '🧴' },
  { id: 's33', label: 'Change into clean sleepwear', category: 'hygiene', icon: '👔' },
  { id: 's34', label: 'Make bed comfortable and clean', category: 'hygiene', icon: '🛏️' },
  { id: 's35', label: 'Wash face with gentle cleanser', category: 'hygiene', icon: '🧼' },
];

const CATEGORY_LABELS: Record<string, string> = {
  relax: 'Unwind',
  prep: 'Prep',
  mind: 'Mind',
  health: 'Health',
  hygiene: 'Hygiene',
};

const CATEGORY_COLORS: Record<string, string> = {
  relax: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  prep: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  mind: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  health: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  hygiene: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
};

// Deterministic shuffle based on date string
function getDailyTasks(dateStr: string): SleepTask[] {
  // Simple hash from date string
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash);

  // Pick one from each category + 2 extras
  const categories = ['relax', 'prep', 'mind', 'health', 'hygiene'] as const;
  const selected: SleepTask[] = [];

  categories.forEach((cat, i) => {
    const catTasks = SLEEP_TASK_POOL.filter(t => t.category === cat);
    const idx = (hash + i * 7) % catTasks.length;
    selected.push(catTasks[idx]);
  });

  // Add 2 extra random ones (different from selected)
  const remaining = SLEEP_TASK_POOL.filter(t => !selected.some(s => s.id === t.id));
  for (let i = 0; i < 2; i++) {
    const idx = (hash + i * 13 + 5) % remaining.length;
    if (remaining[idx]) {
      selected.push(remaining[idx]);
    }
  }

  return selected;
}

export default function BeforeSleep() {
  const [tasks, setTasks] = useState<SleepTask[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const today = getToday();
    const dailyTasks = getDailyTasks(today);
    setTasks(dailyTasks);

    // Load checked state from daily data
    const data = getDailyData(today);
    const savedChecked: Record<string, boolean> = {};
    dailyTasks.forEach(t => {
      savedChecked[t.id] = // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any)[`sleep_${t.id}`] as boolean || false;
    });
    setChecked(savedChecked);
  }, []);

  const handleToggle = (taskId: string) => {
    const newState = !checked[taskId];
    setChecked(prev => ({ ...prev, [taskId]: newState }));

    // Save to daily data
    const today = getToday();
    const data = getDailyData(today);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any)[`sleep_${taskId}`] = newState;
    saveDailyData(today, data);
  };

  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-200 dark:border-indigo-900">
      <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Moon className="h-4 w-4 text-indigo-500" />
            Before Sleep Tonight
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {doneCount}/{tasks.length}
          </Badge>
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
          Different routine every day. Mix of relaxation, prep, and mindfulness.
        </p>
      </CardHeader>
      <CardContent className="pt-0 px-3 sm:px-6 pb-3 space-y-1.5">
        {tasks.map(task => (
          <label
            key={task.id}
            className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all active:scale-[0.98] ${
              checked[task.id]
                ? 'bg-emerald-50 dark:bg-emerald-950/30'
                : 'bg-white/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800'
            }`}
          >
            <Checkbox
              checked={checked[task.id] || false}
              onCheckedChange={() => handleToggle(task.id)}
              className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            />
            <span className="text-base flex-shrink-0">{task.icon}</span>
            <span className={`text-sm leading-tight flex-1 ${checked[task.id] ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
              {task.label}
            </span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${CATEGORY_COLORS[task.category]}`}>
              {CATEGORY_LABELS[task.category]}
            </span>
          </label>
        ))}

        {doneCount === tasks.length && (
          <div className="text-center py-2">
            <Sparkles className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">All done! Sleep well.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
