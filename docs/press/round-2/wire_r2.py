# -*- coding: utf-8 -*-
"""PRESS round 2 — Stage 5 wiring. Everything in one pass.

1. blog index cards + Blog JSON-LD blogPost[] stubs   (blog.html / ms/blog.html)
2. public/sitemap.xml                                  (15 <url> blocks)
3. public/llms.txt + public/ms/llms.txt                (page-index lines + count bump)
4. vite.config.js rollupOptions.input                  (15 new entries)
5. inbound links: one extra .blog-card in the Related rail of 15 existing articles

Idempotent by assertion: every step refuses to run twice (it checks for the slug
already being present and aborts rather than duplicating).
"""
import html
import io
import json
import os
import re

ROOT = r"E:\sahtree"
RD = os.path.join(ROOT, "docs", "press", "round-2")
DATE = "2026-09-10"
HUMAN = {"ms": "10 September 2026", "en": "September 10, 2026"}
READ_UNIT = {"ms": "minit bacaan", "en": "min read"}
SITE = "https://sihatree.com"
E = lambda s: html.escape(s, quote=True)
J = lambda s: json.dumps(s, ensure_ascii=False)[1:-1]

wire = json.load(io.open(os.path.join(RD, "wire-data-r2.json"), encoding="utf-8"))["articles"]
drafts = {}
for aid in wire:
    drafts[aid] = json.load(io.open(os.path.join(RD, f"draft-{aid}.json"), encoding="utf-8"))
    drafts[aid]["id"] = aid


def words_of(d):
    t = re.sub(r"<[^>]+>", " ", d["lede"] + " " + d["bodyHtml"])
    n = len([w for w in re.split(r"\s+", html.unescape(t)) if w.strip()])
    return n + sum(len(f["a"].split()) + len(f["q"].split()) for f in d["faqs"])


def href(d):
    return ("/ms/blog/" if d["lang"] == "ms" else "/blog/") + d["slug"]


def read_write(p, fn):
    s = io.open(p, encoding="utf-8").read()
    s2 = fn(s)
    io.open(p, "w", encoding="utf-8", newline="").write(s2)


# ------------------------------------------------------------------ 1. index
def wire_index(path, lang, delay0):
    ids = [i for i in wire if drafts[i]["lang"] == lang]
    s = io.open(path, encoding="utf-8").read()
    for i in ids:
        assert f'href="{href(drafts[i])}"' not in s, f"{path}: {drafts[i]['slug']} already wired"

    cards = ""
    for n, i in enumerate(ids):
        d, w = drafts[i], wire[i]
        read = max(1, round(words_of(d) / 160))
        cards += f'''      <article class="blog-card" data-aos="fade-up" data-aos-delay="{delay0 + n * 100}">
        <a class="blog-card-link" href="{href(d)}">
          <div class="blog-card-thumb">
            <img src="/images/{w['hero']}" alt="{E(w['heroAlt'])}" loading="lazy">
          </div>
          <div class="blog-card-body">
            <span class="blog-card-tag">{E(d['tag'])}</span>
            <h2 class="blog-card-title">{E(d['ogTitle'])}</h2>
            <p class="blog-card-excerpt">
              {E(d['excerpt'])}
            </p>
            <div class="blog-card-meta">
              <time datetime="{DATE}">{HUMAN[lang]}</time>
              <span class="blog-dot" aria-hidden="true">&middot;</span>
              <span>{read} {READ_UNIT[lang]}</span>
            </div>
          </div>
        </a>
      </article>
'''
    close = "\n    </div>\n  </main>"
    idx = s.rindex(close)
    assert s.rfind('<article class="blog-card"', 0, idx) != -1, f"{path}: grid shape changed"
    s = s[:idx] + "\n" + cards + s[idx:]

    entries = ",\n".join(
        f'''      {{
        "@type": "BlogPosting",
        "headline": "{J(drafts[i]['h1'])}",
        "url": "{SITE}{href(drafts[i])}",
        "datePublished": "{DATE}",
        "author": {{ "@type": "Organization", "@id": "{SITE}/#organization", "name": "Sihatree" }}
      }}''' for i in ids)
    k = s.index('"blogPost": [')
    c = s.index("\n    ]", k)
    s = s[:c] + ",\n" + entries + s[c:]
    io.open(path, "w", encoding="utf-8", newline="").write(s)
    print(f"index  {os.path.basename(path):12s} +{len(ids)} cards, +{len(ids)} JSON-LD stubs")


