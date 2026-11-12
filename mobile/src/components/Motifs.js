// MOTIFS LOCAUX (Sprint 9) : trois décors inspirés de l'artisanat malagasy.
// Ce sont des interprétations simples, à faire valider par des locuteurs / artisans.
//   - ZafiBand      : bande de losanges (esprit des sculptures zafimaniry)
//   - LambaStripe   : rayures de tissu lamba
//   - Terraces      : courbes de niveau des rizières en terrasses
//   - Landscape     : paysage de rizières avec un ravenala (en-tête de l'accueil)
// Les couleurs viennent du thème.

import { View } from 'react-native';
import Svg, { Circle, Defs, G, Path, Pattern, Rect } from 'react-native-svg';
import { colors } from '../theme';

// Bande de losanges. `id` doit être différent pour chaque bande affichée en même temps.
export function ZafiBand({ id = 'zafi', height = 26, bg = colors.primary, line = colors.cream, fill = colors.ochre }) {
  const s = height;
  const m = s / 2;
  return (
    <Svg width="100%" height={height} accessible={false} importantForAccessibility="no">
      <Defs>
        <Pattern id={id} width={s} height={s} patternUnits="userSpaceOnUse">
          <Path d={`M${m} 2L${s - 2} ${m}L${m} ${s - 2}L2 ${m}z`} fill="none" stroke={line} strokeWidth={2} />
          {fill && <Path d={`M${m} ${m - 5}L${m + 5} ${m}L${m} ${m + 5}L${m - 5} ${m}z`} fill={fill} />}
        </Pattern>
      </Defs>
      <Rect width="100%" height={height} fill={bg} />
      <Rect width="100%" height={height} fill={`url(#${id})`} />
    </Svg>
  );
}

// Rayures de lamba : vert, crème, ocre, encre, vert clair, crème, bleu pluie.
const LAMBA = [
  [3, colors.primary],
  [1, colors.cream],
  [2, colors.ochre],
  [1, colors.text],
  [3, colors.accent],
  [1, colors.cream],
  [2, colors.rain],
];
export function LambaStripe({ height = 12 }) {
  return (
    <View style={{ height, flexDirection: 'row' }} accessible={false}>
      {LAMBA.map(([flex, color], i) => (
        <View key={i} style={{ flex, backgroundColor: color }} />
      ))}
    </View>
  );
}

// Courbes de niveau : à poser en fond (position absolue) d'une carte.
export function Terraces({ color = colors.accent, opacity = 0.55, style }) {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 360 160"
      preserveAspectRatio="none"
      style={[{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }, style]}
      accessible={false}
      importantForAccessibility="no"
    >
      <Path d="M0 120C80 100 160 126 240 110S330 100 360 110" fill="none" stroke={color} strokeWidth={3} opacity={opacity} />
      <Path d="M0 140C90 120 170 146 250 130S340 120 360 130" fill="none" stroke={color} strokeWidth={3} opacity={opacity} />
      <Path d="M0 160C90 140 170 166 250 150S340 140 360 150" fill="none" stroke={color} strokeWidth={3} opacity={opacity} />
    </Svg>
  );
}

// Un ravenala (arbre du voyageur) : 7 feuilles en éventail.
function Ravenala({ x, y, scale = 1 }) {
  const angles = [-62, -40, -20, 0, 20, 40, 62];
  return (
    <G transform={`translate(${x} ${y}) scale(${scale})`}>
      <Path d="M0 0V38" stroke="#1E5A0E" strokeWidth={5} strokeLinecap="round" />
      {angles.map((a) => (
        <Path key={a} d="M0 0C-4-10-4-24 0-34C4-24 4-10 0 0z" fill="#1E5A0E" transform={`rotate(${a})`} />
      ))}
    </G>
  );
}

// Paysage de l'accueil : ciel, soleil, collines, terrasses, ravenala.
export function Landscape({ height = 228 }) {
  return (
    <Svg
      width="100%"
      height={height}
      viewBox="0 0 390 228"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', left: 0, top: 0 }}
      accessible={false}
      importantForAccessibility="no"
    >
      <Rect width="390" height="228" fill="#FFE7A0" />
      <Circle cx="300" cy="70" r="30" fill={colors.ochre} />
      <Path d="M0 136C60 106 110 116 170 131S300 116 390 134V228H0z" fill="#A9D68F" />
      <Path d="M0 160C70 138 140 150 200 158S330 146 390 160V228H0z" fill={colors.accent} />
      <Path d="M0 172C80 158 150 168 210 172S320 162 390 174" fill="none" stroke={colors.primary} strokeWidth={2.5} opacity={0.55} />
      <Ravenala x={330} y={130} />
      <Path d="M0 192C90 178 170 190 240 194S340 184 390 196V228H0z" fill={colors.primary} />
      <Path d="M0 206C90 194 170 204 240 208S340 200 390 210" fill="none" stroke={colors.accent} strokeWidth={2.5} opacity={0.7} />
    </Svg>
  );
}
