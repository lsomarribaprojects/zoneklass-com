-- ============================================================
-- SEED: Domina la IA - Parte 1 (Modulos 1, 2, 3)
-- Curso gratuito de +30 horas sobre IA
-- Idempotente: elimina datos previos antes de insertar
-- ============================================================

BEGIN;

-- ============================================================
-- 1. LIMPIEZA IDEMPOTENTE
-- ============================================================
-- CASCADE elimina modules, lessons, enrollments, progress, embeddings
DELETE FROM public.courses WHERE slug = 'domina-la-ia-de-cero-a-experto';

-- ============================================================
-- 2. VARIABLES: obtener created_by del primer super_admin
-- ============================================================
DO $$
DECLARE
  v_admin_id UUID;
  v_course_id UUID;
  v_mod1_id UUID;
  v_mod2_id UUID;
  v_mod3_id UUID;
BEGIN

  -- Obtener el primer super_admin
  SELECT id INTO v_admin_id
  FROM public.profiles
  WHERE role = 'super_admin'
  ORDER BY created_at ASC
  LIMIT 1;

  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION 'No se encontro un super_admin en profiles. Crea uno primero.';
  END IF;

  -- ============================================================
  -- 3. INSERTAR CURSO
  -- ============================================================
  INSERT INTO public.courses (id, title, description, slug, category, level, price, is_published, created_by)
  VALUES (
    gen_random_uuid(),
    'Domina la IA: De Cero a Experto en la Era de los Agentes Inteligentes',
    'Curso GRATUITO de +30 horas. Domina ChatGPT Agent Mode, Gemini Deep Think, Claude Code, Veo 3, Nano Banana Pro y OpenClaw. Con practicas guiadas en cada leccion. Patrocinado por Sinsajo Creators.',
    'domina-la-ia-de-cero-a-experto',
    'IA',
    'Principiante',
    0,
    true,
    v_admin_id
  )
  RETURNING id INTO v_course_id;

  -- ============================================================
  -- 4. MODULO 1: FUNDAMENTOS DE LA IA
  -- ============================================================
  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES (gen_random_uuid(), v_course_id, 'Fundamentos de la IA', 0)
  RETURNING id INTO v_mod1_id;

  -- Leccion 1.1
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod1_id,
    'Que es la IA: De Alan Turing a los Agentes Inteligentes',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_1_1">
    <p>Video: Introduccion a la Inteligencia Artificial - De Turing a los agentes modernos</p>
  </div>
</div>

<h2>El Sueno de las Maquinas que Piensan</h2>
<p>Imaginate que estas en 1950. No existen los smartphones, internet es ciencia ficcion, y un matematico britanico llamado <strong>Alan Turing</strong> publica un paper que cambiaria el mundo para siempre: "Computing Machinery and Intelligence". En ese documento, Turing hizo la pregunta que todavia nos quita el sueno: <strong>¿Pueden las maquinas pensar?</strong></p>

<p>Para responderla, creo lo que hoy conocemos como el <strong>Test de Turing</strong>: si una maquina puede mantener una conversacion con un humano y este no puede distinguir si habla con una maquina o con otra persona, entonces esa maquina es "inteligente". Suena simple, pero piensa en esto: cada vez que hablas con ChatGPT o Gemini y te olvidas de que es una maquina... Turing estaria sonriendo.</p>

<p>Pero la historia no empieza ni termina con Turing. La IA ha pasado por <strong>olas de entusiasmo y "inviernos"</strong> donde nadie creia en ella:</p>

<ul>
  <li><strong>1956 - Conferencia de Dartmouth:</strong> Se acuna oficialmente el termino "Inteligencia Artificial". Un grupo de cientificos creia que en un verano resolverian el problema. Spoiler: no lo hicieron.</li>
  <li><strong>1960s-70s - Primer boom:</strong> Programas que jugaban ajedrez y resolvian problemas matematicos. El gobierno de EE.UU. invirtio millones.</li>
  <li><strong>1974-1993 - Inviernos de la IA:</strong> Las promesas no se cumplieron. Se cortaron fondos. La IA fue vista como una fantasia.</li>
  <li><strong>1997 - Deep Blue vence a Kasparov:</strong> IBM demostro que una maquina podia derrotar al campeon mundial de ajedrez.</li>
  <li><strong>2012 - Revolucion del Deep Learning:</strong> AlexNet aplasta la competencia de vision por computadora. Las redes neuronales profundas renacen.</li>
  <li><strong>2022-2026 - Era de la IA Generativa:</strong> ChatGPT, Gemini, Claude, Midjourney. La IA deja de ser solo para cientificos y llega a todos.</li>
</ul>

<img src="PENDIENTE_IMG_timeline_ia_historia.jpg" alt="Linea de tiempo de la historia de la Inteligencia Artificial desde 1950 hasta 2026" class="lesson-image" />

<h2>Los 3 Tipos de IA que Debes Conocer</h2>
<p>No toda la IA es igual. Piensa en ella como niveles de un videojuego:</p>

<ul>
  <li><strong>IA Estrecha (ANI - Artificial Narrow Intelligence):</strong> Es la unica que existe hoy. Hace UNA cosa muy bien. Siri reconoce tu voz, Netflix recomienda peliculas, ChatGPT genera texto. Pero ninguna puede hacer todo a la vez. Es como un chef que hace la mejor pasta del mundo pero no sabe hervir un huevo.</li>
  <li><strong>IA General (AGI - Artificial General Intelligence):</strong> La que todo el mundo busca. Una maquina que pueda hacer CUALQUIER tarea intelectual que un humano puede hacer. OpenAI dice que este es su objetivo. Google con Gemini 3 dice estar cerca. Pero la realidad es que aun no existe.</li>
  <li><strong>Super IA (ASI - Artificial Super Intelligence):</strong> Una IA mas inteligente que todos los humanos combinados. Esto es ciencia ficcion... por ahora. Pero pensadores como Nick Bostrom advierten que debemos prepararnos.</li>
</ul>

<h2>2026: La Era de los Agentes Inteligentes</h2>
<p>Aqui es donde la cosa se pone interesante. En 2025-2026 pasamos de <strong>"la IA que responde"</strong> a <strong>"la IA que actua"</strong>. Un agente inteligente no solo te dice como hacer algo, sino que <strong>lo hace por ti</strong>:</p>

<ul>
  <li><strong>ChatGPT Agent Mode:</strong> Puede navegar la web, leer documentos, ejecutar codigo y completar tareas complejas de forma autonoma.</li>
  <li><strong>Gemini Agents:</strong> Loop Think-Act-Observe. Piensa, actua, observa el resultado, y ajusta. Como un empleado que aprende en tiempo real.</li>
  <li><strong>Claude Code:</strong> Un agente que programa software completo. No genera snippets: construye aplicaciones enteras.</li>
</ul>

<p>La diferencia entre un chatbot y un agente es como la diferencia entre un GPS que te dice "gira a la derecha" y un coche autonomo que te lleva directamente a tu destino. <strong>En este curso vas a aprender a usar ambos.</strong></p>

<img src="PENDIENTE_IMG_chatbot_vs_agente.jpg" alt="Comparativa visual entre un chatbot tradicional y un agente inteligente autonomo" class="lesson-image" />

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Abre ChatGPT (chat.openai.com) y preguntale: "¿Pasarias el Test de Turing? Explicame por que si o por que no." Analiza su respuesta: ¿te convence?</li>
    <li><strong>Ejercicio 2:</strong> Haz una lista de 5 herramientas de IA que ya usas en tu vida diaria sin darte cuenta (pista: autocorrector, recomendaciones de Spotify, filtros de Instagram...).</li>
    <li><strong>Ejercicio 3:</strong> Investiga: ¿Que empresa esta mas cerca de lograr AGI? Busca en Google "AGI progress 2026" y resume lo que encuentres en 3 parrafos.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres implementar IA en tu negocio pero no sabes por donde empezar? En <a href="https://screatorsai.com">Sinsajo Creators</a> te ayudamos a integrar agentes inteligentes en tu empresa. Contactanos: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    0,
    45
  );

  -- Leccion 1.2
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod1_id,
    'Machine Learning vs Deep Learning vs IA Generativa',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_1_2">
    <p>Video: Las tres ramas de la IA moderna explicadas con ejemplos cotidianos</p>
  </div>
</div>

<h2>Tres Primos que se Parecen, Pero No Son Iguales</h2>
<p>Cuando la gente dice "IA", en realidad puede estar hablando de tres cosas muy diferentes. Es como decir "musica": puede ser regueton, clasica o jazz. Todas son musica, pero son mundos distintos. Vamos a separar los conceptos de una vez por todas.</p>

<p>Piensa en tres circulos concentricos. El mas grande es <strong>Inteligencia Artificial</strong> (cualquier maquina que simula inteligencia humana). Dentro esta <strong>Machine Learning</strong> (maquinas que aprenden de datos). Y dentro de ese, <strong>Deep Learning</strong> (redes neuronales con muchas capas). La <strong>IA Generativa</strong> es una aplicacion del Deep Learning que crea contenido nuevo.</p>

<img src="PENDIENTE_IMG_circulos_ia_ml_dl.jpg" alt="Diagrama de circulos concentricos mostrando la relacion entre IA, Machine Learning, Deep Learning e IA Generativa" class="lesson-image" />

<h2>Machine Learning: Netflix Sabe lo que Quieres Ver</h2>
<p>El Machine Learning es como entrenar a un perro. Le das muchos ejemplos (datos), le dices que esta bien y que esta mal (etiquetas), y eventualmente aprende a hacer predicciones por su cuenta. No le programas las reglas: <strong>el las descubre solo</strong>.</p>

<ul>
  <li><strong>Netflix:</strong> Analiza que peliculas viste, cuales terminaste, cuales dejaste a los 10 minutos. Con esos datos, predice que te gustara. Eso es ML.</li>
  <li><strong>Deteccion de spam:</strong> Gmail no tiene una lista de todas las palabras spam. Aprendio de millones de emails marcados como spam por los usuarios.</li>
  <li><strong>Uber:</strong> Predice cuanto costara tu viaje basandose en datos historicos de trafico, hora del dia y demanda.</li>
</ul>

<p>Hay tres tipos principales de Machine Learning:</p>
<ul>
  <li><strong>Supervisado:</strong> Le das datos etiquetados. "Este email es spam, este no." El modelo aprende a clasificar.</li>
  <li><strong>No supervisado:</strong> Le das datos SIN etiquetas y el modelo encuentra patrones. "Estos clientes se parecen entre si."</li>
  <li><strong>Por refuerzo:</strong> El modelo aprende por prueba y error, recibiendo recompensas. Asi se entreno AlphaGo para vencer al campeon de Go.</li>
</ul>

<h2>Deep Learning: Tu Cara Desbloquea Tu Telefono</h2>
<p>El Deep Learning es Machine Learning con esteroides. Usa <strong>redes neuronales artificiales</strong> inspiradas en el cerebro humano. Imagina millones de neuronas artificiales conectadas en capas, cada una procesando un pedacito de informacion.</p>

<p>¿Por que "Deep"? Porque tiene MUCHAS capas. Una red neuronal simple tiene 2-3 capas. Una red profunda puede tener cientos. Cada capa extrae un nivel diferente de complejidad:</p>

