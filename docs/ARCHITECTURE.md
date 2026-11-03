# Architecture de Tantsaha Connect

Ce document explique **comment le projet est organisé** et **pourquoi**. Il est écrit pour un débutant.
Les décisions sont justifiées en détail dans les [ADR](adr/README.md). L'API est décrite dans [API.md](API.md).

> Les schémas ci-dessous sont en **Mermaid** : GitHub les dessine automatiquement dans l'aperçu du fichier.

---

## 1. Monolithe, monolithe modulaire ou microservices ?

| | **Monolithe classique** ✅ | Monolithe modulaire | Microservices |
|---|---|---|---|
| **Définition** | Un seul programme, code rangé *par type* (`routes/`, `controllers/`, `services/`) | Un seul programme, code rangé *par sujet* (`weather/`, `sync/`…), chaque sujet bien isolé | Plusieurs petits programmes qui se parlent par le réseau |
| **Déploiement** | 1 serveur | 1 serveur | N serveurs à surveiller |
| **Complexité** | Faible | Faible à moyenne | Très élevée |
| **Coût d'hébergement** | Minimal | Minimal | Élevé |
| **Pour un développeur seul** | **Choisi** : le plus simple, le plus répandu | Mieux quand les sujets se multiplient ; réservé à un futur projet | Inadapté |

### Décision : **monolithe classique** (voir [ADR 0011](adr/0011-monolithe-classique-par-type.md))

1. **Un seul serveur à héberger et à surveiller** : indispensable en solo, avec un hébergement gratuit.
2. **Peu de concepts à apprendre** pour un premier projet : c'est la disposition des tutoriels, donc facile à comprendre et à dépanner.
3. Les microservices répondent à des problèmes d'**équipes nombreuses** et de **très forte charge**. Nous n'avons ni l'un ni l'autre.
4. Si le serveur devient confus, passer au monolithe modulaire plus tard revient à **déplacer les mêmes fichiers** dans un dossier par sujet. Rien n'est perdu.

> Choix initial : le monolithe modulaire avait été proposé ([ADR 0002](adr/0002-monolithe-modulaire.md)), puis remplacé à la demande du porteur du projet.

---

## 2. Vue d'ensemble

```mermaid
flowchart LR
  subgraph Phone["📱 Téléphone du paysan — mobile/ (React Native + Expo)"]
    UI["Écrans"] --> Repo["Repositories"] --> SQ[("SQLite locale")]
    Sync["Service de synchro"] --> Repo
  end

  subgraph Web["💻 Site admin — web/ (React + Vite)"]
    AdminUI["Pages admin"]
  end

  subgraph Server["🖥️ Serveur — server/ (Node + Express) — UN seul programme"]
    direction TB
    R["routes"] --> C["controllers"] --> S["services"]
  end

  DB[("PostgreSQL\n(SQLite en dev)")]
  OM["Open-Meteo\n(météo gratuite)"]

  Sync <-- "HTTPS, de temps en temps" --> R
  AdminUI -- "HTTPS + jeton (Sprint 8)" --> R
  S --> DB
  S --> OM
```

**Idée centrale : « d'abord le téléphone » (*offline-first*).** L'application lit et écrit **toujours dans la base du téléphone**. Elle ne dépend jamais d'internet pour fonctionner. Quand le réseau est là, elle se synchronise en arrière-plan. Conséquence très utile : **si le serveur gratuit est endormi ou en panne, le paysan ne s'en aperçoit pas.**

---

## 3. Le serveur : rangé par type de fichier

### Structure

```
server/src/
├── routes/          index.js — la liste des adresses de l'API
├── controllers/     <sujet>.controller.js — lisent la demande, appellent un service
├── services/        <sujet>.service.js — la logique et l'accès à la base (Prisma)
├── middlewares/     errorHandler, requireAdmin (Sprint 2), limitation de débit
├── db/prisma.js     Connexion unique à la base
├── config/env.js    Lecture du .env
├── utils/           AppError.js et petits outils
├── app.js           Assemble Express
└── server.js        Démarre le serveur
```

Les « sujets » actuels et à venir : `referential` (régions, cultures, calendriers, conseils), `weather`, `sync`, puis `auth` (connexion admin) et `stats` (tableau de bord) aux Sprints 2 et 8.

### Les règles (à ne pas casser)

