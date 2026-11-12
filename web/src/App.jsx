// APPLICATION WEB D'ADMINISTRATION
// Pas connecté → page de connexion. Connecté → barre du haut + 3 pages (onglets).

import { useEffect, useState } from 'react';
import { api, getToken, setToken, clearToken } from './api';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Calendars from './pages/Calendars.jsx';
import Advices from './pages/Advices.jsx';
import Icon from './components/Icon.jsx';
import { Logo, ZafiBand } from './components/Motifs.jsx';

const TABS = [
  { id: 'dashboard', label: 'Tableau de bord', icon: 'sun', Page: Dashboard },
  { id: 'calendars', label: 'Calendriers', icon: 'today', Page: Calendars },
  { id: 'advices', label: 'Conseils', icon: 'tip', Page: Advices },
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
    <div className="shell">
      <div className="sticky-top">
      <header className="topbar">
        <div className="brand">
          <Logo size={44} bg="#FFF8CF" leaf="#2A7C13" />
          <h1>Tantsaha Connect<br />Administration</h1>
        </div>
        <span className="who">{user.email} ({user.role})</span>
        <button className="btn ghost small" onClick={logout}>
          Déconnexion
        </button>
      </header>
      <nav className="tabs">
        {TABS.map((x) => (
          <button key={x.id} className={`tab ${tab === x.id ? 'active' : ''}`} onClick={() => setTab(x.id)}>
            <Icon name={x.icon} size={32} color={tab === x.id ? '#FFF8CF' : '#1F2A17'} />
            {x.label}
          </button>
        ))}
      </nav>
      </div>
      <main className="page">
        <Page onSessionExpired={logout} />
      </main>
      <div className="footband"><ZafiBand id="zafiFoot" height={26} /></div>
    </div>
  );
}
