/* ===================================
   OCEAN GRAPH - COMMUNITY MOBILE
   mobile/community.js
   Genera los posts desde ../data/community-posts.json
   Optimizado con Lazy Loading de embeds (Instagram/TikTok)
   =================================== */

'use strict';

/* CONFIGURACIÓN */

const COMMUNITY_CONFIG = {
    isDebug: localStorage.getItem('debug') === 'true',
    postsUrl: '../data/community-posts.json',
    embedRootMargin: '200px' // Precarga embeds cuando estén a 200px de aparecer
};

/* DOM */

const COMMUNITY_DOM = {
    feed: document.getElementById('community-feed'),
    posts: null
};

/* UTILIDADES */

function getPreviewText(element, maxLength) {
    if (!element) return '';
    const text = element.textContent.trim().replace(/\s+/g, ' ');
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '…';
}

function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Ajusta rutas de imágenes para móvil.
 */
function resolveAssetPath(path) {
    if (!path) return '';
    const trimmed = path.trim().replace(/\\/g, '/');
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return '../' + trimmed.replace(/^\.?\//, '');
}

function renderTags(tags) {
    if (!Array.isArray(tags) || tags.length === 0) return '';
    return `
        <div class="community-tag-row">
            ${tags.map(tag => `<span class="community-tag">${escapeHTML(tag)}</span>`).join('')}
        </div>
    `;
}

function renderParagraphs(paragraphs) {
    if (!Array.isArray(paragraphs) || paragraphs.length === 0) return '';
    return paragraphs.map(p => `<p>${escapeHTML(p)}</p>`).join('');
}

function getVariantClass(post) {
    return post.variant ? ` community-post--${post.variant}` : '';
}

/* Imagen opcional SOLO para type:text */

function renderImage(post) {
    if (!post.image) return '';

    const src = resolveAssetPath(post.image);
    const imgTag = `
        <img 
            src="${escapeHTML(src)}" 
            alt="${escapeHTML(post.imageAlt || '')}" 
            loading="lazy"
            decoding="async"
        >
    `;

    if (!post.imageLink) {
        return `
            <figure class="community-post-media">
                ${imgTag}
            </figure>
        `;
    }

    const href = escapeHTML(post.imageLink);
    const isExternal = /^https?:\/\//i.test(post.imageLink);

    return `
        <figure class="community-post-media">
            <a 
                href="${href}"
                ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}
            >
                ${imgTag}
            </a>
        </figure>
    `;
}

/* GENERACIÓN HTML */

function renderTextPost(post) {
    const variantClass = getVariantClass(post);
    const avatarSrc = resolveAssetPath(post.avatar || '');
    return `
<article class="community-post${variantClass}" data-post-id="${escapeHTML(post.id || '')}" data-post-type="text">
    <div class="community-post-inner">
        <header class="community-post-header">
            <div class="community-avatar">
                <img 
                    src="${escapeHTML(avatarSrc)}" 
                    alt="${escapeHTML(post.name || 'Miembro de Ocean Graph')}"
                    loading="lazy"
                    decoding="async"
                >
            </div>
            <div class="community-header-meta">
                <div class="community-name-row">
                    <span class="community-name">${escapeHTML(post.name || '')}</span>
                    <span class="community-handle">${escapeHTML(post.handle || '')}</span>
                    <span class="community-dot">·</span>
                    <time datetime="${escapeHTML(post.date || '')}">${escapeHTML(post.dateText || '')}</time>
                </div>
                ${renderTags(post.tags)}
            </div>
        </header>

        <div class="community-post-body">
            ${renderImage(post)}
            ${renderParagraphs(post.paragraphs)}
        </div>
    </div>
</article>
    `.trim();
}

/**
 * Instagram con LAZY: se genera el placeholder,
 * el blockquote real se inserta cuando el post entra en viewport
 */
function renderInstagramPost(post) {
    const variantClass = getVariantClass(post);
    const url = post.instagramUrl || '';
    const avatarSrc = resolveAssetPath(post.avatar || '');
    return `
<article 
    class="community-post community-post--instagram${variantClass}" 
    data-post-id="${escapeHTML(post.id || '')}"
    data-post-type="instagram"
    data-embed-url="${escapeHTML(url)}"
    data-embed-loaded="false"
>
    <div class="community-post-inner">
        <header class="community-post-header">
            <div class="community-avatar">
                <img 
                    src="${escapeHTML(avatarSrc)}" 
                    alt="${escapeHTML(post.name || 'Miembro de contenido Ocean Graph')}"
                    loading="lazy"
                    decoding="async"
                >
            </div>
            <div class="community-header-meta">
                <div class="community-name-row">
                    <span class="community-name">${escapeHTML(post.name || '')}</span>
                    <span class="community-handle">${escapeHTML(post.handle || '')}</span>
                    <span class="community-dot">·</span>
                    <time datetime="${escapeHTML(post.date || '')}">${escapeHTML(post.dateText || '')}</time>
                </div>
                ${renderTags(post.tags)}
            </div>
        </header>

        <div class="community-post-body">
            <!-- Placeholder mientras carga -->
            <div class="community-embed-placeholder" aria-hidden="true">
                <div class="embed-placeholder-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <circle cx="12" cy="12" r="4"/>
                        <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                    </svg>
                </div>
                <span class="embed-placeholder-text">Cargando publicación...</span>
            </div>

            <div class="community-post-description">
                ${renderParagraphs(post.paragraphs)}
            </div>
        </div>

        <footer class="community-post-footer">
            <a 
                href="${escapeHTML(url)}"
                target="_blank"
                rel="noopener noreferrer"
                class="portfolio-more-link"
            >
                Ver publicación en Instagram
            </a>
        </footer>
    </div>
</article>
    `.trim();
}

/**
 * TikTok con LAZY: mismo mecanismo
 */
function renderTikTokPost(post) {
    const variantClass = getVariantClass(post);
    const url = post.tiktokUrl || '';
    const videoId = post.tiktokId || '';
    const avatarSrc = resolveAssetPath(post.avatar || '');
    return `
<article 
    class="community-post community-post--tiktok${variantClass}" 
    data-post-id="${escapeHTML(post.id || '')}"
    data-post-type="tiktok"
    data-embed-url="${escapeHTML(url)}"
    data-embed-id="${escapeHTML(videoId)}"
    data-embed-loaded="false"
>
    <div class="community-post-inner">
        <header class="community-post-header">
            <div class="community-avatar">
                <img 
                    src="${escapeHTML(avatarSrc)}" 
                    alt="${escapeHTML(post.name || 'Miembro de contenido Ocean Graph')}"
                    loading="lazy"
                    decoding="async"
                >
            </div>
            <div class="community-header-meta">
                <div class="community-name-row">
                    <span class="community-name">${escapeHTML(post.name || '')}</span>
                    <span class="community-handle">${escapeHTML(post.handle || '')}</span>
                    <span class="community-dot">·</span>
                    <time datetime="${escapeHTML(post.date || '')}">${escapeHTML(post.dateText || '')}</time>
                </div>
                ${renderTags(post.tags)}
            </div>
        </header>

        <div class="community-post-body">
            <!-- Placeholder mientras carga -->
            <div class="community-embed-placeholder" aria-hidden="true">
                <div class="embed-placeholder-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                    </svg>
                </div>
                <span class="embed-placeholder-text">Cargando video TikTok...</span>
            </div>

            <div class="community-post-description">
                ${renderParagraphs(post.paragraphs)}
            </div>
        </div>

        <footer class="community-post-footer">
            <a 
                href="${escapeHTML(url)}"
                target="_blank"
                rel="noopener noreferrer"
                class="portfolio-more-link"
            >
                Ver en TikTok
            </a>
        </footer>
    </div>
</article>
    `.trim();
}

function renderCommunityPosts(posts) {
    if (!COMMUNITY_DOM.feed) return;
    if (!Array.isArray(posts) || posts.length === 0) {
        COMMUNITY_DOM.feed.innerHTML = '';
        return;
    }

    const html = posts.map(post => {
        if (post.type === 'instagram') return renderInstagramPost(post);
        if (post.type === 'tiktok') return renderTikTokPost(post);
        return renderTextPost(post);
    }).join('');

    COMMUNITY_DOM.feed.innerHTML = html;
    COMMUNITY_DOM.posts = COMMUNITY_DOM.feed.querySelectorAll('.community-post');
}

/* ===================================
   LAZY LOADING DE EMBEDS
   =================================== */

/**
 * Carga el embed real de Instagram dentro del post
 */
function loadInstagramEmbed(post) {
    const url = post.getAttribute('data-embed-url');
    const body = post.querySelector('.community-post-body');
    const placeholder = post.querySelector('.community-embed-placeholder');
    
    if (!url || !body || post.getAttribute('data-embed-loaded') === 'true') return;
    
    const blockquote = document.createElement('blockquote');
    blockquote.className = 'instagram-media';
    blockquote.setAttribute('data-instgrm-captioned', '');
    blockquote.setAttribute('data-instgrm-permalink', url);
    blockquote.setAttribute('data-instgrm-version', '14');
    blockquote.style.margin = '0';
    blockquote.innerHTML = `<a href="${url}"></a>`;
    
    // Insertar antes de la descripción
    const desc = body.querySelector('.community-post-description');
    if (desc) {
        body.insertBefore(blockquote, desc);
    } else {
        body.appendChild(blockquote);
    }
    
    // Ocultar placeholder
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    
    post.setAttribute('data-embed-loaded', 'true');
    
    // Procesar el embed
    if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === 'function') {
        window.instgrm.Embeds.process();
    }
    
    if (COMMUNITY_CONFIG.isDebug) {
        console.log('Community (mobile): Instagram embed cargado', post.getAttribute('data-post-id'));
    }
}

