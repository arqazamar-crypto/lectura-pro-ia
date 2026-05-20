import { Sparkles } from 'lucide-react';
import { getCoachSummary } from '../utils/coach';

export default function CoachCard({ state, onAction }) {
  const coach = getCoachSummary(state);

  return (
    <section className="coach-card">
      <div className="coach-orb"><Sparkles size={24} /></div>
      <div>
        <p className="eyebrow">Coach IA</p>
        <h2>{coach.todayTask}</h2>
        <p>{coach.reason}</p>
      </div>
      <div className="coach-grid">
        <div><span>Diagnostico</span><strong>{coach.diagnosis}</strong></div>
        <div><span>Siguiente accion</span><strong>{coach.requiredAction}</strong></div>
        <div><span>Estado</span><strong>{coach.progress}</strong></div>
      </div>
      {onAction && <button className="primary wide" type="button" onClick={onAction}>{coach.requiredAction}</button>}
    </section>
  );
}
