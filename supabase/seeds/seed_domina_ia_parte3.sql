-- ============================================================
-- SEED: Domina la IA - Parte 3 (Modulos 6 y 7)
-- Claude + Agentes IA
-- NO crea el curso. Inserta modulos y lecciones en el curso existente.
-- Idempotente: elimina modulos 6 y 7 si ya existen antes de insertar
-- ============================================================

BEGIN;

DO $$
DECLARE
  v_course_id UUID;
  v_mod6_id UUID;
  v_mod7_id UUID;
BEGIN

  -- Obtener el curso existente por slug
  SELECT id INTO v_course_id
  FROM public.courses
  WHERE slug = 'domina-la-ia-de-cero-a-experto';

  IF v_course_id IS NULL THEN
    RAISE EXCEPTION 'No se encontro el curso "domina-la-ia-de-cero-a-experto". Ejecuta seed_domina_ia_parte1.sql primero.';
  END IF;

  -- Limpieza idempotente: eliminar modulos 6 y 7 si ya existen
  DELETE FROM public.modules
  WHERE course_id = v_course_id
    AND title IN ('Claude', 'Agentes IA');

  -- ============================================================
  -- MODULO 6: CLAUDE
  -- ============================================================
  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES (gen_random_uuid(), v_course_id, 'Claude', 5)
  RETURNING id INTO v_mod6_id;

  -- Leccion 6.1
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod6_id,
    'Claude Opus 4.6 y MCP',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_6_1">
    <p>Video: Claude Opus 4.6 - El modelo mas inteligente del mundo y el protocolo MCP que lo conecta a todo</p>
  </div>
</div>

<h2>Anthropic: La Empresa que Apuesta Todo por la Seguridad</h2>
<p>Mientras OpenAI busca ser la Apple de la IA y Google la integra en todo su ecosistema, <strong>Anthropic</strong> tomo un camino diferente: construir la IA mas segura y mas inteligente del planeta. Fundada en 2021 por Dario y Daniela Amodei (ex-OpenAI), Anthropic ha pasado de ser "la startup de IA que nadie conocia" a competir cabeza a cabeza con GPT-4 y Gemini. Su arma secreta: <strong>Claude</strong>.</p>

<p>Claude no es solo un chatbot. Es una familia de modelos con personalidades distintas, diseñados para diferentes casos de uso. Y con la llegada de <strong>Claude Opus 4.6</strong>, Anthropic tiene el modelo mas capaz del mercado en razonamiento, programacion, y tareas complejas.</p>

<h2>Claude Opus 4.6: El Modelo Mas Inteligente</h2>
<p>Claude Opus 4.6 es el modelo insignia de Anthropic. No es el mas rapido ni el mas barato, pero es el mas inteligente. Piensa en el como el consultor senior que cobra caro pero resuelve problemas que nadie mas puede:</p>

<ul>
  <li><strong>Razonamiento profundo:</strong> Opus 4.6 puede mantener cadenas de pensamiento extremadamente largas y complejas. Analiza contratos legales de 100 paginas, resuelve problemas matematicos avanzados, y escribe codigo de produccion con una precision que deja a GPT-4 atras en benchmarks.</li>
  <li><strong>Ventana de contexto masiva:</strong> Procesa hasta 200,000 tokens de contexto. Eso equivale a un libro completo de 500 paginas. Puedes darle todo tu codebase, toda tu documentacion, o todo un dataset y Claude lo analiza sin perder detalle.</li>
  <li><strong>Multimodal:</strong> Entiende texto, imagenes, PDFs, y codigo. Puedes subir una captura de pantalla de un error y Claude te dice exactamente que esta mal y como arreglarlo.</li>
  <li><strong>Estilo de comunicacion:</strong> Claude es notablemente mas natural y menos "robotico" que otros modelos. No usa jerga innecesaria, no exagera, y reconoce cuando no sabe algo. Es honesto por diseño.</li>
</ul>

<img src="PENDIENTE_IMG_claude_opus_familia_modelos.jpg" alt="Familia de modelos Claude: Haiku para velocidad, Sonnet para balance, Opus para inteligencia maxima" class="lesson-image" />

<h2>La Familia Claude: Haiku, Sonnet, Opus</h2>
<p>Anthropic no tiene un solo modelo sino una familia diseñada para diferentes necesidades:</p>

<ul>
  <li><strong>Claude Haiku 4.5:</strong> El mas rapido y barato. Perfecto para tareas simples, clasificacion, y respuestas instantaneas. Es como un asistente junior: rapido, eficiente, y economico.</li>
  <li><strong>Claude Sonnet 4.5:</strong> El balance perfecto entre velocidad e inteligencia. El caballo de batalla para el 80% de las tareas. Programacion, escritura, analisis: Sonnet lo hace todo bien.</li>
  <li><strong>Claude Opus 4.6:</strong> El genio. Para tareas que requieren razonamiento profundo, analisis complejo, o creatividad excepcional. Mas lento y caro, pero incomparable en calidad.</li>
</ul>

<h2>Projects y Artifacts: Tu Espacio de Trabajo Inteligente</h2>
<p>Claude no es solo un chat. Anthropic ha construido herramientas de productividad que lo convierten en un verdadero asistente de trabajo:</p>

<ul>
  <li><strong>Projects:</strong> Crea "proyectos" dentro de Claude donde puedes subir documentos, establecer instrucciones persistentes, y mantener contexto entre conversaciones. Es como darle a Claude un escritorio dedicado a tu proyecto. Sube tu manual de marca, tus guias de estilo, y las especificaciones del producto, y Claude los tiene siempre presentes.</li>
  <li><strong>Artifacts:</strong> Cuando Claude genera codigo, documentos, o contenido estructurado, lo muestra como un "artifact" que puedes editar, copiar, o iterar al lado de la conversacion. Es como tener un editor de texto integrado en el chat. Perfecto para crear reportes, escribir codigo, o diseñar documentos complejos.</li>
</ul>

<h2>MCP: El Protocolo que Conecta a Claude con Todo</h2>
<p>Aqui es donde Anthropic hizo algo brillante. <strong>MCP (Model Context Protocol)</strong> es un protocolo abierto que permite conectar a Claude (y a cualquier modelo de IA) con herramientas externas, bases de datos, APIs, y servicios. Piensa en MCP como el USB de la IA: un estandar universal para que la IA se conecte con el mundo real.</p>

<ul>
  <li><strong>100 millones+ de descargas por mes:</strong> MCP se ha convertido en el estandar de facto para conectar modelos de IA con herramientas. No solo Anthropic lo usa: Microsoft, Google, y cientos de startups han adoptado el protocolo.</li>
  <li><strong>Servidores MCP:</strong> Cualquier servicio puede crear un "servidor MCP" que expone sus capacidades a la IA. Hay servidores para GitHub, Slack, bases de datos, navegadores, sistemas de archivos, y miles mas.</li>
  <li><strong>Ejemplo practico:</strong> Conectas Claude a tu base de datos via MCP. Ahora puedes preguntarle "¿Cuantos usuarios se registraron esta semana?" y Claude consulta tu base de datos en tiempo real y te da la respuesta. Sin que tu escribas una sola linea de SQL.</li>
  <li><strong>El efecto plataforma:</strong> MCP convirtio a Claude de un chatbot aislado a un agente que puede interactuar con cualquier sistema. Es la diferencia entre un empleado que solo habla y uno que tiene acceso a todas las herramientas de la empresa.</li>
</ul>

<img src="PENDIENTE_IMG_mcp_protocolo_diagrama.jpg" alt="Diagrama del protocolo MCP mostrando como Claude se conecta a bases de datos, APIs, y herramientas via servidores MCP" class="lesson-image" />

<h2>Claude vs ChatGPT: Las Diferencias Clave</h2>
<p>No es que uno sea "mejor" que otro. Son diferentes en filosofia:</p>

<ul>
  <li><strong>ChatGPT (OpenAI):</strong> Optimizado para ser util y versatil. Tiene ecosistema de plugins, GPTs personalizados, y la marca mas reconocida. Es el iPhone de la IA: funciona bien para todo.</li>
  <li><strong>Claude (Anthropic):</strong> Optimizado para ser preciso y seguro. Mejor en razonamiento, programacion, y tareas que requieren honestidad. Es el modelo al que le puedes confiar tus datos sensibles y tu codigo de produccion.</li>
</ul>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Crea una cuenta en claude.ai (plan gratuito disponible). Inicia una conversacion y prueba darle una tarea compleja: "Analiza los pros y contras de migrar mi negocio de WordPress a un sitio hecho con IA. Considera costos, tiempo, y riesgos." Compara la profundidad de su respuesta con la de ChatGPT.</li>
    <li><strong>Ejercicio 2:</strong> Crea un Project en Claude. Sube un documento de tu trabajo (puede ser un manual, una propuesta, o un reporte). Dale instrucciones como: "Eres mi asistente para el proyecto X. Siempre responde con base en los documentos que te comparti." Haz 5 preguntas relacionadas y evalua si mantiene el contexto.</li>
    <li><strong>Ejercicio 3:</strong> Investiga 3 servidores MCP populares en el repositorio oficial de MCP. Escribe un parrafo describiendo que hace cada uno y como podria ser util para tu trabajo o negocio.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres implementar Claude y MCP en tu empresa? <a href="https://screatorsai.com">Sinsajo Creators</a> integra Claude con tus sistemas via MCP para automatizar procesos empresariales: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    0,
    40
  );

  -- Leccion 6.2
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod6_id,
    'Claude Code: Programacion con Agentes',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_6_2">
    <p>Video: Claude Code - El agente de programacion que genera $1B en revenue y que hasta Microsoft usa</p>
  </div>
