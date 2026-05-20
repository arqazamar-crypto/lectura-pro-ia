import { average, nextLevel, previousLevel, readerProfile } from './calculations';
import { getProgram, programs } from '../data/programs';

const taskNames = {
  reading: 'Lectura guiada',
  rsvp: 'RSVP controlado',
  anti: 'Anti-regresion',
  focus: 'Enfoque y precision',
  review: 'Revision de progreso'
};

const taskViews = {
  reading: 'training',
  rsvp: 'rsvp',
  anti: 'anti',
  focus: 'focus',
  review: 'progress'
};

export function suggestProgram(evaluation, history = []) {
  const wpm = evaluation?.wpm || average(history, 'wpm');
  const comprehension = evaluation?.comprehension || average(history, 'comprehension');
  const recent = history.slice(-4);
  const variance = recent.length > 1 ? Math.max(...recent.map((h) => h.comprehension)) - Math.min(...recent.map((h) => h.comprehension)) : 0;

  if (variance > 30) return programs.find((program) => program.id === 'focus-discipline');
  if (wpm < 170 && comprehension >= 80) return programs.find((program) => program.id === 'controlled-speed');
  if (wpm > 250 && comprehension < 75) return programs.find((program) => program.id === 'deep-comprehension');
  return programs.find((program) => program.id === 'balanced');
}

export function buildRouteProgress(state) {
  const hasEvaluation = Boolean(state.initialEvaluation);
  const hasProgram = Boolean(state.activeProgram);
  const hasSession = (state.history || []).length > 0;
  const todayDone = isTodayDone(state);

  return [
    { id: 'evaluation', label: 'Evaluacion inicial', detail: 'Diagnostico IA', status: hasEvaluation ? 'completed' : 'available' },
    { id: 'plan', label: 'Plan personalizado', detail: 'Ruta creada por IA', status: !hasEvaluation ? 'locked' : hasProgram ? 'completed' : 'available' },
    { id: 'today', label: 'Entrenamiento diario', detail: '15 min minimo', status: !hasProgram ? 'locked' : todayDone ? 'completed' : hasSession ? 'in_progress' : 'available' },
    { id: 'progress', label: 'Revision de progreso', detail: 'La IA ajusta tu plan', status: !hasSession ? 'locked' : 'available' },
    { id: 'level', label: 'Avance de nivel', detail: 'Desbloquea nuevos retos', status: canLevelUp(state).allowed ? 'available' : 'locked' }
  ];
}

export function isTodayDone(state) {
  const today = new Date().toISOString().slice(0, 10);
  return (state.history || []).some((session) => session.planDay === state.currentPlanDay && session.completedDate === today);
}

export function getDailySession(state) {
  const program = getProgram(state.activeProgram);
  const day = Math.max(1, state.currentPlanDay || 1);
  const taskType = program.schedule[(day - 1) % program.schedule.length];
  const history = state.history || [];
  const last = history.at(-1);
  const speed = getRecommendedSpeed(state);

  return {
    day,
    programId: program.id,
    programName: program.name,
    type: taskType,
    view: taskViews[taskType],
    title: day === 1 ? 'Evaluacion base + lectura guiada' : taskNames[taskType],
    estimatedMinutes: taskType === 'review' ? 6 : taskType === 'focus' ? 10 : 15,
    technique: taskNames[taskType],
    targetWpm: speed,
    objective: objectiveFor(taskType, state),
    lockedReason: !state.initialEvaluation ? 'Primero completa tu evaluacion inicial.' : !state.activeProgram ? 'Elige una ruta para iniciar tu plan.' : '',
    coachMessage: coachMessage(state, last)
  };
}

