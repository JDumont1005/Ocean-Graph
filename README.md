# Ocean Graph

<p align="left">
  <a href="https://jdumont1005.github.io/Ocean-Graph/" target="_blank" rel="noopener noreferrer">
    <img
      src="https://img.shields.io/badge/Ver%20sitio%20web-Ocean%20Graph-009dff?style=for-the-badge&logo=google-chrome&logoColor=white"
      alt="Ver sitio web Ocean Graph"
    >
  </a>
</p>

Ocean Graph es una landing page tipo portafolio para un grupo de trabajo especializado en servicios de marketing digital: diseño gráfico, fotografía, videos profesionales, videografía y community management.

El objetivo de la web es presentar, de forma clara y atractiva, quiénes son, qué hacen y algunos ejemplos de su trabajo, manteniendo una estética minimalista y profesional.

---

## Visión general

La página está pensada como:

- Portafolio visual de la marca.
- Carta de presentación de los servicios ofrecidos.
- Punto de contacto rápido vía WhatsApp, email y redes sociales.
- Experiencia limpia, moderna y responsive, tanto en escritorio como en móvil.

Paleta principal (tema oscuro por defecto):

- Fondo: `#141414`
- Texto: `#ffffff`
- Acento: `#009dff`

Tema claro:

- Fondo: `#f2f2f2`
- Texto: `#141414`
- Acento: `#009dff`

---

## Características principales

### UI/UX

- Hero principal con video de fondo a pantalla completa.
- Overlay oscuro sobre el video para asegurar legibilidad.
- Texto principal y botón de “Descubre más” siempre en blanco para garantizar contraste, incluso en escenas oscuras del video.
- Navbar fija con:
  - Logo SVG de Ocean Graph.
  - Menú de navegación.
  - Selector de tema (oscuro/claro) con iconos luna/sol.
  - Menú hamburguesa en móvil.

### Secciones

1. **Inicio (Hero con video)**
   - Video de fondo (`video/evento carros_1.mp4`) adaptado a cualquier resolución.
   - Título principal y descripción.
   - Indicador de scroll “Descubre más”.

2. **Quiénes Somos**
   - Descripción del equipo y filosofía de trabajo.
   - Tres estadísticas animadas:
     - Proyectos completados.
     - Clientes satisfechos.
     - Servicios especializados.

3. **Servicios**
   - Tarjetas individuales para:
     - Diseño gráfico.
     - Fotografía.
     - Videos profesionales.
     - Videografía.
     - Community Manager.
   - Cada tarjeta incluye icono SVG y descripción.

4. **Portfolio**
   - Grid responsive de proyectos.
   - Cada item puede:
     - Mostrar una imagen real (si se configura).
     - O un placeholder con icono (si no hay imagen).
   - Overlay con:
     - Categoría del proyecto.
     - Llamada “Ver proyecto”.

5. **Contacto**
   - Email clicable (mailto).
   - WhatsApp clicable:
     - Usa número de Venezuela: `+58 412-7209418`
     - Redirige a `https://wa.me/584127209418`
   - Ubicación.
   - Texto explicativo sobre el tipo de colaboración que ofrecen.

6. **Footer**
   - Logo SVG de Ocean Graph.
   - Año actualizado automáticamente con JavaScript.
   - Redes sociales:
     - Instagram: `https://www.instagram.com/oceangraficos`
     - Facebook: `https://www.facebook.com/oceangraficos?locale=es_LA`
     - TikTok: `https://www.tiktok.com/@oceangraficos?is_from_webapp=1&sender_device=pc`

### Funcionalidades de JavaScript

- Pantalla de carga:
  - Spinner SVG (Iconify vía data URI).
  - Bloquea el scroll mientras carga.
  - Tiempo mínimo configurable antes de mostrar la página.

- Cambio de tema (tema oscuro/claro):
  - Botón en el navbar con iconos luna/sol.
  - Persistencia en `localStorage` (`og-theme`).
  - Cambia variables CSS (fondo, texto, secciones).
  - Navbar adaptada para que en tema claro siga siendo legible.

- Navegación:
  - Scroll suave hacia las secciones.
  - Menú hamburguesa en móvil.
  - Cierre automático del menú al seleccionar un enlace.
  - Resaltado de enlace activo según la sección visible.
  - Navbar con estilo diferente al hacer scroll.

- Hero video:
  - Selección automática de video desktop/móvil.
  - Reintento de autoplay en interacción si el navegador lo bloquea.
  - Pausa del video cuando el hero sale del viewport.
  - Pausa/reanudación cuando la pestaña pierde/gana foco.

- Animaciones de contenido:
  - Aparición con fade-in de tarjetas de servicios, stats y items de portfolio al entrar en viewport.
  - Estadísticas animadas con conteo progresivo.
  - Notificaciones flotantes informativas (por ejemplo al hacer clic en proyectos de portfolio).

- Accesibilidad y rendimiento:
  - Soporte para `prefers-reduced-motion`.
  - Uso de `IntersectionObserver` para animaciones (en lugar de escuchar scroll continuamente).
  - Altura de viewport corregida en móviles (`--vh`).
  - Escucha de cambio de orientación en móviles.

---

## Tecnologías usadas

- HTML5 semántico.
- CSS3 (sin frameworks):
  - Variables CSS.
  - Media queries responsive.
  - Animaciones básicas.
- JavaScript puro (Vanilla JS):
  - Sin dependencias externas.
  - Uso moderado y organizado por bloques funcionales.

---

## Estructura del proyecto

```text
ocean-graph/
│
├── index.html          # Estructura de la página
├── style.css           # Estilos (tema oscuro/claro, layout, responsive)
├── script.js           # Lógica de UI, loader, tema, animaciones
│
├── Logo/
│   ├── OceanGraph - Ola.svg           # Logo principal (navbar, footer, favicon)
│   └── logos--whatsapp-icon.svg       # Icono de WhatsApp en contacto
│
├── video/
│   └── evento carros_1.mp4            # Video principal del hero
│
└── images/
    └── portfolio/                     # Imágenes opcionales para el portfolio
        ├── diseno-grafico.jpg
        ├── fotografia.jpg
        ├── video.jpg
        ├── videografia.jpg
        ├── social-media.jpg
        └── branding.jpg
