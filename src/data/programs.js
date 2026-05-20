export const programs = [
  {
    id: 'balanced',
    name: 'Ruta Equilibrada',
    tag: 'Comprension + Velocidad',
    objective: 'Mejorar velocidad y comprension al mismo tiempo.',
    durationWeeks: 8,
    frequency: '15 min diarios, 5 dias por semana',
    targetWpm: 280,
    targetComprehension: 82,
    targetRetention: 75,
    modules: ['Lectura guiada', 'RSVP', 'Anti-regresion', 'Retencion'],
    schedule: ['reading', 'rsvp', 'anti', 'reading', 'review']
  },
  {
    id: 'deep-comprehension',
    name: 'Ruta Comprension Profunda',
    tag: 'Analisis + Memoria',
    objective: 'Mejorar analisis, memoria y retencion.',
    durationWeeks: 6,
    frequency: '20 min diarios, 4 dias por semana',
    targetWpm: 220,
    targetComprehension: 88,
    targetRetention: 82,
    modules: ['Lectura profunda', 'Enfoque', 'Retencion', 'Revision'],
    schedule: ['reading', 'focus', 'reading', 'review']
  },
  {
    id: 'controlled-speed',
    name: 'Ruta Velocidad Controlada',
    tag: 'PPM sin perder precision',
    objective: 'Aumentar ppm sin perder comprension.',
    durationWeeks: 6,
    frequency: '15 min diarios, 5 dias por semana',
    targetWpm: 320,
    targetComprehension: 78,
    targetRetention: 72,
    modules: ['RSVP', 'Anti-regresion', 'Lectura cronometrada'],
    schedule: ['reading', 'rsvp', 'anti', 'rsvp', 'review']
  },
  {
    id: 'focus-discipline',
    name: 'Ruta Enfoque y Disciplina',
    tag: 'Concentracion + Constancia',
    objective: 'Mejorar concentracion y constancia.',
    durationWeeks: 4,
    frequency: '10 min diarios, 6 dias por semana',
    targetWpm: 240,
    targetComprehension: 80,
    targetRetention: 75,
    modules: ['Enfoque', 'Lectura breve', 'Anti-regresion', 'Revision'],
    schedule: ['focus', 'reading', 'anti', 'focus', 'reading', 'review']
  }
];

export function getProgram(id) {
  return programs.find((program) => program.id === id) || programs[0];
}
