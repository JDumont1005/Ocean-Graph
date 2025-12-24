/* ===================================
   OCEAN GRAPH - JAVASCRIPT OPTIMIZADO
   Marketing Digital Profesional
   Tema oscuro / claro + Loader + Hero
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
    loaderMinTime: 800,
    isDebug: localStorage.getItem('debug') === 'true'
};

const DEVICE = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTablet: /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768,
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: /Android/i.test(navigator.userAgent),
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
};

const DOM = {
    loader: document.getElementById('loader'),
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
    fadeElements: document.querySelectorAll('.service-card, .portfolio-item, .stat-card'),
    yearElement: document.getElementById('currentYear'),
    themeToggle: document.querySelector('.theme-toggle')
};

let isMenuOpen = false;
let statsAnimated = false;

/* ===================================
   TEMA (OSCURE / CLARO)
   =================================== */

const THEME_KEY = 'og-theme';

const DARK_THEME_VARS = {
    '--color-dark': '#141414',
    '--color-dark-alt': '#1a1a1a',
    '--color-white': '#ffffff'
};

const LIGHT_THEME_VARS = {
    '--color-dark': '#f2f2f2',
    '--color-dark-alt': '#e6e6e6',
    '--color-white': '#141414'
};

let currentTheme = 'dark';

function setThemeVariables(vars) {
    const root = document.documentElement;
    Object.keys(vars).forEach(key => {
        root.style.setProperty(key, vars[key]);
    });
}

function updateNavbarThemeStyles() {
    if (!DOM.navbar) return;

    const scrolled = window.pageYOffset > CONFIG.scrollThreshold;
    const isLight = currentTheme === 'light';

    if (isLight) {
        if (scrolled) {
            DOM.navbar.style.backgroundColor = 'rgba(242, 242, 242, 0.98)';
            DOM.navbar.style.borderBottomColor = 'rgba(0, 0, 0, 0.10)';
            DOM.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.10)';
        } else {
            DOM.navbar.style.backgroundColor = 'rgba(242, 242, 242, 0.92)';
            DOM.navbar.style.borderBottomColor = 'rgba(0, 0, 0, 0.06)';
            DOM.navbar.style.boxShadow = 'none';
        }

        DOM.navLinks.forEach(link => {
            link.style.color = 'rgba(0, 0, 0, 0.75)';
        });

        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink) {
            activeLink.style.color = '#141414';
        }

        const logoText = document.querySelector('.logo-text');
        if (logoText) {
            logoText.style.color = '#141414';
        }
    } else {
        DOM.navbar.style.backgroundColor = '';
        DOM.navbar.style.borderBottomColor = '';
        DOM.navbar.style.boxShadow = '';

        DOM.navLinks.forEach(link => {
            link.style.color = '';
        });

        const logoText = document.querySelector('.logo-text');
        if (logoText) {
            logoText.style.color = '';
        }
    }
}

function applyTheme(theme) {
    const isLight = theme === 'light';
    currentTheme = isLight ? 'light' : 'dark';

    if (isLight) {
        setThemeVariables(LIGHT_THEME_VARS);
        document.body.classList.add('theme-light');
    } else {
        setThemeVariables(DARK_THEME_VARS);
        document.body.classList.remove('theme-light');
    }

    if (DOM.themeToggle) {
        DOM.themeToggle.setAttribute(
            'aria-label',
            isLight ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'
        );
        DOM.themeToggle.title = isLight ? 'Cambiar a modo oscuro' : 'Cambiar tema';
    }

    updateNavbarThemeStyles();
    localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');

    if (CONFIG.isDebug) {
        console.log('Tema aplicado:', isLight ? 'light' : 'dark');
    }
}

function initTheme() {
    let savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme !== 'light' && savedTheme !== 'dark') {
        savedTheme = 'dark';
    }

    applyTheme(savedTheme);

    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', () => {
            const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(nextTheme);
        });
    }
}

/* ===================================
   PANTALLA DE CARGA (SPINNER SIMPLE)
   =================================== */

function hideLoader() {
    if (!DOM.loader) return;
    DOM.loader.classList.add('hidden');
    document.body.style.overflow = '';
    setTimeout(() => {
        if (DOM.loader) {
            DOM.loader.remove();
        }
    }, 600);
    if (CONFIG.isDebug) {
        console.log('Loader ocultado, sitio listo');
    }
}

function initLoader() {
    if (!DOM.loader) return;

    document.body.style.overflow = 'hidden';

    const startTime = Date.now();

    function done() {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(CONFIG.loaderMinTime - elapsed, 0);
        setTimeout(hideLoader, delay);
    }

    if (document.readyState === 'complete') {
        done();
    } else {
        window.addEventListener('load', done, { once: true });
    }
}

/* ===================================
   MENSAJES DE CONSOLA
   =================================== */

