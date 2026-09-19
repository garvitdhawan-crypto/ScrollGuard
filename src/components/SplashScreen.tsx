import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(1200),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, [fadeAnim, scaleAnim, subtitleFade, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconWrapper}>
          <Text style={styles.shieldEmoji}>🛡️</Text>
          <Text style={styles.catOverlay}>🐱</Text>
        </View>

        <Text style={styles.title}>ScrollGuard</Text>

        <Animated.View style={{ opacity: subtitleFade }}>
          <Text style={styles.tagline}>
            "See how much of your life you're giving to the infinite feed."
          </Text>
        </Animated.View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>AUTONOMOUS DOPAMINE DEFENSE</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  content: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  shieldEmoji: {
    fontSize: 48,
  },
  catOverlay: {
    fontSize: 22,
    position: 'absolute',
    bottom: 22,
  },
  title: {
    fontSize: 32,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textPrimary,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.sm,
  },
  tagline: {
    fontSize: theme.typography.fontSize.xs + 1,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    maxWidth: 280,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textMuted,
    letterSpacing: 2,
  },
});
