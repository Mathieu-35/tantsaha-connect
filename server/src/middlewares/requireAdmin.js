// PROTECTION des routes d'administration : exige un jeton de connexion valide.
//
// Le site web envoie  Authorization: Bearer <jeton>  avec chaque demande.
// Utilisation dans une route :
//   router.get('/admin/me', requireAdmin(), controller.me)           -> tout compte connecté
//   router.put('/admin/...', requireAdmin(['ADMIN']), controller.x)  -> seulement le rôle ADMIN

const AppError = require('../utils/AppError');
const auth = require('../services/auth.service');

function requireAdmin(allowedRoles) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) throw new AppError('Connexion requise', 401);

    req.user = auth.verifyToken(token); // lève une erreur 401 si le jeton est faux ou expiré
    if (allowedRoles && !allowedRoles.includes(req.user.role)) {
      throw new AppError('Droits insuffisants', 403);
    }
    next();
  };
}

module.exports = requireAdmin;
