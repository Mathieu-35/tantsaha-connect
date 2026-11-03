// REPOSITORY = le seul endroit qui écrit du SQL pour un sujet donné.
// Les écrans n'écrivent jamais de SQL : ils appellent ces fonctions.
//
// Ici : les petits réglages (table "meta").

import * as Crypto from 'expo-crypto';
import { getDb } from './database';

export async function getMeta(key) {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT value FROM meta WHERE key = ?', key);
  return row ? row.value : null;
}

export async function setMeta(key, value) {
  const db = await getDb();
  await db.runAsync('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)', key, String(value));
}

// Identifiant unique de CE téléphone, créé au premier lancement puis gardé pour toujours.
// Il remplace un compte : pas de mot de passe à retenir pour le paysan.
export async function getDeviceId() {
  let id = await getMeta('device_id');
  if (!id) {
    id = Crypto.randomUUID();
    await setMeta('device_id', id);
  }
  return id;
}
