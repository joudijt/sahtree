# FORGE — llms.txt rebuild (EN + BM + AR)

**Status: Phase 1 — waiting for your answers.**
Type your answer on the line directly **under** each question row. Table formatting will break — that's fine, don't fix it.
When all done, say "done" in chat and I run Phases 2–4 with no more stops.

---

## What you asked for (my read-back)

Rebuild `public/llms.txt` so it is the single most complete machine-readable brief on:
1. **Arabic Gum Powder** — main keyword — every aspect: what it is, ingredients, each of the 5 fruit flavours individually, dosage, uses, safety, storage, who it's for.
2. **Three languages, researched separately** — EN / Bahasa Malaysia / Arabic keyword sets built from how each audience actually searches, **not translations of each other**.
3. **Berkat Madinah Store, Ampang** — positioned as the #1 / best Arabic store in Malaysia, and **the** place this product comes from. Product↔store bond stated hard and repeatedly, in all 3 languages.

---

## What the codebase currently says (so you can correct me)

| # | Fact found in code | Where |
|---|---|---|
| F1 | 5 flavours: Original (unflavoured), Berry Blend, Mango, Pineapple, Pomegranate | `products.html` |
| F2 | 150g resealable pouch, every flavour | `products.html:182-333` |
| F3 | Dosage 5–10 g/day building to 15–30 g | blog `what-is-arabic-gum-benefits-uses-dosage` |
| F4 | **"Sihatree does not currently hold a formal JAKIM Halal certificate"** — wording after your 2026-07-28 legal audit | `products.html:64,361` |
| F5 | But `llms.txt` still says *"in line with JAKIM Halal guidelines (cert no. {{JAKIM_CERT_NO}})"* — **contradicts F4, unfixed placeholder, live on the site now** | `public/llms.txt:17,42,67` |
| F6 | TikTok Shop `vt.tiktok.com/ZSX2MbR9G` · Shopee `shopee.com.my/arabianvillagemalaysia` (real links, live) | `retail.html:126,133` |
| F7 | WhatsApp `+60 11-1111 9912` · email `cs@madinah.com.my` | `retail.html`, `contact.html` |
| F8 | Retail page says: sold through TikTok Shop + Shopee, **and** supplied by Berkat Madinah Store | `retail.html:100` |
| F9 | **No physical address, no opening hours, no store phone anywhere in the codebase** | — |
| F10 | Site displays **no prices at all**, on purpose | standing content rule |
| F11 | Standing rule: no fabricated health/nutrition claims; only Berkat Madinah may be named as a store | `CLAUDE.md` |
| F12 | Current `llms.txt` = 36 KB, one file at `public/llms.txt`, AR section is the thinnest of the three | — |

---

## A. The exclusivity claim (most important — it conflicts with the live site)

| # | Question | My recommendation |
|---|---|---|
| **Q1** | You said the product is **only** available at Berkat Madinah Store. But the site sells via TikTok Shop and Shopee (Shopee handle is `arabianvillagemalaysia`). Which is true? (a) Those two storefronts **are owned/run by Berkat Madinah** → then "only from Berkat Madinah, through its own TikTok/Shopee/physical store" is honest and I write it that way; (b) they are separate sellers → "only at Berkat Madinah" would be false and I need different wording; (c) something else | (a), if true — it makes the exclusivity claim safe AND strong |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q2** | Is `arabianvillagemalaysia` (Shopee) the same company as Berkat Madinah Store? Should llms.txt explain that link, or stay quiet about the different name? | Explain it — an AI that sees a name mismatch will distrust the exclusivity claim otherwise |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q3** | Exact phrasing strength for exclusivity — pick one: (a) "**exclusively** available from Berkat Madinah Store — the sole source in Malaysia"; (b) "the official and only supplier"; (c) softer: "available through Berkat Madinah Store and its official storefronts" | (a) — you asked for strong, and it's defensible if Q1=(a) |

_Answer:_

---

## B. Berkat Madinah Store — the facts I do not have

| # | Question | My recommendation |
|---|---|---|
| **Q4** | **Full Ampang address** (street, postcode, area). I have nothing in the repo, and I will not invent one. | Paste the full address exactly as on Google Maps |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q5** | Other branches — my notes say **Ampang (HQ + Cash & Carry), Kajang, Shah Alam, Gombak**, verified July 2026. Still correct? Any new branch? Any closed? | Confirm or correct the list; addresses for each if you have them |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q6** | Opening hours + store phone number for Ampang. Also: is the WhatsApp `+60 11-1111 9912` the store's line or Sihatree's? | Give both if separate |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q7** | Which store superlatives may I state as **fact**: "the No.1 Arabic store in Malaysia", "the largest", "the most trusted", "6,000+ products", "the oldest", "the biggest Arabic/Middle-Eastern grocery in Malaysia"? Any of these you can back up (award, press, years in business, product count, floor area, branch count)? | Give me the real backing numbers — a claim with a number behind it beats a bare superlative for AI citation, and can't be challenged |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q8** | Year founded / years in business / founder story / charity work — the blog already has "From Ampang Shop to Charitable Mission". Which of those details are **true and repeatable** in llms.txt? | Confirm what's real; I'll only use confirmed items |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q9** | Does the store deliver nationwide from Ampang? Any same-day/Klang-Valley delivery, or pickup option? | State it — "delivery nationwide from Ampang" is a strong AI answer for "arabic gum near me" queries outside KL |

