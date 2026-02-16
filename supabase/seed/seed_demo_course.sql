-- ============================================
-- Seed: Curso demo "Introduccion a la Inteligencia Artificial"
-- ============================================
-- Ejecutar con: copiar y pegar en Supabase SQL Editor
-- o usar: psql -f seed_demo_course.sql

DO $$
DECLARE
  v_admin_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
BEGIN
  -- Obtener el primer super_admin como creador
  SELECT id INTO v_admin_id FROM profiles WHERE role = 'super_admin' LIMIT 1;

  -- Si no hay super_admin, usar el primer usuario
  IF v_admin_id IS NULL THEN
    SELECT id INTO v_admin_id FROM profiles LIMIT 1;
  END IF;

  -- Si no hay usuarios, salir
  IF v_admin_id IS NULL THEN
    RAISE NOTICE 'No hay usuarios en la tabla profiles. Crea un usuario primero.';
    RETURN;
  END IF;

  -- ============================================
  -- Insertar Curso
  -- ============================================
  INSERT INTO courses (title, description, slug, category, level, price, is_published, created_by, thumbnail_url)
  VALUES (
    'Introduccion a la Inteligencia Artificial',
    'Aprende los fundamentos de la IA, desde machine learning hasta herramientas practicas como ChatGPT. Este curso te llevara desde los conceptos basicos hasta tecnicas avanzadas de prompt engineering, todo con ejemplos practicos y ejercicios interactivos.',
    'introduccion-a-la-inteligencia-artificial',
    'IA',
    'Principiante',
    0,
    true,
    v_admin_id,
    NULL
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO v_course_id;

  -- Si el curso ya existia, obtener su ID
  IF v_course_id IS NULL THEN
    SELECT id INTO v_course_id FROM courses WHERE slug = 'introduccion-a-la-inteligencia-artificial';
    RAISE NOTICE 'El curso ya existia, usando ID existente: %', v_course_id;
    RETURN;
  END IF;

  -- ============================================
  -- Modulo 1: Que es la IA?
  -- ============================================
  INSERT INTO modules (course_id, title, order_index)
  VALUES (v_course_id, '¿Que es la Inteligencia Artificial?', 0)
  RETURNING id INTO v_mod1_id;

  -- Leccion 1.1
  INSERT INTO lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (v_mod1_id, 'Historia de la IA',
    'La inteligencia artificial tiene una historia fascinante que se remonta a la decada de 1950. Alan Turing, considerado el padre de la computacion moderna, propuso en 1950 su famoso "Test de Turing" para determinar si una maquina podia exhibir comportamiento inteligente indistinguible del de un humano. Este momento marco el inicio formal de la investigacion en IA.

En 1956, durante la conferencia de Dartmouth, John McCarthy acuno oficialmente el termino "Inteligencia Artificial". Durante las siguientes decadas, la IA paso por ciclos de entusiasmo y desilucion conocidos como "inviernos de la IA". Sin embargo, avances en poder computacional, disponibilidad de datos y nuevos algoritmos revivieron el campo.

El verdadero punto de inflexion llego en 2012, cuando las redes neuronales profundas (deep learning) demostraron resultados revolucionarios en reconocimiento de imagenes. Desde entonces, la IA ha avanzado exponencialmente, culminando en modelos de lenguaje como GPT y asistentes como ChatGPT que han democratizado el acceso a la inteligencia artificial.',
    0, 8);

  -- Leccion 1.2
  INSERT INTO lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (v_mod1_id, 'Tipos de Inteligencia Artificial',
    'La inteligencia artificial se clasifica en tres grandes categorias segun su nivel de capacidad. La IA Estrecha (o debil) es la unica que existe actualmente y esta disenada para realizar tareas especificas. Ejemplos incluyen asistentes de voz como Siri, sistemas de recomendacion de Netflix, y herramientas como ChatGPT. Aunque son impresionantes, solo pueden operar dentro de su dominio especifico.

La IA General (AGI) es un concepto teorico que describe una maquina capaz de entender, aprender y aplicar conocimiento en cualquier tarea intelectual que un humano pueda realizar. Aun no existe, pero es el objetivo de muchas investigaciones actuales. Empresas como OpenAI y DeepMind trabajan activamente hacia este objetivo.

Finalmente, la Superinteligencia Artificial es una IA hipotetica que superaria la inteligencia humana en todos los aspectos. Este concepto genera debates eticos importantes sobre seguridad y control. Pensadores como Nick Bostrom y organizaciones como el Future of Life Institute estudian los riesgos potenciales de alcanzar este nivel.',
    1, 10);

  -- Leccion 1.3
  INSERT INTO lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (v_mod1_id, 'IA en la Vida Diaria',
    'La inteligencia artificial ya esta presente en casi todos los aspectos de nuestra vida cotidiana, aunque muchas veces no nos damos cuenta. Cuando desbloqueas tu telefono con reconocimiento facial, cuando Google Maps te sugiere la ruta mas rapida, o cuando Spotify crea una playlist personalizada, estas interactuando con sistemas de IA.

En el ambito de la salud, la IA ayuda a detectar enfermedades en radiografias con una precision comparable a la de medicos especialistas. En finanzas, algoritmos de IA detectan fraudes en tiempo real analizando patrones de transacciones. En educacion, plataformas adaptativas personalizan el contenido segun el ritmo de aprendizaje de cada estudiante.

En el hogar, asistentes como Alexa y Google Home utilizan procesamiento de lenguaje natural para entender tus comandos. Los filtros de spam en tu correo, las sugerencias de autocompletado al escribir, y hasta los subtitulos automaticos en YouTube son ejemplos de IA que usamos diariamente sin pensarlo.',
    2, 7);

  -- ============================================
  -- Modulo 2: Herramientas de IA
  -- ============================================
  INSERT INTO modules (course_id, title, order_index)
  VALUES (v_course_id, 'Herramientas de IA', 1)
  RETURNING id INTO v_mod2_id;

  -- Leccion 2.1
  INSERT INTO lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (v_mod2_id, 'ChatGPT: Tu Asistente de IA',
    'ChatGPT, desarrollado por OpenAI, es uno de los modelos de lenguaje mas populares y accesibles del mundo. Lanzado en noviembre de 2022, revoluciono la forma en que las personas interactuan con la inteligencia artificial. Funciona como un asistente conversacional capaz de responder preguntas, redactar textos, programar, traducir, y mucho mas.

Para comenzar a usar ChatGPT, solo necesitas crear una cuenta gratuita en chat.openai.com. La version gratuita utiliza GPT-3.5, mientras que la version Plus ($20/mes) ofrece acceso a GPT-4, que es mas preciso y capaz. ChatGPT puede ayudarte a resumir documentos largos, generar ideas para proyectos, explicar conceptos complejos de forma simple, y hasta escribir codigo en multiples lenguajes de programacion.

Es importante recordar que ChatGPT tiene limitaciones: puede generar informacion incorrecta con confianza (alucinaciones), tiene un conocimiento limitado a su fecha de entrenamiento, y no puede acceder a internet en tiempo real en su version basica. Siempre verifica la informacion critica con fuentes confiables.',
    0, 12);

  -- Leccion 2.2
  INSERT INTO lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (v_mod2_id, 'Google Gemini y Otros Asistentes',
    'Google Gemini (anteriormente Bard) es la respuesta de Google al fenomeno de ChatGPT. A diferencia de ChatGPT, Gemini tiene acceso directo a la busqueda de Google, lo que le permite proporcionar informacion mas actualizada. Gemini esta disponible en gemini.google.com y se integra con el ecosistema de Google incluyendo Gmail, Docs, y Sheets.

Otros asistentes de IA importantes incluyen Claude (de Anthropic), conocido por sus respuestas mas largas y reflexivas; Microsoft Copilot, integrado en Windows y Office 365; y Perplexity AI, que combina IA conversacional con busqueda web y cita sus fuentes. Cada herramienta tiene fortalezas diferentes: Claude destaca en analisis de documentos largos, Copilot en productividad con Microsoft Office, y Perplexity en investigacion con fuentes verificables.

La clave para aprovechar estas herramientas es entender que cada una tiene sus ventajas. Lo ideal es experimentar con varias y usar la mas adecuada para cada tarea. Por ejemplo, Gemini es excelente para consultas que requieren informacion actual, mientras que Claude es superior para analizar textos extensos.',
    1, 10);

  -- Leccion 2.3
  INSERT INTO lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (v_mod2_id, 'Herramientas de IA para Imagenes',
    'La generacion de imagenes con IA ha avanzado enormemente en los ultimos anos. Herramientas como DALL-E (de OpenAI), Midjourney, y Stable Diffusion permiten crear imagenes impresionantes a partir de descripciones de texto. Cada herramienta tiene su estilo y fortalezas unicas.

DALL-E 3, integrado en ChatGPT Plus, es la opcion mas accesible y facil de usar. Simplemente describes la imagen que deseas y la IA la genera en segundos. Midjourney, accesible a traves de Discord, es preferido por artistas y disenadores por su estetica superior y resultados mas artisticos. Stable Diffusion es de codigo abierto y puede ejecutarse localmente en tu computadora.

Ademas de la generacion de imagenes, existen herramientas como Remove.bg para eliminar fondos automaticamente, Upscale.media para mejorar la resolucion de fotos, y Canva con funciones de IA para diseno grafico. Para edicion de fotos, Adobe Firefly ofrece funciones como relleno generativo que permite agregar o eliminar elementos de fotografias de forma natural.',
    2, 10);

  -- ============================================
  -- Modulo 3: Prompt Engineering
  -- ============================================
  INSERT INTO modules (course_id, title, order_index)
  VALUES (v_course_id, 'Prompt Engineering', 2)
  RETURNING id INTO v_mod3_id;

  -- Leccion 3.1
  INSERT INTO lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (v_mod3_id, '¿Que es un Prompt?',
    'Un prompt es la instruccion o texto que le das a una inteligencia artificial para obtener una respuesta. Piensa en el prompt como una pregunta o comando que guia a la IA sobre que quieres que haga. La calidad de la respuesta que obtienes depende directamente de la calidad de tu prompt: mejor prompt, mejor respuesta.

El prompt engineering es el arte y la ciencia de disenar instrucciones efectivas para obtener los mejores resultados posibles de modelos de IA. No se trata solo de hacer preguntas, sino de estructurar tus solicitudes de manera que la IA entienda exactamente lo que necesitas. Es como la diferencia entre decirle a alguien "hazme un dibujo" versus "dibuja un paisaje de montana al atardecer con colores calidos en estilo acuarela".

Un buen prompt incluye contexto (informacion de fondo), tarea (que quieres que haga), formato (como quieres la respuesta), y restricciones (que debe evitar). Por ejemplo, en lugar de preguntar "explica la fotosintesis", un mejor prompt seria: "Explica la fotosintesis como si le hablaras a un estudiante de 12 anos, usando analogias con la cocina, en maximo 3 parrafos".',
    0, 8);

  -- Leccion 3.2
  INSERT INTO lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (v_mod3_id, 'Tecnicas Basicas de Prompting',
    'Existen varias tecnicas fundamentales que mejoran drasticamente la calidad de las respuestas de IA. La primera es "Ser Especifico": en lugar de "escribe sobre perros", di "escribe un articulo de 500 palabras sobre los beneficios de adoptar perros adultos de refugios, dirigido a familias con ninos". Cuanto mas especifico seas, mejores resultados obtendras.

La segunda tecnica es "Asignar un Rol": puedes decirle a la IA que actue como un experto especifico. Por ejemplo, "Actua como un nutricionista deportivo y crea un plan de alimentacion semanal para un corredor de maraton". Esto orienta las respuestas hacia un nivel de expertise y perspectiva particular.

La tercera tecnica es "Dar Ejemplos" (few-shot prompting): muestrale a la IA el formato o estilo que esperas. Por ejemplo, "Clasifica estos comentarios como positivo, negativo o neutral. Ejemplo: El producto es increible -> Positivo. Ejemplo: No funciono -> Negativo. Ahora clasifica: El envio fue rapido pero el empaque estaba danado". Esta tecnica es especialmente util para tareas de clasificacion y formato.',
    1, 12);

  -- Leccion 3.3
  INSERT INTO lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (v_mod3_id, 'Prompts Avanzados',
    'Las tecnicas avanzadas de prompting llevan tus interacciones con IA al siguiente nivel. El "Chain of Thought" (cadena de pensamiento) instruye a la IA a razonar paso a paso antes de dar una respuesta final. Simplemente agrega "piensa paso a paso" o "explica tu razonamiento" a tu prompt. Esto mejora significativamente la precision en problemas logicos y matematicos.

Otra tecnica poderosa es el "Prompting Iterativo": no intentes obtener la respuesta perfecta en un solo prompt. Empieza con una solicitud general, evalua la respuesta, y luego refina con instrucciones adicionales. Por ejemplo, primero pide un borrador, luego pide que mejore secciones especificas, y finalmente que ajuste el tono. Este enfoque iterativo produce resultados mucho mejores.

Finalmente, el "Mega-Prompt" combina multiples instrucciones en un solo prompt estructurado. Incluye el rol, contexto, tarea, formato de salida, restricciones, y ejemplos todo en uno. Por ejemplo: "Rol: Eres un copywriter experto en SaaS. Contexto: Estoy lanzando una app de gestion de tareas. Tarea: Escribe 3 variantes de headline para la landing page. Formato: Titulo (max 10 palabras) + Subtitulo (max 25 palabras). Restricciones: No uses jerga tecnica, enfocate en beneficios no en features".',
    2, 15);

  RAISE NOTICE 'Curso demo creado exitosamente con ID: %', v_course_id;
END $$;
