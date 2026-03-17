-- ============================================================
-- SEED: IA para Marketing y Negocios - Parte 2 (Modulos 5-9)
-- Curso para emprendedoras digitales
-- Este archivo asume que el curso y modulos 1-4 ya existen
-- ============================================================

BEGIN;

-- ============================================================
-- IMPORTANTE: Este seed NO elimina el curso existente
-- Solo agrega lecciones a modulos 5-9
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
  -- MODULO 5: Imágenes Profesionales con IA (order_index = 5)
  -- ============================================================
  SELECT id INTO v_module_id
  FROM public.modules
  WHERE course_id = v_course_id AND order_index = 5;

  IF v_module_id IS NULL THEN
    RAISE EXCEPTION 'Modulo 5 no encontrado. Verifica que seed_ia_marketing_parte1.sql haya creado todos los modulos.';
  END IF;

  -- Eliminar lecciones existentes del modulo 5 (idempotencia)
  DELETE FROM public.lessons WHERE module_id = v_module_id;

  -- Leccion 5.0: Google Flow: Tu Estudio Creativo Todo-en-Uno
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Google Flow: Tu Estudio Creativo Todo-en-Uno',
    'Google Flow: Your All-in-One Creative Studio',
    '<h2>Bienvenida al Estudio Creativo del Futuro</h2>
<p>Imagina tener un estudio creativo completo donde puedes generar imágenes profesionales, crear mood boards para tu marca, y producir videos cinematográficos — todo en un solo lugar, gratis, y sin necesidad de contratar diseñadores. Eso es <strong>Google Flow</strong>, y está a punto de transformar la manera en que creas contenido visual para tu negocio.</p>

<p>En febrero de 2026, Google hizo algo revolucionario: fusionó tres herramientas poderosas (ImageFX, Whisk y Nano Banana) en una sola plataforma llamada <strong>Google Flow</strong>. Puedes acceder desde <a href="https://labs.google/fx/tools/flow" target="_blank">labs.google/fx/tools/flow</a> con tu cuenta de Google — la misma que usas para Gmail.</p>

<h2>Tour Completo por la Interfaz de Flow</h2>
<p>Cuando entras a Flow, verás tres áreas principales claramente divididas:</p>

<ul>
  <li><strong>Generación de Imágenes (Nano Banana):</strong> Aquí escribes un prompt en lenguaje natural y obtienes imágenes profesionales hasta 4K. Es como tener un diseñador gráfico disponible 24/7. Desde logos hasta posts para redes sociales, todo en segundos.</li>
  <li><strong>Mood Boards (Whisk):</strong> Crea tableros de inspiración visual para definir la identidad de tu marca. Combina estilos, colores y conceptos visuales. Perfecto para cuando necesitas mantener consistencia en tu branding.</li>
  <li><strong>Video (Veo):</strong> Genera videos cortos con IA. Desde clips para Instagram Reels hasta comerciales completos. Con audio generado automáticamente: música, efectos de sonido y hasta diálogos.</li>
</ul>

<h2>¿Es Realmente Gratis?</h2>
<p><strong>Sí, completamente gratis.</strong> La generación de imágenes en Flow es gratuita con tu cuenta de Google. No hay trampas, no hay límites ridículos que te obliguen a pagar. Google está democratizando la creatividad visual porque sabe que si más personas crean contenido increíble, todos ganamos.</p>

<p>Compara esto con alternativas como Midjourney (mínimo $10/mes) o Adobe Firefly ($5-$55/mes). Flow te da herramientas de nivel profesional sin costo. Es la gran ventaja de Google: pueden ofrecer esto gratis porque su negocio principal no es cobrarte por IA, es hacer que uses sus servicios.</p>

<h2>Tu Primera Imagen Profesional</h2>
<p><strong>Ejercicio guiado paso a paso:</strong></p>

<ol>
  <li><strong>Accede a Flow:</strong> Ve a labs.google/fx/tools/flow e inicia sesión con tu cuenta de Google.</li>
  <li><strong>Ve a la sección "Imágenes":</strong> Es la primera opción en el menú lateral.</li>
  <li><strong>Escribe tu primer prompt:</strong> Prueba con algo simple como: <em>"Una emprendedora joven trabajando en su laptop en una cafetería moderna, luz natural, estilo fotográfico profesional"</em></li>
  <li><strong>Genera y descarga:</strong> Presiona Enter y en 5-10 segundos tendrás 4 opciones diferentes. Elige la que más te guste y descárgala.</li>
  <li><strong>Publica:</strong> Esa imagen ya está lista para usarla en tu Instagram, Facebook, sitio web o donde la necesites.</li>
</ol>

<p>¿Ves qué fácil fue? Acabas de crear tu primera imagen profesional con IA. Y esto es solo el comienzo. En las siguientes lecciones vamos a profundizar en cada herramienta de Flow para que domines la creación de contenido visual como una experta.</p>

<h2>El Poder de Tener Todo Integrado</h2>
<p>Lo más poderoso de Flow no son las herramientas individuales, sino cómo trabajan juntas. Puedes crear un mood board en Whisk para definir el estilo visual de tu marca, generar imágenes consistentes con Nano Banana siguiendo ese estilo, y luego animar esas imágenes en videos con Veo. Todo en el mismo lugar, con la misma cuenta, sin saltar entre 5 apps diferentes.</p>

<p>Esto es lo que llamamos un <strong>flujo de trabajo integrado</strong>. Y para emprendedoras con tiempo limitado, esto es oro puro. No más exportar de aquí, importar a allá, perder calidad en el camino. Todo fluye naturalmente de una herramienta a la otra.</p>',
    '<h2>Welcome to the Creative Studio of the Future</h2>
<p>Imagine having a complete creative studio where you can generate professional images, create mood boards for your brand, and produce cinematic videos — all in one place, for free, without hiring designers. That''s <strong>Google Flow</strong>, and it''s about to transform how you create visual content for your business.</p>

<p>In February 2026, Google did something revolutionary: they merged three powerful tools (ImageFX, Whisk, and Nano Banana) into a single platform called <strong>Google Flow</strong>. You can access it from <a href="https://labs.google/fx/tools/flow" target="_blank">labs.google/fx/tools/flow</a> with your Google account — the same one you use for Gmail.</p>

<h2>Complete Tour of the Flow Interface</h2>
<p>When you enter Flow, you''ll see three main areas clearly divided:</p>

<ul>
  <li><strong>Image Generation (Nano Banana):</strong> Here you write a prompt in natural language and get professional images up to 4K. It''s like having a graphic designer available 24/7. From logos to social media posts, everything in seconds.</li>
  <li><strong>Mood Boards (Whisk):</strong> Create visual inspiration boards to define your brand identity. Combine styles, colors, and visual concepts. Perfect for when you need to maintain consistency in your branding.</li>
  <li><strong>Video (Veo):</strong> Generate short videos with AI. From Instagram Reels clips to complete commercials. With automatically generated audio: music, sound effects, and even dialogues.</li>
</ul>

<h2>Is It Really Free?</h2>
<p><strong>Yes, completely free.</strong> Image generation in Flow is free with your Google account. No tricks, no ridiculous limits forcing you to pay. Google is democratizing visual creativity because they know that if more people create incredible content, everyone wins.</p>

<p>Compare this to alternatives like Midjourney (minimum $10/month) or Adobe Firefly ($5-$55/month). Flow gives you professional-level tools at no cost. This is Google''s big advantage: they can offer this for free because their main business isn''t charging you for AI, it''s getting you to use their services.</p>

<h2>Your First Professional Image</h2>
<p><strong>Step-by-step guided exercise:</strong></p>

<ol>
  <li><strong>Access Flow:</strong> Go to labs.google/fx/tools/flow and sign in with your Google account.</li>
  <li><strong>Go to the "Images" section:</strong> It''s the first option in the side menu.</li>
  <li><strong>Write your first prompt:</strong> Try something simple like: <em>"A young female entrepreneur working on her laptop in a modern coffee shop, natural light, professional photography style"</em></li>
  <li><strong>Generate and download:</strong> Press Enter and in 5-10 seconds you''ll have 4 different options. Choose the one you like best and download it.</li>
  <li><strong>Publish:</strong> That image is now ready to use on your Instagram, Facebook, website, or wherever you need it.</li>
</ol>

<p>See how easy that was? You just created your first professional image with AI. And this is just the beginning. In the following lessons, we''ll dive deeper into each Flow tool so you can master visual content creation like an expert.</p>

<h2>The Power of Having Everything Integrated</h2>
<p>The most powerful thing about Flow isn''t the individual tools, but how they work together. You can create a mood board in Whisk to define your brand''s visual style, generate consistent images with Nano Banana following that style, and then animate those images into videos with Veo. All in the same place, with the same account, without jumping between 5 different apps.</p>

<p>This is what we call an <strong>integrated workflow</strong>. And for entrepreneurs with limited time, this is pure gold. No more exporting from here, importing to there, losing quality along the way. Everything flows naturally from one tool to another.</p>',
    0,
    25
  );

  -- Leccion 5.1: Nano Banana 2: Imágenes Pro Gratis
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Nano Banana 2: Imágenes Pro Gratis',
    'Nano Banana 2: Free Pro Images',
    '<h2>El Generador de Imágenes que Cambió el Juego</h2>
<p><strong>Nano Banana 2</strong> es el modelo de generación de imágenes de Google, y es absolutamente impresionante. Lanzado en enero de 2026, superó a todos sus competidores en una cosa crítica: <em>genera imágenes hasta 4K (3840x2160 píxeles)</em> de forma gratuita. Para que tengas contexto, eso es resolución de televisión Ultra HD. Tus imágenes se verán increíbles en cualquier pantalla, desde un celular hasta un billboard digital.</p>

<p>Pero la resolución no es lo único que importa. Nano Banana 2 tiene dos superpoderes que lo hacen perfecto para marketing:</p>

<ul>
  <li><strong>Texto legible en imágenes:</strong> Gracias a la tecnología de Imagen 4 de Google, ahora puedes pedirle que genere imágenes con texto específico. Quieres un post que diga "50% OFF Solo Hoy" en letras grandes y claras? Lo hace. Esto era imposible hace un año — los generadores de IA creaban texto ilegible o con errores ortográficos.</li>
  <li><strong>SynthID invisible:</strong> Todas las imágenes llevan una marca de agua invisible (watermark) llamada SynthID. No la ves, pero Google puede detectarla. Esto es importante para credibilidad: puedes demostrar que la imagen fue generada por IA oficial de Google, no por herramientas sospechosas.</li>
</ul>

<h2>Prompting Visual: Cómo Pedirle Exactamente lo que Quieres</h2>
<p>Un "prompt" es simplemente la descripción que le das a la IA para que genere la imagen. Pero hay una diferencia enorme entre un prompt amateur y uno profesional. Aquí está la fórmula de 5 elementos:</p>

<h3>1. Estilo Visual</h3>
<p>Define el tipo de imagen que necesitas:</p>
<ul>
  <li><strong>Fotografía:</strong> "Fotografía profesional con cámara DSLR" o "Foto estilo retrato con luz natural"</li>
  <li><strong>Ilustración:</strong> "Ilustración flat minimalista" o "Ilustración vectorial colorida"</li>
  <li><strong>3D:</strong> "Render 3D con iluminación cinematográfica" o "Estilo Pixar 3D"</li>
  <li><strong>Minimalista:</strong> "Diseño minimalista con fondo blanco" o "Estilo clean y moderno"</li>
</ul>

<h3>2. Composición</h3>
<p>Dónde están los elementos en la imagen:</p>
<ul>
  <li>"Centrado en el medio del cuadro"</li>
  <li>"Persona a la izquierda con espacio negativo a la derecha para texto"</li>
  <li>"Vista de pájaro (desde arriba)"</li>
