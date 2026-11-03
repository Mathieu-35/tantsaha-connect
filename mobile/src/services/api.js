// CLIENT DE L'API : le seul fichier qui sait parler au serveur.
// Si le serveur est injoignable (pas de réseau), ces fonctions lèvent une erreur :
// c'est à l'appelant (ex. le service de synchro) de la gérer sans planter l'application.

import { API_URL } from '../config';

async function request(path, options) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json' },
    signal: AbortSignal.timeout(10000), // abandonne après 10 s (réseau lent = fréquent)
  });
  if (!response.ok) throw new Error(`Erreur serveur ${response.status}`);
  return response.json();
}

export const api = {
  pull: (since) => request(`/sync/pull${since ? `?since=${encodeURIComponent(since)}` : ''}`),
  push: (deviceId, observations) =>
    request('/sync/push', { method: 'POST', body: JSON.stringify({ deviceId, observations }) }),
  weather: (regionId) => request(`/meteo/${regionId}`),
};
