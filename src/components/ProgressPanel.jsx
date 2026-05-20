import { average, stableSpeed } from '../utils/calculations';

export default function ProgressPanel({ history }) {
  const last7 = history.slice(-7);
  const trend = last7.length < 2 ? 'Sin tendencia suficiente' : last7.at(-1).comprehension >= last7[0].comprehension ? 'Tendencia positiva' : 'Tendencia a reforzar';
  return (
    <main className="view">
      <section className="stats-grid">
        <article className="stat-card"><span>Promedio velocidad</span><strong>{average(history, 'wpm')} ppm</strong></article>
        <article className="stat-card"><span>Promedio comprensión</span><strong>{average(history, 'comprehension')}%</strong></article>
        <article className="stat-card"><span>Promedio retención</span><strong>{average(history, 'retention')}%</strong></article>
        <article className="stat-card"><span>Mejor velocidad estable</span><strong>{stableSpeed(history)} ppm</strong></article>
        <article className="stat-card"><span>Total prácticas</span><strong>{history.length}</strong></article>
        <article className="stat-card"><span>Tendencia general</span><strong>{trend}</strong></article>
      </section>
      <section className="panel">
        <div className="section-head"><h1>Historial de progreso</h1><span>Últimos 7 resultados visibles</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Fecha</th><th>Tipo</th><th>Nivel</th><th>PPM</th><th>Comprensión</th><th>Retención</th><th>Tiempo</th><th>Recomendación</th><th>Resultado</th></tr></thead>
            <tbody>
              {history.slice().reverse().map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.date).toLocaleDateString()}</td><td>{item.type}</td><td>{item.level}</td><td>{item.wpm}</td><td>{item.comprehension}%</td><td>{item.retention}%</td><td>{item.time}s</td><td>{item.recommendation}</td><td>{item.result}</td>
                </tr>
              ))}
              {!history.length && <tr><td colSpan="9">Aún no hay prácticas guardadas.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      <section className="panel"><h2>Últimos 7 resultados</h2><div className="mini-bars">{last7.map((item) => <span key={item.id} style={{ height: `${Math.max(12, item.comprehension)}%` }} title={`${item.comprehension}%`} />)}</div></section>
    </main>
  );
}
