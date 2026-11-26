# Guide · Les réglages de génération vidéo IA

> Notes tirées du guide « Les réglages de génération vidéo IA expliqués simplement » (IA Lab Club), réécrites pour Klubik. À lire avant toute génération avec Higgsfield (Seedance, Kling, Katana…).

**Principe** : la vidéo IA, ce n'est pas un bon prompt, c'est le **bon type d'entrée** pour le résultat voulu. Meilleure entrée = meilleure sortie.

| Mode | Ce que tu donnes | Quand | Attention |
|---|---|---|---|
| **Text to video** | du texte seulement | explorer des idées, tester un concept | peu de contrôle : le modèle invente tout |
| **Image to video** | une image à animer | quand on veut le contrôle : personnage, produit, scène | réussir **d'abord l'image** : image ratée = vidéo ratée |
| **Start frame** | la première image | verrouiller la composition d'ouverture | ne pas redécrire l'image dans le prompt : *l'image = ce qu'on voit, le prompt = ce qui bouge* |
| **End frame** | l'image finale | transitions, avant/après, révélation produit | start et end frames **cohérentes** entre elles, sinon morphing étrange |
| **Omni-reference** | plusieurs références à la fois (personnage, produit, lieu, style, pose/mouvement, audio ou voix off) | scènes complexes, publicités (Seedance) | plus la scène est complexe, plus le pack de références est utile |

**Mouvements de caméra** : se demander ce que fait la caméra, pas seulement ce qu'il y a dans la scène. Avance lentement (push in), recule (pull back), tourne autour du sujet (orbit), à la main (handheld), fixe sur trépied, suit la personne, plan serré, plan large, travelling de gauche à droite.

**Un mouvement simple** : un mouvement principal du sujet + un mouvement principal de caméra + une scène claire. Trop de choses à la fois (courir, sauter, changer de tenue, parler, caméra qui vole) fait glitcher et morpher. Un mouvement propre bat presque toujours un mouvement compliqué.

**Durée et plans** : les clips IA sont courts. Penser **plan par plan** : découper en scènes, un objectif clair par plan, monter ensemble ensuite (c'est le rôle d'HyperFrames et de ffmpeg).

**Exemple de pack de références (pub UGC)** : image du produit (le flacon reste fidèle), référence personnage (la personne reste cohérente), référence lieu ou style (réalisme de la cuisine, lumière), audio ou voix off (la scène se construit autour de ce qui est dit).

## Pour Klubik
- Les textes, chiffres et maquettes ne se génèrent **jamais** en vidéo : ils se codent (HyperFrames).
- On génère en vidéo seulement du **photoréaliste** : un joueur qui enfile le maillot, un ballon qui entre dans le but, un président qui feuillette un dossier. Image d'abord (start frame faite avec les vraies réalisations Klubik), puis animation d'un mouvement simple.
- Annoncer le coût avant tout : les vidéos coûtent bien plus que les images (0,25 crédit l'image).
