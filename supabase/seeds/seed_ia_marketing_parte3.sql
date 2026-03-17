-- ============================================================
-- SEED: IA para Marketing y Negocios - Parte 3 (Modulos 6-9)
-- Módulo 6 lecciones 2-3 + Módulos 7, 8, 9 completos
-- Este archivo asume que el curso y módulos 0-6 ya existen
-- ============================================================

BEGIN;

-- ============================================================
-- IMPORTANTE: Este seed NO elimina el curso existente
-- Solo agrega lecciones faltantes a módulos 6, 7, 8, 9
-- ============================================================

DO $$
DECLARE
  v_course_id uuid;
  v_module_id uuid;
BEGIN

  -- ============================================================
  -- Obtener el ID del curso por slug
  -- ============================================================
  SELECT id INTO v_course_id
  FROM public.courses
  WHERE slug = 'ia-para-marketing-y-negocios';

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'Curso "ia-para-marketing-y-negocios" no encontrado. Ejecuta seed_ia_marketing_parte1.sql primero.';
  END IF;

  -- ============================================================
  -- MODULO 6: Video con IA - COMPLETAR lecciones 2 y 3
  -- ============================================================
  SELECT id INTO v_module_id
  FROM public.modules
  WHERE course_id = v_course_id AND order_index = 6;

  IF v_module_id IS NULL THEN
    RAISE EXCEPTION 'Modulo 6 no encontrado. Verifica que seed_ia_marketing_parte1.sql haya creado todos los modulos.';
  END IF;

  -- Lección 6.2: Guías Visuales con NotebookLM + Veo 3
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Guías Visuales con NotebookLM + Veo 3',
    'Visual Guides with NotebookLM + Veo 3',
    '<h2>El Poder de la Combinación NotebookLM + Veo 3</h2>
<p>Una de las aplicaciones más poderosas de la IA es <strong>convertir tu conocimiento en contenido multimedia de forma automática</strong>. Imagina poder tomar un PDF de 50 páginas sobre tu producto o servicio, alimentarlo a NotebookLM, y que este genere un guion detallado para un video tutorial. Luego, ese guion se convierte en un video profesional con Veo 3. Todo en menos de una hora.</p>

<h3>El Flujo de Trabajo: De Texto a Video</h3>
<p>Este es el proceso completo que dominarás en esta lección:</p>
<ol>
  <li><strong>Input:</strong> Sube documentos, artículos de blog, o manuales a NotebookLM</li>
  <li><strong>Generación de guion:</strong> Pide a NotebookLM: "Genera un guion para un video tutorial de 2 minutos sobre [tema]"</li>
  <li><strong>Storyboard automático:</strong> NotebookLM puede desglosar el guion en escenas visuales</li>
  <li><strong>Producción:</strong> Lleva cada escena a Veo 3 con prompts específicos</li>
  <li><strong>Edición básica:</strong> Ensambla clips en Google Photos (gratis) o Canva</li>
</ol>

<h3>Caso Real: Tutorial de Producto en Video</h3>
<p>Supongamos que vendes un curso online sobre organización financiera. Tienes un ebook de 30 páginas que explica tu método. Aquí cómo convertirlo en una serie de 5 videos cortos para Instagram Reels:</p>

<h4>Paso 1: Fragmentación Inteligente con NotebookLM</h4>
<p>Sube el ebook a NotebookLM y pide: <em>"Divide este contenido en 5 lecciones cortas, cada una con un concepto clave, explicado en máximo 300 palabras."</em> NotebookLM generará 5 guiones, cada uno enfocado en una idea.</p>

<h4>Paso 2: Visualización con Veo 3</h4>
<p>Para cada lección, identifica la escena visual principal. Ejemplo para la lección "Cómo hacer un presupuesto mensual":</p>
<ul>
  <li><em>"Mujer joven sentada en un escritorio ordenado, escribiendo en un cuaderno con una calculadora y laptop, luz natural de ventana, enfoque en sus manos organizando billetes, estilo lifestyle limpio y moderno"</em></li>
  <li><em>"Animación minimalista de monedas organizándose en categorías (vivienda, alimentación, ahorro), estilo flat design con colores pastel"</em></li>
</ul>

<h4>Paso 3: Montaje</h4>
<p>Usa Google Photos o Canva para ensamblar los clips de Veo 3, agregar texto superpuesto con los puntos clave del guion, y música de fondo de la biblioteca gratuita de YouTube.</p>

<h3>Caso Real 2: Videos Explicativos Animados</h3>
<p>Para conceptos abstractos (como "¿Qué es el ROI?"), los videos animados funcionan mejor que los reales. NotebookLM puede generar analogías visuales, y Veo 3 puede crear animaciones simples con prompts como:</p>
<ul>
  <li><em>"Animación 2D de una semilla creciendo hasta convertirse en un árbol de dinero, simbolizando inversión y retorno, estilo isométrico colorido"</em></li>
  <li><em>"Infografía animada mostrando el ciclo de un cliente: desde el primer contacto hasta la compra, con iconos simples conectados por flechas"</em></li>
</ul>

