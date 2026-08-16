'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { getDailyData, updateChecklistItem, updateSkinCareItem } from '@/lib/storage';
import { getToday } from '@/lib/dates';
import { DailyData, ChecklistItem, SkinCareItem } from '@/lib/types';

export default function DailyChecklist() {
  const [data, setData] = useState<DailyData | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    morning: true, day: true, evening: true, skinAm: true, skinPm: true
  });

  useEffect(() => {
    setData(getDailyData(getToday()));
  }, []);

  const handleChecklistToggle = (itemId: string, checked: boolean) => {
    const updated = updateChecklistItem(getToday(), itemId, checked);
    setData(updated);
  };

  const handleSkinToggle = (itemId: string, checked: boolean) => {
    const updated = updateSkinCareItem(getToday(), itemId, checked);
    setData(updated);
  };

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!data) return null;

  const morningItems = data.checklist.filter(i => i.category === 'morning');
  const dayItems = data.checklist.filter(i => i.category === 'day');
  const eveningItems = data.checklist.filter(i => i.category === 'evening');
  const amSkin = data.skinCare.filter(s => s.period === 'am');
  const pmSkin = data.skinCare.filter(s => s.period === 'pm');

  const totalDone = data.checklist.filter(i => i.checked).length + data.skinCare.filter(i => i.checked).length;
  const totalItems = data.checklist.length + data.skinCare.length;

  const renderSection = (title: string, items: (ChecklistItem | SkinCareItem)[], sectionKey: string, isSkin = false) => {
    const done = items.filter(i => i.checked).length;
    const expanded = expandedSections[sectionKey];

    return (
      <div className="border-b border-gray-100 dark:border-gray-800 last:border-0">
        <button
          className="flex items-center justify-between w-full py-2.5 px-1"
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{done}/{items.length}</Badge>
          </div>
          {expanded ? <ChevronUp className="h-3.5 w-3.5 text-gray-400" /> : <ChevronDown className="h-3.5 w-3.5 text-gray-400" />}
        </button>

        {expanded && (
          <div className="space-y-0.5 pb-2">
            {items.map(item => (
              <label
                key={item.id}
                className={`flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer transition-colors active:bg-gray-100 dark:active:bg-gray-800 ${
                  item.checked ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                }`}
              >
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={checked =>
                    isSkin
                      ? handleSkinToggle(item.id, checked as boolean)
                      : handleChecklistToggle(item.id, checked as boolean)
                  }
                  className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                />
                <span className={`text-sm leading-tight ${item.checked ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-emerald-500" />
            Daily Checklist
          </CardTitle>
          <Badge className="bg-emerald-500 text-xs">{totalDone}/{totalItems}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 sm:px-6">
        {renderSection('Morning', morningItems, 'morning')}
        {renderSection('Skincare AM', amSkin, 'skinAm', true)}
        {renderSection('Day', dayItems, 'day')}
        {renderSection('Evening', eveningItems, 'evening')}
        {renderSection('Skincare PM', pmSkin, 'skinPm', true)}
      </CardContent>
    </Card>
  );
}
