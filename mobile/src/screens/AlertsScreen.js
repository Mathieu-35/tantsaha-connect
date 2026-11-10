// ÉCRAN ALERTES : ce que le paysan doit savoir AUJOURD'HUI.
// Chaque alerte = icône du geste + 1-2 mots + date. Rouge seulement pour l'orage (danger).

import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, sizes } from '../theme';
import { t } from '../i18n/mg';
import { getMeta } from '../db/metaRepository';
import { listCalendars, listCrops } from '../db/referenceRepository';
import { getWeather } from '../db/weatherRepository';
import { computeAlerts } from '../domain/alertEngine';
import { refreshAlertNotifications } from '../services/notificationService';
import ListenButton from '../components/ListenButton';

function periodText(alert) {
  return `${t.monthNames[alert.startMonth - 1]} – ${t.monthNames[alert.endMonth - 1]}`;
}

function stormDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const day = t.dayNames[new Date(y, m - 1, d).getDay()];
  return `${day} ${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}`;
}

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState([]);
  const [crops, setCrops] = useState({});

  useFocusEffect(
    useCallback(() => {
      async function load() {
        const regionId = await getMeta('region_id');
        if (!regionId) return;
        const [calendars, cropList, weather] = await Promise.all([
          listCalendars(regionId),
          listCrops(),
          getWeather(regionId),
        ]);
        setCrops(Object.fromEntries(cropList.map((c) => [c.id, c])));
        const found = computeAlerts({ calendars, today: new Date(), weatherDays: weather ? weather.days : [] });
        found.sort((a, b) => (a.kind === 'STORM' ? -1 : 0) - (b.kind === 'STORM' ? -1 : 0));
        setAlerts(found);
        refreshAlertNotifications();
      }
      load();
    }, [])
  );

  function renderItem({ item }) {
    const isStorm = item.kind === 'STORM';
    const crop = crops[item.cropId];
    return (
      <View style={[styles.row, isStorm && styles.rowDanger]}>
        <Text style={styles.emoji}>{t.alertEmoji[item.kind]}</Text>
        <View style={styles.rowText}>
          <Text style={styles.title}>
            {t.alertTitle[item.kind]}
            {crop ? ` · ${t.cropEmoji[crop.icon] || ''} ${crop.name_mg}` : ''}
          </Text>
          <Text style={styles.date}>{isStorm ? stormDate(item.date) : periodText(item)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ListenButton audioKey="screen_alerts" style={styles.listen} />
      <FlatList
        data={alerts}
        keyExtractor={(a, i) => `${a.kind}-${a.cropId || a.date}-${i}`}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>{t.alertsEmpty}</Text>}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: sizes.padding },
  listen: { marginBottom: sizes.gap },
  list: { paddingBottom: 32 },
  empty: { fontSize: sizes.textBody, color: colors.text, textAlign: 'center', marginTop: 40 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: sizes.radius,
    padding: sizes.padding,
    marginBottom: sizes.gap,
    minHeight: sizes.minTouch + 20,
  },
  rowDanger: { borderColor: colors.danger },
  emoji: { fontSize: 40, marginRight: 14 },
  rowText: { flex: 1 },
  title: { fontSize: sizes.textLarge, fontWeight: 'bold', color: colors.text },
  date: { fontSize: sizes.textBody, color: colors.text, opacity: 0.75, marginTop: 2 },
});
