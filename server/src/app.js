// Assemble l'application Express (sans la démarrer : c'est le rôle de server.js).
// Séparer les deux permet de tester l'application plus facilement.

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());                         // autorise les autres applications à appeler l'API
app.use(express.json({ limit: '1mb' })); // permet de lire le JSON envoyé par le téléphone

app.use('/api', routes);

// Toujours EN DERNIER : gestion des adresses inconnues puis des erreurs
app.use(notFound);
app.use(errorHandler);

module.exports = app;
