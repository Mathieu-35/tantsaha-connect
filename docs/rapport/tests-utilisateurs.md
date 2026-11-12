# Tests utilisateurs — fiche et compte rendu (Sprint 9)

> **But** : vérifier que de vrais utilisateurs réussissent **seuls** les 3 tâches principales.
> **Réussite du sprint** : au moins **4 personnes sur 5** réussissent les 3 tâches.
> Ce document sert de **mode d'emploi** (parties 1 à 5) et de **compte rendu** (parties 6 à 8) pour le rapport.

---

## 1. Avant de commencer

| À faire | Détail |
|---|---|
| Trouver 3 à 5 personnes | Proches du public cible : peu à l'aise avec la lecture, parlant malagasy, smartphone basique. Pas des informaticiens. |
| Préparer le téléphone | Application lancée avec `npx expo start --tunnel`, **batterie pleine**, luminosité forte, son activé, mode « ne pas déranger ». |
| Préparer l'écran de départ | L'application s'ouvre sur l'**accueil**. Région déjà choisie. Quelques notes déjà dans le journal. |
| Faire traduire les consignes | Les phrases de la partie 3 sont écrites en français : à **dire en malagasy**, avec les mêmes mots pour tout le monde. |
| Imprimer la grille | Une copie de la partie 5 **par personne**. |
| Prévoir de quoi noter | Papier, stylo. Pas d'enregistrement sans accord de la personne. |

---

## 2. Règles d'or pour l'animateur (toi)

1. **On teste l'application, pas la personne.** Le dire clairement : « Si vous vous trompez, c'est que l'application est mal faite. »
2. **Ne pas aider.** Même si elle hésite longtemps. Attends 30 secondes, puis passe à la suite et note « échec ».
3. **Ne pas expliquer les icônes** avant la fin du test.
4. **Demander de parler à voix haute** : « Dites ce que vous pensez en touchant. »
5. **Noter ce que tu vois**, pas ce que tu penses : où le doigt va, où elle hésite, ce qu'elle dit.
6. **Accord oral** : la personne sait que c'est un projet d'étude, que ses réponses sont anonymes (on note « P1, P2… », pas son nom) et qu'elle peut arrêter à tout moment.

---

## 3. Déroulement (environ 15 minutes par personne)

| Étape | Durée | Quoi |
|---|---|---|
| Accueil | 2 min | Présenter le projet et les règles. Questions de profil (partie 5.1). |
| Découverte | 1 min | Donner le téléphone, accueil affiché : **« Que voyez-vous ? Que pensez-vous que cette application fait ? »** (ne rien expliquer) |
| 3 tâches | 8 min | Voir ci-dessous. |
| Quiz d'icônes | 2 min | Voir partie 4. |
| Fin | 2 min | Questions de la partie 5.4, remerciements. |

### Les 3 tâches

| # | Consigne à dire (à traduire) | Chemin attendu | Réussi si… |
|---|---|---|---|
| **T1** | « Montrez-moi comment savoir s'il va pleuvoir demain. » | Accueil → carte **Toetr'andro** → lit les jours suivants | Elle ouvre la météo **et** dit (ou montre) le temps de demain |
| **T2** | « Vous avez planté du riz aujourd'hui. Montrez-moi comment le noter. » | Accueil → **Boky** → bouton **+** → type **Fambolena** → culture **Vary** → date **Androany** → coche « Voatahiry » | La note apparaît dans la liste |
| **T3** | « Montrez-moi comment savoir si c'est le moment de planter. » | Accueil → **Fampitandremana** → carte **Mamafy** | Elle ouvre les alertes **et** repère la carte de semis |

> **Bonus (hors réussite)** : « Montrez-moi comment écouter un conseil. » → **Torohevitra** → bouton **Henoy**.

---

## 4. Quiz d'icônes

Montre chaque icône (écran du téléphone ou feuille imprimée), **une par une** : **« Qu'est-ce que c'est, pour vous ? »**
Note **mot pour mot** la réponse. Comparer avec le sens voulu.

