# Phase 2 — Handover Plan and Task List

**Branch:** `feat/phase2-recommendation-and-lead-capture`
**Owner:** next agent
**Status:** plan only — no application code written yet
**Companion doc:** `docs/conversational-search-final-plan.md` (sections §12–§14 are the spec; Appendix A Passes 3–4 are the critique log)

---

## 0. How to use this document

Read §1–§5 before touching code. §6 is the task list — work top to bottom, one task per commit, and do not start a task whose dependencies are unmet. §7 defines what "done" means. §8 lists questions that require a human answer; if you hit one, stop and ask rather than guessing.

This work is **Phase 2 only**. The conversational/AI search box (Phase 1) is explicitly out of scope and must not be built here.

---

## 1. Product context

- Neurodiversity Academy runs a provider directory. Users search by **interest area** and **location** using two dropdowns, landing on `/search`.
- The catalogue has **62 providers**: 4 live endorsed + 58 emerging.
- Traffic is roughly **600 visitors/month**. Low volume. Optimise for correctness and low maintenance, not scale.
- The owner wants results that **help users choose**, with endorsed providers ranked ahead of emerging ones, justified by evidence rather than assertion.

## 2. Locked decisions (do not relitigate)

| Decision | Value |
|---|---|
| Ranking method | **Lexicographic**: tier first, then per-tier evidence. No blended score. |
| Endorsed sort key | NDA-certified first, then **absolute count of supports in place** |
| Emerging sort key | **QILT index** (mean of `value − nationalAverage` over SES dimensions), descending |
| Copy rule | Never describe the cross-tier order as "QILT-based" |
| Gate scope | Email unlocks **comparison + emailed shortlist**, not facts that are already public |
| Lead destination | `registerCRMContact` → HubSpot only |
| Email validation | L1–L4 heuristics + **L5 double opt-in**; privacy aliases allowlisted |
| Model involvement | **None.** No model ranks, scores, or writes user-facing text. |

## 3. Non-goals

- Building the AI sentence box, prompt, LLM client, or scope gate (Phase 1).
- Rebuilding the results page or cards from scratch — extend them.
- Blended/scored recommendations, star ratings, or "best for you" copy.
- A/B testing infrastructure (sample size cannot support it).
- Sending marketing email to unverified addresses.
- Replacing the dropdowns.

## 4. Correcting the record before you start

Three facts that shape the design and are easy to get wrong:

1. **QILT does not survey VET.** Three of the four live endorsed providers are VET (`hsh`, `blueprint-career-development`, `nepean-community-college`). `academia` is also VET but is not live.
2. **Collarts is the only higher-ed endorsed provider, and its QILT numbers are placeholders.** `STAT_NUMBERS_BY_SLUG` in `endorsedProviderPageData.ts` carries the comment `Placeholder QILT-style stats per endorsed slug; replace with provider-specific data when available`. These must be deleted, not surfaced.
3. **All 58 emerging profiles do have usable QILT data** (`emergingProviderDocProfiles.json`), 5–6 dimensions each, one `L/N` marker overall. Index range is −3.18 to +22.32 points, median +6.53.

## 5. Architecture

```
/search?InterestArea=…&Location=…
        │
        ▼
searchProvidersByFilters()          existing, unchanged filtering
        │
        ▼
classifyProviderSearchTier()        existing
        │
        ▼
compareByRecommendation()           NEW — pure deterministic sort
        │
        ├── endorsed  → certified desc, supports-in-place desc, name asc
        └── emerging  → qilt points desc, name asc
        │
        ▼
ProviderSearchResults                existing renderer
        │
        ├── rank-reason chip (endorsed)   NEW
        └── QILT chip + n (emerging)      NEW
```

Lead capture is orthogonal:

```
ShortlistGate (inline component)
        │  POST /api/shortlist  {email, consent, version, slugs, filters}
        ▼
validateEmail() → L1 syntax → L2 blocklist → L3 MX → L4 role
        │
        ├── reject → 422 with reason code
        └── accept → registerCRMContact() → signed cookie
                     └── async: double opt-in email via Sender
        │
        ▼
GET /api/providerCompare   (requires cookie) → comparison payload
```

**Files to create**

