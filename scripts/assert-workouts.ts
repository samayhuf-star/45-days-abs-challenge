import {
  FREE_DAYS,
  RECOVERY_DAYS,
  TOTAL_DAYS,
  VIDEO_KEYS,
  WORKOUTS,
  videoKeyFor,
} from '../src/workouts.ts';

const BANNED = [
  /burn\s*fat/i,
  /lose\s+\d+/i,
  /lose\s+(weight|kg|lbs|pounds)/i,
  /\bcure\b/i,
  /\bdoctor\b/i,
  /\bAI\b/,
  /\bguaranteed?\b/i,
];

const errors: string[] = [];

function fail(msg: string) {
  errors.push(msg);
}

const days = Object.keys(WORKOUTS).map(Number).sort((a, b) => a - b);
if (days.length !== TOTAL_DAYS) fail(`Expected ${TOTAL_DAYS} workouts, found ${days.length}`);
for (let d = 1; d <= TOTAL_DAYS; d++) {
  if (!WORKOUTS[d]) fail(`Missing workout for day ${d}`);
}

const titles = new Map<string, number>();
const signatures = new Map<string, number>();
const usedKeys = new Set<string>();

for (const day of days) {
  const w = WORKOUTS[day];
  const isRecovery = (RECOVERY_DAYS as readonly number[]).includes(day);
  if (isRecovery && !w.recovery) fail(`Day ${day} should be a recovery day`);
  if (!isRecovery && w.recovery) fail(`Day ${day} is marked recovery but is not a planned recovery day`);

  if (titles.has(w.title)) fail(`Duplicate title "${w.title}" on days ${titles.get(w.title)} and ${day}`);
  else titles.set(w.title, day);

  const sig = w.exercises.join(' || ');
  if (signatures.has(sig)) fail(`Duplicate exercises on days ${signatures.get(sig)} and ${day}: ${sig}`);
  else signatures.set(sig, day);

  if (!w.exercises.length) fail(`Day ${day} has no exercises`);

  const blob = `${w.title} ${w.exercises.join(' ')} ${w.notes ?? ''} ${w.duration} ${w.rest}`;
  if (blob.includes('...') || blob.includes('…')) fail(`Ellipsis in day ${day} copy`);
  for (const re of BANNED) {
    if (re.test(blob)) fail(`Banned wording in day ${day}: ${re}`);
  }

  for (const ex of w.exercises) {
    const key = videoKeyFor(ex);
    if (!key) fail(`Day ${day} exercise has no video mapping: ${ex}`);
    else usedKeys.add(key);
  }
}

for (const key of VIDEO_KEYS) {
  if (!usedKeys.has(key)) fail(`Video key never used: ${key}`);
}

if (FREE_DAYS !== 7) fail(`Expected 7 free days, got ${FREE_DAYS}`);

if (errors.length) {
  console.error(`assert-workouts FAILED (${errors.length})`);
  for (const e of errors) console.error(' -', e);
  process.exit(1);
}

console.log(`assert-workouts OK: ${TOTAL_DAYS} unique days, recovery on ${RECOVERY_DAYS.join(', ')}, ${usedKeys.size} video keys used, days 1-${FREE_DAYS} free`);