</div>

<h2>El Fin del "Copiar y Pegar Codigo de ChatGPT"</h2>
<p>Todos hemos estado ahi: le pides a ChatGPT que te escriba una funcion, copias el codigo, lo pegas en tu editor, y... no funciona. Le falta contexto. No conoce tu proyecto. No sabe que dependencias usas. Terminas en un loop de copiar, pegar, arreglar, volver a preguntar. Es como tener un mecanico que nunca ha visto tu carro y tiene que adivinar que motor tiene.</p>

<p><strong>Claude Code</strong> resuelve esto de raiz. No es un chatbot al que le pides codigo. Es un <strong>agente de programacion</strong> que vive dentro de tu terminal, entiende tu proyecto completo, y escribe codigo directamente en tus archivos. No copias nada. No pegas nada. Claude Code lee tu codebase, entiende la arquitectura, y hace los cambios por ti.</p>

<h2>Como Funciona Claude Code</h2>
<p>Claude Code se instala como un comando en tu terminal y se convierte en tu compañero de programacion:</p>

<ul>
  <li><strong>Vive en tu terminal:</strong> Lo abres con un simple comando y Claude Code tiene acceso a tu sistema de archivos, tu git, tu terminal, y tus herramientas de desarrollo. No es una ventana separada: es parte de tu flujo de trabajo.</li>
  <li><strong>Entiende tu proyecto completo:</strong> Claude Code lee tu codigo, tus configuraciones, tu documentacion, y tus tests. Cuando le pides algo, ya sabe como esta organizado tu proyecto, que patrones usas, y que convenciones sigues.</li>
  <li><strong>Ejecuta acciones reales:</strong> No solo sugiere codigo. Crea archivos, edita codigo existente, ejecuta comandos, corre tests, hace commits, y hasta crea pull requests. Es un agente completo que actua en tu proyecto.</li>
  <li><strong>Multi-agente paralelo:</strong> Claude Code puede lanzar multiples agentes en paralelo para resolver tareas complejas. Mientras un agente investiga el codebase, otro escribe tests, y otro implementa la feature. Es como tener un equipo de programadores trabajando simultaneamente.</li>
</ul>

<img src="PENDIENTE_IMG_claude_code_terminal_demo.jpg" alt="Claude Code ejecutandose en la terminal, mostrando como lee archivos, edita codigo y ejecuta comandos en un proyecto real" class="lesson-image" />

<h2>$1 Billion en Revenue: El Producto Estrella de Anthropic</h2>
<p>Claude Code no es un experimento. Es el producto mas exitoso de Anthropic, generando mas de <strong>$1 billion (mil millones) de dolares en revenue</strong>. ¿Por que? Porque resuelve el problema mas caro de la industria tecnologica: la productividad del programador.</p>

<ul>
  <li><strong>Empresas Fortune 500 lo usan:</strong> Equipos de ingenieria en las empresas mas grandes del mundo han adoptado Claude Code como herramienta estandar de desarrollo.</li>
  <li><strong>Microsoft lo usa:</strong> Incluso Microsoft, que tiene su propia IA (Copilot), usa Claude Code internamente. Cuando tu competidor directo usa tu producto, sabes que estas haciendo algo bien.</li>
  <li><strong>Productividad 10x:</strong> Los equipos reportan completar tareas de programacion en una fraccion del tiempo. Lo que tomaba un dia ahora toma una hora. Lo que tomaba una semana ahora toma un dia.</li>
</ul>

<h2>Xcode 26.3: Apple Adopta Claude Code</h2>
<p>En un movimiento que sorprendio a la industria, Apple integro Claude Code directamente en <strong>Xcode 26.3</strong>, su entorno de desarrollo para iOS, macOS, y todas las plataformas Apple. Esto significa:</p>

<ul>
  <li><strong>Desarrollo nativo con IA:</strong> Los millones de desarrolladores que crean apps para iPhone y Mac ahora tienen Claude Code integrado en su editor. No necesitan instalar nada extra.</li>
  <li><strong>Swift y SwiftUI:</strong> Claude Code entiende los frameworks de Apple nativamente. Puede generar interfaces de SwiftUI, resolver bugs de Swift, y optimizar el rendimiento de apps iOS.</li>
  <li><strong>Señal de mercado:</strong> Cuando Apple elige tu tecnologia sobre la de Google (Gemini) y Microsoft (Copilot), es una validacion enorme. Apple es conocida por ser extremadamente selectiva con sus integraciones.</li>
</ul>

<img src="PENDIENTE_IMG_claude_code_xcode_integracion.jpg" alt="Claude Code integrado en Xcode 26.3 mostrando asistencia de IA en desarrollo Swift para iOS" class="lesson-image" />

<h2>Claude Code para No-Programadores</h2>
<p>No necesitas ser programador para beneficiarte de Claude Code. Si eres emprendedor, marketer, o creativo, Claude Code puede:</p>

<ul>
  <li><strong>Crear tu landing page:</strong> "Crea una landing page para mi producto de coaching con seccion de testimonios, precios, y formulario de contacto." Claude Code la crea completa.</li>
  <li><strong>Automatizar tareas:</strong> "Escribe un script que lea mis emails de Gmail, extraiga los de clientes, y los agregue a mi hoja de calculo." Lo hace.</li>
  <li><strong>Analizar datos:</strong> "Lee este CSV con 10,000 registros de ventas y generame un reporte con los top 10 productos, tendencias mensuales, y prediccion del proximo mes." Lo resuelve.</li>
  <li><strong>Crear herramientas internas:</strong> "Necesito un dashboard simple que muestre las metricas de mi negocio en tiempo real." Claude Code lo construye.</li>
</ul>

<h2>Workflow Tipico con Claude Code</h2>
<ol>
  <li><strong>Describe lo que necesitas:</strong> En lenguaje natural, explica la feature, el bug, o la tarea que quieres resolver.</li>
  <li><strong>Claude Code investiga:</strong> Lee los archivos relevantes, entiende el contexto, y propone un plan de accion.</li>
  <li><strong>Tu apruebas:</strong> Claude Code te muestra que va a hacer antes de hacerlo. Tu decides si procede o si quieres ajustes.</li>
  <li><strong>Ejecuta los cambios:</strong> Edita archivos, crea nuevos archivos, ejecuta comandos, y verifica que todo funciona.</li>
  <li><strong>Valida:</strong> Corre tests, verifica tipos, y te muestra el resultado. Si algo falla, lo arregla automaticamente.</li>
</ol>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Si eres programador, instala Claude Code (instrucciones en docs.anthropic.com). Abre un proyecto existente y pidele algo simple: "Explica la arquitectura de este proyecto" o "Agrega un boton de logout en la pagina principal." Observa como entiende tu codebase sin que le expliques nada.</li>
    <li><strong>Ejercicio 2:</strong> Si NO eres programador, ve videos de demos de Claude Code en YouTube. Observa como los desarrolladores interactuan con el agente. Escribe 3 ideas de cosas que podrias pedirle a Claude Code para tu negocio o trabajo.</li>
    <li><strong>Ejercicio 3:</strong> Investiga los precios de Claude Code. Calcula cuanto costaria usarlo 4 horas al dia durante un mes. Compara con el costo de contratar un desarrollador freelance para las mismas tareas. ¿Cual es mas economico?</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres que Claude Code construya tu software? <a href="https://screatorsai.com">Sinsajo Creators</a> usa Claude Code para desarrollar aplicaciones web y moviles en tiempo record: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    1,
    50
  );

  -- Leccion 6.3
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod6_id,
    'Claude Cowork: Automatiza sin Programar',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_6_3">
    <p>Video: Claude Cowork - El agente de escritorio que causo un selloff de $285B en acciones SaaS</p>
  </div>
</div>

<h2>De Chatbot a Compañero de Trabajo</h2>
<p>Imagina que contratas a un asistente que puede usar tu computadora exactamente como tu la usas: abrir aplicaciones, hacer click en botones, llenar formularios, navegar sitios web, organizar archivos, enviar emails. Ahora imagina que ese asistente trabaja 24/7, nunca se cansa, nunca comete errores de fatiga, y le puedes dar instrucciones en espanol. Eso es <strong>Claude Cowork</strong>.</p>

<p>Claude Cowork es el agente de escritorio de Anthropic. No es un chatbot que te da instrucciones de que hacer. Es un agente que <strong>hace las cosas por ti</strong>, directamente en tu computadora. Abre Chrome, navega a un sitio, extrae informacion, la organiza en una hoja de calculo, y te la envia por email. Todo automaticamente. Todo mientras tu tomas cafe.</p>