</ul>

<h3>3. Iluminación</h3>
<p>Esto hace toda la diferencia entre amateur y profesional:</p>
<ul>
  <li>"Luz natural difusa de ventana"</li>
  <li>"Golden hour (atardecer cálido)"</li>
  <li>"Iluminación dramática con sombras marcadas"</li>
  <li>"Luz suave y uniforme"</li>
</ul>

<h3>4. Ángulos de Cámara</h3>
<p>Cambia completamente el mensaje de la imagen:</p>
<ul>
  <li>"Eye level (a nivel de ojos)" — conversacional, cercano</li>
  <li>"Low angle (ángulo bajo mirando hacia arriba)" — poder, autoridad</li>
  <li>"High angle (ángulo alto mirando hacia abajo)" — vulnerabilidad, ternura</li>
  <li>"Close-up" — intimidad, detalle</li>
</ul>

<h3>5. Contexto y Detalles</h3>
<p>El qué y el dónde:</p>
<ul>
  <li>"Una mujer emprendedora de 30 años en su oficina moderna"</li>
  <li>"Producto de skincare rodeado de ingredientes naturales"</li>
  <li>"Laptop abierta mostrando gráficos de crecimiento"</li>
</ul>

<h2>Ejemplo Completo: De Amateur a Pro</h2>
<p><strong>Prompt Amateur:</strong><br>
<em>"Una mujer con laptop"</em></p>

<p><strong>Prompt Profesional:</strong><br>
<em>"Fotografía profesional con luz natural de una emprendedora latina de 30 años trabajando en su laptop MacBook en una oficina moderna minimalista, vista eye-level, fondo desenfocado estilo bokeh, colores cálidos y acogedores, espacio a la derecha para agregar texto, estilo editorial de revista"</em></p>

<p>¿Ves la diferencia? El segundo prompt es específico, tiene dirección de arte, y genera una imagen lista para usar en marketing.</p>

<h2>Acceso Gratuito: Tres Formas de Usar Nano Banana 2</h2>
<ul>
  <li><strong>Google AI Studio:</strong> La interfaz más poderosa. Puedes ajustar parámetros avanzados y guardar tus prompts favoritos.</li>
  <li><strong>Gemini App:</strong> La forma más rápida. Solo escribe tu prompt en el chat de Gemini y pide "genera una imagen de..."</li>
  <li><strong>Flow:</strong> La forma más integrada. Combina con Whisk y Veo en el mismo lugar.</li>
</ul>

<h2>Ejercicio Práctico: 5 Posts Visuales con Diferentes Estilos</h2>
<p><strong>Tu misión:</strong> Crear 5 imágenes para redes sociales de tu marca, cada una con un estilo diferente. Esto te ayudará a descubrir cuál funciona mejor para tu audiencia.</p>

<ol>
  <li><strong>Post 1 - Fotografía realista:</strong> "Fotografía profesional de [tu producto/servicio] con luz natural, fondo limpio, estilo editorial"</li>
  <li><strong>Post 2 - Ilustración flat:</strong> "Ilustración flat minimalista de [concepto de tu negocio], paleta de colores pastel, fondo blanco"</li>
  <li><strong>Post 3 - 3D render:</strong> "Render 3D colorido de [elemento relacionado a tu marca], iluminación cinematográfica, fondo gradiente"</li>
  <li><strong>Post 4 - Lifestyle:</strong> "Fotografía lifestyle de persona usando [tu producto], ambiente cálido y acogedor, golden hour"</li>
  <li><strong>Post 5 - Quote gráfico:</strong> "Diseño gráfico minimalista con texto ''[tu frase motivacional]'' en tipografía moderna, fondo de color sólido [color de tu marca]"</li>
</ol>

<p>Genera las 5 imágenes, descárgalas, y obsérvalas lado a lado. ¿Cuál representa mejor tu marca? ¿Cuál genera más engagement cuando la publiques? Este experimento te dará claridad sobre tu identidad visual.</p>

<h2>Tip Pro: Variaciones para Encontrar la Imagen Perfecta</h2>
<p>Nano Banana 2 genera 4 variaciones de cada prompt. Si ninguna te convence al 100%, no cambies todo el prompt — ajusta solo UN elemento. Por ejemplo:</p>

<ul>
  <li>Cambia "luz natural" por "golden hour"</li>
  <li>Cambia "fondo blanco" por "fondo gradiente azul claro"</li>
  <li>Agrega "con espacio para texto en la parte superior"</li>
</ul>

<p>Pequeños ajustes generan grandes cambios. Y recuerda: la IA aprende de tus preferencias. Entre más uses Nano Banana, mejor entenderá tu estilo.</p>',
    '<h2>The Image Generator That Changed the Game</h2>
<p><strong>Nano Banana 2</strong> is Google''s image generation model, and it''s absolutely impressive. Launched in January 2026, it surpassed all its competitors in one critical thing: <em>it generates images up to 4K (3840x2160 pixels)</em> for free. To give you context, that''s Ultra HD television resolution. Your images will look incredible on any screen, from a phone to a digital billboard.</p>

<p>But resolution isn''t the only thing that matters. Nano Banana 2 has two superpowers that make it perfect for marketing:</p>

<ul>
  <li><strong>Legible text in images:</strong> Thanks to Google''s Imagen 4 technology, you can now ask it to generate images with specific text. Want a post that says "50% OFF Today Only" in large, clear letters? It does it. This was impossible a year ago — AI generators created illegible text or spelling errors.</li>
  <li><strong>Invisible SynthID:</strong> All images carry an invisible watermark called SynthID. You don''t see it, but Google can detect it. This is important for credibility: you can prove the image was generated by official Google AI, not suspicious tools.</li>
</ul>

<h2>Visual Prompting: How to Ask for Exactly What You Want</h2>
<p>A "prompt" is simply the description you give the AI to generate the image. But there''s a huge difference between an amateur prompt and a professional one. Here''s the 5-element formula:</p>

<h3>1. Visual Style</h3>
<p>Define the type of image you need:</p>
<ul>
  <li><strong>Photography:</strong> "Professional DSLR camera photography" or "Portrait style photo with natural light"</li>
  <li><strong>Illustration:</strong> "Flat minimalist illustration" or "Colorful vector illustration"</li>
  <li><strong>3D:</strong> "3D render with cinematic lighting" or "Pixar-style 3D"</li>
  <li><strong>Minimalist:</strong> "Minimalist design with white background" or "Clean and modern style"</li>
</ul>

<h3>2. Composition</h3>
<p>Where elements are in the image:</p>
<ul>
  <li>"Centered in the middle of the frame"</li>
  <li>"Person on the left with negative space on the right for text"</li>
  <li>"Bird''s eye view (from above)"</li>
</ul>

<h3>3. Lighting</h3>
<p>This makes all the difference between amateur and professional:</p>
<ul>
  <li>"Diffused natural window light"</li>
  <li>"Golden hour (warm sunset)"</li>
  <li>"Dramatic lighting with pronounced shadows"</li>
  <li>"Soft and uniform light"</li>
</ul>

<h3>4. Camera Angles</h3>
<p>Completely changes the image''s message:</p>
<ul>
  <li>"Eye level" — conversational, close</li>
  <li>"Low angle (looking up)" — power, authority</li>
  <li>"High angle (looking down)" — vulnerability, tenderness</li>
  <li>"Close-up" — intimacy, detail</li>
</ul>

<h3>5. Context and Details</h3>
<p>The what and where:</p>
<ul>
  <li>"A 30-year-old female entrepreneur in her modern office"</li>
  <li>"Skincare product surrounded by natural ingredients"</li>
  <li>"Open laptop showing growth charts"</li>
</ul>

<h2>Complete Example: From Amateur to Pro</h2>
<p><strong>Amateur Prompt:</strong><br>
<em>"A woman with laptop"</em></p>

<p><strong>Professional Prompt:</strong><br>
<em>"Professional photography with natural light of a 30-year-old Latina entrepreneur working on her MacBook laptop in a minimalist modern office, eye-level view, blurred bokeh-style background, warm and cozy colors, space on the right to add text, editorial magazine style"</em></p>

<p>See the difference? The second prompt is specific, has art direction, and generates an image ready to use in marketing.</p>

<h2>Free Access: Three Ways to Use Nano Banana 2</h2>
<ul>
  <li><strong>Google AI Studio:</strong> The most powerful interface. You can adjust advanced parameters and save your favorite prompts.</li>
  <li><strong>Gemini App:</strong> The fastest way. Just write your prompt in the Gemini chat and ask "generate an image of..."</li>
  <li><strong>Flow:</strong> The most integrated way. Combine with Whisk and Veo in the same place.</li>
</ul>

<h2>Practical Exercise: 5 Visual Posts with Different Styles</h2>
<p><strong>Your mission:</strong> Create 5 images for your brand''s social media, each with a different style. This will help you discover which works best for your audience.</p>

<ol>
  <li><strong>Post 1 - Realistic photography:</strong> "Professional photography of [your product/service] with natural light, clean background, editorial style"</li>
  <li><strong>Post 2 - Flat illustration:</strong> "Flat minimalist illustration of [your business concept], pastel color palette, white background"</li>
  <li><strong>Post 3 - 3D render:</strong> "Colorful 3D render of [element related to your brand], cinematic lighting, gradient background"</li>
  <li><strong>Post 4 - Lifestyle:</strong> "Lifestyle photography of person using [your product], warm and cozy environment, golden hour"</li>
  <li><strong>Post 5 - Quote graphic:</strong> "Minimalist graphic design with text ''[your motivational phrase]'' in modern typography, solid color background [your brand color]"</li>
</ol>

<p>Generate all 5 images, download them, and look at them side by side. Which one best represents your brand? Which generates more engagement when you post it? This experiment will give you clarity on your visual identity.</p>

<h2>Pro Tip: Variations to Find the Perfect Image</h2>
<p>Nano Banana 2 generates 4 variations of each prompt. If none convince you 100%, don''t change the entire prompt — adjust just ONE element. For example:</p>

<ul>
  <li>Change "natural light" to "golden hour"</li>
  <li>Change "white background" to "light blue gradient background"</li>
  <li>Add "with space for text at the top"</li>
</ul>

<p>Small adjustments generate big changes. And remember: the AI learns from your preferences. The more you use Nano Banana, the better it will understand your style.</p>',
    1,
    25
  );

  -- Leccion 5.2: Whisk: Mood Boards y Branding Visual
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Whisk: Mood Boards y Branding Visual',
    'Whisk: Mood Boards and Visual Branding',
    '<h2>¿Qué es Whisk y Por Qué lo Necesitas?</h2>
<p>Imagina que estás diseñando la identidad visual de tu marca, pero cada imagen que generas se siente... diferente. Un día usas colores cálidos, al otro fríos. Una semana tu estilo es minimalista, la siguiente es recargado. Tu audiencia se confunde porque no hay <strong>consistencia visual</strong>. Y aquí es donde entra <strong>Whisk</strong>.</p>

<p>Whisk es la herramienta de <em>mood boards</em> dentro de Google Flow. Un mood board es como el "tablero de inspiración" que usan los diseñadores profesionales antes de crear cualquier cosa. Defines:</p>

<ul>
  <li><strong>Paleta de colores:</strong> ¿Tu marca es cálida (rojos, naranjas, amarillos) o fría (azules, verdes, morados)?</li>
  <li><strong>Estilo visual:</strong> ¿Fotografía realista, ilustraciones flat, 3D, minimalista?</li>
  <li><strong>Elementos recurrentes:</strong> ¿Usas plantas? ¿Tecnología? ¿Personas sonriendo? ¿Texturas?</li>
  <li><strong>Vibe general:</strong> ¿Profesional y elegante? ¿Divertido y juvenil? ¿Cálido y cercano?</li>
