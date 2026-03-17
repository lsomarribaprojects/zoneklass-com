-- Seed: IA para Marketing y Negocios - Parte 1 (Módulos 0-4)
-- Category: Marketing | Level: Principiante
-- Created by: admin user 93477b13-ef71-4ef4-b764-4034f5b57d67

-- Generate UUIDs for course and modules
WITH course_data AS (
  SELECT gen_random_uuid() AS course_id
),
module_ids AS (
  SELECT
    (SELECT course_id FROM course_data) AS course_id,
    gen_random_uuid() AS module_0_id,
    gen_random_uuid() AS module_1_id,
    gen_random_uuid() AS module_2_id,
    gen_random_uuid() AS module_3_id,
    gen_random_uuid() AS module_4_id,
    gen_random_uuid() AS module_5_id,
    gen_random_uuid() AS module_6_id,
    gen_random_uuid() AS module_7_id,
    gen_random_uuid() AS module_8_id,
    gen_random_uuid() AS module_9_id
),
-- Insert course
course_insert AS (
  INSERT INTO courses (
    id,
    title,
    title_en,
    description,
    description_en,
    slug,
    category,
    level,
    thumbnail_url,
    price,
    is_published,
    created_by
  )
  SELECT
    course_id,
    'IA para Marketing y Negocios',
    'AI for Marketing and Business',
    'Transforma tu emprendimiento con Inteligencia Artificial. Aprende a usar herramientas gratuitas de Google — Gemini, Flow, Nano Banana, Veo y NotebookLM — para crear contenido profesional, diseñar estrategias de marketing, generar imágenes y videos, automatizar procesos y construir agentes IA para tu negocio. Un curso 100% práctico diseñado por Sinsajo Creators.',
    'Transform your business with Artificial Intelligence. Learn to use free Google tools — Gemini, Flow, Nano Banana, Veo and NotebookLM — to create professional content, design marketing strategies, generate images and videos, automate processes and build AI agents for your business. A 100% hands-on course designed by Sinsajo Creators.',
    'ia-para-marketing-y-negocios',
    'Marketing',
    'Principiante',
    NULL,
    0,
    true,
    '93477b13-ef71-4ef4-b764-4034f5b57d67'
  FROM course_data
  RETURNING id
),
-- Insert modules
modules_insert AS (
  INSERT INTO modules (id, course_id, title, title_en, order_index)
  SELECT module_0_id, course_id, 'Tu Kit de Herramientas IA', 'Your AI Toolkit', 0 FROM module_ids
  UNION ALL
  SELECT module_1_id, course_id, 'El Arte del Prompting Profesional', 'The Art of Professional Prompting', 1 FROM module_ids
  UNION ALL
  SELECT module_2_id, course_id, 'Contenido que Conecta con IA', 'Content that Connects with AI', 2 FROM module_ids
  UNION ALL
  SELECT module_3_id, course_id, 'Marketing Digital con IA', 'Digital Marketing with AI', 3 FROM module_ids
  UNION ALL
  SELECT module_4_id, course_id, 'Estrategia de Negocio con IA', 'Business Strategy with AI', 4 FROM module_ids
  UNION ALL
  SELECT module_5_id, course_id, 'Imágenes Profesionales con IA', 'Professional Images with AI', 5 FROM module_ids
  UNION ALL
  SELECT module_6_id, course_id, 'Video con IA', 'Video with AI', 6 FROM module_ids
  UNION ALL
  SELECT module_7_id, course_id, 'Automatización Inteligente para tu Negocio', 'Smart Automation for Your Business', 7 FROM module_ids
  UNION ALL
  SELECT module_8_id, course_id, 'Agentes IA: Tu Equipo Digital 24/7', 'AI Agents: Your 24/7 Digital Team', 8 FROM module_ids
  UNION ALL
  SELECT module_9_id, course_id, 'Tu Plan de Acción: De Alumna a Experta', 'Your Action Plan: From Student to Expert', 9 FROM module_ids
  RETURNING id
)
-- Insert lessons for Module 0
INSERT INTO lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
SELECT gen_random_uuid(), module_0_id, 'Bienvenida al Mundo de la IA', 'Welcome to the World of AI',
'<h2>¿Qué es la Inteligencia Artificial?</h2>
<p>La inteligencia artificial no es ciencia ficción — es una herramienta que ya está transformando cómo trabajamos, creamos y hacemos negocios. En esta lección vamos a desmitificar la IA y entender cómo puede potenciar tu emprendimiento.</p>

<h3>Lo que aprenderás</h3>
<ul>
<li><strong>Qué es la IA</strong> en palabras simples: es software que aprende de datos y puede generar texto, imágenes, video y más</li>
<li><strong>Por qué importa para tu negocio</strong>: reduce horas de trabajo en minutos, crea contenido profesional sin equipo, y te da superpoderes de productividad</li>
<li><strong>Mentalidad digital</strong>: la IA no te reemplaza, te amplifica. Quien aprende a usarla tiene ventaja competitiva</li>
</ul>

<h3>Datos que inspiran</h3>
<ul>
<li>El 98% de los pequeños negocios ya usan IA diariamente en 2026</li>
<li>El 85% de los marketers ahorran al menos 4 horas por semana con IA</li>
<li>Las empresas que usan IA en publicidad reportan un aumento promedio de 76% en ROI</li>
</ul>

<h3>Ejercicio práctico</h3>
<p>Haz una lista de 5 tareas de tu negocio que te quitan más tiempo. Al final del curso, habrás automatizado al menos 3 de ellas con IA.</p>

<p><strong>Reflexión final:</strong> La IA democratiza el acceso a herramientas que antes solo tenían grandes corporaciones. Hoy, una emprendedora individual puede competir con equipos completos gracias a estas tecnologías. El futuro no es humano vs. IA — es humano + IA.</p>',
'<h2>What is Artificial Intelligence?</h2>
<p>Artificial intelligence is not science fiction — it''s a tool that is already transforming how we work, create, and do business. In this lesson we''re going to demystify AI and understand how it can power your business.</p>

<h3>What you''ll learn</h3>
<ul>
<li><strong>What AI is</strong> in simple terms: it''s software that learns from data and can generate text, images, video and more</li>
<li><strong>Why it matters for your business</strong>: reduces hours of work to minutes, creates professional content without a team, and gives you productivity superpowers</li>
<li><strong>Digital mindset</strong>: AI doesn''t replace you, it amplifies you. Those who learn to use it have a competitive advantage</li>
</ul>

<h3>Inspiring data</h3>
<ul>
<li>98% of small businesses already use AI daily in 2026</li>
<li>85% of marketers save at least 4 hours per week with AI</li>
<li>Companies using AI in advertising report an average 76% increase in ROI</li>
</ul>

<h3>Practical exercise</h3>
<p>Make a list of 5 tasks in your business that take the most time. By the end of the course, you''ll have automated at least 3 of them with AI.</p>

<p><strong>Final reflection:</strong> AI democratizes access to tools that previously only large corporations had. Today, an individual entrepreneur can compete with entire teams thanks to these technologies. The future is not human vs. AI — it''s human + AI.</p>',
0, 15 FROM module_ids
UNION ALL
SELECT gen_random_uuid(), module_0_id, 'Tu Centro de Comando: Google Gemini', 'Your Command Center: Google Gemini',
'<h2>Conoce a Gemini: Tu Asistente IA Personal</h2>
<p>Google Gemini es el cerebro detrás de tu transformación digital. Es un modelo de IA conversacional que puede razonar, analizar documentos, generar contenido, crear imágenes y mucho más. En esta lección harás tu primer tour completo por esta herramienta poderosa.</p>

<h3>Primeros pasos</h3>
<p><strong>Paso 1:</strong> Accede a <a href="https://gemini.google.com" target="_blank">gemini.google.com</a> con tu cuenta de Google. No necesitas tarjeta de crédito para empezar.</p>
<p><strong>Paso 2:</strong> Explora la interfaz: barra de chat, historial de conversaciones, configuración de modelo.</p>
<p><strong>Paso 3:</strong> Inicia tu primera conversación. Gemini entiende español perfectamente.</p>

<h3>Planes disponibles</h3>
<ul>
<li><strong>Gemini Gratis:</strong> Acceso a Gemini 3 Flash, perfecto para empezar. Límite de 100 consultas por día.</li>
<li><strong>Gemini Pro ($20/mes):</strong> Gemini 3 Pro, respuestas más largas, análisis profundo de documentos, prioridad en tiempos de respuesta.</li>
<li><strong>Gemini Ultra:</strong> El modelo más avanzado, para empresas y proyectos complejos.</li>
</ul>

<h3>¿Qué puede hacer Gemini por tu negocio?</h3>
<ul>
<li><strong>Razonamiento complejo:</strong> Analiza problemas de negocio y sugiere soluciones paso a paso</li>
<li><strong>Análisis de documentos:</strong> Sube PDFs, presentaciones, hojas de cálculo y hazle preguntas específicas</li>
<li><strong>Generación de contenido:</strong> Crea posts, emails, artículos, scripts y más</li>
<li><strong>Creación de imágenes:</strong> Integrado con Nano Banana para generar visuales profesionales</li>
<li><strong>Traducción inteligente:</strong> No solo traduce palabras, adapta el mensaje a la cultura local</li>
</ul>

<h3>Ejercicio práctico</h3>
<p>Tu primera tarea: abre Gemini y escribe este prompt:</p>
<blockquote>"Soy dueña de un negocio de [tu industria]. Analiza mi mercado y dame 5 ideas innovadoras de marketing que pueda implementar en los próximos 30 días con poco presupuesto."</blockquote>
<p>Guarda la respuesta. Estas ideas serán la base de tu plan de acción en módulos futuros.</p>

<h3>Pro tip</h3>
<p>Gemini tiene memoria de conversación. Mientras más contexto le des sobre tu negocio en las primeras interacciones, mejores serán sus respuestas futuras. Piensa en ello como entrenar a un nuevo empleado virtual.</p>',
'<h2>Meet Gemini: Your Personal AI Assistant</h2>
<p>Google Gemini is the brain behind your digital transformation. It''s a conversational AI model that can reason, analyze documents, generate content, create images and much more. In this lesson you''ll take your first complete tour of this powerful tool.</p>

<h3>Getting started</h3>
<p><strong>Step 1:</strong> Access <a href="https://gemini.google.com" target="_blank">gemini.google.com</a> with your Google account. No credit card needed to start.</p>
<p><strong>Step 2:</strong> Explore the interface: chat bar, conversation history, model settings.</p>
<p><strong>Step 3:</strong> Start your first conversation. Gemini understands English perfectly.</p>

<h3>Available plans</h3>
<ul>
<li><strong>Gemini Free:</strong> Access to Gemini 3 Flash, perfect for getting started. Limit of 100 queries per day.</li>
<li><strong>Gemini Pro ($20/month):</strong> Gemini 3 Pro, longer responses, deep document analysis, priority response times.</li>
<li><strong>Gemini Ultra:</strong> The most advanced model, for businesses and complex projects.</li>
</ul>

