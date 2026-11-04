// Une erreur "prévue" : on connaît son code HTTP et on peut montrer son message.
// Exemples de codes HTTP : 400 = demande incorrecte, 401 = pas connecté, 404 = introuvable.
//
// Le "code" est un petit mot STABLE (ex. NOT_FOUND) : le téléphone et le site web
// s'appuient dessus, alors que le message en français peut changer.

// Code par défaut selon le numéro HTTP (voir docs/API.md)
const DEFAULT_CODES = {
  400: 'VALIDATION_ERROR',
  401: 'UNAUTHORIZED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  409: 'CONFLICT',
  413: 'PAYLOAD_TOO_LARGE',
  429: 'RATE_LIMITED',
  503: 'UPSTREAM_ERROR',
};

class AppError extends Error {
  constructor(message, status = 500, code) {
    super(message);
    this.status = status;
    this.code = code || DEFAULT_CODES[status] || 'INTERNAL_ERROR';
  }
}

module.exports = AppError;
