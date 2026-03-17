-- ============================================================
-- SEED: IA para Marketing y Negocios - Parte 5 (Modulo 9)
-- Tu Plan de Acción: De Alumna a Experta
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
  -- MODULO 9: Tu Plan de Acción: De Alumna a Experta
  -- ============================================================
  SELECT id INTO v_module_id
  FROM public.modules
  WHERE course_id = v_course_id AND order_index = 9;

  IF v_module_id IS NULL THEN
    RAISE EXCEPTION 'Modulo 9 no encontrado.';
  END IF;

  -- Eliminar lecciones existentes del módulo 9 (idempotencia)
  DELETE FROM public.lessons WHERE module_id = v_module_id;

  -- Lección 9.0
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Tu Ecosistema IA Completo',
    'Your Complete AI Ecosystem',
    '<h2>El Mapa de Tu Arsenal de IA</h2>
<p>Has llegado al módulo final del curso. A lo largo de estas 40+ lecciones, exploraste decenas de herramientas de IA. Ahora es momento de <strong>consolidar todo en un ecosistema coherente</strong> que trabaje para tu negocio de forma integrada. No se trata de usar todas las herramientas al mismo tiempo, sino de entender cuál usar en cada situación.</p>

<h3>Tu Stack IA Completo: Las 7 Capas</h3>
<p>Aquí el mapa visual de cómo todas las herramientas que aprendiste se conectan en tu flujo de trabajo diario:</p>

<h4>1. Cerebro Central: Gemini</h4>
<p><strong>Función:</strong> Tu asistente de texto para todo. Estrategia, redacción, análisis, investigación.</p>
<p><strong>Cuándo usarlo:</strong> Necesitas escribir, analizar datos, generar ideas, tomar decisiones basadas en información.</p>
<p><strong>Ejemplos diarios:</strong></p>
<ul>
  <li>Redactar emails importantes</li>
  <li>Analizar competencia</li>
  <li>Resumir artículos largos o PDFs</li>
  <li>Generar outlines de contenido</li>
  <li>Resolver problemas complejos paso a paso</li>
</ul>

<h4>2. Equipo de Especialistas: Gems</h4>
<p><strong>Función:</strong> Tus mini-agentes personalizados para tareas específicas.</p>
<p><strong>Cuándo usarlos:</strong> Necesitas un experto en un área particular (marketing, copywriting, análisis, soporte).</p>
<p><strong>Tus 5 Gems esenciales:</strong></p>
<ol>
  <li>Estratega de Marketing</li>
  <li>Community Manager</li>
  <li>Copywriter de Ventas</li>
  <li>Analista de Datos</li>
  <li>Servicio al Cliente</li>
</ol>

<h4>3. Generador de Imágenes: Nano Banana 2</h4>
<p><strong>Función:</strong> Crear imágenes profesionales para redes sociales, anuncios, blog.</p>
<p><strong>Cuándo usarlo:</strong> Necesitas visuals para contenido, no tienes fotógrafo/diseñador, o quieres iterar rápido.</p>
<p><strong>Acceso:</strong> Google AI Studio, Gemini App, o Flow.</p>
<p><strong>Resolución:</strong> Hasta 4K (3840x2160 px) — perfecto para cualquier plataforma.</p>

<h4>4. Generador de Videos: Veo 3 + Veo 3 Pro</h4>
<p><strong>Función:</strong> Crear videos cortos (8-30 seg) para redes sociales, anuncios, hero videos.</p>
<p><strong>Cuándo usarlo:</strong></p>
<ul>
  <li><strong>Veo 3:</strong> Contenido rápido para Stories, Reels, TikTok (720p)</li>
  <li><strong>Veo 3 Pro:</strong> Contenido premium para landing pages, eventos, YouTube (4K)</li>
</ul>
<p><strong>Acceso:</strong> Google AI Studio o Flow.</p>

<h4>5. Centro de Investigación: NotebookLM</h4>
<p><strong>Función:</strong> Convertir documentos, artículos, PDFs en conocimiento estructurado + podcasts de audio.</p>
<p><strong>Cuándo usarlo:</strong></p>
<ul>
  <li>Tienes que estudiar un tema complejo (ej: nueva regulación, tendencia de mercado)</li>
  <li>Quieres crear contenido educativo basado en tus materiales</li>
  <li>Necesitas resumir o reorganizar información de múltiples fuentes</li>
</ul>
<p><strong>Salidas:</strong> Resúmenes, guías de estudio, cronologías, preguntas frecuentes, podcasts de audio de 2 voces.</p>

<h4>6. Hub de Automatización: Google Workspace Studio</h4>
<p><strong>Función:</strong> Conectar Gmail + Drive + Sheets + Calendar + Docs en flujos automáticos.</p>
<p><strong>Cuándo usarlo:</strong> Tareas repetitivas dentro de tu Workspace (organizar emails, mover archivos, generar reportes).</p>
<p><strong>Ventaja:</strong> No-code — describes en lenguaje natural lo que quieres y Gemini 3 lo construye.</p>

<h4>7. Conectores Universales: Zapier + Make</h4>
<p><strong>Función:</strong> Conectar cualquier app con cualquier otra (7,000+ integraciones).</p>
<p><strong>Cuándo usarlos:</strong> Necesitas conectar herramientas que no son de Google (Mailchimp, Shopify, Instagram, Slack, CRMs).</p>
<p><strong>Zapier:</strong> Más fácil, ideal para flujos simples.</p>
<p><strong>Make:</strong> Más potente, ideal para flujos complejos con múltiples rutas.</p>

<h3>El Flujo de Trabajo Completo: De Idea a Publicación</h3>
<p>Aquí cómo todas estas herramientas trabajan juntas en un día típico de tu negocio:</p>

<h4>Lunes: Planificación Semanal (30 minutos)</h4>
<ol>
  <li><strong>Gemini:</strong> "Analiza tendencias de mi industria esta semana y sugiere 5 temas de contenido"</li>
  <li><strong>Gem Estratega:</strong> "De estos 5 temas, cuál tiene más potencial para mi audiencia de [descripción]?"</li>
  <li><strong>Resultado:</strong> Calendario de contenido de la semana</li>
</ol>

<h4>Martes-Jueves: Creación de Contenido (1 hora/día)</h4>
<ol>
  <li><strong>NotebookLM:</strong> Sube artículos/investigación sobre el tema del día → Genera resumen estructurado</li>
  <li><strong>Gem Community Manager:</strong> "Crea 3 posts de Instagram sobre [tema] basado en esta investigación"</li>
  <li><strong>Nano Banana 2:</strong> Genera imagen para cada post con prompts sugeridos por el Gem</li>
  <li><strong>Veo 3:</strong> (Opcional) Crea video de 8 segundos para el post más importante</li>
  <li><strong>Workspace Studio:</strong> Programa publicación automática en horarios óptimos</li>
</ol>

<h4>Viernes: Análisis y Optimización (45 minutos)</h4>
<ol>
  <li><strong>Gem Analista:</strong> "Revisa métricas de esta semana y dame 3 insights accionables"</li>
  <li><strong>Gemini:</strong> "Basado en estos insights, ajusta la estrategia de próxima semana"</li>
  <li><strong>Zapier/Make:</strong> Genera reporte automático de métricas y lo envía a tu email + Slack</li>
</ol>

<h4>24/7: Automatización en Segundo Plano</h4>
<ul>
  <li><strong>Gem Servicio al Cliente:</strong> Responde consultas comunes en Instagram DMs y emails</li>
  <li><strong>Zapier Agent:</strong> Califica leads de formularios y envía secuencia personalizada</li>
  <li><strong>Workspace Studio:</strong> Organiza adjuntos de emails en Drive + registra en Sheets</li>
</ul>

<h3>Tu Checklist de Herramientas Activas</h3>
<p>Marca las que ya tienes configuradas y funcionando:</p>

<p>✅ <strong>Básicas (gratuitas, configuración &lt; 10 min):</strong></p>
<ul>
  <li>Cuenta de Gemini (gemini.google.com)</li>
  <li>Google AI Studio (aistudio.google.com)</li>
  <li>NotebookLM (notebooklm.google.com)</li>
  <li>Flow (flow.google)</li>
</ul>

<p>✅ <strong>Intermedias (gratuitas, configuración 15-30 min):</strong></p>
<ul>
  <li>5 Gems personalizados creados y probados</li>
  <li>Google Workspace Studio activado con 1+ flujo</li>
  <li>Cuenta gratuita de Zapier o Make</li>
</ul>

<p>✅ <strong>Avanzadas (requieren práctica, alta recompensa):</strong></p>
<ul>
  <li>Zapier Agent configurado para 1 proceso clave</li>
  <li>Automatización multicanal (email + redes + CRM)</li>
  <li>Sistema de agentes trabajando en equipo</li>
</ul>

<h3>Ejercicio Práctico: Mapea Tu Stack Ideal</h3>
<p>En tu cuaderno, dibuja o escribe tu stack ideal respondiendo:</p>
<ol>
  <li><strong>Herramientas que ya uso:</strong> [lista]</li>
  <li><strong>Herramientas que necesito activar esta semana:</strong> [máximo 3]</li>
  <li><strong>Flujo que más impacto tendría en mi negocio si lo automatizo:</strong> [describe]</li>
  <li><strong>Mi próximo paso inmediato:</strong> [acción específica que puedes hacer hoy]</li>
