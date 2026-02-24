-- ============================================================
-- SEED: Domina la IA - Parte 2 (Modulos 4 y 5)
-- Imagenes con IA + Video con IA
-- NO crea el curso. Inserta modulos y lecciones en el curso existente.
-- Idempotente: elimina modulos 4 y 5 si ya existen antes de insertar
-- ============================================================

BEGIN;

DO $$
DECLARE
  v_course_id UUID;
  v_mod4_id UUID;
  v_mod5_id UUID;
BEGIN

  -- Obtener el curso existente por slug
  SELECT id INTO v_course_id
  FROM public.courses
  WHERE slug = 'domina-la-ia-de-cero-a-experto';

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'No se encontro el curso "domina-la-ia-de-cero-a-experto". Ejecuta seed_domina_ia_parte1.sql primero.';
  END IF;

  -- Limpieza idempotente: eliminar modulos 4 y 5 si ya existen
  DELETE FROM public.modules
  WHERE course_id = v_course_id
    AND title IN ('Imagenes con IA', 'Video con IA');

  -- ============================================================
  -- MODULO 4: IMAGENES CON IA
  -- ============================================================
  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES (gen_random_uuid(), v_course_id, 'Imagenes con IA', 3)
  RETURNING id INTO v_mod4_id;

  -- Leccion 4.1
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod4_id,
    'Nano Banana: Edicion con Lenguaje Natural',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_4_1">
    <p>Video: Nano Banana - Edita imagenes con lenguaje natural como nunca antes</p>
  </div>
</div>

<h2>Editar Imagenes Hablando: El Fin de Photoshop para el 90% de las Personas</h2>
<p>Imaginate esto: tienes una foto y en vez de abrir Photoshop, buscar la herramienta correcta, crear mascaras, ajustar capas... simplemente le dices a la IA: <strong>"Quita el fondo y ponle un atardecer en la playa"</strong>. Eso es Nano Banana. Es como tener un disenador grafico que entiende espanol y trabaja en segundos.</p>

<p><strong>Nano Banana</strong> es una herramienta de edicion de imagenes potenciada por IA que te permite modificar cualquier imagen usando instrucciones en lenguaje natural. No necesitas saber nada de diseno. Si sabes describir lo que quieres, Nano Banana lo ejecuta.</p>

<h2>Edicion con Texto: Los 3 Superpoderes</h2>
<p>Nano Banana destaca en tres areas donde la edicion tradicional requeria horas:</p>

<ul>
  <li><strong>Edicion por instruccion:</strong> Escribe lo que quieres cambiar. "Hazme ver 10 anos mas joven", "Cambia el color de la camisa a rojo", "Agrega lentes de sol". La IA entiende el contexto y aplica el cambio de forma realista.</li>
  <li><strong>Fusion de imagenes:</strong> Combina elementos de diferentes fotos en una sola imagen coherente. Toma un producto, un fondo, y un modelo, y Nano Banana los fusiona como si hubieran sido fotografiados juntos. Perfecto para e-commerce y publicidad.</li>
  <li><strong>Consistencia de personajes:</strong> Este es el santo grial de la IA generativa. Puedes crear un personaje y mantener su apariencia consistente en multiples imagenes. Ideal para crear mascotas de marca, personajes para cuentos infantiles, o avatares consistentes para redes sociales.</li>
</ul>

<img src="PENDIENTE_IMG_nano_banana_edicion_texto.jpg" alt="Ejemplo de edicion con lenguaje natural en Nano Banana: antes y despues de una instruccion de texto" class="lesson-image" />

<h2>Flujo de Trabajo Practico</h2>
<p>Asi es como usarias Nano Banana en un dia tipico de trabajo:</p>

<ol>
  <li><strong>Sube tu imagen:</strong> Puede ser una foto tuya, de un producto, o una imagen generada por otra IA.</li>
  <li><strong>Describe el cambio:</strong> Escribe en espanol (o ingles) lo que quieres. Se especifico: "Agrega un fondo de oficina moderna con luz natural" es mejor que "Cambia el fondo".</li>
  <li><strong>Itera rapidamente:</strong> Si el resultado no es perfecto, refina tu instruccion. "Mas luz", "Menos saturacion", "Hazlo mas realista". Cada iteracion toma segundos.</li>
  <li><strong>Descarga en alta resolucion:</strong> Cuando estes satisfecho, exporta la imagen final.</li>
</ol>

<h2>Consistencia de Personajes: El Game Changer</h2>
<p>Antes de Nano Banana, mantener un personaje consistente con IA era casi imposible. Generabas una imagen con Midjourney y al pedir otra pose del mismo personaje, obteniasalguien completamente diferente. Nano Banana resuelve esto con su sistema de <strong>Character Lock</strong>:</p>

<ul>
  <li><strong>Crea tu personaje:</strong> Genera o sube una imagen del personaje base.</li>
  <li><strong>Registra la identidad:</strong> Nano Banana analiza los rasgos faciales, proporciones, y estilo.</li>
  <li><strong>Genera variaciones consistentes:</strong> Pide al personaje en diferentes poses, escenarios, y expresiones. La IA mantiene la identidad visual intacta.</li>
</ul>

<p>Esto abre posibilidades enormes: comics con IA, libros infantiles ilustrados, presentaciones con personajes recurrentes, y contenido de marca con mascotas consistentes.</p>

<img src="PENDIENTE_IMG_nano_banana_consistencia_personajes.jpg" alt="Mismo personaje generado por IA en 4 escenarios diferentes manteniendo consistencia visual" class="lesson-image" />

<h2>Nano Banana vs Photoshop: Cuando Usar Cada Uno</h2>
<ul>
  <li><strong>Usa Nano Banana cuando:</strong> Necesitas ediciones rapidas, no tienes experiencia en diseno, o quieres iterar multiples versiones en minutos.</li>
  <li><strong>Usa Photoshop cuando:</strong> Necesitas precision al pixel, trabajas con archivos en capas complejos, o tu flujo profesional requiere control total.</li>
  <li><strong>Usa ambos:</strong> Genera la base con Nano Banana y refina detalles en Photoshop. Este workflow hibrido es cada vez mas comun en agencias creativas.</li>
</ul>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Sube una selfie a Nano Banana. Haz 5 ediciones diferentes usando solo texto: cambia el fondo, agrega accesorios, modifica la iluminacion, cambia el estilo artistico, y crea una version profesional para LinkedIn.</li>
    <li><strong>Ejercicio 2:</strong> Toma una foto de un producto (puede ser un objeto de tu escritorio). Usa la fusion de imagenes para colocarlo en 3 escenarios diferentes: una mesa de estudio minimalista, una cafeteria moderna, y un fondo de naturaleza.</li>
    <li><strong>Ejercicio 3:</strong> Crea un personaje original. Genera al menos 4 variaciones del mismo personaje en escenarios diferentes manteniendo la consistencia. Observa que tan bien la IA preserva los rasgos.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres integrar edicion de imagenes con IA en tu negocio? <a href="https://screatorsai.com">Sinsajo Creators</a> automatiza flujos creativos con IA para e-commerce, marketing y branding: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    0,
    45
  );

  -- Leccion 4.2
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod4_id,
    'Nano Banana Pro: Texto Perfecto en Imagenes',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_4_2">
    <p>Video: Nano Banana Pro con Gemini 3 - Texto legible y razonamiento visual en 4K</p>
  </div>
</div>

<h2>El Problema Mas Antiguo de la IA Generativa: El Texto</h2>
<p>Si alguna vez usaste Midjourney, DALL-E, o Stable Diffusion para generar imagenes con texto, sabes el dolor: <strong>el texto sale como jeroglificos alienígenas</strong>. "Happy Birthday" se convertia en "Hpapy Brithady". Era un chiste. Las IAs podian pintar obras de arte hiperrealistas pero no podian escribir "Hola" correctamente.</p>

