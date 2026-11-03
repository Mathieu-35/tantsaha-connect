// Point d'entrée : c'est ce fichier que "npm run dev" lance.

const app = require('./app');
const { port } = require('./config/env');

app.listen(port, () => {
  console.log(`Serveur Tantsaha Connect prêt : http://localhost:${port}/api/health`);
});
