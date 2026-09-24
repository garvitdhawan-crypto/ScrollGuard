import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface DoodleIconProps {
  color?: string;
  size?: number;
}

export const DoodleShield: React.FC<DoodleIconProps> = ({ color = '#00FFA3', size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Slightly irregular sketch outline */}
    <Path
      d="M50 10 C75 14, 88 20, 88 38 C88 64, 68 84, 50 92 C32 84, 12 64, 12 38 C12 20, 25 14, 50 10 Z"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="98, 2"
    />
    {/* Inner rough sketch line */}
    <Path
      d="M50 20 C70 23, 78 28, 78 42 C78 60, 62 74, 50 82 C38 74, 22 60, 22 42 C22 28, 30 23, 50 20 Z"
      stroke={color}
      strokeWidth="2"
      strokeOpacity="0.4"
      strokeLinecap="round"
    />
    {/* Center spark / eye */}
    <Circle cx="50" cy="46" r="6" fill={color} />
  </Svg>
);

export const DoodleFlame: React.FC<DoodleIconProps> = ({ color = '#FF5722', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Path
      d="M52 12 C58 28, 78 40, 78 64 C78 79, 66 90, 50 90 C34 90, 22 79, 22 64 C22 44, 40 32, 42 22 C36 34, 34 50, 42 58 C46 62, 54 62, 58 56 C62 50, 56 36, 52 12 Z"
      stroke={color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={`${color}22`}
    />
  </Svg>
);

export const DoodleCatHead: React.FC<DoodleIconProps> = ({ color = '#00FFA3', size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Hand-drawn cat head with irregular ears */}
    <Path
      d="M26 38 L16 18 C26 22, 38 25, 48 24 C58 25, 70 22, 80 18 L70 38 C84 46, 88 64, 80 78 C70 92, 28 92, 18 78 C10 64, 14 46, 26 38 Z"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Left eye */}
    <Circle cx="36" cy="56" r="4" fill={color} />
    {/* Right eye */}
    <Circle cx="62" cy="56" r="4" fill={color} />
    {/* Whiskers */}
    <Path d="M14 58 L28 60 M12 68 L26 66 M84 58 L70 60 M86 68 L72 66" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

export const DoodleTombstone: React.FC<DoodleIconProps> = ({ color = '#94A3B8', size = 32 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    {/* Irregular hand-drawn tombstone */}
    <Path
      d="M24 88 L24 40 C24 22, 36 12, 50 12 C64 12, 76 22, 76 40 L76 88 Z"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Ground rubble line */}
    <Path d="M12 88 L88 88 M18 94 L82 94" stroke={color} strokeWidth="3" strokeLinecap="round" />
    {/* Cross / RIP doodle */}
    <Path d="M50 32 L50 56 M40 42 L60 42" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </Svg>
);

export const DoodleStar: React.FC<DoodleIconProps> = ({ color = '#FFD700', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Path
      d="M50 10 L62 38 L92 40 L68 58 L76 88 L50 70 L24 88 L32 58 L8 40 L38 38 Z"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill={`${color}33`}
    />
  </Svg>
);

export const DoodleQuote: React.FC<DoodleIconProps> = ({ color = '#232E45', size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Path
      d="M22 55 C22 40, 32 30, 44 26 L46 36 C38 38, 34 44, 34 50 L46 50 L46 74 L22 74 Z M60 55 C60 40, 70 30, 82 26 L84 36 C76 38, 72 44, 72 50 L84 50 L84 74 L60 74 Z"
      stroke={color}
      strokeWidth="3"
      fill={color}
    />
  </Svg>
);
