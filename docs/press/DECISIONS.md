# DECISIONS — Sihatree PRESS round 1

1. **Codeword PRESS invoked 2026-08-25** by site owner: "press sihatree project 6 articles for
   each lang, push to github, deploy, and memories after done" — full autonomy, no mid-flow
   confirmation stops (per standing [[feedback_full_autonomy]] instruction). **User decision.**
2. `assumed` — 6 articles per language (18 total), topics chosen by PRESS from gap analysis
   against the existing 43-topic table (see ROUND-1-MAP.md), since the user gave a count but not
   topics.
3. `assumed` — AR articles keep EN-based filenames (not native-Arabic slugs), matching the
   site's own established convention (all 43 existing AR articles already do this) rather than
   the PRESS default of native-script slugs. Overriding the established site architecture for
   one round would create an inconsistent AR URL pattern with no offsetting benefit.
4. `assumed` — Images: reuse-first per PRESS default. 5 of 6 heroes generated fresh (pollinations
   provider) because the closest-fitting existing assets were already reused 2-7× each; 1 hero
   (bloating) reused an existing fiber-foods photo with a genuinely different crop box. One
   generated image (a café counter with a person's face rendered mid-frame) was rejected on
   sight and regenerated without a person — see IMAGE-INVENTORY.md.
5. `assumed` — Gombak branch address (289, Jalan Gombak No 95-G, Block E, KL Traders Square,
   53100 Kuala Lumpur) verified via WebSearch against madinah.com.my/en/branches.html before
   writing the article — not fabricated, not carried over from memory alone.
6. `assumed` — New EN/MS article `<head>` includes the full 4-line hreflang block (en-MY, ms-MY,
   ar-MY, x-default). The 43 existing EN articles are missing the ar-MY line (a pre-existing gap,
   confirmed against `blog/arabic-gum-daily-routine.html`); the sitemap already carries all 4
   lines correctly. This round's new articles match the sitemap standard rather than repeat the
   older articles' gap. Not retrofitted onto the existing 43 — out of this round's scope.

---

# DECISIONS — Sihatree PRESS round 2 (2026-09-10, branch `press-round-gsc`)

7. **Codeword PRESS invoked 2026-09-10** with an explicit scope: exactly 15 articles, 3 per
   keyword across 5 keywords supplied from a live Google Search Console + Keyword Planner pull
   this session, Malaysia-first (12 MS + 3 EN), **no Arabic**, and a hard stop after Stage 6 —
   no build, no deploy, no push. **User decision.**
8. `assumed` — the 15 topics and their focus keywords. The operator supplied five *keyword
   families*, not fifteen titles. Each family is attacked as a cluster of three articles with
   three distinct long-tail focus keywords, because a HIGH-competition head term is not won by
   one page and because two articles on one term is cannibalisation. See ROUND-2-MAP.md.
9. `assumed` — **`/ms/benefits` is strengthened rather than competed with** for
   `kebaikan gam arab` (50/mo, LOW). Its `<title>`, meta description, OG/Twitter titles and hero
   `<h1>` were re-led with the head term, and all three C-cluster articles link up to it with
   that exact anchor. A blog article taking the term outright would have cannibalised the money
   page. This is the only existing money page this round edits.
10. `assumed` — the four `kedai barangan arab {town}` branch pages (pos 6-7, 11 impressions,
    **0 clicks**) are **not** joined by a fifth. They lose the click to the Google Maps local
    pack, which is what a physical-store query returns, and a sixth store page would lose the
    same way. A1-A3 take the three non-map-shaped intents in that family instead and link down
    into the four branch pages.
11. `assumed` — **these 15 articles ship in one language only**, breaking the site's
    file-for-file EN/MS/AR parity. Consequences, handled deliberately:
    - hreflang is a self-referencing pair (own locale + `x-default` -> self). Inventing an
      alternate for a twin that does not exist would hand Google a 404.
    - the nav and footer language switches point at the sibling language's **blog index**
      (`/blog`, `/ar/blog`), never at a non-existent article URL.
    - the sitemap entries carry the same self-referencing pair plus a real `lastmod`.
    The AR (and, for the 12 Malay pieces, the EN) twins are a separate future round.
12. `assumed` — **images are reuse-only; nothing was generated.** `bin/imgen.py` was not run.
    The honest arithmetic is in `round-2/IMAGE-INVENTORY.md`: the library's ~55 usable
    photographs are already heroes of the 49 live topics, so all 15 heroes this round are a
    **second, genuinely different crop** of an existing source, and nothing is upscaled past its
    source pixels. Three heroes are therefore smaller than 1600x900 and declare their real size.
    One crop was rejected on sight and re-cut.
13. `assumed` — **`.blog-post-body table` styling was added to `src/style.css`.** The control run
    proved every one of the 49 existing articles fails the "structured block" check because the
    design system had no table rules at all, so no writer had ever used one. Answer engines lift
    tables preferentially. The rules are scoped to `.blog-post-body`, ship an `overflow-x` wrapper
    so a table cannot make the page scroll sideways at 375px, and include an RTL alignment block
    so the future Arabic round inherits it.
14. `assumed` — **the PRESS gate's word-count band is not applied verbatim on this project.** A
    control run against articles that have been live and verified since round 1 returned 693, 671
    and 753 rendered words for drafts of 916, 996 and 997 — the gate's rendered-region counter
    reads about 70% of this template's draft count. The draft band (800-1,000, measured as lede +
    body + FAQ answers) is enforced by `round-2/check_drafts.py` before anything is rendered, and
    `bin/press_gate.py` is run with a band calibrated from that control. Recorded in
    `round-2/GATE.md` with the numbers.
