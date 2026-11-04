// BANDEAU HORS LIGNE : affiché en haut de l'écran quand il n'y a pas de réseau.
// Critère d'ergonomie « visibilité de l'état du système » : le paysan sait
// tout de suite s'il est connecté ou non, sans devoir essayer une action.
// Utilise useSafeAreaInsets pour ne pas se cacher derrière l'encoche (notch).

import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, sizes } from '../theme';
import { t } from '../i18n/mg';
import { useIsConnected } from '../services/networkService';

export default function OfflineBanner() {
  const isConnected = useIsConnected();
  const insets = useSafeAreaInsets();
  if (isConnected !== false) return null;
  return (
    <View style={[styles.banner, { paddingTop: insets.top + 8 }]}>
      <Text style={styles.text}>📵 {t.offline}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.surface,
    borderBottomWidth: 3,
    borderBottomColor: colors.primary,
    paddingHorizontal: sizes.padding,
    paddingBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
});
