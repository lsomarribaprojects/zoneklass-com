-- ============================================================
-- SEED: IA para Marketing y Negocios - Parte 4 (Modulos 8-9)
-- Agentes IA + Plan de Acción Final
-- ============================================================

BEGIN;

DO $$
DECLARE
  v_course_id uuid;
  v_module_id uuid;
BEGIN

  -- Obtener el ID del curso
  SELECT id INTO v_course_id
  FROM public.courses
  WHERE slug = 'ia-para-marketing-y-negocios';

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'Curso "ia-para-marketing-y-negocios" no encontrado.';
  END IF;

  -- ============================================================
  -- MODULO 8: Agentes IA: Tu Equipo Digital 24/7
  -- ============================================================
  SELECT id INTO v_module_id
  FROM public.modules
  WHERE course_id = v_course_id AND order_index = 8;

  IF v_module_id IS NULL THEN
    RAISE EXCEPTION 'Modulo 8 no encontrado.';
  END IF;

  -- Eliminar lecciones existentes del módulo 8 (idempotencia)
  DELETE FROM public.lessons WHERE module_id = v_module_id;

  -- Lección 8.0
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    '¿Qué es un Agente IA y Por Qué es el Futuro?',
    'What is an AI Agent and Why is It the Future?',
    '<h2>Agentes IA: Más Allá de los Chatbots</h2>
<p>Un <strong>agente de IA</strong> es un asistente inteligente que no solo responde preguntas — <em>toma decisiones y ejecuta tareas de forma autónoma</em>. Es la diferencia entre tener un empleado que te pregunta qué hacer en cada paso (chatbot) versus uno que entiende el objetivo, decide cómo lograrlo, y lo ejecuta sin supervisión constante (agente).</p>

<h3>La Jerarquía de la IA: Chatbot → Copiloto → Agente</h3>
<p>Para entender qué hace especial a los agentes, veamos las tres generaciones de IA:</p>

<ul>
  <li><strong>Chatbot (Generación 1):</strong> Responde preguntas. Ejemplo: "¿Qué es SEO?" → Te da una explicación. <em>Rol pasivo.</em></li>
  <li><strong>Copiloto (Generación 2):</strong> Sugiere acciones. Ejemplo: "Mejora este texto de SEO" → Te propone cambios, pero TÚ los aplicas. <em>Rol consultivo.</em></li>
  <li><strong>Agente (Generación 3):</strong> Ejecuta tareas completas. Ejemplo: "Optimiza mi blog para SEO" → Analiza tu sitio, identifica problemas, reescribe títulos/descripciones, actualiza metadatos, genera informe. <em>Rol ejecutivo.</em></li>
</ul>

<p>Los agentes son la frontera actual de la IA. En 2026, ya están transformando cómo trabajamos.</p>

<h3>Ejemplos Reales de Agentes IA en Acción</h3>
<p>Para que veas el potencial, aquí tres casos concretos que puedes implementar HOY:</p>

<h4>Agente de Atención al Cliente 24/7</h4>
<p>Un agente conectado a tu base de conocimientos (FAQs, manuales, políticas) que responde consultas de clientes a las 3 AM. No solo envía respuestas predefinidas: <em>entiende la pregunta, busca en tu documentación, redacta una respuesta personalizada con el tono de tu marca, y la envía</em>. Si la consulta es compleja (ej: un reclamo), la escala a un humano con un resumen del caso.</p>

<h4>Agente de Social Media Manager</h4>
<p>Un agente que publica contenido según tu calendario editorial. Tú defines las pautas una vez (tono, temas, frecuencia, hashtags). El agente genera posts adaptados a cada plataforma (Instagram: visual + caption corto; LinkedIn: texto largo + profesional; Twitter: hilos), programa publicación, y te notifica cuando algo necesita aprobación humana (ej: temas sensibles).</p>

<h4>Agente de Generación de Leads</h4>
<p>Un agente que recibe formularios de contacto, califica automáticamente al lead (frío/tibio/caliente según criterios que tú defines), envía email personalizado según la temperatura, registra en tu CRM, y solo notifica a tu equipo de ventas los leads calientes. Los fríos entran a una secuencia de nurturing automática.</p>

<h3>Por Qué los Agentes IA Son el Futuro del Trabajo</h3>
<p>Según Gartner, <strong>para 2027, más del 65% de negocios pequeños usarán al menos un agente de IA</strong> para automatizar procesos críticos. ¿Por qué? Porque los agentes:</p>

<ul>
  <li><strong>No duermen:</strong> Trabajan 24/7 sin vacaciones, sin errores por cansancio</li>
  <li><strong>Escalan sin costo proporcional:</strong> Atender 10 o 1,000 consultas cuesta lo mismo</li>
  <li><strong>Aprenden continuamente:</strong> Mejoran con cada interacción, sin capacitación formal</li>
  <li><strong>Liberan tiempo humano:</strong> Tu equipo (o tú) se enfoca en estrategia, relaciones, creatividad</li>
</ul>

<h3>Sinsajo Creators: Especialistas en Agentes IA</h3>
<p>En Sinsajo Creators, nuestra especialidad es <strong>construir equipos digitales de agentes IA personalizados</strong> para emprendedoras y negocios pequeños. No vendemos software genérico: diseñamos agentes que entienden TU negocio, hablan con TU voz, y ejecutan TUS procesos. En las próximas lecciones aprenderás a crear tus primeros agentes básicos, y al final del curso sabrás exactamente qué tipo de equipo digital necesitas.</p>

<h3>Ejercicio Práctico: Imagina Tu Equipo Digital</h3>
<p>Responde estas preguntas en tu cuaderno:</p>
<ol>
  <li>Si pudieras tener 3 asistentes que trabajen 24/7 sin sueldo, ¿qué tareas les asignarías?</li>
  <li>¿Cuál de esas 3 tareas te consume MÁS horas semanales?</li>
  <li>¿Cuál genera MÁS valor para tu negocio cuando se hace bien?</li>
</ol>
<p>Esas son tus primeros 3 agentes. Las próximas lecciones te enseñarán a construirlos.</p>',
    '<h2>AI Agents: Beyond Chatbots</h2>
<p>An <strong>AI agent</strong> is an intelligent assistant that doesn''t just answer questions — <em>it makes decisions and executes tasks autonomously</em>. It''s the difference between having an employee who asks you what to do at each step (chatbot) versus one who understands the goal, decides how to achieve it, and executes without constant supervision (agent).</p>

<h3>The AI Hierarchy: Chatbot → Copilot → Agent</h3>
<p>To understand what makes agents special, let''s look at the three generations of AI:</p>

<ul>
  <li><strong>Chatbot (Generation 1):</strong> Answers questions. Example: "What is SEO?" → Gives you an explanation. <em>Passive role.</em></li>
  <li><strong>Copilot (Generation 2):</strong> Suggests actions. Example: "Improve this SEO text" → Proposes changes, but YOU apply them. <em>Advisory role.</em></li>
  <li><strong>Agent (Generation 3):</strong> Executes complete tasks. Example: "Optimize my blog for SEO" → Analyzes your site, identifies problems, rewrites titles/descriptions, updates metadata, generates report. <em>Executive role.</em></li>
</ul>

<p>Agents are AI''s current frontier. In 2026, they''re already transforming how we work.</p>

