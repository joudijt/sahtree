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
    const hero = document.querySelector('.hero');
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

// Hero button hover feedback
const heroSection = document.querySelector('.hero');
const heroActionButtons = document.querySelectorAll('.hero-action-btn');

heroActionButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        const hoverState = button.dataset.heroHover;
        heroSection?.classList.remove('hero-hover-retail', 'hero-hover-wholesale');
        if (hoverState) {
            heroSection?.classList.add(`hero-hover-${hoverState}`);
        }
    });

    button.addEventListener('mouseleave', () => {
        heroSection?.classList.remove('hero-hover-retail', 'hero-hover-wholesale');
    });
});

// Why Section Product Slider
let whyIndex = 0;
const whyWrappers = document.querySelectorAll('.why-img-wrapper');

function startWhySlider() {
    if (whyWrappers.length === 0) return;

    setInterval(() => {
        // Current one goes out
        whyWrappers[whyIndex].classList.remove('active');

        // Move to next
        whyIndex = (whyIndex + 1) % whyWrappers.length;

        // Generate random rotation between -25 and +25
        const randomRotate = Math.floor(Math.random() * 51) - 25;
        whyWrappers[whyIndex].style.setProperty('--random-rotate', `${randomRotate}deg`);

        // Next one comes in
        whyWrappers[whyIndex].classList.add('active');
    }, 5000);
}

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

// Mobile Benefits Carousel logic
let benefitsIndex = 0;
const benefitsGrid = document.querySelector('.benefits-grid');
const benefitItems = document.querySelectorAll('.benefit-item');

function startBenefitsCarousel() {
    if (!benefitsGrid || benefitItems.length === 0) return;

    // Only run on mobile (using the same breakpoint as CSS)
    setInterval(() => {
        if (window.innerWidth <= 968) {
            benefitsIndex = (benefitsIndex + 1) % benefitItems.length;
            const offset = -benefitsIndex * 100;
            benefitItems.forEach(item => {
                item.style.transform = `translateX(${offset}%)`;
            });
        } else {
            // Reset transforms if resized to desktop
            benefitItems.forEach(item => {
                item.style.transform = 'none';
            });
        }
    }, 4000); // 4 seconds per slide
}

// Product Range Carousel
const productCarousel = document.getElementById('productCarousel');
const productPrev = document.getElementById('productPrev');
const productNext = document.getElementById('productNext');
let productCarouselTimer;
let productCarouselIndex = 0;
let productCarouselOriginalCount = 0;
let productCarouselStep = 0;

function startProductCarousel() {
    if (!productCarousel || productCarousel.children.length === 0) return;

    if (!productCarousel.dataset.cloned) {
        const originalCards = Array.from(productCarousel.children);
        productCarouselOriginalCount = originalCards.length;
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true');
            clone.removeAttribute('data-aos');
            productCarousel.appendChild(clone);
        });
        productCarousel.dataset.cloned = 'true';
    }

    const getStep = () => {
        const firstCard = productCarousel.querySelector('.product-card');
        if (!firstCard) return 0;
        const styles = getComputedStyle(productCarousel);
        const gap = parseFloat(styles.columnGap || styles.gap || 0) || 0;
        return firstCard.getBoundingClientRect().width + gap;
    };

    const scrollProductCarousel = (direction = 1, behavior = 'smooth') => {
        productCarouselStep = getStep();
        if (!productCarouselStep) return;

        productCarouselIndex += direction;
        if (productCarouselIndex < 0) {
            productCarouselIndex = Math.max(productCarouselOriginalCount - 1, 0);
            productCarousel.scrollTo({
                left: productCarouselOriginalCount * productCarouselStep,
                behavior: 'auto'
            });
        }

        productCarousel.scrollTo({
            left: productCarouselIndex * productCarouselStep,
            behavior
        });

        if (productCarouselIndex >= productCarouselOriginalCount) {
            window.setTimeout(() => {
                productCarouselIndex = 0;
                productCarousel.scrollTo({ left: 0, behavior: 'auto' });
            }, 700);
        }
    };

    clearInterval(productCarouselTimer);
    productCarouselTimer = setInterval(() => {
        scrollProductCarousel(1);
    }, 4000);

    if (!productCarousel.dataset.listeners) {
        productCarousel.addEventListener('mouseenter', () => clearInterval(productCarouselTimer));
        productCarousel.addEventListener('mouseleave', startProductCarousel);
        productCarousel.addEventListener('scroll', () => {
            const step = getStep();
            if (!step) return;
            productCarouselIndex = Math.round(productCarousel.scrollLeft / step) % productCarouselOriginalCount;
        });
        productPrev?.addEventListener('click', () => {
            clearInterval(productCarouselTimer);
            scrollProductCarousel(-1);
            startProductCarousel();
        });
        productNext?.addEventListener('click', () => {
            clearInterval(productCarouselTimer);
            scrollProductCarousel(1);
            startProductCarousel();
        });
        productCarousel.dataset.listeners = 'true';
    }
}

// Scroll-controlled Arabic Gum story
function startGumTransition() {
    const section = document.querySelector('.gum-transition');
    const layout = document.querySelector('.gum-layout');
    const product = document.querySelector('.gum-product');
    if (!section || !layout || !product) return;

    const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const smoothstep = value => {
        const x = clamp(value);
        return x * x * (3 - 2 * x);
    };
    const range = (start, end, value) => clamp((value - start) / (end - start));
    const mix = (a, b, amount) => Math.round(a + (b - a) * amount);
    const primaryRgb = [45, 41, 78];
    const lightRgb = [248, 250, 248];

    function updateGumTransition() {
        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const rawProgress = scrollable > 0 ? clamp(-rect.top / scrollable) : 0;
        const whyOut = smoothstep(range(0.08, 0.45, rawProgress));
        const loveIn = smoothstep(range(0.68, 0.94, rawProgress));
        const productProgress = smoothstep(range(0.22, 0.68, rawProgress));
        const bgProgress = smoothstep(range(0.42, 0.82, rawProgress));

        let productX = 0;
        if (window.innerWidth > 968) {
            const layoutRect = layout.getBoundingClientRect();
            const productBaseLeft = layoutRect.left + product.offsetLeft;
            productX = (layoutRect.left - productBaseLeft) * productProgress;
        }

        section.style.setProperty('--gum-progress', rawProgress.toFixed(4));
        section.style.setProperty('--why-out', whyOut.toFixed(4));
        section.style.setProperty('--love-in', loveIn.toFixed(4));
        section.style.setProperty('--product-x', `${productX.toFixed(2)}px`);
        section.style.setProperty('--story-bg', `rgb(${mix(primaryRgb[0], lightRgb[0], bgProgress)}, ${mix(primaryRgb[1], lightRgb[1], bgProgress)}, ${mix(primaryRgb[2], lightRgb[2], bgProgress)})`);
        section.classList.toggle('is-love-active', rawProgress > 0.72);
    }

    window.addEventListener('scroll', updateGumTransition, { passive: true });
    window.addEventListener('resize', updateGumTransition);
    updateGumTransition();
}

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    handleScrollEffects();
    startWhySlider();
    startBenefitsCarousel();
    startProductCarousel();
    startGumTransition();
    console.log('Sihatree Experience Initialized');
});
