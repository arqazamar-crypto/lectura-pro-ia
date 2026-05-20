import { BarChart3, BookOpen, Brain, Eye, Flag, Gauge, Library, LineChart, Play, Target, Timer, Trophy, Zap } from 'lucide-react';
import { average, stableSpeed } from '../utils/calculations';

const shortcuts = [
  ['evaluation', 'Evaluación inicial', Gauge],
  ['training', 'Iniciar entrenamiento', Play],
  ['rsvp', 'Técnica RSVP', Zap],
  ['anti', 'Anti-regresión', Eye],
  ['focus', 'Enfoque', Brain],
  ['progress', 'Progreso', LineChart],
  ['goals', 'Metas', Flag],
  ['library', 'Biblioteca', Library]
];

export default function Dashboard({ state, onNavigate }) {
  const history = state.history || [];
  const currentWpm = history.at(-1)?.wpm || state.initialEvaluation?.wpm || 0;
  const stats = [
    ['Velocidad actual', `${currentWpm} ppm`, Timer],
    ['Comprensión promedio', `${average(history, 'comprehension')}%`, Brain],
    ['Retención promedio', `${average(history, 'retention')}%`, BookOpen],
    ['Prácticas realizadas', history.length, BarChart3],
    ['Mejor velocidad estable', `${stableSpeed(history)} ppm`, Trophy],
    ['Nivel actual', state.currentLevel, Target],
    ['Racha de entrenamiento', `${state.streak || 0} días`, Zap]
  ];

  return (
    <main className="view">
      <section className="hero">
        <div>
          <p className="eyebrow">Entrenador personal de lectura</p>
          <h1>Lectura Pro IA</h1>
          <p>Lee más rápido, comprende mejor y retén más</p>
        </div>
        <button className="primary" onClick={() => onNavigate('training')} type="button"><Play size={18} /> Iniciar práctica</button>
      </section>
      <section className="stats-grid">
        {stats.map(([label, value, Icon]) => (
          <article className="stat-card" key={label}>
            <Icon size={21} />
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>
      <section>
        <div className="section-head">
          <h2>Accesos rápidos</h2>
          <span>Flujo completo de entrenamiento</span>
        </div>
        <div className="shortcut-grid">
          {shortcuts.map(([view, label, Icon]) => (
            <button className="shortcut" key={view} onClick={() => onNavigate(view)} type="button">
              <Icon size={22} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
