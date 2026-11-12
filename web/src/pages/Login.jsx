import { useState } from 'react';
import { Landscape, Logo } from '../components/Motifs.jsx';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login">
      <div className="art">
        <Landscape viewBox="120 0 270 228" />
        <div className="brand">
          <Logo size={64} />
          <h1>Tantsaha<br />Connect</h1>
        </div>
      </div>
      <div className="panel">
        <form onSubmit={submit}>
          <h2>Espace d'administration</h2>
          <p className="muted">Réservé à l'équipe : administrateurs et agronomes.</p>
          {error && <div className="error">{error}</div>}
          <label>
            E-mail
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
          </label>
          <label>
            Mot de passe
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <button className="btn" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter'}</button>
        </form>
      </div>
    </div>
  );
}
