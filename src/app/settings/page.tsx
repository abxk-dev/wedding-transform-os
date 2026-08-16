'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Settings, Bell, Target, Database, Moon, Sun, AlertTriangle, Download, Trash2, RefreshCw, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTheme } from 'next-themes';
import { getSettings, saveSettings, resetAllData, exportAllData, initializeSampleData } from '@/lib/storage';
import { requestNotificationPermission, getNotificationPermission, startNotificationScheduler, sendTestNotification } from '@/lib/notifications';
import { AppSettings } from '@/lib/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const s = getSettings();
    setSettings(s);
    setNotifPermission(getNotificationPermission());
    if (s.notifications.some(n => n.enabled)) startNotificationScheduler(s.notifications);
  }, []);

  const handleNotifToggle = (id: string, enabled: boolean) => {
    if (!settings) return;
    const updated = { ...settings, notifications: settings.notifications.map(n => n.id === id ? { ...n, enabled } : n) };
    setSettings(updated);
    saveSettings(updated);
    startNotificationScheduler(updated.notifications);
  };

  const handleNotifTimeChange = (id: string, time: string) => {
    if (!settings) return;
    const updated = { ...settings, notifications: settings.notifications.map(n => n.id === id ? { ...n, time } : n) };
    setSettings(updated);
    saveSettings(updated);
    startNotificationScheduler(updated.notifications);
  };

  const handleTargetChange = (field: keyof AppSettings['targets'], value: string) => {
    if (!settings) return;
    const num = parseInt(value);
    if (isNaN(num) || num <= 0) return;
    const updated = { ...settings, targets: { ...settings.targets, [field]: num } };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleReset = () => {
    resetAllData();
    initializeSampleData();
    setSettings(getSettings());
    setResetDialogOpen(false);
  };

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transform-os-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!settings) return null;

  const isDark = mounted && theme === 'dark';

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500" />
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Notifications, targets, theme, data.</p>
      </div>

      {/* Theme */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isDark ? <Moon className="h-4 w-4 text-emerald-500" /> : <Sun className="h-4 w-4 text-emerald-500" />}
              <span className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</span>
            </div>
            <Switch checked={isDark} onCheckedChange={checked => setTheme(checked ? 'dark' : 'light')} />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-1.5 px-3 sm:px-6 pt-3 sm:pt-4">
          <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
            <Bell className="h-4 w-4 text-emerald-500" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-3 sm:px-6 pb-3 space-y-3">
          <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Push Notifications</p>
              <p className="text-[10px] text-gray-500">
                {notifPermission === 'granted' ? 'Enabled' : notifPermission === 'denied' ? 'Blocked' : 'Not requested'}
              </p>
            </div>
            {notifPermission !== 'granted' ? (
              <Button size="sm" onClick={() => requestNotificationPermission().then(r => setNotifPermission(r))} className="bg-emerald-500 hover:bg-emerald-600 h-7 text-xs">
                Enable
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={sendTestNotification} className="h-7 text-xs">Test</Button>
            )}
          </div>

          <Separator />

          {settings.notifications.map(n => (
            <div key={n.id} className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{n.label}</p>
                <p className="text-[10px] text-gray-500 truncate">{n.description}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Input
                  type="time"
                  value={n.time}
                  onChange={e => handleNotifTimeChange(n.id, e.target.value)}
                  className="w-20 h-7 text-xs"
                  disabled={!n.enabled}
                />
                <Switch checked={n.enabled} onCheckedChange={checked => handleNotifToggle(n.id, checked)} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Targets */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-1.5 px-3 sm:px-6 pt-3 sm:pt-4">
          <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-500" /> Daily Targets
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-3 sm:px-6 pb-3">
          <div className="grid grid-cols-2 gap-2.5">
            {([
              { key: 'calories' as const, label: 'Calories (kcal)' },
              { key: 'protein' as const, label: 'Protein (g)' },
              { key: 'water' as const, label: 'Water (ml)' },
              { key: 'steps' as const, label: 'Steps' },
              { key: 'sleep' as const, label: 'Sleep (hrs)' },
            ]).map(t => (
              <div key={t.key}>
                <Label className="text-[10px] text-gray-500">{t.label}</Label>
                <Input
                  type="number"
                  value={settings.targets[t.key]}
                  onChange={e => handleTargetChange(t.key, e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-1.5 px-3 sm:px-6 pt-3 sm:pt-4">
          <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
            <Database className="h-4 w-4 text-emerald-500" /> Data
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-3 sm:px-6 pb-3 space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="text-xs h-8">
              <Download className="h-3 w-3 mr-1" /> Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => { initializeSampleData(); setSettings(getSettings()); }} className="text-xs h-8">
              <RefreshCw className="h-3 w-3 mr-1" /> Seed Data
            </Button>
          </div>
          <div className="flex items-center justify-between p-2.5 bg-red-50 dark:bg-red-950/30 rounded-xl">
            <div>
              <p className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-300">Reset All Data</p>
              <p className="text-[10px] text-red-500">Cannot be undone</p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => setResetDialogOpen(true)} className="h-7 text-xs">
              <Trash2 className="h-3 w-3 mr-1" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 py-2">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
        <AlertDescription className="text-[11px] text-amber-800 dark:text-amber-200">
          Results vary. This app supports healthy habits — no guarantees. Consult a healthcare professional for medical concerns.
        </AlertDescription>
      </Alert>

      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset All Data?</DialogTitle>
            <DialogDescription>Permanently deletes all progress, meals, workouts, photos. Cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleReset}>Reset Everything</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
