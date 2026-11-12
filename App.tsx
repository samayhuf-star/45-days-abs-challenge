import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const TOTAL_DAYS = 45;
const STORAGE_KEY = '@abs_challenge_progress';

const PHASES = [
  { name: 'Foundation', days: '1–10', focus: 'Form & Activation', color: '#3B82F6' },
  { name: 'Build', days: '11–25', focus: 'Strength & Volume', color: '#8B5CF6' },
  { name: 'Intensify', days: '26–40', focus: 'Density & Control', color: '#F59E0B' },
  { name: 'Peak', days: '41–45', focus: 'Finish Strong', color: '#EF4444' },
];

const SAMPLE_WORKOUTS: Record<number, { title: string; exercises: string[]; duration: string }> = {
  1: { title: 'Core Activation', exercises: ['Dead Bug 3x10', 'Glute Bridge 3x12', 'Bird Dog 3x8/side', 'Plank 3x20s'], duration: '12 min' },
  2: { title: 'Crunch Foundations', exercises: ['Crunch 3x12', 'Reverse Crunch 3x10', 'Heel Tap 3x12/side', 'Plank 3x25s'], duration: '14 min' },
  12: { title: 'Core Builder', exercises: ['Bicycle Crunch 3x12/side', 'Mountain Climber 3x20', 'Leg Raise 3x10', 'Side Plank 3x20s/side'], duration: '16 min' },
};

export default function App() {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
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
    Alert.alert('Great job!', `Day ${currentDay} complete. Keep the streak going!`);
  };

  const progressPercent = Math.round((completedDays.length / TOTAL_DAYS) * 100);
  const todayWorkout = SAMPLE_WORKOUTS[currentDay] || {
    title: 'Core Training',
    exercises: ['Crunch 3x15', 'Plank 3x30s', 'Leg Raise 3x12', 'Mountain Climber 3x20'],
    duration: '15 min',
  };

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
            5 workout days + 2 recovery days each week. Focus on form over ego.
          </Text>
          {PHASES.map((phase, index) => (
            <View key={index} style={styles.phaseRow}>
              <View style={[styles.phaseDot, { backgroundColor: phase.color }]} />
              <View style={styles.phaseInfo}>
                <Text style={styles.phaseName}>{phase.name}</Text>
                <Text style={styles.phaseDays}>Days {phase.days}</Text>
              </View>
              <Text style={styles.phaseFocus}>{phase.focus}</Text>
            </View>
          ))}
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
              return (
                <View
                  key={day}
                  style={[
                    styles.dayBox,
                    isCompleted && styles.dayCompleted,
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
          <Text style={styles.workoutMeta}>⏱ {todayWorkout.duration}</Text>
          {todayWorkout.exercises.map((ex, i) => (
            <Text key={i} style={styles.exerciseItem}>• {ex}</Text>
          ))}
          <TouchableOpacity style={styles.startButton} onPress={completeToday}>
            <Text style={styles.startButtonText}>Mark Complete</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            45 days of consistent training.{'\n'}Better form. Stronger core. Real results.
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>45{'\n'}DAYS</Text>
          </View>
        </View>

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
  dayCompleted: { backgroundColor: '#3B82F6' },
  dayToday: { backgroundColor: '#2563EB', borderWidth: 2, borderColor: '#60A5FA' },
  dayText: { color: '#8B95A7', fontSize: 11, fontWeight: '600' },
  dayTextActive: { color: '#FFFFFF' },
  workoutCard: {
    backgroundColor: '#141A26', marginHorizontal: 16, borderRadius: 16, padding: 20, marginBottom: 20,
  },
  workoutLabel: { fontSize: 11, fontWeight: '700', color: '#3B82F6', letterSpacing: 1, marginBottom: 6 },
  workoutTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
  workoutMeta: { fontSize: 13, color: '#8B95A7', marginBottom: 10 },
  exerciseItem: { fontSize: 14, color: '#CBD5E1', marginBottom: 4, marginLeft: 4 },
  startButton: {
    backgroundColor: '#3B82F6', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 12,
  },
  startButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  banner: {
    flexDirection: 'row', backgroundColor: '#1E293B', marginHorizontal: 16,
    borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'space-between',
  },
  bannerText: { flex: 1, color: '#CBD5E1', fontSize: 13, lineHeight: 18, marginRight: 12 },
  badge: { backgroundColor: '#F59E0B', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center' },
  badgeText: { color: '#0A0E17', fontWeight: '800', fontSize: 12, textAlign: 'center' },
});
