import React, { useEffect, useState } from 'react';
import { Check, LogIn, LogOut, Save, UserRound } from 'lucide-react';
import { PageIntro } from '../components/PageIntro.jsx';

export function AccountView({ profile, user, authConfigured, authLoading, onSignIn, onSignOut, updateProgress, onSaved }) {
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => setForm(profile), [profile]);

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const save = (event) => {
    event.preventDefault();
    updateProgress((current) => ({ ...current, profile: { ...current.profile, ...form } }));
    setSaved(true);
    onSaved();
  };

  return <div className="page account-page">
    <PageIntro className="account-intro" eyebrow="MON ESPACE" title="Mon compte" description="Connecte-toi pour retrouver ton parcours personnel sur tous tes appareils." mark={<><UserRound size={34} /><span>mon<br />parcours</span></>} />
    {!user && <section className="account-auth-card">
      <div className="form-icon"><UserRound size={20} /></div>
      <div><h2>Enregistre ton parcours</h2><p>{authConfigured ? 'Connecte-toi avec Google. Ta progression sera enregistrée séparément et liée à ton compte.' : 'La connexion Google sera disponible après la configuration de Firebase.'}</p></div>
      <button className="primary-btn" type="button" disabled={!authConfigured || authLoading} onClick={onSignIn}><LogIn size={16} /> {authLoading ? 'Vérification…' : 'Continuer avec Google'}</button>
    </section>}
    {user && <div className="account-layout">
      <aside className="account-summary"><div className="account-monogram">{(user.displayName || form.name || 'A').trim()?.[0]?.toUpperCase()}</div><h2>{user.displayName || form.name || 'Ton profil'}</h2><p>{user.email}</p><button className="text-btn account-signout" type="button" onClick={onSignOut}><LogOut size={15} /> Se déconnecter</button></aside>
      <form className="account-form" onSubmit={save}>
        <div className="form-heading"><span className="form-icon"><UserRound size={19} /></span><div><h2>Informations personnelles</h2><p>Ces informations sont enregistrées dans ton compte.</p></div></div>
        <label>Prénom ou nom d’usage<input name="name" value={form.name || ''} onChange={change} placeholder="Ton prénom" /></label>
        <label>Adresse e-mail<input type="email" value={user.email || form.email || ''} readOnly /></label>
        <div className="form-actions"><button className="primary-btn" type="submit"><Save size={15} /> Enregistrer</button>{saved && <span className="save-confirmation"><Check size={15} /> Enregistré</span>}</div>
      </form>
    </div>}
  </div>;
}
