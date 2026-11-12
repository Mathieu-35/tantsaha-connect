// NAVIGATION : la liste des écrans et la façon de passer de l'un à l'autre.
// "Stack" = pile d'écrans : on empile un écran en avançant, on le retire en revenant.
// Le premier écran dépend de la situation : si c'est le tout premier lancement
// (pas de région choisie), on affiche le choix de région.

import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import RegionChoiceScreen from '../screens/RegionChoiceScreen';
import AdviceScreen from '../screens/AdviceScreen';
import WeatherScreen from '../screens/WeatherScreen';
import JournalScreen from '../screens/JournalScreen';
import AlertsScreen from '../screens/AlertsScreen';
import NewNoteScreen from '../screens/NewNoteScreen';
import { colors, fonts } from '../theme';
import { t } from '../i18n/mg';
import { getMeta } from '../db/metaRepository';
import { getDb } from '../db/database';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    async function decide() {
      await getDb();
      const regionId = await getMeta('region_id');
      setInitialRoute(regionId ? 'Home' : 'RegionChoice');
    }
    decide();
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.textOnPrimary,
          headerTitleStyle: { fontSize: 22, fontFamily: fonts.title },
          headerBackTitle: t.back,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen
          name="RegionChoice"
          component={RegionChoiceScreen}
          options={{ title: t.appName, headerBackVisible: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Meteo" component={WeatherScreen} options={{ title: t.meteo }} />
        <Stack.Screen name="Alertes" component={AlertsScreen} options={{ title: t.alertes }} />
        <Stack.Screen name="Journal" component={JournalScreen} options={{ title: t.journal }} />
        <Stack.Screen name="NewNote" component={NewNoteScreen} options={{ title: t.addNote }} />
        <Stack.Screen name="Conseils" component={AdviceScreen} options={{ title: t.conseils }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
