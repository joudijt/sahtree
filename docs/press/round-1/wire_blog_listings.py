import json, re, io, sys

ROOT = r"E:\sahtree"
with open(f"{ROOT}\\docs\\press\\round-1\\wire-data.json", encoding="utf-8") as f:
    data = json.load(f)

DATE = data["date"]
DATE_HUMAN = {"en": "August 25, 2026", "ms": "25 Ogos 2026", "ar": "25 أغسطس 2026"}

def read_min(words):
    m = max(1, round(words / 160))
    return m

def make_card(lang, art, delay):
    a = art[lang]
    read = read_min(a["words"])
    if lang == "en":
        unit = "min read"; dateHuman = DATE_HUMAN["en"]
    elif lang == "ms":
        unit = "minit bacaan"; dateHuman = DATE_HUMAN["ms"]
    else:
        unit = "دقائق قراءة"; dateHuman = DATE_HUMAN["ar"]
    href = f"/{a['path']}/{a['slug']}"
    img = f"/images/{art['hero']}"
    return f'''      <article class="blog-card" data-aos="fade-up" data-aos-delay="{delay}">
        <a class="blog-card-link" href="{href}">
          <div class="blog-card-thumb">
            <img src="{img}" alt="{a['alt']}" loading="lazy">
          </div>
          <div class="blog-card-body">
            <span class="blog-card-tag">{a['tag']}</span>
            <h2 class="blog-card-title">{a['title']}</h2>
            <p class="blog-card-excerpt">
              {a['excerpt']}
            </p>
            <div class="blog-card-meta">
              <time datetime="{DATE}">{dateHuman}</time>
              <span class="blog-dot" aria-hidden="true">&middot;</span>
              <span>{read} {unit}</span>
            </div>
          </div>
        </a>
      </article>
'''

def make_jsonld(lang, art):
    a = art[lang]
    href = f"https://sihatree.com/{a['path']}/{a['slug']}"
    headline = a["title"].replace('"', '\\"')
    return f'''      {{
        "@type": "BlogPosting",
        "headline": "{headline}",
        "url": "{href}",
        "datePublished": "{DATE}",
        "author": {{ "@type": "Organization", "@id": "https://sihatree.com/#organization", "name": "Sihatree" }}
      }}'''

def wire_file(path, lang):
    with open(path, encoding="utf-8") as f:
        html = f.read()

    # ---- cards: insert before the grid-closing "</div>\n  </main>" ----
    main_close = "\n    </div>\n  </main>"
    idx_main = html.rindex(main_close)
    # find start of last <article class="blog-card" ...> before idx_main, just to sanity check structure
    last_article_open = html.rfind('<article class="blog-card"', 0, idx_main)
    assert last_article_open != -1, f"no blog-card article found before main close in {path}"

    start_delay = 4300
    cards = ""
    for i, art in enumerate(data["articles"]):
        cards += make_card(lang, art, start_delay + i * 100)
    new_html = html[:idx_main] + "\n" + cards + html[idx_main:]

    # ---- jsonld: insert before the blogPost array's closing "]" ----
    arr_key = html.index('"blogPost": [')
    arr_close = new_html.index("\n    ]", arr_key)  # note: offset shifts because we already modified new_html but arr_key search should be redone on new_html
    arr_key2 = new_html.index('"blogPost": [')
    arr_close2 = new_html.index("\n    ]", arr_key2)
    entries = ",\n".join(make_jsonld(lang, art) for art in data["articles"])
    final_html = new_html[:arr_close2] + ",\n" + entries + new_html[arr_close2:]

    with open(path, "w", encoding="utf-8") as f:
        f.write(final_html)
    print(f"wired {path}: +{len(data['articles'])} cards, +{len(data['articles'])} jsonld entries")

wire_file(f"{ROOT}\\blog.html", "en")
wire_file(f"{ROOT}\\ms\\blog.html", "ms")
wire_file(f"{ROOT}\\ar\\blog.html", "ar")
print("done")
