// SERVICE AUDIO : réglages communs + règle « un seul son à la fois ».

import { setAudioModeAsync } from 'expo-audio';

let current = null; // le lecteur qui joue en ce moment

// À appeler une fois au démarrage : le son doit marcher même si l'iPhone est en mode silencieux.
export async function initAudio() {
  try {
    await setAudioModeAsync({ playsInSilentMode: true });
  } catch (e) {
    console.log('Audio non initialisé :', e);
  }
}

// Un lecteur va démarrer : on met l'ancien en pause.
export function claimPlayback(player) {
  if (current && current !== player) {
    try { current.pause(); } catch { /* lecteur déjà libéré */ }
  }
  current = player;
}

export function releasePlayback(player) {
  if (current === player) current = null;
}