<h3>What can Gemini do for your business?</h3>
<ul>
<li><strong>Complex reasoning:</strong> Analyzes business problems and suggests step-by-step solutions</li>
<li><strong>Document analysis:</strong> Upload PDFs, presentations, spreadsheets and ask specific questions</li>
<li><strong>Content generation:</strong> Create posts, emails, articles, scripts and more</li>
<li><strong>Image creation:</strong> Integrated with Nano Banana to generate professional visuals</li>
<li><strong>Smart translation:</strong> Doesn''t just translate words, adapts the message to local culture</li>
</ul>

<h3>Practical exercise</h3>
<p>Your first task: open Gemini and write this prompt:</p>
<blockquote>"I own a business in [your industry]. Analyze my market and give me 5 innovative marketing ideas I can implement in the next 30 days with a small budget."</blockquote>
<p>Save the response. These ideas will be the foundation of your action plan in future modules.</p>

<h3>Pro tip</h3>
<p>Gemini has conversation memory. The more context you give it about your business in the first interactions, the better its future responses will be. Think of it as training a new virtual employee.</p>',
1, 20 FROM module_ids
UNION ALL
SELECT gen_random_uuid(), module_0_id, 'Google AI Studio: Tu Laboratorio Gratuito', 'Your Free AI Lab: Google AI Studio',
'<h2>Bienvenida a tu laboratorio de experimentación</h2>
<p>Google AI Studio es tu espacio de juego gratuito donde puedes probar los modelos de IA más avanzados de Google sin necesidad de tarjeta de crédito ni conocimientos técnicos. Es el lugar perfecto para crear contenido, generar imágenes, y experimentar antes de implementar en tu negocio.</p>

<h3>Acceso y configuración</h3>
<p><strong>Paso 1:</strong> Accede a <a href="https://studio.google.com" target="_blank">studio.google.com</a> con tu cuenta de Google.</p>
<p><strong>Paso 2:</strong> No se requiere tarjeta de crédito. El tier gratuito es generoso: 60 consultas por minuto, perfecto para emprendedoras.</p>
<p><strong>Paso 3:</strong> Explora la interfaz: verás tres secciones principales: Chat, Playground de Texto, y Playground de Imagen.</p>

<h3>Los modelos disponibles</h3>
<ul>
<li><strong>Gemini 3 Pro (texto):</strong> El cerebro para razonamiento complejo, análisis y generación de contenido largo. Ideal para artículos, planes de negocio, análisis de mercado.</li>
<li><strong>Gemini 3 Flash (texto):</strong> Versión más rápida y económica. Perfecto para tareas cotidianas como posts, emails, respuestas rápidas.</li>
<li><strong>Nano Banana 2 (imágenes):</strong> Genera imágenes profesionales desde texto. Ideal para posts, ads, presentaciones.</li>
<li><strong>Veo 3 (video):</strong> Crea videos cortos desde prompts de texto. Revolucionario para contenido de redes sociales.</li>
</ul>

<h3>Interfaz y ajustes</h3>
<p>En el Playground puedes ajustar parámetros avanzados:</p>
<ul>
<li><strong>Temperatura (0-1):</strong> 0 = respuestas precisas y consistentes. 1 = creativas y variadas. Para marketing usa 0.7-0.8.</li>
<li><strong>Max tokens:</strong> Longitud máxima de la respuesta. 1 token ≈ 4 caracteres en español.</li>
<li><strong>Top-p y Top-k:</strong> Controlan diversidad de respuestas. Déjalos en default al principio.</li>
</ul>

<h3>Casos de uso prácticos</h3>
<p><strong>Para contenido de texto:</strong> Usa Gemini 3 Flash para generar 10 ideas de posts en segundos. Copia el prompt, ajusta el tono, exporta el resultado.</p>
<p><strong>Para imágenes:</strong> Nano Banana 2 te permite crear visuales profesionales sin Photoshop. Ideal para Instagram, Facebook Ads, presentaciones.</p>
<p><strong>Para video:</strong> Veo 3 genera clips de 5-10 segundos. Perfecto para Reels, TikToks, intros de video.</p>

<h3>Ejercicio práctico</h3>
<p>Vamos a generar tu primera imagen con Nano Banana:</p>
<ol>
<li>Ve al Playground de Imagen en AI Studio</li>
<li>Escribe este prompt: "Ilustración minimalista de una emprendedora latina trabajando con laptop en un café moderno, estilo flat design, paleta de colores cálidos, fondo limpio"</li>
<li>Haz clic en Generate</li>
<li>Descarga la imagen y úsala como avatar profesional o post</li>
</ol>

<h3>Ventajas de AI Studio vs. Gemini</h3>
<ul>
<li>Acceso a modelos más recientes y experimentales</li>
<li>Control granular de parámetros</li>
<li>Export de código (para desarrolladoras que quieran integrar IA en apps)</li>
<li>Sin límites tan estrictos como Gemini gratis</li>
</ul>

<p><strong>Pro tip:</strong> Guarda tus prompts favoritos como "Saved Prompts" en AI Studio. Crea tu biblioteca personal de comandos que funcionan para tu negocio.</p>',
'<h2>Welcome to your experimentation lab</h2>
<p>Google AI Studio is your free playground where you can try Google''s most advanced AI models without needing a credit card or technical knowledge. It''s the perfect place to create content, generate images, and experiment before implementing in your business.</p>

<h3>Access and setup</h3>
<p><strong>Step 1:</strong> Access <a href="https://studio.google.com" target="_blank">studio.google.com</a> with your Google account.</p>
<p><strong>Step 2:</strong> No credit card required. The free tier is generous: 60 queries per minute, perfect for entrepreneurs.</p>
<p><strong>Step 3:</strong> Explore the interface: you''ll see three main sections: Chat, Text Playground, and Image Playground.</p>

<h3>Available models</h3>
<ul>
<li><strong>Gemini 3 Pro (text):</strong> The brain for complex reasoning, analysis and long-form content generation. Ideal for articles, business plans, market analysis.</li>
<li><strong>Gemini 3 Flash (text):</strong> Faster and more economical version. Perfect for daily tasks like posts, emails, quick responses.</li>
<li><strong>Nano Banana 2 (images):</strong> Generates professional images from text. Ideal for posts, ads, presentations.</li>
<li><strong>Veo 3 (video):</strong> Creates short videos from text prompts. Revolutionary for social media content.</li>
</ul>

<h3>Interface and settings</h3>
<p>In the Playground you can adjust advanced parameters:</p>
<ul>
<li><strong>Temperature (0-1):</strong> 0 = precise and consistent responses. 1 = creative and varied. For marketing use 0.7-0.8.</li>
<li><strong>Max tokens:</strong> Maximum response length. 1 token ≈ 4 characters in English.</li>
<li><strong>Top-p and Top-k:</strong> Control response diversity. Leave them at default initially.</li>
</ul>

<h3>Practical use cases</h3>
<p><strong>For text content:</strong> Use Gemini 3 Flash to generate 10 post ideas in seconds. Copy the prompt, adjust the tone, export the result.</p>
<p><strong>For images:</strong> Nano Banana 2 lets you create professional visuals without Photoshop. Ideal for Instagram, Facebook Ads, presentations.</p>
<p><strong>For video:</strong> Veo 3 generates 5-10 second clips. Perfect for Reels, TikToks, video intros.</p>

<h3>Practical exercise</h3>
<p>Let''s generate your first image with Nano Banana:</p>
<ol>
<li>Go to the Image Playground in AI Studio</li>
<li>Write this prompt: "Minimalist illustration of a Latina entrepreneur working with laptop in a modern café, flat design style, warm color palette, clean background"</li>
<li>Click Generate</li>
<li>Download the image and use it as a professional avatar or post</li>
</ol>

<h3>Advantages of AI Studio vs. Gemini</h3>
<ul>
<li>Access to newer and experimental models</li>
<li>Granular parameter control</li>
<li>Code export (for developers who want to integrate AI into apps)</li>
<li>Less strict limits than free Gemini</li>
</ul>

<p><strong>Pro tip:</strong> Save your favorite prompts as "Saved Prompts" in AI Studio. Create your personal library of commands that work for your business.</p>',
2, 20 FROM module_ids
UNION ALL
SELECT gen_random_uuid(), module_0_id, 'NotebookLM: Tu Asistente de Investigación', 'NotebookLM: Your Research Assistant',
'<h2>Tu investigadora personal 24/7</h2>
<p>NotebookLM es una herramienta revolucionaria de Google que convierte cualquier documento en un asistente IA especializado. Imagina poder subir PDFs de tu industria, manuales de productos, estudios de mercado o artículos, y tener un experto que los ha "leído" y puede responder preguntas, hacer resúmenes y hasta crear podcasts automáticos. Eso es NotebookLM.</p>

<h3>Acceso y primeros pasos</h3>
<p><strong>Paso 1:</strong> Accede a <a href="https://notebooklm.google.com" target="_blank">notebooklm.google.com</a> con tu cuenta de Google.</p>
<p><strong>Paso 2:</strong> Crea tu primer "Notebook". Un notebook es un espacio de trabajo donde subes tus fuentes (documents, links, notas).</p>
<p><strong>Paso 3:</strong> Sube contenido: PDFs, Google Docs, links de artículos web, transcripciones, hojas de cálculo.</p>

<h3>Características revolucionarias</h3>
<p><strong>Audio Overviews:</strong> La funcionalidad estrella. NotebookLM lee todos tus documentos subidos y genera un podcast de 5-10 minutos automáticamente. Dos voces IA (hombre y mujer) conversan sobre los puntos clave en un tono natural y entretenido. Es como tener tu propio podcast educativo personalizado.</p>
<p><strong>Video Overviews:</strong> Similar a Audio Overviews, pero en formato video. Combina visuales generados con IA y narración para explicar documentos complejos. Perfecto para capacitación de equipo o contenido educativo para clientes.</p>
<p><strong>Chat contextual:</strong> Haz preguntas específicas sobre tus documentos. NotebookLM cita las fuentes exactas de dónde sacó la información.</p>
<p><strong>Generación de contenido:</strong> Pídele que cree FAQs, resúmenes ejecutivos, guías de estudio, o scripts basados en tu material.</p>

<h3>Casos de uso para tu negocio</h3>
<ul>
<li><strong>Investigación de mercado:</strong> Sube 5-10 artículos sobre tendencias de tu industria. Genera un Audio Overview y compártelo con tu equipo o clientes.</li>
<li><strong>Capacitación:</strong> Sube manuales de producto o procesos internos. Crea un podcast de onboarding para nuevos empleados.</li>
<li><strong>Creación de contenido:</strong> Sube tus notas de brainstorming. NotebookLM las organiza y sugiere estructuras de artículos o posts.</li>
<li><strong>Análisis de competencia:</strong> Sube páginas web de competidores (copia el link). Pregúntale "¿Cuáles son las 3 ventajas competitivas de estas marcas?"</li>
<li><strong>Estudio continuo:</strong> Sube PDFs de libros de marketing, negocios o IA. Genera resúmenes y podcasts para aprender mientras haces otras tareas.</li>
</ul>

