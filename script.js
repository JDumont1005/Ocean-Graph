/* ===================================
   OCEAN GRAPH - JAVASCRIPT PRINCIPAL
   Marketing Digital Profesional
   =================================== */

// Mensaje de bienvenida en consola
console.log(
    '%c Ocean Graph ',
    'background: linear-gradient(135deg, #009dff, #00d4ff); color: #141414; padding: 8px 16px; font-weight: bold; font-size: 14px; border-radius: 8px;'
);
console.log('%c 🌊 Sistema iniciado correctamente', 'color: #009dff; font-size: 12px;');

/* ===================================
   VARIABLES GLOBALES
   =================================== */

const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section, .video-hero');
const heroVideo = document.querySelector('.hero-video');
const scrollIndicator = document.querySelector('.scroll-down');

/* ===================================
   NAVBAR - EFECTO AL SCROLL
   =================================== */

let lastScrollTop = 0;
let scrollTimeout;

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Añadir clase 'scrolled' después de 50px
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
});

/* ===================================
   MENÚ HAMBURGUESA (MÓVIL)
   =================================== */

if (hamburger && navMenu) {
    // Toggle del menú
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevenir scroll del body cuando el menú está abierto
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Cerrar menú al hacer click fuera de él
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnHamburger && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ===================================
   NAVEGACIÓN ACTIVA AL SCROLL
   =================================== */

function updateActiveNav() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const scrollPosition = window.pageYOffset + 200;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Ejecutar al hacer scroll con debounce para mejor rendimiento
let scrollTimer;
window.addEventListener('scroll', function() {
    if (scrollTimer) {
        clearTimeout(scrollTimer);
    }
    
    scrollTimer = setTimeout(updateActiveNav, 50);
});

/* ===================================
   SMOOTH SCROLL PARA ENLACES
   =================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/* ===================================
   INDICADOR DE SCROLL (FLECHA)
   =================================== */

if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function() {
        const aboutSection = document.querySelector('#nosotros');
        
        if (aboutSection) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = aboutSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });

    // Ocultar el indicador al hacer scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        
        if (scrollPosition > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '0.7';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    });
}

/* ===================================
   CONTROL DEL VIDEO HERO
   =================================== */

if (heroVideo) {
    // Reproducir video cuando esté listo
    heroVideo.addEventListener('loadeddata', function() {
        console.log('✓ Video cargado correctamente');
    });

    // Pausar video cuando no está visible (optimización)
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                heroVideo.play().catch(err => {
                    console.log('Autoplay bloqueado:', err);
                });
            } else {
                heroVideo.pause();
            }
        });
    }, {
        threshold: 0.5
    });

    videoObserver.observe(heroVideo);

    // Manejo de errores del video
    heroVideo.addEventListener('error', function(e) {
        console.error('Error al cargar el video:', e);
        // Ocultar video y mostrar color de fondo como fallback
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            videoContainer.style.backgroundColor = '#1a1a1a';
        }
    });
}

/* ===================================
   ANIMACIÓN DE ESTADÍSTICAS
   =================================== */

const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;
    
    statNumbers.forEach(stat => {
        const target = stat.textContent;
        const hasPlus = target.includes('+');
        const number = parseInt(target.replace('+', ''));
        
        if (!isNaN(number)) {
            let current = 0;
            const increment = number / 60; // Duración de la animación
            const duration = 1500; // 1.5 segundos
            const stepTime = duration / 60;
            
            const counter = setInterval(() => {
                current += increment;
                
                if (current >= number) {
                    stat.textContent = number + (hasPlus ? '+' : '');
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(current) + (hasPlus ? '+' : '');
                }
            }, stepTime);
        }
    });
    
    statsAnimated = true;
}

// Observador para animar cuando las estadísticas sean visibles
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            animateStats();
        }
    });
}, {
    threshold: 0.5
});

const aboutSection = document.querySelector('.about-section');
if (aboutSection) {
    statsObserver.observe(aboutSection);
}

/* ===================================
   ANIMACIÓN DE APARICIÓN (FADE IN)
   =================================== */

// Elementos que se animarán al aparecer en pantalla
const fadeElements = document.querySelectorAll('.service-card, .portfolio-item, .stat-card');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100); // Delay progresivo
            
            fadeObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Aplicar animación inicial y observar
fadeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(element);
});

/* ===================================
   HOVER EFFECT EN PORTFOLIO
   =================================== */

const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioItems.forEach(item => {
    item.addEventListener('click', function() {
        const category = this.querySelector('.portfolio-category');
        
        if (category) {
            const categoryText = category.textContent;
            console.log(`📸 Proyecto seleccionado: ${categoryText}`);
            
            // Aquí puedes agregar funcionalidad para abrir un modal o galería
            // Por ahora solo mostramos un mensaje
            showNotification(`Ver proyecto: ${categoryText}`);
        }
    });
});