<ul>
  <li><strong>Capa 1:</strong> Detecta bordes y lineas en una imagen.</li>
  <li><strong>Capa 2:</strong> Combina bordes para encontrar formas (ojos, nariz, boca).</li>
  <li><strong>Capa 3+:</strong> Reconoce la cara completa de tu mama.</li>
</ul>

<p>Ejemplos reales de Deep Learning:</p>
<ul>
  <li><strong>Face ID de Apple:</strong> Proyecta 30,000 puntos infrarrojos en tu cara y usa Deep Learning para reconocerte incluso con gorra o barba nueva.</li>
  <li><strong>Coches autonomos de Tesla:</strong> Procesan video de 8 camaras en tiempo real para detectar peatones, semaforos y otros vehiculos.</li>
  <li><strong>Traduccion en tiempo real:</strong> Google Translate usa Transformers (una arquitectura de Deep Learning) para traducir entre 130 idiomas.</li>
</ul>

<img src="PENDIENTE_IMG_red_neuronal_capas.jpg" alt="Visualizacion de una red neuronal profunda con multiples capas procesando una imagen" class="lesson-image" />

<h2>IA Generativa: La IA que Crea</h2>
<p>Y llegamos a la estrella del show. La IA Generativa es la que ha explotado desde 2022. A diferencia del ML clasico que <strong>clasifica o predice</strong>, la IA Generativa <strong>crea contenido nuevo</strong> que nunca existio:</p>

<ul>
  <li><strong>Texto:</strong> ChatGPT, Claude, Gemini escriben ensayos, codigo, poemas, emails.</li>
  <li><strong>Imagenes:</strong> Midjourney, DALL-E, Stable Diffusion crean arte desde una descripcion en texto.</li>
  <li><strong>Video:</strong> Veo 3 de Google, Sora de OpenAI generan videos realistas de minutos de duracion.</li>
  <li><strong>Audio:</strong> ElevenLabs clona voces. Suno genera canciones completas con letra y melodia.</li>
  <li><strong>Codigo:</strong> GitHub Copilot, Claude Code, Cursor escriben software funcional.</li>
</ul>

<p>La tecnologia detras se llama <strong>Transformers</strong> (nada que ver con los robots de Optimus Prime). Son una arquitectura de red neuronal inventada por Google en 2017 en el paper "Attention is All You Need". La T de GPT significa "Transformer". Son tan poderosos porque pueden procesar informacion en paralelo y prestar "atencion" a las partes mas relevantes del texto.</p>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Abre ChatGPT y pidele: "Explicame la diferencia entre Machine Learning y Deep Learning como si fuera un nino de 10 anos." ¿Su explicacion es mejor o peor que la de esta leccion?</li>
    <li><strong>Ejercicio 2:</strong> Ve a <a href="https://teachablemachine.withgoogle.com">Teachable Machine de Google</a>. Entrena un modelo de ML para reconocer dos objetos de tu escritorio usando tu camara. Acaba de hacer Machine Learning supervisado sin escribir una linea de codigo.</li>
    <li><strong>Ejercicio 3:</strong> Genera una imagen en cualquier herramienta gratuita (Bing Image Creator, Leonardo AI) con este prompt: "Un robot profesor explicando IA a estudiantes en un salon futurista, estilo Pixar." Eso es IA Generativa en accion.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Necesitas automatizar procesos en tu empresa con Machine Learning? <a href="https://screatorsai.com">Sinsajo Creators</a> implementa soluciones de IA a medida para tu negocio. Agenda tu consulta gratuita: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    1,
    40
  );

  -- Leccion 1.3
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod1_id,
    'El Ecosistema IA 2026',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_1_3">
    <p>Video: Mapa completo de las empresas y modelos de IA en 2026</p>
  </div>
</div>

<h2>La Guerra de los Titanes de la IA</h2>
<p>El mundo de la IA en 2026 parece una pelicula de Marvel: hay gigantes peleando por el trono, startups que aparecen de la nada con poderes sorprendentes, y alianzas que cambian cada semana. Vamos a mapear todo el campo de batalla para que nunca te pierdas.</p>

<p>Entender <strong>quien hace que</strong> es fundamental. No es lo mismo usar un modelo de OpenAI que uno de Google o de Meta. Cada uno tiene fortalezas, debilidades y filosofias diferentes. Y saber elegir el correcto para cada tarea es lo que separa a un usuario casual de un profesional de la IA.</p>

<h2>Los 5 Gigantes</h2>

<p><strong>1. OpenAI (ChatGPT, GPT-5.2, DALL-E, Sora)</strong></p>
<ul>
  <li>La empresa que inicio la revolucion con ChatGPT en noviembre de 2022.</li>
  <li>Modelo insignia: <strong>GPT-5.2</strong> con Agent Mode, razonamiento avanzado y multimodalidad.</li>
  <li>Herramientas: ChatGPT (chat), API para desarrolladores, DALL-E (imagenes), Sora (video).</li>
  <li>Filosofia: Modelos cerrados, acceso por suscripcion. Plus $20/mes, Pro $200/mes.</li>
  <li>Fortaleza: El ecosistema mas grande. 300+ millones de usuarios semanales.</li>
</ul>

<p><strong>2. Google DeepMind (Gemini 3, Veo 3, NotebookLM)</strong></p>
<ul>
  <li>Fusionaron Google Brain + DeepMind en un superlaboratorio.</li>
  <li>Modelo insignia: <strong>Gemini 3 Ultra</strong> - #1 mundial en LMArena con 1501 Elo.</li>
  <li>Ventaja unica: Integrado en TODO Google (Search, Gmail, Drive, YouTube, Android).</li>
  <li>Herramientas estrella: Deep Think, NotebookLM, AI Studio, Veo 3 (video), Imagen 4.</li>
  <li>Fortaleza: Datos. Google tiene mas datos del mundo que cualquier otra empresa.</li>
</ul>

<p><strong>3. Anthropic (Claude 4.6 Opus, Claude Code)</strong></p>
<ul>
  <li>Fundada por ex-empleados de OpenAI preocupados por la seguridad de la IA.</li>
  <li>Modelo insignia: <strong>Claude 4.6 Opus</strong> - El mas inteligente para razonamiento complejo y codigo.</li>
  <li>Filosofia: "IA Segura". Investigacion pionera en Constitutional AI y alignment.</li>
  <li>Herramienta estrella: <strong>Claude Code</strong> - Agente de programacion autonomo que construye apps completas.</li>
  <li>Fortaleza: Calidad de razonamiento. Ventana de contexto de 200K tokens.</li>
</ul>

<p><strong>4. Meta (Llama 4, FAIR)</strong></p>
<ul>
  <li>La apuesta de Zuckerberg por la IA abierta.</li>
  <li>Modelo insignia: <strong>Llama 4 Maverick/Scout</strong> - Modelos open-source de clase mundial.</li>
  <li>Filosofia: Codigo abierto. Cualquiera puede descargar, modificar y usar Llama.</li>
  <li>Impacto: Democratizo la IA. Miles de startups y desarrolladores usan Llama como base.</li>
  <li>Fortaleza: Comunidad. Llama tiene mas contribuidores open-source que cualquier otro modelo.</li>
</ul>

<p><strong>5. DeepSeek (DeepSeek-R1, DeepSeek-V3)</strong></p>
<ul>
  <li>La sorpresa china que sacudio Silicon Valley en enero 2025.</li>
  <li>Modelo insignia: <strong>DeepSeek-R1</strong> - Rendimiento comparable a GPT-4 a una fraccion del costo.</li>
  <li>Filosofia: Open-source + eficiencia extrema. Entrenado con 10x menos presupuesto que GPT-4.</li>
  <li>Impacto: Demostro que no necesitas billones de dolares para crear IA de primer nivel.</li>
  <li>Fortaleza: Costo-eficiencia. Sus modelos son de los mas baratos de operar.</li>
</ul>

<img src="PENDIENTE_IMG_mapa_ecosistema_ia.jpg" alt="Mapa visual del ecosistema de IA en 2026 con los principales jugadores y sus productos" class="lesson-image" />

<h2>Modelos Abiertos vs Cerrados: El Gran Debate</h2>
<p>Este es uno de los debates mas calientes en IA ahora mismo. Es como la eterna pelea entre iPhone (cerrado) vs Android (abierto):</p>

<ul>
  <li><strong>Modelos Cerrados (OpenAI, Google, Anthropic):</strong> Solo accedes via API o chat. No puedes ver el codigo, no puedes modificarlos, pagas por uso. Ventaja: mas pulidos, mas seguros, soporte empresarial.</li>
  <li><strong>Modelos Abiertos (Meta Llama, Mistral, DeepSeek):</strong> Descargas el modelo completo. Lo corres en tu servidor. Lo modificas como quieras. Ventaja: control total, sin costos recurrentes, privacidad de datos.</li>
</ul>

<p>En la practica, la mayoria de empresas usan una <strong>combinacion</strong>: modelos cerrados para tareas criticas que necesitan maxima calidad, y modelos abiertos para tareas de volumen donde el costo importa.</p>

<h2>Las Herramientas que Usaremos en Este Curso</h2>
<p>A lo largo del curso vamos a dominar herramientas de ambos mundos. Aqui tienes el mapa de lo que viene:</p>

<ul>
  <li><strong>ChatGPT + Agent Mode</strong> (Modulo 2) - El mas popular y versatil.</li>
  <li><strong>Gemini + Deep Think</strong> (Modulo 3) - El mas inteligente en benchmarks.</li>
  <li><strong>Claude + Claude Code</strong> (Modulo 4) - El mejor para programacion y razonamiento.</li>
  <li><strong>Veo 3</strong> (Modulo 5) - Generacion de video de nivel cinematografico.</li>
  <li><strong>Nano Banana Pro</strong> (Modulo 6) - Generacion de imagenes hiperrealistas.</li>
  <li><strong>OpenClaw</strong> (Modulo 7) - Automatizacion con agentes avanzados.</li>
</ul>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Crea una cuenta gratuita en cada una de estas plataformas: <a href="https://chat.openai.com">ChatGPT</a>, <a href="https://gemini.google.com">Gemini</a>, <a href="https://claude.ai">Claude</a>. Las tres tienen planes gratuitos.</li>
    <li><strong>Ejercicio 2:</strong> Hazle la MISMA pregunta a las tres IAs: "¿Cual es la IA mas inteligente del mundo en 2026 y por que?" Compara las respuestas. ¿Notas algun sesgo?</li>
    <li><strong>Ejercicio 3:</strong> Visita <a href="https://lmarena.ai">LMArena.ai</a> (antes Chatbot Arena). Haz 3 batallas anonimas entre modelos. ¿El que tu elegiste como ganador coincide con el ranking oficial?</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Confundido entre tantas opciones de IA? <a href="https://screatorsai.com">Sinsajo Creators</a> te asesora para elegir la solucion perfecta para tu caso de uso. Consulta gratuita: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    2,
    35
  );

  -- Leccion 1.4
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod1_id,
    'IA para Negocios: 10 Formas de Generar Dinero',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_1_4">
    <p>Video: 10 modelos de negocio reales con IA para empezar a monetizar hoy</p>
  </div>
</div>

<h2>La IA No Es Solo Tecnologia, Es Dinero</h2>
<p>Vamos a hablar del elefante en la habitacion: <strong>¿como se gana dinero con IA?</strong> Porque esta muy bien saber que es un Transformer y quien es Turing, pero al final del dia, queremos que la IA ponga comida en la mesa. Y la buena noticia es que hay MAS formas de monetizar la IA que nunca antes en la historia.</p>

