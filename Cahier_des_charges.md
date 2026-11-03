# Cahier des charges — Tantsaha Connect

> **Projet** : conception de l'IHM d'une application mobile d'aide à la gestion des cultures et des saisons agricoles pour les paysans malagasy.
> **Source** : « Sujet de projet guidé IHM » (3 pages).
> **Version** : 1.0 — 28/10/2026

---

## 0. Lexique pour débutant

| Mot | Explication simple |
|---|---|
| **IHM** | Interaction Homme-Machine : tout ce que la personne voit et touche pour utiliser l'application (écrans, boutons, sons). C'est le **sujet principal** de ce projet. |
| **Cahier des charges** | Le document qui dit *ce qu'on doit construire*, pour *qui*, et avec *quelles règles*. Il ne dit pas encore *comment* le programmer. |
| **Persona** | Un personnage fictif mais réaliste qui représente un type d'utilisateur (nom, âge, métier, problèmes). Cela évite de concevoir « pour tout le monde ». |
| **Scénario d'usage** | Une petite histoire : « Rakoto ouvre l'application pour savoir s'il va pleuvoir… ». |
| **Wireframe** | Un dessin très simple d'un écran (des rectangles, des icônes, pas de couleurs). Comme un plan de maison avant de construire. |
| **Maquette** | Un wireframe plus joli, avec couleurs et vraies images. |
| **Prototype** | Une maquette sur laquelle on peut cliquer pour simuler l'application. |
| **Hors ligne** | L'application marche **sans internet**. |
| **Heuristiques de Nielsen** | 10 règles d'or pour qu'une interface soit facile à utiliser. |
| **Critères de Scapin et Bastien** | Une autre liste de règles d'ergonomie (guidage, charge de travail, feedback, etc.). |
| **Ergonomie** | Faire en sorte que l'application soit adaptée à la personne qui l'utilise (facile, rapide, sans erreur). |
| **Picto / pictogramme** | Un petit dessin qui représente une idée (un nuage de pluie = « pluie »). |
| **Écran capacitif** | L'écran tactile classique des smartphones, qui réagit au doigt. |
| **CEPE / BEPC** | Diplômes malgaches : fin du primaire / fin du collège. |

---

## 1. Présentation du besoin

### 1.1 Problème à résoudre
À Madagascar, beaucoup de paysans (*tantsaha*) cultivent sans outils numériques adaptés. Le téléphone est répandu, mais les applications existantes :
- ne sont **pas en malagasy** ;
- utilisent des **icônes compliquées** et trop de texte ;
- demandent **internet**, alors que le réseau est faible ou absent à la campagne.

### 1.2 Objectif général
Concevoir l'**interface** d'une application mobile **simple, sobre, compréhensible sans lire**, qui aide le paysan à mieux décider *quand* semer, récolter et protéger ses cultures.

### 1.3 Les 4 fonctions demandées par le sujet

| N° | Fonction | Exemple concret |
|---|---|---|
| F1 | Consulter la **météo locale** | « Demain il pleut, après-demain soleil » |
| F2 | Recevoir des **alertes** de semis / récolte | « C'est le moment de planter le riz » |
| F3 | Saisir des **observations** (pluie, parasites, dates de plantation) | « J'ai planté le maïs le 3 novembre » |
| F4 | Accéder à des **conseils agricoles de base** | « Comment lutter contre les criquets ? » |

### 1.4 Objectifs pédagogiques (ce que le professeur évalue)
1. Analyser un vrai contexte utilisateur et ses contraintes.
2. Appliquer les **heuristiques de Nielsen**.
3. Appliquer les **critères d'ergonomie de Scapin et Bastien**.
4. Réfléchir à des interactions **alternatives** : voix, icônes, symboles.
5. Proposer un **prototype** (optionnel).

---

## 2. Contexte utilisateur

### 2.1 Public cible (donné par le sujet)
- Niveau d'études souvent **CEPE ou BEPC**.
- Parle surtout le **malagasy**.
- Smartphone **basique** (petit écran, peu de mémoire, parfois écran tactile moyen).
- **Pas à l'aise** avec la lecture ni les longues instructions.
- Internet **limité ou absent**.

