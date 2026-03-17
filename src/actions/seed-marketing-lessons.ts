'use server';

import { createServiceClient } from '@/lib/supabase/server';

// MODULE 0: Tu Kit de Herramientas IA
const module0Lessons = [
  {
    module_id: '65abd5de-2407-492e-9879-374b5a4d1280',
    title: 'Bienvenida al Mundo de la IA',
    title_en: 'Welcome to the World of AI',
    content: `<h2>¿Qué es la IA en palabras simples?</h2>
<p>La Inteligencia Artificial (IA) es un software que <strong>aprende de datos</strong> y puede generar contenido: texto, imágenes, videos, música y mucho más. No es magia, es tecnología avanzada que procesa patrones y crea resultados útiles para tu negocio.</p>

<h3>¿Por qué importa para tu negocio?</h3>
<ul>
  <li><strong>Ahorra tiempo:</strong> Lo que te tomaba horas ahora toma minutos</li>
  <li><strong>Crea contenido profesional:</strong> Sin necesidad de un equipo completo</li>
  <li><strong>Escala tus operaciones:</strong> Haz más con los mismos recursos</li>
  <li><strong>Compite como grande:</strong> Herramientas de nivel corporativo ahora accesibles</li>
</ul>

<h3>La mentalidad digital correcta</h3>
<p>La IA <em>no reemplaza tu creatividad</em>, la <strong>amplifica</strong>. Tú sigues siendo quien toma las decisiones estratégicas, conoces a tu audiencia y tienes la visión. La IA es tu asistente superinteligente que ejecuta rápido.</p>

<h3>Datos que necesitas conocer</h3>
<ul>
  <li>98% de negocios ya usan IA en 2026</li>
  <li>85% de marketers ahorran más de 4 horas por semana con IA</li>
  <li>76% reportan aumento de ROI en publicidad usando IA</li>
</ul>

<h3>Ejercicio Práctico</h3>
<p><strong>Lista 5 tareas que más tiempo te consumen en tu negocio:</strong></p>
<p>Piensa en actividades repetitivas, creación de contenido, análisis de datos, respuestas a clientes. Al final del curso, sabrás automatizar la mayoría con IA.</p>`,
    content_en: `<h2>What is AI in Simple Words?</h2>
<p>Artificial Intelligence (AI) is software that <strong>learns from data</strong> and can generate content: text, images, videos, music, and much more. It's not magic, it's advanced technology that processes patterns and creates useful results for your business.</p>

<h3>Why Does It Matter for Your Business?</h3>
<ul>
  <li><strong>Saves time:</strong> What took you hours now takes minutes</li>
  <li><strong>Creates professional content:</strong> Without needing a full team</li>
  <li><strong>Scales your operations:</strong> Do more with the same resources</li>
  <li><strong>Compete like the big guys:</strong> Enterprise-level tools now accessible</li>
</ul>

<h3>The Right Digital Mindset</h3>
<p>AI <em>doesn't replace your creativity</em>, it <strong>amplifies</strong> it. You're still the one making strategic decisions, knowing your audience, and having the vision. AI is your super-smart assistant that executes fast.</p>

<h3>Data You Need to Know</h3>
<ul>
  <li>98% of businesses already use AI in 2026</li>
  <li>85% of marketers save 4+ hours per week with AI</li>
  <li>76% report increased ROI in advertising using AI</li>
</ul>

<h3>Practical Exercise</h3>
<p><strong>List 5 tasks that consume the most time in your business:</strong></p>
<p>Think about repetitive activities, content creation, data analysis, customer responses. By the end of this course, you'll know how to automate most of them with AI.</p>`,
    order_index: 0,
    duration_minutes: 15,
  },
  {
    module_id: '65abd5de-2407-492e-9879-374b5a4d1280',
    title: 'Tu Centro de Comando: Google Gemini',
    title_en: 'Your Command Center: Google Gemini',
    content: `<h2>Tour completo por Gemini</h2>
<p>Google Gemini es tu <strong>asistente de IA conversacional</strong> más poderoso. Accede desde <a href="https://gemini.google.com" target="_blank">gemini.google.com</a> con tu cuenta de Google.</p>

<h3>Crear tu cuenta gratuita</h3>
<p>Solo necesitas un email de Gmail. La versión gratuita te da acceso a Gemini 2.5 Flash, suficiente para la mayoría de tareas de marketing y negocios.</p>

<h3>Planes disponibles</h3>
<ul>
  <li><strong>Gratuito:</strong> Gemini 2.5 Flash, límites generosos</li>
  <li><strong>Gemini Pro ($20/mes):</strong> Prioridad en acceso, más consultas por día, integración Google Workspace</li>
  <li><strong>Gemini Ultra:</strong> Modelo más avanzado con razonamiento superior</li>
</ul>

<h3>¿Qué puede hacer Gemini por tu negocio?</h3>
<ul>
  <li><strong>Razonar:</strong> Analiza problemas complejos de negocios</li>
  <li><strong>Analizar documentos:</strong> Sube PDFs, contratos, reportes</li>
  <li><strong>Generar contenido:</strong> Posts, emails, artículos, scripts</li>
  <li><strong>Crear imágenes:</strong> Con Nano Banana integrado</li>
</ul>

<h3>Tu primera conversación práctica</h3>
<p>Empieza con un prompt claro: <em>"Actúa como consultor de marketing. Analiza mi negocio de [tu industria] y dame 5 estrategias concretas para atraer más clientes este mes."</em></p>

<h3>Ejercicio</h3>
<p><strong>Pídele a Gemini que analice tu negocio y dé 5 ideas de marketing.</strong> Usa este prompt: "Tengo un negocio de [describe brevemente]. ¿Qué 5 campañas de marketing digital me recomiendas para aumentar ventas en 30 días?"</p>`,
    content_en: `<h2>Complete Gemini Tour</h2>
<p>Google Gemini is your most powerful <strong>conversational AI assistant</strong>. Access it at <a href="https://gemini.google.com" target="_blank">gemini.google.com</a> with your Google account.</p>

<h3>Create Your Free Account</h3>
<p>You only need a Gmail email. The free version gives you access to Gemini 2.5 Flash, enough for most marketing and business tasks.</p>

<h3>Available Plans</h3>
<ul>
  <li><strong>Free:</strong> Gemini 2.5 Flash, generous limits</li>
  <li><strong>Gemini Pro ($20/mo):</strong> Priority access, more queries per day, Google Workspace integration</li>
  <li><strong>Gemini Ultra:</strong> Most advanced model with superior reasoning</li>
</ul>

<h3>What Can Gemini Do for Your Business?</h3>
<ul>
  <li><strong>Reason:</strong> Analyze complex business problems</li>
  <li><strong>Analyze documents:</strong> Upload PDFs, contracts, reports</li>
  <li><strong>Generate content:</strong> Posts, emails, articles, scripts</li>
  <li><strong>Create images:</strong> With integrated Nano Banana</li>
</ul>

<h3>Your First Practical Conversation</h3>
<p>Start with a clear prompt: <em>"Act as a marketing consultant. Analyze my [your industry] business and give me 5 concrete strategies to attract more customers this month."</em></p>

<h3>Exercise</h3>
<p><strong>Ask Gemini to analyze your business and give 5 marketing ideas.</strong> Use this prompt: "I have a [describe briefly] business. What 5 digital marketing campaigns do you recommend to increase sales in 30 days?"</p>`,
    order_index: 1,
    duration_minutes: 20,
  },
  {
    module_id: '65abd5de-2407-492e-9879-374b5a4d1280',
    title: 'Google AI Studio: Tu Laboratorio Gratuito',
    title_en: 'Your Free AI Lab: Google AI Studio',
    content: `<h2>Accede a tu laboratorio sin costo</h2>
<p>Google AI Studio está disponible en <a href="https://studio.google.com" target="_blank">studio.google.com</a>. <strong>No requiere tarjeta de crédito</strong> y te da acceso a los modelos más avanzados de Google de forma gratuita.</p>

<h3>Modelos disponibles</h3>
<ul>
  <li><strong>Gemini 3 Pro:</strong> Generación de texto, análisis, razonamiento</li>
  <li><strong>Nano Banana 2 (gemini-3.1-flash-image-preview):</strong> Genera imágenes hasta 4K de resolución</li>
  <li><strong>Veo 3:</strong> Generación de video con audio nativo integrado</li>
</ul>

<h3>Interfaz y herramientas</h3>
<p>AI Studio te ofrece dos interfaces principales:</p>
<ul>
  <li><strong>Chat:</strong> Conversaciones largas con contexto</li>
  <li><strong>Playground:</strong> Experimentación rápida con parámetros</li>
</ul>

<h3>Parámetros clave</h3>
<p><strong>Temperatura:</strong> Controla creatividad vs precisión (0.0 = conservador, 1.0 = creativo)</p>
<p><strong>Tokens:</strong> Longitud máxima de respuesta (más tokens = respuestas más largas)</p>

<h3>Caso de uso: Marketing visual</h3>
<p>Nano Banana 2 puede generar imágenes profesionales para tus campañas. Desde portadas de blog hasta anuncios visuales, todo con prompts en lenguaje natural.</p>

<h3>Ejercicio</h3>
<p><strong>Genera tu primera imagen con Nano Banana.</strong> Accede a AI Studio, selecciona "Image generation", y usa este prompt: "Ilustración 2D minimalista de un profesional de negocios usando laptop, colores corporativos azul y verde, fondo claro, estilo flat design."</p>`,
    content_en: `<h2>Access Your Free Lab</h2>
<p>Google AI Studio is available at <a href="https://studio.google.com" target="_blank">studio.google.com</a>. <strong>No credit card required</strong> and gives you access to Google's most advanced models for free.</p>

<h3>Available Models</h3>
<ul>
  <li><strong>Gemini 3 Pro:</strong> Text generation, analysis, reasoning</li>
  <li><strong>Nano Banana 2 (gemini-3.1-flash-image-preview):</strong> Generates images up to 4K resolution</li>
  <li><strong>Veo 3:</strong> Video generation with native integrated audio</li>
</ul>

<h3>Interface and Tools</h3>
<p>AI Studio offers two main interfaces:</p>
<ul>
  <li><strong>Chat:</strong> Long conversations with context</li>
  <li><strong>Playground:</strong> Fast experimentation with parameters</li>
</ul>

<h3>Key Parameters</h3>
<p><strong>Temperature:</strong> Controls creativity vs precision (0.0 = conservative, 1.0 = creative)</p>
<p><strong>Tokens:</strong> Maximum response length (more tokens = longer responses)</p>

<h3>Use Case: Visual Marketing</h3>
<p>Nano Banana 2 can generate professional images for your campaigns. From blog covers to visual ads, all with natural language prompts.</p>

<h3>Exercise</h3>
<p><strong>Generate your first image with Nano Banana.</strong> Access AI Studio, select "Image generation", and use this prompt: "Minimalist 2D illustration of a business professional using laptop, corporate blue and green colors, light background, flat design style."</p>`,
    order_index: 2,
    duration_minutes: 20,
  },
  {
    module_id: '65abd5de-2407-492e-9879-374b5a4d1280',
    title: 'NotebookLM: Tu Asistente de Investigación',
    title_en: 'NotebookLM: Your Research Assistant',
    content: `<h2>Tu copiloto para procesar información</h2>
<p>NotebookLM, disponible en <a href="https://notebooklm.google.com" target="_blank">notebooklm.google.com</a>, es tu asistente especializado en <strong>analizar documentos, crear resúmenes y generar contenido educativo</strong> automáticamente.</p>

<h3>¿Qué puedes subir?</h3>
<ul>
  <li><strong>PDFs:</strong> Reportes, ebooks, manuales</li>
  <li><strong>Links:</strong> Artículos web, estudios de mercado</li>
  <li><strong>Documentos:</strong> Google Docs, presentaciones</li>
  <li><strong>Texto plano:</strong> Notas, transcripciones</li>
</ul>

<h3>Audio Overviews: Podcasts automáticos</h3>
<p>NotebookLM puede convertir tus documentos en <strong>podcasts de 5-10 minutos</strong> con voces naturales que conversan sobre el contenido. Perfecto para compartir con clientes o tu equipo.</p>

<h3>Video Overviews: Explicaciones visuales</h3>
<p>Genera videos explicativos automáticos de tus documentos. Ideal para onboarding, capacitaciones o contenido educativo.</p>

<h3>Conversación interactiva</h3>
<p>Puedes <em>unirte a la conversación</em> de los hosts de IA, haciendo preguntas en tiempo real sobre el contenido subido.</p>

<h3>Caso práctico: Marketing educativo</h3>
<p>Sube información sobre tu industria (tendencias, estudios, whitepaper) y genera un podcast automático para compartir con tus clientes como contenido de valor.</p>

<h3>Ejercicio</h3>
<p><strong>Crea tu primer Audio Overview:</strong> Sube un PDF sobre tu industria o un artículo relevante. Haz clic en "Generate Audio Overview" y escucha cómo NotebookLM convierte el contenido en una conversación de podcast profesional.</p>`,
    content_en: `<h2>Your Information Processing Copilot</h2>
<p>NotebookLM, available at <a href="https://notebooklm.google.com" target="_blank">notebooklm.google.com</a>, is your specialized assistant for <strong>analyzing documents, creating summaries, and generating educational content</strong> automatically.</p>

<h3>What Can You Upload?</h3>
<ul>
  <li><strong>PDFs:</strong> Reports, ebooks, manuals</li>
  <li><strong>Links:</strong> Web articles, market studies</li>
  <li><strong>Documents:</strong> Google Docs, presentations</li>
  <li><strong>Plain text:</strong> Notes, transcriptions</li>
</ul>

<h3>Audio Overviews: Automatic Podcasts</h3>
<p>NotebookLM can convert your documents into <strong>5-10 minute podcasts</strong> with natural voices conversing about the content. Perfect for sharing with clients or your team.</p>

<h3>Video Overviews: Visual Explanations</h3>
<p>Generate automatic explainer videos from your documents. Ideal for onboarding, training, or educational content.</p>

<h3>Interactive Conversation</h3>
<p>You can <em>join the AI hosts' conversation</em>, asking real-time questions about the uploaded content.</p>

<h3>Practical Case: Educational Marketing</h3>
<p>Upload information about your industry (trends, studies, whitepapers) and generate an automatic podcast to share with your clients as valuable content.</p>

<h3>Exercise</h3>
<p><strong>Create your first Audio Overview:</strong> Upload a PDF about your industry or a relevant article. Click "Generate Audio Overview" and listen to how NotebookLM converts the content into a professional podcast conversation.</p>`,
    order_index: 3,
    duration_minutes: 20,
  },
];