/**
 * Carga el embed real de TikTok dentro del post
 */
function loadTikTokEmbed(post) {
    const url = post.getAttribute('data-embed-url');
    const videoId = post.getAttribute('data-embed-id');
    const body = post.querySelector('.community-post-body');
    const placeholder = post.querySelector('.community-embed-placeholder');
    
    if (!url || !videoId || !body || post.getAttribute('data-embed-loaded') === 'true') return;
    
    const desc = body.querySelector('.community-post-description');
    const previewP = desc?.querySelector('p');
    const previewText = previewP ? previewP.textContent.trim() : '';
    
    const blockquote = document.createElement('blockquote');
    blockquote.className = 'tiktok-embed';
    blockquote.setAttribute('cite', url);
    blockquote.setAttribute('data-video-id', videoId);
    blockquote.style.cssText = 'max-width: 605px; min-width: 325px; margin:0;';
    blockquote.innerHTML = `<section><p>${previewText}</p></section>`;
    
    if (desc) {
        body.insertBefore(blockquote, desc);
    } else {
        body.appendChild(blockquote);
    }
    
    if (placeholder) {
        placeholder.style.display = 'none';
    }
    
    post.setAttribute('data-embed-loaded', 'true');
    
    if (window.tiktokEmbed && typeof window.tiktokEmbed.load === 'function') {
        window.tiktokEmbed.load();
    }
    
    if (COMMUNITY_CONFIG.isDebug) {
        console.log('Community (mobile): TikTok embed cargado', post.getAttribute('data-post-id'));
    }
}

