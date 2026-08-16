import { PROGRAM_START, PROGRAM_END, TOTAL_DAYS } from './constants';

export function generateProgramDates(): string[] {
  const dates: string[] = [];
  const start = new Date(PROGRAM_START);
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatDayOfWeek(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { weekday: 'short' });
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getWeekNumber(dateStr: string): number {
  const start = new Date(PROGRAM_START);
  const current = new Date(dateStr);
  const diff = current.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7)) + 1;
}

export function getWeekDates(weekNumber: number): { start: string; end: string } {
  const start = new Date(PROGRAM_START);
  start.setDate(start.getDate() + (weekNumber - 1) * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

export function isToday(dateStr: string): boolean {
  return dateStr === getToday();
}

export function isPast(dateStr: string): boolean {
  return dateStr < getToday();
}

export function isFuture(dateStr: string): boolean {
  return dateStr > getToday();
}

export function getMonthName(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export function programDay(startDate: string, currentDate: string): number {
  const start = new Date(startDate);
  const current = new Date(currentDate);
  const diff = current.getTime() - start.getTime();
  return Math.max(1, Math.min(55, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1));
}