<p>Segun McKinsey, la IA generativa podria agregar entre <strong>$2.6 y $4.4 trillones de dolares anuales</strong> a la economia global. Y eso no son predicciones futuristas: esta pasando AHORA. Freelancers, startups, corporaciones y emprendedores estan usando estas herramientas para crear negocios que hace 2 anos eran imposibles.</p>

<h2>Las 10 Formas de Generar Dinero con IA</h2>

<p><strong>1. Chatbots y Asistentes Virtuales para Empresas</strong></p>
<p>Las empresas estan DESESPERADAS por automatizar su atencion al cliente. Un chatbot con IA puede atender 24/7, en multiples idiomas, sin cansarse. Puedes usar la API de OpenAI o Claude para construir chatbots personalizados y cobrar entre $2,000 y $15,000 por implementacion, mas $500-$2,000 mensuales de mantenimiento.</p>

<p><strong>2. Creacion de Contenido (Texto, Blog, Redes Sociales)</strong></p>
<p>Social media managers y redactores estan usando ChatGPT y Claude para multiplicar su productividad x10. Un redactor que producia 3 articulos al dia ahora produce 15. Puedes ofrecer servicios de content marketing a agencias, cobrar por articulo o por paquete mensual de redes sociales ($1,000-$5,000/mes por cliente).</p>

<p><strong>3. Analisis de Datos y Business Intelligence</strong></p>
<p>Las empresas tienen MONTANAS de datos pero no saben que hacer con ellos. Con ChatGPT Code Interpreter o Claude puedes analizar CSVs, crear graficos, encontrar patrones y presentar insights accionables. Consultores de datos con IA cobran entre $100 y $500/hora.</p>

<img src="PENDIENTE_IMG_modelos_negocio_ia.jpg" alt="Infografia con las 10 formas de generar dinero con IA y sus rangos de ingresos" class="lesson-image" />

<p><strong>4. Automatizacion de Ventas y CRM</strong></p>
<p>Agentes de IA que califican leads, envian emails personalizados, hacen seguimiento automatico y agendan reuniones. Herramientas como Clay + ChatGPT API permiten construir pipelines de ventas que trabajan mientras duermes. Las empresas pagan $3,000-$10,000 por estos sistemas.</p>

<p><strong>5. Marketing Digital con IA</strong></p>
<p>Desde copywriting para anuncios hasta segmentacion de audiencias con ML. Puedes crear campanas de Google Ads y Meta Ads optimizadas por IA, generar variaciones A/B automaticas, y analizar resultados. Agencias de marketing con IA cobran retainers de $2,000-$10,000/mes.</p>

<p><strong>6. Generacion de Video con IA</strong></p>
<p>Con Veo 3, Runway, y HeyGen puedes crear videos comerciales, explicativos y de marketing sin camaras, actores ni estudios. Un video que antes costaba $5,000 producir ahora lo generas en minutos. Hay creadores en YouTube generando $10,000+/mes con contenido 100% generado por IA.</p>

<p><strong>7. Desarrollo de Apps y Software</strong></p>
<p>Con Claude Code, Cursor y GitHub Copilot puedes construir aplicaciones 10x mas rapido. Freelancers de software que cobran $100/hora ahora entregan proyectos en dias en lugar de semanas. Puedes construir MVPs para startups por $3,000-$15,000 y entregarlos en 1-2 semanas.</p>

<p><strong>8. Consultoria en IA</strong></p>
<p>Las empresas saben que necesitan IA pero no saben por donde empezar. Un consultor de IA evalua los procesos de una empresa, identifica donde la IA puede ahorrar tiempo y dinero, e implementa soluciones. Los consultores senior cobran $200-$500/hora o retainers de $5,000-$20,000/mes.</p>

<p><strong>9. Cursos y Educacion en IA</strong></p>
<p>La demanda de educacion en IA es ENORME. Puedes crear cursos en Udemy, YouTube, o tu propia plataforma. Los mejores creadores de cursos de IA generan $5,000-$50,000/mes. Incluso este curso que estas tomando ahora fue creado en parte con herramientas de IA.</p>

<p><strong>10. Agentes Autonomos Personalizados</strong></p>
<p>La frontera mas nueva y lucrativa. Agentes de IA que realizan tareas complejas de forma autonoma: investigar mercados, generar reportes, gestionar inventarios, moderar comunidades. Es el futuro del trabajo y los primeros en dominarlo tendran una ventaja brutal.</p>

<img src="PENDIENTE_IMG_piramide_ingresos_ia.jpg" alt="Piramide de oportunidades de negocio con IA desde freelancing hasta consultoria enterprise" class="lesson-image" />

<h2>¿Por Donde Empezar?</h2>
<p>No necesitas ser programador ni tener un MBA. Empieza con lo que ya sabes hacer y agrega IA como multiplicador. Si eres disenador, usa Midjourney. Si eres escritor, usa Claude. Si eres vendedor, usa ChatGPT para automatizar tu pipeline. <strong>La IA no te reemplaza, te amplifica.</strong></p>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Elige UNO de los 10 modelos de negocio y escribe un plan de accion de 5 pasos para empezar esta semana. Usa ChatGPT para ayudarte: "Crea un plan de accion de 5 pasos para empezar un negocio de [tu eleccion] con IA."</li>
    <li><strong>Ejercicio 2:</strong> Busca en Fiverr o Upwork "AI" o "ChatGPT". Anota los 5 servicios mas vendidos, sus precios, y cuantas ventas tienen. Eso te dice donde esta la demanda real AHORA.</li>
    <li><strong>Ejercicio 3:</strong> Calcula cuanto podrias ganar. Si ofreces un servicio de $500 y consigues 4 clientes al mes, son $2,000/mes extra. ¿Que servicio de IA podrias ofrecer con las habilidades que ya tienes?</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Listo para construir tu negocio con IA? <a href="https://screatorsai.com">Sinsajo Creators</a> es tu aliado estrategico. Ofrecemos desarrollo de chatbots, automatizacion con agentes, y consultoria personalizada. Hablemos: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    3,
    45
  );

  -- ============================================================
  -- 5. MODULO 2: CHATGPT
  -- ============================================================
  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES (gen_random_uuid(), v_course_id, 'ChatGPT', 1)
  RETURNING id INTO v_mod2_id;

  -- Leccion 2.1
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod2_id,
    'ChatGPT Desde Cero',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_2_1">
    <p>Video: Tutorial completo de ChatGPT desde la creacion de cuenta hasta trucos avanzados</p>
  </div>
</div>

<h2>Tu Primer Dia con ChatGPT</h2>
<p>Bienvenido al modulo mas practico del curso. Vamos a convertirte de "he escuchado de ChatGPT" a "lo uso como un profesional" en 5 lecciones. Y empezamos por el principio: abrir tu cuenta y entender cada boton de la interfaz.</p>

<p>ChatGPT es, por mucho, la herramienta de IA mas popular del mundo. Tiene <strong>mas de 300 millones de usuarios semanales</strong> y es usada por estudiantes, profesionales, emprendedores, programadores y creativos en practicamente todos los paises. Si solo pudieras aprender UNA herramienta de IA, esta seria la que te recomendaria.</p>

<h2>Paso 1: Crear tu Cuenta</h2>
<p>Ve a <a href="https://chat.openai.com">chat.openai.com</a> y crea tu cuenta. Puedes usar tu email, tu cuenta de Google, Microsoft o Apple. El proceso toma menos de 2 minutos. Una vez dentro, ya puedes empezar a chatear con GPT-4o de forma gratuita.</p>

<h2>Paso 2: Los Planes - ¿Cual Necesitas?</h2>
<ul>
  <li><strong>Free ($0/mes):</strong> Acceso a GPT-4o con limites de mensajes, generacion de imagenes limitada, acceso basico a Agent Mode. Perfecto para empezar y explorar.</li>
  <li><strong>Plus ($20/mes):</strong> Mas mensajes con GPT-4o, acceso a GPT-4o mini ilimitado, DALL-E, modo voz avanzado, y GPTs personalizados. El mejor valor para la mayoria de personas.</li>
  <li><strong>Pro ($200/mes):</strong> Acceso ilimitado a TODOS los modelos incluyendo GPT-5.2, o3 (razonamiento avanzado), Agent Mode con 400 mensajes/mes, y prioridad en momentos de alta demanda. Para profesionales y power users.</li>
  <li><strong>Team ($25/usuario/mes):</strong> Todo lo de Plus mas administracion de equipo, workspace compartido y datos no usados para entrenamiento. Para empresas pequenas.</li>
  <li><strong>Enterprise (precio personalizado):</strong> Seguridad empresarial, SSO, facturacion centralizada, y limites mas altos. Para corporaciones.</li>
</ul>

<img src="PENDIENTE_IMG_chatgpt_planes_comparativa.jpg" alt="Tabla comparativa de los planes de ChatGPT: Free, Plus, Pro, Team y Enterprise" class="lesson-image" />

<h2>Paso 3: La Interfaz - Cada Boton Explicado</h2>
<p>La interfaz de ChatGPT parece simple, pero tiene muchas funciones escondidas. Vamos a explorarlas:</p>

<ul>
  <li><strong>Barra de chat:</strong> Donde escribes tus mensajes (prompts). Puedes adjuntar archivos, imagenes, y documentos arrastrando o con el clip.</li>
  <li><strong>Selector de modelo:</strong> Arriba a la izquierda puedes elegir entre GPT-4o, GPT-4o mini, o3, y GPT-5.2 (segun tu plan).</li>
  <li><strong>Sidebar izquierdo:</strong> Tu historial de conversaciones organizado por fecha. Puedes renombrar, archivar o eliminar chats.</li>
  <li><strong>Canvas:</strong> Un espacio de trabajo lateral para editar texto o codigo de forma colaborativa con la IA. Perfecto para documentos largos.</li>
  <li><strong>Modo Voz:</strong> Habla directamente con ChatGPT como si fuera una llamada telefonica. Soporta multiples idiomas y tiene voces naturales.</li>
  <li><strong>Custom Instructions:</strong> En Configuracion, puedes decirle a ChatGPT QUIEN eres y COMO quieres que responda. Esto personaliza TODAS tus conversaciones.</li>
</ul>

<h2>Paso 4: Custom Instructions - Tu Arma Secreta</h2>
<p>Esta es una de las funciones menos usadas pero mas poderosas. En <strong>Configuracion > Personalizacion > Custom Instructions</strong> puedes configurar dos cosas:</p>

<ul>
  <li><strong>"¿Que quieres que ChatGPT sepa sobre ti?"</strong> - Tu profesion, idioma preferido, nivel de experiencia, industria. Ejemplo: "Soy un emprendedor de 28 anos en Latinoamerica. Hablo espanol. Mi negocio es una agencia de marketing digital. Tengo conocimientos intermedios de tecnologia."</li>
  <li><strong>"¿Como quieres que ChatGPT responda?"</strong> - Tono, formato, longitud. Ejemplo: "Responde en espanol. Se directo y practico. Usa ejemplos reales. Evita jerga tecnica innecesaria. Cuando des listas, usa bullet points."</li>
</ul>

