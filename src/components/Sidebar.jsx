import React, { useEffect, useState } from 'react';
import { BookOpen, ChevronDown, CircleUserRound, GitBranch, History, Home, Map, MessageCircle, PenLine, Sparkles, TextCursorInput, UserRound } from 'lucide-react';
import { ACCOUNT_NAV_ITEMS, NAV_ITEMS } from '../constants.js';
import { classNames } from '../lib/utils.js';

export function Sidebar({ currentStage, completedCount, percentage, view, navigate, totalLessons }) {
  const [accountOpen, setAccountOpen] = useState(['account', 'history'].includes(view));
  const navIcons = { home: Home, roadmap: Map, conjugate: TextCursorInput, grammar: BookOpen, write: PenLine, speak: MessageCircle, connectors: GitBranch };
  const accountIcons = { account: UserRound, history: History };
  const isAccountArea = ['account', 'history'].includes(view);

  useEffect(() => {
    if (isAccountArea) setAccountOpen(true);
  }, [isAccountArea]);

  return <aside className="sidebar">
    <button className="brand" onClick={() => navigate('home')} aria-label="Accueil Parole"><span className="brand-mark">P</span><span>parole<span className="brand-dot">.</span></span></button>
    <div className="sidebar-label">TON PARCOURS</div>
    <nav aria-label="Navigation principale">
      {NAV_ITEMS.map(([id, label]) => { const Icon = navIcons[id]; return <button key={id} className={classNames('nav-link', view === id && 'active')} onClick={() => navigate(id)}><span aria-hidden="true"><Icon size={18} strokeWidth={1.8} /></span>{label}</button>; })}
      <div className={classNames('account-nav-group', isAccountArea && 'in-section')}>
        <div className={classNames('account-nav-parent', isAccountArea && 'active')}>
          <button className={classNames('nav-link', 'account-nav-link', isAccountArea && 'active')} onClick={() => navigate('account')} aria-current={view === 'account' ? 'page' : undefined}>
            <span className="account-nav-icon" aria-hidden="true"><CircleUserRound size={18} strokeWidth={1.8} /></span>
            <span className="account-nav-label">Compte</span>
          </button>
          <button className="account-nav-toggle" type="button" aria-label={accountOpen ? 'Réduire le menu Compte' : 'Développer le menu Compte'} aria-expanded={accountOpen} aria-controls="account-navigation" onClick={() => setAccountOpen((open) => !open)}><ChevronDown size={16} aria-hidden="true" /></button>
        </div>
        {accountOpen && <div className="account-subnav" id="account-navigation">{ACCOUNT_NAV_ITEMS.map(([id, label]) => { const Icon = accountIcons[id]; return <button key={id} className={classNames('account-subnav-link', view === id && 'active')} onClick={() => navigate(id)} aria-current={view === id ? 'page' : undefined}><Icon size={15} strokeWidth={1.8} />{label}</button>; })}</div>}
      </div>
    </nav>
    <div className="sidebar-card">
      <span className="little-label">NIVEAU ACTUEL</span><strong>{currentStage.level}</strong><p>{currentStage.title}</p>
      <div className="mini-progress" aria-label={`${percentage}% du parcours terminé`}><span style={{ width: `${percentage}%` }} /></div>
      <small>{completedCount} / {totalLessons} leçons</small>
    </div>
    <p className="sidebar-footer">Un pas à la fois.<br />Tu progresses. <Sparkles size={13} aria-hidden="true" /></p>
  </aside>;
}
