# Technical Specification: Operaciones & Press Hub

Date: 2025-10-18
Author: Chelabs
Epic ID: EP-2
Status: Draft

---

## Overview

La épica Operaciones & Press Hub entrega los flujos que profesionalizan la relación con promotores y prensa: agenda autogestionable, press kit descargable con control ligero de acceso y formulario de booking con SLA <12h. Centraliza métricas para el management y garantiza resiliencia ante picos de descargas.

## Objectives and Scope

- **In scope**: listado y detalle de agenda, tarjetas destacadas, press kit protegido, formulario de booking, métrica de descargas, automatización de respuestas via MailerLite, conciliación Supabase ↔ MailerLite, procesos de expiración de eventos.
- **Fuera de alcance**: reporting avanzado de analytics (EP-4), workflows editoriales (EP-5), automatizaciones de campañas comunitarias (EP-3).

## System Architecture Alignment

Se implementa con el módulo **Operations Hub**, utilizando datos de Sanity (event, pressAsset) y tablas Supabase (ooking_requests, presskit_metrics). Las funciones serverless /api/booking y /api/presskit/download ejecutan validaciones hCaptcha, almacenan registros y disparan webhooks. El job jobs/reconcile-booking.ts mantiene el compromiso de SLA y reporting semanal.

## Detailed Design

### Services and Modules

| Módulo | Responsabilidad | Entradas | Salidas | Owner |
| --- | --- | --- | --- | --- |
| modules/operations-hub/agenda | Render de agenda, filtros, resaltado de próximos eventos | Sanity event (query + GROQ), tokens UI | Páginas SSR agenda, metadata JSON-LD | Frontend |
| modules/operations-hub/press-kit | Listado de assets, descarga segura | Sanity pressAsset, presskit_metrics | Links firmados, contadores | Frontend |
| modules/operations-hub/booking | Formulario y validaciones cliente | Schema Zod, hCaptcha token | Payload POST /api/booking | Frontend |
| /app/api/booking | Validar y persistir booking, llamar MailerLite | Request JSON, secrets env | Registro Supabase, petición MailerLite | Backend |
| /app/api/presskit/download | Registrar descarga y generar URL firmada | asset_key, user_agent | Presigned URL, métrica actualizada | Backend |
| jobs/reconcile-booking.ts | Conciliación MailerLite ↔ Supabase + reporte | mailerlite_message_id | Actualización status, reporte semanal | DevOps |

### Data Models and Contracts

- **Sanity event document**: 	itle, slug, date, city, enue, description, 	icketsUrl, isHighlighted, mediaGallery[].
- **Sanity pressAsset**: sset_key (string), 	ype (enum: photo, dossier, logo), downloadUrl, caption, weight.
- **Supabase ooking_requests**: id UUID, name text, email text, venue text, city text, preferred_date date, budget_range text, notes text, status enum (pending,esponded,dismissed), mailerlite_message_id text, created_at timestamptz, responded_at timestamptz.
- **Supabase presskit_metrics**: id UUID, asset_key text, download_count int, last_download_at timestamptz, utm_source text.

### APIs and Interfaces

| Método | Path | Request | Response | Errores |
| --- | --- | --- | --- | --- |
| POST | /api/booking | {name,email,venue,city,preferred_date,budget_range,notes,token} | 201 { "booking_id": "uuid" } | 400 validación, 401 hCaptcha fallo, 429 rate-limit, 500 integraciones |
| POST | /api/presskit/download | { "asset_key": "press_photo_01", "utm": {"source":"media-kit"} } | 200 { "url": "https://cdn...?token" } | 400 asset no encontrado, 429 límite, 500 Supabase/CDN |

### Workflows and Sequencing