<p>Todo eso cambio con <strong>Nano Banana Pro</strong>, potenciado por <strong>Gemini 3 Pro Image</strong>. Por primera vez en la historia de la IA generativa, tenemos un modelo que genera texto perfectamente legible dentro de imagenes. Y esto cambia todo para creadores de contenido, disenadores, y marketers.</p>

<h2>Gemini 3 Pro Image: El Motor Detras de la Magia</h2>
<p>Nano Banana Pro usa Gemini 3 Pro Image como motor de generacion. ¿Que lo hace especial?</p>

<ul>
  <li><strong>Razonamiento visual:</strong> No solo "pinta" imagenes. Gemini 3 Pro Image <em>entiende</em> lo que esta generando. Sabe que una letra "A" tiene una forma especifica y que "B" es diferente. Los modelos anteriores trataban el texto como textura visual, no como simbolos con significado.</li>
  <li><strong>Texto legible nativo:</strong> Genera texto perfectamente escrito en cualquier idioma, incluyendo espanol con acentos. Carteles, memes, infografias, portadas de libros: todo con texto impecable.</li>
  <li><strong>Generacion en 4K:</strong> Mientras otros modelos generan imagenes de 1024x1024 que se ven borrosas al ampliar, Nano Banana Pro genera en 4K (4096x4096) con detalles nitidos.</li>
  <li><strong>Edicion inteligente:</strong> No solo genera desde cero. Puedes subir una imagen existente y pedirle que agregue texto, modifique elementos, o combine multiples conceptos.</li>
</ul>

<img src="PENDIENTE_IMG_nano_banana_pro_texto_comparativa.jpg" alt="Comparativa de texto generado por IA: Midjourney vs DALL-E vs Nano Banana Pro mostrando la diferencia en legibilidad" class="lesson-image" />

<h2>Casos de Uso que Antes Eran Imposibles</h2>
<p>Con texto legible en IA, se desbloquean casos de uso que antes requerias un disenador:</p>

<ul>
  <li><strong>Memes profesionales:</strong> Genera memes con texto perfecto. Describe la escena y el texto, y obtienes un meme listo para publicar.</li>
  <li><strong>Infografias:</strong> Crea infografias con datos, titulos, y leyendas legibles. "Genera una infografia sobre las 5 tendencias de IA en 2026 con estilo corporativo azul".</li>
  <li><strong>Portadas de libros:</strong> Genera portadas completas con titulo, subtitulo, y nombre del autor. Itera el diseno con instrucciones de texto.</li>
  <li><strong>Thumbnails para YouTube:</strong> Crea thumbnails llamativos con texto grande y legible. "Foto mia sorprendido con texto '10 TRUCOS DE IA' en rojo grande".</li>
  <li><strong>Posts para redes sociales:</strong> Genera imagenes con frases, citas, o datos estadisticos listos para publicar en Instagram, LinkedIn, o X.</li>
</ul>

<h2>Prompt Engineering para Imagenes con Texto</h2>
<p>Para obtener los mejores resultados con texto en imagenes, sigue estas reglas:</p>

<ol>
  <li><strong>Pon el texto entre comillas:</strong> Siempre usa comillas para el texto que quieres que aparezca. "Genera un poster con el texto ''OFERTA 50% OFF'' en letras rojas".</li>
  <li><strong>Especifica la posicion:</strong> "Texto en la parte superior", "Titulo centrado", "Texto en la esquina inferior derecha".</li>
  <li><strong>Define el estilo tipografico:</strong> "Fuente sans-serif moderna", "Tipografia elegante cursiva", "Letras gruesas tipo poster".</li>
  <li><strong>Limita la cantidad de texto:</strong> Aunque Nano Banana Pro es bueno con texto, entre menos texto pidas, mas perfecto sera. Un titulo corto es mejor que un parrafo entero.</li>
</ol>

<img src="PENDIENTE_IMG_nano_banana_pro_4k_ejemplo.jpg" alt="Imagen generada en 4K por Nano Banana Pro con texto perfectamente legible y detalles nitidos" class="lesson-image" />

<h2>4K: Calidad Profesional</h2>
<p>La generacion en 4K no es solo "mas pixeles". Cambia lo que puedes hacer con las imagenes generadas:</p>

<ul>
  <li><strong>Imprimir:</strong> Por primera vez, imagenes generadas por IA se pueden imprimir en posters, tarjetas de presentacion, y material impreso sin perder calidad.</li>
  <li><strong>Zoom sin pixeles:</strong> Puedes hacer zoom en detalles sin que se vea borroso. Ideal para imagenes de producto en e-commerce.</li>
  <li><strong>Recortar libremente:</strong> Recorta una seccion de la imagen y sigue teniendo suficiente resolucion para usar como imagen independiente.</li>
</ul>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Genera 3 thumbnails de YouTube para un canal ficticio. Cada thumbnail debe tener: una imagen llamativa, texto grande y legible, y un estilo visual consistente. Experimenta con diferentes prompts hasta que el texto sea perfecto.</li>
    <li><strong>Ejercicio 2:</strong> Crea una serie de 5 posts para Instagram con frases motivacionales. Cada post debe tener un fondo diferente pero un estilo tipografico consistente. Usa Nano Banana Pro para mantener la coherencia visual de tu "marca".</li>
    <li><strong>Ejercicio 3:</strong> Genera una portada de libro. Define: titulo (maximo 5 palabras), subtitulo, nombre del autor, y estilo visual. Itera al menos 3 versiones hasta obtener una que se vea profesional en 4K.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Necesitas contenido visual profesional con IA para tu marca? <a href="https://screatorsai.com">Sinsajo Creators</a> crea assets visuales de alta calidad con Nano Banana Pro y Gemini 3: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    1,
    45
  );

  -- Leccion 4.3
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod4_id,
    'DALL-E, Midjourney, Flux: Comparativa',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_4_3">
    <p>Video: Comparativa de generadores de imagenes IA - DALL-E vs Midjourney vs Flux vs Nano Banana Pro</p>
  </div>
</div>

<h2>La Guerra de los Generadores de Imagenes</h2>
<p>En 2026, tenemos mas opciones que nunca para generar imagenes con IA. Pero eso crea un problema nuevo: <strong>¿cual uso?</strong> Es como estar en un restaurante con un menu de 200 paginas: demasiadas opciones paralizan. Esta leccion te va a dar claridad total. Vamos a tomar el mismo prompt y ejecutarlo en cada generador para que veas las diferencias con tus propios ojos.</p>

<p>Los contendientes de esta comparativa:</p>
<ul>
  <li><strong>DALL-E 3</strong> (OpenAI) - Integrado en ChatGPT</li>
  <li><strong>Midjourney v7</strong> - El favorito de artistas y disenadores</li>
  <li><strong>Flux 1.1 Pro</strong> (Black Forest Labs) - El modelo open-source mas potente</li>
  <li><strong>Nano Banana Pro</strong> (Google Gemini 3) - El nuevo rey del texto legible</li>
</ul>

<img src="PENDIENTE_IMG_comparativa_4_generadores_mismo_prompt.jpg" alt="Comparativa visual del mismo prompt ejecutado en DALL-E, Midjourney, Flux y Nano Banana Pro" class="lesson-image" />

<h2>DALL-E 3: El Mas Accesible</h2>
<p>DALL-E 3 viene integrado directamente en ChatGPT, lo que lo hace el generador de imagenes mas facil de usar:</p>

