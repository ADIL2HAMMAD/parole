import React, { useEffect, useState } from 'react';
import { allLessons, stages } from './data.js';
import { Sidebar } from './components/Sidebar.jsx';
import { Topbar } from './components/Topbar.jsx';
import { useProgress } from './hooks/useProgress.js';
import { useAuth } from './hooks/useAuth.js';
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
import { GrammarView } from './views/GrammarView.jsx';
import { ConnectorsView } from './views/ConnectorsView.jsx';
import { AccountView } from './views/AccountView.jsx';
import { AccountHistoryView } from './views/AccountHistoryView.jsx';
import { LoginView } from './views/LoginView.jsx';

function App() {
  const { user, loading: authLoading, configured: authConfigured, signInWithGoogle, signInWithEmail, sendPhoneCode, signOut } = useAuth();
  const { progress, updateProgress, completePractice, syncing } = useProgress(user, !authLoading);
  const [route, setRoute] = useState(readRoute);
  const [toast, setToast] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const activeLesson = route.view === 'lesson' ? allLessons.find((lesson) => lesson.id === route.lessonId) : null;
  const completedCount = progress.completed.length;
  const percentage = Math.round((completedCount / allLessons.length) * 100);
  const selectedStage = stages.find((stage) => stage.id === progress.profile.learningStage);
  const currentStage = selectedStage || stages.find((stage) => stage.lessons.some((lesson) => !progress.completed.includes(lesson.id))) || stages.at(-1);
  const nextLesson = currentStage.lessons.find((lesson) => !progress.completed.includes(lesson.id)) || currentStage.lessons[0];

  useEffect(() => {
    const updateRoute = () => setRoute(readRoute());
    const legacyRoute = window.location.hash.match(/^#\/(.+)$/)?.[1];
    const currentPath = window.location.pathname;

    if (legacyRoute) {
      window.history.replaceState(null, '', `/${legacyRoute}${window.location.search}`);
    } else if (currentPath === '/' || currentPath === '') {
      window.history.replaceState(null, '', `/home${window.location.search}`);
    }

    window.addEventListener('popstate', updateRoute);
    updateRoute();
    return () => window.removeEventListener('popstate', updateRoute);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const navigate = (path) => {
    const target = `/${path}`;
    if (window.location.pathname !== target) {
      window.history.pushState(null, '', target);
      setRoute(readRoute());
    }
    else setRoute(readRoute());
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  };
  const completeLesson = (id) => {
    updateProgress((current) => current.completed.includes(id) ? current : { ...current, completed: [...current.completed, id] });
    setToast('Leçon terminée. Très bien !');
  };
  const signIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      setToast(error.code === 'auth/popup-closed-by-user' ? 'Connexion annulée.' : 'Impossible de se connecter avec Google. Réessaie.');
    }
  };
  const signOutUser = async () => {
    await signOut();
    setToast('Déconnecté. Tes données restent enregistrées dans ton compte.');
  };

  if (authLoading) return <main className="auth-loading" aria-live="polite"><span className="auth-loading-mark">P</span><span>Préparation de votre espace…</span></main>;

  if (!user) return <LoginView authConfigured={authConfigured} onGoogle={signInWithGoogle} onEmail={signInWithEmail} onSendPhoneCode={sendPhoneCode} />;

  return <div className={classNames('app-shell', sidebarCollapsed && 'sidebar-collapsed')}>
    <Sidebar collapsed={sidebarCollapsed} currentStage={currentStage} completedCount={completedCount} percentage={percentage} totalLessons={allLessons.length} view={route.view} navigate={navigate} />
    <main className="main-content">
      <Topbar activeDays={progress.activeDays.length} name={user?.displayName || progress.profile.name} user={user} authConfigured={authConfigured} authLoading={authLoading} onSignIn={signIn} onSignOut={signOutUser} navigate={navigate} sidebarCollapsed={sidebarCollapsed} toggleSidebar={() => setSidebarCollapsed((collapsed) => !collapsed)} />
      {route.view === 'home' && <HomeView name={progress.profile.name || user?.displayName} progress={progress} nextLesson={nextLesson} currentStage={currentStage} percentage={percentage} navigate={navigate} onPractice={completePractice} />}
      {route.view === 'roadmap' && <RoadmapView progress={progress} updateProgress={updateProgress} navigate={navigate} />}
      {route.view === 'conjugate' && <ConjugationView />}
      {route.view === 'grammar' && <GrammarView progress={progress} updateProgress={updateProgress} />}
      {route.view === 'lesson' && activeLesson && <LessonView lesson={activeLesson} progress={progress} updateProgress={updateProgress} completeLesson={completeLesson} navigate={navigate} />}
      {route.view === 'lesson' && !activeLesson && <NotFoundView navigate={navigate} />}
      {route.view === 'write' && <WritingView progress={progress} updateProgress={updateProgress} learningLevel={currentStage.level} />}
      {route.view === 'speak' && <SpeakingView learningLevel={currentStage.level} />}
      {route.view === 'week' && <WeekView progress={progress} percentage={percentage} />}
      {route.view === 'connectors' && <ConnectorsView />}
      {route.view === 'account' && <AccountView profile={progress.profile} user={user} authConfigured={authConfigured} authLoading={authLoading || syncing} onSignIn={signIn} onSignOut={signOutUser} updateProgress={updateProgress} onSaved={() => setToast('Modifications enregistrées.')} />}
      {route.view === 'history' && <AccountHistoryView progress={progress} navigate={navigate} />}
    </main>
    <div className={classNames('toast', toast && 'visible')} role="status">{toast}</div>
  </div>;
}

export default App;
