# Proyecto Web NMD - Arquitectura de Solución
Generado el 2025-10-18 por Winston (Architect)

## 0. Evaluación de prerrequisitos y escala

### Estado del workflow
- Archivo de status: docs/project-workflow-status-2025-10-17.md
- Modo standalone: no
- Paso actual registrado: ux-spec
- Próximo paso previsto: solution-architecture

### Perfil del proyecto
- Nivel: 3 (scale-adaptive requerido)
- Tipo de proyecto: web
- Naturaleza: greenfield
- Interfaz de usuario requerida: sí — complejidad **compleja** (modo Portal inmersivo, múltiples flujos operativos según UX v1.0)

### Prerrequisitos
- PRD en docs/PRD.md: disponible y marcado como completo
- Especificación UX en docs/ux-specification.md: versión 1.0 vigente, lista para handoff a arquitectura
- Resultado: sin bloqueadores identificados; continuar con la generación de arquitectura

### Notas iniciales
- El PRD y la especificación UX serán las fuentes primarias para decisiones arquitectónicas.
- La complejidad UI confirmada implica estrategias front-end con progressive enhancement y control de rendimiento desde el inicio.

## 1. Análisis de PRD y UX

### Entendimiento del proyecto
- Landing narrativa que combina storytelling por actos con operaciones (agenda, press kit, booking) para el lanzamiento del álbum 2026.
- MVP sobre Next.js en Vercel con foco en progressive enhancement: modo Portal inmersivo pero degradable, control de animaciones y performance.
- Equipo pequeño necesita CMS ligero (Notion o Sanity) y automatizaciones simples para responder a promotores (<12 h) y nutrir comunidad.

### Requisitos funcionales (PRD)
1. Story-driven landing con player multimedia y doble CTA (pre-save y suscripción) visible en primer scroll.
2. Modo Portal degradable: experiencia inmersiva opcional con fallback para dispositivos modestos.
3. Agenda autogestionable con categorías, resaltado de próximos eventos y edición desde CMS.
4. Press kit completo con descargas protegidas (dossier, fotos, bio, ficha técnica, contactos) y CAPTCHA ligero.
5. Módulo booking con validación server-side y enrutamiento de solicitudes (venue, fecha, presupuesto).
6. Sección comunidad/newsletter integrada con herramienta de email marketing y confirmaciones personalizadas.
7. Galerías multimedia responsive con lazy loading y etiquetado por acto/temporada desde CMS.
8. Integración merch/shop con bloques destacados y soporte a campañas temporales.
9. Analítica amplia: GA4 + eventos personalizados, dashboard interno/exportable.
10. Panel de administración ligero vía CMS con roles básicos para management y creativo.
11. SEO y social metadata dinámicos (OpenGraph/Twitter) con previsualización desde CMS.
12. Soporte multilenguaje (ES/EN) con fallback seguro.
13. Control de rendimiento: interruptor de animaciones avanzadas según preferencia/capacidad del dispositivo.
14. Módulo testimonios y prensa (citas + logos) optimizado para credibilidad.
15. Gestión de contenidos temporales con programación y expiración automática.

### Requisitos no funcionales (PRD)
1. Performance: LCP < 2.5s desktop y < 3s mobile en la landing aun con hero multimedia; assets optimizados (WebP/WebM, streaming progresivo).
2. Disponibilidad: uptime mensual 99.5% durante campaña; fallback estático si falla el CMS.
3. Escalabilidad: picos 5x mediante CDN + rutas estáticas/ISR.
4. Accesibilidad: cumplimiento WCAG 2.1 AA y modo Portal degradado accesible.
5. Seguridad: rate limiting, hCaptcha invisible, sanitización de formularios y cifrado de datos sensibles.
6. Mantenibilidad: componentes reutilizables, documentación en repo y handoff claro.
7. SEO: Lighthouse > 90, URLs semánticas, sitemap y RSS automáticos.
8. Observabilidad: logs/métricas (Vercel, GA4, Plausible opcional) y alertas básicas.
9. Internacionalización: archivos de locales con fallback seguro; evitar duplicación SEO.
10. Privacidad: consentimiento explícito para cookies/analytics (GDPR-like) y almacenamiento en servicios conformes.

### Epics y cobertura representativa (PRD + epics.md)
- EP-1 Storytelling Landing & Portal: hero modular, Portal degradable, galerías categorizadas.
- EP-2 Operaciones & Press Hub: agenda autogestionable, press kit descargable, booking con SLA <12 h.
- EP-3 Comunidad & Monetización: newsletter con doble opt-in, campañas programables, módulos de merch/testimonios.
- EP-4 Observabilidad & Gobernanza: eventos GA4, panel métricas, controles de consentimiento y rendimiento.
- EP-5 Plataforma de Contenidos: modelos CMS, roles, versionado y procesos editoriales.
  Historias cubren activación del Portal, publicación de assets, flujos de booking y governance de contenidos.

### Especificación UX (versión 1.0)
- Screen count: 9 principales (Home, Experiencia Portal, Agenda lista, Agenda detalle, Comunidad, Portal Profesional, Multimedia, Merch & Apoyo, Acerca/Contacto) + derivados (press kit modal, booking form, toggles persistentes).
- Navigation complexity: compleja; menú primario de 6 entradas, secundarios persistentes (pre-save, Portal), drawer mobile y breadcrumbs en secciones profundas.
- UI complexity: compleja; incluye modo inmersivo, formularios multi-campo, toggles de animación/idioma, componentes con estados ricos y contenido programable.
- Key user flows: Fan inmersivo (pre-save + Portal), Promotor/Prensa (press kit + booking), Fan curioso (agenda + merch), Retención dentro del Portal, Resiliencia ante picos/spam.
- Component patterns: hero modular por actos, cards agenda, toggles portal/idioma, formularios con validación inmediata, carruseles de testimonios, grids multimedia responsive.
- Responsive requirements: breakpoints XS/SM/MD/LG/XL, grid 12 columnas desktop / 4 mobile, degradación del Portal en mobile, sliders en multimedia.
- Accesibilidad: WCAG 2.1 AA, controles teclado, subtítulos audio/video, announces aria-live para toggles, reduce motion.
- Design tokens: paleta nocturna (hex definidos), tipografías (Headline XL 56/64, Body M 16/24, etc.), escala de espaciado 8px.
- Performance cues: animaciones ≤250 ms con prefers-reduced-motion, lazy loading multimedia, placeholders para percepciones de velocidad.
- Entregables: Figma workspace con screens clave (Home, Portal Profesional, Agenda detalle), Storybook inicial, tokens exportados a JSON, checklist de handoff.

