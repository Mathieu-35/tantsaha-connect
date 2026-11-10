// JOURNAL : la liste des notes (les plus récentes d'abord) + bouton pour en ajouter.
// Supprimer demande une confirmation. Le rouge sert uniquement à la suppression.

import { useCallback, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, sizes } from '../theme';
import { t } from '../i18n/mg';
import { listObservations, deleteObservation } from '../db/observationsRepository';
import { listCrops } from '../db/referenceRepository';
import { syncAll } from '../services/syncService';
import ListenButton from '../components/ListenButton';

function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function JournalScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [crops, setCrops] = useState({});

  const load = useCallback(async () => {
    const [list, cropList] = await Promise.all([listObservations(), listCrops()]);
    setNotes(list);
    setCrops(Object.fromEntries(cropList.map((c) => [c.id, c])));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function confirmDelete(id) {
    Alert.alert(t.delete, t.confirmDelete, [
      { text: t.no, style: 'cancel' },
      {
        text: t.yes,
        style: 'destructive',
        onPress: async () => {
          await deleteObservation(id);
          await load();
          syncAll();
        },
      },
    ]);
  }

  function renderItem({ item }) {
    const crop = crops[item.crop_id];
    return (
      <View style={styles.row}>
        <Text style={styles.rowEmoji}>{t.obsEmoji[item.type]}</Text>
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>
            {t.obsType[item.type]}
            {crop ? ` · ${t.cropEmoji[crop.icon] || ''} ${crop.name_mg}` : ''}
          </Text>
          <Text style={styles.rowDate}>{formatDate(item.observed_on)}</Text>
        </View>
        <Pressable style={styles.deleteBtn} onPress={() => confirmDelete(item.id)}>
          <Text style={styles.deleteText}>🗑</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
        onPress={() => navigation.navigate('NewNote')}
      >
        <Text style={styles.addText}>➕ {t.addNote}</Text>
      </Pressable>

      <ListenButton audioKey="screen_journal" style={styles.listen} />
      <FlatList
        data={notes}
        keyExtractor={(n) => n.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>{t.journalEmpty}</Text>}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: sizes.padding },
  addBtn: {
    backgroundColor: colors.primary,
    borderRadius: sizes.radiusPill,
    minHeight: sizes.minTouch + 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.gap,
  },
  addBtnPressed: { backgroundColor: colors.primaryPress },
  addText: { color: colors.textOnPrimary, fontSize: sizes.textLarge, fontWeight: 'bold' },
  listen: { marginBottom: sizes.gap },
  list: { paddingBottom: 32 },
  empty: { fontSize: sizes.textBody, color: colors.text, textAlign: 'center', marginTop: 40 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: sizes.radius,
    padding: sizes.padding,
    marginBottom: sizes.gap,
  },
  rowEmoji: { fontSize: 36, marginRight: 12 },
  rowText: { flex: 1 },
  rowTitle: { fontSize: sizes.textBody, fontWeight: 'bold', color: colors.text },
  rowDate: { fontSize: 14, color: colors.text, opacity: 0.7, marginTop: 2 },
  deleteBtn: {
    minWidth: sizes.minTouch,
    minHeight: sizes.minTouch,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: { fontSize: 26, color: colors.danger },
});
