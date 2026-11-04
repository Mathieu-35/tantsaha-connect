// ÉCRAN DE CHOIX DE LA RÉGION : affiché une seule fois, au tout premier lancement.
// Le paysan appuie sur sa région → elle est enregistrée dans la base → on passe à l'accueil.
// Gros boutons avec l'icône 📍, lisibles sans effort (critère C1 : accessibilité).

import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, sizes } from '../theme';
import { t } from '../i18n/mg';
import { listRegions } from '../db/referenceRepository';
import { setMeta } from '../db/metaRepository';

export default function RegionChoiceScreen({ navigation }) {
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    listRegions().then(setRegions);
  }, []);

  async function choose(region) {
    await setMeta('region_id', region.id);
    navigation.replace('Home');
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.question}>{t.regionQuestion}</Text>
      {regions.map((region) => (
        <Pressable
          key={region.id}
          onPress={() => choose(region)}
          accessibilityRole="button"
          accessibilityLabel={region.name_mg}
          style={({ pressed }) => [
            styles.choice,
            pressed && styles.choicePressed,
          ]}
        >
          <Text style={styles.choiceIcon}>📍</Text>
          <Text style={styles.choiceText}>{region.name_mg}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: sizes.padding,
    gap: sizes.gap,
  },
  question: {
    fontSize: sizes.title,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginVertical: 4,
  },
  choice: {
    minHeight: 72,
    width: '100%',
    borderWidth: 3,
    borderColor: colors.primary,
    borderRadius: sizes.radius + 4,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  choicePressed: {
    backgroundColor: colors.accent,
  },
  choiceIcon: {
    fontSize: 32,
  },
  choiceText: {
    fontSize: sizes.textLarge,
    fontWeight: '700',
    color: colors.text,
  },
});
