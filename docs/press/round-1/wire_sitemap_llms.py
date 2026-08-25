import json, re

ROOT = r"E:\sahtree"
with open(f"{ROOT}\\docs\\press\\round-1\\wire-data.json", encoding="utf-8") as f:
    data = json.load(f)

# ---------------- sitemap.xml ----------------
sm_path = f"{ROOT}\\public\\sitemap.xml"
with open(sm_path, encoding="utf-8") as f:
    sm = f.read()

def url_block(a_en, a_ms, a_ar, which):
    urls = {
        "en": f"https://sihatree.com/blog/{a_en['slug']}",
        "ms": f"https://sihatree.com/ms/blog/{a_ms['slug']}",
        "ar": f"https://sihatree.com/ar/blog/{a_ar['slug']}",
    }
    loc = urls[which]
    return (
        "  <url>\n"
        f"    <loc>{loc}</loc>\n"
        f"    <xhtml:link rel=\"alternate\" hreflang=\"en-MY\" href=\"{urls['en']}\" />\n"
        f"    <xhtml:link rel=\"alternate\" hreflang=\"ms-MY\" href=\"{urls['ms']}\" />\n"
        f"    <xhtml:link rel=\"alternate\" hreflang=\"ar-MY\" href=\"{urls['ar']}\" />\n"
        f"    <xhtml:link rel=\"alternate\" hreflang=\"x-default\" href=\"{urls['en']}\" />\n"
        "  </url>\n"
    )

blocks = []
for art in data["articles"]:
    for which in ("en", "ms", "ar"):
        blocks.append(url_block(art["en"], art["ms"], art["ar"], which))

insertion = "\n" + "\n".join(blocks) + "\n"
assert sm.rstrip().endswith("</urlset>")
new_sm = sm.replace("\n</urlset>", insertion + "</urlset>")
with open(sm_path, "w", encoding="utf-8") as f:
    f.write(new_sm)
print(f"sitemap: +{len(blocks)} <url> blocks")

# ---------------- llms.txt x3 ----------------
LLMS = {
    "en": f"{ROOT}\\public\\llms.txt",
    "ms": f"{ROOT}\\public\\ms\\llms.txt",
    "ar": f"{ROOT}\\public\\ar\\llms.txt",
}

for lang, path in LLMS.items():
    with open(path, encoding="utf-8") as f:
        txt = f.read()

    # bump the "(43 ... articles)" style count to 49 on the blog index line
    if lang == "en":
        txt = txt.replace("(43 English articles)", "(49 English articles)")
    elif lang == "ms":
        txt = txt.replace("(43 artikel Bahasa Malaysia)", "(49 artikel Bahasa Malaysia)")
    else:
        txt = txt.replace("43 مقالًا", "49 مقالًا")

    lines = []
    for art in data["articles"]:
        a = art[lang]
        href = f"https://sihatree.com/{a['path']}/{a['slug']}"
        lines.append(f"- {href} — {a['title']}")
    new_block = "\n".join(lines) + "\n"

    # insert right after the last existing "- https://sihatree.com/{lang-prefix}/blog/..." line,
    # i.e. before the next blank-line-terminated section. Find the LAST "/blog/" index line and
    # insert after its line end.
    prefix = "https://sihatree.com/blog/" if lang == "en" else f"https://sihatree.com/{lang}/blog/"
    last_idx = txt.rfind(f"- {prefix}")
    assert last_idx != -1, f"no existing blog page-index line found for {lang}"
    line_end = txt.index("\n", last_idx) + 1
    new_txt = txt[:line_end] + new_block + txt[line_end:]

    with open(path, "w", encoding="utf-8") as f:
        f.write(new_txt)
    print(f"{path}: +{len(lines)} page-index lines")

print("done")
