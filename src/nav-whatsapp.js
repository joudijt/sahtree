// Shared across every page (main pages, blog articles, all languages) since
// the site doesn't load one common bundle — see blog.js's comment on why
// article pages skip main.js. This module owns: the nav language-switch
// dropdown, the floating WhatsApp button, and routing any on-site form
// through a WhatsApp deep link instead of a fake/no-op submit.

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
  injectWhatsAppButton();
  wireForms();
});
