/* ===================================
   OCEAN GRAPH - COMMUNITY PAGE (MÓVIL)
   mobile/community.js
   Genera los posts desde ../data/community-posts.json
   Soporta:
   - type: "text"      -> imagen opcional + texto
   - type: "instagram" -> embed oficial + texto
   - type: "tiktok"    -> embed oficial + texto
   =================================== */

'use strict';

/* CONFIGURACIÓN */

const COMMUNITY_CONFIG = {
    isDebug: localStorage.getItem('debug') === 'true',
    postsUrl: '../data/community-posts.json'
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

    const imgTag = `
        <img 
            src="${escapeHTML(post.image)}" 
            alt="${escapeHTML(post.imageAlt || '')}" 
            loading="lazy"
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

    // Procesar embeds externos
    if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === 'function') {
        window.instgrm.Embeds.process();
    }
    if (window.tiktokEmbed && typeof window.tiktokEmbed.load === 'function') {
        window.tiktokEmbed.load();
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

    if (COMMUNITY_CONFIG.isDebug) {
        console.log('Community (mobile): accesibilidad mejorada para', COMMUNITY_DOM.posts.length, 'posts');
    }
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

    if (COMMUNITY_CONFIG.isDebug) {
        console.log('Community (mobile): interacción de teclado inicializada');
    }
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

        if (COMMUNITY_CONFIG.isDebug) {
            console.log('Community (mobile): JSON cargado:', data);
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
    if (!COMMUNITY_DOM.feed) {
        if (COMMUNITY_CONFIG.isDebug) {
            console.log('Community (mobile): no se encontró #community-feed');
        }
        return;
    }

    const posts = await loadCommunityPosts();
    if (!posts || posts.length === 0) {
        COMMUNITY_DOM.feed.innerHTML = '';
        if (COMMUNITY_CONFIG.isDebug) {
            console.log('Community (mobile): no hay posts que mostrar');
        }
        return;
    }

    renderCommunityPosts(posts);
    COMMUNITY_DOM.posts = COMMUNITY_DOM.feed.querySelectorAll('.community-post');

    enhanceCommunityAccessibility();
    initKeyboardInteraction();
    initPostAnimations();

    if (COMMUNITY_CONFIG.isDebug) {
        console.log('Community (mobile): inicializada con', COMMUNITY_DOM.posts.length, 'posts');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommunityMobile);
} else {
    initCommunityMobile();
}