</ul>

<p>Una vez que defines esto en Whisk, cada imagen que generes mantendrá esa coherencia. Es la diferencia entre una cuenta de Instagram que parece hecha por 10 personas diferentes vs. una que grita "ESTA ES MI MARCA" desde el primer vistazo.</p>

<h2>Cómo Crear tu Mood Board Paso a Paso</h2>
<p><strong>Ejercicio guiado de 20 minutos:</strong></p>

<h3>Paso 1: Define tu Concepto de Marca</h3>
<p>Antes de abrir Whisk, responde estas 3 preguntas en un papel o en tu celular:</p>
<ol>
  <li><strong>¿Qué emoción quieres que sientan tus clientes cuando ven tu contenido?</strong> (Ejemplos: confianza, inspiración, alegría, calma)</li>
  <li><strong>¿Tres adjetivos que describen tu marca?</strong> (Ejemplos: moderna, accesible, profesional / divertida, colorida, joven / elegante, sofisticada, premium)</li>
  <li><strong>¿Qué marcas admiras visualmente?</strong> (No tienen que ser de tu industria — solo marcas cuyo estilo te encanta)</li>
</ol>

<h3>Paso 2: Recolecta Referencias Visuales</h3>
<p>Entra a Whisk dentro de Flow (labs.google/fx/tools/flow) y ve a la sección "Mood Boards". Crea un nuevo tablero con el nombre de tu marca.</p>

<p>Ahora busca o genera 5-7 imágenes que representen tu concepto. Pueden ser:</p>
<ul>
  <li>Imágenes que generaste con Nano Banana que te encantaron</li>
  <li>Fotos de internet que te inspiran (arrastra y suelta URLs)</li>
  <li>Colores específicos (Whisk te permite agregar paletas de color)</li>
</ul>

<h3>Paso 3: Identifica Patrones Visuales</h3>
<p>Cuando ya tienes 5-7 imágenes en tu tablero, obsérvalas juntas. ¿Qué tienen en común? Whisk te ayuda a detectar:</p>
<ul>
  <li><strong>Colores dominantes:</strong> ¿Todas tienen tonos azules? ¿O naranjas cálidos?</li>
  <li><strong>Estilo fotográfico:</strong> ¿Son fotos reales o ilustraciones? ¿Minimalistas o detalladas?</li>
  <li><strong>Composición:</strong> ¿Centrado o asimétrico? ¿Mucho espacio en blanco o lleno de elementos?</li>
</ul>

<p>Whisk te genera un <em>resumen visual</em> de tu mood board. Esto es tu "guía de estilo visual" — la referencia que usarás cada vez que crees contenido.</p>

<h3>Paso 4: Genera Variaciones Consistentes</h3>
<p>Ahora viene la magia. Desde tu mood board, puedes pedirle a Whisk que genere nuevas imágenes <strong>basadas en ese estilo</strong>. Por ejemplo:</p>

<p><em>"Genera una imagen de una mujer emprendedora trabajando, siguiendo el estilo de este mood board"</em></p>

<p>Whisk analizará los colores, composición y vibe de tu tablero, y generará imágenes que encajan perfectamente. Ya no tienes que describir todo en cada prompt — Whisk lo hace por ti.</p>

<h2>El Flujo Completo: Whisk → Nano Banana → Contenido Final</h2>
<p>Aquí está el proceso profesional que usan diseñadores y marketers:</p>

<ol>
  <li><strong>Whisk (Concepto):</strong> Defines el estilo visual de tu marca en un mood board.</li>
  <li><strong>Nano Banana (Imagen final):</strong> Generas imágenes específicas siguiendo ese estilo.</li>
  <li><strong>Publicación:</strong> Usas esas imágenes en redes sociales, blog, anuncios, etc.</li>
</ol>

<p>Este flujo te garantiza <strong>consistencia visual</strong> — la clave del branding profesional. Piensa en marcas como Apple, Nike, Coca-Cola. Todas tienen un estilo visual tan consistente que reconoces sus anuncios incluso sin ver el logo. Whisk te da ese superpoder.</p>

<h2>Migración desde ImageFX y Whisk Legacy</h2>
<p>Si usabas las versiones antiguas de Whisk e ImageFX (antes de que se integraran a Flow), <strong>desde marzo de 2026 puedes migrar todos tus proyectos</strong> a Flow con un clic. Google no eliminó tu trabajo anterior — solo lo movió a un lugar más poderoso donde todo está conectado.</p>

<p>Para migrar:</p>
<ol>
  <li>Entra a Flow con la misma cuenta de Google que usabas antes</li>
  <li>Ve a "Configuración" (esquina superior derecha)</li>
  <li>Selecciona "Importar proyectos de ImageFX y Whisk legacy"</li>
  <li>Todos tus mood boards y prompts favoritos aparecerán en Flow</li>
</ol>

<h2>Ejercicio Final: Crea la Identidad Visual de tu Marca</h2>
<p><strong>Tu misión completa:</strong></p>

<ol>
  <li><strong>Define tu concepto:</strong> Responde las 3 preguntas del Paso 1 (emociones, adjetivos, marcas que admiras).</li>
  <li><strong>Crea tu mood board:</strong> Recolecta 7 imágenes que representen tu marca en Whisk.</li>
  <li><strong>Identifica tu paleta de colores:</strong> Anota los 3 colores principales que se repiten.</li>
  <li><strong>Genera 3 imágenes de prueba:</strong> Pídele a Whisk que genere contenido basado en tu mood board.</li>
  <li><strong>Documenta tu estilo:</strong> Escribe en un documento: "Mi marca usa [colores], estilo [fotográfico/ilustración/3D], con vibe [adjetivos]".</li>
</ol>

<p>Guarda ese documento. Es tu <strong>Brand Style Guide</strong> — la referencia que usarás cada vez que crees contenido visual. Y lo creaste en 20 minutos con IA, algo que antes le tomaba semanas a un diseñador profesional (y costaba miles de dólares).</p>

<p>En la siguiente lección, vamos a aplicar todo esto a casos prácticos de marketing: banners, posts, thumbnails, anuncios. Prepárate para crear contenido visual que compita con marcas millonarias.</p>',
    '<h2>What is Whisk and Why Do You Need It?</h2>
<p>Imagine you''re designing your brand''s visual identity, but every image you generate feels... different. One day you use warm colors, the next cold ones. One week your style is minimalist, the next it''s busy. Your audience gets confused because there''s no <strong>visual consistency</strong>. And this is where <strong>Whisk</strong> comes in.</p>

<p>Whisk is the <em>mood board</em> tool inside Google Flow. A mood board is like the "inspiration board" that professional designers use before creating anything. You define:</p>

<ul>
  <li><strong>Color palette:</strong> Is your brand warm (reds, oranges, yellows) or cool (blues, greens, purples)?</li>
  <li><strong>Visual style:</strong> Realistic photography, flat illustrations, 3D, minimalist?</li>
  <li><strong>Recurring elements:</strong> Do you use plants? Technology? Smiling people? Textures?</li>
  <li><strong>Overall vibe:</strong> Professional and elegant? Fun and youthful? Warm and approachable?</li>
</ul>

<p>Once you define this in Whisk, every image you generate will maintain that coherence. It''s the difference between an Instagram account that looks like it was made by 10 different people vs. one that screams "THIS IS MY BRAND" from first glance.</p>

<h2>How to Create Your Mood Board Step by Step</h2>
<p><strong>20-minute guided exercise:</strong></p>

<h3>Step 1: Define Your Brand Concept</h3>
<p>Before opening Whisk, answer these 3 questions on paper or on your phone:</p>
<ol>
  <li><strong>What emotion do you want your customers to feel when they see your content?</strong> (Examples: trust, inspiration, joy, calm)</li>
  <li><strong>Three adjectives that describe your brand?</strong> (Examples: modern, accessible, professional / fun, colorful, young / elegant, sophisticated, premium)</li>
  <li><strong>What brands do you visually admire?</strong> (They don''t have to be from your industry — just brands whose style you love)</li>
</ol>

<h3>Step 2: Collect Visual References</h3>
<p>Enter Whisk inside Flow (labs.google/fx/tools/flow) and go to the "Mood Boards" section. Create a new board with your brand name.</p>

<p>Now find or generate 5-7 images that represent your concept. They can be:</p>
<ul>
  <li>Images you generated with Nano Banana that you loved</li>
  <li>Photos from the internet that inspire you (drag and drop URLs)</li>
  <li>Specific colors (Whisk lets you add color palettes)</li>
</ul>

<h3>Step 3: Identify Visual Patterns</h3>
<p>When you have 5-7 images on your board, observe them together. What do they have in common? Whisk helps you detect:</p>
<ul>
  <li><strong>Dominant colors:</strong> Do they all have blue tones? Or warm oranges?</li>
  <li><strong>Photographic style:</strong> Are they real photos or illustrations? Minimalist or detailed?</li>
  <li><strong>Composition:</strong> Centered or asymmetrical? Lots of white space or full of elements?</li>
</ul>

<p>Whisk generates a <em>visual summary</em> of your mood board. This is your "visual style guide" — the reference you''ll use every time you create content.</p>

<h3>Step 4: Generate Consistent Variations</h3>
<p>Now comes the magic. From your mood board, you can ask Whisk to generate new images <strong>based on that style</strong>. For example:</p>

<p><em>"Generate an image of a female entrepreneur working, following the style of this mood board"</em></p>

<p>Whisk will analyze the colors, composition, and vibe of your board, and generate images that fit perfectly. You no longer have to describe everything in each prompt — Whisk does it for you.</p>

<h2>The Complete Flow: Whisk → Nano Banana → Final Content</h2>
<p>Here''s the professional process used by designers and marketers:</p>

<ol>
  <li><strong>Whisk (Concept):</strong> Define your brand''s visual style in a mood board.</li>
  <li><strong>Nano Banana (Final image):</strong> Generate specific images following that style.</li>
  <li><strong>Publication:</strong> Use those images on social media, blog, ads, etc.</li>
</ol>

<p>This flow guarantees <strong>visual consistency</strong> — the key to professional branding. Think of brands like Apple, Nike, Coca-Cola. They all have such consistent visual style that you recognize their ads even without seeing the logo. Whisk gives you that superpower.</p>

<h2>Migration from ImageFX and Whisk Legacy</h2>
<p>If you used the old versions of Whisk and ImageFX (before they integrated into Flow), <strong>since March 2026 you can migrate all your projects</strong> to Flow with one click. Google didn''t delete your previous work — they just moved it to a more powerful place where everything is connected.</p>

<p>To migrate:</p>
<ol>
  <li>Enter Flow with the same Google account you used before</li>
  <li>Go to "Settings" (top right corner)</li>
  <li>Select "Import projects from ImageFX and Whisk legacy"</li>
  <li>All your mood boards and favorite prompts will appear in Flow</li>
</ol>

<h2>Final Exercise: Create Your Brand''s Visual Identity</h2>
<p><strong>Your complete mission:</strong></p>

<ol>
  <li><strong>Define your concept:</strong> Answer the 3 questions from Step 1 (emotions, adjectives, brands you admire).</li>
  <li><strong>Create your mood board:</strong> Collect 7 images that represent your brand in Whisk.</li>
  <li><strong>Identify your color palette:</strong> Note the 3 main colors that repeat.</li>
  <li><strong>Generate 3 test images:</strong> Ask Whisk to generate content based on your mood board.</li>
  <li><strong>Document your style:</strong> Write in a document: "My brand uses [colors], [photographic/illustration/3D] style, with [adjectives] vibe".</li>
</ol>