| Path | Purpose |
|---|---|
| `src/app/utilities/providerSearch/providerRanking.ts` | Pure ranking functions |
| `src/app/utilities/providerSearch/__tests__/providerRanking.test.ts` | Property tests |
| `src/app/utilities/leads/validateEmail.ts` | L1–L4 validation |
| `src/app/utilities/leads/disposableDomains.ts` | Bundled blocklist (`server-only`) |
| `src/app/utilities/leads/leadCookie.ts` | HMAC sign/verify |
| `src/app/api/shortlist/route.ts` | POST capture |
| `src/app/api/shortlist/confirm/route.ts` | Double opt-in confirmation |
| `src/app/api/providerCompare/route.ts` | GET gated comparison |
| `src/app/components/providerSearch/ShortlistGate.tsx` | Inline capture UI |
| `src/app/components/providerSearch/ProviderCompareTable.tsx` | Comparison table |
| `src/app/how-we-rank/page.tsx` | Methodology page |

**Files to modify**

| Path | Change |
|---|---|
| `src/app/utilities/providerSearch/searchProviders.ts` | Replace name/certified sort with `compareByRecommendation` |
| `src/app/components/providerSearch/ProviderSearchResults.tsx` | Render chips; pass ranking metadata |
| `src/app/components/endorsedProviders/endorsedProviderPageData.ts` | Delete placeholder QILT numbers |
| `src/app/utilities/register/registerSenderContact.ts` | Handle `other` persona without throwing |
| `src/app/utilities/providerSearch/providerSearchGa.ts` | Add Phase 2 events |
| `src/app/utilities/providerSearch/constants.ts` | New event names, copy constants |

---

## 6. Task list

Effort in hours. Each task is a separate commit. Update this table as you go.

### Phase 0 — Preconditions (human, blocking)

| ID | Task | Effort | Acceptance |
|---|---|---|---|
| T0.1 | Create HubSpot custom contact properties: `nda_source`, `nda_shortlist_unlocked_at`, `nda_verify_token`, `nda_verify_status` (enum: pending/verified/bounced), `nda_consent_version` | 1 | Properties visible in HubSpot; a test POST via `registerCRMContact` with all fields returns 2xx |
| T0.2 | Confirm licensing/attribution terms for republishing QILT/Compared.edu-derived figures | 1 | Written confirmation or a decision to cite-only |
| T0.3 | Delete the Collarts placeholder QILT numbers from `STAT_NUMBERS_BY_SLUG` | 0.1 | `STATS_BY_SLUG.collarts` is `[]`; no UI renders a fake score |
| T0.4 | Confirm gate scope: comparison-only (recommended) or also per-card depth | 0.1 | Written decision recorded in §2 |
| T0.5 | Legal review of consent copy + privacy policy update | 2 | Signed-off copy |
| T0.6 | Decide Sender.net handling for `hs_persona: 'other'` | 0.5 | Either a new group mapping or an explicit skip |

**Do not start Phase 4 until T0.1, T0.2, T0.4 and T0.5 are complete.**

### Phase 1 — Ranking core (no UI)

| ID | Task | Files | Effort | Acceptance |
|---|---|---|---|---|
| T1.1 | Implement `parsePercent`, `parseCount`, `computeQiltIndex`, `computeSupportInPlace`, `compareByRecommendation`, `buildRankReason` | `providerRanking.ts` | 4 | Functions are pure; no imports of React, `fetch`, or model code |
| T1.2 | Replace the tier sorts in `searchProviders.ts`; keep tier grouping intact | `searchProviders.ts` | 1 | Tier order unchanged; within-tier order deterministic |
| T1.3 | Property tests (see §7) | `providerRanking.test.ts` | 3 | All pass; includes shuffle-determinism test |
| T1.4 | Snapshot fixtures for 5 filter sets: `nursing in melbourne`, `psychology sydney`, `business in melbourne`, `IT in NSW`, `teaching in perth` | test file | 1 | Snapshots committed and reviewed by a human |

### Phase 2 — Result-card evidence

| ID | Task | Files | Effort | Acceptance |
|---|---|---|---|---|
| T2.1 | Endorsed chip: `43 supports in place · 8 in the works` | `ProviderSearchResults.tsx`, CSS | 2 | Renders only when support data exists; no percentage shown as rank basis |
| T2.2 | Emerging chip: `Student experience +18.2 pts vs national avg (n=297)` + QILT link | same | 2 | `n` always present when an index exists; hidden when no index |
| T2.3 | GA events `rec_view`, `rec_result_click` | `providerSearchGa.ts`, `constants.ts` | 2 | Fires in production only; no PII in params |
| T2.4 | Accessibility pass on chips | — | 1 | Text alternatives, contrast AA, no colour-only meaning |

### Phase 3 — Methodology page

| ID | Task | Files | Effort | Acceptance |
|---|---|---|---|---|
| T3.1 | `/how-we-rank` with per-tier basis, QILT citation, last-reviewed date, change log | new page | 2 | Does not claim the cross-tier order is QILT-based |
| T3.2 | Link from results page and footer | layout/footer | 0.5 | Reachable within one click from results |

