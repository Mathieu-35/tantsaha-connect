// NAVIGATION : la liste des écrans et la façon de passer de l'un à l'autre.
// "Stack" = pile d'écrans : on empile un écran en avançant, on le retire en revenant.

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import { colors } from '../theme';
import { t } from '../i18n/mg';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.textOnDark,
          headerTitleStyle: { fontSize: 22, fontWeight: 'bold' },
          headerBackTitle: t.back,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: t.appName }} />
        <Stack.Screen name="Meteo" component={PlaceholderScreen} options={{ title: t.meteo }} />
        <Stack.Screen name="Alertes" component={PlaceholderScreen} options={{ title: t.alertes }} />
        <Stack.Screen name="Journal" component={PlaceholderScreen} options={{ title: t.journal }} />
        <Stack.Screen name="Conseils" component={PlaceholderScreen} options={{ title: t.conseils }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
