import React, { useEffect, useState } from 'react';
import { writingPrompts } from '../data.js';
import { classNames, wordCount } from '../lib/utils.js';

export function WritingView({ progress, updateProgress }) {
  const [promptIndex, setPromptIndex] = useState(0);
  const prompt = writingPrompts[promptIndex];
  const [text, setText] = useState(() => progress.writing[prompt.id] || '');
  const count = wordCount(text);
  useEffect(() => { setText(progress.writing[prompt.id] || ''); }, [prompt.id, progress.writing]);
  const save = () => updateProgress((current) => ({ ...current, writing: { ...current.writing, [prompt.id]: text } }));
  return <div className="page"><section className="page-intro"><p className="eyebrow">EXPRESSION ÉCRITE</p><h1>Écris pour t’exprimer</h1><p>Écris sans chercher la perfection. Termine d’abord tes idées, puis relis une règle à la fois.</p></section><div className="writing-layout"><aside className="prompt-list"><p className="little-label">CHOISIS UN SUJET</p>{writingPrompts.map((item, index) => <button key={item.id} className={classNames('prompt-choice', index === promptIndex && 'active')} onClick={() => setPromptIndex(index)}><span>{item.level}</span><b>{item.title}</b></button>)}</aside><section className="editor-card"><div className="editor-head"><div><span className="pill lavender-pill">{prompt.level}</span><h2>{prompt.title}</h2><p>{prompt.instruction}</p></div><div className="target">Objectif<br /><b>{prompt.target} mots</b></div></div><div className="starter-row">{prompt.starters.map((starter) => <button key={starter} onClick={() => setText((value) => value ? `${value} ${starter}` : starter)}>{starter}</button>)}</div><textarea aria-label="Ton texte" value={text} onChange={(event) => setText(event.target.value)} onBlur={save} placeholder="Commence à écrire ici…" /><div className="editor-foot"><span className={count >= prompt.target ? 'goal-reached' : ''}>{count} mot{count > 1 ? 's' : ''} {count >= prompt.target ? '✓ objectif atteint' : `sur ${prompt.target}`}</span><button className="primary-btn" onClick={save}>Enregistrer</button></div><div className="revision-list"><p className="little-label">AVANT D’ENREGISTRER</p><span>✓ J’ai répondu au sujet.</span><span>✓ J’ai vérifié les verbes et les accords.</span><span>✓ J’ai utilisé au moins un connecteur.</span></div></section></div></div>;
}