<p>Una vez configurado, ChatGPT recordara estas instrucciones en TODAS tus conversaciones futuras. Es como tener un asistente que ya te conoce.</p>

<img src="PENDIENTE_IMG_chatgpt_custom_instructions.jpg" alt="Captura de pantalla de la configuracion de Custom Instructions en ChatGPT" class="lesson-image" />

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Crea tu cuenta en ChatGPT si aun no la tienes. Configura tus Custom Instructions con tu informacion real. Luego preguntale: "¿Que sabes sobre mi?" para verificar que las recordo.</li>
    <li><strong>Ejercicio 2:</strong> Prueba el modo Canvas. Pidele: "Escribe un email profesional para un cliente pidiendo una reunion." Luego edita el resultado directamente en Canvas, seleccionando parrafos y pidiendo mejoras especificas.</li>
    <li><strong>Ejercicio 3:</strong> Activa el modo voz y manten una conversacion de 3 minutos sobre cualquier tema. Nota lo natural que suena. Luego pidele que resuma la conversacion por escrito.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Tu empresa necesita capacitacion en ChatGPT para todo tu equipo? <a href="https://screatorsai.com">Sinsajo Creators</a> ofrece talleres corporativos personalizados. Contactanos: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    0,
    40
  );

  -- Leccion 2.2
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod2_id,
    'Prompt Engineering',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_2_2">
    <p>Video: Masterclass de Prompt Engineering - El framework CORT y prompts que funcionan</p>
  </div>
</div>

<h2>El Arte de Hablar con Maquinas</h2>
<p>Aqui esta la verdad que nadie te dice: <strong>ChatGPT es tan bueno como tu prompt</strong>. Es como un genio de la lampara: si le pides "dame algo bonito", te da algo generico. Pero si le pides exactamente lo que quieres, con contexto y especificidad, te da oro puro.</p>

<p>El Prompt Engineering es la habilidad de escribir instrucciones claras y efectivas para que la IA te de exactamente lo que necesitas. Y no, no es solo "saber preguntar". Es un framework sistematico que cualquiera puede aprender. De hecho, LinkedIn ya lista "Prompt Engineering" como una de las habilidades mas demandadas de 2026.</p>

<h2>Prompt Malo vs Prompt Bueno</h2>
<p>Veamos la diferencia con un ejemplo real:</p>

<ul>
  <li><strong>Prompt MALO:</strong> "Escribe un email." — ¿Para quien? ¿Sobre que? ¿Que tono? ChatGPT adivinara y probablemente no le atinara.</li>
  <li><strong>Prompt BUENO:</strong> "Escribe un email profesional pero cordial para un cliente que no ha pagado su factura de $3,500 que vencio hace 15 dias. Quiero ser firme pero no agresivo. Incluye la opcion de un plan de pagos. Maximo 150 palabras."</li>
</ul>

<p>¿Ves la diferencia? El segundo prompt tiene <strong>contexto, tono, restricciones y objetivo claro</strong>. Y eso es exactamente lo que ensena el Framework CORT.</p>

<h2>El Framework CORT</h2>
<p>CORT es un acronimo que te ayuda a construir prompts poderosos de forma consistente:</p>

<ul>
  <li><strong>C - Contexto:</strong> ¿Quien eres? ¿Cual es la situacion? Dale a la IA toda la informacion de fondo que necesita. "Soy el director de marketing de una startup de fintech en Mexico con 50 empleados."</li>
  <li><strong>O - Objetivo:</strong> ¿Que quieres lograr exactamente? "Necesito una estrategia de contenido para LinkedIn que aumente nuestros seguidores de 2,000 a 10,000 en 6 meses."</li>
  <li><strong>R - Restricciones:</strong> ¿Que limites o requisitos especificos hay? "Presupuesto de $500/mes. Solo contenido en espanol. Publicar 3 veces por semana. No mencionar competidores."</li>
  <li><strong>T - Tono/Formato:</strong> ¿Como quieres que te responda? "Responde como un consultor de marketing experimentado. Usa bullet points. Incluye un calendario semanal. Maximo 500 palabras."</li>
</ul>

<img src="PENDIENTE_IMG_framework_cort.jpg" alt="Infografia del Framework CORT para Prompt Engineering: Contexto, Objetivo, Restricciones, Tono" class="lesson-image" />

<h2>Mega-Prompts: El Nivel Profesional</h2>
<p>Un mega-prompt es un prompt largo y detallado que combina multiples instrucciones en un solo mensaje. Es como darle a un empleado un brief completo en lugar de instrucciones sueltas. Ejemplo de mega-prompt:</p>

<p><em>"Actua como un experto en SEO con 15 anos de experiencia. Voy a darte el URL de mi blog y quiero que: (1) Analices los 5 articulos mas recientes, (2) Identifiques problemas de SEO on-page, (3) Sugiera mejoras especificas para cada uno, (4) Me des un plan de accion priorizado. Formato: tabla con columnas [Articulo | Problema | Solucion | Prioridad]. Empieza preguntandome por el URL."</em></p>

<p>Los mega-prompts son especialmente poderosos porque le dan a la IA un <strong>rol, contexto, tareas multiples, formato esperado y un flujo de trabajo</strong>. Los profesionales de IA cobran cientos de dolares por crear mega-prompts para empresas.</p>

<h2>Tecnicas Avanzadas</h2>
<ul>
  <li><strong>Chain of Thought (Cadena de Pensamiento):</strong> Agrega "piensa paso a paso" al final de tu prompt. Esto hace que la IA razone en voz alta y llegue a respuestas mas precisas en problemas complejos.</li>
  <li><strong>Few-Shot Prompting:</strong> Dale 2-3 ejemplos de lo que quieres antes de pedirle que genere. "Ejemplo 1: [input] → [output]. Ejemplo 2: [input] → [output]. Ahora haz lo mismo con: [tu input]."</li>
  <li><strong>Role Prompting:</strong> "Eres un abogado especialista en propiedad intelectual con 20 anos de experiencia en Latinoamerica." Esto cambia dramaticamente la calidad de las respuestas.</li>
  <li><strong>Negative Prompting:</strong> Di lo que NO quieres. "No uses jerga tecnica. No me des respuestas genericas. No incluyas disclaimers innecesarios."</li>
</ul>

<h2>Prompt Engineering como Carrera</h2>
<p>Si, puedes vivir de esto. Empresas como Anthropic, Google y startups de IA contratan "Prompt Engineers" con salarios de $80,000 a $200,000 anuales. Freelancers en plataformas como Upwork cobran $50-$200/hora por optimizar prompts empresariales. No necesitas saber programar, pero si necesitas entender la logica y la comunicacion clara.</p>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Toma un prompt simple que hayas usado antes y reescribelo usando el Framework CORT. Envia ambas versiones a ChatGPT y compara los resultados. ¿Cual es mejor?</li>
    <li><strong>Ejercicio 2:</strong> Escribe un mega-prompt para tu trabajo o negocio. Ejemplo: "Actua como [rol]. Mi empresa es [contexto]. Necesito [objetivo]. Las restricciones son [limites]. Dame [formato]." Pruebalo y refina hasta que el resultado sea util.</li>
    <li><strong>Ejercicio 3:</strong> Practica Chain of Thought. Preguntale a ChatGPT: "Si tengo un negocio de comida con 3 empleados y quiero expandirme a delivery, ¿que deberia hacer? Piensa paso a paso." Compara con la misma pregunta SIN "piensa paso a paso."</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres mega-prompts personalizados para tu industria? <a href="https://screatorsai.com">Sinsajo Creators</a> diseña bibliotecas de prompts profesionales para equipos de ventas, marketing y operaciones. Contactanos: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    1,
    50
  );

  -- Leccion 2.3
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod2_id,
    'ChatGPT para Trabajo',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_2_3">
    <p>Video: Casos de uso reales de ChatGPT en el trabajo diario - Emails, reportes, datos y mas</p>
  </div>
</div>

<h2>ChatGPT como tu Empleado Digital</h2>
<p>Olvida los trucos virales de Twitter. Vamos a ver como ChatGPT te hace mas productivo en tu trabajo REAL, ese donde tienes deadlines, jefes y clientes esperando. Estas son las aplicaciones que la gente que realmente usa ChatGPT en su dia a dia jura que le cambiaron la vida.</p>

<p>Un estudio de Harvard Business School encontro que los consultores que usaban ChatGPT completaban tareas <strong>25% mas rapido y con 40% mas calidad</strong> que los que no lo usaban. Y eso fue con GPT-4. Con GPT-5.2 y Agent Mode, la ventaja es aun mayor.</p>

<h2>Emails Profesionales en Segundos</h2>
<p>El email sigue siendo el rey de la comunicacion empresarial, y la mayoria de profesionales pierden 2+ horas diarias escribiendolos. Con ChatGPT, reduces ese tiempo a minutos:</p>

<ul>
  <li><strong>Emails de seguimiento:</strong> "Escribe un email de seguimiento cordial para un prospecto que no respondio mi propuesta hace 5 dias. Incluye un CTA para agendar una llamada esta semana."</li>
  <li><strong>Respuestas a quejas:</strong> "Un cliente esta molesto porque su pedido llego 3 dias tarde. Escribe una respuesta que se disculpe, explique el motivo (problemas logisticos) y ofrezca un 15% de descuento en su proxima compra."</li>
  <li><strong>Emails frios:</strong> "Escribe un cold email de 100 palabras para CFOs de empresas de manufactura ofreciendo nuestro software de inventario. Tono: profesional pero no corporativo. Incluye un dato estadistico impactante."</li>
</ul>

<p><strong>Pro tip:</strong> Pega un email que recibiste y dile: "Responde este email. Mi posicion es [X]. Quiero ser [tono]. Maximo [N] palabras." Es brutal lo rapido que funciona.</p>

<h2>Reportes y Documentos</h2>
<p>¿Necesitas un reporte semanal, un plan de proyecto, o una propuesta comercial? ChatGPT los genera en minutos:</p>

<ul>
  <li><strong>Reportes semanales:</strong> "Aqui estan mis logros de la semana: [lista]. Convierte esto en un reporte profesional con metricas, desafios y proximos pasos. Formato: ejecutivo, maximo 1 pagina."</li>
  <li><strong>Propuestas comerciales:</strong> "Crea una propuesta de servicios de diseno web para una clinica dental. Incluye: alcance, timeline, 3 paquetes de precios ($2K, $5K, $10K) y terminos. Tono profesional."</li>
  <li><strong>Minutas de reunion:</strong> Pega la transcripcion de una reunion (puedes usar Otter.ai o la grabacion de Google Meet) y pide: "Extrae las decisiones tomadas, los action items con responsables, y los temas pendientes."</li>
</ul>

<img src="PENDIENTE_IMG_chatgpt_trabajo_flujo.jpg" alt="Diagrama de flujo mostrando como ChatGPT se integra en tareas laborales diarias" class="lesson-image" />

<h2>Analisis de Datos sin Ser Analista</h2>
<p>Esta es una de las funciones mas subestimadas de ChatGPT. Puedes subir archivos CSV, Excel, o PDF y ChatGPT los analiza por ti:</p>

