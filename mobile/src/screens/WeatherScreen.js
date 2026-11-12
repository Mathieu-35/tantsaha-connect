// ÉCRAN MÉTÉO — Sprint 4
// Affiche la météo de la région choisie : aujourd'hui en grand, puis 4 jours.
// Source : d'abord le cache SQLite (instantané), puis une requête au serveur.

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import ListenButton from '../components/ListenButton';
import { colors, fonts, sizes } from '../theme';
import { t } from '../i18n/mg';
import Pictogram, { pictoFor } from '../components/Pictogram';
import { Terraces } from '../components/Motifs';
import { getMeta } from '../db/metaRepository';
import { getWeather, saveWeather } from '../db/weatherRepository';
import { api } from '../services/api';

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function dayName(dateStr) {
  const d = new Date(dateStr);
  return t.dayNames[d.getDay()];
}

export default function WeatherScreen() {
  const [days, setDays] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [stale, setStale] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const regionId = await getMeta('region_id');
      if (!regionId) { setLoading(false); return; }

      const cached = await getWeather(regionId);
      if (cached && !cancelled) {
        setDays(cached.days);
        setFetchedAt(cached.fetchedAt);
        setStale(cached.stale);
      }

      try {
        const fresh = await api.weather(regionId);
        if (!cancelled) {
          setDays(fresh.days);
          setFetchedAt(fresh.fetchedAt);
          setStale(fresh.stale);
          await saveWeather(regionId, fresh.days, fresh.fetchedAt, fresh.stale);
        }
      } catch {
        if (!cached && !cancelled) setError(true);
      }

      if (!cancelled) setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>{t.weatherLoading}</Text>
      </View>
    );
  }

  if (!days || days.length === 0) {
    return (
      <View style={styles.center}>
        <Pictogram name="partly" size={88} style={styles.emptyIcon} />
        <Text style={styles.emptyText}>{t.noWeatherData}</Text>
      </View>
    );
  }

  const todayData = days[0];
  const nextDays = days.slice(1, 5);
  const todayIcon = pictoFor.weather[todayData.icon] || 'partly';

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {stale && (
        <View style={styles.staleBanner}>
          <Pictogram name="warning" size={32} />
          <Text style={styles.staleText}>{t.staleWarning}</Text>
        </View>
      )}

      {/* Aujourd'hui : grand panneau vert, terrasses en fond */}
      <View style={styles.todayCard}>
        <Terraces style={styles.todayTerraces} />
        <View style={styles.todayTop}>
          <View style={styles.todayLeft}>
            <Text style={styles.todayLabel}>{t.today}</Text>
            <Text style={styles.todayTemp}>{Math.round(todayData.tempMax)}°</Text>
            <Text style={styles.todayTempMin}>
              {t.tempMin} {Math.round(todayData.tempMin)}°
            </Text>
            <Text style={styles.todayWeather}>{t.weatherLabel[todayData.icon] || ''}</Text>
          </View>
          <Pictogram name={todayIcon} size={124} color={colors.cream} />
        </View>
        {/* Mesure de pluie : la barre se lit sans mot */}
        {todayData.rainChance > 0 && (
          <View style={styles.rainRow}>
            <Pictogram name="rain" size={34} color={colors.cream} />
            <View style={styles.rainTrack}>
              <View style={[styles.rainFill, { width: `${Math.min(100, todayData.rainChance)}%` }]} />
            </View>
            <Text style={styles.rainText}>
              {t.rain} {todayData.rainChance}%
            </Text>
          </View>
        )}
      </View>

      {/* Les jours suivants : pastilles hautes, en rang */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.days}>
        {nextDays.map((day) => (
          <View key={day.date} style={styles.day}>
            <Text style={styles.dayName}>{dayName(day.date)}</Text>
            <Pictogram name={pictoFor.weather[day.icon] || 'partly'} size={48} />
            <Text style={styles.dayTempMax}>{Math.round(day.tempMax)}°</Text>
            <Text style={styles.dayRain}>{day.rainChance > 0 ? `${day.rainChance}%` : ' '}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bouton Henoy : voix embarquée (provisoire = bips, voir audioMap.js) */}
      <ListenButton audioKey="screen_weather" style={styles.listenBtn} />

      {fetchedAt && (
        <View style={styles.lastUpdateRow}>
          <Pictogram name="clock" size={22} />
          <Text style={styles.lastUpdate}>
            {t.lastUpdate} : {formatTime(fetchedAt)}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: sizes.padding + 4, paddingBottom: 32, gap: sizes.gap },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: sizes.padding },
  loadingText: { marginTop: sizes.gap, fontFamily: fonts.body, fontSize: sizes.textBody, color: colors.text },

  emptyIcon: { marginBottom: sizes.gap },
  emptyText: { fontFamily: fonts.body, fontSize: sizes.textBody, color: colors.text, textAlign: 'center', paddingHorizontal: 24 },

  staleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: sizes.radius,
    padding: sizes.padding,
  },
  staleText: { flex: 1, fontFamily: fonts.bodyBold, fontSize: sizes.textBody, color: colors.text },

  todayCard: {
    backgroundColor: colors.primary,
    borderRadius: 32,
    borderBottomLeftRadius: 8,
    padding: 20,
    overflow: 'hidden',
  },
  todayTerraces: { top: 90 },
  todayTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  todayLeft: { flexShrink: 1 },
  todayLabel: { fontFamily: fonts.bodyBold, fontSize: sizes.textLarge, color: colors.textOnPrimary },
  todayTemp: { fontFamily: fonts.title, fontSize: 80, lineHeight: 84, color: colors.textOnPrimary },
  todayTempMin: { fontFamily: fonts.body, fontSize: sizes.textBody, color: colors.textOnPrimary },
  todayWeather: { fontFamily: fonts.bodyBold, fontSize: sizes.textBody, color: colors.cream, marginTop: 4 },
  rainRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 },
  rainTrack: { flex: 1, height: 18, borderRadius: 9, backgroundColor: colors.primaryPress, overflow: 'hidden' },
  rainFill: { height: 18, borderRadius: 9, backgroundColor: colors.rainSoft },
  rainText: { fontFamily: fonts.bodyBold, fontSize: sizes.textBody, color: colors.textOnPrimary },

  days: { gap: 10, paddingRight: sizes.padding + 4 },
  day: {
    width: 96,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 48,
    backgroundColor: colors.surface,
  },
  dayName: { fontFamily: fonts.bodyBold, fontSize: sizes.textSmall, color: colors.text },
  dayTempMax: { fontFamily: fonts.title, fontSize: 28, color: colors.text },
  dayRain: { fontFamily: fonts.bodyBold, fontSize: sizes.textSmall, color: colors.rain },

  listenBtn: { marginTop: 4 },

  lastUpdateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  lastUpdate: { fontFamily: fonts.bodyBold, fontSize: sizes.textSmall, color: colors.text, opacity: 0.8 },
});
