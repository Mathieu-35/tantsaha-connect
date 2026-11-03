# PRD — Tantsaha Connect

**PRD** (*Product Requirements Document*) = « ce que le produit doit faire, pour qui, et comment on saura que c'est réussi ».
Le détail du contexte, des personas et des scénarios est dans le [cahier des charges](../Cahier_des_charges.md). Ce document **ne le répète pas** : il le complète avec ce qui manquait (priorités, critères d'acceptation, ce qui est hors périmètre, partie web).

## 1. Problème

Les paysans malagasy ont besoin d'informations (météo, moment de semer ou récolter, conseils) mais : ils lisent peu, parlent malagasy, ont des téléphones basiques et peu d'internet. Les applications existantes supposent l'inverse.

## 2. Objectif général

Une application **qu'on peut utiliser sans lire, en malagasy, sans internet**, qui aide à gérer ses cultures et les saisons. Plus un **site web d'administration** pour que des agronomes tiennent les données à jour (calendriers, conseils, voix).

## 3. Utilisateurs

| Utilisateur | Outil | Besoin principal |
|---|---|---|
| **Paysan** (Rakoto, Soa, Ravao — voir cahier) | Application mobile | Voir la météo, être prévenu du bon moment, noter ce qui se passe, écouter un conseil |
| **Agronome / administrateur** | Site web | Corriger les calendriers et conseils, enregistrer la voix, voir l'usage |

> ⚠️ **Hypothèse à valider** : la partie web est un *back-office* (gestion des données), pas une 2ᵉ application pour les paysans. Elle est née de la maquette web fournie ; elle n'est pas dans le sujet de départ. Si elle vous semble hors sujet, on la retire (Sprint 8) sans toucher au reste.

## 4. Périmètre — méthode MoSCoW

**M** = Must (indispensable) · **S** = Should (important) · **C** = Could (si le temps le permet) · **W** = Won't (pas dans cette version)

### 4.1 Application mobile

| ID | Histoire utilisateur | Cahier | Priorité | Critère d'acceptation |
|---|---|---|---|---|
| M1 | En tant que paysan, je vois **4 grosses tuiles** à l'accueil | EF1 | **M** | Chaque fonction s'ouvre en 1 toucher ; zone tactile ≥ 48 px |
| M2 | Je **choisis ma région** une seule fois, au premier lancement | EF8 | **M** | Une seule question, en images/gros boutons ; mémorisée |
| M3 | Je vois la **météo sur 5 jours en pictogrammes** | EF2 | **M** | Soleil / nuage / pluie / orage reconnus ; marche hors ligne avec « dernière mise à jour » |
| M4 | Je **note** une pluie, un parasite, une plantation, une récolte | EF4, EF9 | **M** | 3 touches maximum ; culture choisie par image ; confirmation « Voatahiry » |
| M5 | Je peux **annuler / corriger** une note | EF10 | **M** | Suppression avec confirmation simple |
| M6 | Je suis **prévenu** du moment de semer / récolter | EF3 | **M** | Alerte visible + sonore, même sans internet |
| M7 | J'**écoute** des conseils illustrés | EF5 | **M** | Image + audio malagasy, sans internet |
| M8 | Chaque écran a **« Henoy »** (écouter) et **« Hiverina »** (retour) | EF6, EF7 | **M** | Même place sur tous les écrans |
| M9 | L'application **marche sans internet dès le premier lancement** | C1 | **M** | Test en mode avion juste après installation |
| M10 | Mes notes sont **sauvegardées sur le serveur** quand le réseau revient | — | **S** | Aucune perte, aucun doublon |
| M11 | Alerte **météo** (orage annoncé) | — | **C** | Basée sur la dernière prévision reçue |
| M12 | **Restaurer** mes notes après réinstallation | — | **C** | Demande un moyen d'identifier la personne (hors v1) |

### 4.2 Site web d'administration

| ID | Histoire utilisateur | Priorité | Critère d'acceptation |
|---|---|---|---|
| W1 | L'administrateur se **connecte** (e-mail + mot de passe) | **M** | Accès refusé sans connexion |
| W2 | Je **modifie les calendriers** semis/récolte par culture et région | **M** | Les téléphones reçoivent la modification à la prochaine synchro |
| W3 | Je **modifie les conseils** et j'**envoie l'audio** malagasy | **M** | Le conseil apparaît avec sa voix sur le téléphone |
| W4 | Je vois un **tableau de bord** (téléphones actifs, notes par région/type, alertes) | **S** | Données anonymes (aucun nom) |
| W5 | Je gère les **cultures** et **régions** | **S** | Ajout / retrait propagé aux téléphones |

### 4.3 Hors périmètre (Won't) pour cette version

- Comptes et mots de passe pour les paysans (voir [ADR 0006](adr/0006-auth-admin-seulement.md)).
- Capteurs connectés, cartes de parcelles, achats / marché (visibles dans les images d'inspiration mais **sans rapport avec le besoin**).
- Publication sur l'App Store d'Apple (cible réelle = Android ; l'iPhone sert au développement).
- Autres langues que le malagasy (structure prête, contenu non fait).

## 5. Contraintes (rappel)

C1 hors ligne · C2 utilisable sans lire · C3 voix malagasy · C4 couleurs adaptées (**rouge = danger uniquement**). Voir [DESIGN.md](DESIGN.md) pour leur traduction visuelle.

## 6. Comment mesurer la réussite

- **Test d'usage** (Sprint 9) : au moins 4 personnes sur 5 du public cible réussissent seules les 3 tâches *voir la météo*, *noter une pluie*, *écouter un conseil*.
- **Hors ligne** : toutes les fonctions M1–M9 marchent en mode avion.
- **Qualité des données** : calendriers et conseils validés par un agronome (aujourd'hui ce sont des **exemples**).

## 7. Questions ouvertes

| Question | Décision avant |
|---|---|
| La partie web (back-office) est-elle bien voulue ? | Sprint 1 |
| Combien de régions et de cultures au lancement ? | Sprint 2 |
| Qui valide les calendriers et conseils ? | Sprint 6 |
| Qui enregistre les voix malagasy ? | Sprint 7 |
| Hébergement final | Sprint 10 |
