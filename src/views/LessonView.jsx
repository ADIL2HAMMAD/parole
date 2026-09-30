import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Lightbulb } from 'lucide-react';
import { classNames } from '../lib/utils.js';

export function LessonView({ lesson, progress, updateProgress, completeLesson, navigate }) {
  const previousAnswer = progress.answers[lesson.id];
  const [choice, setChoice] = useState(previousAnswer ?? null);
  const [checked, setChecked] = useState(previousAnswer !== undefined);
  const isCorrect = choice === lesson.answer;
  const complete = progress.completed.includes(lesson.id);
  const submit = () => { if (choice === null) return; updateProgress((current) => ({ ...current, answers: { ...current.answers, [lesson.id]: choice } })); setChecked(true); };
  return <div className="page lesson-page"><button className="back-btn" onClick={() => navigate('roadmap')}><ArrowLeft size={16} aria-hidden="true" /> Retour au parcours</button><div className="lesson-layout"><article className="lesson-content"><p className="eyebrow">{lesson.stageTitle.toUpperCase()} · {lesson.category.toUpperCase()}</p><h1>{lesson.title}</h1><p className="lesson-lead">{lesson.explanation}</p><div className="example-box"><p className="example-title">EXEMPLES</p>{lesson.examples.map((example) => <p key={example}>« {example} »</p>)}</div><div className="tip-box"><span aria-hidden="true"><Lightbulb size={18} /></span><p><b>Conseil</b>{lesson.tip}</p></div></article><aside className="quiz-card"><div className="quiz-label">MINI-EXERCICE <span>{lesson.time}</span></div><h2>{lesson.question}</h2><div className="choices">{lesson.choices.map((option, index) => <button key={option} disabled={checked} onClick={() => setChoice(index)} className={classNames('choice', choice === index && 'selected', checked && index === lesson.answer && 'correct', checked && choice === index && index !== lesson.answer && 'wrong')}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>{checked && <p className={classNames('feedback', isCorrect ? 'success' : 'error')}>{isCorrect ? <><CheckCircle2 size={15} /> Bonne réponse. Continue ainsi !</> : `La bonne réponse est : ${lesson.choices[lesson.answer]}. Relis l’explication puis réessaie plus tard.`}</p>}{!checked ? <button className="primary-btn full" disabled={choice === null} onClick={submit}>Vérifier ma réponse</button> : <button className="primary-btn full" onClick={() => completeLesson(lesson.id)}>{complete ? <>Leçon terminée <CheckCircle2 size={15} /></> : 'Terminer la leçon'}</button>}</aside></div></div>;
}
