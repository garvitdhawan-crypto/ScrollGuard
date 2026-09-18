import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { theme } from '../theme';
import { useAppStore } from '../store';

export const GuardScreen: React.FC = () => {
  const { blockedApps } = useAppStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shorts & Reels Guard</Text>
      <Text style={styles.subtitle}>
        Dual-metric tracking: Scroll count + feed dwell time
      </Text>

      <FlatList
        data={blockedApps}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const scrollPct = Math.min(100, (item.reelsScrolledToday / item.dailyLimitScrolls) * 100);
          const timePct = Math.min(100, (item.timeSpentSecondsToday / (item.dailyLimitMinutes * 60)) * 100);

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.appName}>{item.appName}</Text>
                <Text
                  style={[
                    styles.statusBadge,
                    { color: item.isBlocked ? theme.colors.error : theme.colors.primary },
                  ]}
                >
                  {item.isBlocked ? 'LOCKED' : 'MONITORED'}
                </Text>
              </View>
              <Text style={styles.packageText}>{item.packageName}</Text>

              {/* Metric 1: Reels / Shorts Scrolled */}
              <View style={styles.metricSection}>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>⚡ REELS SCROLLED</Text>
                  <Text style={styles.metricValue}>
                    {item.reelsScrolledToday} / {item.dailyLimitScrolls} flicks
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${scrollPct}%`,
                        backgroundColor: scrollPct >= 100 ? theme.colors.error : theme.colors.accent,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Metric 2: Feed Screen Time */}
              <View style={styles.metricSection}>
                <View style={styles.metricRow}>
                  <Text style={styles.metricLabel}>⏱️ REELS FEED TIME</Text>
                  <Text style={styles.metricValue}>
                    {formatTime(item.timeSpentSecondsToday)} / {item.dailyLimitMinutes}m
                  </Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${timePct}%`,
                        backgroundColor: timePct >= 100 ? theme.colors.error : theme.colors.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        }}
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
    marginTop: 2,
    marginBottom: theme.spacing.sm,
  },
  metricSection: {
    marginTop: theme.spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.8,
  },
  metricValue: {
    fontSize: 11,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.semibold,
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
});
