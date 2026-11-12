// SAISIE D'UNE NOTE en 3 étapes : type → culture → date.
// Un seul choix par étape. Le dernier choix enregistre la note.
// La pluie n'a pas de culture : on saute l'étape 2.

import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Vibration } from 'react-native';
import { colors, fonts, sizes } from '../theme';
import SavedCheck from '../components/SavedCheck';
import { t } from '../i18n/mg';
import Pictogram, { pictoFor } from '../components/Pictogram';
import { OBSERVATION_TYPES, addObservation } from '../db/observationsRepository';
import { listCrops } from '../db/referenceRepository';
import { syncAll } from '../services/syncService';

function isoDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

function BigButton({ picto, label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Pictogram name={picto} size={52} style={styles.buttonEmoji} />
      <Text style={styles.buttonLabel}>{label}</Text>
    </Pressable>
  );
}

export default function NewNoteScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState(null);
  const [cropId, setCropId] = useState(null);
  const [crops, setCrops] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    listCrops().then(setCrops);
  }, []);

  function chooseType(chosen) {
    setType(chosen);
    setStep(chosen === 'RAIN' ? 3 : 2);
  }

  function chooseCrop(id) {
    setCropId(id);
    setStep(3);
  }

  async function chooseDate(daysAgo) {
    await addObservation({ type, cropId, observedOn: isoDate(daysAgo) });
    Vibration.vibrate(100);
    setDone(true);
    syncAll();
    setTimeout(() => navigation.goBack(), 1200);
  }

  if (done) {
    return (
      <View style={styles.center}>
        <SavedCheck size={120} />
        <Text style={styles.savedText}>{t.saved}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>{step} / 3</Text>

      {step === 1 && (
        <>
          <Text style={styles.question}>{t.stepType}</Text>
          {OBSERVATION_TYPES.map((o) => (
            <BigButton key={o} picto={pictoFor.observation[o]} label={t.obsType[o]} onPress={() => chooseType(o)} />
          ))}
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.question}>{t.stepCrop}</Text>
          {crops.map((c) => (
            <BigButton
              key={c.id}
              picto={pictoFor.crop[c.icon] || 'plant'}
              label={c.name_mg}
              onPress={() => chooseCrop(c.id)}
            />
          ))}
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.question}>{t.stepDate}</Text>
          <BigButton picto="today" label={t.today} onPress={() => chooseDate(0)} />
          <BigButton picto="yesterday" label={t.yesterday} onPress={() => chooseDate(1)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: sizes.padding },
  center: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  progress: { fontFamily: fonts.bodyBold, fontSize: sizes.textBody, color: colors.text, opacity: 0.75, textAlign: 'center', marginBottom: 4 },
  question: {
    fontSize: sizes.title,
    fontFamily: fonts.title,
    color: colors.text,
    textAlign: 'center',
    marginBottom: sizes.gap * 2,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: sizes.radius,
    padding: sizes.padding,
    marginBottom: sizes.gap,
    minHeight: sizes.minTouch + 20,
  },
  buttonPressed: { backgroundColor: colors.accent, transform: [{ scale: 0.97 }] },
  buttonEmoji: { marginRight: 16 },
  buttonLabel: { fontFamily: fonts.title, fontSize: sizes.textLarge, color: colors.text },
  savedText: { fontFamily: fonts.title, fontSize: sizes.title, color: colors.primary, marginTop: sizes.gap },
});
