// Lit le fichier .env et rassemble tous les réglages du serveur au même endroit.
// Ainsi, le reste du code ne touche jamais directement à process.env.

require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT) || 3000,
  weatherCacheMinutes: Number(process.env.WEATHER_CACHE_MINUTES) || 180,
};