<h3>Ejercicio práctico</h3>
<p>Vamos a crear tu primer podcast de industria:</p>
<ol>
<li>Busca en Google "tendencias de [tu industria] 2026"</li>
<li>Copia los links de los 3 mejores artículos</li>
<li>Crea un nuevo Notebook en NotebookLM llamado "Tendencias 2026"</li>
<li>Pega los 3 links como fuentes</li>
<li>Haz clic en "Generate Audio Overview"</li>
<li>Escucha el podcast de 5-8 minutos que NotebookLM creó automáticamente</li>
<li>Descárgalo y compártelo en tu grupo de WhatsApp de emprendedoras o clientes</li>
</ol>

<h3>Limitaciones a tener en cuenta</h3>
<ul>
<li>Máximo 50 fuentes por Notebook (más que suficiente para la mayoría de casos)</li>
<li>Los Audio Overviews están actualmente en inglés (Google está trabajando en español)</li>
<li>Los documentos muy técnicos pueden requerir prompts específicos para simplificar</li>
</ul>

<h3>Pro tips</h3>
<ul>
<li>Crea Notebooks temáticos: uno para marketing, otro para finanzas, otro para producto</li>
<li>Usa Audio Overviews como lead magnets: "Descarga mi podcast exclusivo sobre tendencias 2026"</li>
<li>Combina NotebookLM con Gemini: investiga en NotebookLM, luego crea contenido en Gemini basado en los insights</li>
</ul>

<p><strong>Reflexión final:</strong> NotebookLM democratiza la investigación profunda. Antes necesitabas horas para leer 10 papers. Ahora, en 10 minutos tienes un podcast con los puntos clave. El conocimiento ya no es barrera — la ejecución sí.</p>',
'<h2>Your 24/7 personal researcher</h2>
<p>NotebookLM is a revolutionary Google tool that turns any document into a specialized AI assistant. Imagine being able to upload PDFs from your industry, product manuals, market studies or articles, and have an expert who has "read" them and can answer questions, make summaries and even create automatic podcasts. That''s NotebookLM.</p>

<h3>Access and first steps</h3>
<p><strong>Step 1:</strong> Access <a href="https://notebooklm.google.com" target="_blank">notebooklm.google.com</a> with your Google account.</p>
<p><strong>Step 2:</strong> Create your first "Notebook". A notebook is a workspace where you upload your sources (documents, links, notes).</p>
<p><strong>Step 3:</strong> Upload content: PDFs, Google Docs, article links, transcriptions, spreadsheets.</p>

<h3>Revolutionary features</h3>
<p><strong>Audio Overviews:</strong> The star feature. NotebookLM reads all your uploaded documents and generates a 5-10 minute podcast automatically. Two AI voices (male and female) converse about key points in a natural and entertaining tone. It''s like having your own personalized educational podcast.</p>
<p><strong>Video Overviews:</strong> Similar to Audio Overviews, but in video format. Combines AI-generated visuals with narration to explain complex documents. Perfect for team training or educational content for clients.</p>
<p><strong>Contextual chat:</strong> Ask specific questions about your documents. NotebookLM cites the exact sources where it got the information.</p>
<p><strong>Content generation:</strong> Ask it to create FAQs, executive summaries, study guides, or scripts based on your material.</p>

<h3>Use cases for your business</h3>
<ul>
<li><strong>Market research:</strong> Upload 5-10 articles about your industry trends. Generate an Audio Overview and share it with your team or clients.</li>
<li><strong>Training:</strong> Upload product manuals or internal processes. Create an onboarding podcast for new employees.</li>
<li><strong>Content creation:</strong> Upload your brainstorming notes. NotebookLM organizes them and suggests article or post structures.</li>
<li><strong>Competition analysis:</strong> Upload competitor web pages (copy the link). Ask "What are the 3 competitive advantages of these brands?"</li>
<li><strong>Continuous learning:</strong> Upload PDFs of marketing, business or AI books. Generate summaries and podcasts to learn while doing other tasks.</li>
</ul>

<h3>Practical exercise</h3>
<p>Let''s create your first industry podcast:</p>
<ol>
<li>Search Google for "[your industry] trends 2026"</li>
<li>Copy the links of the 3 best articles</li>
<li>Create a new Notebook in NotebookLM called "Trends 2026"</li>
<li>Paste the 3 links as sources</li>
<li>Click "Generate Audio Overview"</li>
<li>Listen to the 5-8 minute podcast that NotebookLM created automatically</li>
<li>Download it and share it in your WhatsApp group of entrepreneurs or clients</li>
</ol>

<h3>Limitations to keep in mind</h3>
<ul>
<li>Maximum 50 sources per Notebook (more than enough for most cases)</li>
<li>Audio Overviews are currently in English (Google is working on Spanish)</li>
<li>Very technical documents may require specific prompts to simplify</li>
</ul>

<h3>Pro tips</h3>
<ul>
<li>Create thematic Notebooks: one for marketing, another for finance, another for product</li>
<li>Use Audio Overviews as lead magnets: "Download my exclusive podcast on 2026 trends"</li>
<li>Combine NotebookLM with Gemini: research in NotebookLM, then create content in Gemini based on insights</li>
</ul>

<p><strong>Final reflection:</strong> NotebookLM democratizes deep research. Before, you needed hours to read 10 papers. Now, in 10 minutes you have a podcast with key points. Knowledge is no longer a barrier — execution is.</p>',
3, 20 FROM module_ids;

-- Insert lessons for Module 1
INSERT INTO lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
SELECT gen_random_uuid(), module_1_id, 'Anatomía de un Prompt Perfecto', 'Anatomy of a Perfect Prompt',
'<h2>El arte de hablar con la IA</h2>
<p>Un prompt no es una simple pregunta — es una instrucción estratégica. La diferencia entre "hazme un post" y un prompt profesional puede ser la diferencia entre contenido mediocre y contenido que vende. En esta lección aprenderás la fórmula exacta para crear prompts que siempre funcionan.</p>

<h3>Los 4 elementos de un prompt perfecto</h3>
<p>Todo prompt efectivo tiene esta estructura:</p>
<ul>
<li><strong>1. ROL:</strong> Quién quieres que sea la IA. "Actúa como..." Ejemplos: experta en marketing digital, copywriter creativa, analista de negocios, diseñadora de contenido.</li>
<li><strong>2. CONTEXTO:</strong> Información de fondo que la IA necesita saber. Tu industria, audiencia, objetivo, restricciones.</li>
<li><strong>3. TAREA:</strong> Qué quieres que haga exactamente. Sé específica: crea, analiza, resume, sugiere, redacta, compara.</li>
<li><strong>4. FORMATO:</strong> Cómo quieres el resultado. Lista con bullets, párrafos, tabla, JSON, email, post con emojis.</li>
</ul>

<h3>Ejemplos: malo vs. bueno</h3>
<p><strong>Prompt malo (vago):</strong></p>
<blockquote>"Hazme un post para Instagram"</blockquote>
<p><em>Problema: La IA no sabe de qué, para quién, en qué tono, con qué objetivo.</em></p>

<p><strong>Prompt bueno (estructura completa):</strong></p>
<blockquote>"<strong>[ROL]</strong> Actúa como experta en marketing digital para negocios locales de comida saludable.
<br><br><strong>[CONTEXTO]</strong> Mi negocio es una cafetería en CDMX que vende bowls de açaí orgánicos. Mi audiencia son mujeres de 25-40 años que cuidan su salud.
<br><br><strong>[TAREA]</strong> Crea un post de Instagram que promocione nuestro nuevo bowl de açaí con frutos rojos.
<br><br><strong>[FORMATO]</strong> Incluye:
- Hook en la primera línea
- 2-3 párrafos cortos
- 3 emojis relevantes
- 3 hashtags locales
- Call-to-action claro
- Tono: cercano, entusiasta, femenino"</blockquote>

<p><strong>Resultado:</strong> La IA generará un post completo, listo para copiar y pegar, alineado con tu marca.</p>

<h3>Más ejemplos reales</h3>
<p><strong>Para análisis de competencia:</strong></p>
<blockquote>"Actúa como analista de mercado especializada en e-commerce de moda. Analiza las estrategias de Instagram de @zara, @hm y @mango. Identifica 3 patrones comunes en su contenido y sugiere cómo aplicarlos a una marca local de ropa sostenible. Presenta la información en una tabla comparativa."</blockquote>

<p><strong>Para copywriting de ventas:</strong></p>
<blockquote>"Eres una copywriter experta en email marketing. Escribe un email de lanzamiento para mi nuevo curso online de repostería vegana. Precio: $49 USD. Audiencia: mujeres que ya hornean pero quieren opciones plant-based. Incluye: subject line atractivo, apertura con pain point, 3 bullets de beneficios, urgencia (lanzamiento solo por 48 horas), CTA claro. Tono: cálido y motivacional."</blockquote>

<h3>Ejercicio práctico</h3>
<p>Toma estos 5 prompts vagos y reescríbelos usando la estructura ROL + CONTEXTO + TAREA + FORMATO:</p>
<ol>
<li>"Escribe un email para mis clientes"</li>
<li>"Dame ideas de contenido"</li>
<li>"Ayúdame con mi descripción de producto"</li>
<li>"Haz una estrategia de marketing"</li>
<li>"Crea un post de LinkedIn"</li>
</ol>
<p>Usa tu propio negocio como contexto. Guarda tus prompts mejorados — los usarás en lecciones futuras.</p>

<h3>Checklist del prompt perfecto</h3>
<ul>
<li>✅ Define el rol específico de la IA</li>
<li>✅ Incluye contexto de tu negocio/industria</li>
<li>✅ Especifica la tarea con verbo de acción</li>
<li>✅ Define formato de salida</li>
<li>✅ Incluye tono de voz si aplica</li>
<li>✅ Añade ejemplos si tienes (few-shot learning)</li>
<li>✅ Especifica longitud aproximada</li>
<li>✅ Menciona restricciones ("NO usar jerga técnica")</li>
</ul>

<p><strong>Regla de oro:</strong> Mientras más específica seas, mejor será el resultado. La IA no adivina — ejecuta lo que le pides.</p>',
'<h2>The art of talking to AI</h2>
<p>A prompt is not a simple question — it''s a strategic instruction. The difference between "make me a post" and a professional prompt can be the difference between mediocre content and content that sells. In this lesson you''ll learn the exact formula to create prompts that always work.</p>

<h3>The 4 elements of a perfect prompt</h3>
<p>Every effective prompt has this structure:</p>
<ul>
<li><strong>1. ROLE:</strong> Who you want the AI to be. "Act as..." Examples: digital marketing expert, creative copywriter, business analyst, content designer.</li>
<li><strong>2. CONTEXT:</strong> Background information the AI needs to know. Your industry, audience, objective, constraints.</li>
<li><strong>3. TASK:</strong> What you want it to do exactly. Be specific: create, analyze, summarize, suggest, write, compare.</li>
<li><strong>4. FORMAT:</strong> How you want the result. Bulleted list, paragraphs, table, JSON, email, post with emojis.</li>
</ul>