<h3>Ejercicio Práctico: Tu Primer Video Tutorial</h3>
<ol>
  <li>Elige un tema de tu negocio que puedas explicar en 1-2 minutos</li>
  <li>Escribe o encuentra un artículo/documento sobre ese tema (mínimo 500 palabras)</li>
  <li>Súbelo a NotebookLM y pide: "Genera un guion para un video tutorial de 90 segundos sobre esto"</li>
  <li>Divide el guion en 3-4 escenas visuales</li>
  <li>Genera cada escena con Veo 3 usando prompts detallados</li>
  <li>Monta el video en Google Photos o Canva, agrega texto y música</li>
  <li>Publica y observa el engagement</li>
</ol>

<h3>Ventaja Competitiva</h3>
<p>Mientras otras emprendedoras contratan videógrafos por $500+ por video, tú creas series completas de tutoriales en un fin de semana, gratis. Esta velocidad de producción te permite experimentar, iterar, y encontrar qué contenido resuena más con tu audiencia sin arriesgar presupuesto.</p>',
    '<h2>The Power of NotebookLM + Veo 3 Combination</h2>
<p>One of AI''s most powerful applications is <strong>converting your knowledge into multimedia content automatically</strong>. Imagine being able to take a 50-page PDF about your product or service, feed it to NotebookLM, and have it generate a detailed script for a tutorial video. Then, that script becomes a professional video with Veo 3. All in under an hour.</p>

<h3>The Workflow: From Text to Video</h3>
<p>This is the complete process you''ll master in this lesson:</p>
<ol>
  <li><strong>Input:</strong> Upload documents, blog articles, or manuals to NotebookLM</li>
  <li><strong>Script generation:</strong> Ask NotebookLM: "Generate a script for a 2-minute tutorial video about [topic]"</li>
  <li><strong>Automatic storyboard:</strong> NotebookLM can break down the script into visual scenes</li>
  <li><strong>Production:</strong> Take each scene to Veo 3 with specific prompts</li>
  <li><strong>Basic editing:</strong> Assemble clips in Google Photos (free) or Canva</li>
</ol>

<h3>Real Case: Product Tutorial in Video</h3>
<p>Suppose you sell an online course about financial organization. You have a 30-page ebook explaining your method. Here''s how to convert it into a series of 5 short videos for Instagram Reels:</p>

<h4>Step 1: Smart Fragmentation with NotebookLM</h4>
<p>Upload the ebook to NotebookLM and ask: <em>"Divide this content into 5 short lessons, each with a key concept, explained in maximum 300 words."</em> NotebookLM will generate 5 scripts, each focused on one idea.</p>

<h4>Step 2: Visualization with Veo 3</h4>
<p>For each lesson, identify the main visual scene. Example for the lesson "How to create a monthly budget":</p>
<ul>
  <li><em>"Young woman sitting at a tidy desk, writing in a notebook with calculator and laptop, natural window light, focus on her hands organizing bills, clean modern lifestyle style"</em></li>
  <li><em>"Minimalist animation of coins organizing into categories (housing, food, savings), flat design style with pastel colors"</em></li>
</ul>

<h4>Step 3: Editing</h4>
<p>Use Google Photos or Canva to assemble Veo 3 clips, add overlaid text with script key points, and background music from YouTube''s free library.</p>

<h3>Real Case 2: Animated Explainer Videos</h3>
<p>For abstract concepts (like "What is ROI?"), animated videos work better than live action. NotebookLM can generate visual analogies, and Veo 3 can create simple animations with prompts like:</p>
<ul>
  <li><em>"2D animation of a seed growing into a money tree, symbolizing investment and return, colorful isometric style"</em></li>
  <li><em>"Animated infographic showing customer journey: from first contact to purchase, with simple icons connected by arrows"</em></li>
</ul>

<h3>Practical Exercise: Your First Tutorial Video</h3>
<ol>
  <li>Choose a business topic you can explain in 1-2 minutes</li>
  <li>Write or find an article/document about that topic (minimum 500 words)</li>
  <li>Upload it to NotebookLM and ask: "Generate a script for a 90-second tutorial video about this"</li>
  <li>Break the script into 3-4 visual scenes</li>
  <li>Generate each scene with Veo 3 using detailed prompts</li>
  <li>Assemble the video in Google Photos or Canva, add text and music</li>
  <li>Publish and observe engagement</li>
</ol>

<h3>Competitive Advantage</h3>
<p>While other entrepreneurs hire videographers for $500+ per video, you create complete tutorial series in a weekend, for free. This production speed lets you experiment, iterate, and find what content resonates most with your audience without risking budget.</p>',
    2,
    30
  );

  -- Lección 6.3: Veo 3 Pro: Video Cinematográfico de Alta Calidad
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Veo 3 Pro: Video Cinematográfico de Alta Calidad',
    'Veo 3 Pro: Cinematic High-Quality Video',
    '<h2>Veo 3 Pro: La Herramienta de Video Premium de Google</h2>
