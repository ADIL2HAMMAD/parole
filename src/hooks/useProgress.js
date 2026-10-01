import { useEffect, useRef, useState } from 'react';
import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { EMPTY_PROGRESS, STORE } from '../constants.js';
import { db } from '../lib/firebase.js';
import { todayKey } from '../lib/utils.js';

function normalizeProgress(value) {
  if (!value || typeof value !== 'object') return { ...EMPTY_PROGRESS };
  const legacyWriting = typeof value.writing === 'string' ? { routine: value.writing } : value.writing;
  return {
    ...EMPTY_PROGRESS, ...value,
    completed: Array.isArray(value.completed) ? value.completed : [],
    answers: value.answers && typeof value.answers === 'object' ? value.answers : {},
    grammarCompleted: Array.isArray(value.grammarCompleted) ? value.grammarCompleted : [],
    grammarAnswers: value.grammarAnswers && typeof value.grammarAnswers === 'object' ? value.grammarAnswers : {},
    writing: legacyWriting && typeof legacyWriting === 'object' ? legacyWriting : {},
    activeDays: Array.isArray(value.activeDays) ? value.activeDays.slice(-60) : [],
    dailyTasks: value.dailyTasks && typeof value.dailyTasks === 'object' ? value.dailyTasks : {},
    profile: value.profile && typeof value.profile === 'object' ? { ...EMPTY_PROGRESS.profile, ...value.profile } : { ...EMPTY_PROGRESS.profile },
  };
}

function getStored() {
  try {
    const saved = localStorage.getItem(STORE) || localStorage.getItem('parole-francais-v1');
    return normalizeProgress(JSON.parse(saved || 'null'));
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

function newCloudProgress(user) {
  // Local guest data may be imported once only; a second new account must start clean.
  const migrationKey = `${STORE}-migrated-user`;
  const localProgress = localStorage.getItem(migrationKey) ? normalizeProgress(null) : getStored();
  return normalizeProgress({ ...localProgress, profile: {
    ...localProgress.profile,
    name: user.displayName || localProgress.profile.name,
    email: user.email || localProgress.profile.email,
  } });
}

// Guest progress stays in this browser. Signed-in progress is stored only at users/{uid}.
export function useProgress(user, authReady) {
  const [progress, setProgress] = useState(getStored);
  const [syncing, setSyncing] = useState(Boolean(db));
  const hydrated = useRef(false);
  const remoteUpdate = useRef(false);
  const cloudUser = user && db ? user : null;

  useEffect(() => {
    if (!authReady) return undefined;
    if (!cloudUser) {
      hydrated.current = false;
      setProgress(getStored());
      setSyncing(false);
      return undefined;
    }
    hydrated.current = false;
    setSyncing(true);
    const progressRef = doc(db, 'users', cloudUser.uid);
    return onSnapshot(progressRef, (snapshot) => {
      if (snapshot.exists() && snapshot.data().progress) {
        remoteUpdate.current = true;
        setProgress(normalizeProgress(snapshot.data().progress));
        hydrated.current = true;
        setSyncing(false);
        return;
      }
      // A first sign-in keeps this browser's existing progress, then isolates it under this uid.
      const initialProgress = newCloudProgress(cloudUser);
      setDoc(progressRef, { uid: cloudUser.uid, progress: initialProgress, updatedAt: serverTimestamp() })
        .then(() => localStorage.setItem(`${STORE}-migrated-user`, cloudUser.uid))
        .catch(() => setSyncing(false));
    }, () => setSyncing(false));
  }, [cloudUser?.uid, authReady]);

  useEffect(() => {
    if (!authReady || syncing) return;
    const today = todayKey();
    setProgress((current) => current.activeDays.includes(today)
      ? current
      : { ...current, activeDays: [...current.activeDays, today].slice(-60) });
  }, [authReady, syncing]);

  useEffect(() => {
    if (!authReady || syncing) return;
    if (!cloudUser) {
      localStorage.setItem(STORE, JSON.stringify(progress));
      return;
    }
    if (!hydrated.current || remoteUpdate.current) {
      remoteUpdate.current = false;
      return;
    }
    setDoc(doc(db, 'users', cloudUser.uid), { uid: cloudUser.uid, progress, updatedAt: serverTimestamp() }, { merge: true }).catch(() => undefined);
  }, [progress, cloudUser?.uid, authReady, syncing]);

  const updateProgress = (updater) => setProgress((current) => (
    typeof updater === 'function' ? updater(current) : { ...current, ...updater }
  ));

  const completePractice = (id) => {
    const today = todayKey();
    updateProgress((current) => ({
      ...current,
      dailyTasks: { ...current.dailyTasks, [today]: { ...current.dailyTasks[today], [id]: true } },
    }));
  };

  return { progress, updateProgress, completePractice, syncing };
}
