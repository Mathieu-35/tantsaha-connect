// Exporte les données de référence (régions, cultures, calendriers, conseils) dans un fichier
// que l'application mobile EMBARQUE : ainsi elle est utile dès le premier lancement,
// même sans internet (voir docs/ARCHITECTURE.md §7).
//
// Lancer avec :  npm run export:seed
// Résultat      :  mobile/src/data/seed.json  (à commiter avec le reste)

const fs = require('fs');
const path = require('path');
const prisma = require('../src/db/prisma');

const OUTPUT = path.join(__dirname, '..', '..', 'mobile', 'src', 'data', 'seed.json');

async function main() {
  // On note l'heure AVANT de lire : le téléphone la réutilisera comme "since" pour sa 1re synchro,
  // donc rien de ce qui change après cet instant ne sera manqué.
  const exportedAt = new Date();
  const where = { deletedAt: null };                          // jamais d'éléments supprimés
  const byCode = { orderBy: { code: 'asc' } };

  const [regions, crops, calendars, advices] = await Promise.all([
    prisma.region.findMany({ where, ...byCode }),
    prisma.crop.findMany({ where, ...byCode }),
    prisma.cropCalendar.findMany({ where, orderBy: { id: 'asc' } }),
    prisma.advice.findMany({ where, ...byCode }),
  ]);

  const seed = { exportedAt, regions, crops, calendars, advices };

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(seed, null, 2) + '\n', 'utf8');

  console.log(`Écrit : ${path.relative(process.cwd(), OUTPUT)}`);
  console.log(`  ${regions.length} régions, ${crops.length} cultures, ${calendars.length} calendriers, ${advices.length} conseils`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