<p><strong>Veo 3 Pro</strong> es la versión profesional del generador de video de Google, disponible de forma gratuita en Google AI Studio. Mientras Veo 3 estándar crea clips de hasta 8 segundos en 720p, <em>Veo 3 Pro genera videos de hasta 30 segundos en calidad 4K (2160p)</em>. Esta es resolución de cine. Tus videos se ven impresionantes en televisores, pantallas de eventos, o cualquier plataforma digital.</p>

<h3>¿Cuándo Usar Veo 3 Pro en Lugar de Veo 3?</h3>
<p>Usa Veo 3 Pro cuando necesites:</p>
<ul>
  <li><strong>Contenido para pantallas grandes:</strong> Videos para eventos, ferias comerciales, presentaciones corporativas</li>
  <li><strong>Calidad cinematográfica:</strong> Trailers de productos, anuncios publicitarios, videos institucionales</li>
  <li><strong>Clips más largos:</strong> 30 segundos te permiten narrativas más complejas sin cortes</li>
  <li><strong>Detalles finos:</strong> Productos con textura, rostros expresivos, texto legible en pantalla</li>
</ul>

<p>Usa Veo 3 estándar para contenido rápido de redes sociales donde la velocidad importa más que la resolución máxima.</p>

<h3>Técnicas de Prompting Cinematográfico</h3>
<p>Para obtener resultados dignos de Netflix con Veo 3 Pro, aplica estas técnicas de dirección de fotografía en tus prompts:</p>

<h4>1. Movimientos de Cámara Profesionales</h4>
<ul>
  <li><strong>Dolly in:</strong> "La cámara se acerca lentamente al sujeto"</li>
  <li><strong>Pan derecha:</strong> "La cámara gira suavemente hacia la derecha revelando el paisaje"</li>
  <li><strong>Crane up:</strong> "La cámara asciende desde el nivel del suelo hacia una vista aérea"</li>
  <li><strong>Tracking shot:</strong> "La cámara sigue al sujeto mientras camina"</li>
  <li><strong>Zoom out:</strong> "Zoom hacia afuera desde un detalle hasta el contexto completo"</li>
</ul>

<h4>2. Iluminación Cinematográfica</h4>
<ul>
  <li><strong>Golden hour:</strong> "Luz cálida de atardecer, sombras suaves y alargadas"</li>
  <li><strong>Blue hour:</strong> "Luz azulada justo después del atardecer, ambiente mágico"</li>
  <li><strong>Backlight:</strong> "Sujeto iluminado desde atrás creando silueta dramática"</li>
  <li><strong>Rembrandt lighting:</strong> "Iluminación clásica con triángulo de luz bajo un ojo"</li>
  <li><strong>Chiaroscuro:</strong> "Alto contraste entre luces y sombras, estilo barroco"</li>
</ul>

<h4>3. Paletas de Color Profesionales</h4>
<ul>
  <li><strong>Teal and orange:</strong> "Paleta de color cian y naranja estilo Hollywood"</li>
  <li><strong>Moody blues:</strong> "Tonos azules fríos con sombras profundas, atmósfera melancólica"</li>
  <li><strong>Warm vintage:</strong> "Colores cálidos desaturados, estilo años 70"</li>
  <li><strong>High contrast B&W:</strong> "Blanco y negro con contraste dramático, estilo film noir"</li>
</ul>

<h4>4. Referencias de Estilo Visual</h4>
<p>Puedes referenciar estilos de directores o géneros conocidos:</p>
<ul>
  <li>"Estilo Wes Anderson: composición simétrica perfecta, colores pastel vibrantes"</li>
  <li>"Estilo documental de National Geographic: cinematografía naturalista, iluminación real"</li>
  <li>"Estilo comercial de Apple: minimalista, fondo blanco, enfoque en producto, iluminación perfecta"</li>
  <li>"Estilo music video: cortes dinámicos, movimientos de cámara enérgicos, color saturado"</li>
</ul>

<h3>Ejemplo Completo: Anuncio de Producto Cinematográfico</h3>
<p><strong>Prompt para Veo 3 Pro:</strong></p>
<p><em>"Video cinematográfico 4K de 25 segundos de una botella de perfume de lujo sobre pedestal de mármol blanco, la cámara realiza un dolly-in lento mientras gira 180 grados alrededor del producto, iluminación golden hour suave filtrándose desde la izquierda, partículas de polvo flotando en el aire capturando la luz, fondo degradado de blanco a dorado pálido, reflejos sutiles en la superficie del mármol, estilo comercial de alta gama, paleta cálida y elegante"</em></p>

<p>Este nivel de especificidad genera un video que parece salido de una producción de $10,000+.</p>

<h3>Ejercicio Práctico: Tu Comercial Cinematográfico</h3>
<ol>
  <li><strong>Elige tu producto/servicio estrella</strong> — el que quieres posicionar como premium</li>
  <li><strong>Define la emoción:</strong> ¿Elegancia? ¿Energía? ¿Calma? ¿Confianza?</li>
  <li><strong>Escribe un prompt cinematográfico</strong> usando las técnicas de arriba (movimiento de cámara + iluminación + paleta de color + referencia de estilo)</li>
  <li><strong>Genera 3 variaciones</strong> con pequeños ajustes en Veo 3 Pro</li>
  <li><strong>Selecciona la mejor</strong> y agrégale música épica de la biblioteca de YouTube (busca "cinematic royalty free music")</li>
  <li><strong>Publica en tu landing page</strong> como hero video o en LinkedIn como contenido premium</li>
