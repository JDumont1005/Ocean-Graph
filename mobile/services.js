/* ===================================
   OCEAN GRAPH - SERVICES MOBILE JS
   mobile/services.js
   Hero aleatorio + Cards + Modal Contacto (versión móvil)
   =================================== */

'use strict';

/* ===================================
   CONFIGURACIÓN
   =================================== */

const SERVICES_CONFIG = {
    dataUrl: '../data/services.json',
    heroBgUrl: '../data/services-backgrounds.json',
    brightnessThreshold: 128,
    isDebug: localStorage.getItem('debug') === 'true'
};

/* ===================================
   REFERENCIAS AL DOM
   =================================== */

const SERVICES_DOM = {
    // Hero
    heroBg: document.getElementById('services-hero-bg'),
    heroDescription: document.getElementById('services-hero-description'),
    scrollIndicator: document.querySelector('.services-scroll-indicator'),
    
    // Cards
    cardsGrid: document.getElementById('services-cards-grid'),
    
    // Modal
    modal: document.getElementById('contact-modal'),
    modalOverlay: document.getElementById('contact-modal-overlay'),
    modalClose: document.getElementById('contact-modal-close'),
    modalTitle: document.getElementById('contact-modal-title'),
    modalSubtitle: document.getElementById('contact-modal-subtitle'),
    modalChannels: document.getElementById('contact-modal-channels')
};

/* ===================================
   ESTADO
   =================================== */

const SERVICES_STATE = {
    data: null
};

/* ===================================
   UTILIDADES
   =================================== */

function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function servicesLog(...args) {
    if (SERVICES_CONFIG.isDebug) {
        console.log('[SERVICES-MOBILE]', ...args);
    }
}

/**
 * Ajusta rutas de imágenes para versión móvil.
 * Si empieza con http/https → se deja igual
 * Si es relativa → antepone "../" para subir un nivel
 */
function resolveAssetPath(path) {
    if (!path) return '';
    const trimmed = path.trim().replace(/\\/g, '/');
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return '../' + trimmed.replace(/^\.?\//, '');
}

/* ===================================
   ICONOS SVG
   =================================== */

const ICONS = {
    settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"/>
    </svg>`,
    design: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <polygon points="12 11 13 14 16 14 13.5 16 14.5 19 12 17 9.5 19 10.5 16 8 14 11 14 12 11"/>
    </svg>`,
    social: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>`,
    cube: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>`,
    video: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"/>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>`,
    camera: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
    </svg>`,
    drone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="5" cy="5" r="3"/>
        <circle cx="19" cy="5" r="3"/>
        <circle cx="5" cy="19" r="3"/>
        <circle cx="19" cy="19" r="3"/>
        <rect x="9" y="9" width="6" height="6" rx="1"/>
        <line x1="7" y1="7" x2="9" y2="9"/>
        <line x1="17" y1="7" x2="15" y2="9"/>
        <line x1="7" y1="17" x2="9" y2="15"/>
        <line x1="17" y1="17" x2="15" y2="15"/>
    </svg>`
};

const CHANNEL_ICONS = {
    whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>`,
    tiktok: `<svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z"/>
    </svg>`,
    email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
    </svg>`
};

const CHEVRON_RIGHT = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

/* ===================================
   CARGA DEL JSON
   =================================== */

async function loadServicesData() {
    try {
        const response = await fetch(SERVICES_CONFIG.dataUrl, { cache: 'no-cache' });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('[SERVICES-MOBILE] Error al cargar JSON:', error);
        return null;
    }
}

/* ===================================
   HERO BACKGROUND ALEATORIO
   =================================== */

async function loadHeroBackgrounds() {
    try {
        const response = await fetch(SERVICES_CONFIG.heroBgUrl, { cache: 'no-cache' });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('[SERVICES-MOBILE] Error al cargar backgrounds:', error);
        return null;
    }
}

function analyzeImageBrightness(img) {
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
            total += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
            count++;
        }
        return total / count;
    } catch (error) {
        return null;
    }
}

function applyHeroTextColor(mode, brightness) {
    const hero = document.querySelector('.services-hero');
    if (!hero) return;
    
    let useDarkText = false;
    if (mode === 'dark') useDarkText = true;
    else if (mode === 'light') useDarkText = false;
    else if (brightness !== null && brightness > SERVICES_CONFIG.brightnessThreshold) {
        useDarkText = true;
    }
    
    hero.classList.toggle('hero-text-dark', useDarkText);
}

