// Script principal de la página web

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página cargada correctamente');
    
    // Inicializar funcionalidades
    initHamburgerMenu();
    initHeaderScroll();
    initSaludo();
    initFormulario();
    initSmoothScroll();
    initAnimaciones();
});

// Menú hamburguesa
function initHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Actualizar aria-expanded
            const isExpanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });
        
        // Cerrar menú al hacer clic en un enlace
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Header al hacer scroll
function initHeaderScroll() {
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Función para el botón de saludo
function initSaludo() {
    const btnSaludar = document.getElementById('btn-saludar');
    
    if (btnSaludar) {
        btnSaludar.addEventListener('click', () => {
            const nombre = prompt('¿Cuál es tu nombre?');
            if (nombre) {
                alert(`¡Hola, ${nombre}! Bienvenido a mi página web.`);
            }
        });
    }
}

// Función para manejar el formulario de contacto
function initFormulario() {
    const formulario = document.getElementById('form-contacto');
    
    if (formulario) {
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = new FormData(formulario);
            const datos = Object.fromEntries(formData.entries());
            
            // Validación básica
            if (!datos.nombre || !datos.email || !datos.mensaje) {
                alert('Por favor, completa todos los campos.');
                return;
            }
            
            // Validación de email simple
            if (!validarEmail(datos.email)) {
                alert('Por favor, ingresa un email válido.');
                return;
            }
            
            // Simular envío
            console.log('Datos del formulario:', datos);
            alert('¡Mensaje enviado correctamente! Te contactaremos pronto.');
            
            // Limpiar formulario
            formulario.reset();
        });
    }
}

// Validación simple de email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Scroll suave para enlaces de anclaje
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animaciones al hacer scroll
function initAnimaciones() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Elementos a animar
    const elementosAnimados = document.querySelectorAll('.servicio, .seccion h2');
    
    elementosAnimados.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Función utilitaria para mostrar/ocultar elementos
function toggleElemento(selector, mostrar = true) {
    const elemento = document.querySelector(selector);
    if (elemento) {
        elemento.style.display = mostrar ? 'block' : 'none';
    }
}

// Función para cambiar tema (claro/oscuro) - opcional
function toggleTema() {
    document.body.classList.toggle('tema-oscuro');
    localStorage.setItem('tema', document.body.classList.contains('tema-oscuro') ? 'oscuro' : 'claro');
}

// Cargar tema guardado al iniciar
function cargarTemaGuardado() {
    const temaGuardado = localStorage.getItem('tema');
    if (temaGuardado === 'oscuro') {
        document.body.classList.add('tema-oscuro');
    }
}

// Llamar al cargar la página
cargarTemaGuardado();