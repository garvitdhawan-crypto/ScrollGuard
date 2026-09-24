import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { theme } from '../theme';
import { useAppStore } from '../store';
import { RoastIntensity } from '../services/RoastEngine';
import { HabitGuardService } from '../services';
import { DoodleShield, DoodleCatHead, DoodleFlame } from '../components/DoodleIcons';

export const OnboardingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAccessGranted, setIsAccessGranted] = useState(false);

  const {
    completeOnboarding,
    roastIntensity,
    setRoastIntensity,
  } = useAppStore();

  const checkPermission = async () => {
    const granted = await HabitGuardService.isAccessibilityEnabled();
    setIsAccessGranted(granted);
  };

  useEffect(() => {
    checkPermission();
    const interval = setInterval(checkPermission, 2000);
    return () => clearInterval(interval);
  }, []);

  const intensities: { level: RoastIntensity; desc: string; sample: string }[] = [
    {
      level: 'Friendly',
      desc: 'Gentle nudges and encouraging positive habit reinforcement.',
      sample: '“Notice how fast 20m passed? Let us take a breath!”',
    },
    {
      level: 'Funny',
      desc: 'Playful sarcasm to break the algorithmic trance.',
      sample: '“Is your thumb auditioning for the Olympic scrolling squad?”',
    },
    {
      level: 'Savage',
      desc: 'Unfiltered, brutally honest reality checks.',
      sample: '“Your attention span is officially shorter than a goldfish.”',
    },
    {
      level: 'Nuclear',
      desc: 'No-mercy psychological warfare against doom-scrolling.',
      sample: '“🚨 700 REELS! Brain rot critical. Put the phone down now!”',
    },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Dots */}
      <View style={styles.pagination}>
        {[0, 1, 2, 3].map((step) => (
          <View
            key={step}
            style={[
              styles.dot,
              currentStep === step && styles.dotActive,
              currentStep > step && styles.dotCompleted,
            ]}
          />
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Step 1: Welcome & Mission */}
        {currentStep === 0 && (
          <View style={styles.stepContainer}>
            <DoodleShield color={theme.colors.primary} size={64} />
            <Text style={styles.stepTitle}>Welcome to ScrollGuard</Text>
            <Text style={styles.stepSubtitle}>Autonomous Dopamine Fortress</Text>

            <View style={styles.featureBox}>
              <Text style={styles.featureTitle}>🎯 What ScrollGuard Does:</Text>
              <Text style={styles.featureText}>
                • Intercepts short-form rabbit holes (Instagram Reels & YouTube Shorts)
              </Text>
              <Text style={styles.featureText}>
                • Tracks both physical scroll gestures & video feed dwell time
              </Text>
              <Text style={styles.featureText}>
                • 100% On-Device & Privacy-Safe: Never reads messages or content
              </Text>
            </View>
          </View>
        )}

        {/* Step 2: Choose Roast Personality */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <DoodleFlame color={theme.colors.accent} size={60} />
            <Text style={styles.stepTitle}>Select Roast Intensity</Text>
            <Text style={styles.stepSubtitle}>
              How hard should ScrollGuard roast your doom-scrolling?
            </Text>

            <View style={styles.intensityList}>
              {intensities.map((item) => {
                const isSelected = roastIntensity === item.level;
                return (
                  <TouchableOpacity
                    key={item.level}
                    style={[
                      styles.intensityCard,
                      isSelected && styles.intensityCardActive,
                    ]}
                    onPress={() => setRoastIntensity(item.level)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.intensityHeader}>
                      <Text
                        style={[
                          styles.intensityName,
                          isSelected && { color: theme.colors.primary },
                        ]}
                      >
                        {item.level}
                      </Text>
                      {isSelected && (
                        <Text style={styles.selectedCheck}>✓ SELECTED</Text>
                      )}
                    </View>
                    <Text style={styles.intensityDesc}>{item.desc}</Text>
                    <Text style={styles.intensitySample}>{item.sample}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 3: Kitten Companion Mechanic */}
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <DoodleCatHead color={theme.colors.primary} size={64} />
            <Text style={styles.stepTitle}>Meet Your Companion</Text>
            <Text style={styles.stepSubtitle}>
              Your doom-scrolling has real emotional stakes
            </Text>

            <View style={styles.featureBox}>
              <Text style={styles.featureTitle}>❤️ The Kitten Health Bond:</Text>
              <Text style={styles.featureText}>
                • Your kitten rests safely as long as you stay mindful.
              </Text>
              <Text style={styles.featureText}>
                • Every reel scrolled drains its health (Healthy ➔ Tired ➔ Sick ➔ Critical).
              </Text>
              <Text style={styles.featureText}>
                • ☠️ Reaching 700 reels in a single day is fatal (Game Over).
              </Text>
              <Text style={styles.featureText}>
                • Protect your companion and protect your mind.
              </Text>
            </View>
          </View>
        )}

        {/* Step 4: Accessibility Permission & Prominent Scope Notice */}
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <DoodleShield color={theme.colors.primary} size={54} />
            <Text style={styles.stepTitle}>Shield Setup</Text>
            <Text style={styles.stepSubtitle}>
              Enable Accessibility Service for scroll detection
            </Text>

            {/* Prominent Trust Badge */}
            <View style={styles.scopeBanner}>
              <Text style={styles.scopeBadgeText}>🔒 STRICT SCOPE PROMISE</Text>
              <Text style={styles.scopeBodyText}>
                ScrollGuard <Text style={styles.scopeHighlight}>only monitors Instagram and YouTube</Text> — nothing else on your phone is ever inspected, read, or collected.
              </Text>
            </View>

            <View
              style={[
                styles.permissionBox,
                {
                  borderColor: isAccessGranted
                    ? theme.colors.primary
                    : theme.colors.warning,
                },
              ]}
            >
              <View style={styles.permStatusRow}>
                <Text style={styles.permStatusLabel}>Accessibility Detection</Text>
                <Text
                  style={[
                    styles.permStatusBadge,
                    {
                      color: isAccessGranted
                        ? theme.colors.primary
                        : theme.colors.warning,
                    },
                  ]}
                >
                  {isAccessGranted ? 'ENABLED' : 'REQUIRED'}
                </Text>
              </View>

              <Text style={styles.permExplainer}>
                ScrollGuard detects vertical scroll gestures specifically inside Reels and Shorts to compute health drain without reading on-screen private text.
              </Text>

              {!isAccessGranted && (
                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={() => HabitGuardService.openSettings()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.settingsButtonText}>
                    Grant Accessibility in Android Settings →
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        {currentStep > 0 ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handlePrev}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.spacer} />
        )}

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === 3 ? 'Enter Fortress 🏰' : 'Continue →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  dot: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.surfaceVariant,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
    width: 36,
  },
  dotCompleted: {
    backgroundColor: theme.colors.primaryVariant,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 40,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  stepSubtitle: {
    fontSize: theme.typography.fontSize.xs + 1,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: theme.spacing.lg,
  },
  featureBox: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  featureTitle: {
    fontSize: theme.typography.fontSize.xs + 1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  featureText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  intensityList: {
    width: '100%',
  },
  intensityCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.sm + 4,
    marginBottom: theme.spacing.sm,
  },
  intensityCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceVariant,
  },
  intensityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  intensityName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  selectedCheck: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  intensityDesc: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  intensitySample: {
    fontSize: 11,
    color: theme.colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  scopeBanner: {
    width: '100%',
    backgroundColor: '#0E1724',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  scopeBadgeText: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.heavy,
    color: theme.colors.primary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  scopeBodyText: {
    fontSize: 11,
    color: theme.colors.textPrimary,
    lineHeight: 16,
  },
  scopeHighlight: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  permissionBox: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1.5,
    padding: theme.spacing.md,
  },
  permStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  permStatusLabel: {
    fontSize: theme.typography.fontSize.xs + 1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  permStatusBadge: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.heavy,
  },
  permExplainer: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  settingsButton: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  settingsButtonText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  spacer: {
    flex: 1,
  },
  backButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.xs + 1,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  nextButton: {
    flex: 2,
    paddingVertical: theme.spacing.sm + 4,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: theme.typography.fontSize.xs + 1,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
    textTransform: 'uppercase',
  },
});
