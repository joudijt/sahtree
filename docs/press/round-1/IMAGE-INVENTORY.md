# IMAGE-INVENTORY — round 1

Reuse-first checked against `public/images/` before any generation. Fitting candidates were
already reused 2-7× across the existing 43 articles (acacia-tree.webp ×7, morning-water-light
×3, gut-health-fiber-grains ×2, each of the 3 grocery photos ×1 for their own branch). Rather
than add an 8th reuse of an already-heavily-shared photo, or misassign the wrong branch's photo
to Gombak, 5 of 6 heroes were generated fresh.

| Article (topic) | Source | Final file | Notes |
|---|---|---|---|
| Gombak branch | Generated (pollinations) | `arabic-grocery-gombak-berkat-madinah-store.webp` | Grocery aisle interior, no readable text/logos, no people |
| vs. chia seeds | Generated ×2, composited locally with PIL | `arabic-gum-vs-chia-seeds.webp` | Left panel = generated acacia-crystal bowl photo; right panel = generated chia-gel bowl photo; composited side-by-side (same technique as the existing vs-inulin/vs-psyllium split heroes) |
| Bloating | **Reused**: `arabic-gum-gut-health-fiber-grains.jpg` | `arabic-gum-bloating-fiber-close.webp` | Different crop box — right-shifted, tighter, different subset of bowls than the original full flat-lay (which is already used twice elsewhere) |
| Acacia sourcing/sustainability | Generated (pollinations) | `arabic-gum-acacia-sourcing-sustainability.webp` | Macro bark/sap-droplet shot — distinct from the existing whole-tree `acacia-tree.webp` used 7× already |
| Café/F&B business | Generated (pollinations), 2 attempts | `arabic-gum-cafe-business-malaysia.webp` | **1st attempt rejected on sight** — the model rendered a barista's face in frame despite "no people" in the prompt. Regenerated as a pure still life (empty counter, drinks, blurred blank chalkboard) — no faces, no legible text |
| First-30-days beginner guide | Generated (pollinations) | `arabic-gum-first-30-days-beginners.webp` | Considered reusing `family-sihatree.webp` (site's existing family/homepage asset) but **rejected** — it depicts the product as fruit gummies eaten by hand, not the real 150g powder-in-water product; using it here would visually misstate the product. Generated a neutral starter-kit still life instead (glass of water, spoon, blank notebook) |

All generated images: pollinations provider (zimage token expired, 401, automatic fallthrough
worked). No words/logos/numbers in any prompt. Every image reviewed visually before use; one
was rejected and regenerated (café/business, see above).
