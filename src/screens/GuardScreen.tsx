import React, { memo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { theme } from '../theme';
import { useAppStore, BlockedApp } from '../store';
import { PermissionRevokedBanner } from '../components';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

interface GuardAppCardProps {
  item: BlockedApp;
}

const GuardAppCard = memo<GuardAppCardProps>(({ item }) => {
  const scrollPct = Math.min(100, (item.reelsScrolledToday / item.dailyLimitScrolls) * 100);
  const timePct = Math.min(
    100,
    (item.timeSpentSecondsToday / (item.dailyLimitMinutes * 60)) * 100,
  );

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
                backgroundColor:
                  scrollPct >= 100 ? theme.colors.error : theme.colors.accent,
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
                backgroundColor:
                  timePct >= 100 ? theme.colors.error : theme.colors.primary,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
});

GuardAppCard.displayName = 'GuardAppCard';

export const GuardScreen: React.FC = () => {
  const blockedApps = useAppStore((state) => state.blockedApps);

  return (
    <View style={styles.container}>
      <PermissionRevokedBanner />
      <Text style={styles.title}>Shorts & Reels Guard</Text>
      <Text style={styles.subtitle}>
        Dual-metric tracking: Scroll count + feed dwell time
      </Text>

      <FlatList
        data={blockedApps}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => <GuardAppCard item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  statusBadge: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  packageText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
    fontFamily: 'monospace',
  },
  metricSection: {
    marginTop: theme.spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  metricLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  metricValue: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
