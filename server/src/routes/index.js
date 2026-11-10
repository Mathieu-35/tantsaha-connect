// ROUTES = la liste des adresses (URL) que le serveur comprend,
// et quel controller répond à chacune.
// Tout est préfixé par /api/v1 (voir app.js).

const { Router } = require('express');
const referential = require('../controllers/referential.controller');
const weather = require('../controllers/weather.controller');
const sync = require('../controllers/sync.controller');
const auth = require('../controllers/auth.controller');
const adminData = require('../controllers/admin.controller');
const requireAdmin =require('../middlewares/requireAdmin');
const { loginLimiter } = require('../middlewares/rateLimit');

const router = Router();

// Test rapide : le serveur est-il vivant ?
router.get('/health', (req, res) => res.json({ status: 'ok', time: new Date() }));

// Données de référence (lecture seule)
router.get('/regions', referential.regions);
router.get('/cultures', referential.crops);
router.get('/calendrier', referential.calendar);
router.get('/conseils', referential.advice);

// Météo
router.get('/meteo/:regionId', weather.forecast);

// Synchronisation avec le téléphone
router.post('/sync/push', sync.push);
router.get('/sync/pull', sync.pull);

// Administration (site web) : la connexion est publique mais très limitée,
// le reste exige un jeton (requireAdmin).
router.post('/admin/auth/login', loginLimiter, auth.login);
router.get('/admin/me', requireAdmin(), auth.me);

// Gestion des données (comptes ADMIN et AGRONOME). :resource = regions | cultures | calendrier | conseils
const farmData = requireAdmin(['ADMIN', 'AGRONOME']);
router.get('/admin/stats/summary', farmData, adminData.statsSummary);
router.get('/admin/:resource', farmData, adminData.list);
router.post('/admin/:resource', farmData, adminData.create);
router.put('/admin/:resource/:id', farmData, adminData.update);
router.delete('/admin/:resource/:id', farmData, adminData.remove);

module.exports = router;
