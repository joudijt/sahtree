# -*- coding: utf-8 -*-
"""PRESS round 2 — Stage 6 mechanical pre-flight on the DRAFTS.

Runs before anything is rendered, so a ceiling breach never reaches an HTML file.
Everything here is a hard fail except the lines marked WARN.
"""
import glob
import html
import io
import json
import os
import re
import sys

RD = os.path.dirname(os.path.abspath(__file__))

BANNED = [
    # site-wide ruling 2026-07-26 (EN)
    "certified", "certification", "official", "verified", "verification",
    "accredited", "accreditation", "trusted", "authentic", "authenticity",
    "guarantee", "guaranteed",
    # Malay equivalents
    "disahkan", "pengesahan", "rasmi", "diperakui", "perakuan", "dijamin",
    "terjamin", "diiktiraf",
]
# "sah" alone is a normal Malay word (sah/tidak sah) - only the accreditation
# forms above are banned. Arabic \b is dead on Arabic text and is not used here.

CLAIM = [
    r"\bcure[sd]?\b", r"\btreats?\b", r"\btreatment for\b", r"\bprevents?\b",
    r"\bheals?\b", r"\breverses?\b", r"\bboosts?\b", r"\bmay help (with|to)\b",
    r"\bproven to\b", r"\bclinically proven\b",
    r"\bmerawat\b", r"\bmenyembuhkan\b", r"\bmencegah\b", r"\bpenawar\b",
    r"\bmeningkatkan tenaga\b", r"\bmenurunkan kolesterol\b",
    r"\bmengawal kolesterol\b", r"\bmembantu menurunkan\b",
    r"\bmenyokong stamina\b", r"\bmeningkatkan testosteron\b",
]
SUPER = [
    r"\bthe best\b", r"\bnumber one\b", r"\b#1\b", r"\bworld'?s leading\b",
    r"\bterbaik di\b", r"\bnombor satu\b", r"\bpaling berkesan\b",
]
PRICE = [r"\bRM\s?\d", r"\bMYR\s?\d", r"\$\d", r"\bharga serendah\b", r"\bfrom RM\b"]
BADANCHOR = [r">\s*click here\s*<", r">\s*read more\s*<", r">\s*klik di sini\s*<",
             r">\s*baca lagi\s*<", r">\s*di sini\s*<"]
BADICON = ["fa-wheat-awn", "fa-people-group", "fa-mango", "fa-stomach",
           "fa-house-laptop", "fa-people-roof", "fa-band-aid"]
TOWNS_OK = {"ampang", "kajang", "shah alam", "gombak"}
TOWNS_BAD = ["petaling jaya", "subang", "johor bahru", "penang", "ipoh",
             "kuantan", "kota kinabalu", "kuching", "melaka", "seremban"]

fails, warns = [], []


def F(aid, msg):
    fails.append(f"{aid}: {msg}")


def W(aid, msg):
    warns.append(f"{aid}: {msg}")


def text_of(d):
    t = d["lede"] + " " + d["bodyHtml"] + " " + " ".join(
        f["q"] + " " + f["a"] for f in d["faqs"])
    return html.unescape(re.sub(r"<[^>]+>", " ", t))


