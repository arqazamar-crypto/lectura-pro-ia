import { useEffect, useMemo, useState } from 'react';
import { Home } from 'lucide-react';
import { diagnosticText } from '../data/texts';
import { calculateScore, calculateWpm, levelFromPerformance, secondsBetween } from '../utils/calculations';
import Quiz from './Quiz';

export default function InitialEvaluation({ onComplete, onGoHome }) {
  const [startedAt, setStartedAt] = useState(null);
  const [finishedAt, setFinishedAt] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [phase, setPhase] = useState('read');
  const [answers, setAnswers] = useState({});
  const [retAnswers, setRetAnswers] = useState({});
  const [result, setResult] = useState(null);
  const elapsed = startedAt ? secondsBetween(startedAt, finishedAt || now) : 0;

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const allAnswered = useMemo(() => diagnosticText.comprehension.every((_, i) => answers[i] !== undefined), [answers]);
  const allRetAnswered = useMemo(() => diagnosticText.retention.every((_, i) => retAnswers[i] !== undefined), [retAnswers]);

  function finishQuiz() {
    const comprehension = calculateScore(answers, diagnosticText.comprehension);
    const retention = calculateScore(retAnswers, diagnosticText.retention);
    const wpm = calculateWpm(diagnosticText.words, elapsed);
    const recommendedLevel = levelFromPerformance(wpm, comprehension);
    const next = {
      date: new Date().toISOString(),
      wpm,
      comprehension,
      retention,
      time: elapsed,
      recommendedLevel,
      textId: diagnosticText.id
    };
    setResult(next);
    onComplete(next);
  }

  return (
    <main className="view mobile-view">
      <section className="panel elevated">
        <div className="section-head">
          <div>
            <p className="eyebrow">Evaluacion inicial obligatoria</p>
            <h1>{diagnosticText.title}</h1>
          </div>
          <div className="timer">{elapsed}s</div>
        </div>
        <div className="instruction-box">
          <strong>Instrucciones</strong>
          <p>Lee el texto a tu ritmo normal. Cuando termines, presiona Termine. Despues responderas preguntas para medir comprension y retencion.</p>
        </div>
        <article className="reading-text">{diagnosticText.content}</article>
        <div className="actions">
          <button className="primary" onClick={() => { setStartedAt(Date.now()); setFinishedAt(null); setResult(null); setPhase('read'); }} disabled={startedAt && !finishedAt} type="button">Iniciar</button>
          <button className="secondary" onClick={() => { setFinishedAt(Date.now()); setPhase('comp'); }} disabled={!startedAt || finishedAt} type="button">Termine</button>
        </div>
      </section>
      {phase === 'comp' && !result && (
        <>
          <Quiz title="Preguntas de comprension" questions={diagnosticText.comprehension} answers={answers} onAnswer={(i, v) => setAnswers({ ...answers, [i]: v })} />
          <button className="primary wide" onClick={() => setPhase('ret')} disabled={!allAnswered} type="button">Continuar a retencion</button>
        </>
      )}
      {phase === 'ret' && !result && (
        <>
          <Quiz title="Preguntas de retencion" questions={diagnosticText.retention} answers={retAnswers} onAnswer={(i, v) => setRetAnswers({ ...retAnswers, [i]: v })} />
          <button className="primary wide" onClick={finishQuiz} disabled={!allRetAnswered} type="button">Crear mi plan personalizado</button>
        </>
      )}
      {result && (
        <section className="results-panel">
          <p className="eyebrow">Resultado diagnostico</p>
          <h2>{result.wpm} ppm · {result.comprehension}% comprension · {result.retention}% retencion</h2>
          <p>Nivel recomendado: <strong>{result.recommendedLevel}</strong></p>
          <button className="secondary" type="button" onClick={onGoHome}><Home size={18} /> Volver a Home</button>
        </section>
      )}
    </main>
  );
}
