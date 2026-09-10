# -*- coding: utf-8 -*-
"""PRESS round 2 — Stage 5 builder.

Renders docs/press/round-2/draft-<ID>.json into a real article page in the
site's own shape. The visible FAQ accordion and the FAQPage JSON-LD are BOTH
generated from the draft's single `faqs` array, so they cannot diverge.

Create-only. It refuses to overwrite an existing article file.
"""
import html
import json
import os
import re
import sys

ROOT = r"E:\sahtree"
RD = os.path.join(ROOT, "docs", "press", "round-2")
DATE = "2026-09-10"
DATE_HUMAN = {"ms": "10 September 2026", "en": "September 10, 2026"}
SITE = "https://sihatree.com"

L = {
    "ms": {
        "dir": "ms/blog", "prefix": "/ms", "locale": "ms_MY", "hreflang": "ms-MY",
        "home": "Laman Utama", "blog": "Blog", "by": "Oleh Sihatree", "read": "minit bacaan",
        "faq_h": "Soalan Lazim", "related_h": "Artikel Berkaitan", "cur": "BM",
        "nav": [("/ms/products", "Produk"), ("/ms/benefits", "Kebaikan")],
        "nav_r": [("/ms/retail", "Runcit"), ("/ms/contact", "Hubungi")],
        "foot_links": [("/ms/products", "Produk"), ("/ms/benefits", "Kebaikan"),
                       ("/ms/wholesale", "Borong"), ("/ms/retail", "Runcit"),
                       ("/ms/contact", "Hubungi"), ("/ms/blog", "Blog")],
        "foot_desc": ("Membawa khazanah alam Gam Arab ke dalam rutin harian anda. Ringkas, "
                      "menyegarkan, dan mudah dinikmati."),
        "foot_quick": "Pautan Pantas", "foot_contact": "Hubungi Kami",
        "foot_ask": "Ada soalan? E-mel kami di:", "foot_store": "Kedai Berkat Madinah",
        "copy": "&copy; 2026 Sihatree. Hak cipta terpelihara.",
        "logo_alt": "Logo Sihatree",
        "switch": [("/blog", "EN"), ("/ar/blog", "AR")],
        "fswitch": '<a href="/blog">EN</a> | <a href="{self}" class="lang-current">Bahasa Malaysia</a> | <a href="/ar/blog">Arabic</a>',
    },
    "en": {
        "dir": "blog", "prefix": "", "locale": "en_MY", "hreflang": "en-MY",
        "home": "Home", "blog": "Blog", "by": "By Sihatree", "read": "min read",
        "faq_h": "Frequently Asked Questions", "related_h": "Related Articles", "cur": "EN",
        "nav": [("/products", "Products"), ("/benefits", "Benefits")],
        "nav_r": [("/retail", "Retail"), ("/contact", "Contact")],
        "foot_links": [("/products", "Products"), ("/benefits", "Benefits"),
                       ("/wholesale", "Wholesale"), ("/retail", "Retail"),
                       ("/contact", "Contact"), ("/blog", "Blog")],
        "foot_desc": ("Bringing the natural treasure of Arabic Gum into your daily routine. "
                      "Simple, refreshing and easy to enjoy."),
        "foot_quick": "Quick Links", "foot_contact": "Contact Us",
        "foot_ask": "Have a question? Email us at:", "foot_store": "Berkat Madinah Store",
        "copy": "&copy; 2026 Sihatree. All rights reserved.",
        "logo_alt": "Sihatree logo",
        "switch": [("/ms/blog", "BM"), ("/ar/blog", "AR")],
        "fswitch": '<a href="{self}" class="lang-current">EN</a> | <a href="/ms/blog">Bahasa Malaysia</a> | <a href="/ar/blog">Arabic</a>',
    },
}

E = lambda s: html.escape(s, quote=True)
J = lambda s: json.dumps(s, ensure_ascii=False)[1:-1]


def visible_words(s):
    t = re.sub(r"<[^>]+>", " ", s)
    t = html.unescape(t)
    return len([w for w in re.split(r"\s+", t) if w.strip()])


def scrape_existing(path):
    """Pull title / tag / hero image / alt out of a published article."""
    h = open(path, encoding="utf-8").read()
    og = re.search(r'<meta property="og:title" content="([^"]+)"', h)
    tag = re.search(r'<span class="blog-post-tag">([^<]+)</span>', h)
    img = re.search(r'<div class="blog-post-hero-img"[^>]*>\s*<img src="([^"]+)" alt="([^"]*)"', h, re.S)
    return {
        "title": html.unescape(og.group(1)) if og else "",
        "tag": html.unescape(tag.group(1)).strip() if tag else "",
        "img": img.group(1) if img else "/images/gum-crystals.webp",
        "alt": html.unescape(img.group(2)) if img else "",
    }