</ol>

<p>En la siguiente lección, convertirás este plan en tu proyecto final del curso.</p>',
    '<h2>The Map of Your AI Arsenal</h2>
<p>You''ve reached the final module of the course. Throughout these 40+ lessons, you explored dozens of AI tools. Now it''s time to <strong>consolidate everything into a coherent ecosystem</strong> that works for your business in an integrated way. It''s not about using all tools at once, but understanding which to use in each situation.</p>

<h3>Your Complete AI Stack: The 7 Layers</h3>
<p>Here''s the visual map of how all the tools you learned connect in your daily workflow:</p>

<h4>1. Central Brain: Gemini</h4>
<p><strong>Function:</strong> Your text assistant for everything. Strategy, writing, analysis, research.</p>
<p><strong>When to use it:</strong> You need to write, analyze data, generate ideas, make data-based decisions.</p>
<p><strong>Daily examples:</strong></p>
<ul>
  <li>Draft important emails</li>
  <li>Analyze competition</li>
  <li>Summarize long articles or PDFs</li>
  <li>Generate content outlines</li>
  <li>Solve complex problems step by step</li>
</ul>

<h4>2. Specialist Team: Gems</h4>
<p><strong>Function:</strong> Your customized mini-agents for specific tasks.</p>
<p><strong>When to use them:</strong> You need an expert in a particular area (marketing, copywriting, analysis, support).</p>
<p><strong>Your 5 essential Gems:</strong></p>
<ol>
  <li>Marketing Strategist</li>
  <li>Community Manager</li>
  <li>Sales Copywriter</li>
  <li>Data Analyst</li>
  <li>Customer Service</li>
</ol>

<h4>3. Image Generator: Nano Banana 2</h4>
<p><strong>Function:</strong> Create professional images for social media, ads, blog.</p>
<p><strong>When to use it:</strong> You need visuals for content, don''t have photographer/designer, or want to iterate fast.</p>
<p><strong>Access:</strong> Google AI Studio, Gemini App, or Flow.</p>
<p><strong>Resolution:</strong> Up to 4K (3840x2160 px) — perfect for any platform.</p>

<h4>4. Video Generator: Veo 3 + Veo 3 Pro</h4>
<p><strong>Function:</strong> Create short videos (8-30 sec) for social media, ads, hero videos.</p>
<p><strong>When to use it:</strong></p>
<ul>
  <li><strong>Veo 3:</strong> Quick content for Stories, Reels, TikTok (720p)</li>
  <li><strong>Veo 3 Pro:</strong> Premium content for landing pages, events, YouTube (4K)</li>
</ul>
<p><strong>Access:</strong> Google AI Studio or Flow.</p>

<h4>5. Research Center: NotebookLM</h4>
<p><strong>Function:</strong> Convert documents, articles, PDFs into structured knowledge + audio podcasts.</p>
<p><strong>When to use it:</strong></p>
<ul>
  <li>You need to study a complex topic (e.g., new regulation, market trend)</li>
  <li>Want to create educational content based on your materials</li>
  <li>Need to summarize or reorganize information from multiple sources</li>
</ul>
<p><strong>Outputs:</strong> Summaries, study guides, timelines, FAQs, 2-voice audio podcasts.</p>

<h4>6. Automation Hub: Google Workspace Studio</h4>
<p><strong>Function:</strong> Connect Gmail + Drive + Sheets + Calendar + Docs in automatic flows.</p>
<p><strong>When to use it:</strong> Repetitive tasks within your Workspace (organize emails, move files, generate reports).</p>
<p><strong>Advantage:</strong> No-code — describe in natural language what you want and Gemini 3 builds it.</p>

<h4>7. Universal Connectors: Zapier + Make</h4>
<p><strong>Function:</strong> Connect any app with any other (7,000+ integrations).</p>
<p><strong>When to use them:</strong> You need to connect non-Google tools (Mailchimp, Shopify, Instagram, Slack, CRMs).</p>
<p><strong>Zapier:</strong> Easier, ideal for simple flows.</p>
<p><strong>Make:</strong> More powerful, ideal for complex flows with multiple routes.</p>

<h3>The Complete Workflow: From Idea to Publication</h3>
<p>Here''s how all these tools work together in a typical business day:</p>

<h4>Monday: Weekly Planning (30 minutes)</h4>
<ol>
  <li><strong>Gemini:</strong> "Analyze my industry trends this week and suggest 5 content topics"</li>
  <li><strong>Strategist Gem:</strong> "Of these 5 topics, which has most potential for my [description] audience?"</li>
  <li><strong>Result:</strong> Week''s content calendar</li>
</ol>

<h4>Tuesday-Thursday: Content Creation (1 hour/day)</h4>
<ol>
  <li><strong>NotebookLM:</strong> Upload articles/research on day''s topic → Generate structured summary</li>
  <li><strong>Community Manager Gem:</strong> "Create 3 Instagram posts about [topic] based on this research"</li>
  <li><strong>Nano Banana 2:</strong> Generate image for each post with prompts suggested by Gem</li>
  <li><strong>Veo 3:</strong> (Optional) Create 8-second video for most important post</li>
  <li><strong>Workspace Studio:</strong> Schedule automatic publication at optimal times</li>
</ol>

<h4>Friday: Analysis and Optimization (45 minutes)</h4>
<ol>
  <li><strong>Analyst Gem:</strong> "Review this week''s metrics and give me 3 actionable insights"</li>
  <li><strong>Gemini:</strong> "Based on these insights, adjust next week''s strategy"</li>
  <li><strong>Zapier/Make:</strong> Generate automatic metrics report and send to email + Slack</li>
</ol>

<h4>24/7: Background Automation</h4>
<ul>
  <li><strong>Customer Service Gem:</strong> Responds to common queries in Instagram DMs and emails</li>
  <li><strong>Zapier Agent:</strong> Qualifies leads from forms and sends personalized sequence</li>
  <li><strong>Workspace Studio:</strong> Organizes email attachments in Drive + records in Sheets</li>
</ul>

<h3>Your Active Tools Checklist</h3>
<p>Check the ones you already have configured and working:</p>

<p>✅ <strong>Basic (free, setup &lt; 10 min):</strong></p>
<ul>
  <li>Gemini account (gemini.google.com)</li>
  <li>Google AI Studio (aistudio.google.com)</li>
  <li>NotebookLM (notebooklm.google.com)</li>
  <li>Flow (flow.google)</li>
</ul>

<p>✅ <strong>Intermediate (free, setup 15-30 min):</strong></p>
<ul>
  <li>5 customized Gems created and tested</li>
  <li>Google Workspace Studio activated with 1+ flow</li>
  <li>Free Zapier or Make account</li>
</ul>

<p>✅ <strong>Advanced (require practice, high reward):</strong></p>
<ul>
  <li>Zapier Agent configured for 1 key process</li>
  <li>Multichannel automation (email + social + CRM)</li>
  <li>System of agents working as team</li>
</ul>

<h3>Practical Exercise: Map Your Ideal Stack</h3>
<p>In your notebook, draw or write your ideal stack answering:</p>
<ol>
  <li><strong>Tools I already use:</strong> [list]</li>
  <li><strong>Tools I need to activate this week:</strong> [maximum 3]</li>
  <li><strong>Flow that would have most impact on my business if automated:</strong> [describe]</li>
  <li><strong>My next immediate step:</strong> [specific action you can do today]</li>
</ol>

<p>In the next lesson, you''ll convert this plan into your final course project.</p>',
    0,
    20
  );

  -- Lección 9.1
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Proyecto Final: Tu Campaña de Marketing con IA',
    'Final Project: Your AI Marketing Campaign',
    '<h2>Tu Proyecto Final: Una Campaña Multimedia Completa</h2>
<p>Este es el momento de aplicar <strong>TODO</strong> lo que aprendiste en un proyecto real que transformará tu negocio. No se trata de un ejercicio académico: vas a crear una campaña de marketing completa, lista para publicar, usando exclusivamente herramientas de IA gratuitas. Al finalizar esta lección, tendrás contenido para 1 semana de marketing multiplataforma.</p>

<h3>Objetivo del Proyecto</h3>
<p>Crear una <strong>campaña de lanzamiento o promoción de 7 días</strong> que incluya:</p>
<ul>
  <li>5 posts para redes sociales (Instagram/Facebook/LinkedIn) con imágenes</li>
  <li>1 video promocional corto (30 seg máx) para Reels/TikTok/YouTube Shorts</li>
  <li>Secuencia de 3 emails (día 1, día 3, día 6)</li>
  <li>1 automatización básica (ej: email de bienvenida a nuevos leads)</li>
</ul>

<p>Todo creado con IA, en un fin de semana, sin contratar diseñadores, copywriters, ni videógrafos.</p>

<h3>Paso 1: Define Tu Oferta (15 minutos)</h3>
<p>Antes de crear contenido, necesitas claridad absoluta sobre qué estás promocionando. Completa este brief:</p>