<h2>El Selloff de $285 Billion: El Dia que Wall Street se Asusto</h2>
<p>Cuando Anthropic anuncio Claude Cowork, algo insolito ocurrio en Wall Street: las acciones de empresas SaaS (Software as a Service) perdieron <strong>$285 billion dolares de valor</strong> en cuestion de dias. ¿Por que? Porque los inversores entendieron las implicaciones:</p>

<ul>
  <li><strong>Si un agente puede usar cualquier software</strong>, ¿para que necesitas comprar 15 suscripciones SaaS diferentes? Claude Cowork puede navegar el sitio web gratuito de cualquier herramienta en vez de pagar por su API.</li>
  <li><strong>Si un agente puede automatizar flujos de trabajo</strong>, ¿para que necesitas Zapier, Make, o herramientas de automatizacion? Claude Cowork ES la automatizacion.</li>
  <li><strong>Si un agente puede extraer datos de cualquier sitio</strong>, ¿para que necesitas herramientas de scraping especializadas?</li>
</ul>

<p>Las empresas SaaS mas afectadas fueron las de automatizacion (UiPath, Zapier), las de productividad (Monday, Asana), y las de herramientas de datos (Tableau, Datadog). El mercado entendio que Claude Cowork es una amenaza existencial para software que cobra por funcionalidades que un agente puede replicar.</p>

<img src="PENDIENTE_IMG_claude_cowork_selloff_grafico.jpg" alt="Grafico mostrando la caida de acciones SaaS tras el anuncio de Claude Cowork con cifras de perdida de mercado" class="lesson-image" />

<h2>11 Plugins: Las Capacidades de Cowork</h2>
<p>Claude Cowork viene con <strong>11 plugins</strong> que le dan habilidades especificas:</p>

<ul>
  <li><strong>Navegador web:</strong> Navega sitios, llena formularios, extrae datos, y toma capturas de pantalla. Puede hacer research, comparar precios, y compilar informacion de multiples fuentes.</li>
  <li><strong>Sistema de archivos:</strong> Lee, crea, mueve, y organiza archivos en tu computadora. Puede renombrar 1,000 archivos siguiendo un patron en segundos.</li>
  <li><strong>Terminal/Shell:</strong> Ejecuta comandos en la terminal. Instala software, ejecuta scripts, y automatiza tareas del sistema.</li>
  <li><strong>Editor de texto:</strong> Abre y edita documentos. Puede reformatear, traducir, o transformar archivos de texto en masa.</li>
  <li><strong>Hoja de calculo:</strong> Crea y manipula hojas de calculo. Genera reportes, analiza datos, y crea graficos.</li>
  <li><strong>Email:</strong> Lee y envia emails. Puede clasificar tu bandeja de entrada, responder emails rutinarios, y enviar reportes automatizados.</li>
  <li><strong>Calendario:</strong> Gestiona tu calendario. Agenda reuniones, encuentra huecos disponibles, y envia invitaciones.</li>
  <li><strong>Notas:</strong> Crea y organiza notas. Puede transcribir reuniones, crear resúmenes, y mantener documentacion actualizada.</li>
  <li><strong>Captura de pantalla:</strong> Toma screenshots y los analiza visualmente. Util para debugging, documentacion, y reportes visuales.</li>
  <li><strong>Portapapeles:</strong> Gestiona el clipboard del sistema. Puede copiar datos entre aplicaciones de forma inteligente.</li>
  <li><strong>Notificaciones:</strong> Envia notificaciones al sistema cuando termina tareas largas o necesita tu atencion.</li>
</ul>

<h2>Conectores MCP: Expandiendo las Capacidades</h2>
<p>Ademas de los 11 plugins nativos, Claude Cowork se conecta con cualquier servicio via <strong>conectores MCP</strong>:</p>

<ul>
  <li><strong>Bases de datos:</strong> Conecta a PostgreSQL, MySQL, MongoDB y consulta datos sin escribir SQL.</li>
  <li><strong>APIs empresariales:</strong> Salesforce, HubSpot, Stripe: cualquier servicio con API puede ser controlado por Cowork.</li>
  <li><strong>Herramientas de desarrollo:</strong> GitHub, Jira, Linear: gestiona tus proyectos de software sin abrir las herramientas.</li>
  <li><strong>Servicios de comunicacion:</strong> Slack, Discord, Teams: envia mensajes y gestiona canales automaticamente.</li>
</ul>

<img src="PENDIENTE_IMG_claude_cowork_plugins_mcp.jpg" alt="Diagrama de los 11 plugins de Claude Cowork y los conectores MCP que extienden sus capacidades" class="lesson-image" />

<h2>Instrucciones Persistentes: Tu Agente Personalizado</h2>
<p>Una de las features mas poderosas de Cowork son las <strong>instrucciones persistentes</strong>. Puedes configurar reglas que Cowork siempre sigue:</p>

<ul>
  <li><strong>"Siempre responde en espanol"</strong></li>
  <li><strong>"Cuando proceses datos de clientes, nunca expongas emails completos"</strong></li>
  <li><strong>"Cuando crees reportes, usa el formato de mi empresa con el logo en la esquina"</strong></li>
  <li><strong>"Antes de enviar cualquier email, muestrame un preview y espera mi aprobacion"</strong></li>
</ul>

<p>Estas instrucciones persisten entre sesiones. Es como entrenar a un empleado una vez y que recuerde las reglas para siempre. No necesitas repetir las mismas instrucciones cada vez que usas Cowork.</p>

<h2>Casos de Uso Reales</h2>
<p>Aqui hay ejemplos concretos de como las personas usan Claude Cowork en su trabajo diario:</p>

<ul>
  <li><strong>Investigacion de mercado:</strong> "Busca los 20 competidores principales en el mercado de [nicho], extrae sus precios, features principales, y reviews. Organizalo todo en una hoja de calculo." Cowork navega 20 sitios web, extrae la informacion, y te entrega un reporte completo.</li>
  <li><strong>Procesamiento de facturas:</strong> "Abre todos los PDFs de facturas en la carpeta Descargas, extrae proveedor, monto, y fecha, y agregalos a mi hoja de contabilidad." Cowork procesa 50 facturas en minutos.</li>
  <li><strong>Gestion de redes sociales:</strong> "Programa los 10 posts que te di en Buffer para la proxima semana, uno por dia a las 9am." Cowork abre Buffer, crea los posts, y los programa.</li>
  <li><strong>Soporte al cliente:</strong> "Revisa los ultimos 20 tickets de soporte, clasifícalos por urgencia, y draft respuestas para los 5 mas urgentes." Cowork lee los tickets, los analiza, y te prepara borradores de respuesta.</li>
</ul>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Haz una lista de las 5 tareas mas repetitivas que haces cada semana en tu computadora. Para cada una, escribe como le pedirias a Claude Cowork que la haga. Se especifico: describe los pasos, las aplicaciones involucradas, y el resultado esperado.</li>
    <li><strong>Ejercicio 2:</strong> Calcula cuantas horas a la semana gastas en tareas que Cowork podria automatizar. Multiplica por tu tarifa por hora (o por el salario de un asistente). Eso es lo que ahorras con Cowork. ¿Justifica el costo de la suscripcion?</li>
    <li><strong>Ejercicio 3:</strong> Investiga que paso con las acciones de 3 empresas SaaS despues del anuncio de Claude Cowork. Busca UiPath, Monday.com, y Asana. ¿Cuanto cayeron? ¿Se han recuperado? ¿Que estrategias estan usando para competir con los agentes de IA?</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres automatizar las operaciones de tu negocio con Claude Cowork? <a href="https://screatorsai.com">Sinsajo Creators</a> implementa agentes Cowork personalizados para empresas latinoamericanas: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    2,
    50
  );

  -- Leccion 6.4
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod6_id,
    'ChatGPT vs Gemini vs Claude: La Gran Comparativa',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_6_4">
    <p>Video: La comparativa definitiva entre ChatGPT, Gemini y Claude - Cual IA elegir para cada caso de uso</p>
  </div>
</div>

<h2>Las Tres Potencias de la IA: Es Hora de Elegir</h2>
<p>A lo largo de este curso has aprendido a usar <strong>ChatGPT</strong> (Modulos 1-3), <strong>Gemini</strong> (Modulos 4-5), y <strong>Claude</strong> (este modulo). Ahora viene la pregunta que todo el mundo se hace: <strong>¿Cual es mejor?</strong> La respuesta honesta es que depende. Y en esta leccion te vamos a dar la claridad total para que nunca mas dudes cual usar.</p>

<p>Piensa en estas tres IAs como tres empleados con personalidades y fortalezas diferentes. No contratas al mismo tipo de persona para todos los puestos. Un contador no es un diseñador, y un vendedor no es un programador. Lo mismo pasa con las IAs.</p>

