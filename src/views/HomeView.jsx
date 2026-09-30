import React from 'react';
import { ArrowRight, BookOpen, Check, Headphones, History, Mic, PenLine, PenTool, Sparkles, Sun } from 'lucide-react';
import { allLessons, stages } from '../data.js';
import { DAILY_PRACTICES } from '../constants.js';
import { classNames, progressLabel, todayKey } from '../lib/utils.js';

function PracticeRow({ id, color, title, text, time, done, onClick }) {
  const icons = { write: PenLine, speak: Mic, listen: Headphones };
  const Icon = done ? Check : icons[id];
  return <button className="practice-row" onClick={onClick}><span className={classNames('practice-icon', color)} aria-hidden="true"><Icon size={17} strokeWidth={2} /></span><span className="practice-text"><b>{title}</b><small>{text}</small></span><span className="time">{time}</span><span className="arrow" aria-hidden="true"><ArrowRight size={17} /></span></button>;
}

export function HomeView({ progress, nextLesson, currentStage, percentage, navigate, onPractice }) {
  const completed = progress.completed.length;
  const todayTasks = progress.dailyTasks[todayKey()] || {};
  return <div className="page home-page">
    <section className="hero"><p className="eyebrow">MON ESPACE D’APPRENTISSAGE</p><h1>Bonjour, Adil <span aria-hidden="true"><Sparkles size={24} /></span></h1><p className="hero-copy">Aujourd’hui, avance à ton rythme. Une petite pratique régulière fait toute la différence.</p><div className="hero-meta"><span>Objectif : <b>30 min / jour</b></span><span className="dot-sep">•</span><span>Cette semaine : <b>{progressLabel(completed)}</b></span></div></section>
    <section className="continue-card"><div className="continue-art" aria-hidden="true"><div className="book-icon"><BookOpen size={31} /></div><div className="sun"><Sun size={22} /></div></div><div className="continue-body"><p className="eyebrow">À CONTINUER</p><h2>{nextLesson.title}</h2><p>{nextLesson.stageTitle} · {nextLesson.category}</p><div className="lesson-progress-line"><span style={{ width: `${percentage}%` }} /></div><small>{completed} sur {allLessons.length} leçons terminées</small></div><button className="primary-btn" onClick={() => navigate(`lesson/${nextLesson.id}`)}>Continuer <ArrowRight size={15} aria-hidden="true" /></button></section>
    <div className="section-heading"><div><p className="eyebrow">TON PARCOURS</p><h2>Prochaine étape</h2></div><button className="text-btn" onClick={() => navigate('roadmap')}>Voir tout le parcours <ArrowRight size={14} aria-hidden="true" /></button></div>
    <section className="stage-preview">{stages.map((stage) => { const stageComplete = stage.lessons.filter((lesson) => progress.completed.includes(lesson.id)).length; const stageIcons = { bases: Sun, temps: History, ecrit: PenTool, oral: Mic }; const StageIcon = stageIcons[stage.id]; return <button key={stage.id} className={classNames('stage-card', stage.color, stage.id === currentStage.id && 'current')} onClick={() => navigate('roadmap')}><div className="stage-top"><span className="stage-number">{stage.number}</span><span className="stage-icon" aria-hidden="true"><StageIcon size={21} strokeWidth={1.7} /></span></div><span className="pill">{stage.level}</span><h3>{stage.title}</h3><p>{stage.description}</p><div className="stage-footer"><div><span><b>{stageComplete}</b>/{stage.lessons.length} leçons</span><div className="tiny-track"><i style={{ width: `${(stageComplete / stage.lessons.length) * 100}%` }} /></div></div><span aria-hidden="true"><ArrowRight size={16} /></span></div></button>; })}</section>
    <section className="practice-grid"><div className="section-heading compact"><div><p className="eyebrow">AUJOURD’HUI</p><h2>Une pratique complète</h2></div></div><div className="daily-list">{DAILY_PRACTICES.map((practice) => <PracticeRow key={practice.id} {...practice} done={Boolean(todayTasks[practice.id])} onClick={() => { onPractice(practice.id); if (practice.view) navigate(practice.view); }} />)}</div></section>
  </div>;
}