// MODULE 1: El Arte del Prompting Profesional
const module1Lessons = [
  {
    module_id: 'e4fed9fa-0989-4631-a4bb-dc9a08758eb8',
    title: 'Anatomía de un Prompt Perfecto',
    title_en: 'Anatomy of a Perfect Prompt',
    content: `<h2>Los 4 elementos de un prompt profesional</h2>
<p>Un prompt efectivo no es "háblame de marketing". Un prompt profesional tiene <strong>estructura y contexto</strong>. Aquí está la fórmula que funciona:</p>

<h3>1. Rol (quién queremos que sea la IA)</h3>
<p><em>Ejemplo:</em> "Actúa como experta en marketing digital para negocios locales de comida saludable."</p>

<h3>2. Contexto (información relevante)</h3>
<p><em>Ejemplo:</em> "Estamos lanzando un nuevo bowl de açaí con frutas orgánicas locales. Nuestro público son millennials health-conscious en ciudad urbana."</p>

<h3>3. Tarea (qué queremos que haga)</h3>
<p><em>Ejemplo:</em> "Crea un post de Instagram que comunique frescura, energía y salud."</p>

<h3>4. Formato (cómo lo queremos)</h3>
<p><em>Ejemplo:</em> "Incluye emoji, 3 hashtags relevantes y CTA para probar. Tono: cercano y entusiasta. Máximo 150 palabras."</p>

<h3>Comparación: Malo vs Bueno</h3>
<p><strong>❌ Prompt malo:</strong> "Hazme un post"</p>
<p><strong>✅ Prompt bueno:</strong> "Actúa como experta en marketing digital para negocios locales de comida saludable. Crea un post de Instagram para un nuevo bowl de açaí con frutas orgánicas. Público: millennials health-conscious. Incluye emoji, 3 hashtags y CTA. Tono: cercano y entusiasta. Máximo 150 palabras."</p>

<h3>Por qué funciona</h3>
<p>La IA necesita <strong>contexto</strong> igual que un empleado nuevo. Entre más específico seas, mejores resultados obtendrás. La diferencia entre un prompt genérico y uno estructurado es la diferencia entre contenido mediocre y contenido profesional.</p>

<h3>Ejercicio</h3>
<p><strong>Reescribe estos 5 prompts malos usando la fórmula de 4 elementos:</strong></p>
<ol>
  <li>"Dame ideas de contenido"</li>
  <li>"Escribe un email"</li>
  <li>"Ayúdame con marketing"</li>
  <li>"Crea un anuncio"</li>
  <li>"Necesito una estrategia"</li>
</ol>`,
    content_en: `<h2>The 4 Elements of a Professional Prompt</h2>
<p>An effective prompt isn't "tell me about marketing". A professional prompt has <strong>structure and context</strong>. Here's the formula that works:</p>

<h3>1. Role (who we want the AI to be)</h3>
<p><em>Example:</em> "Act as a digital marketing expert for local healthy food businesses."</p>

<h3>2. Context (relevant information)</h3>
<p><em>Example:</em> "We're launching a new açaí bowl with local organic fruits. Our audience is health-conscious millennials in an urban city."</p>

<h3>3. Task (what we want it to do)</h3>
<p><em>Example:</em> "Create an Instagram post that communicates freshness, energy, and health."</p>

<h3>4. Format (how we want it)</h3>
<p><em>Example:</em> "Include emoji, 3 relevant hashtags and CTA to try. Tone: friendly and enthusiastic. Maximum 150 words."</p>

<h3>Comparison: Bad vs Good</h3>
<p><strong>❌ Bad prompt:</strong> "Make me a post"</p>
<p><strong>✅ Good prompt:</strong> "Act as a digital marketing expert for local healthy food businesses. Create an Instagram post for a new açaí bowl with organic fruits. Audience: health-conscious millennials. Include emoji, 3 hashtags and CTA. Tone: friendly and enthusiastic. Maximum 150 words."</p>

<h3>Why It Works</h3>
<p>AI needs <strong>context</strong> just like a new employee. The more specific you are, the better results you'll get. The difference between a generic prompt and a structured one is the difference between mediocre content and professional content.</p>

<h3>Exercise</h3>
<p><strong>Rewrite these 5 bad prompts using the 4-element formula:</strong></p>
<ol>
  <li>"Give me content ideas"</li>
  <li>"Write an email"</li>
  <li>"Help me with marketing"</li>
  <li>"Create an ad"</li>
  <li>"I need a strategy"</li>
</ol>`,
    order_index: 0,
    duration_minutes: 20,
  },
  {
    module_id: 'e4fed9fa-0989-4631-a4bb-dc9a08758eb8',
    title: 'Técnicas de Prompting Avanzado',
    title_en: 'Advanced Prompting Techniques',
    content: `<h2>5 técnicas que multiplican tus resultados</h2>
<p>Una vez dominas la estructura básica, estas técnicas llevan tus prompts al siguiente nivel profesional.</p>

<h3>1. Few-Shot Learning (Aprendizaje por Ejemplos)</h3>
<p>Dale a la IA 2-3 ejemplos del estilo que quieres.</p>
<p><strong>Ejemplo:</strong> "Quiero posts estilo Apple. Ejemplos: 'Piénsalo diferente.' / 'La potencia al alcance de tu mano.' Ahora crea uno para mi producto."</p>

<h3>2. Chain-of-Thought (Razonamiento Paso a Paso)</h3>
<p>Pide a la IA que "piense en voz alta" antes de dar la respuesta final.</p>
<p><strong>Ejemplo:</strong> "Analiza paso a paso: 1) Identifica mi público objetivo, 2) Define su dolor principal, 3) Crea mensaje que lo resuelva."</p>

<h3>3. Iteración (Refinar con Follow-ups)</h3>
<p>No esperes perfección en el primer intento. Mejora con instrucciones adicionales.</p>
<p><strong>Ejemplo:</strong> Primer prompt → resultado → "Hazlo más corto y usa menos jerga técnica" → mejor resultado.</p>

<h3>4. Role-Playing Avanzado</h3>
<p>Combina múltiples roles para perspectivas más ricas.</p>
<p><strong>Ejemplo:</strong> "Actúa como consultor de marketing Y psicólogo del consumidor. Analiza por qué mi público compra productos orgánicos."</p>

<h3>5. Prompts Negativos</h3>
<p>Dile a la IA qué NO hacer para evitar errores comunes.</p>
<p><strong>Ejemplo:</strong> "Crea descripción de producto. NO uses jerga técnica, NO hagas párrafos largos, NO seas genérico."</p>

<h3>Ejercicio Práctico</h3>
<p><strong>Aplica cada técnica para crear contenido de marketing:</strong></p>
<ol>
  <li>Few-shot: Dale 3 ejemplos de tus mejores posts y pídele crear uno nuevo</li>
  <li>Chain-of-thought: Pídele analizar tu competencia paso a paso</li>
  <li>Iteración: Genera un email y mejóralo 3 veces</li>
  <li>Role-playing: Combina "marketer + diseñador" para concepto visual</li>
  <li>Negativos: Crea bio profesional con 5 restricciones claras</li>
</ol>`,
    content_en: `<h2>5 Techniques that Multiply Your Results</h2>
<p>Once you master the basic structure, these techniques take your prompts to the next professional level.</p>

<h3>1. Few-Shot Learning</h3>
<p>Give the AI 2-3 examples of the style you want.</p>
<p><strong>Example:</strong> "I want Apple-style posts. Examples: 'Think different.' / 'Power in the palm of your hand.' Now create one for my product."</p>

<h3>2. Chain-of-Thought Reasoning</h3>
<p>Ask the AI to "think out loud" before giving the final answer.</p>
<p><strong>Example:</strong> "Analyze step by step: 1) Identify my target audience, 2) Define their main pain point, 3) Create message that solves it."</p>

<h3>3. Iteration (Refine with Follow-ups)</h3>
<p>Don't expect perfection on the first try. Improve with additional instructions.</p>
<p><strong>Example:</strong> First prompt → result → "Make it shorter and use less technical jargon" → better result.</p>

<h3>4. Advanced Role-Playing</h3>
<p>Combine multiple roles for richer perspectives.</p>
<p><strong>Example:</strong> "Act as a marketing consultant AND consumer psychologist. Analyze why my audience buys organic products."</p>

<h3>5. Negative Prompts</h3>
<p>Tell the AI what NOT to do to avoid common mistakes.</p>
<p><strong>Example:</strong> "Create product description. DO NOT use technical jargon, DO NOT make long paragraphs, DO NOT be generic."</p>

<h3>Practical Exercise</h3>
<p><strong>Apply each technique to create marketing content:</strong></p>
<ol>
  <li>Few-shot: Give 3 examples of your best posts and ask it to create a new one</li>
  <li>Chain-of-thought: Ask it to analyze your competition step by step</li>
  <li>Iteration: Generate an email and improve it 3 times</li>
  <li>Role-playing: Combine "marketer + designer" for visual concept</li>
  <li>Negatives: Create professional bio with 5 clear restrictions</li>
</ol>`,
    order_index: 1,
    duration_minutes: 25,
  },
  {
    module_id: 'e4fed9fa-0989-4631-a4bb-dc9a08758eb8',
    title: 'Prompts para tu Negocio: Plantillas Listas',
    title_en: 'Business Prompt Templates',
    content: `<h2>10 plantillas copy-paste para usar hoy</h2>
<p>Estas plantillas están listas para usar. Solo reemplaza [tu negocio/producto/servicio] con tu información real.</p>

<h3>1. Análisis de Competencia</h3>
<p><em>"Actúa como analista de mercado. Investiga a [competidor] en [industria]. Identifica: 1) Su propuesta de valor, 2) Precios, 3) Fortalezas, 4) Debilidades, 5) Oportunidades para diferenciarnos."</em></p>

<h3>2. Ideas de Contenido</h3>
<p><em>"Eres community manager experto en [industria]. Mi negocio es [descripción]. Dame 20 ideas de contenido para Instagram divididas en: educativo, inspiracional, entretenimiento y ventas."</em></p>

<h3>3. Copywriting de Ventas</h3>
<p><em>"Escribe copy persuasivo para [producto/servicio]. Beneficios clave: [lista]. Público: [descripción]. Incluye: título gancho, 3 beneficios con emoji, objeciones resueltas, CTA fuerte. Tono: [profesional/casual/urgente]."</em></p>

<h3>4. Respuestas a Clientes</h3>
<p><em>"Crea respuesta profesional y empática para cliente que se queja de [problema]. Reconoce el problema, ofrece solución [describe], mantén tono cálido y profesional."</em></p>

<h3>5. Planificación de Campaña</h3>
<p><em>"Diseña campaña de marketing de 30 días para [objetivo]. Presupuesto: [monto]. Canales: [lista]. Incluye: objetivos SMART, estrategia por canal, calendario semanal, KPIs."</em></p>

<h3>6. Análisis FODA</h3>
<p><em>"Realiza análisis FODA completo para mi negocio: [descripción]. Industria: [nombre]. Competidores: [lista]. Sé específico y accionable en cada punto."</em></p>

<h3>7. Descripción de Producto</h3>
<p><em>"Crea descripción de producto para ecommerce. Producto: [nombre]. Características: [lista]. Beneficios: [lista]. Incluye: título SEO, descripción persuasiva (150 palabras), 5 bullets, especificaciones técnicas."</em></p>

<h3>8. Bio Profesional</h3>
<p><em>"Escribe bio profesional de 100 palabras para [LinkedIn/Instagram/Web]. Profesión: [nombre]. Experiencia: [años/logros]. Especialización: [área]. Tono: [profesional/accesible]. Incluye CTA."</em></p>

<h3>9. Propuesta de Valor</h3>
<p><em>"Define propuesta de valor única para [negocio]. Resuelve: [problema]. Diferente a competencia porque: [razón]. Formato: 1 oración de 20 palabras máximo, clara y memorable."</em></p>

<h3>10. Elevator Pitch</h3>
<p><em>"Crea elevator pitch de 30 segundos para [negocio/producto]. Público: [inversor/cliente/socio]. Incluye: problema, solución, diferenciador, CTA. Lenguaje simple y memorable."</em></p>

<h3>Ejercicio</h3>
<p><strong>Usa 5 plantillas diferentes hoy:</strong> Elige las que más necesites para tu negocio, personalízalas con tu información y prueba los resultados. Guarda las mejores en un documento.</p>`,
    content_en: `<h2>10 Copy-Paste Templates to Use Today</h2>
<p>These templates are ready to use. Just replace [your business/product/service] with your real information.</p>

<h3>1. Competitive Analysis</h3>
<p><em>"Act as a market analyst. Research [competitor] in [industry]. Identify: 1) Their value proposition, 2) Pricing, 3) Strengths, 4) Weaknesses, 5) Opportunities to differentiate."</em></p>

<h3>2. Content Ideas</h3>
<p><em>"You're an expert community manager in [industry]. My business is [description]. Give me 20 Instagram content ideas divided into: educational, inspirational, entertainment and sales."</em></p>

<h3>3. Sales Copywriting</h3>
<p><em>"Write persuasive copy for [product/service]. Key benefits: [list]. Audience: [description]. Include: catchy headline, 3 benefits with emoji, objections resolved, strong CTA. Tone: [professional/casual/urgent]."</em></p>

<h3>4. Customer Responses</h3>
<p><em>"Create professional and empathetic response for customer complaining about [problem]. Acknowledge problem, offer solution [describe], maintain warm and professional tone."</em></p>

<h3>5. Campaign Planning</h3>
<p><em>"Design 30-day marketing campaign for [objective]. Budget: [amount]. Channels: [list]. Include: SMART goals, strategy per channel, weekly calendar, KPIs."</em></p>

<h3>6. SWOT Analysis</h3>
<p><em>"Perform complete SWOT analysis for my business: [description]. Industry: [name]. Competitors: [list]. Be specific and actionable in each point."</em></p>

<h3>7. Product Description</h3>
<p><em>"Create product description for ecommerce. Product: [name]. Features: [list]. Benefits: [list]. Include: SEO title, persuasive description (150 words), 5 bullets, technical specs."</em></p>

<h3>8. Professional Bio</h3>
<p><em>"Write 100-word professional bio for [LinkedIn/Instagram/Web]. Profession: [name]. Experience: [years/achievements]. Specialization: [area]. Tone: [professional/accessible]. Include CTA."</em></p>

<h3>9. Value Proposition</h3>
<p><em>"Define unique value proposition for [business]. Solves: [problem]. Different from competition because: [reason]. Format: 1 sentence, 20 words max, clear and memorable."</em></p>

<h3>10. Elevator Pitch</h3>
<p><em>"Create 30-second elevator pitch for [business/product]. Audience: [investor/customer/partner]. Include: problem, solution, differentiator, CTA. Simple and memorable language."</em></p>

<h3>Exercise</h3>
<p><strong>Use 5 different templates today:</strong> Choose the ones you need most for your business, customize them with your information and test the results. Save the best ones in a document.</p>`,
    order_index: 2,
    duration_minutes: 20,
  },
  {
    module_id: 'e4fed9fa-0989-4631-a4bb-dc9a08758eb8',
    title: 'Gems: Crea tu Asistente IA Personalizado',
    title_en: 'Gems: Create Your Custom AI Assistant',
    content: `<h2>Tu equipo de marketing IA personalizado</h2>
<p>Los Gems de Google Gemini son <strong>asistentes de IA personalizados</strong> que memorizan tu voz de marca, conocen tu negocio y generan contenido consistente. Es como tener un empleado virtual entrenado específicamente para tu empresa.</p>

<h3>¿Qué es un Gem?</h3>
<p>Un Gem es una versión personalizada de Gemini con:</p>
<ul>
  <li><strong>Personalidad definida:</strong> Tono, estilo, valores</li>
  <li><strong>Conocimiento específico:</strong> Tu industria, productos, audiencia</li>
  <li><strong>Instrucciones permanentes:</strong> Qué hacer y qué evitar</li>
  <li><strong>Consistencia:</strong> Siempre genera contenido alineado a tu marca</li>
</ul>

<h3>Cómo crear tu primer Gem: Community Manager</h3>
<p><strong>Paso 1:</strong> En Gemini, haz clic en "Create Gem"</p>
<p><strong>Paso 2:</strong> Dale nombre: "Community Manager de [tu marca]"</p>
<p><strong>Paso 3:</strong> Define sus instrucciones base:</p>
<blockquote>
<p><em>"Eres el community manager oficial de [negocio]. Características del negocio: [descripción]. Público objetivo: [demografía + intereses]. Tono de marca: [profesional/casual/inspirador]. Valores: [lista 3-5]. Al crear contenido SIEMPRE: usa emojis relevantes, incluye CTA, hashtags estratégicos, lenguaje inclusivo. NUNCA: uses jerga excesiva, copies de competencia, prometas lo que no podemos cumplir."</em></p>
</blockquote>

<h3>Ejemplo práctico completo</h3>
<p>Negocio: Estudio de yoga urbano</p>
<p><strong>Instrucciones del Gem:</strong></p>
<p><em>"Eres community manager de YogaFlow, estudio boutique de yoga en [ciudad]. Público: mujeres 25-45 años, profesionales, buscan balance vida-trabajo. Tono: cálido, motivador, auténtico. Valores: mindfulness, comunidad, bienestar holístico. Al crear posts: usa lenguaje inclusivo, menciona beneficios emocionales + físicos, invita a clases, máximo 3 emojis por post, hashtags locales + nicho (#YogaFlow #MindfulnessEnLaCiudad). Nunca: promesas irreales, comparaciones con competencia, lenguaje elitista."</em></p>

<h3>Compartir con tu equipo</h3>
<p>Los Gems se pueden compartir. Si tienes equipo, todos usarán el mismo asistente con la misma voz de marca. Consistencia automática en todo tu contenido.</p>

<h3>Ejercicio</h3>
<p><strong>Crea tu Gem "Community Manager de mi marca" y genera 5 posts diferentes:</strong></p>
<ol>
  <li>Post educativo sobre tu industria</li>
  <li>Post de venta suave de producto/servicio</li>
  <li>Post inspiracional para tu audiencia</li>
  <li>Post de behind-the-scenes</li>
  <li>Post respondiendo FAQ común</li>
</ol>
<p>Evalúa: ¿Mantienen el mismo tono? ¿Son consistentes con tu marca?</p>`,
    content_en: `<h2>Your Personalized AI Marketing Team</h2>
<p>Google Gemini Gems are <strong>custom AI assistants</strong> that memorize your brand voice, know your business, and generate consistent content. It's like having a virtual employee trained specifically for your company.</p>

<h3>What is a Gem?</h3>
<p>A Gem is a customized version of Gemini with:</p>
<ul>
  <li><strong>Defined personality:</strong> Tone, style, values</li>
  <li><strong>Specific knowledge:</strong> Your industry, products, audience</li>
  <li><strong>Permanent instructions:</strong> What to do and what to avoid</li>
  <li><strong>Consistency:</strong> Always generates content aligned with your brand</li>
</ul>

<h3>How to Create Your First Gem: Community Manager</h3>
<p><strong>Step 1:</strong> In Gemini, click "Create Gem"</p>
<p><strong>Step 2:</strong> Name it: "Community Manager for [your brand]"</p>
<p><strong>Step 3:</strong> Define its base instructions:</p>
<blockquote>
<p><em>"You are the official community manager for [business]. Business characteristics: [description]. Target audience: [demographics + interests]. Brand tone: [professional/casual/inspiring]. Values: [list 3-5]. When creating content ALWAYS: use relevant emojis, include CTA, strategic hashtags, inclusive language. NEVER: use excessive jargon, copy from competition, promise what we can't deliver."</em></p>
</blockquote>

<h3>Complete Practical Example</h3>
<p>Business: Urban yoga studio</p>
<p><strong>Gem Instructions:</strong></p>
<p><em>"You are the community manager for YogaFlow, a boutique yoga studio in [city]. Audience: women 25-45 years old, professionals, seeking work-life balance. Tone: warm, motivating, authentic. Values: mindfulness, community, holistic wellness. When creating posts: use inclusive language, mention emotional + physical benefits, invite to classes, max 3 emojis per post, local + niche hashtags (#YogaFlow #MindfulnessInTheCity). Never: unrealistic promises, comparisons with competition, elitist language."</em></p>

<h3>Share with Your Team</h3>
<p>Gems can be shared. If you have a team, everyone will use the same assistant with the same brand voice. Automatic consistency across all your content.</p>

<h3>Exercise</h3>
<p><strong>Create your "Community Manager for my brand" Gem and generate 5 different posts:</strong></p>
<ol>
  <li>Educational post about your industry</li>
  <li>Soft sell post for product/service</li>
  <li>Inspirational post for your audience</li>
  <li>Behind-the-scenes post</li>
  <li>Post answering common FAQ</li>
</ol>
<p>Evaluate: Do they maintain the same tone? Are they consistent with your brand?</p>`,
    order_index: 3,
    duration_minutes: 25,
  },
];

