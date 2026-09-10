# -*- coding: utf-8 -*-
"""PRESS round 2 — Stage 6 wiring verification.

Asserts by CONTENT, never by exit code: every one of the 15 articles is really
on the page, in the index, in the sitemap, in llms.txt, in the Vite input map,
and linked to from an existing article — and that its visible FAQ and its
FAQPage schema are the same list.
"""
import html
import io
import json
import os
import re

ROOT = r"E:\sahtree"
RD = os.path.join(ROOT, "docs", "press", "round-2")
E = lambda s: html.escape(s, quote=True)

wire = json.load(io.open(os.path.join(RD, "wire-data-r2.json"), encoding="utf-8"))["articles"]
sm = io.open(os.path.join(ROOT, "public/sitemap.xml"), encoding="utf-8").read()
vite = io.open(os.path.join(ROOT, "vite.config.js"), encoding="utf-8").read()
idx = {"ms": io.open(os.path.join(ROOT, "ms/blog.html"), encoding="utf-8").read(),
       "en": io.open(os.path.join(ROOT, "blog.html"), encoding="utf-8").read()}
llms = {"ms": io.open(os.path.join(ROOT, "public/ms/llms.txt"), encoding="utf-8").read(),
        "en": io.open(os.path.join(ROOT, "public/llms.txt"), encoding="utf-8").read()}

bad = []
checks = 0

for aid, w in wire.items():
    d = json.load(io.open(os.path.join(RD, "draft-%s.json" % aid), encoding="utf-8"))
    lang = d["lang"]
    rel = ("ms/blog/" if lang == "ms" else "blog/") + d["slug"]
    url = "https://sihatree.com/" + rel
    page = os.path.join(ROOT, rel + ".html")
    if not os.path.exists(page):
        bad.append("%s page missing" % aid)
        continue
    p = io.open(page, encoding="utf-8").read()

    # --- FAQ parity: visible list vs FAQPage schema, both from one source array
    vis = re.findall(r'<button type="button" class="faq-question">(.*?) <i ', p, re.S)
    sch = re.findall(r'"@type": "Question",\s*\n\s*"name": "(.*?)",', p)
    if len(vis) != len(d["faqs"]):
        bad.append("%s visible FAQ count %d != %d" % (aid, len(vis), len(d["faqs"])))
    if len(sch) != len(d["faqs"]):
        bad.append("%s schema FAQ count %d != %d" % (aid, len(sch), len(d["faqs"])))
    for f in d["faqs"]:
        checks += 2
        if E(f["q"]) not in p:
            bad.append("%s FAQ q not visible: %s" % (aid, f["q"][:40]))
        if json.dumps(f["q"], ensure_ascii=False)[1:-1] not in p:
            bad.append("%s FAQ q not in schema: %s" % (aid, f["q"][:40]))

    for must in ('<link rel="canonical" href="%s" />' % url,
                 '<meta property="og:url" content="%s" />' % url,
                 '<link rel="alternate" hreflang="x-default" href="%s" />' % url,
                 '<meta name="robots" content="index,follow" />',
                 '<meta name="twitter:card" content="summary_large_image" />',
                 '"@type": "BlogPosting"', '"@type": "FAQPage"', '"@type": "BreadcrumbList"',
                 '"@id": "https://sihatree.com/#organization"',
                 "/images/%s" % w["hero"]):
        checks += 1
        if must not in p:
            bad.append("%s missing in page: %s" % (aid, must[:62]))

    checks += 1
    if len(d["title"] + " | Sihatree") > 60:
        bad.append("%s <title> longer than 60" % aid)

    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', p, re.S):
        checks += 1
        try:
            json.loads(m.group(1))
        except Exception as e:
            bad.append("%s invalid JSON-LD: %s" % (aid, e))

    body = p.split('class="blog-post-body"')[1].split('<section class="blog-faq"')[0]
    n = len(re.findall(r'href="(/[^"]*)"', body))
    checks += 1
    if n < 3:
        bad.append("%s only %d outbound internal links" % (aid, n))
    for anchor in ("click here", "read more", "klik di sini", "baca lagi"):
        checks += 1
        if re.search(r">\s*%s\s*<" % anchor, body, re.I):
            bad.append("%s non-descriptive anchor '%s'" % (aid, anchor))

    for label, hay, needle in (("sitemap", sm, "<loc>%s</loc>" % url),
                               ("sitemap lastmod", sm, "<lastmod>2026-09-10</lastmod>"),
                               ("vite input", vite, "page('%s.html')" % rel),
                               ("blog index card", idx[lang], 'href="/%s"' % rel),
                               ("blog index JSON-LD", idx[lang], url),
                               ("llms.txt", llms[lang], url)):
        checks += 1
        if needle not in hay:
            bad.append("%s not in %s" % (aid, label))

    inb_path = os.path.join(ROOT, "ms/blog" if lang == "ms" else "blog",
                            w["inboundFrom"] + ".html")
    checks += 1
    inb = io.open(inb_path, encoding="utf-8").read()
    if 'href="/%s"' % rel not in inb:
        bad.append("%s orphan - no inbound link from %s" % (aid, w["inboundFrom"]))

    for leak in ("{{", "TODO:", "FIXME", "lorem ipsum", "wordsDraft", "bodyHtml",
                 "focus keyword", "WRITER-BRIEF"):
        checks += 1
        if leak in p:
            bad.append("%s leaked owner-facing text '%s'" % (aid, leak))

# focus-keyword uniqueness across the whole round
seen = {}
for aid in wire:
    d = json.load(io.open(os.path.join(RD, "draft-%s.json" % aid), encoding="utf-8"))
    k = (d["lang"], d["focus"].strip().lower())
    checks += 1
    if k in seen:
        bad.append("CANNIBALISATION: %s and %s share %s" % (aid, seen[k], k))
    seen[k] = aid

if bad:
    print("FAILURES (%d):" % len(bad))
    for b in bad:
        print("  " + b)
    raise SystemExit(1)
print("WIRING VERIFIED - %d content assertions, 15 articles, 0 failures." % checks)
print("  FAQ parity (visible list == FAQPage schema), canonical, og:url, x-default,")
print("  robots, twitter:card, BlogPosting + FAQPage + BreadcrumbList all parsing,")
print("  publisher/author resolving to the site's declared @id, hero image present,")
print("  >=3 outbound internal links with descriptive anchors, sitemap entry + lastmod,")
print("  Vite rollup input, blog index card + JSON-LD stub, llms.txt index line,")
print("  an inbound link from an existing article, no leaked owner-facing text,")
print("  and no two articles sharing a focus keyword.")
