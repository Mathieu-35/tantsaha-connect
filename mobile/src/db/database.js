// BASE DE DONNÉES DU TÉLÉPHONE (SQLite).
// C'est elle qui permet à l'application de marcher SANS internet.
//
// getDb() ouvre la base une seule fois, crée les tables si elles n'existent pas,
// puis renvoie toujours la même connexion.

import * as SQLite from 'expo-sqlite';

let dbPromise = null;

// Le nombre ci-dessous augmente quand on change la structure des tables.
// (Plus tard, on ajoutera des étapes de migration pour ne pas perdre les données des paysans.)
const SCHEMA_VERSION = 1;

async function open() {
  const db = await SQLite.openDatabaseAsync('tantsaha.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    -- Petits réglages : identifiant du téléphone, date de dernière synchro, région choisie...
    CREATE TABLE IF NOT EXISTS meta (
      key   TEXT PRIMARY KEY NOT NULL,
      value TEXT
    );

    -- Données de référence (copie de celles du serveur)
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

    -- Observations notées par le paysan. "synced" = 0 tant qu'elles ne sont pas envoyées au serveur.
    CREATE TABLE IF NOT EXISTS observations (
      id          TEXT PRIMARY KEY NOT NULL,
      crop_id     TEXT,
      type        TEXT NOT NULL,      -- RAIN | PEST | PLANTING | HARVEST
      observed_on TEXT NOT NULL,      -- date au format AAAA-MM-JJ
      value       REAL,
      note        TEXT,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL,
      deleted_at  TEXT,
      synced      INTEGER NOT NULL DEFAULT 0
    );

    -- Dernière météo reçue (pour l'afficher sans internet)
    CREATE TABLE IF NOT EXISTS weather_cache (
      region_id  TEXT PRIMARY KEY NOT NULL,
      data       TEXT NOT NULL,
      fetched_at TEXT NOT NULL,
      stale      INTEGER NOT NULL DEFAULT 0
    );
  `);

  await db.runAsync(
    'INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)',
    'schema_version',
    String(SCHEMA_VERSION)
  );
  return db;
}

export function getDb() {
  if (!dbPromise) dbPromise = open();
  return dbPromise;
}