</ol>

<h3>Consejo Pro: Combina Veo 3 Pro con Nano Banana 2</h3>
<p>Para campañas multiplataforma, crea una imagen estática ultra HD con Nano Banana 2 y un video 4K con Veo 3 Pro del mismo concepto. Usa la imagen en anuncios estáticos (Instagram Ads, Google Display) y el video en YouTube Ads, LinkedIn Video, o tu sitio web. Consistencia visual profesional en todos los canales.</p>',
    '<h2>Veo 3 Pro: Google''s Premium Video Tool</h2>
<p><strong>Veo 3 Pro</strong> is Google''s professional version of its video generator, available for free in Google AI Studio. While standard Veo 3 creates clips up to 8 seconds in 720p, <em>Veo 3 Pro generates videos up to 30 seconds in 4K quality (2160p)</em>. This is cinema resolution. Your videos look stunning on TVs, event screens, or any digital platform.</p>

<h3>When to Use Veo 3 Pro Instead of Veo 3?</h3>
<p>Use Veo 3 Pro when you need:</p>
<ul>
  <li><strong>Content for large screens:</strong> Videos for events, trade shows, corporate presentations</li>
  <li><strong>Cinematic quality:</strong> Product trailers, advertisements, institutional videos</li>
  <li><strong>Longer clips:</strong> 30 seconds allow more complex narratives without cuts</li>
  <li><strong>Fine details:</strong> Products with texture, expressive faces, legible on-screen text</li>
</ul>

<p>Use standard Veo 3 for quick social media content where speed matters more than maximum resolution.</p>

<h3>Cinematic Prompting Techniques</h3>
<p>To get Netflix-worthy results with Veo 3 Pro, apply these cinematography techniques in your prompts:</p>

<h4>1. Professional Camera Movements</h4>
<ul>
  <li><strong>Dolly in:</strong> "Camera slowly approaches the subject"</li>
  <li><strong>Pan right:</strong> "Camera smoothly rotates right revealing the landscape"</li>
  <li><strong>Crane up:</strong> "Camera ascends from ground level to aerial view"</li>
  <li><strong>Tracking shot:</strong> "Camera follows subject as they walk"</li>
  <li><strong>Zoom out:</strong> "Zoom out from detail to full context"</li>
</ul>

<h4>2. Cinematic Lighting</h4>
<ul>
  <li><strong>Golden hour:</strong> "Warm sunset light, soft elongated shadows"</li>
  <li><strong>Blue hour:</strong> "Bluish light just after sunset, magical atmosphere"</li>
  <li><strong>Backlight:</strong> "Subject lit from behind creating dramatic silhouette"</li>
  <li><strong>Rembrandt lighting:</strong> "Classic lighting with triangle of light under one eye"</li>
  <li><strong>Chiaroscuro:</strong> "High contrast between lights and shadows, baroque style"</li>
</ul>

<h4>3. Professional Color Palettes</h4>
<ul>
  <li><strong>Teal and orange:</strong> "Cyan and orange color palette Hollywood style"</li>
  <li><strong>Moody blues:</strong> "Cool blue tones with deep shadows, melancholic atmosphere"</li>
  <li><strong>Warm vintage:</strong> "Desaturated warm colors, 70s style"</li>
  <li><strong>High contrast B&W:</strong> "Black and white with dramatic contrast, film noir style"</li>
</ul>

<h4>4. Visual Style References</h4>
<p>You can reference styles of known directors or genres:</p>
<ul>
  <li>"Wes Anderson style: perfect symmetrical composition, vibrant pastel colors"</li>
  <li>"National Geographic documentary style: naturalistic cinematography, real lighting"</li>
  <li>"Apple commercial style: minimalist, white background, product focus, perfect lighting"</li>
  <li>"Music video style: dynamic cuts, energetic camera movements, saturated color"</li>
</ul>

<h3>Complete Example: Cinematic Product Ad</h3>
<p><strong>Prompt for Veo 3 Pro:</strong></p>
<p><em>"4K cinematic video of 25 seconds of luxury perfume bottle on white marble pedestal, camera performs slow dolly-in while rotating 180 degrees around product, soft golden hour lighting filtering from left, dust particles floating in air catching light, gradient background from white to pale gold, subtle reflections on marble surface, high-end commercial style, warm and elegant palette"</em></p>

<p>This level of specificity generates a video that looks like it came from a $10,000+ production.</p>

<h3>Practical Exercise: Your Cinematic Commercial</h3>
<ol>
  <li><strong>Choose your star product/service</strong> — the one you want to position as premium</li>
  <li><strong>Define the emotion:</strong> Elegance? Energy? Calm? Confidence?</li>
  <li><strong>Write a cinematic prompt</strong> using techniques above (camera movement + lighting + color palette + style reference)</li>
  <li><strong>Generate 3 variations</strong> with small tweaks in Veo 3 Pro</li>
  <li><strong>Select the best</strong> and add epic music from YouTube library (search "cinematic royalty free music")</li>
  <li><strong>Publish on your landing page</strong> as hero video or on LinkedIn as premium content</li>
