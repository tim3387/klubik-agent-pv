# Audit : références, montage et motion design (13/11/2026)

Ce qui a été fait pour les réels Klubik depuis le début du projet, ce qui marche, ce qui manque, et ce qu'on garde pour le consulting de Timothé.

## 1. Les références

| Source | Ce qu'on en a tiré | État |
|---|---|---|
| Les 11 réels Klubik livrés le 29/10 (face caméra) | `docs/STYLE-REELS.md` : décor bleu nuit, sous-titres mot à mot, accroche géante, cartes, fin logo sur noir, tutoiement | ✅ base du Monteur |
| Réels concurrents (veille) | Analyses `ReelAnalysis` par Claude, à partir des données de la veille | ✅ en place, coût faible (~0,02 $ par réel) |
| Réels « motion design » de @connectedsportsclub (2 refaits) | Récupération du lien, lecture image par image, transposition Klubik | ✅ méthode validée, 2 vidéos livrées |

**Ce qui marche**
- Récupérer un réel depuis son lien : Apify donne la légende, la durée et l'adresse de la vidéo, puis Higgsfield télécharge la vidéo.
- Regarder un réel : une planche de 40 images (2 par seconde) suffit à relever chaque scène, chaque texte et chaque mouvement.
- Transposer, pas copier : même structure, même rythme, mêmes effets, mais le contenu, les couleurs, les visuels et les chiffres sont ceux de Klubik.

**Ce qui manque**
- Les chiffres des concurrents (« +50 clubs », « 6,6 M de vues ») ne s'appliquent pas à Klubik. On a mis les vrais chiffres de l'offre (3 maillots, 10 templates, 3 mois de calendrier). **Il faut de vrais chiffres Klubik** (clubs accompagnés, vues, délais) pour les réels de preuve.
- Il n'existe pas encore de bibliothèque des réels de référence classés par format (texte animé, maquettes, compteurs…). Chaque nouveau lien repart de zéro.

## 2. Le montage dans le tableau de bord

| Brique | Rôle | Bilan |
|---|---|---|
| Monteur (face caméra) | Rushes → plan de montage → rendu au style Klubik | Fonctionne, mais encore jamais utilisé en vrai ce mois-ci |
| « Refaire ce réel » (automatique) | Claude écrit l'animation, le rendu se fait sur Vercel | A fonctionné, mais **coûteux et fragile** : 11 $ en une journée, réponses coupées à la limite, retouches ratées |
| Corrections du 10/11 | Retouches par modifications ciblées, cache, effort bas, plafonds de dépense | Coût d'une version passé de ~0,80 $ à ~0,28 $, plafonds en place |

**Décision du 12/11 : le motion design se fait dans la conversation Claude, plus dans l'appli.** L'appli garde le face caméra, la programmation et les performances.

Pourquoi c'est mieux dans la conversation :
- on voit chaque étape (planche, brouillon, rendu) ;
- on corrige à la phrase près ;
- on n'a ni limite de 5 minutes par appel, ni appel facturé en double ;
- le coût passe par l'abonnement Claude de Timothé, pas par la clé API.

## 3. Le motion design

### La méthode qui a donné les 2 vidéos livrées
1. **Récupérer** le réel (Apify + Higgsfield).
2. **Regarder** : planche contact à 2 images par seconde, puis découpage en scènes avec leur temps.
3. **Transposer** dans un tableau : scène → texte Klubik → visuel Klubik → effet.
4. **Construire** la vidéo en une seule page HTML animée (HyperFrames + GSAP), avec la charte Klubik.
5. **Monter en gamme** avec Higgsfield. On ne génère que des images photoréalistes (écusson brodé, maillot en studio, affiche au mur, fond en verre), à 0,25 crédit l'image. Jamais de vidéo générée pour du texte, qui deviendrait flou.
6. **Habiller le son** avec la bibliothèque d'effets libres de droits de Higgsfield (whoosh, impacts, clics), calés sur chaque animation.
7. **Contrôler** : planche du rendu, vérification de chaque scène, puis livraison du MP4.

Le parcours « motion design » de Higgsfield Katana recommande exactement cette méthode : le texte, les chiffres et les maquettes en code, les éléments photo en images générées.

### Qualité atteinte

| Critère | Réel 1 « Sponsor » (clair) | Réel 2 « Mérite mieux » (sombre) |
|---|---|---|
| Fidélité au rythme de la référence | ✅ | ✅ (mêmes 20 s, mêmes temps) |
| Charte Klubik (bleu, Montserrat, logo, Kubo) | ✅ | ✅ |
| Visuels réels de clients | ✅ maillots, affiches, templates | ✅ dans les téléphones |
| Finition premium (profondeur, grain, caméra) | ✅ version 2 | ✅ |
| Son | effets seuls | effets seuls |
| Voix | script écrit, enregistrement attendu | — |

### Les points faibles à corriger
1. **Pas de musique.** La banque de sons annoncée est introuvable (ni dans le dépôt, ni dans le Drive). Il faut un dossier « Musiques » dans le Drive, ou un service de musique libre de droits.
2. **La génération d'images peut modifier les visuels.** Sur le maillot en studio, Higgsfield a déplacé un logo. Il faut toujours comparer avec l'original avant d'utiliser une image générée d'un vrai produit client.
3. **Les réseaux** : il a fallu ouvrir à la main l'accès à Instagram, au service de récupération des réels et aux fichiers Higgsfield. Ces réglages sont à faire une fois dans l'environnement de Timothé.
4. **Pas encore de sous-titres** dans les réels motion. Il faudra les ajouter quand la voix de Timothé arrivera.
5. **Le rendu prend 1,5 à 2 minutes** par version de 20 s. Il faut prévoir un brouillon rapide avant le rendu final.

## 4. Ce qu'on garde pour Timothé

- **`motion/templates/sponsor-clair`** et **`motion/templates/merite-mieux-sombre`** : les deux réels livrés, prêts à servir de modèles (HTML, polices, visuels).
- **`.claude/skills/motion-klubik/SKILL.md`** : la méthode complète, chargée automatiquement par Claude dans ce dépôt.
- **`docs/motion/PROMPT-TIMOTHE.md`** : le prompt unique à lui donner.
- La charte et les visuels : `public/brand/kit/` (logos, Kubo, 30 réalisations).
