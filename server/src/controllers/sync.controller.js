const sync = require('../services/sync.service');

// POST /api/v1/sync/push   corps : { deviceId, regionId?, observations: [...] }
exports.push = async (req, res) => {
  const { deviceId, regionId, observations } = req.body ?? {};
  res.json(await sync.push(deviceId, regionId, observations));
};

// GET /api/v1/sync/pull?since=2026-10-28T10:00:00Z
exports.pull = async (req, res) => res.json(await sync.pull(req.query.since));
