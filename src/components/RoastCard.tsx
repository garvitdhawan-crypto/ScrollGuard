import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { theme } from '../theme';
import { RoastResult } from '../services/RoastEngine';

interface RoastCardProps {
  roast: RoastResult | null;
  appName?: string;
}

export const RoastCard: React.FC<RoastCardProps> = ({
  roast,
  appName = 'Reels / Shorts',
}) => {
  const [isSharing, setIsSharing] = useState(false);

  const getEscalationBorder = () => {
    switch (roast?.escalationLevel) {
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

  const handleShare = async () => {
    if (isSharing) {
      return;
    }
    setIsSharing(true);

    try {
      await Share.share({
        title: 'ScrollGuard Reality Check',
        message: `🔥 ScrollGuard Reality Check (${appName}):\n\n"${roast?.message}"\n\nLevel: ${roast?.escalationLevel?.toUpperCase()} • Style: ${roast?.roastStyle?.toUpperCase()}\n\n🛡️ Reclaim your focus with ScrollGuard: scrollguard.app`,
      });
    } catch {
      // User dismissed
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.card, { borderColor: getEscalationBorder() }]}>
        <View style={styles.cardHeader}>
          <View style={styles.brandingRow}>
            <Text style={styles.brandBadge}>🛡️ SCROLLGUARD</Text>
            <Text style={styles.brandSub}>REALITY CHECK</Text>
          </View>
          <Text style={[styles.appBadge, { color: getEscalationBorder() }]}>
            {appName.toUpperCase()}
          </Text>
        </View>

        <View style={styles.quoteBox}>
          <Text style={styles.quoteMark}>“</Text>
          <Text style={styles.roastText}>
            {roast?.message || 'Protecting your focus fortress.'}
          </Text>
          <Text style={[styles.quoteMark, styles.quoteMarkEnd]}>”</Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.tagGroup}>
            <Text style={styles.tag}>
              LEVEL: {roast?.escalationLevel?.toUpperCase() || 'MILD'}
            </Text>
            <Text style={styles.tag}>
              STYLE: {roast?.roastStyle?.toUpperCase() || 'CALM'}
            </Text>
          </View>
          <Text style={styles.footerAppUrl}>scrollguard.app</Text>
        </View>
      </View>

      {/* Share Trigger Action */}
      <TouchableOpacity
        style={styles.shareButton}
        onPress={handleShare}
        activeOpacity={0.8}
        disabled={isSharing}
      >
        <Text style={styles.shareButtonText}>
          {isSharing ? 'Sharing...' : '📤 Share Roast Card'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    padding: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandBadge: {
    fontSize: 11,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.primary,
    letterSpacing: 0.8,
  },
  brandSub: {
    fontSize: 9,
    color: theme.colors.textMuted,
    marginLeft: 6,
    fontWeight: theme.typography.fontWeight.bold,
  },
  appBadge: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.heavy,
    letterSpacing: 0.5,
  },
  quoteBox: {
    position: 'relative',
    paddingHorizontal: theme.spacing.xs,
    marginVertical: theme.spacing.xs,
  },
  quoteMark: {
    fontSize: 32,
    color: theme.colors.surfaceVariant,
    lineHeight: 28,
  },
  quoteMarkEnd: {
    textAlign: 'right',
  },
  roastText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.semibold,
    lineHeight: 22,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: -8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  tagGroup: {
    flexDirection: 'row',
  },
  tag: {
    fontSize: 9,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textMuted,
    marginRight: 8,
    backgroundColor: theme.colors.surfaceVariant,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  footerAppUrl: {
    fontSize: 9,
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  shareButton: {
    marginTop: theme.spacing.xs,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingVertical: theme.spacing.xs + 4,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
});