<h3>Real Examples of AI Agents in Action</h3>
<p>To show you the potential, here are three concrete cases you can implement TODAY:</p>

<h4>24/7 Customer Service Agent</h4>
<p>An agent connected to your knowledge base (FAQs, manuals, policies) that answers customer queries at 3 AM. It doesn''t just send predefined responses: <em>it understands the question, searches your documentation, drafts a personalized response with your brand''s tone, and sends it</em>. If the query is complex (e.g., a complaint), it escalates to a human with a case summary.</p>

<h4>Social Media Manager Agent</h4>
<p>An agent that posts content according to your editorial calendar. You define guidelines once (tone, topics, frequency, hashtags). The agent generates posts adapted to each platform (Instagram: visual + short caption; LinkedIn: long text + professional; Twitter: threads), schedules publication, and notifies you when something needs human approval (e.g., sensitive topics).</p>

<h4>Lead Generation Agent</h4>
<p>An agent that receives contact forms, automatically qualifies the lead (cold/warm/hot according to criteria you define), sends personalized email according to temperature, registers in your CRM, and only notifies your sales team of hot leads. Cold ones enter an automatic nurturing sequence.</p>

<h3>Why AI Agents Are the Future of Work</h3>
<p>According to Gartner, <strong>by 2027, more than 65% of small businesses will use at least one AI agent</strong> to automate critical processes. Why? Because agents:</p>

<ul>
  <li><strong>Never sleep:</strong> Work 24/7 without vacations, no errors from fatigue</li>
  <li><strong>Scale without proportional cost:</strong> Serving 10 or 1,000 queries costs the same</li>
  <li><strong>Learn continuously:</strong> Improve with each interaction, no formal training</li>
  <li><strong>Free human time:</strong> Your team (or you) focuses on strategy, relationships, creativity</li>
</ul>

<h3>Sinsajo Creators: AI Agent Specialists</h3>
<p>At Sinsajo Creators, our specialty is <strong>building customized AI agent digital teams</strong> for entrepreneurs and small businesses. We don''t sell generic software: we design agents that understand YOUR business, speak with YOUR voice, and execute YOUR processes. In upcoming lessons you''ll learn to create your first basic agents, and by course end you''ll know exactly what type of digital team you need.</p>

<h3>Practical Exercise: Imagine Your Digital Team</h3>
<p>Answer these questions in your notebook:</p>
<ol>
  <li>If you could have 3 assistants working 24/7 without salary, what tasks would you assign them?</li>
  <li>Which of those 3 tasks consumes MOST hours weekly?</li>
  <li>Which generates MOST value for your business when done well?</li>
</ol>
<p>Those are your first 3 agents. The next lessons will teach you how to build them.</p>',
    0,
    20
  );

  -- Lección 8.1
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Gems como Agentes: Tu Equipo de Especialistas',
    'Gems as Agents: Your Specialist Team',
    '<h2>Gems: La Forma Más Accesible de Crear Agentes IA</h2>
<p><strong>Gems de Gemini</strong> son mini-agentes personalizados que puedes crear en 2 minutos, sin programación. Piensa en ellos como empleados especializados: cada Gem tiene un rol, personalidad, y conjunto de instrucciones específicas. Tú creas un equipo de Gems, cada uno experto en una tarea, y los consultas cuando los necesitas.</p>

<h3>Cómo Crear un Gem: Paso a Paso</h3>
<ol>
  <li>Ve a gemini.google.com/gems (necesitas cuenta de Google)</li>
  <li>Haz clic en "Create Gem"</li>
  <li>Define su rol: "Eres un experto en [área]"</li>
  <li>Detalla su personalidad: "Respondes de forma [tono]"</li>
  <li>Especifica sus reglas: "Siempre incluyes [elemento]", "Nunca uses [cosa]"</li>
  <li>Prueba con un prompt real</li>
  <li>Guarda y comparte (puedes compartir Gems con tu equipo)</li>
</ol>

<h3>Tu Equipo de 5 Gems Esenciales para Marketing</h3>
<p>Aquí las configuraciones exactas de los 5 Gems que toda emprendedora digital debería tener:</p>

<h4>1. Gem "Estratega de Marketing"</h4>
<p><strong>Rol:</strong> "Eres una estratega de marketing digital con 10 años de experiencia en negocios pequeños. Analizas mercados, audiencias y competencia para sugerir estrategias accionables."</p>
<p><strong>Tono:</strong> "Profesional pero cercano. Explicas conceptos complejos de forma simple. Siempre incluyes datos y ejemplos reales."</p>
<p><strong>Reglas:</strong></p>
<ul>
  <li>Siempre pregunta sobre el público objetivo antes de sugerir estrategias</li>
  <li>Incluye al menos 3 opciones: una conservadora, una balanceada, una audaz</li>
  <li>Menciona costos aproximados y tiempo de ejecución</li>
  <li>Nunca sugieras tácticas sin explicar el "por qué"</li>
</ul>
<p><strong>Ejemplo de uso:</strong> "Vendo cursos online de repostería para principiantes. ¿Cómo puedo conseguir 100 clientes en 3 meses con presupuesto de $200?"</p>

<h4>2. Gem "Community Manager"</h4>
<p><strong>Rol:</strong> "Eres la Community Manager de [tu marca]. Conoces a la perfección el tono, valores, y audiencia de la marca. Generas contenido para redes sociales que conecta emocionalmente."</p>
<p><strong>Tono:</strong> "[Define el tono de TU marca: inspirador/educativo/divertido/profesional]"</p>
<p><strong>Reglas:</strong></p>
<ul>
  <li>Todos los posts incluyen call-to-action claro</li>
  <li>Adaptas el formato a cada red: Instagram (visual + caption), LinkedIn (valor profesional), Twitter (conversacional)</li>
  <li>Siempre sugieres 3 variaciones de cada idea</li>
  <li>Incluyes hashtags relevantes (máximo 5)</li>
</ul>
<p><strong>Ejemplo de uso:</strong> "Crea 5 posts para Instagram sobre los beneficios de mi curso de repostería, enfocados en madres que quieren emprender desde casa."</p>

<h4>3. Gem "Copywriter de Ventas"</h4>
<p><strong>Rol:</strong> "Eres un copywriter especializado en textos persuasivos para embudos de venta. Conoces las fórmulas AIDA, PAS, y FAB. Escribes textos que convierten sin sonar agresivos."</p>
<p><strong>Tono:</strong> "Persuasivo pero auténtico. Emocional pero respaldado por lógica. Creas urgencia sin manipular."</p>
<p><strong>Reglas:</strong></p>
<ul>
  <li>Todo texto incluye: problema, solución, prueba social, oferta, urgencia, garantía</li>
  <li>Usas storytelling cuando es apropiado</li>
  <li>Siempre propones 2 versiones: una corta (para anuncios) y una larga (para landing pages)</li>
  <li>Nunca prometes resultados irrealistas</li>
</ul>
<p><strong>Ejemplo de uso:</strong> "Escribe el copy para mi landing page del curso de repostería. Precio: $97. Incluye 20 recetas + certificado + grupo de soporte."</p>

