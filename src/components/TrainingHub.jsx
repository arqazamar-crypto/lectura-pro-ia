import { BookOpen, Brain, Eye, Library, Target, Zap } from 'lucide-react';

const modules = [
  ['training', 'Lectura guiada', 'Mide velocidad, comprension y retencion.', BookOpen],
  ['rsvp', 'RSVP', 'Palabras una por una al centro.', Zap],
  ['anti', 'Anti-regresion', 'Avance visual para evitar releer.', Eye],
  ['focus', 'Enfoque', 'Idea principal, palabras clave y resumen.', Brain],
  ['goals', 'Metas', 'Ajusta tus objetivos personales.', Target],
  ['library', 'Biblioteca', 'Textos por nivel y tema.', Library]
];

export default function TrainingHub({ onNavigate }) {
  return (
    <main className="view mobile-view">
      <section className="screen-title">
        <p className="eyebrow">Entrenar</p>
        <h1>Modulos de practica</h1>
        <p>Usa la sesion de Hoy como ruta principal. Estos modulos quedan como apoyo controlado.</p>
      </section>
      <section className="module-grid">
        {modules.map(([view, title, description, Icon]) => (
          <button className="module-card" key={view} type="button" onClick={() => onNavigate(view)}>
            <Icon size={22} />
            <span>{title}</span>
            <p>{description}</p>
          </button>
        ))}
      </section>
    </main>
  );
}
