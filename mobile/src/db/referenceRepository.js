// Données de référence (régions, cultures, calendrier, conseils) :
// téléchargées depuis le serveur puis gardées dans le téléphone.

import { getDb } from './database';

// Enregistre ce que le serveur a envoyé (réponse de /sync/pull).
// "INSERT OR REPLACE" = ajoute, ou remplace si la ligne existe déjà.
export async function saveReference({ regions = [], crops = [], calendars = [], advices = [] }) {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    for (const r of regions) {
      await db.runAsync(
        'INSERT OR REPLACE INTO regions (id, code, name_mg, latitude, longitude) VALUES (?,?,?,?,?)',
        r.id, r.code, r.nameMg, r.latitude, r.longitude
      );
    }
    for (const c of crops) {
      await db.runAsync('INSERT OR REPLACE INTO crops (id, code, name_mg, icon) VALUES (?,?,?,?)',
        c.id, c.code, c.nameMg, c.icon);
    }
    for (const k of calendars) {
      await db.runAsync(
        `INSERT OR REPLACE INTO calendars
         (id, crop_id, region_id, sow_start_month, sow_end_month, harvest_start_month, harvest_end_month)
         VALUES (?,?,?,?,?,?,?)`,
        k.id, k.cropId, k.regionId, k.sowStartMonth, k.sowEndMonth, k.harvestStartMonth, k.harvestEndMonth
      );
    }
    for (const a of advices) {
      await db.runAsync(
        `INSERT OR REPLACE INTO advices (id, code, crop_id, topic, title_mg, text_mg, audio_file)
         VALUES (?,?,?,?,?,?,?)`,
        a.id, a.code, a.cropId, a.topic, a.titleMg, a.textMg, a.audioFile
      );
    }
  });
}

export async function listRegions() {
  return (await getDb()).getAllAsync('SELECT * FROM regions ORDER BY name_mg');
}

export async function listCrops() {
  return (await getDb()).getAllAsync('SELECT * FROM crops ORDER BY name_mg');
}

export async function listAdvices() {
  return (await getDb()).getAllAsync('SELECT * FROM advices ORDER BY title_mg');
}
