export const STORE = 'parole-francais-v3';
export const EMPTY_PROGRESS = {
  completed: [], answers: {}, grammarCompleted: [], grammarAnswers: {}, writing: {}, activeDays: [], dailyTasks: {},
  profile: { name: 'Adil', email: 'adil@example.com', learningStage: null },
};

export const NAV_ITEMS = [
  ['home', 'Accueil'],
  ['conjugate', 'Conjugaison'],
  ['grammar', 'Grammaire'],
  ['write', 'Écrire'],
  ['speak', 'Parler'],
  ['connectors', 'Connecteurs logiques', 'Connecteurs'],
];

export const ACCOUNT_NAV_ITEMS = [
  ['account', 'Mon profil'],
  ['history', 'Historique'],
];

export const DAILY_PRACTICES = [
  { id: 'write', color: 'rose', title: 'Écrire avec précision', text: 'Développe une idée dans un contexte professionnel.', time: '20 min', view: 'write' },
  { id: 'speak', color: 'sky', title: 'Prendre la parole', text: 'Explique un choix ou un problème à voix haute.', time: '20 min', view: 'speak' },
  { id: 'listen', color: 'yellow', title: 'Écouter et reformuler', text: 'Résume une vidéo ou un article avec tes propres mots.', time: '15 min' },
];