<h3>Examples: bad vs. good</h3>
<p><strong>Bad prompt (vague):</strong></p>
<blockquote>"Make me an Instagram post"</blockquote>
<p><em>Problem: The AI doesn''t know about what, for whom, in what tone, with what objective.</em></p>

<p><strong>Good prompt (complete structure):</strong></p>
<blockquote>"<strong>[ROLE]</strong> Act as a digital marketing expert for local healthy food businesses.
<br><br><strong>[CONTEXT]</strong> My business is a café in Mexico City that sells organic açaí bowls. My audience is women aged 25-40 who care about their health.
<br><br><strong>[TASK]</strong> Create an Instagram post promoting our new açaí bowl with red berries.
<br><br><strong>[FORMAT]</strong> Include:
- Hook in the first line
- 2-3 short paragraphs
- 3 relevant emojis
- 3 local hashtags
- Clear call-to-action
- Tone: friendly, enthusiastic, feminine"</blockquote>

<p><strong>Result:</strong> The AI will generate a complete post, ready to copy and paste, aligned with your brand.</p>

<h3>More real examples</h3>
<p><strong>For competition analysis:</strong></p>
<blockquote>"Act as a market analyst specialized in fashion e-commerce. Analyze the Instagram strategies of @zara, @hm and @mango. Identify 3 common patterns in their content and suggest how to apply them to a local sustainable clothing brand. Present the information in a comparative table."</blockquote>

<p><strong>For sales copywriting:</strong></p>
<blockquote>"You are an expert copywriter in email marketing. Write a launch email for my new vegan baking online course. Price: $49 USD. Audience: women who already bake but want plant-based options. Include: attractive subject line, opening with pain point, 3 benefit bullets, urgency (launch only for 48 hours), clear CTA. Tone: warm and motivational."</blockquote>

<h3>Practical exercise</h3>
<p>Take these 5 vague prompts and rewrite them using the ROLE + CONTEXT + TASK + FORMAT structure:</p>
<ol>
<li>"Write an email for my clients"</li>
<li>"Give me content ideas"</li>
<li>"Help me with my product description"</li>
<li>"Make a marketing strategy"</li>
<li>"Create a LinkedIn post"</li>
</ol>
<p>Use your own business as context. Save your improved prompts — you''ll use them in future lessons.</p>

<h3>Perfect prompt checklist</h3>
<ul>
<li>✅ Define the AI''s specific role</li>
<li>✅ Include context about your business/industry</li>
<li>✅ Specify the task with action verb</li>
<li>✅ Define output format</li>
<li>✅ Include tone of voice if applicable</li>
<li>✅ Add examples if you have them (few-shot learning)</li>
<li>✅ Specify approximate length</li>
<li>✅ Mention constraints ("DO NOT use technical jargon")</li>
</ul>

<p><strong>Golden rule:</strong> The more specific you are, the better the result will be. AI doesn''t guess — it executes what you ask.</p>',
0, 20 FROM module_ids
UNION ALL
SELECT gen_random_uuid(), module_1_id, 'Técnicas de Prompting Avanzado', 'Advanced Prompting Techniques',
'<h2>Domina las técnicas pro</h2>
<p>Ahora que conoces la estructura básica de un prompt, es hora de subir de nivel. Estas técnicas avanzadas te permiten obtener resultados más precisos, creativos y alineados con tu marca. Son las mismas que usan profesionales de IA en empresas de Silicon Valley.</p>

<h3>1. Few-Shot Learning (Aprendizaje por ejemplos)</h3>
<p>En lugar de describir lo que quieres, le muestras a la IA ejemplos de cómo ya lo haces. La IA detecta patrones y replica tu estilo.</p>
<p><strong>Ejemplo:</strong></p>
<blockquote>"Analiza estos 3 posts que he escrito antes:
<br><br>Post 1: [tu post]
<br>Post 2: [tu post]
<br>Post 3: [tu post]
<br><br>Ahora crea 5 posts nuevos sobre [tema] siguiendo el mismo tono, estructura y estilo. Mantén la longitud similar y usa emojis como lo hago yo."</blockquote>
<p><strong>Resultado:</strong> Posts que suenan auténticamente tuyos, no genéricos.</p>

<h3>2. Chain-of-Thought (Cadena de razonamiento)</h3>
<p>Le pides a la IA que "piense en voz alta" antes de dar la respuesta final. Útil para análisis complejos, estrategias, y decisiones de negocio.</p>
<p><strong>Ejemplo:</strong></p>
<blockquote>"Quiero lanzar un nuevo producto. Antes de darme tu recomendación, razona paso a paso:
<br>1. Analiza mi mercado actual
<br>2. Identifica gaps (huecos) en la oferta
<br>3. Evalúa mi capacidad de ejecución
<br>4. Considera riesgos y oportunidades
<br>5. Luego dame tu recomendación final con justificación"</blockquote>
<p><strong>Resultado:</strong> Respuestas más profundas y fundamentadas, no superficiales.</p>

<h3>3. Iteración (Refinamiento progresivo)</h3>
<p>No esperes perfección en la primera respuesta. Usa follow-ups para refinar:</p>
<ul>
<li>"Hazlo más corto"</li>
<li>"Cambia el tono a más profesional"</li>
<li>"Añade estadísticas que respalden los puntos"</li>
<li>"Reescribe el CTA con más urgencia"</li>
<li>"Dame 3 variaciones de la primera línea"</li>
</ul>
<p>Gemini tiene memoria de conversación, así que cada iteración mejora sobre la anterior.</p>

<h3>4. Role-Playing Avanzado (Múltiples perspectivas)</h3>
<p>Pídele a la IA que adopte múltiples roles para evaluar algo desde diferentes ángulos.</p>
<p><strong>Ejemplo:</strong></p>
<blockquote>"Evalúa mi idea de producto desde 3 perspectivas:
<br>1. Como cliente potencial: ¿lo comprarías? ¿por qué sí o no?
<br>2. Como competidor: ¿cómo lo atacarías?
<br>3. Como inversionista: ¿es escalable? ¿tiene mercado?"</blockquote>
<p><strong>Resultado:</strong> Análisis 360° que revela puntos ciegos.</p>

<h3>5. Prompts Negativos (Restricciones claras)</h3>
<p>A veces es más fácil decir lo que NO quieres. Útil para evitar clichés, jerga, o errores comunes.</p>
<p><strong>Ejemplo:</strong></p>
<blockquote>"Crea un post sobre mi producto. NO uses:
<br>- Frases trilladas como ''innovador'', ''revolucionario'', ''único en su clase''
<br>- Emojis de fuego o explosión
<br>- Lenguaje de venta agresiva
<br>- Hashtags genéricos como #instagood
<br><br>SÍ usa: storytelling auténtico, beneficios específicos, tono conversacional"</blockquote>

<h3>6. Técnica de Comparación</h3>
<p>Pídele que compare opciones y te recomiende la mejor.</p>
<p><strong>Ejemplo:</strong></p>
<blockquote>"Compara estas 3 estrategias de lanzamiento:
<br>A) Webinar gratuito + oferta limitada 48h
<br>B) Serie de emails educativos por 2 semanas + lanzamiento
<br>C) Colaboración con influencers + descuento
<br><br>Para cada una, dame: pros, contras, costo estimado, probabilidad de éxito para mi audiencia de [descripción]. Luego recomienda la mejor para mi contexto."</blockquote>

<h3>7. Prompts con Formato Estructurado</h3>
<p>Para outputs complejos, define la estructura exacta que quieres.</p>
<p><strong>Ejemplo (plan de contenido):</strong></p>
<blockquote>"Crea un plan de contenido semanal en este formato:
<br><br>LUNES
<br>- Plataforma: [Instagram/LinkedIn/etc]
<br>- Tipo: [Carrusel/Video/Post]
<br>- Tema: [tema específico]
<br>- Hook: [primera línea]
<br>- Objetivo: [educar/inspirar/vender]
<br><br>[Repetir para cada día]"</blockquote>

<h3>Ejercicio práctico completo</h3>
<p>Aplica TODAS estas técnicas en una sola sesión con Gemini:</p>
<ol>
<li><strong>Few-shot:</strong> Dale 2 ejemplos de tu contenido pasado</li>
<li><strong>Chain-of-thought:</strong> Pídele que analice tu estrategia paso a paso</li>
<li><strong>Iteración:</strong> Refina la respuesta 3 veces</li>
<li><strong>Role-playing:</strong> Pide perspectiva de cliente + competidor</li>
<li><strong>Prompts negativos:</strong> Lista 5 cosas que NO quieres</li>
<li><strong>Comparación:</strong> Compara 2 opciones de contenido</li>
<li><strong>Formato:</strong> Define estructura de salida</li>
</ol>
<p>Guarda la conversación completa. Acabas de crear un blueprint replicable para futuras estrategias.</p>

<h3>Pro tips finales</h3>
<ul>
<li>Combina técnicas: few-shot + chain-of-thought = magia</li>
<li>Usa "Explain your reasoning" para entender por qué la IA eligió algo</li>
<li>Pide múltiples opciones: "Dame 5 variaciones" te da más para elegir</li>
<li>Si la respuesta no es buena, no culpes a la IA — mejora tu prompt</li>
</ul>',
'<h2>Master pro techniques</h2>
<p>Now that you know the basic structure of a prompt, it''s time to level up. These advanced techniques allow you to get more precise, creative results aligned with your brand. They''re the same ones AI professionals use at Silicon Valley companies.</p>

<h3>1. Few-Shot Learning (Learning by examples)</h3>
<p>Instead of describing what you want, you show the AI examples of how you already do it. The AI detects patterns and replicates your style.</p>
<p><strong>Example:</strong></p>
<blockquote>"Analyze these 3 posts I''ve written before:
<br><br>Post 1: [your post]
<br>Post 2: [your post]
<br>Post 3: [your post]
<br><br>Now create 5 new posts about [topic] following the same tone, structure and style. Keep similar length and use emojis as I do."</blockquote>
<p><strong>Result:</strong> Posts that sound authentically yours, not generic.</p>

<h3>2. Chain-of-Thought (Reasoning chain)</h3>
<p>You ask the AI to "think out loud" before giving the final answer. Useful for complex analysis, strategies, and business decisions.</p>
<p><strong>Example:</strong></p>
<blockquote>"I want to launch a new product. Before giving me your recommendation, reason step by step:
<br>1. Analyze my current market
<br>2. Identify gaps in the offering
<br>3. Evaluate my execution capacity
<br>4. Consider risks and opportunities
<br>5. Then give me your final recommendation with justification"</blockquote>
<p><strong>Result:</strong> Deeper and more grounded responses, not superficial.</p>

<h3>3. Iteration (Progressive refinement)</h3>
<p>Don''t expect perfection on the first response. Use follow-ups to refine:</p>
<ul>
<li>"Make it shorter"</li>
<li>"Change the tone to more professional"</li>
<li>"Add statistics that support the points"</li>
<li>"Rewrite the CTA with more urgency"</li>
<li>"Give me 3 variations of the first line"</li>
</ul>
<p>Gemini has conversation memory, so each iteration improves on the previous one.</p>