<h2>La Tabla Definitiva: Caso de Uso por Caso de Uso</h2>
<table>
  <thead>
    <tr>
      <th>Caso de Uso</th>
      <th>Mejor Opcion</th>
      <th>¿Por que?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Programacion y codigo</td>
      <td>Claude Opus 4.6</td>
      <td>Razonamiento superior, Claude Code como agente, integracion con Xcode</td>
    </tr>
    <tr>
      <td>Escritura creativa</td>
      <td>ChatGPT (GPT-4.1)</td>
      <td>Estilo mas natural y versatil, Custom GPTs para personalizacion</td>
    </tr>
    <tr>
      <td>Investigacion con fuentes</td>
      <td>Gemini 3 Pro</td>
      <td>Deep Research con citaciones verificables, integracion con Google Search</td>
    </tr>
    <tr>
      <td>Analisis de documentos largos</td>
      <td>Claude Opus 4.6</td>
      <td>Ventana de 200K tokens, precision en detalles, honestidad sobre limitaciones</td>
    </tr>
    <tr>
      <td>Imagenes con texto legible</td>
      <td>Gemini (Nano Banana Pro)</td>
      <td>Unico modelo con texto perfectamente legible en 4K</td>
    </tr>
    <tr>
      <td>Video con audio</td>
      <td>Gemini (Veo 3)</td>
      <td>Audio nativo sincronizado, el unico que genera video con dialogo</td>
    </tr>
    <tr>
      <td>Automatizacion de escritorio</td>
      <td>Claude Cowork</td>
      <td>11 plugins, conectores MCP, instrucciones persistentes</td>
    </tr>
    <tr>
      <td>Conversacion casual</td>
      <td>ChatGPT</td>
      <td>La interfaz mas pulida, voz natural, memoria de conversaciones</td>
    </tr>
    <tr>
      <td>Datos y analisis</td>
      <td>Gemini 3 Pro</td>
      <td>Integracion con Google Sheets, BigQuery, y ecosistema de datos Google</td>
    </tr>
    <tr>
      <td>Tareas de negocio (emails, reportes)</td>
      <td>Empate: Claude / ChatGPT</td>
      <td>Ambos son excelentes. Claude es mas preciso, ChatGPT mas rapido</td>
    </tr>
    <tr>
      <td>Educacion y tutoria</td>
      <td>ChatGPT</td>
      <td>Mejor pedagogia, adaptacion al nivel del estudiante, voz interactiva</td>
    </tr>
    <tr>
      <td>Privacidad y datos sensibles</td>
      <td>Claude</td>
      <td>Anthropic no entrena con tus datos por defecto, politica de privacidad mas estricta</td>
    </tr>
  </tbody>
</table>

<img src="PENDIENTE_IMG_comparativa_tres_ias_infografia.jpg" alt="Infografia comparativa de ChatGPT, Gemini y Claude mostrando fortalezas y debilidades de cada uno" class="lesson-image" />

<h2>Precios: ¿Cuanto Cuesta Cada Una?</h2>
<table>
  <thead>
    <tr>
      <th>Plan</th>
      <th>ChatGPT</th>
      <th>Gemini</th>
      <th>Claude</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Gratuito</td>
      <td>Si (GPT-4o mini)</td>
      <td>Si (Gemini 2.0 Flash)</td>
      <td>Si (Sonnet, limitado)</td>
    </tr>
    <tr>
      <td>Plan individual</td>
      <td>$20/mes (Plus)</td>
      <td>$20/mes (Advanced)</td>
      <td>$20/mes (Pro)</td>
    </tr>
    <tr>
      <td>Plan premium</td>
      <td>$200/mes (Pro)</td>
      <td>Incluido en Workspace</td>
      <td>$100/mes (Max)</td>
    </tr>
    <tr>
      <td>Acceso a modelo top</td>
      <td>GPT-4.1 en Plus</td>
      <td>Gemini 3 Pro en Advanced</td>
      <td>Opus 4.6 en Pro</td>
    </tr>
    <tr>
      <td>API (por millon tokens)</td>
      <td>$2-30 segun modelo</td>
      <td>$1.25-10 segun modelo</td>
      <td>$3-75 segun modelo</td>
    </tr>
    <tr>
      <td>Mejor valor</td>
      <td>Versatilidad total</td>
      <td>Gratis es muy generoso</td>
      <td>Calidad por dolar</td>
    </tr>
  </tbody>
</table>

<h2>Limites de Uso: Lo que Nadie te Dice</h2>
<p>Los planes de pago no son "ilimitados". Todos tienen limites que necesitas conocer:</p>

<ul>
  <li><strong>ChatGPT Plus ($20):</strong> Limite de ~80 mensajes GPT-4.1 cada 3 horas. DALL-E limitado a ~25 imagenes/dia. GPT-4o tiene limites mas generosos.</li>
  <li><strong>Gemini Advanced ($20):</strong> Limite de uso "justo" sin numero fijo publicado. El plan gratuito tiene 15 consultas/dia de Gemini 3 Pro. La generacion de imagenes y video tiene limites adicionales.</li>
  <li><strong>Claude Pro ($20):</strong> Limite de ~100 mensajes Opus 4.6 cada 5 horas. Sonnet tiene limites mas altos. Claude Code tiene su propia facturacion por uso.</li>
</ul>

<p><strong>Consejo practico:</strong> Si llegas al limite de una IA, cambia temporalmente a otra. Tener cuentas en las tres te da acceso continuo a IA de alta calidad incluso cuando una esta "en cooldown".</p>

<img src="PENDIENTE_IMG_comparativa_precios_limites.jpg" alt="Tabla visual comparando precios y limites de uso de ChatGPT, Gemini y Claude" class="lesson-image" />

<h2>La Estrategia Multi-IA: Usa las Tres</h2>
<p>Los profesionales mas productivos no eligen una sola IA. Usan las tres estrategicamente:</p>

<ul>
  <li><strong>ChatGPT como asistente general:</strong> Para conversaciones, brainstorming, escritura, y tareas cotidianas. Es tu "navaja suiza" por defecto.</li>
  <li><strong>Gemini para investigacion y multimedia:</strong> Cuando necesitas investigar con fuentes, generar imagenes con texto, o crear videos. Es tu "equipo creativo".</li>
  <li><strong>Claude para trabajo profundo:</strong> Cuando necesitas analisis complejo, programacion seria, o procesar documentos largos. Es tu "consultor senior".</li>
</ul>

<h2>Mi Recomendacion Personal</h2>
<p>Si solo puedes pagar UNA suscripcion:</p>
<ul>
  <li><strong>Eres emprendedor/marketer:</strong> ChatGPT Plus. La versatilidad y la facilidad de uso ganan.</li>
  <li><strong>Eres programador/tecnico:</strong> Claude Pro. El razonamiento y Claude Code no tienen rival.</li>
  <li><strong>Eres creador de contenido:</strong> Gemini Advanced. Imagenes, video, y research integrados.</li>
</ul>

<p>Si puedes pagar DOS: ChatGPT Plus + Claude Pro. Cubres el 95% de los casos de uso con la mejor calidad posible.</p>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Toma una tarea real de tu trabajo y ejecutala en las tres IAs. Puede ser: escribir un email importante, analizar un documento, o resolver un problema. Compara la calidad, velocidad, y utilidad de cada respuesta. ¿Cual te gusto mas y por que?</li>
    <li><strong>Ejercicio 2:</strong> Crea tu propia "decision matrix" personal. Haz una tabla con tus 10 tareas mas frecuentes y asigna la mejor IA para cada una. Imprime esta tabla y tenla cerca de tu escritorio como referencia rapida.</li>
    <li><strong>Ejercicio 3:</strong> Calcula tu presupuesto mensual ideal en IAs. Considera: ¿cuanto tiempo ahorras? ¿cuanto vale ese tiempo? ¿cuantas suscripciones necesitas? Escribe un plan de 3 niveles: basico (gratis), intermedio ($20/mes), y premium ($40-60/mes).</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Necesitas ayuda eligiendo las herramientas de IA correctas para tu negocio? <a href="https://screatorsai.com">Sinsajo Creators</a> te asesora gratis para encontrar el stack de IA perfecto para tus necesidades: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    3,
    40
  );

  -- ============================================================
  -- MODULO 7: AGENTES IA
  -- ============================================================
  INSERT INTO public.modules (id, course_id, title, order_index)
  VALUES (gen_random_uuid(), v_course_id, 'Agentes IA', 6)
  RETURNING id INTO v_mod7_id;

  -- Leccion 7.1
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod7_id,
    'Que Son los Agentes IA',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_7_1">
    <p>Video: Agentes IA explicados - De chatbots a agentes autonomos, la era agentica y los protocolos MCP/A2A</p>
  </div>
</div>

<h2>De Chatbots a Agentes: La Evolucion Mas Importante de la IA</h2>
<p>Hasta ahora en este curso has aprendido a usar IAs como ChatGPT, Gemini, y Claude. Todas tienen algo en comun: <strong>tu les preguntas, ellas responden</strong>. Tu eres el piloto, la IA es el copiloto. Pero, ¿que pasaria si la IA pudiera ser el piloto? ¿Si pudiera tomar decisiones, ejecutar acciones, y completar tareas complejas sin que tu la guies paso a paso?</p>

<p>Eso es exactamente lo que son los <strong>Agentes IA</strong>. Y su llegada marca el inicio de lo que la industria llama <strong>la era agentica</strong>: el momento en que las IAs pasan de ser herramientas pasivas a trabajadores autonomos.</p>