### Características detectadas
- Tipo de proyecto: web SPA/SSR con Next.js + deploy Vercel.
- UI complexity: compleja (Portal inmersivo, múltiples flujos operativos, toggles de experiencia).
- Arquitectura sugerida: front modular sobre Next.js (ISR/SSG), backend ligero para formularios + integraciones (MailerLite, CRM), posible separación de CMS headless.
- Estrategia de repositorio: tendencia a monorepo (Next.js + Storybook + infra) con conectores externos (CMS, email, analytics).
- Necesidades especiales: progressive enhancement fuerte, integración CMS headless, manejo de assets pesados, tracking granular GA4, anti-spam y fallback offline parcial.

### Conocido vs. por definir
- Tecnologías confirmadas: Next.js, Vercel, GA4, MailerLite (o similar), CMS ligero (Notion/Sanity), Storybook, hCaptcha, posible GSAP/Framer Motion.
- Pendiente de decisión: elección definitiva de CMS (Notion vs Sanity) y pipeline de preview, herramienta de observabilidad complementaria (Plausible opcional), almacenamiento/backoffice de datos de booking (CRM/inbox), estrategia SEO (implementación de metadatos dinámicos), internacionalización (estructura de locales y proceso editorial EN).
- Supuestos abiertos: asset pipeline para Portal (optimización WebGL/Lottie), mecanismo de fallback estático, ownership del dashboard métricas.

### Alineación PRD-UX y brechas
- Cobertura completa entre FR1–FR9 y pantallas/flows definidos (hero, Portal, agenda, press hub, newsletter, multimedia, merch, analítica).
- FR10 (panel de administración) cubierto conceptualmente por EP-5, pero UX aún no detalla interfaz de gestión interna → requiere aclarar alcance (UI interna o solo CMS externo).
- FR11 (SEO metadata) y NFR7 se mencionan en PRD pero sin tratamiento específico en la UX → necesita definición de componentes de previsualización/meta configurables.
- FR13 (control de animaciones) soportado por toggles en UX; confirmar diseño de ajustes persistentes.
- Catalogación de testimonios/logos y programación de campañas aparece en UX (componentes modulables), sin riesgo.
- No se detectan epics sin soporte UX; tampoco pantallas extra sin epic relacionado. Gaps principales: UI para administración interna y detalle de configuraciones SEO/i18n.

## 2. Configuración de contexto

- Nivel de experiencia del usuario: principiante (sección detallada con ejemplos y racionales).
- Preferencias técnicas declaradas: ninguna adicional registrada hasta el momento.

## 3. Patrón arquitectónico (borrador inicial)

- Estilo arquitectónico: monolito modular tipo JAMstack sobre Next.js con SSR/ISR y funciones serverless para backoffice de formularios.
- Estrategia de repositorio: monorepo que aloja sitio, Storybook/tokens y automatizaciones de infraestructura.
- Renderizado web: páginas críticas en SSR/ISR para narrativa y SEO, con páginas auxiliares SSG y modo Portal con progressive enhancement controlado.
- Justificación: equipo pequeño, necesidad de coherencia en storytelling/UX, integraciones moderadas y compromiso fuerte con performance y SEO.

### Componentes primarios y responsabilidades
| Componente | Responsabilidades clave | Tecnologías / servicios | Dependencias directas |
| ---------- | ----------------------- | ----------------------- | --------------------- |
| **Frontend Next.js** | Renderizado SSR/ISR, control del modo Portal, orquestación de flujos UI, integración de analytics | Next.js 14, React, Vercel Edge/Serverless | CMS headless, Storybook/tokens, APIs serverless |
| **Funciones serverless (APIs)** | Procesar booking, contabilizar press kit, recibir webhooks de MailerLite, gestionar preferencias | Vercel Functions / Edge Functions | Frontend, MailerLite, almacenamiento ligero (KV / storage) |
| **CMS headless** | Modelado y publicación de contenidos (actos, agenda, testimonios), scheduling y expiración | Sanity (preferido) o Notion + adaptador | Frontend (revalidación ISR), almacén de assets, flujos editoriales |
| **Storybook + Design tokens** | Biblioteca de componentes, sincronización UX/UI, handoff del modo Portal | Storybook, Style Dictionary/tokens JSON | Frontend, CMS (referencias), pipeline de QA |
| **Integraciones externas** | Email marketing, analytics, anti-bot, video/audio | MailerLite, GA4, Plausible opcional, hCaptcha, proveedores media | Frontend, serverless, CMS (metadatos) |
| **Infraestructura de despliegue** | Hosting, CDN, revalidación ISR, observabilidad básica | Vercel, GitHub Actions (CI/CD ligero), Vercel Observability | Monorepo, integraciones de métricas/logging |

### Mapa de dependencias y flujos
1. **CMS headless → Frontend Next.js**  
   - Webhooks del CMS disparan 
evalidatePath para mantener páginas narrativas actualizadas sin rebuild completo.  
   - Los modelos (actos, agenda, press kit) se reflejan en componentes composables; se documentan esquemas para evitar rompe builds.
2. **Frontend → Funciones serverless**  
   - Formularios (booking, newsletter) envían payload a endpoints con hCaptcha + rate limiting.  
  - Preferencias del usuario (Portal, animaciones, idioma) se guardan en cookies/edge storage para persistencia.
