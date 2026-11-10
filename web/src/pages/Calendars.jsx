// CALENDRIERS : pour une région, quand semer et récolter chaque culture.
// Modifier ici change le serveur ; les téléphones reçoivent la correction à leur prochaine synchro.

import { useCallback, useEffect, useState } from 'react';
import { api } from '../api';

const MONTHS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
const FIELDS = [
  ['sowStartMonth', 'Semis : début'],
  ['sowEndMonth', 'Semis : fin'],
  ['harvestStartMonth', 'Récolte : début'],
  ['harvestEndMonth', 'Récolte : fin'],
];

function MonthSelect({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
    </select>
  );
}

export default function Calendars({ onSessionExpired }) {
  const [regions, setRegions] = useState([]);
  const [crops, setCrops] = useState([]);
  const [rows, setRows] = useState([]);
  const [regionId, setRegionId] = useState('');
  const [message, setMessage] = useState(null); // { kind: 'ok' | 'error', text }

  const fail = useCallback((err) => {
    if (err.status === 401) onSessionExpired();
    else setMessage({ kind: 'error', text: err.message });
  }, [onSessionExpired]);

  const reload = useCallback(async () => {
    try {
      const [r, c, k] = await Promise.all([api.list('regions'), api.list('cultures'), api.list('calendrier')]);
      setRegions(r);
      setCrops(c);
      setRows(k);
      setRegionId((current) => current || r[0]?.id || '');
    } catch (err) { fail(err); }
  }, [fail]);

  useEffect(() => { reload(); }, [reload]);

  const cropName = (id) => crops.find((c) => c.id === id)?.nameMg || id;
  const regionRows = rows.filter((r) => r.regionId === regionId);
  const missingCrops = crops.filter((c) => !regionRows.some((r) => r.cropId === c.id));

  function edit(id, field, value) {
    setRows((list) => list.map((r) => (r.id === id ? { ...r, [field]: value, dirty: true } : r)));
  }

  async function save(row) {
    setMessage(null);
    try {
      const data = Object.fromEntries(FIELDS.map(([f]) => [f, row[f]]));
      await api.update('calendrier', row.id, data);
      setMessage({ kind: 'ok', text: `✅ ${cropName(row.cropId)} enregistré. Les téléphones le recevront à la prochaine synchro.` });
      await reload();
    } catch (err) { fail(err); }
  }

  async function remove(row) {
    if (!window.confirm(`Supprimer le calendrier de ${cropName(row.cropId)} pour cette région ?`)) return;
    try {
      await api.remove('calendrier', row.id);
      await reload();
    } catch (err) { fail(err); }
  }

  async function add(cropId) {
    setMessage(null);
    try {
      await api.create('calendrier', {
        cropId, regionId, sowStartMonth: 1, sowEndMonth: 1, harvestStartMonth: 1, harvestEndMonth: 1,
      });
      await reload();
    } catch (err) { fail(err); }
  }

  return (
    <>
      <h2>Calendriers agricoles</h2>
      <p className="muted">⚠️ Les valeurs de départ sont des exemples non validés : à vérifier par un technicien agricole.</p>
      {message && <div className={message.kind === 'ok' ? 'ok' : 'error'}>{message.text}</div>}

      <label>
        Région
        <select value={regionId} onChange={(e) => setRegionId(e.target.value)}>
          {regions.map((r) => <option key={r.id} value={r.id}>{r.nameMg}</option>)}
        </select>
      </label>

      <table>
        <thead>
          <tr>
            <th>Culture</th>
            {FIELDS.map(([f, label]) => <th key={f}>{label}</th>)}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {regionRows.map((row) => (
            <tr key={row.id}>
              <td><strong>{cropName(row.cropId)}</strong></td>
              {FIELDS.map(([f]) => (
                <td key={f}><MonthSelect value={row[f]} onChange={(v) => edit(row.id, f, v)} /></td>
              ))}
              <td>
                <div className="actions">
                  <button className="btn small" disabled={!row.dirty} onClick={() => save(row)}>Enregistrer</button>
                  <button className="btn small danger" onClick={() => remove(row)}>Supprimer</button>
                </div>
              </td>
            </tr>
          ))}
          {regionRows.length === 0 && <tr><td colSpan={6} className="muted">Aucun calendrier pour cette région.</td></tr>}
        </tbody>
      </table>

      {missingCrops.length > 0 && (
        <div className="actions" style={{ marginTop: 12 }}>
          <span className="muted">Ajouter une culture :</span>
          {missingCrops.map((c) => (
            <button key={c.id} className="btn ghost small" onClick={() => add(c.id)}>+ {c.nameMg}</button>
          ))}
        </div>
      )}
    </>
  );
}
