# ADR 0002 — Serveur en monolithe modulaire
- Statut : Accepté
- Date : 2026-11-03

## Contexte
Un seul développeur, hébergement gratuit, plusieurs sujets distincts (référentiel, météo, synchronisation, authentification admin, statistiques).

## Décision
**Un seul programme** Node.js, **rangé par modules** (`server/src/modules/<sujet>/`). Un module n'utilise un autre que par son `index.js`. Prisma n'est importé que dans les services.

## Alternatives
- *Monolithe rangé par type de fichier* (état actuel) : correct pour 3 sujets, confus pour 5 et plus avec le site admin. Remplacé.
- *Microservices* : plusieurs serveurs à déployer, surveiller, sécuriser ; coût et complexité sans bénéfice à notre échelle. Écarté.

## Conséquences
- ✅ Un seul déploiement ; frontières claires ; un module pourra être extrait plus tard.
- ⚠️ Discipline nécessaire : rien n'empêche techniquement d'importer le fichier d'un autre module. Les règles sont écrites dans `docs/ARCHITECTURE.md` et `AGENTS.md`.
