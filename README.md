<div align="center">

  <!-- LOGO -->
  <img src="Logo/OceanGraph - Ola.svg" width="140" alt="Ocean Graph Logo" />

  <h1>OCEAN GRAPH</h1>
  <h3>Agencia de Marketing Digital Independiente</h3>

  <p><em>Transformamos ideas en experiencias visuales únicas que conectan, inspiran y generan resultados.</em></p>

  <br />

  <!-- BOTÓN PRINCIPAL -->
  <a href="https://jdumont1005.github.io/Ocean-Graph/index.html">
    <img src="https://img.shields.io/badge/🌊_INGRESAR_A_LA_WEB-009dff?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Ingresar a la web" />
  </a>

  <br /><br />

  <!-- REDES SOCIALES -->
  <a href="https://www.instagram.com/oceangraficos">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" />
  </a>
  <a href="https://www.tiktok.com/@oceangraficos">
    <img src="https://img.shields.io/badge/TikTok-000000?style=for-the-badge&logo=tiktok&logoColor=white" />
  </a>
  <a href="https://www.facebook.com/oceangraficos">
    <img src="https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white" />
  </a>

  <br /><br />

  <!-- BADGES DE TECNOLOGÍAS -->
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/JSON-000000?style=flat-square&logo=json&logoColor=white" />

  <br />

  <img src="https://img.shields.io/badge/Responsive-✓-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/Dark/Light_Mode-✓-blueviolet?style=flat-square" />
  <img src="https://img.shields.io/badge/Lazy_Loading-✓-success?style=flat-square" />

</div>

---

## 📖 Tabla de Contenidos

- [🌊 Sobre el Proyecto](#-sobre-el-proyecto)
- [✨ Características Principales](#-características-principales)
- [🛠️ Tecnologías y Herramientas](#️-tecnologías-y-herramientas)
- [📁 Estructura del Sitio](#-estructura-del-sitio)
- [🚀 Cómo Usar](#-cómo-usar)
- [⚙️ Personalización](#️-personalización)
- [📩 Contacto](#-contacto)
- [📄 Licencia](#-licencia)

---

## 🌊 Sobre el Proyecto

**Ocean Graph** es una plataforma web profesional diseñada para una agencia de marketing digital independiente especializada en **contenido visual para redes sociales**, con un enfoque principal en **Instagram**. El sitio funciona como:

- **Portafolio interactivo**: Muestra trabajos audiovisuales organizados por categorías (Salud, Belleza, Eventos, Deportes, Gastronomía, etc.).
- **Centro de comunidad**: Un timeline dinámico con novedades, avisos y publicaciones integradas de Instagram y TikTok.
- **Carta de servicios**: Presenta los servicios ofrecidos (diseño de logos, videos, fotografía, drone, manejo de redes) con información visual y técnica.

El proyecto está construido con **HTML5, CSS3 y JavaScript puro**, sin frameworks, y se alimenta de archivos **JSON** para facilitar la actualización del contenido sin modificar el código HTML.

---

## ✨ Características Principales

| Característica | Descripción |
|----------------|-------------|
| **📱 Detección inteligente de dispositivo** | Detecta automáticamente si el usuario accede desde móvil, tablet o escritorio y redirige a la versión optimizada. La preferencia se guarda en `localStorage`. |
| **🎨 Tema oscuro / claro** | El usuario puede alternar entre ambos modos; la preferencia persiste entre sesiones. |
| **📂 Portafolio dinámico** | Las categorías y los videos/imágenes se cargan desde un archivo JSON. Filtrado por categorías con animaciones suaves. |
| **🎬 Reproductor de video personalizado** | Estilo "Reels/TikTok" en móvil (fullscreen táctil) y con controles avanzados en escritorio. Incluye botón de silencio, barra de progreso y ocultamiento automático de controles. |
| **🖼️ Visor de imágenes con swipe** | En móvil, permite navegar entre imágenes con gestos táctiles y botones laterales. |
| **👥 Hub de comunidad** | Timeline de publicaciones con soporte para texto, imágenes, y embeds de Instagram y TikTok con **lazy loading** para optimizar el rendimiento. |
| **🌊 Fondo animado con olas** | Decoración geométrica animada en la página de comunidad que aporta dinamismo visual. |
| **⚡ Optimización de rendimiento** | Carga perezosa (lazy loading) de imágenes y embeds, aceleración por hardware (GPU) y reducción de animaciones para usuarios con preferencia de movimiento reducido. |
| **♿ Accesibilidad** | Navegación por teclado, `skip-link`, atributos ARIA y soporte para `prefers-reduced-motion`. |

---

## 🛠️ Tecnologías y Herramientas

- **Frontend**: HTML5, CSS3 (Flexbox, Grid, Variables CSS, Animaciones), JavaScript (ES6+).
- **Gestión de datos**: Archivos JSON para contenido dinámico (portafolio, servicios, comunidad, fondos de héroe).
- **Optimización**: Intersection Observer API, aceleración por hardware (GPU), `loading="lazy"`.
- **Embeds**: Integración con scripts oficiales de Instagram (`instgrm`) y TikTok (`tiktok-embed`).
- **Almacenamiento local**: `localStorage` para preferencias de tema y tipo de dispositivo.

---

## 📁 Estructura del Sitio

Ocean-Graph/
├── index.html # Página principal (escritorio)
├── InPortafolio.html # Portafolio (escritorio)
├── Servicios.html # Servicios (escritorio)
├── Community.html # Comunidad (escritorio)
├── style.css # Estilos globales (escritorio)
├── portfolio.css # Estilos específicos del portafolio
├── services.css # Estilos específicos de servicios
├── community.css # Estilos específicos de comunidad
├── script.js # Lógica global (escritorio)
├── portfolio.js # Lógica del portafolio
├── services.js # Lógica de servicios
├── community.js # Lógica de comunidad
├── data/ # Archivos JSON con contenido
│ ├── portfolio-videos.json
│ ├── services.json
│ ├── services-backgrounds.json
│ ├── community-posts.json
│ └── hero-backgrounds.json
├── images/ # Imágenes (proyectos, avatares, software)
│ ├── ATSV/
│ ├── Marielsys/
│ ├── SpaLari/
│ ├── Karat/
│ ├── FrenosSun/
│ ├── TransporteJacob/
│ ├── Perfumes/
│ ├── Evento/
│ ├── Sesiones/
│ ├── Gastronomia/
│ ├── Productos/
│ ├── Ocean/
│ ├── Deportes/
│ ├── Kikis/
│ └── software/ # Iconos de herramientas
├── video/ # Videos (incluye video hero)
├── Logo/ # Logotipos (Ocean Graph, clientes)
└── mobile/ # Versión optimizada para móviles
├── index.html
├── ServicesMobile.html
├── PortfolioMobile.html
├── CommunityMobile.html
├── style.css
├── services.css
├── portfolio.css
├── community.css
├── script.js
├── services.js
├── portfolio.js
└── community.js

---
</div>