function initConsoleMessages() {
    console.log(
        '%c Ocean Graph ',
        'background: linear-gradient(135deg, #009dff, #00d4ff); color: #141414; padding: 8px 16px; font-weight: bold; font-size: 14px; border-radius: 8px;'
    );
    console.log('%c Sistema iniciado correctamente', 'color: #009dff; font-size: 12px;');
    
    if (CONFIG.isDebug) {
        console.log('%c DEBUG MODE ACTIVADO ', 'background: red; color: white; padding: 5px 10px;');
    }
    
    if (DEVICE.isMobile && !DEVICE.isTablet) {
        console.log('Dispositivo móvil detectado');
        document.body.classList.add('is-mobile');
    } else if (DEVICE.isTablet) {
        console.log('Tablet detectado');
        document.body.classList.add('is-tablet');
    } else {
        console.log('Desktop detectado');
        document.body.classList.add('is-desktop');
    }
}

/* ===================================
   UTILIDADES
   =================================== */

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

function throttle(func, limit) {
    let inThrottle;
    return function throttled(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => { inThrottle = false; }, limit);
        }
    };
}

function isElementInViewport(el, offset = 0) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 - offset &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/* ===================================
   NAVEGACIÓN - SCROLL EFFECTS + TEMA
   =================================== */

function handleNavbarScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > CONFIG.scrollThreshold) {
        DOM.navbar?.classList.add('scrolled');
    } else {
        DOM.navbar?.classList.remove('scrolled');
    }

    updateNavbarThemeStyles();
}

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
    DOM.hamburger?.setAttribute('aria-expanded', String(isMenuOpen));
    
    if (DEVICE.isMobile || DEVICE.isTablet) {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }
    
    if (CONFIG.isDebug) {
        console.log('Menu ' + (isMenuOpen ? 'abierto' : 'cerrado'));
    }
}

DOM.hamburger?.addEventListener('click', () => toggleMenu());

DOM.navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (DEVICE.isMobile || DEVICE.isTablet) {
            toggleMenu(true);
        }
    });
});

document.addEventListener('click', (event) => {
    if (!isMenuOpen) return;
    
    const isClickInsideMenu = DOM.navMenu?.contains(event.target);
    const isClickOnHamburger = DOM.hamburger?.contains(event.target);
    
    if (!isClickInsideMenu && !isClickOnHamburger) {
        toggleMenu(true);
    }
});

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
        link.style.color = '';
        const href = link.getAttribute('href');
        
        if (href === '#' + current) {
            link.classList.add('active');
        }
    });

    updateNavbarThemeStyles();
}

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
    
    if (CONFIG.isDebug) {
        console.log('Scroll a: ' + (target.id || 'elemento'));
    }
}

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
    DOM.scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.querySelector('#nosotros');
        if (aboutSection) {
            smoothScrollTo(aboutSection);
        }
    });
    
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
   CONTROL DE VIDEO HERO
   =================================== */

function initVideoControl() {
    const activeVideo = (DEVICE.isMobile && !DEVICE.isTablet) 
        ? DOM.heroVideoMobile 
        : DOM.heroVideoDesktop;
    
    if (!activeVideo) {
        if (CONFIG.isDebug) {
            console.warn('No se encontró video hero');
        }
        return;
    }
    
    const playVideo = () => {
        const playPromise = activeVideo.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (CONFIG.isDebug) {
                    console.log('Video reproduciendo');
                }
            }).catch(err => {
                if (CONFIG.isDebug) {
                    console.log('Autoplay bloqueado: ' + err.message);
                }
                
                const tryPlayOnInteraction = () => {
                    activeVideo.play().catch(() => {});
                };
                
                document.addEventListener('click', tryPlayOnInteraction, { once: true });
                document.addEventListener('touchstart', tryPlayOnInteraction, { once: true });
            });
        }
    };
    
    if (activeVideo.readyState >= 3) {
        playVideo();
    } else {
        activeVideo.addEventListener('loadeddata', () => {
            console.log('Video cargado correctamente');
            playVideo();
        }, { once: true });
    }
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                activeVideo.play().catch(() => {});
            } else {
                activeVideo.pause();
            }
        });
    }, { threshold: 0.5 });
    
    videoObserver.observe(activeVideo);
    
    activeVideo.addEventListener('error', (e) => {
        console.error('Error al cargar el video:', e);
        const videoContainer = document.querySelector('.video-background');
        if (videoContainer) {
            videoContainer.style.backgroundColor = '#1a1a1a';
        }
    });
    
    activeVideo.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
}

/* ===================================
   ANIMACIÓN DE ESTADÍSTICAS
   =================================== */