<h2>Chatbot vs Agente: La Diferencia Fundamental</h2>
<p>Para entender que es un agente, primero comparemoslo con un chatbot:</p>

<table>
  <thead>
    <tr>
      <th>Caracteristica</th>
      <th>Chatbot (ChatGPT, etc.)</th>
      <th>Agente IA</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Interaccion</td>
      <td>Tu preguntas, el responde</td>
      <td>Tu defines el objetivo, el ejecuta</td>
    </tr>
    <tr>
      <td>Autonomia</td>
      <td>Ninguna. Espera tus instrucciones</td>
      <td>Alta. Toma decisiones y actua solo</td>
    </tr>
    <tr>
      <td>Herramientas</td>
      <td>Solo genera texto/imagenes</td>
      <td>Usa herramientas externas (web, APIs, archivos)</td>
    </tr>
    <tr>
      <td>Memoria</td>
      <td>Solo la conversacion actual</td>
      <td>Memoria persistente entre sesiones</td>
    </tr>
    <tr>
      <td>Planificacion</td>
      <td>No planifica. Responde al instante</td>
      <td>Descompone tareas complejas en pasos</td>
    </tr>
    <tr>
      <td>Error handling</td>
      <td>Si falla, tu corriges</td>
      <td>Detecta errores y se auto-corrige</td>
    </tr>
    <tr>
      <td>Analogia</td>
      <td>Un oraculo: sabio pero pasivo</td>
      <td>Un empleado: capaz y proactivo</td>
    </tr>
  </tbody>
</table>

<img src="PENDIENTE_IMG_chatbot_vs_agente_diagrama.jpg" alt="Diagrama comparativo entre chatbot y agente IA mostrando flujo de trabajo pasivo vs autonomo" class="lesson-image" />

<h2>La Era Agentica: ¿Que Significa?</h2>
<p>La "era agentica" es el termino que la industria usa para describir el momento actual donde las IAs se estan convirtiendo en agentes. Todos los grandes jugadores estan apostando fuerte:</p>

<ul>
  <li><strong>OpenAI:</strong> Lanzo el Operator (agente web) y esta construyendo agentes para empresas.</li>
  <li><strong>Anthropic:</strong> Claude Code y Claude Cowork son agentes puros. Su vision es que Claude sea un "compañero de trabajo virtual".</li>
  <li><strong>Google:</strong> Project Mariner (agente de navegador) y agentes integrados en Workspace.</li>
  <li><strong>Microsoft:</strong> Copilot Studio permite crear agentes personalizados para empresas.</li>
  <li><strong>Apple:</strong> Siri con agentes que ejecutan acciones complejas en el ecosistema Apple.</li>
</ul>

<p>La tendencia es clara: en 2-3 anos, <strong>la mayoria de las interacciones con IA no seran conversaciones</strong>. Seran delegaciones. No le diras a la IA "escribeme un email". Le diras "gestiona mi bandeja de entrada esta semana".</p>

<h2>Anatomia de un Agente IA</h2>
<p>Todo agente IA tiene cuatro componentes fundamentales:</p>

<ol>
  <li><strong>Cerebro (LLM):</strong> El modelo de lenguaje que razona y toma decisiones. Puede ser GPT-4, Claude Opus, Gemini, o cualquier otro. El cerebro decide QUE hacer y COMO hacerlo.</li>
  <li><strong>Herramientas (Tools):</strong> Las capacidades que el agente tiene para interactuar con el mundo. Navegar la web, leer archivos, enviar emails, consultar bases de datos, ejecutar codigo. Sin herramientas, un agente es solo un chatbot.</li>
  <li><strong>Memoria:</strong> La capacidad de recordar informacion entre sesiones. Un agente con memoria aprende tus preferencias, recuerda tareas pasadas, y mejora con el tiempo.</li>
  <li><strong>Bucle de ejecucion:</strong> El ciclo de "pensar → actuar → observar → pensar de nuevo" que permite al agente resolver tareas complejas paso a paso. Si algo falla, el agente re-evalua y prueba un enfoque diferente.</li>
</ol>

<img src="PENDIENTE_IMG_anatomia_agente_ia.jpg" alt="Diagrama de los 4 componentes de un agente IA: cerebro LLM, herramientas, memoria y bucle de ejecucion" class="lesson-image" />

<h2>MCP y A2A: Los Protocolos que Conectan Todo</h2>
<p>Para que los agentes funcionen en el mundo real, necesitan estandares de comunicacion. Hay dos protocolos clave:</p>

<ul>
  <li><strong>MCP (Model Context Protocol):</strong> Creado por Anthropic. Es el estandar para conectar agentes con herramientas externas. Piensa en MCP como el USB de la IA: un conector universal. Con MCP, un agente puede conectarse a tu base de datos, tu CRM, tu email, y cualquier servicio con un conector MCP. Ya tiene mas de 100 millones de descargas mensuales.</li>
  <li><strong>A2A (Agent-to-Agent):</strong> Creado por Google. Es el estandar para que agentes hablen entre si. Si MCP conecta agentes con herramientas, A2A conecta agentes con otros agentes. Imagina un agente de ventas que le pide datos al agente de finanzas, que a su vez consulta al agente de inventario. A2A es el protocolo que hace posible esa comunicacion.</li>
</ul>

<p>La combinacion de MCP y A2A es lo que hace posible los <strong>sistemas multi-agente</strong> que veremos en la leccion 7.4. Es la infraestructura invisible que esta haciendo posible la era agentica.</p>

<h2>Ejemplos del Mundo Real</h2>
<p>Los agentes IA ya estan trabajando en el mundo real:</p>

<ul>
  <li><strong>Agentes de atencion al cliente:</strong> Resuelven tickets de soporte sin intervencion humana. Leen el problema, consultan la base de conocimiento, y dan una solucion. Solo escalan a un humano si no pueden resolverlo.</li>
  <li><strong>Agentes de ventas:</strong> Califican leads, envian emails de seguimiento personalizados, y agendan reuniones. Trabajan 24/7 y nunca olvidan hacer follow-up.</li>
  <li><strong>Agentes de desarrollo:</strong> Claude Code es un agente de programacion. Lee tu codigo, entiende el contexto, y escribe features completas.</li>
  <li><strong>Agentes de investigacion:</strong> Deep Research de Gemini es un agente que investiga temas complejos, consulta multiples fuentes, y genera reportes con citaciones.</li>
</ul>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Haz una lista de 5 tareas en tu trabajo que podrian ser delegadas a un agente IA. Para cada una, describe: la tarea, las herramientas que necesitaria el agente, y que tan autonomo deberia ser (¿completamente autonomo o con aprobacion humana en cada paso?).</li>
    <li><strong>Ejercicio 2:</strong> Investiga el protocolo MCP. Ve al repositorio oficial en GitHub y lee la descripcion. Escribe un resumen de 3 parrafos explicando que es MCP, para que sirve, y por que tiene mas de 100M de descargas mensuales.</li>
    <li><strong>Ejercicio 3:</strong> Compara Operator (OpenAI), Claude Cowork (Anthropic), y Project Mariner (Google). Investiga que puede hacer cada uno y crea una tabla comparativa similar a la que hicimos con ChatGPT vs Gemini vs Claude, pero para agentes.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres implementar agentes IA en tu empresa? <a href="https://screatorsai.com">Sinsajo Creators</a> diseña e implementa agentes autonomos personalizados para negocios: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    0,
    40
  );

  -- Leccion 7.2
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod7_id,
    'OpenClaw: El Asistente Open-Source Viral',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_7_2">
    <p>Video: OpenClaw - El asistente IA open-source con 201K estrellas en GitHub que lo cambia todo</p>
  </div>
</div>

<h2>201,000 Estrellas en GitHub: El Proyecto Open-Source Mas Popular de la Historia de la IA</h2>
<p>Cuando un proyecto de software recibe 1,000 estrellas en GitHub, se considera un exito. Cuando recibe 10,000, es un fenomeno. <strong>OpenClaw</strong> tiene <strong>201,000 estrellas</strong>, convirtiendolo en uno de los proyectos open-source mas populares de la historia. Para ponerlo en perspectiva: React (de Facebook) tiene 230K estrellas despues de 11 años. OpenClaw alcanzo 201K en una fraccion del tiempo.</p>

<p>¿Que es OpenClaw y por que esta causando tanto revuelo? Es un <strong>asistente IA open-source</strong> que cualquier persona puede instalar, personalizar, y usar de forma completamente gratuita. Piensa en el como "ChatGPT pero tuyo": corre en tu maquina, tus datos nunca salen de tu control, y puedes modificar absolutamente todo.</p>

<h2>Peter Steinberger: El Visionario Detras de OpenClaw</h2>
<p><strong>Peter Steinberger</strong>, el creador de OpenClaw, es un nombre conocido en la comunidad de desarrollo. Antes de OpenClaw, fundo PSPDFKit, una de las empresas de SDK mas exitosas de Europa. Su vision con OpenClaw fue simple pero poderosa: <strong>"La IA no deberia ser un servicio de alquiler. Deberia ser una herramienta que posees."</strong></p>

