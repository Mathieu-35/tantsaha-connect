// Point d'entrée de l'application mobile.
// Au démarrage : on ouvre la base du téléphone, on affiche l'application tout de suite
// (sans attendre internet), et on essaie de synchroniser EN ARRIÈRE-PLAN.

import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { getDb } from './src/db/database';
import { syncAll } from './src/services/syncService';

export default function App() {
  useEffect(() => {
    getDb()
      .then(() => syncAll())
      .then((result) => console.log('Synchronisation :', result));
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