// MODULE 2: Contenido que Conecta con IA
const module2Lessons = [
  {
    module_id: '2c231825-64f4-4ebd-93f0-5061c60c7bca',
    title: 'Estrategia de Contenido con IA',
    title_en: 'Content Strategy with AI',
    content: `<h2>De caos a calendario en 1 hora</h2>
<p>La mayoría de negocios publica contenido reactivo: "¿qué subo hoy?" Eso termina. Con IA, diseñas <strong>estrategia completa de contenido en 1 hora</strong> que te lleva todo el mes.</p>

<h3>Paso 1: Define tus pilares de contenido</h3>
<p>Usa Gemini para identificar 3-5 categorías principales de contenido para tu negocio.</p>
<p><strong>Prompt:</strong> <em>"Actúa como estratega de contenido. Mi negocio: [descripción]. Público: [descripción]. Define 5 pilares de contenido (educativo, inspiracional, ventas, entretenimiento, comunidad) con 3 subtemas por pilar."</em></p>

<h3>Paso 2: Crea calendario editorial de 30 días</h3>
<p>Con los pilares definidos, genera un mes completo de ideas.</p>
<p><strong>Prompt:</strong> <em>"Usando estos 5 pilares: [lista], crea calendario de contenido de 30 días para Instagram. Distribuye: 40% educativo, 30% inspiracional, 20% ventas, 10% entretenimiento. Incluye: fecha, tipo de post, tema, gancho."</em></p>

<h3>Categorías de contenido efectivo</h3>
<ul>
  <li><strong>Educativo:</strong> Tips, tutoriales, datos de industria</li>
  <li><strong>Inspiracional:</strong> Testimonios, casos de éxito, motivación</li>
  <li><strong>Ventas:</strong> Beneficios producto, ofertas, demos</li>
  <li><strong>Entretenimiento:</strong> Memes de nicho, behind-scenes, trends</li>
</ul>

<h3>Batch Content: Una semana en 1 hora</h3>
<p>En vez de crear contenido diario, usa IA para generar 7 posts de una vez. Mantiene consistencia y ahorra tiempo.</p>
<p><strong>Ejemplo de batch:</strong></p>
<p><em>"Crea 7 posts de Instagram para esta semana. Lunes: tip educativo sobre [tema]. Martes: caso de éxito cliente. Miércoles: beneficio producto con CTA. Jueves: dato sorprendente industria. Viernes: motivacional fin de semana. Sábado: behind-scenes. Domingo: pregunta para engagement."</em></p>

<h3>Herramientas de organización</h3>
<p>Copia el calendario a:</p>
<ul>
  <li>Google Sheets para planeación</li>
  <li>Notion para banco de contenido</li>
  <li>Herramientas de scheduling (Later, Buffer) para automatizar publicación</li>
</ul>

<h3>Ejercicio</h3>
<p><strong>Crea tu calendario editorial de 30 días completo:</strong></p>
<ol>
  <li>Define tus 5 pilares con Gemini</li>
  <li>Genera calendario de 30 días</li>
  <li>Batch: crea contenido completo para los primeros 7 días</li>
  <li>Organiza en Google Sheets o Notion</li>
</ol>`,
    content_en: `<h2>From Chaos to Calendar in 1 Hour</h2>
<p>Most businesses post reactive content: "what should I post today?" That's over. With AI, you design a <strong>complete content strategy in 1 hour</strong> that lasts all month.</p>

<h3>Step 1: Define Your Content Pillars</h3>
<p>Use Gemini to identify 3-5 main content categories for your business.</p>
<p><strong>Prompt:</strong> <em>"Act as a content strategist. My business: [description]. Audience: [description]. Define 5 content pillars (educational, inspirational, sales, entertainment, community) with 3 sub-topics per pillar."</em></p>

<h3>Step 2: Create 30-Day Editorial Calendar</h3>
<p>With pillars defined, generate a full month of ideas.</p>
<p><strong>Prompt:</strong> <em>"Using these 5 pillars: [list], create 30-day content calendar for Instagram. Distribute: 40% educational, 30% inspirational, 20% sales, 10% entertainment. Include: date, post type, topic, hook."</em></p>

<h3>Effective Content Categories</h3>
<ul>
  <li><strong>Educational:</strong> Tips, tutorials, industry data</li>
  <li><strong>Inspirational:</strong> Testimonials, success stories, motivation</li>
  <li><strong>Sales:</strong> Product benefits, offers, demos</li>
  <li><strong>Entertainment:</strong> Niche memes, behind-the-scenes, trends</li>
</ul>

<h3>Batch Content: One Week in 1 Hour</h3>
<p>Instead of creating daily content, use AI to generate 7 posts at once. Maintains consistency and saves time.</p>
<p><strong>Batch example:</strong></p>
<p><em>"Create 7 Instagram posts for this week. Monday: educational tip about [topic]. Tuesday: client success story. Wednesday: product benefit with CTA. Thursday: surprising industry fact. Friday: weekend motivational. Saturday: behind-the-scenes. Sunday: engagement question."</em></p>

<h3>Organization Tools</h3>
<p>Copy the calendar to:</p>
<ul>
  <li>Google Sheets for planning</li>
  <li>Notion for content bank</li>
  <li>Scheduling tools (Later, Buffer) to automate publishing</li>
</ul>

<h3>Exercise</h3>
<p><strong>Create your complete 30-day editorial calendar:</strong></p>
<ol>
  <li>Define your 5 pillars with Gemini</li>
  <li>Generate 30-day calendar</li>
  <li>Batch: create complete content for the first 7 days</li>
  <li>Organize in Google Sheets or Notion</li>
</ol>`,
    order_index: 0,
    duration_minutes: 20,
  },
  {
    module_id: '2c231825-64f4-4ebd-93f0-5061c60c7bca',
    title: 'Posts para Redes Sociales',
    title_en: 'Social Media Posts',
    content: `<h2>Contenido profesional para cada plataforma</h2>
<p>Cada red social tiene su lenguaje. Un post perfecto para Instagram falla en LinkedIn. Aquí está cómo crear contenido nativo optimizado para cada plataforma con IA.</p>

<h3>Instagram: Captions que Conectan</h3>
<p><strong>Estructura ganadora:</strong> Hook (primera línea) + Storytelling (cuerpo) + CTA (cierre)</p>
<p><strong>Prompt template:</strong></p>
<p><em>"Crea caption para Instagram sobre [tema]. Hook: pregunta provocativa o dato sorprendente (primera línea). Storytelling: 3 párrafos con [beneficio/problema/solución]. CTA: invita a [acción]. Incluye 5 emojis estratégicos y 10 hashtags (5 nicho, 3 locales, 2 amplios). Tono: [cercano/profesional/inspirador]. Máximo 200 palabras."</em></p>

<h3>LinkedIn: Autoridad Profesional</h3>
<p><strong>Estructura:</strong> Insight profesional + Datos/caso + Aprendizaje + Conversación</p>
<p><strong>Prompt template:</strong></p>
<p><em>"Escribe post de LinkedIn sobre [tema profesional]. Comienza con insight o pregunta que genere debate. Párrafo 2: dato estadístico o caso real. Párrafo 3: aprendizaje aplicable. Cierre: pregunta para comentarios. Tono: profesional pero accesible. Sin emojis excesivos. 150-250 palabras. Incluye 3 hashtags profesionales."</em></p>

<h3>Facebook: Comunidad y Conversación</h3>
<p><strong>Estructura:</strong> Personal + Valor + Engagement</p>
<p><strong>Prompt template:</strong></p>
<p><em>"Post para Facebook dirigido a [comunidad]. Empieza personal (anécdota breve). Entrega valor (tip o recurso). Termina con pregunta abierta para comentarios. Tono conversacional. 100-150 palabras. 2-3 emojis."</em></p>

<h3>TikTok/Reels: Scripts Cortos que Enganchan</h3>
<p><strong>Estructura:</strong> Hook 3 segundos + Problema + Solución rápida + CTA</p>
<p><strong>Prompt template:</strong></p>
<p><em>"Escribe script para Reel de 30 segundos sobre [tema]. Segundo 0-3: hook visual + texto en pantalla impactante. Segundo 4-20: muestra problema común y solución en 3 pasos. Segundo 21-30: CTA y texto final. Indica qué mostrar visualmente en cada segundo. Tono: dinámico y directo."</em></p>

<h3>Carruseles Educativos (Instagram/LinkedIn)</h3>
<p><strong>Formato de alto engagement</strong></p>
<p><strong>Prompt:</strong></p>
<p><em>"Crea carrusel de 8 slides sobre [tema educativo]. Slide 1: título gancho + número (Ej: 5 Errores...). Slides 2-7: un punto por slide con título + 2 bullets explicativos. Slide 8: resumen + CTA. Dame texto para cada slide."</em></p>

<h3>Ejercicio</h3>
<p><strong>Crea contenido nativo para 4 plataformas sobre el mismo tema:</strong></p>
<ol>
  <li>Instagram: caption completo con hashtags</li>
  <li>LinkedIn: post profesional generando debate</li>
  <li>Facebook: conversacional para comunidad</li>
  <li>TikTok/Reels: script de 30 segundos</li>
</ol>
<p>Nota cómo el MISMO tema se adapta a cada plataforma manteniendo tu mensaje central.</p>`,
    content_en: `<h2>Professional Content for Each Platform</h2>
<p>Each social network has its language. A perfect Instagram post fails on LinkedIn. Here's how to create native optimized content for each platform with AI.</p>

<h3>Instagram: Captions that Connect</h3>
<p><strong>Winning structure:</strong> Hook (first line) + Storytelling (body) + CTA (close)</p>
<p><strong>Prompt template:</strong></p>
<p><em>"Create Instagram caption about [topic]. Hook: provocative question or surprising fact (first line). Storytelling: 3 paragraphs with [benefit/problem/solution]. CTA: invite to [action]. Include 5 strategic emojis and 10 hashtags (5 niche, 3 local, 2 broad). Tone: [friendly/professional/inspiring]. Maximum 200 words."</em></p>

<h3>LinkedIn: Professional Authority</h3>
<p><strong>Structure:</strong> Professional insight + Data/case + Learning + Conversation</p>
<p><strong>Prompt template:</strong></p>
<p><em>"Write LinkedIn post about [professional topic]. Start with insight or question that generates debate. Paragraph 2: statistical data or real case. Paragraph 3: applicable learning. Close: question for comments. Tone: professional but accessible. No excessive emojis. 150-250 words. Include 3 professional hashtags."</em></p>

<h3>Facebook: Community and Conversation</h3>
<p><strong>Structure:</strong> Personal + Value + Engagement</p>
<p><strong>Prompt template:</strong></p>
<p><em>"Facebook post for [community]. Start personal (brief anecdote). Deliver value (tip or resource). End with open question for comments. Conversational tone. 100-150 words. 2-3 emojis."</em></p>

<h3>TikTok/Reels: Short Scripts that Hook</h3>
<p><strong>Structure:</strong> 3-second hook + Problem + Quick solution + CTA</p>
<p><strong>Prompt template:</strong></p>
<p><em>"Write script for 30-second Reel about [topic]. Second 0-3: visual hook + impactful on-screen text. Second 4-20: show common problem and solution in 3 steps. Second 21-30: CTA and final text. Indicate what to show visually each second. Tone: dynamic and direct."</em></p>

<h3>Educational Carousels (Instagram/LinkedIn)</h3>
<p><strong>High-engagement format</strong></p>
<p><strong>Prompt:</strong></p>
<p><em>"Create 8-slide carousel about [educational topic]. Slide 1: catchy title + number (Ex: 5 Mistakes...). Slides 2-7: one point per slide with title + 2 explanatory bullets. Slide 8: summary + CTA. Give me text for each slide."</em></p>

<h3>Exercise</h3>
<p><strong>Create native content for 4 platforms on the same topic:</strong></p>
<ol>
  <li>Instagram: complete caption with hashtags</li>
  <li>LinkedIn: professional post generating debate</li>
  <li>Facebook: conversational for community</li>
  <li>TikTok/Reels: 30-second script</li>
</ol>
<p>Note how the SAME topic adapts to each platform while maintaining your core message.</p>`,
    order_index: 1,
    duration_minutes: 25,
  },
  {
    module_id: '2c231825-64f4-4ebd-93f0-5061c60c7bca',
    title: 'Blogs y Newsletters que Venden',
    title_en: 'Blogs and Newsletters that Sell',
    content: `<h2>Contenido largo que convierte</h2>
<p>Los blogs y newsletters son tu oportunidad de profundizar, educar y vender de forma natural. Con IA, pasas de idea a artículo publicable en <strong>15 minutos</strong>.</p>

<h3>Estructura de artículo que funciona</h3>
<ol>
  <li><strong>Título SEO:</strong> Incluye keyword + beneficio + número si aplica</li>
  <li><strong>Intro Hook:</strong> Problema o pregunta que engancha (2-3 oraciones)</li>
  <li><strong>Cuerpo con subtítulos H2/H3:</strong> Divide en secciones escaneables</li>
  <li><strong>Ejemplos prácticos:</strong> Datos, casos, screenshots</li>
  <li><strong>CTA estratégico:</strong> Al medio y al final</li>
</ol>

<h3>Prompt para artículo completo</h3>
<p><em>"Escribe artículo de blog de 1200 palabras sobre [tema]. Keyword principal: [palabra]. Público: [descripción]. Estructura: 1) Título SEO con keyword, 2) Intro: problema que enfrenta el lector (100 palabras), 3) 5 secciones H2 con subtítulos descriptivos, cada una 150-200 palabras con ejemplos, 4) Conclusión con CTA a [acción]. Tono: [profesional/educativo/conversacional]. Incluye 2-3 listas con bullets."</em></p>

<h3>SEO básico con IA</h3>
<p><strong>Research de keywords:</strong></p>
<p><em>"Dame 10 keywords long-tail relacionadas con [tema] que mi público [descripción] está buscando en Google. Ordénalas por potencial de tráfico y facilidad de rankeo."</em></p>

<p><strong>Meta description:</strong></p>
<p><em>"Escribe meta description de 155 caracteres para artículo titulado [título]. Incluye keyword [palabra] y beneficio claro. Debe invitar al clic."</em></p>

<h3>Newsletters semanales</h3>
<p>Estructura ganadora para newsletter que la gente LEE:</p>
<p><strong>Prompt:</strong></p>
<p><em>"Crea newsletter semanal para [audiencia]. Subject line: curioso y beneficio claro (máx 50 caracteres). Estructura: 1) Intro personal (2 oraciones), 2) Tema principal: [tema educativo] en 200 palabras con insight accionable, 3) Tips rápidos: 3 bullets de valor, 4) Recurso recomendado: herramienta/artículo, 5) CTA: [acción]. Tono: [conversacional/profesional]."</em></p>

<h3>De idea a publicación en 15 minutos</h3>
<p><strong>Proceso completo:</strong></p>
<ol>
  <li><strong>Minuto 0-3:</strong> Research keywords con Gemini</li>
  <li><strong>Minuto 3-5:</strong> Genera outline (estructura del artículo)</li>
  <li><strong>Minuto 5-12:</strong> Genera artículo completo sección por sección</li>
  <li><strong>Minuto 12-15:</strong> Revisión humana, ajustes de tono, agregar experiencia personal</li>
</ol>

<h3>El toque humano</h3>
<p>La IA genera el 80% del contenido. El 20% crítico lo aportas tú:</p>
<ul>
  <li>Anécdotas personales o de clientes</li>
  <li>Tu opinión única o experiencia</li>
  <li>Humor o estilo personal</li>
  <li>Llamados a acción específicos de tu negocio</li>
</ul>

<h3>Ejercicio</h3>
<p><strong>Crea un artículo completo de blog y una newsletter:</strong></p>
<ol>
  <li>Research: encuentra 5 keywords long-tail para tu nicho</li>
  <li>Genera artículo completo de 1000+ palabras</li>
  <li>Crea meta description optimizada</li>
  <li>Adapta el artículo a formato newsletter</li>
  <li>Agrega tu toque personal (20% humano)</li>
</ol>`,
    content_en: `<h2>Long-Form Content that Converts</h2>
<p>Blogs and newsletters are your opportunity to go deep, educate, and sell naturally. With AI, you go from idea to publishable article in <strong>15 minutes</strong>.</p>

<h3>Article Structure that Works</h3>
<ol>
  <li><strong>SEO Title:</strong> Include keyword + benefit + number if applicable</li>
  <li><strong>Intro Hook:</strong> Problem or question that hooks (2-3 sentences)</li>
  <li><strong>Body with H2/H3 subtitles:</strong> Divide into scannable sections</li>
  <li><strong>Practical examples:</strong> Data, cases, screenshots</li>
  <li><strong>Strategic CTA:</strong> In the middle and at the end</li>
</ol>

<h3>Prompt for Complete Article</h3>
<p><em>"Write 1200-word blog article about [topic]. Main keyword: [word]. Audience: [description]. Structure: 1) SEO title with keyword, 2) Intro: problem reader faces (100 words), 3) 5 H2 sections with descriptive subtitles, each 150-200 words with examples, 4) Conclusion with CTA to [action]. Tone: [professional/educational/conversational]. Include 2-3 bulleted lists."</em></p>

<h3>Basic SEO with AI</h3>
<p><strong>Keyword research:</strong></p>
<p><em>"Give me 10 long-tail keywords related to [topic] that my audience [description] is searching on Google. Order them by traffic potential and ranking ease."</em></p>

<p><strong>Meta description:</strong></p>
<p><em>"Write 155-character meta description for article titled [title]. Include keyword [word] and clear benefit. Should invite the click."</em></p>

<h3>Weekly Newsletters</h3>
<p>Winning structure for newsletter people READ:</p>
<p><strong>Prompt:</strong></p>
<p><em>"Create weekly newsletter for [audience]. Subject line: curious and clear benefit (max 50 characters). Structure: 1) Personal intro (2 sentences), 2) Main topic: [educational topic] in 200 words with actionable insight, 3) Quick tips: 3 value bullets, 4) Recommended resource: tool/article, 5) CTA: [action]. Tone: [conversational/professional]."</em></p>

<h3>From Idea to Publication in 15 Minutes</h3>
<p><strong>Complete process:</strong></p>
<ol>
  <li><strong>Minute 0-3:</strong> Keyword research with Gemini</li>
  <li><strong>Minute 3-5:</strong> Generate outline (article structure)</li>
  <li><strong>Minute 5-12:</strong> Generate complete article section by section</li>
  <li><strong>Minute 12-15:</strong> Human review, tone adjustments, add personal experience</li>
</ol>

<h3>The Human Touch</h3>
<p>AI generates 80% of content. The critical 20% comes from you:</p>
<ul>
  <li>Personal or client anecdotes</li>
  <li>Your unique opinion or experience</li>
  <li>Humor or personal style</li>
  <li>Specific calls to action for your business</li>
</ul>

<h3>Exercise</h3>
<p><strong>Create a complete blog article and newsletter:</strong></p>
<ol>
  <li>Research: find 5 long-tail keywords for your niche</li>
  <li>Generate complete 1000+ word article</li>
  <li>Create optimized meta description</li>
  <li>Adapt article to newsletter format</li>
  <li>Add your personal touch (20% human)</li>
</ol>`,
    order_index: 2,
    duration_minutes: 25,
  },
  {
    module_id: '2c231825-64f4-4ebd-93f0-5061c60c7bca',
    title: 'Servicio al Cliente con IA',
    title_en: 'Customer Service with AI',
    content: `<h2>Respuestas profesionales en segundos</h2>
<p>El servicio al cliente puede consumir horas diarias. Con IA, creas un <strong>banco de respuestas profesionales</strong> y scripts para manejar el 80% de consultas en minutos, no horas.</p>

<h3>Banco de FAQs con IA</h3>
<p>Identifica las 20 preguntas más frecuentes y crea respuestas perfectas.</p>
<p><strong>Prompt:</strong></p>
<p><em>"Actúa como especialista en servicio al cliente para [tipo de negocio]. Genera 20 preguntas frecuentes que clientes hacen sobre: productos, envíos, devoluciones, pagos, garantías. Por cada pregunta, dame respuesta profesional, empática y clara (máximo 100 palabras). Incluye: saludo, respuesta directa, información adicional útil, cierre amable."</em></p>

<h3>Scripts para chatbot profesional</h3>
<p>Diseña flujos conversacionales que parecen humanos.</p>

<p><strong>1. Saludo:</strong></p>
<p><em>"Crea 5 variaciones de saludo para chatbot de [negocio]. Debe ser: cálido, profesional, mencionar nombre del negocio, ofrecer ayuda específica."</em></p>

<p><strong>2. Diagnóstico:</strong></p>
<p><em>"Crea preguntas de diagnóstico para entender necesidad del cliente. Formato: opción múltiple con 4 categorías principales de consulta."</em></p>

<p><strong>3. Solución:</strong></p>
<p><em>"Para cada categoría [lista], dame respuesta que: resuelva el problema, ofrezca recurso adicional (link/video), invite a siguiente paso."</em></p>

<p><strong>4. Cierre:</strong></p>
<p><em>"Crea 3 mensajes de cierre diferentes: 1) problema resuelto, 2) derivar a humano, 3) feedback y despedida."</em></p>

<h3>Responder reseñas (positivas y negativas)</h3>

<p><strong>Reseña positiva (5 estrellas):</strong></p>
<p><em>"Crea respuesta a reseña positiva: [copia reseña]. Debe: agradecer específicamente lo que mencionan, reforzar valor, invitar a recomendar o volver. Máximo 50 palabras. Tono: genuino y cálido."</em></p>

<p><strong>Reseña negativa (1-2 estrellas):</strong></p>
<p><em>"Responde profesionalmente a reseña negativa: [copia reseña]. Estructura: 1) Disculpa sin excusas, 2) Reconoce específicamente el problema, 3) Explica solución o compensación, 4) Invita a contacto privado para resolver. Tono: empático y profesional. Máximo 100 palabras."</em></p>

<h3>Emails post-compra automatizados</h3>

<p><strong>Email de agradecimiento (día 1):</strong></p>
<p><em>"Escribe email de agradecimiento post-compra de [producto]. Incluye: agradecimiento personal, confirmación de compra, qué esperar (envío/acceso), recursos útiles (guía de uso), invitación a contactar si necesita ayuda. Tono: cálido y útil. Subject line atractivo."</em></p>

<p><strong>Email de feedback (día 7):</strong></p>
<p><em>"Email pidiendo feedback después de 7 días de compra. Debe: referenciar producto comprado, preguntar experiencia, ofrecer incentivo por reseña (descuento 10%), hacer proceso de feedback fácil (link directo). Tono: agradecido y no invasivo."</em></p>

<h3>Crear Gem de Servicio al Cliente</h3>
<p>Configura un Gem especializado para tu equipo de soporte:</p>
<p><strong>Instrucciones del Gem:</strong></p>
<p><em>"Eres el asistente de servicio al cliente de [negocio]. Política de devoluciones: [describe]. Tiempos de envío: [describe]. Garantías: [describe]. Al responder: SIEMPRE sé empático, usa nombre del cliente, ofrece solución específica, menciona plazo de resolución. NUNCA prometas lo que no podemos cumplir, uses lenguaje técnico, derives sin intentar ayudar primero. Tono: profesional, cálido, orientado a solución."</em></p>

<h3>Ejercicio</h3>
<p><strong>Crea tu sistema completo de servicio al cliente con IA:</strong></p>
<ol>
  <li>Genera banco de 15 FAQs con respuestas profesionales</li>
  <li>Diseña flujo de chatbot (saludo → diagnóstico → solución → cierre)</li>
  <li>Crea respuestas para 3 reseñas positivas y 2 negativas</li>
  <li>Escribe 2 emails post-compra (agradecimiento + feedback)</li>
  <li>Configura Gem de servicio al cliente con tus políticas</li>
</ol>
<p>Guarda todo en un documento para que tu equipo (o tú) lo use diariamente.</p>`,
    content_en: `<h2>Professional Responses in Seconds</h2>
<p>Customer service can consume hours daily. With AI, you create a <strong>professional response bank</strong> and scripts to handle 80% of inquiries in minutes, not hours.</p>

<h3>FAQ Bank with AI</h3>
<p>Identify the 20 most frequent questions and create perfect answers.</p>
<p><strong>Prompt:</strong></p>
<p><em>"Act as customer service specialist for [business type]. Generate 20 frequently asked questions customers ask about: products, shipping, returns, payments, warranties. For each question, give me professional, empathetic, and clear answer (maximum 100 words). Include: greeting, direct answer, useful additional information, friendly close."</em></p>

<h3>Professional Chatbot Scripts</h3>
<p>Design conversational flows that seem human.</p>

<p><strong>1. Greeting:</strong></p>
<p><em>"Create 5 greeting variations for [business] chatbot. Must be: warm, professional, mention business name, offer specific help."</em></p>

<p><strong>2. Diagnosis:</strong></p>
<p><em>"Create diagnostic questions to understand customer need. Format: multiple choice with 4 main inquiry categories."</em></p>

<p><strong>3. Solution:</strong></p>
<p><em>"For each category [list], give me response that: solves the problem, offers additional resource (link/video), invites next step."</em></p>

<p><strong>4. Close:</strong></p>
<p><em>"Create 3 different closing messages: 1) problem solved, 2) escalate to human, 3) feedback and goodbye."</em></p>

<h3>Respond to Reviews (Positive and Negative)</h3>

<p><strong>Positive review (5 stars):</strong></p>
<p><em>"Create response to positive review: [copy review]. Must: thank specifically for what they mention, reinforce value, invite to recommend or return. Maximum 50 words. Tone: genuine and warm."</em></p>

<p><strong>Negative review (1-2 stars):</strong></p>
<p><em>"Respond professionally to negative review: [copy review]. Structure: 1) Apologize without excuses, 2) Acknowledge specific problem, 3) Explain solution or compensation, 4) Invite private contact to resolve. Tone: empathetic and professional. Maximum 100 words."</em></p>

<h3>Automated Post-Purchase Emails</h3>

<p><strong>Thank you email (day 1):</strong></p>
<p><em>"Write post-purchase thank you email for [product]. Include: personal thanks, purchase confirmation, what to expect (shipping/access), useful resources (usage guide), invitation to contact if help needed. Tone: warm and helpful. Attractive subject line."</em></p>

<p><strong>Feedback email (day 7):</strong></p>
<p><em>"Email asking for feedback after 7 days of purchase. Must: reference purchased product, ask about experience, offer incentive for review (10% discount), make feedback process easy (direct link). Tone: grateful and non-invasive."</em></p>

<h3>Create Customer Service Gem</h3>
<p>Set up a specialized Gem for your support team:</p>
<p><strong>Gem Instructions:</strong></p>
<p><em>"You are the customer service assistant for [business]. Return policy: [describe]. Shipping times: [describe]. Warranties: [describe]. When responding: ALWAYS be empathetic, use customer name, offer specific solution, mention resolution timeframe. NEVER promise what we can't deliver, use technical language, escalate without trying to help first. Tone: professional, warm, solution-oriented."</em></p>

<h3>Exercise</h3>
<p><strong>Create your complete customer service system with AI:</strong></p>
<ol>
  <li>Generate bank of 15 FAQs with professional answers</li>
  <li>Design chatbot flow (greeting → diagnosis → solution → close)</li>
  <li>Create responses for 3 positive and 2 negative reviews</li>
  <li>Write 2 post-purchase emails (thank you + feedback)</li>
  <li>Set up customer service Gem with your policies</li>
</ol>
<p>Save everything in a document for your team (or you) to use daily.</p>`,
    order_index: 3,
    duration_minutes: 20,
  },
];

export async function seedMarketingLessons() {
  const supabase = createServiceClient();

  console.log('🚀 Inserting Module 0 lessons...');
  const { error: error0 } = await supabase.from('lessons').insert(module0Lessons);

  if (error0) {
    console.error('❌ Module 0 error:', error0);
    return { success: false, error: error0.message, module: 0 };
  } else {
    console.log('✅ Module 0: 4 lessons inserted');
  }

  console.log('\n🚀 Inserting Module 1 lessons...');
  const { error: error1 } = await supabase.from('lessons').insert(module1Lessons);

  if (error1) {
    console.error('❌ Module 1 error:', error1);
    return { success: false, error: error1.message, module: 1 };
  } else {
    console.log('✅ Module 1: 4 lessons inserted');
  }

  console.log('\n🚀 Inserting Module 2 lessons...');
  const { error: error2 } = await supabase.from('lessons').insert(module2Lessons);

  if (error2) {
    console.error('❌ Module 2 error:', error2);
    return { success: false, error: error2.message, module: 2 };
  } else {
    console.log('✅ Module 2: 4 lessons inserted');
  }

  console.log('\n✨ Done! Total: 12 lessons inserted across 3 modules');
  return { success: true };
}
