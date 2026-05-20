import { ArrowRight, BarChart3, Brain, CalendarDays, Flame, Gauge, Trophy } from 'lucide-react';
import CoachCard from './CoachCard';
import RouteTimeline from './RouteTimeline';
import { average, stableSpeed } from '../utils/calculations';
import { getDailySession } from '../utils/coach';
import { getProgram } from '../data/programs';

export default function Dashboard({ state, onNavigate }) {
  const history = state.history || [];
  const currentWpm = history.at(-1)?.wpm || state.initialEvaluation?.wpm || 0;
  const program = state.activeProgram ? getProgram(state.activeProgram) : null;
  const daily = state.activeProgram ? getDailySession(state) : null;
  const stats = [
    ['PPM actual', `${currentWpm}`, Gauge],
    ['Comprension', `${average(history, 'comprehension')}%`, Brain],
    ['Racha', `${state.streak || 0}`, Flame],
    ['Mejor estable', `${stableSpeed(history)}`, Trophy]
  ];

  return (
    <main className="view mobile-view">
      <section className="home-hero">
        <div>
          <p className="eyebrow">IA que evalua, entrena y guia</p>
          <h1>Entrena tu mente. Acelera tu lectura.</h1>
          <p>Tu ruta diaria se ajusta segun comprension, retencion y constancia.</p>
        </div>
        <button className="primary" type="button" onClick={() => onNavigate(state.activeProgram ? 'today' : 'plan')}>
          {state.activeProgram ? 'Ver sesion de hoy' : 'Elegir ruta'} <ArrowRight size={18} />
        </button>
      </section>
      <section className="metric-row">
        {stats.map(([label, value, Icon]) => (
          <article className="glass-stat" key={label}>
            <Icon size={18} />
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </section>
      <CoachCard state={state} onAction={() => onNavigate(state.activeProgram ? daily.view : 'plan')} />
      {program && (
        <section className="today-card compact-card">
          <p className="eyebrow">Programa activo</p>
          <h2>{program.name}</h2>
          <p>{program.objective}</p>
          <div className="program-meta">
            <span>Semana {Math.max(1, Math.ceil((state.currentPlanDay || 1) / program.schedule.length))}</span>
            <span>{program.frequency}</span>
          </div>
          <button className="secondary wide" type="button" onClick={() => onNavigate('today')}>
            <CalendarDays size={18} /> Continuar plan
          </button>
        </section>
      )}
      <RouteTimeline state={state} />
      <section className="module-grid">
        <button className="module-card" type="button" onClick={() => onNavigate('progress')}><BarChart3 size={22} /><span>Progreso real</span><p>Analiza tus ultimos resultados.</p></button>
        <button className="module-card" type="button" onClick={() => onNavigate('train')}><Brain size={22} /><span>Practica extra</span><p>Refuerza sin romper tu ruta.</p></button>
      </section>
    </main>
  );
}
