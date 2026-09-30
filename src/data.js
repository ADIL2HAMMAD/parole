export const stages = [
  {
    id: 'bases', number: '01', level: 'A1–A2', title: 'Les fondations', color: 'peach', icon: '☀', duration: 'Semaines 1 à 3',
    description: 'Construis des phrases simples et parle de ton quotidien avec confiance.',
    lessons: [
      { id: 'present', title: 'Le présent', category: 'Conjugaison', time: '12 min', explanation: 'Le présent sert à parler de ce qui se passe maintenant et de tes habitudes. Commence par être, avoir, aller et faire, puis entraîne-toi avec les verbes réguliers.', examples: ['Je suis développeur.', 'Nous avons une réunion.', 'Je travaille chaque matin.'], tip: 'Avec les verbes en -er : je parle, tu parles, il parle, nous parlons, vous parlez, ils parlent.', question: 'Nous ___ le français chaque jour.', choices: ['étudie', 'étudions', 'étudient'], answer: 1 },
      { id: 'articles', title: 'Articles et accords', category: 'Grammaire', time: '10 min', explanation: 'Le nom et l’adjectif s’accordent en genre et en nombre. Choisis aussi l’article qui convient au nom.', examples: ['Un petit projet.', 'Une petite équipe.', 'Des projets intéressants.'], tip: 'Regarde d’abord le nom : il t’aide à choisir un ou une, le ou la, et la bonne forme de l’adjectif.', question: 'C’est ___ idée intéressante.', choices: ['un', 'une', 'des'], answer: 1 },
      { id: 'questions', title: 'Questions et négation', category: 'Grammaire', time: '10 min', explanation: 'Pour poser une question, utilise où, quand, comment ou pourquoi. Pour nier, place ne et pas autour du verbe.', examples: ['Où habites-tu ?', 'Je ne comprends pas.', 'Pourquoi apprends-tu le français ?'], tip: 'À l’oral, on entend souvent « je sais pas ». À l’écrit, écris « je ne sais pas ».', question: 'Quelle phrase est correcte à l’écrit ?', choices: ['Je ne parle pas.', 'Je parle ne pas.', 'Je pas parle.'], answer: 0 },
      { id: 'prepositions', title: 'Prépositions utiles', category: 'Vocabulaire', time: '8 min', explanation: 'Les prépositions permettent de situer une personne, un objet ou une action.', examples: ['Je vais à Casablanca.', 'Je travaille chez Xelops.', 'Le livre est dans mon sac.'], tip: 'Apprends chaque préposition dans une phrase complète plutôt que dans une liste isolée.', question: 'Je travaille ___ une entreprise.', choices: ['dans', 'sur', 'vers'], answer: 0 },
    ],
  },
  {
    id: 'temps', number: '02', level: 'A2', title: 'Raconter et prévoir', color: 'blue', icon: '◔', duration: 'Semaines 4 à 6',
    description: 'Parle de ce que tu as fait, de tes habitudes passées et de tes projets.',
    lessons: [
      { id: 'passe', title: 'Le passé composé', category: 'Conjugaison', time: '14 min', explanation: 'Le passé composé raconte une action terminée. Il se forme avec avoir ou être au présent et un participe passé.', examples: ['Hier, j’ai travaillé.', 'Je suis allé au bureau.', 'Nous avons terminé le projet.'], tip: 'Plusieurs verbes de déplacement utilisent être : aller, venir, partir, arriver.', question: 'Hier, j’___ un article.', choices: ['lis', 'ai lu', 'vais lire'], answer: 1 },
      { id: 'futur', title: 'Le futur proche', category: 'Conjugaison', time: '10 min', explanation: 'Pour parler d’un projet proche, utilise aller au présent puis le verbe à l’infinitif.', examples: ['Je vais réviser ce soir.', 'Nous allons voyager.', 'Elle va appeler demain.'], tip: 'Conjugue seulement aller : le deuxième verbe reste à l’infinitif.', question: 'Demain, nous ___ étudier.', choices: ['allons', 'avons', 'sommes'], answer: 0 },
      { id: 'imparfait', title: 'Découvrir l’imparfait', category: 'Conjugaison', time: '12 min', explanation: 'L’imparfait décrit une habitude, un décor ou une situation dans le passé.', examples: ['Quand j’étais petit, je jouais dehors.', 'Avant, je prenais le bus.'], tip: 'Distingue le décor de l’action : « Il pleuvait quand je suis sorti. »', question: 'Avant, je ___ souvent à vélo.', choices: ['vais', 'allais', 'irai'], answer: 1 },
      { id: 'connecteurs', title: 'Relier ses idées', category: 'Expression', time: '9 min', explanation: 'Les connecteurs t’aident à raconter dans l’ordre et à expliquer une cause.', examples: ['D’abord, je travaille. Ensuite, je rentre.', 'J’étudie parce que je veux progresser.'], tip: 'Commence avec et, mais, parce que, puis, ensuite et après.', question: 'Je révise ___ j’ai un entretien.', choices: ['parce que', 'ensuite', 'mais'], answer: 0 },
    ],
  },
  {
    id: 'ecrit', number: '03', level: 'A2–B1', title: 'Écrire avec clarté', color: 'lavender', icon: '✎', duration: 'Semaines 7 à 9',
    description: 'Organise tes idées pour rédiger un message, un récit ou une opinion.',
    lessons: [
      { id: 'structure', title: 'Structurer un texte', category: 'Expression écrite', time: '12 min', explanation: 'Un texte clair contient une introduction, deux ou trois idées illustrées, puis une conclusion.', examples: ['Je vais présenter mon projet.', 'D’abord, je décris son objectif. Ensuite, je donne un exemple.', 'Enfin, je résume mon avis.'], tip: 'Commence par 60 à 80 mots. Augmente progressivement jusqu’à 150 mots.', question: 'Quelle partie présente le sujet ?', choices: ['La conclusion', 'L’introduction', 'Un exemple'], answer: 1 },
      { id: 'message', title: 'Écrire un message', category: 'Expression écrite', time: '10 min', explanation: 'Adapte ton ton au destinataire. Dans un message professionnel, indique l’objet, ta demande et une formule de fin.', examples: ['Bonjour Madame,', 'Je vous écris au sujet de notre rendez-vous.', 'Merci pour votre retour. Cordialement,'], tip: 'Avant d’envoyer, vérifie que ta demande est claire et que les accords sont justes.', question: 'Quelle formule convient à un courriel professionnel ?', choices: ['Salut mec !', 'Cordialement,', 'À plus !'], answer: 1 },
      { id: 'opinion', title: 'Donner son opinion', category: 'Expression écrite', time: '11 min', explanation: 'Annonce ton avis, donne une raison, puis ajoute un exemple concret.', examples: ['À mon avis, la lecture est utile.', 'En effet, elle enrichit le vocabulaire.', 'Par exemple, je découvre de nouvelles expressions.'], tip: 'Une idée + une raison + un exemple : cette structure fonctionne aussi à l’oral.', question: 'Quelle expression introduit un exemple ?', choices: ['Cependant', 'Par exemple', 'Enfin'], answer: 1 },
      { id: 'revision', title: 'Se relire efficacement', category: 'Méthode', time: '8 min', explanation: 'Après avoir écrit, vérifie une chose à la fois : le sens, les verbes, les accords et la ponctuation.', examples: ['Ai-je répondu au sujet ?', 'Les temps sont-ils cohérents ?', 'Chaque phrase a-t-elle un point ?'], tip: 'Garde une liste de tes trois erreurs fréquentes et surveille-les dans chaque texte.', question: 'Que faut-il vérifier en premier ?', choices: ['Le sens du texte', 'Le nombre de virgules', 'La police'], answer: 0 },
    ],
  },
  {
    id: 'oral', number: '04', level: 'B1', title: 'S’exprimer à l’oral', color: 'mint', icon: '◌', duration: 'Semaines 10 à 12',
    description: 'Parle plus longtemps, exprime ton avis et gagne en fluidité.',
    lessons: [
      { id: 'decrire', title: 'Décrire une situation', category: 'Expression orale', time: '10 min', explanation: 'Présente d’abord le contexte, puis deux détails visibles et enfin ton impression.', examples: ['Sur cette image, je vois une équipe.', 'À gauche, deux personnes discutent.', 'L’ambiance semble agréable.'], tip: 'Enregistre une description d’une minute, puis réécoute-la.', question: 'Par quoi commencer une description ?', choices: ['Le contexte général', 'Une conclusion', 'Une liste de mots'], answer: 0 },
      { id: 'resumer', title: 'Résumer un contenu', category: 'Expression orale', time: '12 min', explanation: 'Après une courte vidéo ou un texte, formule l’idée principale et deux informations importantes avec tes propres mots.', examples: ['Ce document parle de…', 'L’idée principale est…', 'J’ai retenu deux points…'], tip: 'Ne répète pas chaque détail : un résumé doit rester court et fidèle au contenu.', question: 'Un bon résumé contient surtout…', choices: ['Tous les mots du texte', 'L’idée principale', 'Ton avis uniquement'], answer: 1 },
      { id: 'argumenter', title: 'Répondre et justifier', category: 'Expression orale', time: '12 min', explanation: 'Réponds clairement à une question, explique pourquoi et ajoute un exemple.', examples: ['Je préfère travailler en équipe.', 'Cela m’aide à échanger des idées.', 'Par exemple, nous résolvons les problèmes plus vite.'], tip: 'Utilise « à mon avis », « parce que » et « par exemple » pour développer ta réponse.', question: 'Après « je pense que », que peux-tu ajouter ?', choices: ['Une raison', 'Une autre question', 'Rien'], answer: 0 },
      { id: 'prononciation', title: 'Écouter et répéter', category: 'Prononciation', time: '10 min', explanation: 'Lis quelques phrases à voix haute, écoute ta voix et répète en imitant le rythme d’un locuteur francophone.', examples: ['Je voudrais améliorer mon français.', 'Aujourd’hui, je présente mon projet.', 'Est-ce que vous pouvez répéter ?'], tip: 'Travaille une seule difficulté à la fois : les sons, les liaisons ou l’intonation.', question: 'Pour progresser, il vaut mieux…', choices: ['S’enregistrer et se réécouter', 'Parler très vite', 'Éviter de parler'], answer: 0 },
    ],
  },
];

