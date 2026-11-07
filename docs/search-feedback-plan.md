# Plan — one-click results feedback

## 1. Scope and recommendation

**Recommendation: implement it.** It was in the original brief but is not represented
anywhere in T5.6–T5.20, so it currently has no owner, no event, and no test. It is a
small, self-contained client-side feature (~3–5 h) and does not require a new API
route or database.

### In scope

- A Yes/No prompt after non-empty search results on `/search`.
- Exactly one answer per results view.
- GA4 event with catalog filters and result count.
- No free-text field, no email, no raw query text.
- Keyboard/screen-reader accessible.
- Optional `trace_id` correlation when the search came through `/api/search/assist`.

### Out of scope

- Free-text comments.
- Storing feedback in HubSpot/DynamoDB.
- Server-side feedback endpoint.
- Dashboards (a GA4 exploration is enough for v1).

---

## 2. UX and placement

### Copy

> Did these results match what you expected? **\[Yes\] \[No\]**

After a click:

> Thanks for the feedback.

No text input, no optional comment box, no follow-up modal.

### Where it goes

The current `/search` page renders `ShortlistGate` as the provider list
(`ProviderSearchResults` is not mounted by `src/app/search/page.tsx`). Two valid
placements:

| Option              | Location                                                   | Trade-off                                                                  |
| ------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------- |
| **A (recommended)** | Immediately after `resultsSummary`, before `ShortlistGate` | Visible without scrolling; sits beside “N providers found”                 |
| B                   | After `ShortlistGate`                                      | Literal “after results”; can be pushed down when the compare panel expands |

Ship **A** first and move it below the list later if product prefers.

### When to show

- Show when `resultCount > 0`.
- Hide on zero-result pages. Zero-result searches are already tracked by
  `provider_search_results_view` with `has_results: false`; asking “did these results
  match” on an empty page adds noise. If product wants zero-result feedback later, it
  can be a separate variant.
- Do not show on the BotID verification screen (`verificationRequired === true`).
- One answer per page load. After clicking, replace the buttons with the thank-you
  message and do not render them again.

### Visual design

- A small horizontal row: question text, then two pill buttons.
- Use existing tokens: `--bondBlack`, `--ghostWhite`, `--cherryPieVariant`,
  `--poppins-font`, `--body2-font-size`.
- 44 px minimum hit target; visible `:focus-visible` outline; no colour-only meaning.
- Match the width/padding of `resultsSummary` (`max-width: 1200px`, `padding: 0 5vw`).

---

## 3. Analytics contract

Add one event to `PROVIDER_SEARCH_GA` in
`src/app/utilities/providerSearch/constants.ts`:

```ts
feedback: {
  eventName: 'provider_search_feedback',
  category: PROVIDER_SEARCH_GA_CATEGORY,
},
```

Event payload:

| Param            | Type   | Example          | Notes                                     |
| ---------------- | ------ | ---------------- | ----------------------------------------- |
| `category`       | string | `ProviderSearch` | Same category as the other search events  |
| `match`          | string | `yes` / `no`     | The actual answer                         |
| `surface`        | string | `search_page`    | `homepage` only if mounted there later    |
| `interest_areas` | string | `Nursing`        | Pipe-joined catalog labels                |
| `locations`      | string | `Melbourne\|VIC` | Pipe-joined catalog labels                |
| `result_count`   | number | `1`              | Total results shown                       |
| `trace_id`       | string | `4f1c…`          | Optional; only for assist-origin searches |
| `page_path`      | string | `/search`        | Added by `withPagePath`                   |

### Never send

- `query`, `text`, `prompt`, `completion`
- `email`, `name`, `phone`
- raw Ask input
- cookies/tokens

This matches the existing `provider_search_submit` and
`provider_search_results_view` privacy rules.

### GA4 setup

No code needed beyond the event. In GA4:

- Mark `provider_search_feedback` as an event (it will appear automatically).
- Create a custom dimension for `match` if you want it in explorations.
- Useful exploration: `match` by `interest_areas` / `locations`; match rate =
  `yes / (yes + no)`.

---

## 4. Trace correlation (recommended, small)

The feedback event is much more useful if it can join the server decision trace. The
assist route already returns `x-nda-trace-id`, and `requestAssistSearch()` already
exposes it as `traceId`.

