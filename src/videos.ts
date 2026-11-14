import { videoKeyFor } from './workouts';

export const EXERCISE_VIDEOS: Record<string, any> = {
  'Bicycle Crunch': require('../assets/videos/bicycle.mp4'),
  'Reverse Crunch': require('../assets/videos/reversecrunch.mp4'),
  'Mountain Climber Alt': require('../assets/videos/mountain_v2.mp4'),
  'Mountain Climber': require('../assets/videos/mountain.mp4'),
  'Dead Bug Alt': require('../assets/videos/deadbug_v2.mp4'),
  'Dead Bug': require('../assets/videos/deadbug.mp4'),
  'Side Plank': require('../assets/videos/sideplank.mp4'),
  'Plank Alt': require('../assets/videos/plank_v2.mp4'),
  'Glute Bridge': require('../assets/videos/glutebridge.mp4'),
  'Bird Dog': require('../assets/videos/birddog.mp4'),
  'Heel Tap': require('../assets/videos/heeltap.mp4'),
  'Cat-Cow': require('../assets/videos/catcow.mp4'),
  'Leg Raise': require('../assets/videos/legraise.mp4'),
  'Crunch': require('../assets/videos/crunch.mp4'),
  'Plank': require('../assets/videos/plank.mp4'),
};

export function getVideoSource(exercise: string): any | null {
  const key = videoKeyFor(exercise);
  return key ? EXERCISE_VIDEOS[key] : null;
}
