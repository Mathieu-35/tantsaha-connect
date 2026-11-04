// Remplit la base avec des données de DÉPART.
// ⚠️ Ce sont des données d'EXEMPLE : les mois de semis/récolte et les conseils
// doivent être vérifiés (agronome, paysans) et les textes malagasy relus.
//
// Lancer avec : npm run db:seed   (peut être relancé sans créer de doublons)

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const regions = [
  { code: 'ANALAMANGA', nameMg: 'Analamanga', latitude: -18.91, longitude: 47.52 },
  { code: 'VAKINANKARATRA', nameMg: 'Vakinankaratra', latitude: -19.87, longitude: 47.03 },
  { code: 'HAUTE_MATSIATRA', nameMg: 'Haute Matsiatra', latitude: -21.45, longitude: 47.09 },
  { code: 'BOENY', nameMg: 'Boeny', latitude: -15.72, longitude: 46.32 },
  { code: 'ATSINANANA', nameMg: 'Atsinanana', latitude: -18.15, longitude: 49.4 },
];

const crops = [
  { code: 'VARY', nameMg: 'Vary', icon: 'rice' },
  { code: 'KATSAKA', nameMg: 'Katsaka', icon: 'corn' },
  { code: 'MANGAHAZO', nameMg: 'Mangahazo', icon: 'cassava' },
  { code: 'TSARAMASO', nameMg: 'Tsaramaso', icon: 'bean' },
];

// Mois d'exemple (1 = janvier ... 12 = décembre), identiques pour toutes les régions au départ
const calendarByCrop = {
  VARY: { sowStartMonth: 10, sowEndMonth: 12, harvestStartMonth: 3, harvestEndMonth: 5 },
  KATSAKA: { sowStartMonth: 10, sowEndMonth: 12, harvestStartMonth: 2, harvestEndMonth: 4 },
  MANGAHAZO: { sowStartMonth: 10, sowEndMonth: 12, harvestStartMonth: 6, harvestEndMonth: 9 },
  TSARAMASO: { sowStartMonth: 3, sowEndMonth: 5, harvestStartMonth: 7, harvestEndMonth: 8 },
};

const advices = [
  {
    code: 'PEST_GENERAL',
    topic: 'PEST',
    titleMg: 'Fiadiana amin’ny bibikely',
    textMg: 'Jereo isan’andro ny voly. Raha misy bibikely, esory avy hatrany ary angatahy torohevitra.',
    audioFile: 'pest_general.mp3',
  },
  {
    code: 'SOWING_RAIN',
    topic: 'SOWING',
    titleMg: 'Mamafy rehefa avy orana',
    textMg: 'Andraso ny orana tsara vao mamafy, mba hahavita ny voa.',
    audioFile: 'sowing_rain.mp3',
  },
  {
    code: 'WEATHER_STORM',
    topic: 'WEATHER',
    titleMg: 'Rehefa misy tafio-drivotra',
    textMg: 'Aza miasa any an-tsaha rehefa misy tafio-drivotra na kotrokorana.',
    audioFile: 'weather_storm.mp3',
  },
];

// IDENTIFIANTS STABLES : on fixe l'id de chaque élément de départ (ex. "crop_vary") au lieu de
// laisser la base en inventer un au hasard. Ainsi le serveur de production et le fichier
// seed.json embarqué dans l'application parlent des MÊMES identifiants ; sinon un téléphone
// enverrait "culture X" et le serveur répondrait "inconnue".
const id = (prefix, ...codes) => `${prefix}_${codes.join('_').toLowerCase()}`;

async function main() {
  const regionRows = [];
  for (const r of regions) {
    regionRows.push(await prisma.region.upsert({
      where: { code: r.code }, create: { id: id('reg', r.code), ...r }, update: r,
    }));
  }

  const cropRows = {};
  for (const c of crops) {
    cropRows[c.code] = await prisma.crop.upsert({
      where: { code: c.code }, create: { id: id('crop', c.code), ...c }, update: c,
    });
  }

  for (const region of regionRows) {
    for (const [cropCode, months] of Object.entries(calendarByCrop)) {
      const cropId = cropRows[cropCode].id;
      await prisma.cropCalendar.upsert({
        where: { cropId_regionId: { cropId, regionId: region.id } },
        create: { id: id('cal', cropCode, region.code), cropId, regionId: region.id, ...months },
        update: months,
      });
    }
  }

  for (const a of advices) {
    await prisma.advice.upsert({ where: { code: a.code }, create: { id: id('adv', a.code), ...a }, update: a });
  }

  console.log('Base remplie : régions, cultures, calendrier, conseils.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