_DIMS: dict[str, str] = {}


def dims(src):
    """Real pixel size of an /images/... asset, read off disk.

    The template must declare the file's ACTUAL size. Hardcoding a nominal
    1600x900 for a 1024x576 file ships a lie and still shifts the layout.
    """
    if src not in _DIMS:
        p = os.path.join(ROOT, "public", src.lstrip("/").replace("/", os.sep))
        try:
            from PIL import Image
            with Image.open(p) as im:
                _DIMS[src] = f' width="{im.size[0]}" height="{im.size[1]}"'
        except Exception:
            _DIMS[src] = ""
    return _DIMS[src]


def th_scopes(body: str) -> str:
    """Give every <th> a scope. WCAG H63 / html-validate wcag/h63.

    Adding tables to this design system (they had never been used) introduced 96
    real accessibility errors in one pass: a <th> with no scope leaves a screen
    reader guessing which cells a header governs. Applied centrally so no writer
    has to remember it and no article can ship without it.
    """
    def fix(m, scope):
        inner = m.group(1)
        return f"<th{inner}>" if "scope=" in inner else f'<th scope="{scope}"{inner}>'

    def section(m):
        tag, guts = m.group(1), m.group(2)
        scope = "col" if tag.lower() == "thead" else "row"
        guts = re.sub(r"<th((?:\s[^>]*)?)>", lambda x: fix(x, scope), guts)
        return f"<{tag}>{guts}</{tag}>"

    return re.sub(r"<(thead|tbody)>(.*?)</(?:thead|tbody)>", section, body,
                  flags=re.S | re.I)


def card(href, title, tag, img, alt, heading="h3"):
    return f'''        <article class="blog-card">
          <a class="blog-card-link" href="{href}">
            <div class="blog-card-thumb">
              <img src="{img}"{dims(img)} alt="{E(alt)}" loading="lazy">
            </div>
            <div class="blog-card-body">
              <span class="blog-card-tag">{E(tag)}</span>
              <{heading} class="blog-card-title">{E(title)}</{heading}>
            </div>
          </a>
        </article>
'''