<ul>
  <li><strong>Fortalezas:</strong> Entiende instrucciones complejas en lenguaje natural, es excelente para ilustraciones y conceptos abstractos, integrado en el chat (no necesitas otra herramienta).</li>
  <li><strong>Debilidades:</strong> El fotorealismo no es su fuerte, las imagenes tienen un "look" reconocible, la resolucion maxima es limitada comparada con otros.</li>
  <li><strong>Ideal para:</strong> Ilustraciones, diagramas, conceptos rapidos, imagenes para presentaciones.</li>
  <li><strong>Precio:</strong> Incluido en ChatGPT Plus ($20/mes) o via API ($0.04-0.08 por imagen).</li>
</ul>

<h2>Midjourney v7: El Artista</h2>
<p>Midjourney es el favorito de los artistas digitales, fotografos, y disenadores. Sus imagenes tienen una calidad estetica que ningun otro modelo iguala:</p>

<ul>
  <li><strong>Fortalezas:</strong> Calidad artistica excepcional, fotorealismo impresionante, excelente con texturas y materiales, comunidad creativa enorme.</li>
  <li><strong>Debilidades:</strong> No entiende instrucciones complejas tan bien como DALL-E, requiere aprender la sintaxis de prompts especifica, la interfaz web es menos intuitiva.</li>
  <li><strong>Ideal para:</strong> Arte conceptual, fotografia creativa, diseno de productos, portafolios visuales.</li>
  <li><strong>Precio:</strong> Desde $10/mes (Basic) hasta $120/mes (Mega). No hay plan gratuito.</li>
</ul>

<h2>Flux 1.1 Pro: La Opcion Open-Source</h2>
<p>Flux, desarrollado por Black Forest Labs (los creadores originales de Stable Diffusion), es el modelo open-source mas avanzado del mercado:</p>

<ul>
  <li><strong>Fortalezas:</strong> Open-source (puedes correrlo localmente), excelente balance entre velocidad y calidad, bueno con anatomia humana, personalizable con LoRAs y fine-tuning.</li>
  <li><strong>Debilidades:</strong> Requiere hardware potente para correr localmente, la calidad artistica no alcanza a Midjourney, menos intuitivo para principiantes.</li>
  <li><strong>Ideal para:</strong> Desarrolladores que quieren personalizar, generacion en volumen, workflows automatizados, privacidad total.</li>
  <li><strong>Precio:</strong> Gratis (open-source). Via API en plataformas como Replicate: ~$0.003-0.01 por imagen.</li>
</ul>

<h2>Nano Banana Pro: El Rey del Texto</h2>
<p>Como vimos en la leccion anterior, Nano Banana Pro (potenciado por Gemini 3) revoluciono la generacion con texto legible:</p>

<ul>
  <li><strong>Fortalezas:</strong> Texto legible perfecto, generacion en 4K, edicion con lenguaje natural, consistencia de personajes, razonamiento visual.</li>
  <li><strong>Debilidades:</strong> El estilo artistico es menos "dramatico" que Midjourney, la velocidad de generacion puede ser mas lenta en 4K.</li>
  <li><strong>Ideal para:</strong> Marketing visual, posts con texto, thumbnails, infografias, branding, material impreso.</li>
  <li><strong>Precio:</strong> Incluido en Google AI Studio (gratuito con limites) o via API de Gemini.</li>
</ul>

<h2>Tabla Comparativa: El Veredicto</h2>
<p>Aqui tienes la comparativa directa para que elijas segun tu necesidad:</p>

<table>
  <thead>
    <tr>
      <th>Criterio</th>
      <th>DALL-E 3</th>
      <th>Midjourney v7</th>
      <th>Flux 1.1 Pro</th>
      <th>Nano Banana Pro</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Fotorealismo</td>
      <td>7/10</td>
      <td>10/10</td>
      <td>8/10</td>
      <td>8/10</td>
    </tr>
    <tr>
      <td>Texto legible</td>
      <td>6/10</td>
      <td>4/10</td>
      <td>5/10</td>
      <td>10/10</td>
    </tr>
    <tr>
      <td>Facilidad de uso</td>
      <td>10/10</td>
      <td>6/10</td>
      <td>5/10</td>
      <td>9/10</td>
    </tr>
    <tr>
      <td>Calidad artistica</td>
      <td>7/10</td>
      <td>10/10</td>
      <td>7/10</td>
      <td>7/10</td>
    </tr>
    <tr>
      <td>Velocidad</td>
      <td>9/10</td>
      <td>7/10</td>
      <td>8/10</td>
      <td>7/10</td>
    </tr>
    <tr>
      <td>Resolucion maxima</td>
      <td>1024x1792</td>
      <td>2048x2048</td>
      <td>2048x2048</td>
      <td>4096x4096</td>
    </tr>
    <tr>
      <td>Costo mensual</td>
      <td>$20 (ChatGPT+)</td>
      <td>Desde $10</td>
      <td>Gratis (local)</td>
      <td>Gratis (limites)</td>
    </tr>
    <tr>
      <td>Edicion de imagenes</td>
      <td>Basica</td>
      <td>Limitada</td>
      <td>Via inpainting</td>
      <td>Avanzada</td>
    </tr>
  </tbody>
</table>

<img src="PENDIENTE_IMG_tabla_comparativa_generadores_ia.jpg" alt="Tabla comparativa visual de los 4 generadores de imagenes IA con puntuaciones y ejemplos" class="lesson-image" />

<h2>¿Cual Elegir? La Regla Simple</h2>
<p>No necesitas elegir solo uno. La mayoria de profesionales usan 2 o 3 segun el caso:</p>

<ul>
  <li><strong>Para trabajo rapido del dia a dia:</strong> DALL-E 3 (ya esta en ChatGPT).</li>
  <li><strong>Para arte y fotografia de alta gama:</strong> Midjourney v7.</li>
  <li><strong>Para volumen y automatizacion:</strong> Flux (especialmente si eres desarrollador).</li>
  <li><strong>Para marketing con texto:</strong> Nano Banana Pro (insuperable en texto legible).</li>
</ul>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Elige un prompt y ejecutalo en al menos 2 generadores diferentes. Prompt sugerido: "Un astronauta tomando cafe en una cafeteria de Marte, estilo cinematografico, luz dorada". Compara los resultados y anota que generador prefieres y por que.</li>
    <li><strong>Ejercicio 2:</strong> Genera una imagen con texto en cada generador disponible. Prompt: "Un cartel vintage que dice ''FESTIVAL DE MUSICA 2026'' con tipografia retro". Compara la legibilidad del texto en cada resultado.</li>
    <li><strong>Ejercicio 3:</strong> Crea un documento con tu "decision matrix" personal. Para cada tipo de proyecto que haces regularmente (posts, presentaciones, arte, thumbnails), escribe que generador usarias y por que.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿No sabes que generador de imagenes usar para tu proyecto? <a href="https://screatorsai.com">Sinsajo Creators</a> te asesora y crea contenido visual con la mejor herramienta para cada caso: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    2,
    40
  );

  -- Leccion 4.4
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod4_id,
    'Taller: Branding Visual Completo con IA',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_4_4">
    <p>Video: Workshop - Crea la identidad visual completa de tu marca usando solo herramientas de IA</p>
  </div>
</div>

<h2>De Cero a Marca Completa en 55 Minutos</h2>
<p>Este es un taller practico. No es teoria: vamos a construir juntos la identidad visual completa de una marca ficticia usando exclusivamente herramientas de IA. Al final de esta leccion vas a tener: logo, paleta de colores, posts para redes, y un banner profesional. Todo sin abrir Photoshop ni contratar un disenador.</p>