### 2.2 Contraintes qui en découlent

| Contrainte du terrain | Conséquence pour l'application |
|---|---|
| Lecture difficile | Image et son d'abord, texte court ensuite |
| Malagasy uniquement | Tous les textes et voix en malagasy |
| Peu ou pas d'internet | Tout fonctionne hors ligne ; synchronisation quand le réseau revient |
| Téléphone modeste | Application légère, rapide, peu gourmande en batterie et en mémoire |
| Mains souvent sales / usage en plein soleil | Gros boutons, forts contrastes, peu de gestes compliqués |
| Peur de « casser » le téléphone | Messages rassurants, possibilité d'annuler |

---

## 3. Personas (à finaliser avec vous)

Voici **3 propositions** de départ. Vous pourrez les modifier ; elles sont inventées mais réalistes.

### Persona 1 — Rakoto, 45 ans, riziculteur
- **Lieu** : région Vakinankaratra. **Langue** : malagasy (un peu de français oral).
- **Niveau** : CEPE. Lit lentement, préfère écouter.
- **Téléphone** : Android basique, données mobiles rares (il recharge un peu de crédit au marché).
- **Besoin** : savoir quand la pluie arrive pour repiquer le riz.
- **Peur** : se tromper et perdre sa saison.

### Persona 2 — Soa, 32 ans, maraîchère (légumes, manioc)
- **Lieu** : périphérie de Mahajanga. **Langue** : malagasy.
- **Niveau** : BEPC. Lit sans trop de difficulté, mais n'aime pas les longs textes.
- **Téléphone** : smartphone d'entrée de gamme, utilise surtout Facebook et les appels.
- **Besoin** : repérer les parasites tôt et noter ses plantations.
- **Contrainte** : peu de temps, utilise le téléphone avec un enfant sur les bras.

### Persona 3 — Ravao, 60 ans, petit éleveur-cultivateur
- **Lieu** : Haute Matsiatra. **Langue** : malagasy uniquement.
- **Niveau** : CEPE ancien, lit très peu.
- **Téléphone** : téléphone simple prêté par son fils, vue qui baisse.
- **Besoin** : alertes sonores pour la récolte.
- **Contrainte** : gros caractères, volume fort, très peu d'étapes.

---

## 4. Scénarios d'usage

### Scénario 1 — Consulter la météo (Rakoto)
1. Rakoto ouvre l'application : un grand écran d'accueil avec 4 grandes icônes.
2. Il touche l'icône **nuage/soleil**. Une voix dit en malagasy : « Hoavy orana rahampitso » (*il pleuvra demain*).
3. L'écran affiche 3 jours avec des pictos (soleil, nuage, pluie) et la température.
4. Il comprend sans lire, referme l'application.
5. *Sans internet*, il voit la dernière prévision enregistrée, avec la mention « dernière mise à jour : hier ».

### Scénario 2 — Noter une date de semis (Soa)
1. Soa touche l'icône **cahier**.
2. Elle choisit une culture en touchant une **image** (manioc, riz, maïs…).
3. Elle choisit l'action : **planté** (icône graine), puis la date (« Androany » = aujourd'hui, par défaut).
4. Elle touche le gros bouton vert **✓**. Un message « Voatahiry » (*enregistré*) s'affiche et une voix le répète.
5. L'information reste sur le téléphone, même sans réseau.

*(Optionnel : un 3ᵉ scénario « recevoir une alerte de semis » pour Ravao.)*

---

## 5. Exigences fonctionnelles

### 5.1 Écrans obligatoires (d'après le sujet)

| N° | Écran | Contenu principal |
|---|---|---|
| E1 | **Accueil** | 4 grandes icônes : Météo, Alertes, Journal, Conseils ; bouton « écouter » |
| E2 | **Alertes** | Liste d'alertes avec icône (semer / récolter / danger), message court, lecture audio |
| E3 | **Météo** | Prévisions sur 3 à 5 jours en pictos, indication de mise à jour |
| E4 | **Journal de culture** | Liste des observations ; ajout de pluie, parasite, date de plantation |
| E5 | **Conseils audio / icônes** | Conseils par thème (ravageurs, semis…) en image + audio |

