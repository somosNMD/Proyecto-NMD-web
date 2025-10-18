# Technical Specification: Storytelling Landing & Portal

Date: 2025-10-18
Author: Chelabs
Epic ID: EP-1
Status: Draft

---

## Overview

Esta épica entrega la experiencia narrativa principal del sitio Proyecto Web NMD: una landing en actos con reproductor multimedia y el modo Portal degradable. La funcionalidad debe conectar el storytelling artístico con los objetivos de negocio (pre-save, suscripción, navegación hacia secciones operativas) manteniendo carga rápida y accesibilidad AA.

## Objectives and Scope

- **In scope**: hero modular, narrativa en actos, reproductor multimedia, toggles de experiencia (Portal, animaciones, idioma), overlays del modo Portal, instrumentación de eventos GA4/Plausible, control de preferencias persistentes.
- **Fuera de alcance**: gestión de contenidos en el CMS (cubierto por EP-5), flujos de booking o comunidad (EP-2/EP-3), automatizaciones de campañas.

## System Architecture Alignment

La épica se implementa sobre el módulo **Experience Shell** descrito en la arquitectura: páginas SSR en Next.js 14, layouts diferenciados, toggles gestionados por Shared Services y datos obtenidos del CMS Sanity y Supabase user_preferences. Depende de funciones serverless /api/preferences para persistir preferencias y de la política de progressive enhancement.

## Detailed Design

### Services and Modules

| Módulo | Responsabilidad | Entradas | Salidas | Owner sugerido |
| --- | --- | --- | --- | --- |
| modules/experience-shell | Render de landing, hero, secciones narrativas, modo Portal | Sanity ct, tokens UI, estado preferencias | HTML/React SSR, eventos GA4 | Frontend lead |
| modules/shared/preferences | Gestión de cookies y persistencia de preferencias | Cookies, payload PUT /api/preferences | Estado hidratado, headers Set-Cookie | Frontend/Backend |
| modules/shared/analytics | Emisión de eventos GA4/Plausible | Interacciones UI | Eventos instrumentados | Analytics |
| /app/api/preferences | Persistencia de idioma/Portal/animaciones | Request PUT (JSON) | 204 + cookie firmada | Backend |

### Data Models and Contracts

- **Sanity ct document**
  - 	itle (string), order (number), heroMedia (asset reference), ctaPrimary (object {label,url}), ctaSecondary, copy (portable text), portalTeaser (rich text).
- **Supabase user_preferences**
  - id UUID (PK), session_id text, language enum (es,en), portal_mode enum (on,off), nimations_enabled boolean, created_at timestamptz, expires_at timestamptz.
- **Cookie 
md_preferences**
  - Firmada, contiene JSON compactado con los campos anteriores para hidratación inicial.

### APIs and Interfaces

| Método | Path | Request | Response | Errores |
| --- | --- | --- | --- | --- |
| PUT | /api/preferences | { "language": "es", "portal_mode": "on", "animations_enabled": true } + token hCaptcha opcional | 204, Set-Cookie 
md_preferences (HttpOnly, Secure, SameSite=Lax) | 400 payload inválido, 429 rate limit, 500 fallo Supabase |

### Workflows and Sequencing

1. Usuario ingresa https://site/ → App Router render SSR hero y actos (getActs() desde Sanity).
2. Frontend hidrata PortalContext con cookie; se muestran toggles accesibles.
3. Al activar modo Portal, se hace lazy-load de overlay (dynamic(() => import('portal-overlay'))) y se registra evento portal_open.
4. Acción Portal aplica progressive enhancement: si prefers-reduced-motion o nimations_enabled=false, se usa variante lite.
5. Al guardar preferencias, se invoca /api/preferences → Zod valida y Supabase user_preferences upsert; respuesta ajusta cookie firmada.
6. Cada interacción clave emite eventos GA4 (pre_save_click, portal_toggle, etc.) con metadata del acto actual.

## Non-Functional Requirements

### Performance

- LCP < 2.5s desktop / <3s mobile; hero media usa 
ext/image con prioridad.
- Portal overlay debe iniciar en <1.5s en dispositivos modernos; fallback lite en <800ms.

### Security

- Cookies firmadas con EdgeCrypto; protección hCaptcha opcional si se detectan abusos.
- Validación Zod + rate limiting (3 req/min/IP) en /api/preferences.

### Reliability/Availability

- Si Sanity falla, landing muestra copia cached (ISR); overlay Portal cae a versión lite con messaging.
- Preferencias guardadas en cookie y Supabase; si Supabase está offline se cae únicamente a cookie.

### Observability

- Eventos GA4: pre_save_click, portal_toggle, language_switch, portal_exit.
- Log pino nivel info en /api/preferences (session_id, cambios) y warn si se rechaza payload.

## Dependencies and Integrations

- Next.js 14.2.3, React 18.3, Tailwind 3.4.4.
- Sanity client @sanity/client@6.x para getActs().
- Supabase JS @supabase/supabase-js@2.x dentro de serverless.
- GA4 (gtag.js) + Plausible script asíncrono.
- hCaptcha v1 invisible (opcional, configurable vía env).

## Acceptance Criteria (Authoritative)

1. El hero muestra al menos tres actos configurados en Sanity con CTA principal de pre-save y secundaria de newsletter.
2. El modo Portal se activa con teclado, anuncia estado mediante ria-live y respeta prefers-reduced-motion.
3. El reproductor multimedia soporta Spotify y YouTube, degradando a imagen + CTA cuando el embed falla.
4. Cambios de idioma se reflejan en textos principales y se persisten tras recargar la página.
5. Evento GA4 pre_save_click registra idioma, acto y modo Portal activo.
6. El endpoint /api/preferences devuelve 204 y crea cookie firmada; llamadas inválidas responden 400 con mensaje JSON.

## Traceability Mapping

| AC | Secciones | Componentes/APIs | Test idea |
| --- | --- | --- | --- |
| 1 | Overview, Detailed Design | Hero component, getActs() | Playwright: verificar render actos y CTA visibles |
| 2 | Services, NFR Security | PortalToggle, overlay, /api/preferences | axe + Playwright: activar Portal con teclado, revisar ria-live |
| 3 | Services, Dependencies | MediaPlayer | Simular fallo embed y comprobar fallback |
| 4 | Data Models, API | /api/preferences, Supabase table | Unit test: cambiar idioma y confirmar cookie + DB |
| 5 | Observability | useAnalytics | Mock GA4 y validar payload |
| 6 | APIs | /api/preferences | Vitest: payload inválido -> 400; correcto -> 204 |

## Risks, Assumptions, Open Questions

- **Riesgo**: contenido heavy del modo Portal afecte Core Web Vitals → Mitigar con lazy imports y mediciones Lighthouse continuas.
- **Asunción**: Sanity entregará actos completos (mínimo títulos/CTA). Validar con equipo de contenido.
- **Pregunta**: ¿Se requerirá traducción del contenido del Portal? Determinar antes del Sprint de localización.

## Test Strategy Summary

- Unit tests (Vitest) para componentes hero, toggles y helpers de cookies.
- Tests de integración Next.js para verificar SSR con datos Sanity stub.
- Playwright E2E ejecutando flujo Portal en desktop + mobile y validación de eventos GA4 (mock endpoint).
- Storybook + axe automatizado sobre PortalOverlay y PortalToggle.
