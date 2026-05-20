import { useEffect, useState } from 'react';
import { texts } from '../data/texts';
import { calculateScore, calculateWpm, recommendationFor, resultLabel } from '../utils/calculations';
import Quiz from './Quiz';
import SessionResults from './SessionResults';

const delays = { baja: 1600, media: 1050, alta: 700 };

export default function AntiRegressionTrainer({ state, onSaveSession }) {
  const [textId, setTextId] = useState(texts[1].id);
  const text = texts.find((item) => item.id === textId) || texts[1];
  const lines = text.content.match(/.{1,95}(\s|$)/g) || [text.content];
  const [speed, setSpeed] = useState('media');
  const [line, setLine] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState({});
  const [retAnswers, setRetAnswers] = useState({});
  const [session, setSession] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setLine((current) => {
        if (current >= lines.length - 1) {
          setRunning(false);
          setDone(true);
          return current;
        }
        return current + 1;
      });
    }, delays[speed]);
    return () => clearInterval(id);
  }, [running, speed, lines.length]);

  function reset() {
    setLine(0);
    setRunning(false);
    setDone(false);
    setAnswers({});
    setRetAnswers({});
    setSession(null);
    setSaved(false);
  }

  function finish() {
    const time = Math.round((lines.length * delays[speed]) / 1000);
    const comprehension = calculateScore(answers, text.comprehension);
    const retention = calculateScore(retAnswers, text.retention);
    const base = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: 'Anti-regresión',
      level: text.level,
      textTitle: text.title,
      wpm: calculateWpm(text.words, time),
      comprehension,
      retention,
      time,
      exercise: 'Guía visual por líneas'
    };
    setSession({ ...base, recommendation: recommendationFor(base, state.history), result: resultLabel(base) });
  }

  return (
    <main className="view">
      <section className="panel">
        <div className="section-head"><div><p className="eyebrow">Anti-regresión</p><h1>Avance guiado</h1></div><span>Línea {line + 1}/{lines.length}</span></div>
        <div className="control-row">
          <select value={speed} onChange={(e) => setSpeed(e.target.value)}><option value="baja">Velocidad baja</option><option value="media">Velocidad media</option><option value="alta">Velocidad alta</option></select>
          <select value={text.id} onChange={(e) => { setTextId(e.target.value); reset(); }}>{texts.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select>
        </div>
        <div className="line-reader">
          {lines.map((item, index) => <p className={index === line ? 'active-line' : index < line ? 'past-line' : ''} key={`${item}-${index}`}>{item}</p>)}
        </div>
        <div className="actions">
          <button className="primary" onClick={() => setRunning(true)} disabled={running || done} type="button">Iniciar</button>
          <button className="secondary" onClick={() => setRunning(false)} disabled={!running} type="button">Pausar</button>
          <button className="secondary" onClick={reset} type="button">Reiniciar</button>
        </div>
      </section>
      {done && !session && <><Quiz title="Evaluación final" questions={text.comprehension} answers={answers} onAnswer={(i, v) => setAnswers({ ...answers, [i]: v })} /><Quiz title="Retención" questions={text.retention} answers={retAnswers} onAnswer={(i, v) => setRetAnswers({ ...retAnswers, [i]: v })} /><button className="primary wide" onClick={finish} disabled={text.comprehension.some((_, i) => answers[i] === undefined) || text.retention.some((_, i) => retAnswers[i] === undefined)} type="button">Ver resultados</button></>}
      <SessionResults session={session} previous={state.history.at(-1)} saved={saved} onRepeat={reset} onLevelUp={reset} onSave={() => { onSaveSession(session); setSaved(true); }} />
    </main>
  );
}