<p>La filosofia de OpenClaw es radicalmente diferente a ChatGPT, Gemini, o Claude:</p>
<ul>
  <li><strong>Open-source total:</strong> Codigo abierto, libre para usar, modificar, y distribuir.</li>
  <li><strong>Privacidad primero:</strong> Tus conversaciones y datos nunca salen de tu dispositivo (si usas modelos locales).</li>
  <li><strong>Modelo agnostico:</strong> Puedes usar GPT-4, Claude, Gemini, Llama, Mistral, o cualquier modelo. No estas atado a un proveedor.</li>
  <li><strong>Extensible:</strong> Cualquier persona puede crear "skills" (habilidades) para que OpenClaw haga cosas nuevas.</li>
</ul>

<img src="PENDIENTE_IMG_openclaw_github_stars.jpg" alt="Pagina de GitHub de OpenClaw mostrando 201K estrellas y la comunidad activa de contribuidores" class="lesson-image" />

<h2>ClawdHub: 565+ Skills y Creciendo</h2>
<p><strong>ClawdHub</strong> es el marketplace de skills de OpenClaw, y es lo que lo hace verdaderamente poderoso. Con <strong>565+ skills</strong> disponibles, OpenClaw puede hacer casi cualquier cosa:</p>

<ul>
  <li><strong>Productividad:</strong> Skills para gestion de tareas, calendario, notas, y organizacion personal.</li>
  <li><strong>Desarrollo:</strong> Skills para programacion, debugging, deploy, y gestion de repositorios.</li>
  <li><strong>Escritura:</strong> Skills para redaccion, traduccion, correccion gramatical, y generacion de contenido.</li>
  <li><strong>Datos:</strong> Skills para analisis de datos, visualizacion, web scraping, y reportes automatizados.</li>
  <li><strong>Comunicacion:</strong> Skills para email, redes sociales, y mensajeria.</li>
  <li><strong>Personalizacion:</strong> Skills que modifican la personalidad, el tono, y el comportamiento de OpenClaw.</li>
</ul>

<p>Cualquier persona puede crear y publicar un skill en ClawdHub. Es como la App Store pero para habilidades de IA. Y al ser open-source, puedes inspeccionar el codigo de cualquier skill antes de instalarlo, algo imposible con los plugins cerrados de ChatGPT.</p>

<h2>Moltbook: OpenClaw para Equipos</h2>
<p><strong>Moltbook</strong> es la version empresarial de OpenClaw, diseñada para equipos y organizaciones:</p>

<ul>
  <li><strong>Administracion centralizada:</strong> Un admin configura OpenClaw para todo el equipo: modelos permitidos, skills disponibles, y politicas de uso.</li>
  <li><strong>Base de conocimiento compartida:</strong> Sube documentos de la empresa y todos los miembros del equipo pueden consultar la misma informacion.</li>
  <li><strong>Audit trail:</strong> Registro completo de todas las interacciones para cumplimiento regulatorio.</li>
  <li><strong>Deploy on-premise:</strong> Corre en tus propios servidores. Ninguna conversacion sale de tu infraestructura.</li>
</ul>

<h2>Multi-Plataforma: WhatsApp, Telegram, Discord</h2>
<p>Una de las ventajas mas potentes de OpenClaw es que no esta limitado a una interfaz web. Puedes conectarlo a las plataformas que ya usas:</p>

<ul>
  <li><strong>WhatsApp:</strong> Convierte tu numero de WhatsApp Business en un asistente IA. Tus clientes hablan con OpenClaw via WhatsApp y reciben respuestas inteligentes 24/7. Perfecto para atencion al cliente en Latinoamerica donde WhatsApp es la plataforma dominante.</li>
  <li><strong>Telegram:</strong> Crea un bot de Telegram potenciado por OpenClaw. Ideal para comunidades, grupos de estudio, y canales de soporte.</li>
  <li><strong>Discord:</strong> Integra OpenClaw en tu servidor de Discord. Puede moderar, responder preguntas, y asistir a los miembros de tu comunidad.</li>
  <li><strong>Slack:</strong> Conecta OpenClaw a tu workspace de Slack para tener un asistente IA disponible en todos tus canales de trabajo.</li>
  <li><strong>API REST:</strong> Conecta OpenClaw a cualquier aplicacion via API. Puedes integrarlo en tu sitio web, tu app movil, o tu sistema interno.</li>
</ul>

<img src="PENDIENTE_IMG_openclaw_multiplataforma.jpg" alt="OpenClaw conectado a WhatsApp, Telegram, Discord y Slack simultaneamente, mostrando la misma conversacion en multiples plataformas" class="lesson-image" />

<h2>¿Por que OpenClaw vs ChatGPT/Claude?</h2>
<p>OpenClaw no reemplaza a ChatGPT o Claude. Los complementa. Aqui es cuando OpenClaw es la mejor opcion:</p>

<ul>
  <li><strong>Privacidad critica:</strong> Datos medicos, financieros, o legales que no pueden salir de tu infraestructura.</li>
  <li><strong>Personalizacion extrema:</strong> Necesitas un asistente con comportamiento muy especifico que no puedes lograr con las opciones comerciales.</li>
  <li><strong>Costo a escala:</strong> Si tienes 100+ empleados usando IA, OpenClaw con modelos locales es drasticamente mas barato que 100 suscripciones a ChatGPT Plus.</li>
  <li><strong>Integracion multi-canal:</strong> Necesitas IA en WhatsApp, Telegram, Y tu sitio web con la misma base de conocimiento.</li>
  <li><strong>Modelo agnostico:</strong> Quieres poder cambiar entre GPT-4, Claude, y Llama segun la tarea, sin cambiar de plataforma.</li>
</ul>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Visita el repositorio de OpenClaw en GitHub. Lee el README y explora los skills disponibles en ClawdHub. Identifica 5 skills que serian utiles para tu trabajo y escribe como los usarias.</li>
    <li><strong>Ejercicio 2:</strong> Si eres tecnico, instala OpenClaw localmente siguiendo la guia de instalacion. Conectalo a un modelo gratuito (como Llama via Ollama) y prueba una conversacion. Si no eres tecnico, ve un tutorial de instalacion en YouTube y toma notas de los requisitos del sistema.</li>
    <li><strong>Ejercicio 3:</strong> Diseña un agente de atencion al cliente para tu negocio usando OpenClaw. Escribe: la personalidad del agente, las 10 preguntas frecuentes que debe saber responder, las plataformas donde estaria disponible (WhatsApp, web, etc.), y cuando deberia escalar a un humano.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres implementar OpenClaw para tu negocio con integracion WhatsApp? <a href="https://screatorsai.com">Sinsajo Creators</a> configura e implementa OpenClaw con skills personalizados y conexion multi-plataforma: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    1,
    50
  );

  -- Leccion 7.3
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod7_id,
    'Agentes para Negocios',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_7_3">
    <p>Video: Agentes IA para negocios - Atencion 24/7, ventas automatizadas y reduccion de costos del 80%</p>
  </div>
</div>

<h2>El Impacto Real: Agentes IA en Negocios</h2>
<p>Hemos hablado de tecnologia, modelos, y protocolos. Ahora hablemos de dinero. Porque al final del dia, la pregunta que todo dueño de negocio se hace es: <strong>"¿Cuanto me ahorra esto y cuanto mas me hace ganar?"</strong> Los agentes IA no son un gasto tecnologico. Son una inversion con ROI medible. Y los numeros son impresionantes.</p>

<p>En esta leccion vamos a ver casos reales de negocios que implementaron agentes IA, cuanto ahorraron, y como puedes replicar sus resultados.</p>

<h2>Atencion al Cliente 24/7: El Caso Mas Obvio</h2>
<p>La atencion al cliente es el primer lugar donde los agentes IA generan valor inmediato:</p>

<ul>
  <li><strong>Disponibilidad permanente:</strong> Un agente IA no duerme, no toma vacaciones, no se enferma, y no tiene mal dia. Responde a las 3am del domingo exactamente igual que a las 10am del lunes.</li>
  <li><strong>Tiempo de respuesta: 0 segundos:</strong> Mientras un equipo humano tiene un SLA de "respuesta en 4 horas", un agente responde al instante. Y sabemos que la velocidad de respuesta es el factor #1 en satisfaccion del cliente.</li>
  <li><strong>Consistencia:</strong> Un agente siempre da la misma calidad de respuesta. No hay variacion por cansancio, humor, o experiencia del agente humano.</li>
  <li><strong>Escalamiento automatico:</strong> ¿Tienes 10 consultas simultaneas? ¿100? ¿1,000? El agente maneja todas sin necesidad de contratar mas personal.</li>
</ul>

<p><strong>Caso real:</strong> Una empresa de e-commerce en Mexico implemento un agente IA en WhatsApp para soporte. Resultados despues de 3 meses:</p>
<ul>
  <li>82% de tickets resueltos sin intervencion humana</li>
  <li>Tiempo de respuesta: de 4 horas promedio a 8 segundos</li>
  <li>Satisfaccion del cliente: de 3.2/5 a 4.6/5</li>
  <li>Costo de soporte: reduccion del 70%</li>
</ul>

