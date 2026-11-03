// Crée UNE SEULE connexion à la base de données, réutilisée partout.
// Les services importent "prisma" depuis ce fichier.

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
