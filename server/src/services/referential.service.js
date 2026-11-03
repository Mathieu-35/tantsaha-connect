// SERVICE = la logique du métier. Il parle à la base de données.
// Les "controllers" l'appellent ; ils ne touchent jamais directement à Prisma.
//
// Ici : les données de référence (régions, cultures, calendrier, conseils).

const prisma = require('../db/prisma');

const listRegions = () => prisma.region.findMany({ orderBy: { nameMg: 'asc' } });

const listCrops = () => prisma.crop.findMany({ orderBy: { nameMg: 'asc' } });

const listCalendar = (regionId) =>
  prisma.cropCalendar.findMany({ where: regionId ? { regionId } : {} });

const listAdvice = ({ cropId, topic } = {}) =>
  prisma.advice.findMany({
    where: { ...(cropId && { cropId }), ...(topic && { topic }) },
    orderBy: { titleMg: 'asc' },
  });

module.exports = { listRegions, listCrops, listCalendar, listAdvice };