3. **Funciones serverless → Integraciones externas**  
   - Booking redirige a CRM/inbox o MailerLite API; se registra acuse automático.  
   - Descargas de press kit generan métricas en storage ligero (KV/Planetscale) y enlaces firmados CDN.
4. **Frontend → Integraciones directas**  
   - GA4/Plausible se inicializan en SSR y respetan consentimiento.  
   - Player multimedia integra Spotify/YouTube con fallback progresivo.
5. **Monorepo → CI/CD y observabilidad**  
   - Pipelines ejecutan lint/test, Storybook y build Preview. Deploy automatizado en Vercel (Preview/Production).  
   - Alertas (webhook Slack/email) para fallos en funciones o revalidaciones; monitor de rendimiento vía Vercel Analytics.

### Impacto en decisiones clave
- **Performance:** Minimiza llamadas externas en caminos críticos y aprovecha CDN en SSR/ISR.
- **Resiliencia:** Si el CMS cae, la versión cacheada sigue operativa; las funciones serverless están desacopladas del render.
- **Escalabilidad:** Elasticidad frente a picos (press kit, booking, campañas).
- **Mantenibilidad:** Monorepo alinea tokens, componentes y automatizaciones; responsabilidad clara por capa facilita onboarding y evolución.

## 4. Límites de componentes por épica

### Análisis por épica
| Épica | Capacidades dominantes | Datos principales | Integraciones clave | Observaciones |
| ----- | ---------------------- | ----------------- | ------------------- | ------------- |
| EP-1 Storytelling Landing & Portal | Narrativa en actos, portal inmersivo, gestión de hero multimedia | Actos del álbum, assets hero, configuraciones de Portal, toggles de usuario | CDN de media, proveedores streaming (Spotify/YouTube), telemetría GA4 | Requiere control fino de performance y degradación progresiva; depende de tokens UI y preferencia de usuario |
| EP-2 Operaciones & Press Hub | Agenda de shows, press kit descargable, flujo de booking con SLA | Agenda/eventos, dossier, fotos HD, solicitudes de booking, métricas de descarga | CMS headless, almacenamiento de assets, MailerLite/CRM, hCaptcha | Dependencia fuerte de funciones serverless para validaciones y automatización de respuestas |
| EP-3 Comunidad & Monetización | Newsletter, campañas temporales, módulos de merch/testimonios | Leads de comunidad, configuraciones de campañas, catálogo de merch, testimonios | MailerLite (API), plataforma de merch externa, GA4/Plausible | Comparte componentes UI con landing pero requiere reglas de negocio para expiración/programación |
| EP-4 Observabilidad & Gobernanza | Telemetría GA4, cumplimiento de consentimiento, dashboards de métricas | Eventos de analytics, configuraciones de consentimiento, logs operativos | GA4, Plausible opcional, Vercel Analytics, Slack/email webhooks | Alimenta decisiones de evolución; necesita hooks en frontend y funciones serverless |
| EP-5 Plataforma de Contenidos | Modelado CMS, workflows editoriales, versionado de contenido | Modelos CMS (actos, agenda, testimonios), metadatos SEO, estados de publicación | Sanity/Notion, GitHub Actions (preview), Vercel ISR | Orquesta revalidaciones y gobernanza del contenido; núcleo del pipeline de publicaciones |

### Propuesta de componentes lógicos
- **Experience Shell**: capa Next.js que entrega landing, Portal y navegación; agrupa EP-1 y UI compartida con EP-3. Responsable del SSR/ISR y toggles de accesibilidad/performance.
- **Operations Hub**: conjunto de rutas y APIs para agenda, press kit y booking (EP-2). Usa almacenamiento estructurado (CMS + storage) y funciones serverless con validaciones de seguridad.
- **Community Engine**: funcionalidades de captura y personalización de comunidad/merch (EP-3). Coordina newsletters, campañas temporales y enlaces a plataformas externas.
- **Insight & Governance Layer**: observabilidad, consentimiento, reporting (EP-4). Se materializa en hooks de frontend + jobs/funciones para métricas y alertas.
- **Content Platform Connector**: integración con el CMS headless, manejo de modelos, previsualizaciones y webhooks (EP-5). Expone SDK ligero para que Experience Shell y Operations Hub consuman contenido normalizado.
- **Shared Services**: utilidades transversales (design tokens, autenticación ligera si se requiere futuro, librería de tracking, módulo de preferencias persistentes).

### Estilo arquitectónico consolidado
- **Modular monolith JAMstack**: cada componente es un módulo claro dentro del mismo repo Next.js, con barreras lógicas (carpetas /packages) y contratos tipados.
- **Monorepo**: aloja frontend, Storybook, funciones serverless y utilidades compartidas; facilita CI/CD y sincronización de tokens.
- **Integración externa desacoplada**: todas las integraciones se realizan mediante adaptadores en Shared Services para evitar acoplamiento directo en módulos de dominio.

### Mapeo épica → componente
| Épica | Componente principal | Componentes de soporte |
| ----- | -------------------- | ---------------------- |
| EP-1 | Experience Shell | Content Platform Connector, Shared Services |
| EP-2 | Operations Hub | Content Platform Connector, Shared Services, Insight & Governance |
| EP-3 | Community Engine | Experience Shell, Shared Services, Integraciones externas |
| EP-4 | Insight & Governance Layer | Shared Services, Functions serverless |
| EP-5 | Content Platform Connector | Shared Services, GitHub Actions/CI/CD |
## 5. Decisiones específicas para proyecto web

### Stack frontend
- Framework: **Next.js 14 (App Router)**, nativo para SSR/ISR y Progressive Enhancement del modo Portal.
- Estilos: **Tailwind CSS** apoyado en design tokens exportados (colores, tipografías, spacing) sincronizados con Storybook.
- Estado del cliente: React Query/SWR para estado remoto; Context API con hooks locales para toggles (Portal, idioma, animaciones) y Zustand si emerge estado complejo.

