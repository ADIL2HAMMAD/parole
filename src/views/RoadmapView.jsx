import React from 'react';
import { ArrowRight, Check, MessageSquareText, Mic, PenTool, Presentation } from 'lucide-react';
import { stages } from '../data.js';
import { classNames } from '../lib/utils.js';

function LessonRow({ lesson, index, complete, onClick }) {
  return <button className="lesson-row" onClick={onClick}><span className={classNames('check', complete && 'done')} aria-label={complete ? 'Leçon terminée' : `Leçon ${index}`}>{complete ? <Check size={14} /> : index}</span><span className="lesson-row-title"><b>{lesson.title}</b><small>{lesson.category} · {lesson.time}</small></span><span className="arrow" aria-hidden="true"><ArrowRight size={17} /></span></button>;
}

export function RoadmapView({ progress, updateProgress, navigate }) {
  const stageIcons = { 'b1-solide': MessageSquareText, 'b2-pro': Presentation, 'b2-avance': PenTool, c1: Mic };
  const selectedStage = stages.find((stage) => stage.id === progress.profile.learningStage) || stages.find((stage) => stage.lessons.some((lesson) => !progress.completed.includes(lesson.id))) || stages.at(-1);
  const StageIcon = stageIcons[selectedStage.id];
  const chooseStage = (stageId) => updateProgress((current) => ({ ...current, profile: { ...current.profile, learningStage: stageId } }));
  return <div className="page">
    <section className="page-intro"><p className="eyebrow">B1 À C1 · À TON RYTHME</p><h1>Choisis le niveau que tu veux travailler</h1><p>Tu peux commencer au niveau qui te convient et en changer à tout moment. Ton choix détermine la prochaine leçon proposée.</p></section>
    <section className="level-picker" aria-labelledby="level-picker-title">
      <div className="level-picker-heading"><div><p className="eyebrow">MON NIVEAU DE TRAVAIL</p><h2 id="level-picker-title">Où souhaites-tu commencer ?</h2></div><span>Choix enregistré</span></div>
      <div className="level-options" role="group" aria-label="Choisir un niveau d’apprentissage">
        {stages.map((stage) => {
          const Icon = stageIcons[stage.id];
          const isSelected = stage.id === selectedStage.id;
          return <button key={stage.id} className={classNames('level-option', stage.color, isSelected && 'selected')} type="button" aria-pressed={isSelected} onClick={() => chooseStage(stage.id)}><span className="level-option-icon"><Icon size={18} strokeWidth={1.8} /></span><span><b>{stage.level}</b><small>{stage.title}</small></span>{isSelected && <Check size={16} aria-label="Niveau sélectionné" />}</button>;
        })}
      </div>
    </section>
    <div className="roadmap-list"><section className={classNames('roadmap-stage', selectedStage.color)}><div className="roadmap-stage-head"><div><span className="stage-number">{selectedStage.number}</span><span className="pill">{selectedStage.level} · {selectedStage.duration}</span><h2>{selectedStage.title}</h2><p>{selectedStage.description}</p></div><span className="stage-symbol" aria-hidden="true"><StageIcon size={36} strokeWidth={1.5} /></span></div><div className="lesson-list">{selectedStage.lessons.map((lesson, index) => <LessonRow key={lesson.id} lesson={lesson} index={index + 1} complete={progress.completed.includes(lesson.id)} onClick={() => navigate(`lesson/${lesson.id}`)} />)}</div></section></div>
  </div>;
}
