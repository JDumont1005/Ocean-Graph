/* ===================================
   OCEAN GRAPH - JAVASCRIPT OPTIMIZADO
   Marketing Digital Profesional
   Optimizado para Móvil y Desktop
   =================================== */

'use strict';

/* ===================================
   CONFIGURACIÓN Y VARIABLES GLOBALES
   =================================== */

const CONFIG = {
    scrollThreshold: 50,
    statAnimationDuration: 1500,
    notificationDuration: 3000,
    debounceDelay: 100,
    isDebug: localStorage.getItem('debug') === 'true'
};

// Detección de dispositivo
const DEVICE = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTablet: /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768,
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: /Android/i.test(navigator.userAgent),
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
};

// Selectores DOM
const DOM = {
    navbar: document.querySelector('.navbar'),
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu'),
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('section, .video-hero'),
    heroVideoDesktop: document.querySelector('.hero-video-desktop'),
    heroVideoMobile: document.querySelector('.hero-video-mobile'),
    scrollIndicator: document.querySelector('.scroll-indicator'),
    statNumbers: document.querySelectorAll('.stat-number'),
    portfolioItems: document.querySelectorAll('.portfolio-item'),
    serviceCards: document.querySelectorAll('.service-card'),
    fadeElements: document.querySelectorAll('.service-card, .portfolio-item, .stat-card')
};

// Variables de estado
let isMenuOpen = false;
let statsAnimated = false;
let currentYear = new Date().getFullYear();
let scrollTimer = null;
let resizeTimer = null;

/* ===================================
   MENSAJES DE CONSOLA
   =================================== */

function initConsoleMessages() {
    console.log(
        '%c Ocean Graph ',
        'background: linear-gradient(135deg, #009dff, #00d4ff); color: #141414; padding: 8px 16px; font-weight: bold; font-size: 14px; border-radius: 8px;'
    );
    console.log('%c 🌊 Sistema iniciado correctamente', 'color: #009dff; font-size: 12px;');
    
    if (CONFIG.isDebug) {
        console.log('%c DEBUG MODE ACTIVADO ', 'background: red; color: white; padding: 5px 10px;');
    }
    
    // Log de dispositivo
    if (DEVICE.isMobile && !DEVICE.isTablet) {
        console.log('📱 Dispositivo móvil detectado');
        document.body.classList.add('is-mobile');
    } else if (DEVICE.isTablet) {
        console.log('📱 Tablet detectado');
        document.body.classList.add('is-tablet');
    } else {
        console.log('💻 Desktop detectado');
        document.body.classList.add('is-desktop');
    }
}

/* ===================================
   UTILIDADES
   =================================== */

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Detectar si un elemento está visible
function isElementInViewport(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 - offset &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/* ===================================
   NAVEGACIÓN - SCROLL EFFECTS
   =================================== */

function handleNavbarScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > CONFIG.scrollThreshold) {
        DOM.navbar?.classList.add('scrolled');
    } else {
        DOM.navbar?.classList.remove('scrolled');
    }
}

// Event listener con throttle para mejor performance
window.addEventListener('scroll', throttle(handleNavbarScroll, 100));

/* ===================================
   MENÚ HAMBURGUESA
   =================================== */

function toggleMenu(forceClose = false) {
    if (forceClose) {
        isMenuOpen = false;
    } else {
        isMenuOpen = !isMenuOpen;
    }
    
    DOM.hamburger?.classList.toggle('active', isMenuOpen);
    DOM.navMenu?.classList.toggle('active', isMenuOpen);
    DOM.hamburger?.setAttribute('aria-expanded', isMenuOpen);
    
    // Prevenir scroll en body cuando menu está abierto (móvil)
    if (DEVICE.isMobile || DEVICE.isTablet) {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }
}

// Click en hamburguesa
DOM.hamburger?.addEventListener('click', () => toggleMenu());