export const allLessons = stages.flatMap((stage) => stage.lessons.map((lesson) => ({ ...lesson, stageId: stage.id, stageTitle: stage.title })));

export const writingPrompts = [
  { id: 'routine', title: 'Ma journée', level: 'A1', instruction: 'Décris ta journée habituelle : le matin, l’après-midi et le soir.', target: 60, starters: ['Le matin, je…', 'Ensuite, je…', 'Le soir, je…'] },
  { id: 'yesterday-tomorrow', title: 'Hier et demain', level: 'A2', instruction: 'Raconte ce que tu as fait hier et ce que tu vas faire demain.', target: 80, starters: ['Hier, j’ai…', 'Puis, je…', 'Demain, je vais…'] },
  { id: 'work-study', title: 'Mon travail ou mes études', level: 'A2', instruction: 'Présente ton activité, une tâche que tu aimes et une difficulté.', target: 100, starters: ['Je travaille / J’étudie…', 'J’aime… parce que…', 'Par exemple, …'] },
  { id: 'remote-work', title: 'Une opinion personnelle', level: 'B1', instruction: 'Le travail à distance est-il une bonne idée ? Donne ton avis, une raison et un exemple.', target: 120, starters: ['À mon avis, …', 'En effet, …', 'Par exemple, …'] },
];