Add a tiny session-storage helper:

**New file:** `src/app/utilities/providerSearch/searchTrace.ts`

```ts
const TRACE_KEY = 'nda:search:traceId';

export function rememberSearchTraceId(traceId: string | undefined): void {
  if (typeof window === 'undefined') return;
  try {
    if (traceId) window.sessionStorage.setItem(TRACE_KEY, traceId);
    else window.sessionStorage.removeItem(TRACE_KEY);
  } catch {
    // Storage can be unavailable in private mode; tracing is best-effort.
  }
}

export function readSearchTraceId(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return window.sessionStorage.getItem(TRACE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

export function clearSearchTraceId(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(TRACE_KEY);
  } catch {
    // Ignore.
  }
}
```

Wire it in `ProviderStudySearch.tsx` after a successful assist response, before
`router.push`:

```ts
rememberSearchTraceId(data.traceId);
```

The feedback component reads `readSearchTraceId()` on click, includes `traceId` if
present, then calls `clearSearchTraceId()`.

If you want to keep v1 smaller, skip this step; the event still works without
`trace_id`. I would include it because it directly supports the “join analytics to the
decision trace” goal.

---

## 5. Files to add or change

### New files

| File                                                                          | Purpose                                        |
| ----------------------------------------------------------------------------- | ---------------------------------------------- |
| `src/app/components/providerSearch/ProviderSearchFeedback.tsx`                | Client component with the Yes/No prompt        |
| `src/app/components/providerSearch/providerSearchFeedback.module.css`         | Styles                                         |
| `src/app/utilities/providerSearch/searchTrace.ts`                             | Session-storage trace-id helpers (recommended) |
| `src/app/components/providerSearch/__tests__/ProviderSearchFeedback.test.tsx` | Component tests                                |
| `src/app/utilities/providerSearch/__tests__/searchTrace.test.ts`              | Trace helper tests                             |

### Modified files

| File                                                                  | Change                                      |
| --------------------------------------------------------------------- | ------------------------------------------- |
| `src/app/utilities/providerSearch/constants.ts`                       | Add `PROVIDER_SEARCH_GA.feedback`           |
| `src/app/utilities/providerSearch/providerSearchGa.ts`                | Add `trackProviderSearchFeedback()`         |
| `src/app/search/page.tsx`                                             | Render `<ProviderSearchFeedback … />`       |
| `src/app/components/providerSearch/ProviderStudySearch.tsx`           | Remember trace id before navigation         |
| `src/app/utilities/providerSearch/__tests__/providerSearchGa.test.ts` | Assert the new event payload                |
| `docs/phase2-handover.md`                                             | Add T5.21 and status                        |
| `docs/observability.md`                                               | Document the GA/feedback join               |
| `docs/decision-tracing.md`                                            | Mention `provider_search_feedback.trace_id` |

---

## 6. Component implementation sketch

`src/app/components/providerSearch/ProviderSearchFeedback.tsx`:

```tsx
'use client';

import { useId, useState } from 'react';
import Typography, { TypographyVariant } from '@/app/components/typography/Typography';
import { TypographyColorToken } from '@/app/components/typography/typographyColorToken';
import type {
  ProviderSearchFilters,
  ProviderSearchSurface,
} from '@/app/utilities/providerSearch/constants';
import { trackProviderSearchFeedback } from '@/app/utilities/providerSearch/providerSearchGa';
import { clearSearchTraceId, readSearchTraceId } from '@/app/utilities/providerSearch/searchTrace';
import styles from './providerSearchFeedback.module.css';

type ProviderSearchFeedbackProps = {
  filters: ProviderSearchFilters;
  resultCount: number;
  surface?: ProviderSearchSurface;
};

export default function ProviderSearchFeedback({
  filters,
  resultCount,
  surface = 'search_page',
}: ProviderSearchFeedbackProps) {
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null);
  const headingId = useId();

  if (resultCount === 0) {
    return null;
  }

  function handleAnswer(match: 'yes' | 'no') {
    if (answer !== null) {
      return;
    }

    setAnswer(match);

    const traceId = readSearchTraceId();
    trackProviderSearchFeedback({
      match,
      surface,
      interestAreas: filters.interestAreas,
      locations: filters.locations,
      resultCount,
      ...(traceId ? { traceId } : {}),
    });
    clearSearchTraceId();
  }

  return (
    <div className={styles.root} role='group' aria-labelledby={headingId}>
      <Typography
        id={headingId}
        variant={TypographyVariant.Body2}
        color={TypographyColorToken.BondBlack}
      >
        Did these results match what you expected?
      </Typography>
      {answer === null ? (
        <div className={styles.actions}>
          <button type='button' className={styles.button} onClick={() => handleAnswer('yes')}>
            Yes
          </button>
          <button type='button' className={styles.button} onClick={() => handleAnswer('no')}>
            No
          </button>
        </div>
      ) : (
        <span className={styles.thanks} role='status' aria-live='polite'>
          Thanks for the feedback.
        </span>
      )}
    </div>
  );
}
```

