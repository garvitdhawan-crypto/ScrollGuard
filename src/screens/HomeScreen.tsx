import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import { useAppStore } from '../store';
import { RootStackParamList } from '../navigation/types';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { streakDays, xp, isGuardActive, toggleGuard } = useAppStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ScrollGuard</Text>
        <Text style={styles.subtitle}>Gamified Focus & Habit Fortress</Text>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>STREAK</Text>
          <Text style={[styles.statValue, { color: theme.colors.streakFire }]}>🔥 {streakDays}d</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>ENERGY XP</Text>
          <Text style={[styles.statValue, { color: theme.colors.xpGold }]}>⚡ {xp}</Text>
        </View>
      </View>

      <View style={styles.guardCard}>
        <Text style={styles.guardTitle}>SHIELD STATUS</Text>
        <Text style={[styles.guardState, { color: isGuardActive ? theme.colors.primary : theme.colors.error }]}>
          {isGuardActive ? 'ACTIVE - APP INTERCEPTOR ON' : 'PAUSED - GUARD OFF'}
        </Text>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: isGuardActive ? theme.colors.surfaceVariant : theme.colors.primary }]}
          onPress={toggleGuard}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: isGuardActive ? theme.colors.primary : theme.colors.textInverse }]}>
            {isGuardActive ? 'Deactivate Shield' : 'Activate Shield'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => navigation.navigate('Settings')}
        activeOpacity={0.8}
      >
        <Text style={styles.actionButtonText}>Open Shield Settings →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  header: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
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
    marginTop: theme.spacing.xs,
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
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.fontWeight.semibold,
    letterSpacing: 1,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginTop: theme.spacing.xs,
  },
  guardCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  guardTitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 1.5,
  },
  guardState: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    marginVertical: theme.spacing.sm,
  },
  primaryButton: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  actionButton: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  actionButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
