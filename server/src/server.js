// Point d'entrée : c'est ce fichier que "npm run dev" lance.

const app = require('./app');
const { port, jwtSecret } = require('./config/env');

// Sans clé secrète solide, les connexions admin ne seraient pas sûres : on refuse de démarrer.
if (!jwtSecret || jwtSecret.length < 32) {
  console.error('JWT_SECRET manquant ou trop court (32 caractères minimum). Voir server/.env.example.');
  process.exit(1);
}

app.listen(port, () => {
  console.log(`Serveur Tantsaha Connect prêt : http://localhost:${port}/api/v1/health`);
});