<h4>Brief de Campaña</h4>
<ul>
  <li><strong>Producto/servicio:</strong> [Ej: Curso online de repostería para principiantes]</li>
  <li><strong>Precio:</strong> [Ej: $97 - promoción por tiempo limitado desde $147]</li>
  <li><strong>Público objetivo:</strong> [Ej: Madres de 30-45 años que quieren emprender desde casa]</li>
  <li><strong>Beneficio principal:</strong> [Ej: Aprende a hacer 20 postres profesionales en 30 días]</li>
  <li><strong>Urgencia:</strong> [Ej: Descuento solo hasta el domingo + 10 cupos disponibles]</li>
  <li><strong>Prueba social:</strong> [Ej: 87 alumnas ya generaron ingresos extra con sus postres]</li>
  <li><strong>Garantía:</strong> [Ej: 30 días de devolución si no ves resultados]</li>
</ul>

<h3>Paso 2: Investiga y Estrategia (30 minutos)</h3>

<h4>Con Gemini</h4>
<p>Prompt: <em>"Soy [tu rol] lanzando [producto] para [público]. Necesito una estrategia de campaña de 7 días para Instagram, email, y video. El objetivo es vender [X] unidades. Analiza qué tipo de contenido funciona mejor para este público y sugiere temas para cada día."</em></p>

<p>Gemini te dará un calendario sugerido. Ejemplo:</p>
<ul>
  <li><strong>Día 1:</strong> Teaser — "algo grande viene"</li>
  <li><strong>Día 2:</strong> Revelación de la oferta</li>
  <li><strong>Día 3:</strong> Beneficios y transformación</li>
  <li><strong>Día 4:</strong> Testimonios y prueba social</li>
  <li><strong>Día 5:</strong> Objeciones comunes resueltas</li>
  <li><strong>Día 6:</strong> Urgencia — cierra pronto</li>
  <li><strong>Día 7:</strong> Última oportunidad</li>
</ul>

<h4>Con NotebookLM (Opcional pero Poderoso)</h4>
<p>Si tienes investigación previa (artículos sobre tu nicho, análisis de competencia, feedback de clientes), súbelo a NotebookLM y pide: <em>"Resume los 5 puntos de dolor más comunes de mi público y cómo mi oferta los resuelve."</em> Usa esto para crear mensajes más afilados.</p>

<h3>Paso 3: Crea los 5 Posts para Redes (1 hora)</h3>

<h4>Con Gem Community Manager</h4>
<p>Para cada día (elige 5 días de tu calendario de 7), usa este prompt en tu Gem:</p>
<p><em>"Crea post para Instagram sobre [tema del día] promocionando [tu oferta]. Público: [descripción]. Tono: [inspirador/educativo/urgente según el día]. Incluye caption, call-to-action, y 5 hashtags relevantes. Sugiere descripción de imagen."</em></p>

<h4>Con Nano Banana 2</h4>
<p>Toma la descripción de imagen que sugirió el Gem y genera la visual en Google AI Studio o Flow. Ajusta el prompt si necesitas más control sobre colores, estilo, o composición.</p>

<p><strong>Descarga las 5 imágenes.</strong> Guárdalas con nombres claros: post_dia1.png, post_dia2.png, etc.</p>

<h3>Paso 4: Crea el Video Promocional (45 minutos)</h3>

<h4>Con Veo 3 o Veo 3 Pro</h4>
<p>Decide el mensaje del video. Usualmente, el mejor momento es Día 3 (beneficios y transformación). Escribe el guion:</p>

<p><strong>Guion de ejemplo (30 segundos):</strong></p>
<ul>
  <li><strong>0-5 seg:</strong> Hook visual — "¿Sueñas con vender tus propios postres?"</li>
  <li><strong>5-15 seg:</strong> Problema — "Pero no sabes por dónde empezar, o tus recetas no salen profesionales"</li>
  <li><strong>15-25 seg:</strong> Solución — "En 30 días domina 20 recetas que la gente PAGA por comer"</li>
  <li><strong>25-30 seg:</strong> CTA — "Link en bio — descuento solo hasta el domingo"</li>
</ul>

<p>Genera el video con Veo 3 usando prompts para cada escena. Si Veo genera clips de 8 seg, crea 3-4 clips y ensámblalos en Google Photos, Canva, o CapCut (todas tienen versiones gratuitas).</p>

<p>Agrega música de fondo de la biblioteca de YouTube (youtube.com/audiolibrary) y texto superpuesto con los mensajes clave.</p>

<h3>Paso 5: Escribe la Secuencia de 3 Emails (30 minutos)</h3>

<h4>Con Gem Copywriter de Ventas</h4>

<p><strong>Email 1 (Día 1):</strong> Bienvenida + Introducción de la oferta</p>
<p>Prompt: <em>"Escribe email de bienvenida para campaña de [producto]. Tono cálido y emocionante. Introduce la oferta sin vender fuerte. Objetivo: generar curiosidad. 250 palabras max. Incluye subject line."</em></p>

<p><strong>Email 2 (Día 3):</strong> Beneficios + Testimonios</p>
<p>Prompt: <em>"Email día 3 de campaña. Enfócate en transformación que ofrece [producto]. Incluye 2 testimonios breves (invéntalos realistas si no tienes reales). Tono: inspirador y aspiracional. 300 palabras. Subject line."</em></p>

<p><strong>Email 3 (Día 6):</strong> Urgencia + Cierre</p>
<p>Prompt: <em>"Email final de campaña. Urgencia genuina (cierra en 24 hrs). Resume beneficios, garantía, y prueba social. Tono: urgente pero no desesperado. CTA claro. 250 palabras. Subject line persuasivo."</em></p>

<p>Guarda los 3 emails en Google Docs o tu herramienta de email marketing.</p>

<h3>Paso 6: Configura 1 Automatización Básica (30 minutos)</h3>

<h4>Opción A: Email de Bienvenida Automático (Zapier o Make)</h4>
<p>Flujo simple:</p>
<ol>
  <li>Nuevo suscriptor en Mailchimp/ConvertKit → Envía email de bienvenida (usa Email 1 de arriba)</li>
  <li>Espera 2 días → Envía Email 2</li>
  <li>Espera 3 días más → Envía Email 3</li>
</ol>

<h4>Opción B: Notificación de Nuevo Lead (Google Workspace Studio)</h4>
<p>Flujo:</p>
<ol>
  <li>Nuevo formulario completado en Google Forms → Registra en Google Sheets</li>
  <li>Envía notificación a tu email + WhatsApp</li>
  <li>Envía email automático al lead confirmando que lo contactarás pronto</li>
</ol>

<p>Elige la automatización que más impacto tenga en tu negocio AHORA.</p>

<h3>Paso 7: Ensambla y Programa (30 minutos)</h3>

<p>Ahora que tienes todo creado:</p>
<ol>
  <li><strong>Posts:</strong> Sube a Meta Business Suite (Instagram + Facebook) o Buffer/Later para programar</li>
  <li><strong>Video:</strong> Sube a Instagram Reels, TikTok, YouTube Shorts — publica el mismo video en las 3</li>
  <li><strong>Emails:</strong> Carga en tu plataforma de email (Mailchimp, ConvertKit, etc.) y programa envíos</li>
  <li><strong>Automatización:</strong> Activa el flujo en Zapier/Make/Workspace Studio y prueba con datos de test</li>
</ol>

<h3>Entregable Final</h3>
<p>Al completar este proyecto, tendrás:</p>
<ul>
  <li>✅ 5 posts de redes sociales programados para la semana</li>
  <li>✅ 1 video promocional publicado en 3 plataformas</li>
  <li>✅ Secuencia de 3 emails cargada y programada</li>
  <li>✅ 1 automatización activa trabajando 24/7</li>
  <li>✅ Campaña lista para generar resultados REALES</li>
</ul>

<h3>Comparte Tu Trabajo</h3>
<p>Si estás en la comunidad de Sinsajo Creators, comparte tu campaña en el grupo. Ver el trabajo de otras alumnas te inspirará y recibirás feedback constructivo. Además, celebrarás el hecho de que creaste una campaña profesional completa sin gastar un centavo en equipo creativo.</p>

<h3>Reflexión Final del Proyecto</h3>
<p>Después de publicar tu campaña, documenta:</p>
<ol>
  <li><strong>Tiempo total invertido:</strong> [horas]</li>
  <li><strong>Costo total:</strong> $0 (todas herramientas gratuitas)</li>
  <li><strong>Herramientas IA usadas:</strong> [lista]</li>
  <li><strong>Mayor desafío:</strong> [qué fue lo más difícil]</li>
  <li><strong>Mayor sorpresa:</strong> [qué resultado te impresionó más]</li>
  <li><strong>Próxima campaña:</strong> [qué harías diferente la próxima vez]</li>
</ol>

<p>Este proyecto es tu prueba de que ahora eres capaz de competir con negocios que tienen equipos de marketing completos. La única diferencia es que tú lo haces más rápido, más barato, y con total control creativo.</p>',
    '<h2>Your Final Project: A Complete Multimedia Campaign</h2>
<p>This is the moment to apply <strong>EVERYTHING</strong> you learned in a real project that will transform your business. This isn''t an academic exercise: you''re going to create a complete marketing campaign, ready to publish, using exclusively free AI tools. By the end of this lesson, you''ll have content for 1 week of multi-platform marketing.</p>

