// BOUTON HENOY : lit un message audio embarqué (marche sans internet).
// Un appui = lecture, un second appui = pause. Un seul son à la fois dans l'application.
// Si aucun audio n'existe pour cette clé, le bouton ne s'affiche pas.

import { useEffect } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { colors, sizes } from '../theme';
import { t } from '../i18n/mg';
import { audioFiles } from '../data/audioMap';
import { claimPlayback, releasePlayback } from '../services/audioService';

function Player({ source, style }) {
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);

  useEffect(() => () => releasePlayback(player), [player]);

  function toggle() {
    if (status.playing) {
      player.pause();
      return;
    }
    claimPlayback(player); // arrête un éventuel autre son
    if (status.didJustFinish || (status.duration > 0 && status.currentTime >= status.duration - 0.05)) {
      player.seekTo(0);
    }
    player.play();
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t.listen}
      onPress={toggle}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]}
    >
      <Text style={styles.text}>{status.playing ? `⏸ ${t.pause}` : `🔊 ${t.listen}`}</Text>
    </Pressable>
  );
}

export default function ListenButton({ audioKey, style }) {
  const source = audioFiles[audioKey];
  if (!source) return null;
  return <Player source={source} style={style} />;
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    borderRadius: sizes.radiusPill,
    minHeight: sizes.minTouch + 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  pressed: { backgroundColor: colors.primaryPress },
  text: { color: colors.textOnPrimary, fontSize: sizes.textLarge, fontWeight: 'bold' },
});
