// Assemble l'application Express (sans la démarrer : c'est le rôle de server.js).
// Séparer les deux permet de tester l'application plus facilement.

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { apiLimiter } = require('./middlewares/rateLimit');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());                          // autorise les autres applications à appeler l'API
app.use(express.json({ limit: '256kb' })); // lit le JSON reçu ; 256 ko suffisent (200 notes ≈ 60 ko)

// Toute l'API est sous /api/v1 : si un jour on change le format, /api/v2 pourra coexister
// avec /api/v1 pour les téléphones qui n'ont pas été mis à jour (ADR 0010).
app.use('/api/v1', apiLimiter, routes);

// Toujours EN DERNIER : gestion des adresses inconnues puis des erreurs
app.use(notFound);
app.use(errorHandler);

module.exports = app;