<h3>Project Objective</h3>
<p>Create a <strong>7-day launch or promotion campaign</strong> that includes:</p>
<ul>
  <li>5 social media posts (Instagram/Facebook/LinkedIn) with images</li>
  <li>1 short promotional video (30 sec max) for Reels/TikTok/YouTube Shorts</li>
  <li>Sequence of 3 emails (day 1, day 3, day 6)</li>
  <li>1 basic automation (e.g., welcome email to new leads)</li>
</ul>

<p>All created with AI, in a weekend, without hiring designers, copywriters, or videographers.</p>

<h3>Step 1: Define Your Offer (15 minutes)</h3>
<p>Before creating content, you need absolute clarity on what you''re promoting. Complete this brief:</p>

<h4>Campaign Brief</h4>
<ul>
  <li><strong>Product/service:</strong> [E.g., Online baking course for beginners]</li>
  <li><strong>Price:</strong> [E.g., $97 - limited-time promotion from $147]</li>
  <li><strong>Target audience:</strong> [E.g., Mothers 30-45 wanting to start home businesses]</li>
  <li><strong>Main benefit:</strong> [E.g., Learn to make 20 professional desserts in 30 days]</li>
  <li><strong>Urgency:</strong> [E.g., Discount only until Sunday + 10 spots available]</li>
  <li><strong>Social proof:</strong> [E.g., 87 students already generated extra income with their desserts]</li>
  <li><strong>Guarantee:</strong> [E.g., 30-day money back if you don''t see results]</li>
</ul>

<h3>Step 2: Research and Strategy (30 minutes)</h3>

<h4>With Gemini</h4>
<p>Prompt: <em>"I''m [your role] launching [product] for [audience]. I need a 7-day campaign strategy for Instagram, email, and video. Goal is to sell [X] units. Analyze what content works best for this audience and suggest themes for each day."</em></p>

<p>Gemini will give you a suggested calendar. Example:</p>
<ul>
  <li><strong>Day 1:</strong> Teaser — "something big coming"</li>
  <li><strong>Day 2:</strong> Offer reveal</li>
  <li><strong>Day 3:</strong> Benefits and transformation</li>
  <li><strong>Day 4:</strong> Testimonials and social proof</li>
  <li><strong>Day 5:</strong> Common objections resolved</li>
  <li><strong>Day 6:</strong> Urgency — closing soon</li>
  <li><strong>Day 7:</strong> Last chance</li>
</ul>

<h4>With NotebookLM (Optional but Powerful)</h4>
<p>If you have prior research (niche articles, competitor analysis, customer feedback), upload to NotebookLM and ask: <em>"Summarize the 5 most common pain points of my audience and how my offer solves them."</em> Use this to create sharper messages.</p>

<h3>Step 3: Create the 5 Social Posts (1 hour)</h3>

<h4>With Community Manager Gem</h4>
<p>For each day (choose 5 days from your 7-day calendar), use this prompt in your Gem:</p>
<p><em>"Create Instagram post about [day''s theme] promoting [your offer]. Audience: [description]. Tone: [inspiring/educational/urgent depending on day]. Include caption, call-to-action, and 5 relevant hashtags. Suggest image description."</em></p>

<h4>With Nano Banana 2</h4>
<p>Take the image description suggested by the Gem and generate the visual in Google AI Studio or Flow. Adjust prompt if you need more control over colors, style, or composition.</p>

<p><strong>Download the 5 images.</strong> Save them with clear names: post_day1.png, post_day2.png, etc.</p>

<h3>Step 4: Create the Promotional Video (45 minutes)</h3>

<h4>With Veo 3 or Veo 3 Pro</h4>
<p>Decide video message. Usually, best moment is Day 3 (benefits and transformation). Write the script:</p>

<p><strong>Example script (30 seconds):</strong></p>
<ul>
  <li><strong>0-5 sec:</strong> Visual hook — "Dream of selling your own desserts?"</li>
  <li><strong>5-15 sec:</strong> Problem — "But don''t know where to start, or your recipes don''t come out professional"</li>
  <li><strong>15-25 sec:</strong> Solution — "In 30 days master 20 recipes people PAY to eat"</li>
  <li><strong>25-30 sec:</strong> CTA — "Link in bio — discount only until Sunday"</li>
</ul>

<p>Generate video with Veo 3 using prompts for each scene. If Veo generates 8-sec clips, create 3-4 clips and assemble in Google Photos, Canva, or CapCut (all have free versions).</p>

<p>Add background music from YouTube library (youtube.com/audiolibrary) and overlay text with key messages.</p>

<h3>Step 5: Write the 3-Email Sequence (30 minutes)</h3>

<h4>With Sales Copywriter Gem</h4>

<p><strong>Email 1 (Day 1):</strong> Welcome + Offer Introduction</p>
<p>Prompt: <em>"Write welcome email for [product] campaign. Warm and exciting tone. Introduce offer without hard selling. Goal: generate curiosity. 250 words max. Include subject line."</em></p>

<p><strong>Email 2 (Day 3):</strong> Benefits + Testimonials</p>
<p>Prompt: <em>"Campaign day 3 email. Focus on transformation [product] offers. Include 2 brief testimonials (make them realistic if you don''t have real ones). Tone: inspiring and aspirational. 300 words. Subject line."</em></p>

<p><strong>Email 3 (Day 6):</strong> Urgency + Close</p>
<p>Prompt: <em>"Final campaign email. Genuine urgency (closes in 24 hrs). Summarize benefits, guarantee, and social proof. Tone: urgent but not desperate. Clear CTA. 250 words. Persuasive subject line."</em></p>

<p>Save the 3 emails in Google Docs or your email marketing tool.</p>

<h3>Step 6: Set Up 1 Basic Automation (30 minutes)</h3>

<h4>Option A: Automatic Welcome Email (Zapier or Make)</h4>
<p>Simple flow:</p>
<ol>
  <li>New subscriber in Mailchimp/ConvertKit → Send welcome email (use Email 1 above)</li>
  <li>Wait 2 days → Send Email 2</li>
  <li>Wait 3 more days → Send Email 3</li>
</ol>

<h4>Option B: New Lead Notification (Google Workspace Studio)</h4>
<p>Flow:</p>
<ol>
  <li>New form completed in Google Forms → Record in Google Sheets</li>
  <li>Send notification to your email + WhatsApp</li>
  <li>Send automatic email to lead confirming you''ll contact soon</li>
</ol>

<p>Choose the automation with most impact on your business NOW.</p>

<h3>Step 7: Assemble and Schedule (30 minutes)</h3>

<p>Now that you have everything created:</p>
<ol>
  <li><strong>Posts:</strong> Upload to Meta Business Suite (Instagram + Facebook) or Buffer/Later to schedule</li>
  <li><strong>Video:</strong> Upload to Instagram Reels, TikTok, YouTube Shorts — publish same video on all 3</li>
  <li><strong>Emails:</strong> Load in your email platform (Mailchimp, ConvertKit, etc.) and schedule sends</li>
  <li><strong>Automation:</strong> Activate flow in Zapier/Make/Workspace Studio and test with test data</li>
</ol>

<h3>Final Deliverable</h3>
<p>Upon completing this project, you''ll have:</p>
<ul>
  <li>✅ 5 social media posts scheduled for the week</li>
  <li>✅ 1 promotional video published on 3 platforms</li>
  <li>✅ 3-email sequence loaded and scheduled</li>
  <li>✅ 1 automation active working 24/7</li>
  <li>✅ Campaign ready to generate REAL results</li>
</ul>

<h3>Share Your Work</h3>
<p>If you''re in the Sinsajo Creators community, share your campaign in the group. Seeing other students'' work will inspire you and you''ll receive constructive feedback. Plus, you''ll celebrate creating a complete professional campaign without spending a penny on creative team.</p>

<h3>Project Final Reflection</h3>
<p>After publishing your campaign, document:</p>
<ol>
  <li><strong>Total time invested:</strong> [hours]</li>
  <li><strong>Total cost:</strong> $0 (all free tools)</li>
  <li><strong>AI tools used:</strong> [list]</li>
  <li><strong>Biggest challenge:</strong> [what was hardest]</li>
  <li><strong>Biggest surprise:</strong> [what result impressed you most]</li>
  <li><strong>Next campaign:</strong> [what would you do differently next time]</li>
</ol>

<p>This project is your proof that you''re now capable of competing with businesses that have full marketing teams. The only difference is you do it faster, cheaper, and with total creative control.</p>',
    1,
    45
  );

  -- Lección 9.2
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Tu Plan de 30 Días',
    'Your 30-Day Plan',
    '<h2>De Alumna a Experta en 30 Días</h2>
<p>Completaste el curso. Tienes el conocimiento. Pero el conocimiento sin acción es solo teoría. Este plan de 30 días te convierte en <strong>practicante activa de IA</strong> — alguien que usa estas herramientas diariamente y obtiene resultados medibles. No se trata de perfección, sino de <em>consistencia</em>.</p>

<h3>El Principio de los 30 Días</h3>
<p>La neurociencia muestra que toma aproximadamente 30 días de práctica consistente para que un comportamiento nuevo se convierta en hábito. Después de 30 días usando IA diariamente, ya no será "algo que hago cuando tengo tiempo" — será parte natural de tu flujo de trabajo, como revisar emails o abrir tu agenda.</p>

