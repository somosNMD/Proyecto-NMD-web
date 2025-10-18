# Technical Specification: Observabilidad & Gobernanza

Date: 2025-10-18
Author: Chelabs
Epic ID: EP-4
Status: Draft

---

## Overview

La épica Observabilidad & Gobernanza garantiza visibilidad operacional del sitio: métricas GA4/Plausible, seguimiento de consentimiento, registros de webhooks y reportes automáticos. Provee herramientas para que el management monitoree conversiones y para que el equipo técnico responda rápidamente a incidentes.

## Objectives and Scope

- **In scope**: configuración de analytics, banner de consentimiento, logging estructurado, reportes semanales, alertas Slack, monitoreo de jobs, panel básico de métricas.
- **Fuera de alcance**: dashboards BI complejos, pipelines ETL externos o integraciones con herramientas empresariales adicionales.

## System Architecture Alignment

Se sustenta en el módulo **Insight & Governance Layer** con Shared Services de analytics y logging. Utiliza Supabase webhook_events y eport_booking_weekly, integra Sentry y Vercel Observability, y expone un banner de consentimiento controlado via cookies y ConsentContext.

## Detailed Design

### Services and Modules

| Módulo | Responsabilidad | Entradas | Salidas |
| --- | --- | --- | --- |
| modules/insight-governance/consent | Banner de cookies, preferencias de tracking | Config CMS (consentCopy), cookies | UI accesible, estado consentimiento |
| modules/insight-governance/analytics | Wrapper GA4/Plausible, normalización eventos | Config env (GA_ID, PLAUSIBLE_DOMAIN) | Eventos trackeados |
| modules/insight-governance/reporting | Generar reportes semanales/agregados | Supabase tables, MailerLite stats | CSV/JSON en Supabase, mensaje Slack |
| modules/shared/logging | Wrapper pino + etiquetado | Logs desde serverless | Logs estructurados en Vercel |
| Jobs (econcile-booking, expire-campaigns) | Reporte y alertas | Supabase, MailerLite | Slack notifications |

### Data Models and Contracts

- **Supabase webhook_events**: id, source (sanity,mailerlite,job), payload JSON, status, processed_at, created_at.
- **Supabase view eport_booking_weekly**: columns week_start, ookings_total, ookings_pending, vg_response_hours, campaigns_expired, 
ewsletter_opt_in.
- **Cookie 
md_consent**: JSON { analytics: boolean, marketing: boolean } firmado.

### APIs and Interfaces

- Consent preferences se almacenan vía /api/preferences (campo nalytics_consent).
- Webhooks Sanity/MailerLite POST /api/webhooks/sanity y /api/webhooks/mailer-lite (si se habilita) registran eventos y disparan revalidaciones/reportes.

### Workflows and Sequencing

1. Primera visita: banner de consentimiento se muestra; al aceptar se guarda cookie 
md_consent y se habilitan scripts GA4/Plausible.
2. useAnalytics respeta estado de consentimiento antes de enviar eventos.
3. Jobs escriben logs job_start, job_summary, job_error. En caso de error -> Slack webhook #nmd-alerts.
4. Reporte semanal añade resumen (bookings, campañas, newsletter) y envía email a stakeholders (opcional).

## Non-Functional Requirements

### Performance

- Carga de scripts analytics debe ser async; no bloquear LCP.

### Security

- Cookies firmas + secure. Logs no deben almacenar PII.

### Reliability/Availability

- Banner de consentimiento debe fallback a estado opt-out si cookie no se puede leer.
- Reportes reintentan 3 veces antes de marcar evento como ailed.

### Observability

o Signals clave: GA4 eventos, logs pino, métricas Supabase (eport_booking_weekly), Sentry alertas.
- Dashboard Vercel monitoriza latencia (p95) y errores por función serverless.

## Dependencies and Integrations

- Google Analytics 4, Plausible, Sentry 7.96.0, Vercel Observability.
- Slack webhook (SLACK_ALERTS_WEBHOOK).
- Supabase SQL views y cron jobs.

## Acceptance Criteria (Authoritative)

1. Banner de consentimiento aparece en la primera visita, es accesible y persiste preferencia en cookie y Supabase (cuando aplica).
2. Eventos GA4/Plausible solo se envían cuando nalytics=true; al revocar consentimiento se detienen.
3. Los jobs registran logs estructurados y envían alerta Slack ante errores.
4. Reporte semanal genera entrada en eport_booking_weekly y envía resumen a Slack.
5. Webhooks Sanity/MailerLite crean registros en webhook_events con status correcto y disparan revalidaciones.
6. Sentry captura errores de serverless y adjunta contexto (requestId, session).

## Traceability Mapping

| AC | Secciones | Componentes/APIs | Test idea |
| --- | --- | --- | --- |
| 1 | Services, NFR Security | Consent banner, /api/preferences | Playwright: aceptar/rechazar consentimiento |
| 2 | Observability | useAnalytics | Unit test: togglear consentimiento |
| 3 | Workflows | Jobs + Slack | Test job simulando fallo |
| 4 | Reporting | eport_booking_weekly | Integration test: ejecutar job y verificar vista |
| 5 | APIs | /api/webhooks/sanity | Vitest: procesar payload sample |
| 6 | Dependencies | Sentry wrapper | Simular error y comprobar captura |

## Risks, Assumptions, Open Questions

- **Riesgo**: saturación de Slack si hay picos de errores → configurar throttling (máx 5 alertas/min).
- **Asunción**: Stakeholders aceptan recibir reporte en Slack; si no, se habilitará email.
- **Pregunta**: ¿Se requiere almacenamiento histórico más allá de Supabase? evaluar si se necesita BigQuery en fases futuras.

## Test Strategy Summary

- Unit tests: consentimiento, toggles analytics, logger wrapper.
- Integration: webhooks con fixtures reales, generación de reportes.
- E2E: Playwright validando banner y revocación consentimiento.
- Observability: pruebas manuales disparando errores controlados y verificando Sentry/Slack.
