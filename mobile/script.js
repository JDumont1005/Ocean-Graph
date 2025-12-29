/* ===================================
   OCEAN GRAPH - MOBILE
   mobile/script.js
   Versión optimizada para móviles / tablets
   =================================== */

'use strict';

/* ===================================
   CONFIGURACIÓN Y ESTADO
   =================================== */

const CONFIG = {
    scrollThreshold: 40,
    statAnimationDuration: 1200,
    debounceDelay: 100,
    loaderMinTime: 700,
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

/* Contexto */
const IS_MOBILE_SITE = window.location.pathname.includes('/mobile/');
const IS_HOME = !!document.querySelector('.video-hero');

let isMenuOpen = false;
let statsAnimated = false;
let currentTheme = 'dark';

/* ===================================
   SELECCIÓN AUTOMÁTICA (MÓVIL vs ESCRITORIO)
   =================================== */

/**
 * ¿Deberíamos usar la versión de ESCRITORIO?
 * UA de escritorio + pantalla grande.
 */
function shouldUseDesktopVersion() {
    const isDesktopUA = !DEVICE.isMobile && !DEVICE.isTablet;
    const isLargeScreen = window.innerWidth >= 1024;
    return isDesktopUA && isLargeScreen;
}

/**
 * Si estamos en /mobile/index.html y parece escritorio,
 * redirigimos a ../index.html.
 * Devuelve true si redirige.
 */
function maybeRedirectToDesktop() {
    if (!IS_HOME) return false;
    if (!IS_MOBILE_SITE) return false;

    if (shouldUseDesktopVersion()) {
        if (CONFIG.isDebug) {
            console.log('[MOBILE] Escritorio detectado. Redirigiendo a versión desktop...');
        }

        if (DOM.loader && DOM.loaderText) {
            DOM.loaderText.innerHTML = 'OCEAN <span>GRAPH</span><br><small style="font-size:0.75rem;font-weight:300;opacity:0.8;">Cargando versión escritorio...</small>';
        }

        window.location.replace('../index.html');
        return true;
    }
    return false;
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
            DOM.navbar.style.boxShadow = '0 2px 16px rgba(0, 0, 0, 0.15)';
        } else {
            DOM.navbar.style.backgroundColor = 'rgba(242, 242, 242, 0.92)';
            DOM.navbar.style.borderBottomColor = 'rgba(0, 0, 0, 0.06)';
            DOM.navbar.style.boxShadow = 'none';
        }

        DOM.navLinks.forEach(link => {
            link.style.color = 'rgba(0, 0, 0, 0.75)';
        });

        const active = document.querySelector('.nav-link.active');
        if (active) active.style.color = '#141414';

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
        console.log('[MOBILE] Tema aplicado:', isLight ? 'light' : 'dark');
    }
}

function initTheme() {
    let saved = localStorage.getItem(THEME_KEY);
    if (saved !== 'light' && saved !== 'dark') saved = 'dark';
    applyTheme(saved);

    if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', () => {
            const next = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(next);
        });
    }
}

/* ===================================
   LOADER
   =================================== */

function hideLoader() {
    if (!DOM.loader) return;
    DOM.loader.classList.add('hidden');
    document.body.style.overflow = '';
    setTimeout(() => DOM.loader && DOM.loader.remove(), 500);
}

function initLoader() {
    if (!DOM.loader) return;

    document.body.style.overflow = 'hidden';

    if (DOM.loaderText) {
        DOM.loaderText.innerHTML = 'OCEAN <span>GRAPH</span>';
    }

    const start = Date.now();

    function done() {
        const elapsed = Date.now() - start;
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
   CONSOLA
   =================================== */

function initConsoleMessages() {
    console.log(
        '%c Ocean Graph - Mobile ',
        'background: linear-gradient(135deg, #009dff, #00d4ff); color: #141414; padding: 6px 12px; font-weight: bold; font-size: 13px; border-radius: 8px;'
    );

    if (CONFIG.isDebug) {
        console.log('[MOBILE] Debug activo');
    }

    if (DEVICE.isMobile && !DEVICE.isTablet) {
        console.log('[MOBILE] Dispositivo móvil (UA)');
    } else if (DEVICE.isTablet) {
        console.log('[MOBILE] Tablet (UA)');
    } else {
        console.log('[MOBILE] UA de escritorio detectado');
    }
}

/* ===================================
   UTILIDADES
   =================================== */

function debounce(fn, wait) {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}

function throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
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
    const y = window.pageYOffset || document.documentElement.scrollTop;
    if (y > CONFIG.scrollThreshold) {
        DOM.navbar?.classList.add('scrolled');
    } else {
        DOM.navbar?.classList.remove('scrolled');
    }
    updateNavbarThemeStyles();
}

window.addEventListener('scroll', throttle(handleNavbarScroll, 80));

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

    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

    if (CONFIG.isDebug) {
        console.log('[MOBILE] Menú', isMenuOpen ? 'abierto' : 'cerrado');
    }
}

DOM.hamburger?.addEventListener('click', () => toggleMenu());

