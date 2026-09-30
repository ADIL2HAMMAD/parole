export const STORE = 'parole-francais-v2';
export const EMPTY_PROGRESS = { completed: [], answers: {}, writing: {}, activeDays: [], dailyTasks: {} };

export const NAV_ITEMS = [
  ['home', 'Accueil'],
  ['roadmap', 'Parcours'],
  ['conjugate', 'Conjuguer'],
  ['write', 'Écrire'],
  ['speak', 'Parler'],
  ['week', 'Semaine'],
];

export const DAILY_PRACTICES = [
  { id: 'write', color: 'rose', title: 'Écrire quelques phrases', text: 'Décris ta journée en cinq phrases.', time: '10 min', view: 'write' },
  { id: 'speak', color: 'sky', title: 'Parler à voix haute', text: 'Réponds à une question pendant une minute.', time: '10 min', view: 'speak' },
  { id: 'listen', color: 'yellow', title: 'Écouter et répéter', text: 'Lis et répète trois phrases utiles.', time: '5 min' },
];
