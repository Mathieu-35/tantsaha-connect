// APPLICATION WEB D'ADMINISTRATION
// Pas connecté → page de connexion. Connecté → barre du haut + 3 pages (onglets).

import { useEffect, useState } from 'react';
import { api, getToken, setToken, clearToken } from './api';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Calendars from './pages/Calendars.jsx';
import Advices from './pages/Advices.jsx';

const TABS = [
  { id: 'dashboard', label: 'Tableau de bord', Page: Dashboard },
  { id: 'calendars', label: 'Calendriers', Page: Calendars },
  { id: 'advices', label: 'Conseils', Page: Advices },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(!!getToken());
  const [tab, setTab] = useState('dashboard');

  // Au chargement : un jeton existe-t-il encore et est-il valide ?
  useEffect(() => {
    if (!getToken()) return;
    api.me().then(setUser).catch(() => clearToken()).finally(() => setChecking(false));
  }, []);

  async function handleLogin(email, password) {
    const result = await api.login(email, password);
    setToken(result.token);
    setUser(result.user);
  }

  function logout() {
    clearToken();
    setUser(null);
  }

  if (checking) return null;
  if (!user) return <Login onLogin={handleLogin} />;

  const { Page } = TABS.find((x) => x.id === tab);
  return (
    <>
      <header className="topbar">
        <h1>🌱 Tantsaha Connect — Administration</h1>
        <span className="who">{user.email} ({user.role})</span>
        <button className="btn ghost small" style={{ color: '#fff', borderColor: '#fff' }} onClick={logout}>
          Déconnexion
        </button>
      </header>
      <nav className="tabs">
        {TABS.map((x) => (
          <button key={x.id} className={`tab ${tab === x.id ? 'active' : ''}`} onClick={() => setTab(x.id)}>
            {x.label}
          </button>
        ))}
      </nav>
      <main className="page">
        <Page onSessionExpired={logout} />
      </main>
    </>
  );
}
