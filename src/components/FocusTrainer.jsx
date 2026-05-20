import { useState } from 'react';
import { texts } from '../data/texts';
import { recommendationFor, resultLabel, secondsBetween } from '../utils/calculations';
import SessionResults from './SessionResults';

const exercises = [
  {
    type: 'Idea principal',
    prompt: '¿Cuál es la idea principal del texto seleccionado?',
    options: ['El texto explica un concepto central y sus implicaciones', 'El texto enumera palabras sin relación', 'El texto evita desarrollar un tema', 'El texto solo describe una anécdota personal'],
    correctIndex: 0
  },
  {
    type: 'Palabras clave',
    prompt: 'Selecciona la opción con mejores palabras clave.',
    options: ['Proceso, contexto, relación, resultado', 'Azul, mesa, ruido, casualidad', 'Solo, nunca, tal vez, cosa', 'Grande, pequeño, bonito, rápido'],
    correctIndex: 0
  },
  {
    type: 'Mejor resumen',
    prompt: 'Elige el resumen más útil.',
    options: ['Presenta el tema, explica su importancia y concluye con una consecuencia práctica.', 'Repite una frase sin explicar nada.', 'Cambia el tema por completo.', 'Se enfoca en detalles irrelevantes.'],
    correctIndex: 0
  },
  {
    type: 'Pregunta rápida',
    prompt: '¿Qué conviene hacer para comprender mejor?',
    options: ['Identificar intención, idea principal y evidencia', 'Leer más rápido sin evaluar', 'Ignorar palabras clave', 'Evitar preguntas'],
    correctIndex: 0
  }
];

export default function FocusTrainer({ state, onSaveSession, onGoHome, onContinuePlan, onStartSession, onClearInProgress }) {
  const [textId, setTextId] = useState(texts[2].id);
  const text = texts.find((item) => item.id === textId) || texts[2];
  const [startedAt, setStartedAt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [session, setSession] = useState(null);
  const [saved, setSaved] = useState(false);

  function finish() {
    const correct = exercises.reduce((sum, item, index) => sum + (answers[index] === item.correctIndex ? 1 : 0), 0);
    const precision = Math.round((correct / exercises.length) * 100);
    const time = secondsBetween(startedAt, Date.now());
    const base = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      type: 'Enfoque',
      level: text.level,
      textTitle: text.title,
      wpm: Math.round((text.words / time) * 60),
      comprehension: precision,
      retention: Math.max(50, precision - 5),
      time,
      exercise: 'Idea principal, palabras clave y resumen'
    };
    setSession({ ...base, recommendation: recommendationFor(base, state.history), result: resultLabel(base) });
  }

  return (
    <main className="view">
      <section className="panel">
        <div className="section-head"><div><p className="eyebrow">Entrenamiento de enfoque</p><h1>Precisión y tiempo</h1></div><span>{text.topic}</span></div>
        <select value={text.id} onChange={(e) => setTextId(e.target.value)}>{texts.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select>
        <div className="instruction-box">
          <strong>Instrucciones</strong>
          <p>Lee rapido, identifica la idea principal y responde con precision. El objetivo es enfoque, no velocidad vacia.</p>
        </div>
        <article className="reading-text compact">{text.content}</article>
        {!startedAt && <button className="primary" onClick={() => { onStartSession?.({ title: text.title, view: 'focus', type: 'focus' }); setStartedAt(Date.now()); }} type="button">Iniciar ejercicios</button>}
      </section>
      {startedAt && !session && (
        <section className="quiz">
          {exercises.map((exercise, index) => (
            <article className="question" key={exercise.type}>
              <p className="eyebrow">{exercise.type}</p>
              <h3>{exercise.prompt}</h3>
              <div className="options">
                {exercise.options.map((option, optionIndex) => <button className={answers[index] === optionIndex ? 'option selected' : 'option'} key={option} onClick={() => setAnswers({ ...answers, [index]: optionIndex })} type="button">{option}</button>)}
              </div>
            </article>
          ))}
          <button className="primary wide" onClick={finish} disabled={exercises.some((_, i) => answers[i] === undefined)} type="button">Medir precisión</button>
        </section>
      )}
      <SessionResults session={session} previous={state.history.at(-1)} saved={saved} onRepeat={() => { onClearInProgress?.(); setStartedAt(null); setAnswers({}); setSession(null); setSaved(false); }} onGoHome={onGoHome} onContinuePlan={onContinuePlan} onSave={() => { onSaveSession(session); onClearInProgress?.(); setSaved(true); }} />
    </main>
  );
}
