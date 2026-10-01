import React, { useEffect, useState } from 'react';
import { Check, Save, Target, UserRound } from 'lucide-react';

export function AccountView({ profile, updateProgress, onSaved }) {
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
    <section className="page-intro"><p className="eyebrow">MON ESPACE</p><h1>Mon compte</h1><p>Garde tes informations et ton objectif d’apprentissage à jour.</p></section>
    <div className="account-layout">
      <aside className="account-summary"><div className="account-monogram">{form.name?.trim()?.[0]?.toUpperCase() || 'A'}</div><h2>{form.name || 'Ton profil'}</h2><p>{form.email || 'Ajoute ton adresse e-mail'}</p><span><Target size={15} /> {form.goal || 'Objectif à définir'}</span></aside>
      <form className="account-form" onSubmit={save}>
        <div className="form-heading"><span className="form-icon"><UserRound size={19} /></span><div><h2>Informations personnelles</h2><p>Ces informations restent sur cet appareil.</p></div></div>
        <label>Prénom ou nom d’usage<input name="name" value={form.name || ''} onChange={change} placeholder="Ton prénom" /></label>
        <label>Adresse e-mail<input type="email" name="email" value={form.email || ''} onChange={change} placeholder="toi@exemple.com" /></label>
        <label>Objectif quotidien<select name="goal" value={form.goal || ''} onChange={change}><option>20 à 30 min / jour</option><option>45 à 60 min / jour</option><option>Plus d’1 h / jour</option></select></label>
        <div className="form-actions"><button className="primary-btn" type="submit"><Save size={15} /> Enregistrer</button>{saved && <span className="save-confirmation"><Check size={15} /> Enregistré</span>}</div>
      </form>
    </div>
  </div>;
}