<h3>Semana 1: Configuración y Primeros Pasos</h3>

<h4>Día 1-2: Activa Tus Herramientas Básicas</h4>
<p><strong>Tareas:</strong></p>
<ul>
  <li>Crea/verifica cuenta de Gemini (gemini.google.com)</li>
  <li>Accede a Google AI Studio (aistudio.google.com)</li>
  <li>Activa NotebookLM (notebooklm.google.com)</li>
  <li>Explora Flow (flow.google)</li>
</ul>
<p><strong>Ejercicio:</strong> Genera 1 imagen con Nano Banana y 1 resumen de artículo con NotebookLM. Solo para familiarizarte.</p>

<h4>Día 3-4: Crea Tus 5 Gems Esenciales</h4>
<p><strong>Tareas:</strong></p>
<ul>
  <li>Gem 1: Estratega de Marketing</li>
  <li>Gem 2: Community Manager</li>
  <li>Gem 3: Copywriter de Ventas</li>
  <li>Gem 4: Analista de Datos</li>
  <li>Gem 5: Servicio al Cliente</li>
</ul>
<p><strong>Ejercicio:</strong> Prueba cada Gem con 2 consultas reales de tu negocio. Ajusta sus instrucciones si las respuestas no son exactamente lo que necesitas.</p>

<h4>Día 5-7: Primera Automatización</h4>
<p><strong>Tareas:</strong></p>
<ul>
  <li>Elige 1 tarea repetitiva que te consume 30+ minutos semanales</li>
  <li>Crea cuenta en Zapier o Make (plan gratuito)</li>
  <li>Configura tu primer Zap/flujo simple</li>
  <li>Prueba con datos reales</li>
</ul>
<p><strong>Ejemplo:</strong> Nuevo suscriptor en formulario → Email de bienvenida automático → Registro en Google Sheets</p>

<p><strong>Meta de Semana 1:</strong> Todas las herramientas activas y funcionando. Primera automatización en producción.</p>

<h3>Semana 2: Creación de Contenido con IA</h3>

<h4>Día 8-10: Genera Contenido para 2 Semanas de Redes</h4>
<p><strong>Tareas:</strong></p>
<ul>
  <li>Usa Gem Community Manager para generar 10 ideas de posts</li>
  <li>Escribe captions para los 10 posts</li>
  <li>Genera 10 imágenes con Nano Banana (1 por post)</li>
  <li>Programa 5 posts para semana actual y 5 para próxima semana</li>
</ul>
<p><strong>Herramientas de programación gratuitas:</strong> Meta Business Suite, Buffer (plan gratuito), Later (plan gratuito)</p>

<h4>Día 11-12: Crea Tu Primer Video con Veo</h4>
<p><strong>Tareas:</strong></p>
<ul>
  <li>Elige 1 tema relevante para tu audiencia</li>
  <li>Escribe guion de 30-60 segundos</li>
  <li>Genera video con Veo 3</li>
  <li>Edita básico (música + texto) en Google Photos o Canva</li>
  <li>Publica en Instagram Reels, TikTok, YouTube Shorts</li>
</ul>

<h4>Día 13-14: Escribe Secuencia de Emails</h4>
<p><strong>Tareas:</strong></p>
<ul>
  <li>Usa Gem Copywriter para escribir secuencia de 3 emails (bienvenida, valor, oferta)</li>
  <li>Carga en tu herramienta de email marketing</li>
  <li>Configura automatización para nuevos suscriptores</li>
</ul>

<p><strong>Meta de Semana 2:</strong> 2 semanas de contenido creado. Primer video publicado. Secuencia de emails activa.</p>

<h3>Semana 3: Primera Campaña Multimedia</h3>

<h4>Día 15-17: Planifica Tu Campaña</h4>
<p><strong>Tareas:</strong></p>
<ul>
  <li>Define objetivo: ¿lanzamiento, promoción, generación de leads?</li>
  <li>Usa Gem Estratega para crear plan de 5 días</li>
  <li>Identifica qué contenido necesitas (posts, video, emails)</li>
</ul>

<h4>Día 18-21: Ejecuta Tu Campaña</h4>
<p><strong>Tareas:</strong></p>
<ul>
  <li>Crea 5 posts temáticos (imagen + caption) con Gem + Nano Banana</li>
  <li>Genera 1 video promocional con Veo</li>
  <li>Escribe 2-3 emails de campaña con Gem Copywriter</li>
  <li>Programa todo para los próximos 5 días</li>
  <li>Publica y monitorea resultados diariamente</li>
</ul>

<p><strong>Meta de Semana 3:</strong> Campaña multimedia completa ejecutada. Primeros resultados medibles (alcance, engagement, clics, conversiones).</p>

<h3>Semana 4: Optimización y Expansión</h3>

<h4>Día 22-24: Analiza Resultados</h4>
<p><strong>Tareas:</strong></p>
<ul>
  <li>Usa Gem Analista para interpretar métricas de tu campaña</li>
  <li>Identifica qué funcionó mejor (tipo de contenido, horarios, mensajes)</li>
  <li>Documenta 3 aprendizajes clave</li>
</ul>

<h4>Día 25-27: Automatización Avanzada</h4>
<p><strong>Tareas:</strong></p>
<ul>
  <li>Configura segunda automatización más compleja (ej: calificación de leads, cross-posting entre plataformas)</li>
  <li>O mejora tu automatización de Semana 1 agregando pasos</li>
</ul>

<h4>Día 28-30: Planifica Próximos 90 Días</h4>
<p><strong>Tareas:</strong></p>
<ul>
  <li>Usa Gemini para crear calendario de contenido de 90 días</li>
  <li>Identifica 2-3 agentes/automatizaciones que implementarás próximo mes</li>
  <li>Documenta tu stack de herramientas IA actual (qué usas para qué)</li>
</ul>

<p><strong>Meta de Semana 4:</strong> Sistema optimizado basado en datos. Plan de 90 días. Visión clara de próximos pasos.</p>

<h3>El Ritual Diario de IA (15 minutos)</h3>
<p>Para que esto se vuelva hábito, integra IA en tu rutina diaria. Aquí un ritual de 15 minutos que puedes hacer cada mañana:</p>

<h4>Ritual Matutino (15 min)</h4>
<ol>
  <li><strong>5 min - Revisión:</strong> Abre Gemini y pregunta: "Resume tendencias de [tu industria] de las últimas 24 horas"</li>
  <li><strong>5 min - Creación:</strong> Usa un Gem para generar 1 idea de contenido para hoy</li>
  <li><strong>5 min - Optimización:</strong> Revisa 1 automatización: ¿está funcionando? ¿Puede mejorarse?</li>
</ol>

<p>Este ritual te mantiene conectada con IA sin que consuma tu día.</p>

<h3>Checklist de Progreso Semanal</h3>
<p>Cada domingo, evalúa tu progreso:</p>

<p><strong>Semana 1:</strong></p>
<ul>
  <li>☐ Herramientas activadas</li>
  <li>☐ 5 Gems creados y probados</li>
  <li>☐ Primera automatización funcionando</li>
</ul>

<p><strong>Semana 2:</strong></p>
<ul>
  <li>☐ 10+ posts generados</li>
  <li>☐ Primer video publicado</li>
  <li>☐ Secuencia de emails activa</li>
</ul>

<p><strong>Semana 3:</strong></p>
<ul>
  <li>☐ Campaña multimedia completa ejecutada</li>
  <li>☐ Métricas documentadas</li>
</ul>

<p><strong>Semana 4:</strong></p>
<ul>
  <li>☐ Resultados analizados</li>
  <li>☐ Segunda automatización implementada</li>
  <li>☐ Plan de 90 días creado</li>
</ul>

<h3>Qué Esperar Después de 30 Días</h3>
<p>Basado en la experiencia de cientos de alumnas de Sinsajo Creators, aquí los resultados típicos después de 30 días de práctica consistente:</p>

<ul>
  <li><strong>Tiempo ahorrado:</strong> 6-10 horas semanales en promedio</li>
  <li><strong>Contenido creado:</strong> 3-5x más que antes (sin sacrificar calidad)</li>
  <li><strong>Confianza:</strong> Ya no sientes que la IA es "complicada" — es natural</li>
  <li><strong>Resultados de negocio:</strong> Aumento medible en alcance, engagement, y/o conversiones</li>
  <li><strong>Mentalidad:</strong> Pasas de "¿funcionará esto?" a "¿cómo puedo automatizar esto?"</li>
</ul>

<h3>El Compromiso de los 30 Días</h3>
<p>Haz este compromiso contigo misma:</p>

<p><em>"Me comprometo a usar herramientas de IA al menos 15 minutos diarios durante los próximos 30 días. No busco perfección, busco progreso. Cada día aprenderé algo nuevo y lo aplicaré a mi negocio. Al final de estos 30 días, habré transformado mi forma de trabajar."</em></p>

<p>Firma (mentalmente o escríbelo): _________________</p>

<p>Fecha de inicio: _________________</p>

<p>Fecha de culminación: _________________ (30 días después)</p>

<p>En la próxima y última lección, te conectamos con la comunidad Sinsajo Creators y los recursos para seguir creciendo más allá de este curso.</p>',
    '<h2>From Student to Expert in 30 Days</h2>
