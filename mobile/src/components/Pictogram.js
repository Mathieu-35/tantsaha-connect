// PICTOGRAMME : icônes dessinées sur mesure pour Tantsaha Connect (Sprint 9).
//
// Style : trait épais et arrondi + une couleur posée légèrement DÉCALÉE du contour,
// comme une impression artisanale. Chaque icône = quelques formes SVG (grille de 48 × 48).
// Les icônes sont décoratives : le mot malagasy (ou l'audio) reste toujours à côté.
//
// Utilisation :  <Pictogram name="rain" size={40} />
//   - name  : un nom de la table ICONS ci-dessous
//   - size  : taille en pixels (défaut : 32)
//   - color : couleur du trait (défaut : encre du thème)
//   - tone  : couleur de remplissage (défaut : celle prévue pour l'icône)
//
// Licence : dessins originaux du projet (aucun jeu d'icônes externe).

import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';
import { colors } from '../theme';

const CLOUD = 'M15 35a8 8 0 0 1-1-15.9A11 11 0 0 1 35 18a8.5 8.5 0 0 1 1 17z';

// Une forme : { d } chemin · { c: [x, y, r] } cercle · { e: [x, y, rx, ry] } ellipse
// `line: true` = simple trait (pas de remplissage) · `t: [x, y]` = décalage de la forme.
const ICONS = {
  // Météo
  sun: {
    tone: colors.ochre,
    shapes: [
      { c: [24, 24, 9] },
      { line: true, d: 'M24 5v5M24 38v5M5 24h5M38 24h5M10.5 10.5l3.5 3.5M34 34l3.5 3.5M37.5 10.5L34 14M14 34l-3.5 3.5' },
    ],
  },
  cloud: { tone: colors.sky, shapes: [{ d: CLOUD }] },
  rain: {
    tone: colors.rainSoft,
    shapes: [{ d: CLOUD, t: [0, -7] }, { line: true, d: 'M16 36l-2 6M25 36l-2 6M34 36l-2 6' }],
  },
  storm: {
    tone: colors.ochre,
    shapes: [{ d: CLOUD, t: [0, -8] }, { d: 'M27 29l-8 10h5l-2 7 10-11h-5z' }],
  },
  partly: {
    tone: colors.ochre,
    shapes: [
      { c: [15, 15, 6] },
      { line: true, d: 'M15 3v3M3 15h3M6.5 6.5l2 2M23.5 6.5l-2 2' },
      { d: CLOUD, t: [6, 7] },
    ],
  },
  // Écrans
  bell: {
    tone: colors.ochre,
    shapes: [
      { d: 'M24 7c-6.5 0-10 4.5-10 10.5V26l-4 6h28l-4-6V17.5C34 11.5 30.5 7 24 7z' },
      { line: true, d: 'M20 37a4 4 0 0 0 8 0' },
    ],
  },
  journal: {
    tone: colors.sand,
    shapes: [
      { d: 'M15 6h18a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H15a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z' },
      { line: true, d: 'M17 16h14M17 23h14M17 30h8' },
    ],
  },
  plant: {
    tone: colors.accent,
    shapes: [
      { line: true, d: 'M24 42V26' },
      { d: 'M24 28c-9 0-14-5-14-13 9 0 14 5 14 13z' },
      { d: 'M24 23c0-8 4-13 13-13 0 8-4 13-13 13z' },
    ],
  },
  // Observations, cultures, conseils
  pest: {
    tone: colors.ochre,
    shapes: [
      { e: [24, 29, 10, 12] },
      { c: [24, 14, 5.5] },
      { line: true, d: 'M24 19v22M14 25l-7-3M14 32l-7 3M34 25l7-3M34 32l7 3M21 9l-3-4M27 9l3-4' },
    ],
  },
  harvest: {
    tone: colors.sand,
    shapes: [
      { d: 'M7 21h34l-4 20H11z' },
      { line: true, d: 'M15 21c0-8 4-13 9-13s9 5 9 13M18 28v7M24 28v7M30 28v7' },
    ],
  },
  rice: {
    tone: colors.ochre,
    shapes: [
      { line: true, d: 'M24 43V12' },
      { d: 'M24 16c-6-1-8-5-8-10 6 1 8 5 8 10z' },
      { d: 'M24 16c6-1 8-5 8-10-6 1-8 5-8 10z' },
      { d: 'M24 27c-6-1-9-5-9-10 6 1 9 5 9 10z' },
      { d: 'M24 27c6-1 9-5 9-10-6 1-9 5-9 10z' },
      { d: 'M24 38c-6-1-9-5-9-10 6 1 9 5 9 10z' },
      { d: 'M24 38c6-1 9-5 9-10-6 1-9 5-9 10z' },
    ],
  },
  corn: {
    tone: colors.ochre,
    shapes: [
      { d: 'M24 5c6 6 9 14 7 23-1 4-3 7-7 7s-6-3-7-7c-2-9 1-17 7-23z' },
      { line: true, d: 'M24 11v20M19 17h10M18 24h12' },
      { d: 'M24 42c-9 0-14-6-15-15 7 2 12 7 15 15z' },
      { d: 'M24 42c9 0 14-6 15-15-7 2-12 7-15 15z' },
    ],
  },
  cassava: {
    tone: colors.sand,
    shapes: [
      { d: 'M9 40C6 28 17 13 33 9c2 7-2 19-15 27-4 3-8 4-9 4z' },
      { line: true, d: 'M18 28l4 3M24 20l4 3M30 13l3 3M35 7l4-4M38 12l6-2' },
    ],
  },
  bean: {
    tone: colors.accent,
    shapes: [
      { d: 'M8 35C6 21 19 8 38 8c1 17-11 33-30 27z' },
      { c: [18, 26, 2.5] },
      { c: [25, 19, 2.5] },
      { c: [32, 13, 2] },
    ],
  },
  tip: {
    tone: colors.ochre,
    shapes: [
      { d: 'M24 6a12 12 0 0 0-7 22v5h14v-5a12 12 0 0 0-7-22z' },
      { line: true, d: 'M19 39h10M21 43h6' },
    ],
  },
  // Actions et états
  listen: {
    tone: colors.accent,
    shapes: [
      { d: 'M7 19h8l10-8v26l-10-8H7z' },
      { line: true, d: 'M32 18a8 8 0 0 1 0 12M37 12a15 15 0 0 1 0 24' },
    ],
  },
  pause: {
    tone: colors.sand,
    shapes: [
      { d: 'M14 9h4a2 2 0 0 1 2 2v26a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2z' },
      { d: 'M30 9h4a2 2 0 0 1 2 2v26a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2z' },
    ],
  },
  trash: {
    tone: colors.sand,
    shapes: [
      { d: 'M12 15h24l-2 26H14z' },
      { line: true, d: 'M8 15h32M19 15V9h10v6M20 23v12M28 23v12' },
    ],
  },
  add: { tone: colors.accent, shapes: [{ c: [24, 24, 17] }, { line: true, d: 'M24 15v18M15 24h18' }] },
  done: { tone: colors.accent, shapes: [{ c: [24, 24, 17] }, { line: true, d: 'M15 25l7 7 12-14' }] },
  pin: {
    tone: colors.accent,
    shapes: [{ d: 'M24 43C15 33 11 27 11 20a13 13 0 0 1 26 0c0 7-4 13-13 23z' }, { c: [24, 20, 4.5] }],
  },
  today: {
    tone: colors.ochre,
    shapes: [
      { d: 'M12 11h24a5 5 0 0 1 5 5v20a5 5 0 0 1-5 5H12a5 5 0 0 1-5-5V16a5 5 0 0 1 5-5z' },
      { line: true, d: 'M7 21h34M16 6v8M32 6v8' },
    ],
  },
  yesterday: {
    tone: colors.sand,
    shapes: [
      { d: 'M12 11h24a5 5 0 0 1 5 5v20a5 5 0 0 1-5 5H12a5 5 0 0 1-5-5V16a5 5 0 0 1 5-5z' },
      { line: true, d: 'M7 21h34M16 6v8M32 6v8M27 31h-9m4-4l-4 4 4 4' },
    ],
  },
  clock: { tone: colors.sand, shapes: [{ c: [24, 24, 16] }, { line: true, d: 'M24 14v10l7 4' }] },
  warning: {
    tone: colors.ochre,
    shapes: [{ d: 'M24 6L43 40H5z' }, { line: true, d: 'M24 18v11' }, { c: [24, 34.5, 1.2] }],
  },
  offline: {
    tone: colors.sky,
    shapes: [
      { line: true, d: 'M6 18a26 26 0 0 1 36 0M12 25a18 18 0 0 1 24 0M18 32a10 10 0 0 1 12 0M7 7l34 34' },
      { c: [24, 38, 2] },
    ],
  },
};

