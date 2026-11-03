// Réglages de l'application.
//
// API_URL = l'adresse du serveur.
// ⚠️ Sur un vrai téléphone, "localhost" désigne le téléphone lui-même, PAS votre ordinateur !
// Il faut mettre l'adresse de votre PC sur le Wi-Fi, par exemple http://192.168.1.20:3000/api
// (trouvez-la avec la commande "ipconfig" dans un terminal, ligne "Adresse IPv4").
// On la règle dans le fichier mobile/.env (voir .env.example).

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';