<p>Piensa en lo que esto significa: lo que antes costaba entre <strong>$500 y $5,000 dolares</strong> en una agencia de diseno, ahora lo puedes hacer tu mismo en menos de una hora. No estamos diciendo que los disenadores sobren (un buen disenador sigue siendo invaluable para proyectos complejos), pero para emprendedores, freelancers, y startups que necesitan algo profesional YA, la IA es un superpoder.</p>

<h2>Paso 1: Definir la Marca (10 minutos)</h2>
<p>Antes de generar cualquier imagen, necesitas claridad sobre tu marca. Usa ChatGPT o Gemini para esto:</p>

<p>Prompt sugerido: <em>"Actua como un estratega de marca. Estoy creando una marca de [tu nicho]. Defineme: nombre de marca (3 opciones), propuesta de valor en una frase, personalidad de marca (3 adjetivos), y publico objetivo. El tono debe ser [profesional/juvenil/sofisticado]."</em></p>

<p>Para este taller usaremos una marca ficticia: <strong>"NovaMente"</strong> - Una academia de productividad con IA para profesionales latinoamericanos. Personalidad: innovadora, accesible, confiable.</p>

<img src="PENDIENTE_IMG_taller_branding_definicion_marca.jpg" alt="Documento de estrategia de marca generado con IA mostrando nombre, propuesta de valor y personalidad" class="lesson-image" />

<h2>Paso 2: Generar el Logo (15 minutos)</h2>
<p>El logo es la cara de tu marca. Vamos a generarlo con Nano Banana Pro por su capacidad de texto legible:</p>

<ol>
  <li><strong>Genera variaciones:</strong> Pide 4 conceptos diferentes. "Logo minimalista para NovaMente, academia de productividad con IA. Estilo: moderno, limpio, colores azul y violeta. Texto ''NovaMente'' debajo del icono. Fondo transparente."</li>
  <li><strong>Itera el ganador:</strong> Elige tu favorito y refinalo. "Hazlo mas minimalista", "Cambia la fuente a algo mas tech", "Agrega un icono de cerebro sutil".</li>
  <li><strong>Genera versiones:</strong> Logo completo (icono + texto), icono solo (para favicon y apps), version monocromatica (para documentos).</li>
</ol>

<p><strong>Tip profesional:</strong> Genera el logo en fondo blanco primero. Luego usa Nano Banana para "quitarle el fondo" y obtener version con transparencia.</p>

<h2>Paso 3: Paleta de Colores (5 minutos)</h2>
<p>Una paleta de colores profesional tiene 5 colores:</p>

<ul>
  <li><strong>Primario:</strong> El color principal de tu marca (el mas reconocible).</li>
  <li><strong>Secundario:</strong> Complementa al primario.</li>
  <li><strong>Acento:</strong> Para botones, links, y elementos interactivos.</li>
  <li><strong>Neutro claro:</strong> Para fondos y espacios en blanco.</li>
  <li><strong>Neutro oscuro:</strong> Para texto y elementos de contraste.</li>
</ul>

<p>Prompt para Gemini: <em>"Genera una paleta de 5 colores profesional para una marca de educacion tech. Estilo moderno y confiable. Dame los codigos HEX y explica por que elegiste cada color."</em></p>

<p>Luego, genera una imagen de la paleta con Nano Banana Pro: <em>"Paleta de colores profesional mostrando 5 circulos de color con sus codigos HEX debajo: #2563EB, #7C3AED, #06B6D4, #F8FAFC, #1E293B. Estilo mockup limpio."</em></p>

<img src="PENDIENTE_IMG_taller_branding_paleta_colores.jpg" alt="Paleta de 5 colores generada con IA mostrando codigos HEX y nombres descriptivos" class="lesson-image" />

<h2>Paso 4: Posts para Redes Sociales (15 minutos)</h2>
<p>Genera una serie de 4 posts cohesivos para Instagram o LinkedIn:</p>

<ol>
  <li><strong>Post de bienvenida:</strong> "Imagen profesional con el logo de NovaMente y texto ''Bienvenido al futuro de la productividad'' en tipografia moderna. Fondo gradiente azul a violeta."</li>
  <li><strong>Post educativo:</strong> "Infografia con el titulo ''5 Herramientas de IA que Todo Profesional Necesita'' en formato lista numerada. Estilo limpio con iconos."</li>
  <li><strong>Post testimonial:</strong> "Foto profesional con cita ''Triplique mi productividad en 2 semanas'' con nombre y titulo. Diseno elegante con la paleta de NovaMente."</li>
  <li><strong>Post CTA:</strong> "Imagen llamativa con texto ''Inscribete GRATIS Hoy'' y un boton visual. Colores de la marca con urgencia sutil."</li>
</ol>

<p>La clave es la <strong>consistencia visual</strong>. Todos los posts deben usar la misma paleta, estilo tipografico, y lenguaje visual. Esto es lo que hace que una cuenta se vea profesional.</p>

<h2>Paso 5: Banner Profesional (10 minutos)</h2>
<p>Genera un banner para LinkedIn, YouTube, o tu sitio web:</p>

<p><em>"Banner profesional panoramico para LinkedIn. Marca NovaMente. Fondo gradiente azul oscuro a violeta. Logo en la izquierda. Texto ''Productividad con IA para Profesionales'' centrado. Elementos sutiles de tecnologia y cerebro artificial. Estilo moderno y corporativo. Aspecto ratio 4:1."</em></p>

<p>Genera al menos 3 versiones y elige la mejor. Luego pidele ajustes finos: "Mas espacio alrededor del texto", "Logo un poco mas grande", "Agrega un brillo sutil al fondo".</p>

<img src="PENDIENTE_IMG_taller_branding_banner_final.jpg" alt="Banner profesional de LinkedIn generado con IA para la marca ficticia NovaMente" class="lesson-image" />

<h2>Resultado Final: Tu Kit de Marca</h2>
<p>Al terminar este taller deberias tener:</p>
<ul>
  <li>1 logo con 3 versiones (completo, icono, monocromo)</li>
  <li>1 paleta de 5 colores con codigos HEX</li>
  <li>4 posts para redes sociales con diseno cohesivo</li>
  <li>1 banner profesional panoramico</li>
</ul>

<p>Todo generado con IA en menos de una hora. Imagina lo que puedes hacer con un fin de semana entero.</p>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Completa el taller con tu propia marca (real o ficticia). Sigue los 5 pasos y genera todos los assets. Guarda todo en una carpeta organizada: /logo, /paleta, /posts, /banner.</li>
    <li><strong>Ejercicio 2:</strong> Crea un "Brand Board" (tablero de marca) generando una sola imagen que incluya: el logo, la paleta de colores, una foto de ejemplo, y la tipografia. Este documento es lo que entregarias a un equipo o cliente para mostrar la identidad visual.</li>
    <li><strong>Ejercicio 3:</strong> Haz el ejercicio completo para una marca DIFERENTE a la del taller. Elige un nicho opuesto (por ejemplo, si hiciste tech, ahora haz una marca de comida artesanal). Esto te forzara a adaptar los prompts a diferentes esteticas y estilos visuales.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres un branding profesional completo con IA? <a href="https://screatorsai.com">Sinsajo Creators</a> crea identidades visuales completas con IA en tiempo record para startups y emprendedores: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    3,
    55
  );

  -- ============================================================
  -- MODULO 5: VIDEO CON IA
  -- ============================================================
  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES (gen_random_uuid(), v_course_id, 'Video con IA', 4)
  RETURNING id INTO v_mod5_id;

  -- Leccion 5.1
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod5_id,
    'Veo 3: Videos con Audio Nativo',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_5_1">
    <p>Video: Veo 3 de Google DeepMind - La primera IA que genera video con audio sincronizado</p>
  </div>
</div>