// Quel pictogramme pour quelle donnée (les clés viennent du serveur / de la base).
export const pictoFor = {
  weather: { SUN: 'sun', CLOUD: 'cloud', RAIN: 'rain', STORM: 'storm' },
  observation: { PLANTING: 'plant', RAIN: 'rain', PEST: 'pest', HARVEST: 'harvest' },
  crop: { rice: 'rice', corn: 'corn', cassava: 'cassava', bean: 'bean' },
  advice: { PEST: 'pest', SOWING: 'plant', WEATHER: 'storm' },
  alert: { SOW: 'plant', HARVEST: 'harvest', STORM: 'storm' },
};

function Shape({ s, ...props }) {
  const shape = s.c ? (
    <Circle cx={s.c[0]} cy={s.c[1]} r={s.c[2]} {...props} />
  ) : s.e ? (
    <Ellipse cx={s.e[0]} cy={s.e[1]} rx={s.e[2]} ry={s.e[3]} {...props} />
  ) : (
    <Path d={s.d} {...props} />
  );
  return s.t ? <G transform={`translate(${s.t[0]} ${s.t[1]})`}>{shape}</G> : shape;
}

export default function Pictogram({ name, size = 32, color = colors.text, tone, style }) {
  const icon = ICONS[name] || ICONS.plant;
  const fill = tone || icon.tone;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      style={style}
      accessible={false}
      importantForAccessibility="no"
    >
      {/* 1) la couleur, décalée */}
      <G transform="translate(2.5 2.5)">
        {icon.shapes.map((s, i) => (!s.line ? <Shape key={`f${i}`} s={s} fill={fill} /> : null))}
      </G>
      {/* 2) le contour, par-dessus */}
      <G fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        {icon.shapes.map((s, i) => (
          <Shape key={`o${i}`} s={s} />
        ))}
      </G>
    </Svg>
  );
}