<h4>4. Gem "Analista de Datos"</h4>
<p><strong>Rol:</strong> "Eres un analista de datos que interpreta métricas de marketing y las traduce a recomendaciones accionables. Trabajas con Google Analytics, Meta Ads, Instagram Insights."</p>
<p><strong>Tono:</strong> "Claro y directo. Explicas qué significan los números y qué hacer con ellos. Evitas jerga técnica innecesaria."</p>
<p><strong>Reglas:</strong></p>
<ul>
  <li>Siempre pides contexto: ¿cuál es el objetivo? ¿qué período comparar?</li>
  <li>Identificas las 3 métricas más importantes para cada objetivo</li>
  <li>Señalas tanto éxitos como áreas de mejora</li>
  <li>Sugieres A/B tests específicos para optimizar</li>
</ul>
<p><strong>Ejemplo de uso:</strong> "Mis últimas 10 publicaciones de Instagram tuvieron 500 alcance promedio pero solo 15 clics al link. ¿Qué estoy haciendo mal?"</p>

<h4>5. Gem "Servicio al Cliente"</h4>
<p><strong>Rol:</strong> "Eres el representante de servicio al cliente de [tu marca]. Manejas consultas, quejas y dudas con empatía y profesionalismo. Tu objetivo es resolver problemas y dejar al cliente satisfecho."</p>
<p><strong>Tono:</strong> "Cálido, empático, paciente. Siempre agradeces al cliente. Nunca te pones a la defensiva. Buscas soluciones win-win."</p>
<p><strong>Reglas:</strong></p>
<ul>
  <li>Siempre reconoces la emoción del cliente antes de dar soluciones</li>
  <li>Ofreces al menos 2 opciones de solución cuando es posible</li>
  <li>Si no puedes resolver algo, explicas por qué y ofreces alternativa</li>
  <li>Terminas preguntando si hay algo más en lo que puedas ayudar</li>
</ul>
<p><strong>Ejemplo de uso:</strong> "Un cliente dice que mi curso no cumplió sus expectativas. Quiere reembolso. ¿Cómo respondo?"</p>

<h3>Ejercicio Práctico: Crea Tu Equipo de Gems</h3>
<ol>
  <li>Ve a gemini.google.com/gems</li>
  <li>Crea los 5 Gems usando las configuraciones de arriba (personaliza con TU marca)</li>
  <li>Prueba cada Gem con 2-3 consultas reales de tu negocio</li>
  <li>Comparte tus Gems con tu equipo si tienes uno</li>
  <li>Durante esta semana, usa tus Gems para al menos 5 tareas que normalmente te tomarían horas</li>
</ol>

<p>Al final de la semana, documenta cuánto tiempo ahorraste. La mayoría de nuestras alumnas reportan ahorrar 6-10 horas semanales solo con estos 5 Gems.</p>',
    '<h2>Gems: The Most Accessible Way to Create AI Agents</h2>
<p><strong>Gemini Gems</strong> are mini customized agents you can create in 2 minutes, without programming. Think of them as specialized employees: each Gem has a role, personality, and specific set of instructions. You create a team of Gems, each expert in one task, and consult them when needed.</p>

<h3>How to Create a Gem: Step by Step</h3>
<ol>
  <li>Go to gemini.google.com/gems (you need a Google account)</li>
  <li>Click "Create Gem"</li>
  <li>Define its role: "You are an expert in [area]"</li>
  <li>Detail its personality: "You respond in a [tone] manner"</li>
  <li>Specify its rules: "Always include [element]", "Never use [thing]"</li>
  <li>Test with a real prompt</li>
  <li>Save and share (you can share Gems with your team)</li>
</ol>

<h3>Your Team of 5 Essential Marketing Gems</h3>
<p>Here are the exact configurations of the 5 Gems every digital entrepreneur should have:</p>

<h4>1. "Marketing Strategist" Gem</h4>
<p><strong>Role:</strong> "You are a digital marketing strategist with 10 years of experience in small businesses. You analyze markets, audiences and competition to suggest actionable strategies."</p>
<p><strong>Tone:</strong> "Professional but approachable. You explain complex concepts simply. Always include data and real examples."</p>
<p><strong>Rules:</strong></p>
<ul>
  <li>Always ask about target audience before suggesting strategies</li>
  <li>Include at least 3 options: one conservative, one balanced, one bold</li>
  <li>Mention approximate costs and execution time</li>
  <li>Never suggest tactics without explaining the "why"</li>
</ul>
<p><strong>Usage example:</strong> "I sell online baking courses for beginners. How can I get 100 customers in 3 months with a $200 budget?"</p>

<h4>2. "Community Manager" Gem</h4>
<p><strong>Role:</strong> "You are the Community Manager of [your brand]. You know perfectly the brand''s tone, values, and audience. You generate social media content that connects emotionally."</p>
<p><strong>Tone:</strong> "[Define YOUR brand''s tone: inspiring/educational/fun/professional]"</p>
<p><strong>Rules:</strong></p>
<ul>
  <li>All posts include clear call-to-action</li>
  <li>Adapt format to each network: Instagram (visual + caption), LinkedIn (professional value), Twitter (conversational)</li>
  <li>Always suggest 3 variations of each idea</li>
  <li>Include relevant hashtags (maximum 5)</li>
</ul>
<p><strong>Usage example:</strong> "Create 5 Instagram posts about my baking course benefits, focused on mothers wanting to start businesses from home."</p>

<h4>3. "Sales Copywriter" Gem</h4>
<p><strong>Role:</strong> "You are a copywriter specialized in persuasive texts for sales funnels. You know AIDA, PAS, and FAB formulas. You write texts that convert without sounding aggressive."</p>
<p><strong>Tone:</strong> "Persuasive but authentic. Emotional but backed by logic. Create urgency without manipulation."</p>
<p><strong>Rules:</strong></p>
<ul>
  <li>Every text includes: problem, solution, social proof, offer, urgency, guarantee</li>
  <li>Use storytelling when appropriate</li>
  <li>Always propose 2 versions: short (for ads) and long (for landing pages)</li>
  <li>Never promise unrealistic results</li>
</ul>
<p><strong>Usage example:</strong> "Write copy for my baking course landing page. Price: $97. Includes 20 recipes + certificate + support group."</p>

<h4>4. "Data Analyst" Gem</h4>
<p><strong>Role:</strong> "You are a data analyst who interprets marketing metrics and translates them into actionable recommendations. You work with Google Analytics, Meta Ads, Instagram Insights."</p>
<p><strong>Tone:</strong> "Clear and direct. You explain what numbers mean and what to do with them. Avoid unnecessary technical jargon."</p>
<p><strong>Rules:</strong></p>
<ul>
  <li>Always ask for context: what''s the goal? what period to compare?</li>
  <li>Identify the 3 most important metrics for each goal</li>
  <li>Point out both successes and areas for improvement</li>
  <li>Suggest specific A/B tests to optimize</li>
</ul>
<p><strong>Usage example:</strong> "My last 10 Instagram posts had 500 average reach but only 15 link clicks. What am I doing wrong?"</p>

