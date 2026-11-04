// ÉCRAN D'ACCUEIL : 4 grandes bandes pleine largeur (icône + mot).
// Pleine largeur et non grille 2×2 pour que « Fampitandremana » (15 lettres) ne soit jamais coupé.
// Chaque bande a une bordure verte et un fond beige (surface), lisible sans effort.

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, sizes } from '../theme';
import { t } from '../i18n/mg';

const TILES = [
  { screen: 'Meteo', label: t.meteo, icon: '⛅' },
  { screen: 'Alertes', label: t.alertes, icon: '🔔' },
  { screen: 'Journal', label: t.journal, icon: '📒' },
  { screen: 'Conseils', label: t.conseils, icon: '🌱' },
];

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {TILES.map((tile) => (
        <Pressable
          key={tile.screen}
          onPress={() => navigation.navigate(tile.screen)}
          accessibilityRole="button"
          accessibilityLabel={tile.label}
          style={({ pressed }) => [
            styles.tile,
            pressed && styles.tilePressed,
          ]}
        >
          <Text style={styles.icon}>{tile.icon}</Text>
          <Text style={styles.label}>{tile.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: sizes.padding,
    gap: sizes.gap,
    backgroundColor: colors.background,
  },
  tile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: sizes.radius + 4,
    backgroundColor: colors.surface,
  },
  tilePressed: {
    backgroundColor: colors.accent,
  },
  icon: {
    fontSize: 48,
  },
  label: {
    fontSize: sizes.textLarge,
    fontWeight: '800',
    color: colors.text,
  },
});
