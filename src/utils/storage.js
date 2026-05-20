const KEY = 'lectura-pro-ia-state-v1';

export const defaultState = {
  initialEvaluation: null,
  history: [],
  goals: {
    targetWpm: 240,
    minComprehension: 80,
    minRetention: 75,
    weeklyPractices: 4
  },
  currentLevel: 'Básico',
  streak: 0,
  xp: 0,
  badges: [],
  settings: {
    preferredSpeed: 200
  },
  activeProgram: null,
  programStartedAt: null,
  currentPlanDay: 1,
  routeProgress: {
    evaluation: 'available',
    plan: 'locked',
    today: 'locked',
    progress: 'locked',
    level: 'locked'
  },
  dailySession: null,
  inProgressSession: null,
  userName: '',
  lastCoachMessage: '',
  lastPracticeDate: null
};

export function loadState() {
  try {
    const saved = localStorage.getItem(KEY);
    if (!saved) return defaultState;
    const parsed = JSON.parse(saved);
    return {
      ...defaultState,
      ...parsed,
      goals: { ...defaultState.goals, ...(parsed.goals || {}) },
      settings: { ...defaultState.settings, ...(parsed.settings || {}) },
      routeProgress: { ...defaultState.routeProgress, ...(parsed.routeProgress || {}) },
      badges: parsed.badges || [],
      history: parsed.history || []
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearState() {
  localStorage.removeItem(KEY);
}
