import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Check, ChevronRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, Phone, Sparkles } from 'lucide-react';

const friendlyError = (error) => {
  const messages = {
    'auth/invalid-credential': 'Adresse e-mail ou mot de passe incorrect.',
    'auth/email-already-in-use': 'Un compte existe déjà avec cette adresse e-mail.',
    'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
    'auth/invalid-phone-number': 'Utilisez un numéro complet, par exemple +212 6 12 34 56 78.',
    'auth/too-many-requests': 'Trop de tentatives. Réessayez dans quelques instants.',
  };
  return messages[error?.code] || 'La connexion a échoué. Vérifiez vos informations et réessayez.';
};

export function LoginView({ authConfigured, onGoogle, onEmail, onSendPhoneCode }) {
  const [method, setMethod] = useState('email');
  const [registering, setRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submitEmail = async (event) => {
    event.preventDefault();
    setBusy(true); setError('');
    try { await onEmail(email, password, registering); }
    catch (nextError) { setError(friendlyError(nextError)); }
    finally { setBusy(false); }
  };
  const submitPhone = async (event) => {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      if (confirmation) await confirmation.confirm(code);
      else setConfirmation((await onSendPhoneCode(phone, 'recaptcha-container')).confirmation);
    } catch (nextError) { setError(friendlyError(nextError)); }
    finally { setBusy(false); }
  };
  const google = async () => {
    setBusy(true); setError('');
    try { await onGoogle(); }
    catch (nextError) { if (nextError?.code !== 'auth/popup-closed-by-user') setError(friendlyError(nextError)); }
    finally { setBusy(false); }
  };

  return <main className="login-page">
    <section className="login-card" aria-label="Connexion à Parole">
      <aside className="login-art" aria-hidden="true">
        <div className="login-art-grain" />
        <div className="login-art-stamp">bonjour</div>
        <div className="login-art-sun" />
        <div className="login-art-book"><span>à</span><span>la</span><span>française</span></div>
        <div className="login-art-leaf leaf-one" />
        <div className="login-art-leaf leaf-two" />
        <div className="login-art-leaf leaf-three" />
        <div className="login-art-caption">un mot après l’autre</div>
      </aside>
      <section className="login-panel">
        <div className="login-brand"><span className="login-brand-mark"><BookOpen size={18} /></span><span>parole<span>.</span></span></div>
        <div className="login-heading">
          <p className="login-kicker">TON ESPACE D’APPRENTISSAGE</p>
          <h1>Bienvenue</h1>
          <p>Connectez-vous pour retrouver votre parcours de français.</p>
        </div>
        {!authConfigured && <p className="login-notice">La connexion n’est pas encore configurée. Ajoutez les variables Firebase pour ouvrir la plateforme.</p>}
        <div className="login-methods" role="tablist" aria-label="Méthode de connexion">
          <button type="button" role="tab" aria-selected={method === 'email'} className={method === 'email' ? 'active' : ''} onClick={() => { setMethod('email'); setError(''); }}><Mail size={15} /> E-mail</button>
          <button type="button" role="tab" aria-selected={method === 'phone'} className={method === 'phone' ? 'active' : ''} onClick={() => { setMethod('phone'); setError(''); }}><Phone size={15} /> Téléphone</button>
        </div>
        {method === 'email' ? <form className="login-form" onSubmit={submitEmail}>
          <label>Adresse e-mail<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" /></label>
          <label>Mot de passe<div className="password-field"><input type={showPassword ? 'text' : 'password'} required minLength="6" autoComplete={registering ? 'new-password' : 'current-password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Votre mot de passe" /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
          <div className="login-form-row"><label className="login-check"><input type="checkbox" /> <span>Se souvenir de moi</span></label>{!registering && <button className="login-link" type="button">Mot de passe oublié ?</button>}</div>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="login-submit" disabled={busy || !authConfigured}>{busy ? <LoaderCircle className="spin" size={18} /> : <LockKeyhole size={17} />}{registering ? 'Créer mon compte' : 'Se connecter'}</button>
          <p className="login-switch">{registering ? 'Vous avez déjà un compte ?' : 'Nouveau sur Parole ?'} <button type="button" onClick={() => { setRegistering((value) => !value); setError(''); }}>{registering ? 'Se connecter' : 'Créer un compte'}</button></p>
        </form> : <form className="login-form" onSubmit={submitPhone}>
          {!confirmation ? <label>Numéro de téléphone<input type="tel" required autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+212 6 12 34 56 78" /></label> : <><button type="button" className="login-back" onClick={() => { setConfirmation(null); setCode(''); }}><ArrowLeft size={15} /> Modifier le numéro</button><label>Code de vérification<input type="text" required inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" /></label><p className="login-help">Un code a été envoyé au {phone}.</p></>}
          {error && <p className="login-error" role="alert">{error}</p>}
          <button className="login-submit" disabled={busy || !authConfigured}>{busy ? <LoaderCircle className="spin" size={18} /> : <Phone size={17} />}{confirmation ? 'Valider le code' : 'Recevoir un code'}</button>
        </form>}
        <div className="login-divider"><span />ou continuer avec<span /></div>
        <button className="google-login" type="button" onClick={google} disabled={busy || !authConfigured}><span className="google-g">G</span> Continuer avec Google <ChevronRight size={17} /></button>
        <div id="recaptcha-container" />
        <p className="login-footer"><Sparkles size={14} /> Votre progression est enregistrée et synchronisée.</p>
      </section>
    </section>
  </main>;
}
