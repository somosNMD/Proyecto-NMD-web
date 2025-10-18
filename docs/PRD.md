# Proyecto Web NMD Product Requirements Document (PRD)

**Author:** Chelabs
**Date:** 2025-10-17
**Project Level:** 3
**Project Type:** web
**Target Scale:** 12-40 stories, 2-5 epics, full PRD + architect handoff

---

## Description, Context and Goals

Proyecto Web NMD será el hub digital oficial para el lanzamiento del álbum independiente del colectivo en marzo de 2026. El sitio, construido sobre Next.js y desplegado en Vercel, debe combinar storytelling en actos con módulos operativos que permitan activar campañas de pre-save, captar suscriptores y centralizar la relación con fans, prensa y promotores.

El MVP entregará una experiencia editorial limpia con hero modular, player audiovisual y CTA dirigidos, complementada por un modo "Portal" degradable que ofrece una capa inmersiva sin comprometer performance. Cada sección clave (agenda, press kit, booking, merch y comunidad) se abastecerá desde un CMS ligero para que el equipo gestione contenidos sin intervención técnica.

El proyecto busca equilibrar impacto visual con eficiencia operativa: reforzar la marca artística, acelerar cierres de shows y reducir la fricción interna en la preparación de materiales. El PRD consolida los requisitos para que diseño, desarrollo y stakeholders compartan un plan único antes de activar arquitectura y ejecución técnica.

### Deployment Intent

El objetivo de despliegue es lanzar una aplicación web de producción lista para operar campañas omnicanal desde febrero de 2026, con capacidad de escalar hacia experiencias inmersivas sin reescrituras profundas. El sitio funcionará como HQ público, con uptime y rendimiento acordes a un portal para fans y prensa durante picos de tráfico previos al lanzamiento.

### Context

El colectivo viene de una fase experimental con lanzamientos dispersos y presencia digital fragmentada. La ausencia de un hub oficial crea ineficiencias medibles: los fans deben recorrer múltiples enlaces para enterarse de shows (abandono estimado >30%), mientras prensa y promotores dependen de respuestas manuales que demoran hasta 48 horas. Con el álbum programado para marzo de 2026, la ventana operativa para coordinar campañas, giras y difusión se estrecha cada semana.

El análisis previo identificó dos frentes críticos. Para los fans inmersivos, la experiencia debe sostener la narrativa artística con tiempos de carga que no superen los 3 segundos y un modo Portal opcional que mantenga la magia sin sacrificar accesibilidad. Para los stakeholders de negocio, se necesitan workflows eficientes: press kit centralizado, métricas accionables y un CMS que evite reprocesos. Este PRD alinea ambas dimensiones (experiencia y operación) como base para las decisiones de diseño, contenido y roadmap técnico del MVP y sus iteraciones posteriores.

### Goals

1. Entregar MVP público antes del 15 de febrero de 2026 con storytelling por actos, agenda dinámica y CTA de pre-save activos.
2. Incrementar solicitudes formales de booking en un 40% vs. Q4 2025 mediante press kit descargable y formulario filtrado.
3. Capturar al menos 1.500 suscriptores verificados al boletín antes del lanzamiento del álbum, con automatización básica de nurture.
4. Reducir el tiempo de generación de materiales para prensa y promotores de 48 h a menos de 12 h gracias a un CMS con contenidos centralizados.
5. Habilitar medición omnicanal (GA4 + eventos personalizados) que permita evaluar conversiones de campañas y priorizar futuras iteraciones.

## Requirements

### Functional Requirements

1. **Story-driven Landing**: Hero modular con narrativa en actos, player multimedia integrado (Spotify/YouTube) y CTA dobles (pre-save + suscripción) visibles en primer scroll.
2. **Modo Portal Degradable**: Experiencia inmersiva opcional que se activa desde el hero, con degradación progresiva a assets livianos para dispositivos de baja potencia.
3. **Agenda Autogestionable**: Calendario de shows/eventos con categorías (en vivo, streaming, lanzamientos) y capacidad de resaltar próximos dos eventos, editable desde CMS.
4. **Press Kit Completo**: Sección protegida por CAPTCHA ligero con descargas de dossier PDF, fotos HD, bio corta/larga, ficha técnica y contactos.
5. **Módulo Booking**: Formulario con validación server-side que enruta solicitudes a management, con campos para venue, fecha tentativa y presupuesto.
6. **Sección Comunidad/Newsletter**: Formulario de suscripción integrado con herramienta de email marketing (p.ej. MailerLite) y mensajes de confirmación personalizados.
7. **Galerías Multimedia**: Grid responsive de fotos y clips, con lazy loading y soporte para etiquetar por acto/temporada desde el CMS.
8. **Integración Merch/Shop**: Bloque destacando productos clave con enlaces a plataforma externa, soportando campañas temporales.
9. **Analítica Amplia**: Instrumentación de GA4 y eventos personalizados (pre-save, descargas press kit, envíos de booking, suscripciones) visible vía dashboard interno o exportable.
10. **Panel de Administración Ligero**: Integración con Notion/Sanity para crear/editar secciones, con roles básicos para management y equipo creativo.
11. **SEO y Social Metadata**: Configuración de metadatos dinámicos (OpenGraph, Twitter Cards) por sección, con previsualización desde CMS.
12. **Soporte Multilenguaje**: Estructura preparada para español/inglés, con fallback a español si no hay contenido traducido.
13. **Rendimiento Controlado**: Mecanismo para activar/desactivar animaciones avanzadas (GSAP/Framer Motion) según preferencia del usuario o capacidades del dispositivo.
14. **Módulo de Testimonios y Prensa**: Carrusel editable con citas destacadas y logos, optimizado para credibilidad ante promotores.
15. **Gestión de Contenidos Temporales**: Capacidad de programar publicaciones (ej. revelación de tracklist) y expiración automática de banners.