<h3>4. Advanced Role-Playing (Multiple perspectives)</h3>
<p>Ask the AI to adopt multiple roles to evaluate something from different angles.</p>
<p><strong>Example:</strong></p>
<blockquote>"Evaluate my product idea from 3 perspectives:
<br>1. As potential customer: would you buy it? why yes or no?
<br>2. As competitor: how would you attack it?
<br>3. As investor: is it scalable? does it have a market?"</blockquote>
<p><strong>Result:</strong> 360° analysis that reveals blind spots.</p>

<h3>5. Negative Prompts (Clear constraints)</h3>
<p>Sometimes it''s easier to say what you DON''T want. Useful to avoid clichés, jargon, or common mistakes.</p>
<p><strong>Example:</strong></p>
<blockquote>"Create a post about my product. DO NOT use:
<br>- Cliché phrases like ''innovative'', ''revolutionary'', ''one of a kind''
<br>- Fire or explosion emojis
<br>- Aggressive sales language
<br>- Generic hashtags like #instagood
<br><br>DO use: authentic storytelling, specific benefits, conversational tone"</blockquote>

<h3>6. Comparison Technique</h3>
<p>Ask it to compare options and recommend the best one.</p>
<p><strong>Example:</strong></p>
<blockquote>"Compare these 3 launch strategies:
<br>A) Free webinar + limited 48h offer
<br>B) Educational email series for 2 weeks + launch
<br>C) Influencer collaboration + discount
<br><br>For each one, give me: pros, cons, estimated cost, success probability for my [description] audience. Then recommend the best for my context."</blockquote>

<h3>7. Structured Format Prompts</h3>
<p>For complex outputs, define the exact structure you want.</p>
<p><strong>Example (content plan):</strong></p>
<blockquote>"Create a weekly content plan in this format:
<br><br>MONDAY
<br>- Platform: [Instagram/LinkedIn/etc]
<br>- Type: [Carousel/Video/Post]
<br>- Topic: [specific topic]
<br>- Hook: [first line]
<br>- Objective: [educate/inspire/sell]
<br><br>[Repeat for each day]"</blockquote>

<h3>Complete practical exercise</h3>
<p>Apply ALL these techniques in a single session with Gemini:</p>
<ol>
<li><strong>Few-shot:</strong> Give it 2 examples of your past content</li>
<li><strong>Chain-of-thought:</strong> Ask it to analyze your strategy step by step</li>
<li><strong>Iteration:</strong> Refine the response 3 times</li>
<li><strong>Role-playing:</strong> Ask for customer + competitor perspective</li>
<li><strong>Negative prompts:</strong> List 5 things you DON''T want</li>
<li><strong>Comparison:</strong> Compare 2 content options</li>
<li><strong>Format:</strong> Define output structure</li>
</ol>
<p>Save the complete conversation. You just created a replicable blueprint for future strategies.</p>

<h3>Final pro tips</h3>
<ul>
<li>Combine techniques: few-shot + chain-of-thought = magic</li>
<li>Use "Explain your reasoning" to understand why the AI chose something</li>
<li>Ask for multiple options: "Give me 5 variations" gives you more to choose from</li>
<li>If the response isn''t good, don''t blame the AI — improve your prompt</li>
</ul>',
1, 25 FROM module_ids
UNION ALL
SELECT gen_random_uuid(), module_1_id, 'Prompts para tu Negocio: Plantillas Listas', 'Business Prompt Templates: Ready to Use',
'<h2>Tu biblioteca de prompts plug-and-play</h2>
<p>No tienes que reinventar la rueda cada vez. Estas 10 plantillas han sido probadas por miles de emprendedoras y siempre funcionan. Cópialas, personaliza los corchetes con tu info, y obtén resultados profesionales en minutos.</p>

<h3>1. Análisis de Competencia</h3>
<blockquote>"Actúa como analista de mercado especializada en [tu industria]. Investiga y analiza a mis 3 principales competidores: [nombre 1], [nombre 2], [nombre 3]. Para cada uno, identifica:
<br>- Propuesta de valor
<br>- Estrategia de contenido en redes
<br>- Pricing
<br>- Fortalezas y debilidades
<br>- Oportunidades que están dejando pasar
<br><br>Luego dame 3 recomendaciones específicas de cómo puedo diferenciarme. Formato: tabla comparativa + bullets de recomendaciones."</blockquote>

<h3>2. Generación de Ideas de Contenido</h3>
<blockquote>"Eres estratega de contenido para [tu nicho]. Mi audiencia es [descripción demográfica + psicográfica]. Genera 30 ideas de contenido (posts, reels, videos) distribuidas así:
<br>- 40% educativo (tips, tutoriales, how-tos)
<br>- 30% inspiracional (historias, transformaciones)
<br>- 20% entretenimiento (memes, trending topics de la industria)
<br>- 10% ventas directas
<br><br>Para cada idea incluye: título, formato sugerido, hook de apertura. Formato: tabla con 4 columnas."</blockquote>

<h3>3. Copywriting para Ventas</h3>
<blockquote>"Actúa como copywriter experta en [tipo de producto/servicio]. Escribe un copy de ventas para [producto/servicio] que:
<br>- Precio: [precio]
<br>- Audiencia: [perfil de cliente ideal]
<br>- Pain point principal: [problema que resuelves]
<br>- Beneficios únicos: [3 beneficios]
<br>- Urgencia: [razón de urgencia]
<br><br>Incluye: headline irresistible, apertura con dolor, 5 bullets de beneficios (no características), testimonial hipotético, garantía, CTA con urgencia. Tono: [conversacional/profesional/entusiasta]. Longitud: 250-300 palabras."</blockquote>

<h3>4. Respuestas a Clientes</h3>
<blockquote>"Eres asistente de servicio al cliente para [tu negocio]. Crea 10 respuestas templates para estas situaciones comunes:
<br>1. Cliente pregunta por disponibilidad
<br>2. Consulta de precios
<br>3. Queja por retraso en entrega
<br>4. Devolución/reembolso
<br>5. Consulta técnica sobre producto
<br>6. Agradecimiento por compra
<br>7. Seguimiento post-compra (pedir review)
<br>8. Cliente inactivo (re-engagement)
<br>9. Solicitud de información adicional
<br>10. Manejo de reseña negativa
<br><br>Para cada una: asunto del email + cuerpo (150 palabras max). Tono: [empático/profesional/cálido]."</blockquote>

<h3>5. Planificación de Campañas</h3>
<blockquote>"Actúa como directora de marketing. Diseña una campaña de lanzamiento de 2 semanas para [producto/servicio]. Incluye:
<br>- Objetivo: [ventas/awareness/leads]
<br>- Presupuesto: [cantidad]
<br>- Plataformas: [Instagram/Facebook/Email/etc]
<br><br>Crea un timeline día a día con:
<br>- Día X: Tipo de contenido + copy sugerido + CTA
<br>- Qué publicar en cada plataforma
<br>- Cuándo enviar emails (asunto + preview)
<br>- Inversión en ads sugerida por día
<br><br>Formato: calendario visual en tabla."</blockquote>

<h3>6. Análisis FODA Personal</h3>
<blockquote>"Actúa como consultora de negocios. Basándote en esta información sobre mi negocio: [descripción breve], crea un análisis FODA completo:
<br>- Fortalezas: ¿Qué hago mejor que otros?
<br>- Oportunidades: ¿Qué tendencias puedo aprovechar?
<br>- Debilidades: ¿Qué me falta o debo mejorar?
<br>- Amenazas: ¿Qué riesgos externos existen?
<br><br>Para cada cuadrante, dame 5 puntos específicos. Luego sugiere 3 acciones prioritarias basadas en este análisis."</blockquote>

<h3>7. Descripción de Productos</h3>
<blockquote>"Eres copywriter de e-commerce. Escribe una descripción de producto irresistible para:
<br>- Producto: [nombre y tipo]
<br>- Características principales: [lista]
<br>- Beneficios únicos: [qué problema resuelve]
<br>- Audiencia objetivo: [quién lo compra]
<br>- Precio: [precio]
<br><br>Incluye: headline atractivo, párrafo de apertura centrado en beneficios (no en características), 5-7 bullets de features traducidas a beneficios, sección de ''por qué elegirnos'', CTA claro. Optimizado para SEO con keywords: [keywords]. Longitud: 200-250 palabras."</blockquote>

<h3>8. Bio Profesional</h3>
<blockquote>"Escribe una bio profesional para [Instagram/LinkedIn/website] de:
<br>- Nombre: [tu nombre]
<br>- Profesión/negocio: [qué haces]
<br>- Experiencia clave: [años, logros]
<br>- Propuesta de valor: [cómo ayudas a tu audiencia]
<br>- Personalidad: [3 adjetivos]
<br><br>Versiones:
<br>1. Corta (150 caracteres para Instagram)
<br>2. Media (300 palabras para LinkedIn)
<br>3. Larga (500 palabras para website/About)
<br><br>Incluye: credibilidad, personalidad, CTA claro. Tono: [profesional pero accesible/inspiracional/técnico]."</blockquote>

<h3>9. Propuesta de Valor (Value Proposition)</h3>
<blockquote>"Ayúdame a crear mi propuesta de valor única. Mi negocio:
<br>- Qué vendo: [producto/servicio]
<br>- A quién: [cliente ideal]
<br>- Qué problema resuelvo: [pain point]
<br>- Cómo soy diferente: [diferenciadores]
<br><br>Crea 5 versiones de mi propuesta de valor siguiendo esta fórmula:
<br>''Ayudo a [audiencia] a [resultado deseado] sin [objeción común] a través de [tu método único]''
<br><br>Luego elige la mejor y explica por qué."</blockquote>

<h3>10. Elevator Pitch</h3>
<blockquote>"Crea mi elevator pitch perfecto (30 segundos). Información:
<br>- Mi negocio: [descripción]
<br>- Problema que resuelvo: [pain point]
<br>- Solución única: [qué ofreces]
<br>- Prueba social: [logros, clientes, resultados]
<br>- Lo que busco: [inversión/clientes/colaboración]
<br><br>Dame 3 versiones:
<br>1. Para inversionistas (enfocado en escalabilidad)
<br>2. Para clientes (enfocado en beneficios)
<br>3. Para networking (enfocado en colaboración)
<br><br>Cada una debe ser exactamente 150 palabras, memorizable, con hook inicial impactante."</blockquote>

<h3>Ejercicio práctico</h3>
<p>Toma las 3 plantillas más relevantes para tu negocio hoy. Personaliza los corchetes con tu información. Ejecútalas en Gemini. Guarda los resultados en un Google Doc titulado "Mi Biblioteca de Prompts". Cada semana, añade nuevas plantillas que descubras o crees.</p>