<p>Save that document. It''s your <strong>Brand Style Guide</strong> — the reference you''ll use every time you create visual content. And you created it in 20 minutes with AI, something that used to take weeks for a professional designer (and cost thousands of dollars).</p>

<p>In the next lesson, we''ll apply all this to practical marketing cases: banners, posts, thumbnails, ads. Get ready to create visual content that competes with million-dollar brands.</p>',
    2,
    20
  );

  -- Leccion 5.3: Imágenes para Marketing: Casos Prácticos
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Imágenes para Marketing: Casos Prácticos',
    'Marketing Images: Practical Cases',
    '<h2>De la Teoría a la Práctica: Casos Reales de Marketing</h2>
<p>Ya sabes cómo funciona Nano Banana, cómo crear mood boards en Whisk, y cómo hacer prompts profesionales. Ahora viene lo más emocionante: <strong>aplicar todo esto a tu negocio real</strong>. En esta lección vamos a crear contenido visual específico para cada plataforma y propósito de marketing.</p>

<p>Vamos a cubrir los 6 tipos de imágenes que más usan las emprendedoras digitales, con ejemplos de prompts y antes/después para que veas la transformación.</p>

<h2>Caso 1: Posts para Instagram (Cuadrados 1:1)</h2>
<p><strong>Objetivo:</strong> Crear un post visualmente atractivo que frene el scroll de tu audiencia.</p>

<p><strong>Especificaciones técnicas:</strong></p>
<ul>
  <li>Resolución recomendada: 1080x1080px (Nano Banana genera hasta 4K, pero Instagram comprime a 1080)</li>
  <li>Formato: Cuadrado (1:1)</li>
  <li>Colores: Que contrasten con el feed típico de Instagram (evita el gris apagado)</li>
</ul>

<p><strong>Prompt profesional:</strong><br>
<em>"Fotografía cenital (flat lay) de escritorio de emprendedora, laptop abierta, café latte con arte en espuma, libreta con notas, plantas pequeñas, paleta de colores pastel (rosa claro, beige, blanco), luz natural suave, composición simétrica, espacio en la parte superior para agregar texto, estilo lifestyle minimalista, Instagram-friendly"</em></p>

<p><strong>Antes (prompt amateur):</strong> "Escritorio con laptop y café"<br>
<strong>Después (prompt pro):</strong> Una imagen lista para publicar que genera 3x más engagement porque tiene:</p>
<ul>
  <li>Composición balanceada</li>
  <li>Colores cohesivos</li>
  <li>Espacio estratégico para agregar texto o logo</li>
  <li>Vibe aspiracional pero alcanzable</li>
</ul>

<h2>Caso 2: Instagram Stories (Verticales 9:16)</h2>
<p><strong>Objetivo:</strong> Crear contenido vertical que funcione en Stories y Reels.</p>

<p><strong>Especificaciones técnicas:</strong></p>
<ul>
  <li>Resolución: 1080x1920px</li>
  <li>Formato: Vertical (9:16)</li>
  <li>Zona segura: Evita poner texto/elementos importantes en los primeros 250px (arriba) y últimos 250px (abajo) donde van los botones de Instagram</li>
</ul>

<p><strong>Prompt profesional:</strong><br>
<em>"Imagen vertical para Instagram Story, emprendedora joven sosteniendo tablet mostrando gráficos de crecimiento, sonrisa natural, fondo desenfocado de oficina moderna, composición vertical 9:16, zona de texto segura en el tercio medio, colores vibrantes pero profesionales, estilo candid photography"</em></p>

<p><strong>Tip pro:</strong> En Nano Banana, especifica "formato vertical 9:16" o "Instagram Story format" — la IA entiende estas referencias y ajusta la composición automáticamente.</p>

<h2>Caso 3: Banners para Facebook (Horizontales)</h2>
<p><strong>Objetivo:</strong> Crear cover images para tu página de Facebook o grupo.</p>

<p><strong>Especificaciones técnicas:</strong></p>
<ul>
  <li>Resolución: 820x312px (mínimo recomendado)</li>
  <li>Formato: Horizontal panorámico</li>
  <li>Evita texto importante en los extremos (se corta en móvil)</li>
</ul>

<p><strong>Prompt profesional:</strong><br>
<em>"Banner horizontal panorámico para Facebook cover, concepto de comunidad de emprendedoras, grupo diverso de mujeres colaborando en espacio de coworking moderno, colores corporativos [tus colores de marca], espacio limpio en el centro para logo, iluminación profesional, estilo corporativo pero cercano, formato wide 820x312"</em></p>

<h2>Caso 4: Thumbnails para YouTube</h2>
<p><strong>Objetivo:</strong> Crear miniaturas que generen clics en tus videos.</p>

<p><strong>Especificaciones técnicas:</strong></p>
<ul>
  <li>Resolución: 1280x720px (mínimo)</li>
  <li>Formato: Horizontal 16:9</li>
  <li>Colores contrastantes (el thumbnail compite con miles de otros videos)</li>
  <li>Texto grande y legible (que se lea en pantallas de celular)</li>
</ul>

<p><strong>Prompt profesional:</strong><br>
<em>"Thumbnail para YouTube, close-up dramático de mujer emprendedora sorprendida mirando a cámara, expresión facial exagerada (sorpresa positiva), fondo con bokeh de colores vibrantes (amarillo y morado), iluminación frontal brillante, espacio en tercio derecho para texto ''5 TIPS'' en letras grandes, estilo clickbait profesional pero auténtico"</em></p>

<p><strong>Ciencia del thumbnail:</strong> Los mejores thumbnails de YouTube tienen 3 elementos:</p>
<ol>
  <li><strong>Rostro humano con emoción clara</strong> (curiosidad, sorpresa, felicidad)</li>
  <li><strong>Colores que contrastan con el fondo blanco/oscuro de YouTube</strong></li>
  <li><strong>Texto corto (máximo 4 palabras)</strong> que crea curiosidad</li>
</ol>

<h2>Caso 5: Imágenes para Blogs y Artículos</h2>
<p><strong>Objetivo:</strong> Crear imágenes horizontales que ilustren tus artículos y se vean bien en thumbnails de Google.</p>

<p><strong>Especificaciones técnicas:</strong></p>
<ul>
  <li>Resolución: 1200x630px (óptimo para SEO y Open Graph)</li>
  <li>Formato: Horizontal 1.91:1</li>
  <li>Relevante al contenido del artículo</li>
</ul>

<p><strong>Prompt profesional:</strong><br>
<em>"Imagen header para blog post sobre [tema], ilustración flat moderna con paleta de 3 colores [tus colores], concepto visual de [metáfora relacionada al tema], composición horizontal limpia, estilo infográfico simplificado, fondo degradado suave, sin texto en la imagen, formato 1200x630 optimizado para SEO"</em></p>

<h2>Caso 6: Creativos para Anuncios Pagados (Ads)</h2>
<p><strong>Objetivo:</strong> Crear imágenes que conviertan en Facebook Ads, Instagram Ads o Google Display.</p>

<p><strong>Especificaciones técnicas:</strong></p>
<ul>
  <li>Resolución: 1080x1080px (cuadrado funciona en la mayoría de plataformas)</li>
  <li>Regla del 20% de texto: Facebook rechaza ads con más del 20% de texto en la imagen (ya no es tan estricto, pero sigue siendo buena práctica)</li>
  <li>Call-to-action visual claro</li>
</ul>

<p><strong>Prompt profesional:</strong><br>
<em>"Anuncio visual cuadrado para Facebook Ads, producto [tu producto] en primer plano con iluminación de estudio profesional, fondo limpio color sólido [color de marca], espacio en parte inferior para CTA button, composición minimalista que dirija la mirada al producto, estilo comercial premium, evitar texto en imagen"</em></p>

<p><strong>A/B Testing de imágenes:</strong> Crea 3 variaciones del mismo anuncio:</p>
<ul>
  <li><strong>Variación A:</strong> Producto solo con fondo limpio</li>
  <li><strong>Variación B:</strong> Persona usando el producto (lifestyle)</li>
  <li><strong>Variación C:</strong> Antes/después o beneficio visual</li>
</ul>

<p>Prueba las 3 con el mismo presupuesto y observa cuál genera más clics/conversiones. Luego invierte más en la ganadora.</p>

<h2>Caso 7: Fotos de Producto con IA</h2>
<p><strong>Objetivo:</strong> Crear imágenes de producto profesionales sin necesidad de fotógrafo ni estudio.</p>

<p><strong>Especificaciones técnicas:</strong></p>
<ul>
  <li>Resolución: Mínimo 2000x2000px (para zoom en tiendas online)</li>
  <li>Fondo limpio o lifestyle según el producto</li>
  <li>Iluminación que resalte textura y detalles</li>
</ul>

<p><strong>Prompt profesional:</strong><br>
<em>"Fotografía de producto profesional, [describe tu producto en detalle], sobre superficie de mármol blanco, iluminación de estudio con softbox que crea sombras suaves, ángulo de 45 grados, fondo completamente blanco puro #FFFFFF, ultra alta definición, estilo e-commerce premium tipo Amazon"</em></p>

<p><strong>Tip para productos físicos:</strong> Si ya tienes el producto, tómale una foto con tu celular y súbela a Whisk. Luego pídele que genere versiones profesionales manteniendo el producto pero mejorando iluminación, fondo y composición.</p>

<h2>Ejercicio Final: Kit Visual Completo para una Campaña</h2>
<p><strong>Tu misión de 45 minutos:</strong> Crear un kit visual completo para lanzar un producto/servicio o promoción.</p>

<p><strong>Genera las siguientes 6 imágenes:</strong></p>
<ol>
  <li><strong>Post cuadrado de Instagram (1080x1080):</strong> Anuncio del lanzamiento</li>
  <li><strong>Instagram Story (1080x1920):</strong> Behind the scenes o testimonial</li>
  <li><strong>Banner de Facebook (820x312):</strong> Cover image para evento o grupo</li>
  <li><strong>Imagen para blog (1200x630):</strong> Article header explicando la campaña</li>
  <li><strong>Ad creativo (1080x1080):</strong> Para Facebook/Instagram Ads</li>
  <li><strong>Bonus - Thumbnail YouTube (1280x720):</strong> Si planeas hablar del lanzamiento en video</li>
</ol>

<p><strong>Checklist de calidad antes de publicar:</strong></p>
<ul>
  <li>✅ ¿Las 6 imágenes mantienen consistencia visual (colores, estilo)?</li>
  <li>✅ ¿Hay espacio para agregar texto sin tapar elementos importantes?</li>
  <li>✅ ¿Se leen bien en pantalla de celular (prueba enviándotelas por WhatsApp)?</li>
  <li>✅ ¿Tienen el formato y resolución correcta para cada plataforma?</li>
  <li>✅ ¿Generan la emoción que buscas (urgencia, curiosidad, confianza)?</li>
</ul>

<p>Cuando termines, tendrás un kit visual profesional que antes te habría costado $500-2000 contratar a un diseñador. Y lo creaste en menos de una hora con IA.</p>

<p>En el siguiente módulo, vamos a llevar esto al siguiente nivel: <strong>video con IA</strong>. Prepárate para crear Reels, YouTube Shorts y comerciales cinematográficos sin cámara ni editor de video.</p>',
    '<h2>From Theory to Practice: Real Marketing Cases</h2>
<p>You already know how Nano Banana works, how to create mood boards in Whisk, and how to make professional prompts. Now comes the most exciting part: <strong>applying all this to your real business</strong>. In this lesson we''re going to create specific visual content for each platform and marketing purpose.</p>

<p>We''ll cover the 6 types of images most used by digital entrepreneurs, with prompt examples and before/after to show you the transformation.</p>

