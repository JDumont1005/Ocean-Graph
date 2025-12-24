/* ===================================
   OCEAN GRAPH - PORTFOLIO PAGE JS
   JavaScript para InPortafolio.html
   Sin emojis para evitar errores
   =================================== */

'use strict';

/* ===================================
   CONFIGURACION
   =================================== */

const PORTFOLIO_CONFIG = {
    animationDuration: 300,
    scrollOffset: 100,
    isDebug: localStorage.getItem('debug') === 'true'
};

/* ===================================
   DOM ELEMENTS
   =================================== */

const PORTFOLIO_DOM = {
    filterButtons: document.querySelectorAll('.filter-btn'),
    projects: document.querySelectorAll('.portfolio-project'),
    noResults: document.getElementById('no-results'),
    modal: document.getElementById('project-modal'),
    modalOverlay: document.getElementById('modal-overlay'),
    modalClose: document.getElementById('modal-close'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalCategory: document.getElementById('modal-category'),
    modalTitle: document.getElementById('modal-title'),
    modalDescription: document.getElementById('modal-description'),
    modalClient: document.getElementById('modal-client'),
    modalDate: document.getElementById('modal-date'),
    modalServices: document.getElementById('modal-services'),
    viewButtons: document.querySelectorAll('.project-view-btn'),
    featuredVideo: document.querySelector('.portfolio-featured-video'),
    videoSection: document.querySelector('.portfolio-video-section')
};

/* ===================================
   DATOS DE PROYECTOS
   =================================== */

const PROJECT_DATA = {
    1: {
        category: 'Diseño Gráfico',
        title: 'Identidad Corporativa Premium',
        description: 'Desarrollo completo de identidad visual para marca de lujo, incluyendo logotipo, paleta de colores, tipografía corporativa y manual de marca. El proyecto abarcó desde la conceptualización inicial hasta la implementación en todos los puntos de contacto con el cliente.',
        client: 'Luxury Brands Inc.',
        date: 'Marzo 2024',
        services: 'Branding, Diseño de Logo, Manual de Marca'
    },
    2: {
        category: 'Fotografía',
        title: 'Sesión Producto Gourmet',
        description: 'Fotografía profesional de productos alimenticios premium para catálogo digital y redes sociales. Sesión realizada en estudio con iluminación controlada, enfocada en resaltar texturas y colores naturales de cada producto.',
        client: 'Gourmet Delights',
        date: 'Febrero 2024',
        services: 'Fotografía de Producto, Edición, Retoque Digital'
    },
    3: {
        category: 'Video',
        title: 'Campaña Publicitaria Digital',
        description: 'Producción de video comercial de 30 segundos optimizado para redes sociales (Instagram, Facebook, TikTok). Incluye conceptualización, storyboard, filmación, edición y post-producción con motion graphics.',
        client: 'Urban Fashion Co.',
        date: 'Enero 2024',
        services: 'Producción Audiovisual, Motion Graphics, Edición'
    },
    4: {
        category: 'Videografía',
        title: 'Cobertura Evento Corporativo',
        description: 'Documentación completa de evento empresarial de 2 días, incluyendo conferencias, actividades de networking y ceremonias. Entrega de video resumen de 5 minutos y material completo sin editar para archivo.',
        client: 'Tech Summit 2024',
        date: 'Abril 2024',
        services: 'Videografía Multi-cámara, Edición, Color Grading'
    },
    5: {
        category: 'Social Media',
        title: 'Estrategia Instagram Boutique',
        description: 'Gestión completa de redes sociales durante 6 meses, logrando crecimiento orgánico de 300% en seguidores. Incluye creación de contenido, calendario editorial, community management y análisis de métricas.',
        client: 'Bella Boutique',
        date: 'Octubre 2023 - Marzo 2024',
        services: 'Community Management, Creación de Contenido, Estrategia Digital'
    },
    6: {
        category: 'Branding',
        title: 'Rebranding Tech Startup',
        description: 'Transformación completa de imagen de marca para startup tecnológica en crecimiento. Nuevo posicionamiento, identidad visual moderna y sistema de comunicación coherente en todos los canales.',
        client: 'InnovateTech',
        date: 'Diciembre 2023',
        services: 'Estrategia de Marca, Diseño, Comunicación Corporativa'
    },
    7: {
        category: 'Diseño Gráfico',
        title: 'Material POP Campaña Verano',
        description: 'Diseño de material promocional punto de venta para campaña estacional: banners, displays, señalética y material impreso. Concepto fresco y juvenil alineado con la identidad de marca.',
        client: 'Summer Vibes Store',
        date: 'Mayo 2024',
        services: 'Diseño Gráfico, Material Impreso, Señalética'
    },
    8: {
        category: 'Fotografía',
        title: 'Retrato Corporativo Ejecutivo',
        description: 'Sesión fotográfica profesional para equipo directivo de empresa multinacional. Retratos individuales y grupales en ambiente corporativo, con iluminación profesional y edición de alta calidad.',
        client: 'Global Corp International',
        date: 'Marzo 2024',
        services: 'Fotografía Corporativa, Retrato Profesional, Edición'
    },
    9: {
        category: 'Video',
        title: 'Video Institucional ONG',
        description: 'Documental breve de 8 minutos sobre organización sin fines de lucro, mostrando su impacto social y actividades. Incluye entrevistas, grabación de campo y narrativa emotiva.',
        client: 'Fundación Esperanza',
        date: 'Febrero 2024',
        services: 'Documental, Entrevistas, Edición Narrativa'
    }
};

/* ===================================
   ESTADO DE LA APLICACION
   =================================== */

let currentFilter = 'all';
let currentProjectId = null;

/* ===================================
   SISTEMA DE FILTRADO
   =================================== */

function filterProjects(category) {
    if (PORTFOLIO_CONFIG.isDebug) {
        console.log('Filtrando por categoria:', category);
    }

    currentFilter = category;
    let visibleCount = 0;

    PORTFOLIO_DOM.projects.forEach(project => {
        const projectCategory = project.getAttribute('data-category');
        const shouldShow = category === 'all' || projectCategory === category;

        if (shouldShow) {
            project.classList.remove('filtering-out');
            project.classList.add('filtering-in');
            
            setTimeout(() => {
                project.classList.remove('hidden');
                project.classList.remove('filtering-in');
            }, PORTFOLIO_CONFIG.animationDuration);
            
            visibleCount++;
        } else {
            project.classList.add('filtering-out');
            
            setTimeout(() => {
                project.classList.add('hidden');
                project.classList.remove('filtering-out');
            }, PORTFOLIO_CONFIG.animationDuration);
        }
    });

    if (PORTFOLIO_DOM.noResults) {
        if (visibleCount === 0) {
            PORTFOLIO_DOM.noResults.style.display = 'block';
        } else {
            PORTFOLIO_DOM.noResults.style.display = 'none';
        }
    }

    updateFilterButtons(category);
}

/* ===================================
   ACTUALIZAR BOTONES DE FILTRO
   =================================== */

function updateFilterButtons(activeCategory) {
    PORTFOLIO_DOM.filterButtons.forEach(button => {
        const buttonCategory = button.getAttribute('data-filter');
        
        if (buttonCategory === activeCategory) {
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
        } else {
            button.classList.remove('active');
            button.setAttribute('aria-selected', 'false');
        }
    });
}

/* ===================================
   INICIALIZAR FILTROS
   =================================== */

function initFilters() {
    PORTFOLIO_DOM.filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-filter');
            filterProjects(category);
            
            if (window.innerWidth <= 768) {
                button.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        });
    });

    if (PORTFOLIO_CONFIG.isDebug) {
        console.log('Filtros inicializados:', PORTFOLIO_DOM.filterButtons.length);
    }
}

