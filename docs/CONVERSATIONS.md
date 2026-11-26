# Les conversations de Timothé

Une conversation Claude Code par agent, toutes ouvertes sur le dépôt `klubik-agents` et dans l'environnement « Klubik Agents ». Chaque conversation garde son historique : Timothé y revient au lieu d'en recréer une.

## 1. Veilleur (tous les matins, automatique)

**À créer une fois : une tâche planifiée** sur claude.ai/code, menu « Scheduled » (ou « Routines »), puis « New » :
- **Nom** : Veille du matin
- **Dépôt et environnement** : `klubik-agents`, « Klubik Agents »
- **Fréquence** : tous les jours à 8 h (heure de Paris)
- **Notification** : sur le téléphone, activée
- **Message** :

```text
Lance la veille du matin (compétence veille-matin) : collecte, puis présente-moi mes 4 réels du jour au format habituel, et discutons-en avant d'envoyer quoi que ce soit au tableau de bord.
```

Chaque matin à 8 h, une nouvelle conversation s'ouvre avec 4 réels qu'il peut faire. Il en discute avec le Veilleur (questions, adaptations, ce qui ne lui plaît pas), puis, après son ok, les réels gardés apparaissent dans le Studio du tableau de bord.

## 2. Créateur de contenu

**Message de départ :**

```text
Tu es mon créateur de contenu (compétence createur-contenu). Je t'envoie soit mes vidéos face caméra du Drive (tu les montes), soit une vidéo d'exemple en motion design (tu la refais avec mes infos et mes couleurs). Mes fichiers sont dans mon Google Drive : « Klubik - Robin » pour la marque et les réalisations, « Voix » pour mes enregistrements, « Musiques » pour les sons. Lance scripts/verifier.sh, dis-moi si tout est prêt, puis attends ma première demande.
```

Ensuite :
- face caméra : « Monte mes vidéos du dossier “Tournage 12 novembre” » ;
- motion design : « Refais ce réel : <lien> » ou une vidéo glissée dans la conversation ;
- à partir d'une idée gardée le matin : « Fais le réel n°2 de ce matin ».

## 3. Publication (la même conversation que le Créateur)

Pas de conversation à part : le Créateur de contenu et la compétence `publier` vivent dans la **même** conversation. Quand un réel est validé, Timothé dit « Programme-le jeudi à 18 h » et l'agent le publie.

**Pour les posts sans vidéo à monter** (photos, carrousels, stories) ou pour voir le planning, il écrit dans la même conversation :

```text
Montre-moi ce qui est prévu sur les 14 prochains jours et les créneaux libres.
```

**Toute publication passe par le tableau de bord** (compétence `publier`), qui l'envoie à Zernio et l'ajoute à son planning. L'agent ne publie jamais directement avec le connecteur Zernio.

## 4. Commercial

**Avant la première fois** : compléter `prospection/config.md` avec Timothé (sports, zone, volume, expéditeur), et vérifier le domaine d'envoi dans Resend.

**Message de départ :**

```text
Tu es mon commercial (compétence prospection). Lis prospection/config.md. Trouve 15 clubs à contacter, montre-moi les e-mails proposés, et n'envoie rien avant mon ok.
```

Les fois suivantes : « Séance de prospection : 15 nouveaux clubs et les relances du jour. »

## Ce que Timothé ne doit jamais faire
- Coller une clé (tableau de bord, Apify, KIE.AI, Resend) dans une conversation : elles sont enregistrées dans les réglages de l'environnement.
- Publier directement sur Instagram ou TikTok depuis une conversation sans passer par la compétence `publier` : le planning ne le verrait pas.
