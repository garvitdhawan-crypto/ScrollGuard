import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { theme } from '../theme';
import { useAppStore } from '../store';

export const SettingsScreen: React.FC = () => {
  const { isGuardActive, toggleGuard } = useAppStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>System Settings</Text>
      <Text style={styles.subtitle}>Android Accessibility & Overlay permissions</Text>

      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>Background Shield Service</Text>
          <Text style={styles.rowDesc}>Detect foreground reel apps instantly</Text>
        </View>
        <Switch
          value={isGuardActive}
          onValueChange={toggleGuard}
          trackColor={{ false: theme.colors.surfaceVariant, true: theme.colors.primary }}
          thumbColor={isGuardActive ? theme.colors.textPrimary : theme.colors.textMuted}
        />
      </View>

      <TouchableOpacity style={styles.permissionCard}>
        <Text style={styles.permissionTitle}>Android Usage Stats Permission</Text>
        <Text style={styles.permissionDesc}>Granted • Tracking active app packages</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.permissionCard}>
        <Text style={styles.permissionTitle}>Display Over Other Apps (Overlay)</Text>
        <Text style={styles.permissionDesc}>Granted • Intercept screens ready</Text>
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
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  rowText: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  rowTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  rowDesc: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  permissionCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  permissionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
  },
  permissionDesc: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});
