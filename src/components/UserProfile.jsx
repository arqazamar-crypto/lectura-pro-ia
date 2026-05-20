import { Award, BadgeCheck, Brain, Edit3, RefreshCw, Route, Sparkles } from 'lucide-react';
import { getProgram } from '../data/programs';
import { average, readerProfile } from '../utils/calculations';
import { APP_VERSION } from '../version';

export default function UserProfile({ state, onResetEvaluation, onResetApp, onChangeProgram, onSaveName }) {
  const profile = readerProfile(state.history);
  const xpLevel = Math.max(1, Math.floor((state.xp || 0) / 300) + 1);
  const program = state.activeProgram ? getProgram(state.activeProgram) : null;

  function submitName(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSaveName(form.get('userName') || '');
  }

  function confirmResetApp() {
    const confirmed = window.confirm('Esto borrara historial, metas, progreso, evaluacion y programa activo. ¿Quieres empezar de 0?');
    if (confirmed) onResetApp();
  }

  return (
    <main className="view mobile-view">
      <section className="profile-hero">
        <div>
          <p className="eyebrow">Perfil lector</p>
          <h1>{profile.name}</h1>
          <p>{state.userName || 'Usuario'} · Nivel {state.currentLevel} · Usuario nivel {xpLevel}</p>
        </div>
        <Sparkles size={36} />
      </section>
      <form className="name-form" onSubmit={submitName}>
        <input name="userName" placeholder="Nombre opcional" defaultValue={state.userName || ''} />
        <button className="secondary" type="submit"><Edit3 size={16} /> Guardar</button>
      </form>
      <section className="metric-row three">
        <article className="glass-stat"><Brain /><strong>{average(state.history, 'comprehension')}%</strong><span>Comprension</span></article>
        <article className="glass-stat"><BadgeCheck /><strong>{average(state.history, 'retention')}%</strong><span>Retencion</span></article>
        <article className="glass-stat"><Award /><strong>{state.xp || 0}</strong><span>XP</span></article>
      </section>
      <section className="panel elevated">
        <div className="section-head">
          <div>
            <p className="eyebrow">Programa activo</p>
            <h2>{program?.name || 'Sin programa'}</h2>
          </div>
          <Route size={22} />
        </div>
        <p>{program ? `${program.frequency} · Semana ${Math.max(1, Math.ceil((state.currentPlanDay || 1) / program.schedule.length))}` : 'Elige una ruta despues de tu diagnostico.'}</p>
        <button className="secondary wide" type="button" onClick={onChangeProgram}>Cambiar programa</button>
      </section>
      <section className="two-col">
        <article className="panel elevated">
          <h2>Fortalezas</h2>
          {profile.strengths.map((item) => <p className="check" key={item}>{item}</p>)}
        </article>
        <article className="panel elevated">
          <h2>Areas a mejorar</h2>
          {profile.improvements.map((item) => <p className="warn" key={item}>{item}</p>)}
        </article>
      </section>
      <section className="panel elevated">
        <h2>Logros</h2>
        <div className="badges">{state.badges.length ? state.badges.map((badge) => <span className="badge" key={badge}>{badge}</span>) : <span className="badge">Sin logros aun</span>}</div>
      </section>
      <section className="panel elevated">
        <h2>Versión actual: {APP_VERSION}</h2>
        <p>Lectura Pro IA conserva historial, metas y progreso al actualizar.</p>
        <button className="danger-button" type="button" onClick={onResetEvaluation}><RefreshCw size={17} /> Reiniciar evaluacion</button>
        <button className="danger-button reset-app-button" type="button" onClick={confirmResetApp}><RefreshCw size={17} /> Reiniciar app desde 0</button>
      </section>
    </main>
  );
}
