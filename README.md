# Parole — parcours de français A1 → B1

Application React + Vite pour étudier la conjugaison, écrire et pratiquer l'oral. Elle fonctionne sans compte ni backend. La progression, les réponses écrites et l'historique sont conservés dans le navigateur avec `localStorage`. Les enregistrements audio sont disponibles au téléchargement pendant la session et ne sont pas conservés après fermeture.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir l'adresse indiquée par Vite. Pour produire une version statique : `npm run build` (dossier `dist/`).

## Contenu

- 4 étapes progressives, de A1 à B1, avec 16 leçons et exemples ;
- exercices interactifs corrigés immédiatement ;
- atelier d'écriture avec sujets et brouillon sauvegardé ;
- pratique orale avec chronomètre et enregistrement facultatif ;
- programme hebdomadaire, progression et série de jours actifs.

La sauvegarde étant locale, effacer les données du navigateur réinitialise la progression. L'enregistrement nécessite l'autorisation du microphone et un navigateur compatible avec `MediaRecorder` (sur `localhost` ou HTTPS).