</ol>

<h3>Pro Tip: Combine Veo 3 Pro with Nano Banana 2</h3>
<p>For multi-platform campaigns, create an ultra HD static image with Nano Banana 2 and a 4K video with Veo 3 Pro of the same concept. Use the image in static ads (Instagram Ads, Google Display) and the video in YouTube Ads, LinkedIn Video, or your website. Professional visual consistency across all channels.</p>',
    3,
    25
  );

  -- ============================================================
  -- MODULO 7: Automatización Inteligente para tu Negocio
  -- ============================================================
  SELECT id INTO v_module_id
  FROM public.modules
  WHERE course_id = v_course_id AND order_index = 7;

  IF v_module_id IS NULL THEN
    RAISE EXCEPTION 'Modulo 7 no encontrado.';
  END IF;

  -- Eliminar lecciones existentes del módulo 7 (idempotencia)
  DELETE FROM public.lessons WHERE module_id = v_module_id;

  -- Lección 7.0
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    '¿Qué es la Automatización y Por Qué la Necesitas?',
    'What is Automation and Why Do You Need It?',
    '<h2>La Revolución de la Automatización</h2>
<p>La <strong>automatización</strong> es el proceso mediante el cual las tareas repetitivas se ejecutan solas, sin intervención humana. Es como tener un asistente invisible que trabaja 24/7 sin cansarse. Piensa en los filtros de tu email que organizan mensajes automáticamente, o las respuestas automáticas de WhatsApp Business que saludan a tus clientes incluso cuando estás durmiendo.</p>

<h3>El Concepto Trigger → Acción</h3>
<p>Toda automatización se basa en un principio simple: <em>cuando pasa X, haz Y</em>. Por ejemplo: cuando un cliente llena un formulario de contacto (trigger), envía un email de bienvenida + guarda sus datos en una hoja de cálculo + notifica a tu equipo de ventas (acciones). Este patrón se puede aplicar a prácticamente cualquier tarea repetitiva en tu negocio.</p>

<h3>Mapea Tu Flujo de Trabajo</h3>
<p>Para comenzar, necesitas identificar qué tareas consumen más tiempo. Lista las 10 actividades que realizas con mayor frecuencia: publicar en redes sociales, responder emails similares, actualizar inventarios, enviar facturas, programar reuniones, recopilar datos, generar reportes, etc. Luego pregúntate: <strong>¿cuáles de estas son repetitivas y predecibles?</strong> Esas son candidatas perfectas para automatizar. Las tareas creativas, estratégicas o que requieren empatía humana son las que debes conservar.</p>

<h3>Por Qué la Automatización ya no es Opcional</h3>
<p>Según estudios recientes, el 85% de profesionales del marketing que usan automatización ahorran 4 o más horas semanales. Gartner predice que para 2027, más del 65% de negocios pequeños usarán al menos un agente de IA para automatizar procesos. No se trata de reemplazar humanos, sino de <em>liberarte de tareas mecánicas</em> para enfocarte en lo que realmente genera valor: estrategia, relaciones, creatividad.</p>

<h3>Ejercicio Práctico</h3>
<ul>
<li>Escribe las 10 tareas que más tiempo te consumen semanalmente</li>
<li>Marca con una estrella las que son repetitivas y predecibles</li>
<li>Selecciona las 3 más pesadas que podrías automatizar primero</li>
<li>Visualiza cuántas horas recuperarías al mes si esas 3 fueran automáticas</li>
</ul>',
    '<h2>The Automation Revolution</h2>
<p><strong>Automation</strong> is the process by which repetitive tasks execute themselves without human intervention. It''s like having an invisible assistant working 24/7 without getting tired. Think of email filters that automatically organize messages, or WhatsApp Business auto-replies greeting your customers even when you''re sleeping.</p>

<h3>The Trigger → Action Concept</h3>
<p>All automation is based on a simple principle: <em>when X happens, do Y</em>. For example: when a customer fills out a contact form (trigger), send a welcome email + save their data in a spreadsheet + notify your sales team (actions). This pattern can be applied to virtually any repetitive task in your business.</p>

<h3>Map Your Workflow</h3>
<p>To start, you need to identify which tasks consume the most time. List the 10 activities you perform most frequently: posting on social media, answering similar emails, updating inventories, sending invoices, scheduling meetings, collecting data, generating reports, etc. Then ask yourself: <strong>which of these are repetitive and predictable?</strong> Those are perfect candidates for automation. Creative, strategic tasks or those requiring human empathy are what you should keep.</p>

<h3>Why Automation is No Longer Optional</h3>
<p>According to recent studies, 85% of marketing professionals using automation save 4 or more hours weekly. Gartner predicts that by 2027, more than 65% of small businesses will use at least one AI agent to automate processes. It''s not about replacing humans, but <em>freeing yourself from mechanical tasks</em> to focus on what truly generates value: strategy, relationships, creativity.</p>