// Click en enlaces del menú
DOM.navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (DEVICE.isMobile || DEVICE.isTablet) {
            toggleMenu(true);
        }
    });
});

// Click fuera del menú para cerrar
document.addEventListener('click', (event) => {
    if (!isMenuOpen) return;
    
    const isClickInsideMenu = DOM.navMenu?.contains(event.target);
    const isClickOnHamburger = DOM.hamburger?.contains(event.target);
    
    if (!isClickInsideMenu && !isClickOnHamburger) {
        toggleMenu(true);
    }
});

// Cerrar menú al presionar ESC
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isMenuOpen) {
        toggleMenu(true);
    }
});

/* ===================================
   NAVEGACIÓN ACTIVA AL SCROLL
   =================================== */

function updateActiveNavLink() {
    let current = '';
    const scrollPosition = window.pageYOffset + 200;
    
    DOM.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = sectionId;
        }
    });
    
    DOM.navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Actualizar al hacer scroll con debounce
window.addEventListener('scroll', debounce(updateActiveNavLink, CONFIG.debounceDelay));

/* ===================================
   SMOOTH SCROLL
   =================================== */

function smoothScrollTo(target) {
    if (!target) return;
    
    const navbarHeight = DOM.navbar?.offsetHeight || 0;
    const targetPosition = target.offsetTop - navbarHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Aplicar a todos los enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            smoothScrollTo(targetSection);
        }
    });
});

/* ===================================
   INDICADOR DE SCROLL
   =================================== */

if (DOM.scrollIndicator) {
    // Click en el indicador
    DOM.scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.querySelector('#nosotros');
        if (aboutSection) {
            smoothScrollTo(aboutSection);
        }
    });
    
    // Ocultar/mostrar según scroll
    window.addEventListener('scroll', throttle(() => {
        const scrollPosition = window.pageYOffset;
        
        if (scrollPosition > 100) {
            DOM.scrollIndicator.style.opacity = '0';
            DOM.scrollIndicator.style.pointerEvents = 'none';
        } else {
            DOM.scrollIndicator.style.opacity = '0.7';
            DOM.scrollIndicator.style.pointerEvents = 'auto';
        }
    }, 100));
}

/* ===================================
   CONTROL DE VIDEOS
   =================================== */

function initVideoControl() {
    // Seleccionar video según dispositivo
    const activeVideo = (DEVICE.isMobile && !DEVICE.isTablet) 
        ? DOM.heroVideoMobile 
        : DOM.heroVideoDesktop;
    
    if (!activeVideo) return;
    
    // Intentar reproducir
    const playVideo = () => {
        activeVideo.play().catch(err => {
            if (CONFIG.isDebug) {
                console.log('Autoplay bloqueado:', err);
            }
            // Intentar reproducir al hacer click/touch
            document.addEventListener('click', () => {
                activeVideo.play().catch(() => {});
            }, { once: true });
        });
    };
    
    // Cuando el video esté listo
    activeVideo.addEventListener('loadeddata', () => {
        console.log('✓ Video cargado correctamente');
        playVideo();
    });
    
    // Observador de intersección para pausar cuando no está visible
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activeVideo.play().catch(() => {});
            } else {
                activeVideo.pause();
            }
        });
    }, {
        threshold: 0.5
    });
    
    videoObserver.observe(activeVideo);
    
    // Manejo de errores
    activeVideo.addEventListener('error', (e) => {
        console.error('Error al cargar el video:', e);
        const videoContainer = document.querySelector('.video-background');
        if (videoContainer) {
            videoContainer.style.backgroundColor = '#1a1a1a';
        }
    });
    
    // Prevenir click derecho en video (protección básica)
    activeVideo.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
}

initVideoControl();

/* ===================================
   ANIMACIÓN DE ESTADÍSTICAS
   =================================== */

