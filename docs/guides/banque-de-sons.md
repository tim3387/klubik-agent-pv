# Guide · La banque de sons de Klubik

## Ce qu'il y a vraiment dans les guides
La « banque de sons » des guides de l'IA Lab Club est le PDF **« 100 prompts d'effets sonores ElevenLabs »**. **Ce n'est pas une banque de fichiers audio** : c'est une liste de 100 descriptions (« chameau qui gémit au loin », « horloge qui tique à l'envers »…) à taper dans le générateur d'effets sonores d'ElevenLabs, qui fabrique le son. Elles sont presque toutes pensées pour du cinéma (Antiquité, guerre, fantaisie, dessins animés) : très peu servent un réel de sport. Les autres guides n'ont pas de sons. Le PDF n'est pas copié dans le dépôt (contenu payant) ; ses idées, adaptées à Klubik, sont plus bas.

Les sons de Klubik viennent donc de **quatre sources**, dans cet ordre :
1. **La bibliothèque locale** `sons/lib/` : les sons déjà générés ou choisis (voir `sons/CATALOGUE.md`). On la consulte toujours en premier : ça ne coûte rien.
2. **ElevenLabs, effets sonores** : on génère le son qui manque avec un prompt (§ plus bas), puis on le range dans la bibliothèque locale pour ne plus jamais le regénérer. Il faut la clé ElevenLabs de Robin ou de Timothé (secret réseau `api.elevenlabs.io`, en-tête `xi-api-key`).
3. **La bibliothèque libre de droits de Higgsfield** (`$HF_WORKFLOWS/katana/scripts/sfx_lib/`, dans le bac à sable) : whoosh, impacts, clics, glitchs, frappe de clavier. Gratuite.
4. **Le catalogue Epidemic Sound** via Higgsfield (`search_sound_effects` puis `download_sound_effect`) : un quota par téléchargement, pour un son précis seulement.

## Générer un son avec ElevenLabs
- Le générateur d'effets sonores de l'application ElevenLabs, ou son API : `POST https://api.elevenlabs.io/v1/sound-generation` avec un JSON `{"text": "<le prompt>", "duration_seconds": <0,5 à 22>, "prompt_influence": <0 à 1>}`, qui renvoie un fichier audio. **Lire la documentation à jour (elevenlabs.io/docs) avant le premier appel** : les paramètres peuvent avoir changé.
- Un prompt = **une scène sonore précise** : l'objet, l'action, le lieu, le caractère (« net », « grave », « avec écho »). Plus c'est concret, mieux c'est.
- Une durée courte pour un effet (0,5 à 2 s), plus longue pour une ambiance (5 à 10 s).
- Générer 2 ou 3 variantes, garder la meilleure, la nommer clairement et la ranger dans `sons/lib/<catégorie>/`, puis ajouter une ligne dans le catalogue.
- Chaque génération consomme des crédits ElevenLabs : générer seulement ce qui manque à la bibliothèque, par lots.

## Les prompts pour un réel de sport et de design
Écrits pour Klubik, dans l'esprit du PDF (le format « objet + action + lieu + caractère »). À adapter.

### Interface et animation (les plus utilisés)
| Moment du réel | Prompt | Durée |
|---|---|---|
| Entrée d'un titre | Whoosh court et net, passage rapide d'air | 0,6 s |
| Changement de scène | Grand whoosh grave qui passe d'une enceinte à l'autre | 1,2 s |
| Balayage de maquette | Glissement rapide d'un doigt sur une tablette, swipe doux | 0,5 s |
| Clic de bouton | Clic de souris doux et net, un seul | 0,3 s |
| Pastille cochée | Pop rond comme une bulle, positif | 0,4 s |
| Notification | Notification de téléphone discrète, deux notes montantes | 0,8 s |
| Compteur qui monte | Tic mécanique sec, répété à rythme régulier | 1 s |
| Validation | Petit carillon positif, trois notes qui montent | 1 s |
| Frappe de texte | Quelques touches de clavier d'ordinateur portable, rapides | 1,5 s |
| Chiffre qui apparaît | Impact doux et grave, comme un battement de sous-basse | 1 s |
| Flash | Flash d'appareil photo suivi d'un petit écho | 0,7 s |
| Glitch | Glitch numérique court, parasite électronique | 0,5 s |
| Montée vers un temps fort | Montée tendue de deux secondes qui finit en impact sec | 2 s |
| Retour en arrière | Rembobinage rapide d'une cassette | 1 s |
| Dossier de sponsoring | Page de papier épais qui se tourne dans un bureau calme | 0,8 s |
| Impression d'une affiche | Feuille qui glisse hors d'une imprimante, grand format | 1,5 s |
| Tampon | Tampon encreur qui s'abat sur du papier | 0,5 s |
| Livraison | Carton qui s'ouvre, ruban adhésif arraché | 1,2 s |
| Kubo salue | Petit bruit de peluche qui se secoue, clochette légère | 1 s |
| Fin sur le logo | Impact grave avec longue queue de réverbération, puis silence | 3 s |

### Sport et vie de club
| Moment | Prompt | Durée |
|---|---|---|
| But marqué | Ballon de handball au fond des filets, cris de joie d'une salle | 3 s |
| Ambiance de match | Gymnase plein, clameur et applaudissements de supporters, tambours | 8 s |
| Chant de supporters | Chant de supporters qui monte au loin dans une salle de sport | 5 s |
| Coup de sifflet | Coup de sifflet d'arbitre court et strident, gymnase | 0,7 s |
| Fin de match | Long coup de sifflet de fin de match, puis clameur | 3 s |
| Buzzer | Buzzer de fin de période de salle de sport | 1,5 s |
| Ballon au sol | Ballon de handball qui rebondit sur un parquet de gymnase, écho léger | 2 s |
| Dans le filet | Ballon qui frappe le filet d'un but, claquement net | 0,8 s |
| Arrêt du gardien | Ballon qui claque dans des gants de gardien | 0,6 s |
| Crissement | Baskets qui crissent sur un parquet | 1 s |
| Course | Pas rapides de joueurs sur un parquet, rythme de course | 2 s |
| Applaudissements | Applaudissements chaleureux d'une centaine de personnes | 4 s |
| Maillot | Frottement de tissu : un maillot qu'on enfile, froissement | 1 s |
| Vestiaire | Porte de casier métallique qui claque dans un vestiaire | 1 s |
| Sac de sport | Sac de sport lourd jeté sur un banc | 0,8 s |
| Gymnase vide | Ambiance d'un gymnase vide, écho léger et lointain | 8 s |

### Ce qu'on garde des 100 prompts du PDF
Quelques idées transposables : « impact de coup de poing dramatique avec écho » (plan bleu plein écran), « verre qui se fracasse au ralenti » (transition glitch), « battement de cœur qui ralentit » (suspense avant une révélation), « whoosh dramatique » (entrée de Kubo), « foule qui acclame avec écho » (preuve sociale). Le reste (Antiquité, guerre, fantaisie, dessin animé) ne colle pas à l'image de Klubik.

## Règles de mixage
Voix 0 dB · musique −18 dB sous la voix · effets −10 à −6 dB · crête finale ≤ −1 dB. Un effet à chaque entrée de texte ou de visuel, jamais plus d'un toutes les 0,3 s. Le mixage se fait dans le bac à sable Higgsfield (`adelay` + `amix`), détaillé dans la compétence `createur-contenu`.
