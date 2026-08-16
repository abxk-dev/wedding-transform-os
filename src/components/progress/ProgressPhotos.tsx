'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload } from 'lucide-react';
import { getPhotos, addPhoto } from '@/lib/storage';
import { getToday, formatDateShort } from '@/lib/dates';
import { ProgressPhoto } from '@/lib/types';

export default function ProgressPhotos() {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);

  useEffect(() => { setPhotos(getPhotos()); }, []);

  const handleUpload = (type: 'front' | 'side' | 'back') => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          addPhoto({ date: getToday(), dataUrl: reader.result as string, type });
          setPhotos(getPhotos());
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const photosByDate = photos.reduce((acc, photo) => {
    if (!acc[photo.date]) acc[photo.date] = [];
    acc[photo.date].push(photo);
    return acc;
  }, {} as Record<string, ProgressPhoto[]>);

  return (
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-1.5 px-3 sm:px-6 pt-3 sm:pt-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
            <Camera className="h-4 w-4 text-emerald-500" />
            Progress Photos
          </CardTitle>
          <div className="flex gap-1">
            {(['front', 'side', 'back'] as const).map(type => (
              <button
                key={type}
                onClick={() => handleUpload(type)}
                className="h-7 px-1.5 sm:px-2 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-1 text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <Upload className="h-3 w-3" />
                <span className="hidden sm:inline">{type}</span>
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 sm:px-6 pb-3">
        {Object.keys(photosByDate).length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No photos yet</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(photosByDate).sort(([a], [b]) => b.localeCompare(a)).map(([date, datePhotos]) => (
              <div key={date}>
                <p className="text-[10px] font-medium text-gray-500 mb-1.5">{formatDateShort(date)}</p>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {datePhotos.map((photo, idx) => (
                    <div key={idx} className="relative aspect-[3/4] rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img src={photo.dataUrl} alt={`${photo.type}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 text-[9px] bg-black/50 text-white px-1.5 py-0.5 rounded-full capitalize">
                        {photo.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
