import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100
});

// Floating Particles Logic
function createParticles() {
    const hero = document.querySelector('.se-hero');
    if (!hero) return;
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 8 + 4 + 'px';
        particle.style.width = size;
        particle.style.height = size;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = Math.random() * 10 + 10 + 's';
        hero.appendChild(particle);
    }
}

// Modal Logic
const modal = document.getElementById('retailModal');
const closeBtn = document.querySelector('.close-modal');

function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

if (closeBtn) closeBtn.onclick = closeModal;
window.onclick = (e) => { if (e.target === modal) closeModal(); }
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// CTA Route Logic
document.querySelectorAll('.retail-cta').forEach(btn => {
    btn.onclick = (e) => {
        e.preventDefault();
        openModal();
    }
});

document.querySelectorAll('.wholesale-cta').forEach(btn => {
    btn.onclick = (e) => {
        const targetId = btn.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Sticky CTA Visibility & Auto-Hide logic
const stickyCta = document.getElementById('sticky-cta');
const mainNav = document.getElementById('main-nav');
const ctaSections = document.querySelectorAll('[data-cta-section]');

function handleScrollEffects() {
    if (!mainNav || !stickyCta) return;

    // Header Minimize Logic
    if (window.scrollY > 50) {
        mainNav.classList.add('scrolled');
    } else {
        mainNav.classList.remove('scrolled');
    }

    // Basic scroll threshold for showing the sticky bar
    if (window.scrollY > 400) {
        stickyCta.classList.add('visible');
    } else {
        stickyCta.classList.remove('visible');
    }

    // Intersection logic to hide bar when a CTA section is visible
    let isOverCtaSection = false;
    ctaSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // If section is in viewport (with some buffer)
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > window.innerHeight * 0.2) {
            isOverCtaSection = true;
        }
    });

    if (isOverCtaSection) {
        stickyCta.classList.add('section-hidden');
    } else {
        stickyCta.classList.remove('section-hidden');
    }
}

window.addEventListener('scroll', handleScrollEffects);
window.addEventListener('resize', handleScrollEffects);

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(item => {
    item.setAttribute('aria-expanded', 'false');
    item.addEventListener('click', () => {
        const parent = item.parentElement;
        const isActive = parent.classList.toggle('active');
        item.setAttribute('aria-expanded', String(isActive));
    });
});

// FAQ Tab Logic
const faqTabs = document.querySelectorAll('.faq-tab');
const faqContents = document.querySelectorAll('.faq-tab-content');

faqTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-tab');

        // Update tabs
        faqTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update contents
        faqContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === targetId) {
                content.classList.add('active');
            }
        });

        // Optional: Refresh AOS for new content
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    });
});

// Contact + Wholesale forms and the lang-switch dropdown / floating WhatsApp
// button are handled by src/nav-whatsapp.js, shared with every other page.

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    handleScrollEffects();
    console.log('Sihatree Experience Initialized');
});
