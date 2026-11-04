// Les "middlewares" sont des fonctions placées entre la demande et la réponse.
// Ceux-ci attrapent les erreurs pour toujours répondre proprement en JSON,
// TOUJOURS sous la même forme :  { "error": { "code": "NOT_FOUND", "message": "..." } }

const AppError = require('../utils/AppError');

const send = (res, status, code, message) => res.status(status).json({ error: { code, message } });

// Quand aucune route ne correspond à l'adresse demandée
function notFound(req, res) {
  send(res, 404, 'NOT_FOUND', 'Route introuvable');
}

// Quand une erreur survient n'importe où dans le code.
// (Express 5 envoie ici automatiquement les erreurs, même dans les fonctions async.)
function errorHandler(err, req, res, next) {
  // 1. Erreur prévue par nous : on montre son code et son message
  if (err instanceof AppError) return send(res, err.status, err.code, err.message);

  // 2. Erreur de lecture de la demande (JSON mal formé, corps trop gros) : Express lui donne un numéro 4xx
  const status = err.status || err.statusCode;
  if (status >= 400 && status < 500) {
    const message = status === 413 ? 'Demande trop volumineuse' : 'Demande illisible (JSON invalide ?)';
    const { code } = new AppError(message, status);
    return send(res, status, code, message);
  }

  // 3. Erreur imprévue : on la garde dans les logs, sans la montrer au client
  console.error(err);
  send(res, 500, 'INTERNAL_ERROR', 'Erreur interne du serveur');
}

module.exports = { notFound, errorHandler };