<h3>Practical Exercise</h3>
<ul>
<li>Write down the 10 tasks that consume most of your time weekly</li>
<li>Star the ones that are repetitive and predictable</li>
<li>Select the 3 heaviest ones you could automate first</li>
<li>Visualize how many hours per month you''d recover if those 3 were automatic</li>
</ul>',
    0,
    20
  );

  -- Lección 7.1
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Google Workspace con Gemini: Automatiza tu Día a Día',
    'Google Workspace with Gemini: Automate Your Daily Work',
    '<h2>Gemini en Gmail: Tu Asistente de Comunicación</h2>
<p>Gemini está integrado directamente en Gmail y puede <strong>redactar emails completos desde un prompt</strong>, resumir hilos largos de conversación en segundos, y sugerir respuestas inteligentes basadas en el contexto. Imagina que recibes 50 consultas similares sobre precios: en lugar de escribir 50 respuestas, creas una plantilla con Gemini y la personalizas con un clic para cada cliente.</p>

<h3>Gemini en Sheets: Análisis de Datos Sin Fórmulas</h3>
<p>La función <em>"Help me organize"</em> de Gemini en Sheets te permite completar datos automáticamente, generar análisis con lenguaje natural ("muéstrame las 10 mejores ventas del mes") y crear visualizaciones sin tocar una sola fórmula. Puedes preguntarle directamente: "¿Cuál fue el producto más vendido en enero?" y obtendrás la respuesta con gráficos incluidos.</p>

<h3>Gemini en Docs y Slides: Creación de Contenido Instantánea</h3>
<p>En Google Docs, Gemini puede generar borradores completos de propuestas, resumir documentos largos, y reescribir textos en diferentes tonos (profesional, casual, persuasivo). En Google Slides, puedes crear presentaciones completas desde un prompt: "Crea una presentación de 10 diapositivas sobre beneficios del marketing de contenidos" y Gemini genera diseño, textos e imágenes sugeridas.</p>

<h3>Caso de Uso: Flujo Automático Email → Drive → Sheets</h3>
<p>Configura un flujo donde todos los adjuntos de emails con una etiqueta específica se guardan automáticamente en una carpeta de Google Drive, y se registra la información del remitente en una hoja de Google Sheets. Esto es especialmente útil para formularios, facturas, contratos o portfolios. Todo queda organizado sin mover un dedo.</p>

<h3>Ejercicio Práctico</h3>
<ul>
<li>Identifica 3 tareas repetitivas que haces en Gmail, Sheets o Docs</li>
<li>Activa Gemini en tu Google Workspace (workspace.google.com/gemini)</li>
<li>Automatiza la primera tarea: escribe el prompt y prueba el resultado</li>
<li>Documenta cuánto tiempo te ahorró vs. hacerlo manualmente</li>
<li>Repite con las otras 2 tareas esta semana</li>
</ul>',
    '<h2>Gemini in Gmail: Your Communication Assistant</h2>
<p>Gemini is integrated directly into Gmail and can <strong>draft complete emails from a prompt</strong>, summarize long conversation threads in seconds, and suggest intelligent responses based on context. Imagine receiving 50 similar inquiries about pricing: instead of writing 50 responses, you create a template with Gemini and personalize it with one click for each customer.</p>

<h3>Gemini in Sheets: Data Analysis Without Formulas</h3>
<p>Gemini''s <em>"Help me organize"</em> feature in Sheets allows you to automatically complete data, generate analysis with natural language ("show me the top 10 sales of the month"), and create visualizations without touching a single formula. You can ask directly: "What was the best-selling product in January?" and get the answer with charts included.</p>

<h3>Gemini in Docs and Slides: Instant Content Creation</h3>
<p>In Google Docs, Gemini can generate complete proposal drafts, summarize long documents, and rewrite texts in different tones (professional, casual, persuasive). In Google Slides, you can create complete presentations from a prompt: "Create a 10-slide presentation about content marketing benefits" and Gemini generates design, text, and suggested images.</p>

<h3>Use Case: Automatic Email → Drive → Sheets Flow</h3>
<p>Set up a flow where all attachments from emails with a specific label are automatically saved to a Google Drive folder, and sender information is recorded in a Google Sheet. This is especially useful for forms, invoices, contracts, or portfolios. Everything stays organized without lifting a finger.</p>

<h3>Practical Exercise</h3>
<ul>
<li>Identify 3 repetitive tasks you do in Gmail, Sheets, or Docs</li>
<li>Activate Gemini in your Google Workspace (workspace.google.com/gemini)</li>
<li>Automate the first task: write the prompt and test the result</li>
<li>Document how much time it saved vs. doing it manually</li>
<li>Repeat with the other 2 tasks this week</li>
</ul>',
    1,
    25
  );

  -- Lección 7.2
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Google Workspace Studio: Automatización Sin Código',
    'Google Workspace Studio: No-Code Automation',
    '<h2>La Plataforma No-Code de Google</h2>
<p>Google Workspace Studio (<strong>workspace.google.com/studio</strong>) es la plataforma oficial de automatización sin código de Google, potenciada por Gemini 3. Lo revolucionario es que puedes <em>describir en lenguaje natural lo que quieres automatizar</em> y Gemini construye el flujo completo por ti. No necesitas saber programación ni entender lógica compleja: solo explicas tu proceso como se lo contarías a un asistente humano.</p>

