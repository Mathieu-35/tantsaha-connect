// CONSEILS : liste + formulaire (créer / modifier) + suppression.
// Le texte est en malagasy. L'envoi des fichiers audio viendra plus tard.

import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';
import Icon from '../components/Icon.jsx';

const TOPICS = [
  ['PEST', 'Parasites'],
  ['SOWING', 'Semis'],
  ['WEATHER', 'Météo'],
];
const TOPIC_ICON = { PEST: 'pest', SOWING: 'plant', WEATHER: 'storm' };
const EMPTY = { code: '', topic: 'PEST', cropId: '', titleMg: '', textMg: '' };

export default function Advices({ onSessionExpired }) {
  const [advices, setAdvices] = useState([]);
  const [crops, setCrops] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(null);

  const fail = useCallback((err) => {
    if (err.status === 401) onSessionExpired();
    else setMessage({ kind: 'error', text: err.message });
  }, [onSessionExpired]);

  const reload = useCallback(async () => {
    try {
      const [a, c] = await Promise.all([api.list('conseils'), api.list('cultures')]);
      setAdvices(a);
      setCrops(c);
    } catch (err) { fail(err); }
  }, [fail]);

  useEffect(() => { reload(); }, [reload]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  function startEdit(a) {
    setEditingId(a.id);
    setForm({ code: a.code, topic: a.topic, cropId: a.cropId || '', titleMg: a.titleMg, textMg: a.textMg });
    setMessage(null);
  }

  function cancel() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function submit(e) {
    e.preventDefault();
    setMessage(null);
    const data = { ...form, cropId: form.cropId || null };
    try {
      if (editingId) await api.update('conseils', editingId, data);
      else await api.create('conseils', data);
      setMessage({ kind: 'ok', text: 'Conseil enregistré. Les téléphones le recevront à la prochaine synchro.' });
      cancel();
      await reload();
    } catch (err) { fail(err); }
  }

  async function remove(a) {
    if (!window.confirm(`Supprimer le conseil « ${a.titleMg} » ?`)) return;
    try {
      await api.remove('conseils', a.id);
      if (editingId === a.id) cancel();
      await reload();
    } catch (err) { fail(err); }
  }

  return (
    <>
      <h2>Conseils</h2>
      <p className="warn"><Icon name="warning" size={32} />Les conseils de départ sont des exemples : à faire valider avant usage réel.</p>
      {message && (
        <div className={message.kind === 'ok' ? 'ok' : 'error'}>
          {message.kind === 'ok' && <Icon name="done" size={32} />}
          {message.text}
        </div>
      )}

      <form className={`card paper ${editingId ? 'editing' : ''}`} onSubmit={submit}>
        <strong>{editingId ? 'Modifier le conseil' : 'Nouveau conseil'}</strong>
        <div className="row" style={{ marginTop: 8 }}>
          <label>Code (unique, ex. PEST_RIZ)
            <input value={form.code} onChange={set('code')} required />
          </label>
          <label>Thème
            <select value={form.topic} onChange={set('topic')}>
              {TOPICS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label>Culture
            <select value={form.cropId} onChange={set('cropId')}>
              <option value="">Conseil général</option>
              {crops.map((c) => <option key={c.id} value={c.id}>{c.nameMg}</option>)}
            </select>
          </label>
        </div>
        <label>Titre (malagasy)
          <input value={form.titleMg} onChange={set('titleMg')} required />
        </label>
        <label>Texte (malagasy)
          <textarea value={form.textMg} onChange={set('textMg')} required />
        </label>
        <div className="actions">
          <button className="btn">{editingId ? 'Enregistrer' : 'Ajouter'}</button>
          {editingId && <button type="button" className="btn ghost" onClick={cancel}>Annuler</button>}
        </div>
      </form>

      {advices.map((a) => (
        <div className="bubble" key={a.id}>
          <div className="head">
            <Icon name={TOPIC_ICON[a.topic] || 'tip'} size={56} />
            <div>
              <h3>{a.titleMg}</h3>
              <div className="muted">
                {a.code} · {TOPICS.find(([v]) => v === a.topic)?.[1] || a.topic} ·{' '}
                {a.cropId ? crops.find((c) => c.id === a.cropId)?.nameMg : 'général'}
              </div>
            </div>
          </div>
          <p className="text">{a.textMg}</p>
          <div className="actions">
            <button className="btn small" onClick={() => startEdit(a)}>Modifier</button>
            <button className="btn small danger" onClick={() => remove(a)}>Supprimer</button>
          </div>
        </div>
      ))}
      {advices.length === 0 && <p className="muted">Aucun conseil.</p>}
    </>
  );
}
