/* ===================================
   OCEAN GRAPH - PORTFOLIO MOBILE JS
   mobile/portfolio.js
   Sistema de categorías + videos + imágenes + reproductor táctil
   Optimizado para móviles y tablets
   =================================== */

'use strict';

/* ===================================
   CONFIGURACIÓN
   =================================== */

const PORTFOLIO_CONFIG = {
    dataUrl: '../data/portfolio-videos.json',
    heroBgUrl: '../data/hero-backgrounds.json',
    controlsHideDelay: 3000,
    swipeThreshold: 50,
    brightnessThreshold: 128,
    isDebug: localStorage.getItem('debug') === 'true'
};

/* ===================================
   REFERENCIAS AL DOM
   =================================== */

const PORTFOLIO_DOM = {
    // Categorías
    categoriesGrid: document.getElementById('categories-grid'),
    videosPanel: document.getElementById('videos-panel'),
    panelCategoryName: document.getElementById('panel-category-name'),
    panelCloseBtn: document.getElementById('panel-close-btn'),
    videosGrid: document.getElementById('videos-grid'),
    videosEmpty: document.getElementById('videos-empty'),
    
    // Modal VIDEO
    videoModal: document.getElementById('video-modal'),
    videoModalClose: document.getElementById('video-modal-close'),
    videoModalPlayer: document.getElementById('video-modal-player'),
    videoModalSource: document.getElementById('video-modal-source'),
    videoModalAvatar: document.getElementById('video-modal-avatar'),
    videoModalTitle: document.getElementById('video-modal-title'),
    videoModalDescription: document.getElementById('video-modal-description'),
    videoModalHandle: document.getElementById('video-modal-handle'),
    
    // Reproductor
    customPlayer: document.getElementById('custom-player'),
    playerCenterPlay: document.getElementById('player-center-play'),
    playerControls: document.getElementById('player-controls'),
    playerCurrentTime: document.getElementById('player-current-time'),
    playerDuration: document.getElementById('player-duration'),
    playerProgress: document.getElementById('player-progress'),
    playerProgressFilled: document.getElementById('player-progress-filled'),
    playerProgressHandle: document.getElementById('player-progress-handle'),
    playerVolumeBtn: document.getElementById('player-volume-btn'),
    playerPlayBtn: document.getElementById('player-play-btn'),
    
    // Modal IMAGEN
    imageModal: document.getElementById('image-modal'),
    imageModalClose: document.getElementById('image-modal-close'),
    imageModalAvatar: document.getElementById('image-modal-avatar'),
    imageModalTitle: document.getElementById('image-modal-title'),
    imageModalDescription: document.getElementById('image-modal-description'),
    imageModalHandle: document.getElementById('image-modal-handle'),
    imageModalImage: document.getElementById('image-modal-image'),
    imageModalViewer: document.getElementById('image-modal-viewer'),
    imageInfoToggle: document.getElementById('image-info-toggle'),
    imageNavPrev: document.getElementById('image-nav-prev'),
    imageNavNext: document.getElementById('image-nav-next'),
    imageCurrent: document.getElementById('image-current'),
    imageTotal: document.getElementById('image-total'),
    
    // Video destacado
    featuredVideo: document.querySelector('.portfolio-featured-video'),
    soundBtn: document.getElementById('video-sound-btn')
};

/* ===================================
   ESTADO
   =================================== */

