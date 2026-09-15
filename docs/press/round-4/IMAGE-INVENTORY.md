# IMAGE-INVENTORY — Sihatree PRESS round 4

Reuse-only, per standing ruling 2026-08-26. Nothing generated; `bin/imgen.py` not run.

| Article | Source photo (existing) | Crop box (px, on source) | Output | Output size |
|---|---|---|---|---|
| `arabic-gum-cholesterol` | `gam-arab-untuk-kolesterol.webp` (1200×675, round 2's MS cholesterol article hero) | `(60,0,1140,608)` | `arabic-gum-cholesterol.webp` 1080×608 | 29 KB |
| `arabic-gum-blood-pressure` | `arabic-gum-seniors-glasses-cup.jpg` (1600×900) | `(100,40,1550,880)` | `arabic-gum-blood-pressure.jpg` 1450×840 | 123 KB |
| `arabic-gum-while-breastfeeding` | `arabic-gum-customer-morning-routine.jpg` (1600×900) | `(60,0,1500,850)` | `arabic-gum-while-breastfeeding.jpg` 1440×850 | 106 KB |
| `arabic-gum-metabolism-energy` | `arabic-gum-fitness-recovery-gym.jpg` (1600×900) | `(0,60,1450,860)` | `arabic-gum-metabolism-energy.jpg` 1450×800 | 174 KB |
| `arabic-gum-detox-water-trend` | `arabic-gum-morning-water-light.jpg` (1600×900) | `(180,0,1600,900)` | `arabic-gum-detox-water-trend.jpg` 1420×900 | 101 KB |

Total: 533 KB for 5 heroes. Nothing upscaled past source pixels.

## A mid-round correction, not silently fixed

The first crop pass reused `gam-arab-untuk-kolesterol.webp` for cholesterol (correct — the MS
cholesterol article's own hero, topically exact) and `arabic-gum-nutrition-scale.jpg` for blood
pressure. On visual review, **both source photos turned out to be near-identical compositions** —
a white powder pile on a grey digital kitchen scale against a blue background — meaning two
articles in the same round would have shown the same visual idea back-to-back, which the site's
own established convention (see `CLAUDE.md`'s image log) explicitly avoids. The blood-pressure
crop was discarded and re-cut from `arabic-gum-seniors-glasses-cup.jpg` instead — a distinct
composition (reading glasses beside a cup, moody still life) already in the library, unused since
the seniors article. The breastfeeding source was also reconsidered: the pregnancy article's own
hero (a pregnancy test and calendar) was the obvious first pick, but re-using it would read as
"still about pregnancy" for a postnatal topic, so `arabic-gum-customer-morning-routine.jpg` (a
woman with a warm drink at a kitchen table, already in the library, modest per the site's existing
modesty bar) was used instead.

Every hero was visually confirmed (`Read` on the produced file) before wiring, not just measured
by pixel dimensions.
