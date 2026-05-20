import { BrainCircuit } from 'lucide-react';
import CoachCard from './CoachCard';

export default function EvaluationGate({ state, onStart }) {
  return (
    <main className="view mobile-view gate-view">
      <section className="gate-hero">
        <div className="app-icon-preview"><BrainCircuit size={56} /></div>
        <p className="eyebrow">Lectura Pro IA</p>
        <h1>Primero realiza tu evaluacion inicial</h1>
        <p>La evaluacion crea tu ruta personalizada, define tu nivel lector y desbloquea el plan diario.</p>
        <button className="primary wide" type="button" onClick={onStart}>Comenzar evaluacion inicial</button>
      </section>
      <CoachCard state={state} />
    </main>
  );
}
