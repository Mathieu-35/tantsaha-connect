# ADR — Décisions d'architecture

Un **ADR** (*Architecture Decision Record*) est une page courte qui garde la trace d'**une décision** : le contexte, ce qu'on a choisi, pourquoi, et ce que ça entraîne.
Pourquoi ? Dans six mois, personne (vous compris) ne se souviendra *pourquoi* on a choisi PostgreSQL ou pas de comptes pour les paysans. L'ADR répond à la place.

## Règles

- **Un ADR = une décision.** Numéroté, jamais effacé.
- On ne réécrit pas l'histoire : si on change d'avis, on écrit un **nouvel** ADR et on passe l'ancien en statut « Remplacé par ADR XXXX ».
- Statuts : **Proposé** → **Accepté** → (**Remplacé** ou **Abandonné**).

## Modèle (à copier)

```
# ADR XXXX — Titre court
- Statut : Proposé | Accepté | Remplacé par ADR YYYY
- Date : AAAA-MM-JJ

## Contexte        (le problème, les contraintes)
## Décision        (ce qu'on a choisi)
## Alternatives    (ce qu'on a écarté, et pourquoi)
## Conséquences    (le bon et le moins bon)
```

## Liste

| N° | Décision | Statut |
|---|---|---|
| [0001](0001-offline-first.md) | Application « d'abord le téléphone » (offline-first) | Accepté |
| [0002](0002-monolithe-modulaire.md) | Serveur en monolithe modulaire | Accepté |
| [0003](0003-react-native-et-react-web.md) | React Native (Expo) pour le mobile, React (Vite) pour le web | Accepté |
| [0004](0004-express-prisma-postgresql.md) | Express + Prisma ; SQLite en développement, PostgreSQL en production | Accepté |
| [0005](0005-strategie-de-synchronisation.md) | Synchronisation : UUID client, suppression douce, dernier écrit gagne | Accepté |
| [0006](0006-auth-admin-seulement.md) | Pas de compte pour les paysans ; authentification pour l'admin seulement | Accepté |
| [0007](0007-meteo-open-meteo-via-serveur.md) | Météo : Open-Meteo, appelée par le serveur avec cache | Accepté |
| [0008](0008-palette-et-rouge-danger.md) | Palette verte/crème ; rouge réservé au danger | Accepté |
| [0009](0009-un-seul-depot-git.md) | Un seul dépôt Git (monorepo) | Accepté |
| [0010](0010-api-versionnee.md) | API versionnée `/api/v1` | Accepté |
