import { Award, BadgeCheck, Brain, Sparkles } from 'lucide-react';
import { average, readerProfile } from '../utils/calculations';

export default function UserProfile({ state }) {
  const profile = readerProfile(state.history);
  const xpLevel = Math.max(1, Math.floor((state.xp || 0) / 300) + 1);

  return (
    <main className="view">
      <section className="profile-hero">
        <div>
          <p className="eyebrow">Perfil del usuario</p>
          <h1>{profile.name}</h1>
          <p>Nivel actual: <strong>{state.currentLevel}</strong> · Usuario nivel {xpLevel} · {state.xp || 0} XP</p>
        </div>
        <Sparkles size={36} />
      </section>
      <section className="stats-grid">
        <article className="stat-card"><Brain /><span>Comprensión media</span><strong>{average(state.history, 'comprehension')}%</strong></article>
        <article className="stat-card"><BadgeCheck /><span>Retención media</span><strong>{average(state.history, 'retention')}%</strong></article>
        <article className="stat-card"><Award /><span>Insignias</span><strong>{state.badges.length}</strong></article>
      </section>
      <section className="two-col">
        <article className="panel">
          <h2>Fortalezas</h2>
          {profile.strengths.map((item) => <p className="check" key={item}>{item}</p>)}
        </article>
        <article className="panel">
          <h2>Áreas a mejorar</h2>
          {profile.improvements.map((item) => <p className="warn" key={item}>{item}</p>)}
        </article>
      </section>
      <section className="panel">
        <h2>Recomendación semanal</h2>
        <p>{profile.weekly}</p>
        <div className="badges">{state.badges.length ? state.badges.map((badge) => <span className="badge" key={badge}>{badge}</span>) : <span className="badge">Sin logros aún</span>}</div>
      </section>
    </main>
  );
}