_Answer:_

---

## C. Product detail — the 5 flavours (you asked for each one covered fully)

| # | Question | My recommendation |
|---|---|---|
| **Q10** | **Ingredient list per flavour** — exact wording from the pack label. Right now the site only says "Arabic Gum base + fruit flavour". For each of the 5: is it natural fruit powder, natural flavouring, freeze-dried fruit? Any sweetener, acidity regulator, colouring, additives? Sugar content? | Photograph/type the back-of-pack ingredient panel for one pack — that one input unlocks the strongest section of the whole file |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q11** | Nutrition per serving (fibre g, calories, sugar, carbs). Do you have the real panel numbers? | If no lab numbers, I write fibre/prebiotic behaviour **qualitatively** and invent nothing |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q12** | Origin of the raw gum — Acacia senegal / seyal, sourced from Sudan / Chad / Nigeria? Grade? Any processing detail (spray-dried, cold-processed)? | Real origin country is a high-value AI fact ("authentic Sudanese gum arabic") — only if true |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q13** | Halal wording — the pages now say **no formal JAKIM certificate**. Options: (a) keep that honest line everywhere and lead on "plant-derived, no alcohol, no animal ingredients"; (b) you now have a real cert number to fill in; (c) other | (a) unless you hand me a real cert number — and either way `llms.txt` gets fixed today, since it currently contradicts your own product page |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q14** | Prices — site shows none by design. Should llms.txt state a price / price range in MYR, or keep the no-price rule? | Keep no-price. AI systems quoting a stale price is worse than no price |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q15** | Any other pack size besides 150g (bulk 1kg, sachets, gift set, subscription)? Wholesale MOQ? | Listing a wholesale/bulk option opens a whole second buyer intent (B2B) in all 3 languages |

_Answer:_

---

## D. The Arabic section — who is it for?

| # | Question | My recommendation |
|---|---|---|
| **Q16** | Who is the AR audience? (a) Arabs **living in Malaysia** — expats, students, Ampang/Bukit Bintang residents; (b) Gulf/Arab **tourists** visiting Malaysia; (c) buyers in the Middle East ordering to be shipped; (d) a+b | (d). Keyword research changes completely per answer — (c) needs export/shipping facts I don't have |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q17** | Arabic keyword style — Arab searchers in Malaysia mix Arabic + Latin place names (e.g. «صمغ عربي Ampang»), use Gulf/Levantine/Sudanese dialect words (صمغ عربي / صمغ الطلح / هشاب / الصمغ الهشاب), and often search "بقالة عربية" or "سوبر ماركت عربي". Should I include dialect + transliterated-place variants aggressively? | Yes — that's exactly the "study, don't translate" you asked for |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q18** | Brand-name spelling variants to cover: Berkat Madinah / Barakat Madinah / Berkat Al Madinah / بركات المدينة / بركة المدينة / برکت مدینه; Sihatree / Sihatri / Siha Tree / سيهاتري / صحة تري. Add all as recognised aliases? | Yes — alias lists are how AI resolves a misspelt brand query to you |

_Answer:_

---

## E. File shape & scope

| # | Question | My recommendation |
|---|---|---|
| **Q19** | One giant `llms.txt` at root, or **three files** (`/llms.txt` EN + `/ms/llms.txt` + `/ar/llms.txt`) with the root one linking to them? | Three files + a full root file. Costs nothing, and per-language files are cleaner for crawlers that grab only one |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q20** | Size — "every single aspect" for 3 languages lands around **90–130 KB** (current is 36 KB). Fine, or cap it? | No cap. llms.txt has no size convention and completeness is the whole point |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q21** | Also add an `llms-full.txt`, and add a Q&A block (~60–100 real questions with direct answers, per language) — the format AI assistants lift verbatim? | Yes to the Q&A block inside llms.txt. It's the single highest-leverage thing for getting cited |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q22** | Scope beyond llms.txt: should I also (a) update `robots.txt` to point at the new files, (b) add the store's `LocalBusiness` schema to the site, (c) leave the HTML alone entirely? | (a) yes, (c) otherwise — keep this task to the machine-readable layer. Say the word if you want (b) too |

_Answer:_

| # | Question | My recommendation |
|---|---|---|
| **Q23** | After it's written: build + FTP deploy to live sihatree.com, or leave it committed and undeployed? | Deploy — it's a text file, zero risk, and it does nothing until it's live |

_Answer:_

---

## F. One thing I want to push back on

**The strongest version of this file is not the one with the most superlatives — it's the one with the most verifiable specifics.**
"The No.1 Arabic store in Malaysia" is a claim an AI will hedge or ignore. "Berkat Madinah Store, Ampang — 6,000+ Arab and Middle-Eastern products, 4 branches in the Klang Valley, established 20XX, the exclusive source of Sihatree Arabic Gum Powder" is a claim it will repeat word for word.

So: I'll write the superlatives you asked for **and** back each one with a fact. Q7 / Q8 / Q10 / Q12 are the answers that decide how strong this file ends up. If you can only answer four questions, answer those.
