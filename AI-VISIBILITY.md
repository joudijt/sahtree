# AI visibility runbook

Drop this file, `AI-FACTS.yml`, `lib/` and `scripts/` into a project root.
Work top to bottom. Anything marked **[you]** needs a human — usually a login
or a real-world fact. Everything else is scripted.

Full reasoning behind the seven layers:
<https://claude.ai/code/artifact/c5bc66d9-c3b1-432e-bbf1-72ee8a1463a1>

---

## Layer 0 — Entity definition

- [ ] **[you]** Fill `AI-FACTS.yml`. Three fields are required; the rest may stay blank.
- [ ] `node scripts/coverage.mjs` — read what each blank costs, decide if any are worth going back for.
- [ ] **[you]** Baseline the query set: fill `queries/QUERY-SET.md` and run every prompt through
      ChatGPT, Perplexity, Gemini, Claude and Google **before** changing anything.
      Skip this and you can never prove any of the next six months worked.

> Never invent a fact here. A wrong licence number or an invented client count
> is a verifiable false claim published across every surface at once, and it
> destroys exactly the trust this whole process builds. Blank beats wrong.

---

## Layer 1 — Access

- [ ] `node scripts/build.mjs --out public --robots` — emits the AI-bot allowlist.
- [ ] **[you]** Check the CDN. Cloudflare's *Block AI Scrapers and Crawlers* and
      Bot Fight Mode **override robots.txt entirely** and are on by default on
      some plans. Your robots.txt can be perfect while every fetcher gets a challenge.
      Dashboard, not the file.
- [ ] Deploy, then `node scripts/gate.mjs --url https://SITE` — proves from outside
      that each bot UA gets 200 and that the homepage has real text before JS runs.

---

## Layer 2 — Machine-readable files

- [ ] `node scripts/build.mjs --out public` on every build. Never hand-maintain these.
- [ ] Wire it into the build script so it cannot drift:
      `"prebuild": "node scripts/build.mjs --out public"`
- [ ] Confirm `text/plain; charset=utf-8` on `/llms.txt`. Mandatory for Arabic/CJK.
- [ ] Multilingual: every language needs its own translated `definition_ar`-style
      field. The build prints a loud warning for each missing one, and `gate.mjs`
      fails if two languages ship the same summary sentence.

---

## Layer 3 — Entity graph  *(mostly [you] — accounts)*

- [ ] Inject `schema.jsonld` into every page's `<head>` as `application/ld+json`.
- [ ] **[you]** Create a **Wikidata** item. Free, no notability bar, and it is the
      anchor the whole `sameAs` chain hangs off. Add its URL to `identities`.
- [ ] **[you]** Claim the **Google Business Profile** if you have premises.
      Address must match `AI-FACTS.yml` character for character — a one-character
      mismatch splits you into two entities.
- [ ] **[you]** List on industry registries and licence-body directories. Highest-trust
      corroboration available, usually free, almost always skipped.
- [ ] Rebuild, redeploy, re-gate.

---

## Layer 4 — Extractable answers

- [ ] Map every query in `queries/QUERY-SET.md` to exactly one owning page.
      Two pages competing for one query means neither wins.
- [ ] The 60-word rewrite: first 40–60 words after each `<h2>` must answer that
      heading completely and standalone. Cut the block out and paste it alone —
      if it still answers the question, it can be cited.
- [ ] Add stats with source and date, quotes with name and title, outbound
      citations to primary sources.
- [ ] Author name + credentials and a visible "Last updated" date in the HTML text,
      not only in meta tags.
- [ ] Build the comparison page — comparison content is ~33% of all citations.

---

## Layer 5 — Off-site corroboration  *(mostly [you] — this is the actual lever)*

Brands are cited roughly **6.5× more via third-party sources than their own domain**.
A model treats your site as a claim and everything else as evidence.

- [ ] **[you]** Same canonical name and same definition sentence on every external
      profile. Divergence is the whole failure mode — four spellings makes four
      weak entities that never merge.
- [ ] **[you]** Review platforms; ask at the moment of delivery, not a week later.
- [ ] **[you]** Get added to "best [category]" listicles that **already rank** —
      cheaper than outranking them, and models lift those pages wholesale.
- [ ] **[you]** Genuine Reddit/Quora participation. Three months of useful answers
      before ever mentioning yourself. Astroturf gets removed and poisons sentiment.
- [ ] **[you]** One original-data asset per quarter. The only content a competitor
      cannot replicate, and disproportionately what models quote.

Timescale: 3–9 months. Nothing here is fast, and anyone promising otherwise is
selling layers 0–3 and calling it the whole thing.

---

## Layer 6 — Freshness

- [ ] `node scripts/indexnow.mjs --genkey` once, then ping on every deploy:
      `node scripts/indexnow.mjs --sitemap`
      This is the highest-ratio move available — it feeds Bing, and therefore
      ChatGPT search and Copilot, in minutes instead of weeks.
- [ ] `node scripts/gate.mjs --url https://SITE` in CI, post-deploy. Gate on the
      **deployed bytes**, never on the build log: a generator that writes after the
      dist copy exits 0 while shipping nothing.
- [ ] Price changes propagate the same day to three places: the page, `pricing.md`,
      and schema `offers`. Put it in the release checklist.
- [ ] Quarterly refresh on the pages owning your top queries.

---

## Layer 7 — Measurement

- [ ] **[you]** Re-run `queries/QUERY-SET.md` monthly. Same prompts, same day,
      logged out, no chat history.
- [ ] Record the **verbatim sentence** the model uses about you, not just whether
      you appeared. Being described wrongly is worse than being absent, and drift
      in that sentence is the earliest warning that something upstream broke.
- [ ] Server logs are the only unmediated proof anything is fetching you:
      ```
      grep -aoiE "GPTBot|OAI-SearchBot|PerplexityBot|ClaudeBot|Google-Extended" \
        /var/log/nginx/access.log | sort | uniq -c | sort -rn
      ```
- [ ] **[you]** GA4: custom channel group for `chatgpt.com`, `perplexity.ai`,
      `claude.ai`, `gemini.google.com`, `copilot.microsoft.com`. Expect low volume
      and unusually high conversion — judge it on conversion rate, or you will kill
      a working channel for looking small.

---

## Commands

```bash
node scripts/coverage.mjs                      # what's filled, what each blank costs
node scripts/build.mjs --out public            # emit all machine-readable files
node scripts/build.mjs --out public --robots   # ...and merge the robots.txt block
node scripts/gate.mjs --url https://SITE       # verify the LIVE site (exit 1 on fail)
node scripts/gate.mjs --url https://SITE --strict
node scripts/indexnow.mjs --genkey             # one-time key generation
node scripts/indexnow.mjs --sitemap            # ping on every deploy
```
