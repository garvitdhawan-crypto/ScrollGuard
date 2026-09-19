import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { useAppStore } from '../store';
import { RootStackParamList } from '../navigation/types';
import { HabitGuardService } from '../services';
import { KittenCompanion, RoastCard } from '../components';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    currentStreak,
    longestStreak,
    xp,
    isGuardActive,
    toggleGuard,
    currentRoast,
    isLockActive,
    recordReelScroll,
    updateScreenTime,
  } = useAppStore();

  // Listen for live native accessibility events
  useEffect(() => {
    const unsubscribe = HabitGuardService.subscribeToEvents({
      onReelScrolled: (event) => {
        recordReelScroll(event.source);
      },
      onScreenTimeUpdate: (event) => {
        updateScreenTime(event.source, Math.floor(event.secondsSpent));
      },
    });
    return () => unsubscribe();
  }, [recordReelScroll, updateScreenTime]);

  // Navigate to lock overlay when triggered
  useEffect(() => {
    if (isLockActive) {
      navigation.navigate('LockOverlay');
    }
  }, [isLockActive, navigation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <Text style={styles.title}>ScrollGuard</Text>
          <TouchableOpacity
            style={styles.wrappedPill}
            onPress={() => navigation.navigate('Wrapped')}
            activeOpacity={0.8}
          >
            <Text style={styles.wrappedPillText}>✨ Wrapped</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>Autonomous Dopamine Defense System</Text>
      </View>

      {/* Prominent Streak & XP Fortress Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>ACTIVE STREAK</Text>
          <Text style={[styles.statValue, { color: theme.colors.streakFire }]}>
            🔥 {currentStreak} Days
          </Text>
          <Text style={styles.statSubText}>Best: {longestStreak}d</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>ENERGY XP</Text>
          <Text style={[styles.statValue, { color: theme.colors.xpGold }]}>
            ⚡ {xp}
          </Text>
          <Text style={styles.statSubText}>Fortress Tier 4</Text>
        </View>
      </View>

      {/* Centerpiece 1: Virtual Kitten Companion */}
      <KittenCompanion />

      {/* Centerpiece 2: Shareable Escalating Roast Card */}
      <RoastCard roast={currentRoast} />

      {/* Shield Activation */}
      <View style={styles.guardCard}>
        <Text style={styles.guardTitle}>SHIELD STATUS</Text>
        <Text
          style={[
            styles.guardState,
            { color: isGuardActive ? theme.colors.primary : theme.colors.error },
          ]}
        >
          {isGuardActive ? 'ACTIVE - REELS & SHORTS INTERCEPTOR ON' : 'PAUSED - SHIELD DOWN'}
        </Text>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor: isGuardActive
                ? theme.colors.surfaceVariant
                : theme.colors.primary,
            },
          ]}
          onPress={toggleGuard}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.buttonText,
              { color: isGuardActive ? theme.colors.primary : theme.colors.textInverse },
            ]}
          >
            {isGuardActive ? 'Deactivate Shield' : 'Activate Shield'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Test Lock Overlay Preview Button */}
      <TouchableOpacity
        style={styles.simulateLockBtn}
        onPress={() => navigation.navigate('LockOverlay')}
        activeOpacity={0.8}
      >
        <Text style={styles.simulateLockText}>
          🚨 Preview Focus Mode Lock Overlay →
        </Text>
      </TouchableOpacity>

      {/* Permissions / Settings Shortcut */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('Settings')}
        activeOpacity={0.8}
      >
        <Text style={styles.actionButtonText}>
          Configure Accessibility & Roast Levels →
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textPrimary,
    letterSpacing: 0.5,
  },
  wrappedPill: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  wrappedPillText: {
    fontSize: 11,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.fontWeight.semibold,
    letterSpacing: 1,
  },
  statValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginTop: 2,
  },
  statSubText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  guardCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  guardTitle: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 1.5,
  },
  guardState: {
    fontSize: theme.typography.fontSize.xs + 1,
    fontWeight: theme.typography.fontWeight.bold,
    marginVertical: theme.spacing.xs,
  },
  primaryButton: {
    marginTop: theme.spacing.xs,
    paddingVertical: theme.spacing.sm + 4,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  simulateLockBtn: {
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  simulateLockText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  actionButton: {
    paddingVertical: theme.spacing.xs,
    alignItems: 'center',
  },
  actionButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