<h2>Video con IA: El Antes y el Despues de Veo 3</h2>
<p>Hasta hace poco, generar video con IA era como ver una pelicula muda en camara lenta. Modelos como Runway Gen-2 o Pika generaban clips de 4 segundos, sin sonido, con movimientos roboticos, y con personajes que se deformaban como si estuvieran hechos de plastilina. Era impresionante como demo tecnologico, pero inutilizable para trabajo profesional.</p>

<p><strong>Veo 3</strong>, de Google DeepMind, cambio las reglas del juego. Por primera vez tenemos un modelo de generacion de video que incluye <strong>audio nativo sincronizado</strong>: dialogos, musica ambiental, efectos de sonido, todo generado junto con el video. No es video + audio pegado despues. Es video CON audio, creado al mismo tiempo, perfectamente sincronizado.</p>

<h2>Audio Nativo: Lo que Hace a Veo 3 Revolucionario</h2>
<p>Piensa en la diferencia entre leer un guion y ver una pelicula. El audio transforma la experiencia por completo:</p>

<ul>
  <li><strong>Dialogo sincronizado:</strong> Los personajes mueven los labios en sincronia con lo que "dicen". Puedes generar escenas con personajes hablando y el lip-sync es natural. Esto antes requeria software de animacion profesional y horas de trabajo.</li>
  <li><strong>Musica ambiental:</strong> Veo 3 genera musica de fondo apropiada para la escena. Una escena romantica tiene violines suaves. Una escena de accion tiene percusion intensa. La IA entiende el contexto emocional.</li>
  <li><strong>Efectos de sonido:</strong> Pasos, puertas, viento, agua, explosion: los efectos se sincronizan con la accion visual. Un vaso cayendo suena exactamente cuando impacta el suelo.</li>
  <li><strong>Voz en off:</strong> Puedes generar narraciones con voces naturales que acompanan el video. Ideal para videos educativos, comerciales, y documentales.</li>
</ul>

<img src="PENDIENTE_IMG_veo3_audio_nativo_diagrama.jpg" alt="Diagrama mostrando como Veo 3 genera video y audio simultaneamente de forma sincronizada" class="lesson-image" />

<h2>¿Como Funciona Veo 3?</h2>
<p>Veo 3 usa una arquitectura de difusion que procesa video y audio como una sola entidad:</p>

<ol>
  <li><strong>Prompt de texto:</strong> Describes la escena, los personajes, la accion, y el audio. "Dos amigos en una cafeteria riendose. Musica jazz suave de fondo. Sonido de tazas y conversaciones lejanas."</li>
  <li><strong>Generacion conjunta:</strong> El modelo genera frames de video Y la pista de audio simultaneamente. No son dos modelos separados: es uno solo que entiende la relacion entre lo visual y lo auditivo.</li>
  <li><strong>Sincronizacion automatica:</strong> El lip-sync, los efectos de sonido, y la musica se alinean automaticamente con la accion visual.</li>
  <li><strong>Resultado final:</strong> Un video de hasta 8 segundos con audio completo, listo para usar o extender.</li>
</ol>

<h2>Casos de Uso Profesionales</h2>
<p>Veo 3 abre posibilidades que antes eran exclusivas de producciones con presupuesto:</p>

<ul>
  <li><strong>Comerciales de producto:</strong> Genera un spot publicitario de 8 segundos con narrador, musica, y el producto en accion. Ideal para testear conceptos creativos antes de filmar el comercial real.</li>
  <li><strong>Contenido educativo:</strong> Crea escenas explicativas con personajes animados que hablan y explican conceptos. Perfecto para cursos online y tutoriales.</li>
  <li><strong>Prototipos de cine:</strong> Directores y guionistas pueden visualizar escenas completas con dialogo antes de filmarlas. Un "previsualizacion" con IA que ahorra miles de dolares en produccion.</li>
  <li><strong>Redes sociales:</strong> Genera reels y TikToks con escenas imposibles de filmar. "Un gato astronauta aterrizando en Marte y diciendo: Mision cumplida".</li>
  <li><strong>Podcasts visuales:</strong> Convierte tu audio de podcast en video con escenas generadas por IA que ilustran lo que estas narrando.</li>
</ul>

<img src="PENDIENTE_IMG_veo3_ejemplo_comercial.jpg" alt="Fotograma de un video comercial generado con Veo 3 mostrando un producto con iluminacion cinematografica" class="lesson-image" />

<h2>Limitaciones Actuales (Honestidad Total)</h2>
<p>Veo 3 es impresionante, pero no es perfecto. Es importante que sepas donde estan los limites:</p>

<ul>
  <li><strong>Duracion:</strong> Clips de hasta 8 segundos. Para videos largos necesitas concatenar clips (y mantener coherencia es dificil).</li>
  <li><strong>Consistencia de personajes:</strong> Aun puede haber variaciones sutiles en la apariencia de personajes entre clips diferentes.</li>
  <li><strong>Texto en video:</strong> Generar texto legible en movimiento dentro del video sigue siendo un reto.</li>
  <li><strong>Movimientos complejos:</strong> Acciones muy especificas o coreografias detalladas pueden no salir como esperas.</li>
</ul>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Escribe 3 prompts de video para Veo 3 que incluyan especificaciones de audio. Para cada prompt, describe: la escena visual, los personajes, la accion, los dialogos, la musica de fondo, y los efectos de sonido. No necesitas ejecutarlos aun, pero el ejercicio de escribir prompts detallados es esencial.</li>
    <li><strong>Ejercicio 2:</strong> Si tienes acceso a Veo 3 (via Google AI Studio o la API), genera un video de una escena simple: "Una persona caminando por un parque al atardecer. Sonido de pajaros y brisa suave. Musica acustica tranquila." Evalua la calidad del audio y la sincronizacion.</li>
    <li><strong>Ejercicio 3:</strong> Piensa en 3 casos de uso de tu trabajo o negocio donde Veo 3 podria ahorrarte tiempo o dinero. Escribe un brief creativo para cada uno con el prompt que usarias.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres producir videos profesionales con IA para tu negocio? <a href="https://screatorsai.com">Sinsajo Creators</a> produce contenido de video con Veo 3 y las mejores herramientas de IA: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    0,
    45
  );

  -- Leccion 5.2
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod5_id,
    'Veo 3.1: Ingredientes, Vertical y 4K',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_5_2">
    <p>Video: Veo 3.1 - Ingredients to Video, formato vertical 9:16, upscale 4K y Google Vids avatares</p>
  </div>
</div>

<h2>Veo 3.1: La Evolucion que Necesitabamos</h2>
<p>Si Veo 3 fue la revolucion, <strong>Veo 3.1</strong> es la version que lo hace realmente util para el trabajo diario. Google escucho el feedback de los creadores y agrego exactamente lo que faltaba: control sobre los ingredientes del video, formato vertical para redes, y upscale a 4K para produccion profesional.</p>

<p>Es como cuando paso del iPhone 1 al iPhone 3G: el primero fue el que cambio todo, pero el segundo fue el que la gente realmente empezo a usar todos los dias.</p>

<h2>Ingredients to Video: Control Creativo Total</h2>
<p>La funcion mas revolucionaria de Veo 3.1 es <strong>"Ingredients to Video"</strong> (Ingredientes a Video). En vez de solo describir lo que quieres con texto, ahora puedes darle a la IA los "ingredientes" visuales:</p>

<ul>
  <li><strong>Imagenes de referencia:</strong> Sube fotos de un producto, persona, o lugar, y Veo 3.1 los incorpora al video generado. "Usa ESTA foto de mi producto y genera un video donde alguien lo desempaca."</li>
  <li><strong>Estilo visual:</strong> Sube una imagen de referencia de estilo y el video adoptara esa estetica. "Quiero que el video se vea como esta foto de Wes Anderson."</li>
  <li><strong>Personajes consistentes:</strong> Sube una foto de un personaje y aparecera consistente en todo el video. Resuelve uno de los mayores problemas de la generacion de video con IA.</li>
  <li><strong>Audio de referencia:</strong> Proporciona un clip de audio o musica y Veo 3.1 sincroniza el video con ese audio especifico.</li>