export const speakingPrompts = [
  { id: 'introduce', title: 'Présente-toi', level: 'A1', duration: 60, instruction: 'Dis ton nom, ta ville, ton activité et une chose que tu aimes.', guide: ['Je m’appelle…', 'J’habite à…', 'J’aime…'] },
  { id: 'day', title: 'Raconte ta journée', level: 'A2', duration: 90, instruction: 'Décris ce que tu as fait hier en suivant l’ordre des événements.', guide: ['D’abord…', 'Ensuite…', 'Enfin…'] },
  { id: 'project', title: 'Parle d’un projet', level: 'A2', duration: 90, instruction: 'Présente un projet que tu vas réaliser et explique pourquoi.', guide: ['Je vais…', 'Parce que…', 'Pour commencer…'] },
  { id: 'opinion', title: 'Donne ton avis', level: 'B1', duration: 120, instruction: 'Préféres-tu travailler seul ou en équipe ? Donne une raison et un exemple.', guide: ['À mon avis…', 'Parce que…', 'Par exemple…'] },
];

export const weeklyPlan = [
  ['Lundi', 'Conjugaison', 'Apprends une règle et écris cinq phrases pour l’utiliser.'],
  ['Mardi', 'Écoute et vocabulaire', 'Écoute dix minutes et relève cinq expressions utiles.'],
  ['Mercredi', 'Expression écrite', 'Rédige un texte court dans l’atelier d’écriture.'],
  ['Jeudi', 'Expression orale', 'Enregistre une réponse d’une à deux minutes.'],
  ['Vendredi', 'Prononciation', 'Lis à voix haute et répète des phrases utiles.'],
  ['Samedi', 'Révision', 'Revois tes leçons et réutilise trois expressions.'],
  ['Dimanche', 'Pause active', 'Regarde un contenu en français pour le plaisir.'],
];