<h2>Case 1: Instagram Posts (Square 1:1)</h2>
<p><strong>Objective:</strong> Create a visually attractive post that stops your audience''s scroll.</p>

<p><strong>Technical specifications:</strong></p>
<ul>
  <li>Recommended resolution: 1080x1080px (Nano Banana generates up to 4K, but Instagram compresses to 1080)</li>
  <li>Format: Square (1:1)</li>
  <li>Colors: That contrast with the typical Instagram feed (avoid dull gray)</li>
</ul>

<p><strong>Professional prompt:</strong><br>
<em>"Overhead photography (flat lay) of entrepreneur desk, open laptop, latte coffee with foam art, notebook with notes, small plants, pastel color palette (light pink, beige, white), soft natural light, symmetrical composition, space at the top to add text, minimalist lifestyle style, Instagram-friendly"</em></p>

<p><strong>Before (amateur prompt):</strong> "Desk with laptop and coffee"<br>
<strong>After (pro prompt):</strong> An image ready to publish that generates 3x more engagement because it has:</p>
<ul>
  <li>Balanced composition</li>
  <li>Cohesive colors</li>
  <li>Strategic space to add text or logo</li>
  <li>Aspirational but achievable vibe</li>
</ul>

<h2>Case 2: Instagram Stories (Vertical 9:16)</h2>
<p><strong>Objective:</strong> Create vertical content that works in Stories and Reels.</p>

<p><strong>Technical specifications:</strong></p>
<ul>
  <li>Resolution: 1080x1920px</li>
  <li>Format: Vertical (9:16)</li>
  <li>Safe zone: Avoid putting text/important elements in the first 250px (top) and last 250px (bottom) where Instagram buttons go</li>
</ul>

<p><strong>Professional prompt:</strong><br>
<em>"Vertical image for Instagram Story, young female entrepreneur holding tablet showing growth charts, natural smile, blurred modern office background, vertical 9:16 composition, safe text zone in middle third, vibrant but professional colors, candid photography style"</em></p>

<p><strong>Pro tip:</strong> In Nano Banana, specify "vertical format 9:16" or "Instagram Story format" — the AI understands these references and adjusts composition automatically.</p>

<h2>Case 3: Facebook Banners (Horizontal)</h2>
<p><strong>Objective:</strong> Create cover images for your Facebook page or group.</p>

<p><strong>Technical specifications:</strong></p>
<ul>
  <li>Resolution: 820x312px (minimum recommended)</li>
  <li>Format: Panoramic horizontal</li>
  <li>Avoid important text at the edges (gets cut on mobile)</li>
</ul>

<p><strong>Professional prompt:</strong><br>
<em>"Horizontal panoramic banner for Facebook cover, concept of female entrepreneur community, diverse group of women collaborating in modern coworking space, corporate colors [your brand colors], clean space in center for logo, professional lighting, corporate but approachable style, wide format 820x312"</em></p>

<h2>Case 4: YouTube Thumbnails</h2>
<p><strong>Objective:</strong> Create thumbnails that generate clicks on your videos.</p>

<p><strong>Technical specifications:</strong></p>
<ul>
  <li>Resolution: 1280x720px (minimum)</li>
  <li>Format: Horizontal 16:9</li>
  <li>Contrasting colors (the thumbnail competes with thousands of other videos)</li>
  <li>Large and legible text (readable on phone screens)</li>
</ul>

<p><strong>Professional prompt:</strong><br>
<em>"YouTube thumbnail, dramatic close-up of female entrepreneur surprised looking at camera, exaggerated facial expression (positive surprise), background with vibrant color bokeh (yellow and purple), bright frontal lighting, space in right third for text ''5 TIPS'' in large letters, professional but authentic clickbait style"</em></p>

<p><strong>Thumbnail science:</strong> The best YouTube thumbnails have 3 elements:</p>
<ol>
  <li><strong>Human face with clear emotion</strong> (curiosity, surprise, happiness)</li>
  <li><strong>Colors that contrast with YouTube''s white/dark background</strong></li>
  <li><strong>Short text (maximum 4 words)</strong> that creates curiosity</li>
</ol>

<h2>Case 5: Images for Blogs and Articles</h2>
<p><strong>Objective:</strong> Create horizontal images that illustrate your articles and look good in Google thumbnails.</p>

<p><strong>Technical specifications:</strong></p>
<ul>
  <li>Resolution: 1200x630px (optimal for SEO and Open Graph)</li>
  <li>Format: Horizontal 1.91:1</li>
  <li>Relevant to article content</li>
</ul>

<p><strong>Professional prompt:</strong><br>
<em>"Header image for blog post about [topic], modern flat illustration with 3-color palette [your colors], visual concept of [metaphor related to topic], clean horizontal composition, simplified infographic style, soft gradient background, no text in image, format 1200x630 optimized for SEO"</em></p>

<h2>Case 6: Creatives for Paid Ads</h2>
<p><strong>Objective:</strong> Create images that convert on Facebook Ads, Instagram Ads, or Google Display.</p>

<p><strong>Technical specifications:</strong></p>
<ul>
  <li>Resolution: 1080x1080px (square works on most platforms)</li>
  <li>20% text rule: Facebook rejects ads with more than 20% text in image (not as strict anymore, but still good practice)</li>
  <li>Clear visual call-to-action</li>
</ul>

<p><strong>Professional prompt:</strong><br>
<em>"Square visual ad for Facebook Ads, product [your product] in foreground with professional studio lighting, clean solid color background [brand color], space at bottom for CTA button, minimalist composition that directs gaze to product, premium commercial style, avoid text in image"</em></p>

<p><strong>Image A/B Testing:</strong> Create 3 variations of the same ad:</p>
<ul>
  <li><strong>Variation A:</strong> Product alone with clean background</li>
  <li><strong>Variation B:</strong> Person using the product (lifestyle)</li>
  <li><strong>Variation C:</strong> Before/after or visual benefit</li>
</ul>

<p>Test all 3 with the same budget and see which generates more clicks/conversions. Then invest more in the winner.</p>

<h2>Case 7: Product Photos with AI</h2>
<p><strong>Objective:</strong> Create professional product images without needing a photographer or studio.</p>

<p><strong>Technical specifications:</strong></p>
<ul>
  <li>Resolution: Minimum 2000x2000px (for zoom in online stores)</li>
  <li>Clean background or lifestyle depending on product</li>
  <li>Lighting that highlights texture and details</li>
</ul>

<p><strong>Professional prompt:</strong><br>
<em>"Professional product photography, [describe your product in detail], on white marble surface, studio lighting with softbox creating soft shadows, 45-degree angle, completely pure white background #FFFFFF, ultra high definition, premium e-commerce style like Amazon"</em></p>

<p><strong>Tip for physical products:</strong> If you already have the product, take a photo with your phone and upload it to Whisk. Then ask it to generate professional versions keeping the product but improving lighting, background, and composition.</p>

<h2>Final Exercise: Complete Visual Kit for a Campaign</h2>
<p><strong>Your 45-minute mission:</strong> Create a complete visual kit to launch a product/service or promotion.</p>

<p><strong>Generate the following 6 images:</strong></p>
<ol>
  <li><strong>Square Instagram post (1080x1080):</strong> Launch announcement</li>
  <li><strong>Instagram Story (1080x1920):</strong> Behind the scenes or testimonial</li>
  <li><strong>Facebook banner (820x312):</strong> Cover image for event or group</li>
  <li><strong>Blog image (1200x630):</strong> Article header explaining the campaign</li>
  <li><strong>Ad creative (1080x1080):</strong> For Facebook/Instagram Ads</li>
  <li><strong>Bonus - YouTube thumbnail (1280x720):</strong> If you plan to talk about the launch in video</li>
</ol>

<p><strong>Quality checklist before publishing:</strong></p>
<ul>
  <li>✅ Do all 6 images maintain visual consistency (colors, style)?</li>
  <li>✅ Is there space to add text without covering important elements?</li>
  <li>✅ Do they read well on phone screen (test by sending them to yourself on WhatsApp)?</li>
  <li>✅ Do they have the correct format and resolution for each platform?</li>
  <li>✅ Do they generate the emotion you''re looking for (urgency, curiosity, trust)?</li>
</ul>

<p>When you''re done, you''ll have a professional visual kit that would have cost you $500-2000 to hire a designer before. And you created it in less than an hour with AI.</p>

<p>In the next module, we''re going to take this to the next level: <strong>video with AI</strong>. Get ready to create Reels, YouTube Shorts, and cinematic commercials without a camera or video editor.</p>',
    3,
    25
  );

  -- ============================================================
  -- MODULO 6: Video con IA (order_index = 6)
  -- ============================================================
  SELECT id INTO v_module_id
  FROM public.modules
  WHERE course_id = v_course_id AND order_index = 6;

  IF v_module_id IS NULL THEN
    RAISE EXCEPTION 'Modulo 6 no encontrado.';
  END IF;

  DELETE FROM public.lessons WHERE module_id = v_module_id;

  -- Lesson 6.0: Veo 3: Video con IA en Minutos
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Veo 3: Video con IA en Minutos',
    'Veo 3: AI Video in Minutes',
    '<h2>La Revolución del Video con IA</h2>
<p>Hasta hace poco, crear video profesional requería cámaras caras, software de edición complejo, y horas de trabajo. Todo eso cambió con <strong>Veo 3 y Veo 3.1</strong>, los modelos de generación de video de Google DeepMind. Ahora puedes <em>describir el video que quieres en lenguaje natural</em> y la IA lo genera en minutos. No necesitas cámara, actores, editor, ni estudio.</p>

<p>Pero Veo 3.1 no solo genera video — genera <strong>audio nativo</strong> junto con la imagen:</p>

<ul>
  <li><strong>Efectos de sonido:</strong> Pasos, puertas abriéndose, agua corriendo, tráfico en la calle — todo generado automáticamente según lo que aparece en el video</li>
  <li><strong>Diálogos:</strong> Puedes pedirle que un personaje diga algo específico y Veo genera la voz sincronizada con el movimiento de labios</li>
  <li><strong>Música ambiental:</strong> Soundtrack de fondo que coincide con el tono de la escena (dramático, alegre, suspensivo, inspiracional)</li>
</ul>

<p>Esto es un cambio de juego. Antes, generar video era solo una parte del trabajo — luego tenías que agregar audio por separado. Ahora, con Veo 3.1, describes el video completo (imagen + sonido) en un solo prompt y obtienes el resultado final.</p>

<h2>¿Dónde Puedes Usar Veo 3?</h2>
<p>Google ha integrado Veo en dos lugares principales:</p>

<ul>
  <li><strong>Google AI Studio:</strong> La interfaz más poderosa, donde tienes control total sobre parámetros. Puedes ajustar duración, estilo, ratio de aspecto (horizontal, vertical, cuadrado). Ideal para experimentar y crear videos para proyectos específicos.</li>
  <li><strong>Google Flow:</strong> La forma más integrada. Aquí puedes crear un mood board en Whisk, generar imágenes con Nano Banana, y luego animarlas en videos con Veo — todo en el mismo lugar, sin saltar entre apps.</li>
</ul>

<p>Ambas opciones tienen <strong>límites generosos gratuitos</strong> en AI Studio. Si necesitas más capacidad, Gemini Pro ($20/mes) incluye generación de video ilimitada con prioridad.</p>

<h2>Realismo Basado en Física del Mundo Real</h2>
<p>Una de las cosas más impresionantes de Veo 3.1 es que entiende <strong>cómo funcionan las cosas en el mundo real</strong>:</p>