### Capa backend ligera
- API y lógica: **Funciones serverless de Vercel** con control de versiones y adaptadores por dominio (booking, press kit, preferencias).
- Paradigma API: **REST JSON** simple; contratos tipados (TypeScript zod) compartidos con frontend.
- Persistencia operacional: **Supabase PostgreSQL + Prisma** para registrar solicitudes de booking, métricas de press kit y preferencias persistentes; facilita reporting y auditoría.

### Integraciones clave
- Email/newsletter: **MailerLite API** para suscripciones y envíos transaccionales con confirmación (<12 h).
- Analytics: **GA4 + Vercel Analytics**; Plausible opcional si se requiere visión privacy-first adicional.
- Anti-spam: **hCaptcha invisible** en formularios críticos.
- Almacenamiento de assets pesados: **Sanity DAM** (o CDN del CMS) complementado con caché CDN Vercel.

### Autenticación y seguridad
- Acceso público sin login; protección de formularios vía hCaptcha + rate limiting.
- Panel interno futuro: se recomienda evaluar Supabase Auth o Clerk si aparece necesidad.

### Deployment y CI/CD
- Hosting: **Vercel** (preview + producción) con revalidación ISR controlada por webhooks.
- CI/CD: **GitHub Actions** para lint/tests, storybook, validación de esquemas CMS y despliegues automáticos.

### Datos y búsqueda
- Base principal: **Supabase Postgres** (schema minimalista: booking_requests, presskit_metrics, user_preferences).
- Search: PostgreSQL full text por ahora; si escala se evalúa Algolia/Meilisearch.

### Monitoreo y observabilidad
- Errores: **Sentry** para frontend/serverless.
- Logs/metrics: Vercel Observability + dashboards GA4; alertas Slack/email mediante hooks en funciones serverless.

### Servicios opcionales
- Email transaccional alterno: **Resend** si se requiere plantillas custom fuera de MailerLite.
- CMS preview: **GitHub Actions + Vercel Preview** con enlaces seguros para stakeholders.

Decisiones justificadas por requerimientos PRD/UX: telemetría granular, control de performance, necesidad de histórico (booking), y equipo pequeño que se beneficia de un stack integrado y manejable.
# Solution Architecture Document

**Project:** Proyecto Web NMD
**Date:** 2025-10-18
**Author:** Chelabs

## Executive Summary

El sitio Proyecto Web NMD evoluciona el PRD y la especificación UX en una plataforma web modular que combina storytelling inmersivo con flujos operativos críticos (press kit, booking, comunidad). La arquitectura seleccionada es un monolito modular sobre Next.js 14 desplegado en Vercel, reforzado por funciones serverless y un CMS headless (Sanity) que habilitan actualizaciones rápidas sin sacrificar performance. El documento detalla decisiones tecnológicas, organización del código, modelos de datos y planes de observabilidad para guiar al equipo paso a paso desde la construcción hasta el mantenimiento.

## 1. Technology Stack and Decisions

### 1.1 Technology and Library Decision Table

| Category         | Technology                             | Version                | Justification |
| ---------------- | --------------------------------------- | ---------------------- | ------------- |
| Framework        | Next.js                                 | 14.2.3                 | Soporta SSR/ISR, App Router y edge functions nativas para el modo Portal y SEO exigente. |
| Language         | TypeScript                              | 5.4.2                  | Tipado estático que reduce errores y habilita contratos compartidos entre front y serverless. |
| Database         | Supabase PostgreSQL                     | 15.3 (managed)         | Postgres administrado con Webhooks; simplifica métricas de booking y escalamiento sin DBA propio. |
| Authentication   | hCaptcha Invisible                      | 1.0                    | Protege formularios públicos sin obligar a login; cumple el requisito anti-spam del PRD. |
| Hosting          | Vercel Platform                         | 2025.10                | Plataforma optimizada para Next.js con ISR, CDN global y previews automáticos para stakeholders. |
| State Management | TanStack Query                          | 5.0.5                  | Cachea estado remoto (booking, newsletter) con invalidaciones sencillas y soporte SSR. |
| Styling          | Tailwind CSS                            | 3.4.4                  | Utility-first compatible con tokens del diseño; acelera implementación responsive. |
| Testing          | Vitest + Playwright                     | 1.3.1 / 1.48.0         | Vitest cubre unidades/componentes y Playwright valida flujos críticos de usuario y modo Portal. |
| CMS              | Sanity Content Lake                     | 2025.09                | CMS headless que soporta modelos ricos (actos, agenda) y webhooks para revalidar ISR. |
| ORM              | Prisma                                  | 5.9.1                  | Genera migraciones seguras y clientes tipados hacia Supabase; facilita evolución del esquema. |
| Email/Newsletter | MailerLite API                          | v2.0                   | Cumple objetivo de respuestas <12 h y doble opt-in sin infraestructura propia. |
| Analytics        | Google Analytics 4 (gtag.js)            | 2025.1                 | Permite medir conversiones (pre-save, press kit) y alimentar dashboards de EP-4. |
| Logging          | Pino                                    | 8.17.0                 | Logs estructurados en serverless con bajo overhead y exportación sencilla a Vercel Observability. |
| Observability    | Sentry                                  | 7.96.0                 | Rastrea errores front/serverless con releases versionadas, útil para campañas críticas. |

## 2. Application Architecture

### 2.1 Architecture Pattern

Modular monolith JAMstack: una única app Next.js 14 estructurada en módulos por dominio (Experience Shell, Operations Hub, Community Engine, Insight & Governance y Content Connector). Compartimos herramienta, repositorio y pipeline, pero cada módulo mantiene límites claros mediante directorios base (`/modules/<dominio>`) y contratos tipados. El patrón minimiza la fricción para un equipo pequeño y deja abierta la puerta a extraer microservicios si la demanda futura lo exige.

### 2.2 Server-Side Rendering Strategy