def main():
    drafts = {}
    for p in sorted(glob.glob(os.path.join(RD, "draft-*.json"))):
        aid = os.path.basename(p)[6:-5]
        drafts[aid] = json.load(io.open(p, encoding="utf-8"))

    focus = {}
    for aid, d in sorted(drafts.items()):
        body, lede = d["bodyHtml"], d["lede"]
        plain = text_of(d).lower()

        # --- keywords -------------------------------------------------
        k = (d["lang"], d["focus"].strip().lower())
        if k in focus:
            F(aid, f"CANNIBALISATION with {focus[k]} on focus '{d['focus']}'")
        focus[k] = aid
        for field in ("h1", "title", "description"):
            if d["focus"].lower() not in d[field].lower():
                (F if field == "h1" else W)(aid, f"focus not in {field}")
        if d["focus"].lower() not in lede.lower():
            W(aid, "focus not in the key takeaway")

        # --- meta -----------------------------------------------------
        if len(d["title"]) + 11 > 60:
            F(aid, f"<title> would be {len(d['title']) + 11} chars (>60)")
        if not 100 <= len(d["description"]) <= 155:
            F(aid, f"description {len(d['description'])} chars (want 100-155)")
        for f in ("ogTitle", "ogDescription", "twitterDescription", "tag",
                  "excerpt", "heroCaption", "breadcrumbName"):
            if not d.get(f, "").strip():
                F(aid, f"empty {f}")

        # --- structure ------------------------------------------------
        h2 = re.findall(r"<h2[^>]*>(.*?)</h2>", body, re.S)
        if not 5 <= len(h2) <= 7:
            F(aid, f"{len(h2)} H2 sections (want 5-7)")
        for m in re.finditer(r"</h2>\s*", body):
            nxt = body[m.end():m.end() + 3].lower()
            if not nxt.startswith("<p"):
                F(aid, "an H2 is not followed directly by a <p> answer paragraph")
        for m in re.finditer(r"</h2>\s*<p[^>]*>(.*?)</p>", body, re.S):
            n = len(re.sub(r"<[^>]+>", " ", m.group(1)).split())
            if not 35 <= n <= 80:
                W(aid, f"answer paragraph is {n} words (want 40-70)")
        if body.count("<table") != 1:
            F(aid, f"{body.count('<table')} tables (want exactly 1)")
        if "blog-table-wrap" not in body:
            F(aid, "table is not inside .blog-table-wrap (mobile overflow)")
        if body.count("blog-inline-cta") != 1:
            F(aid, f"{body.count('blog-inline-cta')} inline CTAs (want 1)")
        grids = body.count("blog-benefit-grid")
        if grids != 1:
            F(aid, f"{grids} benefit grids (want 1)")
        cards = body.count("blog-benefit-card")
        if cards != 6:
            F(aid, f"{cards} benefit cards (site rule: exactly 6)")
        for bad in ("<h1", "<script", "<style", "blog-faq", "blog-related", "<img"):
            if bad in body.lower():
                F(aid, f"body contains {bad}")
        if re.search(r"\{\{[A-Z0-9_]+\}\}", body + lede):
            F(aid, "unrendered {{PLACEHOLDER}} token")

        # --- length ---------------------------------------------------
        n = (len(re.sub(r"<[^>]+>", " ", html.unescape(lede)).split())
             + len(re.sub(r"<[^>]+>", " ", html.unescape(body)).split())
             + sum(len(f["a"].split()) for f in d["faqs"]))
        if not 800 <= n <= 1000:
            F(aid, f"{n} draft words (band 800-1000)")
        lw = len(re.sub(r"<[^>]+>", " ", html.unescape(lede)).split())
        if not 40 <= lw <= 62:
            F(aid, f"key takeaway is {lw} words (want 40-60)")

        # --- FAQ ------------------------------------------------------
        if not 6 <= len(d["faqs"]) <= 8:
            F(aid, f"{len(d['faqs'])} FAQs (want 6-8)")
        for f in d["faqs"]:
            aw = len(f["a"].split())
            if not 35 <= aw <= 80:
                W(aid, f"FAQ answer {aw} words: {f['q'][:45]}")
            if "<" in f["q"] + f["a"]:
                F(aid, "FAQ contains HTML")

        # --- links ----------------------------------------------------
        links = re.findall(r'href="(/[^"]*)"', body)
        if not 3 <= len(links) <= 6:
            F(aid, f"{len(links)} internal links (want 3-5)")
        money = "/ms/products" if d["lang"] == "ms" else "/products"
        if money not in links:
            W(aid, f"no link to {money}")
        for pat in BADANCHOR:
            if re.search(pat, body, re.I):
                F(aid, "non-descriptive anchor text")

        # --- bans -----------------------------------------------------
        for b in BANNED:
            if re.search(r"\b" + b + r"\b", plain):
                F(aid, f"BANNED word '{b}'")
        for pat in CLAIM:
            for m in re.finditer(pat, plain, re.I):
                seg = plain[max(0, m.start() - 90):m.end() + 90]
                W(aid, f"CLAIM PATTERN '{m.group(0)}' -> ...{seg.strip()}...")
        for pat in SUPER:
            if re.search(pat, plain, re.I):
                F(aid, f"superlative {pat}")
        for pat in PRICE:
            if re.search(pat, plain, re.I):
                F(aid, f"price-shaped string {pat}")
        for i in BADICON:
            if i in body:
                F(aid, f"broken Font Awesome icon {i}")
        for t in TOWNS_BAD:
            if t in plain:
                W(aid, f"names a town with no branch: '{t}' — must be delivery-only framing")
        if "jakim" in plain or "halal" in plain:
            if "tiada sijil" not in plain and "no jakim certificate" not in plain \
                    and "tidak memegang sijil" not in plain:
                F(aid, "Halal/JAKIM raised without the no-certificate sentence in the same text")
        for g in ("mydin", "lotus", "tesco", "jaya grocer", "village grocer",
                  "aeon", "99 speedmart", "al-ikhsan", "arabian nights"):
            if g in plain:
                F(aid, f"names a grocery other than Berkat Madinah Store: '{g}'")

    print(f"--- checked {len(drafts)} drafts ---")
    for w in warns:
        print("  WARN  " + w)
    print()
    for f in fails:
        print("  FAIL  " + f)
    print(f"\n{len(fails)} failures, {len(warns)} warnings")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
