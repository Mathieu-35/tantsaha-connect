// JOURNAL : la liste des notes (les plus récentes d'abord) + bouton pour en ajouter.
// Supprimer demande une confirmation. Le rouge sert uniquement à la suppression.

import { useCallback, useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, fonts, sizes } from '../theme';
import { t } from '../i18n/mg';
import Pictogram, { pictoFor } from '../components/Pictogram';
import { listObservations, deleteObservation } from '../db/observationsRepository';
import { listCrops } from '../db/referenceRepository';
import { syncAll } from '../services/syncService';
import ListenButton from '../components/ListenButton';

// Couleur du talon de chaque type de note
const STUB_COLOR = {
  PLANTING: colors.accent,
  RAIN: colors.rainSoft,
  PEST: colors.sand,
  HARVEST: colors.ochre,
};

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
      <View style={styles.ticket}>
        {/* Talon coloré : une couleur par type de note */}
        <View style={[styles.stub, { backgroundColor: STUB_COLOR[item.type] || colors.surface }]}>
          <Pictogram name={pictoFor.observation[item.type]} size={52} tone={colors.cream} />
        </View>
        <View style={[styles.notch, { top: -18 }]} />
        <View style={[styles.notch, { bottom: -18 }]} />
        <View style={styles.rowText}>
          <Text style={styles.rowTitle}>{t.obsType[item.type]}</Text>
          {crop && (
            <View style={styles.cropLine}>
              <Pictogram name={pictoFor.crop[crop.icon] || 'plant'} size={26} />
              <Text style={styles.cropName}>{crop.name_mg}</Text>
            </View>
          )}
          <Text style={styles.rowDate}>{formatDate(item.observed_on)}</Text>
        </View>
        <Pressable
          style={styles.deleteBtn}
          onPress={() => confirmDelete(item.id)}
          accessibilityRole="button"
          accessibilityLabel={t.delete}
        >
          <Pictogram name="trash" size={34} color={colors.danger} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}
        onPress={() => navigation.navigate('NewNote')}
        accessibilityRole="button"
        accessibilityLabel={t.addNote}
      >
        <Pictogram name="add" size={40} color={colors.textOnPrimary} />
        <Text style={styles.addText}>{t.addNote}</Text>
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
  container: { flex: 1, backgroundColor: colors.background, padding: sizes.padding + 4 },
  addBtn: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.primary,
    borderRadius: sizes.radiusPill,
    minHeight: 68,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.gap,
  },
  addBtnPressed: { backgroundColor: colors.primaryPress, transform: [{ scale: 0.97 }] },
  addText: { color: colors.textOnPrimary, fontSize: 24, fontFamily: fonts.bodyBold },
  listen: { marginBottom: sizes.gap },
  list: { paddingBottom: 32 },
  empty: { fontFamily: fonts.body, fontSize: sizes.textBody, color: colors.text, textAlign: 'center', marginTop: 40 },

  // Ticket : talon coloré + bord perforé
  ticket: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 92,
    backgroundColor: colors.paper,
    borderWidth: 3,
    borderColor: colors.text,
    borderRadius: 16,
    marginBottom: sizes.gap,
    overflow: 'hidden',
  },
  stub: {
    width: 88,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 3,
    borderStyle: 'dashed',
    borderColor: colors.text,
  },
  notch: {
    position: 'absolute',
    left: 70,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.background,
    borderWidth: 3,
    borderColor: colors.text,
  },
  rowText: { flex: 1, paddingVertical: 8, paddingLeft: 14, gap: 2 },
  rowTitle: { fontFamily: fonts.title, fontSize: 24, color: colors.text },
  cropLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cropName: { fontFamily: fonts.body, fontSize: sizes.textBody, color: colors.text },
  rowDate: { fontFamily: fonts.bodyBold, fontSize: sizes.textSmall, color: colors.text, opacity: 0.85 },
  deleteBtn: {
    width: 56,
    minHeight: sizes.minTouch,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
