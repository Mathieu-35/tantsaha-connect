// CONTROLLER = le "réceptionniste" : il lit la demande, appelle le service, renvoie la réponse.
// Il ne contient presque aucune logique : tout est dans les services.

const referentiel = require('../services/referentiel.service');

exports.regions = async (req, res) => res.json(await referentiel.listRegions());

exports.crops = async (req, res) => res.json(await referentiel.listCrops());

// /api/calendrier?regionId=...
exports.calendar = async (req, res) => res.json(await referentiel.listCalendar(req.query.regionId));

// /api/conseils?cropId=...&topic=PEST
exports.advice = async (req, res) =>
  res.json(await referentiel.listAdvice({ cropId: req.query.cropId, topic: req.query.topic }));
