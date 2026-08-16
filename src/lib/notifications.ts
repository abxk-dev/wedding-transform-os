import { NotificationSetting } from './types';

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.requestPermission();
}

export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
}

export function sendNotification(title: string, body: string, icon?: string): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, {
    body,
    icon: icon || '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    tag: title.toLowerCase().replace(/\s/g, '-'),
  });
}

// Simple client-side scheduler using setTimeout
// Checks every minute if any notification should fire
let schedulerInterval: ReturnType<typeof setInterval> | null = null;

export function startNotificationScheduler(notifications: NotificationSetting[]): void {
  stopNotificationScheduler();

  if (!notifications.some(n => n.enabled)) return;

  const checkAndNotify = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    notifications.forEach(notification => {
      if (notification.enabled && notification.time === currentTime) {
        sendNotification(notification.label, notification.description);
      }
    });
  };

  // Check immediately, then every 30 seconds
  checkAndNotify();
  schedulerInterval = setInterval(checkAndNotify, 30000);
}

export function stopNotificationScheduler(): void {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
}

// Test notification
export function sendTestNotification(): void {
  sendNotification('Test Notification', 'Notifications are working! You\'ll receive reminders at your scheduled times.');
}
