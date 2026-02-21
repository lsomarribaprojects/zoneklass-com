# Changelog

## [0.1.0] - 2025

### Paso 1: Proyecto Base
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS con tema custom (colores, tipografia, animaciones)
- Arquitectura feature-first

### Paso 2: Autenticacion
- Login/Signup con Supabase Auth
- Recuperacion de password
- Middleware de proteccion de rutas
- Perfiles automaticos con trigger SQL

### Paso 3: Layout Principal
- Header con navegacion responsive
- Sidebar para desktop
- Bottom navigation para mobile
- Soporte dark mode

### Paso 4: Catalogo de Cursos
- CRUD completo de cursos (admin)
- Catalogo publico con filtros (categoria, nivel, busqueda)
- Tarjetas de curso con preview
- Modulos y lecciones anidados

### Paso 5: Inscripciones
- Sistema de enrollment
- Tracking de progreso por leccion
- Seccion "Mis Cursos" en dashboard

### Paso 6: Lecciones
- Reproductor de video
- Contenido markdown con tipografia
- Sidebar de navegacion del curso
- Completar leccion con XP

### Paso 7: Invite Links (Admin)
- Generacion de links de invitacion con QR
- Tracking de uso por link
- Gestion desde panel admin

### Paso 8: Comunidad
- Feed de posts con categorias
- Comentarios y likes
- Mensajes directos entre usuarios
- Sistema de notificaciones en tiempo real

### Paso 9: Gamificacion
- Sistema de XP y niveles
- Badges con condiciones automaticas
- Leaderboard global
- Rachas de actividad

### Paso 10: Hanna (Tutora IA)
- Chat con streaming via OpenRouter
- 6 modos de tutoria (explicar, quiz, resumen, practica, debug, freestyle)
- Historial de conversaciones
- Rating de respuestas

### Paso 11: Admin Dashboard
- Metricas (usuarios, cursos, enrollments, XP)
- Gestion de usuarios y roles
- Panel de configuracion de Hanna
- Visualizacion de conversaciones IA

### Paso 12: Emails Automaticos
- Integracion con Resend + React Email
- 5 templates: Welcome, Enrollment, Completion, Badge, Weekly Digest
- Preferencias de email por usuario
- Trigger automatico en eventos clave

### Paso 13: Preparacion para Produccion
- Fix de inicializacion lazy para Resend (build-safe)
- SEO: metadata completa, Open Graph, sitemap, robots.txt
- Loading skeletons en todas las rutas principales
- Limpieza de archivos innecesarios
- Documentacion actualizada
