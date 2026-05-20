export function countWords(text = '') {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function secondsBetween(start, end) {
  return Math.max(1, Math.round((end - start) / 1000));
}

export function calculateWpm(wordCount, seconds) {
  return Math.round((wordCount / Math.max(seconds, 1)) * 60);
}

export function calculateScore(answers = {}, questions = []) {
  if (!questions.length) return 0;
  const correct = questions.reduce((sum, q, index) => {
    return sum + (Number(answers[index]) === q.correctIndex ? 1 : 0);
  }, 0);
  return Math.round((correct / questions.length) * 100);
}

export function levelFromPerformance(wpm, comprehension) {
  let level = wpm < 150 ? 'Básico' : wpm <= 250 ? 'Intermedio' : 'Avanzado';
  if (comprehension < 70) {
    level = level === 'Avanzado' ? 'Intermedio' : 'Básico';
  }
  if (comprehension > 85 && wpm > 220) {
    level = level === 'Básico' ? 'Intermedio' : 'Avanzado';
  }
  return level;
}

export function nextLevel(level) {
  return level === 'Básico' ? 'Intermedio' : level === 'Intermedio' ? 'Avanzado' : 'Avanzado';
}

export function previousLevel(level) {
  return level === 'Avanzado' ? 'Intermedio' : level === 'Intermedio' ? 'Básico' : 'Básico';
}

export function stableSpeed(history = []) {
  const stable = history.filter((item) => item.comprehension >= 75 && item.retention >= 70);
  return stable.length ? Math.max(...stable.map((item) => item.wpm)) : 0;
}

export function average(items = [], key) {
  if (!items.length) return 0;
  return Math.round(items.reduce((sum, item) => sum + Number(item[key] || 0), 0) / items.length);
}

export function resultLabel(session) {
  const score = Math.round(
    session.comprehension * 0.38 +
      session.retention * 0.32 +
      Math.min(session.wpm / 4, 100) * 0.2 +
      (session.streakBonus || 0) * 0.1
  );
  if (score >= 85) return 'Excelente';
  if (score >= 70) return 'Sólido';
  if (score >= 55) return 'En desarrollo';
  return 'Necesita refuerzo';
}

export function recommendationFor(session, history = []) {
  const recent = history.slice(-3);
  const last = history.at(-1);
  const comp = session.comprehension;
  const ret = session.retention;
  const risingSpeedFallingComp = last && session.wpm > last.wpm && comp < last.comprehension;
  const threeImprovements =
    recent.length === 3 &&
    recent.every((item, index) => index === 0 || item.comprehension >= recent[index - 1].comprehension);
  const twoDrops =
    recent.length >= 2 &&
    recent.slice(-2).every((item, index, arr) => index === 0 || item.comprehension < arr[index - 1].comprehension);

  if (comp < 60) return 'Reduce velocidad, repite el nivel y prioriza comprensión antes de acelerar.';
  if (risingSpeedFallingComp) return 'Tu velocidad subió, pero la comprensión bajó. Mantén el ritmo y estabiliza precisión.';
  if (ret < 65) return 'Retención baja: haz un repaso breve y responde sin mirar el texto.';
  if (twoDrops) return 'Dos caídas seguidas: toma un descanso corto o baja dificultad temporalmente.';
  if (threeImprovements) return 'Tres mejoras seguidas: puedes probar un nivel superior con control.';
  if (comp <= 75) return 'Mantén el ritmo actual y trabaja idea principal y palabras clave.';
  if (comp <= 90) return 'Aumenta dificultad ligeramente sin subir demasiado la velocidad.';
  return 'Comprensión excelente: sube nivel o velocidad de forma gradual.';
}

export function updateStreak(lastPracticeDate) {
  const today = new Date().toISOString().slice(0, 10);
  if (!lastPracticeDate) return { streak: 1, date: today };
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (lastPracticeDate === today) return null;
  return { streak: lastPracticeDate === yesterday ? 'increment' : 1, date: today };
}

export function buildBadges(state, nextHistory) {
  const badges = new Set(state.badges || []);
  if (nextHistory.length >= 1) badges.add('Primera práctica completada');
  if (nextHistory.length >= 5) badges.add('5 sesiones realizadas');
  if (nextHistory.some((item) => item.comprehension > 90)) badges.add('Comprensión mayor a 90%');
  if ((state.streak || 0) >= 7) badges.add('7 días de racha');
  if (stableSpeed(nextHistory) > stableSpeed(state.history || [])) badges.add('Nueva velocidad estable');
  return [...badges];
}

export function readerProfile(history = []) {
  if (!history.length) {
    return {
      name: 'Perfil en calibración',
      strengths: ['Disposición para iniciar entrenamiento'],
      improvements: ['Completar evaluación inicial'],
      weekly: 'Realiza una evaluación y dos prácticas cortas para detectar tu patrón.'
    };
  }
  const wpm = average(history, 'wpm');
  const comp = average(history, 'comprehension');
  const ret = average(history, 'retention');
  const variance = Math.max(...history.map((h) => h.comprehension)) - Math.min(...history.map((h) => h.comprehension));
  let name = 'Lector equilibrado';
  if (wpm < 170 && comp >= 80) name = 'Lector lento pero preciso';
  if (wpm > 260 && comp < 75) name = 'Lector rápido con baja comprensión';
  if (wpm > 280 && comp >= 85 && ret >= 80) name = 'Lector avanzado';
  if (variance > 35) name = 'Lector inestable';
  return {
    name,
    strengths: [comp >= 80 ? 'Buena comprensión' : 'Constancia medible', ret >= 75 ? 'Retención funcional' : 'Velocidad en progreso'],
    improvements: [comp < 75 ? 'Comprensión antes que velocidad' : 'Subir dificultad gradualmente', ret < 70 ? 'Repaso activo' : 'Mayor velocidad estable'],
    weekly: comp < 75 ? 'Haz 3 sesiones básicas con preguntas inmediatas.' : 'Alterna RSVP, enfoque y lectura profunda esta semana.'
  };
}
