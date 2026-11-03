# Guide Git et GitHub — pas à pas

**Git** = un carnet qui garde l'historique de votre projet (chaque « commit » est une photo du projet à un moment).
**GitHub** = un site qui garde une copie en ligne de ce carnet : sauvegarde, accès depuis un autre PC, et mise en valeur dans votre portfolio.

> Votre PC a déjà Git 2.53 et l'outil `gh`. Votre identité Git actuelle : `Mathieu` / `randriamoria7@gmail.com`.

---

## PARTIE A — Une seule fois : mettre le projet sur GitHub (Sprint 0)

### A1. Créer le compte GitHub
1. Ouvrez <https://github.com/signup>.
2. Entrez votre e-mail, un mot de passe, un nom d'utilisateur (ex. `mathieu-randriamoria`). Notez-le : c'est votre **pseudo**.
3. Confirmez l'e-mail reçu.

### A2. Créer le dépôt (vide)
1. Connecté, cliquez **+** en haut à droite → **New repository**.
2. **Repository name** : `tantsaha-connect`.
3. Choisissez **Private** (vous le passerez en public plus tard si vous voulez).
4. ⚠️ **Ne cochez RIEN** (ni README, ni .gitignore, ni licence) : on a déjà nos fichiers.
5. Cliquez **Create repository**. Gardez la page ouverte : elle affiche l'adresse du dépôt, du type `https://github.com/<pseudo>/tantsaha-connect.git`.

### A3. Vérifier votre identité Git
Dans le terminal, à la racine du projet (`E:\Tantsaha_Connect`) :

```bash
git config --global user.email
```

L'e-mail affiché doit être **celui de votre compte GitHub** (sinon vos commits ne seront pas reliés à votre profil). Pour le changer :

```bash
git config --global user.email "votre-email-github@exemple.com"
```

### A4. Supprimer le dépôt Git caché dans `mobile/`
Expo en a créé un. Il ne contient que son commit initial. On le supprime pour n'avoir qu'**un seul** dépôt (ADR 0009).

```powershell
Remove-Item -Recurse -Force mobile\.git
```

### A5. Créer le dépôt à la racine

```bash
git init -b main
```

### A6. Vérifier ce qui va partir (très important)

```bash
git status --short
```

Vous **ne devez pas** voir : `node_modules`, `.env`, `dev.db`. Contrôle précis :

```bash
git check-ignore -v server/.env mobile/.env server/prisma/dev.db
```

Chaque fichier doit apparaître avec la règle qui l'ignore. Si l'un manque : **arrêtez-vous** et dites-le-moi. Un fichier `.env` envoyé sur GitHub est considéré comme publié.

### A7. Premier commit

```bash
git add .
git commit -m "chore: initial project structure (server, mobile, docs)"
```

### A8. Relier au dépôt GitHub
Remplacez `<pseudo>` :

```bash
git remote add origin https://github.com/<pseudo>/tantsaha-connect.git
```

### A9. Envoyer

```bash
git push -u origin main
```

Une fenêtre du navigateur s'ouvre : **connectez-vous à GitHub et autorisez**. (C'est le « Git Credential Manager », il retient votre connexion.)

### A10. Vérifier
Actualisez la page du dépôt sur GitHub : vos dossiers sont là. Ouvrez `docs/ARCHITECTURE.md` : les schémas Mermaid s'affichent en dessin.

---

## PARTIE B — À la fin de chaque sprint (routine en 5 gestes)

On ne commit **que** quand la « définition de terminé » du sprint est entièrement cochée.

| # | Commande | À quoi ça sert |
|---|---|---|
| 1 | `git status --short` | Voir ce qui a changé. Pas de `.env`, pas de `node_modules`. |
| 2 | `git add .` | Mettre tout dans la « photo » |
| 3 | `git commit -m "feat(météo): affichage 5 jours hors ligne"` | Prendre la photo, avec un message |
| 4 | `git push` | Envoyer sur GitHub |
| 5 | `git tag sprint-4` puis `git push --tags` | Poser une étiquette sur la fin du sprint |

**Le message du commit** suit ce modèle : `type(zone): ce qui a changé, au présent, court`.

| Type | Quand |
|---|---|
| `feat` | Nouvelle fonction |
| `fix` | Correction de bug |
| `docs` | Documentation seule |
| `refactor` | On réorganise sans changer le comportement |
| `chore` | Entretien (configuration, dépendances) |

> À chaque fin de sprint, **je vous donnerai le message exact** et les 5 commandes prêtes à copier.

### Commits intermédiaires
Un sprint peut avoir plusieurs commits (ex. un par fonction terminée). C'est même mieux : si on casse quelque chose, on revient à la veille. Mais **le commit de fin de sprint + son étiquette** est obligatoire.

---

## PARTIE C — Dépannage

| Problème | Solution |
|---|---|
| `fatal: not a git repository` | Vous n'êtes pas à la racine `E:\Tantsaha_Connect`, ou `git init` n'a pas été fait |
| `rejected ... fetch first` au push | Le dépôt GitHub contient quelque chose que vous n'avez pas (README créé par erreur). Dites-le-moi, ne forcez pas |
| J'ai commité un `.env` par erreur | **Ne poussez pas.** Dites-le-moi tout de suite. S'il est déjà poussé : changer les secrets, puis nettoyer l'historique |
| Je veux voir l'historique | `git log --oneline` |
| Je veux annuler mes modifications d'un fichier **non commité** | `git restore chemin/du/fichier` (⚠️ définitif) |

## Idée bonus (facultative)
Sur GitHub, onglet **Issues → Milestones**, créez un jalon par sprint (« Sprint 3 », …) : vous cochez visuellement l'avancement. Utile pour le rapport.
