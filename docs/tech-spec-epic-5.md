# Technical Specification: Plataforma de Contenidos

Date: 2025-10-18
Author: Chelabs
Epic ID: EP-5
Status: Draft

---

## Overview

La épica Plataforma de Contenidos equipa al equipo interno con un CMS ligero (Sanity) y procesos de publicación confiables. Define modelos de contenido, workflows editoriales, previsualizaciones y sincronización con la app Next.js para garantizar que storytelling, agenda y campañas se mantengan sin intervención técnica.

## Objectives and Scope

- **In scope**: modelos Sanity (actos, agenda, press kit, campañas, testimonios), esquema Prisma de soporte, webhooks, previsualización en Vercel, documentación para editores, jobs de expiración y reconciliación, pipeline de migraciones.
- **Fuera de alcance**: migraciones masivas de contenido legado, traducciones automáticas, integración con otros CMS.

## System Architecture Alignment

Se apoya en el módulo **Content Platform Connector**: SDKs Sanity, adaptadores Supabase, webhooks /api/webhooks/sanity, jobs programados y documentación editorial. Integra con Experience Shell, Operations Hub y Community Engine como proveedores de datos.

## Detailed Design

### Services and Modules

| Módulo | Responsabilidad |
| --- | --- |
| modules/content-connector/sanity | Configuración cliente, queries GROQ, hooks de invalidación.
| modules/content-connector/supabase | ORM Prisma para ooking_requests, presskit_metrics, user_preferences, webhook_events.
| modules/content-connector/webhooks | Handlers Sanity/MailerLite -> registra eventos y evalidatePath.
| docs/editorial-playbook.md (nuevo) | Guía para editores: flujos de actos, campañas, press kit.
| GitHub Actions content-validate.yml | Valida esquemas Sanity, ejecuta sanity check y prisma validate.

### Data Models and Contracts

- **Sanity schemas**
  - ct, event, pressAsset, campaign, merchItem, 	estimonial, globalSettings (copy, consentimiento).
- **Prisma schema (extracto)**
  `prisma
  model BookingRequest {
    id                 String   @id @default(uuid())
    name               String
    email              String
    venue              String
    city               String
    preferredDate      DateTime?
    budgetRange        String?
    notes              String?
    status             BookingStatus @default(PENDING)
    mailerliteMessageId String?
    createdAt          DateTime @default(now())
    respondedAt        DateTime?
  }

  model WebhookEvent {
    id          String   @id @default(uuid())
    source      String
    payload     Json
    status      String
    createdAt   DateTime @default(now())
    processedAt DateTime?
  }
  `

### APIs and Interfaces

- /api/webhooks/sanity: recibe payloads create,update,delete; valida firma, guarda evento y llama evalidatePath relevante (landing, agenda, campañas).
- sanityPreviewHandler: API (preview mode) que permite a editores ver cambios antes de publicar (/api/preview?slug=).

### Workflows and Sequencing

1. Editor crea/edita documento en Sanity → valida con esquemas (campos obligatorios, slugs únicos).
2. Al publicar, Sanity dispara webhook firmado → Handler registra en webhook_events, encola revalidación (Next.js evalidateTag).
3. expire-campaigns.ts y econcile-booking.ts escriben en webhook_events para trazabilidad.
4. GitHub Actions content-validate corre en PRs que toquen schemas/ asegurando consistencia.
5. Previsualización: editores abren enlace Vercel Preview con token para ver cambios en staging.

## Non-Functional Requirements

### Performance

- Queries GROQ deben usar proyecciones selectivas; caches ISR segmentadas por 	ag.

### Security

- Webhooks firmados con secreto Sanity (SANITY_WEBHOOK_SECRET).
- Previews autenticados mediante token temporal y deshabilitados en producción.

### Reliability/Availability

- Revalidaciones encoladas: si fallan, se reintentan 3 veces y se marca evento con status="retry".
- Backups diarios de Sanity export (sanity dataset export cron) guardados en almacenamiento seguro.

### Observability

- Logs de webhooks incluyen docId, ction, esult.
- Métrica webhook_events consulta diaria para detectar pendientes.

## Dependencies and Integrations

- sanity CLI, @sanity/client, @sanity/image-url.
- Prisma 5.9.1, @prisma/client.
- GitHub Actions + Vercel revalidate API (_next/data endpoints).

## Acceptance Criteria (Authoritative)

1. Todos los esquemas Sanity mencionados están implementados con validaciones (campos obligatorios, slugs únicos, referencias).
2. Publicar contenido dispara webhook, actualiza webhook_events y revalida las rutas correspondientes en <2 min.
3. Previsualizaciones funcionen en entornos preview con token y se deshabilitan en producción.
4. Prisma migrations cubren tablas Supabase requeridas e incluyen seeds mínimos para QA.
5. Jobs registran webhook_events y cambian estado a processed tras completarse.
6. Documentación docs/editorial-playbook.md disponible y enlazada desde el CMS.

## Traceability Mapping

| AC | Secciones | Componentes/APIs | Test idea |
| --- | --- | --- | --- |
| 1 | Data Models | Sanity schemas | Tests sanity check |
| 2 | Workflows | Webhooks handler | Unit/integration: procesar payload |
| 3 | Workflows, Security | Preview handler | Playwright: simular acceso preview |
| 4 | Data Models | Prisma migrations | CI: prisma migrate diff |
| 5 | Workflows | Jobs + webhook_events | Test job con mocks |
| 6 | Services | Editorial playbook | QA revisar doc accesible |

## Risks, Assumptions, Open Questions

- **Riesgo**: demasiadas revalidaciones simultáneas saturen ISR → agrupar por tags.
- **Asunción**: Equipo de contenido adopta Sanity Studio sin personalización extra.
- **Pregunta**: ¿Se requerirá stage adicional (preproducción) con dataset separado? definir antes del lanzamiento.

## Test Strategy Summary

- Tests unitarios: validación de webhook signature, utils Sanity.
- Integration: handler con payloads create/update/delete.
- E2E: flujo de preview y publicación con Sanity Studio en entorno QA.
- Auditoría manual mensual de backups Sanity y revisión de webhook_events pendientes.
