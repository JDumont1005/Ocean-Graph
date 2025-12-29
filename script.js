/* ===================================
   OCEAN GRAPH - ESCRITORIO
   script.js
   Tema oscuro/claro + Loader + Hero
   Versión optimizada solo para escritorio
   =================================== */

'use strict';

/* ===================================
   CONFIGURACIÓN
   =================================== */

const CONFIG = {
    scrollThreshold: 50,
    statAnimationDuration: 1500,
    notificationDuration: 3000,
    debounceDelay: 100,
    loaderMinTime: 800,
    isDebug: localStorage.getItem('debug') === 'true'
};

const DOM = {
    loader: document.getElementById('loader'),
    loaderText: document.querySelector('.loader-text'),
    navbar: document.querySelector('.navbar'),
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu'),
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('section, .video-hero'),
    heroVideoDesktop: document.querySelector('.hero-video-desktop'),
    heroVideoMobile: document.querySelector('.hero-video-mobile'),
    scrollIndicator: document.querySelector('.scroll-indicator'),
    statNumbers: document.querySelectorAll('.stat-number'),
    fadeElements: document.querySelectorAll('.stat-card'),
    yearElement: document.getElementById('currentYear'),
    themeToggle: document.querySelector('.theme-toggle')
};

const IS_HOME = !!document.querySelector('.video-hero');

let isMenuOpen = false;
let statsAnimated = false;
let currentTheme = 'dark';

/* ===================================
   DETECCIÓN: ¿DEBERÍA USARSE VERSIÓN MÓVIL?
   (solo para redirigir a /mobile/index.html)
   =================================== */

function isHandheldDevice() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isUAHandheld = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isSmallScreen = window.innerWidth <= 900;
    return isUAHandheld || isSmallScreen;
}

/* ===================================
   TEMA (OSCURO / CLARO)
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
        if (activeLink) activeLink.style.color = '#141414';

        const logoText = document.querySelector('.logo-text');
        if (logoText) logoText.style.color = '#141414';
    } else {
        DOM.navbar.style.backgroundColor = '';
        DOM.navbar.style.borderBottomColor = '';
        DOM.navbar.style.boxShadow = '';

        DOM.navLinks.forEach(link => {
            link.style.color = '';
        });

        const logoText = document.querySelector('.logo-text');
        if (logoText) logoText.style.color = '';
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
        console.log('[DESKTOP] Tema aplicado:', isLight ? 'light' : 'dark');
    }
}

function initTheme() {
    let savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme !== 'light' && savedTheme !== 'dark') savedTheme = 'dark';
    applyTheme(savedTheme);

    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', () => {
            const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(nextTheme);
        });
    }
}

/* ===================================
   LOADER + CHEQUEO DISPOSITIVO
   =================================== */

function hideLoader() {
    if (!DOM.loader) return;

    DOM.loader.classList.add('hidden');
    DOM.loader.setAttribute('aria-hidden', 'true');
    DOM.loader.setAttribute('aria-busy', 'false');
    document.body.style.overflow = '';

    setTimeout(() => {
        if (DOM.loader) DOM.loader.remove();
    }, 600);

    if (CONFIG.isDebug) console.log('[DESKTOP] Loader ocultado (escritorio)');
}

function initLoader() {
    if (!DOM.loader) return;

    DOM.loader.setAttribute('aria-busy', 'true');
    DOM.loader.setAttribute('aria-hidden', 'false');

    document.body.style.overflow = 'hidden';
    const startTime = Date.now();
    let finished = false;

    function proceed() {
        if (finished) return;
        finished = true;

        const elapsed = Date.now() - startTime;
        const remaining = Math.max(CONFIG.loaderMinTime - elapsed, 0);

        setTimeout(() => {
            if (IS_HOME && isHandheldDevice()) {
                if (CONFIG.isDebug) {
                    console.log('[DESKTOP] Dispositivo de mano detectado. Redirigiendo a /mobile/index.html...');
                }

                if (DOM.loaderText) {
                    DOM.loaderText.innerHTML =
                        'OCEAN <span>GRAPH</span><br><small style="font-size:0.8rem;font-weight:300;opacity:0.8;">Detectando dispositivo móvil...</small>';
                }

                setTimeout(() => {
                    window.location.href = 'mobile/index.html';
                }, 600);
            } else {
                hideLoader();
            }
        }, remaining);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        proceed();
    } else {
        document.addEventListener('DOMContentLoaded', proceed, { once: true });
        // Fallback: nunca dejar loader infinito
        setTimeout(proceed, 5000);
    }
}

/* ===================================
   CONSOLA
   =================================== */

function initConsoleMessages() {
    console.log(
        '%c Ocean Graph - Desktop ',
        'background: linear-gradient(135deg, #009dff, #00d4ff); color: #141414; padding: 8px 16px; font-weight: bold; font-size: 14px; border-radius: 8px;'
    );

    if (CONFIG.isDebug) {
        console.log('[DESKTOP] DEBUG MODE ACTIVADO');
    }
}

/* ===================================
   UTILIDADES
   =================================== */

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
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
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    return (
        rect.top >= 0 - offset &&
        rect.left >= 0 &&
        rect.bottom <= vh + offset &&
        rect.right <= vw
    );
}

/* ===================================
   NAVBAR / SCROLL
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
   MENÚ HAMBURGUESA (OCULTO EN ESCRITORIO, PERO FUNCIONAL)
   =================================== */

