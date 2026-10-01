import React from 'react';
import { Flame } from 'lucide-react';

export function Topbar({ activeDays, name, navigate }) {
  return <header className="topbar">
    <div className="mobile-brand"><span className="brand-mark">P</span> parole<span className="brand-dot">.</span></div>
    <button className="avatar" title="Mon profil" onClick={() => navigate('account')} aria-label="Ouvrir mon compte">{name?.trim()?.[0]?.toUpperCase() || 'A'}</button>
  </header>;
}
