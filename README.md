# Klubik Agents : installation

Ce dossier devient le dépôt GitHub privé `klubik-agents` de Timothé. Il contient ses 4 agents (Veilleur, Créateur de contenu, Publication, Commercial), sa marque et ses modèles de réels. Compter **1 heure** la première fois.

## Ce que contient le dépôt
| Dossier | Rôle |
|---|---|
| `.claude/skills/` | les 4 agents : `veille-matin`, `createur-contenu` (qui publie aussi avec `publier`), `prospection` |
| `docs/guides/` | les guides : montage HyperFrames et Video-Use, génération vidéo IA, checklist avant un réel, clone HeyGen + ElevenLabs, **banque de sons** |
| `sons/` | la bibliothèque de sons (index et fichiers) |
| `montage/`, `motion/` | le moteur de montage face caméra et les 3 réels modèles |
| `public/brand/kit/` | logos, Kubo, réalisations, charte |
| `prospection/` | réglages et suivi des prospects (données privées : dépôt privé obligatoire) |

## 0. Côté tableau de bord (Robin, une fois)
1. Dans Vercel → projet Klubik Studio → Settings → Environment Variables, ajouter **`AGENT_API_TOKEN`** pour Production. Valeur : une longue chaîne aléatoire d'au moins 32 caractères, par exemple le résultat de `openssl rand -hex 32`.
2. Redéployer.
3. Garder cette valeur pour l'étape 4 : c'est la clé des agents. Elle n'ouvre que la veille, les idées, les publications, les comptes et le planning.

## 1. Le dépôt GitHub
Créer le dépôt privé `klubik-agents` et y envoyer tout ce dossier, y compris le dossier caché `.claude/`.

## 2. Claude Code
Sur claude.ai/code (abonnement Pro ou Max), connecter GitHub, puis créer l'environnement **« Klubik Agents »** avec le dépôt `klubik-agents`.

## 3. Le réseau de l'environnement
Niveau « Limited », **Allow package managers** coché. Domaines autorisés :

| Domaine | Pour |
|---|---|
| `kublik.vercel.app` | le tableau de bord |
| `<projet>.supabase.co` (l'adresse « Project URL » de Supabase) | déposer les vidéos à publier |
| `*.fbcdn.net`, `*.cdninstagram.com` | les vidéos Instagram |
| `tiktok.com`, `www.tiktok.com`, `*.tiktokcdn.com`, `*.tiktokcdn-us.com`, `*.tiktokv.com` | les vidéos TikTok |
| `upload.higgsfield.ai`, `d2ol7oe51mr4n9.cloudfront.net`, `d8j0ntlcm91z4.cloudfront.net` | les images et sons Higgsfield |
| `drive.google.com`, `drive.usercontent.google.com` | ses fichiers Drive |

`api.apify.com`, `api.kie.ai` et `api.resend.com` sont autorisés automatiquement quand on enregistre leur clé (étape 4).

Dans **Setup script** de l'environnement, ajouter cette ligne (elle installe l'outil de rendu vidéo à chaque démarrage) :

```
for d in */motion; do [ -f "$d/package.json" ] && (cd "$d" && npm install --no-audit --no-fund); done
```

## 4. Les clés (secrets réseau de l'environnement)
Dans les réglages de l'environnement → **Network secrets** (ou, dans une conversation : « Enregistre ma clé <service> », et Claude ouvre un formulaire sécurisé) :

| Hôte | Clé | En-tête |
|---|---|---|
| `kublik.vercel.app` | `AGENT_API_TOKEN` (étape 0) | Authorization: Bearer |
| `api.apify.com` | clé Apify de Timothé | Authorization: Bearer |
| `api.kie.ai` | clé KIE.AI | Authorization: Bearer |
| `api.resend.com` | clé Resend (droit « envoi » seulement) | Authorization: Bearer |

**Jamais de clé collée dans une conversation.**

## 5. Les connecteurs claude.ai
Paramètres → Connecteurs : **Google Drive** (obligatoire) et **Higgsfield** (obligatoire : transcription des tournages, images premium, effets sonores).

Pour que le Créateur télécharge ses rushes sans clé, les dossiers du Drive de Timothé (tournages, « Voix », « Musiques ») sont partagés en « Tout le monde disposant du lien ».

## 6. Resend (pour le Commercial)
1. Compte sur resend.com, puis ajouter et **vérifier le domaine** `klubik.pro` : les enregistrements DNS se font chez l'hébergeur du site.
2. Créer une clé avec le seul droit « Sending access », puis l'enregistrer à l'étape 4.
3. Compléter `prospection/config.md` : expéditeur, adresse de réponse, zone, volume.

## 7. Les conversations
Suivre `docs/CONVERSATIONS.md` : la tâche planifiée du Veilleur, puis une conversation pour le Créateur de contenu (qui publie aussi) et une pour le Commercial.

## 8. Tests

> Pour une première session guidée, colle le prompt de `docs/PROMPT-CREATEUR.md` : il fait vérifier l'installation, puis tester le motion design, le face caméra, le son et la publication, étape par étape.

0. **Vérifier l'environnement** : `bash scripts/verifier.sh` doit afficher « Tout est prêt ».
1. **Veilleur** : lancer la tâche planifiée à la main, une fois. Les idées arrivent, et un « oui » apparaît dans le Studio.
2. **Créateur de contenu** : refaire un réel d'exemple (motion design), puis monter une courte vidéo face caméra. Les MP4 arrivent dans la conversation.
3. **Publication** : programmer ce réel dans 1 heure. Il apparaît dans le planning du tableau de bord, et on le supprime ensuite si besoin.
4. **Commercial** : préparer 3 e-mails sans les envoyer, puis en envoyer un à ta propre adresse.
