import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import { HabitGuardService } from '../services';
import { DoodleShield } from './DoodleIcons';
import { useAppStore } from '../store';

export const PermissionRevokedBanner: React.FC = () => {
  const { isAccessibilityRevoked, checkAccessibilityStatus } = useAppStore();

  if (!isAccessibilityRevoked) {
    return null;
  }

  const handleOpenSettings = () => {
    HabitGuardService.openSettings();
  };

  const handleRecheck = async () => {
    await checkAccessibilityStatus();
  };

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.headerRow}>
        <DoodleShield color={theme.colors.error} size={24} />
        <Text style={styles.bannerTitle}>Tracking Paused: Permission Revoked</Text>
      </View>
      <Text style={styles.bannerDesc}>
        ScrollGuard cannot monitor Instagram or YouTube feeds without Accessibility access. Your kitten's health is frozen.
      </Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.openSettingsBtn}
          onPress={handleOpenSettings}
          activeOpacity={0.8}
        >
          <Text style={styles.openSettingsText}>Re-Enable Service ➔</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.recheckBtn}
          onPress={handleRecheck}
          activeOpacity={0.7}
        >
          <Text style={styles.recheckText}>Check Status ↻</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#1E1412',
    borderWidth: 1.5,
    borderColor: theme.colors.error,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  bannerTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.error,
    flex: 1,
  },
  bannerDesc: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  openSettingsBtn: {
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.xs + 2,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  openSettingsText: {
    color: '#000000',
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  recheckBtn: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingVertical: theme.spacing.xs + 2,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  recheckText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
