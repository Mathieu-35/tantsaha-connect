// Lit le fichier .env et rassemble tous les réglages du serveur au même endroit.
// Ainsi, le reste du code ne touche jamais directement à process.env.

require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT) || 3000,
  weatherCacheMinutes: Number(process.env.WEATHER_CACHE_MINUTES) || 180,

  // Clé secrète qui sert à "signer" les jetons de connexion de l'admin.
  // Qui la connaît peut fabriquer de faux jetons : elle ne doit JAMAIS aller sur GitHub.
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h', // durée de vie d'une connexion
};