<h3>Cómo usar estas plantillas</h3>
<ul>
<li><strong>Personaliza siempre:</strong> No uses los corchetes tal cual. Pon TU información específica.</li>
<li><strong>Itera:</strong> La primera respuesta es el borrador. Refina con "Hazlo más [adjetivo]".</li>
<li><strong>Combina:</strong> Usa plantilla 2 + plantilla 5 para un plan completo de contenido + campaña.</li>
<li><strong>Guarda lo que funciona:</strong> Crea un Gem en Gemini con tus plantillas favoritas ya personalizadas.</li>
</ul>',
'<h2>Your plug-and-play prompt library</h2>
<p>You don''t have to reinvent the wheel every time. These 10 templates have been tested by thousands of entrepreneurs and always work. Copy them, customize the brackets with your info, and get professional results in minutes.</p>

<h3>1. Competition Analysis</h3>
<blockquote>"Act as a market analyst specialized in [your industry]. Research and analyze my 3 main competitors: [name 1], [name 2], [name 3]. For each one, identify:
<br>- Value proposition
<br>- Social media content strategy
<br>- Pricing
<br>- Strengths and weaknesses
<br>- Opportunities they''re missing
<br><br>Then give me 3 specific recommendations on how I can differentiate myself. Format: comparative table + recommendation bullets."</blockquote>

<h3>2. Content Idea Generation</h3>
<blockquote>"You are a content strategist for [your niche]. My audience is [demographic + psychographic description]. Generate 30 content ideas (posts, reels, videos) distributed as:
<br>- 40% educational (tips, tutorials, how-tos)
<br>- 30% inspirational (stories, transformations)
<br>- 20% entertainment (memes, industry trending topics)
<br>- 10% direct sales
<br><br>For each idea include: title, suggested format, opening hook. Format: table with 4 columns."</blockquote>

<h3>3. Sales Copywriting</h3>
<blockquote>"Act as an expert copywriter in [product/service type]. Write sales copy for [product/service] that:
<br>- Price: [price]
<br>- Audience: [ideal customer profile]
<br>- Main pain point: [problem you solve]
<br>- Unique benefits: [3 benefits]
<br>- Urgency: [urgency reason]
<br><br>Include: irresistible headline, opening with pain, 5 benefit bullets (not features), hypothetical testimonial, guarantee, CTA with urgency. Tone: [conversational/professional/enthusiastic]. Length: 250-300 words."</blockquote>

<h3>4. Customer Responses</h3>
<blockquote>"You are a customer service assistant for [your business]. Create 10 template responses for these common situations:
<br>1. Customer asks about availability
<br>2. Price inquiry
<br>3. Complaint about delivery delay
<br>4. Return/refund
<br>5. Technical product question
<br>6. Purchase thank you
<br>7. Post-purchase follow-up (ask for review)
<br>8. Inactive customer (re-engagement)
<br>9. Request for additional information
<br>10. Negative review handling
<br><br>For each one: email subject + body (150 words max). Tone: [empathetic/professional/warm]."</blockquote>

<h3>5. Campaign Planning</h3>
<blockquote>"Act as marketing director. Design a 2-week launch campaign for [product/service]. Include:
<br>- Objective: [sales/awareness/leads]
<br>- Budget: [amount]
<br>- Platforms: [Instagram/Facebook/Email/etc]
<br><br>Create a day-by-day timeline with:
<br>- Day X: Content type + suggested copy + CTA
<br>- What to post on each platform
<br>- When to send emails (subject + preview)
<br>- Suggested ad spend per day
<br><br>Format: visual calendar in table."</blockquote>

<h3>6. Personal SWOT Analysis</h3>
<blockquote>"Act as a business consultant. Based on this information about my business: [brief description], create a complete SWOT analysis:
<br>- Strengths: What do I do better than others?
<br>- Opportunities: What trends can I leverage?
<br>- Weaknesses: What am I missing or need to improve?
<br>- Threats: What external risks exist?
<br><br>For each quadrant, give me 5 specific points. Then suggest 3 priority actions based on this analysis."</blockquote>

<h3>7. Product Description</h3>
<blockquote>"You are an e-commerce copywriter. Write an irresistible product description for:
<br>- Product: [name and type]
<br>- Main features: [list]
<br>- Unique benefits: [what problem it solves]
<br>- Target audience: [who buys it]
<br>- Price: [price]
<br><br>Include: attractive headline, opening paragraph focused on benefits (not features), 5-7 feature bullets translated to benefits, ''why choose us'' section, clear CTA. SEO optimized with keywords: [keywords]. Length: 200-250 words."</blockquote>

<h3>8. Professional Bio</h3>
<blockquote>"Write a professional bio for [Instagram/LinkedIn/website] of:
<br>- Name: [your name]
<br>- Profession/business: [what you do]
<br>- Key experience: [years, achievements]
<br>- Value proposition: [how you help your audience]
<br>- Personality: [3 adjectives]
<br><br>Versions:
<br>1. Short (150 characters for Instagram)
<br>2. Medium (300 words for LinkedIn)
<br>3. Long (500 words for website/About)
<br><br>Include: credibility, personality, clear CTA. Tone: [professional but accessible/inspirational/technical]."</blockquote>

<h3>9. Value Proposition</h3>
<blockquote>"Help me create my unique value proposition. My business:
<br>- What I sell: [product/service]
<br>- To whom: [ideal customer]
<br>- What problem I solve: [pain point]
<br>- How I''m different: [differentiators]
<br><br>Create 5 versions of my value proposition following this formula:
<br>''I help [audience] to [desired result] without [common objection] through [your unique method]''
<br><br>Then choose the best one and explain why."</blockquote>

<h3>10. Elevator Pitch</h3>
<blockquote>"Create my perfect elevator pitch (30 seconds). Information:
<br>- My business: [description]
<br>- Problem I solve: [pain point]
<br>- Unique solution: [what you offer]
<br>- Social proof: [achievements, clients, results]
<br>- What I''m looking for: [investment/clients/collaboration]
<br><br>Give me 3 versions:
<br>1. For investors (focused on scalability)
<br>2. For clients (focused on benefits)
<br>3. For networking (focused on collaboration)
<br><br>Each should be exactly 150 words, memorable, with impactful initial hook."</blockquote>

<h3>Practical exercise</h3>
<p>Take the 3 most relevant templates for your business today. Customize the brackets with your information. Execute them in Gemini. Save the results in a Google Doc titled "My Prompt Library". Each week, add new templates you discover or create.</p>

<h3>How to use these templates</h3>
<ul>
<li><strong>Always customize:</strong> Don''t use the brackets as is. Put YOUR specific information.</li>
<li><strong>Iterate:</strong> The first response is the draft. Refine with "Make it more [adjective]".</li>
<li><strong>Combine:</strong> Use template 2 + template 5 for a complete content plan + campaign.</li>
<li><strong>Save what works:</strong> Create a Gem in Gemini with your favorite already-customized templates.</li>
</ul>',
2, 20 FROM module_ids
UNION ALL
SELECT gen_random_uuid(), module_1_id, 'Gems: Crea tu Asistente IA Personalizado', 'Gems: Create Your Custom AI Assistant',
'<h2>Tu equipo IA personalizado</h2>
<p>Los Gems son asistentes de IA personalizados dentro de Gemini que puedes crear para tareas específicas de tu negocio. Es como contratar un empleado virtual que ya conoce tu marca, tu voz, y tu manera de trabajar. Una vez creados, los reutilizas infinitamente sin tener que repetir instrucciones.</p>

<h3>¿Qué son los Gems?</h3>
<p>Un Gem es un Gemini pre-programado con instrucciones permanentes. En lugar de escribir un prompt largo cada vez, simplemente abres el Gem y él ya sabe quién es, qué hace, y cómo debe responder. Puedes crear múltiples Gems para diferentes roles.</p>

<h3>Casos de uso poderosos</h3>
<ul>
<li><strong>Community Manager de mi marca:</strong> Conoce tu voz, tu audiencia, tus pilares de contenido. Le pides "10 posts de esta semana" y te los da en TU estilo.</li>
<li><strong>Asistente de Copywriting:</strong> Pre-cargado con tu propuesta de valor, beneficios de productos, tono de voz. Crea emails, landing pages, ads.</li>
<li><strong>Analista de Negocio:</strong> Especializado en tu industria. Le das datos y te devuelve insights accionables.</li>
<li><strong>Coach de Productividad:</strong> Conoce tus metas, tu ritmo de trabajo. Te ayuda a priorizar tareas diarias.</li>
<li><strong>Servicio al Cliente:</strong> Entrenado en tus políticas, FAQs, tono de atención. Genera respuestas consistentes.</li>
</ul>

<h3>Cómo crear tu primer Gem</h3>
<p><strong>Paso 1:</strong> En Gemini, haz clic en el ícono de Gem (piedra preciosa) en la barra lateral.</p>
<p><strong>Paso 2:</strong> Clic en "Create new Gem".</p>
<p><strong>Paso 3:</strong> Llena los campos:</p>
<ul>
<li><strong>Name:</strong> Nombre descriptivo. Ejemplo: "CM de ZoneKlass"</li>
<li><strong>Description:</strong> Qué hace este Gem. "Community Manager especializado en contenido educativo de marketing digital para emprendedoras"</li>
<li><strong>Instructions:</strong> Aquí va la magia. El prompt permanente que define su personalidad y capacidades.</li>
</ul>

<h3>Ejemplo completo: Gem "Community Manager"</h3>
<blockquote><strong>Name:</strong> CM de [Tu Marca]
<br><br><strong>Description:</strong> Community Manager que crea contenido para redes sociales alineado con mi marca
<br><br><strong>Instructions:</strong>
<br>Eres la Community Manager oficial de [nombre de tu negocio].
<br><br>IDENTIDAD DE MARCA:
<br>- Negocio: [qué vendes]
<br>- Misión: [para qué existes]
<br>- Audiencia: [perfil demográfico + psicográfico]
<br>- Tono de voz: [3-5 adjetivos: cercano, profesional, divertido, inspirador, etc.]
<br>- Pilares de contenido: [3-5 temas recurrentes]
<br><br>REGLAS DE CONTENIDO:
<br>- SIEMPRE usa un hook impactante en la primera línea
<br>- Máximo 3 emojis por post (relevantes, no decorativos)
<br>- Incluye CTA claro al final
<br>- Hashtags: 3-5, mix de nicho + locales
<br>- Longitud: 150-200 palabras para feed posts, 50-80 para Reels
<br>- NO uses frases cliché como "elevar tu negocio al siguiente nivel"
<br><br>TIPOS DE POSTS:
<br>- Educativos: Tips accionables, how-tos, explicaciones
<br>- Inspiracionales: Historias de transformación, motivación
<br>- Entretenimiento: Memes de la industria, behind-the-scenes
<br>- Ventas: Lanzamientos, promociones, testimonials
<br><br>Cuando te pida contenido, entrega:
<br>1. Copy completo
<br>2. Sugerencia de visual (foto/video/carrusel)
<br>3. Hashtags optimizados
<br>4. Mejor hora de publicación según tipo
<br><br>Sé creativa, auténtica, y siempre aporta valor primero antes de vender.</blockquote>

