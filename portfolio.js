/* ===================================
   OCEAN GRAPH - PORTFOLIO PAGE JS
   Sistema de categorías + videos + imágenes desde JSON
   =================================== */

'use strict';

/* ===================================
   CONFIGURACIÓN
   =================================== */

const PORTFOLIO_CONFIG = {
    dataUrl: 'data/portfolio-videos.json',
    isDebug: localStorage.getItem('debug') === 'true'
};

/* ===================================
   REFERENCIAS AL DOM
   =================================== */

const PORTFOLIO_DOM = {
    // Categorías
    categoriesGrid: document.getElementById('categories-grid'),
    
    // Panel de contenido
    videosPanel: document.getElementById('videos-panel'),
    panelCategoryName: document.getElementById('panel-category-name'),
    panelCloseBtn: document.getElementById('panel-close-btn'),
    videosGrid: document.getElementById('videos-grid'),
    videosEmpty: document.getElementById('videos-empty'),
    
    // Modal reproductor de VIDEO
    videoModal: document.getElementById('video-modal'),
    videoModalOverlay: document.getElementById('video-modal-overlay'),
    videoModalClose: document.getElementById('video-modal-close'),
    videoModalPlayer: document.getElementById('video-modal-player'),
    videoModalSource: document.getElementById('video-modal-source'),
    videoModalAvatar: document.getElementById('video-modal-avatar'),
    videoModalTitle: document.getElementById('video-modal-title'),
    videoModalDescription: document.getElementById('video-modal-description'),
    videoModalHandleAvatar: document.getElementById('video-modal-handle-avatar'),
    videoModalHandle: document.getElementById('video-modal-handle'),
    
    // Modal de IMAGEN
    imageModal: document.getElementById('image-modal'),
    imageModalOverlay: document.getElementById('image-modal-overlay'),
    imageModalClose: document.getElementById('image-modal-close'),
    imageModalAvatar: document.getElementById('image-modal-avatar'),
    imageModalTitle: document.getElementById('image-modal-title'),
    imageModalDescription: document.getElementById('image-modal-description'),
    imageModalHandle: document.getElementById('image-modal-handle'),
    imageModalImage: document.getElementById('image-modal-image'),
    imageViewerControls: document.getElementById('image-viewer-controls'),
    imageNavPrev: document.getElementById('image-nav-prev'),
    imageNavNext: document.getElementById('image-nav-next'),
    imageCurrent: document.getElementById('image-current'),
    imageTotal: document.getElementById('image-total'),
    
    // Video destacado
    featuredVideo: document.querySelector('.portfolio-featured-video')
};

/* ===================================
   ESTADO DE LA APLICACIÓN
   =================================== */

const PORTFOLIO_STATE = {
    data: null,
    currentCategory: null,
    currentItem: null,
    currentImages: [],
    currentImageIndex: 0
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
        console.log('[PORTFOLIO]', ...args);
    }
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
   CARGA DEL JSON
   =================================== */

async function loadPortfolioData() {
    try {
        const response = await fetch(PORTFOLIO_CONFIG.dataUrl, { cache: 'no-cache' });
        
        if (!response.ok) {
            console.warn('[PORTFOLIO] No se pudo cargar el JSON. Status:', response.status);
            return null;
        }
        
        const data = await response.json();
        debugLog('JSON cargado:', data);
        return data;
    } catch (error) {
        console.error('[PORTFOLIO] Error al cargar el JSON:', error);
        return null;
    }
}

