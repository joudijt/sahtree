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

// Wholesale Form + Confetti
const form = document.getElementById('wholesaleForm');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Sending...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerText = 'Thanks — our team will be in touch soon.';
            btn.style.background = '#7FBC3B';

            // "Brand Shape" Confetti Burst
            createConfetti();

            form.reset();
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 5000);
        }, 1500);
    });
}

function createConfetti() {
    const colors = ['#7FBC3B', '#F9AB40', '#BA347E', '#C8343C', '#2D294E'];
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '12px';
        confetti.style.height = '12px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = '50%';
        confetti.style.top = '50%';
        confetti.style.zIndex = '3000';
        confetti.style.borderRadius = i % 2 === 0 ? '50%' : '2px';
        confetti.style.pointerEvents = 'none';

        const destinationX = (Math.random() - 0.5) * 400;
        const destinationY = (Math.random() - 0.5) * 400;

        document.body.appendChild(confetti);

        confetti.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${destinationX}px, ${destinationY}px) scale(0)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)',
            fill: 'forwards'
        }).onfinish = () => confetti.remove();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    handleScrollEffects();
    console.log('Sihatree Experience Initialized');
});