/* ===================================
   ABRIR MODAL
   =================================== */

function openModal(projectId) {
    const projectData = PROJECT_DATA[projectId];
    
    if (!projectData) {
        console.error('Proyecto no encontrado:', projectId);
        return;
    }

    currentProjectId = projectId;

    if (PORTFOLIO_DOM.modalCategory) {
        PORTFOLIO_DOM.modalCategory.textContent = projectData.category;
    }
    
    if (PORTFOLIO_DOM.modalTitle) {
        PORTFOLIO_DOM.modalTitle.textContent = projectData.title;
    }
    
    if (PORTFOLIO_DOM.modalDescription) {
        PORTFOLIO_DOM.modalDescription.textContent = projectData.description;
    }
    
    if (PORTFOLIO_DOM.modalClient) {
        PORTFOLIO_DOM.modalClient.textContent = projectData.client;
    }
    
    if (PORTFOLIO_DOM.modalDate) {
        PORTFOLIO_DOM.modalDate.textContent = projectData.date;
    }
    
    if (PORTFOLIO_DOM.modalServices) {
        PORTFOLIO_DOM.modalServices.textContent = projectData.services;
    }

    if (PORTFOLIO_DOM.modal) {
        PORTFOLIO_DOM.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        PORTFOLIO_DOM.modal.setAttribute('aria-hidden', 'false');
        
        if (PORTFOLIO_DOM.modalClose) {
            PORTFOLIO_DOM.modalClose.focus();
        }
    }

    pauseFeaturedVideo();

    if (PORTFOLIO_CONFIG.isDebug) {
        console.log('Modal abierto para proyecto:', projectId, projectData.title);
    }
}

