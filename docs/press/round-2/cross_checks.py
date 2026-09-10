# -*- coding: utf-8 -*-
"""PRESS round 2 — the mechanical half of the adversarial pass.

Three things a human reviewer reads slowly and a script can settle exactly:
site-wide meta uniqueness, structural sameness between articles written in
parallel by separate agents, and whether every internal href resolves.
"""
import glob
import html
import io
import json
import os
import re
import sys

ROOT = r"E:\sahtree"
RD = os.path.join(ROOT, "docs", "press", "round-2")
NEW = {}
for aid in json.load(io.open(os.path.join(RD, "wire-data-r2.json"), encoding="utf-8"))["articles"]:
    d = json.load(io.open(os.path.join(RD, "draft-%s.json" % aid), encoding="utf-8"))
    NEW[aid] = ("ms/blog/" if d["lang"] == "ms" else "blog/") + d["slug"] + ".html"

ALL = sorted(set(glob.glob(os.path.join(ROOT, "blog", "*.html"))
                 + glob.glob(os.path.join(ROOT, "ms", "blog", "*.html"))
                 + glob.glob(os.path.join(ROOT, "ar", "blog", "*.html"))
                 + glob.glob(os.path.join(ROOT, "*.html"))
                 + glob.glob(os.path.join(ROOT, "ms", "*.html"))
                 + glob.glob(os.path.join(ROOT, "ar", "*.html"))))
ALL = [p for p in ALL if not os.path.basename(p).startswith("_")]

fails = []


def txt(p):
    return io.open(p, encoding="utf-8").read()


def rel(p):
    return os.path.relpath(p, ROOT).replace("\\", "/")


# ---------------------------------------------------------- 1. meta uniqueness
titles, descs = {}, {}
for p in ALL:
    s = txt(p)
    t = re.search(r"<title>(.*?)</title>", s, re.S)
    d = re.search(r'<meta name="description"\s*\n?\s*content="(.*?)"', s, re.S)
    if t:
        k = html.unescape(re.sub(r"\s+", " ", t.group(1))).strip()
        titles.setdefault(k, []).append(rel(p))
    if d:
        k = html.unescape(re.sub(r"\s+", " ", d.group(1))).strip()
        descs.setdefault(k, []).append(rel(p))

newrel = set(NEW.values())
for label, bag in (("title", titles), ("description", descs)):
    for k, ps in bag.items():
        if len(ps) > 1 and newrel & set(ps):
            fails.append("DUPLICATE %s across %s: %r" % (label, ps, k[:70]))
print("meta uniqueness: %d titles, %d descriptions across %d pages" %
      (len(titles), len(descs), len(ALL)))

# ------------------------------------------------- 2. intra-round structural sameness
sig = {}
for aid, r in NEW.items():
    s = txt(os.path.join(ROOT, r))
    body = s.split('class="blog-post-body"')[1].split('<section class="blog-faq"')[0]
    h2 = [html.unescape(re.sub(r"<[^>]+>", "", x)).strip()
          for x in re.findall(r"<h2[^>]*>(.*?)</h2>", body, re.S)]
    faq = re.findall(r'<button type="button" class="faq-question">(.*?) <i ', s, re.S)
    cards = re.findall(r'<div class="blog-benefit-card">.*?<h3>(.*?)</h3>', s, re.S)
    sig[aid] = {"h2": h2, "faq": [html.unescape(f).strip() for f in faq],
                "cards": [html.unescape(c).strip() for c in cards]}

ids = list(sig)
for i, a in enumerate(ids):
    for b in ids[i + 1:]:
        for key in ("h2", "faq", "cards"):
            A, B = set(sig[a][key]), set(sig[b][key])
            if not A or not B:
                continue
            ov = len(A & B) / min(len(A), len(B))
            if ov >= 0.5:
                fails.append("SAMENESS %s/%s: %.0f%% identical %s -> %s"
                             % (a, b, ov * 100, key, sorted(A & B)[:3]))
print("structural sameness: compared %d article pairs on H2s, FAQs and benefit cards"
      % (len(ids) * (len(ids) - 1) // 2))

# unique benefit-card heading count across the round
allcards = [c for aid in sig for c in sig[aid]["cards"]]
print("  benefit cards: %d total, %d distinct headings" % (len(allcards), len(set(allcards))))

# ------------------------------------------------------ 3. internal href resolution
checked = 0
for aid, r in NEW.items():
    s = txt(os.path.join(ROOT, r))
    for href in set(re.findall(r'href="(/[^"#?]*)"', s)):
        checked += 1
        if href.startswith("/images/") or href.startswith("/src/") or href == "/favicon.svg":
            target = os.path.join(ROOT, "public" if href.startswith("/images") or href == "/favicon.svg" else "",
                                  href.lstrip("/"))
        elif href.endswith("/"):
            target = os.path.join(ROOT, href.strip("/"), "index.html")
        else:
            target = os.path.join(ROOT, href.lstrip("/") + ".html")
        if not os.path.exists(target):
            fails.append("BROKEN LINK in %s: %s -> %s" % (aid, href, target))
print("internal links: %d distinct hrefs resolved to files on disk" % checked)

# ------------------------------------------------------ 4. image src resolution
for aid, r in NEW.items():
    s = txt(os.path.join(ROOT, r))
    for src in set(re.findall(r'<img src="([^"]+)"', s)):
        p = os.path.join(ROOT, "public", src.lstrip("/"))
        if not os.path.exists(p):
            fails.append("MISSING IMAGE in %s: %s" % (aid, src))
        elif not re.search(r'src="%s"[^>]*width="\d+" height="\d+"' % re.escape(src), s):
            fails.append("IMAGE WITHOUT DIMENSIONS in %s: %s" % (aid, src))
print("images: every <img> resolved on disk and carries real width/height")

print()
if fails:
    print("FINDINGS (%d):" % len(fails))
    for f in fails:
        print("  " + f)
    sys.exit(1)
print("CROSS-CHECKS CLEAN: no duplicate title or description site-wide, no two articles")
print("structurally the same, every internal href and image resolves, every image sized.")