### Phase 4 — Lead capture

| ID | Task | Files | Effort | Acceptance |
|---|---|---|---|---|
| T4.1 | `validateEmail` — L1 syntax/length, L2 blocklist, L3 MX (Node, 1.5 s timeout, 10 min cache), L4 role heuristics; allowlist `privaterelay.appleid.com`, `relay.firefox.com` | `leads/validateEmail.ts` | 4 | Returns typed reason codes; unit tests for each layer |
| T4.2 | Bundled disposable blocklist, marked `server-only` | `leads/disposableDomains.ts` | 1 | Client bundle size unchanged (verify build output) |
| T4.3 | HMAC cookie sign/verify: 30 d, `httpOnly`, `Secure`, `SameSite=Lax`, rotatable secret | `leads/leadCookie.ts` | 2 | Tampered/expired cookies rejected in tests |
| T4.4 | `POST /api/shortlist` — validate, rate limit, `registerCRMContact`, set cookie, return reason codes | route | 3 | 422 for invalid email; 200 + cookie for valid; no email in logs |
| T4.5 | Double opt-in token + `GET /api/shortlist/confirm` | route | 3 | Token single-use; sets `nda_verify_status=verified` |
| T4.6 | `GET /api/providerCompare` gated by cookie | route | 2 | 401 without cookie; payload limited to requested slugs |
| T4.7 | `ShortlistGate` — inline, labelled, `aria-live` errors, unticked consent checkbox | component | 3 | Keyboard operable; no focus trap; unlock announced |
| T4.8 | `ProviderCompareTable` — up to 3 providers, support counts + QILT dims, no verdict row | component | 3 | No "best"/ranking language; responsive |
| T4.9 | Consent copy + privacy policy update | content | 2 | Matches legal sign-off (T0.5) |
| T4.10 | GA `shortlist_view`, `shortlist_compare`, `lead_capture`, `lead_verify` | `providerSearchGa.ts` | 2 | Funnel visible end to end |

### Phase 5 — Monitoring and QA

| ID | Task | Effort | Acceptance |
|---|---|---|---|
| T5.1 | Server log line per lead request: outcome, reason, elapsed — never email | 1 | Logs contain no PII |
| T5.2 | Dashboard doc: rank CTR by tier, gate funnel, invalid-email reasons, opt-in rate | 1 | Documented queries/exploration saved |
| T5.3 | Manual QA matrix (§7.3) | 2 | All rows pass |
| T5.4 | Accessibility audit of gate + compare table | 1 | No critical axe violations |
| T5.5 | Feature flag (`NEXT_PUBLIC_RECOMMENDATIONS_ENABLED`) + rollback drill | 1 | Flag off restores the old order and hides the gate |

**Total: ~46 h.** Phase 0 is human time; Phases 1–5 are engineering.

---

## 7. Definition of done

### 7.1 Automated tests

| Test | Assertion |
|---|---|
| Tier dominance | No emerging result ever precedes an endorsed result |
| Determinism | Shuffling input produces identical output |
| Tie-break | Equal scores fall through to name, never input order |
| Index fixtures | The 8 `IT in NSW` values reproduce exactly: Campion +18.18, ASA +14.62, AIH +7.48, ICMS +7.07, UOW College +6.25, Holmes +5.83, APIC +5.60, UOW +3.83, UTS +2.13, Alphacrucis −3.18 |
| `L/N` | Dimension skipped; index still produced |
| Missing data | Provider without QILT sorts last, never crashes |
| Blocklist | `mailsac.com` rejected; `privaterelay.appleid.com` accepted |
| Cookie | Tampered/expired rejected |
| Route | Invalid email → 422, valid → 200 + cookie, compare without cookie → 401 |
| Snapshot | 5 filter sets match committed snapshots |

Run: `npm test`, `npm run lint`, `npm run typecheck`.

### 7.2 Copy guardrails

- No "best", "top", "recommended for you", "ranked #1".
- No statement that the cross-tier order is based on QILT.
- VET providers show `QILT does not survey VET providers`.
- Methodology page states the per-tier basis and the small-provider bias.

### 7.3 Manual QA matrix

| Input | Expected |
|---|---|
| `nursing in melbourne` | No endorsed results; no endorsed chip; emerging chip with `n` |
| `IT in NSW` | Nepean first with `43 supports in place`; 10 emerging by QILT |
| `business in melbourne` | Collarts first; QILT order below |
| `design in brisbane` | Empty state unchanged |
| Email `mailsac.com` | Inline error, no HubSpot contact created |
| Email `x@privaterelay.appleid.com` | Accepted |
| Valid Gmail | Cookie set, comparison unlocks, HubSpot contact created |
| Confirm link | Status becomes verified |
| Gate disabled | Old alphabetical order returns |
| Keyboard only | Gate completable, unlock announced |
| Screen reader | Errors and unlock announced |