### Non-Functional Requirements

1. **Performance**: LCP < 2.5s en desktop y < 3s en mobile para la landing principal aun con hero multimedia; uso de imágenes optimizadas (WebP/WebM) y streaming progresivo.
2. **Disponibilidad**: Uptime mensual ≥ 99.5% durante campaña de lanzamiento; fallback estático si falla el CMS.
3. **Escalabilidad**: Capacidad de manejar picos de 5x el tráfico base mediante caché en CDN y rutas estáticas + ISR.
4. **Accesibilidad**: Cumplimiento WCAG 2.1 AA en navegación principal, contrastes y controles multimedia, incluyendo modo Portal degradado.
5. **Seguridad**: Protección básica contra bots (rate limiting, hCaptcha invisible) y sanitización de formularios con almacenamiento cifrado de datos sensibles.
6. **Mantenibilidad**: Arquitectura con componentes reutilizables, documentación en repo y handoff claro para futuras expansiones (Modo Portal avanzado, edición bilingüe).
7. **SEO**: Puntuación > 90 en Lighthouse SEO y estructura de URL semántica; sitemap y RSS generados automáticamente.
8. **Observabilidad**: Instrumentación de logs y métricas (Vercel + GA4 + Plausible opcional) con alertas básicas para caídas de servicios externos.
9. **Internacionalización**: Soporte para traducciones con archivos de locales y fallback seguro; evitar duplicación de contenido en SEO.
10. **Privacidad y Cumplimiento**: Consentimiento explícito para cookies/analytics (GDPR-like), almacenamiento de datos en servicios conformes.

## User Journeys

1. **Fan inmersivo - Pre-save + Portal**  
   - Llega desde campaña en redes, aterriza en hero con narrativa del álbum.  
   - Reproduce teaser audiovisual, activa pre-save con un clic y se suscribe al newsletter.  
   - Explora modo Portal para desbloquear contenido adicional (tracklist teaser, fondos descargables).  
   - Recibe correo de confirmación con CTA al calendario de shows.  
   - **Contingencias**: Mostrar opción "versión ligera" ante conexiones débiles y medir el flujo Portal hacia CTA críticos.

2. **Promotor/Prensa - Booking y press kit**  
   - Llega vía enlace directo compartido por management.  
   - Accede a sección "Press & Booking", descarga dossier PDF y fotos HD tras resolver CAPTCHA ligero.  
   - Revisa testimonios y agenda confirmada, envía formulario con filtros de evento (fecha, venue, propuesta).  
   - Recibe respuesta automática confirmando recepción y tiempo estimado (<12 h).  
   - **Contingencias**: Proveer enlaces CDN y tokens temporales en picos de tráfico; reforzar validaciones anti-spam en booking.

3. **Fan curioso - Agenda y merch**  
   - Descubre el sitio por SEO o recomendación.  
   - Revisa bloques de narrativa y secciones de comunidad.  
   - Encuentra calendario con próximos shows, utiliza CTA de compra de entradas.  
   - Visita módulo de merch destacado, redirigido a plataforma externa con código promocional.  
   - **Contingencias**: Ofrecer fallback parcial en inglés para CTA críticos y monitorear conversiones hacia merch y agenda.

4. **Portal dominante - Derivar a objetivos operativos**  
   - Usuarios permanecen dentro del modo Portal tras activarlo.  
   - Se incluyen CTAs persistentes hacia agenda, press kit y comunidad.  
   - Métricas específicas rastrean cuántos usuarios regresan a la experiencia estándar.  
   - **Contingencias**: Ajustar balance entre inmersión y objetivos de negocio mediante tests A/B cuando la conversión caiga.

5. **Resiliencia ante picos y spam**  
   - Durante cobertura mediática, aumenta la demanda de press kit y formularios.  
   - Sistema distribuye descargas mediante CDN, cache y throttling suave.  
   - Formularios incorporan honeypot, rate limiting y diferenciación de SLA según verificación.  
   - **Contingencias**: Dashboard de alertas y mensajes contextuales para gestionar expectativas de respuesta.

