# ROUND-2-MAP — Sihatree PRESS round 2 (GSC-driven)

Written by PRESS Stage 1, 2026-09-10. Branch `press-round-gsc`. Pre-round sha `d15c821`.

## Round shape

15 articles. **12 Bahasa Malaysia (`/ms/blog/`) + 3 English (`/blog/`). No Arabic this round** —
the owner chose Malaysia-first; the `/ar/` cluster is a separate future round. This deliberately
breaks the site's file-for-file EN/MS/AR parity for these 15 topics. See DECISIONS #7.

## Demand data

Pulled from **live Google Search Console + Google Keyword Planner, 2026-09-10** (supplied by the
operator this session; not re-derived by PRESS).

| # | Keyword | Vol/mo | Comp | GSC state today | Lang | Articles |
|---|---|---|---|---|---|---|
| 1 | kedai barangan arab (+ "near me") | 110 | LOW | pos 7.2, 11 impr, **0 clicks** | MS | A1-A3 |
| 2 | khasiat arabic gum untuk lelaki | 110 | MEDIUM | **no page exists** — biggest gap | MS | B1-B3 |
| 3 | kebaikan gam arab | 50 | LOW | not ranking | MS | C1-C3 |
| 4 | gam arab / gam arabic | 480 / 720 | HIGH | not ranking (Malay head term) | MS | D1-D3 |
| 5 | gum arabic benefits / acacia gum benefits | 590 | HIGH | pos 49 | EN | E1-E3 |

**Unaddressable volume discarded:** none. All five families are Malaysia-servable — Sihatree ships
nationwide through Berkat Madinah Store's channels.

**Language reallocation:** the site ships three languages. Arabic gets 0 articles this round
despite having a full `/ar/` tree, because none of the five demand rows is an Arabic query. Budget
moved to Malay (12 of 15).

## Cannibalisation check — against the LIVE sitemap

Pulled `https://sihatree.com/sitemap.xml` on 2026-09-10: **168 URLs** = 49 EN blog + 49 MS blog +
49 AR blog + 21 non-blog. Every existing MS blog slug was listed and compared against every
proposed focus keyword.

### Routed around (existing page keeps its term; the new article takes a different one)

| Existing URL | Term it owns | New article that could have collided | How the collision was avoided |
|---|---|---|---|
| `/ms/blog/kedai-barangan-arab-ampang-...` (+ kajang, shah-alam, gombak) | `kedai barangan arab {bandar}` | A1 | A1 takes `kedai barangan arab near me` — a non-city query the four branch pages cannot serve; A1 links out to all four |
| `/ms/blog/di-mana-beli-gam-arab-malaysia` | `di mana beli gam arab` | A3 | A3 is the **Arabic-grocery category** online-buying guide, not the gum-buying guide; different product scope |
| `/ms/blog/apa-itu-gam-arab-faedah-kegunaan-dos` | `apa itu gam arab` / `faedah gam arab` | C1-C3, D1-D3 | none of the six takes `apa itu` or `faedah`; all six take distinct long-tails |
| `/ms/blog/kajian-saintifik-gam-arab` | `kajian saintifik gam arab` (E414/EFSA/GRAS) | D3, E1 | D3 is about gum arabic **already present in everyday Malaysian food**, not the safety-science review; E1 is an EN benefit-claim audit |
| `/ms/blog/sumber-gam-arab-pokok-akasia-kelestarian` | sourcing and sustainability | D2 | D2 is a **product-form taxonomy** (crystal vs powder, senegal vs seyal), not a supply-chain story |
| `/ms/blog/mitos-gam-arab` | 6 general myths | B2 | B2 is a men's-vitality-specific refusal; no myth overlaps the general six |
| `/ms/blog/gam-arab-untuk-atlet`, `...-warga-emas`, `...-pelajar` | audience articles | B1-B3 | none of those three is male-specific; the men's cluster is new ground |
| `/ms/blog/gam-arab-untuk-pesakit-diabetes-gula-darah` | blood sugar | C2 | C2 is cholesterol — a separate marker, not touched by the diabetes article |
| `/ms/blog/panduan-pemula-30-hari-pertama-gam-arab` | 30-day onboarding schedule | C3 | C3 is a **troubleshooting** article — why nothing changed — not an onboarding calendar |
| `/ms/blog/cara-campur-serbuk-gam-arab-resipi` | mixing technique + recipes | C3, D2 | neither teaches mixing technique |
| `/blog/arabic-gum-vs-psyllium-husk-malaysia`, `...-vs-inulin`, `...-vs-chia-seeds-malaysia` | three fibre comparisons | E3 | guar gum is a **fourth, uncompared** gum; E3 also carries the `acacia gum` naming the site never uses |

