# Proyecto Web NMD UX/UI Specification

_Generated on 2025-10-17 by Chelabs_

## Executive Summary

Proyecto Web NMD necesita un hub digital antes de marzo 2026 para orquestar el lanzamiento del album y coordinar fans, prensa y promotores. El roadmap prioriza un sitio Next.js con storytelling por actos, hero modular, reproductor multimedia y un modo Portal degradable que preserve la narrativa aun en dispositivos modestos.

El MVP debe habilitar flujos operativos claves: agenda autogestionable, press kit descargable, booking con SLA menor a 12 horas, captacion de newsletter y seguimiento de campanas mediante GA4. El contexto incluye restricciones de presupuesto (USD 3.5K), equipo reducido y la necesidad de equilibrar impacto visual con rendimiento y mantenibilidad.

---

## 1. UX Goals and Principles

### 1.1 Target User Personas

**Persona primaria - Fan inmersivo (core community)**
- Jovenes adultos (18-32) acostumbrados a experiencias digitales sofisticadas (festivales, Twitch, VR).
- Necesitan agenda actualizada, contenido exclusivo y CTA listos para pre-save o suscripcion.
- Esperan un modo Portal emocionante pero con opcion de "version ligera" para dispositivos modestos.

**Persona secundaria - Promotor/Prensa especializada**
- Programadores de venues y medios digitales que evaluan profesionalismo y velocidad de respuesta.
- Requieren press kit descargable, testimonios, agenda confirmada y contacto inmediato.
- Necesitan mensajes claros sobre responsable de booking y disponibilidad para seguimiento menor a 12 horas.

**Persona terciaria - Fan curioso / Explorador casual**
- Llega por SEO o recomendaciones; espera sitio rapido, legible y con senales de credibilidad.
- Quiere entender la narrativa en la primera pantalla, ver proximos shows y acceder a merch en menos de tres clics.
- Busca indicadores de confianza (resenas, logos de venues, metricas clave) antes de comprometerse.

### 1.2 Usability Goals

- Fans completan pre-save o suscripcion en maximo tres clics desde el hero.
- Promotores obtienen press kit y contacto en menos de 30 segundos sin correo manual.
- Flujos clave responden en <3 s en 4G para evitar abandono por latencia.
- Formularios validan datos y confirman al instante con mensajes claros.
- Experiencia accesible AA: contraste legible, soporte teclado y mensajes comprensibles.

### 1.3 Design Principles

- Narrativa progresiva: cada seccion guia a las personas hacia su objetivo sin perder claridad funcional.
- Mobile-first con enhancement progresivo; animaciones y modo Portal nunca bloquean tareas criticas.
- Credibilidad profesional inmediata: press kit accesible, metricas y testimonios visibles.
- Control para usuarios: switches para animaciones o idioma, "saltar al contenido" y navegacion accesible.
- Modularidad operativa: componentes definidos (agenda, portal, merch) listos para iterar desde el CMS.

---

## 2. Information Architecture

### 2.1 Site Map

- Home
  - Hero storytelling (album intro, pre-save CTA)
  - Mode Portal (immersive toggle)
  - Highlights (latest release, featured video)
- Agenda
  - Calendario de shows
  - Detalle de evento (info, boletos, media kit)
- Comunidad
  - Newsletter y programa backstage
  - Beneficios y contenido exclusivo
- Portal Profesional
  - Press kit descargable (bio, fotos, dossier PDF)
  - Booking form
  - Testimonios y logos de venues
- Multimedia
  - Galeria de fotos
  - Clips de video y audio integrados
- Merch y Apoyo
  - Productos destacados
  - Bundles y enlaces a tienda externa
- Acerca de / Contacto
  - Narrativa extendida del proyecto
  - Equipo y redes oficiales

### 2.2 Navigation Structure

**Primary navigation (desktop)**
1. Home
2. Agenda
3. Comunidad
4. Portal Profesional
5. Multimedia
6. Merch

**Secondary navigation**
- Enlace persistente a Contacto (header)
- Footer con accesos a Politicas, Terminos y redes sociales
- CTAs dedicados: "Pre-save album", "Descargar press kit"

**Mobile navigation**
- Menu tipo drawer con el mismo orden que desktop
- Acceso rapido a pre-save y Portal Profesional como botones fijos en footer

**Breadcrumbs**
- Portal Profesional > [Modulo] (ej. Press kit)
- Agenda > [Evento]

**Search / Shortcuts**
- Busqueda ligera dentro de agenda y multimedia (filtro por fecha o categoria)
- Toggle Portal on/off visible en todas las paginas

---

## 3. User Flows

- **Flujo 1: Fan inmersivo activa pre-save y modo Portal**
  - Entrada: Hero principal con reproductor y CTA "Pre-save".
  - Pasos: (1) Visita home > (2) Reproduce teaser > (3) Selecciona "Pre-save" > (4) Completa formulario externo (Spotify/Apple) > (5) Confirmacion + invitacion a modo Portal > (6) Activa Portal > (7) Explora contenido exclusivo > (8) CTA secundario hacia Comunidad.
  - Exitos: Pre-save completado, usuario explorando Portal, newsletter captado.
  - Errores: Cancelacion de pre-save o Portal no soportado (mostrar version ligera).

