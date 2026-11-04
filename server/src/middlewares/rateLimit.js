// LIMITATION DE DÉBIT : empêche qu'une même adresse (IP) envoie un nombre énorme de demandes.
// Sans cela, un robot pourrait saturer le serveur ou deviner des mots de passe.
// Quand la limite est dépassée, on répond 429 (RATE_LIMITED) au format habituel.

const { rateLimit } = require('express-rate-limit');
const AppError = require('../utils/AppError');

function limiter({ windowMs, limit, message }) {
  return rateLimit({
    windowMs,                       // durée de la fenêtre, en millisecondes
    limit,                          // nombre de demandes autorisées dans cette fenêtre
    standardHeaders: 'draft-7',     // ajoute les en-têtes RateLimit-* (le client sait combien il lui reste)
    legacyHeaders: false,
    handler: (req, res, next) => next(new AppError(message, 429)),
  });
}

// Limite générale : 120 demandes par minute et par adresse
const apiLimiter = limiter({
  windowMs: 60 * 1000,
  limit: 120,
  message: 'Trop de demandes, réessayez dans une minute',
});

// Connexion admin : 5 essais par minute (décourage les devinettes de mot de passe)
const loginLimiter = limiter({
  windowMs: 60 * 1000,
  limit: 5,
  message: 'Trop d\'essais de connexion, réessayez dans une minute',
});

module.exports = { apiLimiter, loginLimiter };
