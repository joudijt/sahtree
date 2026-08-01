// Shared across every page (main pages, blog articles, all languages) since
// the site doesn't load one common bundle — see blog.js's comment on why
// article pages skip main.js. This module owns: the nav language-switch
// dropdown, the mobile navigation, the floating WhatsApp button, and routing
// any on-site form through a WhatsApp deep link instead of a fake/no-op submit.

const WHATSAPP_NUMBER = '601111119912';

function buildWhatsAppUrl(intro, fields) {
  const lines = fields
    .filter(({ value }) => value && String(value).trim().length > 0)
    .map(({ label, value }) => `*${label}:* ${value}`);
  const text = [intro, ...lines].join('\n');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function wireLangDropdowns() {
  const wraps = Array.from(document.querySelectorAll('.lang-switch'));
  if (!wraps.length) return;

  const closeAll = () => {
    wraps.forEach((wrap) => {
      wrap.classList.remove('open');
      wrap.querySelector('.lang-switch-toggle')?.setAttribute('aria-expanded', 'false');
    });
  };

  wraps.forEach((wrap) => {
    const toggle = wrap.querySelector('.lang-switch-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = wrap.classList.contains('open');
      closeAll();
      if (!isOpen) {
        wrap.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', closeAll);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAll();
  });
}

// Below 968px the stylesheet hides `.nav-links`/`.nav-cta`, so without this the
// site has no navigation and no language switcher on mobile at all. Both the
// button and the panel are built here rather than added to markup because the
// nav is duplicated across 152 HTML files in three languages.
const MOBILE_NAV_LABELS = {
  en: { open: 'Open menu', close: 'Close menu' },
  ms: { open: 'Buka menu', close: 'Tutup menu' },
  ar: { open: 'فتح القائمة', close: 'إغلاق القائمة' }
};

function injectMobileNav() {
  const nav = document.getElementById('main-nav');
  if (!nav || document.querySelector('.nav-burger')) return;

  // Only the real destination links — `.nav-links` also holds the language
  // switcher, which gets its own row at the bottom of the panel.
  const links = Array.from(nav.querySelectorAll('.nav-links > li > a'));
  if (!links.length) return;

  const labels = MOBILE_NAV_LABELS[document.documentElement.lang] ?? MOBILE_NAV_LABELS.en;

  const burger = document.createElement('button');
  burger.type = 'button';
  burger.className = 'nav-burger';
  burger.setAttribute('aria-label', labels.open);
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-controls', 'mobile-nav');
  burger.innerHTML = '<span class="nav-burger-bar"></span><span class="nav-burger-bar"></span><span class="nav-burger-bar"></span>';
  nav.appendChild(burger);

  const panel = document.createElement('div');
  panel.className = 'mobile-nav';
  panel.id = 'mobile-nav';

  const list = document.createElement('ul');
  list.className = 'mobile-nav-links';
  links.forEach((link) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link.getAttribute('href');
    a.textContent = link.textContent.trim();
    li.appendChild(a);
    list.appendChild(li);
  });
  panel.appendChild(list);

  // Rebuilt from the page's own switcher, so each locale gets its own labels
  // and targets without a translation table living in this file.
  const currentLabel = nav.querySelector('.lang-current-label');
  const otherLangs = Array.from(nav.querySelectorAll('.lang-switch-menu a'));
  if (currentLabel && otherLangs.length) {
    const row = document.createElement('div');
    row.className = 'mobile-nav-langs';
    const current = document.createElement('span');
    current.className = 'is-current';
    current.textContent = currentLabel.textContent.trim();
    row.appendChild(current);
    otherLangs.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = link.textContent.trim();
      row.appendChild(a);
    });
    panel.appendChild(row);
  }

  document.body.appendChild(panel);

  const focusable = () => Array.from(panel.querySelectorAll('a[href]'));
  let isOpen = false;

  const open = () => {
    // The bar shrinks on scroll, so the panel's top edge is read live.
    panel.style.setProperty('--mobile-nav-top', `${nav.offsetHeight}px`);
    panel.classList.add('open');
    document.body.classList.add('mobile-nav-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', labels.close);
    isOpen = true;
    // `visibility` is inherited and a hidden element silently refuses focus(),
    // so the first link can only take focus once the panel has actually finished
    // becoming visible. Reflow, rAF and forced style reads all run too early;
    // the transition ending is the only deterministic signal. The timer is the
    // fallback for when no transition runs at all (reduced motion).
    const first = focusable()[0];
    if (first) {
      let done = false;
      const focusFirst = () => {
        if (done || !isOpen) return;
        done = true;
        panel.removeEventListener('transitionend', focusFirst);
        first.focus();
      };
      panel.addEventListener('transitionend', focusFirst);
      setTimeout(focusFirst, 350);
    }
  };

  const close = ({ restoreFocus = true } = {}) => {
    panel.classList.remove('open');
    document.body.classList.remove('mobile-nav-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', labels.open);
    isOpen = false;
    if (restoreFocus) burger.focus();
  };

  burger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isOpen) close();
    else open();
  });

  // Same-page anchors don't unload the document, so the panel has to close itself.
  panel.addEventListener('click', (e) => {
    if (e.target.closest('a')) close({ restoreFocus: false });
  });

  window.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    const items = focusable();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    // Keep Tab inside the panel while it covers the page.
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      burger.focus();
    } else if (document.activeElement === burger && !e.shiftKey) {
      e.preventDefault();
      first.focus();
    }
  });

  // Resizing up to desktop leaves the panel open over a nav that's visible again.
  window.addEventListener('resize', () => {
    if (isOpen && window.innerWidth > 968) close({ restoreFocus: false });
  });
}

