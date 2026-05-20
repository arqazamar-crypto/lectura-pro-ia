import { useMemo, useState } from 'react';
import { texts } from '../data/texts';

export default function TextLibrary() {
  const [level, setLevel] = useState('Todos');
  const [topic, setTopic] = useState('Todos');
  const topics = ['Todos', ...new Set(texts.map((text) => text.topic))];
  const filtered = useMemo(() => texts.filter((text) => (level === 'Todos' || text.level === level) && (topic === 'Todos' || text.topic === topic)), [level, topic]);

  return (
    <main className="view">
      <section className="panel">
        <div className="section-head"><div><p className="eyebrow">Biblioteca de textos</p><h1>Lecturas por nivel y tema</h1></div><span>{filtered.length} textos</span></div>
        <div className="control-row">
          <select value={level} onChange={(e) => setLevel(e.target.value)}><option>Todos</option><option>Básico</option><option>Intermedio</option><option>Avanzado</option></select>
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>{topics.map((item) => <option key={item}>{item}</option>)}</select>
        </div>
      </section>
      <section className="library-grid">
        {filtered.map((text) => (
          <article className="text-card" key={text.id}>
            <div><span className={`pill ${text.level.toLowerCase()}`}>{text.level}</span><span className="pill">{text.topic}</span></div>
            <h2>{text.title}</h2>
            <p>{text.content}</p>
            <footer>{text.minutes} min · {text.words} palabras · {text.comprehension.length + text.retention.length} preguntas</footer>
          </article>
        ))}
      </section>
    </main>
  );
}
