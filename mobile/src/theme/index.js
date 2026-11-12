// THÈME : toutes les couleurs, tailles et polices de l'application au même endroit.
// Pour changer l'apparence, on modifie ici et toute l'application suit.
//
// Palette de base : #2A7C13 · #76C457 · #FFF8CF · #FBE6C2
// + ocre (riz mûr, soleil) et bleu pluie, ajoutés au Sprint 9 pour la météo.
// Contrastes vérifiés (WCAG AA) — voir docs/DESIGN.md pour le tableau complet.
// Règle culturelle (cahier des charges C4) : le ROUGE est réservé au danger / à l'interdit.

export const colors = {
  primary: '#2A7C13',
  primaryPress: '#1E5A0E',
  accent: '#76C457',
  background: '#FFF8CF',
  surface: '#FBE6C2',
  text: '#1F2A17',
  textOnPrimary: '#FFFFFF',
  danger: '#C62828',
  dangerDark: '#9E1F1F',

  // Ajouts du Sprint 9
  ochre: '#E0A526', // riz mûr, soleil (texte foncé dessus)
  sand: '#F2C98A', // sable plus soutenu
  rain: '#2E6A8E', // bleu pluie (texte blanc dessus)
  rainSoft: '#8DBBD6',
  sky: '#C9E0EA',
  paper: '#FFFDF0', // « papier » des notes
  cream: '#FFF8CF',
};

export const sizes = {
  textSmall: 16, // minimum absolu
  textBody: 18,
  textLarge: 22,
  title: 28,
  minTouch: 48,
  radius: 16,
  radiusPill: 999,
  gap: 12,
  padding: 12,
};

// Polices (chargées dans App.js). Titres : Bricolage Grotesque. Texte : Atkinson Hyperlegible.
// Avec ces polices on N'utilise PAS fontWeight : la graisse est dans le nom de la police.
export const fonts = {
  title: 'BricolageGrotesque_800ExtraBold',
  titleMid: 'BricolageGrotesque_600SemiBold',
  body: 'AtkinsonHyperlegible_400Regular',
  bodyBold: 'AtkinsonHyperlegible_700Bold',
};