Notes:

- Native `<button>` elements: keyboard-operable by default.
- `role='group'` + `aria-labelledby` gives the two buttons a shared accessible name.
- `role='status'` + `aria-live='polite'` announces the thank-you without moving focus.
- No input element anywhere, so “no free-text” is structurally guaranteed.

---

## 7. GA helper

Add to `src/app/utilities/providerSearch/providerSearchGa.ts`:

```ts
export function trackProviderSearchFeedback(params: {
  match: 'yes' | 'no';
  surface: ProviderSearchSurface;
  interestAreas: readonly string[];
  locations: readonly string[];
  resultCount: number;
  traceId?: string;
}): void {
  queueProviderSearchGaEvent(
    PROVIDER_SEARCH_GA.feedback.eventName,
    withPagePath({
      category: PROVIDER_SEARCH_GA.feedback.category,
      match: params.match,
      surface: params.surface,
      interest_areas: joinGaMultiValue(params.interestAreas),
      locations: joinGaMultiValue(params.locations),
      result_count: params.resultCount,
      ...(params.traceId ? { trace_id: params.traceId } : {}),
    }),
  );
}
```

`queueProviderSearchGaEvent` already handles the production-only gate and the `gtag`
retry loop, so nothing else is needed.

---

## 8. Page wiring

In `src/app/search/page.tsx`, inside the non-verification branch:

```tsx
import ProviderSearchFeedback from '@/app/components/providerSearch/ProviderSearchFeedback';

// ...

<div className={styles.resultsSummary}>
  {/* existing summary + ranking link */}
</div>

<ProviderSearchFeedback
  filters={filters}
  resultCount={totalCount}
  surface='search_page'
/>

<ShortlistGate ... />
```

If you prefer the prompt below the provider list, move the component after
`<ShortlistGate … />` instead. Either way, keep it inside the
`verificationRequired ? … : …` branch so it never appears behind the BotID gate.

---

## 9. Tests

### Component test — `ProviderSearchFeedback.test.tsx`

Mock `trackProviderSearchFeedback` and `searchTrace`.

Cases:

1. Renders the question and both buttons when `resultCount > 0`.
2. Returns nothing when `resultCount === 0`.
3. Clicking **Yes** calls the tracker once with:
   - `match: 'yes'`
   - `surface: 'search_page'`
   - the supplied `interestAreas` / `locations`
   - `resultCount`
4. Clicking **No** calls with `match: 'no'`.
5. After a click, the buttons are gone and `screen.getByRole('status')` contains
   “Thanks for the feedback.”
6. No textbox or textarea exists (`queryByRole('textbox')` is null).
7. The tracker is not called twice.
8. When `readSearchTraceId()` returns `'abc'`, the call includes `traceId: 'abc'`.

### GA test — extend `providerSearchGa.test.ts`

- Call `trackProviderSearchFeedback(...)` and assert `gtag` received
  `provider_search_feedback` with `category`, `match`, `interest_areas`, `locations`,
  `result_count`, and `trace_id`.
- Assert the payload does not contain `query`, `text`, `email`, or `prompt`.
- Assert `trace_id` is omitted when not supplied.

### Trace helper test — `searchTrace.test.ts`

- Remember → read returns the value.
- Clear → read returns `undefined`.
- `sessionStorage` throwing is swallowed (mock `setItem`/`getItem` to throw).

### Page wiring test (optional)

If you want to prove the page mounts it, follow
`src/app/endorsements/__tests__/page.test.tsx`:

