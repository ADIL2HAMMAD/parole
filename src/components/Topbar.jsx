import React from 'react';
import { Flame } from 'lucide-react';

export function Topbar({ activeDays }) {
  return <header className="topbar">
    <div className="mobile-brand"><span className="brand-mark">P</span> parole<span className="brand-dot">.</span></div>
    <div className="streak"><span aria-hidden="true"><Flame size={15} fill="currentColor" /></span><b>{activeDays}</b> jour{activeDays > 1 ? 's' : ''} actif{activeDays > 1 ? 's' : ''}</div>
    <div className="avatar" title="Mon profil">A</div>
  </header>;
}
