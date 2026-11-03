// Écran temporaire pour Météo, Alertes, Journal et Conseils.
// On le remplacera un par un par les vrais écrans (dans des fichiers séparés).

import { StyleSheet, Text, View } from 'react-native';
import { colors, sizes } from '../theme';

export default function PlaceholderScreen({ route }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{route.name} : bientôt ici</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  text: { fontSize: sizes.text, color: colors.text },
});
