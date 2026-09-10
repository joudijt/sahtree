# FACTS — Sihatree PRESS round 2 (shared sheet, all 15 articles)

Stage 2. Everything below is true and sourced **from this repo**. Anything not here is UNKNOWN and
must be omitted, not guessed. Source of truth: `AI-FACTS.yml`, `public/llms.txt` (+ `ms/`, `ar/`),
`CLAUDE.md`. Do not retype a fact into prose in a form that could drift from those files.

## The legal ceiling — Malaysia

**Food Regulations 1985, Reg. 18(6):** a food may not be claimed to prevent, treat or cure any
disease. Sihatree Arabic Gum Powder is a **food** — a dietary fibre powder — not a medicine, not a
supplement with a therapeutic indication.

That means, in every article, in every language:

- No claim that it treats, cures, prevents, reverses, heals or manages any condition.
- No claim about male vitality, stamina, libido, testosterone, fertility, sexual performance.
- No claim about lowering cholesterol, lowering blood sugar, curing constipation, curing bloating,
  causing weight loss, improving skin, growing hair, improving focus or memory.
- Hedged versions of the above ("may help with...", "many believe it boosts...") are still claims.
  Do not write them.
- The compliant move is to **name what people search for, then say plainly what it is and is not**,
  and send anyone with a medical question to a doctor. The site already ships this pattern on
  diabetes, weight loss, pregnancy, kids, seniors, constipation and bloating.

## Banned vocabulary — site-wide ruling, 2026-07-26

Never use, in any language: **certified, certification, official, verified, verification,
accredited, accreditation, trusted, authentic, authenticity, guarantee, guaranteed** — and their
Malay equivalents (disahkan, rasmi, dijamin, terjamin, diperakui, sahih as an accreditation word).

## Halal wording — owner instruction, 2026-08-14

- The product is described as **plant-derived: no alcohol, no animal-derived ingredients**.
- **There is NO JAKIM certificate.** Never write a certificate number, "JAKIM certified",
  "halal-certified", or "in line with JAKIM Halal guidelines".
- If an article makes any Halal statement at all, the **no-certificate sentence must sit in the
  same block**. Example shape in Malay: "Gam Arab Sihatree berasal daripada tumbuhan — tiada
  alkohol, tiada bahan daripada haiwan. Sihatree tidak memegang sijil Halal JAKIM."
- The safest option for most articles in this round is simply not to raise Halal at all. The site
  already has a dedicated page for it: `/ms/blog/gam-arab-halal-panduan-malaysia`.

## Prices

**The site publishes no price, in any currency, anywhere, on purpose.** Do not write a price, a
price range, a "from RM..." figure, a discount, a shipping cost or a minimum order value. Point at
the live listing instead. There is an existing article on pricing *factors*:
`/ms/blog/harga-gam-arab-malaysia`.

**Known live defect — do not propagate:** `{{PRICE_MYR}}` is still an unrendered placeholder inside
the `Product` schema on `index.html`, `products.html` and their `ms/` and `ar/` twins. No article in
this round emits a `Product` or `Offer` node at all, so the defect cannot spread. Do not add one.

## The product

| Fact | Value |
|---|---|
| Name | Sihatree Arabic Gum Powder (BM: Serbuk Gam Arab Sihatree) |
| What it is | Natural water-soluble prebiotic dietary fibre from the dried, purified sap of the Acacia tree (*Acacia senegal* / *Acacia seyal*), milled into an instant powder |
| Flavours | 5 — Original, Berry Blend, Mango, Pineapple, Pomegranate |
| Pack | 150 g resealable pouch |
| Category | A food. Not a medicine. |
| Market | Malaysia only |

## Dosage — the wording the site already uses

Most adults start at **5-10 g a day** stirred into a glass of water and increase gradually to
**15-30 g** as tolerated. Mix each scoop into **250-300 ml** of water. Splitting the daily amount
across a morning and an evening serving is gentler than one large serving. Always frame this as
"what people commonly do", never as a prescription, and never invent a dose for children, pregnant
women, or anyone with a medical condition — send them to a doctor.

## Ingredient science already verified on this site

From `/ms/blog/kajian-saintifik-gam-arab` and `/blog/arabic-gum-scientific-research` (verified in a
prior round, not invented here):

- Gum arabic's food-additive number is **E414**.
- It is roughly **85% soluble fibre**.
- It has **GRAS** status in the United States and has been assessed by **EFSA** and **JECFA**.
- Those assessments are **food-safety** assessments. They do **not** establish that it treats,
  prevents or cures anything. Say so if you cite them.
- It ferments **slowly and gradually** compared with faster-fermenting fibres such as inulin. That
  is a fermentation-rate description, not a health claim.

## Sourcing

*Acacia senegal* and *Acacia seyal*, from Africa's Sahel "Gum Belt". Hand-harvested by tapping the
bark; the tree is not felled. Detail lives in
`/ms/blog/sumber-gam-arab-pokok-akasia-kelestarian`.

