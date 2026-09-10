# IMAGE-INVENTORY — Sihatree PRESS round 2

Stage 4, 2026-09-10. **Reuse only. Nothing was generated.** `bin/imgen.py` was not run; the
standing 2026-08-26 ruling (article images come from the project's own photo library, full stop)
applies to this project.

## The arithmetic, said out loud

`public/images/` holds **80 files**. Strip the logo pair, the ten `shape_*` decorations and the
`.png` originals that already have a published `.webp` twin and the real content library is
**~55 distinct photographs**.

Those 55 are already spoken for. The site ships **49 topics × 3 languages**, and a topic's hero is
shared across its EN/MS/AR twins, so **every usable frame in the library is already the hero of a
live article**. There is no unassigned photograph left on this project.

**Sources with genuine crop headroom** — a source whose real pixels exceed 1600×900, or whose
published use is a different aspect, so a second crop is a visibly different frame rather than the
same picture again:

| Source | Real pixels | Published as | Headroom |
|---|---|---|---|
| `gum-crystals.png` | 1024×1024 | square `.webp` | a 1024×576 landscape band is a new frame |
| `acacia-tree.png` | 1024×1024 | square `.webp` | same |
| `newhero.png` | 1402×1122 | 4:5-ish `.webp` | 1402×789 band |
| `all-flavours.webp` | 1300×1093 | product strip | 1300×731 band |
| `berries/mango/pineapple/plain/pomegranate.png` | 1240×2121 | tall pack shots | two non-overlapping 1240×697 bands each |
| every 1600×900 JPG | 1600×900 | full frame | a 1200×675 region is a 1.33× tighter frame, and does not upscale |

**No output in this round is upscaled.** The crop script asserts
`target_w <= source_w and target_h <= source_h` and aborts otherwise. Three heroes are therefore
smaller than 1600×900 (1024×576, 1300×731, 1402×789) and each `<img>` declares its **real** size.
Round 1 already shipped 1024×576 heroes, so this is the site's established precedent, not a new
compromise.

**What this means for the owner, in plain numbers:** 55 photographs now carry 64 topics. Nine
articles on this site open with a second crop of a frame another article already uses. Crops were
scoped so that no two articles *in the same language* open with the identical frame, and so that
neighbouring cards on the `/ms/blog` index differ. If the owner wants every article to have a
genuinely unique picture, the library needs new photography — that is a photo shoot, not a crop
plan.

## Assignment — by subject, never by index

Every crop was rendered and then **looked at** on a contact sheet before it was accepted. One was
rejected on sight and re-cut: A3's first crop (`arabic-gum-verify-genuine-package.jpg`) read as
someone working at a wooden bench rather than a parcel arriving, which is the wrong idea for an
"order it online" article. It was replaced with the warehouse racking frame.

| id | article | source asset | derived file | out size | crop box | reused / generated |
|---|---|---|---|---|---|---|
| A1 | kedai-barangan-arab-berhampiran-saya | `arabic-grocery-dates-baskets.jpg` (1600×900) | `kedai-barangan-arab-berhampiran-saya.webp` | 1200×675 | (8,131) | **reused**, tighter crop left of centre |
| A2 | barang-di-kedai-barangan-arab | `arabic-grocery-mixed-nuts-bowl.jpg` (1600×900) | `barang-di-kedai-barangan-arab.webp` | 1200×675 | (280,113) | **reused**, tighter crop right of centre |
| A3 | kedai-barangan-arab-online-malaysia | `berkat-madinah-wholesale-warehouse.jpg` (1600×900) | `kedai-barangan-arab-online-malaysia.webp` | 1200×675 | (200,131) | **reused**, second cut after the first was rejected |
| B1 | khasiat-arabic-gum-untuk-lelaki | `arabic-gum-morning-water-light.jpg` (1600×900) | `khasiat-arabic-gum-untuk-lelaki.webp` | 1200×675 | (136,113) | **reused**. Object-only glass of water — deliberately no person, for a men's-health topic |
| B2 | gam-arab-tenaga-stamina-lelaki | `arabic-gum-fitness-recovery-gym.jpg` (1600×900) | `gam-arab-tenaga-stamina-lelaki.webp` | 1200×675 | (200,95) | **reused**, tighter top-down crop |
| B3 | gam-arab-kesuburan-lelaki | `arabic-gum-lab-research.jpg` (1600×900) | `gam-arab-kesuburan-lelaki.webp` | 1200×675 | (280,113) | **reused**. Lab bench = "what the research says", the article's actual subject |
| C1 | kebaikan-gam-arab-untuk-wanita | `arabic-gum-customer-morning-routine.jpg` (1600×900) | `kebaikan-gam-arab-untuk-wanita.webp` | 1200×675 | (200,41) | **reused**. Crop raised to keep the face in frame — a centre crop decapitates this shot. Modest long-sleeve framing, same bar as the pregnancy/kids articles |
| C2 | gam-arab-untuk-kolesterol | `arabic-gum-nutrition-scale.jpg` (1600×900) | `gam-arab-untuk-kolesterol.webp` | 1200×675 | (200,131) | **reused**, tighter crop |
| C3 | kenapa-gam-arab-tak-berkesan | `arabic-gum-daily-routine-flatlay.jpg` (1600×900) | `kenapa-gam-arab-tak-berkesan.webp` | 1200×675 | (168,113) | **reused**. Planner + watch = a routine that is not working |
| D1 | gam-arab-atau-gam-arabic-nama-ejaan | `gum-crystals.png` (1024×1024) | `gam-arab-atau-gam-arabic-nama-ejaan.webp` | 1024×576 | (0,142) | **reused**. First landscape band ever cut from this source; the published twin is square |
| D2 | jenis-gam-arab-hablur-serbuk | `all-flavours.webp` (1300×1093) | `jenis-gam-arab-hablur-serbuk.webp` | 1300×731 | (0,181) | **reused**. The five pouches — the article is about product forms |
| D3 | gam-arab-dalam-makanan-harian | `arabic-gum-flavour-comparison-juices.jpg` (1600×900) | `gam-arab-dalam-makanan-harian.webp` | 1200×675 | (232,113) | **reused**. Fruit and glasses of drink — the article is about gum arabic in everyday drinks and food |
| E1 | acacia-gum-benefits-evidence | `acacia-tree.png` (1024×1024) | `acacia-gum-benefits-evidence.webp` | 1024×576 | (0,183) | **reused**. Landscape band; the published twin is square. An acacia tree for an *acacia gum* article |
| E2 | gum-arabic-vs-arabic-gum-naming | `newhero.png` (1402×1122) | `gum-arabic-vs-arabic-gum-naming.webp` | 1402×789 | (0,167) | **reused**. Shows the real pack, which is the point of a naming article |
| E3 | acacia-gum-vs-guar-gum | `arabic-gum-mixing-water-spoon.jpg` (1600×900) | `acacia-gum-vs-guar-gum.webp` | 1200×675 | (200,113) | **reused**. Powder dissolving in water — the practical difference the article turns on |

## Rejected on sight

- **A3, first cut** — `arabic-gum-verify-genuine-package.jpg` at (200,158). The frame that survived
  the tighter crop is a hand and a red sleeve over a wooden surface; it reads as someone working at
  a bench, not as a parcel arriving. Wrong idea for a "buy it online" article. Replaced.

## Payload

| | |
|---|---|
| Files added | 15 WebP |
| Per-file budget | 130 KB (quality steps down from 88 until it fits) |
| Largest | 119 KB |
| **Round image payload** | **1.25 MB** |
| Ceiling set before Stage 4 | 2.50 MB |

## Provenance for the next round

All 15 derived files are **new filenames**, slug-derived, and are now spoken for. The 14 source
photographs listed above have each had one extra crop taken; a future round taking a third crop
from any of them should expect the frames to start looking alike and should say so to the owner.

The crop script is `scratchpad/crop.py` (session-local, not committed): it is declarative — a table
of `(source, output, W, H, anchor)` — and re-running it is idempotent.
