# Decision tracing

Every observed API request produces a decision trace. The trace explains **why**
the response happened — not just what was returned — and is reproducible from
the stored record without raw query text or email.

Implementation: `src/app/utilities/observability/events.ts` (schema),
`apiTrace.ts` (builder + span), and the route handlers.

## 1. Record shape

```ts
type ApiTraceEvent = {
  event: 'api_request';
  traceId: string; // random 128-bit id, returned as x-nda-trace-id
  timestamp: string; // ISO 8601
  route: string; // e.g. "search/assist"
  method: string;
  status: number;
  outcome: OutcomeCode;
  reason?: string; // required for every refusal/failure
  latencyMs: number;
  queryHash?: string; // sha256(normalised query), first 32 hex chars
  gate?: {
    automation: 'pass' | 'blocked';
    botId: 'pass' | 'unavailable' | 'blocked';
    rateLimit: 'pass' | 'blocked';
  };
  decision?: {
    path: 'keyword' | 'model' | 'off_topic' | 'suggestion' | 'gate' | 'n/a';
    reason?: string;
    area?: string | null; // catalog label, never free text
    locations?: string[]; // catalog labels
    resultCount?: number;
    tierCounts?: {
      courseEndorsed: number;
      endorsed: number;
      emerging: number;
    };
  };
  usage?: {
    surface: 'homepage' | 'search' | 'api';
    mode: 'quick' | 'ask' | 'n/a';
    usedModel: boolean;
    model?: string;
    cacheHit?: boolean;
    tokens?: { prompt: number | null; completion: number | null; total: number | null };
    tokensSaved?: { prompt: number | null; completion: number | null; total: number | null };
    emailSent?: boolean;
    slugCount?: number;
  };
};
```

## 2. Assist decision paths

| Path         | Preconditions                                         | Outcome                      | Reason examples                                           |
| ------------ | ----------------------------------------------------- | ---------------------------- | --------------------------------------------------------- |
| `keyword`    | Exact catalog area + one location                     | `keyword_hit`                | `keyword_match`                                           |
| `model`      | Keyword missed; model returned a valid area           | `model_hit`                  | `model_area`                                              |
| `suggestion` | Model returned no area; suggestions or fallback chips | `suggestion`                 | `model_no_match`, `model_http_error`, `model_unavailable` |
| `off_topic`  | Deterministic scope gate refused before the model     | `off_topic`                  | `generative`, `injection`, `advice_no_slot`               |
| `gate`       | Automation/BotID/rate-limit rejection                 | `forbidden` / `rate_limited` | `automation`, `bot`, `rate_limit`                         |

The `keyword` and `model` paths also store result counts and tier counts so a
support engineer can see whether the user landed on a zero-result page.

### Scope gate invariant

- Generative/coding/injection asks are always refused.
- Advice/comparison asks are refused **only when no catalog area or location
  slot exists**.
- `best nursing in Melbourne` is a search; `best uni for me` is a refusal.

### Ranking inputs

Ranking itself happens in the search page, not the assist route. The trace
records the resolved area/locations and per-tier counts. The comparator inputs
are deterministic and covered by existing tests:

1. tier: course-endorsed → endorsed → emerging,
2. NDA-certified before non-certified within a tier,
3. support-in-place / support-in-works counts,
4. QILT dimensions, points, and response counts.

`docs/evals/ranking-review.md` holds the human top-3 labels used to check the
result of those inputs.

## 3. Lead-capture traces

| Route               | Decision                     | Outcome            | Reason                                                       |
| ------------------- | ---------------------------- | ------------------ | ------------------------------------------------------------ |
| `shortlist`         | consent missing              | `consent_required` | `consent`                                                    |
| `shortlist`         | invalid email/slug/body      | `invalid_request`  | `email_*`, `invalid_slugs`, `malformed_json`                 |
| `shortlist`         | CRM write failed             | `storage_failed`   | `crm_write`                                                  |
| `shortlist`         | success                      | `ok`               | `shortlist_created` / `shortlist_created_email_unconfigured` |
| `shortlist/confirm` | token valid                  | `confirmed`        | `email_verified`                                             |
| `shortlist/confirm` | token reused/expired/bounced | `expired`          | `already_used_or_unknown`, `token_expired`, `email_bounced`  |
| `providerCompare`   | served                       | `ok`               | `compare_served`                                             |
| `verify`            | BotID passed                 | `ok`               | `verified` / `already_verified`                              |

No route records the email address, consent text, token, or cookie value.

## 4. Correlation

- The server returns `x-nda-trace-id` on every observed response.
- `requestAssistSearch()` forwards it as `traceId`.
- GA `provider_search_submit` includes `trace_id` when present.
- App Insights spans include `trace.id`; the JSON line includes `traceId`.
- HubSpot outcomes are joined by the shortlist's `slugCount` + timestamp window,
  not by email. If an exact join is needed, add the `traceId` to the CRM note
  explicitly; never add email to telemetry.

## 5. Reproducing a decision

1. Copy `traceId` from the alert or the browser response header.
2. In App Insights:

```kusto
requests
| where customDimensions["trace.id"] == "<traceId>"
| project timestamp, name, duration,
          outcome = customDimensions["api.outcome"],
          reason  = customDimensions["api.reason"],
          path    = customDimensions["search.path"],
          area    = customDimensions["search.area"],
          locations = customDimensions["search.locations"],
          resultCount = customDimensions["search.result_count"],
          gate = customDimensions["gate.automation"],
          model = customDimensions["model.name"],
          cacheHit = customDimensions["usage.cache_hit"],
          tokens = customDimensions["tokens.total"]
```

3. Re-run the same query text only if the user supplies it. The stored
   `queryHash` is intentionally non-reversible.
4. To reproduce the ranking, open `/search?InterestArea=<area>&Location=<loc>`
   with `searchDemo=1` if the bucket includes course-endorsed previews.

## 6. Retention and sampling

- App Insights retention: 90 days (workspace setting).
- Sampling: 100% (`samplingRatio: 1`) — traffic is low, and every refusal must
  be traceable. Revisit if cost exceeds the 5 GB free tier.
- Log lines contain the same fields, so a missing span can be reconstructed from
  the Vercel drain.

## 7. Completeness gate

`src/app/utilities/observability/__tests__/reasonCoverage.test.ts` scans every
observed route and fails CI if a reason-requiring outcome is logged without a
reason. The eval gate (`docs/evals/`) additionally asserts that every off-topic
golden case produces an `off_topic` outcome with a reason.
