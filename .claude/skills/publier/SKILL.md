---
name: publier
description: Publier ou programmer un réel, une photo, un carrousel ou une story de Klubik sur Instagram et TikTok depuis la conversation, en passant par le tableau de bord pour que le planning se mette à jour. Utiliser dès que Timothé dit publier, programmer, poster, planifier, ou après la validation d'un réel.
---

# Publier et programmer

Tout passe par le **tableau de bord** (`https://kublik.vercel.app`) : il envoie la publication sur Instagram et TikTok **et** l'ajoute au planning. Ne publie jamais autrement, sinon le planning du tableau de bord ne le verra pas.

La clé d'accès est ajoutée toute seule aux requêtes vers `kublik.vercel.app`. N'envoie jamais d'en-tête `Authorization` toi-même.

## 1. Préparer
- **Le fichier** : le MP4 rendu (ou les JPEG/PNG d'un carrousel). MP4 ou MOV, 1 Go au maximum ; images JPEG ou PNG, 8 Mo au maximum.
- **La légende** : proposes-en une, au ton Klubik (tutoiement, courte, 3 à 5 hashtags utiles, un appel à l'action vers klubik.pro). 2 200 caractères au maximum. Fais-la valider.
- **Les comptes** : `GET /api/agent/accounts`. Ne garde que ceux où `ready` vaut true. Si un compte n'est pas prêt : « Reconnecte ton compte <plateforme> dans Réglages → Publication du tableau de bord. »
- **Le moment** : `GET /api/agent/planning?days=14` pour voir ce qui est déjà prévu. Propose un créneau libre. Les heures sont en heure de Paris.

## 2. Déposer le fichier
1. `POST /api/publications/uploads` avec `{"files":[{"name":"reel.mp4","type":"video/mp4","size":<octets>}]}`.
2. La réponse donne pour chaque fichier un `path` et une `url` de dépôt signée.
3. Envoie le fichier : `curl -fsS -X PUT -H "Content-Type: video/mp4" --data-binary @reel.mp4 "<url>"`.
   - Si l'envoi est refusé par le réseau : l'adresse du stockage (`<projet>.supabase.co`) doit être ajoutée aux domaines autorisés de l'environnement. Préviens Robin.

## 3. Publier ou programmer
`POST /api/publications/own` avec :

```json
{
  "kind": "post",
  "caption": "<légende validée>",
  "media": [{"path": "<path>", "type": "video", "mime": "video/mp4", "size": <octets>}],
  "accountIds": ["<id instagram>", "<id tiktok>"],
  "when": "date",
  "date": "2026-11-27T18:00",
  "consent": true
}
```

- `kind` : `post` (une vidéo ou une photo), `carousel` (2 à 10 photos), `story` (Instagram uniquement).
- `when` : `now`, `queue` (prochain créneau de la file) ou `date`, avec `date` en heure de Paris, au moins 5 minutes plus tard.
- `consent: true` est **obligatoire pour TikTok**. Avant de l'envoyer, demande à Timothé : « Je confirme la publication sur TikTok ? ».

## 4. Confirmer
Réponds en une ligne : « Programmé jeudi 27/11 à 18 h sur Instagram et TikTok. Il apparaît dans le planning du tableau de bord. »

## Erreurs fréquentes
| Réponse | Que dire ou faire |
|---|---|
| 409 « vient déjà d'être envoyée » | Ne réessaie pas : c'est un doublon. |
| « Choisissez un moment dans au moins 5 minutes » | Propose un créneau plus tard. |
| « doit être reconnecté » | Timothé reconnecte le compte dans Réglages → Publication. |
| 503 « pas encore activée » | Prévenir Robin. |

## Règles
- Ne publie jamais sans que Timothé ait validé la légende, les comptes et l'heure.
- Une seule publication par demande : en cas de doute après une erreur réseau, regarde `GET /api/agent/planning` avant de réessayer.