/**
 * Observa posts con embeds y los carga cuando estén cerca del viewport
 */
function initLazyEmbeds() {
    if (!COMMUNITY_DOM.posts) return;
    
    const embedPosts = Array.from(COMMUNITY_DOM.posts).filter(post => {
        const type = post.getAttribute('data-post-type');
        return type === 'instagram' || type === 'tiktok';
    });
    
    if (embedPosts.length === 0) return;
    
    // Fallback si no hay IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        embedPosts.forEach(post => {
            const type = post.getAttribute('data-post-type');
            if (type === 'instagram') loadInstagramEmbed(post);
            else if (type === 'tiktok') loadTikTokEmbed(post);
        });
        return;
    }
    
    const embedObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            
            const post = entry.target;
            const type = post.getAttribute('data-post-type');
            
            if (type === 'instagram') loadInstagramEmbed(post);
            else if (type === 'tiktok') loadTikTokEmbed(post);
            
            obs.unobserve(post);
        });
    }, {
        rootMargin: COMMUNITY_CONFIG.embedRootMargin,
        threshold: 0.01
    });
    
    embedPosts.forEach(post => embedObserver.observe(post));
    
    if (COMMUNITY_CONFIG.isDebug) {
        console.log('Community (mobile): lazy embeds inicializados para', embedPosts.length, 'posts');
    }
}