<h4>5. "Customer Service" Gem</h4>
<p><strong>Role:</strong> "You are the customer service representative of [your brand]. You handle inquiries, complaints and questions with empathy and professionalism. Your goal is to solve problems and leave customers satisfied."</p>
<p><strong>Tone:</strong> "Warm, empathetic, patient. Always thank the customer. Never get defensive. Seek win-win solutions."</p>
<p><strong>Rules:</strong></p>
<ul>
  <li>Always acknowledge customer''s emotion before giving solutions</li>
  <li>Offer at least 2 solution options when possible</li>
  <li>If you can''t solve something, explain why and offer alternative</li>
  <li>End by asking if there''s anything else you can help with</li>
</ul>
<p><strong>Usage example:</strong> "A customer says my course didn''t meet their expectations. Wants refund. How do I respond?"</p>

<h3>Practical Exercise: Create Your Gem Team</h3>
<ol>
  <li>Go to gemini.google.com/gems</li>
  <li>Create the 5 Gems using configurations above (customize with YOUR brand)</li>
  <li>Test each Gem with 2-3 real queries from your business</li>
  <li>Share your Gems with your team if you have one</li>
  <li>During this week, use your Gems for at least 5 tasks that would normally take you hours</li>
</ol>

<p>At week''s end, document how much time you saved. Most of our students report saving 6-10 hours weekly with just these 5 Gems.</p>',
    1,
    25
  );

  -- Lección 8.2
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Zapier Agents: Agentes que Trabajan Mientras Duermes',
    'Zapier Agents: Agents that Work While You Sleep',
    '<h2>Zapier Agents: Automatización Inteligente con Toma de Decisiones</h2>
<p><strong>Zapier Agents</strong> van más allá de la automatización simple tipo "si pasa esto, haz aquello". Son agentes que <em>usan IA para tomar decisiones contextuales, adaptarse a situaciones variables, y ejecutar flujos de trabajo complejos sin intervención humana</em>. Es como tener un asistente ejecutivo que entiende tus prioridades y actúa en consecuencia.</p>

<h3>Diferencia: Automatización Tradicional vs Agente IA</h3>
<p>Para entender el salto de Zaps (automatizaciones) a Agents (agentes), veamos un ejemplo:</p>

<h4>Zap Tradicional: Email de Bienvenida</h4>
<p><strong>Flujo fijo:</strong> Nuevo suscriptor en Mailchimp → Envía email de bienvenida predefinido</p>
<p><strong>Problema:</strong> Todos reciben el mismo email, sin importar cómo llegaron o qué les interesa</p>

<h4>Zapier Agent: Email de Bienvenida Inteligente</h4>
<p><strong>Flujo adaptativo:</strong> Nuevo suscriptor → Agente analiza:</p>
<ul>
  <li>¿De qué fuente viene? (blog, anuncio, webinar, etc.)</li>
  <li>¿Qué página visitó antes de suscribirse?</li>
  <li>¿Qué hora es en su zona horaria?</li>
  <li>¿Hay datos demográficos en el formulario?</li>
</ul>
<p><strong>Entonces decide:</strong></p>
<ul>
  <li>Personaliza el email mencionando la fuente</li>
  <li>Sugiere contenido relacionado a la página que visitó</li>
  <li>Programa envío en horario óptimo (no a las 3 AM)</li>
  <li>Adapta tono según el segmento (B2B formal vs B2C casual)</li>
</ul>

<p>Este nivel de inteligencia es lo que diferencia un agente de una automatización tradicional.</p>

<h3>Caso Real: Agente de Social Media Multiplataforma</h3>
<p>Uno de los agentes más potentes que puedes crear con Zapier es un Social Media Manager completo. Aquí el flujo paso a paso:</p>

<h4>Configuración del Agente</h4>
<p><strong>Input inicial (tú lo defines una vez):</strong></p>
<ul>
  <li>Guía de marca (tono, valores, palabras prohibidas)</li>
  <li>Calendario editorial (temas por semana/mes)</li>
  <li>Reglas por plataforma (Instagram: 1 post/día; LinkedIn: 3/semana; Twitter: 5/semana)</li>
  <li>Ejemplos de posts exitosos pasados</li>
</ul>

<h4>Ejecución Autónoma del Agente</h4>
<ol>
  <li><strong>Monitoreo de tendencias:</strong> El agente revisa diariamente Google Trends, Twitter Trends, y noticias de tu industria</li>
  <li><strong>Generación de ideas:</strong> Cruza tendencias con tu calendario editorial y propone 10 ideas de contenido relevantes</li>
  <li><strong>Creación de contenido:</strong> Para cada idea, genera:
    <ul>
      <li>Texto adaptado a cada plataforma</li>
      <li>Sugerencia de imagen (descripción para Nano Banana)</li>
      <li>Hashtags relevantes (verifica que no estén baneados)</li>
      <li>Mejor horario de publicación según analytics históricos</li>
    </ul>
  </li>
  <li><strong>Revisión de calidad:</strong> El agente evalúa cada post con criterios:
    <ul>
      <li>¿Alineado con guía de marca?</li>
      <li>¿Call-to-action claro?</li>
      <li>¿Tono apropiado para la plataforma?</li>
      <li>¿Evita temas sensibles/controversiales?</li>
    </ul>
  </li>
  <li><strong>Decisión de aprobación:</strong>
    <ul>
      <li>Posts que pasan todos los criterios → Programa automáticamente</li>
      <li>Posts con tema sensible → Envía a tu email para aprobación manual</li>
      <li>Posts que fallan criterios → Descarta y genera alternativa</li>
    </ul>
  </li>
  <li><strong>Publicación y monitoreo:</strong> Publica en horario óptimo, monitorea primeras 2 horas de engagement, y te notifica si algún post tiene engagement anormalmente alto (para que lo amplifies con ads) o bajo (para que ajustes estrategia)</li>
</ol>

<p>Este agente puede gestionar tu presencia en 3-4 redes sociales de forma completamente autónoma, generando entre 15-30 posts por semana sin que toques nada.</p>

<h3>Caso Real 2: Agente de Gestión de Leads</h3>
<p>Este agente transforma cómo manejas leads desde el primer contacto hasta la venta:</p>

<h4>Flujo del Agente</h4>
<ol>
  <li><strong>Captura:</strong> Contacto llega (formulario web, Instagram DM, email, WhatsApp)</li>
  <li><strong>Calificación automática:</strong> Agente analiza:
    <ul>
      <li>Presupuesto mencionado</li>
      <li>Urgencia (¿cuándo necesita el servicio?)</li>
      <li>Fit (¿su necesidad coincide con tu oferta?)</li>
      <li>Historial (¿es contacto repetido?)</li>
    </ul>
  </li>
  <li><strong>Clasificación:</strong>
    <ul>
      <li><strong>Lead caliente</strong> (presupuesto + urgencia + fit) → Notificación inmediata a WhatsApp de ventas + Email de seguimiento en 30 min</li>
      <li><strong>Lead tibio</strong> (2 de 3 criterios) → Email educativo + Agendar llamada en 2-3 días + Registro en CRM con alerta</li>
      <li><strong>Lead frío</strong> (1 o menos) → Secuencia de nurturing automática de 6 emails en 2 semanas + Agregar a newsletter</li>
    </ul>
  </li>
  <li><strong>Personalización:</strong> Todos los emails son generados por IA con:
    <ul>
      <li>Nombre del lead</li>
      <li>Mención específica de su consulta</li>
      <li>Contenido relevante a su industria/necesidad</li>
      <li>Tono apropiado a su temperatura (urgente con calientes, educativo con fríos)</li>
    </ul>
  </li>
  <li><strong>Seguimiento inteligente:</strong>
    <ul>
      <li>Si lead abre email pero no responde → Envía recordatorio en 3 días</li>
      <li>Si lead hace clic en link de pricing → Escala a "caliente" y notifica ventas</li>
      <li>Si lead no abre 3 emails seguidos → Pausa secuencia y marca como "inactivo"</li>
    </ul>
  </li>
