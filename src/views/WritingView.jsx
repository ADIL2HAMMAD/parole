import React, { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, Lightbulb, LoaderCircle, ScanText, Sparkles, WandSparkles } from 'lucide-react';
import { writingPrompts } from '../data.js';
import { classNames, wordCount } from '../lib/utils.js';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const connectors = [
  { label: 'Ajouter', words: 'de plus · également · par ailleurs', example: 'De plus, cette solution réduit les erreurs.' },
  { label: 'Expliquer', words: 'car · en effet · puisque', example: 'Nous avons reporté la livraison, car le test n’était pas concluant.' },
  { label: 'Opposer', words: 'cependant · pourtant · en revanche', example: 'Le délai est court ; cependant, le périmètre est maîtrisé.' },
  { label: 'Conséquence', words: 'donc · ainsi · par conséquent', example: 'Les tests sont validés ; par conséquent, la mise en ligne peut commencer.' },
  { label: 'Nuancer', words: 'certes · toutefois · dans une certaine mesure', example: 'Certes, cette option est rapide ; toutefois, elle crée une dette technique.' },
  { label: 'Conclure', words: 'en somme · enfin · en conclusion', example: 'En conclusion, je recommande de déployer progressivement.' },
];

function CorrectionList({ corrections, onApply }) {
  if (!corrections) return null;
  if (corrections.length === 0) return <p className="correction-success"><CheckCircle2 size={16} /> Aucune correction détectée. Relis tout de même le sens et le style.</p>;
  return <div className="correction-list"><p className="little-label">PISTES DE CORRECTION</p>{corrections.map((match) => {
    const suggestion = match.replacements?.[0]?.value;
    return <article key={`${match.offset}-${match.length}-${match.message}`}><p><b>{match.context.text.slice(0, match.context.offset)}</b>{match.context.text.slice(match.context.offset, match.context.offset + match.context.length)}{match.context.text.slice(match.context.offset + match.context.length)}</p><span>{match.message}</span>{suggestion && <button onClick={() => onApply(match, suggestion)}>Remplacer par « {suggestion} »</button>}</article>;
  })}</div>;
}

