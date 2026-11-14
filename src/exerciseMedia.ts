import { exerciseKeyFor } from './workouts';

export type ExerciseId =
  | 'plank'
  | 'plank-alt'
  | 'dead-bug'
  | 'dead-bug-alt'
  | 'bicycle-crunch'
  | 'mountain-climber'
  | 'mountain-climber-alt'
  | 'side-plank'
  | 'leg-raise'
  | 'bird-dog'
  | 'glute-bridge'
  | 'reverse-crunch'
  | 'crunch'
  | 'heel-tap'
  | 'cat-cow';

export const EXERCISE_ID_BY_KEY: Record<string, ExerciseId> = {
  Plank: 'plank',
  'Plank Alt': 'plank-alt',
  'Dead Bug': 'dead-bug',
  'Dead Bug Alt': 'dead-bug-alt',
  'Bicycle Crunch': 'bicycle-crunch',
  'Mountain Climber': 'mountain-climber',
  'Mountain Climber Alt': 'mountain-climber-alt',
  'Side Plank': 'side-plank',
  'Leg Raise': 'leg-raise',
  'Bird Dog': 'bird-dog',
  'Glute Bridge': 'glute-bridge',
  'Reverse Crunch': 'reverse-crunch',
  Crunch: 'crunch',
  'Heel Tap': 'heel-tap',
  'Cat-Cow': 'cat-cow',
};

/**
 * exerciseId -> ordered still frames under assets/exercise-media/.
 * Stills live under assets/exercise-media/<exerciseId>/{0,1}.png.
 * Alt variants reuse the base exercise pair. No network URLs.
 */
export const EXERCISE_MEDIA: Record<ExerciseId, any[]> = {
  plank: [
    require('../assets/exercise-media/plank/0.png'),
    require('../assets/exercise-media/plank/1.png'),
  ],
  'plank-alt': [
    require('../assets/exercise-media/plank/0.png'),
    require('../assets/exercise-media/plank/1.png'),
  ],
  'dead-bug': [
    require('../assets/exercise-media/dead-bug/0.png'),
    require('../assets/exercise-media/dead-bug/1.png'),
  ],
  'dead-bug-alt': [
    require('../assets/exercise-media/dead-bug/0.png'),
    require('../assets/exercise-media/dead-bug/1.png'),
  ],
  'bicycle-crunch': [
    require('../assets/exercise-media/bicycle-crunch/0.png'),
    require('../assets/exercise-media/bicycle-crunch/1.png'),
  ],
  'mountain-climber': [
    require('../assets/exercise-media/mountain-climber/0.png'),
    require('../assets/exercise-media/mountain-climber/1.png'),
  ],
  'mountain-climber-alt': [
    require('../assets/exercise-media/mountain-climber/0.png'),
    require('../assets/exercise-media/mountain-climber/1.png'),
  ],
  'side-plank': [
    require('../assets/exercise-media/side-plank/0.png'),
    require('../assets/exercise-media/side-plank/1.png'),
  ],
  'leg-raise': [
    require('../assets/exercise-media/leg-raise/0.png'),
    require('../assets/exercise-media/leg-raise/1.png'),
  ],
  'bird-dog': [
    require('../assets/exercise-media/bird-dog/0.png'),
    require('../assets/exercise-media/bird-dog/1.png'),
  ],
  'glute-bridge': [
    require('../assets/exercise-media/glute-bridge/0.png'),
    require('../assets/exercise-media/glute-bridge/1.png'),
  ],
  'reverse-crunch': [
    require('../assets/exercise-media/reverse-crunch/0.png'),
    require('../assets/exercise-media/reverse-crunch/1.png'),
  ],
  crunch: [
    require('../assets/exercise-media/crunch/0.png'),
    require('../assets/exercise-media/crunch/1.png'),
  ],
  'heel-tap': [
    require('../assets/exercise-media/heel-tap/0.png'),
    require('../assets/exercise-media/heel-tap/1.png'),
  ],
  'cat-cow': [
    require('../assets/exercise-media/cat-cow/0.png'),
    require('../assets/exercise-media/cat-cow/1.png'),
  ],
};

/** Required in-app credit lines, shown on the About screen. */
export const CREDIT_LINE =
  'Plank exercise by Pk0001, Wikimedia Commons, CC BY-SA 4.0, https://commons.wikimedia.org/wiki/File:Plank_exercise.svg\n' +
  'Side plank illustrations by Everkinetic, CC BY-SA 4.0, https://github.com/everkinetic/data\n' +
  'Other illustrations: Open Exercise Illustrations, CC0';

export function mediaForExercise(exercise: string): any[] {
  const key = exerciseKeyFor(exercise);
  if (!key) {
    return [];
  }
  const id = EXERCISE_ID_BY_KEY[key];
  return id ? EXERCISE_MEDIA[id] : [];
}
