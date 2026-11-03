# Héberger gratuitement Tantsaha Connect

**Réponse courte : oui, tout peut tourner gratuitement pour un projet de cette taille**, avec des limites à connaître.
⚠️ Les offres gratuites **changent souvent**. Les chiffres ci-dessous viennent de recherches du 2026-11-03 (parfois de blogs, pas de la documentation officielle) : **vérifiez la page officielle avant de vous engager** (Sprint 10).

## Ce qu'il faut héberger

| Pièce | Rôle | Solution gratuite possible | Limites à connaître |
|---|---|---|---|
| **Site admin** (`web/`, fichiers statiques) | Pages du back-office | Netlify, Cloudflare Pages, Vercel ou GitHub Pages | Aucune gênante ; Vercel « Hobby » = usage non commercial |
| **Serveur** (`server/`, Node) | API, météo, synchro | **Render** (offre gratuite) | S'**endort après ~15 min** sans visite ; réveil ≈ 30 à 60 s ; ~750 h/mois |
| **Base PostgreSQL** | Données | **Neon** (offre gratuite) | 0,5 Go, 100 heures de calcul/mois, s'endort après 5 min d'inactivité |
| **Application Android** | Installation sur téléphone | **EAS Build** gratuit + envoi du fichier `.apk` | ~30 builds/mois, file d'attente lente (parfois > 1 h) |
| **Météo** | Prévisions | **Open-Meteo** | Gratuit **non commercial** ; < 10 000 appels/jour (notre cache en fait quelques dizaines) |

### Pièges
- ❌ **La base PostgreSQL gratuite de Render est supprimée après 30 jours** → ne pas l'utiliser ; prendre Neon.
- ⚠️ Un serveur qui dort **ne gêne pas les paysans** grâce à l'offline-first : l'application marche sans lui et se synchronise plus tard. Seul le **premier appel** du jour est lent. On donnera à `api.js` un délai d'attente plus long (≥ 60 s) pour la synchro, et on garde la météo en cache sur le téléphone.
- ⚠️ Le **site admin** sera lent à la première connexion du jour (réveil du serveur) : on ajoutera un message « Réveil du serveur… ».
- ⚠️ Les **données mobiles des paysans** ne sont pas gratuites pour eux : les réponses de l'API sont volontairement minuscules.

## Ce qui coûte de l'argent (et qu'on évite)

| Dépense | Quand |
|---|---|
| Publication sur le **Play Store** de Google | Frais **uniques** (environ 25 $) — facultatif : on peut distribuer l'`.apk` directement (lien, WhatsApp, clé USB) |
| Publication sur l'**App Store** d'Apple | Abonnement annuel (environ 99 $) — **inutile** : les utilisateurs sont sur Android |
| Nom de domaine (`tantsaha.mg`…) | Facultatif ; l'hébergeur donne une adresse gratuite |
| Serveur qui ne dort jamais | À partir d'environ 7 $/mois chez Render — seulement si le projet devient réel |

## Plan recommandé

1. **Développement** : tout sur votre PC (gratuit).
2. **Sprint 10** : Neon (base) + Render (API) + Netlify ou Cloudflare Pages (site admin) + EAS Build (`.apk`).
3. **Si le projet vit vraiment** (vrais paysans, plusieurs régions) : passer à un serveur payant modeste et revoir la licence Open-Meteo (usage commercial).

## Sources consultées (à revérifier)
- Render : [livemy.app](https://livemy.app/blog/render-pricing), [kuberns.com](https://kuberns.com/blogs/is-render-good-for-production/), [costbench.com](https://costbench.com/software/developer-tools/render/free-plan)
- Neon : [FAQ Neon](https://neon.com/faqs/managed-postgres-databases-free-tier)
- Expo : [docs.expo.dev/billing/plans](https://docs.expo.dev/billing/plans/), [expo.dev/pricing](https://expo.dev/pricing.md)
- Open-Meteo : [open-meteo.com/en/terms](https://open-meteo.com/en/terms)
