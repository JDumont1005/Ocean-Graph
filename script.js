/* ===================================
   OCEAN GRAPH - PORTFOLIO MARKETING
   =================================== */

console.log('%c Ocean Graph ', 'background: #009dff; color: #141414; padding: 5px 10px; font-weight: bold; border-radius: 8px;');
console.log('Portfolio de Marketing Digital cargado');

/* ===================================
   NAVBAR - SCROLL EFFECT
   =================================== */

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

/* ===================================
   MENÚ HAMBURGUESA (MÓVIL)
   =================================== */

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

/* ===================================
   NAVEGACIÓN ACTIVA AL SCROLL
   =================================== */

const sections = document.querySelectorAll('section, .hero');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

/* ===================================
   ANIMACIÓN DE ESTADÍSTICAS
   =================================== */

const statNumbers = document.querySelectorAll('.stat-number');

const animateStats = () => {
    statNumbers.forEach(stat => {
        const target = stat.textContent;
        const number = parseInt(target);
        
        if (!isNaN(number)) {
            let current = 0;
            const increment = number / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + (target.includes('+') ? '+' : '');
                }
            }, 30);
        }
    });
};

// Observador para animar cuando sea visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const aboutSection = document.querySelector('.about-section');
if (aboutSection) {
    statsObserver.observe(aboutSection);
}

/* ===================================
   HOVER EFFECT EN PORTFOLIO
   =================================== */

const portfolioItems = document.querySelectorAll('.portfolio-item');

portfolioItems.forEach(item => {
    item.addEventListener('click', function() {
        const category = this.querySelector('.portfolio-category').textContent;
        console.log(`Ver proyecto: ${category}`);
        // Aquí puedes agregar modal o navegación
    });
});

/* ===================================
   SMOOTH SCROLL MEJORADO
   =================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

/* ===================================
   CARGA COMPLETA
   =================================== */

window.addEventListener('load', function() {
    console.log('✓ Portfolio completamente cargado');
    
    // Pequeña animación de entrada
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});