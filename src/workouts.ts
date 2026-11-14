export const TOTAL_DAYS = 45;
export const FREE_DAYS = 7;
export const RECOVERY_DAYS = [7, 14, 21, 28, 35, 42] as const;

export const PHASES = [
  { name: 'Foundation', days: '1-10', focus: 'Form and Activation', color: '#3B82F6', start: 1, end: 10 },
  { name: 'Build', days: '11-25', focus: 'Strength and Volume', color: '#8B5CF6', start: 11, end: 25 },
  { name: 'Intensify', days: '26-40', focus: 'Density and Control', color: '#F59E0B', start: 26, end: 40 },
  { name: 'Peak', days: '41-45', focus: 'Finish Strong', color: '#EF4444', start: 41, end: 45 },
];

export type Workout = {
  title: string;
  exercises: string[];
  duration: string;
  rest: string;
  notes?: string;
  recovery?: boolean;
};

export const EXERCISE_KEYS = [
  'Bicycle Crunch',
  'Reverse Crunch',
  'Mountain Climber Alt',
  'Mountain Climber',
  'Dead Bug Alt',
  'Dead Bug',
  'Side Plank',
  'Plank Alt',
  'Glute Bridge',
  'Bird Dog',
  'Heel Tap',
  'Cat-Cow',
  'Leg Raise',
  'Crunch',
  'Plank',
] as const;

const EXERCISE_KEYS_BY_LENGTH = [...EXERCISE_KEYS].sort((a, b) => b.length - a.length);

export function exerciseKeyFor(exercise: string): string | null {
  const lower = exercise.toLowerCase();
  for (const key of EXERCISE_KEYS_BY_LENGTH) {
    if (lower.includes(key.toLowerCase())) {
      return key;
    }
  }
  return null;
}

export function isDayFree(day: number): boolean {
  return day >= 1 && day <= FREE_DAYS;
}

export function isDayUnlocked(day: number, isPro: boolean): boolean {
  return isPro || isDayFree(day);
}

export function getPhaseForDay(day: number) {
  return PHASES.find((p) => day >= p.start && day <= p.end) || PHASES[0];
}

export function parseRestSeconds(rest: string): number {
  const match = rest.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 30;
}

export function estimateSets(exercises: string[]): number {
  let total = 0;
  for (const ex of exercises) {
    const match = ex.match(/(\d+)\s*[×x]/);
    total += match ? parseInt(match[1], 10) : 3;
  }
  return total;
}

const R = 'Light day. Move slowly and stop if you feel pain.';

