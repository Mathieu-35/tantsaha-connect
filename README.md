# Tantsaha Connect

Application mobile d'aide à la gestion des cultures et des saisons agricoles pour les paysans malagasy.
Projet d'IHM : interface simple, utilisable **sans lire**, **en malagasy**, **hors ligne**.

- Cahier des charges : [Cahier_des_charges.md](Cahier_des_charges.md) / [.docx](Cahier_des_charges.docx)
- Besoin produit : [docs/PRD.md](docs/PRD.md)
- Architecture : [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) · API : [docs/API.md](docs/API.md) · Décisions : [docs/adr](docs/adr/README.md)
- Design : [docs/DESIGN.md](docs/DESIGN.md)
- Plan de travail : [docs/SPRINTS.md](docs/SPRINTS.md) · Git : [docs/GIT_GUIDE.md](docs/GIT_GUIDE.md) · Hébergement : [docs/HEBERGEMENT.md](docs/HEBERGEMENT.md)

## Technologies

| Partie | Technologie |
|---|---|
| Application mobile | React Native + Expo (JavaScript) |
| Base locale (téléphone) | SQLite (`expo-sqlite`) |
| Serveur | Node.js + Express 5 |
| Base du serveur | Prisma + SQLite (dev) → PostgreSQL (production) |
| Météo | Open-Meteo (gratuit) |

## Installation (première fois)

Prérequis : **Node.js** installé.

### 1. Serveur

```bash
cd server
npm install
cp .env.example .env
npx prisma migrate dev
npm run db:seed
npm run dev
```

Avant `npm run dev`, ouvrez `server/.env` et remplacez `JWT_SECRET` par une clé aléatoire d'au moins 32 caractères (la commande pour en générer une est écrite dans le fichier). Sans elle, le serveur refuse de démarrer.

Vérification : ouvrez <http://localhost:3000/api/v1/health> dans un navigateur. Vous devez voir `{"status":"ok",...}`.

Pour se connecter au futur site d'administration, créez un compte : `npm run admin:create` (le script pose les questions).

### 2. Application mobile

```bash
cd mobile
npm install
cp .env.example .env
```

Ouvrez `mobile/.env` et remplacez l'adresse par **l'IP de votre ordinateur** (commande `ipconfig`, ligne « Adresse IPv4 »). Ensuite :

```bash
npx expo start
```

Sur l'iPhone : installez **Expo Go** (App Store), puis scannez le QR code avec l'appareil photo. Le téléphone et l'ordinateur doivent être sur le **même Wi-Fi**.

## Commandes utiles

| Où | Commande | Effet |
|---|---|---|
| server | `npm run dev` | Lance le serveur (redémarre à chaque modification) |
| server | `npm run db:seed` | Remplit la base avec les données de départ |
| server | `npm run db:studio` | Ouvre une page pour voir le contenu de la base |
| server | `npm run db:reset` | **Efface** la base de développement, la recrée et la remplit (demande confirmation) |
| server | `npm run admin:create` | Crée un compte pour le site d'administration |
| server | `npm run export:seed` | Écrit `mobile/src/data/seed.json` (données embarquées dans l'application) |
| mobile | `npx expo start` | Lance l'application |

## API du serveur

| Méthode | Adresse | Rôle |
|---|---|---|
| GET | `/api/v1/health` | Le serveur est-il vivant ? |
| GET | `/api/v1/regions`, `/cultures`, `/calendrier`, `/conseils` | Données de référence |
| GET | `/api/v1/meteo/:regionId` | Prévisions sur 5 jours (avec cache) |
| POST | `/api/v1/sync/push` | Le téléphone envoie ses observations |
| GET | `/api/v1/sync/pull?since=...` | Le téléphone récupère les données modifiées |
| POST | `/api/v1/admin/auth/login` | Connexion au site d'administration |
| GET | `/api/v1/admin/me` | Qui suis-je ? (jeton requis) |

Détail complet : [docs/API.md](docs/API.md).

## Feuille de route

Le détail est dans [docs/SPRINTS.md](docs/SPRINTS.md). On ne passe au sprint suivant que lorsque le précédent est terminé.

- [x] Cahier des charges, PRD, architecture, API, ADR, charte de design
- [x] Première version du serveur et du socle mobile (à reprendre aux Sprints 2 et 3)
- [x] Sprint 0 — GitHub et dépôt unique
- [x] Sprint 1 — Wireframes et maquettes (mobile + web)
- [x] Sprint 2 — Serveur sécurisé et API v1
- [x] Sprint 3 — Socle mobile (thème, données embarquées, hors ligne)
- [x] Sprint 4 — Météo
- [x] Sprint 5 — Journal de culture
- [ ] Sprint 6 — Alertes
- [ ] Sprint 7 — Conseils et voix malagasy
- [ ] Sprint 8 — Site web d'administration
- [ ] Sprint 9 — Ergonomie, tests utilisateurs, Android
- [ ] Sprint 10 — Mise en ligne et rapport

## Données à vérifier

Les mois de semis/récolte et les conseils du fichier `server/prisma/seed.js` sont des **exemples**. Ils doivent être validés par un agronome ou des paysans, et les textes malagasy relus.