### Strengthened (an existing page is improved instead of being competed with)

| URL | Problem | Action this round |
|---|---|---|
| `/ms/benefits` | Its `<title>` is `Kebaikan \| Sihatree — ...`; the meta description already says "kebaikan Serbuk Gam Arab" but the head term is not in the title or the H1, and it is not ranking for `kebaikan gam arab` (50/mo, LOW). It is the **money page** that should own that term — a blog article on it would cannibalise the money page. | Title, meta description, OG/Twitter titles and the hero H1 re-led with **`Kebaikan Gam Arab`**. All three C-cluster articles link up to `/ms/benefits` with `kebaikan gam arab` as the anchor. No structural change. |
| The four `kedai-barangan-arab-{ampang,kajang,shah-alam,gombak}` pages | pos 6-7, 11 impressions, **0 clicks** — they lose the click to the Google Maps local pack, which is what a physical-store query returns. A 5th store page would lose the same way. | Not competed with. A1-A3 take the three **non-map-shaped** intents in the same family: "near me" when you are *not* in Klang Valley (A1), what a store actually stocks (A2), and buying the category online (A3). All three link down into the four branch pages, consolidating the cluster under them. |

### Intra-round check

All 15 focus keywords asserted distinct before writing — no two articles in this round share a
term, and no term is a substring-equivalent of another in the same language.

## The 15 articles

Every article: 800-1,000 words, 5-7 question-shaped H2s, an answer paragraph **as a `<p>` directly
under every H2**, **at least one real `<table>`** (site-wide gap — see GATE), 6-8 FAQs mirrored
exactly into `FAQPage`, plus `BlogPosting` + `FAQPage` + `BreadcrumbList` JSON-LD.

### Cluster A — `kedai barangan arab` (MS, 110/mo, LOW)

| id | slug | H1 | focus keyword | intent |
|---|---|---|---|---|
| A1 | `kedai-barangan-arab-berhampiran-saya` | Kedai Barangan Arab Berhampiran Saya: Cara Cari yang Betul di Malaysia | `kedai barangan arab near me` | local / navigational |
| A2 | `barang-di-kedai-barangan-arab` | Apa Yang Dijual di Kedai Barangan Arab? Senarai Barang Paling Dicari | `barang di kedai barangan arab` | informational |
| A3 | `kedai-barangan-arab-online-malaysia` | Kedai Barangan Arab Online Malaysia: Beli Tanpa Perlu ke Kedai | `kedai barangan arab online` | transactional |

Related keywords by intent — **location**: kedai arab ampang, kedai arab kajang, kedai arab shah
alam, kedai arab gombak, kedai arab lembah klang, kedai arab kuala lumpur; **product**: kurma,
rempah arab, zaitun, gam arab, kacang; **buying**: beli barangan arab online, penghantaran seluruh
Malaysia, borong barangan arab; **comparison**: kedai arab vs pasar raya.

### Cluster B — `khasiat arabic gum untuk lelaki` (MS, 110/mo, MEDIUM) — the strongest three

| id | slug | H1 | focus keyword | intent |
|---|---|---|---|---|
| B1 | `khasiat-arabic-gum-untuk-lelaki` | Khasiat Arabic Gum untuk Lelaki: Apa Yang Betul dan Apa Yang Tidak | `khasiat arabic gum untuk lelaki` | informational, claim-checking |
| B2 | `gam-arab-tenaga-stamina-lelaki` | Gam Arab untuk Tenaga Lelaki: Kenapa Ia Bukan Penguat Stamina | `gam arab untuk tenaga lelaki` | claim-refusal |
| B3 | `gam-arab-kesuburan-lelaki` | Gam Arab dan Kesuburan Lelaki: Apa Yang Kajian Sebenarnya Kata | `gam arab untuk kesuburan lelaki` | claim-refusal |

**Ceiling handling — this cluster is the round's legal risk.** The demand behind
`khasiat arabic gum untuk lelaki` is male vitality, stamina and fertility. Malaysia's Food
Regulations 1985 Reg. 18(6) forbids a food claiming to prevent, treat or cure. All three articles
therefore **capture the query and refuse the claim in the same breath** — the H1 and the key
takeaway both say plainly that Arabic Gum is a dietary fibre food and not a treatment for any
male-health condition. This is the pattern the site already ships on diabetes, weight loss,
pregnancy and constipation. No article may imply a vitality, stamina, fertility, testosterone or
performance effect, hedged or otherwise.