| Icône | Sens voulu | Risque connu |
|---|---|---|
| Soleil + nuage | Météo | — |
| Nuage + gouttes | Pluie | — |
| Nuage + éclair | Tempête (danger) | — |
| Cloche | Alertes | Peut évoquer l'école ou la messe |
| Carnet | Journal / notes | — |
| Pousse | Semis, plantation | — |
| Panier | Récolte | Peut évoquer le marché |
| Insecte | Parasite | — |
| Épi | Riz | — |
| Racine allongée | Manioc | **À surveiller** (peut ressembler à une carotte) |
| Gousse | Haricot | **À surveiller** |
| Haut-parleur | Écouter | — |
| Poubelle | Supprimer | — |

---

## 5. Grille d'observation (à imprimer, 1 par personne)

### 5.1 Profil (avant)
| Champ | Réponse |
|---|---|
| Code | P__ |
| Âge | |
| Niveau d'études | |
| Lit facilement le malagasy ? | ☐ oui ☐ un peu ☐ non |
| Utilise un smartphone ? | ☐ tous les jours ☐ parfois ☐ jamais |
| Activité agricole | |

### 5.2 Tâches
Cocher : **✓** réussi seul · **~** réussi après hésitation (>10 s ou un faux pas) · **✗** échec ou abandon.

| Tâche | Résultat | Temps | Faux pas / hésitations | Ce qu'elle dit |
|---|---|---|---|---|
| T1 — Météo de demain | ☐ ✓ ☐ ~ ☐ ✗ | | | |
| T2 — Noter un semis | ☐ ✓ ☐ ~ ☐ ✗ | | | |
| T3 — Moment de planter | ☐ ✓ ☐ ~ ☐ ✗ | | | |
| Bonus — Écouter un conseil | ☐ ✓ ☐ ~ ☐ ✗ | | | |

### 5.3 Quiz d'icônes
| Icône | Réponse de la personne | Compris ? (oui / à peu près / non) |
|---|---|---|
| | | |

### 5.4 Questions de fin
1. Qu'est-ce qui était **le plus facile** ?
2. Qu'est-ce qui était **le plus difficile** ou qui vous a **perdu** ?
3. Y a-t-il un **mot** que vous n'avez pas compris ?
4. Les **sons / la voix** vous aident-ils ? (les voix sont encore des bips : le dire)
5. Utiliseriez-vous cette application pour votre travail ? Pourquoi ?
6. Lisible **en plein soleil** ? (si possible, faire le test dehors)

---

## 6. Compte rendu (à remplir après les tests)

### 6.1 Participants
| Code | Âge | Études | Lecture | Smartphone |
|---|---|---|---|---|
| P1 | | | | |
| P2 | | | | |
| P3 | | | | |
| P4 | | | | |
| P5 | | | | |

### 6.2 Résultats des tâches
| Tâche | P1 | P2 | P3 | P4 | P5 | Réussites seules (✓) |
|---|---|---|---|---|---|---|
| T1 Météo | | | | | | / 5 |
| T2 Noter | | | | | | / 5 |
| T3 Alertes | | | | | | / 5 |

**Personnes qui réussissent les 3 tâches seules** : __ / 5 (objectif : au moins 4)

### 6.3 Icônes
| Icône | Comprise par | Réponses fréquentes | Décision (garder / changer) |
|---|---|---|---|
| | | | |

### 6.4 Problèmes trouvés
Gravité : **A** bloque la tâche · **B** fait hésiter · **C** gêne seulement.

| # | Problème observé | Vu chez | Gravité | Correction prévue | Fait ? |
|---|---|---|---|---|---|
| 1 | | | | | ☐ |

### 6.5 Corrections faites après les tests
| Problème # | Ce qui a été changé | Fichier / écran |
|---|---|---|
| | | |

---

## 7. Lien avec les 7 critères de conception (pour le rapport)

Pour chaque critère, citer **une observation du test** qui le confirme ou le contredit.

| Critère | Observation du test |
|---|---|
| Visibilité de l'état du système | |
| Reconnaissance plutôt que rappel | |
| Flexibilité | |
| Rétroaction | |
| Signifiance des éléments | |
| Guidage explicite | |
| Concision et densité | |

---

## 8. Limites à écrire honnêtement dans le rapport

- Échantillon **petit** (3 à 5 personnes) : les résultats montrent des tendances, pas des statistiques.
- Les voix sont **provisoires** (bips) : l'effet réel de la voix malagasy n'est pas testé.
- Les calendriers et conseils sont des **exemples non validés** par un agronome.
- Test sur **Expo Go / iPhone** : un téléphone Android basique peut se comporter différemment.