async function initHeroBackground() {
    if (!SERVICES_DOM.heroBg) return;
    
    const data = await loadHeroBackgrounds();
    if (!data || !Array.isArray(data.backgrounds)) return;
    
    const active = data.backgrounds.filter(bg => bg.active === true);
    if (active.length === 0) return;
    
    const selected = active[Math.floor(Math.random() * active.length)];
    const textMode = selected.textColor || 'auto';
    const bgUrl = resolveAssetPath(selected.url);
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
        SERVICES_DOM.heroBg.style.backgroundImage = `url('${bgUrl}')`;
        SERVICES_DOM.heroBg.setAttribute('aria-label', selected.alt || '');
        SERVICES_DOM.heroBg.classList.add('loaded');
        
        let brightness = null;
        if (textMode === 'auto') {
            brightness = analyzeImageBrightness(img);
        }
        applyHeroTextColor(textMode, brightness);
    };
    
    img.onerror = () => {
        const fallback = new Image();
        fallback.onload = () => {
            SERVICES_DOM.heroBg.style.backgroundImage = `url('${bgUrl}')`;
            SERVICES_DOM.heroBg.classList.add('loaded');
            applyHeroTextColor(textMode, null);
        };
        fallback.src = bgUrl;
    };
    
    img.src = bgUrl;
}

/* ===================================
   RENDER HERO
   =================================== */

function renderHero(heroData) {
    if (!heroData) return;
    if (SERVICES_DOM.heroDescription && heroData.description) {
        SERVICES_DOM.heroDescription.textContent = heroData.description;
    }
}

/* ===================================
   RENDER CARDS
   =================================== */

function getSoftwareById(id) {
    const overview = SERVICES_STATE.data?.overview;
    if (!overview || !Array.isArray(overview.software)) return null;
    return overview.software.find(sw => sw.id === id);
}

function renderCardTools(card) {
    let toolsHTML = '';
    
    // Iconos de Programas (Software)
    if (Array.isArray(card.software)) {
        card.software.forEach(swId => {
            const sw = getSoftwareById(swId);
            const swName = sw ? sw.name : swId;
            const iconPath = `../images/software/${swId}.png`;
            
            toolsHTML += `
                <div class="service-card-tool" title="${escapeHTML(swName)}">
                    <img src="${iconPath}" alt="${escapeHTML(swName)}" onerror="this.parentElement.style.display='none'">
                </div>
            `;
        });
    }
    
    // Iconos de Redes Sociales
    if (Array.isArray(card.socialIcons)) {
        card.socialIcons.forEach(socialId => {
            const iconPath = `../images/software/${socialId}.png`;
            toolsHTML += `
                <div class="service-card-tool" title="${escapeHTML(socialId)}">
                    <img src="${iconPath}" alt="${escapeHTML(socialId)}" onerror="this.parentElement.style.display='none'">
                </div>
            `;
        });
    }
    
    return toolsHTML;
}

function renderCard(card) {
    const iconSVG = ICONS[card.icon] || ICONS.settings;
    const cardStyle = `
        background: ${card.cardBg};
        color: ${card.cardTextColor};
    `;
    const btnStyle = `background-color: ${card.btnBg}; color: ${card.btnText};`;
    const highlightStyle = `color: ${card.highlightColor};`;
    
    return `
        <div class="service-card-wrapper" data-card-id="${escapeHTML(card.id)}">
            <div class="service-card" style="${cardStyle}">
                <div class="service-card-icon-row">
                    <span class="service-card-line"></span>
                    <div class="service-card-icon">${iconSVG}</div>
                    <span class="service-card-line"></span>
                </div>
                
                <h3 class="service-card-title">
                    ${card.title ? `<span class="service-card-title-line">${escapeHTML(card.title)}</span>` : ''}
                    ${card.titleLine2 ? `<span class="service-card-title-line">${escapeHTML(card.titleLine2)}</span>` : ''}
                    <span class="service-card-title-highlight" style="${highlightStyle}">${escapeHTML(card.titleHighlight)}</span>
                </h3>
                
                <p class="service-card-description">${escapeHTML(card.description)}</p>
                
                <div class="service-card-divider"></div>
                
                <div class="service-card-tools">
                    ${renderCardTools(card)}
                </div>
                
                <button class="service-card-btn" type="button" style="${btnStyle}" data-open-contact="${escapeHTML(card.id)}">
                    Contáctanos
                </button>
            </div>
        </div>
    `;
}

