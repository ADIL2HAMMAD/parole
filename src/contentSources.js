// Public, authoritative sources used to curate learning content.
// The content record is stored per account in Firestore so it can be refreshed
// independently for each learner instead of being compiled into the app bundle.
export const contentSources = [
  {
    name: 'Académie française — Questions de langue',
    url: 'https://www.academie-francaise.fr/questions-de-langue',
    language: 'fr',
    refresh: 'weekly',
    parser: 'academy-language-questions',
  },
];

export const contentSchemaVersion = 2;