1. **`route → controller → service → Prisma`.** Le controller tient en une ligne, sans logique. **Prisma n'est importé que dans les services.**
2. **Nommage** : fichiers en **anglais**, forme `<sujet>.<rôle>.js` (`weather.controller.js`, `weather.service.js`). Les adresses de l'API restent en français (`/meteo`).
3. **Un service peut en appeler un autre** (ex. `sync.service` utilise `referential.service`), jamais l'inverse vers un controller.
4. **Format d'erreur unique** pour toute l'API (voir API.md).

*Analogie* : un restaurant. La salle (routes), les serveurs (controllers) et la cuisine (services) sont rangés ensemble par fonction : pour la météo, on passe dans les trois pièces.

---

## 4. L'application mobile

```
mobile/src/
├── screens/        Écrans (aucun SQL)
├── components/     Tuile, bouton « Henoy », bandeau hors ligne, sélecteur par image…
├── navigation/     Passage d'un écran à l'autre
├── db/             database.js (+ migrations) et *Repository.js : SEUL endroit avec du SQL
├── services/       api.js (SEUL endroit avec fetch), syncService, notifications, audio
├── domain/         Logique pure testable : moteur d'alertes, pictogrammes météo
├── data/           seed.json embarqué (régions, cultures, calendriers, conseils)
├── theme/          Couleurs (palette), tailles
└── i18n/           Tous les textes malagasy (mg.js)
```

`domain/` est nouveau : le **moteur d'alertes** (calendrier + date → « il faut semer ») est la logique la plus délicate du projet ; on la met dans une fonction pure, séparée de l'écran, pour pouvoir la tester.

Le **site web** (`web/`) est une application React séparée (Vite). Elle ne parle qu'à l'API `/api/v1/admin/*` et suit la même charte graphique.

---

## 5. Base de données

### 5.1 Pourquoi deux bases ?

| | Téléphone | Serveur |
|---|---|---|
| Technologie | SQLite (`expo-sqlite`) | SQLite en développement, **PostgreSQL** en production (via Prisma) |
| Rôle | Fonctionner sans internet | Centraliser, sauvegarder, servir le site admin |
| Contient | Notes du paysan, copie des références, dernière météo | Toutes les notes (anonymes), références officielles, cache météo, comptes admin |

**Pourquoi PostgreSQL en production et pas MySQL ou MongoDB ?** Les données sont **liées entre elles** (une note → une culture → une région) : une base *relationnelle* convient. PostgreSQL est gratuit, très répandu, bien supporté par Prisma, et proposé gratuitement par plusieurs hébergeurs. Voir [ADR 0004](adr/0004-express-prisma-postgresql.md).

### 5.2 Schéma du serveur

```mermaid
erDiagram
  Region ||--o{ CropCalendar : "a"
  Crop   ||--o{ CropCalendar : "a"
  Crop   ||--o{ Advice : "concerne (facultatif)"
  Region ||--o{ Device : "choisie par"
  Region ||--|| WeatherCache : "a une météo"
  Device ||--o{ Observation : "note"
  Crop   ||--o{ Observation : "concerne (facultatif)"

  Region {
    int id PK
    string code UK
    string nameMg
    float latitude
    float longitude
    datetime updatedAt
    datetime deletedAt "à ajouter"
  }
  Crop {
    int id PK
    string code UK
    string nameMg
    string icon
    datetime updatedAt
    datetime deletedAt "à ajouter"
  }
  CropCalendar {
    int id PK
    int cropId FK
    int regionId FK
    int sowStartMonth
    int sowEndMonth
    int harvestStartMonth
    int harvestEndMonth
    datetime updatedAt
    datetime deletedAt "à ajouter"
  }
  Advice {
    int id PK
    string code UK
    int cropId FK "facultatif"
    string topic
    string titleMg
    string textMg
    string audioFile "facultatif"
    datetime updatedAt
    datetime deletedAt "à ajouter"
  }
  Device {
    string id PK "UUID créé par le téléphone"
    int regionId FK
    datetime createdAt
    datetime lastSeenAt
  }
  Observation {
    string id PK "UUID créé par le téléphone"
    string deviceId FK
    int cropId FK "facultatif"
    string type "RAIN, PEST, PLANTING, HARVEST"
    date observedOn
    float value "facultatif"
    string note "facultatif"
    datetime createdAt
    datetime updatedAt
    datetime deletedAt "suppression douce"
  }
  WeatherCache {
    int regionId PK
    string data "JSON texte"
    datetime fetchedAt
  }
  AdminUser {
    int id PK
    string email UK
    string passwordHash "jamais le mot de passe en clair"
    string role "ADMIN, AGRONOME"
    datetime createdAt
  }
```

