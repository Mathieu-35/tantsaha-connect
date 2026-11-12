// ÉCRAN ALERTES : ce que le paysan doit savoir AUJOURD'HUI.
// Chaque alerte = icône du geste + 1-2 mots + date. Rouge seulement pour l'orage (danger).

import { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, fonts, sizes } from '../theme';
import { t } from '../i18n/mg';
import Pictogram, { pictoFor } from '../components/Pictogram';
import { ZafiBand } from '../components/Motifs';
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

// Frise des 12 mois : les mois de la période sont pleins (se lit sans mot).
function MonthsBar({ start, end, color }) {
  const inRange = (m) => (start <= end ? m >= start && m <= end : m >= start || m <= end);
  return (
    <View style={styles.months} accessible={false}>
      {Array.from({ length: 12 }, (_, i) => (
        <View key={i} style={[styles.month, inRange(i + 1) && { backgroundColor: color }]} />
      ))}
    </View>
  );
}

function StormCard({ item }) {
  return (
    <View style={styles.storm}>
      <View style={styles.stormBody}>
        <Pictogram name="storm" size={84} color={colors.cream} tone={colors.ochre} />
        <View style={styles.stormText}>
          <Text style={styles.stormTitle}>{t.alertTitle.STORM}</Text>
          <Text style={styles.stormBodyText}>{t.alertStormBody}</Text>
          <Text style={styles.stormDate}>{stormDate(item.date)}</Text>
        </View>
      </View>
      <ZafiBand id="zafiStorm" height={22} bg={colors.dangerDark} line={colors.cream} fill={colors.cream} />
    </View>
  );
}

function PeriodCard({ item, crop }) {
  const isSow = item.kind === 'SOW';
  return (
    <View style={styles.period}>
      <Pictogram name={pictoFor.alert[item.kind]} size={60} />
      <View style={styles.periodText}>
        <Text style={styles.periodTitle}>{t.alertTitle[item.kind]}</Text>
        {crop && (
          <View style={styles.cropLine}>
            <Pictogram name={pictoFor.crop[crop.icon] || 'plant'} size={26} />
            <Text style={styles.cropName}>{crop.name_mg}</Text>
          </View>
        )}
        <Text style={styles.date}>{periodText(item)}</Text>
        <MonthsBar start={item.startMonth} end={item.endMonth} color={isSow ? colors.primary : colors.ochre} />
      </View>
    </View>
  );
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
    if (item.kind === 'STORM') return <StormCard item={item} />;
    return <PeriodCard item={item} crop={crops[item.cropId]} />;
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
  container: { flex: 1, backgroundColor: colors.background, padding: sizes.padding + 4 },
  listen: { marginBottom: sizes.gap },
  list: { paddingBottom: 32, gap: sizes.gap },
  empty: { fontFamily: fonts.body, fontSize: sizes.textBody, color: colors.text, textAlign: 'center', marginTop: 40 },

  // Tempête : bandeau rouge plein, FIXE (pas de pulsation) — le rouge sert au danger seulement
  storm: { borderRadius: 20, overflow: 'hidden', backgroundColor: colors.danger },
  stormBody: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  stormText: { flex: 1, gap: 4 },
  stormTitle: { fontFamily: fonts.title, fontSize: 28, color: colors.textOnPrimary },
  stormBodyText: { fontFamily: fonts.body, fontSize: sizes.textBody, color: colors.textOnPrimary },
  stormDate: { fontFamily: fonts.bodyBold, fontSize: sizes.textSmall, color: colors.textOnPrimary },

  // Période de semis / récolte : carte à coins asymétriques + frise des mois
  period: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 24,
    minHeight: sizes.minTouch + 40,
  },
  periodText: { flex: 1, gap: 2 },
  periodTitle: { fontFamily: fonts.title, fontSize: 24, color: colors.text },
  cropLine: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cropName: { fontFamily: fonts.body, fontSize: sizes.textBody, color: colors.text },
  date: { fontFamily: fonts.body, fontSize: sizes.textBody, color: colors.text },
  months: { flexDirection: 'row', gap: 3, marginTop: 6 },
  month: {
    flex: 1,
    height: 14,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.text,
    backgroundColor: colors.cream,
  },
});