<ul>
  <li><strong>Subir un CSV de ventas:</strong> "Analiza este archivo de ventas. Dime: (1) Los 5 productos mas vendidos, (2) Tendencia mensual de ingresos, (3) Clientes con mas compras, (4) Genera un grafico de barras con las ventas por mes."</li>
  <li><strong>Analizar encuestas:</strong> "Este CSV tiene respuestas de 200 clientes. Encuentra los 3 temas mas mencionados, el sentiment general, y dame recomendaciones accionables."</li>
  <li><strong>Comparar datos:</strong> "Tengo dos CSVs: ventas de 2024 y ventas de 2025. Compara el crecimiento por categoria y dime donde estamos perdiendo y donde estamos ganando."</li>
</ul>

<p>ChatGPT usa <strong>Code Interpreter</strong> internamente: ejecuta codigo Python real para analizar tus datos, generar graficos con matplotlib, y darte resultados precisos. No necesitas saber Python; solo necesitas saber preguntar.</p>

<h2>Presentaciones y Brainstorming</h2>
<p>Cuando necesitas ideas rapidas o estructurar una presentacion:</p>

<ul>
  <li><strong>Brainstorming:</strong> "Dame 20 ideas de nombres para una startup de delivery de comida saludable en Bogota. Que sean memorables, en espanol, y que comuniquen salud + rapidez."</li>
  <li><strong>Estructura de presentacion:</strong> "Tengo que presentar los resultados del Q4 al board. Tenemos: revenue $2.3M (+15%), 45 clientes nuevos, churn 3.2%. Crea un outline de 10 slides con titulos y bullet points clave."</li>
  <li><strong>Elevator pitch:</strong> "Mi startup hace [X]. Necesito un pitch de 60 segundos para inversionistas. Incluye: problema, solucion, mercado, traccion, y ask."</li>
</ul>

<img src="PENDIENTE_IMG_chatgpt_analisis_datos.jpg" alt="Ejemplo de ChatGPT analizando un archivo CSV y generando graficos automaticamente" class="lesson-image" />

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Toma el ultimo email que escribiste en tu trabajo y pidele a ChatGPT que lo mejore: "Mejora este email. Hazlo mas conciso, profesional y con un CTA claro: [pega tu email]." Compara ambas versiones.</li>
    <li><strong>Ejercicio 2:</strong> Crea un CSV simple con datos ficticios (10 filas de: producto, cantidad, precio, fecha) en Excel o Google Sheets. Exporta como CSV, subelo a ChatGPT, y pidele: "Analiza estas ventas y dame los 3 insights mas importantes con un grafico."</li>
    <li><strong>Ejercicio 3:</strong> Pidele a ChatGPT que cree un reporte semanal basado en estos datos ficticios: "Ventas: $45,000 (meta $50,000). Leads nuevos: 120. Reuniones: 8. Cierres: 3. Desafio: el ciclo de ventas se alargo. Formato ejecutivo."</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres automatizar los procesos repetitivos de tu empresa con IA? <a href="https://screatorsai.com">Sinsajo Creators</a> implementa workflows inteligentes que ahorran +20 horas semanales a tu equipo. Agenda una demo: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    2,
    50
  );

  -- Leccion 2.4
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod2_id,
    'ChatGPT Agent Mode',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_2_4">
    <p>Video: LECCION CLAVE - ChatGPT Agent Mode al descubierto: la IA que actua por ti</p>
  </div>
</div>

<h2>De Chatbot a Agente: El Salto Mas Grande de ChatGPT</h2>
<p>Esta es <strong>la leccion mas importante de todo el modulo de ChatGPT</strong>, asi que presta atencion extra. Agent Mode no es una mejora mas. Es un cambio FUNDAMENTAL en como interactuamos con la IA. Pasamos de "la IA que responde preguntas" a <strong>"la IA que completa tareas complejas de forma autonoma"</strong>.</p>

<p>Imagina la diferencia entre preguntarle a tu asistente "¿como reservo un vuelo?" (chatbot) vs "reservame un vuelo a Madrid el 15 de marzo, clase ejecutiva, con escala maxima de 2 horas" (agente). El primero te da informacion. El segundo <strong>hace el trabajo por ti</strong>.</p>

<h2>¿Que es Agent Mode Exactamente?</h2>
<p>Agent Mode es una capacidad de ChatGPT que le permite ejecutar tareas de multiples pasos de forma autonoma. Cuando lo activas, ChatGPT puede:</p>

<ul>
  <li><strong>Navegar la web en tiempo real:</strong> Busca informacion, visita sitios web, lee articulos y extrae datos actualizados.</li>
  <li><strong>Leer y analizar documentos:</strong> Procesa PDFs, documentos de Google Drive, archivos de texto y presentaciones.</li>
  <li><strong>Ejecutar codigo Python:</strong> Analiza datos, genera graficos, procesa archivos y automatiza calculos.</li>
  <li><strong>Generar y editar imagenes:</strong> Crea imagenes con DALL-E y las modifica iterativamente.</li>
  <li><strong>Encadenar multiples acciones:</strong> Combina busqueda web + analisis de datos + generacion de reporte en una sola tarea.</li>
</ul>

<p>Todo esto lo hace de forma <strong>autonoma</strong>: tu le das la tarea, y el decide que herramientas usar, en que orden, y como resolver los problemas que encuentre en el camino.</p>

<img src="PENDIENTE_IMG_agent_mode_flujo.jpg" alt="Diagrama del flujo de Agent Mode: tarea del usuario, planificacion, ejecucion con herramientas, resultado" class="lesson-image" />

<h2>Como Activar Agent Mode</h2>
<p>Agent Mode se activa automaticamente cuando ChatGPT detecta que tu tarea requiere multiples pasos o herramientas externas. Pero puedes forzarlo de varias formas:</p>

<ul>
  <li><strong>Pide tareas complejas:</strong> "Investiga las 5 principales empresas de IA en Latinoamerica, encuentra sus ingresos estimados, y crea una tabla comparativa con fuentes."</li>
  <li><strong>Usa el icono de herramientas:</strong> En la barra de chat, puedes activar explicitamente la busqueda web, Code Interpreter y DALL-E.</li>
  <li><strong>Conectores (Pro):</strong> Con ChatGPT Pro puedes conectar Gmail, Google Drive, GitHub y mas para que Agent Mode interactue directamente con tus herramientas.</li>
</ul>

<h2>Watch Mode vs Takeover Mode</h2>
<p>Estos dos modos definen cuanto control le das al agente:</p>

<ul>
  <li><strong>Watch Mode (modo observar):</strong> El agente te muestra cada paso que va a tomar y espera tu aprobacion antes de ejecutar. Es como un empleado junior que te pregunta antes de actuar. Recomendado cuando estas aprendiendo o para tareas sensibles.</li>
  <li><strong>Takeover Mode (modo autonomo):</strong> El agente ejecuta todos los pasos sin preguntarte. Solo te muestra el resultado final. Es como un empleado senior en quien confias completamente. Recomendado para tareas rutinarias o cuando ya conoces bien la herramienta.</li>
</ul>

<h2>Datos Tecnicos Reales (2026)</h2>
<p>Aqui van los numeros que necesitas saber:</p>

<ul>
  <li><strong>Modelo base:</strong> GPT-5.2 para usuarios Pro, GPT-4o para Plus y Free.</li>
  <li><strong>Limites de Agent Mode:</strong> Usuarios Pro tienen ~400 mensajes de agente por mes. Plus tiene acceso limitado. Free tiene acceso muy basico.</li>
  <li><strong>Conectores disponibles (Pro):</strong> Gmail, Google Drive, Google Calendar, GitHub, Zapier, Slack, y mas integraciones en desarrollo.</li>
  <li><strong>Tareas recurrentes:</strong> Puedes programar tareas que se ejecuten automaticamente (diario, semanal, mensual). Ejemplo: "Todos los lunes a las 9am, busca las noticias mas relevantes de IA y enviame un resumen a mi email."</li>
  <li><strong>Tiempo maximo de ejecucion:</strong> Una tarea de agente puede correr hasta 15 minutos de forma autonoma antes de requerir intervencion.</li>
</ul>

<img src="PENDIENTE_IMG_agent_mode_conectores.jpg" alt="Vista de los conectores disponibles en ChatGPT Agent Mode: Gmail, Drive, GitHub, Slack" class="lesson-image" />

<h2>Casos de Uso Reales de Agent Mode</h2>

<p><strong>Investigacion de mercado:</strong></p>
<p>"Investiga el mercado de delivery de comida saludable en Ciudad de Mexico. Busca: tamano del mercado, competidores principales, precios promedio, tendencias de crecimiento. Crea un reporte de 3 paginas con fuentes."</p>

<p><strong>Analisis competitivo:</strong></p>
<p>"Analiza la presencia en redes sociales de estas 3 marcas: [A, B, C]. Visita sus perfiles de Instagram y LinkedIn. Compara: seguidores, frecuencia de publicacion, engagement, tipo de contenido. Tabla comparativa."</p>

<p><strong>Preparacion de reuniones:</strong></p>
<p>"Manana tengo una reunion con el CEO de [empresa]. Investiga: quien es, su trayectoria, noticias recientes de su empresa, posibles temas de interes. Creame un brief de 1 pagina."</p>

<h2>Limitaciones y Precauciones</h2>
<p>Agent Mode es poderoso pero no es perfecto. Ten en cuenta:</p>
<ul>
  <li>Puede cometer errores factuales, especialmente con datos numericos. Siempre verifica datos criticos.</li>
  <li>No puede acceder a sitios que requieren login (a menos que uses conectores).</li>
  <li>Las tareas recurrentes pueden fallar si hay cambios en los sitios web que visita.</li>
  <li>Consume mensajes rapidamente. Una tarea compleja puede usar 5-10 mensajes de tu cuota.</li>
</ul>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Activa Agent Mode con esta tarea: "Busca las 3 noticias mas importantes de IA de esta semana, resume cada una en 2 oraciones, y dime como afectan a las empresas en Latinoamerica." Observa como el agente navega la web y sintetiza informacion.</li>
    <li><strong>Ejercicio 2:</strong> Dale una tarea multi-paso: "Busca en LinkedIn 5 perfiles de Prompt Engineers en Latinoamerica. Analiza que habilidades listan. Crea un roadmap de habilidades para convertirme en Prompt Engineer en 6 meses." (Nota: no puede acceder a LinkedIn directamente, pero observa como se adapta).</li>
    <li><strong>Ejercicio 3:</strong> Experimenta con tareas recurrentes (requiere Pro): "Configura una tarea recurrente que todos los viernes a las 5pm busque las principales noticias de [tu industria] y me cree un newsletter de 500 palabras."</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres implementar agentes de IA autonomos en tu empresa? <a href="https://screatorsai.com">Sinsajo Creators</a> disenamos e implementamos agentes personalizados que automatizan ventas, soporte y operaciones. Hablemos: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    3,
    55
  );

  -- Leccion 2.5
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod2_id,
    'GPTs Personalizados',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_2_5">
    <p>Video: Crea tu propio GPT personalizado desde cero - Tutorial paso a paso</p>
  </div>
</div>

<h2>Tu Propia IA, Hecha a Medida</h2>
<p>¿Y si pudieras crear tu propio ChatGPT? Uno que sepa exactamente sobre tu industria, tu empresa y tus procesos. Uno que tus clientes o tu equipo puedan usar sin necesitar saber nada de prompts. Eso son los <strong>GPTs Personalizados</strong>, y son una de las funciones mas poderosas y menos aprovechadas de ChatGPT.</p>

