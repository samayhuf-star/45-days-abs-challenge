import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
  Linking,
  Animated,
  Easing,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video, ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');
const TOTAL_DAYS = 45;
const STORAGE_KEY = '@abs_challenge_progress_v3';
const THEME_KEY = '@abs_challenge_theme';

const PHASES = [
  { name: 'Foundation', days: '1–10', focus: 'Form & Activation', color: '#3B82F6', start: 1, end: 10 },
  { name: 'Build', days: '11–25', focus: 'Strength & Volume', color: '#8B5CF6', start: 11, end: 25 },
  { name: 'Intensify', days: '26–40', focus: 'Density & Control', color: '#F59E0B', start: 26, end: 40 },
  { name: 'Peak', days: '41–45', focus: 'Finish Strong', color: '#EF4444', start: 41, end: 45 },
];

const ACCENT_OPTIONS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

type Workout = {
  title: string;
  exercises: string[];
  duration: string;
  rest: string;
  notes?: string;
};

const WORKOUTS: Record<number, Workout> = {
  1: { title: 'Core Activation', exercises: ['Dead Bug 3×10', 'Glute Bridge 3×12', 'Bird Dog 3×8/side', 'Plank 3×20s'], duration: '12 min', rest: '45s' },
  2: { title: 'Crunch Foundations', exercises: ['Crunch 3×12', 'Reverse Crunch 3×10', 'Heel Tap 3×12/side', 'Plank 3×25s'], duration: '14 min', rest: '45s' },
  3: { title: 'Stability Basics', exercises: ['Dead Bug 3×12', 'Side Plank 3×15s/side', 'Bird Dog 3×10/side', 'Glute Bridge 3×15'], duration: '13 min', rest: '45s' },
  4: { title: 'Lower Abs Intro', exercises: ['Reverse Crunch 3×12', 'Heel Tap 3×15/side', 'Leg Raise (bent) 3×8', 'Plank 3×30s'], duration: '14 min', rest: '45s' },
  5: { title: 'Active Recovery', exercises: ['Cat-Cow 2×10', 'Bird Dog 2×8/side', 'Dead Bug 2×10', 'Gentle Plank 2×20s'], duration: '10 min', rest: '60s', notes: 'Light day – focus on form' },
  6: { title: 'Core Control', exercises: ['Dead Bug 3×12', 'Plank 3×30s', 'Bird Dog 3×10/side', 'Heel Tap 3×12/side'], duration: '15 min', rest: '40s' },
  7: { title: 'Crunch Progress', exercises: ['Crunch 3×15', 'Reverse Crunch 3×12', 'Side Plank 3×20s/side', 'Glute Bridge 3×15'], duration: '15 min', rest: '40s' },
  8: { title: 'Foundation Mix', exercises: ['Dead Bug 3×15', 'Leg Raise 3×10', 'Plank 3×35s', 'Bird Dog 3×10/side'], duration: '16 min', rest: '40s' },
  9: { title: 'Endurance Base', exercises: ['Plank 3×40s', 'Crunch 3×15', 'Reverse Crunch 3×12', 'Side Plank 3×25s/side'], duration: '16 min', rest: '40s' },
  10: { title: 'Foundation Test', exercises: ['Dead Bug 4×12', 'Plank 4×30s', 'Bird Dog 3×12/side', 'Glute Bridge 3×15'], duration: '18 min', rest: '45s' },
  11: { title: 'Volume Increase', exercises: ['Bicycle Crunch 3×12/side', 'Mountain Climber 3×20', 'Leg Raise 3×10', 'Plank 3×40s'], duration: '16 min', rest: '35s' },
  12: { title: 'Core Builder', exercises: ['Bicycle Crunch 3×15/side', 'Mountain Climber 3×25', 'Leg Raise 3×12', 'Side Plank 3×25s/side'], duration: '17 min', rest: '35s' },
  13: { title: 'Strength Focus', exercises: ['Leg Raise 4×10', 'Crunch 3×15', 'Plank 3×45s', 'Bird Dog 3×12/side'], duration: '17 min', rest: '35s' },
  14: { title: 'Density Day', exercises: ['Mountain Climber 4×20', 'Reverse Crunch 3×15', 'Side Plank 3×30s/side', 'Dead Bug 3×12'], duration: '18 min', rest: '30s' },
  15: { title: 'Active Recovery', exercises: ['Dead Bug 2×12', 'Bird Dog 2×10/side', 'Glute Bridge 2×15', 'Plank 2×25s'], duration: '12 min', rest: '60s', notes: 'Recovery – keep it light' },
  16: { title: 'Build Phase', exercises: ['Bicycle Crunch 4×12/side', 'Leg Raise 3×12', 'Mountain Climber 3×30', 'Plank 3×45s'], duration: '18 min', rest: '30s' },
  17: { title: 'Oblique Emphasis', exercises: ['Side Plank 3×35s/side', 'Bicycle Crunch 3×15/side', 'Heel Tap 3×15/side', 'Mountain Climber 3×25'], duration: '17 min', rest: '35s' },
  18: { title: 'Volume Push', exercises: ['Crunch 4×15', 'Leg Raise 4×10', 'Plank 4×35s', 'Bird Dog 3×12/side'], duration: '19 min', rest: '30s' },
  19: { title: 'Control & Density', exercises: ['Dead Bug 4×12', 'Mountain Climber 4×20', 'Reverse Crunch 3×15', 'Side Plank 3×30s/side'], duration: '18 min', rest: '30s' },
  20: { title: 'Mid-Build Test', exercises: ['Bicycle Crunch 4×12/side', 'Leg Raise 3×12', 'Plank 3×50s', 'Mountain Climber 3×30'], duration: '20 min', rest: '35s' },
  21: { title: 'Strength Builder', exercises: ['Leg Raise 4×12', 'Crunch 3×18', 'Side Plank 3×35s/side', 'Dead Bug 3×15'], duration: '18 min', rest: '30s' },
  22: { title: 'High Density', exercises: ['Mountain Climber 4×25', 'Bicycle Crunch 3×15/side', 'Plank 3×45s', 'Reverse Crunch 3×15'], duration: '19 min', rest: '25s' },
  23: { title: 'Build Mix', exercises: ['Dead Bug 4×12', 'Leg Raise 3×12', 'Side Plank 4×25s/side', 'Mountain Climber 3×25'], duration: '19 min', rest: '30s' },
  24: { title: 'Volume Peak', exercises: ['Bicycle Crunch 4×15/side', 'Crunch 4×15', 'Plank 4×40s', 'Bird Dog 3×12/side'], duration: '20 min', rest: '30s' },
  25: { title: 'Build Finale', exercises: ['Leg Raise 4×12', 'Mountain Climber 4×25', 'Side Plank 3×40s/side', 'Dead Bug 4×12'], duration: '21 min', rest: '30s' },
  26: { title: 'Density Start', exercises: ['Mountain Climber 5×20', 'Bicycle Crunch 4×12/side', 'Leg Raise 4×10', 'Plank 4×40s'], duration: '20 min', rest: '25s' },
  27: { title: 'Control Focus', exercises: ['Dead Bug 4×15', 'Side Plank 4×30s/side', 'Reverse Crunch 4×12', 'Bird Dog 4×10/side'], duration: '20 min', rest: '25s' },
  28: { title: 'Intensify Mix', exercises: ['Leg Raise 5×10', 'Mountain Climber 4×25', 'Crunch 4×15', 'Plank 4×45s'], duration: '21 min', rest: '20s' },
  29: { title: 'High Volume', exercises: ['Bicycle Crunch 5×12/side', 'Reverse Crunch 4×15', 'Side Plank 4×30s/side', 'Dead Bug 4×12'], duration: '21 min', rest: '25s' },
  30: { title: 'Active Recovery', exercises: ['Bird Dog 3×10/side', 'Dead Bug 3×12', 'Plank 3×30s', 'Glute Bridge 3×12'], duration: '12 min', rest: '45s', notes: 'Recovery day' },
  31: { title: 'Peak Density', exercises: ['Mountain Climber 5×25', 'Leg Raise 4×12', 'Bicycle Crunch 4×15/side', 'Plank 4×50s'], duration: '22 min', rest: '20s' },
  32: { title: 'Oblique Density', exercises: ['Side Plank 5×30s/side', 'Bicycle Crunch 4×15/side', 'Heel Tap 4×15/side', 'Mountain Climber 4×25'], duration: '21 min', rest: '20s' },
  33: { title: 'Strength Density', exercises: ['Leg Raise 5×12', 'Crunch 4×18', 'Dead Bug 4×15', 'Plank 5×35s'], duration: '22 min', rest: '20s' },
  34: { title: 'Intensify Push', exercises: ['Mountain Climber 5×25', 'Reverse Crunch 4×15', 'Side Plank 4×35s/side', 'Bird Dog 4×12/side'], duration: '22 min', rest: '20s' },
  35: { title: 'Mid-Intensify', exercises: ['Bicycle Crunch 5×15/side', 'Leg Raise 4×12', 'Plank 5×40s', 'Dead Bug 4×15'], duration: '23 min', rest: '20s' },
  36: { title: 'Control Peak', exercises: ['Dead Bug 5×12', 'Side Plank 5×30s/side', 'Reverse Crunch 5×12', 'Mountain Climber 4×25'], duration: '22 min', rest: '20s' },
  37: { title: 'Volume Density', exercises: ['Crunch 5×15', 'Leg Raise 5×10', 'Bicycle Crunch 4×15/side', 'Plank 5×40s'], duration: '23 min', rest: '20s' },
  38: { title: 'High Intensity', exercises: ['Mountain Climber 6×20', 'Side Plank 4×40s/side', 'Reverse Crunch 4×15', 'Dead Bug 5×12'], duration: '23 min', rest: '15s' },
  39: { title: 'Intensify Finale', exercises: ['Leg Raise 5×12', 'Bicycle Crunch 5×12/side', 'Plank 5×45s', 'Bird Dog 4×12/side'], duration: '24 min', rest: '20s' },
  40: { title: 'Pre-Peak Test', exercises: ['Mountain Climber 5×25', 'Leg Raise 5×12', 'Side Plank 5×30s/side', 'Dead Bug 5×12'], duration: '24 min', rest: '20s' },
  41: { title: 'Peak Start', exercises: ['Bicycle Crunch 5×15/side', 'Mountain Climber 5×25', 'Leg Raise 5×12', 'Plank 5×45s'], duration: '22 min', rest: '20s' },
  42: { title: 'Peak Density', exercises: ['Side Plank 5×35s/side', 'Dead Bug 5×15', 'Reverse Crunch 5×12', 'Mountain Climber 5×25'], duration: '23 min', rest: '15s' },
  43: { title: 'Peak Control', exercises: ['Leg Raise 5×15', 'Bicycle Crunch 5×15/side', 'Plank 5×50s', 'Bird Dog 5×10/side'], duration: '23 min', rest: '15s' },
  44: { title: 'Peak Push', exercises: ['Mountain Climber 6×20', 'Crunch 5×15', 'Side Plank 5×30s/side', 'Dead Bug 5×12'], duration: '22 min', rest: '15s' },
  45: { title: 'Final Peak', exercises: ['Bicycle Crunch 5×15/side', 'Leg Raise 5×12', 'Plank 5×45s', 'Mountain Climber 5×25', 'Dead Bug 4×12'], duration: '25 min', rest: '20s', notes: 'You did it. Strong finish.' },
};