<ul>
  <li><strong>Gravedad:</strong> Los objetos caen de manera realista, no flotan de forma extraña</li>
  <li><strong>Iluminación:</strong> Las sombras se mueven coherentemente con la fuente de luz</li>
  <li><strong>Movimiento de cámara:</strong> Puedes pedir "dolly zoom" o "tracking shot" y Veo reproduce esos movimientos cinematográficos correctamente</li>
  <li><strong>Interacción de objetos:</strong> Si una persona toma una taza, la mano se cierra alrededor de la taza de forma natural, no atraviesa el objeto</li>
</ul>

<p>Esto es resultado de entrenar la IA con millones de videos reales. Veo aprendió las reglas de la física simplemente observando cómo se mueven las cosas en el mundo real.</p>

<h2>Prompting para Video: Cómo Describir lo que Quieres</h2>
<p>Generar video con IA requiere prompts más detallados que las imágenes, porque ahora tienes que describir <strong>movimiento</strong> además de apariencia. Aquí está la fórmula de 6 elementos:</p>

<h3>1. Sujeto y Acción</h3>
<p>¿Quién/qué aparece y qué hace?</p>
<ul>
  <li>"Una emprendedora presentando su producto a cámara"</li>
  <li>"Un café latte siendo preparado en cámara lenta"</li>
  <li>"Una tienda abriéndose en la mañana con cortinas enrollándose"</li>
</ul>

<h3>2. Movimiento de Cámara</h3>
<p>Esto define la cinematografía:</p>
<ul>
  <li>"Cámara estática" — sin movimiento, como foto pero en video</li>
  <li>"Dolly in" — acercamiento suave hacia el sujeto</li>
  <li>"Pan left to right" — panorámica de izquierda a derecha</li>
  <li>"Tracking shot siguiendo al sujeto" — cámara se mueve con la persona</li>
  <li>"Drone shot ascendiendo" — vista aérea subiendo</li>
</ul>

<h3>3. Estilo Visual</h3>
<p>Similar a imágenes, pero considerando movimiento:</p>
<ul>
  <li>"Estilo documental con cámara en mano"</li>
  <li>"Cinematográfico estilo comercial de Apple"</li>
  <li>"Animación 3D estilo Pixar"</li>
  <li>"Footage real estilo lifestyle"</li>
</ul>

<h3>4. Iluminación y Ambiente</h3>
<ul>
  <li>"Luz natural de ventana con sombras suaves"</li>
  <li>"Golden hour con luz cálida de atardecer"</li>
  <li>"Iluminación dramática con contrastes marcados"</li>
  <li>"Ambiente nocturno con luces de ciudad"</li>
</ul>

<h3>5. Audio Deseado (Nuevo en Veo 3.1)</h3>
<p>Ahora puedes especificar qué sonidos quieres:</p>
<ul>
  <li>"Con música inspiracional de fondo"</li>
  <li>"Sonidos ambientales de cafetería (conversaciones, máquina de café)"</li>
  <li>"Voz en off femenina diciendo ''[tu mensaje]''"</li>
  <li>"Efectos de sonido naturalistas sin música"</li>
</ul>

<h3>6. Duración y Ritmo</h3>
<ul>
  <li>"Video de 10 segundos con ritmo dinámico"</li>
  <li>"Clip de 5 segundos en cámara lenta"</li>
  <li>"30 segundos con transición suave entre escenas"</li>
</ul>

<h2>Ejemplo Completo: De Prompt Amateur a Profesional</h2>
<p><strong>Prompt Amateur:</strong><br>
<em>"Una mujer hablando sobre su negocio"</em></p>

<p><strong>Prompt Profesional:</strong><br>
<em>"Video de 15 segundos estilo documental: emprendedora latina de 35 años hablando a cámara sobre su negocio de productos naturales, plano medio, cámara estática profesional, luz natural de ventana lateral creando iluminación suave, fondo desenfocado de oficina moderna minimalista, ella gesticula naturalmente mientras habla, audio con voz clara y música inspiracional instrumental de fondo a volumen bajo, colores cálidos, estilo comercial premium pero auténtico"</em></p>

<p>¿Ves la diferencia? El segundo prompt especifica:</p>
<ul>
  <li>Duración exacta (15 seg)</li>
  <li>Estilo (documental)</li>
  <li>Descripción detallada del sujeto</li>
  <li>Tipo de plano (medio)</li>
  <li>Movimiento de cámara (estática)</li>
  <li>Iluminación específica</li>
  <li>Audio deseado (voz + música)</li>
  <li>Vibe general (premium pero auténtico)</li>
</ul>

<h2>Tu Primer Video: Ejercicio Práctico de 10 Minutos</h2>
<p><strong>Vamos a generar tu primer video promocional paso a paso:</strong></p>

<ol>
  <li><strong>Accede a Google AI Studio:</strong> Ve a ai.google.dev e inicia sesión con tu cuenta de Google</li>
  <li><strong>Selecciona "Generar Video":</strong> Busca la opción de Veo en el menú</li>
  <li><strong>Escribe este prompt de prueba:</strong><br>
  <em>"Video de 10 segundos para Instagram Reel: producto [tu producto o servicio representado visualmente] mostrado en mesa de madera natural con luz natural suave, cámara haciendo dolly in lento acercándose al producto, fondo desenfocado con bokeh, música ambiental inspiracional de fondo, estilo comercial minimalista premium, colores cálidos"</em></li>
  <li><strong>Ajusta parámetros:</strong>
    <ul>
      <li>Duración: 10 segundos</li>
      <li>Ratio: 9:16 (vertical para Reels/Stories)</li>
      <li>Calidad: Alta</li>
    </ul>
  </li>
  <li><strong>Genera:</strong> Presiona "Generate" y espera 2-3 minutos</li>
  <li><strong>Descarga y prueba:</strong> Baja el video y envíatelo por WhatsApp para verlo en tu celular</li>
</ol>

<p><strong>¿Cómo se sintió?</strong> Acabas de crear un video profesional sin tocar una cámara. Eso que antes costaba $200-500 contratar a un videógrafo, lo hiciste gratis en minutos.</p>

<h2>Límites Actuales (y Cómo Trabajar con Ellos)</h2>
<p>Veo 3.1 es increíble, pero aún tiene limitaciones que debes conocer:</p>

<ul>
  <li><strong>Duración máxima por clip:</strong> ~60 segundos por generación individual. Si necesitas videos más largos, genera escenas por separado y úne las en un editor simple como CapCut (gratis)</li>
  <li><strong>Texto en video:</strong> Aunque Nano Banana 2 genera texto legible en imágenes, Veo aún no es consistente con texto en movimiento. Mejor agrega texto en post-producción</li>
  <li><strong>Consistencia de personajes:</strong> Si generas múltiples clips, el mismo personaje puede verse ligeramente diferente entre escenas. Esto mejorará en próximas versiones</li>
  <li><strong>Tiempo de generación:</strong> Videos complejos pueden tomar 3-5 minutos. Planea esto en tu flujo de trabajo</li>
</ul>

<p>La clave es trabajar <em>con</em> las fortalezas de Veo, no contra sus limitaciones actuales. Úsalo para:</p>
<ul>
  <li>B-roll (footage complementario)</li>
  <li>Escenas de transición</li>
  <li>Videos cortos de producto</li>
  <li>Animaciones de concepto</li>
  <li>Videos explicativos sin rostros humanos</li>
</ul>

<p>En la siguiente lección, vamos a ver casos específicos para redes sociales: Reels, Stories, YouTube Shorts. Prepárate para crear contenido viral con IA.</p>',
    '<h2>The AI Video Revolution</h2>
<p>Until recently, creating professional video required expensive cameras, complex editing software, and hours of work. All that changed with <strong>Veo 3 and Veo 3.1</strong>, Google DeepMind''s video generation models. Now you can <em>describe the video you want in natural language</em> and the AI generates it in minutes. You don''t need a camera, actors, editor, or studio.</p>

<p>But Veo 3.1 doesn''t just generate video — it generates <strong>native audio</strong> along with the image:</p>

<ul>
  <li><strong>Sound effects:</strong> Footsteps, doors opening, water running, street traffic — all automatically generated based on what appears in the video</li>
  <li><strong>Dialogues:</strong> You can ask for a character to say something specific and Veo generates the voice synchronized with lip movement</li>
  <li><strong>Ambient music:</strong> Background soundtrack that matches the scene''s tone (dramatic, cheerful, suspenseful, inspirational)</li>
</ul>

<p>This is a game changer. Before, generating video was only part of the work — then you had to add audio separately. Now, with Veo 3.1, you describe the complete video (image + sound) in a single prompt and get the final result.</p>

<h2>Where Can You Use Veo 3?</h2>
<p>Google has integrated Veo in two main places:</p>

<ul>
  <li><strong>Google AI Studio:</strong> The most powerful interface, where you have full control over parameters. You can adjust duration, style, aspect ratio (horizontal, vertical, square). Ideal for experimenting and creating videos for specific projects.</li>
  <li><strong>Google Flow:</strong> The most integrated way. Here you can create a mood board in Whisk, generate images with Nano Banana, and then animate them into videos with Veo — all in the same place, without jumping between apps.</li>
</ul>

<p>Both options have <strong>generous free limits</strong> in AI Studio. If you need more capacity, Gemini Pro ($20/month) includes unlimited priority video generation.</p>

<h2>Realism Based on Real-World Physics</h2>
<p>One of the most impressive things about Veo 3.1 is that it understands <strong>how things work in the real world</strong>:</p>

<ul>
  <li><strong>Gravity:</strong> Objects fall realistically, don''t float strangely</li>
  <li><strong>Lighting:</strong> Shadows move coherently with the light source</li>
  <li><strong>Camera movement:</strong> You can ask for "dolly zoom" or "tracking shot" and Veo reproduces those cinematic movements correctly</li>
  <li><strong>Object interaction:</strong> If a person picks up a cup, the hand closes around the cup naturally, doesn''t pass through the object</li>
</ul>

<p>This is the result of training the AI with millions of real videos. Veo learned the rules of physics simply by observing how things move in the real world.</p>

<h2>Prompting for Video: How to Describe What You Want</h2>
<p>Generating video with AI requires more detailed prompts than images, because now you have to describe <strong>movement</strong> in addition to appearance. Here''s the 6-element formula:</p>

<h3>1. Subject and Action</h3>
<p>Who/what appears and what do they do?</p>
<ul>
  <li>"A female entrepreneur presenting her product to camera"</li>
  <li>"A latte coffee being prepared in slow motion"</li>
  <li>"A store opening in the morning with curtains rolling up"</li>
</ul>

<h3>2. Camera Movement</h3>
<p>This defines the cinematography:</p>
<ul>
  <li>"Static camera" — no movement, like photo but in video</li>
  <li>"Dolly in" — smooth approach towards subject</li>
  <li>"Pan left to right" — panoramic from left to right</li>
  <li>"Tracking shot following subject" — camera moves with person</li>
  <li>"Drone shot ascending" — aerial view going up</li>
</ul>

<h3>3. Visual Style</h3>
<p>Similar to images, but considering movement:</p>
<ul>
  <li>"Documentary style with handheld camera"</li>
  <li>"Cinematic Apple commercial style"</li>
  <li>"Pixar-style 3D animation"</li>
  <li>"Real lifestyle footage style"</li>
</ul>

<h3>4. Lighting and Atmosphere</h3>
<ul>
  <li>"Natural window light with soft shadows"</li>
  <li>"Golden hour with warm sunset light"</li>
  <li>"Dramatic lighting with pronounced contrasts"</li>
  <li>"Night atmosphere with city lights"</li>
</ul>

<h3>5. Desired Audio (New in Veo 3.1)</h3>
<p>Now you can specify what sounds you want:</p>
<ul>
  <li>"With inspirational background music"</li>
  <li>"Coffee shop ambient sounds (conversations, coffee machine)"</li>
  <li>"Female voice-over saying ''[your message]''"</li>
  <li>"Naturalistic sound effects without music"</li>