def build(aid, wire, drafts):
    d = drafts[aid]
    w = wire[aid]
    lang = d["lang"]
    c = L[lang]
    url = f"{SITE}{c['prefix']}/blog/{d['slug']}"
    hero = f"/images/{w['hero']}"
    hero_abs = f"{SITE}{hero}"
    # The band in WRITER-BRIEF.md is lede + body + FAQ *answers*; reading time
    # is computed from everything a reader actually sees, questions included.
    words = visible_words(d["lede"]) + visible_words(d["bodyHtml"]) + sum(
        len(f["a"].split()) for f in d["faqs"])
    seen = words + sum(len(f["q"].split()) for f in d["faqs"])
    read = max(1, round(seen / 160))

    # ---- JSON-LD ------------------------------------------------------
    faq_nodes = ",\n".join(
        '      {\n        "@type": "Question",\n'
        f'        "name": "{J(f["q"])}",\n'
        '        "acceptedAnswer": { "@type": "Answer", "text": "'
        f'{J(f["a"])}" }}\n      }}' for f in d["faqs"])

    ld_blog = f'''  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "{J(d['h1'])}",
    "url": "{url}",
    "inLanguage": "{c['hreflang']}",
    "datePublished": "{DATE}",
    "dateModified": "{DATE}",
    "image": "{hero_abs}",
    "author": {{ "@type": "Organization", "@id": "{SITE}/#organization", "name": "Sihatree", "url": "{SITE}" }},
    "publisher": {{
      "@type": "Organization",
      "@id": "{SITE}/#organization",
      "name": "Sihatree",
      "logo": {{ "@type": "ImageObject", "url": "{SITE}/images/logo.png" }}
    }},
    "mainEntityOfPage": {{ "@type": "WebPage", "@id": "{url}" }},
    "description": "{J(d['description'])}"
  }}
  </script>
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
{faq_nodes}
    ]
  }}
  </script>
  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {{ "@type": "ListItem", "position": 1, "name": "{J(c['home'])}", "item": "{SITE}{c['prefix']}/" }},
      {{ "@type": "ListItem", "position": 2, "name": "Blog", "item": "{SITE}{c['prefix']}/blog" }},
      {{ "@type": "ListItem", "position": 3, "name": "{J(d['breadcrumbName'])}", "item": "{url}" }}
    ]
  }}
  </script>'''

    # ---- nav / footer language switch ---------------------------------
    # These 15 articles exist in ONE language only (round 2 is Malaysia-first,
    # no Arabic twin, and the MS twelve have no English twin). The switch
    # therefore points at the sibling language's BLOG INDEX, never at a URL
    # that does not exist.
    sw = "\n".join(f'          <li><a href="{h}">{t}</a></li>' for h, t in c["switch"])

    nav_l = "\n".join(f'      <li><a href="{h}">{E(t)}</a></li>' for h, t in c["nav"])
    nav_r = "\n".join(f'      <li><a href="{h}">{E(t)}</a></li>' for h, t in c["nav_r"])
    foot_l = "\n".join(f'          <li><a href="{h}">{E(t)}</a></li>' for h, t in c["foot_links"])

    # ---- FAQ (visible) — same array as the schema above ---------------
    faq_html = "\n".join(
        f'''      <div class="faq-item">
        <button type="button" class="faq-question">{E(f["q"])} <i class="fas fa-chevron-down" aria-hidden="true"></i></button>
        <div class="faq-answer">{E(f["a"])}</div>
      </div>''' for f in d["faqs"])

    # ---- related rail --------------------------------------------------
    rel = ""
    for slug in w["related"]:
        if slug in {v["slug"]: k for k, v in drafts.items()}:
            pass
        hit = next((x for x in drafts.values() if x["slug"] == slug and x["lang"] == lang), None)
        if hit:
            hw = wire[hit["id"]]
            rel += card(f"{c['prefix']}/blog/{slug}", hit["ogTitle"], hit["tag"],
                        f"/images/{hw['hero']}", hw["heroAlt"])
        else:
            p = os.path.join(ROOT, c["dir"].replace("/", os.sep), slug + ".html")
            if not os.path.exists(p):
                raise SystemExit(f"{aid}: related slug not found: {p}")
            m = scrape_existing(p)
            rel += card(f"{c['prefix']}/blog/{slug}", m["title"], m["tag"], m["img"], m["alt"])

    page = f'''<!doctype html>
<html lang="{lang}">

<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{E(d['title'])} | Sihatree</title>
  <meta name="description" content="{E(d['description'])}" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="{url}" />
  <link rel="alternate" hreflang="{c['hreflang']}" href="{url}" />
  <link rel="alternate" hreflang="x-default" href="{url}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Sihatree" />
  <meta property="og:url" content="{url}" />
  <meta property="og:title" content="{E(d['ogTitle'])}" />
  <meta property="og:description" content="{E(d['ogDescription'])}" />
  <meta property="og:image" content="{hero_abs}" />
  <meta property="og:image:width" content="{w['heroW']}" />
  <meta property="og:image:height" content="{w['heroH']}" />
  <meta property="og:locale" content="{c['locale']}" />
  <meta property="article:published_time" content="{DATE}" />
  <meta property="article:modified_time" content="{DATE}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{E(d['ogTitle'])}" />
  <meta name="twitter:description" content="{E(d['twitterDescription'])}" />
  <meta name="twitter:image" content="{hero_abs}" />
  <link rel="stylesheet" href="/src/style.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
  <noscript><style>[data-aos]{{opacity:1 !important;transform:none !important}}</style></noscript>

{ld_blog}
</head>

<body>
  <!-- Navigation -->
  <nav id="main-nav" dir="ltr">
    <ul class="nav-links nav-left">
{nav_l}
    </ul>

    <div class="logo">
      <a href="{c['prefix']}/"><img src="/images/logo.webp"{dims("/images/logo.webp")} alt="{E(c['logo_alt'])}" id="nav-logo"></a>
    </div>

    <ul class="nav-links nav-right">
{nav_r}
      <li class="lang-switch">
        <button type="button" class="lang-switch-toggle" aria-haspopup="true" aria-expanded="false">
          <span class="lang-current-label">{c['cur']}</span> <i class="fas fa-chevron-down" aria-hidden="true"></i>
        </button>
        <ul class="lang-switch-menu">
{sw}
        </ul>
      </li>
    </ul>
  </nav>

  <main>
  <article class="blog-post">
    <header class="blog-post-header" data-aos="fade-up">
      <p class="blog-post-breadcrumb"><a href="{c['prefix']}/blog">{E(c['blog'])}</a> / {E(d['breadcrumbName'])}</p>
      <span class="blog-post-tag">{E(d['tag'])}</span>
      <h1>{E(d['h1'])}</h1>
      <div class="blog-card-meta">
        <time datetime="{DATE}">{DATE_HUMAN[lang]}</time>
        <span class="blog-dot" aria-hidden="true">&middot;</span>
        <span>{read} {c['read']}</span>
        <span class="blog-dot" aria-hidden="true">&middot;</span>
        <span>{E(c['by'])}</span>
      </div>
    </header>

    <div class="blog-post-hero-img" data-aos="fade-up">
      <img src="{hero}" alt="{E(w['heroAlt'])}" width="{w['heroW']}" height="{w['heroH']}">
    </div>
    <p class="blog-post-hero-caption">{E(d['heroCaption'])}</p>

    <div class="blog-post-body" data-aos="fade-up">

      <p class="blog-post-lede">{d['lede']}</p>

{th_scopes(d['bodyHtml'])}

    </div>

    <section class="blog-faq" data-aos="fade-up">
      <h2>{E(c['faq_h'])}</h2>
{faq_html}
    </section>

    <section class="blog-related" data-aos="fade-up">
      <h2>{E(c['related_h'])}</h2>
      <div class="blog-grid">
{rel}      </div>
    </section>
  </article>
  </main>

  <!-- Footer -->
  <footer class="main-footer">
    <div class="footer-layout">
      <div class="footer-col brand-col">
        <img src="/images/logo.webp"{dims("/images/logo.webp")} alt="{E(c['logo_alt'])}" class="footer-logo">
        <p class="footer-desc">{E(c['foot_desc'])}</p>
      </div>

      <div class="footer-col">
        <h3>{E(c['foot_quick'])}</h3>
        <ul class="footer-links">
{foot_l}
        </ul>
      </div>

      <div class="footer-col">
        <h3>{E(c['foot_contact'])}</h3>
        <div class="social-links-footer">
          <a href="https://vt.tiktok.com/ZSX2MbR9G/?page=TikTokShop" target="_blank" rel="noopener noreferrer" class="social-circle" aria-label="TikTok Shop"><i class="fab fa-tiktok"></i></a>
          <a href="https://wa.me/601111119912" target="_blank" rel="noopener noreferrer" class="social-circle" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
          <a href="https://www.facebook.com/share/1DMS971Fwk/" target="_blank" rel="noopener noreferrer" class="social-circle" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="https://www.instagram.com/berkatmadinah" target="_blank" rel="noopener noreferrer" class="social-circle" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
          <a href="https://shopee.com.my/arabianvillagemalaysia" target="_blank" rel="noopener noreferrer" class="social-circle" aria-label="Shopee"><i class="fas fa-shopping-bag"></i></a>
        </div>
        <a href="https://madinah.com.my/en/" target="_blank" rel="noopener noreferrer" class="footer-madinah"><i class="fas fa-store" aria-hidden="true"></i> {E(c['foot_store'])}</a>
        <div class="footer-contact">
          <p>{E(c['foot_ask'])}</p>
          <a href="mailto:cs@madinah.com.my" class="footer-email">cs@madinah.com.my</a>
        </div>
        <div class="footer-lang-switch">
          {c['fswitch'].format(self=f"{c['prefix']}/blog/{d['slug']}")}
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>{c['copy']}</p>
    </div>
  </footer>

  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => window.AOS && AOS.init());
  </script>
  <script type="module" src="/src/blog.js"></script>
  <script type="module" src="/src/nav-whatsapp.js"></script>
</body>

</html>
'''
    out = os.path.join(ROOT, c["dir"].replace("/", os.sep), d["slug"] + ".html")
    if os.path.exists(out) and "--force" not in sys.argv:
        raise SystemExit(f"REFUSING to overwrite existing article: {out}")
    open(out, "w", encoding="utf-8", newline="\n").write(page)
    return out, words, read


