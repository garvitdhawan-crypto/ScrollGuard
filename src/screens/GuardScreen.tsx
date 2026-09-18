import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { theme } from '../theme';
import { useAppStore } from '../store';

export const GuardScreen: React.FC = () => {
  const { blockedApps } = useAppStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Guard Wall</Text>
      <Text style={styles.subtitle}>Protected apps monitored by Android usage stats</Text>

      <FlatList
        data={blockedApps}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.appName}>{item.appName}</Text>
              <Text style={[styles.statusBadge, { color: item.isBlocked ? theme.colors.error : theme.colors.primary }]}>
                {item.isBlocked ? 'LOCKED' : 'MONITORED'}
              </Text>
            </View>
            <Text style={styles.packageText}>{item.packageName}</Text>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(100, (item.usedMinutesToday / item.dailyLimitMinutes) * 100)}%`,
                    backgroundColor: item.isBlocked ? theme.colors.error : theme.colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={styles.usageText}>
              {item.usedMinutesToday} / {item.dailyLimitMinutes} mins used
            </Text>
          </View>
        )}
      />
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
    marginBottom: theme.spacing.md,
  },
  listContent: {
    paddingBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  statusBadge: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.heavy,
  },
  packageText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  usageText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textAlign: 'right',
  },
});
