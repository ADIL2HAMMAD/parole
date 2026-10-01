import React from 'react';
import { LogIn, LogOut, PanelLeftClose, PanelLeftOpen, SlidersHorizontal } from 'lucide-react';

export function Topbar({ name, user, authConfigured, authLoading, onSignIn, onSignOut, navigate, sidebarCollapsed, toggleSidebar }) {
  return <header className="topbar">
    <div className="mobile-brand"><span className="brand-mark">P</span> parole<span className="brand-dot">.</span></div>
    <div className="topbar-actions">
      <button className="level-access" type="button" onClick={() => navigate('roadmap')} aria-label="Choisir mon niveau de travail" title="Choisir mon niveau"><SlidersHorizontal size={16} aria-hidden="true" /><span>Choisir mon niveau</span></button>
      {user ? <>
        <button className="avatar" title="Mon profil" onClick={() => navigate('account')} aria-label="Ouvrir mon compte">{(user.displayName || name)?.trim()?.[0]?.toUpperCase() || 'A'}</button>
        <button className="auth-icon-btn" type="button" onClick={onSignOut} title="Se déconnecter" aria-label="Se déconnecter"><LogOut size={17} /></button>
      </> : <button className="login-btn" type="button" onClick={onSignIn} disabled={!authConfigured || authLoading}><LogIn size={16} />{authLoading ? 'Connexion…' : 'Se connecter'}</button>}
    </div>
  </header>;
}
