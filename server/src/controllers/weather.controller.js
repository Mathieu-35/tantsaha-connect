const weather = require('../services/weather.service');

// GET /api/meteo/:regionId
exports.forecast = async (req, res) => res.json(await weather.getForecast(req.params.regionId));

