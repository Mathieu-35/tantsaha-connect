# ADR 0006 — Pas de compte pour les paysans ; authentification pour l'admin seulement
- Statut : Accepté
- Date : 2026-11-03

## Contexte
Public qui lit peu, mots de passe oubliés, aucun besoin de partager les notes entre personnes. En revanche, le site web permet de **modifier les données de tout le monde** : il doit être protégé.

## Décision
- **Mobile** : aucun compte. Un identifiant d'appareil aléatoire (`deviceId`) est créé à l'installation. Aucune donnée personnelle.
- **Web admin** : e-mail + mot de passe (haché avec **bcrypt**), **jeton JWT** à durée limitée, deux rôles (`ADMIN`, `AGRONOME`). Les comptes sont créés par script ou par un admin, **pas d'inscription publique**.

## Alternatives
- *Connexion par numéro de téléphone (SMS)* pour les paysans : coût des SMS, complexité. Écarté pour la v1.
- *Sessions par cookie* : possible ; le JWT est plus simple avec un site hébergé séparément.

## Conséquences
- ✅ Zéro friction pour le paysan, très peu de données à protéger.
- ⚠️ Un téléphone perdu ou réinstallé = notes perdues pour la personne. Les routes publiques sont ouvertes : il faut donc **limitation de débit** et validation stricte.