- Las páginas hero, Portal, agenda y portal profesional se renderizan con SSR (server components) para asegurar tiempos de respuesta <3s y entregar metadatos completos a buscadores.
- ISR (incremental static regeneration) con `revalidatePath` se usa en secciones de contenido (testimonios, comunidad, merch). Webhooks desde Sanity disparan revalidaciones cada vez que se publica o programa contenido.
- Rutas auxiliares (blog, FAQs, páginas legales) se generan como SSG con builds programados para reducir coste y mantener respuestas ultrarrápidas.

### 2.3 Page Routing and Navigation
- App Router con segmentos anidados: `/app/(marketing)/` para secciones públicas, `/app/(portal)/portal` para la experiencia inmersiva y `/app/(professional)/press-kit` para press hub.
- Route Groups controlan variaciones del layout (layout inmersivo vs layout operativo) sin romper caching.
- Middleware en `middleware.ts` detecta preferencia de idioma/animaciones desde cookies y enruta a la variante adecuada.
- Se definen enlaces persistentes (portal, pre-save) mediante componentes `Link` con estados accesibles.
- Checklist de accesibilidad del modo Portal documentado en Storybook (`stories/accessibility/portal-checklist.mdx`) guía pruebas manuales (contraste, navegación teclado, toggles) y ejecuta validación automatizada con axe-core en CI (`npm run test:accessibility`).

### 2.4 Data Fetching Approach

- Server Components recuperan datos del CMS vía SDK oficial de Sanity y de Supabase mediante Prisma en el servidor, evitando exponer claves en el cliente.
- TanStack Query maneja datos que requieren interacción del usuario (estado de formularios, toggles del Portal) y revalida en segundo plano.
- Las funciones serverless actúan como capa anti-abuso cuando el cliente envía datos (booking, descargas press kit). Responden JSON tipados y aprovechan colas ligeras (Supabase functions) si la demanda crece.

## 3. Data Architecture

### 3.1 Database Schema

| Tabla | Claves principales | Campos relevantes | Relación |
| ----- | ------------------ | ----------------- | -------- |
| `booking_requests` | `id` (UUID) | `name`, `email`, `venue`, `city`, `preferred_date`, `budget_range`, `notes`, `status`, `created_at` | Registro maestro de solicitudes. |
| `presskit_metrics` | `id` (UUID) | `asset_key`, `download_count`, `last_download_at`, `utm_source`, `utm_campaign` | Métricas agregadas por recurso del press kit. |
| `user_preferences` | `id` (UUID) | `session_id`, `language`, `portal_mode`, `animations_enabled`, `created_at`, `expires_at` | State persistente para toggles UI. |
| `webhook_events` | `id` (UUID) | `source`, `payload`, `processed_at`, `status` | Auditoría de webhooks (Sanity, MailerLite) y reintentos. |

Sanity almacena contenidos narrativos (actos, agenda, testimonios, merch) con referencias hacia assets y se sincroniza con la app mediante consultas GROQ.

### 3.2 Data Models and Relationships

- `booking_requests` se conecta con MailerLite via `external_id` para reconciliar seguimientos (one-to-one opcional).
- `presskit_metrics.asset_key` se correlaciona con documentos de Sanity para mostrar descargas en UI sin duplicar data.
- `user_preferences.session_id` se deriva de cookie firmada; no almacena datos personales sensibles.
- `webhook_events` sirve como bitácora para revalidaciones; cada evento exitoso dispara `revalidatePath` y se marca `status='processed'`.

### 3.3 Data Migrations Strategy

- Prisma Migrate gestiona la evolución del esquema; cada cambio crea migraciones versionadas (`prisma/migrations/<timestamp>_<descripcion>`).
- Se ejecutan en CI (modo `prisma migrate diff`) y en producción mediante script GitHub Actions con aprobación manual.
- Backups automáticos de Supabase se configuran diarios; se documenta plan de rollback con `prisma migrate resolve --rolled-back`.

### 3.4 Flujos operativos de datos

- **Conciliación MailerLite ↔ Supabase:** cada registro en `booking_requests` almacena `mailerlite_message_id` y estado inicial `pending`. Un job `jobs/reconcile-booking.ts` (GitHub Actions programado cada 3 h o Vercel Cron) consulta la API de MailerLite para obtener estatus de seguimiento (abierto, respondido, rebotado) y sincroniza los campos `status`, `last_mailerlite_event` y `responded_at`. Si hay divergencias o errores, se envía alerta a Slack y se registra en `webhook_events` con `status="needs_attention"`. Los analistas pueden forzar reconciliación manual ejecutando `npm run jobs:reconcile-booking -- --id <booking_id>`.
- **Expiración automatizada de campañas temporales:** documentos de Sanity incluyen `campaign_start` y `campaign_end`. Un job nocturno `jobs/expire-campaigns.ts` marca `campaign_state="expired"` en Supabase y dispara un parche a Sanity cuando la fecha de fin caduca. Tras expirar, el job purga banners temporales del CMS y llama a `revalidatePath` para refrescar Experience Shell y Community Engine. El job emite registro en `webhook_events` y reporta métricas básicas (número de campañas expiradas) para seguimiento.

### 3.5 Política de retención de datos

- **Booking:** conservar 18 meses; cron mensual `npm run data:purge -- --model booking_requests --older-than 18M` borra registros con `status` finalizado y anonimiza contactos asociados en MailerLite mediante la API de borrado. Se documenta audit trail en `webhook_events`.
- **Métricas de press kit:** agregación mensual en Supabase y eliminación de filas crudas >12 meses (solo se mantiene agregación por mes y origen). Exportar CSV previo a eliminación para análisis histórico si es necesario.
- **Preferencias de usuario:** `user_preferences` expira automáticamente (`expires_at`) y un job semanal limpia registros vencidos. Ningún dato personal persistente se almacena sin consentimiento explícito.

### 3.6 Reporting operativo