<p>You completed the course. You have the knowledge. But knowledge without action is just theory. This 30-day plan converts you into an <strong>active AI practitioner</strong> — someone who uses these tools daily and gets measurable results. It''s not about perfection, but about <em>consistency</em>.</p>

<h3>The 30-Day Principle</h3>
<p>Neuroscience shows it takes approximately 30 days of consistent practice for a new behavior to become habit. After 30 days using AI daily, it will no longer be "something I do when I have time" — it''ll be a natural part of your workflow, like checking emails or opening your calendar.</p>

<h3>Week 1: Setup and First Steps</h3>

<h4>Day 1-2: Activate Your Basic Tools</h4>
<p><strong>Tasks:</strong></p>
<ul>
  <li>Create/verify Gemini account (gemini.google.com)</li>
  <li>Access Google AI Studio (aistudio.google.com)</li>
  <li>Activate NotebookLM (notebooklm.google.com)</li>
  <li>Explore Flow (flow.google)</li>
</ul>
<p><strong>Exercise:</strong> Generate 1 image with Nano Banana and 1 article summary with NotebookLM. Just to familiarize yourself.</p>

<h4>Day 3-4: Create Your 5 Essential Gems</h4>
<p><strong>Tasks:</strong></p>
<ul>
  <li>Gem 1: Marketing Strategist</li>
  <li>Gem 2: Community Manager</li>
  <li>Gem 3: Sales Copywriter</li>
  <li>Gem 4: Data Analyst</li>
  <li>Gem 5: Customer Service</li>
</ul>
<p><strong>Exercise:</strong> Test each Gem with 2 real queries from your business. Adjust their instructions if responses aren''t exactly what you need.</p>

<h4>Day 5-7: First Automation</h4>
<p><strong>Tasks:</strong></p>
<ul>
  <li>Choose 1 repetitive task consuming 30+ minutes weekly</li>
  <li>Create account on Zapier or Make (free plan)</li>
  <li>Set up your first simple Zap/flow</li>
  <li>Test with real data</li>
</ul>
<p><strong>Example:</strong> New subscriber in form → Automatic welcome email → Registration in Google Sheets</p>

<p><strong>Week 1 Goal:</strong> All tools active and working. First automation in production.</p>

<h3>Week 2: Content Creation with AI</h3>

<h4>Day 8-10: Generate Content for 2 Weeks of Social</h4>
<p><strong>Tasks:</strong></p>
<ul>
  <li>Use Community Manager Gem to generate 10 post ideas</li>
  <li>Write captions for all 10 posts</li>
  <li>Generate 10 images with Nano Banana (1 per post)</li>
  <li>Schedule 5 posts for current week and 5 for next week</li>
</ul>
<p><strong>Free scheduling tools:</strong> Meta Business Suite, Buffer (free plan), Later (free plan)</p>

<h4>Day 11-12: Create Your First Video with Veo</h4>
<p><strong>Tasks:</strong></p>
<ul>
  <li>Choose 1 relevant topic for your audience</li>
  <li>Write 30-60 second script</li>
  <li>Generate video with Veo 3</li>
  <li>Basic edit (music + text) in Google Photos or Canva</li>
  <li>Publish on Instagram Reels, TikTok, YouTube Shorts</li>
</ul>

<h4>Day 13-14: Write Email Sequence</h4>
<p><strong>Tasks:</strong></p>
<ul>
  <li>Use Copywriter Gem to write 3-email sequence (welcome, value, offer)</li>
  <li>Load into your email marketing tool</li>
  <li>Set up automation for new subscribers</li>
</ul>

<p><strong>Week 2 Goal:</strong> 2 weeks of content created. First video published. Email sequence active.</p>

<h3>Week 3: First Multimedia Campaign</h3>

<h4>Day 15-17: Plan Your Campaign</h4>
<p><strong>Tasks:</strong></p>
<ul>
  <li>Define goal: launch, promotion, lead generation?</li>
  <li>Use Strategist Gem to create 5-day plan</li>
  <li>Identify what content you need (posts, video, emails)</li>
</ul>

<h4>Day 18-21: Execute Your Campaign</h4>
<p><strong>Tasks:</strong></p>
<ul>
  <li>Create 5 thematic posts (image + caption) with Gem + Nano Banana</li>
  <li>Generate 1 promotional video with Veo</li>
  <li>Write 2-3 campaign emails with Copywriter Gem</li>
  <li>Schedule everything for next 5 days</li>
  <li>Publish and monitor results daily</li>
</ul>

<p><strong>Week 3 Goal:</strong> Complete multimedia campaign executed. First measurable results (reach, engagement, clicks, conversions).</p>

<h3>Week 4: Optimization and Expansion</h3>

<h4>Day 22-24: Analyze Results</h4>
<p><strong>Tasks:</strong></p>
<ul>
  <li>Use Analyst Gem to interpret your campaign metrics</li>
  <li>Identify what worked best (content type, timing, messages)</li>
  <li>Document 3 key learnings</li>
</ul>

<h4>Day 25-27: Advanced Automation</h4>
<p><strong>Tasks:</strong></p>
<ul>
  <li>Set up second more complex automation (e.g., lead qualification, cross-posting between platforms)</li>
  <li>Or improve your Week 1 automation by adding steps</li>
</ul>

<h4>Day 28-30: Plan Next 90 Days</h4>
<p><strong>Tasks:</strong></p>
<ul>
  <li>Use Gemini to create 90-day content calendar</li>
  <li>Identify 2-3 agents/automations you''ll implement next month</li>
  <li>Document your current AI tool stack (what you use for what)</li>
</ul>

<p><strong>Week 4 Goal:</strong> System optimized based on data. 90-day plan. Clear vision of next steps.</p>

<h3>The Daily AI Ritual (15 minutes)</h3>
<p>To make this a habit, integrate AI into your daily routine. Here''s a 15-minute ritual you can do each morning:</p>

<h4>Morning Ritual (15 min)</h4>
<ol>
  <li><strong>5 min - Review:</strong> Open Gemini and ask: "Summarize [your industry] trends from last 24 hours"</li>
  <li><strong>5 min - Creation:</strong> Use a Gem to generate 1 content idea for today</li>
  <li><strong>5 min - Optimization:</strong> Review 1 automation: is it working? Can it be improved?</li>
</ol>

<p>This ritual keeps you connected with AI without consuming your day.</p>

<h3>Weekly Progress Checklist</h3>
<p>Every Sunday, evaluate your progress:</p>

<p><strong>Week 1:</strong></p>
<ul>
  <li>☐ Tools activated</li>
  <li>☐ 5 Gems created and tested</li>
  <li>☐ First automation working</li>
</ul>

<p><strong>Week 2:</strong></p>
<ul>
  <li>☐ 10+ posts generated</li>
  <li>☐ First video published</li>
  <li>☐ Email sequence active</li>
</ul>

<p><strong>Week 3:</strong></p>
<ul>
  <li>☐ Complete multimedia campaign executed</li>
  <li>☐ Metrics documented</li>
</ul>

<p><strong>Week 4:</strong></p>
<ul>
  <li>☐ Results analyzed</li>
  <li>☐ Second automation implemented</li>
  <li>☐ 90-day plan created</li>
</ul>

<h3>What to Expect After 30 Days</h3>
<p>Based on experience of hundreds of Sinsajo Creators students, here are typical results after 30 days of consistent practice:</p>

<ul>
  <li><strong>Time saved:</strong> 6-10 hours weekly on average</li>
  <li><strong>Content created:</strong> 3-5x more than before (without sacrificing quality)</li>
  <li><strong>Confidence:</strong> You no longer feel AI is "complicated" — it''s natural</li>
  <li><strong>Business results:</strong> Measurable increase in reach, engagement, and/or conversions</li>
  <li><strong>Mindset:</strong> You shift from "will this work?" to "how can I automate this?"</li>
</ul>

<h3>The 30-Day Commitment</h3>
<p>Make this commitment to yourself:</p>

<p><em>"I commit to using AI tools at least 15 minutes daily for the next 30 days. I''m not seeking perfection, I''m seeking progress. Each day I''ll learn something new and apply it to my business. At the end of these 30 days, I will have transformed my way of working."</em></p>

<p>Sign (mentally or write it): _________________</p>

<p>Start date: _________________</p>

<p>Completion date: _________________ (30 days later)</p>

<p>In the next and final lesson, we connect you with the Sinsajo Creators community and resources to keep growing beyond this course.</p>',
    2,
    20
  );

  -- Lección 9.3
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Comunidad Sinsajo y Próximos Pasos',
    'Sinsajo Community and Next Steps',
    '<h2>No Estás Sola en Este Viaje</h2>
<p>Completaste un curso de más de 40 lecciones sobre IA aplicada al marketing y negocios. Eso por sí solo es un logro enorme — la mayoría de las personas que empiezan cursos online nunca llegan al final. Pero aquí estás. <strong>Felicitaciones.</strong></p>

<p>Ahora viene la parte más importante: <em>convertir este conocimiento en resultados sostenibles</em>. Y para eso, necesitas dos cosas: <strong>comunidad</strong> y <strong>mentoría continua</strong>. Aquí es donde Sinsajo Creators entra como tu aliado de largo plazo.</p>

