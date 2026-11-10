# API de Tantsaha Connect (version 1)

Une **API** est la liste des « demandes » que le serveur sait traiter. Chaque ligne ci-dessous = une demande possible.
Adresse de base : `http://localhost:3000/api/v1` (en production : l'adresse de l'hébergeur).

> **État (fin du Sprint 2)** : tout ce qui est décrit aux sections 1 et 2, ainsi que `POST /admin/auth/login` et `GET /admin/me`, **existe et a été vérifié** (46 contrôles automatiques). Les routes marquées 🆕 (gestion du référentiel, audio, statistiques) arrivent au **Sprint 8**.
>
> **Identifiants** : ce sont des **textes**, pas des nombres. Les données de départ ont des identifiants stables et lisibles (`reg_analamanga`, `crop_vary`, `cal_vary_boeny`, `adv_pest_general`) ; les éléments créés plus tard depuis le site web auront des identifiants générés (`cuid`).

## Conventions

| Sujet | Règle |
|---|---|
| Format | JSON dans les deux sens |
| Noms | `camelCase` dans le JSON (`nameMg`, `cropId`) |
| Dates | Texte ISO 8601 en UTC : `2026-11-03T08:00:00.000Z` ; une date seule pour `observedOn` : `2026-11-03` |
| Versions | `/v1` dans l'adresse. **Pourquoi** : les téléphones installés ne se mettent pas tous à jour ; une future v2 pourra coexister avec la v1. |
| Authentification | Aucune pour l'API **publique** (mobile). Jeton `Authorization: Bearer <jeton>` pour `/admin/*` |
| Format d'erreur | Toujours `{ "error": { "code": "TEXTE_STABLE", "message": "Explication" } }` |

### Codes de réponse

| Code | Sens |
|---|---|
| 200 / 201 | Réussi / créé |
| 400 | Demande mal formée : JSON cassé, champ manquant, trop de notes (`VALIDATION_ERROR`) |
| 401 | Pas connecté (`UNAUTHORIZED`) |
| 403 | Connecté mais pas le droit (`FORBIDDEN`) |
| 404 | Introuvable (`NOT_FOUND`) |
| 409 | Conflit (`CONFLICT`) — réservé au site web (Sprint 8) ; pour la synchro, un conflit n'est pas une erreur : la note est listée dans `rejected` |
| 413 | Corps de la demande trop gros, plus de 256 ko (`PAYLOAD_TOO_LARGE`) |
| 429 | Trop de demandes : plus de 120 par minute, ou plus de 5 essais de connexion par minute (`RATE_LIMITED`) |
| 500 | Erreur imprévue du serveur (`INTERNAL_ERROR`), sans détail technique montré |
| 503 | Météo injoignable **et** aucun cache (`UPSTREAM_ERROR`) |

---

## 1. Santé

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/health` | Le serveur est-il vivant ? → `{ "status": "ok", "time": "..." }` |

## 2. API publique (utilisée par le téléphone)

### Référentiel — `referential.*`

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/regions` | Liste des régions |
| GET | `/cultures` | Liste des cultures |
| GET | `/calendrier?regionId=` | Calendriers semis/récolte (filtrable) |
| GET | `/conseils?cropId=&topic=` | Conseils (filtrables par culture et par thème, ex. `topic=PEST`) |

Utile pour le site web, les tests et le débogage. **Le téléphone, lui, utilise `/sync/pull`** (une seule demande au lieu de quatre).

### Météo — `weather.*`

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/meteo/:regionId` | Prévisions sur 5 jours |

Réponse :

```json
{
  "regionId": "reg_analamanga",
  "fetchedAt": "2026-11-03T06:00:00.000Z",
  "stale": false,
  "days": [
    { "date": "2026-11-03", "icon": "RAIN", "tempMin": 16, "tempMax": 24, "rainMm": 7.5, "rainChance": 80 }
  ]
}
```

- `icon` ∈ `SUN | CLOUD | RAIN | STORM`.
- `stale: true` = Open-Meteo injoignable, on renvoie la dernière météo connue ; le téléphone affiche « dernière mise à jour ».
- Le serveur ne rappelle Open-Meteo que si le cache a plus de `WEATHER_CACHE_MINUTES` minutes.

### Synchronisation — `sync.*`

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/sync/pull?since=<date ISO>` | Données de référence modifiées depuis `since` |
| POST | `/sync/push` | Envoi des notes du téléphone |

**Pull** — réponse :

```json
{
  "serverTime": "2026-11-03T08:00:00.000Z",
  "regions":   [ { "id": "reg_analamanga", "code": "ANALAMANGA", "nameMg": "Analamanga", "latitude": -18.9, "longitude": 47.5, "deletedAt": null } ],
  "crops":     [ ],
  "calendars": [ ],
  "advices":   [ ]
}
```

