/* ===================================
   OCEAN GRAPH - COMMUNITY PAGE
   community.js
   Genera los posts desde data/community-posts.json

   Tipos soportados:
   - type: "text"      -> imagen opcional (local/remota) + texto
   - type: "instagram" -> embed oficial de Instagram + texto
   - type: "tiktok"    -> embed oficial de TikTok + texto
   =================================== */

'use strict';

/* ===================================
   CONFIGURACIÓN
   =================================== */

const COMMUNITY_CONFIG = {
    isDebug: localStorage.getItem('debug') === 'true',
    postsUrl: 'data/community-posts.json'
};

/* ===================================
   REFERENCIAS AL DOM
   =================================== */

const COMMUNITY_DOM = {
    feed: document.getElementById('community-feed'),
    posts: null
};

/* ===================================
   UTILIDADES
   =================================== */

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

/**
 * Imagen opcional SOLO para posts type: "text"
 * - image: ruta local o URL remota
 * - imageAlt: texto alternativo
 * - imageLink: opcional, si existe la imagen es clicable
 */
function renderImage(post) {
    if (!post.image) return '';

    const imgTag = `
        <img 
            src="${escapeHTML(post.image)}" 
            alt="${escapeHTML(post.imageAlt || '')}" 
            loading="lazy"
        >
    `;

    // Sin link: solo la imagen
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

/* ===================================
   GENERACIÓN DE HTML
   =================================== */

function renderTextPost(post) {
    const variantClass = getVariantClass(post);
    return `
<article class="community-post${variantClass}" data-post-id="${escapeHTML(post.id || '')}">
    <div class="community-post-inner">
        <header class="community-post-header">
            <div class="community-avatar">
                <img 
                    src="${escapeHTML(post.avatar || '')}" 
                    alt="${escapeHTML(post.name || 'Miembro de Ocean Graph')}"
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

function renderInstagramPost(post) {
    const variantClass = getVariantClass(post);
    const url = post.instagramUrl || '';
    return `
<article class="community-post community-post--instagram${variantClass}" data-post-id="${escapeHTML(post.id || '')}">
    <div class="community-post-inner">
        <header class="community-post-header">
            <div class="community-avatar">
                <img 
                    src="${escapeHTML(post.avatar || '')}" 
                    alt="${escapeHTML(post.name || 'Miembro de contenido Ocean Graph')}"
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
            <blockquote
              class="instagram-media"
              data-instgrm-captioned
              data-instgrm-permalink="${escapeHTML(url)}"
              data-instgrm-version="14"
              style="margin:0;"
            >
              <a href="${escapeHTML(url)}"></a>
            </blockquote>

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

function renderTikTokPost(post) {
    const variantClass = getVariantClass(post);
    const url = post.tiktokUrl || '';
    const videoId = post.tiktokId || '';

    // Usamos el primer párrafo como texto de fallback dentro del <section>,
    // TikTok lo reemplaza cuando carga el player, pero ayuda como reserva.
    const previewText = (Array.isArray(post.paragraphs) && post.paragraphs[0])
        ? escapeHTML(post.paragraphs[0])
        : '';

    return `
<article class="community-post community-post--tiktok${variantClass}" data-post-id="${escapeHTML(post.id || '')}">
    <div class="community-post-inner">
        <header class="community-post-header">
            <div class="community-avatar">
                <img 
                    src="${escapeHTML(post.avatar || '')}" 
                    alt="${escapeHTML(post.name || 'Miembro de contenido Ocean Graph')}"
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
            <blockquote
              class="tiktok-embed"
              cite="${escapeHTML(url)}"
              data-video-id="${escapeHTML(videoId)}"
              style="max-width: 605px; min-width: 325px; margin:0;"
            >
                <section>
                    <a 
                        target="_blank"
                        rel="noopener noreferrer"
                        title="${escapeHTML(post.handle || '@oceangraficos')}"
                        href="${escapeHTML('https://www.tiktok.com/' + (post.handle || '@oceangraficos').replace('@', ''))}?refer=embed"
                    >
                        ${escapeHTML(post.handle || '@oceangraficos')}
                    </a>
                    <p>${previewText}</p>
                </section>
            </blockquote>

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
        if (post.type === 'instagram') {
            return renderInstagramPost(post);
        }
        if (post.type === 'tiktok') {
            return renderTikTokPost(post);
        }
        return renderTextPost(post);
    }).join('');

    COMMUNITY_DOM.feed.innerHTML = html;
    COMMUNITY_DOM.posts = COMMUNITY_DOM.feed.querySelectorAll('.community-post');

    // Procesar embeds de Instagram
    if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === 'function') {
        window.instgrm.Embeds.process();
    }

    // Procesar embeds de TikTok
    if (window.tiktokEmbed && typeof window.tiktokEmbed.load === 'function') {
        window.tiktokEmbed.load();
    }
}

/* ===================================
   ACCESIBILIDAD
   =================================== */

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

    if (COMMUNITY_CONFIG.isDebug) {
        console.log('Community: accesibilidad mejorada para', COMMUNITY_DOM.posts.length, 'posts');
    }
}

function markPinnedPosts() {
    if (!COMMUNITY_DOM.posts) return;

    const pinnedPosts = Array.from(COMMUNITY_DOM.posts).filter(post => {
        const tags = post.querySelectorAll('.community-tag');
        return Array.from(tags).some(tag => tag.textContent.trim().toLowerCase() === 'fijado');
    });

    pinnedPosts.forEach(post => {
        post.dataset.pinned = 'true';
    });

    if (COMMUNITY_CONFIG.isDebug && pinnedPosts.length > 0) {
        console.log('Community: posts fijados detectados:', pinnedPosts.length);
    }
}

/* ===================================
   INTERACCIÓN POR TECLADO
   =================================== */

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

    if (COMMUNITY_CONFIG.isDebug) {
        console.log('Community: interacción de teclado inicializada');
    }
}

/* ===================================
   ANIMACIONES DE ENTRADA (FADE/SLIDE)
   =================================== */

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

/* ===================================
   CARGA DE community-posts.json
   =================================== */

async function loadCommunityPosts() {
    try {
        const response = await fetch(COMMUNITY_CONFIG.postsUrl, {
            cache: 'no-cache'
        });

        if (!response.ok) {
            if (COMMUNITY_CONFIG.isDebug) {
                console.warn('Community: no se pudo cargar community-posts.json. Status:', response.status);
            }
            return null;
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            if (COMMUNITY_CONFIG.isDebug) {
                console.warn('Community: community-posts.json no es un array');
            }
            return null;
        }

        if (COMMUNITY_CONFIG.isDebug) {
            console.log('Community: community-posts.json cargado:', data);
        }

        return data;
    } catch (error) {
        if (COMMUNITY_CONFIG.isDebug) {
            console.error('Community: error al cargar community-posts.json:', error);
        }
        return null;
    }
}

/* ===================================
   INICIALIZACIÓN
   =================================== */

async function initCommunity() {
    if (!COMMUNITY_DOM.feed) {
        if (COMMUNITY_CONFIG.isDebug) {
            console.log('Community: no se encontró #community-feed, no se inicializa');
        }
        return;
    }

    const posts = await loadCommunityPosts();
    if (!posts || posts.length === 0) {
        COMMUNITY_DOM.feed.innerHTML = '';
        if (COMMUNITY_CONFIG.isDebug) {
            console.log('Community: no hay posts que mostrar');
        }
        return;
    }

    renderCommunityPosts(posts);
    COMMUNITY_DOM.posts = COMMUNITY_DOM.feed.querySelectorAll('.community-post');

    enhanceCommunityAccessibility();
    markPinnedPosts();
    initKeyboardInteraction();
    initPostAnimations();

    if (COMMUNITY_CONFIG.isDebug) {
        console.log('Community: página inicializada correctamente con', COMMUNITY_DOM.posts.length, 'posts');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommunity);
} else {
    initCommunity();
}

/* ===================================
   EXPORTAR PARA DEBUG (OPCIONAL)
   =================================== */

if (COMMUNITY_CONFIG.isDebug) {
    window.OceanCommunity = {
        config: COMMUNITY_CONFIG,
        dom: COMMUNITY_DOM,
        init: initCommunity,
        loadCommunityPosts,
        renderCommunityPosts
    };
    console.log('Community: objeto window.OceanCommunity disponible para debugging');
}