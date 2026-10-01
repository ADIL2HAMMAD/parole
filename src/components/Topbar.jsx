import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export function Topbar({ activeDays, name, navigate }) {
  return <header className="topbar">
    <div className="mobile-brand"><span className="brand-mark">P</span> parole<span className="brand-dot">.</span></div>
    <div className="topbar-actions">
      <button className="level-access" type="button" onClick={() => navigate('roadmap')} aria-label="Choisir mon niveau de travail" title="Choisir mon niveau"><SlidersHorizontal size={16} aria-hidden="true" /><span>Choisir mon niveau</span></button>
      <button className="avatar" title="Mon profil" onClick={() => navigate('account')} aria-label="Ouvrir mon compte">{name?.trim()?.[0]?.toUpperCase() || 'A'}</button>
    </div>
  </header>;
}
