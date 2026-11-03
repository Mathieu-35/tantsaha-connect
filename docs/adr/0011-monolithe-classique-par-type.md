# ADR 0011 — Monolithe classique, rangé par type de fichier
- Statut : Accepté (remplace l'[ADR 0002](0002-monolithe-modulaire.md))
- Date : 2026-11-03

## Contexte
L'ADR 0002 proposait un monolithe **modulaire** (un dossier par sujet). Le porteur du projet est débutant et préfère une organisation plus simple et plus courante pour ce premier projet ; il réserve le modulaire pour un projet futur.

## Décision
Le serveur reste **un seul programme**, rangé **par type de fichier** :

```
server/src/
├── routes/        La liste des adresses de l'API
├── controllers/   Lisent la demande, appellent un service
├── services/      La logique et l'accès à la base (Prisma)
├── middlewares/   Erreurs, authentification, limitation de débit
├── db/            Connexion à la base
├── config/        Lecture du .env
└── utils/         Petits outils
```

Règles : `route → controller → service → Prisma` ; le controller tient en une ligne ; **Prisma n'est importé que dans `services/`**.

**Nommage** : tous les fichiers sont en **anglais**, sous la forme `<sujet>.<rôle>.js` (`weather.controller.js`, `weather.service.js`). Les adresses de l'API restent en français (`/meteo`, `/cultures`) car ce sont celles que verront les téléphones.

## Alternatives
- *Monolithe modulaire* (ADR 0002) : mieux quand le nombre de sujets grandit, mais demande une règle de discipline supplémentaire. Reporté à un futur projet.
- *Microservices* : écarté (voir ADR 0002).

## Conséquences
- ✅ Disposition la plus répandue dans les tutoriels ; peu de concepts à apprendre.
- ✅ Le Sprint 2 est plus court : pas de réorganisation en modules.
- ⚠️ Avec l'authentification admin et les statistiques, chaque dossier gagnera des fichiers (`auth.*`, `stats.*`). Si cela devient confus, on pourra passer au modulaire plus tard : ce sont les mêmes fichiers déplacés.
- ⚠️ Rien n'oblige un controller à passer par un service : la discipline repose sur la règle ci-dessus, écrite aussi dans `AGENTS.md`.
