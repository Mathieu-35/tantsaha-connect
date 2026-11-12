// COCHE « Voatahiry » : elle se dessine UNE SEULE fois (0,35 s) pour confirmer l'enregistrement.
// C'est la seule animation « décorative » gardée, parce qu'elle dit quelque chose : c'est enregistré.
// Si le téléphone est réglé sur « réduire les animations », la coche apparaît tout de suite.

import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '../theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const LENGTH = 30;

export default function SavedCheck({ size = 120 }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduced) => {
      if (cancelled) return;
      if (reduced) progress.setValue(1);
      else Animated.timing(progress, { toValue: 1, duration: 350, useNativeDriver: false }).start();
    });
    return () => {
      cancelled = true;
    };
  }, [progress]);

  const offset = progress.interpolate({ inputRange: [0, 1], outputRange: [LENGTH, 0] });

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" accessible={false} importantForAccessibility="no">
      <Circle cx={26.5} cy={26.5} r={17} fill={colors.accent} />
      <Circle cx={24} cy={24} r={17} fill="none" stroke={colors.text} strokeWidth={3} />
      <AnimatedPath
        d="M15 25l7 7 12-14"
        fill="none"
        stroke={colors.text}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={[LENGTH, LENGTH]}
        strokeDashoffset={offset}
      />
    </Svg>
  );
}