export const WORKOUTS: Record<number, Workout> = {
  1: { title: 'Core Activation', exercises: ['Dead Bug 3×10', 'Glute Bridge 3×12', 'Bird Dog 3×8/side', 'Plank 3×20s'], duration: '12 min', rest: '45s' },
  2: { title: 'Crunch Foundations', exercises: ['Crunch 3×12', 'Reverse Crunch 3×10', 'Heel Tap 3×12/side', 'Plank 3×25s'], duration: '14 min', rest: '45s' },
  3: { title: 'Stability Basics', exercises: ['Dead Bug 3×12', 'Side Plank 3×15s/side', 'Bird Dog 3×10/side', 'Glute Bridge 3×15'], duration: '13 min', rest: '45s' },
  4: { title: 'Lower Abs Intro', exercises: ['Reverse Crunch 3×12', 'Heel Tap 3×15/side', 'Leg Raise 3×8', 'Plank 3×30s'], duration: '14 min', rest: '45s' },
  5: { title: 'Anti-Rotation Start', exercises: ['Dead Bug 3×12', 'Bird Dog 3×10/side', 'Side Plank 3×20s/side', 'Heel Tap 3×12/side'], duration: '14 min', rest: '45s' },
  6: { title: 'Core Control', exercises: ['Dead Bug 3×12', 'Plank 3×30s', 'Bird Dog 3×10/side', 'Glute Bridge 3×15'], duration: '15 min', rest: '40s' },
  7: { title: 'Easy Mobility', exercises: ['Cat-Cow 2×10', 'Bird Dog 2×8/side', 'Glute Bridge 2×12', 'Plank 2×20s'], duration: '10 min', rest: '60s', notes: R, recovery: true },
  8: { title: 'Foundation Mix', exercises: ['Dead Bug 3×15', 'Leg Raise 3×10', 'Plank 3×35s', 'Bird Dog 3×10/side'], duration: '16 min', rest: '40s' },
  9: { title: 'Endurance Base', exercises: ['Plank 3×40s', 'Crunch 3×15', 'Reverse Crunch 3×12', 'Side Plank 3×25s/side'], duration: '16 min', rest: '40s' },
  10: { title: 'Foundation Check-In', exercises: ['Dead Bug 4×12', 'Plank 4×30s', 'Bird Dog 3×12/side', 'Glute Bridge 3×15'], duration: '18 min', rest: '45s' },
  11: { title: 'Volume Increase', exercises: ['Bicycle Crunch 3×12/side', 'Mountain Climber 3×20', 'Leg Raise 3×10', 'Plank 3×40s'], duration: '16 min', rest: '35s' },
  12: { title: 'Core Builder', exercises: ['Bicycle Crunch 3×15/side', 'Mountain Climber 3×25', 'Leg Raise 3×12', 'Side Plank 3×25s/side'], duration: '17 min', rest: '35s' },
  13: { title: 'Strength Focus', exercises: ['Leg Raise 4×10', 'Crunch 3×15', 'Plank 3×45s', 'Bird Dog 3×12/side'], duration: '17 min', rest: '35s' },
  14: { title: 'Reset and Stretch', exercises: ['Cat-Cow 2×12', 'Dead Bug 2×10', 'Bird Dog 2×10/side', 'Glute Bridge 2×15'], duration: '12 min', rest: '60s', notes: R, recovery: true },
  15: { title: 'Mid-Build Stability', exercises: ['Dead Bug 3×15', 'Side Plank 3×30s/side', 'Reverse Crunch 3×12', 'Heel Tap 3×15/side'], duration: '16 min', rest: '35s' },
  16: { title: 'Build Phase Push', exercises: ['Bicycle Crunch 4×12/side', 'Leg Raise 3×12', 'Mountain Climber 3×30', 'Plank 3×45s'], duration: '18 min', rest: '30s' },
  17: { title: 'Oblique Emphasis', exercises: ['Side Plank 3×35s/side', 'Bicycle Crunch 3×15/side', 'Heel Tap 3×15/side', 'Mountain Climber 3×25'], duration: '17 min', rest: '35s' },
  18: { title: 'Volume Push', exercises: ['Crunch 4×15', 'Leg Raise 4×10', 'Plank 4×35s', 'Bird Dog 3×12/side'], duration: '19 min', rest: '30s' },
  19: { title: 'Control and Density', exercises: ['Dead Bug 4×12', 'Mountain Climber 4×20', 'Reverse Crunch 3×15', 'Side Plank 3×30s/side'], duration: '18 min', rest: '30s' },
  20: { title: 'Mid-Build Check-In', exercises: ['Bicycle Crunch 4×12/side', 'Leg Raise 3×12', 'Plank 3×50s', 'Mountain Climber 3×30'], duration: '20 min', rest: '35s' },
  21: { title: 'Mid-Build Recovery', exercises: ['Cat-Cow 3×8', 'Glute Bridge 2×12', 'Side Plank 2×15s/side', 'Bird Dog 2×8/side'], duration: '12 min', rest: '60s', notes: R, recovery: true },
  22: { title: 'Strength Builder', exercises: ['Leg Raise 4×12', 'Crunch 3×18', 'Side Plank 3×35s/side', 'Dead Bug 3×15'], duration: '18 min', rest: '30s' },
  23: { title: 'High Density', exercises: ['Mountain Climber 4×25', 'Bicycle Crunch 3×15/side', 'Plank 3×45s', 'Reverse Crunch 3×15'], duration: '19 min', rest: '25s' },
  24: { title: 'Build Mix', exercises: ['Dead Bug 4×12', 'Leg Raise 3×12', 'Side Plank 4×25s/side', 'Mountain Climber 3×25'], duration: '19 min', rest: '30s' },
  25: { title: 'Build Finale', exercises: ['Leg Raise 4×12', 'Mountain Climber 4×25', 'Side Plank 3×40s/side', 'Dead Bug 4×12'], duration: '21 min', rest: '30s' },
  26: { title: 'Density Start', exercises: ['Mountain Climber 5×20', 'Bicycle Crunch 4×12/side', 'Leg Raise 4×10', 'Plank Alt 4×40s'], duration: '20 min', rest: '25s' },
  27: { title: 'Control Focus', exercises: ['Dead Bug Alt 4×15', 'Side Plank 4×30s/side', 'Reverse Crunch 4×12', 'Bird Dog 4×10/side'], duration: '20 min', rest: '25s' },
  28: { title: 'Midpoint Recovery', exercises: ['Cat-Cow 2×10', 'Dead Bug 3×8', 'Glute Bridge 3×10', 'Plank 2×25s'], duration: '12 min', rest: '45s', notes: R, recovery: true },
  29: { title: 'High Volume', exercises: ['Bicycle Crunch 5×12/side', 'Reverse Crunch 4×15', 'Side Plank 4×30s/side', 'Dead Bug 4×12'], duration: '21 min', rest: '25s' },
  30: { title: 'Oblique Control', exercises: ['Side Plank 4×35s/side', 'Heel Tap 4×15/side', 'Bicycle Crunch 4×12/side', 'Plank Alt 3×40s'], duration: '20 min', rest: '25s' },
  31: { title: 'Peak Density Prep', exercises: ['Mountain Climber Alt 5×25', 'Leg Raise 4×12', 'Bicycle Crunch 4×15/side', 'Plank 4×50s'], duration: '22 min', rest: '20s' },
  32: { title: 'Oblique Density', exercises: ['Side Plank 5×30s/side', 'Bicycle Crunch 4×15/side', 'Heel Tap 4×15/side', 'Mountain Climber 4×25'], duration: '21 min', rest: '20s' },
  33: { title: 'Strength Density', exercises: ['Leg Raise 5×12', 'Crunch 4×18', 'Dead Bug Alt 4×15', 'Plank 5×35s'], duration: '22 min', rest: '20s' },
  34: { title: 'Intensify Push', exercises: ['Mountain Climber Alt 5×25', 'Reverse Crunch 4×15', 'Side Plank 4×35s/side', 'Bird Dog 4×12/side'], duration: '22 min', rest: '20s' },
  35: { title: 'Intensify Recovery', exercises: ['Cat-Cow 3×10', 'Bird Dog 3×8/side', 'Dead Bug 2×12', 'Glute Bridge 3×12'], duration: '12 min', rest: '45s', notes: R, recovery: true },
  36: { title: 'Control Peak', exercises: ['Dead Bug Alt 5×12', 'Side Plank 5×30s/side', 'Reverse Crunch 5×12', 'Mountain Climber 4×25'], duration: '22 min', rest: '20s' },
  37: { title: 'Volume Density', exercises: ['Crunch 5×15', 'Leg Raise 5×10', 'Bicycle Crunch 4×15/side', 'Plank Alt 5×40s'], duration: '23 min', rest: '20s' },
  38: { title: 'High Intensity', exercises: ['Mountain Climber Alt 6×20', 'Side Plank 4×40s/side', 'Reverse Crunch 4×15', 'Dead Bug 5×12'], duration: '23 min', rest: '15s' },
  39: { title: 'Intensify Finale', exercises: ['Leg Raise 5×12', 'Bicycle Crunch 5×12/side', 'Plank 5×45s', 'Bird Dog 4×12/side'], duration: '24 min', rest: '20s' },
  40: { title: 'Pre-Peak Check-In', exercises: ['Mountain Climber 5×25', 'Leg Raise 5×12', 'Side Plank 5×30s/side', 'Dead Bug Alt 5×12'], duration: '24 min', rest: '20s' },
  41: { title: 'Peak Start', exercises: ['Bicycle Crunch 5×15/side', 'Mountain Climber Alt 5×25', 'Leg Raise 5×12', 'Plank Alt 5×45s'], duration: '22 min', rest: '20s' },
  42: { title: 'Peak Recovery', exercises: ['Cat-Cow 3×10', 'Glute Bridge 3×12', 'Bird Dog 3×10/side', 'Plank 2×20s'], duration: '12 min', rest: '45s', notes: R, recovery: true },
  43: { title: 'Peak Control', exercises: ['Leg Raise 5×15', 'Bicycle Crunch 5×15/side', 'Plank 5×50s', 'Bird Dog 5×10/side'], duration: '23 min', rest: '15s' },
  44: { title: 'Peak Push', exercises: ['Mountain Climber Alt 6×20', 'Crunch 5×15', 'Side Plank 5×30s/side', 'Dead Bug Alt 5×12'], duration: '22 min', rest: '15s' },
  45: { title: 'Final Peak', exercises: ['Bicycle Crunch 5×15/side', 'Leg Raise 5×12', 'Plank Alt 5×45s', 'Mountain Climber 5×25', 'Dead Bug 4×12'], duration: '25 min', rest: '20s', notes: 'Strong finish. Focus on form and stop if you feel pain.' },
};

export function workoutSignature(day: number, workout: Workout): string {
  return `${day}|${workout.title}|${workout.exercises.join('|')}`;
}
