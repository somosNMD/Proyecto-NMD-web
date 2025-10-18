# Technical Specification: Comunidad & Monetización

Date: 2025-10-18
Author: Chelabs
Epic ID: EP-3
Status: Draft

---

## Overview

Esta épica habilita la captura y activación de la comunidad (newsletter, campañas temporales, merch destacado y testimonios). Debe conectar la narrativa del landing con acciones de fidelización, mantener programación automática de campañas y entregar métricas accionables sin fricción operativa.

## Objectives and Scope

- **In scope**: formularios de newsletter con doble opt-in, componentes de campañas temporales programables, módulos de merch/testimonios, sincronización con MailerLite, preferencias persistentes, integración UTM.
- **Fuera de alcance**: creación de contenido (CMS), automatización avanzada de marketing (flows complejos) o venta directa (checkout e-commerce externo).

## System Architecture Alignment

La implementación aprovecha **Community Engine** apoyado por Experience Shell (UI compartida) y Shared Services (preferencias, analytics). Consume documentos Sanity (campaign, 	estimonial, merchItem), usa Supabase user_preferences para personalización y se apoya en el job expire-campaigns.ts para caducidad automática.

## Detailed Design

### Services and Modules

| Módulo | Responsabilidad | Entradas | Salidas |
| --- | --- | --- | --- |
| modules/community-engine/newsletter | Formulario newsletter + doble opt-in | tokens UI, MailerLite config | POST /api/preferences (opt-in flag), ventana confirmación |
| modules/community-engine/campaigns | Render de banners temporales programables | Sanity campaign, expires_at | Componente banner + CTA | 
| modules/community-engine/merch | Mostrar productos destacados y analytics UTM | Sanity merchItem, config externa | Grid con CTAs a tienda externa |
| modules/community-engine/testimonials | Slider/carrusel testimonios y logos | Sanity 	estimonial | Componentes accesibles con autoplay controlable |
| Shared nalytics | Eventos GA4/Plausible | Interacciones merch/campaña | payload GA4 |

### Data Models and Contracts

- **Sanity campaign**: 	itle, message, cta {label,url}, campaign_start, campaign_end, utm {source,medium,campaign}, ariant (anner,modal).
- **Sanity merchItem**: 	itle, description, price, image, ctaUrl, priority, vailability.
- **Sanity 	estimonial**: quote, uthor, ole, logo, locale.
- **Supabase user_preferences**: se amplía con campos opcionales 
ewsletter_opt_in boolean, utm_last_campaign text.

### APIs and Interfaces

- Newsletter: Se reusa /api/preferences para registrar 
ewsletter_opt_in=true y adjuntar mailerlite_subscriber_id. MailerLite se invoca vía endpoint /subscribers.
- Campañas: no hay endpoint específico; job expire-campaigns.ts ajusta registros CMS/Supabase y revalida rutas.

### Workflows and Sequencing

1. Componente newsletter captura email + nombre, ejecuta validación (Zod) y POST a MailerLite. Respuesta OK genera double_opt_in_url → mostrado en confirmación.
2. Al mismo tiempo, se llama /api/preferences para guardar 
ewsletter_opt_in y utm asociados a la sesión.
3. expire-campaigns.ts corre diario: evalúa campaign_end, cambia estado expired y dispara evalidatePath para eliminar banners caducos.
4. Módulo merch genera enlaces con parámetros UTM y dispara eventos GA4 merch_click.
5. Testimonios se renderizan con slider controlable; se respeta prefers-reduced-motion desactivando autoplay.

## Non-Functional Requirements

### Performance

- Banners/campañas deben cargar diferido (lazy) después del contenido principal para no penalizar LCP.
- Módulo merch optimiza imágenes con 
ext/image y prioriza lazy loading.

### Security

- Sanitizar inputs newsletter; proteger contra inyección de UTM.
- Firmar cookies y asegurar 
ewsletter_opt_in sólo se establece tras confirmación MailerLite (webhook).

### Reliability/Availability

- Si MailerLite falla, se guarda estado pending_confirm y se notifica en reporte semanal.
- Campañas caducadas siguen visibles máximo 5 minutos gracias a ISR + job.

### Observabilidad

- GA4 eventos: 
ewsletter_submit, 
ewsletter_confirm, campaign_click, merch_click.
- Reporte semanal integra métricas de campañas y newsletter desde Supabase eport_booking_weekly extendido.

## Dependencies and Integrations

- MailerLite API v2 (subscribers, campaigns).
- Supabase y Sanity como repositorio de campañas/merch/testimonios.
- @sanity/image-url para imágenes merch.
- qs para construir URLs UTM.

## Acceptance Criteria (Authoritative)

1. El formulario newsletter requiere email válido, muestra confirmación con instrucción double opt-in y registra 
ewsletter_opt_in tras webhook exitoso.
2. Las campañas con campaign_end pasado se ocultan automáticamente y se registran en el job de expiración.
3. El módulo merch muestra mínimo tres productos, con enlaces externos trackeados por GA4 (merch_click).
4. Testimonios se pueden navegar con teclado y prefers-reduced-motion detiene animaciones.
5. Eventos GA4 de campañas y merch incluyen UTM según configuración del CMS.
6. Reporte semanal lista campañas activas/expiradas y leads de newsletter agregados.

## Traceability Mapping

| AC | Secciones | Componentes/APIs | Test idea |
| --- | --- | --- | --- |
| 1 | Workflows, APIs | Newsletter component, MailerLite webhook | Playwright: submit → verificar confirmación y DB |
| 2 | Workflows, Reporting | expire-campaigns.ts | Test job con campañas vencidas |
| 3 | Services, Observability | Merch grid, GA4 | E2E: click merch, revisar evento |
| 4 | NFR Security, Services | TestimonialsSlider | axe + tests de focus |
| 5 | Observability | Analytics helper | Unit test: UTMs correctas |
| 6 | Reporting | Reporte semanal extendido | Chequear view Supabase |

## Risks, Assumptions, Open Questions

- **Riesgo**: saturación de banners/campañas degrade UX → limitar a 2 simultáneas y validar en UX.
- **Asunción**: MailerLite double opt-in disponible para el plan contratado.
- **Pregunta**: ¿Se requiere segmentación de newsletters por idioma? decidir antes de Sprint de internacionalización.

## Test Strategy Summary

- Unit tests: validadores newsletter, generador UTMs, slider accesible.
- Integration: simulación de webhooks MailerLite, job expiración.
- E2E: Playwright newsletter (mock MailerLite), interacción con campañas y merch en desktop/mobile.
- Monitoreo manual del reporte semanal para asegurar precisión de métricas.
