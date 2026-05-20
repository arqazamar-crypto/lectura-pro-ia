import { useEffect, useMemo, useState } from 'react';
import { BookOpen, CalendarDays, Home, LineChart, User, Dumbbell } from 'lucide-react';
import AntiRegressionTrainer from './components/AntiRegressionTrainer';
import Dashboard from './components/Dashboard';
import EvaluationGate from './components/EvaluationGate';
import FocusTrainer from './components/FocusTrainer';
import Goals from './components/Goals';
import InitialEvaluation from './components/InitialEvaluation';
import InstallAppPrompt from './components/InstallAppPrompt';
import ProgressPanel from './components/ProgressPanel';
import ProgramSelector from './components/ProgramSelector';
import ReadingTraining from './components/ReadingTraining';
import RecommendedPlan from './components/RecommendedPlan';
import RSVPTrainer from './components/RSVPTrainer';
import TextLibrary from './components/TextLibrary';
import TodayScreen from './components/TodayScreen';
import TrainingHub from './components/TrainingHub';
import UpdateAvailableBanner from './components/UpdateAvailableBanner';
import UserProfile from './components/UserProfile';
import { buildBadges, levelFromPerformance, updateStreak } from './utils/calculations';
import { getAdjustment, getCoachSummary, getDailySession, suggestProgram } from './utils/coach';
import { loadState, saveState } from './utils/storage';

const bottomNav = [
  ['dashboard', 'Home', Home],
  ['today', 'Hoy', CalendarDays],
  ['train', 'Entrenar', Dumbbell],
  ['progress', 'Progreso', LineChart],
  ['profile', 'Perfil', User]
];