- El job `jobs/reconcile-booking.ts` genera reporte semanal (`jobs/reconcile-booking.ts --report weekly`) agregando volumen de solicitudes, estados (pendiente, respondido, sin respuesta) y tiempo medio de respuesta. El job crea dashboard ligero en Supabase (`report_booking_weekly`) y envía resumen a Slack + correo de stakeholders.
- El reporte semanal también incluye métricas de `expire-campaigns.ts` (campañas activadas/expiradas, redirecciones generadas) para asegurar que marketing tenga visibilidad sin acceder a la base de datos.

## 4. API Design

### 4.1 API Structure

- Namespace `/api` en Next.js App Router con funciones serverless por dominio (`/api/booking`, `/api/presskit/download`, `/api/preferences`).
- Request/response tipados con Zod, devolviendo códigos HTTP claros (2xx éxito, 4xx validación, 5xx incidentes).
- Cabeceras CORS restringidas (`POST` desde dominio principal) y rate limiting básico (3 req/min por IP) aplicado vía utilidades compartidas.

### 4.2 API Routes

| Endpoint | Método | Propósito | Respuesta |
| -------- | ------ | --------- | --------- |
| `/api/booking` | POST | Recibe solicitudes de booking, valida hCaptcha, persiste y envía a MailerLite. | 201 + `booking_id`, 400 errores de validación. |
| `/api/presskit/download` | POST | Registra descarga de recurso y genera enlace firmado CDN. | 200 con URL temporal, 429 si supera límite. |
| `/api/preferences` | PUT | Guarda idioma, modo Portal y animaciones para la sesión. | 204 sin contenido. |
| `/api/webhooks/sanity` | POST | Reacción a publicaciones/expiraciones de contenidos. | 202 y cola revalidación. |

### 4.3 Form Actions and Mutations

- Los formularios usan React Hook Form 7.51 conectado a TanStack Query para manejar estado y errores.
- Acciones críticas se ejecutan server-side (`server actions`) para reducir superficie de ataque.
- Mensajes de confirmación personalizados (newsletter, booking) se renderizan con componentes reutilizables y se registran en analytics.

## 5. Authentication and Authorization

### 5.1 Auth Strategy

- Sitio público, sin cuentas de usuario. Seguridad basada en hCaptcha, validación server-side y sanitización de datos.
- El press kit protegido usa enlaces firmados con expiración (10 minutos) generados desde funciones serverless.

### 5.2 Session Management

- Cookie `nmd_preferences` firmada en Edge almacena idioma, estado del Portal y preferencia de animaciones.
- Para booking, se usa `nonce` temporal para evitar repost; se invalida al completar la solicitud.

### 5.3 Protected Routes

- No hay rutas privadas hoy. El panel interno se planificaría como sub-árbol separado con Supabase Auth si se habilita.

### 5.4 Role-Based Access Control

- No aplica en MVP. Documentamos lineamientos: futuros roles (management, creativo) se mapearían via Sanity permissions o Supabase Auth.

## 6. State Management

### 6.1 Server State

- `getServerSideProps` ya no se usa en App Router; se reemplaza por Server Components (`async` functions) y caché por segmento.
- TanStack Query en servidor (`prefetchQuery`) hidrata datos críticos (agenda) antes de enviar la respuesta al cliente.

### 6.2 Client State

- Zustand se reserva para estados complejos (por ejemplo, stepper del modo Portal). Se inicializa lazy para no afectar el bundle base.
- Contexts ligeros (`PortalContext`, `PreferencesContext`) proveen estados compartidos a componentes.

### 6.3 Form State

- React Hook Form administra validación y mensajes accesibles; se integra con Zod para tipado y mensajes localizados.
- Estados transitorios (loading, success, error) disparan eventos GA4 para rastrear conversiones.

### 6.4 Caching Strategy

- Cache CDN de Vercel + ISR para contenido CMS.
- Supabase + Prisma usa caché en memoria sobre resultados de lectura frecuente (press kit) con invalidación por webhook.
- TanStack Query configura `staleTime` de 5 minutos para datos semiestáticos (testimonios) y `0` para booking.

## 7. UI/UX Architecture

### 7.1 Component Structure

- Librería de componentes en `/modules/experience-shell/components` con átomos (botones, toggles), moléculas (cards agenda) y organismos (hero, portal overlay).
- Layouts específicos por segmento: `MarketingLayout`, `PortalLayout`, `ProfessionalLayout`.
- Storybook documenta cada componente con props tipados y variantes AA/accesibilidad.

### 7.2 Styling Approach

- Tailwind CSS con configuración `tailwind.config.ts` alimentada por tokens (colores, tipografías, spacing) exportados desde diseño.
- Plugins `@tailwindcss/typography` y `forms` facilitan copy narrativo y formularios consistentes.
- Se define capa `@layer components` para patrones repetidos (cards, badges) y se evita CSS global excesivo.

### 7.3 Responsive Design

- Breakpoints: `xs` (0-480), `sm` (481-768), `md` (769-1024), `lg` (1025-1440), `xl` (>1440).
- El modo Portal detecta `prefers-reduced-motion` y adapta animaciones; en móviles usa versión lite con assets comprimidos.
- El press kit se renderiza en layout de columnas en escritorio y en acordeón en móvil.

### 7.4 Accessibility

- WCAG 2.1 AA: contraste asegurado con tokens, navegación por teclado, `aria-live` para confirmaciones.
- Subtítulos obligatorios en video/audio (Portal y hero) y textos alternativos descriptivos.
- Toggle de animaciones habilita `reduced-motion` y detiene efectos intensivos.

## 8. Performance Optimization

### 8.1 SSR Caching

- Respuestas SSR usan `Cache-Control: public, max-age=60, s-maxage=600` balanceando frescura y coste.
- Segmentos del Portal se cachean de forma independiente para permitir actualizaciones parciales.

### 8.2 Static Generation

- Páginas informativas (prensa, contacto) se pre-renderizan con SSG e ISR de 24 h.
- Contenido programado en Sanity crea borradores que se publican mediante webhooks, disparando regeneración selectiva.

### 8.3 Image Optimization

