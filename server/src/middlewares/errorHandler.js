// Les "middlewares" sont des fonctions placées entre la demande et la réponse.
// Ceux-ci attrapent les erreurs pour toujours répondre proprement en JSON.

// Quand aucune route ne correspond à l'adresse demandée
function notFound(req, res) {
  res.status(404).json({ error: { message: 'Route introuvable' } });
}

// Quand une erreur survient n'importe où dans le code.
// (Express 5 envoie ici automatiquement les erreurs, même dans les fonctions async.)
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status === 500) console.error(err); // erreur imprévue : on la garde dans les logs
  res.status(status).json({
    error: { message: status === 500 ? 'Erreur interne du serveur' : err.message },
  });
}

module.exports = { notFound, errorHandler };