/* ===================================
   SISTEMA DE NOTIFICACIONES
   =================================== */

function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Estilos inline (puedes moverlos al CSS)
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        padding: '1rem 2rem',
        backgroundColor: 'rgba(0, 157, 255, 0.9)',
        color: '#ffffff',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '400',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'all 0.3s ease',
        boxShadow: '0 5px 20px rgba(0, 157, 255, 0.3)'
    });
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/* ===================================
   PREVENCIÓN DE CLICK DERECHO EN VIDEO
   (Opcional - Protección básica)
   =================================== */

if (heroVideo) {
    heroVideo.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
}

/* ===================================
   OPTIMIZACIÓN DE RENDIMIENTO
   =================================== */

// Lazy loading para imágenes (si agregas imágenes al portfolio)
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    console.log(`✓ Lazy loading nativo habilitado para ${images.length} imágenes`);
} else {
    // Fallback para navegadores antiguos
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

/* ===================================
   DETECCIÓN DE DISPOSITIVO
   =================================== */

function detectDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
    
    if (isMobile && !isTablet) {
        document.body.classList.add('is-mobile');
        console.log('📱 Dispositivo móvil detectado');
    } else if (isTablet) {
        document.body.classList.add('is-tablet');
        console.log('📱 Tablet detectado');
    } else {
        document.body.classList.add('is-desktop');
        console.log('💻 Desktop detectado');
    }
}

detectDevice();

/* ===================================
   REDUCIR MOVIMIENTO PARA ACCESIBILIDAD
   =================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Desactivar animaciones si el usuario prefiere movimiento reducido
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    console.log('♿ Modo de movimiento reducido activado');
}

/* ===================================
   MANEJO DE ORIENTACIÓN (MÓVIL)
   =================================== */

window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        window.scrollTo(0, 0);
        
        if (heroVideo) {
            // Reiniciar video en cambio de orientación
            heroVideo.currentTime = 0;
            heroVideo.play().catch(err => console.log('Autoplay bloqueado'));
        }
    }, 100);
});

/* ===================================
   RENDIMIENTO - PAUSA DE ANIMACIONES
   =================================== */

// Pausar animaciones cuando la pestaña no está visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pausar video
        if (heroVideo) {
            heroVideo.pause();
        }
        console.log('⏸️ Página oculta - animaciones pausadas');
    } else {
        // Reanudar video si está visible
        if (heroVideo) {
            const videoSection = document.querySelector('.video-hero');
            const rect = videoSection.getBoundingClientRect();
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                heroVideo.play().catch(err => console.log('Autoplay bloqueado'));
            }
        }
        console.log('▶️ Página visible - animaciones reanudadas');
    }
});

/* ===================================
   CARGA COMPLETA DE LA PÁGINA
   =================================== */

window.addEventListener('load', function() {
    console.log('%c ✓ Página completamente cargada ', 'background: #00d4ff; color: #141414; padding: 5px 10px; font-weight: bold; border-radius: 5px;');
    
    // Pequeña animación de entrada del body
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Estadísticas de carga
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Tiempo de carga: ${(pageLoadTime / 1000).toFixed(2)}s`);
    }
});

/* ===================================
   EASTER EGG - KONAMI CODE
   (Opcional - Por diversión)
   =================================== */

let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function(e) {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiPattern.join('')) {
        console.log('%c 🌊 ¡OCEAN GRAPH ACTIVADO! 🌊 ', 'background: linear-gradient(90deg, #009dff, #00d4ff); color: white; font-size: 20px; padding: 10px; font-weight: bold;');
        showNotification('🎉 ¡Easter Egg Descubierto!');
        
        // Efecto especial
        document.body.style.animation = 'pulse 0.5s ease 3';
    }
});

/* ===================================
   DEBUG MODE (Solo Development)
   =================================== */

// Activar con: localStorage.setItem('debug', 'true')
if (localStorage.getItem('debug') === 'true') {
    console.log('%c DEBUG MODE ACTIVADO ', 'background: red; color: white; padding: 5px 10px;');
    
    // Mostrar información adicional
    window.addEventListener('scroll', function() {
        console.log('Scroll position:', window.pageYOffset);
    });
    
    // Resaltar secciones
    sections.forEach(section => {
        section.style.outline = '2px solid red';
    });
}

/* ===================================
   FIN DEL SCRIPT
   =================================== */

console.log('%c 🚀 Ocean Graph cargado y listo ', 'background: #141414; color: #009dff; padding: 5px 10px; border: 1px solid #009dff; border-radius: 5px;');
