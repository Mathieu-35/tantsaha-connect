// ÉCRAN CONSEILS : cartes de conseils (icône + titre + texte) avec lecture à voix haute.
// Les conseils viennent de SQLite (données de référence) ; les audios sont embarqués.

import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, sizes } from '../theme';
import { t } from '../i18n/mg';
import { listAdvices } from '../db/referenceRepository';
import { audioKey } from '../data/audioMap';
import ListenButton from '../components/ListenButton';

export default function AdviceScreen() {
  const [advices, setAdvices] = useState([]);

  useFocusEffect(
    useCallback(() => {
      listAdvices().then(setAdvices);
    }, [])
  );

  function renderItem({ item }) {
    return (
      <View style={styles.card}>
        <Text style={styles.emoji}>{t.adviceTopicEmoji[item.topic] || '💡'}</Text>
        <Text style={styles.title}>{item.title_mg}</Text>
        <Text style={styles.text}>{item.text_mg}</Text>
        <ListenButton audioKey={audioKey(item.audio_file)} style={styles.listen} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={advices}
        keyExtractor={(a) => a.id}
        renderItem={renderItem}
        ListHeaderComponent={<ListenButton audioKey="screen_advice" style={styles.listen} />}
        ListEmptyComponent={<Text style={styles.empty}>{t.adviceEmpty}</Text>}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: sizes.padding },
  list: { paddingBottom: 32 },
  empty: { fontSize: sizes.textBody, color: colors.text, textAlign: 'center', marginTop: 40 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radius,
    padding: sizes.padding * 1.5,
    marginTop: sizes.gap,
  },
  emoji: { fontSize: 44, marginBottom: 4 },
  title: { fontSize: sizes.textLarge, fontWeight: 'bold', color: colors.text, marginBottom: 6 },
  text: { fontSize: sizes.textBody, color: colors.text, marginBottom: sizes.gap },
  listen: { alignSelf: 'stretch' },
});
