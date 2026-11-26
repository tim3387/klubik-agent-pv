# Guide · Cloner son image et sa voix (HeyGen + ElevenLabs)

> Notes tirées du guide « Crée ton clone HeyGen + ElevenLabs » (IA Lab Club), réécrites pour Klubik. Option pour Timothé : produire des vidéos sans se filmer. Se fait dans les applications HeyGen et ElevenLabs (pas dans Claude Code). Le clone ne doit être fait que de sa propre image et de sa propre voix.

## Pourquoi
Plus de « mauvaise tête » ni de tournage à chaque vidéo : une qualité constante, des vidéos en quelques minutes, et la possibilité de confier la vidéo à quelqu'un de l'équipe.

## Les étapes
1. **Abonnement HeyGen** : un plan avec export 1080p minimum pour une seule personne ; un plan « business » pour plusieurs avatars.
2. **Créer l'avatar** : Avatars → « + » → *Clone a real person* → *Skip to upload*.
3. **La vidéo source** (c'est l'étape qui décide de la qualité) :
   - caméra 1080p au moins (un iPhone suffit) ; sur iPhone, **désactiver le HDR**, sinon les couleurs sortent ratées ;
   - trépied, lumière douce et homogène sur le visage, fond propre et uni (éviter les fonds en tissu), haut de couleur unie qui contraste avec le fond ;
   - filmer 2 à 3 minutes en regardant l'objectif, en parlant naturellement de sa journée ou de son activité ; gestes habituels mais **aucun geste au-dessus de la poitrine**, sans doigts devant le visage.
4. **Options d'envoi** : suppression d'arrière-plan (facultatif), 4K si plan Pro et film en 4K, suppression du bruit (peu utile si la voix vient d'ElevenLabs), **protection d'identité toujours activée**. Puis *Create Avatar* (le traitement est long, c'est normal).
5. **Vérification d'identité** : clic sur « Needs verification », lecture d'un court texte à l'écran.
6. **La voix ElevenLabs** : créer une clé (onglet Developers → API Keys, **sans restriction ni limite de crédits**), la coller dans HeyGen (nom de l'avatar → New voice → Third party voice → ElevenLabs), importer sa voix clonée et la définir par défaut.
7. **La première vidéo** : Create → AI Studio, coller le script, vérifier que la voix affichée est « ElevenLabs multilingual », accent d'origine, vitesse 1, volume 100 %.
8. **Réglages avancés de la voix** : modèle Multilingual V2, similarité 75 %, stabilité 65 à 70 %, style 0,12 pour commencer, *speaker boost* activé.
9. **Règle des 4 lignes** : ne pas coller un long script d'un coup ; découper une minute en 4 ou 5 segments de 4 lignes au plus, qui s'enchaînent bien.
10. **Corriger l'audio** : retirer des virgules pour fluidifier les pauses, reformuler une phrase qui s'enchaîne mal, jouer sur la ponctuation et les majuscules, tester les sigles.
11. **Générer** : moteur *Avatar 4* (le plus réaliste), MP4, 25 images par seconde, 4K si disponible. Si un geste paraît bizarre, régénérer (Avatar 3) ou modifier le script. **Ne jamais publier une vidéo brute** : ajouter du B-roll ou des visuels sur les passages à corriger.

## Dans le flux de Klubik
La vidéo du clone est un **rush** comme un autre : Timothé la dépose dans son Drive, le Créateur de contenu la monte (sous-titres, cartes, plan bleu, fin logo) ou l'habille en motion design. La clé ElevenLabs sert aussi aux effets sonores (`banque-de-sons.md`) et à la transcription de Video-Use.
