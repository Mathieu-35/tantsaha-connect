// Observations du paysan (pluie, parasite, plantation, récolte).
// Elles sont TOUJOURS écrites d'abord dans le téléphone ; l'envoi au serveur vient après.

import * as Crypto from 'expo-crypto';
import { getDb } from './database';

export const OBSERVATION_TYPES = ['RAIN', 'PEST', 'PLANTING', 'HARVEST'];

// Ajoute une observation. Exemple :
//   addObservation({ type: 'PLANTING', cropId: '...', observedOn: '2026-11-03' })
export async function addObservation({ type, cropId = null, observedOn, value = null, note = null }) {
  if (!OBSERVATION_TYPES.includes(type)) throw new Error(`Type inconnu : ${type}`);
  const db = await getDb();
  const now = new Date().toISOString();
  const id = Crypto.randomUUID(); // créé ici, sans serveur : pas de doublon possible
  await db.runAsync(
    `INSERT INTO observations (id, crop_id, type, observed_on, value, note, created_at, updated_at, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    id, cropId, type, observedOn, value, note, now, now
  );
  return id;
}

// Liste (les plus récentes d'abord), sans celles supprimées
export async function listObservations() {
  const db = await getDb();
  return db.getAllAsync(
    'SELECT * FROM observations WHERE deleted_at IS NULL ORDER BY observed_on DESC, created_at DESC'
  );
}

// Suppression "en douceur" : on marque comme supprimée (pour que le serveur le sache aussi)
export async function deleteObservation(id) {
  const db = await getDb();
  const now = new Date().toISOString();
  await db.runAsync('UPDATE observations SET deleted_at = ?, updated_at = ?, synced = 0 WHERE id = ?', now, now, id);
}

// Celles qu'il faut encore envoyer au serveur
export async function listUnsynced() {
  const db = await getDb();
  return db.getAllAsync('SELECT * FROM observations WHERE synced = 0');
}

export async function markSynced(ids) {
  if (ids.length === 0) return;
  const db = await getDb();
  const marks = ids.map(() => '?').join(',');
  await db.runAsync(`UPDATE observations SET synced = 1 WHERE id IN (${marks})`, ...ids);
}