</ul>

<img src="PENDIENTE_IMG_veo31_ingredients_flujo.jpg" alt="Flujo de trabajo de Ingredients to Video mostrando imagenes de entrada y video resultante" class="lesson-image" />

<h2>Formato Vertical 9:16: Hecho para Redes</h2>
<p>El 80% del contenido de video se consume en formato vertical (TikTok, Reels, Shorts). Veo 3 solo generaba en horizontal (16:9). Veo 3.1 agrega soporte nativo para <strong>9:16 vertical</strong>:</p>

<ul>
  <li><strong>Optimizado para movil:</strong> Los videos se generan pensando en la pantalla vertical. La composicion, el enfoque, y el texto se posicionan para verse bien en un telefono.</li>
  <li><strong>Formato cuadrado 1:1:</strong> Tambien soporta formato cuadrado para Instagram feed y LinkedIn.</li>
  <li><strong>Aspecto cinematico 2.35:1:</strong> Para esos videos con barras negras que dan un look de pelicula.</li>
</ul>

<h2>Upscale a 4K: Calidad de Produccion</h2>
<p>Veo 3 generaba video en 720p, suficiente para social media pero no para produccion profesional. Veo 3.1 incluye <strong>upscale nativo a 4K</strong>:</p>

<ul>
  <li><strong>Upscale inteligente:</strong> No es simplemente estirar pixeles. La IA reconstruye detalles usando su conocimiento del mundo real. Texturas de piel, telas, agua: todo se ve nitido en 4K.</li>
  <li><strong>Util para:</strong> Presentaciones en pantalla grande, produccion de TV/streaming, material impreso de alta calidad (posters de fotogramas).</li>
  <li><strong>Flujo recomendado:</strong> Genera primero en resolucion estandar para iterar rapido. Cuando tengas la version final, aplica upscale a 4K.</li>
</ul>

<h2>Google Vids: Avatares con IA</h2>
<p><strong>Google Vids</strong> es la herramienta de creacion de video de Google Workspace, y ahora integra avatares generados por IA:</p>

<ul>
  <li><strong>Avatares presentadores:</strong> Crea un avatar que se parece a ti (o a un personaje) y haz que presente tu contenido. Ideal para videos corporativos, tutoriales, y cursos.</li>
  <li><strong>Lip-sync automatico:</strong> Escribe el guion, elige la voz, y el avatar habla con sincronizacion perfecta de labios.</li>
  <li><strong>Personalizacion:</strong> Cambia la ropa, el fondo, y las expresiones del avatar. "Avatar con camisa azul en una oficina moderna presentando un grafico de ventas."</li>
  <li><strong>Integracion con Workspace:</strong> Se conecta directamente con Google Slides, Sheets, y Docs. Convierte una presentacion de Slides en un video con avatar presentador en minutos.</li>
</ul>

<img src="PENDIENTE_IMG_google_vids_avatar.jpg" alt="Avatar generado por Google Vids presentando contenido corporativo con fondo de oficina" class="lesson-image" />

<h2>Flujo de Trabajo Completo con Veo 3.1</h2>
<p>Asi seria un flujo de trabajo real para crear un video promocional:</p>

<ol>
  <li><strong>Prepara ingredientes:</strong> Fotos del producto, logo de la marca, imagen de referencia de estilo visual.</li>
  <li><strong>Genera en borrador:</strong> Crea el video en resolucion estandar con formato vertical (9:16) usando Ingredients to Video.</li>
  <li><strong>Itera y refina:</strong> Ajusta el prompt, cambia ingredientes, prueba diferentes estilos hasta estar satisfecho.</li>
  <li><strong>Upscale a 4K:</strong> Aplica upscale a la version final para maxima calidad.</li>
  <li><strong>Agrega avatar (opcional):</strong> Usa Google Vids para crear una intro con avatar presentando el producto.</li>
  <li><strong>Exporta y publica:</strong> Descarga el video final y publicalo en tus plataformas.</li>
</ol>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Reune los "ingredientes" para un video de tu producto o servicio. Toma al menos 3 fotos: el producto, el logo, y una imagen de referencia del estilo visual que quieres. Escribe el prompt que usarias con Ingredients to Video.</li>
    <li><strong>Ejercicio 2:</strong> Escribe 3 guiones cortos (maximo 30 palabras cada uno) para Reels/TikToks verticales de tu marca. Para cada guion, describe la escena visual, el audio, y el texto que apareceria en pantalla.</li>
    <li><strong>Ejercicio 3:</strong> Explora Google Vids (si tienes Google Workspace). Crea un video corto de presentacion usando un avatar de IA. Convierte una presentacion de Google Slides en un video narrado por el avatar.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres crear videos verticales profesionales con IA para tus redes? <a href="https://screatorsai.com">Sinsajo Creators</a> produce Reels, TikToks y Shorts con Veo 3.1 y avatares de IA: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    1,
    40
  );

  -- Leccion 5.3
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod5_id,
    'Sora 2 vs Veo 3: Cual Elegir',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_5_3">
    <p>Video: Comparativa definitiva Sora 2 vs Veo 3 - Cual generador de video IA elegir en 2026</p>
  </div>
</div>

<h2>La Batalla por el Trono del Video con IA</h2>
<p>En el mundo de la generacion de imagenes tenemos a Midjourney, DALL-E, Flux, y Nano Banana compitiendo. En video, la batalla es principalmente entre dos gigantes: <strong>Sora 2</strong> de OpenAI y <strong>Veo 3</strong> de Google DeepMind. Cada uno tiene fortalezas unicas, y elegir el correcto depende de lo que necesitas crear.</p>

<p>Vamos a hacer lo mismo que hicimos con los generadores de imagenes: comparar ambos usando los mismos prompts y criterios objetivos para que puedas tomar una decision informada.</p>

<h2>Sora 2: La Propuesta de OpenAI</h2>
<p>Sora fue el modelo que puso la generacion de video con IA en el mapa mundial cuando OpenAI publico los primeros demos en febrero de 2024. Sora 2, lanzado en 2025, es la version madura y usable:</p>

<ul>
  <li><strong>Fortalezas principales:</strong></li>
  <ul>
    <li><strong>Fisica realista:</strong> Sora 2 entiende como funcionan los objetos en el mundo real. El agua fluye, las telas se mueven con el viento, los objetos caen con gravedad natural. Es el mejor modelo en simular fisica.</li>
    <li><strong>Duracion extendida:</strong> Genera clips de hasta 20 segundos en una sola pasada (vs 8 segundos de Veo 3).</li>
    <li><strong>Storyboard mode:</strong> Puedes definir keyframes (fotogramas clave) y Sora 2 genera la transicion entre ellos. Esto te da control cinematografico sobre la narrativa del video.</li>
    <li><strong>Edicion de video existente:</strong> Sube un video real y Sora 2 puede extenderlo, modificar elementos, o cambiar el estilo visual.</li>
  </ul>
  <li><strong>Debilidades:</strong></li>
  <ul>
    <li>Sin audio nativo (necesitas agregar audio por separado).</li>
    <li>Mas lento en generacion que Veo 3.</li>
    <li>Precio mas alto por minuto generado.</li>
    <li>El texto en video sigue siendo problematico.</li>
  </ul>
</ul>

<img src="PENDIENTE_IMG_sora2_ejemplo_fisica.jpg" alt="Fotograma de video generado con Sora 2 mostrando fisica realista de agua y objetos" class="lesson-image" />