<h3>Conecta Gmail + Drive + Sheets + Calendar + Docs</h3>
<p>Workspace Studio te permite crear flujos que conectan todas tus herramientas de Google en un solo proceso automático. Ejemplo: cuando agendes una reunión en Calendar con un cliente nuevo, automáticamente se crea una carpeta en Drive con su nombre, se genera un documento de notas compartido, y se envía un email de confirmación con el link de la videollamada. Todo esto en 1 minuto de configuración.</p>

<h3>Templates Listos para Usar</h3>
<p>La plataforma incluye templates profesionales para casos comunes: <strong>atención al cliente</strong> (recibe tickets, categoriza, responde automáticamente), <strong>gestión de leads</strong> (nuevo contacto → califica → email personalizado → CRM), <strong>seguimiento de proyectos</strong> (actualiza tareas, notifica equipo, genera reportes). Puedes usar templates tal cual o personalizarlos para tu negocio específico.</p>

<h3>Conexiones Externas: Más Allá de Google</h3>
<p>Workspace Studio se integra con herramientas populares como Asana, Jira, Mailchimp, Salesforce, Slack y más. Esto significa que puedes crear flujos híbridos: por ejemplo, cuando un cliente potencial llena un formulario de Google Forms, automáticamente se crea una tarea en Asana, se añade a tu lista de Mailchimp, y se notifica a tu equipo en Slack. La plataforma ya ha procesado más de 20 millones de tareas automatizadas.</p>

<h3>Caso Real: Gem de Soporte al Cliente</h3>
<p>Imagina un Gem que maneja automáticamente el 80% de consultas de soporte: recibe el formulario de contacto, identifica el tipo de problema usando IA, investiga en tu base de conocimientos la mejor solución, redacta una respuesta empática y profesional, y la envía al cliente. Solo escala a un humano los casos verdaderamente complejos. Esto no es futuro: ya está disponible hoy.</p>

<h3>Ejercicio Práctico: Tu Primer Flujo Paso a Paso</h3>
<ul>
<li>Entra a workspace.google.com/studio y activa tu cuenta</li>
<li>Explora los templates: elige uno que resuelva un problema real tuyo</li>
<li>Personaliza el template con tus datos (email, carpetas, textos)</li>
<li>Prueba el flujo con un caso real</li>
<li>Mide cuánto tiempo ahorras en una semana usando este flujo</li>
</ul>',
    '<h2>Google''s No-Code Platform</h2>
<p>Google Workspace Studio (<strong>workspace.google.com/studio</strong>) is Google''s official no-code automation platform, powered by Gemini 3. The revolutionary part is that you can <em>describe in natural language what you want to automate</em> and Gemini builds the complete flow for you. You don''t need to know programming or understand complex logic: just explain your process as you would to a human assistant.</p>

<h3>Connect Gmail + Drive + Sheets + Calendar + Docs</h3>
<p>Workspace Studio lets you create flows that connect all your Google tools in a single automatic process. Example: when you schedule a meeting in Calendar with a new client, a folder is automatically created in Drive with their name, a shared notes document is generated, and a confirmation email is sent with the video call link. All this in 1 minute of setup.</p>

<h3>Ready-to-Use Templates</h3>
<p>The platform includes professional templates for common cases: <strong>customer service</strong> (receive tickets, categorize, respond automatically), <strong>lead management</strong> (new contact → qualify → personalized email → CRM), <strong>project tracking</strong> (update tasks, notify team, generate reports). You can use templates as-is or customize them for your specific business.</p>

<h3>External Connections: Beyond Google</h3>
<p>Workspace Studio integrates with popular tools like Asana, Jira, Mailchimp, Salesforce, Slack, and more. This means you can create hybrid flows: for example, when a potential customer fills out a Google Form, a task is automatically created in Asana, they''re added to your Mailchimp list, and your team is notified in Slack. The platform has already processed over 20 million automated tasks.</p>

<h3>Real Case: Customer Support Gem</h3>
<p>Imagine a Gem that automatically handles 80% of support inquiries: receives the contact form, identifies the problem type using AI, researches your knowledge base for the best solution, drafts an empathetic and professional response, and sends it to the customer. Only escalates truly complex cases to a human. This isn''t the future: it''s available today.</p>

<h3>Practical Exercise: Your First Flow Step by Step</h3>
<ul>
<li>Go to workspace.google.com/studio and activate your account</li>
<li>Explore templates: choose one that solves a real problem of yours</li>
<li>Customize the template with your data (email, folders, texts)</li>
<li>Test the flow with a real case</li>
<li>Measure how much time you save in a week using this flow</li>
</ul>',
    2,
    30
  );

  -- Lección 7.3
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Make y Zapier: Conecta Todo con Todo',
    'Make and Zapier: Connect Everything',
    '<h2>Zapier: 7,000+ Apps en un Solo Lugar</h2>
