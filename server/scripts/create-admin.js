// Crée (ou met à jour) un compte pour le site d'administration.
//
// Lancer avec :  npm run admin:create
// Le script pose les questions une par une. Le mot de passe s'affiche en étoiles.
//
// Pour un usage automatique (tests), on peut aussi fournir ADMIN_EMAIL, ADMIN_PASSWORD
// et ADMIN_ROLE dans l'environnement : le script ne pose alors aucune question.

const readline = require('readline');
const auth = require('../src/services/auth.service');
const prisma = require('../src/db/prisma');

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      // Remplace chaque lettre tapée par une étoile
      rl._writeToOutput = (text) => {
        if (text.startsWith(question) || text === '\r\n' || text === '\n') process.stdout.write(text);
        else process.stdout.write('*'.repeat(text.length));
      };
    }
    rl.question(question, (answer) => { rl.close(); resolve(answer); });
  });
}

async function main() {
  const email = process.env.ADMIN_EMAIL || (await ask('E-mail : '));
  const password = process.env.ADMIN_PASSWORD || (await ask('Mot de passe (10 caractères minimum) : ', { hidden: true }));
  const role = process.env.ADMIN_ROLE || (await ask(`Rôle (${auth.ROLES.join(' ou ')}) [AGRONOME] : `)) || 'AGRONOME';

  const user = await auth.createAdmin(email, password, role.trim().toUpperCase());
  console.log(`\nCompte prêt : ${user.email} (${user.role})`);
}

main()
  .catch((e) => { console.error(`\nErreur : ${e.message}`); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
