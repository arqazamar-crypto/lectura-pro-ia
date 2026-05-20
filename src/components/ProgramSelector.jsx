import { CheckCircle2, Sparkles } from 'lucide-react';
import { programs } from '../data/programs';
import { suggestProgram } from '../utils/coach';

export default function ProgramSelector({ state, onSelect }) {
  const suggested = suggestProgram(state.initialEvaluation, state.history);

  return (
    <main className="view mobile-view">
      <section className="screen-title">
        <p className="eyebrow">Plan personalizado</p>
        <h1>Elige tu ruta</h1>
        <p>El Coach IA recomienda una ruta segun tu diagnostico, pero puedes elegir otra si tu objetivo cambio.</p>
      </section>
      <div className="program-grid">
        {programs.map((program) => (
          <article className={program.id === suggested.id ? 'program-card recommended' : 'program-card'} key={program.id}>
            {program.id === suggested.id && <span className="recommend-badge"><Sparkles size={14} /> Recomendada por IA</span>}
            <h2>{program.name}</h2>
            <p>{program.objective}</p>
            <div className="program-meta">
              <span>{program.durationWeeks} semanas</span>
              <span>{program.frequency}</span>
            </div>
            <div className="mini-metrics">
              <div><span>Meta ppm</span><strong>{program.targetWpm}</strong></div>
              <div><span>Comprension</span><strong>{program.targetComprehension}%</strong></div>
              <div><span>Retencion</span><strong>{program.targetRetention}%</strong></div>
            </div>
            <div className="module-list">
              {program.modules.map((module) => <span key={module}>{module}</span>)}
            </div>
            <button className="primary wide" type="button" onClick={() => onSelect(program.id)}>
              <CheckCircle2 size={18} /> Elegir ruta
            </button>
          </article>
        ))}
      </div>
    </main>
  );
}
