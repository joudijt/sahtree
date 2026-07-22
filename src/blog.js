// Generates a table of contents from the article's H2s. Only long articles
// (4+ H2 sections) get one — short posts don't need it.
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}

function buildToc() {
  const body = document.querySelector('.blog-post-body');
  if (!body) return;

  const headings = Array.from(body.querySelectorAll('h2'));
  if (headings.length < 4) return;

  const usedIds = new Set();
  headings.forEach((h2) => {
    let id = slugify(h2.textContent);
    let unique = id;
    let i = 2;
    while (usedIds.has(unique)) {
      unique = `${id}-${i++}`;
    }
    usedIds.add(unique);
    h2.id = unique;
  });

  const isMs = document.documentElement.lang === 'ms';

  // Native <details> disclosure — collapsed on mobile, open on desktop,
  // no extra JS needed for the toggle itself.
  const toc = document.createElement('details');
  toc.className = 'blog-toc';
  toc.open = window.innerWidth > 640;

  const summary = document.createElement('summary');
  summary.className = 'blog-toc-title';
  summary.innerHTML = `<span>${isMs ? 'Kandungan' : 'Table of Contents'}</span><i class="fas fa-chevron-down blog-toc-chevron" aria-hidden="true"></i>`;
  toc.appendChild(summary);

  const list = document.createElement('ol');
  headings.forEach((h2) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${h2.id}`;
    a.textContent = h2.textContent;
    li.appendChild(a);
    list.appendChild(li);
  });
  toc.appendChild(list);

  const firstH2 = headings[0];
  firstH2.parentNode.insertBefore(toc, firstH2);
}

// Highlights the TOC link for whichever section is currently in view.
// Skips entirely if there's no TOC (short articles) or the browser has no
// IntersectionObserver — the page works fine without it either way.
function initTocScrollSpy() {
  const toc = document.querySelector('.blog-toc');
  if (!toc || typeof IntersectionObserver === 'undefined') return;

  const links = Array.from(toc.querySelectorAll('a'));
  if (!links.length) return;

  const linkByHeadingId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = linkByHeadingId.get(entry.target.id);
        if (!link || !entry.isIntersecting) return;
        links.forEach((a) => a.classList.remove('active'));
        link.classList.add('active');
      });
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  );

  document.querySelectorAll('.blog-post-body h2').forEach((h2) => observer.observe(h2));
}

// FAQ accordion — same .faq-item/.faq-question/.faq-answer component and
// animation used on retail.html, just wired up locally since article pages
// don't load the shared main.js bundle (which also carries unrelated
// modal/wholesale-form logic these pages don't need).
function initFaqAccordion() {
  document.querySelectorAll('.blog-faq .faq-question').forEach((item) => {
    item.setAttribute('aria-expanded', 'false');
    item.addEventListener('click', () => {
      const parent = item.parentElement;
      const isActive = parent.classList.toggle('active');
      item.setAttribute('aria-expanded', String(isActive));
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildToc();
  initTocScrollSpy();
  initFaqAccordion();
});
