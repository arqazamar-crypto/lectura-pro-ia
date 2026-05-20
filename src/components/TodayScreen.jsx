import { CalendarDays, Play, Route } from 'lucide-react';
import CoachCard from './CoachCard';
import RouteTimeline from './RouteTimeline';
import { getDailySession, isTodayDone } from '../utils/coach';
import { getProgram } from '../data/programs';

export default function TodayScreen({ state, onNavigate, onChooseProgram }) {
  if (!state.activeProgram) {
    return (
      <main className="view mobile-view">
        <CoachCard state={state} onAction={onChooseProgram} />
        <RouteTimeline state={state} />
      </main>
    );
  }

  const session = getDailySession(state);
  const program = getProgram(state.activeProgram);
  const done = isTodayDone(state);
  const totalDays = program.durationWeeks * program.schedule.length;

  return (
    <main className="view mobile-view">
      <CoachCard state={state} />
      <section className="today-card">
        <div className="today-top">
          <div>
            <p className="eyebrow">Hoy</p>
            <h1>{session.title}</h1>
            <p>{session.coachMessage}</p>
          </div>
          <div className="day-pill">Dia {session.day}</div>
        </div>
        <div className="today-details">
          <div><CalendarDays size={18} /><span>{session.estimatedMinutes} min</span></div>
          <div><Route size={18} /><span>{session.technique}</span></div>
          <div><Play size={18} /><span>{session.targetWpm} ppm objetivo</span></div>
        </div>
        <div className="goal-progress">
          <span>Progreso del plan</span>
          <strong>{Math.min(session.day, totalDays)}/{totalDays}</strong>
          <div className="progress"><span style={{ width: `${Math.min(100, (session.day / totalDays) * 100)}%` }} /></div>
        </div>
        <div className="instruction-box">
          <strong>Objetivo del dia</strong>
          <p>{session.objective}</p>
        </div>
        {state.inProgressSession && (
          <div className="instruction-box accent">
            <strong>Sesion sin terminar</strong>
            <p>Puedes reanudar {state.inProgressSession.title} o repetirla desde el inicio.</p>
          </div>
        )}
        <button className="primary wide" type="button" disabled={done} onClick={() => onNavigate(session.view)}>
          {done ? 'Sesion completada hoy' : state.inProgressSession ? 'Reanudar sesion' : 'Iniciar sesion'}
        </button>
      </section>
      <RouteTimeline state={state} />
    </main>
  );
}
