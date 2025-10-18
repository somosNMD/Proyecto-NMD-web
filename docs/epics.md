# Proyecto Web NMD - Epic Breakdown

**Author:** Chelabs
**Date:** 2025-10-17
**Project Level:** 3
**Target Scale:** 12-40 stories, 2-5 epics, full PRD + architect handoff

---

## Epic Overview

| Epic | Objetivo central | Resultados clave |
| --- | --- | --- |
| EP-1 Storytelling Landing & Portal | Diseñar landing narrativa y modo Portal degradable que activen pre-save y reflejen identidad artística | Hero modular publicado, modo Portal con degradación progresiva, CTA configurados y medidos |
| EP-2 Operaciones & Press Hub | Consolidar agenda, booking y press kit para acelerar cierres con promotores y prensa | Calendario autogestionable, press kit descargable, flujos de booking con SLA <12h |
| EP-3 Comunidad & Monetización | Aumentar suscripciones y monetizar fandom con merch y journeys de fidelización | Newsletter integrado, campañas programables, módulos de merch y testimonios publicados |
| EP-4 Observabilidad & Gobernanza | Instrumentar analítica, performance y CMS para iteraciones continuas | Eventos GA4 configurados, panel de métricas, internacionalización lista para ES/EN |
| EP-5 Plataforma de Contenidos | Implementar CMS ligero y pipeline editorial para mantener narrativa viva | Modelos de contenido en Notion/Sanity, roles definidos, automatización de publicaciones |

---

## Epic Details

### EP-1 Storytelling Landing & Portal
- **Objetivo**: Capturar atención desde el hero, impulsar pre-save y ofrecer experiencia inmersiva opcional alineada con el álbum.
- **Componentes clave**:
  - Hero en actos con player multimedia y doble CTA (pre-save, suscripción).
  - Modo Portal con progressive enhancement y fallback accesible.
  - Galerías multimedia con categorización por actos/temporadas.
- **Historias representativas**:
  1. Como fan, quiero activar el modo Portal desde el hero para vivir una experiencia inmersiva antes de explorar el sitio estándar.
  2. Como visitante móvil, quiero ver CTA claros sin efectos pesados para poder pre-guardar el álbum rápidamente.
  3. Como equipo creativo, quiero subir nuevas visuales del acto 2 y asignarlas desde el CMS sin intervención de desarrollo.
- **Criterios de aceptación**:
  - CTA visibles en primer scroll y medidos con GA4.
  - Modo Portal se desactiva automáticamente en navegadores sin WebGL/JS avanzado.
  - Imágenes y videos cargan en <2s con lazy loading en redes 4G.

### EP-2 Operaciones & Press Hub
- **Objetivo**: Reducir fricción operativa y profesionalizar la relación con promotores y prensa.
- **Componentes clave**:
  - Agenda autogestionable con filtros y destacados.
  - Press kit descargable con control ligero de acceso.
  - Formulario de booking con validaciones y respuesta automática.
- **Historias representativas**:
  1. Como promotor, quiero descargar el dossier y fotos HD sin esperar respuesta manual.
  2. Como management, quiero recibir solicitudes de booking con venue y presupuesto estandarizados para priorizar seguimiento.
  3. Como prensa, quiero consultar testimonios y agenda confirmada para evaluar cobertura.
- **Criterios de aceptación**:
  - Descargas registradas y limitadas por CAPTCHA/hCaptcha invisible.
  - Formulario de booking crea email estructurado y log en CRM ligero o inbox etiquetado.
  - Agenda destaca próximos dos eventos y muestra histórico para credibilidad.

### EP-3 Comunidad & Monetización
- **Objetivo**: Convertir fanbase en comunidad activa y activar ingresos complementarios.
- **Componentes clave**:
  - Formulario de newsletter integrado con MailerLite u otra herramienta.
  - Módulos para merch destacado, bundles y códigos promocionales.
  - Sección de testimonios y wall social curado.
- **Historias representativas**:
  1. Como fan, quiero suscribirme y recibir confirmación inmediata con beneficios.
  2. Como marketing, quiero programar banners temporales (p.ej. preventa de shows) y que expiren automáticamente.
  3. Como fan, quiero acceder a códigos de merch exclusivos desde la web oficial.
- **Criterios de aceptación**:
  - Workflow de suscripción con doble opt-in y segmentación inicial.
  - Merch configurable con activos reutilizables y seguimiento de clics.
  - Testimonios editables desde CMS con soporte para logos y citas verificadas.

### EP-4 Observabilidad & Gobernanza
- **Objetivo**: Garantizar visibilidad de métricas, performance y cumplimiento.
- **Componentes clave**:
  - Instrumentación GA4 + eventos personalizados.
  - Monitorización de performance (Vercel Analytics/Plausible).
  - Gestión de consentimientos y controles de accesibilidad.
- **Historias representativas**:
  1. Como PM, necesito ver métricas clave (pre-save, descargas, suscripciones) en un panel semanal.
  2. Como dev, quiero configurar alertas básicas cuando un servicio externo falle.
  3. Como usuario, quiero poder ajustar preferencias de cookies y animaciones.
- **Criterios de aceptación**:
  - Dashboard compartible con KPIs configurados.
  - Alertas vía email/Slack cuando endpoints críticos devuelven errores.
  - Banner de consentimiento con registro de preferencia y opción de revocación.

### EP-5 Plataforma de Contenidos
- **Objetivo**: Habilitar al equipo interno para mantener narrativa y contenidos sin depender de desarrollo.
- **Componentes clave**:
  - Modelado de contenidos en Notion/Sanity (actos, eventos, testimonios, recursos).
  - Roles y permisos diferenciados para management y creativos.
  - Documentación de flujos editoriales y handoff.
- **Historias representativas**:
  1. Como management, quiero crear una entrada de evento y programarla para el lanzamiento del próximo single.
  2. Como diseñador, quiero actualizar assets del hero y ver previsualización antes de publicar.
  3. Como PM, necesito un checklist editorial para revisar cambios importantes antes de despliegue.
- **Criterios de aceptación**:
  - CRUD completo de contenidos desde CMS con versionado básico.
  - Previsualización en staging con aprobación para producción.
  - Documentación accesible en repositorio y manual abreviado para stakeholders.