- `next/image` con loader de Vercel optimiza y sirve formatos WebP/AVIF.
- Se definen tamaños responsivos por breakpoint; galerías usan `blurDataURL` para mejorar percepción.

### 8.4 Code Splitting

- `dynamic()` se emplea para componentes pesados (portal overlay, reproductor multimedia) cargados on-demand.
- `React.lazy` + suspense para integrar efectos especiales sin bloquear FCP.

## 9. SEO and Meta Tags

### 9.1 Meta Tag Strategy

- App Router `generateMetadata` centraliza títulos, descripciones y `og:` tags según acto narrativo.
- Se crea helper `buildMeta` para compartir patrones con CMS; los editores ven preview en Sanity.

### 9.2 Sitemap

- Sitemap XML se genera automáticamente en `/app/sitemap.ts` tomando rutas dinámicas del CMS y Supabase.
- Se actualiza tras cada webhook de contenido; se notifica a Google Search Console.

### 9.3 Structured Data

- JSON-LD para eventos (agenda), organización (collective) y productos (merch) incrustado vía componente `StructuredData`.
- Los datos provienen del CMS y se validan con pruebas automáticas (`npm run lint:seo`).

## 10. Deployment Architecture

### 10.1 Hosting Platform

- Vercel: entornos `preview` (cada PR), `staging` (rama release) y `production` (main). Se aprovecha Automatic Rollback.

### 10.2 CDN Strategy

- CDN global de Vercel entrega SSR/SSG y assets. Cache keys incluyen idioma y modo Portal para evitar mezcla de experiencias.

### 10.3 Edge Functions

- Middleware en Edge aplica detección de idioma y `preferencias` sin latencia.
- Edge Functions potenciales: A/B testing futuro, pre-filtro de bots en booking.

### 10.4 Environment Configuration

