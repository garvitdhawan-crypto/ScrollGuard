import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { useAppStore } from '../store';
import { RootStackParamList } from '../navigation/types';
import { HabitGuardService } from '../services';
import { KittenCompanion } from '../components';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    currentStreak,
    longestStreak,
    xp,
    isGuardActive,
    toggleGuard,
    currentRoast,
    roastIntensity,
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

  const getEscalationColor = () => {
    switch (currentRoast?.escalationLevel) {
      case 'critical':
        return theme.colors.error;
      case 'high':
        return theme.colors.accent;
      case 'moderate':
        return theme.colors.warning;
      default:
        return theme.colors.primary;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>ScrollGuard</Text>
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

      {/* Centerpiece 2: Live Escalating Roast Banner */}
      <View style={[styles.roastCard, { borderColor: getEscalationColor() }]}>
        <View style={styles.roastHeader}>
          <Text style={[styles.roastBadge, { color: getEscalationColor() }]}>
            🔥 {roastIntensity.toUpperCase()} ROAST • {currentRoast?.escalationLevel?.toUpperCase() || 'NORMAL'}
          </Text>
          <Text style={styles.roastStyleTag}>
            {currentRoast?.roastStyle === 'flicker'
              ? '⚡ SPEED FLICKING'
              : currentRoast?.roastStyle === 'zombie'
              ? '🧟 ZOMBIE TRANCE'
              : currentRoast?.roastStyle === 'overload'
              ? '☠️ OVERLOAD'
              : '🛡️ GUARDING'}
          </Text>
        </View>
        <Text style={styles.roastMessage}>
          "{currentRoast?.message || 'Stay focused. No mindless scrolling detected yet.'}"
        </Text>
      </View>

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
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textPrimary,
    letterSpacing: 0.5,
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
  roastCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    marginBottom: theme.spacing.md,
  },
  roastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  roastBadge: {
    fontSize: 11,
    fontWeight: theme.typography.fontWeight.heavy,
    letterSpacing: 0.5,
  },
  roastStyleTag: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.fontWeight.bold,
  },
  roastMessage: {
    fontSize: theme.typography.fontSize.xs + 1,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    lineHeight: 18,
    marginTop: 4,
    fontStyle: 'italic',
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
  actionButton: {
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  actionButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
