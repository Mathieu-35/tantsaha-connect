# Charte de design — Tantsaha Connect

Ce document fixe **les couleurs, les tailles et l'esprit visuel** du mobile et du web. Les maquettes sont produites au Sprint 1 à partir de ce document.

## 1. Palette

Palette choisie : `#2A7C13` · `#76C457` · `#FFF8CF` · `#FBE6C2`. Elle évoque la végétation et la terre, et reste chaude et lisible.

| Rôle | Nom | Valeur | Utilisation |
|---|---|---|---|
| **Primaire** | Vert profond | `#2A7C13` | Boutons, barre du haut, titres, icônes principales, liens |
| **Primaire — appui** | Vert très profond | `#1E5A0E` | Bouton pendant qu'on appuie |
| **Accent doux** | Vert clair | `#76C457` | Fonds de pictogrammes, éléments sélectionnés, barres de progression, illustrations |
| **Fond d'écran** | Crème | `#FFF8CF` | Arrière-plan de tous les écrans |
| **Surface** | Beige | `#FBE6C2` | Cartes, tuiles, zones de saisie |
| **Texte** | Vert-noir | `#1F2A17` | Tout le texte courant |
| **Sur primaire** | Blanc | `#FFFFFF` | Texte et icônes posés sur le vert profond |
| **Danger** | Rouge | `#C62828` | **Uniquement** : danger, alerte grave, suppression. Rien d'autre. |

Le rouge, le texte vert-noir et le blanc **ne font pas partie de votre palette** : ils sont nécessaires (contrainte C4 du cahier : rouge = danger ; texte lisible). Voir [ADR 0008](adr/0008-palette-et-rouge-danger.md).

### Contrastes mesurés (règle WCAG : texte ≥ 4,5:1 ; grands textes et éléments graphiques ≥ 3:1)

| Texte / élément | Sur fond | Ratio | Verdict |
|---|---|---|---|
| Blanc | Vert profond `#2A7C13` | 5,26 | ✅ |
| Texte `#1F2A17` | Vert clair `#76C457` | 6,99 | ✅ |
| Texte `#1F2A17` | Crème | 13,97 | ✅ |
| Texte `#1F2A17` | Beige | 12,27 | ✅ |
| Vert profond | Crème | 4,91 | ✅ |
| Vert profond | Beige | 4,31 | ⚠️ seulement pour du **gros texte ou du gras** (≥ 18 px) |
| Rouge `#C62828` | Crème | 5,24 | ✅ |
| Blanc | Rouge | 5,62 | ✅ |
| Blanc | Vert clair | **2,14** | ❌ **interdit** |
| Vert clair | Crème | **2,00** | ❌ **jamais seul** : un élément vert clair sur crème a toujours un contour vert profond de 2 px |

**Conséquence pratique** : le vert clair sert de remplissage, jamais de texte. Un bouton principal = fond vert profond + texte blanc.

## 2. Règles de couleur (traduction de la contrainte C4)

| Sens | Couleur | Toujours accompagné de |
|---|---|---|
| Valider, réussi, « ok » | Vert profond | ✓ |
| Information, élément sélectionné | Vert clair + contour vert profond | — |
| À venir (alerte douce : « bientôt semer ») | Beige + icône | icône du geste (graine, faucille) |
| **Danger / interdit / suppression** | **Rouge** | ⚠️ ou ✕ |

Ne **jamais** compter sur la couleur seule : chaque état a aussi une **icône** et une **voix** (environ 8 % des hommes sont daltoniens, et les écrans sont mal vus en plein soleil).

## 3. Tailles et forme

| Élément | Règle |
|---|---|
| Zone tactile | ≥ 48 × 48 px (idéal : tuiles et boutons principaux ≥ 96 px de haut) |
| Texte courant | ≥ 18 px ; titres ≥ 24 px ; 1 à 2 mots par bouton |
| Coins | Arrondis 16 px (cartes, tuiles), 999 px (boutons « pilule », pastilles) |
| Espacement | Multiples de 8 px |
| Ombres | Légères ; la **bordure** porte le contraste, pas l'ombre |
| Police | Police système (légère, déjà sur le téléphone, supporte le malagasy) |