- Variables seguras via Vercel (`SANITY_PROJECT_ID`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE`, `MAILERLITE_TOKEN`, `HCAPTCHA_SECRET`).
- `.env.example` documenta requisitos y se valida en CI con script que verifica presencia de claves.

## 11. Component and Integration Overview

### 11.1 Major Modules

- Experience Shell: hero, Portal, storytelling y navegación.
- Operations Hub: agenda, press kit, booking.
- Community Engine: newsletter, merch, testimonios, campañas.
- Insight & Governance: analytics, consentimiento, dashboards.
- Content Platform Connector: SDK Sanity, sincronización Supabase, webhooks.

### 11.2 Page Structure

- `/`: Landing narrativa en actos + CTA pre-save/suscripción.
- `/portal`: Modo inmersivo con fallback lite.
- `/agenda` y `/agenda/[slug]`: Eventos y detalles.
- `/portal-profesional`: Press kit + booking + testimonios.
- `/comunidad`: Newsletter, campañas temporales, merch destacado.
- `/legal/*`: páginas SSG (políticas, términos).

### 11.3 Shared Components

- Botones CTA duales, toggles (Portal, animaciones, idioma), cards reutilizables, banners programables, componentes de testimonios.
- Hooks compartidos (`useAnalytics`, `usePortalPreferences`), helpers de formato (fechas, moneda).

### 11.4 Third-Party Integrations

- Sanity (CMS + DAM), MailerLite (newsletter, auto-replies), Supabase (datos operativos), GA4/Plausible, hCaptcha, Spotify/YouTube embeds.

## 12. Architecture Decision Records

- ADR-001: Elegir Next.js 14 SSR/ISR vs SPA. Decisión: Next.js por SEO y narrativa.
- ADR-002: Usar Sanity vs Notion. Decisión: Sanity por modelos y webhooks.
- ADR-003: Guardar booking en Supabase además de MailerLite. Decisión: Sí, para reporting y control de SLA.
- ADR-004: Tailwind + tokens vs componentes pre-hechos. Decisión: Tailwind con tokens para mantener estética narrativa.
- ADR-005: Observabilidad con Sentry + Vercel. Decisión: Combinar ambos para detectar incidentes durante campañas.

**Key decisions:**

- Why this framework? Next.js 14 ofrece SSR/ISR, App Router y ecosistema alineado a Vercel, ideal para storytelling con SEO.
- SSR vs SSG? Mezcla: SSR para páginas críticas y SSG+ISR para contenido programado, cumpliendo performance y frescura.
- Database choice? Supabase Postgres brinda SQL robusto, webhooks y autentificación de servicio sin administrar servidores.
- Hosting platform? Vercel simplifica despliegues, edge, previews y observabilidad integradas.

## 13. Implementation Guidance

### 13.1 Development Workflow

1. Branches por feature (`feat/<descripcion>`). 2. PR obligatorio con preview Vercel. 3. Revisión automática (lint, pruebas, sanity schema check). 4. QA manual en ambiente preview (verificar modo Portal, booking). 5. Merge a `main` despliega a producción tras aprobación.

### 13.2 File Organization

- `/modules/<dominio>` separa lógica, componentes y ganchos.
- `/modules/shared` alberga utilidades comunes y adaptadores de integraciones.
- `/app` usa segmentos para layouts; `/app/api` contiene funciones serverless.
- `/prisma` guarda esquema y migraciones; `/stories` aloja Storybook.

### 13.3 Naming Conventions

- Componentes React en PascalCase (`PortalToggle`).
- Hooks en camelCase prefijados con `use` (`usePressKitMetrics`).
- Archivos Tailwind con sufijo `.module.css` solo cuando se requiera estilo puntual (rare). Variables env en mayúscula con prefijo (`NEXT_PUBLIC_`).

### 13.4 Best Practices

- Mantener componentes puros y delegar efectos a hooks.
- Documentar cada integración externa en README de módulo.
- Para contenido programado, usar borradores en Sanity y validar con preview antes de publicar.

## 14. Proposed Source Tree

```
.
├── app
│   ├── (marketing)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (portal)
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── (professional)
│   │   ├── press-kit
│   │   │   ├── page.tsx
│   │   │   └── download
│   │   │       └── route.ts
│   │   └── booking
│   │       └── route.ts
│   ├── comunidad
│   │   └── page.tsx
│   ├── agenda
│   │   ├── page.tsx
│   │   └── [slug]
│   │       └── page.tsx
│   ├── api
│   │   ├── booking
│   │   │   └── route.ts
│   │   ├── presskit
│   │   │   └── route.ts
│   │   ├── preferences
│   │   │   └── route.ts
│   │   └── webhooks
│   │       └── sanity
│   │           └── route.ts
│   └── sitemap.ts
├── middleware.ts
├── modules
│   ├── experience-shell
│   │   ├── components
│   │   ├── hooks
│   │   └── services
│   ├── operations-hub
│   ├── community-engine
│   ├── insight-governance
│   └── content-connector
├── prisma
│   ├── schema.prisma
│   └── migrations
├── stories
│   └── *.stories.tsx
├── tailwind.config.ts
├── tokens
│   └── design-tokens.json
└── tests
    ├── unit
    ├── integration
    └── e2e
```

**Critical folders:**

- `modules/experience-shell`: Componentes y lógica de storytelling, hero y Portal.
- `modules/operations-hub`: Funcionalidades operativas (agenda, press kit, booking) con integraciones correspondientes.
- `modules/content-connector`: SDKs y servicios para interactuar con Sanity, Supabase y webhooks.

## 15. Testing Strategy

### 15.1 Unit Tests

- Vitest + Testing Library para componentes base, hooks y utilidades. Cobertura mínima 80% en módulos compartidos.

### 15.2 Integration Tests

- Pruebas modulares que montan páginas críticas (landing, press kit) verificando datos mockeados del CMS y Supabase.
- Simulan `revalidatePath` para asegurar que la lógica de ISR funcione correctamente.
- Checklist de accesibilidad del modo Portal documentado en Storybook (`stories/accessibility/portal-checklist.mdx`) combina pruebas manuales guiadas con validación `axe` automatizada.

### 15.3 E2E Tests

- Playwright en entorno preview: flujos Portal (activar/desactivar), booking (desde carga hasta confirmación) y descargas del press kit.
- Tests incluyen viewport móvil y desktop y validan accesibilidad con `expect().toPassAxe()`.

### 15.4 Coverage Goals

- 85% en módulos críticos (Operations Hub). 70% mínimo global. Alertas en CI cuando cae por debajo.

Se recomienda contar con un QA/Tester con experiencia en experiencias inmersivas para validar efectos visuales y degradación progresiva durante las primeras iteraciones.

## 16. DevOps and CI/CD

- GitHub Actions orquesta pipeline: `lint`, `typecheck`, `test`, `build`, `storybook`, `prisma migrate diff`.
- Jobs paralelos mantienen tiempos <8 minutos. Deploy automático a Vercel Preview tras pasar checks.
- Workflow manual `deploy-prod` exige aprobación de PM/Arquitecto, ejecuta migraciones (`prisma migrate deploy`) y verifica salud post-despliegue.
- Cron jobs gestionados por Vercel Scheduler o GitHub Actions: `jobs/reconcile-booking.ts` (cada 3 h) y `jobs/expire-campaigns.ts` (diario) con logs centralizados en `webhook_events`.
- Monitoreo post-release: script que consulta GA4 y Supabase para asegurar conversiones >0 y ausencia de errores.

Se sugiere participación de un DevOps para automatizar backups de Supabase (cron) y configurar alertas centralizadas (Slack) en Vercel/Sentry.

## 17. Security

- Validación server-side exhaustiva con Zod; sanitización contra XSS/Injection.
- hCaptcha invisible y rate limiting (Redis/Edge KV) protegen endpoints públicos.
- Enlaces de press kit firmados con expiración corta y tokens no compartidos.
- Política de seguridad de contenidos (CSP) definida en middleware para limitar orígenes de scripts/media.
- Revisión trimestral de dependencias con `npm audit` + Dependabot.
- Política de retención auditada: scripts de purga registran auditoría, remueven datos personales tras 18 meses y confirman borrado en MailerLite.

Se recomienda revisión puntual de un especialista en seguridad web para auditar configuraciones de CSP, headers y el pipeline de press kit antes del lanzamiento.

---

## Specialist Sections

### DevOps Essentials
- Pipelines en GitHub Actions con jobs paralelos (`lint`, `typecheck`, `test`, `storybook`, `prisma migrate diff`) mantienen el tiempo total <8 min; se recomienda monitorear estos tiempos y ajustar si el número de módulos crece.
- Programar backups automáticos de Supabase mediante script `npm run backups:supabase` (GitHub Actions nightly) y validar restauraciones en entorno staging cada trimestre.
- Añadir verificación de variables de entorno (`npm run verify-env`) en CI para detectar faltantes antes del despliegue y publicar documentación actualizada en `docs/devops.md`.

### Security Essentials
- Revisar cabeceras de seguridad (CSP, HSTS, X-Frame-Options) cada release y automatizar pruebas con `npm run lint:security` (usa eslint-plugin-security + cspell para detectar secrets).
- Monitorear uso de tokens MailerLite y hCaptcha; rotarlos trimestralmente y registrar la rotación en `webhook_events` para auditoría.
- Ejecutar auditoría de dependencias (`npm audit`, `npx depcheck`) como parte del pipeline; registrar plan de remediación en ADR cuando se detecten vulnerabilidades de alto riesgo.

### Testing Essentials
- Mantener el checklist de accesibilidad del modo Portal en Storybook (`stories/accessibility/portal-checklist.mdx`) y actualizarlo cuando se agreguen efectos o animaciones nuevas.
- Ampliar cobertura con pruebas contractuales de API (`tests/integration/api/*.spec.ts`) que verifiquen validación Zod y respuestas ante fallos externos (MailerLite, Supabase).
- Integrar reportes Playwright en CI (`npx playwright show-report`) y compartir enlaces en Slack tras cada build de preview para validar manualmente experiencias críticas.