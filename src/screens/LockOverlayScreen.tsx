import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme';
import { useAppStore } from '../store';

export const LockOverlayScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    pet,
    currentRoast,
    overridesToday,
    requestOverride,
    dismissLock,
  } = useAppStore();

  const handleOverride = () => {
    // 5 more minutes override
    requestOverride(5);
    navigation.goBack();
  };

  const handleAcceptLock = () => {
    dismissLock();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Emergency Siren / Danger Header */}
      <View style={styles.alertHeader}>
        <Text style={styles.sirenIcon}>🚨</Text>
        <Text style={styles.alertTitle}>DAILY LIMIT BREACHED</Text>
        <Text style={styles.alertSubtitle}>
          Focus Shield Engaged • Short-Form Lockout Active
        </Text>
      </View>

      {/* Center Character Reaction */}
      <View style={styles.petStatusCard}>
        <Text style={styles.petEmoji}>
          {pet.isDead ? '🪦' : pet.stage === 'critical' ? '🙀' : '😿'}
        </Text>
        <Text style={styles.petStageText}>
          {pet.isDead ? 'COMPANION HAS FALLEN' : `COMPANION IS ${pet.stage.toUpperCase()}`}
        </Text>
        <Text style={styles.petSpeech}>
          {pet.isDead
            ? '“700 reels was too much. The fortress has fallen.”'
            : '“Please, put down the phone before my vitality hits zero!”'}
        </Text>
      </View>

      {/* Escalated Savage Roast */}
      <View style={styles.roastBox}>
        <Text style={styles.roastHeader}>SCROLLGUARD REALITY CHECK</Text>
        <Text style={styles.roastText}>
          "{currentRoast?.message || 'You blew through your limit. Step away from the screen.'}"
        </Text>
      </View>

      {/* Override / Lockdown Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.overrideButton}
          onPress={handleOverride}
          activeOpacity={0.8}
        >
          <Text style={styles.overrideButtonText}>
            ⏱️ 5 More Minutes Override
          </Text>
          <Text style={styles.overrideSubText}>
            Used today: {overridesToday} times
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.lockdownButton}
          onPress={handleAcceptLock}
          activeOpacity={0.8}
        >
          <Text style={styles.lockdownButtonText}>
            🛡️ Accept Lockdown & Close App
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070D',
    padding: theme.spacing.lg,
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xxl,
  },
  alertHeader: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  sirenIcon: {
    fontSize: 44,
    marginBottom: 4,
  },
  alertTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.error,
    letterSpacing: 1.5,
  },
  alertSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  petStatusCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.error,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  petEmoji: {
    fontSize: 54,
    marginBottom: 8,
  },
  petStageText: {
    fontSize: theme.typography.fontSize.xs + 1,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.error,
    letterSpacing: 1,
  },
  petSpeech: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 6,
    lineHeight: 18,
  },
  roastBox: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  roastHeader: {
    fontSize: 9,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  roastText: {
    fontSize: theme.typography.fontSize.xs + 1,
    color: theme.colors.textPrimary,
    lineHeight: 18,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  actionsContainer: {
    width: '100%',
  },
  overrideButton: {
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.warning,
    paddingVertical: theme.spacing.sm + 2,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  overrideButtonText: {
    fontSize: theme.typography.fontSize.xs + 1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.warning,
  },
  overrideSubText: {
    fontSize: 9,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  lockdownButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm + 4,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  lockdownButtonText: {
    fontSize: theme.typography.fontSize.xs + 1,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textInverse,
    textTransform: 'uppercase',
  },
});