<h3>¿Qué es Sinsajo Creators?</h3>
<p>Sinsajo Creators es una <strong>comunidad y agencia especializada en agentes de IA para emprendedoras digitales</strong>. No somos una plataforma de cursos genéricos ni una consultoría corporativa gigante. Somos un equipo pequeño, enfocado, y profundamente comprometido con ayudar a mujeres emprendedoras a usar IA para escalar sus negocios sin perder su esencia humana.</p>

<h3>Lo Que Ofrecemos</h3>

<h4>1. Comunidad Activa (Gratuita)</h4>
<p>Al terminar este curso, automáticamente tienes acceso a nuestra comunidad privada donde:</p>
<ul>
  <li><strong>Compartes tus proyectos:</strong> Publica tus campañas, videos, automatizaciones y recibe feedback de otras alumnas</li>
  <li><strong>Haces preguntas:</strong> Tienes dudas técnicas sobre alguna herramienta? La comunidad y nuestro equipo responden</li>
  <li><strong>Te inspiras:</strong> Ver lo que otras emprendedoras están logrando con IA te motivará a seguir experimentando</li>
  <li><strong>Colaboras:</strong> Muchas alumnas han formado partnerships, compartido recursos, e incluso co-creado productos</li>
</ul>
<p><strong>Cómo unirte:</strong> [Link de Discord/Slack/Telegram se enviará por email después de completar el curso]</p>

<h4>2. Sesiones en Vivo Mensuales (Gratuitas)</h4>
<p>Cada mes hacemos 2 sesiones en vivo:</p>
<ul>
  <li><strong>Q&A Técnico (primer miércoles del mes):</strong> Trae tus preguntas sobre implementación, errores, o dudas específicas. Resolvemos en vivo.</li>
  <li><strong>Showcase de Casos (tercer miércoles del mes):</strong> Alumnas comparten casos reales de cómo usaron IA en sus negocios, con métricas y aprendizajes. Luego analizamos entre todas qué se puede replicar.</li>
</ul>
<p><strong>Cómo participar:</strong> Las invitaciones se envían por email a todas las alumnas del curso. Si no puedes asistir en vivo, se graba y comparte en la comunidad.</p>

<h4>3. Mentorías Personalizadas (Programa Pago)</h4>
<p>Para alumnas que quieren aceleración personalizada, ofrecemos mentoría 1-on-1 o en grupos pequeños:</p>
<ul>
  <li><strong>Mentoría Sprint (4 semanas):</strong> Implementamos 1 agente clave en tu negocio de principio a fin. Tú defines el objetivo (ej: automatizar gestión de leads), nosotros lo construimos contigo y te enseñamos a mantenerlo. Inversión: $497 USD.</li>
  <li><strong>Mentoría Growth (12 semanas):</strong> Construimos tu equipo digital completo de 3-5 agentes, optimizamos tu stack de herramientas, y te entrenamos para escalar autónomamente. Inversión: $1,497 USD.</li>
  <li><strong>Agencia Full-Service:</strong> Nosotros diseñamos, implementamos, y mantenemos tus agentes de IA mientras tú te enfocas en tu negocio. Planes desde $997/mes según complejidad.</li>
</ul>
<p><strong>Cómo aplicar:</strong> Agenda sesión de diagnóstico gratuita de 30 minutos en [link de Calendly]. Analizamos tu negocio y recomendamos el camino ideal.</p>

<h4>4. Recursos Exclusivos (Gratuitos para Alumnas)</h4>
<ul>
  <li><strong>Biblioteca de Prompts:</strong> 100+ prompts probados para Gemini, Gems, Nano Banana, Veo — optimizados para marketing y negocios</li>
  <li><strong>Templates de Automatización:</strong> Flujos listos para importar en Zapier/Make para casos comunes (gestión de leads, publicación de contenido, soporte al cliente)</li>
  <li><strong>Actualizaciones del Curso:</strong> Cuando Google lance nuevas herramientas (lo hace constantemente), agregamos lecciones bonus. Acceso de por vida sin costo adicional.</li>
</ul>

<h3>Próximos Talleres y Cursos Avanzados</h3>
<p>Basándonos en lo que la comunidad está pidiendo, estos son los próximos contenidos en desarrollo:</p>

<h4>Taller: Agentes de IA Conversacionales para E-commerce (Próximo: Q2 2026)</h4>
<p>Cómo implementar agentes que vendan 24/7 en tu sitio web, WhatsApp Business, y Messenger. Incluye casos de negocios que triplicaron conversión con agentes conversacionales.</p>

<h4>Curso Avanzado: Datos y Analytics con IA (Próximo: Q3 2026)</h4>
<p>Más allá de generar contenido: cómo usar IA para analizar comportamiento de clientes, predecir tendencias, y tomar decisiones estratégicas basadas en datos.</p>

<h4>Certificación Sinsajo: Especialista en Agentes IA (Próximo: Q4 2026)</h4>
<p>Programa intensivo de 8 semanas donde te certificas como implementadora de agentes de IA. Al graduarte, puedes ofrecer este servicio a otros negocios como freelancer o agencia.</p>

<h3>Cómo Sinsajo Creators Te Ayuda con Agentes para Tu Negocio Específico</h3>
<p>Cada negocio es único. Lo que funciona para una tienda online de productos físicos no funciona igual para una coach de negocios o una diseñadora gráfica. Por eso, nuestra especialidad es <strong>diseñar agentes a la medida</strong>.</p>

<h4>El Proceso de Implementación (Mentoría o Agencia)</h4>
<ol>
  <li><strong>Diagnóstico (sesión 1):</strong> Analizamos tu negocio, flujos de trabajo actuales, puntos de dolor, y oportunidades. Identificamos los 3 procesos con mayor ROI potencial si se automatizan.</li>
  <li><strong>Diseño (sesión 2-3):</strong> Diseñamos el flujo completo del agente: qué hace, cuándo actúa, qué decisiones toma, cuándo escala a humano. Tú apruebas antes de construir nada.</li>
  <li><strong>Construcción (semana 2-3):</strong> Implementamos el agente en tu stack de herramientas reales, lo probamos con casos de test, y refinamos hasta que funcione perfectamente.</li>
  <li><strong>Capacitación (sesión 4):</strong> Te enseñamos a monitorear, ajustar, y expandir el agente. Documentamos todo en un manual simple que puedes consultar cuando quieras.</li>
  <li><strong>Soporte (30 días):</strong> Después del lanzamiento, monitoreamos contigo por 30 días. Ajustamos lo que sea necesario hasta que estés 100% autónoma.</li>
</ol>

<h4>Ejemplos de Agentes que Hemos Implementado</h4>
<ul>
  <li><strong>Coach de negocios:</strong> Agente que califica leads de webinars, envía secuencia personalizada según respuestas, y agenda llamadas de venta solo con leads calientes. Resultado: 2.5x más citas agendadas, 40% menos no-shows.</li>
  <li><strong>Tienda de productos naturales:</strong> Agente que responde consultas en Instagram DM sobre ingredientes, usos, y envíos. Escala solo dudas complejas a la dueña. Resultado: tiempo de respuesta de 4 horas a 3 minutos, 18% aumento en ventas directas por DM.</li>
  <li><strong>Diseñadora gráfica freelance:</strong> Agente que genera propuestas de diseño automáticas basadas en brief del cliente, crea moodboards con IA, y programa seguimientos. Resultado: puede manejar 3x más clientes simultáneamente sin contratar asistente.</li>
</ul>

<h3>Tu Próximo Paso Inmediato</h3>
<p>No dejes que este conocimiento se quede en teoría. Aquí tus opciones de acción inmediata:</p>

<h4>Opción 1: Implementa Solo (Gratuito)</h4>
<ol>
  <li>Completa el plan de 30 días de la lección anterior</li>
  <li>Únete a la comunidad Sinsajo y comparte tu progreso semanalmente</li>
  <li>Asiste a sesiones en vivo mensuales para resolver dudas</li>
  <li>Usa los recursos gratuitos (prompts, templates) disponibles en la comunidad</li>
</ol>

<h4>Opción 2: Mentoría Acelerada (Pago)</h4>
<ol>
  <li>Agenda sesión de diagnóstico gratuita: [link de Calendly]</li>
  <li>En la sesión, definimos tu agente de mayor impacto</li>
  <li>Si decides continuar, empezamos implementación la semana siguiente</li>
  <li>En 4-12 semanas (según programa), tienes agentes funcionando y generas resultados medibles</li>
</ol>

<h4>Opción 3: Full-Service Agency (Pago)</h4>
<ol>
  <li>Agenda sesión de diagnóstico: [link de Calendly]</li>
  <li>Presentamos propuesta de agentes personalizados para tu negocio</li>
  <li>Si apruebas, nosotros construimos y mantenemos todo</li>
  <li>Tú solo revisas reportes mensuales y disfrutas los resultados</li>
</ol>

<h3>Mensaje Final: Esto es Solo el Comienzo</h3>
<p>La IA no es una moda pasajera. Es la mayor transformación tecnológica desde internet. En 2026, estamos en los primeros capítulos de esta historia. Las herramientas que aprendiste en este curso son poderosas hoy, pero serán 10x más poderosas en 12 meses.</p>