</ul>

<h3>6. Duration and Pace</h3>
<ul>
  <li>"10-second video with dynamic pace"</li>
  <li>"5-second clip in slow motion"</li>
  <li>"30 seconds with smooth transition between scenes"</li>
</ul>

<h2>Complete Example: From Amateur to Professional Prompt</h2>
<p><strong>Amateur Prompt:</strong><br>
<em>"A woman talking about her business"</em></p>

<p><strong>Professional Prompt:</strong><br>
<em>"15-second documentary-style video: 35-year-old Latina entrepreneur talking to camera about her natural products business, medium shot, professional static camera, natural side window light creating soft lighting, blurred minimalist modern office background, she gestures naturally while talking, audio with clear voice and low-volume inspirational instrumental background music, warm colors, premium but authentic commercial style"</em></p>

<p>See the difference? The second prompt specifies:</p>
<ul>
  <li>Exact duration (15 sec)</li>
  <li>Style (documentary)</li>
  <li>Detailed subject description</li>
  <li>Shot type (medium)</li>
  <li>Camera movement (static)</li>
  <li>Specific lighting</li>
  <li>Desired audio (voice + music)</li>
  <li>Overall vibe (premium but authentic)</li>
</ul>

<h2>Your First Video: 10-Minute Practical Exercise</h2>
<p><strong>Let''s generate your first promotional video step by step:</strong></p>

<ol>
  <li><strong>Access Google AI Studio:</strong> Go to ai.google.dev and sign in with your Google account</li>
  <li><strong>Select "Generate Video":</strong> Look for the Veo option in the menu</li>
  <li><strong>Write this test prompt:</strong><br>
  <em>"10-second video for Instagram Reel: product [your product or service visually represented] shown on natural wood table with soft natural light, camera doing slow dolly in approaching product, blurred background with bokeh, inspirational ambient background music, premium minimalist commercial style, warm colors"</em></li>
  <li><strong>Adjust parameters:</strong>
    <ul>
      <li>Duration: 10 seconds</li>
      <li>Ratio: 9:16 (vertical for Reels/Stories)</li>
      <li>Quality: High</li>
    </ul>
  </li>
  <li><strong>Generate:</strong> Press "Generate" and wait 2-3 minutes</li>
  <li><strong>Download and test:</strong> Download the video and send it to yourself on WhatsApp to view on your phone</li>
</ol>

<p><strong>How did it feel?</strong> You just created a professional video without touching a camera. What used to cost $200-500 to hire a videographer, you did for free in minutes.</p>

<h2>Current Limitations (and How to Work with Them)</h2>
<p>Veo 3.1 is incredible, but still has limitations you should know:</p>

<ul>
  <li><strong>Maximum duration per clip:</strong> ~60 seconds per individual generation. If you need longer videos, generate scenes separately and join them in a simple editor like CapCut (free)</li>
  <li><strong>Text in video:</strong> Although Nano Banana 2 generates legible text in images, Veo still isn''t consistent with moving text. Better to add text in post-production</li>
  <li><strong>Character consistency:</strong> If you generate multiple clips, the same character may look slightly different between scenes. This will improve in future versions</li>
  <li><strong>Generation time:</strong> Complex videos can take 3-5 minutes. Plan this into your workflow</li>
</ul>

<p>The key is to work <em>with</em> Veo''s strengths, not against its current limitations. Use it for:</p>
<ul>
  <li>B-roll (complementary footage)</li>
  <li>Transition scenes</li>
  <li>Short product videos</li>
  <li>Concept animations</li>
  <li>Explainer videos without human faces</li>
</ul>

