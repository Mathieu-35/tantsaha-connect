# ADR 0007 — Météo : Open-Meteo, appelée par le serveur avec cache
- Statut : Accepté
- Date : 2026-11-03

## Contexte
Il faut une météo locale gratuite, légère en données mobiles, disponible même si la source tombe.

## Décision
Le **serveur** appelle **Open-Meteo** (gratuit, sans clé) pour la latitude/longitude de chaque région, garde le résultat dans `WeatherCache` et le renvoie au téléphone. Si Open-Meteo est injoignable, on renvoie le cache avec `stale: true`. Le téléphone garde la dernière réponse dans `weather_cache`.

## Alternatives
- *Le téléphone appelle Open-Meteo directement* : N téléphones = N appels (limite gratuite : moins de 10 000 par jour), pas de cache partagé. Écarté.
- *OpenWeatherMap* : clé à protéger, limites plus serrées. Écarté.

## Conséquences
- ✅ Quelques appels par jour au total, réponse minuscule pour le téléphone, cache commun.
- ⚠️ L'offre gratuite d'Open-Meteo est **non commerciale** et sous licence CC-BY : à revoir si le projet devient commercial ; mentionner la source dans l'application.
- ⚠️ Précision par **région** (pas par commune) pour l'instant.