function animateStats() {
    if (statsAnimated) return;
    
    DOM.statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const hasPlus = stat.textContent.includes('+');
        
        if (!target || isNaN(target)) {
            if (CONFIG.isDebug) {
                console.warn('Estadística sin data-target válido');
            }
            return;
        }
        
        let current = 0;
        const increment = target / (CONFIG.statAnimationDuration / 16.67);
        
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
    
    if (CONFIG.isDebug) {
        console.log('Estadísticas animadas');
    }
}

if (DOM.statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateStats();
            }
        });
    }, { threshold: 0.5 });
    
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
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = Array.from(DOM.fadeElements).indexOf(entry.target) * 50;
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, delay);
                
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    DOM.fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(element);
    });
    
    if (CONFIG.isDebug) {
        console.log('Fade animations inicializadas (' + DOM.fadeElements.length + ' elementos)');
    }
}

/* ===================================
   INTERACCIÓN CON PORTFOLIO
   =================================== */

DOM.portfolioItems.forEach((item) => {
    const handlePortfolioClick = () => {
        const category = item.querySelector('.portfolio-category');
        const categoryText = category ? category.textContent : 'Proyecto';
        
        console.log('Proyecto seleccionado: ' + categoryText);
        showNotification(categoryText + ' - Próximamente disponible');
    };
    
    item.addEventListener('click', handlePortfolioClick);
    
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
    
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });
    
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
        setTimeout(() => {
            window.scrollTo(0, 0);
            
            const activeVideo = (DEVICE.isMobile && !DEVICE.isTablet) 
                ? DOM.heroVideoMobile 
                : DOM.heroVideoDesktop;
            
            if (activeVideo) {
                activeVideo.currentTime = 0;
                activeVideo.play().catch(() => {});
            }
            
            if (DEVICE.isIOS) {
                setViewportHeight();
            }
            
            if (CONFIG.isDebug) {
                console.log('Orientación cambiada');
            }
        }, 100);
    });
}

/* ===================================
   FIX ALTURA VIEWPORT EN MÓVILES
   =================================== */

function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
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
        if (activeVideo) {
            activeVideo.pause();
        }
        if (CONFIG.isDebug) {
            console.log('Página oculta - video pausado');
        }
    } else {
        if (activeVideo) {
            const videoSection = document.querySelector('.video-hero');
            if (videoSection && isElementInViewport(videoSection)) {
                activeVideo.play().catch(() => {});
            }
        }
        if (CONFIG.isDebug) {
            console.log('Página visible - video reanudado');
        }
    }
});

/* ===================================
   OPTIMIZACIÓN PARA MÓVIL
   =================================== */

function optimizeForMobile() {
    if (DEVICE.isMobile && !DEVICE.isTablet) {
        console.log('Aplicando optimizaciones móvil...');
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
    }
}

/* ===================================
   MODO BAJO RENDIMIENTO (OPCIONAL)
   =================================== */

function enableLowPerformanceMode() {
    document.body.classList.add('low-performance');
    localStorage.setItem('lowPerformance', 'true');
    console.log('Modo bajo rendimiento activado');
    showNotification('Modo de rendimiento optimizado activado');
}

function disableLowPerformanceMode() {
    document.body.classList.remove('low-performance');
    localStorage.removeItem('lowPerformance');
    console.log('Modo bajo rendimiento desactivado');
    showNotification('Modo normal restaurado');
}

if (localStorage.getItem('lowPerformance') === 'true') {
    enableLowPerformanceMode();
}

/* ===================================
   ACCESIBILIDAD
   =================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    console.log('Modo de movimiento reducido activado');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

/* ===================================
   AÑO AUTOMÁTICO
   =================================== */

if (DOM.yearElement) {
    const currentYear = new Date().getFullYear();
    DOM.yearElement.textContent = currentYear;
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
        console.log('%c OCEAN GRAPH ACTIVADO ', 'background: linear-gradient(90deg, #009dff, #00d4ff); color: white; font-size: 20px; padding: 10px; font-weight: bold;');
        showNotification('Easter Egg Descubierto');
        document.body.style.animation = 'pulse 0.5s ease 3';
    }
});

/* ===================================
   INICIALIZACIÓN
   =================================== */

function init() {
    initLoader();
    initConsoleMessages();
    initTheme();
    optimizeForMobile();
    initVideoControl();
    initFadeAnimations();
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            updateActiveNavLink();
        });
    } else {
        updateActiveNavLink();
    }
}

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
        smoothScrollTo,
        enableLowPerformanceMode,
        disableLowPerformanceMode,
        animateStats,
        applyTheme
    };
    console.log('Accede a window.OceanGraph para debugging');
}

/* ===================================
   INICIO
   =================================== */

init();

console.log('%c Ocean Graph listo ', 'background: #141414; color: #009dff; padding: 5px 10px; border: 1px solid #009dff; border-radius: 5px;');
