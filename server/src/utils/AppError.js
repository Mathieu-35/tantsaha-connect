// Une erreur "prévue" : on connaît son code HTTP et on peut montrer son message.
// Exemples de codes : 400 = demande incorrecte, 404 = introuvable, 503 = service indisponible.

class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

module.exports = AppError;
