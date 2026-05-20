import { Home, TrendingUp } from 'lucide-react';
import { average, stableSpeed } from '../utils/calculations';

export default function ProgressPanel({ history, state, onGoHome }) {
  const last7 = history.slice(-7);
  const completedThisWeek = history.filter((item) => Date.now() - new Date(item.date).getTime() < 7 * 86400000).length;
  const trend = last7.length < 2 ? 'Sin datos suficientes' : last7.at(-1).comprehension >= last7[0].comprehension ? 'Tendencia positiva' : 'Necesita refuerzo';
  const activities = history.slice().reverse().slice(0, 8);

  return (
    <main className="view mobile-view">
      <section className="screen-title">
        <p className="eyebrow">Progreso</p>
        <h1>Resultados reales</h1>
        <p>El Coach IA usa estos datos para ajustar tu proxima tarea.</p>
      </section>
      <section className="metric-row">
        <article className="glass-stat"><strong>{completedThisWeek}</strong><span>Esta semana</span></article>
        <article className="glass-stat"><strong>{state?.streak || 0}</strong><span>Racha</span></article>
        <article className="glass-stat"><strong>{average(history, 'wpm')}</strong><span>PPM promedio</span></article>
        <article className="glass-stat"><strong>{stableSpeed(history)}</strong><span>Mejor estable</span></article>
      </section>
      <section className="panel elevated">
        <div className="section-head">
          <div>
            <p className="eyebrow">Evolucion</p>
            <h2>{trend}</h2>
          </div>
          <TrendingUp size={22} />
        </div>
        <div className="mini-bars neon-bars">
          {last7.map((item) => <span key={item.id} style={{ height: `${Math.max(12, item.comprehension)}%` }} title={`${item.comprehension}%`} />)}
          {!last7.length && <p>Aun no hay sesiones guardadas.</p>}
        </div>
      </section>
      <section className="metric-row three">
        <article className="glass-stat"><strong>{average(history, 'comprehension')}%</strong><span>Comprension</span></article>
        <article className="glass-stat"><strong>{average(history, 'retention')}%</strong><span>Retencion</span></article>
        <article className="glass-stat"><strong>{history.length}</strong><span>Sesiones</span></article>
      </section>
      <section className="activity-list">
        <div className="section-head"><h2>Actividades completadas</h2><span>{activities.length}</span></div>
        {activities.map((item) => (
          <article className="activity-card" key={item.id}>
            <div>
              <strong>{item.type}</strong>
              <span>{new Date(item.date).toLocaleDateString()} · {item.level}</span>
            </div>
            <div><strong>{item.wpm}</strong><span>ppm</span></div>
            <div><strong>{item.comprehension}%</strong><span>comp.</span></div>
          </article>
        ))}
      </section>
      <button className="secondary wide" type="button" onClick={onGoHome}><Home size={18} /> Volver a Home</button>
    </main>
  );
}
