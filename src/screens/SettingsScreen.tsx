import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { theme } from '../theme';
import { useAppStore } from '../store';
import { HabitGuardService } from '../services';
import { RoastIntensity } from '../services/RoastEngine';

export const SettingsScreen: React.FC = () => {
  const { isGuardActive, toggleGuard, roastIntensity, setRoastIntensity } = useAppStore();
  const [isAccessGranted, setIsAccessGranted] = useState(false);

  const checkPermission = async () => {
    const granted = await HabitGuardService.isAccessibilityEnabled();
    setIsAccessGranted(granted);
  };

  useEffect(() => {
    checkPermission();
    const interval = setInterval(checkPermission, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenAccessibility = () => {
    HabitGuardService.openSettings();
  };

  const intensities: RoastIntensity[] = ['Friendly', 'Funny', 'Savage', 'Nuclear'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Shield & Roast Settings</Text>
      <Text style={styles.subtitle}>Configure privacy-safe detection & escalation levels</Text>

      {/* Accessibility Service Permission Card */}
      <View style={[styles.card, { borderColor: isAccessGranted ? theme.colors.primary : theme.colors.warning }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderTitle}>Accessibility Service Status</Text>
          <Text style={[styles.badge, { color: isAccessGranted ? theme.colors.primary : theme.colors.warning }]}>
            {isAccessGranted ? 'GRANTED' : 'NEEDS SETUP'}
          </Text>
        </View>

        <Text style={styles.cardBody}>
          ScrollGuard requires Android Accessibility Service to detect when Instagram Reels or YouTube Shorts are actively playing and count scroll gestures.
        </Text>

        <View style={styles.privacyNote}>
          <Text style={styles.privacyTitle}>🔒 Privacy First Promise:</Text>
          <Text style={styles.privacyText}>
            We do NOT read or transmit personal messages, passwords, or on-screen text. Only app package and scroll motions are observed.
          </Text>
        </View>

        {!isAccessGranted && (
          <View style={styles.stepsContainer}>
            <Text style={styles.stepsHeading}>How to Enable:</Text>
            <Text style={styles.stepItem}>1. Tap "Open Accessibility Settings" below</Text>
            <Text style={styles.stepItem}>2. Find "ScrollGuard" under Downloaded Apps</Text>
            <Text style={styles.stepItem}>3. Switch the service toggle to ON</Text>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: isAccessGranted ? theme.colors.surfaceVariant : theme.colors.primary },
          ]}
          onPress={handleOpenAccessibility}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.actionButtonText,
              { color: isAccessGranted ? theme.colors.primary : theme.colors.textInverse },
            ]}
          >
            {isAccessGranted ? 'Reconfigure Accessibility' : 'Open Accessibility Settings →'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Roast Intensity Selector */}
      <View style={styles.card}>
        <Text style={styles.cardHeaderTitle}>Roast Escalation Intensity</Text>
        <Text style={styles.cardBody}>
          Choose how aggressively ScrollGuard confronts your doom-scrolling habits:
        </Text>

        <View style={styles.intensityRow}>
          {intensities.map((level) => {
            const isSelected = roastIntensity === level;
            return (
              <TouchableOpacity
                key={level}
                style={[
                  styles.intensityButton,
                  isSelected && styles.intensityButtonActive,
                ]}
                onPress={() => setRoastIntensity(level)}
              >
                <Text
                  style={[
                    styles.intensityButtonText,
                    isSelected && styles.intensityButtonTextActive,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Master Toggle */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleText}>
          <Text style={styles.toggleTitle}>Master Habit Guard Shield</Text>
          <Text style={styles.toggleDesc}>Toggle active background monitoring and interception</Text>
        </View>
        <Switch
          value={isGuardActive}
          onValueChange={toggleGuard}
          trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
          thumbColor={isGuardActive ? theme.colors.textPrimary : theme.colors.textMuted}
        />
      </View>
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
    paddingBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardHeaderTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  badge: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.heavy,
    letterSpacing: 0.5,
  },
  cardBody: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
  },
  privacyNote: {
    backgroundColor: theme.colors.surfaceVariant,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  privacyTitle: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: 2,
  },
  privacyText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    lineHeight: 15,
  },
  stepsContainer: {
    marginVertical: theme.spacing.xs,
    paddingLeft: theme.spacing.xs,
  },
  stepsHeading: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.warning,
    marginBottom: 4,
  },
  stepItem: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  actionButton: {
    marginTop: theme.spacing.sm,
    paddingVertical: theme.spacing.sm + 4,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  intensityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  intensityButton: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
  },
  intensityButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  intensityButtonText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textSecondary,
  },
  intensityButtonTextActive: {
    color: theme.colors.textInverse,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  toggleText: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  toggleTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  toggleDesc: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
});
