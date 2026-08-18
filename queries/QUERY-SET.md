# Query set + baseline

Fill the query column, then run every prompt through each engine **before**
changing anything on the site. Logged out, no chat history, fresh session.

Without this baseline you cannot prove any later work succeeded, and you will
not notice if a model starts describing the business incorrectly.

Re-run monthly. Same prompts, same day of month.

---

## Tier 1 — Brand
*Does the model know you exist, and does it describe you correctly?*

| # | Query | Date | ChatGPT | Perplexity | Gemini | Claude | AI Overview |
|---|-------|------|---------|------------|--------|--------|-------------|
| 1 | What is [NAME]? | | | | | | |
| 2 | Is [NAME] legit / trustworthy? | | | | | | |
| 3 | [NAME] reviews | | | | | | |
| 4 | Who owns [NAME]? | | | | | | |
| 5 | [NAME] pricing | | | | | | |

## Tier 2 — Category
*Are you in the recommendation set at all? This is where new demand lives.*

| # | Query | Date | ChatGPT | Perplexity | Gemini | Claude | AI Overview |
|---|-------|------|---------|------------|--------|--------|-------------|
| 6 | Best [CATEGORY] in [PLACE] | | | | | | |
| 7 | [CATEGORY] for [AUDIENCE] | | | | | | |
| 8 | Cheapest / most reliable [CATEGORY] in [PLACE] | | | | | | |
| 9 | [COMPETITOR] alternatives | | | | | | |
| 10 | [COMPETITOR] vs [COMPETITOR] | | | | | | |
| 11 | Recommend a [CATEGORY] | | | | | | |

## Tier 3 — Problem
*Do you get cited as the source even when not named?*

| # | Query | Date | ChatGPT | Perplexity | Gemini | Claude | AI Overview |
|---|-------|------|---------|------------|--------|--------|-------------|
| 12 | How do I [PROBLEM YOU SOLVE]? | | | | | | |
| 13 | How much does [THING] cost in [PLACE]? | | | | | | |
| 14 | What should I look for when choosing a [CATEGORY]? | | | | | | |
| 15 | Do I need [THING] for [SITUATION]? | | | | | | |

---

## Record per cell

Not just yes/no. Four things:

1. **Cited?** — with which exact URL
2. **Mentioned but not cited?** — different problem, different fix
3. **Verbatim description** — paste the sentence the model used about you.
   A drift here is the earliest warning that something upstream broke, and a
   wrong description is worse than absence.
4. **Who else was cited, from what source** — that list is your layer-5 target
   list. You are not guessing what to do next; the engine is telling you.

## Verbatim description log

| Date | Engine | What it said about us |
|------|--------|------------------------|
| | | |

## Competitor citation sources
*Every source an engine cited a competitor from. Work this list top down.*

| Competitor | Cited from | Engine | Can we get listed there? |
|------------|-----------|--------|--------------------------|
| | | | |
