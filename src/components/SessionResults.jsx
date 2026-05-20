import { ArrowRight, Home, Repeat2, Save } from 'lucide-react';

export default function SessionResults({ session, previous, onSave, onRepeat, onGoHome, onContinuePlan, saved }) {
  if (!session) return null;
  const diffComp = previous ? session.comprehension - previous.comprehension : 0;
  const score = Math.round(session.comprehension * 0.42 + session.retention * 0.34 + Math.min(session.wpm / 4, 100) * 0.24);
  const precision = Math.round((session.comprehension + session.retention) / 2);

  return (
    <section className="results-panel pro-results">
      <div className="score-wrap">
        <div className="score-ring" style={{ '--score': `${score}%` }}>
          <strong>{score}%</strong>
          <span>Score</span>
        </div>
        <div>
          <p className="eyebrow">Resultado final</p>
          <h2>{session.result}</h2>
          <p>{coachLine(session, diffComp)}</p>
        </div>
      </div>
      <div className="metrics-grid">
        <div className="metric"><span>Velocidad</span><strong>{session.wpm} ppm</strong></div>
        <div className="metric good"><span>Comprension</span><strong>{session.comprehension}%</strong></div>
        <div className="metric"><span>Retencion</span><strong>{session.retention}%</strong></div>
        <div className="metric"><span>Precision</span><strong>{precision}%</strong></div>
      </div>
      <div className="instruction-box accent">
        <strong>Diagnostico del Coach IA</strong>
        <p>{session.recommendation}</p>
        <small>{previous ? `Comparado con la sesion anterior: ${diffComp >= 0 ? '+' : ''}${diffComp}% comprension.` : 'Primera sesion guardada para crear comparativas.'}</small>
      </div>
      <div className="actions result-actions">
        <button className="primary" onClick={onSave} disabled={saved} type="button"><Save size={18} /> {saved ? 'Guardado' : 'Guardar resultado'}</button>
        <button className="secondary" onClick={onGoHome} type="button"><Home size={18} /> Volver a Home</button>
        <button className="secondary" onClick={onRepeat} type="button"><Repeat2 size={18} /> Repetir prueba</button>
        <button className="secondary" onClick={onContinuePlan} type="button"><ArrowRight size={18} /> Continuar plan</button>
      </div>
    </section>
  );
}

function coachLine(session, diffComp) {
  if (session.comprehension < 75) return 'No avances todavia. Primero recupera comprension.';
  if (session.retention < 70) return 'Buen avance, pero tu retencion aun necesita refuerzo.';
  if (diffComp > 0) return `Buen avance. Tu comprension subio ${diffComp}%.`;
  return 'Sesion registrada. Mantente constante y prioriza precision.';
}
