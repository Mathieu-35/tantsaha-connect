const admin = require('../services/admin.service');

// :resource vaut regions, cultures, calendrier ou conseils (voir routes/index.js)
exports.list = async (req, res) => res.json(await admin.list(req.params.resource));

exports.create = async (req, res) => res.status(201).json(await admin.create(req.params.resource, req.body));

exports.update = async (req, res) => res.json(await admin.update(req.params.resource, req.params.id, req.body));

exports.remove = async (req, res) => {
  await admin.remove(req.params.resource, req.params.id);
  res.status(204).end();
};

exports.statsSummary = async (req, res) => res.json(await admin.statsSummary());
