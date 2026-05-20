import { useEffect, useMemo, useState } from 'react';
import { texts } from '../data/texts';
import { calculateScore, recommendationFor, resultLabel } from '../utils/calculations';
import Quiz from './Quiz';
import SessionResults from './SessionResults';

const speeds = [150, 200, 250, 300, 400, 500];

export default function RSVPTrainer({ state, onSaveSession, onGoHome, onContinuePlan, onStartSession, onClearInProgress }) {
  const [speed, setSpeed] = useState(state.settings?.preferredSpeed || 200);
  const [textId, setTextId] = useState(texts[0].id);
  const text = texts.find((item) => item.id === textId) || texts[0];
  const words = useMemo(() => text.content.split(/\s+/), [text]);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState({});
  const [retAnswers, setRetAnswers] = useState({});
  const [session, setSession] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setIndex((current) => {
        if (current >= words.length - 1) {
          setRunning(false);
          setDone(true);
          return current;
        }
        return current + 1;
      });
    }, 60000 / speed);
    return () => clearInterval(id);
  }, [running, speed, words.length]);

  function reset() {
    setIndex(0);
    setRunning(false);
    setDone(false);
    setAnswers({});
    setRetAnswers({});
    setSession(null);
    setSaved(false);
  }

  function finish() {
    const comprehension = calculateScore(answers, text.comprehension);
    const retention = calculateScore(retAnswers, text.retention);
    const time = Math.round((words.length / speed) * 60);
    const base = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: 'Técnica RSVP',
      level: text.level,
      textTitle: text.title,
      wpm: speed,
      comprehension,
      retention,
      time,
      exercise: 'RSVP'
    };
    setSession({ ...base, recommendation: recommendationFor(base, state.history), result: resultLabel(base) });
  }

  return (
    <main className="view">
      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Técnica RSVP</p>
            <h1>Palabra por palabra</h1>
          </div>
          <span>{index + 1}/{words.length}</span>
        </div>
        <div className="control-row">
          <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>{speeds.map((item) => <option key={item} value={item}>{item} ppm</option>)}</select>
          <select value={text.id} onChange={(e) => { setTextId(e.target.value); reset(); }}>{texts.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select>
        </div>
        <div className="instruction-box">
          <strong>Instrucciones</strong>
          <p>Las palabras apareceran una por una. Mantén la vista al centro. No intentes regresar.</p>
        </div>
        <div className="rsvp-display">{words[index]}</div>
        <div className="progress"><span style={{ width: `${((index + 1) / words.length) * 100}%` }} /></div>
        <div className="actions">
          <button className="primary" onClick={() => { onStartSession?.({ title: text.title, view: 'rsvp', type: 'rsvp' }); setRunning(true); }} disabled={running || done} type="button">Iniciar</button>
          <button className="secondary" onClick={() => setRunning(false)} disabled={!running} type="button">Pausar</button>
          <button className="secondary" onClick={reset} type="button">Reiniciar</button>
        </div>
      </section>
      {done && !session && (
        <>
          <Quiz title="Preguntas al finalizar" questions={text.comprehension} answers={answers} onAnswer={(i, v) => setAnswers({ ...answers, [i]: v })} />
          <Quiz title="Retención lectora" questions={text.retention} answers={retAnswers} onAnswer={(i, v) => setRetAnswers({ ...retAnswers, [i]: v })} />
          <button className="primary wide" onClick={finish} disabled={text.comprehension.some((_, i) => answers[i] === undefined) || text.retention.some((_, i) => retAnswers[i] === undefined)} type="button">Ver resultados</button>
        </>
      )}
      <SessionResults session={session} previous={state.history.at(-1)} saved={saved} onRepeat={() => { onClearInProgress?.(); reset(); }} onGoHome={onGoHome} onContinuePlan={onContinuePlan} onSave={() => { onSaveSession(session); onClearInProgress?.(); setSaved(true); }} />
    </main>
  );
}
