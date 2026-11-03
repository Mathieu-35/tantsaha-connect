// SYNCHRONISATION : échange avec le serveur QUAND il y a du réseau.
// À appeler au démarrage de l'application, et plus tard quand le réseau revient.
// Elle ne plante jamais : sans réseau elle renvoie simplement { ok: false }.

import { api } from './api';
import { getDeviceId, getMeta, setMeta } from '../db/metaRepository';
import { listUnsynced, markSynced } from '../db/observationsRepository';
import { saveReference } from '../db/referenceRepository';

export async function syncAll() {
  try {
    // 1. ENVOYER nos observations pas encore envoyées
    const rows = await listUnsynced();
    if (rows.length > 0) {
      const observations = rows.map((r) => ({
        id: r.id,
        cropId: r.crop_id,
        type: r.type,
        observedOn: r.observed_on,
        value: r.value,
        note: r.note,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
        deletedAt: r.deleted_at,
      }));
      await api.push(await getDeviceId(), observations);
      await markSynced(rows.map((r) => r.id));
    }

    // 2. RÉCUPÉRER ce qui a changé sur le serveur depuis la dernière fois
    const since = await getMeta('last_pull');
    const data = await api.pull(since);
    await saveReference(data);
    await setMeta('last_pull', data.serverTime);

    return { ok: true };
  } catch (error) {
    // Pas de réseau ou serveur éteint : ce n'est pas grave, on réessaiera plus tard.
    return { ok: false, error: error.message };
  }
}