const EXERCISE_VIDEOS: Record<string, any> = {
  'Dead Bug': require('./assets/videos/deadbug.mp4'),
  'Plank': require('./assets/videos/plank.mp4'),
  'Bicycle Crunch': require('./assets/videos/bicycle.mp4'),
  'Mountain Climber': require('./assets/videos/mountain.mp4'),
  'Side Plank': require('./assets/videos/sideplank.mp4'),
  'Leg Raise': require('./assets/videos/legraise.mp4'),
  'Bird Dog': require('./assets/videos/birddog.mp4'),
  'Glute Bridge': require('./assets/videos/glutebridge.mp4'),
  'Reverse Crunch': require('./assets/videos/reversecrunch.mp4'),
  'Crunch': require('./assets/videos/crunch.mp4'),
  'Heel Tap': require('./assets/videos/heeltap.mp4'),
  'Cat-Cow': require('./assets/videos/catcow.mp4'),
};

function getVideoUrl(exercise: string): any | null {
  for (const key of Object.keys(EXERCISE_VIDEOS)) {
    if (exercise.toLowerCase().includes(key.toLowerCase())) {
      return EXERCISE_VIDEOS[key];
    }
  }
  return null;
}

function parseRestSeconds(rest: string): number {
  const match = rest.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 30;
}

