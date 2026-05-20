import { useEffect, useMemo, useState } from 'react';
import { diagnosticText } from '../data/texts';
import { calculateScore, calculateWpm, levelFromPerformance, secondsBetween } from '../utils/calculations';
import Quiz from './Quiz';

export default function InitialEvaluation({ onComplete }) {
  const [startedAt, setStartedAt] = useState(null);
  const [finishedAt, setFinishedAt] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const elapsed = startedAt ? secondsBetween(startedAt, finishedAt || now) : 0;

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const allAnswered = useMemo(() => diagnosticText.comprehension.every((_, i) => answers[i] !== undefined), [answers]);

  function finishQuiz() {
    const comprehension = calculateScore(answers, diagnosticText.comprehension);
    const wpm = calculateWpm(diagnosticText.words, elapsed);
    const recommendedLevel = levelFromPerformance(wpm, comprehension);
    const next = {
      date: new Date().toISOString(),
      wpm,
      comprehension,
      retention: 0,
      time: elapsed,
      recommendedLevel,
      textId: diagnosticText.id
    };
    setResult(next);
    onComplete(next);
  }

  return (
    <main className="view">
      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Evaluación inicial</p>
            <h1>{diagnosticText.title}</h1>
          </div>
          <div className="timer">{elapsed}s</div>
        </div>
        <article className="reading-text">{diagnosticText.content}</article>
        <div className="actions">
          <button className="primary" onClick={() => { setStartedAt(Date.now()); setFinishedAt(null); setResult(null); }} disabled={startedAt && !finishedAt} type="button">Iniciar</button>
          <button className="secondary" onClick={() => setFinishedAt(Date.now())} disabled={!startedAt || finishedAt} type="button">Terminé</button>
        </div>
      </section>
      {finishedAt && !result && (
        <>
          <Quiz title="Preguntas de comprensión" questions={diagnosticText.comprehension} answers={answers} onAnswer={(i, v) => setAnswers({ ...answers, [i]: v })} />
          <button className="primary wide" onClick={finishQuiz} disabled={!allAnswered} type="button">Ver resultado diagnóstico</button>
        </>
      )}
      {result && (
        <section className="results-panel">
          <p className="eyebrow">Resultado diagnóstico</p>
          <h2>{result.wpm} ppm · {result.comprehension}% comprensión</h2>
          <p>Nivel recomendado: <strong>{result.recommendedLevel}</strong></p>
        </section>
      )}
    </main>
  );
}
