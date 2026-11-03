# ADR 0010 — API versionnée `/api/v1`
- Statut : Accepté
- Date : 2026-11-03

## Contexte
Une fois l'application installée sur les téléphones, on ne peut pas forcer la mise à jour. Une modification de l'API casserait les anciens téléphones.

## Décision
Toutes les routes sont sous **`/api/v1`**. Un changement incompatible créera `/api/v2` en gardant `/v1` actif tant que des téléphones l'utilisent. Les changements compatibles (ajouter un champ) restent en v1.

## Alternatives
- *Pas de version* (état actuel) : plus court, mais piège futur. Corrigé maintenant car il n'y a pas encore d'utilisateurs.

## Conséquences
- ✅ Évolution sans casser les téléphones installés.
- ⚠️ `EXPO_PUBLIC_API_URL` devra devenir `.../api/v1` (Sprint 2).