export default function App() {
  const [state, setState] = useState(loadState);
  const [view, setView] = useState(state.initialEvaluation ? 'dashboard' : 'gate');

  useEffect(() => saveState(state), [state]);

  const dailySession = useMemo(() => (state.activeProgram ? getDailySession(state) : null), [state]);

  function patch(updater) {
    setState((current) => {
      const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
      saveState(next);
      return next;
    });
  }

  function navigate(nextView) {
    if (!state.initialEvaluation && nextView !== 'evaluation' && nextView !== 'gate') {
      setView('gate');
      return;
    }
    if (state.initialEvaluation && !state.activeProgram && !['dashboard', 'plan', 'profile', 'progress', 'goals', 'library'].includes(nextView)) {
      setView('plan');
      return;
    }
    setView(nextView);
  }

  function saveSession(session) {
    if (!session) return;
    patch((current) => {
      const today = new Date().toISOString().slice(0, 10);
      const planSession = current.activeProgram ? getDailySession(current) : null;
      const enriched = {
        ...session,
        planDay: planSession?.day || current.currentPlanDay,
        programId: current.activeProgram,
        completedDate: today
      };
      const nextHistory = [...current.history, enriched];
      const streakUpdate = updateStreak(current.lastPracticeDate);
      const nextStreak = streakUpdate ? streakUpdate.streak === 'increment' ? current.streak + 1 : streakUpdate.streak : current.streak;
      const adjustment = getAdjustment({ ...current, history: nextHistory });
      const nextState = {
        ...current,
        history: nextHistory,
        currentLevel: levelFromPerformance(enriched.wpm, enriched.comprehension),
        currentPlanDay: current.activeProgram ? current.currentPlanDay + 1 : current.currentPlanDay,
        dailySession: null,
        inProgressSession: null,
        streak: nextStreak,
        xp: current.xp + 100 + Math.round(enriched.comprehension / 2),
        lastPracticeDate: streakUpdate?.date || current.lastPracticeDate,
        lastCoachMessage: adjustment.message,
        routeProgress: {
          evaluation: 'completed',
          plan: current.activeProgram ? 'completed' : 'available',
          today: 'available',
          progress: 'available',
          level: enriched.comprehension >= 75 && enriched.retention >= 70 ? 'available' : 'locked'
        }
      };
      return { ...nextState, badges: buildBadges(nextState, nextHistory) };
    });
  }

  function completeEvaluation(evaluation) {
    const suggested = suggestProgram(evaluation, state.history);
    patch({
      initialEvaluation: evaluation,
      currentLevel: evaluation.recommendedLevel,
      lastCoachMessage: `Tu diagnostico esta listo. Te recomiendo ${suggested.name}.`,
      routeProgress: {
        evaluation: 'completed',
        plan: 'available',
        today: 'locked',
        progress: 'locked',
        level: 'locked'
      }
    });
    setView('plan');
  }

  function selectProgram(programId) {
    patch({
      activeProgram: programId,
      programStartedAt: new Date().toISOString(),
      currentPlanDay: 1,
      dailySession: null,
      routeProgress: {
        evaluation: 'completed',
        plan: 'completed',
        today: 'available',
        progress: 'locked',
        level: 'locked'
      },
      lastCoachMessage: 'Tu plan quedo activo. Completa la sesion de hoy para avanzar.'
    });
    setView('today');
  }

  function resetEvaluation() {
    patch({
      initialEvaluation: null,
      activeProgram: null,
      programStartedAt: null,
      currentPlanDay: 1,
      routeProgress: {
        evaluation: 'available',
        plan: 'locked',
        today: 'locked',
        progress: 'locked',
        level: 'locked'
      },
      lastCoachMessage: 'Evaluacion reiniciada. Tu historial se conserva.'
    });
    setView('gate');
  }

  const common = {
    state,
    dailySession,
    onSaveSession: saveSession,
    onStartSession: (sessionInfo) => patch({ inProgressSession: { ...sessionInfo, startedAt: new Date().toISOString() } }),
    onClearInProgress: () => patch({ inProgressSession: null }),
    onGoHome: () => navigate('dashboard'),
    onContinuePlan: () => navigate('today')
  };

  const content = {
    gate: <EvaluationGate state={state} onStart={() => setView('evaluation')} />,
    dashboard: <Dashboard state={state} onNavigate={navigate} coach={getCoachSummary(state)} />,
    today: <TodayScreen state={state} onNavigate={navigate} onChooseProgram={() => navigate('plan')} />,
    train: <TrainingHub onNavigate={navigate} />,
    evaluation: <InitialEvaluation onComplete={completeEvaluation} onGoHome={() => navigate('dashboard')} />,
    plan: <ProgramSelector state={state} onSelect={selectProgram} />,
    legacyPlan: <RecommendedPlan evaluation={state.initialEvaluation} goals={state.goals} onNavigate={navigate} />,
    training: <ReadingTraining {...common} onSetLevel={(level) => patch({ currentLevel: level })} />,
    rsvp: <RSVPTrainer {...common} />,
    anti: <AntiRegressionTrainer {...common} />,
    focus: <FocusTrainer {...common} />,
    progress: <ProgressPanel history={state.history} state={state} onGoHome={() => navigate('dashboard')} />,
    goals: <Goals goals={state.goals} history={state.history} onSave={(goals) => patch({ goals })} />,
    library: <TextLibrary />,
    profile: <UserProfile state={state} onResetEvaluation={resetEvaluation} onChangeProgram={() => navigate('plan')} onSaveName={(userName) => patch({ userName })} />
  };

  const visibleView = !state.initialEvaluation && view !== 'evaluation' ? 'gate' : view;

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <header className="topbar">
          <div className="top-brand">
            <BookOpen size={19} />
            <span>Lectura Pro IA</span>
          </div>
          <InstallAppPrompt />
        </header>
        <UpdateAvailableBanner />
        <div className="content">
          {content[visibleView] || content.dashboard}
        </div>
        {state.initialEvaluation && (
          <nav className="bottom-nav">
            {bottomNav.map(([id, label, Icon]) => (
              <button className={view === id ? 'active' : ''} key={id} onClick={() => navigate(id)} type="button">
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
