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
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { IapProvider, useIapContext } from './src/IapProvider';
import { Paywall } from './src/Paywall';
import { MANAGE_SUBSCRIPTIONS_URL, PRIVACY_URL, SUPPORT_URL, TERMS_URL } from './src/products';
import { CREDIT_LINE, mediaForExercise } from './src/exerciseMedia';
import {
  PHASES,
  TOTAL_DAYS,
  WORKOUTS,
  estimateSets,
  getPhaseForDay,
  isDayUnlocked,
  parseDurationMinutes,
  parseRestSeconds,
} from './src/workouts';

const { width } = Dimensions.get('window');
const STORAGE_KEY = '@abs_challenge_progress_v3';
const THEME_KEY = '@abs_challenge_theme';
const ACCENT_OPTIONS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

function AppInner() {
  const iap = useIapContext();
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [restSeconds, setRestSeconds] = useState(0);
  const [restActive, setRestActive] = useState(false);
  const [activeForm, setActiveForm] = useState<any[] | null>(null);
  const formFade = useRef(new Animated.Value(0)).current;
  const [isDark, setIsDark] = useState(true);
  const [accent, setAccent] = useState('#3B82F6');
  const [paywallOpen, setPaywallOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadProgress();
    loadTheme();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!activeForm || activeForm.length < 2) {
      formFade.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(formFade, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.delay(700),
        Animated.timing(formFade, { toValue: 0, duration: 900, useNativeDriver: true }),
        Animated.delay(700),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [activeForm, formFade]);

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
        const loadedDay = parsed.currentDay || 1;
        setCompletedDays(parsed.completedDays || []);
        setCurrentDay(loadedDay);
        setSelectedDay(loadedDay);
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
      setRestSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
  };

  useEffect(() => {
    if (!restActive || restSeconds !== 0) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setRestActive(false);
    Alert.alert('Rest over', 'Next set ready.');
  }, [restActive, restSeconds]);

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
    if (!isDayUnlocked(currentDay, iap.isPro)) {
      setPaywallOpen(true);
      return;
    }
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
    setSelectedDay(nextDay);
    setStreak(newStreak);
    saveProgress(newCompleted, nextDay, newStreak);
    const msg =
      currentDay === TOTAL_DAYS
        ? 'Challenge complete. You finished all 45 days.'
        : `Day ${currentDay} complete. Keep the streak going.`;
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
            setSelectedDay(1);
            setStreak(0);
            await AsyncStorage.removeItem(STORAGE_KEY);
          },
        },
      ]
    );
  };

  const openLink = (url: string) => Linking.openURL(url).catch(() => {});

  const selectDay = (day: number) => {
    setSelectedDay(day);
    if (!isDayUnlocked(day, iap.isPro)) {
      setPaywallOpen(true);
    }
  };

  const progressPercent = Math.round((completedDays.length / TOTAL_DAYS) * 100);
  const todayWorkout = WORKOUTS[selectedDay] || WORKOUTS[currentDay] || WORKOUTS[1];
  const currentPhase = getPhaseForDay(selectedDay);
  const defaultRest = parseRestSeconds(todayWorkout.rest);
  const setsToday = estimateSets(todayWorkout.exercises);
  const weekMinutes = completedDays
    .filter((d) => d > currentDay - 7 && d <= currentDay)
    .reduce((sum, d) => sum + parseDurationMinutes((WORKOUTS[d] || todayWorkout).duration), 0);
  const unlocked = isDayUnlocked(selectedDay, iap.isPro);

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
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView testID="home-screen" style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView showsVerticalScrollIndicator={false} testID="home-scroll">
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>45 Days Abs Challenge</Text>
            <Text style={[styles.headerSubtitle, { color: colors.sub }]}>Practical. Progressive. Sustainable.</Text>
          </View>
          {!iap.isPro && (
            <TouchableOpacity testID="unlock-pro" onPress={() => setPaywallOpen(true)} style={styles.unlockBtn}>
              <Text style={[styles.unlockBtnText, { color: accent }]}>Pro</Text>
            </TouchableOpacity>
          )}
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
          {ACCENT_OPTIONS.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => {
                setAccent(c);
                saveTheme(isDark, c);
              }}
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
            Progressive work across 4 phases. Form first, then volume, then density.
          </Text>
          {PHASES.map((phase, index) => {
            const active = phase.name === currentPhase.name;
            return (
              <View
                key={index}
                style={[
                  styles.phaseRow,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  active && { borderColor: accent },
                ]}
              >
                <View style={[styles.phaseDot, { backgroundColor: phase.color }]} />
                <View style={styles.phaseInfo}>
                  <Text style={[styles.phaseName, { color: colors.text }]}>
                    {phase.name}
                    {active ? '  •  Current' : ''}
                  </Text>
                  <Text style={[styles.phaseDays, { color: colors.sub }]}>Days {phase.days}</Text>
                </View>
                <Text style={[styles.phaseFocus, { color: colors.sub }]}>{phase.focus}</Text>
              </View>
            );
          })}
        </View>

        <View testID="progress-section" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Progress</Text>
            <Text style={[styles.dayCounter, { color: colors.sub }]}>
              Day {currentDay} of {TOTAL_DAYS}
            </Text>
          </View>
          <View testID="calendar-grid" style={styles.calendarGrid}>
            {Array.from({ length: TOTAL_DAYS }, (_, i) => {
              const day = i + 1;
              const isCompleted = completedDays.includes(day);
              const isToday = day === currentDay && !isCompleted;
              const isSelected = day === selectedDay;
              const phase = getPhaseForDay(day);
              const locked = !isDayUnlocked(day, iap.isPro);
              return (
                <TouchableOpacity
                  key={day}
                  testID={`calendar-day-${day}`}
                  onPress={() => selectDay(day)}
                  style={[
                    styles.dayBox,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    isCompleted && { backgroundColor: phase.color, borderColor: phase.color },
                    isToday && { borderColor: accent, borderWidth: 2 },
                    isSelected && !isCompleted && { borderColor: accent, borderWidth: 2 },
                    locked && { opacity: 0.55 },
                  ]}
                >
                  <Text style={[styles.dayText, { color: isCompleted ? '#FFFFFF' : isToday ? accent : colors.sub }]}>
                    {isCompleted ? '✓' : locked ? '🔒' : day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View testID="workout-card" style={[styles.workoutCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.workoutLabel, { color: accent }]}>
            {selectedDay === currentDay ? "TODAY'S WORKOUT" : `DAY ${selectedDay}`}
          </Text>
          <Text style={[styles.workoutTitle, { color: colors.text }]}>
            Day {selectedDay} – {todayWorkout.title}
          </Text>
          <Text style={[styles.workoutMeta, { color: colors.sub }]}>
            ⏱ {todayWorkout.duration}  •  Rest {todayWorkout.rest}
          </Text>
          {todayWorkout.notes ? <Text style={[styles.workoutNotes, { color: '#F59E0B' }]}>{todayWorkout.notes}</Text> : null}

          {!unlocked ? (
            <View testID="locked-workout">
              <Text style={[styles.lockedCopy, { color: colors.sub }]}>
                This day is in the Pro plan. Days 1 to 7 stay free.
              </Text>
              <TouchableOpacity
                testID="unlock-pro-workout"
                onPress={() => setPaywallOpen(true)}
                style={[styles.startButton, { backgroundColor: accent }]}
              >
                <Text style={styles.startButtonText}>Unlock Pro</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {todayWorkout.exercises.map((ex, i) => {
                const frames = mediaForExercise(ex);
                return (
                  <View
                    key={i}
                    style={[
                      styles.exerciseCard,
                      { backgroundColor: isDark ? '#0F172A' : '#F1F5F9', borderColor: colors.border },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.exerciseTitle, { color: colors.text }]}>{ex}</Text>
                      <Text style={[styles.exerciseSub, { color: colors.sub }]}>Tap to see form</Text>
                    </View>
                    {frames.length > 0 && (
                      <TouchableOpacity
                        testID={`form-button-${i}`}
                        style={[styles.watchBtn, { backgroundColor: accent }]}
                        onPress={() => setActiveForm(frames)}
                      >
                        <Text style={styles.watchBtnText}>Form</Text>
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
                      <View
                        style={[
                          styles.timerBarFill,
                          { backgroundColor: accent, width: `${Math.max(0, (restSeconds / defaultRest) * 100)}%` },
                        ]}
                      />
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
                    <Text style={[styles.timerStartText, { color: accent }]}>Start {defaultRest}s rest</Text>
                  </TouchableOpacity>
                )}
              </View>

              {selectedDay === currentDay && (
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <TouchableOpacity
                    testID="mark-complete"
                    style={[
                      styles.startButton,
                      { backgroundColor: accent },
                      completedDays.includes(currentDay) && styles.startButtonDone,
                    ]}
                    onPress={completeToday}
                  >
                    <Text style={styles.startButtonText}>
                      {completedDays.includes(currentDay) ? 'Completed ✓' : 'Mark Complete'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </>
          )}
        </View>


        <View testID="nutrition-section" style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Nutrition Tips</Text>
          <Text style={[styles.nutritionIntro, { color: colors.sub }]}>
            Training and everyday eating habits work together. These are general suggestions, not a personal meal plan or medical advice.
          </Text>
          <View testID="nutrition-card" style={[styles.nutritionCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.nutritionTip, { color: colors.text }]}>• Choose a calorie target that matches your energy needs</Text>
            <Text style={[styles.nutritionTip, { color: colors.text }]}>• Include a protein source in your meals</Text>
            <Text style={[styles.nutritionTip, { color: colors.text }]}>• Limit sugary drinks</Text>
            <Text style={[styles.nutritionTip, { color: colors.text }]}>• Prioritize whole foods and vegetables</Text>
            <Text style={[styles.nutritionTip, { color: colors.text }]}>• Manage sodium and stay hydrated</Text>
            <Text style={[styles.nutritionTip, { color: colors.text }]}>• Consistent sleep supports recovery</Text>
          </View>
          <Text style={[styles.nutritionNote, { color: colors.sub }]}>
            Results vary from person to person. This plan does not promise a particular look. Consult a professional if you are unsure.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <TouchableOpacity onPress={() => openLink(PRIVACY_URL)}>
            <Text style={[styles.link, { color: accent }]}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink(TERMS_URL)}>
            <Text style={[styles.link, { color: accent }]}>Terms of Use</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink(SUPPORT_URL)}>
            <Text style={[styles.link, { color: accent }]}>Support</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="manage-subscriptions" onPress={() => openLink(MANAGE_SUBSCRIPTIONS_URL)}>
            <Text style={[styles.link, { color: accent }]}>Manage Subscriptions</Text>
          </TouchableOpacity>
          <Text style={[styles.aboutNote, { color: colors.sub }]}>
            Progressive 45-day core program. Focus on form, consistency, and gradual overload. Consult a professional
            if you are unsure whether this plan is right for you. Stop if you feel pain.
          </Text>
          {CREDIT_LINE ? (
            <Text testID="media-credits" style={[styles.aboutNote, { color: colors.sub }]}>
              {CREDIT_LINE}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
          <Text style={[styles.resetButtonText, { color: colors.sub }]}>Reset Progress</Text>
        </TouchableOpacity>
      </ScrollView>

      <Paywall
        visible={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        openLink={openLink}
        accent={accent}
        colors={colors}
      />

      {activeForm && (
        <View testID="form-media" style={styles.videoModal}>
          <View style={styles.formImageWrap}>
            <Image source={activeForm[0]} style={styles.formImage} resizeMode="contain" />
            {activeForm.length > 1 ? (
              <Animated.Image
                source={activeForm[1]}
                style={[styles.formImage, styles.formImageOverlay, { opacity: formFade }]}
                resizeMode="contain"
              />
            ) : null}
          </View>
          <TouchableOpacity testID="form-media-close" style={[styles.closeVideo, { backgroundColor: accent }]} onPress={() => setActiveForm(null)}>
            <Text style={styles.closeVideoText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <IapProvider>
      <AppInner />
    </IapProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingText: { textAlign: 'center', marginTop: 100, fontSize: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { fontSize: 26, fontWeight: '800' },
  headerSubtitle: { fontSize: 13, marginTop: 2 },
  themeToggle: { padding: 8 },
  unlockBtn: { paddingHorizontal: 12, paddingVertical: 6, marginRight: 4 },
  unlockBtnText: { fontSize: 16, fontWeight: '800' },
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
  lockedCopy: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
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
  formImageWrap: { width: width * 0.92, height: width * 0.65, backgroundColor: '#000', borderRadius: 12, overflow: 'hidden' },
  formImage: { width: '100%', height: '100%' },
  formImageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  closeVideo: { marginTop: 20, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 10 },
  closeVideoText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
