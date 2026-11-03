// SYNCHRONISATION entre le téléphone et le serveur.
//
//   PUSH : le téléphone envoie ses observations notées (peut-être hors ligne depuis des jours).
//   PULL : le téléphone récupère les données de référence modifiées depuis sa dernière synchro.
//
// Règle en cas de conflit : "la dernière modification gagne" (comparaison de updatedAt).

const prisma = require('../db/prisma');
const AppError = require('../utils/AppError');

const OBSERVATION_TYPES = ['RAIN', 'PEST', 'PLANTING', 'HARVEST'];

// Vérifie qu'une observation reçue est correcte (on ne fait jamais confiance au client)
function validateObservation(o) {
  if (!o || typeof o.id !== 'string' || !o.id) throw new AppError('Observation sans id', 400);
  if (!OBSERVATION_TYPES.includes(o.type)) throw new AppError(`Type inconnu : ${o.type}`, 400);
  for (const field of ['observedOn', 'createdAt', 'updatedAt']) {
    if (Number.isNaN(Date.parse(o[field]))) throw new AppError(`Date invalide : ${field}`, 400);
  }
}

async function push(deviceId, observations) {
  if (typeof deviceId !== 'string' || !deviceId) throw new AppError('deviceId manquant', 400);
  if (!Array.isArray(observations)) throw new AppError('observations doit être une liste', 400);
  observations.forEach(validateObservation);

  // Le téléphone est inscrit automatiquement la première fois qu'il se présente
  await prisma.device.upsert({
    where: { id: deviceId },
    create: { id: deviceId },
    update: { lastSeenAt: new Date() },
  });

  let saved = 0;
  for (const o of observations) {
    const data = {
      deviceId,
      cropId: o.cropId || null,
      type: o.type,
      observedOn: new Date(o.observedOn),
      value: o.value ?? null,
      note: o.note ?? null,
      createdAt: new Date(o.createdAt),
      updatedAt: new Date(o.updatedAt),
      deletedAt: o.deletedAt ? new Date(o.deletedAt) : null,
    };

    const existing = await prisma.observation.findUnique({ where: { id: o.id } });
    if (existing && existing.updatedAt >= data.updatedAt) continue; // le serveur a déjà mieux

    await prisma.observation.upsert({ where: { id: o.id }, create: { id: o.id, ...data }, update: data });
    saved++;
  }
  return { received: observations.length, saved, serverTime: new Date() };
}

async function pull(since) {
  const after = since ? new Date(since) : new Date(0);
  if (Number.isNaN(after.getTime())) throw new AppError('Paramètre "since" invalide', 400);
  const changed = { where: { updatedAt: { gt: after } } };

  const [regions, crops, calendars, advices] = await Promise.all([
    prisma.region.findMany(changed),
    prisma.crop.findMany(changed),
    prisma.cropCalendar.findMany(changed),
    prisma.advice.findMany(changed),
  ]);
  // serverTime : le téléphone le garde et le renverra comme "since" la prochaine fois
  return { serverTime: new Date(), regions, crops, calendars, advices };
}

module.exports = { push, pull };
