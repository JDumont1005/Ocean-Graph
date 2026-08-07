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

## 🚀 Cómo Usar

### 1. Clonar el repositorio
```bash
git clone https://github.com/jdumont1005/Ocean-Graph.git
cd Ocean-Graph

2. Abrir en el navegador
Abre cualquiera de los archivos index.html (desde la raíz o desde mobile/) directamente en tu navegador. No se requiere servidor web (aunque recomendamos usar un servidor local para probar la carga de JSON y videos).

3. Probar la redirección automática
Desde un dispositivo móvil real o emulado, el sitio te redirigirá a la versión móvil.

Desde una PC, permanecerás en la versión de escritorio.

La preferencia se guarda en localStorage; puedes forzar la versión deseada añadiendo ?force=desktop o ?force=mobile a la URL (si tu código lo soporta).

4. Modo debug
Activa el modo debug en la consola del navegador para ver logs detallados:

localStorage.setItem('debug', 'true');

Para desactivarlo:

localStorage.removeItem('debug');

⚙️ Personalización
Cambiar contenido del portafolio
Edita data/portfolio-videos.json:

Categorías: Añade o modifica objetos en categories con id, name e icon.

Items: Agrega ítems en videos con los campos:

id: identificador único.

type: "video" o "image".

categoryId: debe coincidir con el id de una categoría.

title, description, thumbnail, avatar, handle.

videoUrl: ruta al video (para tipo video).

images: array de rutas de imágenes (para tipo image).

Actualizar servicios
Edita data/services.json:

Hero: Modifica hero.description.

Cards: Ajusta cada tarjeta en cards (colores, textos, iconos, software y socialIcons asociados).

Contacto: Cambia los canales en contactModal.channels (nombre, icono, URL, color).

Modificar posts de comunidad
Edita data/community-posts.json:

Cada post puede ser de tipo text, instagram o tiktok.

Para embeds, proporciona la URL completa y el ID (para TikTok) o la URL (para Instagram).

Las imágenes pueden ser locales o remotas.

Cambiar fondos de héroe
Edita data/hero-backgrounds.json y data/services-backgrounds.json:

Añade o elimina objetos en backgrounds, indicando url, alt, textColor (auto, dark o light) y active.

Personalizar estilos
Los estilos están organizados en archivos separados:

style.css: estilos globales (navbar, loader, secciones comunes).

portfolio.css, services.css, community.css: estilos específicos de cada página.

En la carpeta mobile/ tienes versiones adaptadas para móviles.

📩 Contacto
Si tienes preguntas, sugerencias o deseas colaborar, puedes contactarnos a través de:

WhatsApp: +58 412-7209418

Email: oceangraphven@gmail.com

Ubicación: Venezuela, Edo. La Guaira

Redes sociales:

Instagram

TikTok

Facebook


🤝 Contribuciones
Las contribuciones son bienvenidas. Si deseas mejorar el proyecto:

Haz un fork del repositorio.

Crea una rama para tu funcionalidad (git checkout -b feature/nueva-funcionalidad).

Realiza tus cambios y haz commit (git commit -m 'Añadir nueva funcionalidad').

Sube los cambios a tu fork (git push origin feature/nueva-funcionalidad).

Abre un Pull Request en este repositorio.

Asegúrate de seguir las buenas prácticas de código y mantener la coherencia con el estilo existente.




📄 Licencia
Este proyecto es de código abierto y está disponible bajo la licencia MIT. Siéntete libre de usarlo, modificarlo y distribuirlo.

MIT License

Copyright (c) 2026 Ocean Graph

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


<div align="center"> <p>© 2026 Ocean Graph. Todos los derechos reservados.</p> <p>Hecho con ❤️ y 🌊 en Venezuela</p> </div> ```