function getPhaseForDay(day: number) {
  return PHASES.find(p => day >= p.start && day <= p.end) || PHASES[0];
}

function estimateSets(exercises: string[]): number {
  return exercises.reduce((sum, ex) => {
    const m = ex.match(/(\d+)×/);
    return sum + (m ? parseInt(m[1], 10) : 1);
  }, 0);
}

export default function App() {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [restSeconds, setRestSeconds] = useState(0);
  const [restActive, setRestActive] = useState(false);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const [isDark, setIsDark] = useState(true);
  const [accent, setAccent] = useState('#3B82F6');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadProgress();
    loadTheme();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const loadTheme = async () => {
    try {
      const t = await AsyncStorage.getItem(THEME_KEY);
      if (t) {
        const parsed = JSON.parse(t);
        setIsDark(parsed.isDark !== false);
        setAccent(parsed.accent || '#3B82F6');
      }
    } catch {}
  };

  const saveTheme = async (dark: boolean, acc: string) => {
    await AsyncStorage.setItem(THEME_KEY, JSON.stringify({ isDark: dark, accent: acc }));
  };

  const loadProgress = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        setCompletedDays(parsed.completedDays || []);
        setCurrentDay(parsed.currentDay || 1);
        setStreak(parsed.streak || 0);
      }
    } catch (e) {
      console.log('Load error', e);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (newCompleted: number[], newCurrent: number, newStreak: number) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ completedDays: newCompleted, currentDay: newCurrent, streak: newStreak })
      );
    } catch (e) {
      console.log('Save error', e);
    }
  };

  const startRestTimer = (seconds: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRestSeconds(seconds);
    setRestActive(true);
    timerRef.current = setInterval(() => {
      setRestSeconds(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setRestActive(false);
          Alert.alert('Rest over', 'Next set ready.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopRestTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRestActive(false);
    setRestSeconds(0);
  };

  const animateComplete = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.08, duration: 180, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
    ]).start();
  };

  const completeToday = () => {
    if (completedDays.includes(currentDay)) {
      Alert.alert('Already done', "You already completed today's workout.");
      return;
    }
    animateComplete();
    const newCompleted = [...completedDays, currentDay];
    const nextDay = Math.min(currentDay + 1, TOTAL_DAYS);
    const newStreak = streak + 1;
    setCompletedDays(newCompleted);
    setCurrentDay(nextDay);
    setStreak(newStreak);
    saveProgress(newCompleted, nextDay, newStreak);
    const msg = currentDay === TOTAL_DAYS
      ? 'Challenge complete! You finished all 45 days. 🎉'
      : `Day ${currentDay} complete. Keep the streak going! 🔥`;
    Alert.alert('Great job!', msg);
  };

  const resetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'This will clear all completed days and reset your streak. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setCompletedDays([]);
            setCurrentDay(1);
            setStreak(0);
            await AsyncStorage.removeItem(STORAGE_KEY);
          },
        },
      ]
    );
  };

  const openLink = (url: string) => Linking.openURL(url).catch(() => {});

  const progressPercent = Math.round((completedDays.length / TOTAL_DAYS) * 100);
  const todayWorkout = WORKOUTS[currentDay] || WORKOUTS[1];
  const currentPhase = getPhaseForDay(currentDay);
  const defaultRest = parseRestSeconds(todayWorkout.rest);
  const setsToday = estimateSets(todayWorkout.exercises);
  const weekMinutes = Math.round(
    completedDays.filter(d => d > currentDay - 7).length * 16
  );

  const colors = {
    bg: isDark ? '#0E1514' : '#F8FAFC',
    card: isDark ? '#1E293B' : '#FFFFFF',
    text: isDark ? '#F1F5F9' : '#0F172A',
    sub: isDark ? '#94A3B8' : '#64748B',
    border: isDark ? '#334155' : '#E2E8F0',
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>45 Days Abs Challenge</Text>
            <Text style={[styles.headerSubtitle, { color: colors.sub }]}>Practical. Progressive. Sustainable.</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              const next = !isDark;
              setIsDark(next);
              saveTheme(next, accent);
            }}
            style={styles.themeToggle}
          >
            <Text style={{ fontSize: 20 }}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.accentRow}>
          {ACCENT_OPTIONS.map(c => (
            <TouchableOpacity
              key={c}
              onPress={() => { setAccent(c); saveTheme(isDark, c); }}
              style={[styles.accentDot, { backgroundColor: c }, accent === c && styles.accentDotActive]}
            />
          ))}
        </View>

        <View style={[styles.streakCard, { backgroundColor: colors.card }]}>
          <View style={styles.streakLeft}>
            <View style={[styles.fireCircle, { backgroundColor: accent + '22' }]}>
              <Text style={styles.fireEmoji}>🔥</Text>
            </View>
            <View>
              <Text style={[styles.streakNumber, { color: colors.text }]}>{streak}</Text>
              <Text style={[styles.streakLabel, { color: colors.sub }]}>Day Streak</Text>
            </View>
          </View>
          <View style={styles.progressCircle}>
            <Text style={[styles.progressPercent, { color: accent }]}>{progressPercent}%</Text>
            <Text style={[styles.progressLabel, { color: colors.sub }]}>Complete</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: accent }]}>{setsToday}</Text>
            <Text style={[styles.statLabel, { color: colors.sub }]}>Sets today</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: accent }]}>{weekMinutes}</Text>
            <Text style={[styles.statLabel, { color: colors.sub }]}>Min this week</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.statValue, { color: accent }]}>{currentDay}</Text>
            <Text style={[styles.statLabel, { color: colors.sub }]}>Current day</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your 45-Day Plan</Text>
          <Text style={[styles.phaseIntro, { color: colors.sub }]}>
            Progressive overload across 4 phases. Form first, then volume, then density.
          </Text>
          {PHASES.map((phase, index) => {
            const active = phase.name === currentPhase.name;
            return (
              <View key={index} style={[styles.phaseRow, { backgroundColor: colors.card, borderColor: colors.border }, active && { borderColor: accent }]}>
                <View style={[styles.phaseDot, { backgroundColor: phase.color }]} />
                <View style={styles.phaseInfo}>
                  <Text style={[styles.phaseName, { color: colors.text }]}>{phase.name}{active ? '  •  Current' : ''}</Text>
                  <Text style={[styles.phaseDays, { color: colors.sub }]}>Days {phase.days}</Text>
                </View>
                <Text style={[styles.phaseFocus, { color: colors.sub }]}>{phase.focus}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Progress</Text>
            <Text style={[styles.dayCounter, { color: colors.sub }]}>Day {currentDay} of {TOTAL_DAYS}</Text>
          </View>
          <View style={styles.calendarGrid}>
            {Array.from({ length: TOTAL_DAYS }, (_, i) => {
              const day = i + 1;
              const isCompleted = completedDays.includes(day);
              const isToday = day === currentDay && !isCompleted;
              const phase = getPhaseForDay(day);
              return (
                <View
                  key={day}
                  style={[
                    styles.dayBox,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    isCompleted && { backgroundColor: phase.color, borderColor: phase.color },
                    isToday && { borderColor: accent, borderWidth: 2 },
                  ]}
                >
                  <Text style={[styles.dayText, { color: isCompleted || isToday ? '#fff' : colors.sub }]}>
                    {isCompleted ? '✓' : day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={[styles.workoutCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.workoutLabel, { color: accent }]}>TODAY'S WORKOUT</Text>
          <Text style={[styles.workoutTitle, { color: colors.text }]}>Day {currentDay} – {todayWorkout.title}</Text>
          <Text style={[styles.workoutMeta, { color: colors.sub }]}>⏱ {todayWorkout.duration}  •  Rest {todayWorkout.rest}</Text>
          {todayWorkout.notes ? <Text style={[styles.workoutNotes, { color: '#F59E0B' }]}>{todayWorkout.notes}</Text> : null}

          {todayWorkout.exercises.map((ex, i) => {
            const videoSource = getVideoUrl(ex);
            return (
              <View key={i} style={[styles.exerciseCard, { backgroundColor: isDark ? '#0F172A' : '#F1F5F9', borderColor: colors.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.exerciseTitle, { color: colors.text }]}>{ex}</Text>
                  <Text style={[styles.exerciseSub, { color: colors.sub }]}>Tap to watch form</Text>
                </View>
                {videoSource && (
                  <TouchableOpacity
                    style={[styles.watchBtn, { backgroundColor: accent }]}
                    onPress={() => setActiveVideo(videoSource)}
                  >
                    <Text style={styles.watchBtnText}>▶ Form</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          <View style={styles.timerSection}>
            {restActive ? (
              <View style={styles.timerActive}>
                <Text style={[styles.timerBig, { color: accent }]}>{restSeconds}</Text>
                <Text style={[styles.timerLabel, { color: colors.sub }]}>seconds rest</Text>
                <View style={styles.timerBarBg}>
                  <View style={[styles.timerBarFill, { width: `${(restSeconds / defaultRest) * 100}%`, backgroundColor: accent }]} />
                </View>
                <TouchableOpacity style={styles.stopBtn} onPress={stopRestTimer}>
                  <Text style={styles.stopBtnText}>Stop</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.timerStartBtn, { borderColor: accent }]}
                onPress={() => startRestTimer(defaultRest)}
              >
                <Text style={[styles.timerStartText, { color: accent }]}>Start {defaultRest}s Rest Timer</Text>
              </TouchableOpacity>
            )}
          </View>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: accent }, completedDays.includes(currentDay) && styles.startButtonDone]}
              onPress={completeToday}
              disabled={completedDays.includes(currentDay)}
            >
              <Text style={styles.startButtonText}>
                {completedDays.includes(currentDay) ? 'Completed ✓' : 'Mark Complete'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>


        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Nutrition for Core Definition</Text>
          <Text style={[styles.nutritionIntro, { color: colors.sub }]}>
            Training builds the muscle. Nutrition determines if it shows.
          </Text>
          <View style={[styles.nutritionCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.nutritionTip, { color: colors.text }]}>• Mild calorie deficit (300–500 kcal below maintenance)</Text>
            <Text style={[styles.nutritionTip, { color: colors.text }]}>• Protein: 1.6–2.2g per kg body weight</Text>
            <Text style={[styles.nutritionTip, { color: colors.text }]}>• Cut sugary drinks and liquid calories</Text>
            <Text style={[styles.nutritionTip, { color: colors.text }]}>• Prioritize whole foods and vegetables</Text>
            <Text style={[styles.nutritionTip, { color: colors.text }]}>• Manage sodium and stay hydrated</Text>
            <Text style={[styles.nutritionTip, { color: colors.text }]}>• Consistent sleep supports fat loss</Text>
          </View>
          <Text style={[styles.nutritionNote, { color: colors.sub }]}>
            Abs become more visible at lower body fat. Spot reduction does not work.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <TouchableOpacity onPress={() => openLink('https://samayhuf-star.github.io/45-days-abs-challenge/privacy/')}>
            <Text style={[styles.link, { color: accent }]}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink('https://samayhuf-star.github.io/45-days-abs-challenge/support/')}>
            <Text style={[styles.link, { color: accent }]}>Support</Text>
          </TouchableOpacity>
          <Text style={[styles.aboutNote, { color: colors.sub }]}>
            Progressive 45-day core program. Focus on form, consistency, and gradual overload.
          </Text>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
          <Text style={[styles.resetButtonText, { color: colors.sub }]}>Reset Progress</Text>
        </TouchableOpacity>
      </ScrollView>

      {activeVideo && (
        <View style={styles.videoModal}>
          <Video
            source={activeVideo}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
          />
          <TouchableOpacity style={[styles.closeVideo, { backgroundColor: accent }]} onPress={() => setActiveVideo(null)}>
            <Text style={styles.closeVideoText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingText: { textAlign: 'center', marginTop: 100, fontSize: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: '800' },
  headerSubtitle: { fontSize: 13, marginTop: 2 },
  themeToggle: { padding: 8 },
  accentRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 8 },
  accentDot: { width: 28, height: 28, borderRadius: 14 },
  accentDotActive: { borderWidth: 3, borderColor: '#fff' },
  streakCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, borderRadius: 18, padding: 16, marginBottom: 12 },
  streakLeft: { flexDirection: 'row', alignItems: 'center' },
  fireCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  fireEmoji: { fontSize: 28 },
  streakNumber: { fontSize: 32, fontWeight: '800' },
  streakLabel: { fontSize: 13 },
  progressCircle: { alignItems: 'center' },
  progressPercent: { fontSize: 22, fontWeight: '800' },
  progressLabel: { fontSize: 12 },
  statsRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 16, gap: 8 },
  statBox: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, marginTop: 2 },
  section: { marginHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  nutritionIntro: { fontSize: 13, marginBottom: 12, lineHeight: 18 },
  nutritionCard: { borderRadius: 12, padding: 14, marginBottom: 10 },
  nutritionTip: { fontSize: 14, marginBottom: 6, lineHeight: 20 },
  nutritionNote: { fontSize: 12, fontStyle: 'italic', lineHeight: 17 },
  phaseIntro: { fontSize: 13, marginBottom: 10, lineHeight: 18 },
  phaseRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 6, borderWidth: 1 },
  phaseDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  phaseInfo: { flex: 1 },
  phaseName: { fontSize: 15, fontWeight: '600' },
  phaseDays: { fontSize: 12 },
  phaseFocus: { fontSize: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  dayCounter: { fontSize: 13 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  dayBox: { width: (width - 48) / 9 - 2, aspectRatio: 1, borderRadius: 6, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  dayText: { fontSize: 11, fontWeight: '600' },
  workoutCard: { marginHorizontal: 16, borderRadius: 18, padding: 16, marginBottom: 16 },
  workoutLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  workoutTitle: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  workoutMeta: { fontSize: 13, marginBottom: 8 },
  workoutNotes: { fontSize: 13, marginBottom: 10, fontStyle: 'italic' },
  exerciseCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1 },
  exerciseTitle: { fontSize: 15, fontWeight: '600' },
  exerciseSub: { fontSize: 12, marginTop: 2 },
  watchBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  watchBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  timerSection: { marginVertical: 16 },
  timerActive: { alignItems: 'center' },
  timerBig: { fontSize: 64, fontWeight: '800' },
  timerLabel: { fontSize: 14, marginBottom: 8 },
  timerBarBg: { width: '100%', height: 8, backgroundColor: '#334155', borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  timerBarFill: { height: '100%' },
  stopBtn: { paddingHorizontal: 20, paddingVertical: 8, backgroundColor: '#334155', borderRadius: 8 },
  stopBtnText: { color: '#fff', fontWeight: '600' },
  timerStartBtn: { borderWidth: 2, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  timerStartText: { fontSize: 16, fontWeight: '700' },
  startButton: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  startButtonDone: { backgroundColor: '#334155' },
  startButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  link: { fontSize: 15, marginBottom: 8, fontWeight: '500' },
  aboutNote: { fontSize: 13, marginTop: 8, lineHeight: 18 },
  resetButton: { marginHorizontal: 16, marginBottom: 30, paddingVertical: 12, alignItems: 'center' },
  resetButtonText: { fontSize: 14 },
  videoModal: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  video: { width: width * 0.92, height: width * 0.65, backgroundColor: '#000', borderRadius: 12 },
  closeVideo: { marginTop: 20, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 10 },
  closeVideoText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
