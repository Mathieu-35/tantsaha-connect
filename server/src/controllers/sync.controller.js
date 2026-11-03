const sync = require('../services/sync.service');

// POST /api/sync/push   corps : { deviceId, observations: [...] }
exports.push = async (req, res) => res.json(await sync.push(req.body.deviceId, req.body.observations));

// GET /api/sync/pull?since=2026-10-28T10:00:00Z
exports.pull = async (req, res) => res.json(await sync.pull(req.query.since));
