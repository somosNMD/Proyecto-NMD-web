# Product Brief: Proyecto NMD web

**Date:** 2025-10-16
**Author:** BMad User
**Status:** Draft for PM Review

---

## Executive Summary

Proyecto NMD web lanzará su álbum en marzo 2026 y necesita una presencia digital profesional que unifique narrativa, fans y promotores. El brief propone un sitio Next.js con storytelling por actos, módulo Portal degradable y secciones robustas para booking y press kit, manteniendo costos bajos. El MVP debe estar listo antes del 15 de febrero con métricas claras de pre-save, suscripciones y descargas EPK, habilitando expansión posterior con experiencias inmersivas.

---

## Problem Statement

**Diagnóstico resumido**
Proyecto NMD web se acerca al lanzamiento independiente de su álbum en marzo de 2026 sin un hub oficial. Hoy dependen de redes sociales desordenadas, carecen de press kit descargable y pierden oportunidades al reenviar materiales manualmente.

**Dolor actual**
- Fans activos consultan por agenda y contenido exclusivo en mensajes directos; la respuesta tarda ~48 h y se pierde el impulso.
- Promotores y prensa solicitan dossier profesional; el equipo envía enlaces sueltos, lo que frena negociaciones y resta credibilidad.
- Management invierte horas consolidando enlaces, arte y audios para cada solicitud, duplicando esfuerzos antes de campañas pagadas.

**Urgencia**
Con el álbum a cuatro meses, se requiere una plataforma central para ejecutar pre-save, preventa de shows y alianzas. Sin un sitio profesional, las campañas digitales corren riesgo de baja conversión y de desaprovechar cobertura mediática.

---

## Proposed Solution

**Visión del sitio**
Portal en Next.js orientado a storytelling por actos: hero editorial limpio que introduce el álbum, secciones modulares con música, agenda, booking y merch, y un modo "Portal" liviano que ofrece una entrada inmersiva con degradación progresiva.

**Diferenciadores clave**
- Narrativa audiovisual inspirada en festivales y portales 3D, adaptada a assets existentes.
- Librerías de microinteracción (Framer Motion/GSAP) con límites claros para mantener costos bajos.
- Contenidos autogestionables mediante CMS ligero, permitiendo iteraciones rápidas del equipo.

**Propuesta de valor**
Entrega el profesionalismo esperado por promotores, una experiencia memorable para fans y un hub operativo para el management sin sacrificar presupuesto.

---

## Target Users

### Primary User Segment

**Fans inmersivos (core community)**
- Jóvenes adultos (18-32) acostumbrados a experiencias digitales en festivales y Twitch.
- Buscan agenda, accesos a contenido exclusivo y formas de apoyar al colectivo.
- Hoy navegan entre enlaces dispersos; abandonar la búsqueda reduce asistencia a shows y ventas de merch.
- Necesitan una plataforma que consolide música, narrativa y CTA claros (suscripción, pre-save, compra de entradas).

### Secondary User Segment

**Promotores y prensa especializada**
- Programadores de venues, festivales boutique y medios digitales.
- Requieren press kit actualizado, credenciales, ficha técnica y contacto directo.
- Actualmente dependen de enlaces enviados por DM o correo, lo que ralentiza cierres.
- Valoran la sección profesional con descargas, testimonios y acceso instantáneo al management.

---

## Goals and Success Metrics

### Business Objectives

1. Lanzar sitio público antes del 15 de febrero de 2026 para activar campaña de pre-save y agenda del álbum.
2. Incrementar solicitudes formales de booking en 40% frente a Q4 2025.
3. Capturar al menos 1.500 suscriptores al boletín antes del lanzamiento.

### User Success Metrics

1. Fans encuentran fecha del próximo show y CTA de compra en <3 clics.
2. Tiempo de respuesta a consultas de prensa reduce de 48h a <12h mediante formulario dedicado.
3. 60% de visitantes reproduce al menos un track/clip durante la sesión.

### Key Performance Indicators (KPIs)

- Conversión pre-save / visitas al hero.
- Descargas de press kit y tasa de seguimiento de booking.
- Tasa de suscripción al boletín y apertura de emails.
- Tiempo promedio en página Modo Portal vs. versión estándar.

---

## Strategic Alignment and Financial Impact

### Financial Impact

- Presupuesto máximo de desarrollo: USD 3.5K, priorizando equipo interno + freelance puntual.
- Hosting y CMS en tiers gratuitos (Vercel + Notion/Sanity) para mantener OPEX mensual < USD 50.
- Proyección: +3 eventos privados post-lanzamiento (ticket promedio USD 1.200) al ofrecer dossier profesional.

### Company Objectives Alignment

- Refuerza el objetivo anual de consolidar identidad digital del colectivo.
- Respaldar la expansión regional 2026 con material unificado para promotores.
- Habilita campañas de marketing omnicanal coherentes (web + redes + presencia en vivo).

### Strategic Initiatives

1. Campaña de prelanzamiento del álbum con narrativa en actos (web como pieza central).
2. Programa de comunidad "Modo Portal" con acceso a contenido backstage y listas exclusivas.
3. Paquetes de patrocinio light integrados en módulos del sitio sin romper la estética.

