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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video, ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');
const TOTAL_DAYS = 45;
const STORAGE_KEY = '@abs_challenge_progress_v2';

const PHASES = [
  { name: 'Foundation', days: '1–10', focus: 'Form & Activation', color: '#3B82F6', start: 1, end: 10 },
  { name: 'Build', days: '11–25', focus: 'Strength & Volume', color: '#8B5CF6', start: 11, end: 25 },
  { name: 'Intensify', days: '26–40', focus: 'Density & Control', color: '#F59E0B', start: 26, end: 40 },
  { name: 'Peak', days: '41–45', focus: 'Finish Strong', color: '#EF4444', start: 41, end: 45 },
];

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

export default function App() {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [restSeconds, setRestSeconds] = useState(0);
  const [restActive, setRestActive] = useState(false);
  const [activeVideo, setActiveVideo] = useState<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    loadProgress();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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

  const completeToday = () => {
    if (completedDays.includes(currentDay)) {
      Alert.alert('Already done', "You already completed today's workout.");
      return;
    }
    const newCompleted = [...completedDays, currentDay];
    const nextDay = Math.min(currentDay + 1, TOTAL_DAYS);
    const newStreak = streak + 1;
    setCompletedDays(newCompleted);
    setCurrentDay(nextDay);
    setStreak(newStreak);
    saveProgress(newCompleted, nextDay, newStreak);
    const msg = currentDay === TOTAL_DAYS
      ? 'Challenge complete! You finished all 45 days.'
      : `Day ${currentDay} complete. Keep the streak going!`;
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>45 Days Abs Challenge</Text>
          <Text style={styles.headerSubtitle}>Practical. Progressive. Sustainable.</Text>
        </View>

        <View style={styles.streakCard}>
          <View style={styles.streakLeft}>
            <View style={styles.fireCircle}>
              <Text style={styles.fireEmoji}>🔥</Text>
            </View>
            <View>
              <Text style={styles.streakNumber}>{streak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
            <Text style={styles.progressLabel}>Complete</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your 45-Day Plan</Text>
          <Text style={styles.phaseIntro}>
            Progressive overload across 4 phases. Form first, then volume, then density.
          </Text>
          {PHASES.map((phase, index) => {
            const active = phase.name === currentPhase.name;
            return (
              <View key={index} style={[styles.phaseRow, active && styles.phaseRowActive]}>
                <View style={[styles.phaseDot, { backgroundColor: phase.color }]} />
                <View style={styles.phaseInfo}>
                  <Text style={styles.phaseName}>{phase.name}{active ? '  •  Current' : ''}</Text>
                  <Text style={styles.phaseDays}>Days {phase.days}</Text>
                </View>
                <Text style={styles.phaseFocus}>{phase.focus}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Progress</Text>
            <Text style={styles.dayCounter}>Day {currentDay} of {TOTAL_DAYS}</Text>
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
                    isCompleted && { backgroundColor: phase.color },
                    isToday && styles.dayToday,
                  ]}
                >
                  <Text style={[styles.dayText, (isCompleted || isToday) && styles.dayTextActive]}>
                    {isCompleted ? '✓' : day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.workoutCard}>
          <Text style={styles.workoutLabel}>TODAY'S WORKOUT</Text>
          <Text style={styles.workoutTitle}>Day {currentDay} – {todayWorkout.title}</Text>
          <Text style={styles.workoutMeta}>⏱ {todayWorkout.duration}  •  Rest {todayWorkout.rest}</Text>
          {todayWorkout.notes ? <Text style={styles.workoutNotes}>{todayWorkout.notes}</Text> : null}

          {todayWorkout.exercises.map((ex, i) => {
            const videoSource = getVideoUrl(ex);
            return (
              <View key={i} style={styles.exerciseRow}>
                <Text style={styles.exerciseItem}>• {ex}</Text>
                {videoSource && (
                  <TouchableOpacity onPress={() => setActiveVideo(videoSource)}>
                    <Text style={styles.videoLink}>Watch form</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}

          <View style={styles.timerRow}>
            {restActive ? (
              <>
                <Text style={styles.timerText}>Rest: {restSeconds}s</Text>
                <TouchableOpacity style={styles.timerButtonSmall} onPress={stopRestTimer}>
                  <Text style={styles.timerButtonText}>Stop</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.timerButton}
                onPress={() => startRestTimer(defaultRest)}
              >
                <Text style={styles.timerButtonText}>Start {defaultRest}s Rest Timer</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[styles.startButton, completedDays.includes(currentDay) && styles.startButtonDone]}
            onPress={completeToday}
            disabled={completedDays.includes(currentDay)}
          >
            <Text style={styles.startButtonText}>
              {completedDays.includes(currentDay) ? 'Completed' : 'Mark Complete'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity onPress={() => openLink('https://samayhuf-star.github.io/45-days-abs-challenge/privacy/')}>
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink('https://samayhuf-star.github.io/45-days-abs-challenge/support/')}>
            <Text style={styles.link}>Support</Text>
          </TouchableOpacity>
          <Text style={styles.aboutNote}>All progress is stored only on this device. No accounts. No ads.</Text>
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
          <Text style={styles.resetButtonText}>Reset Progress</Text>
        </TouchableOpacity>

        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            45 days of consistent training.{'\n'}Better form. Stronger core. Real results.
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>45{'\n'}DAYS</Text>
          </View>
        </View>

        
        {activeVideo && (
          <View style={styles.videoModal}>
            <Video
              source={activeVideo}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              isLooping
            />
            <TouchableOpacity style={styles.closeVideo} onPress={() => setActiveVideo(null)}>
              <Text style={styles.closeVideoText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0E17' },
  loadingText: { color: '#fff', textAlign: 'center', marginTop: 100 },
  header: { paddingTop: 16, paddingHorizontal: 20, alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 13, color: '#8B95A7', marginTop: 4 },
  streakCard: {
    flexDirection: 'row', backgroundColor: '#141A26', marginHorizontal: 16,
    borderRadius: 16, padding: 16, justifyContent: 'space-between', alignItems: 'center', marginBottom: 24,
  },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  fireCircle: {
    width: 56, height: 56, borderRadius: 28, borderWidth: 3, borderColor: '#3B82F6',
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E293B',
  },
  fireEmoji: { fontSize: 24 },
  streakNumber: { fontSize: 28, fontWeight: '700', color: '#FFFFFF' },
  streakLabel: { fontSize: 13, color: '#8B95A7' },
  progressCircle: { alignItems: 'center' },
  progressPercent: { fontSize: 24, fontWeight: '700', color: '#F59E0B' },
  progressLabel: { fontSize: 11, color: '#8B95A7' },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '600', color: '#FFFFFF', marginBottom: 8 },
  phaseIntro: { fontSize: 13, color: '#8B95A7', marginBottom: 16, lineHeight: 18 },
  phaseRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#141A26',
    borderRadius: 12, padding: 12, marginBottom: 8,
  },
  phaseRowActive: { borderWidth: 1, borderColor: '#3B82F6' },
  phaseDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  phaseInfo: { flex: 1 },
  phaseName: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  phaseDays: { fontSize: 12, color: '#8B95A7', marginTop: 2 },
  phaseFocus: { fontSize: 12, color: '#3B82F6', fontWeight: '500' },
  dayCounter: { fontSize: 13, color: '#3B82F6', fontWeight: '500' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  dayBox: {
    width: (width - 32 - 30) / 7, aspectRatio: 1, borderRadius: 7,
    backgroundColor: '#1E293B', justifyContent: 'center', alignItems: 'center',
  },
  dayToday: { backgroundColor: '#2563EB', borderWidth: 2, borderColor: '#60A5FA' },
  dayText: { color: '#8B95A7', fontSize: 11, fontWeight: '600' },
  dayTextActive: { color: '#FFFFFF' },
  workoutCard: {
    backgroundColor: '#141A26', marginHorizontal: 16, borderRadius: 16, padding: 20, marginBottom: 12,
  },
  workoutLabel: { fontSize: 11, fontWeight: '700', color: '#3B82F6', letterSpacing: 1, marginBottom: 6 },
  workoutTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
  workoutMeta: { fontSize: 13, color: '#8B95A7', marginBottom: 8 },
  workoutNotes: { fontSize: 13, color: '#F59E0B', marginBottom: 10, fontStyle: 'italic' },
  exerciseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  exerciseItem: { fontSize: 14, color: '#CBD5E1', flex: 1 },
  videoLink: { color: '#3B82F6', fontSize: 13, fontWeight: '600', marginLeft: 8 },
  timerRow: { marginTop: 12, marginBottom: 8 },
  timerButton: {
    backgroundColor: '#1E293B', borderRadius: 10, paddingVertical: 12, alignItems: 'center',
    borderWidth: 1, borderColor: '#3B82F6',
  },
  timerButtonSmall: {
    backgroundColor: '#334155', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 14, marginLeft: 12,
  },
  timerButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  timerText: { color: '#F59E0B', fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  startButton: {
    backgroundColor: '#3B82F6', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 12,
  },
  startButtonDone: { backgroundColor: '#334155' },
  startButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  link: { color: '#3B82F6', fontSize: 15, marginBottom: 8, fontWeight: '500' },
  aboutNote: { fontSize: 13, color: '#8B95A7', marginTop: 8, lineHeight: 18 },
  resetButton: {
    marginHorizontal: 16, marginBottom: 20, paddingVertical: 12, alignItems: 'center',
  },
  resetButtonText: { color: '#8B95A7', fontSize: 14 },
  banner: {
    flexDirection: 'row', backgroundColor: '#1E293B', marginHorizontal: 16,
    borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'space-between',
  },
  bannerText: { flex: 1, color: '#CBD5E1', fontSize: 13, lineHeight: 18, marginRight: 12 },
  badge: { backgroundColor: '#F59E0B', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center' },
  badgeText: { color: '#0A0E17', fontWeight: '800', fontSize: 12, textAlign: 'center' },
  videoModal: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center', zIndex: 10,
  },
  video: { width: width * 0.9, height: width * 0.6, backgroundColor: '#000' },
  closeVideo: { marginTop: 20, backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  closeVideoText: { color: '#fff', fontWeight: '700' },

});