<p>Un GPT personalizado es como crear un empleado virtual especializado. No necesitas programar. No necesitas saber de IA. Solo necesitas saber que quieres que haga y darle los documentos con la informacion que necesita.</p>

<h2>Paso a Paso: Crear tu Primer GPT</h2>

<p><strong>Paso 1: Ir al GPT Builder</strong></p>
<p>En ChatGPT, haz clic en tu nombre (esquina inferior izquierda) > "My GPTs" > "Create a GPT". Esto abre el GPT Builder, una interfaz conversacional donde ChatGPT mismo te guia para crear tu GPT personalizado.</p>

<p><strong>Paso 2: Definir el Proposito</strong></p>
<p>El Builder te preguntara: "¿Que quieres que haga este GPT?" Aqui debes ser MUY especifico. Ejemplos:</p>
<ul>
  <li>"Un asistente de ventas para mi agencia de marketing que conozca nuestros servicios, precios y casos de exito."</li>
  <li>"Un tutor de matematicas para estudiantes de secundaria que explique con analogias simples y no de las respuestas directamente."</li>
  <li>"Un asistente de recursos humanos que responda preguntas sobre politicas internas basandose en nuestro manual de empleados."</li>
</ul>

<p><strong>Paso 3: Subir Documentos (Knowledge Base)</strong></p>
<p>Aqui esta la magia. Puedes subir hasta <strong>20 archivos</strong> que tu GPT usara como su base de conocimiento:</p>
<ul>
  <li>PDFs de tu manual de operaciones, catalogo de productos, FAQ.</li>
  <li>Documentos de Word con procesos internos.</li>
  <li>CSVs con datos de productos, precios, inventario.</li>
  <li>Presentaciones con informacion de la empresa.</li>
</ul>

<p>Tu GPT buscara en estos documentos PRIMERO antes de responder, asegurandose de dar informacion precisa y especifica de tu negocio.</p>

<img src="PENDIENTE_IMG_gpt_builder_interfaz.jpg" alt="Captura de pantalla del GPT Builder mostrando las opciones de configuracion" class="lesson-image" />

<p><strong>Paso 4: Configurar el Comportamiento</strong></p>
<p>En la pestana "Configure" puedes ajustar:</p>
<ul>
  <li><strong>Instructions:</strong> Instrucciones detalladas de como debe comportarse. "Siempre saluda por nombre. Responde en espanol. Si no sabes algo, di que lo consultaras con el equipo."</li>
  <li><strong>Conversation starters:</strong> Preguntas sugeridas que aparecen al abrir el GPT. Facilitan que los usuarios empiecen.</li>
  <li><strong>Capabilities:</strong> Habilitar/deshabilitar busqueda web, generacion de imagenes, Code Interpreter.</li>
  <li><strong>Actions:</strong> Conectar APIs externas (avanzado). Tu GPT puede consultar tu CRM, base de datos, o cualquier API REST.</li>
</ul>

<p><strong>Paso 5: Publicar</strong></p>
<p>Puedes publicar tu GPT como:</p>
<ul>
  <li><strong>Privado:</strong> Solo tu puedes usarlo.</li>
  <li><strong>Con link:</strong> Cualquiera con el link puede acceder. Perfecto para compartir con clientes o equipo.</li>
  <li><strong>Publico en GPT Store:</strong> Disponible para los 300M+ de usuarios de ChatGPT. Algunos creadores generan miles de dolares mensuales con GPTs publicos.</li>
</ul>

<h2>El GPT Store: Un Nuevo Marketplace</h2>
<p>El GPT Store es como la App Store de Apple, pero para IAs personalizadas. Hay GPTs para todo:</p>
<ul>
  <li><strong>Canva GPT:</strong> Disena graficos directamente en ChatGPT.</li>
  <li><strong>Consensus GPT:</strong> Busca papers academicos y responde con evidencia cientifica.</li>
  <li><strong>Grimoire GPT:</strong> Programa websites completos con un solo prompt.</li>
</ul>

<p>OpenAI ha comenzado a compartir ingresos con los creadores mas populares del GPT Store. Es una oportunidad real de monetizacion.</p>

<img src="PENDIENTE_IMG_gpt_store_ejemplos.jpg" alt="Vista del GPT Store con ejemplos de GPTs populares y sus categorias" class="lesson-image" />

<h2>Ideas de GPTs para tu Negocio</h2>
<ul>
  <li><strong>GPT de onboarding:</strong> Entrena nuevos empleados respondiendo preguntas sobre procesos, herramientas y cultura. Subele tu manual de empleados.</li>
  <li><strong>GPT de soporte tecnico:</strong> Resuelve tickets comunes de tus clientes. Subele tu FAQ y documentacion tecnica.</li>
  <li><strong>GPT de cotizaciones:</strong> Genera cotizaciones automaticas basandose en tu lista de precios y servicios.</li>
  <li><strong>GPT de contenido:</strong> Genera posts de redes sociales con el tono y estilo de tu marca. Subele ejemplos de tu mejor contenido.</li>
</ul>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Crea tu primer GPT personalizado. Tema sugerido: un asistente que conozca tu curriculum/portafolio y responda preguntas como si fuera tu representante. Sube tu CV como documento y configuralo.</li>
    <li><strong>Ejercicio 2:</strong> Crea un GPT "tutor" sobre un tema que domines. Subele 2-3 documentos sobre el tema. Configuralo para que haga preguntas al usuario en lugar de dar respuestas directas (metodo socratico). Compartelo con un amigo y pide feedback.</li>
    <li><strong>Ejercicio 3:</strong> Explora el GPT Store. Encuentra 3 GPTs relevantes para tu trabajo o industria. Pruebalos y toma notas: ¿que hacen bien? ¿que mejorar  ias? Usa esas observaciones para mejorar tu propio GPT.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Necesitas un GPT personalizado de nivel empresarial con integraciones API? <a href="https://screatorsai.com">Sinsajo Creators</a> desarrolla asistentes de IA custom conectados a tus sistemas. Consultoria: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    4,
    45
  );

  -- ============================================================
  -- 6. MODULO 3: GOOGLE GEMINI
  -- ============================================================
  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES (gen_random_uuid(), v_course_id, 'Google Gemini', 2)
  RETURNING id INTO v_mod3_id;

  -- Leccion 3.1
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod3_id,
    'Gemini 3: La IA #1 del Mundo',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_3_1">
    <p>Video: Por que Gemini 3 es la IA numero 1 del mundo y como sacarle provecho</p>
  </div>
</div>

<h2>El Trono de la IA Tiene Nuevo Rey</h2>
<p>Cuando la gente piensa en IA, piensa en ChatGPT. Pero hay algo que muchos no saben: <strong>Gemini 3 de Google es actualmente la IA #1 del mundo</strong> segun los benchmarks mas respetados. En LMArena (antes Chatbot Arena), Gemini 3 Ultra ocupa el primer lugar con un Elo de 1501, superando a GPT-5.2 y Claude 4.6. Y no por poco.</p>

<p>¿Que significa esto para ti? Que si solo estas usando ChatGPT, te estas perdiendo del modelo mas capaz que existe. Gemini no solo es poderoso en texto; es <strong>nativo multimodal</strong>, lo que significa que entiende texto, imagenes, audio, video y codigo de forma integrada desde su entrenamiento. No son modulos separados pegados con cinta; es una sola IA que "ve, escucha y lee" al mismo tiempo.</p>

<h2>La Familia Gemini: Flash, Pro y Ultra</h2>
<p>Google ofrece tres versiones de Gemini, cada una optimizada para diferentes usos. Piensa en ellas como un Uber: tienes UberX, Comfort y Black:</p>

<ul>
  <li><strong>Gemini Flash:</strong> El mas rapido y barato. Respuestas casi instantaneas. Perfecto para tareas simples y de alto volumen: respostas rapidas, clasificacion de texto, resumenes cortos. Es el que usas para la mayoria de tareas diarias.</li>
  <li><strong>Gemini Pro:</strong> El equilibrio perfecto entre velocidad y calidad. Para tareas que necesitan mas razonamiento: analisis de documentos, redaccion compleja, programacion. Es el equivalente a GPT-4o.</li>
  <li><strong>Gemini Ultra:</strong> El titan. El modelo mas inteligente de Google. Para tareas que requieren razonamiento profundo, analisis de datos complejos, investigacion cientifica y problemas multi-paso. Es el que gano el #1 en LMArena.</li>
</ul>

<img src="PENDIENTE_IMG_gemini_modelos_comparativa.jpg" alt="Comparativa de los tres modelos Gemini: Flash, Pro y Ultra con sus fortalezas y casos de uso" class="lesson-image" />

<h2>Multimodalidad Nativa: La Ventaja de Google</h2>
<p>Aqui es donde Gemini realmente brilla. Mientras que ChatGPT fue entrenado principalmente con texto y luego se le agrego vision, Gemini fue entrenado desde cero para entender multiples modalidades simultaneamente:</p>

<ul>
  <li><strong>Texto:</strong> Conversacion, redaccion, analisis, codigo. Al nivel de los mejores.</li>
  <li><strong>Imagenes:</strong> Sube una foto y Gemini la describe, analiza, o usa como contexto. Puedes subir diagramas, graficas, capturas de pantalla, fotos de pizarras.</li>
  <li><strong>Audio:</strong> Procesa archivos de audio. Puedes subir una grabacion de una reunion y pedirle que la transcriba y resuma.</li>
  <li><strong>Video:</strong> Gemini puede analizar videos directamente. Sube un video y preguntale que esta pasando en el minuto 3:45. Ninguna otra IA hace esto de forma nativa.</li>
  <li><strong>Codigo:</strong> Gemini 3 tiene capacidades de programacion de primer nivel, especialmente en Python, JavaScript, y Go.</li>
</ul>

<h2>Google Integrado: El Ecosistema Mas Grande del Mundo</h2>
<p>La ventaja mas subestimada de Gemini es que esta integrado en TODO el ecosistema de Google:</p>

<ul>
  <li><strong>Gmail:</strong> Gemini resume emails largos, sugiere respuestas, y busca informacion en tu inbox.</li>
  <li><strong>Google Docs:</strong> "Help me write" te ayuda a redactar, editar y formatear documentos.</li>
  <li><strong>Google Sheets:</strong> Genera formulas, analiza datos, crea graficos con lenguaje natural.</li>
  <li><strong>Google Slides:</strong> Genera presentaciones completas a partir de un tema.</li>
  <li><strong>YouTube:</strong> Resume videos, responde preguntas sobre el contenido de un video.</li>
  <li><strong>Google Search:</strong> AI Overview muestra respuestas generadas por IA directamente en los resultados de busqueda.</li>
  <li><strong>Android:</strong> El asistente de Android sera reemplazado completamente por Gemini.</li>
</ul>

<p>Si tu empresa usa Google Workspace, tienes acceso a IA integrada en TODAS tus herramientas de trabajo sin instalar nada adicional.</p>

<h2>Gemini Gratuito vs Gemini Advanced</h2>
<ul>
  <li><strong>Gratuito (gemini.google.com):</strong> Acceso a Gemini Pro. Busqueda web integrada. Analisis de imagenes. Suficiente para la mayoria de usuarios.</li>
  <li><strong>Gemini Advanced ($19.99/mes con Google One AI Premium):</strong> Acceso a Gemini Ultra, ventana de contexto de 2M tokens (la mas grande del mundo), Deep Think, Gems personalizados, y 2TB de almacenamiento en Google Drive.</li>