function renderCards(cards) {
    if (!SERVICES_DOM.cardsGrid || !Array.isArray(cards)) return;
    
    const html = cards.map(card => renderCard(card)).join('');
    SERVICES_DOM.cardsGrid.innerHTML = html;
    
    // Bind eventos de botones
    SERVICES_DOM.cardsGrid.querySelectorAll('[data-open-contact]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openContactModal();
        });
    });
    
    servicesLog('Cards renderizadas:', cards.length);
}

/* ===================================
   MODAL DE CONTACTO
   =================================== */

function renderContactModal(modalData) {
    if (!modalData) return;
    
    if (SERVICES_DOM.modalTitle && modalData.title) {
        SERVICES_DOM.modalTitle.textContent = modalData.title;
    }
    
    if (SERVICES_DOM.modalSubtitle && modalData.subtitle) {
        SERVICES_DOM.modalSubtitle.textContent = modalData.subtitle;
    }
    
    if (SERVICES_DOM.modalChannels && Array.isArray(modalData.channels)) {
        const html = modalData.channels.map(channel => `
            <a 
                href="${escapeHTML(channel.url)}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="contact-channel"
                data-channel="${escapeHTML(channel.id)}"
            >
                <div class="contact-channel-icon" style="background-color: ${channel.color};">
                    ${CHANNEL_ICONS[channel.icon] || ''}
                </div>
                <div class="contact-channel-info">
                    <span class="contact-channel-name">${escapeHTML(channel.name)}</span>
                    <span class="contact-channel-detail">${escapeHTML(channel.detail)}</span>
                </div>
                <span class="contact-channel-arrow">${CHEVRON_RIGHT}</span>
            </a>
        `).join('');
        
        SERVICES_DOM.modalChannels.innerHTML = html;
    }
}

function openContactModal() {
    if (!SERVICES_DOM.modal) return;
    SERVICES_DOM.modal.classList.add('active');
    SERVICES_DOM.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    servicesLog('Modal contacto abierto');
}

function closeContactModal() {
    if (!SERVICES_DOM.modal) return;
    SERVICES_DOM.modal.classList.remove('active');
    SERVICES_DOM.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function initModalEvents() {
    SERVICES_DOM.modalClose?.addEventListener('click', closeContactModal);
    SERVICES_DOM.modalOverlay?.addEventListener('click', closeContactModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && SERVICES_DOM.modal?.classList.contains('active')) {
            closeContactModal();
        }
    });
}

/* ===================================
   SCROLL INDICATOR
   =================================== */

function initScrollIndicator() {
    if (!SERVICES_DOM.scrollIndicator) return;
    
    SERVICES_DOM.scrollIndicator.addEventListener('click', () => {
        const cardsSection = document.getElementById('services-cards-section');
        if (cardsSection) {
            const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
            const targetPos = cardsSection.offsetTop - navHeight;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
    });
}

/* ===================================
   INICIALIZACIÓN
   =================================== */

async function initServicesMobile() {
    servicesLog('Inicializando Servicios móvil...');
    
    initHeroBackground();
    initScrollIndicator();
    initModalEvents();
    
    const data = await loadServicesData();
    if (!data) {
        console.warn('[SERVICES-MOBILE] No se pudieron cargar los datos');
        return;
    }
    
    SERVICES_STATE.data = data;
    
    renderHero(data.hero);
    renderCards(data.cards);
    renderContactModal(data.contactModal);
    
    servicesLog('Servicios móvil inicializado correctamente');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServicesMobile);
} else {
    initServicesMobile();
}

/* ===================================
   DEBUG
   =================================== */

if (SERVICES_CONFIG.isDebug) {
    window.OceanServicesMobile = {
        config: SERVICES_CONFIG,
        state: SERVICES_STATE,
        dom: SERVICES_DOM,
        openContactModal,
        closeContactModal
    };
    console.log('[SERVICES-MOBILE] window.OceanServicesMobile disponible');
}