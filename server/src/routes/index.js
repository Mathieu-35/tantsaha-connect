// ROUTES = la liste des adresses (URL) que le serveur comprend,
// et quel controller répond à chacune.
// Tout est préfixé par /api (voir app.js).

const { Router } = require('express');
const referentiel = require('../controllers/referentiel.controller');
const meteo = require('../controllers/meteo.controller');
const sync = require('../controllers/sync.controller');

const router = Router();

// Test rapide : le serveur est-il vivant ?
router.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Données de référence (lecture seule)
router.get('/regions', referentiel.regions);
router.get('/cultures', referentiel.crops);
router.get('/calendrier', referentiel.calendar);
router.get('/conseils', referentiel.advice);

// Météo
router.get('/meteo/:regionId', meteo.forecast);

// Synchronisation avec le téléphone
router.post('/sync/push', sync.push);
router.get('/sync/pull', sync.pull);

module.exports = router;
