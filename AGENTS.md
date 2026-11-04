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
npm run db:seed            # données d'exemple, idempotent (ids stables : reg_*, crop_*, cal_*, adv_*)
npm run dev                # node --watch ; vérifier GET /api/v1/health
npm run db:reset           # EFFACE dev.db puis recrée + seed (demande confirmation ; à lancer par l'utilisateur)
npm run admin:create       # crée un compte du site d'administration (questions interactives)
npm run export:seed        # écrit mobile/src/data/seed.json (données embarquées dans l'app)
```

Mobile :

```bash
cd mobile
npm install
npx expo start             # Expo Go ; `npm run android|ios|web` aussi
```

Aucun script de test, de lint, de typecheck ni de CI n'existe. Ne pas en inventer :
la vérification réelle se fait en démarrant le serveur et en appelant `/api/v1/health`.
Pour tester sans toucher à `dev.db` : lancer le serveur avec `DATABASE_URL` pointant vers une base jetable (`prisma migrate deploy` + `node prisma/seed.js`, puis `PORT` libre) et `JWT_SECRET` ≥ 32 caractères ; les variables d'environnement déjà posées priment sur `.env`.

## Environnement

- `server/.env` à copier depuis `.env.example` (`DATABASE_URL="file:./dev.db"`, `PORT`, `WEATHER_CACHE_MINUTES`, **`JWT_SECRET`** ≥ 32 caractères, `JWT_EXPIRES_IN`). Sans `JWT_SECRET` valide, `server.js` refuse de démarrer.
- `mobile/.env` : `EXPO_PUBLIC_API_URL` doit contenir l'**IP LAN du PC** (`http://192.168.x.x:3000/api/v1`), jamais `localhost` depuis un téléphone. L'URL inclut déjà `/api/v1` ; `api.js` ajoute les chemins sans ce préfixe.
- Node 18+ requis (le code utilise `fetch` global et Express 5). npm uniquement (pas de bun/yarn/pnpm).

## Règles d'architecture à ne pas casser

- Serveur : `route → controller → service → prisma`. Les controllers font une ligne, aucune logique. Prisma n'est importé que depuis les services (singleton `src/db/prisma.js`).
- Mobile : `screen → repository → SQLite`. **Aucun SQL hors de `src/db/*Repository.js`** ; **aucun `fetch` hors de `src/services/api.js`**.
- Textes : uniquement via `src/i18n/mg.js` (malagasy, pas de texte en dur dans les écrans).
- Couleurs/tailles : uniquement via `src/theme/index.js`. Le **rouge** est réservé danger/interdit (contrainte C4 du cahier des charges).
- JavaScript pur (pas de TypeScript). Serveur = CommonJS ; mobile = ESM/JSX.

## Points non évidents