/* ===================================
   CERRAR MODAL
   =================================== */

function closeModal() {
    if (PORTFOLIO_DOM.modal) {
        PORTFOLIO_DOM.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        PORTFOLIO_DOM.modal.setAttribute('aria-hidden', 'true');
        
        currentProjectId = null;
    }

    if (PORTFOLIO_CONFIG.isDebug) {
        console.log('Modal cerrado');
    }
}

/* ===================================
   INICIALIZAR MODAL
   =================================== */

function initModal() {
    PORTFOLIO_DOM.viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const projectCard = button.closest('.portfolio-project');
            if (projectCard) {
                const projectId = parseInt(projectCard.getAttribute('data-id'));
                openModal(projectId);
            }
        });
    });

    if (PORTFOLIO_DOM.modalClose) {
        PORTFOLIO_DOM.modalClose.addEventListener('click', closeModal);
    }

    if (PORTFOLIO_DOM.modalCloseBtn) {
        PORTFOLIO_DOM.modalCloseBtn.addEventListener('click', closeModal);
    }

    if (PORTFOLIO_DOM.modalOverlay) {
        PORTFOLIO_DOM.modalOverlay.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && PORTFOLIO_DOM.modal?.classList.contains('active')) {
            closeModal();
        }
    });

    if (PORTFOLIO_CONFIG.isDebug) {
        console.log('Modal inicializado');
    }
}

/* ===================================
   NAVEGACION CON TECLADO EN FILTROS
   =================================== */

function initKeyboardNavigation() {
    const filterContainer = document.querySelector('.portfolio-filters');
    
    if (!filterContainer) return;

    filterContainer.addEventListener('keydown', (e) => {
        const buttons = Array.from(PORTFOLIO_DOM.filterButtons);
        const currentIndex = buttons.indexOf(document.activeElement);
        
        if (currentIndex === -1) return;

        let nextIndex;

        switch(e.key) {
            case 'ArrowRight':
                e.preventDefault();
                nextIndex = (currentIndex + 1) % buttons.length;
                buttons[nextIndex].focus();
                break;
            
            case 'ArrowLeft':
                e.preventDefault();
                nextIndex = currentIndex - 1;
                if (nextIndex < 0) nextIndex = buttons.length - 1;
                buttons[nextIndex].focus();
                break;
            
            case 'Home':
                e.preventDefault();
                buttons[0].focus();
                break;
            
            case 'End':
                e.preventDefault();
                buttons[buttons.length - 1].focus();
                break;
        }
    });

    if (PORTFOLIO_CONFIG.isDebug) {
        console.log('Navegacion por teclado inicializada');
    }
}

/* ===================================
   ANIMACION FADE-IN AL SCROLL
   =================================== */

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 50);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    PORTFOLIO_DOM.projects.forEach(project => {
        project.style.opacity = '0';
        project.style.transform = 'translateY(30px)';
        project.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(project);
    });

    if (PORTFOLIO_CONFIG.isDebug) {
        console.log('Animaciones de scroll inicializadas');
    }
}

