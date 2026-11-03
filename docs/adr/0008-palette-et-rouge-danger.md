# ADR 0008 — Palette verte/crème ; rouge réservé au danger
- Statut : Accepté
- Date : 2026-11-03

## Contexte
La palette est choisie par le porteur du projet : `#2A7C13`, `#76C457`, `#FFF8CF`, `#FBE6C2`. Le cahier impose rouge = danger/interdit (C4). Le public lit peu : la couleur porte du sens.

## Décision
Ces 4 couleurs forment l'identité visuelle ; un **texte très foncé** (`#1F2A17`) et un **rouge de danger** (`#C62828`) sont ajoutés. Le rouge n'apparaît **jamais** pour autre chose qu'un danger. **Aucun texte blanc ni vert sur `#76C457`** (contraste insuffisant, voir `docs/DESIGN.md`). Toutes les couleurs vivent dans `src/theme` (mobile) et dans des variables CSS (web).

## Alternatives
- *`#76C457` comme fond de bouton avec texte blanc* : contraste 2,1:1, illisible au soleil. Écarté.

## Conséquences
- ✅ Contrastes mesurés et documentés ; changement de couleur en un seul endroit.
- ⚠️ Le vert clair ne sert qu'aux surfaces, fonds et pictogrammes, pas au texte.
