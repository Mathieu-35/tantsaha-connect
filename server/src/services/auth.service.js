// CONNEXION de l'administrateur (site web uniquement ; les paysans n'ont pas de compte).
//
// Principe :
//   1. L'admin envoie e-mail + mot de passe.
//   2. On compare avec l'EMPREINTE (hash bcrypt) stockée : le mot de passe n'est jamais gardé.
//   3. Si c'est bon, on répond avec un JETON (JWT) signé, valable quelques heures.
//   4. Le site web renvoie ce jeton à chaque demande ; on vérifie sa signature.

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db/prisma');
const AppError = require('../utils/AppError');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

const ROLES = ['ADMIN', 'AGRONOME'];
const MIN_PASSWORD_LENGTH = 10;

// Empreinte "bidon" : sert à faire le même travail de calcul quand l'e-mail n'existe pas,
// pour qu'on ne puisse pas deviner quels e-mails existent en mesurant le temps de réponse.
const DUMMY_HASH = bcrypt.hashSync('mot-de-passe-bidon', 10);

async function login(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new AppError('E-mail et mot de passe requis', 400);
  }
  const user = await prisma.adminUser.findUnique({ where: { email: email.trim().toLowerCase() } });
  const ok = await bcrypt.compare(password, user ? user.passwordHash : DUMMY_HASH);
  // Même message dans les deux cas : on ne dit pas si c'est l'e-mail ou le mot de passe qui est faux
  if (!user || !ok) throw new AppError('E-mail ou mot de passe incorrect', 401);

  const token = jwt.sign({ role: user.role }, jwtSecret, { subject: user.id, expiresIn: jwtExpiresIn });
  return { token, expiresIn: jwtExpiresIn, user: { email: user.email, role: user.role } };
}

// Vérifie la signature et la date d'expiration d'un jeton
function verifyToken(token) {
  try {
    const payload = jwt.verify(token, jwtSecret);
    return { id: payload.sub, role: payload.role };
  } catch {
    throw new AppError('Connexion expirée ou invalide', 401);
  }
}

// Qui suis-je ? (le site web l'appelle pour vérifier que son jeton est encore bon)
async function me(userId) {
  const user = await prisma.adminUser.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('Compte introuvable', 401);
  return { email: user.email, role: user.role };
}

// Crée ou met à jour un compte (utilisé par le script "npm run admin:create")
async function createAdmin(email, password, role = 'AGRONOME') {
  if (typeof email !== 'string' || !email.includes('@')) throw new AppError('E-mail invalide', 400);
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(`Mot de passe trop court (${MIN_PASSWORD_LENGTH} caractères minimum)`, 400);
  }
  if (!ROLES.includes(role)) throw new AppError(`Rôle inconnu : ${role}`, 400);

  const data = { passwordHash: await bcrypt.hash(password, 10), role };
  const cleanEmail = email.trim().toLowerCase();
  return prisma.adminUser.upsert({
    where: { email: cleanEmail },
    create: { email: cleanEmail, ...data },
    update: data,
    select: { id: true, email: true, role: true },
  });
}

module.exports = { login, verifyToken, me, createAdmin, ROLES };
