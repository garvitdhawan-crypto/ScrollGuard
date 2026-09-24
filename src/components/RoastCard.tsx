import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { theme } from '../theme';
import { RoastResult } from '../services/RoastEngine';
import { DoodleShield, DoodleQuote, DoodleFlame } from './DoodleIcons';

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

  const borderColor = getEscalationBorder();

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
      {/* Hand-drawn sketch doodle card */}
      <View style={[styles.card, { borderColor }]}>
        {/* Hand-drawn Header */}
        <View style={styles.cardHeader}>
          <View style={styles.brandingRow}>
            <DoodleShield color={borderColor} size={24} />
            <View style={styles.brandTitleWrap}>
              <Text style={[styles.brandBadge, { color: borderColor }]}>SCROLLGUARD</Text>
              <Text style={styles.brandSub}>DOODLE REALITY CHECK</Text>
            </View>
          </View>
          <View style={[styles.appBadgePill, { borderColor }]}>
            <Text style={[styles.appBadge, { color: borderColor }]}>
              {appName.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Doodle Quote container */}
        <View style={styles.quoteBox}>
          <DoodleQuote color={`${borderColor}44`} size={24} />
          <Text style={styles.roastText}>
            {roast?.message || 'Protecting your focus fortress.'}
          </Text>
        </View>

        {/* Sketch footer */}
        <View style={styles.cardFooter}>
          <View style={styles.tagGroup}>
            <View style={styles.doodleTag}>
              <DoodleFlame color={borderColor} size={14} />
              <Text style={[styles.tagText, { color: borderColor }]}>
                {roast?.escalationLevel?.toUpperCase() || 'MILD'}
              </Text>
            </View>
            <View style={styles.doodleTag}>
              <Text style={styles.tagTextMuted}>
                STYLE: {roast?.roastStyle?.toUpperCase() || 'CALM'}
              </Text>
            </View>
          </View>
          <Text style={styles.footerAppUrl}>scrollguard.app ✏️</Text>
        </View>
      </View>

      {/* Share Trigger Action */}
      <TouchableOpacity
        style={[styles.shareButton, { borderColor }]}
        onPress={handleShare}
        activeOpacity={0.8}
        disabled={isSharing}
      >
        <Text style={[styles.shareButtonText, { color: borderColor }]}>
          {isSharing ? 'Sketching Share...' : '📤 Share Roast Doodle Card'}
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
    borderRadius: 20,
    borderWidth: 2.5,
    borderStyle: 'solid',
    padding: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitleWrap: {
    marginLeft: 6,
  },
  brandBadge: {
    fontSize: 11,
    fontWeight: theme.typography.fontWeight.heavy,
    letterSpacing: 0.8,
  },
  brandSub: {
    fontSize: 8,
    color: theme.colors.textMuted,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
  appBadgePill: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  appBadge: {
    fontSize: 9,
    fontWeight: theme.typography.fontWeight.heavy,
    letterSpacing: 0.5,
  },
  quoteBox: {
    backgroundColor: '#0E131F',
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.xs,
  },
  roastText: {
    fontSize: theme.typography.fontSize.xs + 2,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.semibold,
    lineHeight: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1.5,
    borderTopColor: theme.colors.border,
  },
  tagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doodleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 6,
  },
  tagText: {
    fontSize: 9,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: 2,
  },
  tagTextMuted: {
    fontSize: 9,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textMuted,
  },
  footerAppUrl: {
    fontSize: 9,
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  shareButton: {
    marginTop: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderRadius: 14,
    paddingVertical: theme.spacing.xs + 4,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