<img src="PENDIENTE_IMG_agente_atencion_cliente_metricas.jpg" alt="Dashboard mostrando metricas de un agente de atencion al cliente: tickets resueltos, tiempo de respuesta, satisfaccion" class="lesson-image" />

<h2>Agentes de Ventas: Vender Mientras Duermes</h2>
<p>Los agentes de ventas IA son el siguiente nivel. No solo responden preguntas sino que activamente venden:</p>

<ul>
  <li><strong>Calificacion de leads automatica:</strong> El agente habla con cada lead que llega, hace las preguntas correctas, y determina si es un lead calificado o no. Tu equipo de ventas solo habla con leads que ya estan listos para comprar.</li>
  <li><strong>Follow-up implacable:</strong> Sabemos que el 80% de las ventas requieren al menos 5 follow-ups. Los humanos se olvidan despues del 2do. Un agente NUNCA olvida. Envia el 5to, el 10mo, el 20mo follow-up si es necesario.</li>
  <li><strong>Personalizacion a escala:</strong> Cada mensaje de follow-up es personalizado basado en la conversacion previa, el comportamiento del lead, y su perfil. No son templates genericos. Son mensajes que parecen escritos por un vendedor dedicado.</li>
  <li><strong>Agendamiento automatico:</strong> Cuando el lead esta listo, el agente agenda la reunion directamente en el calendario del vendedor. Sin emails de ida y vuelta para encontrar un horario.</li>
</ul>

<h2>Reduccion de Costos del 80%: Los Numeros Reales</h2>
<p>La reduccion de costos es el argumento mas fuerte para implementar agentes IA. Veamos los numeros:</p>

<table>
  <thead>
    <tr>
      <th>Area</th>
      <th>Costo con Humanos</th>
      <th>Costo con Agente IA</th>
      <th>Ahorro</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Soporte al cliente (5 agentes)</td>
      <td>$15,000/mes</td>
      <td>$3,000/mes</td>
      <td>80%</td>
    </tr>
    <tr>
      <td>Calificacion de leads (2 SDRs)</td>
      <td>$8,000/mes</td>
      <td>$1,500/mes</td>
      <td>81%</td>
    </tr>
    <tr>
      <td>Procesamiento de datos (1 analista)</td>
      <td>$5,000/mes</td>
      <td>$500/mes</td>
      <td>90%</td>
    </tr>
    <tr>
      <td>Gestion de redes sociales</td>
      <td>$3,000/mes</td>
      <td>$800/mes</td>
      <td>73%</td>
    </tr>
    <tr>
      <td><strong>Total</strong></td>
      <td><strong>$31,000/mes</strong></td>
      <td><strong>$5,800/mes</strong></td>
      <td><strong>81%</strong></td>
    </tr>
  </tbody>
</table>

<p><strong>Importante:</strong> Esto NO significa despedir a tu equipo. Significa redirigir su talento a tareas de mayor valor. El agente de soporte maneja las preguntas frecuentes; tu equipo humano maneja los casos complejos y la relacion con clientes VIP. El agente de ventas califica leads; tu vendedor cierra los tratos grandes.</p>

<img src="PENDIENTE_IMG_agentes_reduccion_costos_grafico.jpg" alt="Grafico comparativo de costos operativos antes y despues de implementar agentes IA en un negocio" class="lesson-image" />

<h2>Casos Sinsajo: Implementaciones Reales</h2>
<p><strong>Sinsajo Creators</strong> ha implementado agentes IA en negocios reales en Latinoamerica. Estos son algunos casos:</p>

<ul>
  <li><strong>Clinica dental en Colombia:</strong> Agente de WhatsApp que agenda citas, responde preguntas sobre tratamientos y precios, y envia recordatorios automaticos. Resultado: 40% mas citas agendadas, 60% menos llamadas al front desk.</li>
  <li><strong>E-commerce de moda en Mexico:</strong> Agente que recomienda productos basado en el historial del cliente, procesa devoluciones, y gestiona reclamos. Resultado: 25% aumento en ticket promedio, 80% menos tickets de soporte escalados.</li>
  <li><strong>Agencia inmobiliaria en Republica Dominicana:</strong> Agente que califica leads de portales inmobiliarios, envia fichas de propiedades personalizadas, y agenda visitas. Resultado: 3x mas leads calificados por mes, vendedores enfocados en cerrar en vez de filtrar.</li>
  <li><strong>Academia online en Argentina:</strong> Agente tutor que responde dudas de estudiantes, recomienda lecciones, y genera reportes de progreso para profesores. Resultado: 90% de preguntas resueltas sin profesor, satisfaccion estudiantil 4.8/5.</li>
</ul>

<h2>Como Empezar: El Framework de 3 Pasos</h2>
<ol>
  <li><strong>Identifica la tarea repetitiva mas costosa:</strong> ¿Donde gastas mas tiempo/dinero en tareas que siguen un patron predecible? Atencion al cliente, calificacion de leads, procesamiento de datos: ahi esta tu primera oportunidad.</li>
  <li><strong>Empieza pequeño, mide todo:</strong> No automatices todo de golpe. Implementa un agente en UN canal (ej: WhatsApp soporte) y mide durante 30 dias. Compara: tickets resueltos, tiempo de respuesta, satisfaccion, costo.</li>
  <li><strong>Itera y escala:</strong> Con datos reales, ajusta el agente, amplia su base de conocimiento, y gradualmente dale mas responsabilidades. Luego replica el modelo en otras areas del negocio.</li>
