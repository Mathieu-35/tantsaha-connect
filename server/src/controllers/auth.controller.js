const auth = require('../services/auth.service');

// POST /api/v1/admin/auth/login   corps : { email, password }
exports.login = async (req, res) => res.json(await auth.login(req.body?.email, req.body?.password));

// GET /api/v1/admin/me   (jeton requis ; req.user est rempli par requireAdmin)
exports.me = async (req, res) => res.json(await auth.me(req.user.id));
