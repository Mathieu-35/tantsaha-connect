// Données de référence (régions, cultures, calendrier, conseils) :
// téléchargées depuis le serveur puis gardées dans le téléphone.
// Au tout premier lancement, chargées depuis seed.json (données embarquées).

import { getDb } from './database';
import seedData from '../data/seed.json';

// Enregistre ce que le serveur a envoyé (réponse de /sync/pull).
export async function saveReference({ regions = [], crops = [], calendars = [], advices = [] }) {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    for (const r of regions) {
      if (r.deletedAt) {
        await db.runAsync('DELETE FROM regions WHERE id = ?', r.id);
      } else {
        await db.runAsync(
          'INSERT OR REPLACE INTO regions (id, code, name_mg, latitude, longitude) VALUES (?,?,?,?,?)',
          r.id, r.code, r.nameMg, r.latitude, r.longitude
        );
      }
    }
    for (const c of crops) {
      if (c.deletedAt) {
        await db.runAsync('DELETE FROM crops WHERE id = ?', c.id);
      } else {
        await db.runAsync('INSERT OR REPLACE INTO crops (id, code, name_mg, icon) VALUES (?,?,?,?)',
          c.id, c.code, c.nameMg, c.icon);
      }
    }
    for (const k of calendars) {
      if (k.deletedAt) {
        await db.runAsync('DELETE FROM calendars WHERE id = ?', k.id);
      } else {
        await db.runAsync(
          `INSERT OR REPLACE INTO calendars
           (id, crop_id, region_id, sow_start_month, sow_end_month, harvest_start_month, harvest_end_month)
           VALUES (?,?,?,?,?,?,?)`,
          k.id, k.cropId, k.regionId, k.sowStartMonth, k.sowEndMonth, k.harvestStartMonth, k.harvestEndMonth
        );
      }
    }
    for (const a of advices) {
      if (a.deletedAt) {
        await db.runAsync('DELETE FROM advices WHERE id = ?', a.id);
      } else {
        await db.runAsync(
          `INSERT OR REPLACE INTO advices (id, code, crop_id, topic, title_mg, text_mg, audio_file)
           VALUES (?,?,?,?,?,?,?)`,
          a.id, a.code, a.cropId, a.topic, a.titleMg, a.textMg, a.audioFile
        );
      }
    }
  });
}

// Charge les données embarquées (seed.json) si la base est vide.
// Appelée une seule fois, au tout premier lancement.
export async function loadSeedIfEmpty() {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT COUNT(*) as count FROM regions');
  if (row.count > 0) return false;
  await saveReference(seedData);
  return true;
}

export async function listRegions() {
  return (await getDb()).getAllAsync('SELECT * FROM regions ORDER BY name_mg');
}

export async function listCrops() {
  return (await getDb()).getAllAsync('SELECT * FROM crops ORDER BY name_mg');
}

// Calendrier d'une région, en camelCase (le reste de l'application ne voit pas le snake_case)
export async function listCalendars(regionId) {
  const rows = await (await getDb()).getAllAsync('SELECT * FROM calendars WHERE region_id = ?', regionId);
  return rows.map((r) => ({
    cropId: r.crop_id,
    sowStartMonth: r.sow_start_month,
    sowEndMonth: r.sow_end_month,
    harvestStartMonth: r.harvest_start_month,
    harvestEndMonth: r.harvest_end_month,
  }));
}

export async function listAdvices() {
  return (await getDb()).getAllAsync('SELECT * FROM advices ORDER BY title_mg');
}