</ol>

<p>Empresas que implementan este agente reportan 3x más conversión de leads porque <em>ningún contacto se queda sin respuesta</em> y cada uno recibe comunicación personalizada al nivel exacto de interés que muestra.</p>

<h3>Cómo Construir Tu Primer Zapier Agent</h3>
<p>Zapier Agents están en fase beta (2026) pero ya puedes acceder si tienes cuenta Pro ($49/mes) o superior. Aquí el proceso:</p>

<ol>
  <li>Ve a zapier.com/agents</li>
  <li>Selecciona template o crea desde cero</li>
  <li>Define el "brain" del agente:
    <ul>
      <li>Objetivo: ¿Qué debe lograr?</li>
      <li>Reglas: ¿Qué puede/no puede hacer?</li>
      <li>Contexto: Guías de marca, ejemplos, restricciones</li>
    </ul>
  </li>
  <li>Conecta apps: Gmail, Slack, CRM, redes sociales, etc.</li>
  <li>Configura triggers: ¿Qué eventos inician al agente?</li>
  <li>Define decisiones: ¿Qué variables evalúa para decidir acciones?</li>
  <li>Prueba con casos reales de test</li>
  <li>Activa y monitorea primeros 7 días</li>
</ol>

<h3>Ejercicio Práctico: Diseña Tu Agente de Marketing</h3>
<p>En tu cuaderno, diseña el flujo completo de un agente que automatice tu tarea más pesada de marketing:</p>
<ol>
  <li><strong>Nombre del agente:</strong> [Ej: "Agente de Contenido Instagram"]</li>
  <li><strong>Objetivo:</strong> [Ej: "Publicar 5 posts/semana en Instagram alineados con mi marca"]</li>
  <li><strong>Inputs que recibe:</strong> [Ej: Calendario editorial, guía de marca, analytics históricos]</li>
  <li><strong>Decisiones que toma:</strong> [Ej: Qué temas cubrir, cuándo publicar, qué hashtags usar]</li>
  <li><strong>Acciones que ejecuta:</strong> [Ej: Generar texto, sugerir imagen, programar post, monitorear engagement]</li>
  <li><strong>Cuándo escala a humano:</strong> [Ej: Temas controversiales, engagement anormal, comentarios negativos]</li>
</ol>

<p>Este diseño es tu blueprint. Cuando estés lista para implementarlo, ya sea con Zapier Agents, Make, o Sinsajo Creators, tendrás claridad total de lo que necesitas.</p>',
    '<h2>Zapier Agents: Intelligent Automation with Decision-Making</h2>
<p><strong>Zapier Agents</strong> go beyond simple "if this then that" automation. They are agents that <em>use AI to make contextual decisions, adapt to variable situations, and execute complex workflows without human intervention</em>. It''s like having an executive assistant who understands your priorities and acts accordingly.</p>

<h3>Difference: Traditional Automation vs AI Agent</h3>
<p>To understand the leap from Zaps (automations) to Agents, let''s see an example:</p>

<h4>Traditional Zap: Welcome Email</h4>
<p><strong>Fixed flow:</strong> New Mailchimp subscriber → Send predefined welcome email</p>
<p><strong>Problem:</strong> Everyone receives the same email, regardless of how they arrived or what interests them</p>

<h4>Zapier Agent: Smart Welcome Email</h4>
<p><strong>Adaptive flow:</strong> New subscriber → Agent analyzes:</p>
<ul>
  <li>What source do they come from? (blog, ad, webinar, etc.)</li>
  <li>What page did they visit before subscribing?</li>
  <li>What time is it in their timezone?</li>
  <li>Is there demographic data in the form?</li>
</ul>
<p><strong>Then decides:</strong></p>
<ul>
  <li>Personalize email mentioning the source</li>
  <li>Suggest content related to the page they visited</li>
  <li>Schedule send at optimal time (not at 3 AM)</li>
  <li>Adapt tone according to segment (B2B formal vs B2C casual)</li>
</ul>

<p>This level of intelligence is what differentiates an agent from traditional automation.</p>

<h3>Real Case: Multi-Platform Social Media Agent</h3>
<p>One of the most powerful agents you can create with Zapier is a complete Social Media Manager. Here''s the step-by-step flow:</p>

<h4>Agent Setup</h4>
<p><strong>Initial input (you define once):</strong></p>
<ul>
  <li>Brand guide (tone, values, forbidden words)</li>
  <li>Editorial calendar (topics per week/month)</li>
  <li>Rules per platform (Instagram: 1 post/day; LinkedIn: 3/week; Twitter: 5/week)</li>
  <li>Examples of past successful posts</li>
</ul>

<h4>Agent Autonomous Execution</h4>
<ol>
  <li><strong>Trend monitoring:</strong> Agent checks daily Google Trends, Twitter Trends, and industry news</li>
  <li><strong>Idea generation:</strong> Crosses trends with editorial calendar and proposes 10 relevant content ideas</li>
  <li><strong>Content creation:</strong> For each idea, generates:
    <ul>
      <li>Text adapted to each platform</li>
      <li>Image suggestion (description for Nano Banana)</li>
      <li>Relevant hashtags (verifies they''re not banned)</li>
      <li>Best publication time according to historical analytics</li>
    </ul>
  </li>
  <li><strong>Quality review:</strong> Agent evaluates each post with criteria:
    <ul>
      <li>Aligned with brand guide?</li>
      <li>Clear call-to-action?</li>
      <li>Appropriate tone for platform?</li>
      <li>Avoids sensitive/controversial topics?</li>
    </ul>
  </li>
  <li><strong>Approval decision:</strong>
    <ul>
      <li>Posts passing all criteria → Schedule automatically</li>
      <li>Posts with sensitive topic → Send to your email for manual approval</li>
      <li>Posts failing criteria → Discard and generate alternative</li>
    </ul>
  </li>
  <li><strong>Publication and monitoring:</strong> Publishes at optimal time, monitors first 2 hours of engagement, and notifies you if any post has abnormally high engagement (so you can amplify with ads) or low (to adjust strategy)</li>
</ol>

<p>This agent can manage your presence on 3-4 social networks completely autonomously, generating between 15-30 posts per week without you touching anything.</p>

<h3>Real Case 2: Lead Management Agent</h3>
<p>This agent transforms how you handle leads from first contact to sale:</p>

