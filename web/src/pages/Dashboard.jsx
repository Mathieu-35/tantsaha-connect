import { useEffect, useState } from 'react';
import { api } from '../api';

const TYPE_LABELS = { RAIN: '🌧️ Pluie', PEST: '🐛 Parasite', PLANTING: '🌱 Plantation', HARVEST: '🧺 Récolte' };

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
        <div className="stat"><div className="n">{stats.activeDevices}</div>Téléphones actifs (7 jours)</div>
        <div className="stat"><div className="n">{stats.notesThisWeek}</div>Notes cette semaine</div>
      </div>

      <h2>Notes de la semaine par type</h2>
      <div className="stats">
        {Object.keys(TYPE_LABELS).map((type) => (
          <div className="stat" key={type}>
            <div className="n">{stats.notesByType[type] || 0}</div>
            {TYPE_LABELS[type]}
          </div>
        ))}
      </div>

      <h2>Données de référence</h2>
      <div className="stats">
        <div className="stat"><div className="n">{stats.totals.regions}</div>Régions</div>
        <div className="stat"><div className="n">{stats.totals.crops}</div>Cultures</div>
        <div className="stat"><div className="n">{stats.totals.calendars}</div>Calendriers</div>
        <div className="stat"><div className="n">{stats.totals.advices}</div>Conseils</div>
      </div>
      <p className="muted">Les statistiques sont anonymes : aucun identifiant de téléphone n'est affiché.</p>
    </>
  );
}