/* ===================================
   DETECCION DE DISPOSITIVO
   =================================== */

const DEVICE_INFO = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isTablet: /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768,
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0
};

/* ===================================
   OPTIMIZACIONES PARA MOVIL
   =================================== */

function initMobileOptimizations() {
    if (DEVICE_INFO.isMobile || DEVICE_INFO.isTablet) {
        document.body.classList.add('is-mobile-portfolio');
        
        const filterSection = document.querySelector('.portfolio-filters-section');
        if (filterSection) {
            filterSection.style.position = 'relative';
            filterSection.style.top = '0';
        }
        
        if (PORTFOLIO_CONFIG.isDebug) {
            console.log('Optimizaciones movil aplicadas');
        }
    }
}

/* ===================================
   SMOOTH SCROLL PARA BREADCRUMB
   =================================== */

function initSmoothScroll() {
    const breadcrumbLinks = document.querySelectorAll('.breadcrumb a');
    
    breadcrumbLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href.includes('#')) {
                e.preventDefault();
                const targetId = href.split('#')[1];
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                    const targetPosition = targetElement.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/* ===================================
   PREVENIR SCROLL DEL BODY EN MODAL
   =================================== */

function preventBodyScroll() {
    const modalContent = document.querySelector('.modal-content');
    
    if (!modalContent) return;

    let isScrolling = false;

    modalContent.addEventListener('touchstart', () => {
        isScrolling = false;
    });

    modalContent.addEventListener('touchmove', () => {
        isScrolling = true;
    });

    modalContent.addEventListener('touchend', (e) => {
        if (!isScrolling) {
            e.preventDefault();
        }
    });
}

/* ===================================
   CONTADOR DE PROYECTOS VISIBLES
   =================================== */

function updateProjectCount() {
    const visibleProjects = Array.from(PORTFOLIO_DOM.projects).filter(
        project => !project.classList.contains('hidden')
    );
    
    if (PORTFOLIO_CONFIG.isDebug) {
        console.log('Proyectos visibles:', visibleProjects.length);
    }
    
    return visibleProjects.length;
}

/* ===================================
   LAZY LOADING DE IMAGENES
   =================================== */

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                
                if (src) {
                    img.setAttribute('src', src);
                    img.removeAttribute('data-src');
                }
                
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    if (PORTFOLIO_CONFIG.isDebug && images.length > 0) {
        console.log('Lazy loading inicializado para', images.length, 'imagenes');
    }
}

/* ===================================
   MANEJO DE ORIENTACION
   =================================== */

function handleOrientationChange() {
    if (DEVICE_INFO.isMobile || DEVICE_INFO.isTablet) {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (PORTFOLIO_DOM.modal?.classList.contains('active')) {
                    closeModal();
                }
                
                pauseFeaturedVideo();
                
                if (PORTFOLIO_CONFIG.isDebug) {
                    console.log('Orientacion cambiada');
                }
            }, 100);
        });
    }
}

/* ===================================
   CONTROL DE VIDEO DESTACADO
   =================================== */

function pauseFeaturedVideo() {
    if (!PORTFOLIO_DOM.featuredVideo) return;

    const isYouTube = PORTFOLIO_DOM.featuredVideo.tagName === 'IFRAME';
    
    if (isYouTube) {
        const iframeSrc = PORTFOLIO_DOM.featuredVideo.src;
        PORTFOLIO_DOM.featuredVideo.src = iframeSrc;
        
        if (PORTFOLIO_CONFIG.isDebug) {
            console.log('Video de YouTube reiniciado');
        }
    } else {
        if (typeof PORTFOLIO_DOM.featuredVideo.pause === 'function') {
            PORTFOLIO_DOM.featuredVideo.pause();
            
            if (PORTFOLIO_CONFIG.isDebug) {
                console.log('Video pausado');
            }
        }
    }
}