<p>Lo importante es que <strong>ya empezaste</strong>. Mientras otros siguen preguntándose "¿debería aprender sobre IA?", tú ya tienes agentes trabajando para ti, contenido generado con IA, y automatizaciones ahorrándote horas cada semana.</p>

<p>Sigue practicando. Sigue experimentando. Sigue compartiendo en la comunidad. Y recuerda: <em>no estás sola en este viaje</em>. Somos cientos de emprendedoras usando IA para construir negocios más libres, más rentables, y más humanos.</p>

<p><strong>Bienvenida a la comunidad Sinsajo Creators. El futuro de tu negocio comienza ahora.</strong></p>

<p>— El equipo de Sinsajo Creators 🔥</p>',
    '<h2>You Are Not Alone on This Journey</h2>
<p>You completed a course of over 40 lessons on AI applied to marketing and business. That alone is a huge achievement — most people who start online courses never reach the end. But here you are. <strong>Congratulations.</strong></p>

<p>Now comes the most important part: <em>converting this knowledge into sustainable results</em>. And for that, you need two things: <strong>community</strong> and <strong>ongoing mentorship</strong>. This is where Sinsajo Creators comes in as your long-term ally.</p>

<h3>What is Sinsajo Creators?</h3>
<p>Sinsajo Creators is a <strong>community and agency specialized in AI agents for digital female entrepreneurs</strong>. We''re not a generic course platform nor a giant corporate consultancy. We''re a small team, focused, and deeply committed to helping female entrepreneurs use AI to scale their businesses without losing their human essence.</p>

<h3>What We Offer</h3>

<h4>1. Active Community (Free)</h4>
<p>Upon finishing this course, you automatically have access to our private community where:</p>
<ul>
  <li><strong>Share your projects:</strong> Post your campaigns, videos, automations and receive feedback from other students</li>
  <li><strong>Ask questions:</strong> Have technical doubts about any tool? The community and our team respond</li>
  <li><strong>Get inspired:</strong> Seeing what other entrepreneurs are achieving with AI will motivate you to keep experimenting</li>
  <li><strong>Collaborate:</strong> Many students have formed partnerships, shared resources, and even co-created products</li>
</ul>
<p><strong>How to join:</strong> [Discord/Slack/Telegram link will be sent by email after completing the course]</p>

<h4>2. Monthly Live Sessions (Free)</h4>
<p>Each month we do 2 live sessions:</p>
<ul>
  <li><strong>Technical Q&A (first Wednesday of month):</strong> Bring your questions about implementation, errors, or specific doubts. We solve them live.</li>
  <li><strong>Case Showcase (third Wednesday of month):</strong> Students share real cases of how they used AI in their businesses, with metrics and learnings. Then we analyze together what can be replicated.</li>
</ul>
<p><strong>How to participate:</strong> Invitations are sent by email to all course students. If you can''t attend live, it''s recorded and shared in the community.</p>

<h4>3. Personalized Mentorships (Paid Program)</h4>
<p>For students who want personalized acceleration, we offer 1-on-1 or small group mentorship:</p>
<ul>
  <li><strong>Sprint Mentorship (4 weeks):</strong> We implement 1 key agent in your business from start to finish. You define the goal (e.g., automate lead management), we build it with you and teach you to maintain it. Investment: $497 USD.</li>
  <li><strong>Growth Mentorship (12 weeks):</strong> We build your complete digital team of 3-5 agents, optimize your tool stack, and train you to scale autonomously. Investment: $1,497 USD.</li>
  <li><strong>Full-Service Agency:</strong> We design, implement, and maintain your AI agents while you focus on your business. Plans from $997/month depending on complexity.</li>
</ul>
<p><strong>How to apply:</strong> Schedule free 30-minute diagnostic session at [Calendly link]. We analyze your business and recommend the ideal path.</p>

<h4>4. Exclusive Resources (Free for Students)</h4>
<ul>
  <li><strong>Prompt Library:</strong> 100+ tested prompts for Gemini, Gems, Nano Banana, Veo — optimized for marketing and business</li>
  <li><strong>Automation Templates:</strong> Ready-to-import flows for Zapier/Make for common cases (lead management, content publishing, customer support)</li>
  <li><strong>Course Updates:</strong> When Google launches new tools (it does constantly), we add bonus lessons. Lifetime access at no additional cost.</li>
</ul>

<h3>Upcoming Workshops and Advanced Courses</h3>
<p>Based on what the community is requesting, these are the next contents in development:</p>

<h4>Workshop: Conversational AI Agents for E-commerce (Next: Q2 2026)</h4>
<p>How to implement agents that sell 24/7 on your website, WhatsApp Business, and Messenger. Includes cases of businesses that tripled conversion with conversational agents.</p>

<h4>Advanced Course: Data and Analytics with AI (Next: Q3 2026)</h4>
<p>Beyond generating content: how to use AI to analyze customer behavior, predict trends, and make strategic data-based decisions.</p>

<h4>Sinsajo Certification: AI Agent Specialist (Next: Q4 2026)</h4>
<p>Intensive 8-week program where you become certified as an AI agent implementer. Upon graduation, you can offer this service to other businesses as freelancer or agency.</p>

<h3>How Sinsajo Creators Helps with Agents for Your Specific Business</h3>
<p>Every business is unique. What works for an online physical products store doesn''t work the same for a business coach or graphic designer. That''s why our specialty is <strong>designing custom agents</strong>.</p>

<h4>The Implementation Process (Mentorship or Agency)</h4>
<ol>
  <li><strong>Diagnosis (session 1):</strong> We analyze your business, current workflows, pain points, and opportunities. We identify the 3 processes with highest potential ROI if automated.</li>
  <li><strong>Design (session 2-3):</strong> We design the complete agent flow: what it does, when it acts, what decisions it makes, when it escalates to human. You approve before we build anything.</li>
  <li><strong>Construction (week 2-3):</strong> We implement the agent in your real tool stack, test it with test cases, and refine until it works perfectly.</li>
  <li><strong>Training (session 4):</strong> We teach you to monitor, adjust, and expand the agent. We document everything in a simple manual you can consult anytime.</li>
  <li><strong>Support (30 days):</strong> After launch, we monitor with you for 30 days. We adjust whatever is necessary until you''re 100% autonomous.</li>
</ol>

<h4>Examples of Agents We''ve Implemented</h4>
<ul>
  <li><strong>Business coach:</strong> Agent that qualifies webinar leads, sends personalized sequence based on responses, and schedules sales calls only with hot leads. Result: 2.5x more appointments scheduled, 40% fewer no-shows.</li>
  <li><strong>Natural products store:</strong> Agent that answers Instagram DM queries about ingredients, uses, and shipping. Only escalates complex doubts to owner. Result: response time from 4 hours to 3 minutes, 18% increase in direct DM sales.</li>
  <li><strong>Freelance graphic designer:</strong> Agent that generates automatic design proposals based on client brief, creates moodboards with AI, and schedules follow-ups. Result: can handle 3x more simultaneous clients without hiring assistant.</li>
</ul>

<h3>Your Next Immediate Step</h3>
<p>Don''t let this knowledge stay as theory. Here are your immediate action options:</p>

<h4>Option 1: Implement Alone (Free)</h4>
<ol>
  <li>Complete the 30-day plan from previous lesson</li>
  <li>Join Sinsajo community and share your progress weekly</li>
  <li>Attend monthly live sessions to resolve doubts</li>
  <li>Use free resources (prompts, templates) available in community</li>
</ol>

<h4>Option 2: Accelerated Mentorship (Paid)</h4>
<ol>
  <li>Schedule free diagnostic session: [Calendly link]</li>
  <li>In session, we define your highest-impact agent</li>
  <li>If you decide to continue, we start implementation next week</li>
  <li>In 4-12 weeks (depending on program), you have agents working and generate measurable results</li>
</ol>

<h4>Option 3: Full-Service Agency (Paid)</h4>
<ol>
  <li>Schedule diagnostic session: [Calendly link]</li>
  <li>We present proposal for customized agents for your business</li>
  <li>If you approve, we build and maintain everything</li>
  <li>You just review monthly reports and enjoy results</li>
</ol>

<h3>Final Message: This is Just the Beginning</h3>
<p>AI is not a passing fad. It''s the biggest technological transformation since the internet. In 2026, we''re in the first chapters of this story. The tools you learned in this course are powerful today, but will be 10x more powerful in 12 months.</p>

<p>The important thing is that <strong>you already started</strong>. While others keep wondering "should I learn about AI?", you already have agents working for you, AI-generated content, and automations saving you hours each week.</p>

<p>Keep practicing. Keep experimenting. Keep sharing in the community. And remember: <em>you''re not alone on this journey</em>. We''re hundreds of female entrepreneurs using AI to build freer, more profitable, and more human businesses.</p>

<p><strong>Welcome to the Sinsajo Creators community. The future of your business starts now.</strong></p>

<p>— The Sinsajo Creators team 🔥</p>',
    3,
    15
  );

  RAISE NOTICE 'Módulo 9 (Tu Plan de Acción) completado: 4 lecciones insertadas';
  RAISE NOTICE '=== SEED COMPLETADO: IA para Marketing y Negocios - Módulos 6 (parcial), 7, 8, 9 ===';

END $$;

COMMIT;
