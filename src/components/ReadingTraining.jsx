import { useMemo, useState } from 'react';
import { texts } from '../data/texts';
import { calculateScore, calculateWpm, recommendationFor, resultLabel, secondsBetween } from '../utils/calculations';
import Quiz from './Quiz';
import SessionResults from './SessionResults';

const levels = ['Básico', 'Intermedio', 'Avanzado'];

export default function ReadingTraining({ state, onSaveSession, onSetLevel }) {
  const [level, setLevel] = useState(state.currentLevel || 'Básico');
  const levelTexts = texts.filter((text) => text.level === level);
  const [textId, setTextId] = useState(levelTexts[0]?.id);
  const text = texts.find((item) => item.id === textId) || levelTexts[0] || texts[0];
  const [startedAt, setStartedAt] = useState(null);
  const [finishedAt, setFinishedAt] = useState(null);
  const [phase, setPhase] = useState('read');
  const [compAnswers, setCompAnswers] = useState({});
  const [retAnswers, setRetAnswers] = useState({});
  const [session, setSession] = useState(null);
  const [saved, setSaved] = useState(false);

  const allComp = useMemo(() => text.comprehension.every((_, i) => compAnswers[i] !== undefined), [compAnswers, text]);
  const allRet = useMemo(() => text.retention.every((_, i) => retAnswers[i] !== undefined), [retAnswers, text]);

  function reset(nextLevel = level) {
    const nextText = texts.find((t) => t.level === nextLevel) || texts[0];
    setLevel(nextLevel);
    setTextId(nextText.id);
    setStartedAt(null);
    setFinishedAt(null);
    setPhase('read');
    setCompAnswers({});
    setRetAnswers({});
    setSession(null);
    setSaved(false);
  }

  function buildSession() {
    const time = secondsBetween(startedAt, finishedAt);
    const comprehension = calculateScore(compAnswers, text.comprehension);
    const retention = calculateScore(retAnswers, text.retention);
    const base = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: 'Entrenamiento de lectura',
      level,
      textTitle: text.title,
      wpm: calculateWpm(text.words, time),
      comprehension,
      retention,
      time,
      exercise: 'Lectura cronometrada'
    };
    const full = {
      ...base,
      recommendation: recommendationFor(base, state.history),
      result: resultLabel({ ...base, streakBonus: state.streak || 0 })
    };
    setSession(full);
  }

  return (
    <main className="view">
      <section className="panel">
        <div className="section-head">
          <div>
            <p className="eyebrow">Entrenamiento de lectura</p>
            <h1>{text.title}</h1>
          </div>
          <span>{text.words} palabras · {text.topic}</span>
        </div>
        <div className="control-row">
          <select value={level} onChange={(e) => reset(e.target.value)}>
            {levels.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={text.id} onChange={(e) => setTextId(e.target.value)}>
            {levelTexts.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}
          </select>
        </div>
        <article className="reading-text">{text.content}</article>
        <div className="actions">
          <button className="primary" onClick={() => setStartedAt(Date.now())} disabled={startedAt && !finishedAt} type="button">Iniciar</button>
          <button className="secondary" onClick={() => { setFinishedAt(Date.now()); setPhase('comp'); }} disabled={!startedAt || finishedAt} type="button">Terminé</button>
        </div>
      </section>
      {phase === 'comp' && <><Quiz title="Preguntas de comprensión" questions={text.comprehension} answers={compAnswers} onAnswer={(i, v) => setCompAnswers({ ...compAnswers, [i]: v })} /><button className="primary wide" onClick={() => setPhase('ret')} disabled={!allComp} type="button">Continuar a retención</button></>}
      {phase === 'ret' && <><Quiz title="Preguntas de retención" questions={text.retention} answers={retAnswers} onAnswer={(i, v) => setRetAnswers({ ...retAnswers, [i]: v })} /><button className="primary wide" onClick={buildSession} disabled={!allRet} type="button">Calcular resultado</button></>}
      <SessionResults session={session} previous={state.history.at(-1)} saved={saved} onRepeat={() => reset(level)} onLevelUp={reset} onSave={() => { onSaveSession(session); setSaved(true); onSetLevel(session.level); }} />
    </main>
  );
}