<h4>Agent Flow</h4>
<ol>
  <li><strong>Capture:</strong> Contact arrives (web form, Instagram DM, email, WhatsApp)</li>
  <li><strong>Automatic qualification:</strong> Agent analyzes:
    <ul>
      <li>Budget mentioned</li>
      <li>Urgency (when do they need the service?)</li>
      <li>Fit (does their need match your offer?)</li>
      <li>History (is it a repeat contact?)</li>
    </ul>
  </li>
  <li><strong>Classification:</strong>
    <ul>
      <li><strong>Hot lead</strong> (budget + urgency + fit) → Immediate WhatsApp notification to sales + Follow-up email in 30 min</li>
      <li><strong>Warm lead</strong> (2 of 3 criteria) → Educational email + Schedule call in 2-3 days + CRM registration with alert</li>
      <li><strong>Cold lead</strong> (1 or less) → Automatic nurturing sequence of 6 emails in 2 weeks + Add to newsletter</li>
    </ul>
  </li>
  <li><strong>Personalization:</strong> All emails are AI-generated with:
    <ul>
      <li>Lead''s name</li>
      <li>Specific mention of their inquiry</li>
      <li>Content relevant to their industry/need</li>
      <li>Tone appropriate to their temperature (urgent with hot, educational with cold)</li>
    </ul>
  </li>
  <li><strong>Smart follow-up:</strong>
    <ul>
      <li>If lead opens email but doesn''t respond → Send reminder in 3 days</li>
      <li>If lead clicks pricing link → Escalate to "hot" and notify sales</li>
      <li>If lead doesn''t open 3 consecutive emails → Pause sequence and mark as "inactive"</li>
    </ul>
  </li>
</ol>

<p>Companies implementing this agent report 3x more lead conversion because <em>no contact goes unanswered</em> and each receives personalized communication at the exact level of interest they show.</p>

<h3>How to Build Your First Zapier Agent</h3>
<p>Zapier Agents are in beta phase (2026) but you can access if you have Pro account ($49/month) or higher. Here''s the process:</p>

<ol>
  <li>Go to zapier.com/agents</li>
  <li>Select template or create from scratch</li>
  <li>Define the agent''s "brain":
    <ul>
      <li>Objective: What should it achieve?</li>
      <li>Rules: What can/can''t it do?</li>
      <li>Context: Brand guides, examples, restrictions</li>
    </ul>
  </li>
  <li>Connect apps: Gmail, Slack, CRM, social networks, etc.</li>
  <li>Configure triggers: What events start the agent?</li>
  <li>Define decisions: What variables does it evaluate to decide actions?</li>
  <li>Test with real test cases</li>
  <li>Activate and monitor first 7 days</li>
</ol>

<h3>Practical Exercise: Design Your Marketing Agent</h3>
<p>In your notebook, design the complete flow of an agent that automates your heaviest marketing task:</p>
<ol>
  <li><strong>Agent name:</strong> [E.g.: "Instagram Content Agent"]</li>
  <li><strong>Objective:</strong> [E.g.: "Post 5 times/week on Instagram aligned with my brand"]</li>
  <li><strong>Inputs it receives:</strong> [E.g.: Editorial calendar, brand guide, historical analytics]</li>
  <li><strong>Decisions it makes:</strong> [E.g.: What topics to cover, when to post, what hashtags to use]</li>
  <li><strong>Actions it executes:</strong> [E.g.: Generate text, suggest image, schedule post, monitor engagement]</li>
  <li><strong>When to escalate to human:</strong> [E.g.: Controversial topics, abnormal engagement, negative comments]</li>
</ol>

<p>This design is your blueprint. When you''re ready to implement it, whether with Zapier Agents, Make, or Sinsajo Creators, you''ll have total clarity on what you need.</p>',
    2,
    30
  );

  -- Lección 8.3
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Casos Reales: Agentes que Transforman Negocios',
    'Real Cases: Agents that Transform Businesses',
    '<h2>Del Concepto a la Realidad: Agentes IA en Acción</h2>
<p>La teoría sobre agentes IA suena poderosa, pero ¿realmente funciona en la práctica? Aquí analizamos 4 casos reales de negocios que implementaron agentes y los resultados medibles que obtuvieron. Estos no son casos hipotéticos: son empresas reales con datos verificables.</p>

<h3>Caso 1: Svenfish - 82% de Ventas E-commerce por Emails con IA</h3>
<p><strong>Negocio:</strong> Svenfish, marca de mariscos premium vendiendo online.</p>
<p><strong>Desafío:</strong> Alto tráfico en sitio web pero baja conversión. Muchos visitantes agregaban productos al carrito pero no completaban la compra.</p>

<h4>Solución: Agente de Email Marketing Inteligente</h4>
<p>Implementaron un agente que:</p>
<ul>
  <li>Detecta cuando alguien abandona el carrito</li>
  <li>Analiza qué productos dejó, a qué hora, desde qué dispositivo</li>
  <li>Genera email personalizado mencionando específicamente los productos</li>
  <li>Ajusta el incentivo según el valor del carrito (descuento 5-15%)</li>
  <li>Programa envío en horario óptimo según zona horaria del cliente</li>
  <li>Si no abre el primer email, envía versión alternativa 48 hrs después</li>
</ul>

<h4>Resultados Medibles</h4>
<ul>
  <li><strong>82% de las ventas e-commerce</strong> provienen de emails generados por el agente</li>
  <li>Tasa de recuperación de carritos: 38% (promedio industria: 8-12%)</li>
  <li>ROI del sistema: $12 por cada $1 invertido en la plataforma</li>
  <li>Tiempo de setup: 2 semanas (ahora funciona 100% autónomo)</li>
</ul>

<p><strong>Lección clave:</strong> Un agente bien configurado puede convertirse en tu vendedor #1, trabajando 24/7 sin descanso ni comisiones.</p>

<h3>Caso 2: Emprendedora Digital - Contenido Multi-Plataforma desde un Brief</h3>
<p><strong>Negocio:</strong> Coach de negocios para mujeres emprendedoras.</p>
<p><strong>Desafío:</strong> Necesita presencia en Instagram, LinkedIn, TikTok y Facebook, pero crear contenido único para cada plataforma le tomaba 12+ horas semanales.</p>

<h4>Solución: Agente de Content Repurposing</h4>
<p>Ella escribe un brief semanal de 200 palabras con el concepto que quiere comunicar. El agente:</p>
<ul>
  <li>Genera 5 posts para Instagram (carrusel + caption + hashtags)</li>
  <li>Crea 3 artículos largos para LinkedIn (800-1200 palabras)</li>
  <li>Produce 7 scripts para TikTok/Reels (30-60 segundos)</li>
  <li>Adapta 4 posts para Facebook (tono más personal)</li>
  <li>Sugiere imágenes con prompts para Nano Banana</li>
  <li>Programa publicación en horarios óptimos por plataforma</li>
</ul>

<h4>Resultados Medibles</h4>
<ul>
  <li>Tiempo invertido: de 12 hrs/semana a <strong>45 minutos/semana</strong></li>
  <li>Crecimiento de audiencia: +340% en 6 meses (de 2,500 a 11,000 seguidores combinados)</li>
  <li>Engagement promedio: +85% (más interacciones porque publica consistentemente)</li>
  <li>Nuevos clientes: 23 en 6 meses directamente atribuibles a contenido orgánico (antes: 4-5/año)</li>
</ul>

<p><strong>Lección clave:</strong> La consistencia supera a la perfección. Un agente te permite publicar 10x más seguido sin sacrificar calidad.</p>

