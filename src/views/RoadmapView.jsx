import React from 'react';
import { ArrowRight, Check, History, Mic, PenTool, Sun } from 'lucide-react';
import { stages } from '../data.js';
import { classNames } from '../lib/utils.js';

function LessonRow({ lesson, index, complete, onClick }) {
  return <button className="lesson-row" onClick={onClick}><span className={classNames('check', complete && 'done')} aria-label={complete ? 'Leçon terminée' : `Leçon ${index}`}>{complete ? <Check size={14} /> : index}</span><span className="lesson-row-title"><b>{lesson.title}</b><small>{lesson.category} · {lesson.time}</small></span><span className="arrow" aria-hidden="true"><ArrowRight size={17} /></span></button>;
}

export function RoadmapView({ progress, navigate }) {
  const stageIcons = { bases: Sun, temps: History, ecrit: PenTool, oral: Mic };
  return <div className="page"><section className="page-intro"><p className="eyebrow">A1 À B1</p><h1>Ton parcours en français</h1><p>Chaque étape s’appuie sur la précédente. Termine les leçons à ton rythme, puis passe à la suite.</p></section><div className="roadmap-list">{stages.map((stage) => { const StageIcon = stageIcons[stage.id]; return <section key={stage.id} className={classNames('roadmap-stage', stage.color)}><div className="roadmap-stage-head"><div><span className="stage-number">{stage.number}</span><span className="pill">{stage.level}</span><h2>{stage.title}</h2><p>{stage.description}</p></div><span className="stage-symbol" aria-hidden="true"><StageIcon size={36} strokeWidth={1.5} /></span></div><div className="lesson-list">{stage.lessons.map((lesson, index) => <LessonRow key={lesson.id} lesson={lesson} index={index + 1} complete={progress.completed.includes(lesson.id)} onClick={() => navigate(`lesson/${lesson.id}`)} />)}</div></section>; })}</div></div>;
}
