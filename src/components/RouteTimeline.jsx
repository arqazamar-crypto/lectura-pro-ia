import { Check, Lock, Play } from 'lucide-react';
import { buildRouteProgress } from '../utils/coach';

const icons = {
  completed: Check,
  available: Play,
  in_progress: Play,
  locked: Lock
};

export default function RouteTimeline({ state }) {
  const steps = buildRouteProgress(state);
  return (
    <section className="route-card">
      <div className="section-head">
        <div>
          <p className="eyebrow">Ruta obligatoria</p>
          <h2>Tu camino de entrenamiento</h2>
        </div>
      </div>
      <div className="timeline">
        {steps.map((step, index) => {
          const Icon = icons[step.status];
          return (
            <article className={`timeline-step ${step.status}`} key={step.id}>
              <div className="timeline-dot"><Icon size={15} /></div>
              {index < steps.length - 1 && <span className="timeline-line" />}
              <div>
                <h3>{step.label}</h3>
                <p>{step.detail}</p>
                <small>{labelFor(step.status)}</small>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function labelFor(status) {
  if (status === 'completed') return 'Completada';
  if (status === 'available') return 'Disponible';
  if (status === 'in_progress') return 'En progreso';
  return 'Bloqueada';
}
