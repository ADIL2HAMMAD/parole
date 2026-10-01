import React from 'react';
import { ArrowRight, BookOpenCheck, CalendarCheck, FileText, PenLine } from 'lucide-react';
import { allLessons } from '../data.js';

function formatDate(key) {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' }).format(new Date(`${key}T12:00:00`));
}

export function AccountHistoryView({ progress, navigate }) {
  const completedLessons = allLessons.filter((lesson) => progress.completed.includes(lesson.id));
  const completedPractices = Object.values(progress.dailyTasks).reduce((total, tasks) => total + Object.keys(tasks).filter((id) => tasks[id]).length, 0);
  const written = Object.values(progress.writing).filter(Boolean).length;
  const days = [...progress.activeDays].reverse();
  return <div className="page history-page">
    <section className="page-intro"><p className="eyebrow">MON ACTIVITÉ</p><h1>Historique du compte</h1><p>Retrouve les repères de ton apprentissage, mis à jour au fil de tes séances.</p></section>
    <section className="history-stats"><div><BookOpenCheck /><b>{completedLessons.length}</b><span>leçons terminées</span></div><div><CalendarCheck /><b>{days.length}</b><span>jours actifs</span></div><div><PenLine /><b>{written}</b><span>textes rédigés</span></div><div><FileText /><b>{completedPractices}</b><span>pratiques validées</span></div></section>
    <section className="history-panel"><div className="history-heading"><div><p className="eyebrow">DERNIÈRES SÉANCES</p><h2>Ton rythme récent</h2></div><button className="text-btn" onClick={() => navigate('week')}>Voir ma semaine <ArrowRight size={14} /></button></div>{days.length ? <div className="activity-list">{days.slice(0, 12).map((day) => { const practices = Object.values(progress.dailyTasks[day] || {}).filter(Boolean).length; return <div className="activity-row" key={day}><span className="activity-dot" /><b>{formatDate(day)}</b><span>{practices ? `${practices} pratique${practices > 1 ? 's' : ''} validée${practices > 1 ? 's' : ''}` : 'Session d’apprentissage'}</span></div>; })}</div> : <div className="history-empty"><BookOpenCheck size={26} /><p>Ton historique apparaîtra ici dès ta première séance.</p></div>}</section>
  </div>;
}
