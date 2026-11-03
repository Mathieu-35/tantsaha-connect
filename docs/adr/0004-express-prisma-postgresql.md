# ADR 0004 — Express + Prisma ; SQLite en développement, PostgreSQL en production
- Statut : Accepté
- Date : 2026-11-03

## Contexte
Les données sont **liées** (note → culture → région). Il faut démarrer sans rien installer, mais pouvoir héberger gratuitement une vraie base ensuite.

## Décision
- **Express 5** pour l'API (simple, très documenté, erreurs `async` gérées).
- **Prisma 6** comme ORM : on décrit les tables dans `schema.prisma`, Prisma génère le code d'accès et les migrations.
- **SQLite** en développement (un fichier, zéro installation) ; **PostgreSQL** en production (changer `provider` et `DATABASE_URL`, puis `prisma migrate deploy`).
- Version **6** de Prisma épinglée : la 7 change la configuration.

## Alternatives
- *MongoDB* : bien pour des documents sans lien ; ici les relations dominent. Écarté.
- *MySQL* : possible, mais l'offre gratuite et l'écosystème sont meilleurs pour PostgreSQL.
- *SQL à la main* : plus d'erreurs, pas de migrations automatiques. Écarté.

## Conséquences
- ✅ Même code en dev et en production.
- ⚠️ SQLite n'accepte pas les `enum` ni le type `Json` de Prisma : on utilise des textes. Tester sur PostgreSQL **avant** la mise en ligne (Sprint 10).