- **Flujo 2: Promotor descarga press kit y solicita booking**
  - Entrada: Link directo al Portal Profesional o CTA "Booking".
  - Pasos: (1) Accede al Portal Profesional > (2) Lee resumen y testimonios > (3) Completa captcha ligero > (4) Descarga press kit (PDF + assets) > (5) Completa formulario de booking > (6) Recibe confirmacion automatica (<1 min).
  - Exitos: Press kit descargado, solicitud enviada con datos completos.
  - Errores: Formulario invalido o descarga fallida (fallback a enlace alterno en drive).

- **Flujo 3: Fan curioso navega agenda y compra boletos**
  - Entrada: Trafico SEO a "Agenda" o Home > Seccion de proximos shows.
  - Pasos: (1) Llega a Agenda > (2) Filtra por ciudad/fecha > (3) Abre detalle de evento > (4) Revisa info (hora, venue, media kit) > (5) Selecciona "Comprar entrada" (link a ticketing) > (6) Opcional: Aade evento al calendario.
  - Exitos: Click a ticketing, conversion trackeada.
  - Errores: Ticketing externo caido (mostrar mensaje + contacto alterno).

- **Flujo 4: Management actualiza contenido via CMS**
  - Entrada: Backend Notion/Sanity.
  - Pasos: (1) Inicia sesion en CMS > (2) Selecciona coleccion (agenda, testimonios, portal) > (3) Edita contenido y assets > (4) Guarda y dispara webhook > (5) Verifica en staging > (6) Publica en produccion.
  - Exitos: Cambios reflejados sin soporte tecnico.
  - Errores: Build fallido (alerta a equipo, fallback a version anterior).

- **Flujo 5: Fan activo se suscribe y entra a comunidad**
  - Entrada: Seccion Comunidad o modal del modo Portal.
  - Pasos: (1) Visualiza beneficios > (2) Completa formulario (nombre, email, preferencia de notificaciones) > (3) Confirma doble opt-in via correo > (4) Accede a contenido backstage > (5) Recibe welcome kit y CTA a merch/agenda.
  - Exitos: Suscripcion confirmada, tag correcto en herramienta de email marketing.
  - Errores: Email invalido o no confirma; se envia recordatorio a las 24 h.

---

## 4. Component Library and Design System

### 4.1 Design System Approach

Adoptar enfoque de diseo atmico inspirado en Design System modular:
- Foundation compartida para colores, tipografia, espaciado y estados.
- Componentes basados en bloques Next.js reutilizables (agenda-card, portal-card, testimonial).
- Tokens de diseo centralizados (JS/JSON) sincronizados con CMS para facilitar ajustes.
- Documentacion ligera en Notion + Storybook para mantener consistencia entre dev/UX.

### 4.2 Core Components

- Hero storytelling (headline, relato del acto, CTA doble, reproductor embed).
- Toggle Portal (switch modo inmersivo con fallback ligero).
- Agenda card (fecha, ciudad, venue, CTA a detalle o ticketing).
- Press kit module (summary, botones de descarga, lista de assets).
- Booking form (campos validados, selector de fecha, mensaje de confirmacion).
- Testimonial strip (quote, mini bio, logos).
- Multimedia gallery (grid responsive, filtros por acto/temporada).
- Merch highlight (cards con precios, link a tienda externa).
- Newsletter/signup (formulario doble opt-in, resumen de beneficios).

---

## 5. Visual Design Foundation

### 5.1 Color Palette