<h3>Caso 3: Negocio Local - Automatización de Reseñas y WhatsApp</h3>
<p><strong>Negocio:</strong> Restaurante familiar con 2 sucursales.</p>
<p><strong>Desafío:</strong> Reciben 50+ consultas diarias en WhatsApp y Google Reviews, pero solo 1 persona puede responder (la dueña). Muchas consultas se quedan sin respuesta o tardan 6+ horas.</p>

<h4>Solución: Agente de Atención al Cliente Multicanal</h4>
<p>Implementaron un agente que:</p>
<ul>
  <li><strong>En WhatsApp Business:</strong> Responde automáticamente consultas comunes (horarios, menú, reservas, dirección). Si detecta consulta compleja, avisa "Un humano responderá en X minutos" y notifica a la dueña</li>
  <li><strong>En Google Reviews:</strong> Detecta nuevas reseñas cada 30 minutos. Responde automáticamente agradeciendo reviews positivas con mensaje personalizado. Escala reviews negativas a la dueña con análisis de sentimiento y sugerencia de respuesta</li>
  <li><strong>Sistema de reservas:</strong> Acepta reservas por WhatsApp, verifica disponibilidad en Google Calendar, confirma, y envía recordatorio 2 horas antes</li>
</ul>

<h4>Resultados Medibles</h4>
<ul>
  <li>Tiempo de respuesta promedio: de 4 horas a <strong>2 minutos</strong></li>
  <li>Tasa de respuesta: de 60% a <strong>100%</strong> de consultas respondidas</li>
  <li>Rating de Google: subió de 4.1 a 4.7 estrellas en 3 meses (responder rápido a reviews mejora percepción)</li>
  <li>No-shows en reservas: bajaron de 30% a 8% (gracias a recordatorios automáticos)</li>
  <li>Tiempo liberado de la dueña: 15 horas/semana que ahora dedica a operaciones y menú</li>
</ul>

<p><strong>Lección clave:</strong> En negocios locales, velocidad de respuesta = ventas. Los clientes buscan inmediatez, y los agentes la entregan.</p>

<h3>Caso 4: Tienda Online - Agente Make para Inventario + Facturación</h3>
<p><strong>Negocio:</strong> Tienda online de productos artesanales (velas, jabones, decoración).</p>
<p><strong>Desafío:</strong> Vendían en 3 plataformas (Shopify, Etsy, Instagram Shopping). Actualizar inventario manualmente en las 3 causaba errores: vendían productos agotados, o dejaban stock sin publicar.</p>

<h4>Solución: Agente de Sincronización de Inventario</h4>
<p>Usaron Make.com para crear un agente que:</p>
<ul>
  <li>Mantiene inventario maestro en Google Sheets</li>
  <li>Cada vez que se vende en cualquier plataforma → Actualiza stock en las 3 automáticamente</li>
  <li>Si stock de un producto baja a 5 unidades → Envía alerta a producción para reponer</li>
  <li>Si stock llega a 0 → Marca como "agotado" en las 3 plataformas y sugiere productos similares en la descripción</li>
  <li>Genera factura PDF automáticamente con cada venta y la envía al cliente</li>
  <li>Actualiza hoja de contabilidad con ventas diarias</li>
</ul>

<h4>Resultados Medibles</h4>
<ul>
  <li>Errores de inventario: de 8-12/mes a <strong>0 en 4 meses</strong></li>
  <li>Quejas por "producto no disponible": eliminadas completamente</li>
  <li>Tiempo en gestión de inventario: de 6 hrs/semana a 20 min/semana (solo revisar alertas)</li>
  <li>Ventas: +40% porque ahora publican TODO el stock disponible en tiempo real</li>
</ul>

<p><strong>Lección clave:</strong> Los agentes no solo ahorran tiempo, también previenen pérdida de ventas por errores humanos.</p>

<h3>El Futuro: Agentes Conversacionales en tu Sitio Web</h3>
<p>La siguiente generación de agentes (disponible ya en 2026) son <strong>agentes conversacionales embebidos en tu web</strong>. En lugar de un formulario de contacto tradicional, el visitante chatea con un agente que:</p>
<ul>
  <li>Entiende su necesidad mediante conversación natural</li>
  <li>Hace preguntas de calificación de forma conversacional</li>
  <li>Muestra productos/servicios relevantes basado en lo que dice</li>
  <li>Procesa pagos directamente en el chat</li>
  <li>Agenda llamadas con tu equipo si es necesario</li>
</ul>

<p>Empresas beta-testing esto reportan tasas de conversión 3-5x superiores vs formularios tradicionales. ¿Por qué? Porque <em>elimina la fricción</em>. El cliente no tiene que llenar 10 campos, ni esperar respuesta — el agente lo atiende en tiempo real, 24/7.</p>

<h3>Cómo Sinsajo Creators Te Ayuda a Implementar Agentes</h3>
<p>Estos casos son inspiradores, pero implementarlos puede parecer complejo. Aquí entra <strong>Sinsajo Creators</strong>:</p>
<ul>
  <li><strong>Consultoría personalizada:</strong> Analizamos tu negocio y diseñamos el equipo de agentes ideal para tu caso específico</li>
  <li><strong>Implementación técnica:</strong> Configuramos los agentes, integramos con tus herramientas actuales, y los probamos antes de activar</li>
  <li><strong>Capacitación:</strong> Te enseñamos a monitorear, ajustar, y expandir tus agentes sin depender de nosotros</li>
  <li><strong>Soporte continuo:</strong> Actualizaciones cuando las plataformas cambian, y ajustes cuando tu negocio crece</li>
</ul>

<h3>Ejercicio Práctico: Identifica Tu Caso de Uso</h3>
<p>Revisa los 4 casos de arriba y responde:</p>
<ol>
  <li>¿Cuál se parece más a mi negocio?</li>
  <li>¿Qué problema de ese caso también tengo yo?</li>
  <li>Si implementara ese tipo de agente, ¿cuántas horas/semana ahorraría?</li>
  <li>¿Cuánto dinero estoy perdiendo actualmente por no tener ese agente? (ventas no concretadas, tiempo mal invertido, errores)</li>
</ol>

<p>Cuando termines el curso, tendrás una sesión 1-on-1 gratuita con Sinsajo Creators donde discutiremos exactamente qué agentes necesitas y cómo implementarlos.</p>',
    '<h2>From Concept to Reality: AI Agents in Action</h2>
<p>The theory about AI agents sounds powerful, but does it really work in practice? Here we analyze 4 real business cases that implemented agents and the measurable results they obtained. These are not hypothetical cases: they are real companies with verifiable data.</p>

<h3>Case 1: Svenfish - 82% E-commerce Sales from AI Emails</h3>
<p><strong>Business:</strong> Svenfish, premium seafood brand selling online.</p>
<p><strong>Challenge:</strong> High website traffic but low conversion. Many visitors added products to cart but didn''t complete purchase.</p>

<h4>Solution: Smart Email Marketing Agent</h4>
<p>They implemented an agent that:</p>
<ul>
  <li>Detects when someone abandons cart</li>
  <li>Analyzes what products they left, at what time, from what device</li>
  <li>Generates personalized email specifically mentioning products</li>
  <li>Adjusts incentive based on cart value (5-15% discount)</li>
  <li>Schedules send at optimal time according to customer timezone</li>
  <li>If first email isn''t opened, sends alternative version 48 hrs later</li>
</ul>