function toggleMenu(forceClose = false) {
    if (!DOM.hamburger || !DOM.navMenu) return;

    if (forceClose) {
        isMenuOpen = false;
    } else {
        isMenuOpen = !isMenuOpen;
    }

    DOM.hamburger.classList.toggle('active', isMenuOpen);
    DOM.navMenu.classList.toggle('active', isMenuOpen);
    DOM.hamburger.setAttribute('aria-expanded', String(isMenuOpen));

    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

    if (CONFIG.isDebug) {
        console.log('[DESKTOP] Menú', isMenuOpen ? 'abierto' : 'cerrado');
    }
}

DOM.hamburger?.addEventListener('click', () => toggleMenu());

DOM.navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (isMenuOpen) toggleMenu(true);
    });
});

document.addEventListener('click', (event) => {
    if (!isMenuOpen) return;
    const isClickInsideMenu = DOM.navMenu?.contains(event.target);
    const isClickOnHamburger = DOM.hamburger?.contains(event.target);
    if (!isClickInsideMenu && !isClickOnHamburger) toggleMenu(true);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isMenuOpen) toggleMenu(true);
});

/* ===================================
   NAV ACTIVA AL SCROLL (SOLO HOME)
   =================================== */

function updateActiveNavLink() {
    if (!IS_HOME) return;

    let current = '';
    const scrollPosition = window.pageYOffset + 200;

    DOM.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        if (!sectionId) return;

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
        console.log('[DESKTOP] Scroll a:', target.id || 'elemento');
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            e.preventDefault();
            smoothScrollTo(targetSection);
        }
    });
});

/* ===================================
   SCROLL INDICATOR
   =================================== */

if (DOM.scrollIndicator) {
    DOM.scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.querySelector('#nosotros');
        if (aboutSection) smoothScrollTo(aboutSection);
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
   VIDEO HERO
   =================================== */

function initVideoControl() {
    const activeVideo = DOM.heroVideoDesktop || DOM.heroVideoMobile;
    if (!activeVideo) {
        if (CONFIG.isDebug) console.warn('[DESKTOP] No se encontró video hero');
        return;
    }

    const playVideo = () => {
        const playPromise = activeVideo.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise.catch(err => {
                if (CONFIG.isDebug) console.log('[DESKTOP] Autoplay bloqueado:', err.message);
                const tryPlayOnInteraction = () => {
                    activeVideo.play().catch(() => {});
                };
                document.addEventListener('click', tryPlayOnInteraction, { once: true });
            });
        }
    };

    if (activeVideo.readyState >= 3) {
        playVideo();
    } else {
        activeVideo.addEventListener('loadeddata', playVideo, { once: true });
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
        console.error('[DESKTOP] Error al cargar el video:', e);
        const videoContainer = document.querySelector('.video-background');
        if (videoContainer) videoContainer.style.backgroundColor = '#1a1a1a';
    });

    activeVideo.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

/* ===================================
   ESTADÍSTICAS
   =================================== */

function animateStats() {
    if (statsAnimated) return;

    DOM.statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'), 10);
        const hasPlus = stat.textContent.includes('+');
        if (!target || isNaN(target)) return;

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
    if (CONFIG.isDebug) console.log('[DESKTOP] Estadísticas animadas');
}

if (DOM.statNumbers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) animateStats();
        });
    }, { threshold: 0.5 });

    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) statsObserver.observe(aboutSection);
}

/* ===================================
   FADE-IN ELEMENTOS
   =================================== */

function initFadeAnimations() {
    if (DOM.fadeElements.length === 0) return;

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeObserver.unobserve(entry.target);
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    DOM.fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });

    if (CONFIG.isDebug) {
        console.log('[DESKTOP] Fade animations inicializadas (', DOM.fadeElements.length, 'elementos )');
    }
}

/* ===================================
   NOTIFICACIONES (p.ej. para Konami)
   =================================== */

function showNotification(message, duration = CONFIG.notificationDuration) {
    const notification = document.createElement('div');
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
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
        maxWidth: '400px',
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
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/* ===================================
   AÑO AUTOMÁTICO
   =================================== */

if (DOM.yearElement) {
    DOM.yearElement.textContent = new Date().getFullYear();
}

/* ===================================
   ACCESIBILIDAD
   =================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    console.log('[DESKTOP] Modo de movimiento reducido activado');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

/* ===================================
   EASTER EGG KONAMI
   =================================== */

let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    if (konamiCode.join('') === konamiPattern.join('')) {
        console.log(
            '%c OCEAN GRAPH ACTIVADO ',
            'background: linear-gradient(90deg, #009dff, #00d4ff); color: white; font-size: 20px; padding: 10px; font-weight: bold;'
        );
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
    initVideoControl();
    initFadeAnimations();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateActiveNavLink);
    } else {
        updateActiveNavLink();
    }
}

/* ===================================
   EXPORT DEBUG
   =================================== */

if (CONFIG.isDebug) {
    window.OceanGraph = {
        config: CONFIG,
        dom: DOM,
        showNotification,
        toggleMenu,
        smoothScrollTo,
        animateStats,
        applyTheme
    };
    console.log('[DESKTOP] window.OceanGraph disponible para debugging');
}

/* ===================================
   INICIO
   =================================== */

init();
console.log(
    '%c Ocean Graph listo (escritorio) ',
    'background: #141414; color: #009dff; padding: 5px 10px; border: 1px solid #009dff; border-radius: 5px;'
);