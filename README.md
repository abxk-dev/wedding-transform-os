# TransformOS — 55-Day Wedding Transformation Dashboard

Premium personal health & transformation dashboard built for a 55-day wedding preparation program.

## Features

- **Dashboard** — Wedding countdown, weight tracking, daily checklist, nutrition summary, streak counter
- **55-Day Calendar** — Heatmap visualization of daily completion, drill-down per day
- **Diet Tracker** — Vegetarian/egg-free food database, meal logger, macro tracking
- **Workout Tracker** — 5-day gym split, progressive overload, set/rep/weight logging
- **Skin Care** — AM/PM routines, pigmentation care tips
- **Reproductive Health** — Evidence-based lifestyle habits, semen analysis explainer
- **Progress** — Weight charts, body measurements, progress photos, milestone badges
- **Settings** — Notification reminders, daily targets, theme toggle, data export/reset

## Tech Stack

- Next.js 15+ App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Recharts for data visualization
- Lucide icons
- localStorage persistence (no backend)
- PWA with service worker
- Web Notifications API for reminders

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Deploy — zero config needed

### Other Platforms

```bash
npm run build
npm start
```

## Data Storage

All data persists in browser localStorage. No backend required.

**Keys used:**
- `transform_daily_YYYY-MM-DD` — Daily checklist, meals, workout, skincare
- `transform_weight_log` — Weight entries
- `transform_measurements` — Body measurements (waist/chest/arms)
- `transform_photos` — Progress photos (base64)
- `transform_settings` — Notification prefs, targets
- `transform_streak` — Streak data

Export full backup from Settings > Export JSON.

## PWA

Installable on mobile and desktop. Service worker enables offline access.

## Safety

- No medical advice — lifestyle suggestions only
- No guaranteed outcomes for weight, skin, or fertility
- Always consult healthcare professionals for medical concerns

## License

Personal use.