## UX Design Principles

1. **Narrativa guiada**: Cada secciÃ³n debe contar una parte del acto del Ã¡lbum, con copy claro y progresiÃ³n visual coherente.
2. **Prioridad mobile-first**: DiseÃ±os responsivos optimizados para pantallas pequeÃ±as, asegurando CTA visibles y legibles.
3. **Progresive enhancement**: El modo Portal y microanimaciones se activan como capa opcional; la experiencia base funciona sin JS avanzado.
4. **Velocidad percibida**: Cargar assets pesados de forma diferida, mostrar placeholders y feedback inmediato tras interacciones crÃ­ticas.
5. **Claridad operativa**: Formularios y CTA con mensajes de estado, errores amigables y confirmaciones automÃ¡ticas.
6. **Consistencia visual**: Sistema de diseÃ±o con tipografÃ­as y paleta inspirada en narrativa del Ã¡lbum para todas las secciones.
7. **Accesibilidad sonora/visual**: Controles para audio/video, subtÃ­tulos y atajos que respeten necesidades diversas.
8. **Credibilidad profesional**: Combinar storytelling artÃ­stico con elementos de confianza (testimonios, logos, datos claros).
9. **Control de usuario**: Ofrecer opciones para pausar animaciones, saltar modo Portal, elegir idioma sin perder contexto.
10. **Escalabilidad modular**: Componentes preparados para nuevas secciones (p.ej. experiencias inmersivas) sin rediseÃ±o completo.

## Epics

| Epic | Objetivo central | Resultados clave |
| --- | --- | --- |
| EP-1 Storytelling Landing & Portal | DiseÃ±ar landing narrativa y modo Portal degradable que activen pre-save y reflejen identidad artÃ­stica | Hero modular publicado, modo Portal con degradaciÃ³n progresiva, CTA configurados y medidos |
| EP-2 Operaciones & Press Hub | Consolidar agenda, booking y press kit para acelerar cierres con promotores y prensa | Calendario autogestionable, press kit descargable, flujos de booking con SLA <12h |
| EP-3 Comunidad & MonetizaciÃ³n | Aumentar suscripciones y monetizar fandom con merch y journeys de fidelizaciÃ³n | Newsletter integrado, campaÃ±as programables, mÃ³dulos de merch y testimonios publicados |
| EP-4 Observabilidad & Gobernanza | Instrumentar analÃ­tica, performance y CMS para iteraciones continuas | Eventos GA4 configurados, panel de mÃ©tricas, internacionalizaciÃ³n lista para ES/EN |
| EP-5 Plataforma de Contenidos | Implementar CMS ligero y pipeline editorial para mantener narrativa viva | Modelos de contenido publicados, roles definidos, automatizaciÃ³n de publicaciones |

Detalles completos (historias representativas y criterios de aceptaciÃ³n) en `docs/epics.md`.

Este esquema cubre 5 epics con 12-40 historias estimadas, alineadas al roadmap Level 3.

## Out of Scope

1. Desarrollo de experiencia 3D avanzada persistente (modo Portal completo con WebGL pesado y assets 4K).
2. Integraciones de ticketing completas con procesamiento de pagos dentro del sitio (se mantendrÃ¡n enlaces externos).
3. ImplementaciÃ³n de plataforma de membresÃ­as con paywall o monetizaciÃ³n recurrente.
4. AutomatizaciÃ³n de campaÃ±as de marketing (flows complejos de email/SMS mÃ¡s allÃ¡ de confirmaciones bÃ¡sicas).
5. GeneraciÃ³n de contenidos bilingÃ¼es completos (solo estructura y fallback, traducciones se planificarÃ¡n despuÃ©s del MVP).

---

## Next Steps

1. Preparar handoff al arquitecto con este PRD, epics.md y brief base; alinear bloqueadores tÃ©cnicos antes de solution-architecture.
2. Definir backlog de investigaciÃ³n UX (actos narrativos, guÃ­as de microinteracciÃ³n) y agendar workshops para UX specification workflow.
3. Configurar stack CMS (Notion/Sanity) y crear modelos iniciales para contenido crÃ­tico (hero, agenda, press kit).
4. Establecer plan de instrumentaciÃ³n GA4/Plausible con eventos definidos y owners responsables de monitoreo.
5. Coordinar sprint 0 de desarrollo: setup repo, CI/CD en Vercel, guidelines de componentes y cuadro de riesgos inicial.

## Document Status

- [ ] Goals and context validated with stakeholders
- [ ] All functional requirements reviewed
- [ ] User journeys cover all major personas
- [ ] Epic structure approved for phased delivery
- [ ] Ready for architecture phase

_Note: See technical-decisions.md for captured technical context_

---

_This PRD adapts to project level 3 - providing appropriate detail without overburden._