### 7.4 Rollout

1. Ship behind `NEXT_PUBLIC_RECOMMENDATIONS_ENABLED`.
2. Enable for 100% — volume is too low for a meaningful staged rollout.
3. Rollback: unset the flag and redeploy (values are inlined at build time).

---

## 8. Open questions for the human

| # | Question | Why it blocks |
|---|---|---|
| 1 | Is QILT/Compared.edu republication permitted, and what attribution is required? | Cannot ship chips without it |
| 2 | Gate scope: comparison-only, or also per-card depth? | Changes component count and conversion expectations |
| 3 | Does Sender.net support double opt-in for this flow, or should the confirm route send the email itself? | Changes T4.5 substantially |
| 4 | Where does the "email me this shortlist" email get sent from (Sender template vs transactional)? | May add a task |
| 5 | Is the consent copy acceptable to legal as drafted? | Blocks T4.9 |
| 6 | Should the gate be hidden entirely for logged-in users? | Affects component state |

---

## 9. Traps found during planning — do not repeat

1. **Don't sort endorsed providers by percentage.** `in place ÷ total` rewards low disclosure; a provider listing 5 commitments, all done, scores 100% and outranks 43-of-51.
2. **Don't claim the order is QILT-based.** Three of four endorsed providers have no QILT data at all.
3. **Don't gate already-public facts.** The support framework is on each provider's detail page. Gate the comparison.
4. **Don't return `0` from the comparator on ties.** It makes order depend on input sequence.
5. **Don't import the blocklist client-side.** Use `server-only`.
6. **Don't run DNS lookups on Edge.** `export const runtime = 'nodejs'`.
7. **Don't post unknown properties to HubSpot.** It 400s the whole submission.
8. **Don't trust `hs_persona: 'other'`.** `PERSONA_TO_GROUP_MAP` has no mapping and the failure is silent.
9. **Don't use `n`-less QILT chips.** Small providers dominate the index; the sample size is the fairness disclosure.
10. **Don't add `ask_*` analytics events.** They belong to Phase 1 and would be dead producers.

---

## 10. Reference: expected ranking for the three demo searches

Computed from the current catalogue on 4 Nov 2026. Use these as review fixtures.

**`IT in NSW`** — 11 results

| # | Provider | Tier | Signal |
|---|---|---|---|
| 1 | Nepean Community College | endorsed | 43 in place · 8 in the works |
| 2 | Campion College Australia | emerging | +18.18 pts |
| 3 | ASA Institute of Higher Education | emerging | +14.62 |
| 4 | Australian Institute of Higher Education (AIH) | emerging | +7.48 |
| 5 | ICMS | emerging | +7.07 |
| 6 | UOW College Australia | emerging | +6.25 |
| 7 | Holmes Institute | emerging | +5.83 |
| 8 | APIC | emerging | +5.60 |
| 9 | University of Wollongong | emerging | +3.83 |
| 10 | University of Technology Sydney | emerging | +2.13 |
| 11 | Alphacrucis University College | emerging | −3.18 |

**`business in melbourne`** — 7 results: Collarts (endorsed, 23 in place) → Marcus Oldham +21.62 → Lyons +12.38 → Chisholm +8.75 → Academies Australasia +7.02 → Victoria University +4.45 → La Trobe College +2.63.

**`nursing in melbourne`** — 1 result: Victoria University (emerging, +4.45). No endorsed provider matches.

**`teaching in perth`** — 2 results: Health Science Hub (endorsed, 30 in place) → Stanley College (emerging).

---

## 11. Commit convention

```
feat(ranking): add provider ranking module
feat(ranking): apply recommendation order to search results
feat(search): show rank-reason and QILT chips
feat(leads): add email validation with disposable blocklist
feat(leads): gate shortlist comparison behind email capture
test(ranking): add determinism and fixture tests
docs: add how-we-rank methodology page
```

One task per commit. Do not mix Phase 1 and Phase 2 work.

---

## 12. Definition of "handover complete"

- [ ] Branch `feat/phase2-recommendation-and-lead-capture` created
- [ ] Plan doc §12–§14 revised after four critique passes
- [ ] This handover document committed
- [ ] Open questions in §8 sent to the owner
- [ ] No application code written (this is a planning branch state)