<h2>Veo 3: La Propuesta de Google</h2>
<p>Ya conocemos a Veo 3 de la leccion anterior, pero resumamos sus ventajas competitivas frente a Sora:</p>

<ul>
  <li><strong>Fortalezas principales:</strong></li>
  <ul>
    <li><strong>Audio nativo sincronizado:</strong> La ventaja mas significativa. Sora no tiene esto. Veo 3 genera video CON audio: dialogos, musica, efectos de sonido.</li>
    <li><strong>Velocidad de generacion:</strong> Generalmente mas rapido que Sora 2, especialmente en resolucion estandar.</li>
    <li><strong>Ingredients to Video (v3.1):</strong> Control creativo con imagenes de referencia que Sora no ofrece.</li>
    <li><strong>Formato vertical nativo (v3.1):</strong> Optimizado para redes sociales.</li>
    <li><strong>Integracion con ecosistema Google:</strong> AI Studio, Workspace, YouTube.</li>
  </ul>
  <li><strong>Debilidades:</strong></li>
  <ul>
    <li>Clips mas cortos (8 segundos vs 20 de Sora).</li>
    <li>La fisica no es tan precisa como Sora 2.</li>
    <li>Menos control sobre keyframes y narrativa.</li>
    <li>Consistencia de personajes en clips consecutivos puede variar.</li>
  </ul>
</ul>

<h2>Comparativa Directa</h2>
<table>
  <thead>
    <tr>
      <th>Criterio</th>
      <th>Sora 2</th>
      <th>Veo 3 / 3.1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Audio nativo</td>
      <td>No</td>
      <td>Si (dialogos, musica, SFX)</td>
    </tr>
    <tr>
      <td>Duracion maxima</td>
      <td>20 segundos</td>
      <td>8 segundos</td>
    </tr>
    <tr>
      <td>Fisica realista</td>
      <td>10/10</td>
      <td>7/10</td>
    </tr>
    <tr>
      <td>Calidad visual</td>
      <td>9/10</td>
      <td>9/10</td>
    </tr>
    <tr>
      <td>Formato vertical</td>
      <td>Si</td>
      <td>Si (nativo en v3.1)</td>
    </tr>
    <tr>
      <td>Upscale 4K</td>
      <td>Si</td>
      <td>Si (v3.1)</td>
    </tr>
    <tr>
      <td>Edicion de video</td>
      <td>Si (avanzada)</td>
      <td>Basica</td>
    </tr>
    <tr>
      <td>Storyboard/Keyframes</td>
      <td>Si</td>
      <td>No</td>
    </tr>
    <tr>
      <td>Ingredients (imagenes ref)</td>
      <td>No</td>
      <td>Si (v3.1)</td>
    </tr>
    <tr>
      <td>Velocidad</td>
      <td>Lento</td>
      <td>Rapido</td>
    </tr>
    <tr>
      <td>Acceso gratuito</td>
      <td>Limitado (ChatGPT+)</td>
      <td>Si (AI Studio)</td>
    </tr>
    <tr>
      <td>Mejor para</td>
      <td>Cine, narrativa, fisica</td>
      <td>Marketing, redes, audio</td>
    </tr>
  </tbody>
</table>

<img src="PENDIENTE_IMG_sora2_vs_veo3_comparativa_visual.jpg" alt="Comparativa visual lado a lado del mismo prompt generado en Sora 2 y Veo 3" class="lesson-image" />

<h2>¿Cual Elegir? Guia Practica</h2>
<p>La respuesta depende de tu caso de uso:</p>

<ul>
  <li><strong>Elige Sora 2 si:</strong> Necesitas clips largos (+10 segundos), requieres fisica realista (agua, telas, objetos), quieres control cinematografico con keyframes, o estas creando contenido narrativo (cortometrajes, trailers).</li>
  <li><strong>Elige Veo 3/3.1 si:</strong> Necesitas audio integrado (dialogos, musica), creas contenido para redes sociales (formato vertical), quieres usar imagenes de referencia (Ingredients), o necesitas generacion rapida y economica.</li>
  <li><strong>Usa ambos:</strong> Para proyectos grandes, usa Sora 2 para las escenas cinematograficas con fisica compleja y Veo 3 para las escenas con dialogo y audio. Combina lo mejor de cada uno en la edicion final.</li>
</ul>

<h2>Otros Contendientes: Runway, Kling, Pika</h2>
<p>Sora 2 y Veo 3 son los lideres, pero hay otros modelos que vale la pena conocer:</p>

<ul>
  <li><strong>Runway Gen-3 Alpha Turbo:</strong> El veterano. Buena calidad, precio competitivo, y excelente herramienta de edicion de video. Ideal si ya estas en el ecosistema Runway.</li>
  <li><strong>Kling AI:</strong> El contendiente chino. Sorprendentemente bueno en movimiento de camara y escenas de accion. Precio agresivo.</li>
  <li><strong>Pika 2.0:</strong> El mas facil de usar. Menos potente que Sora o Veo pero con una interfaz que cualquier persona puede dominar en minutos.</li>
</ul>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Escribe el mismo prompt para Sora 2 y Veo 3. Prompt sugerido: "Un barista preparando un latte art en camara lenta. Vapor subiendo de la taza. Sonido de la maquina de espresso y musica lo-fi de fondo." Si tienes acceso, genera el video en ambos y compara. Si no, escribe que esperas que sea diferente entre los resultados.</li>
    <li><strong>Ejercicio 2:</strong> Crea tu propia "decision matrix" para video con IA. Haz una tabla con tus 3 casos de uso mas frecuentes y determina que modelo usarias para cada uno y por que.</li>
    <li><strong>Ejercicio 3:</strong> Investiga los precios actuales de Sora 2 y Veo 3. Calcula cuanto costaria generar 10 clips de video al mes con cada plataforma. ¿Cual es mas economica para tu volumen de uso?</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿No sabes que herramienta de video con IA usar? <a href="https://screatorsai.com">Sinsajo Creators</a> produce contenido de video con la herramienta perfecta para cada proyecto. Te asesoramos gratis: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    2,
    35
  );

  -- Leccion 5.4
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod5_id,
    'Taller: Video Promocional en 15 Minutos',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_5_4">
    <p>Video: Workshop - Crea un video promocional completo en 15 minutos usando ChatGPT + Veo 3 + Nano Banana + Flow</p>
  </div>
</div>

<h2>El Reto: Un Video Promocional desde Cero en 15 Minutos</h2>
<p>Este es el taller mas ambicioso del curso. Vamos a crear un <strong>video promocional completo</strong> — con guion, escenas, imagenes, audio, y edicion — en solo 15 minutos. ¿Imposible? Hace un ano si. Hoy, con el stack correcto de herramientas de IA, es totalmente factible.</p>

<p>La clave es usar cada herramienta para lo que mejor hace, como una linea de ensamblaje donde cada robot tiene su especialidad:</p>

<ul>
  <li><strong>ChatGPT:</strong> Escribir el guion y la estrategia creativa.</li>
  <li><strong>Veo 3:</strong> Generar los clips de video con audio.</li>
  <li><strong>Nano Banana:</strong> Crear y editar imagenes para thumbnails, intros, y overlays.</li>
  <li><strong>Flow:</strong> Ensamblar todo en un video final con transiciones y musica.</li>
</ul>

<img src="PENDIENTE_IMG_taller_video_flujo_herramientas.jpg" alt="Diagrama del flujo de trabajo mostrando ChatGPT, Veo 3, Nano Banana y Flow como etapas de produccion" class="lesson-image" />

<h2>Minuto 0-3: El Guion (ChatGPT)</h2>
<p>Todo gran video empieza con un gran guion. Usa ChatGPT con este prompt:</p>