function animateStats() {
    if (statsAnimated) return;
    
    DOM.statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target')) || parseInt(stat.textContent);
        const hasPlus = stat.textContent.includes('+');
        
        if (!target || isNaN(target)) return;
        
        let current = 0;
        const increment = target / (CONFIG.statAnimationDuration / 16.67); // 60fps
        
        const updateCounter = () => {
            current += increment;
            
            if (current >= target) {
                stat.textContent = target + (hasPlus ? '+' : '');
            } else {
                stat.textContent = Math.floor(current) + (hasPlus ? '+' : '');
                requestAnimationFrame(updateCounter);
            }
        };
        
        updateCounter();
    });
    
    statsAnimated = true;
}

// Observador para animar cuando sea visible
if (DOM.statNumbers.length > 0) {
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
}

/* ===================================
   ANIMACIONES DE ENTRADA (FADE IN)
   =================================== */

function initFadeAnimations() {
    if (DOM.fadeElements.length === 0) return;
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Delay progresivo para efecto cascada
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Aplicar estilos iniciales y observar
    DOM.fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(element);
    });
}

initFadeAnimations();

/* ===================================
   INTERACCIÓN CON PORTFOLIO
   =================================== */

DOM.portfolioItems.forEach(item => {
    const handlePortfolioClick = () => {
        const category = item.querySelector('.portfolio-category');
        const categoryText = category ? category.textContent : 'Proyecto';
        
        console.log(`📸 Proyecto seleccionado: ${categoryText}`);
        showNotification(`Ver proyecto: ${categoryText}`);
        
        // Aquí puedes agregar lógica para abrir modal, galería, etc.
    };
    
    // Soporte para touch y click
    item.addEventListener('click', handlePortfolioClick);
    
    // Mejor experiencia táctil en móvil
    if (DEVICE.isTouchDevice) {
        item.addEventListener('touchend', (e) => {
            e.preventDefault();
            handlePortfolioClick();
        }, { passive: false });
    }
});

/* ===================================
   SISTEMA DE NOTIFICACIONES
   =================================== */

function showNotification(message, duration = CONFIG.notificationDuration) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Estilos
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: DEVICE.isMobile ? '1.5rem' : '2rem',
        right: DEVICE.isMobile ? '1.5rem' : '2rem',
        left: DEVICE.isMobile ? '1.5rem' : 'auto',
        padding: '1rem 1.5rem',
        backgroundColor: 'rgba(0, 157, 255, 0.95)',
        color: '#ffffff',
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: '400',
        zIndex: '10000',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'all 0.3s ease',
        boxShadow: '0 5px 20px rgba(0, 157, 255, 0.3)',
        maxWidth: DEVICE.isMobile ? 'calc(100% - 3rem)' : '400px',
        textAlign: 'center'
    });
    
    document.body.appendChild(notification);
    
    // Animar entrada
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });
    
    // Remover después del tiempo especificado
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

/* ===================================
   MANEJO DE ORIENTACIÓN (MÓVIL)
   =================================== */

if (DEVICE.isMobile || DEVICE.isTablet) {
    window.addEventListener('orientationchange', () => {
        // Pequeño delay para que la orientación se complete
        setTimeout(() => {
            // Scroll al top
            window.scrollTo(0, 0);
            
            // Reiniciar video activo
            const activeVideo = (DEVICE.isMobile && !DEVICE.isTablet) 
                ? DOM.heroVideoMobile 
                : DOM.heroVideoDesktop;
            
            if (activeVideo) {
                activeVideo.currentTime = 0;
                activeVideo.play().catch(() => {});
            }
            
            // Actualizar altura en iOS
            if (DEVICE.isIOS) {
                const vh = window.innerHeight * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
            }
        }, 100);
    });
}

/* ===================================
   FIX ALTURA VIEWPORT EN MÓVILES
   =================================== */

function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

if (DEVICE.isMobile || DEVICE.isTablet) {
    setViewportHeight();
    window.addEventListener('resize', debounce(setViewportHeight, 200));
}