<p><strong>Zapier</strong> (zapier.com) es la plataforma líder de automatización que conecta más de 7,000 aplicaciones mediante reglas if-then (si-entonces) potenciadas con agentes de IA. Si una app tiene API, probablemente Zapier la soporta: desde redes sociales hasta CRMs, pasando por tiendas online, herramientas de email marketing, plataformas de pago y más.</p>

<h3>Make: Automatización Visual Drag-and-Drop</h3>
<p><strong>Make</strong> (make.com, anteriormente Integromat) ofrece una interfaz visual tipo diagrama de flujo donde construyes automatizaciones arrastrando bloques. Es especialmente potente para flujos complejos con múltiples rutas condicionales. La ventaja de Make es que ves todo el proceso de un vistazo, lo que facilita detectar errores y optimizar.</p>

<h3>Recetas Populares que Puedes Usar Hoy</h3>
<p>Aquí algunas automatizaciones que puedes configurar en 10 minutos con planes gratuitos:</p>
<ul>
<li><strong>Generación de leads:</strong> Nuevo formulario de contacto → Email de bienvenida personalizado → Registro en CRM → Notificación a WhatsApp del equipo de ventas</li>
<li><strong>Social media cross-posting:</strong> Publicar en Instagram → Automáticamente compartir en Facebook + LinkedIn con textos adaptados a cada plataforma</li>
<li><strong>E-commerce:</strong> Nuevo pedido en tienda online → Generar factura PDF → Enviar email de confirmación → Actualizar inventario en Google Sheets</li>
<li><strong>Content repurposing:</strong> Nuevo video en YouTube → Extraer audio → Transcribir con IA → Generar 5 posts para Twitter/LinkedIn</li>
</ul>

<h3>Planes Gratuitos: Suficientes para Empezar</h3>
<p>Tanto Zapier como Make ofrecen planes gratuitos generosos. Zapier Free: 100 tareas/mes con Zaps de 2 pasos. Make Free: 1,000 operaciones/mes con flujos ilimitados. Para la mayoría de emprendedoras y negocios pequeños, esto es más que suficiente para automatizar las tareas más pesadas. Cuando crezcas, los planes de pago desbloquean integraciones premium y mayor volumen.</p>

<h3>Ejercicio Práctico: Tu Primera Automatización</h3>
<ul>
<li>Crea cuenta gratuita en Zapier o Make (elige la que te parezca más intuitiva)</li>
<li>Selecciona una de las recetas populares mencionadas arriba que aplique a tu negocio</li>
<li>Configura el flujo paso a paso siguiendo los tutoriales de la plataforma</li>
<li>Prueba con un caso real: envía un formulario de prueba o crea un post</li>
<li>Documenta qué funcionó, qué ajustes necesitas, y cuánto tiempo te ahorra semanalmente</li>
</ul>',
    '<h2>Zapier: 7,000+ Apps in One Place</h2>
<p><strong>Zapier</strong> (zapier.com) is the leading automation platform connecting over 7,000 applications through if-then rules powered by AI agents. If an app has an API, Zapier probably supports it: from social networks to CRMs, online stores, email marketing tools, payment platforms, and more.</p>

<h3>Make: Visual Drag-and-Drop Automation</h3>
<p><strong>Make</strong> (make.com, formerly Integromat) offers a flowchart-style visual interface where you build automations by dragging blocks. It''s especially powerful for complex flows with multiple conditional paths. Make''s advantage is that you see the entire process at a glance, making it easier to detect errors and optimize.</p>

<h3>Popular Recipes You Can Use Today</h3>
<p>Here are some automations you can set up in 10 minutes with free plans:</p>
<ul>
<li><strong>Lead generation:</strong> New contact form → Personalized welcome email → CRM registration → WhatsApp notification to sales team</li>
<li><strong>Social media cross-posting:</strong> Post on Instagram → Automatically share on Facebook + LinkedIn with texts adapted to each platform</li>
<li><strong>E-commerce:</strong> New order in online store → Generate PDF invoice → Send confirmation email → Update inventory in Google Sheets</li>
<li><strong>Content repurposing:</strong> New YouTube video → Extract audio → Transcribe with AI → Generate 5 posts for Twitter/LinkedIn</li>
</ul>

<h3>Free Plans: Enough to Get Started</h3>
<p>Both Zapier and Make offer generous free plans. Zapier Free: 100 tasks/month with 2-step Zaps. Make Free: 1,000 operations/month with unlimited flows. For most entrepreneurs and small businesses, this is more than enough to automate the heaviest tasks. As you grow, paid plans unlock premium integrations and higher volume.</p>

<h3>Practical Exercise: Your First Automation</h3>
<ul>
<li>Create a free account on Zapier or Make (choose whichever seems more intuitive)</li>
<li>Select one of the popular recipes mentioned above that applies to your business</li>
<li>Set up the flow step by step following the platform''s tutorials</li>
<li>Test with a real case: send a test form or create a post</li>
<li>Document what worked, what adjustments you need, and how much time it saves you weekly</li>
</ul>',
    3,
    25
  );

  RAISE NOTICE 'Módulo 7 (Automatización Inteligente) completado: 4 lecciones insertadas';

END $$;

COMMIT;
