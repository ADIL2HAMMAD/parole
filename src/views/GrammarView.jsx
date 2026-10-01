import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpenCheck, CheckCircle2, ChevronRight, CircleAlert, Clock3, Lightbulb, ListChecks, RefreshCw, Sparkles, Target } from 'lucide-react';
import { grammarLessons, grammarLevels } from '../grammarData.js';
import { classNames } from '../lib/utils.js';

const rate = (part, total) => total ? Math.round((part / total) * 100) : 0;
const ProgressBar = ({ value }) => <div className="grammar-progress"><span style={{ width: value + '%' }} /></div>;
const LevelStrip = ({ onOpen, activeId }) => <nav className="grammar-level-strip" aria-label="Niveaux de grammaire"><p>Choisir un niveau</p><div>{grammarLevels.map((level) => <button key={level.id} type="button" onClick={() => onOpen(level.id)} className={classNames(level.color, activeId === level.id && 'active')} aria-current={activeId === level.id ? 'page' : undefined}><span>{level.level}</span><strong>{level.title}</strong><small>{level.lessons.length} cours</small></button>)}</div></nav>;
const buildQuizQuestions = (lesson) => [lesson.quiz, ...Array.from({ length: 4 }, (_, index) => {
    const example = lesson.examples[index] || lesson.examples[0];
    const prompts = [
      'Quelle phrase respecte correctement la regle etudiee ?',
      'Quel choix montre que tu appliques bien cette regle ?',
      'Quelle formulation correspond a la regle de la lecon ?',
      'Quel reflexe permet de reutiliser correctement cette regle ?',
    ];
    const correctAnswer = index === 1 || index === 3 ? lesson.tip : example;
    return {
      question: prompts[index],
      options: [correctAnswer, 'Je traduis chaque mot sans verifier la construction.', 'Je garde la meme forme dans toutes les situations.'],
    answer: 0,
    explanation: 'Cette reponse applique le principe vu dans la regle.',
    };
  })];

function MiniQuiz({ lesson, saved, onSave }) {
  const questions = buildQuizQuestions(lesson);
  const [choices, setChoices] = useState(() => Array.isArray(saved) ? saved : saved === undefined ? [] : [saved]);
  const [checked, setChecked] = useState(Array.isArray(saved) && saved.length === questions.length);
  const ready = questions.every((_, index) => choices[index] !== undefined);
  return <section className="grammar-quiz"><p className="eyebrow">MINI-QUIZ · 5 QUESTIONS</p>{questions.map((question, questionIndex) => <article key={questionIndex}><b>Question {questionIndex + 1}</b><h2>{question.question}</h2><div className="grammar-quiz-options">{question.options.map((option, optionIndex) => <button key={`${questionIndex}-${option}`} type="button" disabled={checked} onClick={() => setChoices((current) => ({ ...current, [questionIndex]: optionIndex }))} className={classNames(choices[questionIndex] === optionIndex && 'selected', checked && optionIndex === question.answer && 'correct', checked && choices[questionIndex] === optionIndex && optionIndex !== question.answer && 'wrong')}><span>{String.fromCharCode(65 + optionIndex)}</span>{option}</button>)}</div>{checked && <p className={classNames('grammar-feedback', choices[questionIndex] === question.answer ? 'success' : 'error')}><CheckCircle2 size={17} />{choices[questionIndex] === question.answer ? 'Bonne réponse. ' : 'À revoir. '}{question.explanation}</p>}</article>)}{!checked && <button type="button" className="grammar-submit" disabled={!ready} onClick={() => { onSave(choices); setChecked(true); }}>Valider les réponses</button>}</section>;
}