- **Sync** : lancée une seule fois dans `App.js` au démarrage (aucun écouteur réseau). `push` envoie les observations `synced = 0` ; conflit = last-write-wins sur `updatedAt` ; suppression douce via `deletedAt`. `pull` ne renvoie **que les données de référence**, jamais les observations : pas de restauration après réinstallation.
- **Réponse du `push` serveur** : `{ serverTime, accepted: [ids], rejected: [{id, reason}] }`. Chaque note est jugée séparément ; un refus est définitif. Le mobile marque encore **toutes** les notes `synced` après une réponse 200 (suffisant pour l'instant ; à affiner au Sprint 5). Une note n'est modifiable que par le `deviceId` qui l'a créée ; dates futures > 1 jour ramenées à l'heure du serveur ; max 200 notes / 256 ko.
- **`pull`** : sans `since` il omet les éléments supprimés ; avec `since` il les renvoie (`deletedAt` non nul). Les listes publiques (`/regions`…) cachent les supprimés.
- **Auth admin** : bcryptjs + JWT (`auth.service.js`, `requireAdmin(roles?)`). Limites : 120 req/min, 5 logins/min (`rateLimit.js`, par IP ; derrière un proxy il faudra `trust proxy`, Sprint 10). Erreurs toujours `{ error: { code, message } }` (`AppError(message, status, code?)`).
- **`seed.json`** (`mobile/src/data/`) est généré par `npm run export:seed` ; il est versionné dans Git. Le mobile ne le lit pas encore (Sprint 3). Les ids des données de départ sont fixés dans `prisma/seed.js` : ne pas revenir à des ids aléatoires, sinon le seed embarqué et la production divergent.
- Les UUID d'observation sont créés par le mobile (`expo-crypto`) et acceptés tels quels par le serveur.
- **Schéma SQLite mobile sans migrations** : le DDL est inline dans `src/db/database.js`, en `CREATE TABLE IF NOT EXISTS`, et `SCHEMA_VERSION` n'est jamais lu. Modifier une table existante n'affecte pas les installations déjà faites ; prévoir une migration manuelle (`PRAGMA user_version`).
- Le serveur renvoie du **camelCase** (`nameMg`, `cropId`), SQLite stocke du **snake_case** (`name_mg`, `crop_id`) ; le mapping se fait dans les repositories.
- Écrans Météo/Alertes/Journal/Conseils pointent tous vers `PlaceholderScreen`. Un nouvel écran = fichier dans `src/screens/` + `Stack.Screen` dans `AppNavigator.js`.
- Code déjà présent mais non branché : `weather_cache` (mobile), `api.weather()`, `expo-audio`, `expo-notifications`. Aucune logique d'alerte n'existe encore.
- L'app n'utilise que `/sync/pull`, `/sync/push` et `/meteo/:id`. Les endpoints `/regions`, `/cultures`, `/calendrier`, `/conseils` servent au site web et au débogage.
- Prisma : `provider = "sqlite"`. Passage à PostgreSQL = changer le provider + `DATABASE_URL` ; en prod utiliser `prisma migrate deploy`, pas `migrate dev`.
- **Un seul dépôt Git, à la racine** (ADR 0009). `.claude/` et `.env` sont ignorés : ne jamais les ajouter. Un commit n'est fait qu'à la **fin d'un sprint terminé** (voir `docs/SPRINTS.md` et `docs/GIT_GUIDE.md`).
- **Monolithe classique** (ADR 0011) : le serveur reste rangé par type (`routes/`, `controllers/`, `services/`), PAS en modules. Fichiers nommés en **anglais** `<sujet>.<rôle>.js` (`weather.controller.js`) ; les URLs de l'API restent en français (`/meteo`). L'API cible (`/api/v1`, login admin, etc.) est décrite dans `docs/API.md` et arrive au Sprint 2 : ne pas l'anticiper.
- Les sprints se font **dans l'ordre** ; on ne commence pas le suivant tant que la « définition de terminé » du précédent n'est pas remplie. À chaque sprint de code, expliquer à l'utilisateur (débutant) ce qu'on fait et pourquoi.
- `prisma/seed.js` contient des données d'**exemple non validées** (mois de semis, textes malagasy) : ne pas les présenter comme agronomiquement correctes.

## Préférences du développeur

- **Débutant en programmation** : expliquer simplement ce qu'on fait et pourquoi, surtout pour le code. Pas de jargon sans explication.
- Communiquer en **français**.
- Travaille **seul, sans deadline**.
- Préfère des **instructions directes étape par étape** plutôt que des choix ouverts.
- Messages de commit en **anglais** (Conventional Commits) mais toujours donner la **traduction française** à côté.
- À la fin de chaque sprint : donner les **commandes git exactes** prêtes à copier (`git add`, `commit`, `push`, `tag`).
- Vérifier `git status` avant chaque commit pour s'assurer qu'aucun `.env` ou `dev.db` n'est inclus.
- Test mobile sur **iPhone XS** via `npx expo start --tunnel` (le mode LAN est bloqué par le pare-feu).
- Compte GitHub : `Mathieu-35` (dépôt privé `tantsaha-connect`). Compte Expo : `sahiniaina`.

## Documentation

- `README.md`, `Cahier_des_charges.md` (exigences fonctionnelles, ergonomie, contraintes), `docs/PRD.md` (priorités MoSCoW), `docs/ARCHITECTURE.md` (modules, schéma de base), `docs/API.md`, `docs/adr/` (décisions), `docs/DESIGN.md` (palette `#2A7C13 #76C457 #FFF8CF #FBE6C2`, contrastes), `docs/SPRINTS.md`, `docs/GIT_GUIDE.md`, `docs/HEBERGEMENT.md`.
- `mobile/AGENTS.md` : règles Expo spécifiques (installer via `npx expo install`, docs versionnées, pas de dossiers `ios/`/`android/` édités à la main).