<p><em>"Actua como un director creativo de publicidad. Escribe un guion para un video promocional de 60 segundos para [tu producto/servicio]. El video es para [plataforma: Instagram Reels / YouTube / LinkedIn]. El tono es [profesional/dinamico/emocional]. Estructura: Hook (3 seg) + Problema (10 seg) + Solucion (20 seg) + Beneficios (15 seg) + CTA (12 seg). Para cada seccion, describe: la escena visual, el texto en pantalla, la narración de voz en off, y la musica/efectos."</em></p>

<p>ChatGPT te dara un guion detallado con 5 secciones. Revisalo, ajusta lo que no te guste, y tendras tu hoja de ruta creativa en 3 minutos.</p>

<h2>Minuto 3-8: Los Clips de Video (Veo 3)</h2>
<p>Ahora toma cada seccion del guion y conviertela en un prompt para Veo 3:</p>

<ol>
  <li><strong>Hook (3 seg):</strong> "Primer plano dramatico de [tu producto] con iluminacion cinematografica. Efecto de sonido de impacto. Texto ''¿Cansado de [problema]?'' aparece con efecto."</li>
  <li><strong>Problema (10 seg):</strong> "Persona frustrada en una oficina mirando su computadora. Expresion de estres. Luz fria. Musica tensa sutil."</li>
  <li><strong>Solucion (20 seg):</strong> "La misma persona sonriendo usando [tu producto]. Pantalla iluminada, ambiente positivo. Musica que se vuelve optimista. Voz en off: ''Con [producto], todo cambia.''"</li>
  <li><strong>Beneficios (15 seg):</strong> "Montaje rapido mostrando 3 beneficios: velocidad, calidad, precio. Cada uno con un icono y numero. Ritmo dinamico."</li>
  <li><strong>CTA (12 seg):</strong> "Pantalla con el logo grande. Texto ''Prueba GRATIS hoy''. Musica que cierra con impacto. Efecto de sonido de click."</li>
</ol>

<p>Genera cada clip y descargalo. No busques la perfeccion en el primer intento: genera 2-3 versiones de cada escena y elige la mejor.</p>

<h2>Minuto 8-11: Las Imagenes (Nano Banana)</h2>
<p>Mientras Veo 3 genera los clips, usa Nano Banana para crear los assets visuales:</p>

<ul>
  <li><strong>Thumbnail/Portada:</strong> "Imagen llamativa con el producto y texto grande ''[Nombre del Producto]'' en colores de la marca. Estilo publicitario premium."</li>
  <li><strong>Intro animada:</strong> Genera una imagen del logo con efectos visuales que sirva como frame de intro.</li>
  <li><strong>Overlays de texto:</strong> Crea imagenes con texto estilizado para las estadisticas y beneficios que se mostraran como overlay en el video.</li>
  <li><strong>End screen:</strong> "Pantalla final con logo, QR code, y texto ''Visita [URL]'' en diseno profesional con la paleta de la marca."</li>
</ul>

<img src="PENDIENTE_IMG_taller_video_assets_nano_banana.jpg" alt="Assets visuales creados con Nano Banana para el video: thumbnail, intro, overlays y end screen" class="lesson-image" />

<h2>Minuto 11-15: El Ensamblaje (Flow)</h2>
<p><strong>Flow</strong> es una herramienta de edicion de video potenciada por IA que simplifica el proceso de edicion:</p>

<ol>
  <li><strong>Importa los clips:</strong> Sube todos los clips de Veo 3 y las imagenes de Nano Banana.</li>
  <li><strong>Arrastra a la linea de tiempo:</strong> Coloca los clips en orden segun el guion: Hook → Problema → Solucion → Beneficios → CTA.</li>
  <li><strong>Agrega transiciones:</strong> Flow sugiere transiciones automaticamente basadas en el ritmo del video. Usa transiciones sutiles (fade, slide) para un look profesional.</li>
  <li><strong>Musica de fondo:</strong> Si los clips de Veo 3 ya tienen audio, ajusta los niveles. Si necesitas musica adicional, Flow tiene una biblioteca de musica libre de regalias.</li>
  <li><strong>Subtitulos automaticos:</strong> Flow genera subtitulos automaticamente a partir del audio. Edita cualquier error y ajusta el estilo (fuente, tamano, posicion).</li>
  <li><strong>Exporta:</strong> Elige el formato (vertical 9:16 para Reels, horizontal 16:9 para YouTube) y exporta en la resolucion que necesites.</li>
</ol>

<h2>Consejos Pro para Videos que Convierten</h2>
<p>Un buen video promocional no es solo bonito: convierte espectadores en clientes. Estos son los principios clave:</p>

<ul>
  <li><strong>Los primeros 3 segundos lo son TODO:</strong> Si no enganchas en los primeros 3 segundos, el espectador hace scroll. Tu hook debe ser visual, sorprendente, o hacer una pregunta que el espectador necesite responder.</li>
  <li><strong>Una idea por escena:</strong> No sobrecargues cada clip con demasiada informacion. Una escena = un concepto. Deja que el espectador procese antes de pasar al siguiente.</li>
  <li><strong>Texto grande y legible:</strong> El 85% de los videos en redes se ven sin sonido. El texto en pantalla debe contar la historia por si solo.</li>
  <li><strong>CTA clara y unica:</strong> No pidas 5 cosas. Pide UNA: "Visita el link", "Descarga gratis", "Comenta tu opinion". Una accion, clara y directa.</li>
  <li><strong>Consistencia de marca:</strong> Usa los mismos colores, fuentes, y estilo en todo el video. La consistencia genera confianza.</li>
</ul>

<img src="PENDIENTE_IMG_taller_video_resultado_final.jpg" alt="Captura del video promocional terminado mostrando la linea de tiempo en Flow con todos los clips ensamblados" class="lesson-image" />

<h2>El Resultado: Tu Video Profesional</h2>
<p>Al final de estos 15 minutos tienes:</p>
<ul>
  <li>Un guion estrategico escrito por ChatGPT</li>
  <li>5 clips de video generados por Veo 3 con audio</li>
  <li>4 assets visuales creados por Nano Banana</li>
  <li>Un video final ensamblado y exportado por Flow</li>
</ul>

<p>Esto es lo que hace unos pocos anos costaba <strong>$2,000-$10,000 dolares</strong> en una productora de video. Hoy lo puedes hacer tu solo, con herramientas de IA, en un cuarto de hora. El mundo cambio. Y tu ahora tienes las herramientas para aprovecharlo.</p>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Completa el taller de principio a fin. Cronometra tu tiempo para verificar que puedes hacerlo en 15 minutos (o cerca). No busques la perfeccion: el objetivo es velocidad y flujo de trabajo. Puedes refinar despues.</li>
    <li><strong>Ejercicio 2:</strong> Crea 3 versiones del mismo video promocional cambiando el tono: version profesional (para LinkedIn), version dinamica (para TikTok/Reels), y version emocional (para YouTube). Observa como el mismo producto puede comunicarse de formas completamente diferentes.</li>
    <li><strong>Ejercicio 3:</strong> Haz el taller para un negocio real (puede ser el tuyo o el de un amigo/familiar). Publica el video resultante en una red social y mide la reaccion: vistas, likes, comentarios, y clicks. Este feedback del mundo real es invaluable.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres videos promocionales profesionales hechos con IA para tu negocio? <a href="https://screatorsai.com">Sinsajo Creators</a> produce videos de alta conversion combinando las mejores herramientas de IA del mercado: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    3,
    55
  );

  RAISE NOTICE 'Seed completado: Modulos 4 y 5 con 8 lecciones insertados en "Domina la IA" exitosamente.';

END $$;

COMMIT;
