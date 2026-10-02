import React from 'react';
import { ArrowRight, BookOpen, Check, Mic, PenLine, Sparkles, Flame, Target, Trophy, CalendarDays } from 'lucide-react';
import { progressLabel, todayKey } from '../lib/utils.js';

export function HomeView({ name, progress, nextLesson, currentStage, completedLessons, totalLessons, percentage, navigate, onPractice }) {
  const displayName = (name || 'ami').trim();
  const completed = completedLessons;
  const completedToday = Object.values(progress.dailyTasks[todayKey()] || {}).filter(Boolean).length;
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return { key, label: date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', ''), active: progress.activeDays.includes(key), tasks: Object.values(progress.dailyTasks[key] || {}).filter(Boolean).length };
  });
  const weeklySessions = weekDays.reduce((total, day) => total + day.tasks, 0);
  const quickLinks = [
    { label: 'Mon parcours', detail: 'Voir les étapes', icon: Target, tone: 'peach', action: () => navigate('roadmap') },
    { label: 'Écrire', detail: 'Un prompt guidé', icon: PenLine, tone: 'blue', action: () => navigate('write') },
    { label: 'Parler', detail: 'Pratiquer à l’oral', icon: Mic, tone: 'mint', action: () => navigate('speak') },
    { label: 'Ma semaine', detail: 'Organiser mes sessions', icon: CalendarDays, tone: 'lavender', action: () => navigate('week') },
  ];
  return <div className="page home-page">
    <section className="home-dashboard-head"><div className="hero"><p className="eyebrow">MON ESPACE D’APPRENTISSAGE</p><h1>Bonjour, {displayName} <span aria-hidden="true"><Sparkles size={24} /></span></h1><p className="hero-copy">Aujourd’hui, avance avec intention. Une petite session suffit pour garder ton élan.</p><div className="hero-meta"><span>Objectif : <b>45 à 60 min / jour</b></span><span className="dot-sep">•</span><span>Cette semaine : <b>{progressLabel(completed)}</b></span></div></div><div className="streak-card"><span className="streak-icon"><Flame size={18} /></span><div><small>SÉRIE ACTUELLE</small><strong>{progress.activeDays.length} jours</strong><span>Continue comme ça</span></div></div></section>
    <section className="kpi-grid" aria-label="Mes indicateurs"><button type="button" className="kpi-card kpi-card-link" onClick={() => navigate('roadmap')} aria-label="Voir mon parcours"><span className="kpi-icon peach"><Trophy size={17} /></span><div><small>PARCOURS TERMINÉ</small><strong>{percentage}%</strong><span>{completed} leçon{completed !== 1 ? 's' : ''} validée{completed !== 1 ? 's' : ''} sur {totalLessons}</span></div></button><div className="kpi-card"><span className="kpi-icon blue"><BookOpen size={17} /></span><div><small>NIVEAU ACTUEL</small><strong>{currentStage.level}</strong><span>{currentStage.title}</span></div></div><div className="kpi-card"><span className="kpi-icon mint"><Check size={17} /></span><div><small>AUJOURD’HUI</small><strong>{completedToday}/3</strong><span>pratiques terminées</span></div></div><div className="kpi-card"><span className="kpi-icon lavender"><Target size={17} /></span><div><small>PROCHAINE ÉTAPE</small><strong>{nextLesson.time}</strong><span>{nextLesson.category}</span></div></div></section>
    <section className="activity-panel" aria-label="Activité des sept derniers jours"><div className="activity-head"><div><p className="eyebrow">TON RYTHME</p><h2>Activité cette semaine</h2></div><div className="activity-total"><strong>{weeklySessions}</strong><span>sessions</span></div></div><div className="activity-chart">{weekDays.map((day) => <div className="activity-day" key={day.key}><span className="activity-value">{day.tasks || (day.active ? 1 : 0)}</span><div className="activity-track"><i className={day.active ? 'active' : ''} style={{ height: `${Math.max(day.tasks, day.active ? 1 : 0) * 28}%` }} /></div><small>{day.label}</small></div>)}</div></section>
    <section className="quick-access"><div className="quick-heading"><p className="eyebrow">ACCÈS RAPIDE</p><span>Choisis ta prochaine action</span></div><div className="quick-links">{quickLinks.map(({ label, detail, icon: Icon, tone, action }) => <button key={label} className={`quick-link ${tone}`} onClick={action}><span className="quick-link-icon"><Icon size={18} /></span><span><b>{label}</b><small>{detail}</small></span><ArrowRight size={15} /></button>)}</div></section>
  </div>;
}