/* ACCESIBILIDAD */

function enhanceCommunityAccessibility() {
    if (!COMMUNITY_DOM.feed || !COMMUNITY_DOM.posts || COMMUNITY_DOM.posts.length === 0) return;

    COMMUNITY_DOM.feed.setAttribute('role', 'feed');
    COMMUNITY_DOM.feed.setAttribute('aria-label', 'Timeline de la comunidad Ocean Graph');

    COMMUNITY_DOM.posts.forEach((post, index) => {
        post.setAttribute('role', 'article');
        post.setAttribute('tabindex', '0');
        post.setAttribute('data-index', String(index));

        const body = post.querySelector('.community-post-body');
        const preview = getPreviewText(body, 160);

        if (preview) {
            post.setAttribute('aria-label', preview);
        }
    });
}

/* INTERACCIÓN POR TECLADO */

function initKeyboardInteraction() {
    if (!COMMUNITY_DOM.posts || COMMUNITY_DOM.posts.length === 0) return;

    COMMUNITY_DOM.posts.forEach(post => {
        post.addEventListener('keydown', (event) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;

            const primaryLink = post.querySelector('.community-post-footer a, .community-post-body a');
            if (primaryLink) {
                event.preventDefault();
                primaryLink.click();
            }
        });
    });
}

/* ANIMACIONES DE ENTRADA */

function initPostAnimations() {
    if (!COMMUNITY_DOM.posts || COMMUNITY_DOM.posts.length === 0) return;

    if (!('IntersectionObserver' in window)) {
        COMMUNITY_DOM.posts.forEach(post => post.classList.add('community-post--visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('community-post--visible');
            obs.unobserve(entry.target);
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    COMMUNITY_DOM.posts.forEach(post => observer.observe(post));
}

/* CARGA DE JSON */

async function loadCommunityPosts() {
    try {
        const response = await fetch(COMMUNITY_CONFIG.postsUrl, {
            cache: 'no-cache'
        });

        if (!response.ok) {
            if (COMMUNITY_CONFIG.isDebug) {
                console.warn('Community (mobile): no se pudo cargar JSON. Status:', response.status);
            }
            return null;
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            if (COMMUNITY_CONFIG.isDebug) {
                console.warn('Community (mobile): JSON no es un array');
            }
            return null;
        }

        return data;
    } catch (error) {
        if (COMMUNITY_CONFIG.isDebug) {
            console.error('Community (mobile): error al cargar JSON:', error);
        }
        return null;
    }
}

/* INICIALIZACIÓN */

async function initCommunityMobile() {
    if (!COMMUNITY_DOM.feed) return;

    const posts = await loadCommunityPosts();
    if (!posts || posts.length === 0) {
        COMMUNITY_DOM.feed.innerHTML = '';
        return;
    }

    renderCommunityPosts(posts);
    COMMUNITY_DOM.posts = COMMUNITY_DOM.feed.querySelectorAll('.community-post');

    enhanceCommunityAccessibility();
    initKeyboardInteraction();
    initPostAnimations();
    initLazyEmbeds();

    if (COMMUNITY_CONFIG.isDebug) {
        console.log('Community (mobile): inicializada con', COMMUNITY_DOM.posts.length, 'posts');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommunityMobile);
} else {
    initCommunityMobile();
}