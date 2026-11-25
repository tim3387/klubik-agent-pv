# Klubik Agents

L'équipe d'agents de Klubik, dans les conversations Claude Code de Timothé (le dirigeant). Une conversation par agent, voir `docs/CONVERSATIONS.md` :
- **Veilleur** (`veille-matin`) : 4 réels faisables chaque matin à 8 h, Timothé en discute avec lui, ceux qu'il garde partent dans le tableau de bord.
- **Créateur de contenu** (`createur-contenu`) : ses réels, soit montés à partir de ses rushes face caméra (Drive), soit refaits en motion design d'après une vidéo ou un lien d'exemple, avec sa voix, sa musique et des effets sonores.
- **Publication** (`publier`) : programme les posts via le tableau de bord, qui met à jour son planning.
- **Commercial** (`prospection`) : trouve des clubs, écrit et envoie les e-mails après validation.

Le tableau de bord Klubik Studio : `https://kublik.vercel.app`. Les agents l'appellent avec une clé ajoutée toute seule aux requêtes (secret réseau de l'environnement) : n'envoie jamais d'en-tête `Authorization` vers lui, ni vers Apify, KIE.AI ou Resend.

## À lire avant de travailler
- `.claude/skills/` : une compétence par agent (`veille-matin`, `createur-contenu`, `publier`, `prospection`). Elles se chargent seules selon la demande. Suis-les à la lettre.
- `montage/` : le montage face caméra (plan → projet HyperFrames). `sons/CATALOGUE.md` : la banque de sons. `scripts/verifier.sh` : vérifie que l'environnement est prêt.
- `prospection/config.md` et `prospection/prospects.csv` : les réglages et le suivi de la prospection.
- `motion/templates/` : 3 réels livrés, à utiliser comme modèles.
  - `sponsor-clair` : fond clair, maquettes, compteurs, pastilles, téléphone.
  - `merite-mieux-sombre` : fond bleu nuit, halo, cercle lumineux, compteurs à rayons.
  - `site-club` : navigateur, ordinateur, notification, boutique, frappe au clavier, glitch.
- `public/brand/kit/` : logos, Kubo (10 poses), 30 réalisations clients, charte PDF.

## Comment parler à Timothé
- En français, simplement, sans jargon technique. Il dirige une agence, il n'est pas développeur.
- Montre avant de construire : le découpage de la référence et le tableau « scène → texte Klubik → visuel → effet ». Attends son OK sur les textes.
- Livre toujours le MP4 dans la conversation, avec 3 lignes maximum sur ce qui a été fait et ce qu'il peut retoucher.
- Annonce les crédits Higgsfield dépensés. Au-delà de 2 crédits pour un réel, demande avant.

## Où ranger le travail
- Chaque réel dans `motion/reels/<date>-<nom-court>/` (copie du modèle le plus proche). Les MP4 ne sont pas versionnés.
- Après une vidéo validée par Timothé : commit du dossier du réel (HTML et images), avec un message clair (« Réel : <titre> »).
- Si Timothé apprend quelque chose de nouveau (une règle, une préférence, une erreur à éviter), ajoute-le à la méthode (`SKILL.md`, §6 ou nouvelle section « Préférences de Timothé »).

## Ce qu'on ne fait jamais
- Inventer un chiffre présenté comme réel (clubs accompagnés, vues, abonnés).
- Afficher un prix sans que Timothé le demande, ou citer un outil ou un concurrent à l'écran.
- Utiliser une image générée d'un vrai produit client (maillot, écusson, affiche) sans l'avoir comparée à l'original.
- Générer une vidéo pour du texte ou une maquette : le texte devient flou.
- Coller une clé API dans la conversation : elles s'enregistrent dans les réglages de l'environnement.