export function getCoachSummary(state) {
  const evaluation = state.initialEvaluation;
  if (!evaluation) {
    return {
      diagnosis: 'Sin diagnostico inicial',
      todayTask: 'Comenzar evaluacion inicial',
      reason: 'Necesito medir tu velocidad, comprension y retencion para crear una ruta real.',
      requiredAction: 'Completa la evaluacion inicial.',
      progress: 'Ruta bloqueada'
    };
  }
  const profile = readerProfile(state.history || []);
  const session = getDailySession(state);
  const program = state.activeProgram ? getProgram(state.activeProgram) : suggestProgram(evaluation, state.history || []);
  return {
    diagnosis: `${profile.name} · ${evaluation.wpm} ppm base`,
    todayTask: state.activeProgram ? session.title : `Elegir ${program.name}`,
    reason: state.activeProgram ? session.objective : 'Esta ruta coincide mejor con tu diagnostico actual.',
    requiredAction: state.activeProgram ? 'Completa la sesion de hoy para desbloquear el siguiente paso.' : 'Confirma tu programa de trabajo.',
    progress: state.activeProgram ? `Dia ${state.currentPlanDay} de ${program.durationWeeks * program.schedule.length}` : 'Plan listo'
  };
}

export function getRecommendedSpeed(state) {
  const history = state.history || [];
  const last = history.at(-1);
  const base = last?.wpm || state.initialEvaluation?.wpm || 180;
  if (last?.comprehension < 75 || last?.retention < 70) return Math.max(150, base - 20);
  if (hasThreeImprovements(history)) return base + 20;
  return Math.max(150, Math.min(500, base));
}

export function canLevelUp(state) {
  const last = (state.history || []).at(-1);
  if (!last) return { allowed: false, reason: 'Completa una sesion antes de subir nivel.' };
  if (last.comprehension < 75) return { allowed: false, reason: 'No avances todavia: tu comprension debe llegar a 75%.' };
  if (last.retention < 70) return { allowed: false, reason: 'No subas velocidad: tu retencion debe llegar a 70%.' };
  return { allowed: true, reason: `Puedes probar ${nextLevel(last.level)} con control.` };
}

export function getAdjustment(state) {
  const history = state.history || [];
  if (hasTwoDrops(history)) return { level: previousLevel(state.currentLevel), message: 'Dos caidas seguidas: baja dificultad y recupera precision.' };
  if (hasThreeImprovements(history)) return { level: nextLevel(state.currentLevel), message: 'Tres mejoras seguidas: ya puedes subir nivel.' };
  return { level: state.currentLevel, message: 'Mantente en la ruta actual.' };
}

export function hasTwoDrops(history = []) {
  const recent = history.slice(-3);
  if (recent.length < 3) return false;
  return recent[2].comprehension < recent[1].comprehension && recent[1].comprehension < recent[0].comprehension;
}

export function hasThreeImprovements(history = []) {
  const recent = history.slice(-4);
  if (recent.length < 4) return false;
  return recent[1].comprehension >= recent[0].comprehension && recent[2].comprehension >= recent[1].comprehension && recent[3].comprehension >= recent[2].comprehension;
}

function objectiveFor(taskType, state) {
  const last = (state.history || []).at(-1);
  if (taskType === 'rsvp') return `Mantener la vista al centro a ${getRecommendedSpeed(state)} ppm sin perder comprension.`;
  if (taskType === 'anti') return 'Evitar releer y sostener avance lineal.';
  if (taskType === 'focus') return 'Detectar idea principal y responder con precision.';
  if (taskType === 'review') return 'Revisar tendencia y ajustar la siguiente semana.';
  if (last?.retention < 70) return 'Reforzar retencion antes de aumentar velocidad.';
  return 'Leer con ritmo natural y medir comprension real.';
}

function coachMessage(state, last) {
  if (!last) return 'Hoy construiremos tu primera base de entrenamiento.';
  if (last.comprehension < 75) return 'No avances todavia, tu comprension bajo. Repetiremos con menor carga.';
  if (last.retention < 70) return 'Tu memoria lectora necesita repaso antes de subir velocidad.';
  if (hasThreeImprovements(state.history || [])) return 'Ya puedes subir de nivel con una sesion controlada.';
  return 'Buen ritmo. Completa la tarea de hoy para mantener la racha.';
}
