import { useEffect, useState } from 'react';
import { EMPTY_PROGRESS, STORE } from '../constants.js';
import { todayKey } from '../lib/utils.js';

function normalizeProgress(value) {
  if (!value || typeof value !== 'object') return { ...EMPTY_PROGRESS };
  const legacyWriting = typeof value.writing === 'string' ? { routine: value.writing } : value.writing;
  return {
    ...EMPTY_PROGRESS,
    ...value,
    completed: Array.isArray(value.completed) ? value.completed : [],
    answers: value.answers && typeof value.answers === 'object' ? value.answers : {},
    grammarCompleted: Array.isArray(value.grammarCompleted) ? value.grammarCompleted : [],
    grammarAnswers: value.grammarAnswers && typeof value.grammarAnswers === 'object' ? value.grammarAnswers : {},
    writing: legacyWriting && typeof legacyWriting === 'object' ? legacyWriting : {},
    activeDays: Array.isArray(value.activeDays) ? value.activeDays.slice(-60) : [],
    dailyTasks: value.dailyTasks && typeof value.dailyTasks === 'object' ? value.dailyTasks : {},
    profile: value.profile && typeof value.profile === 'object' ? { ...EMPTY_PROGRESS.profile, ...value.profile } : EMPTY_PROGRESS.profile,
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

export function useProgress() {
  const [progress, setProgress] = useState(getStored);

  useEffect(() => {
    const today = todayKey();
    setProgress((current) => current.activeDays.includes(today)
      ? current
      : { ...current, activeDays: [...current.activeDays, today].slice(-60) });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORE, JSON.stringify(progress));
  }, [progress]);

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

  return { progress, updateProgress, completePractice };
}
