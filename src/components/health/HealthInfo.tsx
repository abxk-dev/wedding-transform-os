'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Moon, Dumbbell, Apple, Droplets, Thermometer, Info, AlertTriangle, ExternalLink } from 'lucide-react';
import { SAFETY_COPY } from '@/lib/constants';
import { useState } from 'react';

const lifestyleFactors = [
  { icon: Moon, label: 'Sleep 7-9 hours', desc: 'Consistent sleep supports hormone balance.', category: 'essential' },
  { icon: Dumbbell, label: 'Regular exercise', desc: 'Moderate exercise 4-5x/week.', category: 'essential' },
  { icon: Apple, label: 'Balanced nutrition', desc: 'Protein, fruits, vegetables, nuts, seeds.', category: 'essential' },
  { icon: Droplets, label: 'Stay hydrated', desc: '2-3 liters water daily.', category: 'essential' },
  { icon: Heart, label: 'Healthy body weight', desc: 'Balanced diet and exercise.', category: 'essential' },
  { icon: Thermometer, label: 'Avoid excessive heat', desc: 'No laptop-on-lap, tight underwear, hot tubs.', category: 'moderate' },
];

const avoidList = [
  'Smoking — damages sperm quality',
  'Excessive alcohol — reduces testosterone',
  'Anabolic steroid misuse — suppresses natural testosterone',
  'Chronic stress — affects hormone balance',
  'Sedentary lifestyle — lower sperm quality',
];

export default function HealthInfo() {
  const [showSemenInfo, setShowSemenInfo] = useState(false);

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Lifestyle Habits */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-1.5 px-3 sm:px-6 pt-3 sm:pt-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Heart className="h-4 w-4 text-emerald-500" />
            Evidence-Based Habits
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-3 sm:px-6 pb-3 space-y-2">
          {lifestyleFactors.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex items-start gap-2.5 p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex-shrink-0">
                  <Icon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{f.label}</p>
                    <Badge variant="outline" className="text-[9px] px-1 py-0">{f.category}</Badge>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Avoid */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-1.5 px-3 sm:px-6 pt-3 sm:pt-4">
          <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Things to Avoid
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-3 sm:px-6 pb-3">
          <ul className="space-y-1.5">
            {avoidList.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span className="text-red-400 mt-0.5 flex-shrink-0">•</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Myths */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-1.5 px-3 sm:px-6 pt-3 sm:pt-4">
          <CardTitle className="text-xs sm:text-sm flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            Myths — Clarified
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-3 sm:px-6 pb-3 space-y-2">
          <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 py-2">
            <AlertDescription className="text-[11px] text-blue-800 dark:text-blue-200">
              {SAFETY_COPY.reproductiveHealth}
            </AlertDescription>
          </Alert>
          <p className="text-[11px] text-gray-600 dark:text-gray-400">
            <strong>Pumpkin seeds:</strong> Healthy snack, not fertility medicine.
          </p>
          <p className="text-[11px] text-gray-600 dark:text-gray-400">
            <strong>Creatine:</strong> {SAFETY_COPY.supplements}
          </p>
          <p className="text-[11px] text-gray-600 dark:text-gray-400">
            <strong>Vitamins:</strong> {SAFETY_COPY.vitaminWarning}
          </p>
        </CardContent>
      </Card>

      {/* Semen Analysis */}
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <CardContent className="p-3 sm:p-4">
          <Button variant="outline" size="sm" onClick={() => setShowSemenInfo(!showSemenInfo)} className="mb-2 text-xs h-8">
            <ExternalLink className="h-3 w-3 mr-1" />
            {showSemenInfo ? 'Hide' : 'Show'} Semen Analysis Explainer
          </Button>

          {showSemenInfo && (
            <div className="space-y-2.5 text-[11px] text-gray-600 dark:text-gray-400">
              <div><h4 className="font-semibold text-gray-900 dark:text-white text-xs mb-0.5">Sperm Concentration</h4><p>Per mL. WHO: ≥15 million/mL.</p></div>
              <div><h4 className="font-semibold text-gray-900 dark:text-white text-xs mb-0.5">Total Count</h4><p>Concentration × volume. WHO: ≥39 million.</p></div>
              <div><h4 className="font-semibold text-gray-900 dark:text-white text-xs mb-0.5">Motility</h4><p>Progressive motility. WHO: ≥30%.</p></div>
              <div><h4 className="font-semibold text-gray-900 dark:text-white text-xs mb-0.5">Morphology</h4><p>Shape. WHO: ≥4% normal forms.</p></div>
            </div>
          )}
        </CardContent>
      </Card>

      <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 py-2">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
        <AlertDescription className="text-[11px] text-amber-800 dark:text-amber-200">
          {SAFETY_COPY.whenToSeeDoctor}
        </AlertDescription>
      </Alert>
    </div>
  );
}