function initFeaturedVideo() {
    if (!PORTFOLIO_DOM.featuredVideo) {
        if (PORTFOLIO_CONFIG.isDebug) {
            console.log('No hay video destacado en la pagina');
        }
        return;
    }

    const isYouTube = PORTFOLIO_DOM.featuredVideo.tagName === 'IFRAME';

    if (!isYouTube && PORTFOLIO_DOM.featuredVideo.tagName === 'VIDEO') {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && !PORTFOLIO_DOM.featuredVideo.paused) {
                    PORTFOLIO_DOM.featuredVideo.pause();
                }
            });
        }, { threshold: 0.25 });

        videoObserver.observe(PORTFOLIO_DOM.featuredVideo);

        document.addEventListener('visibilitychange', () => {
            if (document.hidden && !PORTFOLIO_DOM.featuredVideo.paused) {
                PORTFOLIO_DOM.featuredVideo.pause();
            }
        });
    }

    if (PORTFOLIO_CONFIG.isDebug) {
        console.log('Video destacado inicializado (Tipo: ' + (isYouTube ? 'YouTube' : 'HTML5') + ')');
    }
}

/* ===================================
   ANALYTICS TRACKING (PLACEHOLDER)
   =================================== */

function trackEvent(eventName, eventData) {
    if (PORTFOLIO_CONFIG.isDebug) {
        console.log('Event tracked:', eventName, eventData);
    }
}

/* ===================================
   COMPARTIR PROYECTO (FUTURO)
   =================================== */

function shareProject(projectId) {
    const projectData = PROJECT_DATA[projectId];
    
    if (!projectData) return;

    const shareData = {
        title: projectData.title,
        text: projectData.description,
        url: window.location.href + '?project=' + projectId
    };

    if (navigator.share) {
        navigator.share(shareData)
            .then(() => {
                if (PORTFOLIO_CONFIG.isDebug) {
                    console.log('Proyecto compartido exitosamente');
                }
                trackEvent('share_project', { project_id: projectId });
            })
            .catch(err => {
                console.error('Error al compartir:', err);
            });
    } else {
        if (PORTFOLIO_CONFIG.isDebug) {
            console.log('Web Share API no disponible');
        }
    }
}

/* ===================================
   INICIALIZACION DE URL PARAMS
   =================================== */

function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    const category = urlParams.get('category');
    
    if (projectId && PROJECT_DATA[projectId]) {
        setTimeout(() => {
            openModal(parseInt(projectId));
        }, 500);
    }
    
    if (category && category !== 'all') {
        setTimeout(() => {
            filterProjects(category);
        }, 300);
    }

    if (PORTFOLIO_CONFIG.isDebug && (projectId || category)) {
        console.log('Parametros URL detectados - project:', projectId, 'category:', category);
    }
}

/* ===================================
   DEBUGGING HELPERS
   =================================== */

function enableDebugMode() {
    window.PortfolioDebug = {
        filterProjects,
        openModal,
        closeModal,
        updateProjectCount,
        shareProject,
        pauseFeaturedVideo,
        PROJECT_DATA,
        PORTFOLIO_DOM,
        currentFilter,
        currentProjectId
    };
    
    console.log('Portfolio Debug Mode habilitado');
    console.log('Accede a window.PortfolioDebug para debugging');
}

/* ===================================
   INICIALIZACION PRINCIPAL
   =================================== */

function initPortfolio() {
    console.log('Inicializando Portfolio Page...');
    
    initFilters();
    initModal();
    initKeyboardNavigation();
    initScrollAnimations();
    initMobileOptimizations();
    initSmoothScroll();
    preventBodyScroll();
    initLazyLoading();
    handleOrientationChange();
    checkURLParams();
    initFeaturedVideo();
    
    if (PORTFOLIO_CONFIG.isDebug) {
        enableDebugMode();
    }
    
    console.log('Portfolio Page inicializado correctamente');
}

/* ===================================
   VERIFICAR QUE ESTAMOS EN PORTFOLIO
   =================================== */

if (window.location.pathname.includes('InPortafolio') || 
    document.querySelector('.portfolio-hero')) {
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPortfolio);
    } else {
        initPortfolio();
    }
} else {
    if (PORTFOLIO_CONFIG.isDebug) {
        console.log('Portfolio.js cargado pero no estamos en pagina de portfolio');
    }
}

/* ===================================
   EXPORTAR FUNCIONES (OPCIONAL)
   =================================== */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        filterProjects,
        openModal,
        closeModal,
        PROJECT_DATA
    };
}