- Mock `next/headers`, `ProviderStudySearch`, `ShortlistGate`, and
  `ProviderSearchResultsTracker`.
- `await ProviderSearchPage({ searchParams: Promise.resolve({}) })`.
- Assert `ProviderSearchFeedback` is rendered with `resultCount` and `filters`.

This is optional; the component test plus the one-line page change is usually enough.

### Manual QA

| Case                                              | Expected                                                           |
| ------------------------------------------------- | ------------------------------------------------------------------ |
| `/search?InterestArea=Nursing&Location=Melbourne` | Prompt appears once                                                |
| Click Yes                                         | One `provider_search_feedback` in GA4 DebugView; thank-you appears |
| Click No on a fresh load                          | One event with `match: no`                                         |
| Zero results                                      | Prompt absent                                                      |
| BotID gate screen                                 | Prompt absent                                                      |
| Keyboard only                                     | Tab reaches both buttons; Enter/Space activates                    |
| Screen reader                                     | Group label and thank-you announced                                |
| Preview/local                                     | No GA event; UI still works (tracker no-ops)                       |

---

## 10. Documentation updates

### `docs/phase2-handover.md`

Add a T5.21 row:

| ID    | Task                                                                                          | Files                                                               | Effort | Acceptance                                                                  |
| ----- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------ | --------------------------------------------------------------------------- |
| T5.21 | One-click results feedback: “Did these results match what you expected?” Yes/No, no free-text | `ProviderSearchFeedback.tsx`, `providerSearchGa.ts`, `constants.ts` | 1      | One GA event per answer; no raw text/email; keyboard/screen-reader operable |

Add an implementation-status bullet once shipped.

### `docs/observability.md`

In the correlation section, add:

> `provider_search_feedback` carries `trace_id` when the search originated from
> `/api/search/assist`, so user-reported match/no-match can be joined to the server
> decision trace.

### `docs/decision-tracing.md`

Add `provider_search_feedback.trace_id` to the list of GA events that join to the
trace.

---

## 11. Acceptance criteria

- [ ] `/search` with at least one result shows the prompt exactly once.
- [ ] Clicking Yes or No emits exactly one `provider_search_feedback` event.
- [ ] Payload contains `match`, `surface`, `interest_areas`, `locations`,
      `result_count`, `page_path`, and optional `trace_id`.
- [ ] Payload contains no raw query text, prompt/completion text, email, name, or
      phone.
- [ ] After answering, buttons are replaced by a polite thank-you; no second event.
- [ ] Zero-result and BotID-gate screens do not show the prompt.
- [ ] Keyboard and screen-reader QA pass; focus outline is visible.
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run test:ci`, and `npm run build` pass.
- [ ] GA4 DebugView shows the event on production only.

---

## 12. Rollout and measurement

1. Ship behind the existing production-only GA gate (no new flag needed).
2. Verify in GA4 DebugView on the production deployment.
3. Create a GA4 exploration:
   - Metric: feedback count by `match`.
   - Breakdown: `interest_areas`, `locations`, `surface`.
   - Match rate: `yes / (yes + no)`.
4. Review weekly:
   - High `no` buckets → data/ranking review, cross-link to
     `docs/evals/ranking-review.md`.
   - Very low response volume → check placement/visibility.
5. If the prompt feels noisy, add a session-storage suppression keyed by filter
   combination; do not do this before measuring.

---

## 13. Open decisions

1. **Placement:** above the provider list (recommended) or below it.
2. **Zero results:** hide (recommended) or show a “Did you expect more results?”
   variant.
3. **Trace correlation:** include the session-storage `trace_id` now (recommended) or
   defer.
4. **Repeat prompting:** once per page load (recommended) or once per filter
   combination per session.
5. **Feature flag:** none needed; the UI is inert without GA, and GA is already
   production-only. If the team wants a kill switch, add
   `NEXT_PUBLIC_SEARCH_FEEDBACK_ENABLED` with a default of `true`.

---

## 14. Estimated effort

| Work item                     | Estimate   |
| ----------------------------- | ---------- |
| Component + styles            | 1 h        |
| GA event + trace helper       | 1 h        |
| Page/navigation wiring        | 0.5 h      |
| Tests (component, GA, helper) | 1 h        |
| Docs + manual QA              | 1 h        |
| **Total**                     | **~4.5 h** |