</ul>

<img src="PENDIENTE_IMG_gemini_ecosistema_google.jpg" alt="Mapa del ecosistema Google con Gemini integrado en cada producto: Gmail, Docs, Sheets, Drive, YouTube" class="lesson-image" />

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Ve a <a href="https://gemini.google.com">gemini.google.com</a> y hazle la misma pregunta que le hiciste a ChatGPT en el modulo anterior. Compara las respuestas: ¿cual es mas completa? ¿cual cita mas fuentes?</li>
    <li><strong>Ejercicio 2:</strong> Prueba la multimodalidad: toma una foto de un menu de restaurante, de una pagina de un libro, o de un grafico de tu trabajo. Subela a Gemini y pidele que la analice. Luego hazle preguntas sobre lo que ve.</li>
    <li><strong>Ejercicio 3:</strong> Si tienes Google Workspace, abre un Google Doc y prueba "Help me write". Pidele: "Escribe una propuesta de proyecto sobre [tu tema] con 5 secciones." Edita el resultado colaborativamente.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Tu empresa usa Google Workspace y quiere maximizar Gemini? <a href="https://screatorsai.com">Sinsajo Creators</a> ofrece implementacion de Gemini for Google Workspace con capacitacion personalizada. Contactanos: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    0,
    45
  );

  -- Leccion 3.2
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod3_id,
    'Deep Think y Agent Mode',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_3_2">
    <p>Video: Gemini Deep Think y Agentic Mode - La IA que razona como un experto</p>
  </div>
</div>

<h2>Cuando la IA Piensa de Verdad</h2>
<p>En la leccion anterior vimos que Gemini es el #1. Pero lo que realmente lo hace especial no es solo responder rapido o ser multimodal. Es su capacidad de <strong>pensar profundamente</strong>. Y eso tiene un nombre: <strong>Deep Think</strong>.</p>

<p>La mayoria de las veces que usas una IA, esta responde en milisegundos. Es rapido, pero es un pensamiento "superficial": genera la respuesta mas probable token por token. Deep Think cambia las reglas del juego. En lugar de responder instantaneamente, <strong>Gemini se toma tiempo para razonar</strong>, considerar multiples angulos, verificar su logica, y llegar a una respuesta mucho mas precisa.</p>

<h2>¿Que es Deep Think?</h2>
<p>Deep Think es un modo de razonamiento avanzado de Gemini que activa cadenas de pensamiento internas antes de darte una respuesta. Es como la diferencia entre responder un examen adivinando (rapido) vs sentarte a pensar cada respuesta (lento pero preciso).</p>

<p>Los numeros hablan por si solos: en el benchmark <strong>ARC-AGI-2</strong>, que mide razonamiento abstracto (el tipo de pensamiento que hasta ahora era exclusivo de humanos), Deep Think alcanzo un <strong>84.6%</strong> de precision. Para contexto, los humanos promedian alrededor del 96% y la version anterior de Gemini sin Deep Think estaba por debajo del 50%.</p>

<ul>
  <li><strong>Problemas matematicos complejos:</strong> Ecuaciones multivariable, optimizacion, probabilidad bayesiana.</li>
  <li><strong>Programacion avanzada:</strong> Algoritmos complejos, debugging de codigo, arquitectura de sistemas.</li>
  <li><strong>Analisis cientifico:</strong> Interpretacion de datos experimentales, diseno de estudios.</li>
  <li><strong>Estrategia de negocios:</strong> Analisis de escenarios complejos con multiples variables interdependientes.</li>
  <li><strong>Razonamiento logico:</strong> Acertijos, rompecabezas, problemas de logica formal.</li>
</ul>

<img src="PENDIENTE_IMG_deep_think_vs_normal.jpg" alt="Comparacion visual entre el modo normal de IA (respuesta rapida) y Deep Think (razonamiento profundo)" class="lesson-image" />

<h2>Agent Mode de Gemini: Think-Act-Observe</h2>
<p>Si Deep Think es el cerebro, Agent Mode es el cerebro + las manos + los ojos. El Agent Mode de Gemini usa un loop llamado <strong>Think-Act-Observe (TAO)</strong>:</p>

<ol>
  <li><strong>Think (Pensar):</strong> El agente analiza la tarea, la descompone en pasos, y planifica la estrategia.</li>
  <li><strong>Act (Actuar):</strong> Ejecuta el primer paso: busca en la web, ejecuta codigo, analiza un documento, genera una imagen.</li>
  <li><strong>Observe (Observar):</strong> Revisa el resultado de su accion. ¿Fue exitosa? ¿Obtuvo la informacion que necesitaba? ¿Hay errores?</li>
  <li><strong>Repetir:</strong> Basandose en lo que observo, piensa de nuevo, ajusta su plan, y actua otra vez. Este loop continua hasta completar la tarea.</li>
</ol>

<p>Este loop TAO es lo que hace que los agentes sean tan poderosos. No solo ejecutan un plan fijo; se <strong>adaptan en tiempo real</strong>. Si un sitio web no carga, buscan otra fuente. Si un calculo da error, revisan y corrigen. Es como un empleado que no se rinde al primer obstaculo.</p>

<h2>Agentic Vision: La IA que Ve y Actua</h2>
<p>Agentic Vision combina la multimodalidad de Gemini con el Agent Mode. Puedes pedirle que:</p>

<ul>
  <li><strong>Analice tu pantalla:</strong> Compartir tu pantalla y que Gemini te guie paso a paso. "Mira mi dashboard de Google Analytics y dime que campanas optimizar."</li>
  <li><strong>Navegue visualmente:</strong> El agente "ve" la pagina web como un humano y puede hacer clic en botones, llenar formularios, y navegar interfaces.</li>
  <li><strong>Procese documentos visualmente:</strong> Sube fotos de documentos fisicos, recibos, contratos, y Gemini los lee, extrae informacion, y actua sobre ella.</li>
</ul>

<h2>Aletheia: El Framework de Evaluacion</h2>
<p>Google desarrollo <strong>Aletheia</strong> como su framework interno para evaluar las capacidades agenticas de Gemini. Mide:</p>
<ul>
  <li><strong>Fidelidad:</strong> ¿El agente hace lo que le pediste y nada mas?</li>
  <li><strong>Completitud:</strong> ¿Completa TODOS los pasos de la tarea?</li>
  <li><strong>Eficiencia:</strong> ¿Lo hace en el menor numero de pasos posible?</li>
  <li><strong>Recuperacion de errores:</strong> ¿Se recupera cuando algo sale mal?</li>
</ul>

<p>Estos mismos criterios puedes usarlos para evaluar cualquier agente de IA que uses en tu trabajo.</p>

<img src="PENDIENTE_IMG_loop_tao_agente.jpg" alt="Diagrama circular del loop Think-Act-Observe de los agentes de Gemini" class="lesson-image" />

<h2>Deep Think + Agent Mode: Cuando Usarlos</h2>
<ul>
  <li><strong>Usa Deep Think cuando:</strong> Necesitas precision maxima en un problema complejo. La respuesta importa mas que la velocidad. Estas analizando datos criticos o tomando decisiones importantes.</li>
  <li><strong>Usa Agent Mode cuando:</strong> La tarea tiene multiples pasos. Necesitas buscar informacion y actuar sobre ella. Quieres automatizar un workflow completo.</li>
  <li><strong>Usa ambos cuando:</strong> Necesitas un agente que piense profundamente en cada paso antes de actuar. Ejemplo: "Investiga estas 3 empresas, analiza profundamente sus estados financieros, y recomiendame en cual invertir con un analisis detallado."</li>
</ul>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Activa Deep Think en Gemini Advanced (o usa la version gratuita con modo de razonamiento extendido). Dale este problema: "Un tren sale de la Ciudad A a las 8:00am a 120km/h. Otro tren sale de la Ciudad B (a 480km de distancia) a las 9:00am a 160km/h hacia la Ciudad A. ¿A que hora y en que punto se encuentran? Muestra tu razonamiento paso a paso." Compara con la respuesta de ChatGPT al mismo problema.</li>
    <li><strong>Ejercicio 2:</strong> Usa Agent Mode de Gemini: "Busca los precios actuales de las 3 laptops mas vendidas en Amazon Mexico. Compara: procesador, RAM, almacenamiento, bateria, y precio. Dame una recomendacion basada en mejor relacion calidad-precio." Observa el loop Think-Act-Observe en accion.</li>
    <li><strong>Ejercicio 3:</strong> Prueba la multimodalidad con razonamiento: sube una foto de un problema de un libro de texto (matematicas, fisica, o quimica) a Gemini y pidele que lo resuelva usando Deep Think. ¿Llega a la respuesta correcta?</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Necesitas agentes de IA con razonamiento profundo para tareas empresariales complejas? <a href="https://screatorsai.com">Sinsajo Creators</a> implementa soluciones con Gemini Agent Mode para analisis de datos, investigacion y automatizacion. Hablemos: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    1,
    50
  );

  -- Leccion 3.3
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod3_id,
    'NotebookLM',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_3_3">
    <p>Video: NotebookLM - Tu asistente de investigacion que genera podcasts automaticos</p>
  </div>
</div>

<h2>Tu Segundo Cerebro con IA</h2>
<p>NotebookLM es quizas la herramienta de Google mas subestimada y una de las mas utiles que vas a aprender en este curso. Es como tener un asistente de investigacion personal que lee TODOS tus documentos, los entiende profundamente, y puede responder cualquier pregunta sobre ellos <strong>con citas exactas</strong>.</p>

<p>¿Alguna vez has tenido que leer un reporte de 100 paginas para una reunion? ¿O estudiar un libro entero para un examen? ¿O analizar 20 documentos legales para encontrar una clausula especifica? NotebookLM hace todo eso en segundos.</p>

<h2>Como Funciona</h2>
<p>El flujo es brutalmente simple:</p>

<ol>
  <li><strong>Creas un "Notebook" (cuaderno):</strong> Ve a <a href="https://notebooklm.google.com">notebooklm.google.com</a> y crea un nuevo cuaderno.</li>
  <li><strong>Subes tus fuentes:</strong> Puedes subir hasta 50 fuentes por notebook. Los formatos soportados incluyen: PDFs, Google Docs, Google Slides, URLs de paginas web, archivos de texto, videos de YouTube (analiza el audio), y audio.</li>
  <li><strong>Preguntas lo que quieras:</strong> NotebookLM ha "leido" todas tus fuentes y puede responder preguntas, comparar documentos, encontrar contradicciones, resumir secciones, y citar fuentes exactas.</li>
</ol>

<p>La clave diferenciadora de NotebookLM es que <strong>SOLO responde basandose en tus documentos</strong>. No alucina informacion de su entrenamiento general. Si la respuesta no esta en tus fuentes, te dice "no encontre esa informacion en tus documentos." Esto lo hace infinitamente mas confiable para trabajo serio.</p>

<img src="PENDIENTE_IMG_notebooklm_interfaz.jpg" alt="Interfaz de NotebookLM mostrando el panel de fuentes a la izquierda y el chat a la derecha" class="lesson-image" />