15. `assumed` — `{{PRICE_MYR}}` remains unrendered in the `Product` schema on `index.html`,
    `products.html` and their `ms/`/`ar/` twins. **This round does not touch it and does not
    spread it**: none of the 15 articles emits a `Product` or `Offer` node. Fixing it is a
    separate job — the site publishes no prices by an explicit standing decision, so the correct
    fix is to delete the `offers` node, not to invent a number, and that needs the owner.
16. `assumed` — a writer agent reported mojibake in another agent's draft. It was a **false
    alarm**: every draft is valid UTF-8 with zero U+FFFD, and what the agent saw was its own
    console rendering an em dash through cp1252. Verified byte-level before acting on it.
17. **User decision, 2026-09-15**: "ship round 2 now, then round 3" — lifts the DECISIONS #7 hard
    stop. Round 2's Stage 7 (build, local + live browser check, deploy, merge, push) was run this
    session with no further scope change; see `PROJECT-PROFILE.md`'s "Stage 7 — shipped
    2026-09-15" section for the full check table. Merged `press-round-gsc` into `main`
    (`d15c821..5a65bc4`, clean fast-forward) and pushed. Branch left in place as history.

---

# DECISIONS — Sihatree PRESS round 3 (2026-09-15, branch `press-round-3-ar-strengthen`)

18. **Codeword PRESS invoked 2026-09-15**: "press sihatree 5 articles based on GSC" — no language
    or topic specified. **User decision.** Initial framing (this session): biggest GSC gap looked
    like an Arabic skin/hair/face demand cluster with no AR article covering it — **user approved
    that direction.**
19. `assumed`, then corrected before writing anything — a `page,query` GSC pull (not just `query`)
    showed the "no AR article covers it" premise was wrong: all 72 AR page+query rows already
    resolve to 6 live AR articles, clustered at position 9-20, zero clicks. Writing 5 new AR
    articles on the same terms would have cannibalised those 6 live pages, against non-negotiable
    #8 and the exact pattern round 2 routed around for `/ms/benefits` and the 4 branch pages.
    Surfaced to the user with the corrected picture. **User decision, 2026-09-15: strengthen the 6
    existing pages instead of writing 5 new ones.** Full keyword-to-page mapping in
    `ROUND-3-MAP.md`.
20. `assumed` — five of the six pages' `<title>`/meta/H1 were already well-led with their exact
    head query on inspection; rewriting already-correct copy has no upside and risks the position
    already held, so title/meta/H1 were left untouched. The genuine lever was content depth: none
    of the six carried a real `<table>` (written 2026-07-11/07-16, before round 2 added the
    site's table CSS) — the same `structured-block` defect class round 2's control run proved
    site-wide. Added one fact-grounded table + one new FAQ Q&A per page, `dateModified` bumped,
    nothing else changed. One self-introduced banned-word hit ("معتمدة" in a draft FAQ question,
    on the project's own AR-banned-adjectives list) was caught by a pre-gate sweep and fixed to
    "مسجّل" before it ever reached a gate run — see `ROUND-3-MAP.md`.

---

# DECISIONS — Sihatree PRESS round 4 (2026-09-15, branch `press-round-4`)

21. **Codeword PRESS invoked 2026-09-15**: "press sihatree 5 articles" — no language, no GSC
    qualifier this time (round 3 was explicitly GSC-only). **User decision.**
22. `assumed` — English, and these five topics. English was the language behind (52 EN vs 61 MS vs
    49 AR at round start), and live keyword research found five evergreen wellness angles
    (cholesterol, blood pressure, breastfeeding, metabolism/energy, detox water) with no existing
    EN/MS/AR article owning any of them — confirmed by grepping every existing `<title>`/`<h1>` on
    the site before writing. Full reasoning in `ROUND-4-MAP.md`.
23. `assumed` — all five follow the site's established claim-refusal pattern (capture the query,
    refuse the unproven/unlawful claim in the same breath) rather than any new content shape. The
    detox-water article required active discipline around the bare word "detox" specifically —
    every use was checked to sit inside a same-sentence negation, and this actually caught a real
    gate failure: the new `public/llms.txt` index line for that article tripped `G9-medical` on
    first run (bare "Detox" with no same-line negation) and was reworded before the gate passed.
    See `round-4/GATE.md` §2.
24. `assumed` — images are reuse-only, second crops of existing site photos, nothing generated.
    One mid-round correction: the first-pass crops for the cholesterol and blood-pressure articles
    landed on two near-identical source photos (both a powder-pile-on-a-kitchen-scale
    composition); the blood-pressure crop was discarded and re-cut from a different, visually
    distinct source before publishing. See `round-4/IMAGE-INVENTORY.md`.
25. `assumed` — the optional "extra Related-Articles card on a matched existing article" inbound-
    linking enhancement that round 2 used was **not done this round**, a scope decision under time
    constraint. All 5 articles are still fully discoverable via `blog.html`'s grid, the sitemap and
    `llms.txt` — this only affects the density of inbound links from older articles, not
    crawlability. Recorded rather than silently skipped; see `round-4/GATE.md` §6.
26. `assumed` — no MS or AR twin was written for any of the 5 topics this round, matching round
    2's DECISIONS #11 precedent for single-language rounds: hreflang is a self-referencing pair
    (own locale + `x-default` → self), and the language switches point at the sibling blog index,
    never a non-existent article URL.
