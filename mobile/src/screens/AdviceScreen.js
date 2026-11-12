// ÉCRAN CONSEILS : cartes de conseils (icône + titre + texte) avec lecture à voix haute.
// Les conseils viennent de SQLite (données de référence) ; les audios sont embarqués.

import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, fonts, sizes } from '../theme';
import { t } from '../i18n/mg';
import Pictogram, { pictoFor } from '../components/Pictogram';
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
      <View style={styles.bubbleWrap}>
        <View style={styles.bubble}>
          <View style={styles.head}>
            <Pictogram name={pictoFor.advice[item.topic] || 'tip'} size={56} />
            <Text style={styles.title}>{item.title_mg}</Text>
          </View>
          <Text style={styles.text}>{item.text_mg}</Text>
          <ListenButton audioKey={audioKey(item.audio_file)} style={styles.listen} />
        </View>
        <View style={styles.tail} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={advices}
        keyExtractor={(a) => a.id}
        renderItem={renderItem}
        ListHeaderComponent={<ListenButton audioKey="screen_advice" style={styles.listenTop} />}
        ListEmptyComponent={<Text style={styles.empty}>{t.adviceEmpty}</Text>}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: sizes.padding + 4 },
  list: { paddingBottom: 32 },
  empty: { fontFamily: fonts.body, fontSize: sizes.textBody, color: colors.text, textAlign: 'center', marginTop: 40 },
  listenTop: { marginBottom: sizes.gap },

  // Conseil = bulle de parole : c'est une voix qui parle
  bubbleWrap: { marginBottom: 28 },
  bubble: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    borderBottomRightRadius: 36,
    borderBottomLeftRadius: 8,
    padding: 18,
    gap: sizes.gap,
  },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { flex: 1, fontFamily: fonts.title, fontSize: sizes.textLarge + 2, color: colors.text },
  text: { fontFamily: fonts.body, fontSize: sizes.textBody, lineHeight: 26, color: colors.text },
  listen: { alignSelf: 'stretch' },
  tail: {
    position: 'absolute',
    left: 22,
    bottom: -18,
    width: 0,
    height: 0,
    borderLeftWidth: 0,
    borderRightWidth: 28,
    borderTopWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.surface,
  },
});