- Sans `since` (toute première synchro) : tout est renvoyé, **sauf** ce qui est déjà supprimé (le téléphone ne l'a jamais eu).
- Avec `since` : tout ce qui a changé depuis, **y compris les suppressions** (`deletedAt` non nul) : le téléphone les retire.
- Le téléphone enregistre `serverTime` comme nouveau `last_pull` (et non l'heure de son propre téléphone, souvent fausse). Le serveur note cette heure **avant** de lire la base : un changement survenu pendant la lecture n'est jamais perdu.
- `since` invalide → 400.

**Push** — demande :

```json
{
  "deviceId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "regionId": "reg_analamanga",
  "observations": [
    {
      "id": "0b8e4f6a-....",
      "cropId": "crop_vary",
      "type": "RAIN",
      "observedOn": "2026-11-03",
      "value": null,
      "note": null,
      "createdAt": "2026-11-03T07:50:00.000Z",
      "updatedAt": "2026-11-03T07:50:00.000Z",
      "deletedAt": null
    }
  ]
}
```

Réponse :

```json
{
  "serverTime": "2026-11-03T08:00:00.000Z",
  "accepted": ["0b8e4f6a-...."],
  "rejected": [ { "id": "....", "reason": "OWNED_BY_OTHER_DEVICE" } ]
}
```

Règles :

- Le serveur crée l'appareil s'il est inconnu. `regionId` est facultatif ; il n'est gardé que s'il existe.
- **Chaque note est jugée séparément** : une mauvaise note ne bloque pas les autres (sinon un seul enregistrement défectueux empêcherait pour toujours le téléphone de se synchroniser).
- **Renvoyer la même note ne crée pas de doublon** (c'est une mise à jour).
- Si le serveur a une version plus récente (`updatedAt`), il garde la sienne mais liste quand même la note dans `accepted`, pour que le téléphone arrête de la renvoyer.
- Une note appartient à **un seul téléphone** : un autre téléphone qui l'envoie reçoit `OWNED_BY_OTHER_DEVICE`.
- Une date de plus d'un jour dans le futur (horloge fausse) est ramenée à l'heure du serveur.
- Maximum **200 notes** par envoi (sinon 400), corps maximum **256 ko** (sinon 413). `deviceId` : 8 à 64 caractères.

Raisons possibles dans `rejected` : `INVALID_ID`, `INVALID_TYPE`, `INVALID_DATE`, `INVALID_VALUE`, `INVALID_NOTE`, `UNKNOWN_CROP`, `OWNED_BY_OTHER_DEVICE`. Ces refus sont **définitifs** : renvoyer la même note donnerait le même résultat.

---

## 3. API d'administration (utilisée par le site web)

Toutes les routes exigent `Authorization: Bearer <jeton>`, sauf la connexion. Les rôles : `ADMIN` (tout) et `AGRONOME` (données agricoles, pas les comptes). Le jeton est valable `JWT_EXPIRES_IN` (8 h par défaut).

Les comptes se créent en ligne de commande : `npm run admin:create` (pas d'inscription publique).

### Authentification — `auth.*`

| Méthode | Route | Rôle |
|---|---|---|
| POST | `/admin/auth/login` | `{ email, password }` → `{ token, user: { email, role }, expiresIn }`. Erreur : 401 avec le **même message** que l'e-mail ou le mot de passe soit faux. |
| GET | `/admin/me` | Qui suis-je ? (vérifie le jeton) → `{ email, role }` |

Limitation : **5 essais de connexion par minute** et par adresse (6ᵉ → 429).

### Gestion du référentiel — `admin.*` (Sprint 8, **existe** sauf l'audio)

Rôles `ADMIN` et `AGRONOME`. Validation : champs obligatoires, mois de 1 à 12, latitude/longitude plausibles. Erreurs : 400 (champ invalide), 404 (introuvable), 409 (doublon de code ou de couple culture + région). Suppression douce (`204`).

| Méthode | Route | Rôle |
|---|---|---|
| GET / POST | `/admin/regions` | Lister / créer |
| PUT / DELETE | `/admin/regions/:id` | Modifier / supprimer (douce) |
| GET / POST | `/admin/cultures` | idem |
| PUT / DELETE | `/admin/cultures/:id` | idem |
| GET / POST | `/admin/calendrier` | idem |
| PUT / DELETE | `/admin/calendrier/:id` | idem |
| GET / POST | `/admin/conseils` | idem |
| PUT / DELETE | `/admin/conseils/:id` | idem |
| POST | `/admin/conseils/:id/audio` | 🆕 **pas encore fait** — envoi du fichier audio (`multipart/form-data`, champ `file`, mp3, 2 Mo max) |

À venir : les audios seront servis à `/media/audio/<fichier>` et le téléphone les téléchargera à la synchro pour les écouter hors ligne.

### Statistiques — `stats.*`

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/admin/stats/summary` | Téléphones actifs (7 jours), notes cette semaine, notes par type, totaux du référentiel |
| GET | `/admin/stats/observations?regionId=&type=&from=&to=` | 🆕 pas fait (le résumé suffit pour l'instant) |

Les statistiques sont **anonymes** : jamais de `deviceId` dans les réponses.

---

## 4. Correspondance écrans ↔ API

| Écran mobile | API utilisée (si réseau) |
|---|---|
| Choix de la région | — (données embarquées) puis `sync/pull` |
| Météo | `meteo/:regionId` |
| Journal | `sync/push` |
| Alertes | — (calculées sur le téléphone avec le calendrier) |
| Conseils | `sync/pull` (+ téléchargement des audios) |

| Page web | API |
|---|---|
| Connexion | `admin/auth/login` |
| Tableau de bord | `admin/stats/*` |
| Calendriers / Conseils / Cultures | `admin/calendrier`, `admin/conseils`, `admin/cultures` |