def main():
    wire = json.load(open(os.path.join(RD, "wire-data-r2.json"), encoding="utf-8"))["articles"]
    only = [a for a in sys.argv[1:] if not a.startswith("--")]
    drafts = {}
    for aid in wire:
        p = os.path.join(RD, f"draft-{aid}.json")
        if not os.path.exists(p):
            if only:          # partial render: a not-yet-written sibling is fine
                continue
            raise SystemExit(f"missing draft: {p}")
        drafts[aid] = json.load(open(p, encoding="utf-8"))
        drafts[aid]["id"] = aid

    # intra-round focus keyword uniqueness (gate 26a)
    seen = {}
    for aid, d in drafts.items():
        k = (d["lang"], d["focus"].strip().lower())
        if k in seen:
            raise SystemExit(f"CANNIBALISATION: {aid} and {seen[k]} share focus {k}")
        seen[k] = aid

    # Siblings inside this round resolve from `drafts`, so every draft is loaded
    # even when only a subset is rendered - a partial load makes a sibling look
    # like a missing file on disk.
    for aid in (only or list(wire)):
        out, words, read = build(aid, wire, drafts)
        flag = "" if 800 <= words <= 1000 else "  <-- OUT OF BAND"
        print(f"{aid}  {words:5d} words  {read} min  {out}{flag}")


if __name__ == "__main__":
    main()