- `AdminUser` est **nouveau** (fichiers `auth.*`). Le mot de passe est transformé par `bcrypt` : même la personne qui lit la base ne peut pas le retrouver.
- `deletedAt` est à **ajouter** aux 4 tables de référence : sinon, quand un admin supprime un conseil, les téléphones qui l'ont déjà ne le sauront jamais.
- Pas de `enum` ni de type `Json` Prisma : incompatibles avec SQLite. `type` et `data` sont des textes ; on passera à de vrais types PostgreSQL plus tard si utile.
- **Aucune donnée personnelle** (nom, numéro) n'est collectée : un `Device` n'est qu'un identifiant aléatoire.

### 5.3 Schéma du téléphone (SQLite)

Mêmes tables de référence (`regions`, `crops`, `calendars`, `advices`) en `snake_case`, plus :

| Table | Rôle |
|---|---|
| `meta` | Petits réglages : `device_id`, `region_id`, `last_pull` |
| `observations` | Comme le serveur + colonne **`synced`** (0 = pas encore envoyée) |
| `weather_cache` | Dernière météo reçue, par région |

Versionnée avec `PRAGMA user_version` (voir §7).

---

## 6. Synchronisation

| Étape | Ce qui se passe |
|---|---|
| **Push** | Le téléphone envoie ses observations `synced = 0`. Le serveur répond avec la liste des `id` acceptés ; le téléphone les marque `synced = 1`. |
| **Pull** | Le téléphone demande « donne-moi ce qui a changé depuis `last_pull` » et enregistre la réponse, y compris les éléments `deletedAt`. |
| **Quand** | Au démarrage **et** au retour du réseau (Sprint 3). Toujours en silence, jamais bloquant. |

Quatre astuces :
1. **UUID créé par le téléphone** → on peut noter sans internet, un renvoi ne crée pas de doublon.
2. **Suppression douce** (`deletedAt`) → le serveur et les autres téléphones apprennent les suppressions.
3. **Conflit** → la version la plus récente (`updatedAt`) gagne.
4. **Propriétaire** → le serveur refuse qu'un appareil modifie la note d'un autre (`deviceId` doit correspondre).

Limite connue : `pull` ne renvoie **pas** les notes → pas de restauration après réinstallation (priorité *Could*, M12).

---

## 7. Premier lancement hors ligne et évolution de la base

- **Données embarquées** : un fichier `mobile/src/data/seed.json`, généré depuis le serveur (`npm run export:seed`), est chargé dans SQLite au tout premier lancement. L'application est donc **utile avant la première synchro**.
- **Migrations SQLite** : `PRAGMA user_version` contient le numéro de version du schéma. Au démarrage, l'application exécute les migrations manquantes dans l'ordre. Ainsi, quand on ajoutera une colonne, les téléphones déjà installés seront mis à jour sans perdre les notes.

---

## 8. Sécurité (adaptée à ce projet)

| Sujet | Mesure |
|---|---|
| Paysans | Pas de compte, pas de donnée personnelle |
| Admin web | E-mail + mot de passe (bcrypt), jeton JWT à durée limitée, rôle `ADMIN` / `AGRONOME` |
| API publique | Limitation de débit (`express-rate-limit`), taille maximale des envois, validation des entrées |
| Secrets | Uniquement dans `.env` (jamais sur GitHub) |
| Transport | HTTPS en production (fourni par l'hébergeur) |
| CORS | En production, seul le domaine du site admin est autorisé |

---

## 9. Écart entre l'état actuel et la cible

| Aujourd'hui | Cible | Sprint |
|---|---|---|
| Fichiers nommés `meteo.*` / `referentiel.*` / `weather.*` (mélange français-anglais) | Tout en anglais : `weather.*`, `referential.*` (fait) | 0 |
| URL `/api/...` | `/api/v1/...` | 2 |
| Pas de contrôle du propriétaire d'une note | `deviceId` vérifié | 2 |
| Pas de `deletedAt` sur les références | Ajouté | 2 |
| Pas d'`AdminUser`, ni de login | Fichiers `auth.*` (route, controller, service) | 2 |
| SQLite mobile sans migrations | `PRAGMA user_version` | 3 |
| Application vide au 1ᵉʳ lancement hors ligne | `seed.json` embarqué | 3 |
| Synchro au démarrage seulement | + au retour du réseau | 3 |
| Pas de `web/` | Site admin React | 8 |
| Un dépôt Git imbriqué dans `mobile/` | Un seul dépôt à la racine | 0 |
