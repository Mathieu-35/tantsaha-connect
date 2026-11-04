// SERVICE RÉSEAU : surveille la connexion internet.
// Fournit un hook React (useIsConnected) pour afficher le bandeau hors ligne,
// et appelle un callback quand le réseau revient (pour synchroniser).

import { useEffect, useState } from 'react';
import * as Network from 'expo-network';
import { AppState } from 'react-native';

let currentState = null;
const listeners = new Set();

function notify(isConnected) {
  if (isConnected === currentState) return;
  const wasOffline = currentState === false;
  currentState = isConnected;
  for (const fn of listeners) fn(isConnected);
  if (isConnected && wasOffline && onReconnect) onReconnect();
}

let onReconnect = null;

export function setOnReconnect(callback) {
  onReconnect = callback;
}

async function check() {
  try {
    const state = await Network.getNetworkStateAsync();
    notify(state.isInternetReachable ?? state.isConnected ?? false);
  } catch {
    notify(false);
  }
}

let started = false;

export function startNetworkWatch() {
  if (started) return;
  started = true;
  check();

  // Méthode 1 : listener natif (expo-network SDK 52+)
  if (typeof Network.addNetworkStateListener === 'function') {
    Network.addNetworkStateListener((state) => {
      notify(state.isInternetReachable ?? state.isConnected ?? false);
    });
  }

  // Méthode 2 : vérifier quand l'app revient au premier plan
  AppState.addEventListener('change', (nextState) => {
    if (nextState === 'active') check();
  });

  // Méthode 3 : vérification régulière (filet de sécurité)
  setInterval(check, 10000);
}

export function useIsConnected() {
  const [connected, setConnected] = useState(currentState);
  useEffect(() => {
    listeners.add(setConnected);
    return () => listeners.delete(setConnected);
  }, []);
  return connected;
}