export function GrammarView({ progress, updateProgress }) {
  const [page, setPage] = useState('catalog');
  const [levelId, setLevelId] = useState('a1');
  const [lessonId, setLessonId] = useState(null);
  const [filter, setFilter] = useState('all');
  const completed = progress.grammarCompleted || [];
  const answers = progress.grammarAnswers || {};
  const level = grammarLevels.find((item) => item.id === levelId) || grammarLevels[0];
  const lesson = grammarLessons.find((item) => item.id === lessonId);
  const openLevel = (id) => { setLevelId(id); setFilter('all'); setPage('level'); };
  const openLesson = (id) => { setLessonId(id); setPage('lesson'); };
  const finishLesson = () => {
    if (!lesson) return;
    updateProgress((current) => current.grammarCompleted?.includes(lesson.id) ? current : { ...current, grammarCompleted: [...(current.grammarCompleted || []), lesson.id] });
  };

  if (page === 'level') {
    const done = level.lessons.filter((item) => completed.includes(item.id)).length;
    const rows = level.lessons.filter((item) => filter === 'all' || (filter === 'done' ? completed.includes(item.id) : !completed.includes(item.id)));
    return <div className="page grammar-page">
      <button className="grammar-back" type="button" onClick={() => setPage('catalog')}><ArrowLeft size={16} /> Tous les niveaux</button>
      <LevelStrip onOpen={openLevel} activeId={levelId} />
      <section className={classNames('grammar-level-heading', level.color)}><div><p className="eyebrow">PARCOURS DE GRAMMAIRE · {level.level}</p><h1>{level.title}</h1><p>{level.objective}</p></div><div className="grammar-level-meter"><b>{done}<small> / {level.lessons.length}</small></b><span>cours terminés</span><ProgressBar value={rate(done, level.lessons.length)} /></div></section>
      <section className="grammar-course-list"><div className="grammar-list-toolbar"><div><p className="eyebrow">COURS DU NIVEAU</p><h2>À ton rythme, une règle à la fois.</h2></div><div className="grammar-filters">{[['all', 'Tous'], ['todo', 'À faire'], ['done', 'Terminés']].map(([id, label]) => <button key={id} type="button" onClick={() => setFilter(id)} className={filter === id ? 'active' : ''}>{label}</button>)}</div></div><div className="grammar-lesson-rows">{rows.map((item) => { const doneItem = completed.includes(item.id); return <button type="button" key={item.id} className="grammar-lesson-row" onClick={() => openLesson(item.id)}><span className={classNames('grammar-lesson-number', doneItem && 'done')}>{doneItem ? <CheckCircle2 size={17} /> : String(item.number).padStart(2, '0')}</span><span className="grammar-lesson-info"><b>{item.title}</b><small>{item.description}</small></span><span className="grammar-lesson-meta"><small><Clock3 size={13} /> {item.duration}</small><em>{doneItem ? 'Terminé' : 'À faire'}</em></span><ChevronRight size={18} /></button>; })}</div></section>
    </div>;
  }

  if (page === 'lesson' && lesson) {
    const index = grammarLessons.findIndex((item) => item.id === lesson.id);
    const previous = grammarLessons[index - 1];
    const next = grammarLessons[index + 1];
    const done = completed.includes(lesson.id);
    return <div className="page grammar-page">
      <button className="grammar-back" type="button" onClick={() => openLevel(grammarLevels.find((item) => item.level === lesson.level)?.id || 'a1')}><ArrowLeft size={16} /> Retour aux cours {lesson.level}</button>
      <LevelStrip onOpen={openLevel} activeId={levelId} />
      <article className="grammar-lesson-detail"><header className="grammar-detail-head"><div><p className="eyebrow">{lesson.level} · COURS {String(lesson.number).padStart(2, '0')}</p><h1>{lesson.title}</h1><p>{lesson.description}</p></div><span className="grammar-duration"><Clock3 size={16} /> {lesson.duration}</span></header>
        <section className="grammar-explanation"><p className="little-label">COMPRENDRE</p><p>{lesson.explanation}</p></section>
        <section className="grammar-rule-card"><Lightbulb size={20} /><div><p className="little-label">LA RÈGLE</p><p>{lesson.rule}</p></div></section>
        <section className="grammar-example-card"><p className="little-label">EXEMPLES À RETENIR</p>{lesson.examples.map((example) => <p key={example}>« {example} »</p>)}</section>
        <section className="grammar-advice-grid"><article><CircleAlert size={18} /><div><p className="little-label">ATTENTION</p><p>{lesson.caution}</p></div></article><article><Sparkles size={18} /><div><p className="little-label">CONSEIL PRATIQUE</p><p>{lesson.tip}</p></div></article></section>
        <MiniQuiz key={lesson.id} lesson={lesson} saved={answers[lesson.id]} onSave={(value) => updateProgress((current) => ({ ...current, grammarAnswers: { ...(current.grammarAnswers || {}), [lesson.id]: value } }))} />
        <div className="grammar-complete-row"><button type="button" className={classNames('grammar-complete', done && 'done')} onClick={finishLesson}>{done ? <><CheckCircle2 size={18} /> Leçon terminée</> : <><BookOpenCheck size={18} /> Marquer comme terminée</>}</button>{!done && <span>Tu peux la marquer comme terminée après le quiz ou à tout moment.</span>}</div>
        <nav className="grammar-prev-next">{previous ? <button type="button" onClick={() => openLesson(previous.id)}><ArrowLeft size={17} /><span><small>LEÇON PRÉCÉDENTE</small>{previous.title}</span></button> : <span />}{next ? <button type="button" onClick={() => openLesson(next.id)}><span><small>LEÇON SUIVANTE</small>{next.title}</span><ArrowRight size={17} /></button> : <span />}</nav>
      </article>
    </div>;
  }

  if (page === 'review') {
    const doneLessons = grammarLessons.filter((item) => completed.includes(item.id));
    const mistakes = grammarLessons.filter((item) => {
      const saved = answers[item.id];
      if (saved === undefined) return false;
      const choices = Array.isArray(saved) ? saved : [saved];
      return !buildQuizQuestions(item).every((question, index) => choices[index] === question.answer);
    });
    const review = [...mistakes, ...doneLessons.filter((item) => !mistakes.some((wrong) => wrong.id === item.id))];
    const random = () => { const list = review.length ? review : grammarLessons; openLesson(list[Math.floor(Math.random() * list.length)].id); };
    return <div className="page grammar-page"><button className="grammar-back" type="button" onClick={() => setPage('catalog')}><ArrowLeft size={16} /> Tous les niveaux</button><LevelStrip onOpen={openLevel} activeId={levelId} /><section className="grammar-review-head"><div><p className="eyebrow">RÉVISER</p><h1>Consolide ce que tu as appris.</h1><p>Retrouve tes leçons terminées, les réponses à revoir et reprends une notion au hasard.</p></div><button type="button" className="grammar-random" onClick={random}><RefreshCw size={17} /> Réviser une leçon au hasard</button></section><div className="grammar-review-grid"><section><p className="little-label">LEÇONS TERMINÉES · {doneLessons.length}</p>{doneLessons.length ? doneLessons.map((item) => <button key={item.id} type="button" onClick={() => openLesson(item.id)}>{item.level} · {item.title}<ChevronRight size={16} /></button>) : <p className="grammar-empty">Aucune leçon terminée pour le moment.</p>}</section><section><p className="little-label">ERREURS DU QUIZ · {mistakes.length}</p>{mistakes.length ? mistakes.map((item) => <button key={item.id} type="button" onClick={() => openLesson(item.id)}>{item.level} · {item.title}<ChevronRight size={16} /></button>) : <p className="grammar-empty">Tes réponses erronées apparaîtront ici.</p>}</section></div></div>;
  }

  const overall = rate(completed.length, grammarLessons.length);
  return <div className="page grammar-page"><section className="grammar-hero"><div><p className="eyebrow">GRAMMAIRE FRANÇAISE A1 → C1</p><h1>Des règles claires,<br />des phrases naturelles.</h1><p>Maîtrise la grammaire progressivement, puis utilise chaque règle à l’écrit et à l’oral.</p></div><div className="grammar-hero-mark"><BookOpenCheck size={35} /><span>le mot<br />juste</span></div></section><section className="grammar-overall"><div><Target size={21} /><div><p className="little-label">PROGRESSION GLOBALE</p><b>{completed.length} <small>/ {grammarLessons.length} cours terminés</small></b></div><strong>{overall}%</strong></div><ProgressBar value={overall} /></section><section className="grammar-catalog"><div className="grammar-section-head"><div><p className="eyebrow">LE PARCOURS COMPLET</p><h2>Tous les niveaux, à ta disposition.</h2></div><button type="button" className="grammar-review-link" onClick={() => setPage('review')}><ListChecks size={17} /> Réviser</button></div><div className="grammar-level-grid">{grammarLevels.map((item) => { const done = item.lessons.filter((course) => completed.includes(course.id)).length; const levelRate = rate(done, item.lessons.length); return <article key={item.id} className={classNames('grammar-level-card', item.color)}><div className="grammar-card-top"><span>{item.level}</span><small>{item.lessons.length} cours</small></div><h3>{item.title}</h3><p>{item.objective}</p><div className="grammar-card-progress"><span>{done} / {item.lessons.length} terminés</span><b>{levelRate}%</b></div><ProgressBar value={levelRate} /><button type="button" onClick={() => openLevel(item.id)}>Ouvrir le niveau <ArrowRight size={16} /></button></article>; })}</div></section></div>;
}
