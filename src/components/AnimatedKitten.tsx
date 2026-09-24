import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { theme } from '../theme';
import { KittenStage } from '../store';

/**
 * AnimatedKitten
 *
 * Architecture & Integration:
 * - Currently implements continuous interactive state-driven SVG character animation
 *   with idle breathing loops, health-reactive poses, and spring reactions on tap.
 * - Ready for drop-in Lottie (.json) or Rive (.riv) assets:
 *   Place your animation files into `src/assets/animations/kitten/`
 *   and load with:
 *     import LottieView from 'lottie-react-native';
 *     <LottieView source={KITTEN_ANIMATIONS[stage]} autoPlay loop />
 *
 * Animation File Mapping Guide:
 *   - 'healthy'  -> src/assets/animations/kitten/kitten_healthy.json (or kitten.riv / artboard "Healthy")
 *   - 'tired'    -> src/assets/animations/kitten/kitten_tired.json
 *   - 'sick'     -> src/assets/animations/kitten/kitten_sick.json
 *   - 'critical' -> src/assets/animations/kitten/kitten_critical.json
 *   - 'dead'     -> src/assets/animations/kitten/kitten_ghost.json
 */

interface AnimatedKittenProps {
  stage: KittenStage;
  healthPercent: number;
  onTap?: () => void;
  size?: number;
}

export const AnimatedKitten: React.FC<AnimatedKittenProps> = ({
  stage,
  onTap,
  size = 110,
}) => {
  // Idle breathing loop animation
  const breathAnim = useRef(new Animated.Value(1)).current;
  // Interactive tap bounce spring
  const tapSpring = useRef(new Animated.Value(1)).current;
  // Shiver / trembling animation for sick/critical
  const shiverAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Breathing cycle
    const breathing = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: stage === 'tired' ? 1.03 : 1.06,
          duration: stage === 'tired' ? 1600 : 900,
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 0.96,
          duration: stage === 'tired' ? 1600 : 900,
          useNativeDriver: true,
        }),
      ]),
    );

    breathing.start();

    // Shiver loop for sick and critical
    let shiver: Animated.CompositeAnimation | null = null;
    if (stage === 'sick' || stage === 'critical') {
      shiver = Animated.loop(
        Animated.sequence([
          Animated.timing(shiverAnim, {
            toValue: stage === 'critical' ? 4 : 2,
            duration: 60,
            useNativeDriver: true,
          }),
          Animated.timing(shiverAnim, {
            toValue: stage === 'critical' ? -4 : -2,
            duration: 60,
            useNativeDriver: true,
          }),
        ]),
      );
      shiver.start();
    } else {
      shiverAnim.setValue(0);
    }

    return () => {
      breathing.stop();
      shiver?.stop();
    };
  }, [stage, breathAnim, shiverAnim]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(tapSpring, {
        toValue: 0.88,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(tapSpring, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    onTap?.();
  };

  const getStageColor = () => {
    switch (stage) {
      case 'healthy':
        return theme.colors.primary;
      case 'tired':
        return theme.colors.warning;
      case 'sick':
        return theme.colors.accent;
      case 'critical':
      case 'dead':
        return theme.colors.error;
    }
  };

  const color = getStageColor();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={[styles.container, { width: size, height: size }]}
    >
      <Animated.View
        style={[
          styles.animationWrapper,
          {
            transform: [
              { scaleY: breathAnim },
              { scale: tapSpring },
              { translateX: shiverAnim },
            ],
          },
        ]}
      >
        <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
          {/* Ghost Aura / Halo if Dead */}
          {stage === 'dead' && (
            <>
              <Circle cx="60" cy="24" r="14" stroke="#94A3B8" strokeWidth="2.5" strokeDasharray="4, 3" />
              <Path
                d="M40 100 Q60 88 80 100"
                stroke="#64748B"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Hand-Drawn Animated Cat Silhouette Body */}
          <Path
            d={
              stage === 'dead'
                ? 'M34 60 C34 40, 48 30, 60 30 C72 30, 86 40, 86 60 C86 86, 76 96, 60 96 C44 96, 34 86, 34 60 Z'
                : stage === 'tired'
                ? 'M28 54 L20 34 C30 38, 44 42, 58 42 C72 42, 86 38, 96 34 L88 54 C98 62, 102 82, 92 96 C80 108, 36 108, 24 96 C14 82, 18 62, 28 54 Z'
                : 'M30 46 L20 22 C32 26, 46 30, 60 30 C74 30, 88 26, 100 22 L90 46 C102 54, 106 76, 96 92 C84 106, 36 106, 24 92 C14 76, 18 54, 30 46 Z'
            }
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`${color}18`}
          />

          {/* Ears interior lines */}
          <Path d="M30 38 L40 44 M90 38 L80 44" stroke={color} strokeWidth="2.5" strokeLinecap="round" />

          {/* Eyes based on state */}
          {stage === 'healthy' && (
            <>
              {/* Happy alert eyes */}
              <Circle cx="44" cy="62" r="5" fill={color} />
              <Circle cx="76" cy="62" r="5" fill={color} />
              {/* Eye shine */}
              <Circle cx="46" cy="60" r="1.5" fill="#FFFFFF" />
              <Circle cx="78" cy="60" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {stage === 'tired' && (
            <>
              {/* Sleepy curved lines */}
              <Path d="M38 64 Q44 60 50 64" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
              <Path d="M70 64 Q76 60 82 64" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}

          {stage === 'sick' && (
            <>
              {/* Dizzy / feverish spiral squint */}
              <Path d="M40 60 L48 66 M48 60 L40 66" stroke={color} strokeWidth="3" strokeLinecap="round" />
              <Path d="M72 60 L80 66 M80 60 L72 66" stroke={color} strokeWidth="3" strokeLinecap="round" />
              {/* Thermometer / sweat drop */}
              <Path d="M96 52 Q94 62 90 64 Q86 62 88 52 Z" fill={color} />
            </>
          )}

          {stage === 'critical' && (
            <>
              {/* Distressed wide eyes */}
              <Circle cx="44" cy="62" r="7" stroke={color} strokeWidth="3" fill="#000000" />
              <Circle cx="76" cy="62" r="7" stroke={color} strokeWidth="3" fill="#000000" />
              <Circle cx="44" cy="62" r="2" fill={color} />
              <Circle cx="76" cy="62" r="2" fill={color} />
            </>
          )}

          {stage === 'dead' && (
            <>
              {/* X eyes */}
              <Path d="M38 56 L50 68 M50 56 L38 68" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
              <Path d="M70 56 L82 68 M82 56 L70 68" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
            </>
          )}

          {/* Nose & Mouth */}
          <Path d="M57 71 L63 71 L60 74 Z" fill={color} />
          {stage === 'healthy' ? (
            <Path d="M54 77 Q60 82 66 77" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          ) : stage === 'dead' ? (
            <Path d="M54 80 L66 80" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          ) : (
            <Path d="M54 80 Q60 75 66 80" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          )}

          {/* Whiskers */}
          <Path d="M16 66 L30 68 M14 74 L28 73 M104 66 L90 68 M106 74 L92 73" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </Svg>
      </Animated.View>
      <Text style={styles.tapNudge}>Tap to pet ✨</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  animationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapNudge: {
    fontSize: 8,
    color: theme.colors.textMuted,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
