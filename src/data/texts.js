import { countWords } from '../utils/calculations';

const rawTexts = [
  {
    id: 'basico-ciencia-agua',
    title: 'El viaje del agua',
    level: 'Básico',
    topic: 'Ciencia',
    minutes: 2,
    content:
      'El agua cambia de lugar y de forma todo el tiempo. Cuando el sol calienta ríos, lagos y mares, una parte del agua se convierte en vapor y sube al aire. Ese vapor se enfría, forma nubes y después vuelve a la tierra como lluvia. Este proceso se llama ciclo del agua. Gracias a él, las plantas crecen, los animales beben y las personas pueden cultivar alimentos. Aunque parece abundante, el agua dulce disponible es limitada. Por eso es importante cuidarla, cerrar la llave cuando no se usa y evitar contaminar ríos o lagos.',
    comprehension: [
      { question: '¿Qué ocurre cuando el sol calienta el agua?', options: ['Se congela', 'Se convierte en vapor', 'Desaparece para siempre', 'Se vuelve sal'], correctIndex: 1 },
      { question: '¿Cómo vuelve el agua a la tierra?', options: ['Como lluvia', 'Como humo', 'Como arena', 'Como luz'], correctIndex: 0 },
      { question: '¿Por qué es importante el ciclo del agua?', options: ['Porque cambia el color del cielo', 'Porque permite vida y cultivos', 'Porque elimina las nubes', 'Porque seca los ríos'], correctIndex: 1 },
      { question: '¿Qué recurso es limitado?', options: ['El agua dulce disponible', 'La luz del sol', 'El aire', 'Las nubes'], correctIndex: 0 },
      { question: '¿Qué acción ayuda a cuidar el agua?', options: ['Contaminar ríos', 'Cerrar la llave', 'Regar al mediodía', 'Tirar basura'], correctIndex: 1 }
    ],
    retention: [
      { question: '¿Cómo se llama el proceso descrito?', options: ['Fotosíntesis', 'Ciclo del agua', 'Evaporación única', 'Marea'], correctIndex: 1 },
      { question: 'Menciona una razón para cuidar el agua.', options: ['Es dulce e ilimitada', 'La disponible es limitada', 'No se usa en cultivos', 'Solo sirve para lluvia'], correctIndex: 1 },
      { question: '¿Qué se forma cuando el vapor se enfría?', options: ['Nubes', 'Piedras', 'Raíces', 'Sal'], correctIndex: 0 }
    ]
  },
  {
    id: 'basico-historia-imprenta',
    title: 'La imprenta y los libros',
    level: 'Básico',
    topic: 'Historia',
    minutes: 2,
    content:
      'Antes de la imprenta, los libros se copiaban a mano y eran muy costosos. Pocas personas podían tenerlos. Con la imprenta de tipos móviles, fue posible producir muchas copias en menos tiempo. Los libros bajaron de precio y las ideas viajaron más rápido entre ciudades y países. La educación cambió porque más personas pudieron aprender a leer, comparar opiniones y conservar información. La imprenta no solo multiplicó libros: también aceleró la ciencia, la cultura y el intercambio de conocimientos.',
    comprehension: [
      { question: '¿Cómo se copiaban los libros antes?', options: ['A mano', 'Con radio', 'Con fotografía', 'Con computadoras'], correctIndex: 0 },
      { question: '¿Qué permitió la imprenta?', options: ['Menos copias', 'Más copias en menos tiempo', 'Libros invisibles', 'Eliminar escuelas'], correctIndex: 1 },
      { question: '¿Qué pasó con las ideas?', options: ['Viajaron más rápido', 'Se ocultaron', 'Se perdieron', 'Se volvieron iguales'], correctIndex: 0 },
      { question: '¿Qué área cambió por más acceso a libros?', options: ['Educación', 'Clima', 'Minería', 'Pesca'], correctIndex: 0 },
      { question: 'La imprenta aceleró principalmente...', options: ['El sueño', 'La ciencia y cultura', 'La lluvia', 'El silencio'], correctIndex: 1 }
    ],
    retention: [
      { question: '¿Qué eran los tipos móviles?', options: ['Una forma de imprimir muchas copias', 'Un tipo de tinta moderna', 'Una escuela antigua', 'Un transporte'], correctIndex: 0 },
      { question: '¿Por qué bajaron los precios?', options: ['Por producir más copias', 'Porque nadie leía', 'Por usar oro', 'Por copiar más lento'], correctIndex: 0 },
      { question: '¿Qué habilidad se expandió?', options: ['Lectura', 'Navegación aérea', 'Carpintería', 'Canto'], correctIndex: 0 }
    ]
  },
  {
    id: 'basico-productividad-habitos',
    title: 'Hábitos pequeños',
    level: 'Básico',
    topic: 'Productividad',
    minutes: 2,
    content:
      'Un hábito pequeño puede cambiar una rutina completa. Leer diez minutos al día, ordenar el escritorio antes de trabajar o escribir una lista breve de tareas ayuda a reducir la fricción. La clave es repetir la acción hasta que se vuelva automática. Cuando una meta parece grande, conviene dividirla en pasos simples. Así el progreso se vuelve visible y la motivación aumenta. Los hábitos no dependen solo de fuerza de voluntad; también dependen de diseñar un ambiente que facilite la acción correcta.',
    comprehension: [
      { question: '¿Qué puede cambiar una rutina?', options: ['Un hábito pequeño', 'Una excusa', 'Un ruido', 'Una pausa eterna'], correctIndex: 0 },
      { question: '¿Qué ayuda a reducir la fricción?', options: ['Lista breve de tareas', 'Más distracciones', 'Desorden', 'Dormir menos'], correctIndex: 0 },
      { question: '¿Qué conviene hacer con una meta grande?', options: ['Dividirla en pasos simples', 'Ignorarla', 'Complicarla', 'Esperar suerte'], correctIndex: 0 },
      { question: '¿Qué aumenta cuando el progreso es visible?', options: ['Motivación', 'Confusión', 'Cansancio', 'Ruido'], correctIndex: 0 },
      { question: 'Los hábitos también dependen de...', options: ['Ambiente diseñado', 'Azar total', 'Memoria perfecta', 'Tareas imposibles'], correctIndex: 0 }
    ],
    retention: [
      { question: '¿Cuánto tiempo de lectura diaria se menciona?', options: ['Diez minutos', 'Una hora', 'Cinco horas', 'Un segundo'], correctIndex: 0 },
      { question: '¿Qué debe volverse automática?', options: ['La acción repetida', 'La distracción', 'La excusa', 'La interrupción'], correctIndex: 0 },
      { question: '¿Qué facilita la acción correcta?', options: ['Diseñar el ambiente', 'Ocultar objetivos', 'Agregar ruido', 'Evitar listas'], correctIndex: 0 }
    ]
  },
  {
    id: 'intermedio-tecnologia-ia',
    title: 'Inteligencia artificial cotidiana',
    level: 'Intermedio',
    topic: 'Tecnología',
    minutes: 3,
    content:
      'La inteligencia artificial ya participa en actividades diarias: recomienda rutas, organiza correos, traduce textos y detecta patrones en grandes cantidades de datos. Su valor no está en reemplazar toda decisión humana, sino en ampliar la capacidad de analizar información. Para usarla bien, se requiere criterio: verificar resultados, reconocer sesgos y formular preguntas claras. En educación puede personalizar ejercicios y detectar dificultades, pero necesita supervisión docente. La mejor relación con la inteligencia artificial combina automatización, pensamiento crítico y responsabilidad.',
    comprehension: [
      { question: '¿Cuál es un uso cotidiano de la IA?', options: ['Recomendar rutas', 'Crear océanos', 'Detener el tiempo', 'Eliminar libros'], correctIndex: 0 },
      { question: 'Su valor principal es...', options: ['Ampliar análisis de información', 'Evitar pensar siempre', 'Reemplazar toda decisión', 'Prohibir preguntas'], correctIndex: 0 },
      { question: '¿Qué se requiere para usarla bien?', options: ['Criterio y verificación', 'Fe ciega', 'Más ruido', 'Menos datos'], correctIndex: 0 },
      { question: 'En educación puede...', options: ['Personalizar ejercicios', 'Sustituir todo aprendizaje', 'Eliminar maestros', 'Borrar dificultades'], correctIndex: 0 },
      { question: 'La mejor relación combina...', options: ['Automatización, pensamiento crítico y responsabilidad', 'Velocidad y descuido', 'Memoria y azar', 'Silencio y copia'], correctIndex: 0 }
    ],
    retention: [
      { question: '¿Qué debe reconocerse en resultados de IA?', options: ['Sesgos', 'Mareas', 'Sabores', 'Sombras'], correctIndex: 0 },
      { question: '¿Qué tipo de preguntas conviene formular?', options: ['Claras', 'Confusas', 'Incompletas siempre', 'Secretas'], correctIndex: 0 },
      { question: '¿Qué necesita la IA en educación?', options: ['Supervisión docente', 'Aislamiento total', 'Menos práctica', 'Eliminar lectura'], correctIndex: 0 }
    ]
  },
  {
    id: 'intermedio-naturaleza-bosques',
    title: 'Bosques como redes vivas',
    level: 'Intermedio',
    topic: 'Naturaleza',
    minutes: 3,
    content:
      'Un bosque no es solo un conjunto de árboles. Bajo el suelo, hongos y raíces forman redes que permiten intercambiar nutrientes y señales químicas. Estas conexiones ayudan a que árboles jóvenes reciban apoyo y a que especies vecinas respondan ante sequías o plagas. La biodiversidad aumenta la resistencia del ecosistema porque cada organismo cumple una función. Cuando se elimina una especie, el equilibrio puede cambiar de manera inesperada. Proteger bosques implica conservar relaciones invisibles que sostienen vida, agua y clima.',
    comprehension: [
      { question: '¿Qué forman hongos y raíces?', options: ['Redes subterráneas', 'Rocas luminosas', 'Ríos artificiales', 'Nubes'], correctIndex: 0 },
      { question: '¿Qué intercambian esas redes?', options: ['Nutrientes y señales químicas', 'Monedas', 'Fuego', 'Arena'], correctIndex: 0 },
      { question: '¿Qué aumenta la resistencia del ecosistema?', options: ['Biodiversidad', 'Monocultivo', 'Ruido', 'Sequía'], correctIndex: 0 },
      { question: 'Eliminar una especie puede...', options: ['Cambiar el equilibrio', 'No afectar nada nunca', 'Crear más tiempo', 'Aumentar plástico'], correctIndex: 0 },
      { question: 'Proteger bosques implica conservar...', options: ['Relaciones invisibles', 'Solo troncos', 'Solo caminos', 'Solo flores'], correctIndex: 0 }
    ],
    retention: [
      { question: '¿Quiénes reciben apoyo en la red?', options: ['Árboles jóvenes', 'Autos', 'Rocas', 'Edificios'], correctIndex: 0 },
      { question: '¿Ante qué pueden responder especies vecinas?', options: ['Sequías o plagas', 'Música', 'Pantallas', 'Mapas'], correctIndex: 0 },
      { question: '¿Qué sostienen los bosques según el texto?', options: ['Vida, agua y clima', 'Tráfico', 'Publicidad', 'Metal'], correctIndex: 0 }
    ]
  },
  {
    id: 'intermedio-negocios-decision',
    title: 'Decisiones con datos',
    level: 'Intermedio',
    topic: 'Negocios',
    minutes: 3,
    content:
      'Las empresas usan datos para entender clientes, mejorar procesos y reducir riesgos. Sin embargo, los datos por sí solos no garantizan buenas decisiones. Es necesario definir una pregunta clara, seleccionar métricas relevantes y considerar el contexto. Una gráfica puede mostrar una tendencia, pero la causa puede estar fuera del registro disponible. Por eso, los equipos sólidos combinan análisis cuantitativo con experiencia operativa. Decidir con datos significa aprender más rápido, no obedecer números sin interpretación.',
    comprehension: [
      { question: '¿Para qué usan datos las empresas?', options: ['Entender clientes y reducir riesgos', 'Eliminar contexto', 'Evitar métricas', 'Ocultar procesos'], correctIndex: 0 },
      { question: 'Los datos solos...', options: ['No garantizan buenas decisiones', 'Siempre aciertan', 'Reemplazan todo criterio', 'No sirven nunca'], correctIndex: 0 },
      { question: 'Primero se debe definir...', options: ['Una pregunta clara', 'Un color', 'Un rumor', 'Una pausa'], correctIndex: 0 },
      { question: 'Una gráfica puede mostrar...', options: ['Una tendencia', 'Una causa definitiva siempre', 'Una ley universal', 'Nada'], correctIndex: 0 },
      { question: 'Decidir con datos significa...', options: ['Aprender más rápido', 'Obedecer números sin interpretar', 'Ignorar clientes', 'Evitar preguntas'], correctIndex: 0 }
    ],
    retention: [
      { question: '¿Qué debe acompañar al análisis cuantitativo?', options: ['Experiencia operativa', 'Azar', 'Silencio', 'Menos información'], correctIndex: 0 },
      { question: '¿Qué puede estar fuera del registro?', options: ['La causa', 'La gráfica', 'La métrica', 'La tabla'], correctIndex: 0 },
      { question: '¿Qué tipo de métricas conviene elegir?', options: ['Relevantes', 'Decorativas', 'Aleatorias', 'Contradictorias'], correctIndex: 0 }
    ]
  },
  {
    id: 'avanzado-cultura-memoria',
    title: 'Memoria cultural y cambio',
    level: 'Avanzado',
    topic: 'Cultura general',
    minutes: 4,
    content:
      'La memoria cultural no es un archivo inmóvil: es una negociación constante entre lo que una comunidad decide preservar, reinterpretar u olvidar. Monumentos, fiestas, relatos familiares y obras artísticas funcionan como tecnologías simbólicas que organizan pertenencia. Sin embargo, cada generación lee esos símbolos desde problemas nuevos. Por eso, conservar no significa congelar el pasado, sino mantener una conversación crítica con él. Cuando una sociedad revisa su memoria, no necesariamente destruye identidad; puede ampliar las voces que participan en su definición colectiva.',
    comprehension: [
      { question: 'La memoria cultural se describe como...', options: ['Negociación constante', 'Archivo inmóvil', 'Dato biológico', 'Regla matemática'], correctIndex: 0 },
      { question: '¿Qué organizan las tecnologías simbólicas?', options: ['Pertenencia', 'Velocidad física', 'Clima', 'Producción eléctrica'], correctIndex: 0 },
      { question: 'Cada generación lee símbolos desde...', options: ['Problemas nuevos', 'El mismo contexto exacto', 'Ningún interés', 'Solo datos técnicos'], correctIndex: 0 },
      { question: 'Conservar significa...', options: ['Mantener conversación crítica', 'Congelar el pasado', 'Eliminar preguntas', 'Repetir sin pensar'], correctIndex: 0 },
      { question: 'Revisar memoria puede...', options: ['Ampliar voces', 'Destruir siempre identidad', 'Borrar cultura automáticamente', 'Evitar diálogo'], correctIndex: 0 }
    ],
    retention: [
      { question: 'Menciona un ejemplo de tecnología simbólica.', options: ['Monumentos', 'Semáforos inteligentes', 'Motores', 'Cables'], correctIndex: 0 },
      { question: '¿Qué puede ampliar una sociedad al revisar memoria?', options: ['Voces participantes', 'Silencio', 'Olvido total', 'Velocidad'], correctIndex: 0 },
      { question: '¿Qué relación propone con el pasado?', options: ['Crítica y activa', 'Ciega e inmóvil', 'Inexistente', 'Puramente técnica'], correctIndex: 0 }
    ]
  },
  {
    id: 'avanzado-ciencia-complejidad',
    title: 'Sistemas complejos',
    level: 'Avanzado',
    topic: 'Ciencia',
    minutes: 4,
    content:
      'Un sistema complejo está formado por elementos que interactúan de tal manera que el comportamiento total no puede explicarse solo observando cada parte por separado. El tráfico urbano, el clima, un mercado financiero o una colonia de bacterias muestran propiedades emergentes: patrones globales que surgen de reglas locales. Esta perspectiva obliga a pensar en relaciones, retroalimentación y adaptación. Intervenir en un punto puede producir efectos no lineales en otro. Por ello, comprender sistemas complejos exige modelos flexibles, datos continuos y humildad ante la incertidumbre.',
    comprehension: [
      { question: 'Un sistema complejo no se explica solo por...', options: ['Partes aisladas', 'Relaciones', 'Interacciones', 'Retroalimentación'], correctIndex: 0 },
      { question: '¿Cuál es un ejemplo mencionado?', options: ['Tráfico urbano', 'Una palabra sola', 'Un lápiz quieto', 'Una nota musical aislada'], correctIndex: 0 },
      { question: 'Las propiedades emergentes son...', options: ['Patrones globales de reglas locales', 'Errores de medición', 'Partes sin relación', 'Datos eliminados'], correctIndex: 0 },
      { question: 'Intervenir en un punto puede producir...', options: ['Efectos no lineales', 'Cero cambios siempre', 'Solo un efecto pequeño', 'Una respuesta idéntica'], correctIndex: 0 },
      { question: 'Comprenderlos exige...', options: ['Modelos flexibles y humildad', 'Certeza total', 'Datos únicos', 'Ignorar adaptación'], correctIndex: 0 }
    ],
    retention: [
      { question: '¿Qué tipo de datos se requieren?', options: ['Continuos', 'Inexistentes', 'Decorativos', 'Secretos'], correctIndex: 0 },
      { question: '¿Qué conceptos obliga a pensar esta perspectiva?', options: ['Relaciones, retroalimentación y adaptación', 'Solo partes', 'Solo promedios', 'Solo velocidad'], correctIndex: 0 },
      { question: '¿Qué actitud se menciona ante la incertidumbre?', options: ['Humildad', 'Arrogancia', 'Indiferencia', 'Prisa'], correctIndex: 0 }
    ]
  },
  {
    id: 'avanzado-productividad-atencion',
    title: 'Atención profunda',
    level: 'Avanzado',
    topic: 'Productividad',
    minutes: 4,
    content:
      'La atención profunda es una capacidad estratégica en entornos saturados de estímulos. No consiste únicamente en apagar notificaciones, sino en proteger ciclos completos de pensamiento. Una tarea difícil requiere memoria de trabajo, contexto acumulado y resistencia a la interrupción. Cada cambio de foco impone un costo cognitivo que rara vez se percibe en el momento. Por eso, diseñar bloques de concentración, definir una intención antes de leer y cerrar bucles pendientes mejora la calidad del aprendizaje. La productividad intelectual depende tanto de elegir qué hacer como de preservar la energía mental para hacerlo bien.',
    comprehension: [
      { question: 'La atención profunda es...', options: ['Capacidad estratégica', 'Ruido constante', 'Memoria externa', 'Lectura superficial'], correctIndex: 0 },
      { question: 'No consiste solo en...', options: ['Apagar notificaciones', 'Leer más rápido siempre', 'Usar colores', 'Cambiar de tarea'], correctIndex: 0 },
      { question: 'Una tarea difícil requiere...', options: ['Memoria de trabajo y contexto', 'Interrupciones', 'Menos intención', 'Azar'], correctIndex: 0 },
      { question: 'Cada cambio de foco impone...', options: ['Costo cognitivo', 'Más descanso', 'Más comprensión automática', 'Cero efecto'], correctIndex: 0 },
      { question: 'La productividad intelectual depende de...', options: ['Elegir y preservar energía mental', 'Hacer todo a la vez', 'Abrir más tareas', 'Ignorar contexto'], correctIndex: 0 }
    ],
    retention: [
      { question: '¿Qué se debe definir antes de leer?', options: ['Una intención', 'Una distracción', 'Una excusa', 'Un atajo'], correctIndex: 0 },
      { question: '¿Qué ayuda a mejorar aprendizaje?', options: ['Bloques de concentración', 'Interrupciones', 'Lectura sin objetivo', 'Cambios constantes'], correctIndex: 0 },
      { question: '¿Qué debe preservarse?', options: ['Energía mental', 'Ruido', 'Desorden', 'Prisa'], correctIndex: 0 }
    ]
  }
];

export const texts = rawTexts.map((text) => ({ ...text, words: countWords(text.content) }));

export const diagnosticText = {
  ...texts[3],
  id: 'diagnostico-inicial',
  title: 'Diagnóstico de lectura'
};

export function getTextsByLevel(level) {
  return texts.filter((text) => text.level === level);
}

export function getTextById(id) {
  return texts.find((text) => text.id === id) || texts[0];
}
