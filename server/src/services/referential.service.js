// SERVICE = la logique du métier. Il parle à la base de données.
// Les "controllers" l'appellent ; ils ne touchent jamais directement à Prisma.
//
// Ici : les données de référence (régions, cultures, calendrier, conseils).
// Les éléments supprimés "en douceur" (deletedAt rempli) sont cachés dans les listes publiques.

const prisma = require('../db/prisma');

const alive = { deletedAt: null };

const listRegions = () => prisma.region.findMany({ where: alive, orderBy: { nameMg: 'asc' } });

const listCrops = () => prisma.crop.findMany({ where: alive, orderBy: { nameMg: 'asc' } });

const listCalendar = (regionId) =>
  prisma.cropCalendar.findMany({ where: { ...alive, ...(regionId && { regionId }) } });

const listAdvice = ({ cropId, topic } = {}) =>
  prisma.advice.findMany({
    where: { ...alive, ...(cropId && { cropId }), ...(topic && { topic }) },
    orderBy: { titleMg: 'asc' },
  });

module.exports = { listRegions, listCrops, listCalendar, listAdvice };
