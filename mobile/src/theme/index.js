// THÈME : toutes les couleurs et tailles de l'application au même endroit.
// Pour changer l'apparence, on modifie ici et tout l'application suit.
//
// Règle culturelle (cahier des charges C4) : le ROUGE est réservé au danger / à l'interdit.

export const colors = {
  primary: '#2e7d32',      // vert : validation, "ok", barre du haut
  primaryLight: '#e8f5e9',
  meteo: '#1565c0',        // bleu
  alertes: '#ef6c00',      // orange (pas rouge !)
  journal: '#6d4c41',      // brun
  conseils: '#f9a825',     // jaune
  danger: '#c62828',       // rouge : uniquement danger / interdit
  text: '#1b1b1b',
  textOnDark: '#ffffff',
  background: '#fafafa',
};

export const sizes = {
  text: 20,            // grand texte pour lecture facile
  title: 24,
  minTouch: 56,        // taille minimale d'un bouton (le minimum recommandé est 48)
  radius: 20,
  gap: 16,
};
