/* ===================================
   OCEAN GRAPH - SERVICES JS
   services.js
   Hero con imagen de fondo aleatoria + detección de brillo
   =================================== */

'use strict';

/* ===================================
   GUARDIÁN: DETECCIÓN MÓVIL
   =================================== */

(function checkMobileRedirect() {
    const ua = navigator.userAgent || '';
    const isUAHandheld = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const hasTouchSupport = ('ontouchstart' in window) && (navigator.maxTouchPoints > 0);
    const isCurrentlyMobile = isUAHandheld && hasTouchSupport;
    
    if (isCurrentlyMobile) {
        localStorage.setItem('og-device-preference', 'mobile');
        window.location.replace('mobile/ServicesMobile.html');
    } else {
        localStorage.setItem('og-device-preference', 'desktop');
    }
})();

/* ===================================
   CONFIGURACIÓN
   =================================== */

const SERVICES_CONFIG = {
    heroBgUrl: 'data/services-backgrounds.json',
    brightnessThreshold: 128,
    isDebug: localStorage.getItem('debug') === 'true'
};

/* ===================================
   UTILIDADES
   =================================== */

function servicesLog(...args) {
    if (SERVICES_CONFIG.isDebug) {
        console.log('[SERVICES]', ...args);
    }
}

/* ===================================
   HERO BACKGROUND
   =================================== */

async function loadServicesBackgrounds() {
    try {
        const response = await fetch(SERVICES_CONFIG.heroBgUrl, { cache: 'no-cache' });
        if (!response.ok) {
            servicesLog('Error al cargar JSON. Status:', response.status);
            return null;
        }
        const data = await response.json();
        servicesLog('Backgrounds cargados:', data);
        return data;
    } catch (error) {
        console.error('[SERVICES] Error al cargar JSON:', error);
        return null;
    }
}

/**
 * Analiza el brillo promedio de una imagen
 */
function analyzeServicesImageBrightness(img) {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const sampleSize = 50;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
        const imageData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imageData.data;
        
        let total = 0;
        let count = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
            total += brightness;
            count++;
        }
        
        const avg = total / count;
        servicesLog('Brillo detectado:', avg.toFixed(1));
        return avg;
    } catch (error) {
        servicesLog('Error al analizar brillo (posible CORS):', error);
        return null;
    }
}

/**
 * Aplica color de texto según brillo
 */
function applyServicesTextColor(mode, brightness) {
    const hero = document.querySelector('.services-hero');
    if (!hero) return;
    
    let useDarkText = false;
    
    if (mode === 'dark') {
        useDarkText = true;
    } else if (mode === 'light') {
        useDarkText = false;
    } else if (brightness !== null && brightness > SERVICES_CONFIG.brightnessThreshold) {
        useDarkText = true;
    }
    
    hero.classList.toggle('hero-text-dark', useDarkText);
    servicesLog('Texto:', useDarkText ? 'OSCURO' : 'CLARO');
}

/**
 * Inicializa el fondo aleatorio del hero
 */
async function initServicesHeroBackground() {
    const heroBg = document.getElementById('services-hero-bg');
    if (!heroBg) return;
    
    const data = await loadServicesBackgrounds();
    if (!data || !Array.isArray(data.backgrounds)) return;
    
    const active = data.backgrounds.filter(bg => bg.active === true);
    if (active.length === 0) {
        servicesLog('No hay backgrounds activos');
        return;
    }
    
    const selected = active[Math.floor(Math.random() * active.length)];
    const textMode = selected.textColor || 'auto';
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
        heroBg.style.backgroundImage = `url('${selected.url}')`;
        heroBg.setAttribute('aria-label', selected.alt || '');
        heroBg.classList.add('loaded');
        
        let brightness = null;
        if (textMode === 'auto') {
            brightness = analyzeServicesImageBrightness(img);
        }
        
        applyServicesTextColor(textMode, brightness);
        servicesLog('Background aplicado:', selected.id);
    };
    
    img.onerror = () => {
        servicesLog('Error al cargar imagen:', selected.url);
        const fallback = new Image();
        fallback.onload = () => {
            heroBg.style.backgroundImage = `url('${selected.url}')`;
            heroBg.classList.add('loaded');
            applyServicesTextColor(textMode, null);
        };
        fallback.src = selected.url;
    };
    
    img.src = selected.url;
}

/* ===================================
   INDICADOR DE SCROLL
   =================================== */

function initScrollIndicator() {
    const indicator = document.querySelector('.services-scroll-indicator');
    if (!indicator) return;
    
    indicator.addEventListener('click', () => {
        window.scrollTo({
            top: window.innerHeight - 60,
            behavior: 'smooth'
        });
    });
}

/* ===================================
   INICIALIZACIÓN
   =================================== */

function initServices() {
    initServicesHeroBackground();
    initScrollIndicator();
    servicesLog('Servicios inicializado');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServices);
} else {
    initServices();
}

/* ===================================
   DEBUG
   =================================== */

if (SERVICES_CONFIG.isDebug) {
    window.OceanServices = {
        config: SERVICES_CONFIG,
        loadBackgrounds: loadServicesBackgrounds,
        initHero: initServicesHeroBackground
    };
    console.log('[SERVICES] window.OceanServices disponible');
}