export function WritingView({ progress, updateProgress, learningLevel }) {
  const levelPrompts = writingPrompts.filter((item) => item.level === learningLevel);
  const availablePrompts = levelPrompts.length ? levelPrompts : writingPrompts;
  const [promptIndex, setPromptIndex] = useState(0);
  const prompt = availablePrompts[promptIndex] || availablePrompts[0];
  const [text, setText] = useState(() => progress.writing[prompt.id] || '');
  const [ocrStatus, setOcrStatus] = useState('');
  const [analysisStatus, setAnalysisStatus] = useState('');
  const [corrections, setCorrections] = useState(null);
  const uploadRef = useRef(null);
  const count = wordCount(text);

  useEffect(() => setPromptIndex(0), [learningLevel]);

  useEffect(() => {
    setText(progress.writing[prompt.id] || '');
    setCorrections(null);
  }, [prompt.id, progress.writing]);

  const save = () => updateProgress((current) => ({ ...current, writing: { ...current.writing, [prompt.id]: text } }));

  const importPhoto = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      setOcrStatus('Choisis une image de moins de 10 Mo.');
      event.target.value = '';
      return;
    }
    setOcrStatus('Préparation de la lecture…');
    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('fra', 1, { logger: (message) => {
        if (message.status === 'recognizing text') setOcrStatus(`Lecture du texte… ${Math.round(message.progress * 100)} %`);
      } });
      const { data } = await worker.recognize(file);
      await worker.terminate();
      const extractedText = data.text.trim();
      if (!extractedText) {
        setOcrStatus('Aucun texte détecté. Cadre mieux la feuille et assure-toi que la photo est nette.');
        return;
      }
      setText((current) => current ? `${current}\n\n${extractedText}` : extractedText);
      setCorrections(null);
      setOcrStatus('Texte injecté dans l’éditeur. Relis-le avant de l’enregistrer.');
    } catch {
      setOcrStatus('La lecture a échoué. Vérifie ta connexion puis essaie une photo plus nette.');
    } finally {
      if (uploadRef.current) uploadRef.current.value = '';
    }
  };

  const analyseText = async () => {
    if (text.trim().length < 15) {
      setAnalysisStatus('Écris au moins une phrase complète avant de lancer la correction.');
      return;
    }
    setAnalysisStatus('Analyse en cours…');
    setCorrections(null);
    try {
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: new URLSearchParams({ text, language: 'fr' }),
      });
      if (!response.ok) throw new Error('analysis_failed');
      const result = await response.json();
      setCorrections(result.matches.slice(0, 8));
      setAnalysisStatus(result.matches.length ? 'Sélectionne une suggestion ou corrige directement dans le texte.' : 'Analyse terminée.');
    } catch {
      setAnalysisStatus('La correction est indisponible pour le moment. Tu peux utiliser la checklist ci-dessous.');
    }
  };

  const applyCorrection = (match, suggestion) => {
    setText((current) => `${current.slice(0, match.offset)}${suggestion}${current.slice(match.offset + match.length)}`);
    setCorrections(null);
    setAnalysisStatus('Suggestion appliquée. Relance l’analyse pour vérifier la nouvelle version.');
  };

  return <div className="page"><section className="page-intro"><p className="eyebrow">EXPRESSION ÉCRITE · {learningLevel}</p><h1>Écris avec clarté</h1><p>Les sujets et les objectifs d’écriture sont adaptés au niveau que tu as choisi dans ton parcours.</p></section><div className="writing-layout"><aside className="prompt-list"><p className="little-label">SUJETS {learningLevel}</p>{availablePrompts.map((item, index) => <button key={item.id} className={classNames('prompt-choice', index === promptIndex && 'active')} onClick={() => setPromptIndex(index)}><span>{item.level}</span><b>{item.title}</b></button>)}</aside><section className="editor-card"><div className="editor-head"><div><span className="pill lavender-pill">{prompt.level}</span><h2>{prompt.title}</h2><p>{prompt.instruction}</p></div><div className="target">Objectif<br /><b>{prompt.target} mots</b></div></div><div className="starter-row">{prompt.starters.map((starter) => <button key={starter} onClick={() => setText((value) => value ? `${value} ${starter}` : starter)}>{starter}</button>)}</div><div className="writing-tools"><label className="ocr-upload"><Camera size={16} aria-hidden="true" />Importer une photo<input ref={uploadRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={importPhoto} /></label><button className="analyse-btn" onClick={analyseText} disabled={Boolean(analysisStatus === 'Analyse en cours…')}><WandSparkles size={16} aria-hidden="true" />Corriger le texte</button></div>{ocrStatus && <p className="ocr-status"><ScanText size={16} aria-hidden="true" />{ocrStatus}</p>}<section className="connector-guide" aria-labelledby="connectors-title"><div><p className="little-label">OUTIL D’ÉCRITURE</p><h3 id="connectors-title"><Lightbulb size={17} aria-hidden="true" />Connecteurs logiques</h3><p>Choisis celui qui correspond au lien entre tes idées, puis clique dessus pour l’ajouter au texte.</p></div><div className="connector-grid">{connectors.map((connector) => <button key={connector.label} onClick={() => setText((value) => value ? `${value} ${connector.words.split(' · ')[0]}, ` : `${connector.words.split(' · ')[0]}, `)}><b>{connector.label}</b><span>{connector.words}</span><small>{connector.example}</small></button>)}</div></section><textarea aria-label="Ton texte" lang="fr" spellCheck value={text} onChange={(event) => { setText(event.target.value); setCorrections(null); }} onBlur={save} placeholder="Écris ici, ou importe une photo de ta feuille…" /><div className="editor-foot"><span className={count >= prompt.target ? 'goal-reached' : ''}>{count} mot{count > 1 ? 's' : ''} {count >= prompt.target ? '✓ objectif atteint' : `sur ${prompt.target}`}</span><button className="primary-btn" onClick={save}>Enregistrer</button></div>{analysisStatus && <p className="analysis-status">{analysisStatus === 'Analyse en cours…' && <LoaderCircle size={15} className="spin" aria-hidden="true" />}{analysisStatus}</p>}<CorrectionList corrections={corrections} onApply={applyCorrection} /><div className="revision-list"><p className="little-label">AVANT D’ENREGISTRER</p><span>✓ J’ai répondu au sujet et structuré mes idées.</span><span>✓ J’ai vérifié les verbes, les accords et les prépositions.</span><span>✓ J’ai utilisé des connecteurs et évité les répétitions.</span><small><Sparkles size={13} aria-hidden="true" /> La correction automatique envoie uniquement le texte analysé à LanguageTool.</small></div></section></div></div>;
}
