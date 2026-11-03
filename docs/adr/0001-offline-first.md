# ADR 0001 — Application « d'abord le téléphone » (offline-first)
- Statut : Accepté
- Date : 2026-11-03

## Contexte
Le sujet impose : peu ou pas d'internet, téléphones basiques. Une application qui demande le réseau à chaque écran serait inutilisable (contrainte C1 du cahier).

## Décision
Le téléphone possède une base **SQLite locale** qui est la **source de vérité pour l'utilisateur**. Les écrans lisent et écrivent uniquement dedans. Une synchronisation en arrière-plan échange avec le serveur quand le réseau existe. Les données de référence sont **embarquées** dans l'application pour qu'elle serve dès le premier lancement.

## Alternatives
- *Application qui appelle toujours le serveur* : plus simple, mais inutilisable hors réseau. Écarté.
- *Cache seulement (lecture hors ligne, écriture en ligne)* : le paysan ne pourrait pas noter une pluie sans réseau. Écarté.

## Conséquences
- ✅ Fonctionne en mode avion ; un serveur gratuit endormi n'est pas un problème.
- ⚠️ Il faut une synchronisation, des identifiants créés côté téléphone et des migrations de la base locale (voir ADR 0005).