Related keywords — **claim**: tenaga lelaki, stamina lelaki, kesuburan lelaki; **product**: serat
larut, prebiotik, serbuk gam arab, 150g; **usage**: dos harian, bila nak minum, campur air;
**trust**: adakah selamat, kesan sampingan, jumpa doktor.

### Cluster C — `kebaikan gam arab` (MS, 50/mo, LOW) — head term routed to `/ms/benefits`

| id | slug | H1 | focus keyword | intent |
|---|---|---|---|---|
| C1 | `kebaikan-gam-arab-untuk-wanita` | Kebaikan Gam Arab untuk Wanita: Apa Yang Perlu Anda Tahu | `kebaikan gam arab untuk wanita` | informational |
| C2 | `gam-arab-untuk-kolesterol` | Gam Arab dan Kolesterol: Apa Yang Serat Larut Boleh dan Tidak Boleh Buat | `gam arab untuk kolesterol` | claim-checking |
| C3 | `kenapa-gam-arab-tak-berkesan` | Kenapa Anda Belum Rasa Kebaikan Gam Arab? 6 Sebab Biasa | `kenapa gam arab tak berkesan` | troubleshooting |

C2 must not claim cholesterol reduction. C1 must not claim hormonal, fertility, beauty or
menstrual effects.

### Cluster D — `gam arab` / `gam arabic` (MS, 480 / 720, HIGH) — attacked as a cluster, not a page

| id | slug | H1 | focus keyword | intent |
|---|---|---|---|---|
| D1 | `gam-arab-atau-gam-arabic-nama-ejaan` | Gam Arab atau Gam Arabic? Nama, Ejaan dan Maksud Sebenarnya | `gam arabic` | definitional / disambiguation |
| D2 | `jenis-gam-arab-hablur-serbuk` | Jenis Gam Arab: Hablur, Serbuk dan Beza Acacia Senegal vs Seyal | `jenis gam arab` | comparison |
| D3 | `gam-arab-dalam-makanan-harian` | Gam Arab dalam Makanan Harian: Di Mana Ia Sudah Ada Tanpa Anda Sedar | `gam arab dalam makanan` | informational |

A 480/720-a-month HIGH-competition head term is not won by one page. D1 captures the 720/mo
**spelling variant** `gam arabic` that the site has never used anywhere; D2 and D3 are supporting
pages that carry `gam arab` densely and naturally and link up to `/ms/products` and to
`apa-itu-gam-arab-faedah-kegunaan-dos`, which stays the cluster's canonical definitional page.

### Cluster E — `gum arabic benefits` / `acacia gum benefits` (EN, 590/mo, HIGH, pos 49)

| id | slug | H1 | focus keyword | intent |
|---|---|---|---|---|
| E1 | `acacia-gum-benefits-evidence` | Acacia Gum Benefits: What the Evidence Actually Supports | `acacia gum benefits` | informational |
| E2 | `gum-arabic-vs-arabic-gum-naming` | Gum Arabic vs Arabic Gum: Same Thing, Different Name? | `gum arabic vs arabic gum` | disambiguation |
| E3 | `acacia-gum-vs-guar-gum` | Acacia Gum vs Guar Gum: How Two Plant Gums Differ | `acacia gum vs guar gum` | comparison |

**Diagnosis for the pos-49:** the site writes "Arabic Gum" on all 49 English articles and never
writes the searcher's word order, `gum arabic`, or the US/EU trade name `acacia gum`. E1-E3 are the
first three pages on the site to lead with those two naming families.

## Internal linking plan

Every article carries 3-5 outbound internal links: 2 money pages (`/ms/products` + `/ms/retail`,
or `/products` + `/retail`), 2 sibling articles from its own cluster, and 1 topically adjacent
existing article. **Inbound** comes from two places: the blog index card (`ms/blog.html` /
`blog.html`) and one extra `.blog-card` added to the Related Articles rail of a matched existing
article.

## Round payload ceiling

**2.5 MB** for the whole round, set before Stage 4. 15 hero images, WebP, budget 130 KB each =
1.95 MB worst case, plus HTML.

## Rollback

Pre-round sha `d15c821` on `main`; all work on `press-round-gsc`. To revert:
`git checkout main && git branch -D press-round-gsc`. Nothing outside the branch is touched.