/* ===================================
   RENDERIZAR CATEGORÍAS
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
            const catId = btn.getAttribute('data-category-id');
            selectCategory(catId);
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
    if (!category) {
        console.warn('[PORTFOLIO] Categoría no encontrada:', categoryId);
        return;
    }
    
    // Toggle: clic en misma categoría → cerrar
    if (PORTFOLIO_STATE.currentCategory === categoryId) {
        closePanel();
        return;
    }
    
    PORTFOLIO_STATE.currentCategory = categoryId;
    
    // Actualizar estados de botones
    PORTFOLIO_DOM.categoriesGrid.querySelectorAll('.category-btn').forEach(btn => {
        const isActive = btn.getAttribute('data-category-id') === categoryId;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
    });
    
    // Filtrar items de esta categoría
    const items = PORTFOLIO_STATE.data.videos.filter(v => v.categoryId === categoryId);
    
    // Actualizar título del panel
    PORTFOLIO_DOM.panelCategoryName.textContent = category.name.toUpperCase();
    
    // Renderizar items
    renderItems(items);
    
    // Abrir panel
    openPanel();
    
    // Scroll suave
    setTimeout(() => {
        PORTFOLIO_DOM.videosPanel.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 100);
    
    debugLog('Categoría seleccionada:', category.name, '| Items:', items.length);
}

/* ===================================
   RENDERIZAR ITEMS (VIDEO O IMAGEN)
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
        
        if (type === 'image') {
            return renderImageCard(item, index);
        }
        return renderVideoCard(item, index);
    }).join('');
    
    PORTFOLIO_DOM.videosGrid.innerHTML = html;
    
    // Listeners
    PORTFOLIO_DOM.videosGrid.querySelectorAll('.video-card').forEach(card => {
        const itemId = card.getAttribute('data-item-id');
        const itemType = card.getAttribute('data-item-type');
        
        card.addEventListener('click', (e) => {
            if (e.target.closest('.video-card-play-btn, .video-card-image-btn')) return;
            if (itemType === 'image') {
                openImageModal(itemId);
            } else {
                openVideoModal(itemId);
            }
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
    
    debugLog('Items renderizados:', items.length);
}

/* ===================================
   RENDERIZAR TARJETA DE VIDEO
   =================================== */

function renderVideoCard(item, index) {
    return `
        <article 
            class="video-card" 
            data-item-id="${escapeHTML(item.id)}"
            data-item-type="video"
            style="animation-delay: ${index * 60}ms;"
        >
            <div class="video-card-thumbnail">
                <img 
                    src="${escapeHTML(item.thumbnail || '')}" 
                    alt="${escapeHTML(item.title || 'Video')}"
                    loading="lazy"
                >
                <div class="video-card-watermark">
                    <img src="Logo/OceanGraph - Ola.svg" alt="Ocean Graph">
                </div>
            </div>
            
            <div class="video-card-info">
                <div class="video-card-avatar">
                    <img 
                        src="${escapeHTML(item.avatar || '')}" 
                        alt="${escapeHTML(item.handle || 'Cliente')}"
                        loading="lazy"
                    >
                </div>
                <div class="video-card-details">
                    <h4 class="video-card-title">${escapeHTML(item.title || 'Sin título')}</h4>
                    <p class="video-card-description">${escapeHTML(item.description || '')}</p>
                    <span class="video-card-handle">${escapeHTML(item.handle || '')}</span>
                </div>
                <button 
                    class="video-card-play-btn" 
                    type="button"
                    aria-label="Reproducir ${escapeHTML(item.title || 'video')}"
                >
                    ${ICONS.play}
                </button>
            </div>
        </article>
    `;
}

/* ===================================
   RENDERIZAR TARJETA DE IMAGEN
   =================================== */

