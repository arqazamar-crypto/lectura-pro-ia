export default function Goals({ goals, history, onSave }) {
  const completedThisWeek = history.filter((item) => Date.now() - new Date(item.date).getTime() < 7 * 86400000).length;
  const latest = history.at(-1) || {};
  const items = [
    ['Meta de palabras por minuto', latest.wpm || 0, goals.targetWpm],
    ['Comprensión mínima', latest.comprehension || 0, goals.minComprehension],
    ['Retención mínima', latest.retention || 0, goals.minRetention],
    ['Prácticas por semana', completedThisWeek, goals.weeklyPractices]
  ];

  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      targetWpm: Number(form.get('targetWpm')),
      minComprehension: Number(form.get('minComprehension')),
      minRetention: Number(form.get('minRetention')),
      weeklyPractices: Number(form.get('weeklyPractices'))
    });
  }

  return (
    <main className="view">
      <section className="panel">
        <p className="eyebrow">Sistema de metas</p>
        <h1>Objetivos personalizados</h1>
        <form className="goal-form" onSubmit={submit}>
          <label>Meta ppm<input name="targetWpm" type="number" defaultValue={goals.targetWpm} min="80" /></label>
          <label>Comprensión mínima<input name="minComprehension" type="number" defaultValue={goals.minComprehension} min="40" max="100" /></label>
          <label>Retención mínima<input name="minRetention" type="number" defaultValue={goals.minRetention} min="40" max="100" /></label>
          <label>Prácticas por semana<input name="weeklyPractices" type="number" defaultValue={goals.weeklyPractices} min="1" max="14" /></label>
          <button className="primary" type="submit">Guardar metas</button>
        </form>
      </section>
      <section className="panel">
        <h2>Avance visual</h2>
        {items.map(([label, value, target]) => <div className="goal-progress" key={label}><span>{label}</span><strong>{value}/{target}</strong><div className="progress"><span style={{ width: `${Math.min(100, (value / target) * 100)}%` }} /></div></div>)}
      </section>
    </main>
  );
}
