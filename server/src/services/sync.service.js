// SYNCHRONISATION entre le téléphone et le serveur.
//
//   PUSH : le téléphone envoie ses observations notées (peut-être hors ligne depuis des jours).
//   PULL : le téléphone récupère les données de référence modifiées depuis sa dernière synchro.
//
// Règles :
//   - Conflit : "la dernière modification gagne" (comparaison de updatedAt).
//   - Une observation appartient à UN téléphone : un autre téléphone ne peut pas la modifier.
//   - Chaque observation est jugée séparément : une mauvaise ne bloque pas les autres.
//     (Sinon un seul enregistrement défectueux empêcherait le téléphone de jamais se synchroniser.)

const prisma = require('../db/prisma');
const AppError = require('../utils/AppError');

const OBSERVATION_TYPES = ['RAIN', 'PEST', 'PLANTING', 'HARVEST'];
const MAX_OBSERVATIONS_PER_PUSH = 200;
const MAX_NOTE_LENGTH = 500;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const isValidDate = (value) => typeof value === 'string' && !Number.isNaN(Date.parse(value));

// Renvoie la raison du refus (texte stable) ou null si l'observation est correcte.
// On ne fait JAMAIS confiance à ce que le téléphone envoie.
function checkObservation(o) {
  if (!o || typeof o.id !== 'string' || o.id.length < 1 || o.id.length > 64) return 'INVALID_ID';
  if (!OBSERVATION_TYPES.includes(o.type)) return 'INVALID_TYPE';
  for (const field of ['observedOn', 'createdAt', 'updatedAt']) {
    if (!isValidDate(o[field])) return 'INVALID_DATE';
  }
  if (o.deletedAt != null && !isValidDate(o.deletedAt)) return 'INVALID_DATE';
  if (o.value != null && !Number.isFinite(o.value)) return 'INVALID_VALUE';
  if (o.note != null && (typeof o.note !== 'string' || o.note.length > MAX_NOTE_LENGTH)) return 'INVALID_NOTE';
  if (o.cropId != null && typeof o.cropId !== 'string') return 'UNKNOWN_CROP';
  return null;
}

// L'horloge d'un téléphone peut être fausse (en avance). Une date très lointaine dans le futur
// gagnerait tous les conflits : si elle dépasse demain, on la ramène à l'heure du serveur
// plutôt que de refuser la note.
function clampToNow(value, now) {
  const time = Date.parse(value);
  return new Date(time > now.getTime() + ONE_DAY_MS ? now.getTime() : time);
}

async function push(deviceId, regionId, observations) {
  if (typeof deviceId !== 'string' || deviceId.length < 8 || deviceId.length > 64) {
    throw new AppError('deviceId invalide', 400);
  }
  if (!Array.isArray(observations)) throw new AppError('observations doit être une liste', 400);
  if (observations.length > MAX_OBSERVATIONS_PER_PUSH) {
    throw new AppError(`Maximum ${MAX_OBSERVATIONS_PER_PUSH} observations par envoi`, 400);
  }

  const now = new Date();

  // La région du téléphone n'est gardée que si elle existe vraiment
  const region = typeof regionId === 'string'
    ? await prisma.region.findFirst({ where: { id: regionId, deletedAt: null }, select: { id: true } })
    : null;

  // Le téléphone est inscrit automatiquement la première fois qu'il se présente
  await prisma.device.upsert({
    where: { id: deviceId },
    create: { id: deviceId, regionId: region?.id ?? null },
    update: { lastSeenAt: now, ...(region && { regionId: region.id }) },
  });

  // On charge d'un coup les cultures citées et les observations déjà connues (évite 2 requêtes par note)
  const cropIds = [...new Set(observations.map((o) => o?.cropId).filter((id) => typeof id === 'string'))];
  const ids = observations.map((o) => o?.id).filter((id) => typeof id === 'string');
  const [crops, known] = await Promise.all([
    prisma.crop.findMany({ where: { id: { in: cropIds } }, select: { id: true } }),
    prisma.observation.findMany({ where: { id: { in: ids } } }),
  ]);
  const cropExists = new Set(crops.map((c) => c.id));
  const existingById = new Map(known.map((e) => [e.id, e]));

  const accepted = [];
  const rejected = [];

  for (const o of observations) {
    const problem = checkObservation(o) || (o.cropId && !cropExists.has(o.cropId) ? 'UNKNOWN_CROP' : null);
    if (problem) { rejected.push({ id: o?.id ?? null, reason: problem }); continue; }

    const existing = existingById.get(o.id);
    // Cette note appartient à un autre téléphone : on refuse de la toucher
    if (existing && existing.deviceId !== deviceId) {
      rejected.push({ id: o.id, reason: 'OWNED_BY_OTHER_DEVICE' });
      continue;
    }

    const data = {
      deviceId,
      cropId: o.cropId || null,
      type: o.type,
      observedOn: new Date(o.observedOn),
      value: o.value ?? null,
      note: o.note ?? null,
      createdAt: clampToNow(o.createdAt, now),
      updatedAt: clampToNow(o.updatedAt, now),
      deletedAt: o.deletedAt ? clampToNow(o.deletedAt, now) : null,
    };

    // Le serveur a déjà une version plus récente : on la garde, mais la note est "acceptée"
    // pour que le téléphone cesse de la renvoyer.
    if (!existing || existing.updatedAt < data.updatedAt) {
      const saved = await prisma.observation.upsert({
        where: { id: o.id },
        create: { id: o.id, ...data },
        update: data,
      });
      existingById.set(o.id, saved);
    }
    accepted.push(o.id);
  }

  return { serverTime: now, accepted, rejected };
}

async function pull(since) {
  const after = since ? new Date(since) : null;
  if (after && Number.isNaN(after.getTime())) throw new AppError('Paramètre "since" invalide', 400);

  // On note l'heure AVANT de lire la base : si une donnée change pendant la lecture,
  // elle sera quand même renvoyée à la prochaine synchro (au pire en double, jamais perdue).
  const serverTime = new Date();

  // Première synchro (sans "since") : on n'envoie pas ce qui est déjà supprimé, le téléphone ne l'a jamais eu.
  // Synchros suivantes : on envoie aussi les suppressions (deletedAt rempli) pour que le téléphone les retire.
  const where = after ? { updatedAt: { gt: after } } : { deletedAt: null };

  const [regions, crops, calendars, advices] = await Promise.all([
    prisma.region.findMany({ where }),
    prisma.crop.findMany({ where }),
    prisma.cropCalendar.findMany({ where }),
    prisma.advice.findMany({ where }),
  ]);
  // serverTime : le téléphone le garde et le renverra comme "since" la prochaine fois
  return { serverTime, regions, crops, calendars, advices };
}

module.exports = { push, pull };