<h4>Measurable Results</h4>
<ul>
  <li><strong>82% of e-commerce sales</strong> come from agent-generated emails</li>
  <li>Cart recovery rate: 38% (industry average: 8-12%)</li>
  <li>System ROI: $12 for every $1 invested in the platform</li>
  <li>Setup time: 2 weeks (now runs 100% autonomously)</li>
</ul>

<p><strong>Key lesson:</strong> A well-configured agent can become your #1 salesperson, working 24/7 without rest or commissions.</p>

<h3>Case 2: Digital Entrepreneur - Multi-Platform Content from One Brief</h3>
<p><strong>Business:</strong> Business coach for female entrepreneurs.</p>
<p><strong>Challenge:</strong> Needs presence on Instagram, LinkedIn, TikTok and Facebook, but creating unique content for each platform took 12+ hours weekly.</p>

<h4>Solution: Content Repurposing Agent</h4>
<p>She writes a weekly 200-word brief with the concept she wants to communicate. The agent:</p>
<ul>
  <li>Generates 5 Instagram posts (carousel + caption + hashtags)</li>
  <li>Creates 3 long LinkedIn articles (800-1200 words)</li>
  <li>Produces 7 TikTok/Reels scripts (30-60 seconds)</li>
  <li>Adapts 4 posts for Facebook (more personal tone)</li>
  <li>Suggests images with prompts for Nano Banana</li>
  <li>Schedules publication at optimal times per platform</li>
</ul>

<h4>Measurable Results</h4>
<ul>
  <li>Time invested: from 12 hrs/week to <strong>45 minutes/week</strong></li>
  <li>Audience growth: +340% in 6 months (from 2,500 to 11,000 combined followers)</li>
  <li>Average engagement: +85% (more interactions because posts consistently)</li>
  <li>New clients: 23 in 6 months directly attributed to organic content (before: 4-5/year)</li>
</ul>

<p><strong>Key lesson:</strong> Consistency beats perfection. An agent lets you post 10x more often without sacrificing quality.</p>

<h3>Case 3: Local Business - Reviews and WhatsApp Automation</h3>
<p><strong>Business:</strong> Family restaurant with 2 locations.</p>
<p><strong>Challenge:</strong> Receive 50+ daily inquiries on WhatsApp and Google Reviews, but only 1 person can respond (the owner). Many inquiries go unanswered or take 6+ hours.</p>

<h4>Solution: Multichannel Customer Service Agent</h4>
<p>They implemented an agent that:</p>
<ul>
  <li><strong>On WhatsApp Business:</strong> Automatically responds to common queries (hours, menu, reservations, address). If it detects complex query, says "A human will respond in X minutes" and notifies owner</li>
  <li><strong>On Google Reviews:</strong> Detects new reviews every 30 minutes. Automatically responds thanking positive reviews with personalized message. Escalates negative reviews to owner with sentiment analysis and response suggestion</li>
  <li><strong>Reservation system:</strong> Accepts reservations via WhatsApp, checks availability in Google Calendar, confirms, and sends reminder 2 hours before</li>
</ul>

<h4>Measurable Results</h4>
<ul>
  <li>Average response time: from 4 hours to <strong>2 minutes</strong></li>
  <li>Response rate: from 60% to <strong>100%</strong> of queries answered</li>
  <li>Google rating: rose from 4.1 to 4.7 stars in 3 months (responding fast to reviews improves perception)</li>
  <li>No-shows on reservations: dropped from 30% to 8% (thanks to automatic reminders)</li>
  <li>Owner''s freed time: 15 hours/week now dedicated to operations and menu</li>
</ul>

<p><strong>Key lesson:</strong> In local businesses, response speed = sales. Customers seek immediacy, and agents deliver it.</p>

<h3>Case 4: Online Store - Make Agent for Inventory + Invoicing</h3>
<p><strong>Business:</strong> Online store of handmade products (candles, soaps, decoration).</p>
<p><strong>Challenge:</strong> Sold on 3 platforms (Shopify, Etsy, Instagram Shopping). Manually updating inventory on all 3 caused errors: sold out-of-stock products, or left stock unpublished.</p>

<h4>Solution: Inventory Sync Agent</h4>
<p>Used Make.com to create an agent that:</p>
<ul>
  <li>Maintains master inventory in Google Sheets</li>
  <li>Every sale on any platform → Updates stock on all 3 automatically</li>
  <li>If product stock drops to 5 units → Sends alert to production to restock</li>
  <li>If stock reaches 0 → Marks as "sold out" on all 3 platforms and suggests similar products in description</li>
  <li>Automatically generates PDF invoice with each sale and sends to customer</li>
  <li>Updates accounting sheet with daily sales</li>
</ul>

<h4>Measurable Results</h4>
<ul>
  <li>Inventory errors: from 8-12/month to <strong>0 in 4 months</strong></li>
  <li>Complaints about "product unavailable": completely eliminated</li>
  <li>Time on inventory management: from 6 hrs/week to 20 min/week (just review alerts)</li>
  <li>Sales: +40% because now they publish ALL available stock in real-time</li>
</ul>

<p><strong>Key lesson:</strong> Agents don''t just save time, they also prevent lost sales from human errors.</p>

<h3>The Future: Conversational Agents on Your Website</h3>
<p>The next generation of agents (already available in 2026) are <strong>conversational agents embedded in your website</strong>. Instead of a traditional contact form, the visitor chats with an agent that:</p>
<ul>
  <li>Understands their need through natural conversation</li>
  <li>Asks qualifying questions conversationally</li>
  <li>Shows relevant products/services based on what they say</li>
  <li>Processes payments directly in chat</li>
  <li>Schedules calls with your team if necessary</li>
</ul>

<p>Companies beta-testing this report conversion rates 3-5x higher vs traditional forms. Why? Because <em>it eliminates friction</em>. The customer doesn''t have to fill out 10 fields, nor wait for response — the agent serves them in real-time, 24/7.</p>

<h3>How Sinsajo Creators Helps You Implement Agents</h3>
<p>These cases are inspiring, but implementing them may seem complex. This is where <strong>Sinsajo Creators</strong> comes in:</p>
<ul>
  <li><strong>Personalized consulting:</strong> We analyze your business and design the ideal agent team for your specific case</li>
  <li><strong>Technical implementation:</strong> We configure agents, integrate with your current tools, and test before activation</li>
  <li><strong>Training:</strong> We teach you to monitor, adjust, and expand your agents without depending on us</li>
  <li><strong>Ongoing support:</strong> Updates when platforms change, and adjustments when your business grows</li>
</ul>

<h3>Practical Exercise: Identify Your Use Case</h3>
<p>Review the 4 cases above and answer:</p>
<ol>
  <li>Which is most similar to my business?</li>
  <li>What problem from that case do I also have?</li>
  <li>If I implemented that type of agent, how many hours/week would I save?</li>
  <li>How much money am I currently losing by not having that agent? (lost sales, misinvested time, errors)</li>
</ol>

<p>When you finish the course, you''ll have a free 1-on-1 session with Sinsajo Creators where we''ll discuss exactly what agents you need and how to implement them.</p>',
    3,
    25
  );

  RAISE NOTICE 'Módulo 8 (Agentes IA) completado: 4 lecciones insertadas';

END $$;

COMMIT;