DOM.navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (isMenuOpen) toggleMenu(true);
    });
});

document.addEventListener('click', (e) => {
    if (!isMenuOpen) return;
    const insideMenu = DOM.navMenu?.contains(e.target);
    const onHamburger = DOM.hamburger?.contains(e.target);
    if (!insideMenu && !onHamburger) toggleMenu(true);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) toggleMenu(true);
});

/* ===================================
   NAV ACTIVA
   =================================== */

function updateActiveNavLink() {
    if (!IS_HOME) return;

    let current = 'inicio';
    const pos = window.pageYOffset + 160;

    DOM.sections.forEach(section => {
        const id = section.getAttribute('id');
        if (!id) return;
        const top = section.offsetTop;
        const height = section.clientHeight;
        if (pos >= top && pos < top + height) current = id;
    });

    DOM.navLinks.forEach(link => {
        link.classList.remove('active');
        link.style.color = '';
        const href = link.getAttribute('href');
        if (href === '#' + current) link.classList.add('active');
    });

    updateNavbarThemeStyles();
}

window.addEventListener('scroll', debounce(updateActiveNavLink, CONFIG.debounceDelay));

/* ===================================
   SMOOTH SCROLL
   =================================== */

function smoothScrollTo(target) {
    if (!target) return;
    const navHeight = DOM.navbar?.offsetHeight || 0;
    const top = target.offsetTop - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            smoothScrollTo(target);
        }
    });
});

/* ===================================
   INDICADOR DE SCROLL
   =================================== */

if (DOM.scrollIndicator) {
    DOM.scrollIndicator.addEventListener('click', () => {
        const about = document.getElementById('nosotros');
        if (about) smoothScrollTo(about);
    });

    window.addEventListener('scroll', throttle(() => {
        const y = window.pageYOffset;
        if (y > 80) {
            DOM.scrollIndicator.style.opacity = '0';
            DOM.scrollIndicator.style.pointerEvents = 'none';
        } else {
            DOM.scrollIndicator.style.opacity = '0.75';
            DOM.scrollIndicator.style.pointerEvents = 'auto';
        }
    }, 80));
}

/* ===================================
   VIDEO HERO
   =================================== */

function initVideoControl() {
    const video = DOM.heroVideoMobile || DOM.heroVideoDesktop;
    if (!video) {
        if (CONFIG.isDebug) console.warn('[MOBILE] No se encontró video hero');
        return;
    }

    const playVideo = () => {
        const p = video.play();
        if (p && typeof p.then === 'function') {
            p.catch(() => {
                const tryPlay = () => {
                    video.play().catch(() => {});
                };
                document.addEventListener('click', tryPlay, { once: true });
                document.addEventListener('touchstart', tryPlay, { once: true });
            });
        }
    };

    if (video.readyState >= 3) {
        playVideo();
    } else {
        video.addEventListener('loadeddata', playVideo, { once: true });
    }

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.5 });

    obs.observe(video);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            video.pause();
        } else if (isElementInViewport(video, 40)) {
            video.play().catch(() => {});
        }
    });

    video.addEventListener('contextmenu', (e) => e.preventDefault());
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
        const increment = target / (CONFIG.statAnimationDuration / 16);

        const update = () => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + (hasPlus ? '+' : '');
            } else {
                stat.textContent = Math.floor(current) + (hasPlus ? '+' : '');
                requestAnimationFrame(update);
            }
        };

        update();
    });

    statsAnimated = true;

    if (CONFIG.isDebug) console.log('[MOBILE] Estadísticas animadas');
}

if (DOM.statNumbers.length > 0) {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) animateStats();
        });
    }, { threshold: 0.4 });

    const about = document.querySelector('.about-section');
    if (about) obs.observe(about);
}

/* ===================================
   FADE-IN ELEMENTOS
   =================================== */

function initFadeAnimations() {
    if (DOM.fadeElements.length === 0) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    DOM.fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        obs.observe(el);
    });

    if (CONFIG.isDebug) {
        console.log('[MOBILE] Fade animations inicializadas (', DOM.fadeElements.length, 'elementos )');
    }
}

/* ===================================
   VIEWPORT HEIGHT FIX
   =================================== */

function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

if (DEVICE.isMobile || DEVICE.isTablet) {
    setViewportHeight();
    window.addEventListener('resize', debounce(setViewportHeight, 200));
    window.addEventListener('orientationchange', () => {
        setTimeout(setViewportHeight, 150);
    });
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
    console.log('[MOBILE] Modo de movimiento reducido activado');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

/* ===================================
   INICIALIZACIÓN
   =================================== */

function initMobile() {
    initLoader();
    initConsoleMessages();
    initTheme();
    initVideoControl();
    initFadeAnimations();
    updateActiveNavLink();
}

/* ===================================
   INICIO
   =================================== */

if (!maybeRedirectToDesktop()) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobile);
    } else {
        initMobile();
    }

    if (CONFIG.isDebug) {
        console.log('[MOBILE] Ocean Graph listo (móvil/tablet)');
    }
}