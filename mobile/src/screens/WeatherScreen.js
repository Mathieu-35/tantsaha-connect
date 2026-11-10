// ÉCRAN MÉTÉO — Sprint 4
// Affiche la météo de la région choisie : aujourd'hui en grand, puis 4 jours.
// Source : d'abord le cache SQLite (instantané), puis une requête au serveur.

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import ListenButton from '../components/ListenButton';
import { colors, sizes } from '../theme';
import { t } from '../i18n/mg';
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
        <Text style={styles.emptyEmoji}>🌤️</Text>
        <Text style={styles.emptyText}>{error ? t.noWeatherData : t.noWeatherData}</Text>
      </View>
    );
  }

  const todayData = days[0];
  const nextDays = days.slice(1, 5);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {stale && (
        <View style={styles.staleBanner}>
          <Text style={styles.staleText}>⚠️ {t.staleWarning}</Text>
        </View>
      )}

      {/* Aujourd'hui — en grand */}
      <View style={styles.todayCard}>
        <Text style={styles.todayLabel}>{t.today}</Text>
        <Text style={styles.todayEmoji}>{t.weatherEmoji[todayData.icon] || '🌤️'}</Text>
        <Text style={styles.todayWeather}>{t.weatherLabel[todayData.icon] || ''}</Text>
        <Text style={styles.todayTemp}>{Math.round(todayData.tempMax)}°</Text>
        <Text style={styles.todayTempMin}>{t.tempMin} {Math.round(todayData.tempMin)}°</Text>
        {todayData.rainChance > 0 && (
          <Text style={styles.todayRain}>
            🌧️ {t.rain} : {todayData.rainChance}% — {todayData.rainMm} mm
          </Text>
        )}
      </View>

      {/* Jours suivants */}
      {nextDays.map((day) => (
        <View key={day.date} style={styles.dayRow}>
          <Text style={styles.dayName}>{dayName(day.date)}</Text>
          <Text style={styles.dayEmoji}>{t.weatherEmoji[day.icon] || '🌤️'}</Text>
          <View style={styles.dayTemps}>
            <Text style={styles.dayTempMax}>{Math.round(day.tempMax)}°</Text>
            <Text style={styles.dayTempMin}>{Math.round(day.tempMin)}°</Text>
          </View>
          {day.rainChance > 0 && (
            <Text style={styles.dayRain}>{day.rainChance}%</Text>
          )}
        </View>
      ))}

      {/* Bouton Henoy : voix embarquée (provisoire = bips, voir audioMap.js) */}
      <ListenButton audioKey="screen_weather" style={styles.listenBtn} />

      {/* Dernière mise à jour */}
      {fetchedAt && (
        <Text style={styles.lastUpdate}>
          🕘 {t.lastUpdate} : {formatTime(fetchedAt)}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  container: { padding: sizes.padding, paddingBottom: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: sizes.padding },
  loadingText: { marginTop: sizes.gap, fontSize: sizes.textBody, color: colors.text },

  emptyEmoji: { fontSize: 64, marginBottom: sizes.gap },
  emptyText: { fontSize: sizes.textBody, color: colors.text, textAlign: 'center', paddingHorizontal: 24 },

  staleBanner: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radius,
    padding: sizes.padding,
    marginBottom: sizes.gap,
  },
  staleText: { fontSize: sizes.textBody, color: colors.text, textAlign: 'center' },

  todayCard: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radius,
    padding: sizes.padding * 2,
    alignItems: 'center',
    marginBottom: sizes.gap,
  },
  todayLabel: { fontSize: sizes.textLarge, color: colors.text, fontWeight: 'bold', marginBottom: 4 },
  todayEmoji: { fontSize: 80, marginVertical: 8 },
  todayWeather: { fontSize: sizes.textBody, color: colors.text, marginBottom: 8 },
  todayTemp: { fontSize: 56, fontWeight: 'bold', color: colors.text },
  todayTempMin: { fontSize: sizes.textBody, color: colors.text, opacity: 0.7 },
  todayRain: { fontSize: sizes.textBody, color: colors.text, marginTop: 8 },

  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: sizes.radius,
    padding: sizes.padding,
    marginBottom: sizes.gap,
  },
  dayName: { flex: 1, fontSize: sizes.textBody, color: colors.text, fontWeight: '600' },
  dayEmoji: { fontSize: 28, marginHorizontal: 8 },
  dayTemps: { alignItems: 'flex-end', marginRight: 8 },
  dayTempMax: { fontSize: sizes.textBody, fontWeight: 'bold', color: colors.text },
  dayTempMin: { fontSize: 14, color: colors.text, opacity: 0.6 },
  dayRain: { fontSize: 14, color: colors.primary, fontWeight: '600', minWidth: 36, textAlign: 'right' },

  listenBtn: { marginTop: sizes.gap, marginBottom: sizes.gap },

  lastUpdate: { textAlign: 'center', fontSize: 14, color: colors.text, opacity: 0.6, marginTop: 8 },
});
