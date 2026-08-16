'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dumbbell, CheckCircle2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { WORKOUT_PLAN, PROGRESSION_NOTES } from '@/lib/constants';
import { getDailyData, saveWorkout } from '@/lib/storage';
import { getToday, getWeekNumber } from '@/lib/dates';
import { WorkoutSession, ExerciseEntry, DailyData } from '@/lib/types';

export default function WorkoutView() {
  const [data, setData] = useState<DailyData | null>(null);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  useEffect(() => {
    setData(getDailyData(getToday()));
  }, []);

  const today = new Date();
  const dayOfWeek = today.getDay();
  const weekNum = getWeekNumber(getToday());

  const workoutDayMap: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 0: 6 };
  const todayPlanIndex = workoutDayMap[dayOfWeek] ?? 0;
  const todayPlan = WORKOUT_PLAN[todayPlanIndex];

  const handleStartWorkout = () => {
    const exercises: ExerciseEntry[] = todayPlan.exercises.map((ex, idx) => ({
      id: `ex-${idx}`,
      name: ex.name,
      sets: Array.from({ length: ex.sets }, (_, i) => ({
        setNumber: i + 1,
        reps: parseInt(ex.reps) || 0,
        weight: 0,
        done: false,
      })),
      notes: '',
    }));

    const workout: WorkoutSession = {
      date: getToday(),
      dayType: todayPlan.dayType,
      exercises,
      completed: false,
      duration: 0,
    };

    saveWorkout(getToday(), workout);
    setData(getDailyData(getToday()));
  };

  const handleSetToggle = (exerciseId: string, setNumber: number, done: boolean) => {
    if (!data?.workout) return;
    const updated = { ...data.workout };
    updated.exercises = updated.exercises.map(ex => {
      if (ex.id === exerciseId) {
        ex.sets = ex.sets.map(s => s.setNumber === setNumber ? { ...s, done } : s);
      }
      return ex;
    });
    saveWorkout(getToday(), updated);
    setData(getDailyData(getToday()));
  };

  const handleWeightChange = (exerciseId: string, setNumber: number, weight: number) => {
    if (!data?.workout) return;
    const updated = { ...data.workout };
    updated.exercises = updated.exercises.map(ex => {
      if (ex.id === exerciseId) {
        ex.sets = ex.sets.map(s => s.setNumber === setNumber ? { ...s, weight } : s);
      }
      return ex;
    });
    saveWorkout(getToday(), updated);
    setData(getDailyData(getToday()));
  };

  const handleCompleteWorkout = () => {
    if (!data?.workout) return;
    const updated = { ...data.workout, completed: true, duration: 45 };
    saveWorkout(getToday(), updated);
    setData(getDailyData(getToday()));
  };

  const workout = data?.workout;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Today's Plan */}
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-900">
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-emerald-500" />
                {todayPlan.title}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {todayPlan.exercises.length} exercises · Week {weekNum}
              </p>
            </div>
            <Badge variant="outline" className="text-xs flex-shrink-0">{todayPlan.dayType}</Badge>
          </div>

          {!workout ? (
            <Button onClick={handleStartWorkout} className="w-full bg-emerald-500 hover:bg-emerald-600 h-10 text-sm">
              Start Workout
            </Button>
          ) : workout.completed ? (
            <div className="flex items-center gap-2 text-emerald-600 py-1">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Workout Complete!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="h-4 w-4" />
              <span className="text-sm">In progress</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exercise List */}
      {workout && !workout.completed && (
        <div className="space-y-2.5">
          {workout.exercises.map(exercise => {
            const isExpanded = expandedExercise === exercise.id;
            const allSetsDone = exercise.sets.every(s => s.done);
            const setsDone = exercise.sets.filter(s => s.done).length;

            return (
              <Card key={exercise.id} className={`bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 ${allSetsDone ? 'border-emerald-300 dark:border-emerald-700' : ''}`}>
                <button
                  className="w-full text-left p-3 sm:p-4"
                  onClick={() => setExpandedExercise(isExpanded ? null : exercise.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {allSetsDone && <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />}
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{exercise.name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="outline" className="text-[10px]">{setsDone}/{exercise.sets.length}</Badge>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3 sm:px-4 sm:pb-4 space-y-1.5">
                    {exercise.sets.map(set => (
                      <div key={set.setNumber} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Checkbox
                          checked={set.done}
                          onCheckedChange={checked => handleSetToggle(exercise.id, set.setNumber, checked as boolean)}
                          className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <span className="text-xs font-medium text-gray-500 w-8">S{set.setNumber}</span>
                        <Input
                          type="number"
                          placeholder="kg"
                          value={set.weight || ''}
                          onChange={e => handleWeightChange(exercise.id, set.setNumber, parseFloat(e.target.value) || 0)}
                          className="w-16 sm:w-20 h-7 text-xs"
                        />
                        <span className="text-[10px] text-gray-500">kg</span>
                        <span className="text-[10px] text-gray-400 ml-auto">{set.reps} reps</span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}

          <Button
            onClick={handleCompleteWorkout}
            className="w-full bg-emerald-500 hover:bg-emerald-600 h-10 text-sm"
            disabled={!workout.exercises.some(ex => ex.sets.some(s => s.done))}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Complete Workout
          </Button>
        </div>
      )}

      {/* Planned Exercises */}
      {!workout && (
        <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
          <CardHeader className="pb-1.5 px-3 sm:px-6 pt-3 sm:pt-4">
            <CardTitle className="text-xs sm:text-sm">Planned Exercises</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-3 sm:px-6 pb-3">
            <div className="space-y-1.5">
              {todayPlan.exercises.map((ex, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg gap-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">{ex.name}</p>
                  <p className="text-[10px] text-gray-500 flex-shrink-0">{ex.sets}×{ex.reps}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progression Notes */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-1.5 px-3 sm:px-6 pt-3 sm:pt-4">
          <CardTitle className="text-xs sm:text-sm">Progressive Overload Guide</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-3 sm:px-6 pb-3">
          <div className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed">
            {PROGRESSION_NOTES.trim()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
