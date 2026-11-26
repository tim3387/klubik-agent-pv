# Guide · Design et montage vidéo avec Claude Code (HyperFrames + Video-Use)

> Notes tirées du module « Ajouter du design sur tes vidéos avec l'IA » (IA Lab Club), réécrites pour Klubik. Le PDF d'origine est un contenu payant : il n'est pas copié ici.

## Deux outils, deux rôles
| Outil | Rôle | Il faut |
|---|---|---|
| **HyperFrames** (HeyGen) | Le **design ajouté** : titres animés, lower thirds, notifications de réseaux sociaux, transitions, graphiques, sous-titres stylisés. Il filme une page HTML animée et en fait un MP4. | Node 22+, ffmpeg |
| **Video-Use** (`github.com/browser-use/video-use`) | Le **montage** des rushes bruts : coupe les « euh », les blancs, les faux départs, ajoute des sous-titres, un étalonnage et des fondus audio de 30 ms, puis vérifie lui-même chaque coupe. | Python, ffmpeg, **une clé ElevenLabs** (transcription mot à mot) |

Le modèle ne regarde pas la vidéo : il lit la transcription mot à mot (quelques Ko de texte), ce qui rend le montage rapide et fiable. Les deux outils se complètent : Video-Use monte, HyperFrames habille.

**Dans Klubik** : HyperFrames est déjà installé (`motion/`). Le montage face caméra Klubik passe par `scripts/montage/build.ts` (style exact des réels de référence). Video-Use est une **option** pour dégrossir de longs rushes (couper hésitations et silences) avant ce montage ; il demande une clé ElevenLabs et n'a pas encore été essayé ici.

## HyperFrames en 3 commandes
```
npx hyperframes init ma-video     # crée le dossier du projet
npx hyperframes preview           # aperçu navigateur qui se met à jour
npx hyperframes render            # le MP4 final
```
Réflexe : itérer en aperçu, ne rendre qu'une fois à la fin (le rendu est le moment lourd). Dans ce dépôt, utiliser `lint` avant chaque rendu et `--quality draft` pour les brouillons.

## Lire une composition
Une composition est une page HTML. Les attributs qui comptent :
- `data-start` : la seconde où l'élément apparaît ;
- `data-duration` : combien de temps il reste ;
- `data-track-index` : l'ordre de superposition (0 = au fond) ;
- `data-width` / `data-height` : 1920×1080 en paysage, **1080×1920 en vertical** ;
- `data-volume` : 0 à 1 (0,5 = musique discrète).
Même entrée = même sortie : idéal pour des séries avec le même gabarit.

## Le catalogue de blocs prêts à l'emploi
`npx hyperframes add <nom>` installe un bloc du catalogue (hyperframes.heygen.com/catalog). Exemples cités par le module : `instagram-follow` (notification « Follow »), `tiktok-follow`, `yt-lower-third`, `flash-through-white` (transition), `data-chart` (graphique animé), `logo-outro` (révélation du logo). `npx hyperframes catalog` les liste. Un nom ou une étiquette (par exemple `captions`) installe plusieurs blocs d'un coup. À essayer pour les notifications et les transitions avant de recoder.

## Piloter avec des phrases
Quatre types de demandes qui marchent : partir de rien (« crée une intro de 10 s avec un titre en fondu, une vidéo de fond et de la musique »), un format précis (« hook vertical 9:16, sous-titres qui rebondissent, narration »), itérer comme avec un monteur (« titre 2× plus gros, mode sombre, fondu de sortie »), un montage ciblé (« coupe de 0:30 à 0:45, sous-titres à 3 mots par segment »).

Trois règles : **donner le format dès le début** (16:9, 9:16, 1:1), **préciser les temps clés** (« titre à 0:03, outro de 3 s »), **itérer petit** (un changement à la fois, on regarde, on ajuste). Mode autonomie : « exécute tout de A à Z sans me demander de confirmation, montre-moi le résultat final » (à réserver aux tâches bien cadrées).

## Les quatre pipelines du module
1. **Talking head** : montage serré, sous-titres brûlés, intro logo (2 s), lower third nom + titre à 0:05, outro appel à l'action (3 s).
2. **Reel / TikTok hook** : montage serré, sous-titres qui rebondissent, titre cinétique d'ouverture (1,5 s), zooms et transitions flash, sticker animé sur les phrases fortes.
3. **Tutoriel produit** : enregistrement d'écran + face caméra, chapitres animés (« 01 · Installation »), zooms sur l'écran, lower thirds avec les commandes.
4. **Traitement par lot** d'une vidéo de formation : remplacement de voix, sous-titres, renommage.

Règle d'or : ne pas demander « est-ce que Claude peut faire X ? », demander de faire X.
