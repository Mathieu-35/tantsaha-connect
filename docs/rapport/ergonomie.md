# Justification ergonomique — notes pour le rapport

> Brouillon vivant : on complète à chaque sprint (voir 📝 dans `docs/SPRINTS.md`). Ces notes seront réécrites dans le rapport de conception final (Sprint 10).
> **Statut au Sprint 1** : décisions de conception sur maquettes. Rien n'est encore testé avec de vrais utilisateurs (Sprint 9) : les colonnes « À vérifier » sont des hypothèses.

Maquettes : [docs/maquettes/](../maquettes/index.html) (ouvrir `index.html` dans un navigateur, ou lancer l'aperçu « maquettes »).

## 1. Les 7 critères appliqués aux écrans

| Critère | Choix de conception | Où (écran) | À vérifier aux tests |
|---|---|---|---|
| **Visibilité de l'état du système** | Bandeau « Tsy misy internet » en haut quand le réseau manque ; mention « Fanavaozana farany : 06:00 » sous la météo ; badge « 2 » sur la tuile Alertes ; indicateur d'étape 1/3 → 3/3 dans la saisie | Météo, Accueil, Saisie | Comprend-on que les données sont anciennes ? |
| **Reconnaissance plutôt que rappel** | Cultures choisies **par image** (Vary, Katsaka…) ; pictogrammes météo ; même icône pour une même chose partout (🌧️ = pluie dans Météo, Alertes et Journal) ; aucun menu caché | Saisie, Météo, Journal | Reconnaît-on chaque icône sans légende ? |
| **Flexibilité** | Date d'aujourd'hui **présélectionnée** (le geste fréquent est le plus court) ; 🔊 « Henoy » sur chaque écran et sur chaque alerte (voix ou lecture) ; web : texte **et** voix pour chaque conseil | Saisie 3/3, Alertes, Conseils | Les habitués vont-ils plus vite ? |
| **Rétroaction (feedback)** | Écran de succès : grande coche + « Voatahiry » ; bouton qui change de teinte à l'appui ; (prévu au code : vibration légère et son) | Saisie → Confirmation | La confirmation est-elle comprise sans lire ? |
| **Signifiance des éléments** | Rouge **uniquement** pour danger (alerte d'orage, suppression) ; vert = valider ; mots malagasy courts ; images à sens direct | Alertes, Suppression | Le rouge est-il compris comme « danger » ? Les mots sont-ils naturels ? (relecture malagasy) |
| **Guidage explicite** | Un seul choix par écran dans la saisie, étapes numérotées par des barres ; la question est écrite en grand (« Inona ? », « Inona ny voly ? », « Oviana ? ») ; choix sûr (✕ Tsia) en vert et en premier à la suppression | Saisie, Suppression, Région | Se perd-on dans la saisie ? |
| **Concision et densité** | **4 éléments** à l'accueil ; 1 à 2 mots par bouton ; météo : 1 jour en grand + 4 lignes ; maximum 3 cartes visibles par écran de liste | Accueil, Météo, Alertes | Y a-t-il trop ou trop peu d'information ? |

## 2. Mesures réalisées sur les maquettes (2026-11)

Mesurées automatiquement dans le navigateur (script de vérification, sprint 1) :

| Contrôle | Résultat |
|---|---|
| Zones tactiles du mobile | **Toutes ≥ 48 × 48 px** (12 écrans, tous les boutons) |
| Contraste du texte, mobile | 158 textes mesurés, **pire rapport 4,60:1** (seuil 4,5:1 ; 3:1 pour le gros texte) → conforme |
| Contraste du texte, web | 178 textes mesurés, **pire rapport 5,26:1** → conforme |
| Contenu coupé / débordement | Aucun sur les 12 écrans mobiles et les 4 pages web |
| Nombre de touches (parcours cliquable) | Voir la météo : **1** · Écouter un conseil : **2** · Noter une pluie : **4** (Boky → Vaovao → Orana → ✓) · Noter un parasite/plantation/récolte : **5** · Premier lancement : **1** |

## 3. Problèmes trouvés et corrigés en concevant (à raconter dans le rapport)

1. **Mot coupé dans une tuile** — avec 4 tuiles en grille 2×2, le mot « Fampitandremana » (15 lettres) se coupait en deux (« Fampitandrem / ana »). Pour un public qui lit peu, un mot coupé est illisible. **Décision** : l'accueil passe en **4 bandes pleine largeur** (icône à gauche, mot entier à droite). Critère : signifiance, concision.
2. **Vert clair illisible en texte** — le blanc sur `#76C457` ne fait que 2,14:1. **Décision** : le vert clair ne sert que de fond ou de remplissage ; le texte posé dessus est vert-noir (6,99:1). Critère : signifiance, accessibilité.
3. **Étiquettes d'icônes de la barre du haut** à 14 px (sous la règle générale de 18 px) : acceptées car **toujours doublées d'une icône et d'une voix** ; règle documentée dans `docs/DESIGN.md`.

## 4. Limites connues (honnêteté du rapport)

- Les emojis remplacent les vrais pictogrammes et photos : leur **signification** reste à tester auprès du public (Sprint 9).
- Les textes en malagasy sont des **propositions** à faire relire.
- Les calendriers et données affichés sont des **exemples non validés**.