function renderImageCard(item, index) {
    const images = Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []);
    const imageCount = images.length;
    const firstImage = images[0] || '';
    
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
            style="animation-delay: ${index * 60}ms;"
        >
            <div class="video-card-thumbnail">
                <img 
                    src="${escapeHTML(firstImage)}" 
                    alt="${escapeHTML(item.title || 'Imagen')}"
                    loading="lazy"
                >
                ${countBadge}
                <div class="video-card-watermark">
                    <img src="Logo/OceanGraph - Ola.svg" alt="Ocean Graph">
                </div>
            </div>
            
            <div class="video-card-info">
                <div class="video-card-avatar">
                    <img 
                        src="${escapeHTML(item.avatar || '')}" 
                        alt="${escapeHTML(item.handle || 'Cliente')}"
                        loading="lazy"
                    >
                </div>
                <div class="video-card-details">
                    <h4 class="video-card-title">${escapeHTML(item.title || 'Sin título')}</h4>
                    <p class="video-card-description">${escapeHTML(item.description || '')}</p>
                    <span class="video-card-handle">${escapeHTML(item.handle || '')}</span>
                </div>
                <button 
                    class="video-card-image-btn" 
                    type="button"
                    aria-label="Ver ${escapeHTML(item.title || 'imagen')}"
                >
                    ${ICONS.image}
                </button>
            </div>
        </article>
    `;
}

/* ===================================
   ABRIR / CERRAR PANEL
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
    debugLog('Panel cerrado');
}

/* ===================================
   MODAL DE VIDEO
   =================================== */

function openVideoModal(itemId) {
    if (!PORTFOLIO_STATE.data) return;
    
    const item = PORTFOLIO_STATE.data.videos.find(v => v.id === itemId);
    if (!item) {
        console.warn('[PORTFOLIO] Video no encontrado:', itemId);
        return;
    }
    
    PORTFOLIO_STATE.currentItem = itemId;
    
    PORTFOLIO_DOM.videoModalAvatar.src = item.avatar || '';
    PORTFOLIO_DOM.videoModalAvatar.alt = item.title || 'Video';
    PORTFOLIO_DOM.videoModalTitle.textContent = item.title || 'Sin título';
    PORTFOLIO_DOM.videoModalDescription.textContent = item.description || '';
    PORTFOLIO_DOM.videoModalHandleAvatar.src = item.avatar || '';
    PORTFOLIO_DOM.videoModalHandleAvatar.alt = '';
    PORTFOLIO_DOM.videoModalHandle.textContent = item.handle || '';
    
    PORTFOLIO_DOM.videoModalSource.src = item.videoUrl || '';
    PORTFOLIO_DOM.videoModalPlayer.load();
    
    if (PORTFOLIO_DOM.featuredVideo && !PORTFOLIO_DOM.featuredVideo.paused) {
        PORTFOLIO_DOM.featuredVideo.pause();
    }
    
    PORTFOLIO_DOM.videoModal.classList.add('active');
    PORTFOLIO_DOM.videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        const playPromise = PORTFOLIO_DOM.videoModalPlayer.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(err => debugLog('No se pudo reproducir automáticamente:', err.message));
        }
    }, 200);
    
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
    
    PORTFOLIO_STATE.currentItem = null;
    debugLog('Modal video cerrado');
}

/* ===================================
   MODAL DE IMAGEN (GALERÍA)
   =================================== */

function openImageModal(itemId) {
    if (!PORTFOLIO_STATE.data) return;
    
    const item = PORTFOLIO_STATE.data.videos.find(v => v.id === itemId);
    if (!item) {
        console.warn('[PORTFOLIO] Imagen no encontrada:', itemId);
        return;
    }
    
    const images = Array.isArray(item.images) ? item.images : (item.image ? [item.image] : []);
    
    if (images.length === 0) {
        console.warn('[PORTFOLIO] Item sin imágenes:', itemId);
        return;
    }
    
    PORTFOLIO_STATE.currentItem = itemId;
    PORTFOLIO_STATE.currentImages = images;
    PORTFOLIO_STATE.currentImageIndex = 0;
    
    PORTFOLIO_DOM.imageModalAvatar.src = item.avatar || '';
    PORTFOLIO_DOM.imageModalAvatar.alt = item.title || 'Imagen';
    PORTFOLIO_DOM.imageModalTitle.textContent = item.title || 'Sin título';
    
    const description = item.description || '';
    PORTFOLIO_DOM.imageModalDescription.innerHTML = description
        .split('\n')
        .filter(p => p.trim())
        .map(p => `<p>${escapeHTML(p.trim())}</p>`)
        .join('');
    
    PORTFOLIO_DOM.imageModalHandle.textContent = item.handle || '';
    
    if (images.length > 1) {
        PORTFOLIO_DOM.imageViewerControls.classList.remove('single-image');
        PORTFOLIO_DOM.imageTotal.textContent = images.length;
    } else {
        PORTFOLIO_DOM.imageViewerControls.classList.add('single-image');
    }
    
    updateImageViewer(0);
    
    PORTFOLIO_DOM.imageModal.classList.add('active');
    PORTFOLIO_DOM.imageModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    if (PORTFOLIO_DOM.featuredVideo && !PORTFOLIO_DOM.featuredVideo.paused) {
        PORTFOLIO_DOM.featuredVideo.pause();
    }
    
    debugLog('Modal imagen abierto:', item.title, '| Imágenes:', images.length);
}

function closeImageModal() {
    if (!PORTFOLIO_DOM.imageModal) return;
    
    PORTFOLIO_DOM.imageModal.classList.remove('active');
    PORTFOLIO_DOM.imageModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    PORTFOLIO_STATE.currentItem = null;
    PORTFOLIO_STATE.currentImages = [];
    PORTFOLIO_STATE.currentImageIndex = 0;
    debugLog('Modal imagen cerrado');
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
    }, 200);
    
    if (PORTFOLIO_DOM.imageCurrent) {
        PORTFOLIO_DOM.imageCurrent.textContent = index + 1;
    }
    
    if (PORTFOLIO_DOM.imageNavPrev) {
        PORTFOLIO_DOM.imageNavPrev.disabled = index === 0;
    }
    if (PORTFOLIO_DOM.imageNavNext) {
        PORTFOLIO_DOM.imageNavNext.disabled = index === total - 1;
    }
}

function nextImage() {
    const nextIdx = PORTFOLIO_STATE.currentImageIndex + 1;
    if (nextIdx < PORTFOLIO_STATE.currentImages.length) {
        updateImageViewer(nextIdx);
    }
}

function prevImage() {
    const prevIdx = PORTFOLIO_STATE.currentImageIndex - 1;
    if (prevIdx >= 0) {
        updateImageViewer(prevIdx);
    }
}

/* ===================================
   VIDEO DESTACADO (SCROLL AUTO-PLAY)
   =================================== */

let featuredVideoObserver = null;

function pauseFeaturedVideo() {
    const video = PORTFOLIO_DOM.featuredVideo;
    if (!video) return;
    if (!video.paused) {
        video.pause();
        const wrapper = video.closest('.video-wrapper');
        if (wrapper) wrapper.classList.remove('is-playing');
    }
}

function playFeaturedVideo() {
    const video = PORTFOLIO_DOM.featuredVideo;
    if (!video) return;
    if (video.paused) {
        const playPromise = video.play();
        if (playPromise && typeof playPromise.then === 'function') {
            playPromise
                .then(() => {
                    const wrapper = video.closest('.video-wrapper');
                    if (wrapper) wrapper.classList.add('is-playing');
                })
                .catch(err => debugLog('Autoplay bloqueado:', err.message));
        }
    }
}

function initFeaturedVideo() {
    const video = PORTFOLIO_DOM.featuredVideo;
    const soundBtn = document.getElementById('video-sound-btn');
    
    if (!video) {
        debugLog('No hay video destacado');
        return;
    }
    
    featuredVideoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                playFeaturedVideo();
            } else {
                pauseFeaturedVideo();
            }
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
                soundBtn.title = 'Activar sonido';
            } else {
                soundBtn.classList.add('is-unmuted');
                soundBtn.classList.remove('pulse');
                soundBtn.setAttribute('aria-label', 'Silenciar');
                soundBtn.title = 'Silenciar';
            }
        });
    }
    
    debugLog('Video destacado inicializado');
}

/* ===================================
   EVENTOS GLOBALES
   =================================== */

function initGlobalEvents() {
    if (PORTFOLIO_DOM.panelCloseBtn) {
        PORTFOLIO_DOM.panelCloseBtn.addEventListener('click', closePanel);
    }
    
    if (PORTFOLIO_DOM.videoModalClose) {
        PORTFOLIO_DOM.videoModalClose.addEventListener('click', closeVideoModal);
    }
    if (PORTFOLIO_DOM.videoModalOverlay) {
        PORTFOLIO_DOM.videoModalOverlay.addEventListener('click', closeVideoModal);
    }
    
    if (PORTFOLIO_DOM.imageModalClose) {
        PORTFOLIO_DOM.imageModalClose.addEventListener('click', closeImageModal);
    }
    if (PORTFOLIO_DOM.imageModalOverlay) {
        PORTFOLIO_DOM.imageModalOverlay.addEventListener('click', closeImageModal);
    }
    if (PORTFOLIO_DOM.imageNavPrev) {
        PORTFOLIO_DOM.imageNavPrev.addEventListener('click', prevImage);
    }
    if (PORTFOLIO_DOM.imageNavNext) {
        PORTFOLIO_DOM.imageNavNext.addEventListener('click', nextImage);
    }
    
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
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevImage();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextImage();
            }
        }
    });
}

/* ===================================
   INICIALIZACIÓN
   =================================== */

async function initPortfolio() {
    debugLog('Inicializando Portfolio...');
    
    initFeaturedVideo();
    initGlobalEvents();
    
    const data = await loadPortfolioData();
    
    if (!data) {
        console.warn('[PORTFOLIO] No se pudieron cargar los datos');
        if (PORTFOLIO_DOM.categoriesGrid) {
            PORTFOLIO_DOM.categoriesGrid.innerHTML = 
                '<p style="color: rgba(255,255,255,0.6); text-align: center; grid-column: 1/-1;">No se pudieron cargar las categorías.</p>';
        }
        return;
    }
    
    PORTFOLIO_STATE.data = data;
    
    if (data.categories && Array.isArray(data.categories)) {
        renderCategories(data.categories);
    }
    
    debugLog('Portfolio inicializado correctamente');
    debugLog('Categorías:', data.categories?.length || 0);
    debugLog('Items totales:', data.videos?.length || 0);
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
   DEBUG (OPCIONAL)
   =================================== */

if (PORTFOLIO_CONFIG.isDebug) {
    window.OceanPortfolio = {
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
        loadPortfolioData
    };
    console.log('[PORTFOLIO] window.OceanPortfolio disponible para debugging');
}