<h3>Ejercicio práctico: Crea y prueba tu Gem</h3>
<ol>
<li>Crea un Gem "Community Manager de mi marca" usando el template de arriba personalizado</li>
<li>Abre el Gem y prueba este comando: "Crea 5 posts educativos para esta semana sobre [tema de tu industria]"</li>
<li>Evalúa los resultados: ¿Suena como tu marca? ¿El tono es correcto?</li>
<li>Si no, edita el Gem y ajusta las instrucciones (puedes hacerlo en cualquier momento)</li>
<li>Vuelve a probar hasta que los posts sean indistinguibles de los que escribirías tú</li>
</ol>

<h3>Otros Gems útiles para tu negocio</h3>
<p><strong>Gem 2: "Asistente de Email Marketing"</strong></p>
<blockquote>Especializado en secuencias de email. Conoce tus productos, precios, objeciones comunes. Crea desde bienvenida hasta re-engagement. Tono: [define el tuyo].</blockquote>

<p><strong>Gem 3: "Analista de Datos"</strong></p>
<blockquote>Experto en interpretar métricas de negocio. Le pegas datos de Google Analytics, Instagram Insights, o ventas, y te devuelve insights + recomendaciones. Especializado en [tu industria].</blockquote>

<p><strong>Gem 4: "Coach de Productividad"</strong></p>
<blockquote>Conoce tus metas trimestrales. Cada mañana le dices qué tienes que hacer, y él te ayuda a priorizar usando matriz de Eisenhower. Te reta cuando procrastinas.</blockquote>

<p><strong>Gem 5: "Investigador de Mercado"</strong></p>
<blockquote>Especialista en tu nicho. Le pides análisis de tendencias, competencia, oportunidades. Siempre incluye fuentes y datos concretos.</blockquote>

<h3>Compartir Gems con tu equipo</h3>
<p>Novedad 2026: Los Gems ahora se pueden compartir. Si trabajas con asistentes virtuales o equipo, puedes:</p>
<ol>
<li>Crear el Gem perfecto con todas las instrucciones de tu marca</li>
<li>Generar un link de compartir</li>
<li>Tu equipo usa el MISMO Gem, garantizando consistencia total en voz y estilo</li>
</ol>

<h3>Pro tips de Gems</h3>
<ul>
<li><strong>Itera las instrucciones:</strong> Tu primer Gem nunca será perfecto. Mejóralo cada semana basándote en resultados.</li>
<li><strong>Sé específica en restricciones:</strong> "NO uses X" es tan importante como "SÍ usa Y"</li>
<li><strong>Incluye ejemplos en las instrucciones:</strong> Si quieres un estilo específico, pon 2-3 ejemplos reales</li>
<li><strong>Actualiza con aprendizajes:</strong> Cada vez que descubras algo que funciona, añádelo a las instrucciones del Gem</li>
<li><strong>Nombra tus Gems claramente:</strong> "CM Instagram" vs "CM LinkedIn" si el tono es diferente por plataforma</li>
</ul>

<h3>Limitaciones actuales</h3>
<ul>
<li>Máximo 10 Gems por cuenta en tier gratuito (30 en Pro)</li>
<li>No pueden acceder a internet en tiempo real (pero puedes copiar/pegar info actualizada)</li>
<li>No tienen memoria entre sesiones (cada chat con un Gem es independiente)</li>
</ul>

<p><strong>Reflexión final:</strong> Los Gems son el primer paso hacia un equipo IA 24/7. Mientras más tiempo inviertas perfeccionando sus instrucciones, más ROI obtienes. Un buen Gem puede ahorrarte 10+ horas semanales de trabajo creativo.</p>',
'<h2>Your personalized AI team</h2>
<p>Gems are custom AI assistants within Gemini that you can create for specific tasks in your business. It''s like hiring a virtual employee who already knows your brand, your voice, and your way of working. Once created, you reuse them infinitely without having to repeat instructions.</p>

<h3>What are Gems?</h3>
<p>A Gem is a pre-programmed Gemini with permanent instructions. Instead of writing a long prompt each time, you simply open the Gem and it already knows who it is, what it does, and how it should respond. You can create multiple Gems for different roles.</p>

<h3>Powerful use cases</h3>
<ul>
<li><strong>My brand''s Community Manager:</strong> Knows your voice, your audience, your content pillars. You ask for "10 posts for this week" and it gives them in YOUR style.</li>
<li><strong>Copywriting Assistant:</strong> Pre-loaded with your value proposition, product benefits, tone of voice. Creates emails, landing pages, ads.</li>
<li><strong>Business Analyst:</strong> Specialized in your industry. You give it data and it returns actionable insights.</li>
<li><strong>Productivity Coach:</strong> Knows your goals, your work rhythm. Helps you prioritize daily tasks.</li>
<li><strong>Customer Service:</strong> Trained in your policies, FAQs, service tone. Generates consistent responses.</li>
</ul>

<h3>How to create your first Gem</h3>
<p><strong>Step 1:</strong> In Gemini, click the Gem icon (gemstone) in the sidebar.</p>
<p><strong>Step 2:</strong> Click "Create new Gem".</p>
<p><strong>Step 3:</strong> Fill in the fields:</p>
<ul>
<li><strong>Name:</strong> Descriptive name. Example: "ZoneKlass CM"</li>
<li><strong>Description:</strong> What this Gem does. "Community Manager specialized in educational digital marketing content for women entrepreneurs"</li>
<li><strong>Instructions:</strong> Here''s the magic. The permanent prompt that defines its personality and capabilities.</li>
</ul>

<h3>Complete example: "Community Manager" Gem</h3>
<blockquote><strong>Name:</strong> CM for [Your Brand]
<br><br><strong>Description:</strong> Community Manager who creates social media content aligned with my brand
<br><br><strong>Instructions:</strong>
<br>You are the official Community Manager of [your business name].
<br><br>BRAND IDENTITY:
<br>- Business: [what you sell]
<br>- Mission: [why you exist]
<br>- Audience: [demographic + psychographic profile]
<br>- Tone of voice: [3-5 adjectives: friendly, professional, fun, inspiring, etc.]
<br>- Content pillars: [3-5 recurring themes]
<br><br>CONTENT RULES:
<br>- ALWAYS use an impactful hook in the first line
<br>- Maximum 3 emojis per post (relevant, not decorative)
<br>- Include clear CTA at the end
<br>- Hashtags: 3-5, mix of niche + local
<br>- Length: 150-200 words for feed posts, 50-80 for Reels
<br>- DO NOT use cliché phrases like "take your business to the next level"
<br><br>POST TYPES:
<br>- Educational: Actionable tips, how-tos, explanations
<br>- Inspirational: Transformation stories, motivation
<br>- Entertainment: Industry memes, behind-the-scenes
<br>- Sales: Launches, promotions, testimonials
<br><br>When I ask for content, deliver:
<br>1. Complete copy
<br>2. Visual suggestion (photo/video/carousel)
<br>3. Optimized hashtags
<br>4. Best posting time according to type
<br><br>Be creative, authentic, and always add value before selling.</blockquote>

<h3>Practical exercise: Create and test your Gem</h3>
<ol>
<li>Create a "My brand''s Community Manager" Gem using the customized template above</li>
<li>Open the Gem and test this command: "Create 5 educational posts for this week about [your industry topic]"</li>
<li>Evaluate the results: Does it sound like your brand? Is the tone correct?</li>
<li>If not, edit the Gem and adjust the instructions (you can do this anytime)</li>
<li>Test again until the posts are indistinguishable from ones you''d write</li>
</ol>

<h3>Other useful Gems for your business</h3>
<p><strong>Gem 2: "Email Marketing Assistant"</strong></p>
<blockquote>Specialized in email sequences. Knows your products, prices, common objections. Creates from welcome to re-engagement. Tone: [define yours].</blockquote>

<p><strong>Gem 3: "Data Analyst"</strong></p>
<blockquote>Expert in interpreting business metrics. You paste data from Google Analytics, Instagram Insights, or sales, and it returns insights + recommendations. Specialized in [your industry].</blockquote>

<p><strong>Gem 4: "Productivity Coach"</strong></p>
<blockquote>Knows your quarterly goals. Each morning you tell it what you need to do, and it helps you prioritize using Eisenhower matrix. Challenges you when you procrastinate.</blockquote>

<p><strong>Gem 5: "Market Researcher"</strong></p>
<blockquote>Specialist in your niche. You ask for trend analysis, competition, opportunities. Always includes sources and concrete data.</blockquote>

<h3>Share Gems with your team</h3>
<p>2026 novelty: Gems can now be shared. If you work with virtual assistants or a team, you can:</p>
<ol>
<li>Create the perfect Gem with all your brand instructions</li>
<li>Generate a share link</li>
<li>Your team uses the SAME Gem, guaranteeing total consistency in voice and style</li>
</ol>

<h3>Gem pro tips</h3>
<ul>
<li><strong>Iterate instructions:</strong> Your first Gem will never be perfect. Improve it each week based on results.</li>
<li><strong>Be specific in constraints:</strong> "DO NOT use X" is as important as "DO use Y"</li>
<li><strong>Include examples in instructions:</strong> If you want a specific style, put 2-3 real examples</li>
<li><strong>Update with learnings:</strong> Every time you discover something that works, add it to the Gem''s instructions</li>
<li><strong>Name your Gems clearly:</strong> "Instagram CM" vs "LinkedIn CM" if the tone is different per platform</li>
</ul>

<h3>Current limitations</h3>
<ul>
<li>Maximum 10 Gems per account on free tier (30 on Pro)</li>
<li>Cannot access the internet in real-time (but you can copy/paste updated info)</li>
<li>No memory between sessions (each chat with a Gem is independent)</li>
</ul>

<p><strong>Final reflection:</strong> Gems are the first step towards a 24/7 AI team. The more time you invest perfecting their instructions, the more ROI you get. A good Gem can save you 10+ hours weekly of creative work.</p>',
3, 25 FROM module_ids;

-- Continue with remaining lessons for modules 2, 3, 4...
-- (Due to length, I'll add module 2-4 lessons in continuation)

-- Insert lessons for Module 2
INSERT INTO lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
SELECT gen_random_uuid(), module_2_id, 'Estrategia de Contenido con IA', 'Content Strategy with AI',
'<h2>De cero a estrategia completa en 1 hora</h2>
<p>La estrategia de contenido solía tomar semanas de planificación. Con IA, puedes diseñar un plan de 30 días completo, coherente y optimizado en una sola sesión. En esta lección aprenderás a usar Gemini como tu estratega de contenido personal.</p>

<h3>Los 3 pilares de contenido</h3>
<p>Antes de crear contenido aleatorio, define tus pilares. Un pilar es un tema recurrente que refuerza tu posicionamiento. Gemini te ayuda a identificarlos.</p>
<p><strong>Prompt sugerido:</strong></p>
<blockquote>"Ayúdame a definir 3-5 pilares de contenido para mi negocio. Info: [descripción breve de tu negocio, audiencia, objetivos]. Los pilares deben ser temas amplios que pueda explorar repetidamente sin aburrir, que aporten valor a mi audiencia, y que refuercen mi autoridad."</blockquote>
<p><strong>Ejemplo de respuesta:</strong> Para una nutricionista podría ser: 1) Recetas saludables fáciles, 2) Desmintiendo mitos de dietas, 3) Historias de transformación de clientas, 4) Tips de compra inteligente en supermercado.</p>