<p>In the next lesson, we''ll look at specific cases for social media: Reels, Stories, YouTube Shorts. Get ready to create viral content with AI.</p>',
    0,
    25
  );

  -- Lesson 6.1: Videos para Redes Sociales
  INSERT INTO public.lessons (id, module_id, title, title_en, content, content_en, order_index, duration_minutes)
  VALUES (
    gen_random_uuid(),
    v_module_id,
    'Videos para Redes Sociales',
    'Videos for Social Media',
    '<h2>El Formato que Domina el Internet: Video Corto Vertical</h2>
<p>Los videos cortos verticales han tomado el control de las redes sociales. TikTok comenzó la revolución, Instagram respondió con Reels, YouTube lanzó Shorts, Facebook tiene sus propios videos cortos. El algoritmo de todas estas plataformas favorece masivamente el video corto vertical. <strong>¿Por qué?</strong> Porque es el formato nativo del celular — es inmersivo, adictivo, y genera más tiempo de permanencia en la plataforma.</p>

<p>Datos que debes conocer:</p>
<ul>
  <li>Los Reels de Instagram generan <strong>22% más engagement</strong> que posts de fotos</li>
  <li>El 91% de usuarios activos de Instagram ven Reels semanalmente</li>
  <li>Los YouTube Shorts tienen más de <strong>50 mil millones de visualizaciones diarias</strong></li>
  <li>Las cuentas que publican Reels/Shorts consistentemente crecen <strong>3x más rápido</strong> que las que solo publican fotos</li>
</ul>

<p>Si no estás creando video vertical, estás dejando dinero sobre la mesa. Y con Veo 3.1, ya no hay excusa.</p>

<h2>Reels e Instagram Stories: Especificaciones y Estrategia</h2>
<p><strong>Especificaciones técnicas:</strong></p>
<ul>
  <li><strong>Formato:</strong> 9:16 (vertical)</li>
  <li><strong>Resolución:</strong> 1080x1920px mínimo</li>
  <li><strong>Duración óptima:</strong> 7-15 segundos (el algoritmo favorece videos que se ven completos)</li>
  <li><strong>Audio:</strong> Fundamental — los Reels con música/audio generan 2x más alcance</li>
</ul>

<p><strong>La fórmula del Reel viral:</strong></p>
<ol>
  <li><strong>Hook (primeros 3 seg):</strong> Algo visual o texto que frene el scroll. Pregunta intrigante, afirmación sorprendente, o visual impactante</li>
  <li><strong>Contenido (seg 4-12):</strong> Entrega valor rápido — tip, transformación, detrás de escenas, producto en acción</li>
  <li><strong>CTA (últimos 2 seg):</strong> Call to action — "guarda esto", "sígueme para más", "comenta tu favorito"</li>
</ol>

<p><strong>Prompt para Reel de producto:</strong><br>
<em>"Video vertical 9:16 de 10 segundos: producto [describe tu producto] girando lentamente en 360 grados sobre superficie de mármol blanco, iluminación de estudio profesional con sombras suaves, cámara tracking shot circular siguiendo el producto, fondo desenfocado con bokeh dorado, música electrónica upbeat de fondo, texto superior ''NUEVO'' apareciendo en primer segundo, estilo comercial premium minimalista, colores vibrantes pero elegantes"</em></p>

<h2>YouTube Shorts: Más Largo, Más Profundo</h2>
<p><strong>Diferencia clave con Reels:</strong> YouTube Shorts pueden durar hasta 60 segundos (vs 90 seg máximo en Reels, pero óptimo es 7-15). Esto te da más tiempo para contar una historia o enseñar algo.</p>

<p><strong>Especificaciones técnicas:</strong></p>
<ul>
  <li><strong>Formato:</strong> 9:16 vertical (como Reels)</li>
  <li><strong>Resolución:</strong> 1080x1920px</li>
  <li><strong>Duración óptima:</strong> 15-30 segundos (YouTube favorece retención completa)</li>
  <li><strong>Título crítico:</strong> A diferencia de Instagram, el título de YouTube Shorts es clave para SEO</li>
</ul>

<p><strong>Estrategia de Shorts:</strong></p>
<ul>
  <li>Úsalos como ''teasers'' de tus videos largos de YouTube — genera tráfico a contenido monetizable</li>
  <li>Enseña un concepto completo en 30 segundos — YouTube favorece contenido educativo</li>
  <li>Incluye subtítulos (el 85% de Shorts se ven sin audio)</li>
</ul>

<p><strong>Prompt para YouTube Short educativo:</strong><br>
<em>"Video vertical 9:16 de 25 segundos estilo educativo: secuencia de 3 escenas mostrando proceso paso a paso de [tu tema], animación limpia estilo motion graphics, fondo gradiente moderno, texto grande y legible apareciendo para cada paso, transiciones rápidas entre escenas, música instrumental energética de fondo a volumen medio, paleta de colores [tu marca], estilo tutorial profesional tipo Vox o MKBHD"</em></p>

<h2>Scene Extension: Videos de Más de 1 Minuto</h2>
<p>Veo 3.1 tiene un límite de ~60 segundos por generación individual. Pero Google lanzó <strong>Scene Extension</strong> — una función que te permite extender videos generando la continuación natural de una escena.</p>

<p><strong>Cómo funciona:</strong></p>
<ol>
  <li>Generas el primer clip de 60 seg con tu prompt</li>
  <li>Usas Scene Extension para generar los siguientes 60 seg basados en el final del primero</li>
  <li>Veo mantiene consistencia de iluminación, estilo y movimiento entre escenas</li>
  <li>Unes los clips en un editor simple como CapCut (gratis) o directamente en Flow</li>
</ol>

<p><strong>Caso de uso:</strong> Quieres crear un comercial de 90 segundos para tu curso online:</p>
<ul>
  <li><strong>Escena 1 (0-60 seg):</strong> Introducción al problema que resuelve tu curso</li>
  <li><strong>Escena 2 (60-90 seg):</strong> Continuación mostrando la solución y CTA</li>
</ul>

<p>Genera cada escena por separado y únelas. El resultado final se ve como un video continuo profesional.</p>

<h2>Upscale a 1080p y 4K: Calidad Premium</h2>
<p>Todos los videos de Veo se generan inicialmente en resolución estándar para velocidad. Pero puedes hacer <strong>upscale</strong> a mayor resolución:</p>

<ul>
  <li><strong>1080p:</strong> Perfecto para Reels, Stories, Shorts — se ve nítido en celulares</li>
  <li><strong>4K (3840x2160):</strong> Para contenido premium, anuncios en TV digital, o proyecciones</li>
</ul>

<p>El upscale no solo aumenta píxeles — usa IA para mejorar detalles, reducir ruido, y hacer la imagen más nítida. Es como pasar tu video por un filtro profesional de post-producción.</p>

<p><strong>Cuándo usar cada resolución:</strong></p>
<ul>
  <li><strong>1080p:</strong> Redes sociales, YouTube, anuncios digitales</li>
  <li><strong>4K:</strong> Contenido para sitio web, presentaciones profesionales, pantallas grandes</li>
</ul>

<h2>Tips para Contenido Viral: La Ciencia del Engagement</h2>
<p>Basado en análisis de millones de videos virales, estos son los elementos que más funcionan:</p>

<h3>1. Hooks Visuales en los Primeros 3 Segundos</h3>
<ul>
  <li><strong>Transformación rápida:</strong> Antes/después en 2 segundos</li>
  <li><strong>Movimiento inesperado:</strong> Algo que rompe expectativas</li>
  <li><strong>Rostro humano con emoción fuerte:</strong> Sorpresa, felicidad, curiosidad</li>
  <li><strong>Texto grande y directo:</strong> "ESTO cambió mi negocio"</li>
</ul>

<h3>2. Storytelling Visual</h3>
<p>Incluso en 15 segundos, necesitas una micro-historia:</p>
<ul>
  <li><strong>Problema (seg 0-3):</strong> Muestra el dolor/necesidad</li>
  <li><strong>Solución (seg 4-12):</strong> Tu producto/servicio/tip resolviendo el problema</li>
  <li><strong>Resultado (seg 13-15):</strong> El beneficio final o CTA</li>
</ul>

<h3>3. CTAs (Call-to-Actions) Efectivos</h3>
<p>Los videos con CTA claro generan <strong>47% más conversiones</strong>. Ejemplos:</p>
<ul>
  <li>"Guarda esto para después" — aumenta saves (señal de valor para el algoritmo)</li>
  <li>"Comenta TU TIP favorito" — genera engagement</li>
  <li>"Sígueme para la parte 2" — incrementa seguidores</li>
  <li>"Link en bio" — tráfico a tu sitio/tienda</li>
</ul>

<p>Incorpora el CTA visualmente en el video, no solo en el caption.</p>

<h2>Ejercicio Práctico: Crea 3 Videos Cortos para tu Negocio</h2>
<p><strong>Tu misión de 30 minutos:</strong> Generar 3 tipos de videos que funcionan para cualquier negocio.</p>

<h3>Video 1: Presentación de Producto (10 seg)</h3>
<p><strong>Propósito:</strong> Mostrar tu producto/servicio de forma atractiva.<br>
<strong>Prompt:</strong> <em>"Video vertical 9:16 de 10 segundos: [producto] en primer plano sobre [superficie], cámara dolly in acercándose suavemente, iluminación profesional, fondo [color de marca] desenfocado, texto ''CONOCE [nombre]'' apareciendo en seg 2, música energética de fondo, estilo comercial premium"</em></p>

<h3>Video 2: Testimonio/Transformación (15 seg)</h3>
<p><strong>Propósito:</strong> Mostrar resultados o beneficios.<br>
<strong>Prompt:</strong> <em>"Video vertical 9:16 de 15 segundos: secuencia antes/después mostrando [transformación que ofrece tu servicio], transición rápida en seg 7, iluminación natural, estilo documental auténtico, texto overlay ''ANTES'' y ''DESPUÉS'', música inspiracional de fondo"</em></p>

<h3>Video 3: Behind-the-Scenes (12 seg)</h3>
<p><strong>Propósito:</strong> Humanizar tu marca y generar conexión.<br>
<strong>Prompt:</strong> <em>"Video vertical 9:16 de 12 segundos estilo candid: proceso de [cómo haces tu producto/servicio], cámara handheld siguiendo la acción, luz natural, vibe auténtico y cercano, música alegre de fondo, texto ''ASÍ LO HACEMOS'' en primeros 3 seg"</em></p>

<p><strong>Acción final:</strong> Publica los 3 videos en la misma semana en tus redes sociales. Analiza cuál genera más engagement y crea más variaciones de ese tipo.</p>

<p>En la siguiente lección, vamos a unir todo: Whisk + Nano Banana + Veo para crear secuencias de video cinematográficas completas. Prepárate para crear comerciales dignos de agencias creativas millonarias.</p>',
    '<h2>The Format That Dominates the Internet: Short Vertical Video</h2>
<p>Short vertical videos have taken control of social media. TikTok started the revolution, Instagram responded with Reels, YouTube launched Shorts, Facebook has its own short videos. The algorithm of all these platforms massively favors short vertical video. <strong>Why?</strong> Because it''s the native mobile format — it''s immersive, addictive, and generates more time spent on the platform.</p>

<p>Data you should know:</p>
<ul>
  <li>Instagram Reels generate <strong>22% more engagement</strong> than photo posts</li>
  <li>91% of active Instagram users watch Reels weekly</li>
  <li>YouTube Shorts have more than <strong>50 billion daily views</strong></li>
  <li>Accounts that consistently post Reels/Shorts grow <strong>3x faster</strong> than those that only post photos</li>
</ul>

<p>If you''re not creating vertical video, you''re leaving money on the table. And with Veo 3.1, there''s no excuse.</p>

<h2>Reels and Instagram Stories: Specifications and Strategy</h2>
<p><strong>Technical specifications:</strong></p>
<ul>
  <li><strong>Format:</strong> 9:16 (vertical)</li>
  <li><strong>Resolution:</strong> 1080x1920px minimum</li>
  <li><strong>Optimal duration:</strong> 7-15 seconds (algorithm favors videos watched completely)</li>
  <li><strong>Audio:</strong> Fundamental — Reels with music/audio generate 2x more reach</li>
</ul>

<p><strong>The viral Reel formula:</strong></p>
<ol>
  <li><strong>Hook (first 3 sec):</strong> Something visual or text that stops the scroll. Intriguing question, surprising statement, or impactful visual</li>
  <li><strong>Content (sec 4-12):</strong> Deliver quick value — tip, transformation, behind the scenes, product in action</li>
  <li><strong>CTA (last 2 sec):</strong> Call to action — "save this", "follow for more", "comment your favorite"</li>
</ol>

<p><strong>Prompt for product Reel:</strong><br>
<em>"9:16 vertical 10-second video: product [describe your product] slowly rotating 360 degrees on white marble surface, professional studio lighting with soft shadows, circular tracking shot camera following product, blurred background with golden bokeh, upbeat electronic background music, text ''NEW'' appearing in first second, premium minimalist commercial style, vibrant but elegant colors"</em></p>

<h2>YouTube Shorts: Longer, Deeper</h2>
<p><strong>Key difference with Reels:</strong> YouTube Shorts can last up to 60 seconds (vs 90 sec max on Reels, but optimal is 7-15). This gives you more time to tell a story or teach something.</p>

<p><strong>Technical specifications:</strong></p>
<ul>
  <li><strong>Format:</strong> 9:16 vertical (like Reels)</li>
  <li><strong>Resolution:</strong> 1080x1920px</li>
  <li><strong>Optimal duration:</strong> 15-30 seconds (YouTube favors complete retention)</li>
  <li><strong>Critical title:</strong> Unlike Instagram, the YouTube Shorts title is key for SEO</li>
</ul>

<p><strong>Shorts strategy:</strong></p>
<ul>
  <li>Use them as ''teasers'' of your long YouTube videos — generate traffic to monetizable content</li>
  <li>Teach a complete concept in 30 seconds — YouTube favors educational content</li>
  <li>Include subtitles (85% of Shorts are watched without audio)</li>
</ul>

<p><strong>Prompt for educational YouTube Short:</strong><br>
<em>"9:16 vertical 25-second educational video: sequence of 3 scenes showing step-by-step process of [your topic], clean motion graphics animation, modern gradient background, large legible text appearing for each step, quick transitions between scenes, energetic instrumental background music at medium volume, color palette [your brand], professional tutorial style like Vox or MKBHD"</em></p>

<h2>Scene Extension: Videos Over 1 Minute</h2>
<p>Veo 3.1 has a limit of ~60 seconds per individual generation. But Google launched <strong>Scene Extension</strong> — a function that lets you extend videos by generating the natural continuation of a scene.</p>

<p><strong>How it works:</strong></p>
<ol>
  <li>Generate the first 60-sec clip with your prompt</li>
  <li>Use Scene Extension to generate the next 60 sec based on the end of the first</li>
  <li>Veo maintains consistency of lighting, style, and movement between scenes</li>
  <li>Join the clips in a simple editor like CapCut (free) or directly in Flow</li>
</ol>

<p><strong>Use case:</strong> You want to create a 90-second commercial for your online course:</p>
<ul>
  <li><strong>Scene 1 (0-60 sec):</strong> Introduction to the problem your course solves</li>
  <li><strong>Scene 2 (60-90 sec):</strong> Continuation showing the solution and CTA</li>
</ul>

<p>Generate each scene separately and join them. The final result looks like a professional continuous video.</p>

<h2>Upscale to 1080p and 4K: Premium Quality</h2>
<p>All Veo videos are initially generated in standard resolution for speed. But you can <strong>upscale</strong> to higher resolution:</p>

<ul>
  <li><strong>1080p:</strong> Perfect for Reels, Stories, Shorts — looks sharp on phones</li>
  <li><strong>4K (3840x2160):</strong> For premium content, digital TV ads, or projections</li>
</ul>

<p>Upscaling doesn''t just increase pixels — it uses AI to improve details, reduce noise, and make the image sharper. It''s like passing your video through a professional post-production filter.</p>

<p><strong>When to use each resolution:</strong></p>
<ul>
  <li><strong>1080p:</strong> Social media, YouTube, digital ads</li>
  <li><strong>4K:</strong> Website content, professional presentations, large screens</li>
</ul>

<h2>Tips for Viral Content: The Science of Engagement</h2>
<p>Based on analysis of millions of viral videos, these are the elements that work best:</p>

<h3>1. Visual Hooks in the First 3 Seconds</h3>
<ul>
  <li><strong>Quick transformation:</strong> Before/after in 2 seconds</li>
  <li><strong>Unexpected movement:</strong> Something that breaks expectations</li>
  <li><strong>Human face with strong emotion:</strong> Surprise, happiness, curiosity</li>
  <li><strong>Large direct text:</strong> "THIS changed my business"</li>
</ul>

<h3>2. Visual Storytelling</h3>
<p>Even in 15 seconds, you need a micro-story:</p>
<ul>
  <li><strong>Problem (sec 0-3):</strong> Show the pain/need</li>
  <li><strong>Solution (sec 4-12):</strong> Your product/service/tip solving the problem</li>
  <li><strong>Result (sec 13-15):</strong> The final benefit or CTA</li>
</ul>

<h3>3. Effective CTAs (Call-to-Actions)</h3>
<p>Videos with clear CTA generate <strong>47% more conversions</strong>. Examples:</p>
<ul>
  <li>"Save this for later" — increases saves (value signal for algorithm)</li>
  <li>"Comment YOUR favorite TIP" — generates engagement</li>
  <li>"Follow me for part 2" — increases followers</li>
  <li>"Link in bio" — traffic to your site/store</li>
</ul>

<p>Incorporate the CTA visually in the video, not just in the caption.</p>

<h2>Practical Exercise: Create 3 Short Videos for Your Business</h2>
<p><strong>Your 30-minute mission:</strong> Generate 3 types of videos that work for any business.</p>

<h3>Video 1: Product Presentation (10 sec)</h3>
<p><strong>Purpose:</strong> Show your product/service attractively.<br>
<strong>Prompt:</strong> <em>"9:16 vertical 10-second video: [product] in foreground on [surface], camera dolly in approaching smoothly, professional lighting, blurred [brand color] background, text ''MEET [name]'' appearing at sec 2, energetic background music, premium commercial style"</em></p>

<h3>Video 2: Testimonial/Transformation (15 sec)</h3>
<p><strong>Purpose:</strong> Show results or benefits.<br>
<strong>Prompt:</strong> <em>"9:16 vertical 15-second video: before/after sequence showing [transformation your service offers], quick transition at sec 7, natural lighting, authentic documentary style, text overlay ''BEFORE'' and ''AFTER'', inspirational background music"</em></p>

<h3>Video 3: Behind-the-Scenes (12 sec)</h3>
<p><strong>Purpose:</strong> Humanize your brand and generate connection.<br>
<strong>Prompt:</strong> <em>"9:16 vertical 12-second candid video: process of [how you make your product/service], handheld camera following action, natural light, authentic and close vibe, cheerful background music, text ''THIS IS HOW WE DO IT'' in first 3 sec"</em></p>

<p><strong>Final action:</strong> Post all 3 videos in the same week on your social media. Analyze which generates more engagement and create more variations of that type.</p>

<p>In the next lesson, we''ll bring it all together: Whisk + Nano Banana + Veo to create complete cinematic video sequences. Get ready to create commercials worthy of million-dollar creative agencies.</p>',
    1,
    25
  );

  RAISE NOTICE 'Seed parte 2 completado: Modulo 5 completo (4 lecciones), Modulo 6 parcial (2/4 lecciones)';

END $$;

COMMIT;
