// ═══════════════════════════════════════════
// TANDIL TECH WEEK 2026 — Lógica principal
// ═══════════════════════════════════════════

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── Máquina de escribir en el título ─────────
function initTypewriter() {
    const el = $('#typewriter');
    if (!el) return;

    const texto = el.dataset.text || 'Tandil Tech Week';
    const velocidad = 90;   // ms por carácter
    const pausa = 350;      // pausa extra tras espacio

    el.textContent = '';
    let i = 0;

    function escribir() {
        if (i < texto.length) {
            el.textContent += texto[i];
            i++;
            setTimeout(escribir, texto[i - 1] === ' ' ? velocidad + pausa : velocidad);
        }
    }

    escribir();
}

// ── Navegación principal ─────────────────────
function initNavegacion() {
    const botones = $$('.nav-btn');

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (!target) return;

            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActivo(btn);
            cerrarMenu();
            mostrarToast(`→ ${btn.textContent.trim()}`);
        });
    });

    // Marcar activo según scroll
    const secciones = $$('.section[data-location]');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                botones.forEach(b => b.classList.toggle('active', b.dataset.target === id));
            }
        });
    }, { threshold: 0.4 });

    secciones.forEach(sec => observer.observe(sec));
}

function setActivo(btn) {
    $$('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// ── Menú hamburguesa ─────────────────────────
function initHamburgerMenu() {
    const hamburger = $('#nav-toggle');
    const nav = $('.hud-nav');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', () => {
        const abierto = nav.classList.toggle('open');
        hamburger.classList.toggle('active', abierto);
        hamburger.setAttribute('aria-expanded', String(abierto));
    });

    document.addEventListener('click', e => {
        if (!nav.contains(e.target) && !hamburger.contains(e.target)) cerrarMenu();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') cerrarMenu();
    });
}

function cerrarMenu() {
    const nav = $('.hud-nav');
    const hamburger = $('#nav-toggle');
    if (nav) nav.classList.remove('open');
    if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
}

// ── HUD al hacer scroll ──────────────────────
function initHeaderScroll() {
    const hud = $('.hud-top');
    let ultimoScroll = 0;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        hud.classList.toggle('scrolled', y > 40);

        // Auto-ocultar hacia abajo, mostrar hacia arriba
        if (y > 300 && y > ultimoScroll && !$('.hud-nav')?.classList.contains('open')) {
            hud.style.transform = 'translateY(-110%)';
        } else {
            hud.style.transform = 'translateY(0)';
        }
        ultimoScroll = y;
    }, { passive: true });
}

// ── Toggle tema claro/oscuro ─────────────────
function initTema() {
    const toggle = $('#theme-toggle');
    const guardado = localStorage.getItem('ttw-tema');
    if (guardado === 'claro') {
        document.body.classList.add('tema-claro');
        toggle?.setAttribute('aria-pressed', 'true');
    }

    toggle?.addEventListener('click', () => {
        const claro = document.body.classList.toggle('tema-claro');
        toggle.setAttribute('aria-pressed', String(claro));
        localStorage.setItem('ttw-tema', claro ? 'claro' : 'oscuro');
        mostrarToast(claro ? '☀️ Modo día' : '🌙 Modo noche');
    });

    // Atajo de teclado (T)
    document.addEventListener('keydown', e => {
        if (e.key.toLowerCase() === 't' && !e.target.matches('input, textarea')) {
            toggle?.click();
        }
    });
}

// ── Formulario de notificación ───────────────
function initFormulario() {
    const form = $('#notify-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]')?.value;

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            mostrarToast('⚠️ Ingresá un email válido');
            return;
        }

        // Aquí iría el POST real al backend / Formspree
        console.log('Email registrado:', email);
        mostrarToast('✅ ¡Listo! Te avisamos cuando abran las inscripciones');
        form.reset();
    });
}

// ── Fondos con fade + parallax al scrollear ──
function initFondosScroll() {
    const fondos = $$('.fondo-scroll');
    if (!fondos.length) return;

    let ticking = false;

    function actualizar() {
        const vh = window.innerHeight;

        fondos.forEach(fondo => {
            const seccion = fondo.closest('.section');
            if (!seccion) return;
            const rect = seccion.getBoundingClientRect();

            // Cuánto entró la sección al viewport (0 → 1)
            const entra = Math.min(Math.max((vh - rect.top) / (vh * 0.85), 0), 1);
            // Cuánto salió por arriba (0 → 1)
            const sale = Math.min(Math.max(-rect.top / (vh * 0.7), 0), 1);

            let opacidad;
            if (fondo.classList.contains('hero-fondo')) {
                // Hero: visible al cargar, se desvanece al scrollear hacia abajo
                opacidad = 1 - sale;
            } else {
                // Resto: emerge al entrar y se atenúa levemente al salir
                opacidad = entra * (1 - sale * 0.4);
            }

            fondo.style.opacity = opacidad.toFixed(3);
            fondo.style.transform = `translateY(${(sale * 90).toFixed(1)}px)`;
        });

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(actualizar);
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    actualizar();
}

// ── Animaciones reveal al hacer scroll ───────
function initReveal() {
    const base = $$('.section-header, .agenda-card, .org-card, .footer-grid');
    base.forEach(el => el.classList.add('reveal'));

    const elementos = [
        ...base,
        ...$$('.reveal-left, .reveal-right, .reveal-zoom'),
    ];

    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elementos.forEach(el => observer.observe(el));
}

// ── Glow que sigue el cursor ─────────────────
function initCursorGlow() {
    const glow = $('#cursor-glow');
    if (!glow || matchMedia('(hover: none)').matches) return;

    document.addEventListener('mousemove', e => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    }, { passive: true });
}

// ── Toasts ───────────────────────────────────
function mostrarToast(mensaje, duracion = 2600) {
    const contenedor = $('#toast-container');
    if (!contenedor) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = mensaje;
    contenedor.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('leaving');
        toast.addEventListener('animationend', () => toast.remove());
    }, duracion);
}

// ── Inicialización ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏔️ Tandil Tech Week cargado');
    initTypewriter();
    initFondosScroll();
    initNavegacion();
    initHamburgerMenu();
    initHeaderScroll();
    initTema();
    initFormulario();
    initReveal();
    initCursorGlow();
});