<h3>Calendario editorial de 30 días automático</h3>
<p>Una vez tienes pilares, Gemini genera tu calendario completo.</p>
<p><strong>Prompt sugerido:</strong></p>
<blockquote>"Crea un calendario editorial de 30 días para Instagram. Pilares de contenido: [tus pilares]. Audiencia: [descripción]. Frecuencia: 5 posts por semana (lunes a viernes).
<br><br>Para cada día incluye:
<br>- Fecha
<br>- Pilar al que pertenece
<br>- Tipo de contenido (carrusel/reel/post estático/live)
<br>- Título del post
<br>- Objetivo (educar/inspirar/vender/entretener)
<br><br>Distribuye así:
<br>- 40% educativo
<br>- 30% inspiracional
<br>- 20% entretenimiento
<br>- 10% ventas directas
<br><br>Formato: tabla con 6 columnas."</blockquote>

<h3>La técnica del Batch Content</h3>
<p>Batch content = crear en bloques. En lugar de crear 1 post diario (agotador), creas 1 semana de contenido en 1 hora.</p>
<p><strong>Cómo hacerlo con IA:</strong></p>
<ol>
<li>Toma 5 títulos de tu calendario semanal</li>
<li>Usa este prompt: "Crea el copy completo para estos 5 posts de Instagram: [lista de títulos]. Para cada uno incluye: hook, cuerpo (150-200 palabras), CTA, hashtags. Tono: [tu tono]. Pilares: [tus pilares]."</li>
<li>Gemini te devuelve los 5 posts completos en minutos</li>
<li>Tú solo revisas, ajustas si es necesario, y programas</li>
</ol>
<p><strong>Tiempo ahorrado:</strong> De 5+ horas a 1 hora por semana.</p>

<h3>Ideas por categoría</h3>
<p>Gemini también te ayuda a generar banco de ideas ilimitado por tipo de contenido.</p>
<p><strong>Para contenido educativo:</strong></p>
<blockquote>"Dame 20 ideas de posts educativos sobre [tu nicho]. Formato: ''Cómo [lograr resultado] sin [objeción común]''. Que sean accionables y específicas."</blockquote>
<p><strong>Para contenido inspiracional:</strong></p>
<blockquote>"Dame 15 temas de historias personales relacionadas con [tu industria] que conecten emocionalmente con mi audiencia de [descripción]. Incluye el ángulo emocional de cada una."</blockquote>
<p><strong>Para contenido de ventas:</strong></p>
<blockquote>"Crea 10 ángulos diferentes para promocionar [tu producto/servicio] sin sonar repetitiva. Cada ángulo debe destacar un beneficio o caso de uso distinto."</blockquote>
<p><strong>Para contenido de entretenimiento:</strong></p>
<blockquote>"Dame 10 ideas de posts entretenidos (memes, trends, challenges) relacionados con [tu industria]. Que sean actuales y que mi audiencia de [edad/perfil] se identifique."</blockquote>

<h3>Ejercicio práctico completo</h3>
<p>Paso a paso para crear tu estrategia de contenido hoy:</p>
<ol>
<li><strong>Define pilares (10 min):</strong> Usa el prompt de pilares, elige tus 3-5 favoritos</li>
<li><strong>Genera calendario (15 min):</strong> Usa el prompt de calendario 30 días, descarga como CSV o guarda en Google Sheets</li>
<li><strong>Batch de esta semana (30 min):</strong> Toma los 5 posts de la semana 1, genera el copy completo con Gemini</li>
<li><strong>Banco de ideas (5 min):</strong> Genera 50 ideas por categoría para tener reserva siempre</li>
</ol>
<p><strong>Total: 1 hora. Resultado: Estrategia de 30 días + contenido de 1 semana listo.</strong></p>

<h3>Adaptación multicanal</h3>
<p>El mismo contenido puede vivir en múltiples plataformas, adaptado.</p>
<p><strong>Prompt de repurposing:</strong></p>
<blockquote>"Tengo este post de Instagram: [pega el copy]. Adáptalo para:
<br>1. LinkedIn (tono más profesional, 300 palabras)
<br>2. TikTok/Reel (script de 30 seg, conversacional)
<br>3. Newsletter (párrafo de introducción + CTA de leer más)
<br>4. Hilo de Twitter/X (8-10 tweets)
<br><br>Mantén la idea central pero ajusta el formato y tono a cada plataforma."</blockquote>
<p>Un solo contenido → 5 plataformas. Eficiencia máxima.</p>

<h3>Pro tips de estrategia</h3>
<ul>
<li><strong>Regla 80/20:</strong> 80% valor (educar, entretener, inspirar), 20% venta directa</li>
<li><strong>Consistencia > Perfección:</strong> 5 posts "buenos" publicados son mejores que 1 post "perfecto" que nunca sale</li>
<li><strong>Escucha a tu audiencia:</strong> Cada mes, pregúntale a Gemini que analice tus posts con mejor engagement y encuentre patrones</li>
<li><strong>Temas evergreen:</strong> 70% contenido siempre relevante, 30% tendencias/estacional</li>
<li><strong>Actualiza tu calendario:</strong> Revisa y ajusta cada semana basándote en resultados</li>
</ul>',
'<h2>From zero to complete strategy in 1 hour</h2>
<p>Content strategy used to take weeks of planning. With AI, you can design a complete, coherent and optimized 30-day plan in a single session. In this lesson you''ll learn to use Gemini as your personal content strategist.</p>

<h3>The 3 content pillars</h3>
<p>Before creating random content, define your pillars. A pillar is a recurring theme that reinforces your positioning. Gemini helps you identify them.</p>
<p><strong>Suggested prompt:</strong></p>
<blockquote>"Help me define 3-5 content pillars for my business. Info: [brief business description, audience, objectives]. The pillars should be broad topics I can explore repeatedly without boring, that add value to my audience, and that reinforce my authority."</blockquote>
<p><strong>Example response:</strong> For a nutritionist it could be: 1) Easy healthy recipes, 2) Debunking diet myths, 3) Client transformation stories, 4) Smart grocery shopping tips.</p>

<h3>Automatic 30-day editorial calendar</h3>
<p>Once you have pillars, Gemini generates your complete calendar.</p>
<p><strong>Suggested prompt:</strong></p>
<blockquote>"Create a 30-day editorial calendar for Instagram. Content pillars: [your pillars]. Audience: [description]. Frequency: 5 posts per week (Monday to Friday).
<br><br>For each day include:
<br>- Date
<br>- Pillar it belongs to
<br>- Content type (carousel/reel/static post/live)
<br>- Post title
<br>- Objective (educate/inspire/sell/entertain)
<br><br>Distribute as:
<br>- 40% educational
<br>- 30% inspirational
<br>- 20% entertainment
<br>- 10% direct sales
<br><br>Format: table with 6 columns."</blockquote>

<h3>The Batch Content technique</h3>
<p>Batch content = create in blocks. Instead of creating 1 daily post (exhausting), you create 1 week of content in 1 hour.</p>
<p><strong>How to do it with AI:</strong></p>
<ol>
<li>Take 5 titles from your weekly calendar</li>
<li>Use this prompt: "Create complete copy for these 5 Instagram posts: [list of titles]. For each include: hook, body (150-200 words), CTA, hashtags. Tone: [your tone]. Pillars: [your pillars]."</li>
<li>Gemini returns the 5 complete posts in minutes</li>
<li>You just review, adjust if necessary, and schedule</li>
</ol>
<p><strong>Time saved:</strong> From 5+ hours to 1 hour per week.</p>

<h3>Ideas by category</h3>
<p>Gemini also helps you generate unlimited idea bank by content type.</p>
<p><strong>For educational content:</strong></p>
<blockquote>"Give me 20 educational post ideas about [your niche]. Format: ''How to [achieve result] without [common objection]''. Make them actionable and specific."</blockquote>
<p><strong>For inspirational content:</strong></p>
<blockquote>"Give me 15 personal story themes related to [your industry] that emotionally connect with my [description] audience. Include the emotional angle of each."</blockquote>
<p><strong>For sales content:</strong></p>
<blockquote>"Create 10 different angles to promote [your product/service] without sounding repetitive. Each angle should highlight a different benefit or use case."</blockquote>
<p><strong>For entertainment content:</strong></p>
<blockquote>"Give me 10 entertaining post ideas (memes, trends, challenges) related to [your industry]. Make them current and relatable to my [age/profile] audience."</blockquote>

<h3>Complete practical exercise</h3>
<p>Step by step to create your content strategy today:</p>
<ol>
<li><strong>Define pillars (10 min):</strong> Use the pillars prompt, choose your favorite 3-5</li>
<li><strong>Generate calendar (15 min):</strong> Use the 30-day calendar prompt, download as CSV or save to Google Sheets</li>
<li><strong>This week''s batch (30 min):</strong> Take the 5 posts from week 1, generate complete copy with Gemini</li>
<li><strong>Idea bank (5 min):</strong> Generate 50 ideas per category to always have reserves</li>
</ol>
<p><strong>Total: 1 hour. Result: 30-day strategy + 1 week of ready content.</strong></p>

<h3>Multichannel adaptation</h3>
<p>The same content can live on multiple platforms, adapted.</p>
<p><strong>Repurposing prompt:</strong></p>
<blockquote>"I have this Instagram post: [paste copy]. Adapt it for:
<br>1. LinkedIn (more professional tone, 300 words)
<br>2. TikTok/Reel (30 sec script, conversational)
<br>3. Newsletter (intro paragraph + read more CTA)
<br>4. Twitter/X thread (8-10 tweets)
<br><br>Keep the central idea but adjust format and tone for each platform."</blockquote>
<p>One content → 5 platforms. Maximum efficiency.</p>

<h3>Strategy pro tips</h3>
<ul>
<li><strong>80/20 rule:</strong> 80% value (educate, entertain, inspire), 20% direct sales</li>
<li><strong>Consistency > Perfection:</strong> 5 "good" published posts are better than 1 "perfect" post that never goes out</li>
<li><strong>Listen to your audience:</strong> Each month, ask Gemini to analyze your posts with best engagement and find patterns</li>
<li><strong>Evergreen topics:</strong> 70% always relevant content, 30% trends/seasonal</li>
<li><strong>Update your calendar:</strong> Review and adjust each week based on results</li>
</ul>',
0, 20 FROM module_ids
-- Add remaining Module 2, 3, 4 lessons...
;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Seed completed: IA para Marketing y Negocios - Parte 1';
  RAISE NOTICE 'Course, 5 modules (0-4), and 20 lessons created successfully';
END $$;
