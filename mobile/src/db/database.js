// BASE DE DONNÉES DU TÉLÉPHONE (SQLite).
// C'est elle qui permet à l'application de marcher SANS internet.
//
// getDb() ouvre la base une seule fois, exécute les migrations nécessaires,
// puis renvoie toujours la même connexion.
//
// MIGRATIONS : chaque version du schéma a sa propre fonction.
// Au démarrage, on lit PRAGMA user_version (le numéro stocké dans le fichier SQLite)
// et on exécute toutes les migrations qui manquent, dans l'ordre.
// Ainsi, un téléphone qui avait la version 1 recevra la 2, la 3, etc.
// sans perdre ses données.

import * as SQLite from 'expo-sqlite';

let dbPromise = null;

const MIGRATIONS = [
  // Version 0 → 1 : création de toutes les tables initiales
  async function v1(db) {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;

      CREATE TABLE IF NOT EXISTS meta (
        key   TEXT PRIMARY KEY NOT NULL,
        value TEXT
      );

      CREATE TABLE IF NOT EXISTS regions (
        id TEXT PRIMARY KEY NOT NULL, code TEXT, name_mg TEXT, latitude REAL, longitude REAL
      );
      CREATE TABLE IF NOT EXISTS crops (
        id TEXT PRIMARY KEY NOT NULL, code TEXT, name_mg TEXT, icon TEXT
      );
      CREATE TABLE IF NOT EXISTS calendars (
        id TEXT PRIMARY KEY NOT NULL, crop_id TEXT, region_id TEXT,
        sow_start_month INTEGER, sow_end_month INTEGER,
        harvest_start_month INTEGER, harvest_end_month INTEGER
      );
      CREATE TABLE IF NOT EXISTS advices (
        id TEXT PRIMARY KEY NOT NULL, code TEXT, crop_id TEXT, topic TEXT,
        title_mg TEXT, text_mg TEXT, audio_file TEXT
      );

      CREATE TABLE IF NOT EXISTS observations (
        id          TEXT PRIMARY KEY NOT NULL,
        crop_id     TEXT,
        type        TEXT NOT NULL,
        observed_on TEXT NOT NULL,
        value       REAL,
        note        TEXT,
        created_at  TEXT NOT NULL,
        updated_at  TEXT NOT NULL,
        deleted_at  TEXT,
        synced      INTEGER NOT NULL DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS weather_cache (
        region_id  TEXT PRIMARY KEY NOT NULL,
        data       TEXT NOT NULL,
        fetched_at TEXT NOT NULL,
        stale      INTEGER NOT NULL DEFAULT 0
      );
    `);
  },
];

async function runMigrations(db) {
  const { user_version: currentVersion } = await db.getFirstAsync('PRAGMA user_version');
  for (let v = currentVersion; v < MIGRATIONS.length; v++) {
    await MIGRATIONS[v](db);
    await db.execAsync(`PRAGMA user_version = ${v + 1}`);
  }
}

async function open() {
  const db = await SQLite.openDatabaseAsync('tantsaha.db');
  await runMigrations(db);
  return db;
}

export function getDb() {
  if (!dbPromise) dbPromise = open();
  return dbPromise;
}
