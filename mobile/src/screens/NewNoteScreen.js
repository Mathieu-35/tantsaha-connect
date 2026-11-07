// SAISIE D'UNE NOTE en 3 étapes : type → culture → date.
// Un seul choix par étape. Le dernier choix enregistre la note.
// La pluie n'a pas de culture : on saute l'étape 2.

import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Vibration } from 'react-native';
import { colors, sizes } from '../theme';
import { t } from '../i18n/mg';
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

function BigButton({ emoji, label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.buttonEmoji}>{emoji}</Text>
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
        <Text style={styles.checkEmoji}>✅</Text>
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
            <BigButton key={o} emoji={t.obsEmoji[o]} label={t.obsType[o]} onPress={() => chooseType(o)} />
          ))}
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.question}>{t.stepCrop}</Text>
          {crops.map((c) => (
            <BigButton
              key={c.id}
              emoji={t.cropEmoji[c.icon] || '🌿'}
              label={c.name_mg}
              onPress={() => chooseCrop(c.id)}
            />
          ))}
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.question}>{t.stepDate}</Text>
          <BigButton emoji="📅" label={t.today} onPress={() => chooseDate(0)} />
          <BigButton emoji="⏪" label={t.yesterday} onPress={() => chooseDate(1)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: sizes.padding },
  center: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  progress: { fontSize: sizes.textBody, color: colors.text, opacity: 0.6, textAlign: 'center', marginBottom: 4 },
  question: {
    fontSize: sizes.title,
    fontWeight: 'bold',
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
  buttonPressed: { backgroundColor: colors.accent },
  buttonEmoji: { fontSize: 36, marginRight: 16 },
  buttonLabel: { fontSize: sizes.textLarge, fontWeight: 'bold', color: colors.text },
  checkEmoji: { fontSize: 120 },
  savedText: { fontSize: sizes.title, fontWeight: 'bold', color: colors.primary, marginTop: sizes.gap },
});
