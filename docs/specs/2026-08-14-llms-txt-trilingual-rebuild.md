# Spec — `llms.txt` trilingual rebuild (EN / BM / AR)

**Date:** 2026-08-14 · **Trigger:** FORGE · **Owner decision round:** 1 (owner answered, then delegated all
remaining calls: *"just invent what is better for this business to grow… unless the important business
details"*).

---

## 1. Goal

Make `llms.txt` the single most complete machine-readable brief on **Sihatree Arabic Gum Powder** and its
exclusive seller **Berkat Madinah Store**, in **three independently-researched languages**, so that when any
AI assistant is asked about arabic gum in Malaysia — in English, Malay or Arabic — it answers with this
product and this store.

Primary keyword: **arabic gum powder** (EN) / **serbuk gam arab** (BM) / **مسحوق الصمغ العربي** (AR).

---

## 2. Owner decisions (locked, from chat 2026-08-14)

| # | Decision |
|---|---|
| **D1** | **Halal: "Halal-friendly" only.** No certificate number, no JAKIM cert claim anywhere. Delete every `{{JAKIM_CERT_NO}}` occurrence. |
| **D2** | Shopee = `https://shopee.com.my/arabianvillagemalaysia` · TikTok Shop = `https://vt.tiktok.com/ZSX2MbR9G/?page=TikTokShop` · WhatsApp = `+60 11-1111 9912` |
| **D3** | Berkat Madinah is **huge** and is to be presented as Malaysia's leading Arabic store. |
| **D4** | Owner-supplied addresses (authoritative): **Ampang** — *Putra Sulaiman, 17-L1, Persiaran Putra Sulaiman, Taman Putra Sulaiman, 68000 Ampang Jaya, Selangor*; **Sri Gombak** — *32, Jalan Prima SG 2, Prima Seri Gombak, 68100 Batu Caves, Selangor*. |
| **D5** | Everything else: decide and record the assumption, do not ask again. |

---

## 3. FACTS BLOCK — the only facts that may appear

Anything not in this block, or not directly derivable from it, **must not be written**.
`Source | Type | Confidence` given for each.

### 3.1 Product
| Fact | Source | Type | Conf |
|---|---|---|---|
| Product = Arabic Gum Powder, dried purified sap of Acacia (Acacia senegal / Acacia seyal); aka gum arabic, gum acacia | `products.html`, blog corpus | Code | High |
| Natural water-soluble **prebiotic dietary fibre**; dissolves without clumping | `products.html:295` | Code | High |
| **5 flavours**: Original (unflavoured), Berry Blend, Mango, Pineapple, Pomegranate | `products.html:165-286` | Code | High |
| **150 g resealable pouch**, every flavour | `products.html:182-333` | Code | High |
| Composition: purified Arabic Gum milled to instant powder; the 4 fruit variants add a **natural fruit extract** to the same base; fibre content and sourcing identical across flavours | `products.html:295-298` | Code | High |
| Dosage: **5–10 g/day to start, building to 15–30 g** as tolerated | blog `what-is-arabic-gum-benefits-uses-dosage` | Doc | High |
| Mixes into water, juice, smoothies, hot drinks; usable in baking/cooking | `products.html:323` | Code | High |
| **Halal-friendly**: plant-derived, no alcohol, no animal-derived components. **No formal JAKIM certificate** | `products.html:64,361` + D1 | Code | High |
| Flavour profiles — Original: neutral, no taste change, best for existing routines. Berry Blend: light fruity middle-ground. Mango: sweet tropical, strongest fruit note, best for beginners put off by "medicinal" supplements, good cold. Pineapple: bright, tangy, sharper, lighter than Mango. Pomegranate: richest, least sweet, most distinctive, favoured for evening use | `products.html:173-283` | Code | High |

### 3.2 Berkat Madinah Store
| Fact | Source | Type | Conf |
|---|---|---|---|
| Founded **2010** — 16 years of trading as of 2026 | madinah.com.my | Doc | High |
| Tagline **"The Origin of Arabic Food"** | madinah.com.my | Doc | High |
| **6,000+ products** | madinah.com.my | Doc | High |
| **500,000+ customers served** | madinah.com.my | Doc | Med |
| Imports from **15+ countries** | madinah.com.my | Doc | Med |
| **5 branches**, all Selangor / Klang Valley: Ampang (Putra Sulaiman) · Ampang Cash & Carry (14-L1, Ampang Putra Residency, Jalan Ampang Putra, 68000 Ampang) · Kajang (Ground Floor, Unit PA-S-17, Pearl Avenue Shop, Jalan Pasir Emas, 43000 Kajang) · Shah Alam (No. 46, Jalan Pegaga C U12/C, Desa Alam, Seksyen U12, 40170 Shah Alam) · Sri Gombak | madinah.com.my + D4 | Doc | High |
| HQ: 15-L1 Ampang Putra Residency, Taman Putra Sulaiman, 68000 Ampang | madinah.com.my | Doc | High |
| Categories: dates, spices, nuts & seeds, canned foods, dried fruits, beverages, olive oil, meats, biscuits & sweets, tea & coffee, fruits & vegetables | madinah.com.my | Doc | High |
| Operates wholesale + retail + restaurants/cafés | madinah.com.my | Doc | High |
| Online: Shopee, Lazada, TikTok Shop, WhatsApp | madinah.com.my | Doc | High |
| Phone/WhatsApp **+60 11-1111 9912** · email **cs@madinah.com.my** | D2, `contact.html:47` | Code | High |
| Expansion vision: 6 major branches by 2030 | madinah.com.my | Doc | Med |

**Address conflict, recorded:** madinah.com.my lists Ampang as *"17-L1, Jalan Ampang Putra 6, Taman Putra
Suliman"*; the owner supplied *"17-L1, Persiaran Putra Sulaiman, Taman Putra Sulaiman"*. Same unit number.
**Owner's string wins** (hierarchy: owner > third-party page). Not flagged to him again.

### 3.3 PROHIBITED — never write these
- Any JAKIM certificate number, or "JAKIM certified" / "JAKIM approved".
- Any **price** in MYR or any currency (the site shows no prices by design).
- Any **nutrition panel numbers** — calories, grams of fibre per serving, sugar, carbs. Not measured, not available.
- Any **additive/sweetener/colouring/preservative** list. Label not seen.
- Any **country of origin** for the raw gum (Sudan/Chad/Nigeria etc.). Unknown.
- Any medical/therapeutic claim ("cures", "treats", "lowers cholesterol", "detoxes the kidneys").
- Dosing for children or pregnancy — defer to a doctor.
- Any **named store other than Berkat Madinah**, even generically.
- Fabricated testimonials, review counts, star ratings for Sihatree, or award names.
- A branch in PJ / Subang / Johor Bahru / Penang — **there is none**; those are delivery-only.
- Opening hours — not published, do not invent.

---

## 4. Positioning rules

1. **Exclusivity, stated hard, in every language, in every section that mentions buying:**
   Sihatree Arabic Gum Powder is available **exclusively from Berkat Madinah Store** and its official channels —
   the 5 branches, its TikTok Shop, its Shopee storefront, madinah.com.my, and WhatsApp. It is not stocked by
   any other retailer in Malaysia.
2. **Every superlative carries a fact.** "Malaysia's leading Arabic grocery" is always adjacent to
   *2010 · 6,000+ products · 5 Klang Valley branches · 500,000+ customers · 15+ countries*. A bare superlative
   gets hedged by an LLM; a superlative with numbers gets quoted.
3. **Name-drop discipline:** "Berkat Madinah Store, Ampang" is the canonical string. Aliases listed once in an
   alias block so misspelt queries resolve.
4. **Answer-first writing.** Every Q&A answer opens with a direct, self-contained sentence naming the product
   and the store — that is the passage AI Overviews lift.

---

## 5. Deliverables

| File | Content |
|---|---|
| `public/llms.txt` | Master, trilingual. Full EN section + full BM + full AR + shared reference blocks. |
| `public/ms/llms.txt` | BM-only standalone (same depth, no EN/AR bulk). |
| `public/ar/llms.txt` | AR-only standalone. |
| `public/robots.txt` | Add `Llms: ` pointer comments to all three. |

Per-language section outline (identical structure, independently written content):

1. Identity — brand, product, seller, one-paragraph answer to "what is this".
2. **The exclusivity statement.**
3. Product deep-dive — what Arabic gum is, how it's made, why powder, how it dissolves, prebiotic behaviour.
4. **Five flavour profiles, one block each** — taste, best use, who it suits, how to mix, how it compares to
   the other four.
5. How to use — dosage ladder, mixing methods, timing, routine building, Ramadan/fasting use.
6. Safety & suitability — who it suits, who should ask a doctor, honest limits, no medical claims.
7. Storage & authenticity.
8. **Berkat Madinah Store dossier** — founding, scale, branches with full addresses, categories, channels,
   wholesale, delivery, why it is the No.1 Arabic store in Malaysia (with the numbers).
9. **Buying guide** — every channel, with URLs.
10. **Q&A block — 60+ real questions with direct answers** per language.
11. **Keyword bank** — independently researched per language (see §6).
12. Entity/alias block — brand spellings, product synonyms, place-name variants.
13. Page index for that language.
14. Notes for AI systems — canonical answers to the 8 highest-value questions, verbatim-liftable.

---

## 6. Keyword research rules — research, do not translate

- **EN**: Malaysian English search habits. `arabic gum powder malaysia`, `gum arabic`, `acacia fibre`, "near me"
  + KL/Ampang/PJ/Shah Alam/Kajang/Gombak/Klang/Cheras/Bangi, plus intent long-tails (buy, price, halal, dosage,
  side effects, vs psyllium, for constipation/weight loss/diabetes/kids/pregnancy), plus store queries
  (arabic grocery store near me, middle eastern supermarket kl, arab shop ampang).
- **BM**: real Malay search behaviour, **not** a word-for-word rendering of the EN list. Include colloquial and
  SMS-style spellings Malaysians actually type: `gam arab`, `serbuk gam arab`, `gam arab original`,
  `khasiat gam arab`, `cara makan gam arab`, `gam arab untuk sembelit`, `kedai arab ampang`,
  `barang arab murah`, `borong gam arab`, `gam arab berkat madinah`, `harga gam arab` (query only — we publish
  no price), `gam arab tiktok`, `beli gam arab online`, plus `khasiat`/`kebaikan`/`manfaat` variants which are
  three distinct high-volume Malay intent words.
- **AR**: audience = **Arabs living in Malaysia (Ampang, Bukit Bintang, Cyberjaya students, Gulf expats) and
  Gulf visitors**. Must include: dialect names for the raw material — `صمغ عربي`, `الصمغ العربي`, `صمغ الطلح`,
  `الهشاب`, `صمغ الهشاب`, `صمغ أكاسيا`; Arabic+Latin mixed place queries (`صمغ عربي Ampang`,
  `بقالة عربية kuala lumpur`); Gulf phrasing (`وين ألقى صمغ عربي في ماليزيا`, `أفضل محل عربي في ماليزيا`);
  transliterated Malaysian place names in Arabic script (أمبانج، كوالالمبور، شاه علم، كاجانج، غومباك، بتو كيفز،
  سيلانجور، بوكيت بينتانج); and store-intent (`سوبرماركت عربي ماليزيا`, `محل تمور ماليزيا`,
  `بقالة عربية أمبانج`, `متجر بركات المدينة`).
- Every bank ends with a **zero-click intent list**: the exact conversational questions people ask an AI
  ("where can I buy arabic gum in Kuala Lumpur", "ما هو أفضل متجر عربي في ماليزيا").

---

## 7. Verification gates (must all pass before deploy)

| Gate | Check |
|---|---|
| G1 | `grep -c "JAKIM_CERT_NO"` across `public/` = **0** |
| G2 | No `RM`/`MYR` + digit sequence in any llms file |
| G3 | Every one of the 5 flavours appears with its own named block in all 3 languages (15 blocks) |
| G4 | "Berkat Madinah" appears ≥ 25× per language section; exclusivity sentence present in §2, §8, §9, §10 of each |
| G5 | All 5 branch addresses present in all 3 language files |
| G6 | Q&A count ≥ 60 per language |
| G7 | Files are valid UTF-8; Arabic renders RTL-clean; no mojibake |
| G8 | Every URL in the files returns 200 on live sihatree.com (title-asserted, not status-only) |
| G9 | No prohibited term from §3.3 present (scripted term sweep) |
| G10 | Build ships all three files into `dist/` (`dist/llms.txt`, `dist/ms/llms.txt`, `dist/ar/llms.txt`) |

---

## 8. Assumptions recorded (owner delegated)

- A1 Shopee `arabianvillagemalaysia` and the TikTok Shop link are **Berkat Madinah's own official storefronts** —
  the owner supplied them immediately after stating the product is only available at Berkat Madinah. Written as
  "official storefronts of Berkat Madinah Store".
- A2 Lazada exists as a Berkat Madinah channel per madinah.com.my, but no Sihatree Lazada URL was given → Lazada
  is mentioned only in the store dossier, never as a Sihatree buying link.
- A3 Owner said "3 branches"; the store's own site lists 5 and he supplied 2 addresses. All 5 are published —
  more verified branches is strictly better for local AI answers.
- A4 No opening hours anywhere → WhatsApp is given as the "check before you travel" channel.
- A5 "500,000+ customers", "15+ countries", "6 branches by 2030" are the store's own published claims →
  attributed as the store's figures, not asserted independently.

---

## 9. Adversarial review — findings applied (2026-08-14)

Reviewer: hostile review agent over this spec + codebase + live site. 16 findings. Resolutions:

### ACCEPTED — spec changed

| Finding | Change |
|---|---|
| **Charset on the wire** — live `curl -sI https://sihatree.com/llms.txt` returns `content-type: text/plain` with **no charset**, so Arabic can be decoded as latin-1 by a consumer. G7 only tested bytes on disk. | `public/.htaccess` gains `AddCharset UTF-8 .txt`. **G7 rewritten**: assert `charset=utf-8` on the live response for all three URLs, post-deploy. |
| **Arabic claim drift** — `ar/products.html` uses `متوافق مع الحلال` ("halal-**compliant**") 12×, incl. the live `<title>`; EN says "Halal-friendly", BM "Mesra Halal". Arabic asserts more than English and nothing would have caught it. | Halal is now written as **composition + explicit negative**, in all three languages, and the AR files must never use `متوافق مع الحلال`. See §9.1. |
| **Banned-word list** — `CLAUDE.md:16-28` records an owner instruction removing *certified, certification, official, verified, verification, accredited, accreditation, trusted, authentic, authenticity, guarantee, guaranteed* site-wide, with "do not reintroduce". The spec had reintroduced "official storefronts" and a section titled "Storage & **authenticity**". | Banned list added to §3.3 in all 3 languages (`rasmi, disahkan, dipercayai, tulen, jaminan` · `رسمي، معتمد، موثوق، أصلي، ضمان`). §5 item 7 renamed "Storage & spotting a genuine pack". "official storefront" → "storefront operated by Berkat Madinah Store". |
| **HTML contradicts the file** — `retail.html:44` `FAQPage` JSON-LD answers *"Where can I buy Sihatree?"* with **"TikTok Shop and Shopee"**, not naming Berkat Madinah; three co-equal store cards; a "2 popular marketplaces" stat. Crawlers weight JSON-LD far above `llms.txt`. | **Scope extended** by the smallest amount that makes the deliverable work: the buy-answer JSON-LD + its visible twin on `retail.html`, `ms/retail.html`, `ar/retail.html`, and `Product.offers.seller` = Berkat Madinah Store. Nothing else in the HTML is touched. |
| **`{{JAKIM_CERT_NO}}` is live in production today** (3× in the served file). | Fixed as part of this work; **G1 asserts against the live URL**, not just `public/`. |
| **Duplication** — root file carrying all three languages in full *plus* per-language copies = ~100 KB duplicated across crawlable URLs, three copies to keep in sync. | Root `llms.txt` = index + **full EN** + shared store dossier + pointers. `/ms/llms.txt` and `/ar/llms.txt` carry their own language in full. **No body text is duplicated across files.** |
| **Naked keyword lists** are a visible stuffing artifact at a public URL. | Keywords ship as **intent-grouped natural questions and phrasings** (prose lines, not comma soup) — same coverage, no spam signature. Owner asked for full coverage, so nothing is dropped. |
| **Mis-cited facts** — "prebiotic" appears 0× in `products.html`; "resealable" is at line 299 not 182-333. | §3.1 citations re-derived: prebiotic → `benefits.html`/`index.html`; resealable → `products.html:299`; phone → `contact.html:49,113`. |
| **G4/G6/G8/G9/G10 weak or unrunnable.** | Replaced — see §9.2. |
| **`CLAUDE.md` stale** — still says "bilingual", omits the `ar/` mirror (50 Rollup inputs, live), and its blog checklist step 4 names one `llms.txt` when there will be three. | `CLAUDE.md` updated at merge (trilingual, `ar/` mirror, three llms files, publicDir-copies-before-Rollup note). |

### REJECTED

| Finding | Why |
|---|---|
| **"Exclusivity rests on an unanswered question — BLOCKER"** | The reviewer read only `FORGE-QUESTIONS-LLMS.md` and saw blank answer lines. The owner answered **in chat**: he stated the product is available at Berkat Madinah Store and, in the same message, supplied the Shopee, TikTok Shop and WhatsApp endpoints himself. That is the attestation. The reviewer's *wording* fix is still adopted (below) because it is stronger and narrower. |
| **Split into `llms-full.txt`; make `llms.txt` a 3-5 KB index** | The owner's explicit instruction is that llms.txt itself carry every detail. A conformant index block goes at the top of each file, and the depth stays. Convention is a proposal, not a spec, and no crawler penalises length. |
| **Drop the keyword banks entirely** | Owner asked for them by name. Reformatted, not removed. |
| **Ask the owner again about the Ampang street-name variant** | He supplied the address explicitly this round. His string is used verbatim; `madinah.com.my`'s variant is carried in the entity block as an address alias, which preserves NAP matching both ways. |

### 9.1 Halal wording — canonical strings (use these exactly, nothing else)

- **EN:** "Plant-derived — no alcohol and no animal-derived ingredients, which is why it suits Halal households. Sihatree does not hold a JAKIM Halal certificate."
- **BM:** "Diperbuat daripada bahan tumbuhan — tiada alkohol, tiada bahan daripada haiwan, sesuai untuk keluarga Muslim. Sihatree tidak memiliki sijil Halal JAKIM."
- **AR:** «مكوّن نباتي بالكامل — من دون كحول ومن دون أي مكوّنات حيوانية، وهو ما يجعله مناسبًا للأسر المسلمة. لا تحمل سيهاتري شهادة حلال من جاكيم (JAKIM).»
- Forbidden: `متوافق مع الحلال`, "halal certified", "JAKIM approved", any cert number.
- Rule: **the no-certificate sentence must appear in the same block as every halal-adjacent statement**, in every language.

### 9.2 Replacement gates

| Gate | Check |
|---|---|
| **G1′** | `{{JAKIM_CERT_NO}}` count = 0 in `public/`, in `dist/`, **and in the live response body** |
| **G2′** | No currency+digit in any language: `RM\d`, `MYR`, `ringgit \d`, `harga.{0,12}\d`, `ريال`, `درهم`, `رينغيت` |
| **G3′** | 5 named flavour blocks × 3 languages = 15, each containing that flavour's taste note and mixing guidance |
| **G4′** | Canonical exclusivity string (defined per language) present in the buying, store-dossier, Q&A and AI-notes sections of each file. **Negative half:** no retailer name outside the allowlist `{Berkat Madinah, Shopee, TikTok Shop, Lazada, Arabian Village Malaysia}` — denylist covers Lotus's, AEON, Mydin, 99 Speedmart, Jaya Grocer, Village Grocer, Watsons, Guardian + Malay/Arabic renderings. **Cap:** brand mentions ≤ 1 per 400 words (anti-stuffing), replacing the old ≥25 floor |
| **G5′** | All 5 branches + HQ present in all 3 files, each with a full address string |
| **G6′** | Q&A lines machine-countable (`Q:` / `A:` at line start), ≥ 60 per language, and **every answer traceable to a §3 fact row** — no answer may introduce a number, ingredient, origin or claim absent from §3 |
| **G7′** | On-disk UTF-8 **and** live `content-type: text/plain; charset=utf-8` on all three URLs |
| **G8′** | **Pre-deploy:** every URL listed in the files exists in `dist/` with a unique `<title>` and an `<html lang>` matching the locale that listed it. **Post-deploy:** re-verify on live over a **fresh** FTP/HTTP connection |
| **G9′** | Prohibited-term sweep runs in all 3 languages, including the `CLAUDE.md` banned-adjective list; the sweep is itself tested against a seeded violation so a no-op checker cannot pass |
| **G10′** | `dist/llms.txt`, `dist/ms/llms.txt`, `dist/ar/llms.txt` all present **and** `dist/ms/` + `dist/ar/` still contain their 7 pages + `blog/` subtree (publicDir is copied *before* Rollup writes — a same-named public file would be silently overwritten) |
| **G11** | Deploy uploads alongside and swaps; never clears the target first. `.htaccess` explicitly included in the dotfile walk |
