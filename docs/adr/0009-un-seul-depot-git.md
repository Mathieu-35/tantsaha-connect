# ADR 0009 — Un seul dépôt Git (monorepo)
- Statut : Accepté
- Date : 2026-11-03

## Contexte
`create-expo-app` a créé un dépôt Git à l'intérieur de `mobile/`. Le dossier racine n'en avait pas. Un dépôt dans un dépôt crée des confusions (le dépôt parent ignore le contenu).

## Décision
**Un seul dépôt** à la racine contenant `mobile/`, `server/`, `web/`, `docs/`. On supprime `mobile/.git` (il ne contient que le « Initial commit » du modèle Expo). Chaque dossier garde son propre `package.json` (pas de workspaces).

## Alternatives
- *Un dépôt par application* : 3 dépôts à synchroniser pour un seul développeur. Écarté.

## Conséquences
- ✅ Un seul historique ; une fonction (ex. « Météo ») touche mobile et serveur dans **un seul commit**.
- ⚠️ Les secrets (`.env`) et la base locale (`dev.db`) doivent rester dans `.gitignore`.
