# ADR 0003 — React Native (Expo) pour le mobile, React (Vite) pour le web
- Statut : Accepté
- Date : 2026-11-03

## Contexte
Choix du développeur : React / React Native et Node.js. Test sur iPhone (Expo Go) alors que les utilisateurs cibles sont sur Android.

## Décision
- **Mobile** : React Native avec **Expo** (JavaScript), navigation avec React Navigation. Expo évite d'installer Android Studio / Xcode et permet de tester avec Expo Go.
- **Web admin** : application **React + Vite** séparée (`web/`). Le site est un tableau de bord de gestion ; React Native Web n'apporterait rien.
- **JavaScript** (pas TypeScript) pour réduire la charge d'apprentissage.

## Alternatives
- *React seul (site web responsive)* : pas d'accès fiable hors ligne aux notifications locales, à SQLite ni à l'audio. Écarté pour le mobile.
- *Flutter / natif* : autre langage à apprendre. Écarté.
- *Expo Router* : possible, mais React Navigation est déjà en place et suffit.

## Conséquences
- ✅ Même langage partout.
- ⚠️ Expo Go n'est qu'un outil de test : l'application finale Android sera construite avec **EAS Build** (Sprint 10). Certaines fonctions (notifications) se comportent différemment dans Expo Go.
