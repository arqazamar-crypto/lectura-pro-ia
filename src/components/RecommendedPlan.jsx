export default function RecommendedPlan({ evaluation, goals, onNavigate }) {
  const level = evaluation?.recommendedLevel || 'Básico';
  const target = level === 'Básico' ? 170 : level === 'Intermedio' ? 260 : 360;
  const exercise = level === 'Básico' ? 'Lectura guiada + preguntas inmediatas' : level === 'Intermedio' ? 'RSVP a ritmo controlado + enfoque' : 'RSVP avanzado + retención diferida';
  const recommendation = evaluation
    ? evaluation.comprehension < 70
      ? 'Prioriza precisión. Repite textos del mismo nivel hasta superar 75% de comprensión.'
      : 'Tu base permite entrenar velocidad con controles de comprensión frecuentes.'
    : 'Completa la evaluación inicial para personalizar el plan.';

  return (
    <main className="view">
      <section className="panel">
        <p className="eyebrow">Plan recomendado</p>
        <h1>Nivel {level}</h1>
        <div className="plan-grid">
          <div><span>Velocidad objetivo</span><strong>{Math.max(target, goals.targetWpm)} ppm</strong></div>
          <div><span>Comprensión mínima esperada</span><strong>{goals.minComprehension}%</strong></div>
          <div><span>Retención mínima esperada</span><strong>{goals.minRetention}%</strong></div>
          <div><span>Ejercicio sugerido</span><strong>{exercise}</strong></div>
          <div><span>Meta semanal</span><strong>{goals.weeklyPractices} prácticas</strong></div>
          <div><span>Recomendación personalizada</span><strong>{recommendation}</strong></div>
        </div>
        <button className="primary" onClick={() => onNavigate('training')} type="button">Comenzar entrenamiento</button>
      </section>
    </main>
  );
}
