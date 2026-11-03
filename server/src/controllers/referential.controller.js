// CONTROLLER = le "réceptionniste" : il lit la demande, appelle le service, renvoie la réponse.
// Il ne contient presque aucune logique : tout est dans les services.

const referential = require('../services/referential.service');

exports.regions = async (req, res) => res.json(await referential.listRegions());

exports.crops = async (req, res) => res.json(await referential.listCrops());

// /api/calendrier?regionId=...
exports.calendar = async (req, res) => res.json(await referential.listCalendar(req.query.regionId));

// /api/conseils?cropId=...&topic=PEST
exports.advice = async (req, res) =>
  res.json(await referential.listAdvice({ cropId: req.query.cropId, topic: req.query.topic }));
