// TEXTES de l'application, en malagasy, tous rangés ici.
// Jamais de texte écrit "en dur" dans les écrans : on les prend dans ce fichier.
// Avantage : pour corriger un mot, un seul endroit à modifier (ou ajouter une autre langue).
//
// À faire relire par des locuteurs natifs, surtout les mots pour les paysans.

export const t = {
  appName: 'Tantsaha Connect',

  home: 'Fandraisana',
  meteo: "Toetr'andro",
  alertes: 'Fampitandremana',
  journal: 'Boky',
  conseils: 'Torohevitra',

  back: 'Hiverina',
  listen: 'Henoy',

  online: 'Misy internet',
  offline: 'Tsy misy internet',
  saved: 'Voatahiry',

  regionQuestion: 'Aiza ianao?',
  syncing: 'Mampitovy...',

  // Météo
  today: 'Androany',
  lastUpdate: 'Fanavaozana farany',
  noWeatherData: 'Tsy mbola misy toetr\'andro. Mila internet aloha.',
  staleWarning: 'Toetr\'andro taloha — mila internet hanavao.',
  weatherLoading: 'Miandry toetr\'andro...',

  // Noms des jours
  dayNames: ['Alahady', 'Alatsinainy', 'Talata', 'Alarobia', 'Alakamisy', 'Zoma', 'Asabotsy'],

  // Icônes et descriptions
  weatherLabel: {
    SUN: 'Masoandro',
    CLOUD: 'Rahona',
    RAIN: 'Orana',
    STORM: 'Tafio-drivotra',
  },
  weatherEmoji: {
    SUN: '☀️',
    CLOUD: '☁️',
    RAIN: '🌧️',
    STORM: '⛈️',
  },

  rain: 'Orana',
  tempMin: 'Ambanin\'ny',

  // Journal
  journalEmpty: 'Mbola tsy misy naoty.',
  addNote: 'Hanampy naoty',
  stepType: 'Inona no nitranga?',
  stepCrop: 'Voly inona?',
  stepDate: 'Oviana?',
  yesterday: 'Omaly',
  confirmDelete: 'Hofafana ve ity naoty ity?',
  yes: 'Eny',
  no: 'Tsia',
  delete: 'Fafana',

  obsType: {
    PLANTING: 'Fambolena',
    RAIN: 'Orana',
    PEST: 'Bibikely',
    HARVEST: 'Fijinjana',
  },
  obsEmoji: {
    PLANTING: '🌱',
    RAIN: '🌧️',
    PEST: '🐛',
    HARVEST: '🧺',
  },
  cropEmoji: {
    rice: '🌾',
    corn: '🌽',
    cassava: '🥔',
    bean: '🫘',
  },
};
