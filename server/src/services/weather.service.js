// Météo d'une région.
//
// Principe "hors ligne" : le serveur demande la météo à Open-Meteo (service gratuit,
// sans clé), la garde en cache, et la renvoie au téléphone. Si Open-Meteo est
// injoignable, on renvoie la dernière météo gardée en la marquant "stale" (périmée) :
// mieux vaut une vieille prévision datée qu'aucune prévision.

const prisma = require('../db/prisma');
const AppError = require('../utils/AppError');
const { weatherCacheMinutes } = require('../config/env');

// Open-Meteo donne un "code météo" numérique. On le traduit en 4 pictogrammes simples,
// ce qui suffit pour des utilisateurs qui lisent peu.
function codeToIcon(code) {
  if (code === 0 || code === 1) return 'SUN';          // ciel dégagé
  if (code === 2 || code === 3 || code === 45 || code === 48) return 'CLOUD'; // nuageux, brouillard
  if (code >= 95) return 'STORM';                      // orage
  return 'RAIN';                                       // bruine, pluie, averses...
}

// Appelle Open-Meteo et renvoie une liste de jours simplifiés
async function fetchFromOpenMeteo(region) {
  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${region.latitude}&longitude=${region.longitude}` +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max' +
    '&timezone=Indian%2FAntananarivo&forecast_days=5';

  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`Open-Meteo a répondu ${response.status}`);
  const d = (await response.json()).daily;

  return d.time.map((date, i) => ({
    date,
    icon: codeToIcon(d.weather_code[i]),
    tempMax: Math.round(d.temperature_2m_max[i]),
    tempMin: Math.round(d.temperature_2m_min[i]),
    rainMm: d.precipitation_sum[i],
    rainChance: d.precipitation_probability_max[i],
  }));
}

async function getForecast(regionId) {
  const region = await prisma.region.findUnique({ where: { id: regionId } });
  if (!region) throw new AppError('Région inconnue', 404);

  const cache = await prisma.weatherCache.findUnique({ where: { regionId } });
  const ageMinutes = cache ? (Date.now() - cache.fetchedAt.getTime()) / 60000 : Infinity;

  // 1. Cache encore frais : on le renvoie directement
  if (cache && ageMinutes < weatherCacheMinutes) {
    return { regionId, fetchedAt: cache.fetchedAt, stale: false, days: JSON.parse(cache.data) };
  }

  // 2. Sinon on demande à Open-Meteo
  try {
    const days = await fetchFromOpenMeteo(region);
    const fetchedAt = new Date();
    await prisma.weatherCache.upsert({
      where: { regionId },
      create: { regionId, data: JSON.stringify(days), fetchedAt },
      update: { data: JSON.stringify(days), fetchedAt },
    });
    return { regionId, fetchedAt, stale: false, days };
  } catch (err) {
    // 3. Open-Meteo ne répond pas : on se rabat sur le vieux cache s'il existe
    if (cache) {
      return { regionId, fetchedAt: cache.fetchedAt, stale: true, days: JSON.parse(cache.data) };
    }
    throw new AppError('Météo indisponible pour le moment', 503);
  }
}

module.exports = { getForecast };