### 5.2 Fonctions détaillées

| Réf. | Exigence | Priorité |
|---|---|---|
| EF1 | L'accueil donne accès aux 4 fonctions en **un seul toucher** | Obligatoire |
| EF2 | La météo affiche les prévisions locales sous forme de **pictogrammes** | Obligatoire |
| EF3 | Les alertes de semis/récolte sont **visibles et sonores** | Obligatoire |
| EF4 | Le journal permet d'enregistrer : pluie, parasite, date de plantation | Obligatoire |
| EF5 | Les conseils sont consultables en **audio + images** | Obligatoire |
| EF6 | Chaque écran possède un bouton **« écouter »** (haut-parleur) | Obligatoire |
| EF7 | Chaque écran possède un bouton **retour / accueil** toujours au même endroit | Obligatoire |
| EF8 | Choix de la **commune / région** au premier lancement (pour la météo locale) | Recommandé |
| EF9 | Choix de la **culture** par image (riz, maïs, manioc, haricot…) | Recommandé |
| EF10 | Possibilité d'**annuler / corriger** une saisie | Recommandé |

---

## 6. Contraintes obligatoires du sujet

| N° | Contrainte | Comment on la respecte |
|---|---|---|
| C1 | **Fonctionne hors ligne** | Données stockées sur le téléphone ; dernière météo gardée en mémoire ; messages « pas de réseau » rassurants |
| C2 | **Compréhensible sans lire** | Navigation par icônes + couleurs + voix ; texte réduit à 1 ou 2 mots |
| C3 | **Version vocale en malagasy** pour les messages clés | Enregistrements audio (alertes, confirmations, conseils, aide) |
| C4 | **Couleurs et symboles adaptés à la culture** | Rouge = danger/interdit ; vert = valider/ok ; éviter les symboles ambigus |

---

## 7. Exigences ergonomiques (cœur de l'évaluation)

Le sujet demande de **justifier** les choix selon 7 critères. Voici ce que cela signifiera concrètement dans notre application :

| Critère | Idée en mots simples | Application dans Tantsaha Connect |
|---|---|---|
| **Visibilité de l'état du système** | L'utilisateur sait toujours *où il est* et *ce qui se passe* | Titre + icône de l'écran en haut ; témoin « hors ligne » ; indicateur « dernière mise à jour » |
| **Reconnaissance plutôt que rappel** | Mieux vaut *reconnaître* une image que *se souvenir* d'une commande | Cultures choisies par image ; icônes toujours identiques ; pas de menu caché |
| **Flexibilité** | Utilisable par un débutant comme par un habitué | Raccourcis vers les dernières actions ; choix texte/voix ; taille du son réglable |
| **Rétroaction (feedback)** | L'application *répond* à chaque action | Son + message « Voatahiry » + coche verte après enregistrement ; vibration légère au toucher |
| **Signifiance des éléments** | Les textes, dessins et sons ont un **sens clair** pour la personne | Pictos testés auprès d'utilisateurs ; vocabulaire malagasy courant ; couleurs culturelles |
| **Guidage explicite** | On guide pas à pas | Un seul choix par écran dans le journal ; flèches / animations ; voix qui explique |
| **Concision & densité informationnelle** | Peu d'information par écran | Maximum 4 éléments principaux par écran ; mots très courts |

**Règles de conception complémentaires** :
- Boutons d'au moins **48 × 48 px** (assez grands pour un gros doigt).
- **Forts contrastes** (lisible en plein soleil).
- Police simple et grande (au moins 18 px pour le texte).
- Aucun geste complexe (pas de glisser à deux doigts, pas de clic long obligatoire).
- Pas d'animation rapide ni de pub.

---

## 8. Exigences non fonctionnelles

| Domaine | Exigence |
|---|---|
| **Langue** | 100 % malagasy (textes + voix). Le français n'est qu'optionnel dans les documents du projet |
| **Performance** | Ouverture en moins de 3 secondes sur téléphone basique |
| **Poids** | Application légère (idéalement moins de 30 Mo, audio compressé) |
| **Hors ligne** | Toutes les fonctions de base disponibles sans réseau |
| **Autonomie** | Faible consommation de batterie |
| **Fiabilité** | Aucune perte de données saisies |
| **Confidentialité** | Pas de compte obligatoire, pas de mot de passe, données restant sur le téléphone |
| **Compatibilité** | Smartphones Android basiques en priorité |

