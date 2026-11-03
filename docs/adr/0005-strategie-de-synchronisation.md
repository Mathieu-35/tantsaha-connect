# ADR 0005 — Synchronisation : UUID client, suppression douce, dernier écrit gagne
- Statut : Accepté
- Date : 2026-11-03

## Contexte
Le téléphone écrit sans réseau et envoie plus tard, parfois deux fois. Un seul paysan écrit ses propres notes : les vrais conflits sont rares.

## Décision
1. **Identifiants UUID générés par le téléphone** (`expo-crypto`).
2. **Suppression douce** (`deletedAt`) pour les notes **et** les données de référence.
3. **Conflit** : la version avec le `updatedAt` le plus récent gagne.
4. Le serveur **refuse** de modifier une note dont le `deviceId` ne correspond pas.
5. `pull` ne renvoie que les données de référence ; `last_pull` = `serverTime` renvoyé par le serveur.

## Alternatives
- *CRDT / outils de synchro complets (WatermelonDB, PowerSync)* : puissants mais lourds à apprendre pour ce besoin. Écartés.
- *Identifiants auto-incrémentés par le serveur* : impossibles à créer hors ligne. Écartés.

## Conséquences
- ✅ Simple, sans doublon, résistant aux envois répétés.
- ⚠️ Pas de restauration après réinstallation (il faudrait identifier la personne). Reste en « Could » dans le PRD.
- ⚠️ L'horloge du téléphone peut être fausse : `updatedAt` d'une note vient du téléphone. Acceptable car une note n'est modifiée que par son propriétaire.
