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
  lastPracticeDate: null
};

export function loadState() {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
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
