// LOGO Tantsaha Connect : un ravenala (l'arbre du voyageur, emblème de Madagascar)
// dont l'éventail s'ouvre comme une pousse, sous un soleil d'ocre.

import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

const ANGLES = [-62, -30, 0, 30, 62];

export default function Logo({ size = 52, bg = colors.primary, leaf = colors.cream }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" accessible={false} importantForAccessibility="no">
      <Rect width="120" height="120" rx="30" fill={bg} />
      <Circle cx="84" cy="36" r="13" fill={colors.ochre} />
      <G transform="translate(52 78)" fill={leaf}>
        {ANGLES.map((a) => (
          <Path key={a} d="M0 0C-5-14-5-30 0-44C5-30 5-14 0 0z" transform={`rotate(${a})`} />
        ))}
      </G>
      <Path d="M52 78v22" stroke={leaf} strokeWidth={6} strokeLinecap="round" />
    </Svg>
  );
}
