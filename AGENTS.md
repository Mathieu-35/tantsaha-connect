# AGENTS.md — Tantsaha Connect

Application mobile malagasy offline-first (React Native + Expo) et API Node/Express/Prisma.
Deux applications **indépendantes** dans un même dossier, sans workspaces ni package racine :
`mobile/` et `server/` ont chacun leur `package.json`, `package-lock.json` et `node_modules`.

## Commandes

Serveur (http://localhost:3000) :

```bash
cd server
npm install
npx prisma migrate dev     # AVANT le premier démarrage
npm run db:seed            # données d'exemple, idempotent
npm run dev                # node --watch ; vérifier GET /api/health
```

Mobile :

```bash
cd mobile
npm install
npx expo start             # Expo Go ; `npm run android|ios|web` aussi
```

Aucun script de test, de lint, de typecheck ni de CI n'existe. Ne pas en inventer :
la vérification réelle se fait en démarrant le serveur et en appelant `/api/health`.

## Environnement

- `server/.env` à copier depuis `.env.example` (`DATABASE_URL="file:./dev.db"`, `PORT`, `WEATHER_CACHE_MINUTES`).
- `mobile/.env` : `EXPO_PUBLIC_API_URL` doit contenir l'**IP LAN du PC** (`http://192.168.x.x:3000/api`), jamais `localhost` depuis un téléphone. L'URL inclut déjà `/api` ; `api.js` ajoute les chemins sans `/api`.
- Node 18+ requis (le code utilise `fetch` global et Express 5). npm uniquement (pas de bun/yarn/pnpm).

## Règles d'architecture à ne pas casser

- Serveur : `route → controller → service → prisma`. Les controllers font une ligne, aucune logique. Prisma n'est importé que depuis les services (singleton `src/db/prisma.js`).
- Mobile : `screen → repository → SQLite`. **Aucun SQL hors de `src/db/*Repository.js`** ; **aucun `fetch` hors de `src/services/api.js`**.
- Textes : uniquement via `src/i18n/mg.js` (malagasy, pas de texte en dur dans les écrans).
- Couleurs/tailles : uniquement via `src/theme/index.js`. Le **rouge** est réservé danger/interdit (contrainte C4 du cahier des charges).
- JavaScript pur (pas de TypeScript). Serveur = CommonJS ; mobile = ESM/JSX.

## Points non évidents

- **Sync** : lancée une seule fois dans `App.js` au démarrage (aucun écouteur réseau). `push` envoie les observations `synced = 0` ; conflit = last-write-wins sur `updatedAt` ; suppression douce via `deletedAt`. `pull` ne renvoie **que les données de référence**, jamais les observations : pas de restauration après réinstallation.
- Les UUID d'observation sont créés par le mobile (`expo-crypto`) et acceptés tels quels par le serveur.
- **Schéma SQLite mobile sans migrations** : le DDL est inline dans `src/db/database.js`, en `CREATE TABLE IF NOT EXISTS`, et `SCHEMA_VERSION` n'est jamais lu. Modifier une table existante n'affecte pas les installations déjà faites ; prévoir une migration manuelle (`PRAGMA user_version`).
- Le serveur renvoie du **camelCase** (`nameMg`, `cropId`), SQLite stocke du **snake_case** (`name_mg`, `crop_id`) ; le mapping se fait dans les repositories.
- Écrans Météo/Alertes/Journal/Conseils pointent tous vers `PlaceholderScreen`. Un nouvel écran = fichier dans `src/screens/` + `Stack.Screen` dans `AppNavigator.js`.
- Code déjà présent mais non branché : `weather_cache` (mobile), `api.weather()`, `expo-audio`, `expo-notifications`. Aucune logique d'alerte n'existe encore.
- L'app n'utilise que `/sync/pull` et `/meteo/:id`. Les endpoints `/regions`, `/cultures`, `/calendrier`, `/conseils` existent mais sont inutilisés.
- Prisma : `provider = "sqlite"`. Passage à PostgreSQL = changer le provider + `DATABASE_URL` ; en prod utiliser `prisma migrate deploy`, pas `migrate dev`.
- **Un seul dépôt Git, à la racine** (ADR 0009). `.claude/` et `.env` sont ignorés : ne jamais les ajouter. Un commit n'est fait qu'à la **fin d'un sprint terminé** (voir `docs/SPRINTS.md` et `docs/GIT_GUIDE.md`).
- **Architecture cible ≠ code actuel** : le serveur est encore rangé par type (`routes/`, `controllers/`, `services/`) ; la cible est un monolithe **modulaire** (`src/modules/<sujet>/`) avec API `/api/v1`, décrite dans `docs/ARCHITECTURE.md` et `docs/API.md`. La migration est le Sprint 2 : ne pas la faire avant.
- Les sprints se font **dans l'ordre** ; on ne commence pas le suivant tant que la « définition de terminé » du précédent n'est pas remplie. À chaque sprint de code, expliquer à l'utilisateur (débutant) ce qu'on fait et pourquoi.
- `prisma/seed.js` contient des données d'**exemple non validées** (mois de semis, textes malagasy) : ne pas les présenter comme agronomiquement correctes.

## Documentation

- `README.md`, `Cahier_des_charges.md` (exigences fonctionnelles, ergonomie, contraintes), `docs/PRD.md` (priorités MoSCoW), `docs/ARCHITECTURE.md` (modules, schéma de base), `docs/API.md`, `docs/adr/` (décisions), `docs/DESIGN.md` (palette `#2A7C13 #76C457 #FFF8CF #FBE6C2`, contrastes), `docs/SPRINTS.md`, `docs/GIT_GUIDE.md`, `docs/HEBERGEMENT.md`.
- `mobile/AGENTS.md` : règles Expo spécifiques (installer via `npx expo install`, docs versionnées, pas de dossiers `ios/`/`android/` édités à la main).