## The seller — Berkat Madinah Store

Sihatree Arabic Gum Powder is sold **only** through Berkat Madinah Store and the channels Berkat
Madinah Store operates. Do not frame TikTok Shop or Shopee as independent Sihatree storefronts.

| Fact | Value |
|---|---|
| Founded | 2010 |
| Products stocked | 6,000+ |
| Branches | 5 sites across the Klang Valley |
| Imports from | 15+ countries |
| Web | madinah.com.my |
| Shopee | shopee.com.my/arabianvillagemalaysia (trading name *Arabian Village Malaysia*) |
| TikTok Shop | https://vt.tiktok.com/ZSX2MbR9G/?page=TikTokShop |
| WhatsApp | https://wa.me/601111119912 |
| Email | cs@madinah.com.my |

### The four real branch towns — never name a fifth town

**Only these four towns may be named as places you can walk into.** The count of *sites* is five
(Ampang has the HQ and a separate Cash & Carry); the count of *towns* is four.

| Town | Address as already published on this site |
|---|---|
| Ampang | HQ + Cash & Carry, Ampang Putra Residency, Taman Putra Suliman |
| Kajang | ground floor, Pearl Avenue Shop, Jalan Pasir Emas, 43000 Kajang, Selangor |
| Shah Alam | No. 46, Jalan Pegaga C U12/C, Desa Alam, Seksyen U12, Shah Alam, Selangor |
| Gombak | 289, Jalan Gombak No 95-G, (Block E), KL Traders Square, 53100 Kuala Lumpur — trades locally as Arabian Village |

There is **no branch** in PJ, Subang, Klang, Johor Bahru, Penang, Ipoh, Kuantan, Kota Kinabalu or
Kuching. Anywhere outside those four towns is **delivery only** — never described as a store visit.

**Standing rule, 2026-07-20:** only Berkat Madinah Store may be named as a grocery or supplier in
any article. Never name, link to, or imply another Arabic grocery, importer or supplier, even
generically ("other Arabic groceries in KL" is already a breach — do not write it).

### Opening hours — UNKNOWN

No opening hours for any branch are recorded anywhere in this repo. **Do not invent them.** Say
"check the current hours on madinah.com.my before travelling" instead.

## Things that are UNKNOWN — omit, do not guess

- Any price, discount, promotion, shipping fee or minimum order.
- Branch opening hours, phone numbers per branch, parking, floor area, staff counts.
- Customer counts, review counts, star ratings for Sihatree itself, sales figures, market share.
- Any named testimonial, quote or customer story.
- Delivery lead times in days, courier names, delivery coverage percentages.
- Any nutrition number for the Sihatree pack beyond the 150 g pack weight. (There is an existing
  nutrition article; do not restate its numbers from memory — link to it instead:
  `/ms/blog/fakta-pemakanan-gam-arab` / `/blog/arabic-gum-nutrition-facts`.)
- Whether guar gum, psyllium or any competitor product is stocked by Berkat Madinah Store.

## Claim-safe vocabulary — what people type vs what you may write

| People search this | You may write | You may NOT write |
|---|---|---|
| khasiat arabic gum untuk lelaki | "Ini yang orang cari apabila menaip *khasiat arabic gum untuk lelaki* — dan inilah jawapan jujurnya: Gam Arab ialah serat pemakanan, bukan rawatan." | any sentence in which Arabic Gum does something *to* male health |
| tenaga / stamina lelaki | "Gam Arab bukan penguat tenaga atau stamina. Ia serat larut." | "boleh membantu tenaga", "menyokong stamina" |
| kesuburan lelaki | "Tiada kajian yang menunjukkan Gam Arab merawat masalah kesuburan. Jumpa doktor." | "baik untuk kesuburan", "mungkin membantu" |
| gam arab untuk kolesterol | "Serat larut ialah sebahagian daripada diet seimbang. Gam Arab bukan ubat kolesterol." | "menurunkan kolesterol", "membantu kawal kolesterol" |
| kebaikan gam arab untuk wanita | "Ramai wanita di Malaysia mencari cara mudah menambah serat harian." | hormone, menstrual, fertility, beauty or slimming claims |
| gum arabic benefits | "What the food-safety assessments actually cover, and what they do not." | "proven benefits", "clinically proven", "boosts immunity" |

## House style already in use on this site

- Malay is written natively for Malaysian readers — not translated from the English article. Use
  natural Malaysian phrasing ("nak", "boleh", "senang", "kedai runcit"), not Indonesian.
- English articles say "Arabic Gum". Cluster E deliberately leads with "gum arabic" and "acacia
  gum" instead, because that is what the searcher types — this is the point of the cluster.
- Concrete over abstract. One real process step, place or number beats a paragraph of adjectives.
- Never "click here" or "read more" as anchor text.