# ---------------------------------------------------------------- 2. sitemap
def wire_sitemap():
    p = os.path.join(ROOT, "public", "sitemap.xml")
    s = io.open(p, encoding="utf-8").read()
    blocks = ""
    for i in wire:
        d = drafts[i]
        u = SITE + href(d)
        assert u not in s, f"sitemap: {u} already present"
        hl = "ms-MY" if d["lang"] == "ms" else "en-MY"
        # These 15 pages exist in ONE language only. A self-referencing pair
        # (own locale + x-default) is the honest set; inventing an alternate
        # for a twin that does not exist would ship a 404 to Google.
        blocks += (
            "  <url>\n"
            f"    <loc>{u}</loc>\n"
            f"    <lastmod>{DATE}</lastmod>\n"
            f'    <xhtml:link rel="alternate" hreflang="{hl}" href="{u}" />\n'
            f'    <xhtml:link rel="alternate" hreflang="x-default" href="{u}" />\n'
            "  </url>\n\n")
    assert s.rstrip().endswith("</urlset>")
    s = s.replace("\n</urlset>", "\n\n" + blocks + "</urlset>")
    io.open(p, "w", encoding="utf-8", newline="").write(s)
    print(f"sitemap  +{len(wire)} <url> blocks with lastmod")


# ------------------------------------------------------------------ 3. llms
def wire_llms():
    for lang, path, old, new, pref in (
        ("en", os.path.join(ROOT, "public", "llms.txt"),
         "(49 English articles)", "(52 English articles)", f"{SITE}/blog/"),
        ("ms", os.path.join(ROOT, "public", "ms", "llms.txt"),
         "(49 artikel Bahasa Malaysia)", "(61 artikel Bahasa Malaysia)", f"{SITE}/ms/blog/"),
    ):
        s = io.open(path, encoding="utf-8").read()
        assert old in s, f"{path}: article-count string not found"
        s = s.replace(old, new)
        ids = [i for i in wire if drafts[i]["lang"] == lang]
        lines = "".join(f"- {SITE}{href(drafts[i])} — {drafts[i]['h1']}\n" for i in ids)
        last = s.rfind(f"- {pref}")
        assert last != -1, f"{path}: no existing blog page-index line"
        end = s.index("\n", last) + 1
        s = s[:end] + lines + s[end:]
        io.open(path, "w", encoding="utf-8", newline="").write(s)
        print(f"llms   {lang}: count {old.strip('()')} -> {new.strip('()')}, +{len(ids)} index lines")


# ------------------------------------------------------------------ 4. vite
def wire_vite():
    p = os.path.join(ROOT, "vite.config.js")
    s = io.open(p, encoding="utf-8").read()
    key = lambda aid, d: "blogR2" + aid + "".join(
        w.capitalize() for w in re.split(r"[-_]", d["slug"]))[:60]
    add = ""
    for i in wire:
        d = drafts[i]
        rel = ("ms/blog/" if d["lang"] == "ms" else "blog/") + d["slug"] + ".html"
        assert rel not in s, f"vite: {rel} already registered"
        add += f"        {key(i, d)}: page('{rel}'),\n"
    anchor = "      },\n    },\n  },"
    assert s.count(anchor) == 1, "vite: input-block anchor not unique"
    s = s.replace(anchor, add + anchor)
    io.open(p, "w", encoding="utf-8", newline="").write(s)
    print(f"vite   +{len(wire)} rollup inputs")


# --------------------------------------------------------------- 5. inbound
def wire_inbound():
    for i in wire:
        d, w = drafts[i], wire[i]
        sub = "ms\\blog" if d["lang"] == "ms" else "blog"
        p = os.path.join(ROOT, sub, w["inboundFrom"] + ".html")
        assert os.path.exists(p), f"inbound source missing: {p}"
        s = io.open(p, encoding="utf-8").read()
        assert f'href="{href(d)}"' not in s, f"{p}: already links to {d['slug']}"
        card = f'''        <article class="blog-card">
          <a class="blog-card-link" href="{href(d)}">
            <div class="blog-card-thumb">
              <img src="/images/{w['hero']}" alt="{E(w['heroAlt'])}" loading="lazy">
            </div>
            <div class="blog-card-body">
              <span class="blog-card-tag">{E(d['tag'])}</span>
              <h3 class="blog-card-title">{E(d['ogTitle'])}</h3>
            </div>
          </a>
        </article>
'''
        m = re.search(r'(<section class="blog-related".*?<div class="blog-grid">)(.*?)(\n      </div>)',
                      s, re.S)
        assert m, f"{p}: related rail not found"
        s = s[:m.end(2)] + "\n" + card.rstrip("\n") + s[m.end(2):]
        io.open(p, "w", encoding="utf-8", newline="").write(s)
    print(f"inbound  +1 related card on each of {len(wire)} existing articles")


if __name__ == "__main__":
    wire_index(os.path.join(ROOT, "blog.html"), "en", 5000)
    wire_index(os.path.join(ROOT, "ms", "blog.html"), "ms", 5000)
    wire_sitemap()
    wire_llms()
    wire_vite()
    wire_inbound()
    print("\nwiring complete")