1. Agenda SSR: getEvents() ordena por fecha, marca destacados (próximos dos). Cada render genera JSON-LD Event.
2. Booking form (React Hook Form) valida en cliente con Zod sync, dispara hCaptcha y llama /api/booking.
3. API verifica token hCaptcha, normaliza datos, guarda en Supabase y envía payload a MailerLite (/campaigns/<id>/emails). Responde 201 y dispara log pino.
4. Job econcile-booking.ts (cada 3h) consulta MailerLite events -> actualiza status y esponded_at. Genera reporte semanal y envía a Slack.
5. Press kit renderiza lista de assets, cada click POST /api/presskit/download. Endpoint incrementa presskit_metrics y devuelve URL firmada (15 min) del CDN.
6. Job expire-campaigns.ts también revisa event publishEnd para despublicar campañas caducadas y revalidar agenda.

## Non-Functional Requirements

### Performance

- Agenda SSR cache 60s/s-maxage 600; fallback SSG si Sanity offline.
- Endpoints deben responder <500ms promedio p95.

### Security

- hCaptcha invisible obligatorio para booking; sanitize (DOMPurify server) campos texto.
- URLs de press kit firmadas con expiración 10 min y límite 5 descargas/min/IP.

### Reliability/Availability

- Booking: si MailerLite falla, se marca status="pending" y se reintenta vía cola en job.
- Press kit: si CDN inaccesible, la respuesta 503 registra error y se notifica vía Sentry.

### Observability

- Logs pino: ooking_submitted, ooking_mailerlite_error, presskit_download.
- Métricas GA4: ooking_start, ooking_submit_success, presskit_download.
- Reporte semanal eport_booking_weekly con totales y SLA.

## Dependencies and Integrations

- Supabase Postgres + Prisma client.
- MailerLite API v2 (key env MAILERLITE_TOKEN).
- hCaptcha server SDK (@hcaptcha/siteverify).
- CDN (Sanity CDN o Vercel Blob) para assets del press kit.
- date-fns para cálculos de agenda y SLA.

## Acceptance Criteria (Authoritative)

1. Agenda muestra eventos futuros ordenados, destacando los dos próximos con estilos diferenciados y microcopy configurable.
2. Formulario de booking valida campos obligatorios, exige hCaptcha y muestra confirmación con SLA <12h.
3. Cada submit crea registro en Supabase y en MailerLite con status=pending y mailerlite_message_id almacenado.
4. Job de conciliación actualiza registros a esponded cuando MailerLite marca follow-up y genera reporte semanal disponible en Supabase eport_booking_weekly.
5. Descargas del press kit requieren llamar al endpoint; la URL firmada expira en 10 minutos y se incrementa contador en presskit_metrics.
6. Se generan eventos GA4 ooking_submit_success y presskit_download con metadatos de UTM y acto/ciudad.

## Traceability Mapping

| AC | Secciones | Componentes/APIs | Test idea |
| --- | --- | --- | --- |
| 1 | Services, Workflows | Agenda SSR | Snapshot SSR + Playwright filtrar |
| 2 | Services, NFR Security | Booking form | Playwright: validar hCaptcha mock, error states |
| 3 | Data Models, APIs | /api/booking, Supabase | Vitest integración: supabase mock |
| 4 | Workflows, Reporting | jobs/reconcile-booking.ts | Test job con payload MailerLite fake |
| 5 | APIs | /api/presskit/download | Test: ratio límites y expiración |
| 6 | Observability | Analytics hooks | GA4 mock verifying payload |

## Risks, Assumptions, Open Questions

- **Riesgo**: spam de booking a pesar de hCaptcha → preparar bloqueo adicional (IP deny list) si se detectan patrones.
- **Asunción**: MailerLite provee message_id para correlación; validar en ambiente sandbox.
- **Pregunta**: ¿Se requiere soporte multiidioma en press kit? Confirmar con equipo PR.

## Test Strategy Summary

- Unit tests: validadores Zod, form helpers, generador de URLs firmadas.
- Integration tests: API booking y press kit con Supabase/Storage stub.
- Playwright: enviar booking válido, revisar confirmación, detectar límites; descargar press kit y validar expiración.
- Jobs: pruebas de reconciliación usando fixtures MailerLite y verificación de reporte.
