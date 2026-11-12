import { useEffect, useState } from 'react';
import { api } from '../api';
import Icon from '../components/Icon.jsx';
import { Terraces } from '../components/Motifs.jsx';

// Chaque type de note a son pictogramme et sa couleur de talon (comme dans l'application).
const TYPES = [
  { type: 'RAIN', label: 'Pluie', icon: 'rain', color: '#8DBBD6' },
  { type: 'PEST', label: 'Parasite', icon: 'pest', color: '#F2C98A' },
  { type: 'PLANTING', label: 'Plantation', icon: 'plant', color: '#76C457' },
  { type: 'HARVEST', label: 'Récolte', icon: 'harvest', color: '#E0A526' },
];

export default function Dashboard({ onSessionExpired }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.stats().then(setStats).catch((err) => {
      if (err.status === 401) onSessionExpired();
      else setError(err.message);
    });
  }, [onSessionExpired]);

  if (error) return <div className="error">{error}</div>;
  if (!stats) return <p>Chargement…</p>;

  return (
    <>
      <h2>Tableau de bord</h2>
      <div className="stats">
        <div className="card stat hero">
          <Terraces />
          <Icon name="pin" size={64} color="#FFF8CF" />
          <div><div className="n">{stats.activeDevices}</div><div className="label">Téléphones actifs (7 jours)</div></div>
        </div>
        <div className="card stat sun">
          <Icon name="journal" size={64} tone="#FFF8CF" />
          <div><div className="n">{stats.notesThisWeek}</div><div className="label">Notes cette semaine</div></div>
        </div>
      </div>

      <h2>Notes de la semaine par type</h2>
      <div className="stats">
        {TYPES.map((x) => (
          <div className="card stat ticket" key={x.type}>
            <div className="stub" style={{ background: x.color }}><Icon name={x.icon} size={48} tone="#FFF8CF" /></div>
            <div className="body"><div className="n">{stats.notesByType[x.type] || 0}</div><div className="label">{x.label}</div></div>
          </div>
        ))}
      </div>

      <h2>Données de référence</h2>
      <div className="stats">
        <div className="card stat paper"><Icon name="pin" size={44} /><div><div className="n">{stats.totals.regions}</div><div className="label">Régions</div></div></div>
        <div className="card stat paper"><Icon name="rice" size={44} /><div><div className="n">{stats.totals.crops}</div><div className="label">Cultures</div></div></div>
        <div className="card stat paper"><Icon name="today" size={44} /><div><div className="n">{stats.totals.calendars}</div><div className="label">Calendriers</div></div></div>
        <div className="card stat paper"><Icon name="tip" size={44} /><div><div className="n">{stats.totals.advices}</div><div className="label">Conseils</div></div></div>
      </div>
      <p className="muted">Les statistiques sont anonymes : aucun identifiant de téléphone n'est affiché.</p>
    </>
  );
}
