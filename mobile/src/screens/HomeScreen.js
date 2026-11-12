// ÉCRAN D'ACCUEIL (Sprint 9) : une mosaïque, pas 4 bandes identiques.
// Chaque raccourci a SA forme de carte :
//   Toetr'andro     → grand panneau vert à terrasses
//   Fampitandremana → bloc ocre, bord en losanges
//   Boky            → feuille de papier à bord cousu
//   Torohevitra     → bulle de parole (c'est une voix)
// En haut : paysage de rizières, logo, région choisie.
// Le plus long mot (« Fampitandremana ») tient sur 2 lignes si besoin : il n'est jamais coupé.

import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, sizes } from '../theme';
import { t } from '../i18n/mg';
import Pictogram from '../components/Pictogram';
import Logo from '../components/Logo';
import { Landscape, LambaStripe, Terraces, ZafiBand } from '../components/Motifs';
import { getMeta } from '../db/metaRepository';
import { listRegions } from '../db/referenceRepository';

const press = ({ pressed }) => pressed && styles.pressed;

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [regionName, setRegionName] = useState('');

  useEffect(() => {
    async function loadRegion() {
      const id = await getMeta('region_id');
      const regions = await listRegions();
      const region = regions.find((r) => r.id === id);
      if (region) setRegionName(region.name_mg);
    }
    loadRegion();
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        {/* En-tête : paysage + logo + région */}
        <View style={[styles.hero, { height: 200 + insets.top }]}>
          <Landscape height={200 + insets.top} />
          <View style={[styles.brand, { paddingTop: insets.top + 12 }]}>
            <Logo size={52} />
            <Text style={styles.brandName}>{t.appName.replace(' ', '\n')}</Text>
          </View>
          {regionName ? (
            <View style={styles.regionChip}>
              <Pictogram name="pin" size={28} />
              <Text style={styles.regionText}>{regionName}</Text>
            </View>
          ) : null}
        </View>
        <LambaStripe height={12} />

        <View style={styles.mosaic}>
          {/* Météo : grand panneau vert */}
          <Pressable
            onPress={() => navigation.navigate('Meteo')}
            accessibilityRole="button"
            accessibilityLabel={t.meteo}
            style={(s) => [styles.weatherCard, press(s)]}
          >
            <Terraces />
            <Text style={styles.weatherTitle}>{t.meteo}</Text>
            <Pictogram name="partly" size={92} color={colors.cream} />
          </Pressable>

          <View style={styles.row}>
            {/* Alertes : bloc ocre, bord en losanges */}
            <Pressable
              onPress={() => navigation.navigate('Alertes')}
              accessibilityRole="button"
              accessibilityLabel={t.alertes}
              style={(s) => [styles.alertCard, press(s)]}
            >
              <View style={styles.cardPad}>
                <Pictogram name="bell" size={64} tone={colors.cream} />
                <Text style={styles.alertTitle}>{t.alertes}</Text>
              </View>
              <ZafiBand id="zafiHome" height={16} bg={colors.ochre} line={colors.text} fill={null} />
            </Pressable>

            {/* Journal : feuille de papier à bord cousu */}
            <Pressable
              onPress={() => navigation.navigate('Journal')}
              accessibilityRole="button"
              accessibilityLabel={t.journal}
              style={(s) => [styles.paperCard, press(s)]}
            >
              <Pictogram name="journal" size={64} />
              <Text style={styles.paperTitle}>{t.journal}</Text>
            </Pressable>
          </View>

          {/* Conseils : bulle de parole */}
          <Pressable
            onPress={() => navigation.navigate('Conseils')}
            accessibilityRole="button"
            accessibilityLabel={t.conseils}
            style={(s) => [styles.bubble, press(s)]}
          >
            <Pictogram name="plant" size={64} />
            <Text style={styles.bubbleTitle}>{t.conseils}</Text>
            <View style={styles.speakerDisc}>
              <Pictogram name="listen" size={34} color={colors.textOnPrimary} tone="transparent" />
            </View>
            <View style={styles.bubbleTail} />
          </Pressable>
        </View>
      </ScrollView>
      <ZafiBand id="zafiFoot" height={26} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1 },
  pressed: { transform: [{ scale: 0.97 }] },

  hero: { overflow: 'hidden' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20 },
  brandName: { fontFamily: fonts.title, fontSize: 28, lineHeight: 30, color: colors.text },
  regionChip: {
    position: 'absolute',
    left: 20,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: sizes.minTouch,
    paddingLeft: 10,
    paddingRight: 16,
    backgroundColor: colors.cream,
    borderWidth: 3,
    borderColor: colors.text,
    borderRadius: sizes.radiusPill,
  },
  regionText: { fontFamily: fonts.bodyBold, fontSize: sizes.textBody, color: colors.text },

  mosaic: { padding: 16, gap: 12 },
  row: { flexDirection: 'row', gap: 12 },

  weatherCard: {
    minHeight: 158,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 28,
    borderBottomLeftRadius: 8,
    backgroundColor: colors.primary,
    overflow: 'hidden',
  },
  weatherTitle: { fontFamily: fonts.title, fontSize: 32, color: colors.textOnPrimary, flexShrink: 1 },

  alertCard: {
    flex: 1,
    minHeight: 150,
    justifyContent: 'space-between',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 8,
    backgroundColor: colors.ochre,
    overflow: 'hidden',
  },
  cardPad: { padding: 14, gap: 6, flex: 1, justifyContent: 'space-between' },
  alertTitle: { fontFamily: fonts.title, fontSize: 20, color: colors.text },

  paperCard: {
    flex: 1,
    minHeight: 150,
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    backgroundColor: colors.paper,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: colors.text,
  },
  paperTitle: { fontFamily: fonts.title, fontSize: 28, color: colors.text },

  bubble: {
    minHeight: 104,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 44,
    backgroundColor: colors.surface,
    marginBottom: 14,
  },
  bubbleTitle: { flex: 1, fontFamily: fonts.title, fontSize: 28, color: colors.text },
  speakerDisc: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleTail: {
    position: 'absolute',
    left: 46,
    bottom: -14,
    width: 0,
    height: 0,
    borderLeftWidth: 0,
    borderRightWidth: 26,
    borderTopWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.surface,
  },
});
