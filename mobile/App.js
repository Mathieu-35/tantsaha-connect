// Point d'entrée de l'application mobile.
// Au démarrage :
// 1. Ouvrir la base et exécuter les migrations
// 2. Charger les données embarquées (seed.json) si c'est le premier lancement
// 3. Afficher l'application tout de suite (sans attendre internet)
// 4. Essayer de synchroniser en arrière-plan
// 5. Surveiller le réseau : si le Wi-Fi revient, resynchroniser automatiquement

import { useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import OfflineBanner from './src/components/OfflineBanner';
import { getDb } from './src/db/database';
import { loadSeedIfEmpty } from './src/db/referenceRepository';
import { syncAll } from './src/services/syncService';
import { startNetworkWatch, setOnReconnect } from './src/services/networkService';

export default function App() {
  useEffect(() => {
    async function boot() {
      await getDb();
      const seeded = await loadSeedIfEmpty();
      if (seeded) console.log('Données embarquées chargées (seed.json)');

      startNetworkWatch();
      setOnReconnect(() => {
        console.log('Réseau retrouvé — synchronisation...');
        syncAll().then((r) => console.log('Synchro au retour réseau :', r));
      });

      const result = await syncAll();
      console.log('Synchronisation au démarrage :', result);
    }
    boot();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={{ flex: 1 }}>
        <OfflineBanner />
        <AppNavigator />
      </View>
    </SafeAreaProvider>
  );
}
