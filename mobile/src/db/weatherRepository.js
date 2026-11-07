// Cache météo dans le téléphone.
// Quand on a du réseau, on sauvegarde la météo ici.
// Quand on n'a pas de réseau, on la relit : mieux vaut une vieille prévision qu'aucune.

import { getDb } from './database';

export async function saveWeather(regionId, data, fetchedAt, stale) {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO weather_cache (region_id, data, fetched_at, stale)
     VALUES (?, ?, ?, ?)`,
    regionId, JSON.stringify(data), fetchedAt, stale ? 1 : 0
  );
}

export async function getWeather(regionId) {
  const db = await getDb();
  const row = await db.getFirstAsync(
    'SELECT data, fetched_at, stale FROM weather_cache WHERE region_id = ?',
    regionId
  );
  if (!row) return null;
  return {
    days: JSON.parse(row.data),
    fetchedAt: row.fetched_at,
    stale: row.stale === 1,
  };
}