<h2>La Funcion Estrella: Audio Overview (Podcast Automatico)</h2>
<p>Esta funcion se hizo viral y con razon. NotebookLM puede generar un <strong>podcast de audio automatico</strong> basado en tus documentos. Dos "hosts" de IA discuten el contenido de tus fuentes en un formato conversacional natural de 5-15 minutos. Es como si dos expertos leyeran tu material y luego grabaran un podcast discutiendolo.</p>

<p>¿Para que sirve?</p>
<ul>
  <li><strong>Estudiar:</strong> Sube tu libro de texto y genera un podcast. Escuchalo mientras caminas, manejas o haces ejercicio.</li>
  <li><strong>Preparar reuniones:</strong> Sube los documentos de la reunion y genera un audio resumen. Llegars preparado en 10 minutos.</li>
  <li><strong>Crear contenido:</strong> Genera un podcast sobre tu tema y usalo como base para tu propio contenido.</li>
  <li><strong>Capacitacion:</strong> Sube tu manual de operaciones y genera audio para que nuevos empleados aprendan escuchando.</li>
</ul>

<h2>Generacion de Otros Formatos</h2>
<p>Ademas del podcast, NotebookLM puede generar automaticamente:</p>
<ul>
  <li><strong>FAQ:</strong> Preguntas frecuentes basadas en tus documentos.</li>
  <li><strong>Guia de estudio:</strong> Material de repaso con preguntas y respuestas clave.</li>
  <li><strong>Timeline:</strong> Cronologia de eventos si tus documentos contienen informacion temporal.</li>
  <li><strong>Briefing document:</strong> Resumen ejecutivo de todas tus fuentes.</li>
  <li><strong>Tabla de contenidos:</strong> Estructura jerarquica de los temas cubiertos.</li>
</ul>

<h2>Casos de Uso Profesionales</h2>

<p><strong>Abogados:</strong> Sube un contrato de 80 paginas. Pregunta: "¿Que clausulas protegen al vendedor en caso de incumplimiento?" NotebookLM te da la respuesta con la clausula exacta y el numero de pagina.</p>

<p><strong>Estudiantes:</strong> Sube el libro completo del semestre, las notas de clase (Google Docs), y los slides del profesor. Pregunta cualquier cosa y estudia con un tutor que conoce TODO tu material.</p>

<p><strong>Investigadores:</strong> Sube 20 papers cientificos sobre un tema. Pregunta: "¿Cuales son las conclusiones contradictorias entre estos estudios?" NotebookLM compara y senala discrepancias.</p>

<p><strong>Empresarios:</strong> Sube reportes financieros, actas de reuniones, y planes estrategicos. Pregunta: "¿Estamos cumpliendo los objetivos del Q3? ¿Donde estamos retrasados?"</p>

<img src="PENDIENTE_IMG_notebooklm_audio_overview.jpg" alt="Vista de la funcion Audio Overview de NotebookLM generando un podcast automatico" class="lesson-image" />

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Ve a <a href="https://notebooklm.google.com">notebooklm.google.com</a> y crea tu primer notebook. Sube un PDF que tengas a mano (puede ser un manual, un articulo, un reporte). Hazle 5 preguntas especificas. Nota como cada respuesta viene con citas de tu documento.</li>
    <li><strong>Ejercicio 2:</strong> Genera un Audio Overview (podcast) de tu documento. Escuchalo completo. ¿Los hosts de IA capturan los puntos mas importantes? ¿Te ayuda a entender mejor el material?</li>
    <li><strong>Ejercicio 3:</strong> Sube 3 URLs de articulos sobre el mismo tema (copiar el link de noticias o blogs). Pidele a NotebookLM: "Compara los puntos de vista de estos 3 articulos. ¿En que coinciden? ¿En que difieren?" Genera una tabla comparativa.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres implementar NotebookLM como herramienta de knowledge management en tu empresa? <a href="https://screatorsai.com">Sinsajo Creators</a> configura sistemas de gestion del conocimiento con IA para equipos. Hablemos: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    2,
    40
  );

  -- Leccion 3.4
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod3_id,
    'AI Studio y Antigravity',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_3_4">
    <p>Video: Google AI Studio y Antigravity IDE - Prototipa y construye con IA sin ser programador</p>
  </div>
</div>

<h2>De Idea a Prototipo en Minutos</h2>
<p>Si eres desarrollador o quieres construir cosas con IA, esta leccion te va a volar la cabeza. Google AI Studio es la plataforma donde puedes experimentar directamente con los modelos de Gemini: probar prompts, ajustar parametros, crear prototipos, y luego llevarlos a produccion. Y <strong>Antigravity</strong> es el nuevo IDE agentico de Google que lleva esto al siguiente nivel.</p>

<p>Lo mejor de todo: <strong>AI Studio es GRATUITO</strong>. Si, gratis. Google te da acceso a Gemini Pro y Flash a traves de AI Studio sin cobrar un centavo (con limites generosos de uso). Es la forma mas barata de acceder a modelos de IA de primer nivel para construir aplicaciones.</p>

<h2>Google AI Studio: Tu Laboratorio de IA</h2>
<p>Ve a <a href="https://aistudio.google.com">aistudio.google.com</a> y encontraras tres modos principales:</p>

<ul>
  <li><strong>Chat:</strong> Interfaz de conversacion similar a Gemini, pero con controles de parametros avanzados. Puedes ajustar temperatura (creatividad), top-p (diversidad), y max tokens (longitud). Ideal para probar y refinar prompts.</li>
  <li><strong>Structured Prompt:</strong> Crea prompts con estructura definida: entrada, contexto, instrucciones del sistema, y ejemplos. Puedes crear templates reutilizables para tareas repetitivas.</li>
  <li><strong>Build Mode (Construir):</strong> Aqui es donde ocurre la magia. Puedes construir aplicaciones completas con IA de forma visual. Conecta componentes, define flujos, y despliega aplicaciones sin escribir una linea de codigo backend.</li>
</ul>

<img src="PENDIENTE_IMG_ai_studio_interfaz.jpg" alt="Interfaz de Google AI Studio mostrando los modos Chat, Structured Prompt y Build" class="lesson-image" />

<h2>Build Mode: Construye Apps con IA</h2>
<p>Build Mode transforma AI Studio de un playground de prompts a una plataforma de desarrollo de aplicaciones:</p>

<ul>
  <li><strong>Componentes visuales:</strong> Arrastra y suelta componentes de IA (generacion de texto, analisis de imagenes, busqueda) y conectalos visualmente.</li>
  <li><strong>Sin backend necesario:</strong> Google maneja toda la infraestructura. Tu solo defines que quieres que la app haga.</li>
  <li><strong>Deploy con un clic:</strong> Publica tu app y obtiene una URL que puedes compartir o integrar en tu sitio web.</li>
  <li><strong>API Key automatica:</strong> Genera API keys para conectar tu app con otros servicios.</li>
</ul>

<p>Ejemplos de lo que puedes construir en Build Mode:</p>
<ul>
  <li>Un chatbot de soporte al cliente entrenado con tus FAQs.</li>
  <li>Un clasificador de emails que organiza tu inbox por prioridad.</li>
  <li>Un generador de descripciones de productos a partir de fotos.</li>
  <li>Un asistente de escritura con tu tono de voz personalizado.</li>
</ul>

<h2>Antigravity: El IDE Agentico de Google</h2>
<p>Antigravity es el IDE (Integrated Development Environment) agentico de Google. Si Claude tiene Claude Code y Cursor tiene su editor, Google tiene Antigravity. Y su enfoque es unico: <strong>construir aplicaciones web completas usando IA como co-piloto</strong>.</p>

<p>¿Que hace Antigravity diferente?</p>

<ul>
  <li><strong>Editor visual + codigo:</strong> Puedes trabajar visualmente o en codigo, y el agente entiende ambos. Dibujas un componente y Antigravity genera el codigo. Escribes codigo y ves el resultado visual en tiempo real.</li>
  <li><strong>Gemini integrado:</strong> El agente de Antigravity usa Gemini 3 como cerebro. Puedes pedirle: "Agrega un formulario de contacto con validacion en esta pagina" y lo hace, escribiendo el codigo HTML, CSS y JavaScript necesario.</li>
  <li><strong>Deploy instantaneo:</strong> Publica tu aplicacion en Firebase Hosting con un clic. Tu app esta en produccion en segundos.</li>
  <li><strong>Prototipado ultrarapido:</strong> Ideal para hackathons, MVPs, y pruebas de concepto. Lo que antes tomaba dias, lo haces en horas.</li>
</ul>

<img src="PENDIENTE_IMG_antigravity_ide.jpg" alt="Vista del IDE Antigravity de Google con el panel de codigo, vista previa y el agente de IA" class="lesson-image" />

<h2>¿Cuando Usar Cada Herramienta?</h2>
<ul>
  <li><strong>AI Studio Chat:</strong> Cuando quieres probar y refinar prompts rapidamente.</li>
  <li><strong>AI Studio Build Mode:</strong> Cuando quieres crear una app simple de IA sin programar.</li>
  <li><strong>Antigravity:</strong> Cuando quieres construir una aplicacion web completa con IA como asistente de desarrollo.</li>
  <li><strong>Gemini (gemini.google.com):</strong> Cuando quieres conversar, analizar documentos, o hacer tareas cotidianas con IA.</li>
</ul>

<h2>API de Gemini: Para Desarrolladores</h2>
<p>Si eres desarrollador (o quieres serlo), la API de Gemini te permite integrar IA en cualquier aplicacion:</p>

<ul>
  <li><strong>Pricing:</strong> Gemini Flash es practicamente gratuito (15 RPM gratis, luego $0.075/1M tokens). Gemini Pro es $1.25/1M tokens. Los precios mas competitivos del mercado.</li>
  <li><strong>SDK:</strong> Disponible para Python, JavaScript, Go, Dart, y Swift.</li>
  <li><strong>Contexto:</strong> Ventana de hasta 2 millones de tokens. Puedes enviar documentos enteros, codebases completos, o horas de audio en una sola llamada.</li>
  <li><strong>Multimodal nativo:</strong> Envia texto, imagenes, audio y video en la misma llamada API.</li>
</ul>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Ve a <a href="https://aistudio.google.com">aistudio.google.com</a>. Crea un "Structured Prompt" para una tarea de tu trabajo. Por ejemplo: Input = "descripcion de producto", System instruction = "Eres un copywriter experto", Output = "3 variaciones de copy para redes sociales". Prueba con 3 productos diferentes.</li>
    <li><strong>Ejercicio 2:</strong> Experimenta con los parametros. Toma el mismo prompt y prueba con temperatura 0.2 (conservador), 0.7 (balanceado) y 1.2 (creativo). Observa como cambian las respuestas. ¿Cual prefieres para tu caso de uso?</li>
    <li><strong>Ejercicio 3:</strong> Si tienes conocimientos basicos de programacion, obtiene una API key gratuita de AI Studio y haz una llamada simple a la API de Gemini. Si no sabes programar, usa Build Mode para crear una mini-app que tome un texto y genere un resumen en 3 puntos.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres construir aplicaciones con IA usando Google AI Studio o Antigravity? <a href="https://screatorsai.com">Sinsajo Creators</a> desarrolla MVPs y prototipos con IA en tiempo record. Desde la idea hasta el deploy: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    3,
    40
  );

  RAISE NOTICE 'Seed completado: Curso "Domina la IA" con 3 modulos y 13 lecciones insertados exitosamente.';

END $$;

COMMIT;
