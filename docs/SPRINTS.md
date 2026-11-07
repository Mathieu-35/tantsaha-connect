# Plan de travail par sprints — Tantsaha Connect

**Sprint** = une période de travail avec **un objectif clair**. À la fin, on a quelque chose qui **marche** et qu'on peut montrer.
Développeur seul, sans date imposée : un sprint dure le temps qu'il faut.

## Les règles du jeu

1. **Porte fermée** : on **ne commence pas** le sprint N+1 tant que **toute** la « définition de terminé » du sprint N n'est pas cochée.
2. **Au début de chaque sprint**, je vous explique *ce qu'on va faire* et *pourquoi*.
3. **Pendant les sprints de code**, j'explique chaque fichier important : à quoi il sert, comment il marche, quelle erreur il évite (rubrique 💡).
4. **À la fin de chaque sprint** : vérification ensemble → commit + push + étiquette (`sprint-N`), avec les commandes exactes (voir [GIT_GUIDE.md](GIT_GUIDE.md)).
5. **Les décisions qui vous reviennent** sont posées *avant* le sprint concerné, pas pendant.
6. Pistes parallèles : 📝 **Rapport** (noter les choix d'ergonomie au fur et à mesure) et 🗣️ **Malagasy** (tout texte est relu).

## Vue d'ensemble

| Sprint | Nom | Type | Résultat visible |
|---|---|---|---|
| 0 | Mise en place : GitHub et dépôt unique | Outils | Le projet est sur GitHub |
| 1 | Conception : wireframes et maquettes | Design | Maquettes mobile + web validées |
| 2 | Serveur sécurisé et API v1 | Code serveur | API `/api/v1` propre, login admin |
| 3 | Socle mobile | Code mobile | Accueil aux couleurs finales, marche en mode avion |
| 4 | Météo | Code mobile | Écran Météo hors ligne |
| 5 | Journal de culture | Code mobile | Noter et synchroniser |
| 6 | Alertes | Code mobile | Notifications semis / récolte |
| 7 | Conseils et voix malagasy | Code mobile | Écouter un conseil |
| 8 | Site web d'administration | Code web | Modifier un calendrier depuis le web |
| 9 | Ergonomie, tests utilisateurs, Android | Qualité | 4 personnes sur 5 réussissent |
| 10 | Mise en ligne et rapport | Livraison | Application installable + rapport |

---

## Sprint 0 — Mise en place : GitHub et dépôt unique

**Objectif** : avoir un seul dépôt Git, sauvegardé sur GitHub, avant de toucher au code.
**Pourquoi** : sans historique, une erreur est irréversible. Avec Git, on peut toujours revenir en arrière. GitHub sert de sauvegarde et de vitrine.

- [ ] Créer le compte et le dépôt GitHub privé `tantsaha-connect` (vous, guidé : [GIT_GUIDE.md](GIT_GUIDE.md) partie A)
- [ ] Supprimer `mobile/.git`, `git init` à la racine
- [ ] Vérifier que `.env`, `dev.db`, `node_modules` sont ignorés
- [ ] Nettoyer les références au dossier `prototype/` inexistant (README, `.claude/launch.json`)
- [ ] Mettre à jour `README.md` (nouvelle structure de la documentation) et `AGENTS.md` (règles du monolithe classique)
- [ ] Premier commit + push

**Terminé quand** : le dépôt GitHub montre tous les dossiers, aucun secret n'y figure, `docs/ARCHITECTURE.md` affiche ses schémas.
**Commit** : `chore: initial project structure (server, mobile, docs)` · étiquette `sprint-0`

---

## Sprint 1 — Conception : wireframes et maquettes

**Objectif** : voir et valider **tous les écrans** avant d'écrire du code d'interface.
**Pourquoi** : changer un dessin coûte 5 minutes ; changer un écran codé coûte une heure. Et les wireframes sont un **livrable obligatoire** du sujet.

- [x] **Décision** : la partie web (back-office) est confirmée (PRD §3)
- [x] Wireframes des **6 écrans mobiles principaux** (+ 6 écrans secondaires) et des **4 pages web** : bascule « wireframe » dans chaque page
- [x] Maquettes colorées avec la palette, en HTML consultable dans le navigateur (`docs/maquettes/`)
- [x] Vérification des contrastes (pire 4,60:1) et des tailles tactiles (toutes ≥ 48 px) sur les maquettes
- [x] Parcours cliquables : voir la météo, noter une pluie, écouter un conseil, premier lancement
- [ ] **Vous validez** (ou demandez des changements) écran par écran, **et relisez le malagasy**
- [x] 📝 Premiers paragraphes de justification d'ergonomie : [docs/rapport/ergonomie.md](rapport/ergonomie.md)

💡 *Ce que vous apprenez* : lire un wireframe, la différence wireframe / maquette / prototype, comment la palette devient du code (variables CSS).

**Terminé quand** : vous avez validé chaque écran ; les maquettes sont dans le dépôt.
**Commit** : `docs(design): wireframes and mockups for mobile and web` · étiquette `sprint-1`

---

## Sprint 2 — Serveur sécurisé et API v1

**Objectif** : sécuriser le serveur et l'amener à l'API décrite dans [API.md](API.md), en gardant son architecture classique ([ARCHITECTURE.md](ARCHITECTURE.md)).
**Pourquoi** : tout le reste (mobile, web) s'appuie sur le serveur. Corriger ses défauts maintenant évite de les répercuter partout.

- [x] **Décision** : on garde les 5 régions et 4 cultures actuelles (ajout possible plus tard par le site web, sans code)
- [x] Ajout des fichiers `auth.*` dans `routes/`, `controllers/`, `services/` : **pas de réorganisation**, on garde le monolithe classique (ADR 0011). (`stats.*` arrive au Sprint 8.)
- [x] Routes sous **`/api/v1`** ; format d'erreur unique `{ error: { code, message } }`
- [x] `sync/push` : vérification du propriétaire (`deviceId`), réponse `accepted` / `rejected` note par note, limite de 200 notes
- [x] `sync/pull` : renvoie `serverTime` et les suppressions ; **`deletedAt`** sur les 4 tables de référence (migration Prisma)
- [x] Limitation de débit (`express-rate-limit`) et taille maximale (256 ko)
- [x] Table **`AdminUser`**, mot de passe haché (bcrypt), `POST /admin/auth/login`, `GET /admin/me`, script `npm run admin:create`
- [x] Script **`npm run export:seed`** qui écrit `mobile/src/data/seed.json` (utilisé au Sprint 3)
- [x] Format réel de `/meteo/:regionId` aligné avec API.md
- [x] **Identifiants stables** pour les données de départ (ajouté : sans cela le `seed.json` embarqué et la production divergeraient)
- [x] Vérification automatique complète sur une base jetable : **46 contrôles réussis**
- [x] **Vous** : réinitialisez votre base de développement (`npm run db:reset`) pour qu'elle reçoive les identifiants stables, puis relancez le serveur et ouvrez `/api/v1/health`
- [x] **Vous** : créez votre compte admin (`npm run admin:create`)

💡 *Ce que vous apprenez* : comment une route, un controller et un service coopèrent pour une seule demande ; qu'est-ce qu'une migration Prisma ; hachage de mot de passe (pourquoi on ne stocke jamais le mot de passe) ; JWT ; limitation de débit.

**Terminé quand** : chaque route d'API.md (section 1, 2 et auth) répond comme décrit ; un téléphone ne peut pas modifier la note d'un autre ; la base garde le mot de passe haché.
**Commit** : `feat(server): v1 API, secured sync and admin login` · étiquette `sprint-2`

---

## Sprint 3 — Socle mobile

**Objectif** : une application qui **démarre sans internet dès l'installation**, aux couleurs finales.
**Pourquoi** : c'est la contrainte n°1 du sujet. Les écrans des sprints suivants se construiront sur ce socle.

- [x] **Thème** : `theme/index.js` avec la palette finale ; composants communs (tuile, bouton, barre du haut avec Hiverina / Henoy, bandeau hors ligne)
- [x] **Migrations SQLite** avec `PRAGMA user_version`
- [x] **Données embarquées** : `seed.json` chargé au premier lancement
- [x] Écran **Choix de la région** au premier lancement (une question, gros boutons)
- [x] **Accueil** refait selon la maquette (4 bandes pleine largeur)
- [x] **Bandeau hors ligne** visible partout (avec gestion de l'encoche)
- [x] **Synchro au retour du réseau** (pas seulement au démarrage) ; passage de l'URL en `/api/v1`
- [x] Test sur l'iPhone **en mode avion** : bandeau visible, application fonctionnelle
- [ ] 📝 Justification : compatibilité, visibilité de l'état du système, guidage

💡 *Ce que vous apprenez* : pourquoi un thème central ; comment une migration SQLite protège les données des téléphones déjà installés ; ce que fait un « repository » ; détecter le réseau.

**Terminé quand** : après **désinstallation puis réinstallation** de l'application avec le **mode avion activé**, l'écran de choix de région affiche les régions, l'accueil s'ouvre, le bandeau « Tsy misy internet » apparaît.
**Commit** : `feat(mobile): offline-first foundation, theme, embedded data, region choice` · étiquette `sprint-3`

---

## Sprint 4 — Météo

**Objectif** : voir la météo des 5 prochains jours, même sans réseau.

- [x] `weatherRepository` (la table `weather_cache` existe déjà) et branchement de `api.weather()`
- [x] Écran **Météo** : aujourd'hui en grand, 4 jours suivants, pictogrammes (soleil, nuage, pluie, orage), températures
- [x] « Dernière mise à jour : … » quand les données viennent du cache ; message rassurant si aucune donnée
- [x] Bouton **Henoy** de l'écran (temporairement : texte parlé simulé, la voix arrive au Sprint 7)
- [ ] 📝 Justification : signifiance des pictogrammes, rétroaction, concision

💡 *Ce que vous apprenez* : stratégie « cache d'abord, réseau ensuite » ; états d'un écran (chargement, vide, erreur, à jour, périmé).

**Terminé quand** : météo affichée en ligne ; puis, en mode avion, **la même** météo réaffichée avec « dernière mise à jour ».
**Commit** : `feat(mobile): weather screen with offline cache` · étiquette `sprint-4`

---

## Sprint 5 — Journal de culture

**Objectif** : noter plantation, pluie, parasite, récolte en 3 touches.

- [x] Sélecteur de culture **par image**
- [x] Saisie : type → culture → date (aujourd'hui par défaut), un seul choix par étape
- [x] Grosse coche + « Voatahiry » (message et vibration)
- [x] Liste des notes (les plus récentes d'abord)
- [x] **Annuler / supprimer** avec confirmation (rouge seulement pour la suppression)
- [x] Vérification de bout en bout : noter en mode avion → réseau → la note arrive **sur le serveur, une seule fois**
- [ ] 📝 Justification : reconnaissance plutôt que rappel, protection contre les erreurs

💡 *Ce que vous apprenez* : `synced`, suppression douce, pourquoi un envoi répété ne crée pas de doublon.

**Terminé quand** : une note créée en mode avion apparaît dans la base du serveur (Prisma Studio) après retour du réseau, sans doublon.
**Commit** : `feat(mobile): observation journal with sync` · étiquette `sprint-5`

---

## Sprint 6 — Alertes de semis et de récolte

**Objectif** : l'application prévient le paysan au bon moment, même sans internet.

- [x] **Décision** : on code avec les **exemples** (cohérents avec la saison des pluies) ; la validation par un technicien agricole se fera plus tard. **Ne pas donner l'application à de vrais paysans avant.**
- [x] **Moteur d'alertes** : fonction pure `mobile/src/domain/alertEngine.js` (calendrier + date + météo → alertes). Toutes les cultures de la région comptent : le choix de « cultures suivies » n'existe pas encore.
- [x] **9 tests** du moteur : `cd mobile && node --test src/domain/alertEngine.test.js`
- [x] Écran **Alertes** (icône du geste, 1–2 mots, date ; rouge seulement pour l'orage)
- [x] **Notifications locales** programmées sur le téléphone (07:00)
- [x] Alerte « orage annoncé » à partir de la dernière météo reçue
- [ ] 📝 Justification : signifiance, flexibilité, gestion des erreurs

💡 *Ce que vous apprenez* : pourquoi une logique « pure » (sans écran, sans base) se teste facilement ; notifications locales vs notifications push.

**Terminé quand** : tests du moteur verts ; une notification de semis arrive en mode avion pour une culture dont la période commence.
**Commit** : `feat(mobile): alert engine, alerts screen, local notifications` · étiquette `sprint-6`

---

## Sprint 7 — Conseils et voix malagasy

**Objectif** : la version vocale demandée par le sujet.

- [ ] **Décision** : qui enregistre les voix ?
- [ ] Enregistrement des messages (Audacity), format mp3 léger
- [ ] Audios **embarqués** dans l'application pour le premier lancement + fichier de correspondance
- [ ] Écran **Conseils** : cartes avec photo, lecteur lecture / pause énorme
- [ ] Bouton **Henoy** fonctionnel sur **chaque écran** (message clé de l'écran)
- [ ] Remplacement des conseils d'exemple par des conseils **validés**
- [ ] 📝 Justification : flexibilité (texte ou voix), accessibilité

💡 *Ce que vous apprenez* : lecture audio avec `expo-audio` ; pourquoi on embarque les audios.

**Terminé quand** : chaque écran peut être « lu » à voix haute, sans internet.
**Commit** : `feat(mobile): advice screen and Malagasy voice` · étiquette `sprint-7`

---

## Sprint 8 — Site web d'administration

**Objectif** : permettre à un agronome de mettre à jour les données sans toucher au code.
**Pourquoi** : sans cela, chaque correction de calendrier demande de modifier le code et de republier.

- [ ] Création de `web/` (React + Vite), thème CSS aux couleurs de la palette
- [ ] Routes serveur `/admin/...` : CRUD cultures, régions, calendriers, conseils ; envoi d'audio ; `/admin/stats`
- [ ] Pages : Connexion · Tableau de bord · Calendriers · Conseils
- [ ] Vérification de bout en bout : modifier un calendrier sur le web → le téléphone le reçoit à la synchro
- [ ] 📝 Capture d'écran pour le rapport

💡 *Ce que vous apprenez* : React côté web, protéger des routes avec un jeton, envoyer un fichier (`multipart`).

**Terminé quand** : une modification faite sur le web apparaît sur le téléphone après synchro ; sans connexion, aucune page admin n'est accessible.
**Commit** : `feat(web): admin dashboard with calendars and advice management` · étiquette `sprint-8`

---

## Sprint 9 — Ergonomie, tests utilisateurs, Android

**Objectif** : vérifier que de **vrais utilisateurs** comprennent.

- [ ] Remplacement des emojis par de **vrais pictogrammes** (licences notées)
- [ ] Contrôle des contrastes, tailles de texte, zones tactiles ≥ 48 px
- [ ] **Test avec 3 à 5 personnes** du public cible : « montrez-moi comment voir la météo »
- [ ] Corrections issues des tests
- [ ] Relecture du malagasy par un second locuteur
- [ ] Test sur un **téléphone Android basique** (ou émulateur)
- [ ] 📝 Compte rendu des tests (très valorisé dans un projet d'IHM)

**Terminé quand** : au moins 4 personnes sur 5 réussissent seules les 3 tâches principales.
**Commit** : `fix(ux): usability test fixes and real pictograms` · étiquette `sprint-9`

---

## Sprint 10 — Mise en ligne et rapport

**Objectif** : livrer. Détails des hébergements gratuits : [HEBERGEMENT.md](HEBERGEMENT.md).

- [ ] **Décision** : hébergement final
- [ ] PostgreSQL (Neon) : passage du `provider`, `prisma migrate deploy`, **test complet sur PostgreSQL**
- [ ] Serveur en ligne (Render), site admin en ligne (Netlify / Cloudflare Pages), CORS restreint
- [ ] Application Android installable (**EAS Build**) pointant vers le serveur en ligne ; délai d'attente de synchro adapté au réveil du serveur
- [ ] Calendriers et conseils **validés**
- [ ] 📝 **Rapport de conception final** : besoin, contexte, personas, scénarios, wireframes, captures, 7 critères, résultats des tests
- [ ] Courte démonstration (vidéo ou présentation)

**Terminé quand** : l'application s'installe sur un téléphone Android, fonctionne hors ligne et se synchronise avec le serveur en ligne ; le rapport est complet.
**Commit** : `chore(release): production deployment and final report` · étiquette `v1.0.0`

---

## Décisions qui vous reviennent

| Décision | Avant le sprint |
|---|---|
| La partie web (back-office) est-elle bien voulue ? | 1 |
| Combien de régions et de cultures au lancement ? | 2 |
| Qui valide les calendriers agricoles et les conseils ? | 6 |
| Qui enregistre les voix malagasy ? | 7 |
| Hébergement final, budget | 10 |
