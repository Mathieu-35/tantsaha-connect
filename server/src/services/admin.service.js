// SERVICE ADMIN : créer, modifier, supprimer les données de référence (site web d'administration).
//
// Une seule logique pour les 4 sortes de données : chaque sorte est décrite dans "ENTITIES"
// (quel model Prisma, quels champs, de quel type). Ajouter un champ = ajouter une ligne.
// Les suppressions sont "douces" (deletedAt) : les téléphones apprennent le retrait à la synchro.
// Modifier une ligne change son updatedAt (Prisma le fait seul) : c'est ce qui la rend
// visible au prochain /sync/pull des téléphones.

const prisma = require('../db/prisma');
const AppError = require('../utils/AppError');

// Types de champs : text, number, month (1 à 12). "optional" = peut être vide (null).
const ENTITIES = {
  regions: {
    model: 'region',
    label: 'Région',
    orderBy: { nameMg: 'asc' },
    fields: {
      code: { type: 'text' },
      nameMg: { type: 'text' },
      latitude: { type: 'number', min: -90, max: 90 },
      longitude: { type: 'number', min: -180, max: 180 },
    },
  },
  cultures: {
    model: 'crop',
    label: 'Culture',
    orderBy: { nameMg: 'asc' },
    fields: {
      code: { type: 'text' },
      nameMg: { type: 'text' },
      icon: { type: 'text' },
    },
  },
  calendrier: {
    model: 'cropCalendar',
    label: 'Calendrier',
    orderBy: [{ regionId: 'asc' }, { cropId: 'asc' }], // ordre stable (sinon les lignes sautent après chaque modification)
    fields: {
      cropId: { type: 'text' },
      regionId: { type: 'text' },
      sowStartMonth: { type: 'month' },
      sowEndMonth: { type: 'month' },
      harvestStartMonth: { type: 'month' },
      harvestEndMonth: { type: 'month' },
    },
  },
  conseils: {
    model: 'advice',
    label: 'Conseil',
    orderBy: { titleMg: 'asc' },
    fields: {
      code: { type: 'text' },
      cropId: { type: 'text', optional: true },
      topic: { type: 'text' },
      titleMg: { type: 'text' },
      textMg: { type: 'text' },
      audioFile: { type: 'text', optional: true },
    },
  },
};

function getEntity(name) {
  const entity = ENTITIES[name];
  if (!entity) throw new AppError('Ressource inconnue', 404);
  return entity;
}

// Vérifie UN champ et renvoie sa valeur propre (ou lève une erreur 400 claire).
function cleanValue(name, spec, raw) {
  const empty = raw === undefined || raw === null || raw === '';
  if (empty) {
    if (spec.optional) return null;
    throw new AppError(`Champ obligatoire : ${name}`, 400);
  }
  if (spec.type === 'text') {
    if (typeof raw !== 'string') throw new AppError(`${name} doit être du texte`, 400);
    return raw.trim();
  }
  const n = Number(raw);
  if (!Number.isFinite(n)) throw new AppError(`${name} doit être un nombre`, 400);
  if (spec.type === 'month') {
    if (!Number.isInteger(n) || n < 1 || n > 12) throw new AppError(`${name} : mois de 1 à 12`, 400);
    return n;
  }
  if (spec.min !== undefined && (n < spec.min || n > spec.max)) {
    throw new AppError(`${name} : valeur entre ${spec.min} et ${spec.max}`, 400);
  }
  return n;
}

// Ne garde que les champs connus de l'entité. En création tout est vérifié ;
// en modification, seuls les champs envoyés le sont.
function cleanBody(entity, body = {}, partial) {
  const data = {};
  for (const [name, spec] of Object.entries(entity.fields)) {
    if (partial && body[name] === undefined) continue;
    data[name] = cleanValue(name, spec, body[name]);
  }
  return data;
}

// Traduit les erreurs de la base en erreurs compréhensibles.
function translateDbError(err) {
  if (err.code === 'P2002') throw new AppError('Cet élément existe déjà (code ou couple culture + région)', 409);
  if (err.code === 'P2003') throw new AppError('Culture ou région inconnue', 400);
  if (err.code === 'P2025') throw new AppError('Élément introuvable', 404);
  throw err;
}

async function list(name) {
  const entity = getEntity(name);
  return prisma[entity.model].findMany({ where: { deletedAt: null }, orderBy: entity.orderBy });
}

async function create(name, body) {
  const entity = getEntity(name);
  const data = cleanBody(entity, body, false);
  try {
    return await prisma[entity.model].create({ data });
  } catch (err) {
    return translateDbError(err);
  }
}

async function update(name, id, body) {
  const entity = getEntity(name);
  const data = cleanBody(entity, body, true);
  try {
    return await prisma[entity.model].update({ where: { id, deletedAt: null }, data });
  } catch (err) {
    return translateDbError(err);
  }
}

async function remove(name, id) {
  const entity = getEntity(name);
  try {
    await prisma[entity.model].update({ where: { id, deletedAt: null }, data: { deletedAt: new Date() } });
  } catch (err) {
    return translateDbError(err);
  }
}

// Chiffres du tableau de bord. Anonyme : jamais d'identifiant de téléphone.
async function statsSummary() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const [activeDevices, notesThisWeek, byType, regions, crops, calendars, advices] = await Promise.all([
    prisma.device.count({ where: { lastSeenAt: { gte: weekAgo } } }),
    prisma.observation.count({ where: { deletedAt: null, createdAt: { gte: weekAgo } } }),
    prisma.observation.groupBy({ by: ['type'], where: { deletedAt: null, createdAt: { gte: weekAgo } }, _count: { _all: true } }),
    prisma.region.count({ where: { deletedAt: null } }),
    prisma.crop.count({ where: { deletedAt: null } }),
    prisma.cropCalendar.count({ where: { deletedAt: null } }),
    prisma.advice.count({ where: { deletedAt: null } }),
  ]);
  return {
    activeDevices,
    notesThisWeek,
    notesByType: Object.fromEntries(byType.map((r) => [r.type, r._count._all])),
    totals: { regions, crops, calendars, advices },
  };
}

module.exports = { list, create, update, remove, statsSummary };