---

## MVP Scope

### Core Features (Must Have)

- Hero editorial con storytelling del álbum, CTA pre-save y reproductor embebido.
- Agenda dinámica + integraciones de ticketing y formulario de booking.
- Fichas de los 12 integrantes con biografías, fotos optimizadas y enlaces a redes.
- Módulo "Vibración del Grupo" con reproductor reactivo y modo Portal degradable.
- Sección Press Kit con descargas (bio, ficha técnica, fotos HD, stage plot).

### Out of Scope for MVP

- Tienda e-commerce completa (solo enlaces a merch existente).
- Portal 3D avanzado con WebGL pesado o VR.
- Integraciones personalizadas con CRM o plataformas de streaming propietarias.

### MVP Success Criteria

- Sitio desplegado en dominio oficial, con Lighthouse performance > 85 en desktop y > 75 en mobile.
- Todos los CTA principales (pre-save, booking, newsletter) funcionales y medidos.
- Press kit descargable actualizado y validado por management y prensa aliada.

---

## Post-MVP Vision

### Phase 2 Features

- Wall social interactivo curado con contenido UGC.
- Sección de portal inmersivo por actos con audio reactivo.
- Integración de mapa de giras con highlight de ciudades clave.

### Long-term Vision

- Experiencia web narrativa en 3 etapas que evoluciona con cada lanzamiento.
- Integración con streaming en vivo y drops exclusivos para suscriptores.
- Plataforma que unifica merchandising, contenido premium y comunidad.

### Expansion Opportunities

- Paquetes de patrocinio temáticos en secciones del portal.
- Alianzas con festivales para showcases virtuales.
- Venta de experiencias digitales (meet & greet virtual, stems exclusivos).

---

## Technical Considerations

### Platform Requirements

- Next.js / React con routing híbrido estático + SSR para SEO.
- Responsive first con breakpoints mobile, tablet y desktop.
- Integración con CMS headless y analítica (GA4 + Plausible opcional).

### Technology Preferences

- Next.js + Typescript para robustez.
- Vercel para hosting y CI/CD.
- Framer Motion/GSAP para microinteracciones; Vanta.js/WebGL ligero para modo Portal.
- Notion como CMS inicial (o Sanity free tier) para gestión de contenido.

### Architecture Considerations

- Progressive enhancement: capa base CSS/HTML, animaciones opcionales.
- Separación de contenido en CMS con webhooks para regeneración incremental.
- CDN para assets multimedia, compresión WebP/WebM.
- Estrategia fallback para navegadores de bajo rendimiento.

---

## Constraints and Assumptions

### Constraints

- Equipo reducido (1 dev, 1 diseñador, management multitarea).
- Assets multimedia deben optimizarse sin budget para nuevas sesiones.
- Tiempo crítico: lanzamiento MVP antes del 15 de febrero de 2026.

### Key Assumptions

- El grupo dispone de fotos y clips reutilizables listos para optimizar.
- Management puede mantener CMS actualizado semanalmente.
- Las plataformas externas (Spotify, ticketing) permiten embedding estable.

---

## Risks and Open Questions

### Key Risks

- Retraso en entrega de assets finales -> bloquea hero y press kit.
- Exceso de efectos visuales que afecten performance móvil.
- Falta de dueño de contenido causa desactualización rápida post-lanzamiento.

### Open Questions

- ¿Quién aprueba contenido y define prioridad de actualizaciones post-MVP?
- ¿Se requiere versión bilingüe (ES/EN) para prensa internacional?
- ¿Qué partners de ticketing/merch se integrarán oficialmente?

### Areas Needing Further Research

- Benchmarks de SEO para bandas independientes en lanzamiento.
- Mejores prácticas de captación pre-save y newsletters en género afín.
- Evaluar CMS lightweight (Notion vs. Sanity) según flujo del equipo.

---

## Appendices

### A. Research Summary

Basado en la sesión de brainstorming del 16-10-2025: narrativa inspirada en festivales, modo Portal inmersivo, estrategia de progressive enhancement y priorización de hero editorial profesional. Se identificaron ideas inmediatas (hero modular, one-page con microinteracciones, modo Portal básico), futuras (viaje inmersivo, wall social) y moonshots (portal 3D completo, mapa global reactivo). Pendientes: profundizar actos narrativos, guías de microinteracción y roadmap omnicanal.

### B. Stakeholder Input

- Chelabs (management): requiere transmitir profesionalismo y sorprender a fans manteniendo costos bajos.
- Facilitadora Mary (BA): recomendó priorizar hero editorial, modo Portal degradable y modularidad para promotores.

### C. References

- docs/brainstorming-session-results-2025-10-16.md
- Referentes visuales: Travis Scott Utopia World, Apple Music LATAM, Tomorrowland, Madeon

---

_This Product Brief serves as the foundational input for Product Requirements Document (PRD) creation._

_Next Steps: Handoff to Product Manager for PRD development using the `workflow prd` command._

