const PORTFOLIO_STATE = {
    data: null,
    currentCategory: null,
    currentItem: null,
    currentImages: [],
    currentImageIndex: 0,
    isDragging: false,
    controlsHideTimeout: null,
    touchStartX: 0,
    touchStartY: 0
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

function debugLog(...args) {
    if (PORTFOLIO_CONFIG.isDebug) {
        console.log('[PORTFOLIO-MOBILE]', ...args);
    }
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Ajusta rutas de imágenes/videos para versión móvil
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
    play: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>`,
    image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/>
        <path d="M21 15l-5-5L5 21"/>
    </svg>`,
    gallery: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/>
        <path d="M21 15l-5-5L5 21"/>
    </svg>`
};

/* ===================================
   HERO BACKGROUND
   =================================== */

async function loadHeroBackgrounds() {
    try {
        const response = await fetch(PORTFOLIO_CONFIG.heroBgUrl, { cache: 'no-cache' });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('[HERO-BG] Error:', error);
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
    const hero = document.querySelector('.portfolio-hero');
    if (!hero) return;
    
    let useDarkText = false;
    if (mode === 'dark') useDarkText = true;
    else if (mode === 'light') useDarkText = false;
    else if (brightness !== null && brightness > PORTFOLIO_CONFIG.brightnessThreshold) {
        useDarkText = true;
    }
    
    hero.classList.toggle('hero-text-dark', useDarkText);
}

async function initHeroBackground() {
    const heroBg = document.getElementById('portfolio-hero-bg');
    if (!heroBg) return;
    
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
        heroBg.style.backgroundImage = `url('${bgUrl}')`;
        heroBg.classList.add('loaded');
        
        let brightness = null;
        if (textMode === 'auto') {
            brightness = analyzeImageBrightness(img);
        }
        applyHeroTextColor(textMode, brightness);
    };
    
    img.onerror = () => {
        const fallback = new Image();
        fallback.onload = () => {
            heroBg.style.backgroundImage = `url('${bgUrl}')`;
            heroBg.classList.add('loaded');
            applyHeroTextColor(textMode, null);
        };
        fallback.src = bgUrl;
    };
    
    img.src = bgUrl;
}

/* ===================================
   CARGA JSON
   =================================== */

async function loadPortfolioData() {
    try {
        const response = await fetch(PORTFOLIO_CONFIG.dataUrl, { cache: 'no-cache' });
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('[PORTFOLIO] Error al cargar JSON:', error);
        return null;
    }
}

/* ===================================
   RENDER CATEGORÍAS (CHIPS)
   =================================== */

function renderCategories(categories) {
    if (!PORTFOLIO_DOM.categoriesGrid || !Array.isArray(categories)) return;
    
    const html = categories.map(cat => `
        <button 
            class="category-btn" 
            data-category-id="${escapeHTML(cat.id)}"
            role="tab"
            aria-selected="false"
            type="button"
        >
            <span class="category-icon" aria-hidden="true">${escapeHTML(cat.icon || '📁')}</span>
            <span class="category-name">${escapeHTML(cat.name)}</span>
        </button>
    `).join('');
    
    PORTFOLIO_DOM.categoriesGrid.innerHTML = html;
    
    PORTFOLIO_DOM.categoriesGrid.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectCategory(btn.getAttribute('data-category-id'));
        });
    });
    
    debugLog('Categorías renderizadas:', categories.length);
}

/* ===================================
   SELECCIONAR CATEGORÍA
   =================================== */

function selectCategory(categoryId) {
    if (!PORTFOLIO_STATE.data) return;
    
    const category = PORTFOLIO_STATE.data.categories.find(c => c.id === categoryId);
    if (!category) return;
    
    if (PORTFOLIO_STATE.currentCategory === categoryId) {
        closePanel();
        return;
    }
    
    PORTFOLIO_STATE.currentCategory = categoryId;
    
    PORTFOLIO_DOM.categoriesGrid.querySelectorAll('.category-btn').forEach(btn => {
        const isActive = btn.getAttribute('data-category-id') === categoryId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
        
        // Scroll chip activo al centro
        if (isActive) {
            btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    });
    
    const items = PORTFOLIO_STATE.data.videos.filter(v => v.categoryId === categoryId);
    
    PORTFOLIO_DOM.panelCategoryName.textContent = category.name.toUpperCase();
    
    renderItems(items);
    openPanel();
    
    setTimeout(() => {
        PORTFOLIO_DOM.videosPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
    
    debugLog('Categoría:', category.name, '| Items:', items.length);
}

/* ===================================
   RENDER ITEMS
   =================================== */

function renderItems(items) {
    if (!PORTFOLIO_DOM.videosGrid) return;
    
    if (!items || items.length === 0) {
        PORTFOLIO_DOM.videosGrid.innerHTML = '';
        PORTFOLIO_DOM.videosEmpty.style.display = 'block';
        return;
    }
    
    PORTFOLIO_DOM.videosEmpty.style.display = 'none';
    
    const html = items.map((item, index) => {
        const type = item.type || 'video';
        return type === 'image' ? renderImageCard(item, index) : renderVideoCard(item, index);
    }).join('');
    
    PORTFOLIO_DOM.videosGrid.innerHTML = html;
    
    PORTFOLIO_DOM.videosGrid.querySelectorAll('.video-card').forEach(card => {
        const itemId = card.getAttribute('data-item-id');
        const itemType = card.getAttribute('data-item-type');
        
        card.addEventListener('click', (e) => {
            if (e.target.closest('.video-card-play-btn, .video-card-image-btn')) return;
            if (itemType === 'image') openImageModal(itemId);
            else openVideoModal(itemId);
        });
        
        const playBtn = card.querySelector('.video-card-play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openVideoModal(itemId);
            });
        }
        
        const imageBtn = card.querySelector('.video-card-image-btn');
        if (imageBtn) {
            imageBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openImageModal(itemId);
            });
        }
    });
}

function renderVideoCard(item, index) {
    const thumb = resolveAssetPath(item.thumbnail || '');
    const avatar = resolveAssetPath(item.avatar || '');
    
    return `
        <article 
            class="video-card" 
            data-item-id="${escapeHTML(item.id)}"
            data-item-type="video"
            style="animation-delay: ${Math.min(index * 50, 400)}ms;"
        >
            <div class="video-card-thumbnail">
                <img 
                    src="${escapeHTML(thumb)}" 
                    alt="${escapeHTML(item.title || 'Video')}" 
                    loading="lazy"
                    decoding="async"
                >
                <div class="video-card-watermark">
                    <img 
                        src="../Logo/OceanGraph - Ola.svg" 
                        alt="Ocean Graph"
                        loading="lazy"
                    >
                </div>
            </div>
            <div class="video-card-info">
                <div class="video-card-avatar">
                    <img 
                        src="${escapeHTML(avatar)}" 
                        alt="${escapeHTML(item.handle || 'Cliente')}" 
                        loading="lazy"
                    >
                </div>
                <div class="video-card-details">
                    <h4 class="video-card-title">${escapeHTML(item.title || 'Sin título')}</h4>
                    <p class="video-card-description">${escapeHTML(item.description || '')}</p>
                    <span class="video-card-handle">${escapeHTML(item.handle || '')}</span>
                </div>
                <button class="video-card-play-btn" type="button" aria-label="Reproducir">
                    ${ICONS.play}
                </button>
            </div>
        </article>
    `;
}

function renderImageCard(item, index) {
    const images = Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []);
    const imageCount = images.length;
    const firstImage = images[0] ? resolveAssetPath(images[0]) : '';
    const thumb = item.thumbnail ? resolveAssetPath(item.thumbnail) : firstImage;
    const avatar = resolveAssetPath(item.avatar || '');
    
    const countBadge = imageCount > 1 ? `
        <div class="video-card-count">
            ${ICONS.gallery}
            <span>${imageCount}</span>
        </div>
    ` : '';
    
    return `
        <article 
            class="video-card" 
            data-item-id="${escapeHTML(item.id)}"
            data-item-type="image"
            style="animation-delay: ${Math.min(index * 50, 400)}ms;"
        >
            <div class="video-card-thumbnail">
                <img 
                    src="${escapeHTML(thumb)}" 
                    alt="${escapeHTML(item.title || 'Imagen')}" 
                    loading="lazy"
                    decoding="async"
                >
                ${countBadge}
                <div class="video-card-watermark">
                    <img 
                        src="../Logo/OceanGraph - Ola.svg" 
                        alt="Ocean Graph"
                        loading="lazy"
                    >
                </div>
            </div>
            <div class="video-card-info">
                <div class="video-card-avatar">
                    <img 
                        src="${escapeHTML(avatar)}" 
                        alt="${escapeHTML(item.handle || 'Cliente')}" 
                        loading="lazy"
                    >
                </div>
                <div class="video-card-details">
                    <h4 class="video-card-title">${escapeHTML(item.title || 'Sin título')}</h4>
                    <p class="video-card-description">${escapeHTML(item.description || '')}</p>
                    <span class="video-card-handle">${escapeHTML(item.handle || '')}</span>
                </div>
                <button class="video-card-image-btn" type="button" aria-label="Ver imagen">
                    ${ICONS.image}
                </button>
            </div>
        </article>
    `;
}

/* ===================================
   PANEL
   =================================== */

function openPanel() {
    if (!PORTFOLIO_DOM.videosPanel) return;
    PORTFOLIO_DOM.videosPanel.classList.add('active');
    PORTFOLIO_DOM.videosPanel.setAttribute('aria-hidden', 'false');
}

function closePanel() {
    if (!PORTFOLIO_DOM.videosPanel) return;
    PORTFOLIO_DOM.videosPanel.classList.remove('active');
    PORTFOLIO_DOM.videosPanel.setAttribute('aria-hidden', 'true');
    
    PORTFOLIO_DOM.categoriesGrid.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
    });
    
    PORTFOLIO_STATE.currentCategory = null;
}

/* ===================================
   MODAL DE VIDEO
   =================================== */

function openVideoModal(itemId) {
    if (!PORTFOLIO_STATE.data) return;
    
    const item = PORTFOLIO_STATE.data.videos.find(v => v.id === itemId);
    if (!item) return;
    
    PORTFOLIO_STATE.currentItem = itemId;
    
    const avatar = resolveAssetPath(item.avatar || '');
    const videoUrl = resolveAssetPath(item.videoUrl || '');
    
    PORTFOLIO_DOM.videoModalAvatar.src = avatar;
    PORTFOLIO_DOM.videoModalAvatar.alt = item.title || 'Video';
    PORTFOLIO_DOM.videoModalTitle.textContent = item.title || 'Sin título';
    PORTFOLIO_DOM.videoModalDescription.textContent = item.description || '';
    PORTFOLIO_DOM.videoModalHandle.textContent = item.handle || '';
    
    PORTFOLIO_DOM.videoModalSource.src = videoUrl;
    PORTFOLIO_DOM.videoModalPlayer.load();
    
    // Reset
    PORTFOLIO_DOM.customPlayer.classList.remove('is-playing', 'controls-hidden');
    PORTFOLIO_DOM.playerProgressFilled.style.width = '0%';
    PORTFOLIO_DOM.playerProgressHandle.style.left = '0%';
    PORTFOLIO_DOM.playerCurrentTime.textContent = '0:00';
    PORTFOLIO_DOM.playerDuration.textContent = '0:00';
    
    // Pausar video destacado
    if (PORTFOLIO_DOM.featuredVideo && !PORTFOLIO_DOM.featuredVideo.paused) {
        PORTFOLIO_DOM.featuredVideo.pause();
    }
    
    PORTFOLIO_DOM.videoModal.classList.add('active');
    PORTFOLIO_DOM.videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => playVideo(), 250);
    
    debugLog('Modal video abierto:', item.title);
}

function closeVideoModal() {
    if (!PORTFOLIO_DOM.videoModal) return;
    
    PORTFOLIO_DOM.videoModal.classList.remove('active');
    PORTFOLIO_DOM.videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    if (PORTFOLIO_DOM.videoModalPlayer) {
        PORTFOLIO_DOM.videoModalPlayer.pause();
        PORTFOLIO_DOM.videoModalPlayer.currentTime = 0;
    }
    
    PORTFOLIO_DOM.customPlayer.classList.remove('is-playing', 'controls-hidden');
    clearTimeout(PORTFOLIO_STATE.controlsHideTimeout);
    
    PORTFOLIO_STATE.currentItem = null;
}

/* ===================================
   REPRODUCTOR
   =================================== */

function playVideo() {
    const video = PORTFOLIO_DOM.videoModalPlayer;
    if (!video) return;
    const p = video.play();
    if (p && p.catch) p.catch(err => debugLog('Play error:', err.message));
}

function pauseVideo() {
    PORTFOLIO_DOM.videoModalPlayer?.pause();
}

function togglePlay() {
    const video = PORTFOLIO_DOM.videoModalPlayer;
    if (!video) return;
    if (video.paused) playVideo();
    else pauseVideo();
}

function toggleMute() {
    const video = PORTFOLIO_DOM.videoModalPlayer;
    if (!video) return;
    video.muted = !video.muted;
    PORTFOLIO_DOM.playerVolumeBtn.classList.toggle('muted', video.muted);
    PORTFOLIO_DOM.playerVolumeBtn.setAttribute('aria-label', video.muted ? 'Activar sonido' : 'Silenciar');
}

function updateProgress() {
    const video = PORTFOLIO_DOM.videoModalPlayer;
    if (!video || !video.duration || PORTFOLIO_STATE.isDragging) return;
    
    const percent = (video.currentTime / video.duration) * 100;
    PORTFOLIO_DOM.playerProgressFilled.style.width = `${percent}%`;
    PORTFOLIO_DOM.playerProgressHandle.style.left = `${percent}%`;
    PORTFOLIO_DOM.playerCurrentTime.textContent = formatTime(video.currentTime);
}

function updateDuration() {
    const video = PORTFOLIO_DOM.videoModalPlayer;
    if (!video) return;
    PORTFOLIO_DOM.playerDuration.textContent = formatTime(video.duration);
}

function seekVideo(event) {
    const video = PORTFOLIO_DOM.videoModalPlayer;
    if (!video || !video.duration) return;
    
    const rect = PORTFOLIO_DOM.playerProgress.getBoundingClientRect();
    const clientX = event.clientX || (event.touches && event.touches[0]?.clientX) || 0;
    const clickX = clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    
    video.currentTime = percent * video.duration;
    PORTFOLIO_DOM.playerProgressFilled.style.width = `${percent * 100}%`;
    PORTFOLIO_DOM.playerProgressHandle.style.left = `${percent * 100}%`;
}

function showControls() {
    const player = PORTFOLIO_DOM.customPlayer;
    if (!player) return;
    
    player.classList.remove('controls-hidden');
    clearTimeout(PORTFOLIO_STATE.controlsHideTimeout);
    
    const video = PORTFOLIO_DOM.videoModalPlayer;
    if (video && !video.paused) {
        PORTFOLIO_STATE.controlsHideTimeout = setTimeout(() => {
            player.classList.add('controls-hidden');
        }, PORTFOLIO_CONFIG.controlsHideDelay);
    }
}

function initCustomPlayer() {
    const video = PORTFOLIO_DOM.videoModalPlayer;
    const player = PORTFOLIO_DOM.customPlayer;
    if (!video || !player) return;
    
    video.addEventListener('play', () => {
        player.classList.add('is-playing');
        showControls();
    });
    
    video.addEventListener('pause', () => {
        player.classList.remove('is-playing');
        clearTimeout(PORTFOLIO_STATE.controlsHideTimeout);
        player.classList.remove('controls-hidden');
    });
    
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('durationchange', updateDuration);
    
    video.addEventListener('ended', () => {
        player.classList.remove('is-playing');
        video.currentTime = 0;
    });
    
    // Tap en video = play/pause + mostrar controles
    video.addEventListener('click', () => {
        showControls();
        togglePlay();
    });
    
    // Botones
    PORTFOLIO_DOM.playerCenterPlay?.addEventListener('click', (e) => {
        e.stopPropagation();
        playVideo();
    });
    
    PORTFOLIO_DOM.playerPlayBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });
    
    PORTFOLIO_DOM.playerVolumeBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMute();
    });
    
    // Progress bar
    PORTFOLIO_DOM.playerProgress?.addEventListener('click', seekVideo);
    
    PORTFOLIO_DOM.playerProgress?.addEventListener('touchstart', (e) => {
        PORTFOLIO_STATE.isDragging = true;
        seekVideo(e);
        showControls();
    }, { passive: true });
    
    PORTFOLIO_DOM.playerProgress?.addEventListener('touchmove', (e) => {
        if (PORTFOLIO_STATE.isDragging) seekVideo(e);
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        if (PORTFOLIO_STATE.isDragging) {
            PORTFOLIO_STATE.isDragging = false;
        }
    });
    
    // Toque en cualquier parte del player muestra controles
    player.addEventListener('touchstart', showControls, { passive: true });
}

/* ===================================
   MODAL DE IMAGEN
   =================================== */

function openImageModal(itemId) {
    if (!PORTFOLIO_STATE.data) return;
    
    const item = PORTFOLIO_STATE.data.videos.find(v => v.id === itemId);
    if (!item) return;
    
    const imagesRaw = Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []);
    if (imagesRaw.length === 0) return;
    
    const images = imagesRaw.map(img => resolveAssetPath(img));
    const avatar = resolveAssetPath(item.avatar || '');
    
    PORTFOLIO_STATE.currentItem = itemId;
    PORTFOLIO_STATE.currentImages = images;
    PORTFOLIO_STATE.currentImageIndex = 0;
    
    PORTFOLIO_DOM.imageModalAvatar.src = avatar;
    PORTFOLIO_DOM.imageModalAvatar.alt = item.title || 'Imagen';
    PORTFOLIO_DOM.imageModalTitle.textContent = item.title || 'Sin título';
    
    const description = item.description || '';
    PORTFOLIO_DOM.imageModalDescription.innerHTML = description
        .split('\n')
        .filter(p => p.trim())
        .map(p => `<p>${escapeHTML(p.trim())}</p>`)
        .join('');
    
    PORTFOLIO_DOM.imageModalHandle.textContent = item.handle || '';
    
    // Descripción colapsada al abrir
    PORTFOLIO_DOM.imageModalDescription.classList.remove('expanded');
    if (PORTFOLIO_DOM.imageInfoToggle) {
        PORTFOLIO_DOM.imageInfoToggle.textContent = 'Ver descripción';
    }
    
    // Ocultar navegación si es imagen única
    if (images.length > 1) {
        PORTFOLIO_DOM.imageModal.classList.remove('single-image');
        PORTFOLIO_DOM.imageTotal.textContent = images.length;
    } else {
        PORTFOLIO_DOM.imageModal.classList.add('single-image');
    }
    
    updateImageViewer(0);
    
    PORTFOLIO_DOM.imageModal.classList.add('active');
    PORTFOLIO_DOM.imageModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    if (PORTFOLIO_DOM.featuredVideo && !PORTFOLIO_DOM.featuredVideo.paused) {
        PORTFOLIO_DOM.featuredVideo.pause();
    }
    
    debugLog('Modal imagen abierto:', item.title, '| Total:', images.length);
}

function closeImageModal() {
    if (!PORTFOLIO_DOM.imageModal) return;
    
    PORTFOLIO_DOM.imageModal.classList.remove('active');
    PORTFOLIO_DOM.imageModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    PORTFOLIO_STATE.currentItem = null;
    PORTFOLIO_STATE.currentImages = [];
    PORTFOLIO_STATE.currentImageIndex = 0;
}

function updateImageViewer(index) {
    const total = PORTFOLIO_STATE.currentImages.length;
    if (index < 0 || index >= total) return;
    
    PORTFOLIO_STATE.currentImageIndex = index;
    const img = PORTFOLIO_DOM.imageModalImage;
    
    img.classList.add('fading');
    setTimeout(() => {
        img.src = PORTFOLIO_STATE.currentImages[index];
        img.alt = `Imagen ${index + 1} de ${total}`;
        img.onload = () => img.classList.remove('fading');
    }, 180);
    
    if (PORTFOLIO_DOM.imageCurrent) PORTFOLIO_DOM.imageCurrent.textContent = index + 1;
    if (PORTFOLIO_DOM.imageNavPrev) PORTFOLIO_DOM.imageNavPrev.disabled = index === 0;
    if (PORTFOLIO_DOM.imageNavNext) PORTFOLIO_DOM.imageNavNext.disabled = index === total - 1;
}

function nextImage() {
    const next = PORTFOLIO_STATE.currentImageIndex + 1;
    if (next < PORTFOLIO_STATE.currentImages.length) updateImageViewer(next);
}

function prevImage() {
    const prev = PORTFOLIO_STATE.currentImageIndex - 1;
    if (prev >= 0) updateImageViewer(prev);
}

function toggleImageDescription() {
    const desc = PORTFOLIO_DOM.imageModalDescription;
    const toggle = PORTFOLIO_DOM.imageInfoToggle;
    if (!desc || !toggle) return;
    
    const isExpanded = desc.classList.toggle('expanded');
    toggle.textContent = isExpanded ? 'Ocultar descripción' : 'Ver descripción';
}

/* ===================================
   SWIPE PARA IMÁGENES
   =================================== */

function initImageSwipe() {
    const viewer = PORTFOLIO_DOM.imageModalViewer;
    if (!viewer) return;
    
    viewer.addEventListener('touchstart', (e) => {
        PORTFOLIO_STATE.touchStartX = e.touches[0].clientX;
        PORTFOLIO_STATE.touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    viewer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = PORTFOLIO_STATE.touchStartX - touchEndX;
        const diffY = PORTFOLIO_STATE.touchStartY - touchEndY;
        
        // Solo horizontal (evita scroll vertical accidental)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > PORTFOLIO_CONFIG.swipeThreshold) {
            if (diffX > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
    }, { passive: true });
}

/* ===================================
   VIDEO DESTACADO
   =================================== */

let featuredVideoObserver = null;

function pauseFeaturedVideo() {
    const video = PORTFOLIO_DOM.featuredVideo;
    if (!video || video.paused) return;
    video.pause();
    video.closest('.video-wrapper')?.classList.remove('is-playing');
}

function playFeaturedVideo() {
    const video = PORTFOLIO_DOM.featuredVideo;
    if (!video || !video.paused) return;
    const p = video.play();
    if (p && p.then) {
        p.then(() => {
            video.closest('.video-wrapper')?.classList.add('is-playing');
        }).catch(() => {});
    }
}

function initFeaturedVideo() {
    const video = PORTFOLIO_DOM.featuredVideo;
    const soundBtn = PORTFOLIO_DOM.soundBtn;
    if (!video) return;
    
    featuredVideoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) playFeaturedVideo();
            else pauseFeaturedVideo();
        });
    }, { threshold: 0.4 });
    
    featuredVideoObserver.observe(video);
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) pauseFeaturedVideo();
    });
    
    video.addEventListener('ended', () => {
        video.currentTime = 0;
        playFeaturedVideo();
    });
    
    if (soundBtn) {
        video.addEventListener('playing', () => {
            if (video.muted) soundBtn.classList.add('pulse');
        }, { once: true });
        
        soundBtn.addEventListener('click', () => {
            video.muted = !video.muted;
            if (video.muted) {
                soundBtn.classList.remove('is-unmuted');
                soundBtn.setAttribute('aria-label', 'Activar sonido');
            } else {
                soundBtn.classList.add('is-unmuted');
                soundBtn.classList.remove('pulse');
                soundBtn.setAttribute('aria-label', 'Silenciar');
            }
        });
    }
}

/* ===================================
   EVENTOS GLOBALES
   =================================== */

function initGlobalEvents() {
    PORTFOLIO_DOM.panelCloseBtn?.addEventListener('click', closePanel);
    PORTFOLIO_DOM.videoModalClose?.addEventListener('click', closeVideoModal);
    PORTFOLIO_DOM.imageModalClose?.addEventListener('click', closeImageModal);
    PORTFOLIO_DOM.imageNavPrev?.addEventListener('click', prevImage);
    PORTFOLIO_DOM.imageNavNext?.addEventListener('click', nextImage);
    PORTFOLIO_DOM.imageInfoToggle?.addEventListener('click', toggleImageDescription);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (PORTFOLIO_DOM.videoModal?.classList.contains('active')) {
                closeVideoModal();
                return;
            }
            if (PORTFOLIO_DOM.imageModal?.classList.contains('active')) {
                closeImageModal();
                return;
            }
            if (PORTFOLIO_DOM.videosPanel?.classList.contains('active')) {
                closePanel();
                return;
            }
        }
        
        if (PORTFOLIO_DOM.imageModal?.classList.contains('active')) {
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        }
    });
}

/* ===================================
   INICIALIZACIÓN
   =================================== */

async function initPortfolio() {
    debugLog('Inicializando Portfolio móvil...');
    
    initHeroBackground();
    initFeaturedVideo();
    initGlobalEvents();
    initCustomPlayer();
    initImageSwipe();
    
    const data = await loadPortfolioData();
    
    if (!data) {
        if (PORTFOLIO_DOM.categoriesGrid) {
            PORTFOLIO_DOM.categoriesGrid.innerHTML = 
                '<p style="color: rgba(255,255,255,0.6); padding: 1rem; font-size: 0.85rem;">No se pudieron cargar las categorías.</p>';
        }
        return;
    }
    
    PORTFOLIO_STATE.data = data;
    
    if (data.categories && Array.isArray(data.categories)) {
        renderCategories(data.categories);
    }
    
    debugLog('Portfolio inicializado');
}

/* ===================================
   ARRANQUE
   =================================== */

if (document.querySelector('.portfolio-categories-section')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPortfolio);
    } else {
        initPortfolio();
    }
}

/* ===================================
   DEBUG
   =================================== */

if (PORTFOLIO_CONFIG.isDebug) {
    window.OceanPortfolioMobile = {
        config: PORTFOLIO_CONFIG,
        dom: PORTFOLIO_DOM,
        state: PORTFOLIO_STATE,
        selectCategory,
        openVideoModal,
        openImageModal,
        closeVideoModal,
        closeImageModal,
        closePanel,
        nextImage,
        prevImage,
        togglePlay,
        toggleMute
    };
    console.log('[PORTFOLIO-MOBILE] window.OceanPortfolioMobile disponible');
}