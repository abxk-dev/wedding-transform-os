'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Calendar, UtensilsCrossed, Dumbbell, Sparkles, Heart, BedDouble, TrendingUp, Settings } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: LayoutGrid },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/diet', label: 'Diet', icon: UtensilsCrossed },
  { href: '/workout', label: 'Workout', icon: Dumbbell },
  { href: '/skin', label: 'Skin', icon: Sparkles },
  { href: '/health', label: 'Health', icon: Heart },
  { href: '/sleep', label: 'Sleep', icon: BedDouble },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 safe-area-pb">
      <div className="flex items-center justify-around px-0.5 py-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-1 py-1 rounded-xl transition-all min-w-0 ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-gray-400 dark:text-gray-500 active:text-gray-600 dark:active:text-gray-300'
              }`}
            >
              <Icon className={`h-[18px] w-[18px] flex-shrink-0 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
              <span className={`text-[8px] leading-tight truncate max-w-[40px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -top-px left-1/2 -translate-x-1/2 w-5 h-0.5 bg-emerald-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