- **Primarios**: Negro profundo (#0A0A0A) y Violeta neon (#7B2EFF) para hero y modo Portal.
- **Secundarios**: Naranja acento (#FF6B3D) para CTA, Verde espectro (#3DFFB3) para estados positivos.
- **Neutros**: Gris niebla (#F2F2F2), Gris medio (#A3A3A3), Gris carbono (#1F1F1F).
- **Feedback**: Rojo alerta (#FF4D4F) para errores, Amarillo advertencia (#FFC53D).

### 5.2 Typography

**Font Families:**
1. Titulos / Display: "Space Grotesk", sans-serif (evoca tecnologia y futurismo).
2. Cuerpo / UI: "Inter", sans-serif por legibilidad en 12-16 px.
3. Alternativa de respaldo: "Helvetica Neue", sans-serif.

**Type Scale:**
- Display XL: 56/64 px (Hero)
- Heading L: 40/48 px (Secciones principales)
- Heading M: 28/36 px (Subsecciones)
- Body L: 18/28 px (textos destacados)
- Body M: 16/24 px (copy base)
- Caption: 14/20 px (labels, notas)

### 5.3 Spacing and Layout

- Grid principal 12 columnas en desktop (max width 1200 px) con gutters de 24 px; mobile utiliza grid 4 columnas con gutters de 16 px.
- Escala de espaciado basada en incrementos de 8 px (8, 16, 24, 32, 48, 64) para padding y margins.
- Hero y secciones criticas usan maximo 120 px de padding superior/inferior; se reduce a 64 px en tablets y 32 px en mobile.
- Contenedores clave (Portal Profesional, Comunidad) utilizan cards con padding interno de 24 px desktop / 16 px mobile.
- Altura minima de CTA 48 px (desktop) / 44 px (mobile) siguiendo guias de accesibilidad.

---

## 6. Responsive Design

### 6.1 Breakpoints

- XS / Mobile: 0 - 480 px (stacked layout, navegacion drawer).
- SM / Phablet: 481 - 768 px (dos columnas ligeras, CTA persistentes).
- MD / Tablet: 769 - 1024 px (grid 8 columnas, menu superior comprimido).
- LG / Desktop: 1025 - 1440 px (grid 12 columnas, animaciones completas).
- XL / Wide: 1441 px en adelante (contenido centrado, max-width 1440 px para evitar line lengths extensos).

### 6.2 Adaptation Patterns

- Hero se convierte en carrusel vertical en mobile (video a 16:9 responsive; CTA duplicados debajo).
- Agenda cards colapsan a lista vertical con filtros en acordeon.
- Portal Profesional muestra press kit comprimido (botones stacked) y oculta metadata avanzada tras toggle.
- Modo Portal activa version lite en mobile (animaciones degradadas, assets comprimidos).
- Multimedia gallery cambia de masonry 3 columnas a slider horizontal en mobile.

---

## 7. Accessibility

### 7.1 Compliance Target

WCAG 2.1 nivel AA para todos los flujos publicos.

### 7.2 Key Requirements

- Contraste minimo 4.5:1 para texto y 3:1 para elementos UI.
- Navegacion soporta teclado completo (skip links, focus visible).
- Subtitulos/descripcion para videos y audio embebido.
- Formulario de booking con etiquetas explicitas, mensajes de error y ARIA roles.
- Toggle de modo Portal accesible (estado anunciado via aria-live).

---

## 8. Interaction and Motion

### 8.1 Motion Principles

- Motion utilitario: maximo 250 ms por transicion, easing cubic-out suave.
- Animaciones deben tener equivalentes "reduce motion" (prefers-reduced-motion) y degradarse a fades simples.
- Priorizar feedback inmediato (hover, focus) sin loops infinitos.

### 8.2 Key Animations

- Hero intro: fade + scale-in de titulares sincronizado con audio.
- Toggle Portal: morph del fondo y transicion de color en 400 ms, seguido de atenuacion de UI estandar.
- Agenda hover: elevate card + highlight CTA (transicion 150 ms).
- Press kit download: microinteraccion (icono check) tras descarga exitosa.
- Newsletter success: confeti ligero (solo cuando reduce motion = false).

---

## 9. Design Files and Wireframes

### 9.1 Design Files

- Figma workspace: `figma.com/file/.../Proyecto-Web-NMD` (estructura Pages: Foundations, Components, Screens).
- Storybook repo compartido para componentes React (deployment en Chromatic).
- Notion seccion "Portal Profesional" documenta guideline de copy y assets.

### 9.2 Key Screen Layouts

- **Screen layout 1 - Home storytelling**: Hero full-bleed con video, CTA primarios, bloques de highlights; secciones inferiores muestran agenda, comunidad y portal profesional como cards horizontales.

- **Screen layout 2 - Portal Profesional**: Cabecera con resumen + CTA descarga, seccion de testimonios, bloque de assets (botones) y formulario booking a dos columnas; responsive cambia a secciones stacked.

- **Screen layout 3 - Agenda detalle de evento**: Header con hero imagen, datos esenciales, botones ticketing y add-to-calendar; tabs para media kit, mapa y logistica tecnica.

---

## 10. Next Steps

### 10.1 Immediate Actions

- Validar flujo de pre-save y Portal lite con stakeholders (workshop express).
- Completar diseño visual de hero, Portal Profesional y agenda en Figma.
- Configurar Storybook inicial con componentes hero, card y toggles.
- Integrar tokens de color/typography en repo Next.js para sincronizar con CMS.

### 10.2 Design Handoff Checklist

- [ ] Figma entrega con frames desktop, tablet y mobile (hero, portal, agenda).
- [ ] Tokens de color/typography exportados a JSON para frontend.
- [ ] Componentes clave documentados en Storybook con props y estados.
- [ ] Flujos anotados (pre-save, press kit, newsletter) con captura de copy final.
- [ ] Accesibilidad revisada (contraste, focus states, reduce motion).
- [ ] Archivo press kit y assets multimedia etiquetados en repositorio compartido.

---

## Appendix

### Related Documents

- PRD: `docs/PRD.md`
- Epics: `docs/epics.md`
- Tech Spec: `Pending`
- Architecture: `Pending`

### Version History

| Date     | Version | Changes               | Author        |
| -------- | ------- | --------------------- | ------------- |
| 2025-10-17 | 1.0     | Initial specification | Chelabs |







