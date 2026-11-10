// CORRESPONDANCE audio : nom du message → fichier embarqué dans l'application.
// React Native exige des require() écrits en toutes lettres (pas de nom calculé),
// donc chaque fichier est listé ici.
//
// ⚠️ Les fichiers actuels sont des SONS PROVISOIRES (bips), pas de la voix.
// Pour mettre la vraie voix : je vais ensore remplacer le fichier dans assets/audio/ (même nom)
// et, si le format change (ex. .mp3), corriger la ligne correspondante ci-dessous.
//
// Clés :
//  - conseils : le « code » minuscule de l'audio du conseil (audioFile du serveur sans extension)
//  - screen_* : le message clé de chaque écran (bouton Henoy)

export const audioFiles = {
  pest_general: require('../../assets/audio/pest_general.wav'),
  sowing_rain: require('../../assets/audio/sowing_rain.wav'),
  weather_storm: require('../../assets/audio/weather_storm.wav'),
  screen_weather: require('../../assets/audio/screen_weather.wav'),
  screen_alerts: require('../../assets/audio/screen_alerts.wav'),
  screen_journal: require('../../assets/audio/screen_journal.wav'),
  screen_advice: require('../../assets/audio/screen_advice.wav'),
};

// "pest_general.mp3" → "pest_general"
export function audioKey(fileName) {
  return fileName ? fileName.replace(/\.[^.]+$/, '') : null;
}
