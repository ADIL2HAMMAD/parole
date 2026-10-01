import React, { useEffect, useState } from 'react';
import { allLessons, stages } from './data.js';
import { Sidebar } from './components/Sidebar.jsx';
import { Topbar } from './components/Topbar.jsx';
import { useProgress } from './hooks/useProgress.js';
import { readRoute } from './lib/routing.js';
import { classNames } from './lib/utils.js';
import { HomeView } from './views/HomeView.jsx';
import { LessonView } from './views/LessonView.jsx';
import { NotFoundView } from './views/NotFoundView.jsx';
import { RoadmapView } from './views/RoadmapView.jsx';
import { SpeakingView } from './views/SpeakingView.jsx';
import { WeekView } from './views/WeekView.jsx';
import { WritingView } from './views/WritingView.jsx';
import { ConjugationView } from './views/ConjugationView.jsx';
import { AccountView } from './views/AccountView.jsx';
import { AccountHistoryView } from './views/AccountHistoryView.jsx';

function App() {
  const { progress, updateProgress, completePractice } = useProgress();
  const [route, setRoute] = useState(readRoute);
  const [toast, setToast] = useState('');
  const activeLesson = route.view === 'lesson' ? allLessons.find((lesson) => lesson.id === route.lessonId) : null;
  const completedCount = progress.completed.length;
  const percentage = Math.round((completedCount / allLessons.length) * 100);
  const currentStage = stages.find((stage) => stage.lessons.some((lesson) => !progress.completed.includes(lesson.id))) || stages.at(-1);
  const nextLesson = allLessons.find((lesson) => !progress.completed.includes(lesson.id)) || allLessons[0];

  useEffect(() => {
    const updateRoute = () => setRoute(readRoute());
    window.addEventListener('hashchange', updateRoute);
    if (!window.location.hash) window.history.replaceState(null, '', '#/home');
    updateRoute();
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const navigate = (path) => {
    const target = `#/${path}`;
    if (window.location.hash !== target) window.location.hash = target;
    else setRoute(readRoute());
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };
  const completeLesson = (id) => {
    updateProgress((current) => current.completed.includes(id) ? current : { ...current, completed: [...current.completed, id] });
    setToast('Leçon terminée. Très bien !');
  };

  return <div className="app-shell">
    <Sidebar currentStage={currentStage} completedCount={completedCount} percentage={percentage} totalLessons={allLessons.length} view={route.view} navigate={navigate} />
    <main className="main-content">
      <Topbar activeDays={progress.activeDays.length} name={progress.profile.name} navigate={navigate} />
      {route.view === 'home' && <HomeView progress={progress} nextLesson={nextLesson} currentStage={currentStage} percentage={percentage} navigate={navigate} onPractice={completePractice} />}
      {route.view === 'roadmap' && <RoadmapView progress={progress} navigate={navigate} />}
      {route.view === 'conjugate' && <ConjugationView />}
      {route.view === 'lesson' && activeLesson && <LessonView lesson={activeLesson} progress={progress} updateProgress={updateProgress} completeLesson={completeLesson} navigate={navigate} />}
      {route.view === 'lesson' && !activeLesson && <NotFoundView navigate={navigate} />}
      {route.view === 'write' && <WritingView progress={progress} updateProgress={updateProgress} />}
      {route.view === 'speak' && <SpeakingView />}
      {route.view === 'week' && <WeekView progress={progress} percentage={percentage} />}
      {route.view === 'account' && <AccountView profile={progress.profile} updateProgress={updateProgress} onSaved={() => setToast('Modifications enregistrées.')} />}
      {route.view === 'history' && <AccountHistoryView progress={progress} navigate={navigate} />}
    </main>
    <div className={classNames('toast', toast && 'visible')} role="status">{toast}</div>
  </div>;
}

export default App;