## 4. Ce qu'on retient des deux images d'inspiration

### 📱 Image 1 — ensemble d'écrans mobiles « agriculture »

| On **garde** | On **laisse** |
|---|---|
| **Grandes cartes avec grosse photo** et coins arrondis → écran *Conseils* et *choix de culture* | Connexion, code OTP, inscription (pas de compte, ADR 0006) |
| **Bouton plein largeur** vert → action principale de chaque écran | Panier, commande, paiement (pas de commerce) |
| **Grille de photos de cultures** → sélecteur de culture du Journal | Petits textes, prix, étiquettes (public qui lit peu) |
| **Fenêtre de succès avec grosse coche** → confirmation « Voatahiry » | Barre d'onglets à 5 entrées (nous : 4 tuiles) |
| **Titre centré + retour à gauche** → barre du haut identique partout | |

### 💻 Image 2 — tableau de bord web « Hi Peter »

| Élément de l'image | Notre adaptation (site admin) |
|---|---|
| Barre latérale sombre avec icônes | Barre latérale **vert-noir `#1F2A17`**, icône active en vert clair : *Tableau de bord · Calendriers · Cultures · Conseils · Régions · Compte* |
| Cartes « Indicateurs » (capteurs, météo) | « Téléphones actifs (7 jours) », « Notes cette semaine », carte météo de la région choisie |
| Liste « Upcoming tasks » avec pastille de retard | **« À valider »** : calendriers non validés, conseils sans audio, avec pastille (beige = à faire, rouge = bloquant) |
| Calendrier mensuel | **Calendrier de saison** : mois de semis et récolte par culture |
| Cartes « Fields » avec carte de parcelle | Cartes **« Régions »** (nombre de cultures, de téléphones) — pas de cartes de parcelles |
| « Harvest » : barres horizontales par culture | Barres des **notes par type** (pluie, parasite, plantation, récolte) |
| Capteurs, bouton Add, avatar | Bouton **« Ajouter »** et avatar du compte ; **pas de capteurs** |

## 5. Écrans à maquetter (Sprint 1)

### Mobile (6 écrans)

| # | Écran | Contenu clé |
|---|---|---|
| 0 | **Choix de la région** (1ᵉʳ lancement) | Une seule question, gros boutons de région, 🔊 |
| 1 | **Accueil** | 4 grosses tuiles : Toetr'andro · Fampitandremana · Boky · Torohevitra |
| 2 | **Météo** | Aujourd'hui en grand (pictogramme + température), 4 jours suivants en ligne, « dernière mise à jour » |
| 3 | **Alertes** | Cartes : icône du geste + 1 ou 2 mots + date ; rouge seulement si danger |
| 4 | **Journal** | Liste des notes + gros bouton ➕ ; saisie en 3 étapes (type → culture → date) ; grande coche finale |
| 5 | **Conseils** | Cartes avec grosse photo ; lecteur audio plein écran (lecture / pause énormes) |

**Éléments communs à tous les écrans** : barre du haut avec ← **Hiverina** à gauche et 🔊 **Henoy** à droite (toujours aux mêmes places, exigence EF6/EF7) ; bandeau **Tsy misy internet** en haut quand le réseau manque.

### Web (4 pages)

Connexion · Tableau de bord · Calendriers (liste + édition) · Conseils (liste + édition + envoi d'audio).

## 6. Où vivent les couleurs dans le code

- Mobile : `mobile/src/theme/index.js` (la source unique ; aucune couleur écrite dans les écrans).
- Web : variables CSS dans `web/src/theme.css` (`--primary`, `--bg`, `--surface`…).
- Les deux utilisent **les mêmes valeurs** que le tableau du §1.
