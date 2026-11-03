# API de Tantsaha Connect (version 1)

Une **API** est la liste des « demandes » que le serveur sait traiter. Chaque ligne ci-dessous = une demande possible.
Adresse de base : `http://localhost:3000/api/v1` (en production : l'adresse de l'hébergeur).

> **État** : ce document décrit la **cible**. Les routes marquées 🆕 n'existent pas encore ; les autres existent sous `/api/...` (sans `v1`) et seront déplacées au Sprint 2.

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
| 400 | Demande mal formée (`VALIDATION_ERROR`) |
| 401 | Pas connecté (`UNAUTHORIZED`) |
| 403 | Connecté mais pas le droit (`FORBIDDEN`) |
| 404 | Introuvable (`NOT_FOUND`) |
| 409 | Conflit, ex. note appartenant à un autre appareil (`CONFLICT`) |
| 429 | Trop de demandes (`RATE_LIMITED`) |
| 502 | Météo injoignable **et** aucun cache (`UPSTREAM_ERROR`) |

---

## 1. Santé

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/health` | Le serveur est-il vivant ? → `{ "status": "ok", "time": "..." }` |

## 2. API publique (utilisée par le téléphone)

### Référentiel — module `referential`

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/regions` | Liste des régions |
| GET | `/cultures` | Liste des cultures |
| GET | `/calendrier?regionId=` | Calendriers semis/récolte (filtrable) |
| GET | `/conseils?cultureId=` | Conseils (filtrables) |

Utile pour le site web, les tests et le débogage. **Le téléphone, lui, utilise `/sync/pull`** (une seule demande au lieu de quatre).

### Météo — module `weather`

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/meteo/:regionId` | Prévisions sur 5 jours |

Réponse :

```json
{
  "regionId": 1,
  "fetchedAt": "2026-11-03T06:00:00.000Z",
  "stale": false,
  "days": [
    { "date": "2026-11-03", "icon": "RAIN", "tempMin": 16, "tempMax": 24, "rainMm": 7.5 }
  ]
}
```

- `icon` ∈ `SUN | CLOUD | RAIN | STORM`.
- `stale: true` = Open-Meteo injoignable, on renvoie la dernière météo connue ; le téléphone affiche « dernière mise à jour ».
- Le serveur ne rappelle Open-Meteo que si le cache a plus de `WEATHER_CACHE_MINUTES` minutes.

### Synchronisation — module `sync`

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/sync/pull?since=<date ISO>` | Données de référence modifiées depuis `since` |
| POST | `/sync/push` | Envoi des notes du téléphone |

**Pull** — réponse :

```json
{
  "serverTime": "2026-11-03T08:00:00.000Z",
  "regions":   [ { "id": 1, "code": "ANALAMANGA", "nameMg": "Analamanga", "latitude": -18.9, "longitude": 47.5, "deletedAt": null } ],
  "crops":     [ ],
  "calendars": [ ],
  "advices":   [ ]
}
```

- Sans `since` : tout est renvoyé.
- Les éléments supprimés arrivent avec `deletedAt` non nul : le téléphone les retire.
- Le téléphone enregistre `serverTime` comme nouveau `last_pull` (et non l'heure de son propre téléphone, souvent fausse).

**Push** — demande :

```json
{
  "deviceId": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "regionId": 1,
  "observations": [
    {
      "id": "0b8e4f6a-....",
      "cropId": 2,
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

Règles : le serveur crée l'appareil s'il est inconnu ; **renvoyer la même note ne crée pas de doublon** (c'est une mise à jour) ; si le serveur a une version plus récente (`updatedAt`), la sienne est gardée mais la note est quand même listée dans `accepted` pour que le téléphone arrête de la renvoyer ; limite de 200 notes par envoi.

---

## 3. API d'administration 🆕 (utilisée par le site web)

Toutes les routes exigent `Authorization: Bearer <jeton>`. Les rôles : `ADMIN` (tout) et `AGRONOME` (données agricoles, pas les comptes).

### Authentification — module `auth`

| Méthode | Route | Rôle |
|---|---|---|
| POST | `/admin/auth/login` | `{ email, password }` → `{ token, user: { email, role }, expiresIn }` |
| GET | `/admin/me` | Qui suis-je ? (vérifie le jeton) |

Limitation stricte des essais de connexion (ex. 5 par minute) pour décourager les devinettes de mot de passe.

### Gestion du référentiel — module `referential`

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
| POST | `/admin/conseils/:id/audio` | Envoi du fichier audio (`multipart/form-data`, champ `file`, mp3, 2 Mo max) |

Les audios sont servis à l'adresse `/media/audio/<fichier>`. Le téléphone les télécharge à la synchro pour les écouter ensuite hors ligne.

### Statistiques — module `stats`

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/admin/stats/summary` | Téléphones actifs (7 jours), notes cette semaine |
| GET | `/admin/stats/observations?regionId=&type=&from=&to=` | Comptages par région / type / semaine |

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
