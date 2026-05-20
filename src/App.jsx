import { useEffect, useState } from 'react';
import { BookOpen, Brain, Flag, Gauge, Home, Library, LineChart, Menu, Target, User, Zap } from 'lucide-react';
import AntiRegressionTrainer from './components/AntiRegressionTrainer';
import Dashboard from './components/Dashboard';
import FocusTrainer from './components/FocusTrainer';
import Goals from './components/Goals';
import InitialEvaluation from './components/InitialEvaluation';
import InstallAppPrompt from './components/InstallAppPrompt';
import ProgressPanel from './components/ProgressPanel';
import ReadingTraining from './components/ReadingTraining';
import RecommendedPlan from './components/RecommendedPlan';
import RSVPTrainer from './components/RSVPTrainer';
import TextLibrary from './components/TextLibrary';
import UserProfile from './components/UserProfile';
import { buildBadges, levelFromPerformance, updateStreak } from './utils/calculations';
import { loadState, saveState } from './utils/storage';

const nav = [
  ['dashboard', 'Inicio', Home],
  ['evaluation', 'Evaluación', Gauge],
  ['plan', 'Plan', Target],
  ['training', 'Entrenamiento', BookOpen],
  ['rsvp', 'RSVP', Zap],
  ['anti', 'Anti-regresión', LineChart],
  ['focus', 'Enfoque', Brain],
  ['progress', 'Progreso', LineChart],
  ['goals', 'Metas', Flag],
  ['library', 'Biblioteca', Library],
  ['profile', 'Perfil', User]
];

export default function App() {
  const [state, setState] = useState(loadState);
  const [view, setView] = useState('dashboard');
  const [open, setOpen] = useState(false);

  useEffect(() => saveState(state), [state]);

  function patch(updater) {
    setState((current) => {
      const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
      saveState(next);
      return next;
    });
  }

  function saveSession(session) {
    if (!session) return;
    patch((current) => {
      const nextHistory = [...current.history, session];
      const streakUpdate = updateStreak(current.lastPracticeDate);
      const nextStreak = streakUpdate ? streakUpdate.streak === 'increment' ? current.streak + 1 : streakUpdate.streak : current.streak;
      const nextState = {
        ...current,
        history: nextHistory,
        currentLevel: levelFromPerformance(session.wpm, session.comprehension),
        streak: nextStreak,
        xp: current.xp + 80 + Math.round(session.comprehension / 2),
        lastPracticeDate: streakUpdate?.date || current.lastPracticeDate
      };
      return { ...nextState, badges: buildBadges(nextState, nextHistory) };
    });
  }

  function completeEvaluation(evaluation) {
    patch({ initialEvaluation: evaluation, currentLevel: evaluation.recommendedLevel });
  }

  const content = {
    dashboard: <Dashboard state={state} onNavigate={setView} />,
    evaluation: <InitialEvaluation onComplete={completeEvaluation} />,
    plan: <RecommendedPlan evaluation={state.initialEvaluation} goals={state.goals} onNavigate={setView} />,
    training: <ReadingTraining state={state} onSaveSession={saveSession} onSetLevel={(level) => patch({ currentLevel: level })} />,
    rsvp: <RSVPTrainer state={state} onSaveSession={saveSession} />,
    anti: <AntiRegressionTrainer state={state} onSaveSession={saveSession} />,
    focus: <FocusTrainer state={state} onSaveSession={saveSession} />,
    progress: <ProgressPanel history={state.history} />,
    goals: <Goals goals={state.goals} history={state.history} onSave={(goals) => patch({ goals })} />,
    library: <TextLibrary />,
    profile: <UserProfile state={state} />
  };

  return (
    <div className="app-shell">
      <aside className={open ? 'sidebar open' : 'sidebar'}>
        <div className="brand"><BookOpen size={25} /><strong>Lectura Pro IA</strong></div>
        <nav>
          {nav.map(([id, label, Icon]) => (
            <button className={view === id ? 'active' : ''} key={id} onClick={() => { setView(id); setOpen(false); }} type="button">
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
      </aside>
      <div className="content">
        <header className="topbar">
          <button className="icon-button" onClick={() => setOpen(!open)} type="button"><Menu /></button>
          <span>{state.currentLevel} · {state.streak || 0} días de racha · {state.xp || 0} XP</span>
          <InstallAppPrompt />
        </header>
        {content[view]}
      </div>
    </div>
  );
}
