import React from 'react';
import { CalendarDays, CircleUserRound, History, Home, Map, MessageCircle, PenLine, Sparkles, TextCursorInput } from 'lucide-react';
import { NAV_ITEMS } from '../constants.js';
import { classNames } from '../lib/utils.js';

export function Sidebar({ currentStage, completedCount, percentage, view, navigate, totalLessons }) {
  const navIcons = { home: Home, roadmap: Map, conjugate: TextCursorInput, write: PenLine, speak: MessageCircle, week: CalendarDays, account: CircleUserRound, history: History };
  return <aside className="sidebar">
    <button className="brand" onClick={() => navigate('home')} aria-label="Accueil Parole"><span className="brand-mark">P</span><span>parole<span className="brand-dot">.</span></span></button>
    <div className="sidebar-label">TON PARCOURS</div>
    <nav aria-label="Navigation principale">{NAV_ITEMS.map(([id, label]) => { const Icon = navIcons[id]; return <button key={id} className={classNames('nav-link', view === id && 'active')} onClick={() => navigate(id)}><span aria-hidden="true"><Icon size={18} strokeWidth={1.8} /></span>{label}</button>; })}</nav>
    <div className="sidebar-card">
      <span className="little-label">NIVEAU ACTUEL</span><strong>{currentStage.level}</strong><p>{currentStage.title}</p>
      <div className="mini-progress" aria-label={`${percentage}% du parcours terminé`}><span style={{ width: `${percentage}%` }} /></div>
      <small>{completedCount} / {totalLessons} leçons</small>
    </div>
    <p className="sidebar-footer">Un pas à la fois.<br />Tu progresses. <Sparkles size={13} aria-hidden="true" /></p>
  </aside>;
}