function injectWhatsAppButton() {
  if (document.querySelector('.wa-float-btn')) return;
  const btn = document.createElement('a');
  btn.href = `https://wa.me/${WHATSAPP_NUMBER}`;
  btn.className = 'wa-float-btn';
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.setAttribute('aria-label', 'Chat with us on WhatsApp');
  btn.innerHTML = '<i class="fab fa-whatsapp" aria-hidden="true"></i>';
  document.body.appendChild(btn);
}

function wireWhatsAppForm(formEl, intro, fieldDefs) {
  if (!formEl) return;
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      return;
    }
    const data = new FormData(formEl);
    const fields = fieldDefs.map(({ name, label, multi }) => ({
      label,
      value: multi ? data.getAll(name).join(', ') : data.get(name)
    }));
    window.open(buildWhatsAppUrl(intro, fields), '_blank', 'noopener,noreferrer');

    const btn = formEl.querySelector('button');
    if (btn) {
      const originalText = btn.innerText;
      btn.innerText = 'Opening WhatsApp…';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerText = originalText;
        btn.disabled = false;
      }, 3000);
    }
    formEl.reset();
  });
}

function wireForms() {
  wireWhatsAppForm(
    document.getElementById('contactForm'),
    'Hi Sihatree, I have a message from your website contact form:',
    [
      { name: 'fullName', label: 'Name' },
      { name: 'email', label: 'Email' },
      { name: 'reason', label: 'Reason' },
      { name: 'message', label: 'Message' }
    ]
  );

  wireWhatsAppForm(
    document.getElementById('wholesaleForm'),
    'Hi Sihatree, I would like a wholesale quote:',
    [
      { name: 'fullName', label: 'Name' },
      { name: 'companyName', label: 'Company' },
      { name: 'email', label: 'Email' },
      { name: 'phone', label: 'Phone' },
      { name: 'flavours', label: 'Flavours', multi: true },
      { name: 'message', label: 'Message' }
    ]
  );
}

document.addEventListener('DOMContentLoaded', () => {
  wireLangDropdowns();
  injectMobileNav();
  injectWhatsAppButton();
  wireForms();
});
