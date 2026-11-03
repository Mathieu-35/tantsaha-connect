// ÉCRAN D'ACCUEIL : 4 grandes tuiles, compréhensibles sans lire (icône + couleur + un mot).

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, sizes } from '../theme';
import { t } from '../i18n/mg';

// Les 4 tuiles : on les décrit dans un tableau, puis on les dessine avec .map()
const TILES = [
  { screen: 'Meteo', label: t.meteo, icon: '⛅', color: colors.meteo },
  { screen: 'Alertes', label: t.alertes, icon: '🔔', color: colors.alertes },
  { screen: 'Journal', label: t.journal, icon: '📒', color: colors.journal },
  { screen: 'Conseils', label: t.conseils, icon: '🌱', color: colors.conseils, darkText: true },
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
            { backgroundColor: tile.color, transform: [{ scale: pressed ? 0.96 : 1 }] },
          ]}
        >
          <Text style={styles.icon}>{tile.icon}</Text>
          <Text style={[styles.label, { color: tile.darkText ? colors.text : colors.textOnDark }]}>
            {tile.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',          // les tuiles passent à la ligne : 2 par rangée
    gap: sizes.gap,
    padding: sizes.gap,
    backgroundColor: colors.background,
  },
  tile: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: sizes.radius,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  icon: { fontSize: 64 },
  label: { fontSize: 18, fontWeight: 'bold' },
});