---

## 9. Livrables attendus

| Livrable | Contenu | Obligatoire ? |
|---|---|---|
| **Rapport de conception / fiche-projet** | Besoin, contexte, justification du design, maquettes | Oui |
| **Analyse des utilisateurs** | Personas | Oui |
| **Scénarios d'usage** | Au moins 2 | Oui |
| **Wireframes** | 5 écrans : Accueil, Alertes, Météo, Journal, Conseils | Oui |
| **Justification ergonomique** | 7 critères ci-dessus | Oui |
| **Prototype** | Maquette cliquable ou application | Optionnel |
| **Messages vocaux** | Fichiers audio en malagasy | Recommandé |

**Outils suggérés par le sujet** : papier / Balsamiq / Figma (maquettes) ; Figma / Adobe XD / PowerPoint animé (prototype) ; Google Traduction + Audacity (voix malagasy) ; Flaticon / Noun Project (pictogrammes).

---

## 10. Plan de travail proposé

| Étape | Tâche | Résultat |
|---|---|---|
| 1 | Lire et comprendre le sujet | Ce cahier des charges |
| 2 | Finaliser personas et scénarios | Section « Analyse » du rapport |
| 3 | Choisir pictogrammes, palette de couleurs, vocabulaire malagasy | Mini « charte graphique » |
| 4 | Dessiner les wireframes des 5 écrans | 5 schémas |
| 5 | Rédiger la justification ergonomique | Tableau critère → choix de design |
| 6 | Enregistrer les messages vocaux malagasy | Fichiers audio |
| 7 | Construire le prototype (optionnel) | Prototype cliquable |
| 8 | Relire et assembler le rapport final | Livrable final |

---

## 11. Choix techniques à décider (propositions)

Le sujet ne l'impose pas. Voici deux voies :

| Option | Description | Avantage | Inconvénient |
|---|---|---|---|
| **A. Maquettes seules** | Wireframes + prototype Figma | Plus rapide, suffit pour le sujet | Rien de « vraiment » fonctionnel |
| **B. Prototype web fonctionnel (recommandé si vous voulez du concret)** | Mini-site en **HTML / CSS / JavaScript** installable sur téléphone (PWA) qui marche hors ligne | Apprentissage concret, démonstration réelle sur téléphone | Un peu plus de travail |

Je recommande de faire **d'abord A** (obligatoire), puis **B** si le temps le permet.

---

## 12. Critères de réussite

Le projet est réussi si :
- [ ] Une personne qui ne sait pas lire peut atteindre la météo en moins de 10 secondes.
- [ ] Tous les messages clés existent en voix malagasy.
- [ ] Les 5 écrans respectent chacun les 7 critères ergonomiques.
- [ ] Le rouge n'est utilisé que pour le danger / l'interdit.
- [ ] L'application a été conçue pour fonctionner sans internet.
- [ ] Le rapport contient besoin, contexte, justification et maquettes.

---

## 13. Risques et points d'attention

| Risque | Solution |
|---|---|
| Fautes de malagasy dans les textes | Faire relire par un locuteur natif |
| Pictogrammes mal compris | Les montrer à 3–5 personnes du public cible |
| Voix de synthèse peu naturelle | Enregistrer sa propre voix avec Audacity |
| Trop de fonctions | Garder uniquement les 4 fonctions du sujet |

---

## 14. Questions ouvertes (à trancher ensemble)

1. **Date de rendu** et **format** exigé (Word, PDF, présentation orale ?)
2. Travaillez-vous **seul(e)** ou en groupe ?
3. Le **prototype** est-il vraiment optionnel pour vous, ou souhaité ?
4. Quel **outil** voulez-vous utiliser : Figma, papier, ou prototype web ?
5. Quelle **région de Madagascar** prenons-nous comme exemple principal ?
6. Parlez-vous malagasy couramment (pour écrire les messages) ?
