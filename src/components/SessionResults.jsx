import { ArrowUpRight, Repeat2, Save, TrendingUp } from 'lucide-react';
import { nextLevel } from '../utils/calculations';

export default function SessionResults({ session, previous, onSave, onRepeat, onLevelUp, saved }) {
  if (!session) return null;
  const diff = previous ? session.wpm - previous.wpm : 0;
  const canLevelUp = session.comprehension >= 85 && session.retention >= 75;

  return (
    <section className="results-panel">
      <div>
        <p className="eyebrow">Resultado final</p>
        <h2>{session.result}</h2>
        <p>{session.recommendation}</p>
      </div>
      <div className="metrics-grid">
        <div className="metric"><span>PPM</span><strong>{session.wpm}</strong></div>
        <div className="metric good"><span>Comprensión</span><strong>{session.comprehension}%</strong></div>
        <div className="metric"><span>Retención</span><strong>{session.retention}%</strong></div>
        <div className="metric"><span>Tiempo</span><strong>{session.time}s</strong></div>
      </div>
      <div className="comparison">
        <TrendingUp size={18} />
        {previous ? `Comparado con la sesión anterior: ${diff >= 0 ? '+' : ''}${diff} ppm.` : 'Primera sesión registrada para comparar.'}
      </div>
      <div className="actions">
        <button className="secondary" onClick={onRepeat} type="button"><Repeat2 size={18} /> Repetir</button>
        {canLevelUp && <button className="secondary" onClick={() => onLevelUp(nextLevel(session.level))} type="button"><ArrowUpRight size={18} /> Subir dificultad</button>}
        <button className="primary" onClick={onSave} disabled={saved} type="button"><Save size={18} /> {saved ? 'Guardado' : 'Guardar resultado'}</button>
      </div>
    </section>
  );
}