/* ===================================
   VISIBILIDAD DE PÁGINA
   =================================== */

document.addEventListener('visibilitychange', () => {
    const activeVideo = (DEVICE.isMobile && !DEVICE.isTablet) 
        ? DOM.heroVideoMobile 
        : DOM.heroVideoDesktop;
    
    if (document.hidden) {
        // Pausar video cuando la pestaña no está visible
        if (activeVideo) {
            activeVideo.pause();
        }
        if (CONFIG.isDebug) {
            console.log('⏸️ Página oculta - video pausado');
        }
    } else {
        // Reanudar video si está visible en viewport
        if (activeVideo) {
            const videoSection = document.querySelector('.video-hero');
            if (videoSection && isElementInViewport(videoSection)) {
                activeVideo.play().catch(() => {});
            }
        }
        if (CONFIG.isDebug) {
            console.log('▶️ Página visible - video reanudado');
        }
    }
});

/* ===================================
   ACCESIBILIDAD
   =================================== */

// Detectar preferencia de movimiento reducido
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    console.log('♿ Modo de movimiento reducido activado');
}

// Navegación por teclado mejorada
document.addEventListener('keydown', (e) => {
    // Tab para navegar entre secciones
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

/* ===================================
   OPTIMIZACIÓN DE RENDIMIENTO
   =================================== */

// Lazy loading de imágenes si existen
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    if (CONFIG.isDebug) {
        console.log(`✓ Lazy loading nativo para ${images.length} imágenes`);
    }
} else {
    // Fallback para navegadores antiguos
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    script.async = true;
    document.body.appendChild(script);
}

/* ===================================
   EASTER EGG - KONAMI CODE
   =================================== */

let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join('') === konamiPattern.join('')) {
        console.log('%c 🌊 ¡OCEAN GRAPH ACTIVADO! 🌊 ', 'background: linear-gradient(90deg, #009dff, #00d4ff); color: white; font-size: 20px; padding: 10px; font-weight: bold;');
        showNotification('🎉 ¡Easter Egg Descubierto!');
        
        // Efecto visual especial
        document.body.style.animation = 'pulse 0.5s ease 3';
    }
});

/* ===================================
   ACTUALIZACIÓN DE AÑO AUTOMÁTICA
   =================================== */

const yearElement = document.getElementById('currentYear');
if (yearElement) {
    yearElement.textContent = currentYear;
}

/* ===================================
   CARGA COMPLETA DE PÁGINA
   =================================== */

window.addEventListener('load', () => {
    console.log('%c ✓ Página completamente cargada ', 'background: #00d4ff; color: #141414; padding: 5px 10px; font-weight: bold; border-radius: 5px;');
    
    // Animación de entrada del body
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });
    
    // Estadísticas de rendimiento
    if (window.performance && CONFIG.isDebug) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Tiempo de carga: ${(pageLoadTime / 1000).toFixed(2)}s`);
    }
    
    // Mensaje final
    console.log('%c 🚀 Ocean Graph listo ', 'background: #141414; color: #009dff; padding: 5px 10px; border: 1px solid #009dff; border-radius: 5px;');
});

/* ===================================
   INICIALIZACIÓN
   =================================== */

function init() {
    initConsoleMessages();
    
    // Inicializar eventos que dependen del DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            updateActiveNavLink();
        });
    } else {
        updateActiveNavLink();
    }
}

// Ejecutar inicialización
init();

/* ===================================
   EXPORTAR PARA DEBUG (OPCIONAL)
   =================================== */

if (CONFIG.isDebug) {
    window.OceanGraph = {
        config: CONFIG,
        device: DEVICE,
        dom: DOM,
        showNotification,
        toggleMenu,
        smoothScrollTo
    };
    console.log('💡 Accede a window.OceanGraph para debugging');
}

/* ===================================
   FIN DEL SCRIPT
   =================================== */
