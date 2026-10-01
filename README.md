# Parole — parcours de français A1 → B1

Application React + Vite pour étudier la conjugaison, écrire et pratiquer l'oral. Elle fonctionne sans compte ni backend. La progression, les réponses écrites et l'historique sont conservés dans le navigateur avec `localStorage`. Les enregistrements audio sont disponibles au téléchargement pendant la session et ne sont pas conservés après fermeture.

## Comptes Google et progression synchronisée

L’application prend en charge Google Sign-In via Firebase. Lorsqu’une personne se connecte, ses données sont enregistrées dans Firestore sous `users/{uid}` : elles ne sont donc jamais partagées avec un autre compte. Sans connexion, l’application continue de fonctionner en mode invité avec une sauvegarde locale.

1. Créez un projet dans la [Firebase Console](https://console.firebase.google.com/), puis ajoutez une application Web.
2. Dans **Authentication > Sign-in method**, activez **Google**. Ajoutez vos domaines de production dans **Authentication > Settings > Authorized domains**.
3. Créez une base **Cloud Firestore**, puis déployez le contenu de `firestore.rules` comme règles de sécurité.
4. Copiez `.env.example` en `.env` et renseignez les valeurs de configuration de l’application Firebase.
5. Redémarrez `npm run dev` après toute modification de `.env`.

Les valeurs `VITE_FIREBASE_*` identifient l’application Web et peuvent être livrées au navigateur. Les règles Firestore sont ce qui empêche un utilisateur de lire ou d’écrire les données d’un autre utilisateur.

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