</ol>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Haz un "audit de automatizacion" de tu negocio. Lista todas las tareas repetitivas que hace tu equipo en una semana. Para cada una, estima: horas semanales, costo, y si un agente IA podria hacerla. Ordena por impacto economico.</li>
    <li><strong>Ejercicio 2:</strong> Calcula el ROI de implementar un agente en tu area de mayor oportunidad. Usa la tabla de costos como referencia. ¿Cuanto ahorras al mes? ¿En cuantos meses se paga la implementacion?</li>
    <li><strong>Ejercicio 3:</strong> Escribe el "manual del agente" para tu primera automatizacion. Incluye: la personalidad del agente, las 20 preguntas que debe saber responder, los escenarios en que debe escalar a un humano, y las metricas de exito que mediras.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Listo para implementar agentes IA en tu negocio? <a href="https://screatorsai.com">Sinsajo Creators</a> diseña, implementa, y optimiza agentes IA para negocios en Latinoamerica. Consulta gratuita: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    2,
    55
  );

  -- Leccion 7.4
  INSERT INTO public.lessons (module_id, title, content, order_index, duration_minutes)
  VALUES (
    v_mod7_id,
    'Sistemas Multi-Agente',
    '<div class="video-embed">
  <div data-youtube-id="PENDIENTE_VIDEO_7_4">
    <p>Video: Sistemas Multi-Agente - Cuando un solo agente no es suficiente y necesitas un equipo de IAs</p>
  </div>
</div>

<h2>De un Agente a un Equipo de Agentes</h2>
<p>En las lecciones anteriores aprendiste que un agente IA es como un empleado digital: capaz, autonomo, y productivo. Pero, ¿que pasa cuando la tarea es demasiado compleja para un solo agente? ¿Cuando necesitas un vendedor, un analista, un soporte tecnico, y un gerente trabajando juntos? Necesitas un <strong>Sistema Multi-Agente (MAS)</strong>.</p>

<p>Un Sistema Multi-Agente es exactamente lo que suena: multiples agentes IA especializados que trabajan juntos de forma coordinada para resolver problemas complejos. Piensa en ello como una empresa virtual donde cada empleado es un agente con un rol especifico.</p>

<h2>¿Por que Multi-Agente en vez de un Solo Agente Grande?</h2>
<p>Podrias pensar: "¿Por que no usar un solo agente super-inteligente que haga todo?" Hay tres razones fundamentales:</p>

<ul>
  <li><strong>Especializacion:</strong> Un agente que intenta ser bueno en todo termina siendo mediocre en todo. Un agente especializado en ventas es MUCHO mejor vendiendo que un agente generalista. Lo mismo que pasa con las personas: un doctor generalista diagnostica bien, pero cuando necesitas cirugia de corazon, quieres al cardiologo especialista.</li>
  <li><strong>Paralelismo:</strong> Un solo agente procesa una tarea a la vez. Multiples agentes pueden trabajar en paralelo. Mientras el agente de investigacion busca datos, el agente de analisis procesa los datos previos, y el agente de redaccion escribe el reporte. Todo simultaneamente.</li>
  <li><strong>Robustez:</strong> Si un agente falla, los demas siguen funcionando. Si tu unico agente falla, todo se detiene. Es la diferencia entre tener un empleado y tener un equipo: si uno se enferma, el equipo sigue operando.</li>
</ul>

<img src="PENDIENTE_IMG_multi_agente_vs_single_agente.jpg" alt="Diagrama comparativo: un agente unico intentando hacer todo vs un equipo de agentes especializados coordinados" class="lesson-image" />

<h2>Orquestacion: El Director de Orquesta</h2>
<p>Para que multiples agentes trabajen juntos sin caos, necesitas un <strong>orquestador</strong>. El orquestador es un agente (o un sistema) que coordina a los demas:</p>

<ul>
  <li><strong>Asigna tareas:</strong> Cuando llega una solicitud, el orquestador decide que agente es el mas adecuado para manejarla. "Este ticket es de facturacion → lo maneja el agente de finanzas." "Este es un bug tecnico → lo maneja el agente de soporte tecnico."</li>
  <li><strong>Maneja el flujo:</strong> Define el orden en que los agentes actuan. "Primero el agente de investigacion recopila datos, luego el agente de analisis los procesa, y finalmente el agente de redaccion genera el reporte."</li>
  <li><strong>Resuelve conflictos:</strong> Si dos agentes tienen respuestas contradictorias, el orquestador decide cual es correcta o pide una segunda opinion a un tercer agente.</li>
  <li><strong>Monitorea calidad:</strong> Revisa el output de cada agente antes de pasarlo al siguiente o al usuario final. Es el control de calidad del equipo.</li>
</ul>

<h2>Patrones de Arquitectura Multi-Agente</h2>
<p>Hay cuatro patrones principales para organizar un sistema multi-agente:</p>

<ol>
  <li><strong>Pipeline (Cadena):</strong> Los agentes trabajan en secuencia, como una linea de ensamblaje. El output del Agente A es el input del Agente B, que a su vez alimenta al Agente C. Ideal para procesos lineales como: investigar → analizar → redactar → revisar.</li>
  <li><strong>Hub and Spoke (Estrella):</strong> Un agente central (el orquestador) distribuye tareas a agentes especializados y recopila sus resultados. Ideal para soporte al cliente donde diferentes preguntas van a diferentes especialistas.</li>
  <li><strong>Debate/Consenso:</strong> Multiples agentes analizan el mismo problema desde diferentes perspectivas y debaten hasta llegar a un consenso. Ideal para decisiones complejas donde quieres multiples puntos de vista.</li>
  <li><strong>Enjambre (Swarm):</strong> Multiples agentes identicos trabajan en paralelo en porciones del mismo problema. Ideal para procesamiento masivo de datos: 1,000 agentes procesando 1,000 documentos simultaneamente.</li>
</ol>

<img src="PENDIENTE_IMG_patrones_multi_agente.jpg" alt="Diagramas de los 4 patrones de arquitectura multi-agente: Pipeline, Hub-Spoke, Debate y Enjambre" class="lesson-image" />

<h2>Agentes Especializados: El Dream Team</h2>
<p>En un sistema multi-agente tipico para negocios, estos son los roles especializados mas comunes:</p>

<ul>
  <li><strong>Agente Router:</strong> El recepcionista. Recibe todas las solicitudes y las dirige al agente correcto. Clasifica por tema, urgencia, y complejidad.</li>
  <li><strong>Agente de Conocimiento:</strong> El bibliotecario. Tiene acceso a toda la base de conocimiento de la empresa y responde preguntas factuales con precision.</li>
  <li><strong>Agente de Accion:</strong> El ejecutor. Realiza acciones concretas: enviar emails, actualizar bases de datos, crear tickets, generar documentos.</li>
  <li><strong>Agente de Analisis:</strong> El analista. Procesa datos, identifica patrones, genera reportes, y hace predicciones.</li>
  <li><strong>Agente Guardian:</strong> El supervisor de calidad. Revisa el trabajo de otros agentes, detecta errores, y asegura que las respuestas cumplan con las politicas de la empresa.</li>
  <li><strong>Agente de Memoria:</strong> El archivista. Mantiene el historial de todas las interacciones, aprende de conversaciones pasadas, y proporciona contexto a los demas agentes.</li>
</ul>

<h2>Ejemplo Practico: Equipo de Soporte Multi-Agente</h2>
<p>Veamos como funcionaria un sistema multi-agente para soporte al cliente:</p>

<ol>
  <li><strong>Cliente escribe por WhatsApp:</strong> "Hola, mi pedido #4521 no ha llegado y ya pasaron 5 dias."</li>
  <li><strong>Agente Router analiza:</strong> "Tema: logistica. Urgencia: media. Sentimiento: frustrado. → Dirigir a Agente de Logistica."</li>
  <li><strong>Agente de Logistica consulta:</strong> Revisa el estado del pedido en la base de datos. Encuentra que esta "en transito" con un retraso de la paqueteria.</li>
  <li><strong>Agente de Accion ejecuta:</strong> Contacta la API de la paqueteria para obtener la ubicacion exacta y la fecha estimada de entrega actualizada.</li>
  <li><strong>Agente Guardian revisa:</strong> Verifica que la respuesta sea precisa, empatica, y cumpla con las politicas de compensacion (si el retraso supera el SLA, ofrece un descuento).</li>
  <li><strong>Respuesta al cliente:</strong> "Hola, lamento el retraso con tu pedido #4521. Ya lo localice: esta en la ciudad de destino y se entregara mañana antes de las 2pm. Como compensacion por el retraso, te aplicamos un 10% de descuento en tu proxima compra. ¿Puedo ayudarte en algo mas?"</li>
</ol>

<p>Todo esto sucede en <strong>menos de 10 segundos</strong>. Sin intervencion humana. 24/7.</p>

<h2>El Futuro: Agentes que Contratan Agentes</h2>
<p>La frontera de los sistemas multi-agente es la autonomia total: agentes que pueden crear y gestionar otros agentes segun las necesidades:</p>

<ul>
  <li><strong>Auto-escalamiento:</strong> Si el volumen de tickets aumenta un 300% en Black Friday, el sistema automaticamente lanza 10 agentes adicionales y los configura con la base de conocimiento necesaria.</li>
  <li><strong>Auto-especializacion:</strong> Si un tema nuevo empieza a aparecer frecuentemente (ej: un producto recien lanzado), el sistema crea un agente especializado en ese tema y lo entrena con la documentacion relevante.</li>
  <li><strong>Auto-optimizacion:</strong> Los agentes analizan su propio rendimiento, identifican areas de mejora, y se actualizan automaticamente.</li>
</ul>

<p>Esto no es ciencia ficcion. Empresas como Anthropic (con Claude Code multi-agente) y frameworks como CrewAI y AutoGen ya permiten construir estos sistemas hoy.</p>

<img src="PENDIENTE_IMG_futuro_multi_agente.jpg" alt="Diagrama futurista de un sistema multi-agente autonomo que crea y gestiona sub-agentes dinamicamente" class="lesson-image" />

<h2>Herramientas para Construir Sistemas Multi-Agente</h2>
<p>Si quieres experimentar con sistemas multi-agente, estas son las herramientas mas accesibles:</p>

<ul>
  <li><strong>CrewAI:</strong> Framework de Python para crear equipos de agentes. El mas popular y facil de usar. Define roles, tareas, y el framework coordina la ejecucion.</li>
  <li><strong>AutoGen (Microsoft):</strong> Framework robusto para conversaciones multi-agente. Los agentes "hablan" entre si para resolver problemas.</li>
  <li><strong>LangGraph:</strong> De los creadores de LangChain. Permite crear flujos de agentes como grafos, con control preciso sobre la orquestacion.</li>
  <li><strong>Claude Agent SDK (Anthropic):</strong> SDK para crear agentes basados en Claude con soporte nativo para MCP y herramientas.</li>
  <li><strong>OpenClaw + Skills:</strong> Sin codigo. Configura multiples "personajes" en OpenClaw, cada uno con sus propios skills, y coordinados por un skill orquestador.</li>
</ul>

<div class="practica-block">
  <h3>Practica Guiada</h3>
  <ul>
    <li><strong>Ejercicio 1:</strong> Diseña un sistema multi-agente para tu negocio. Dibuja (en papel o en una herramienta de diagramas) un diagrama con: los agentes necesarios, sus roles, como se comunican entre si, y el flujo de una solicitud tipica de principio a fin. No necesitas implementarlo: el objetivo es pensar en la arquitectura.</li>
    <li><strong>Ejercicio 2:</strong> Elige uno de los 4 patrones de arquitectura (Pipeline, Hub-Spoke, Debate, Enjambre) y escribe un caso de uso detallado de tu negocio donde ese patron seria el mas efectivo. Explica por que elegiste ese patron y no otro.</li>
    <li><strong>Ejercicio 3:</strong> Investiga CrewAI o AutoGen. Lee la documentacion basica y los ejemplos. Si eres tecnico, ejecuta el ejemplo "Hello World" de CrewAI: un equipo de 2 agentes que investigan un tema y escriben un articulo. Si no eres tecnico, ve un tutorial en YouTube y toma notas sobre las capacidades y limitaciones.</li>
  </ul>
</div>

<div class="cta-sinsajo">
  <p>¿Quieres un sistema multi-agente personalizado para tu empresa? <a href="https://screatorsai.com">Sinsajo Creators</a> diseña y construye sistemas multi-agente a medida: desde soporte al cliente hasta automatizacion completa de operaciones: <a href="tel:+16092885466">+1(609)288-5466</a> | <a href="mailto:ventas@sinsajocreators.com">ventas@sinsajocreators.com</a></p>
</div>',
    3,
    40
  );

  RAISE NOTICE 'Seed completado: Modulos 6 y 7 con 8 lecciones insertados en "Domina la IA" exitosamente.';

END $$;

COMMIT;