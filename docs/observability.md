# Observability runbook — Azure Monitor / Application Insights

Search, lead capture, and shortlist confirmation emit one structured trace per
request. Traces are correlated by `traceId` and joined to GA4 through the
`trace_id` parameter on `provider_search_submit`.

## 1. What ships where

| Signal                       | Producer                                      | Destination                        |
| ---------------------------- | --------------------------------------------- | ---------------------------------- |
| Request span (`api.<route>`) | `src/app/utilities/observability/apiTrace.ts` | App Insights `requests`            |
| Structured JSON line         | `recordApiEvent()` via `console.info`         | Vercel log drain → Azure Monitor   |
| Token/latency/model fields   | `callModelWithMeta()`                         | Span attributes + JSON line        |
| Config health warnings       | `src/instrumentation.ts`                      | Vercel log drain (`config_health`) |
| Search keyword probe         | `GET /api/search/health`                      | Azure availability test            |

The Azure Monitor OpenTelemetry distro is initialised only when
`APPLICATIONINSIGHTS_CONNECTION_STRING` is set. Without it the OpenTelemetry API
is a no-op and JSON logs still go to stdout.

## 2. Environment

```bash
# Required to export spans to App Insights
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=...;IngestionEndpoint=...

# Optional: require a header on the synthetic probe
SEARCH_HEALTH_TOKEN=

# Assist model (Azure AI Foundry)
ASSIST_API_URL=
ASSIST_API_KEY=
ASSIST_MODEL=
ASSIST_AUTH_HEADER=api-key
ASSIST_CACHE=on
```

`LEAD_COOKIE_SECRET` and `BOTID_COOKIE_SECRET` must each be 32+ characters.
Startup logs a `config_health` warning naming any that are missing. Values are
never logged.

## 3. Event schema

Every observed route emits:

```json
{
  "event": "api_request",
  "traceId": "4f1c…",
  "timestamp": "2026-11-07T10:00:00.000Z",
  "route": "search/assist",
  "method": "POST",
  "status": 200,
  "outcome": "keyword_hit",
  "reason": "keyword_match",
  "latencyMs": 6,
  "queryHash": "9a0f…",
  "gate": { "automation": "pass", "botId": "pass", "rateLimit": "pass" },
  "decision": {
    "path": "keyword",
    "area": "Nursing",
    "locations": ["Melbourne", "VIC"],
    "resultCount": 1,
    "tierCounts": { "courseEndorsed": 0, "endorsed": 1, "emerging": 0 }
  },
  "usage": {
    "surface": "search",
    "mode": "quick",
    "usedModel": false,
    "tokens": { "prompt": 0, "completion": 0, "total": 0 }
  }
}
```

Model calls add:

```json
{
  "usedModel": true,
  "model": "gpt-6-luna",
  "cacheHit": false,
  "tokens": { "prompt": 412, "completion": 22, "total": 434 }
}
```

A cache hit reports `"cacheHit": true`, zero actual `tokens`, and the avoided
cost in `tokensSaved`.

### Outcome codes

`ok`, `keyword_hit`, `model_hit`, `suggestion`, `off_topic`, `forbidden`,
`rate_limited`, `invalid_request`, `consent_required`, `not_available`,
`storage_failed`, `confirmed`, `expired`, `error`.

Every refusal, empty state, gate rejection, and failure **must** carry a
`reason`. `npm test` includes a static gate (`reasonCoverage.test.ts`) that fails
if a reason-requiring outcome is logged without one.

### Privacy rules

Never log:

- raw query text (only `queryHash`)
- email, name, phone, address
- prompt or completion content
- cookies, tokens, IP addresses, user agents

Catalog labels (`area`, `locations`), slugs, counts, model name, token counts,
latency, status, and outcome codes are safe.

## 4. Instrumented routes

| Route                        | Outcomes                                                                                                       |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `POST /api/search/assist`    | `keyword_hit`, `model_hit`, `suggestion`, `off_topic`, `forbidden`, `rate_limited`, `invalid_request`, `error` |
| `GET /api/search/health`     | `ok`, `forbidden`, `rate_limited`, `error`                                                                     |
| `POST /api/shortlist`        | `ok`, `consent_required`, `invalid_request`, `storage_failed`, `not_available`, `rate_limited`, `error`        |
| `GET /api/shortlist/confirm` | `confirmed`, `expired`, `invalid_request`, `storage_failed`, `not_available`, `rate_limited`                   |
| `GET /api/providerCompare`   | `ok`, `invalid_request`, `not_available`, `rate_limited`, `error`                                              |
| `POST /api/verify`           | `ok`, `forbidden`, `rate_limited`, `error`                                                                     |

## 5. KQL queries

Run in App Insights → Logs. Adjust the Vercel-drain table name if your workspace
uses a custom table instead of `AppTraces`.

### Request volume and outcomes

```kusto
requests
| where timestamp > ago(24h)
| where name startswith "api."
| extend outcome = tostring(customDimensions["api.outcome"]),
         reason  = tostring(customDimensions["api.reason"]),
         route   = tostring(customDimensions["api.route"])
| summarize count() by route, outcome, reason
| order by count_ desc
```

### 403 and 429 rates (compare with 7-day baseline)

```kusto
requests
| where timestamp > ago(1h)
| extend route   = tostring(customDimensions["api.route"]),
         status  = toint(customDimensions["api.status"])
| summarize requests = count(), blocked = countif(status in (403, 429)) by route
| extend blockedPct = round(100.0 * blocked / requests, 2)
| order by blockedPct desc
```

### Assist p95 latency

```kusto
requests
| where timestamp > ago(1h)
| where name == "api.search/assist"
| extend latency = toreal(customDimensions["api.latency_ms"])
| summarize p50 = percentile(latency, 50), p95 = percentile(latency, 95),
            p99 = percentile(latency, 99), calls = count()
```

### Model error rate

```kusto
requests
| where timestamp > ago(1h)
| where name == "api.search/assist"
| extend outcome = tostring(customDimensions["api.outcome"]),
         reason  = tostring(customDimensions["api.reason"])
| summarize total = count(),
            failures = countif(outcome == "error" or reason startswith "model_")
| extend failurePct = round(100.0 * failures / total, 2)
```

### Token cost and cache savings

```kusto
requests
| where timestamp > ago(24h)
| where name == "api.search/assist"
| extend usedModel = tobool(customDimensions["usage.used_model"]),
         cacheHit  = tobool(customDimensions["usage.cache_hit"]),
         prompt    = toint(customDimensions["tokens.prompt"]),
         completion= toint(customDimensions["tokens.completion"]),
         saved     = toint(customDimensions["tokens.saved_total"])
| summarize calls = count(),
            modelCalls = countif(usedModel),
            cacheHits = countif(cacheHit),
            promptTokens = sum(prompt),
            completionTokens = sum(completion),
            tokensSaved = sum(saved)
| extend cacheHitPct = round(100.0 * cacheHits / modelCalls, 2)
```

### Gate funnel

```kusto
requests
| where timestamp > ago(24h)
| where name == "api.search/assist"
| extend automation = tostring(customDimensions["gate.automation"]),
         botid      = tostring(customDimensions["gate.botid"]),
         rateLimit  = tostring(customDimensions["gate.rate_limit"])
| summarize count() by automation, botid, rateLimit
```

### HubSpot write failures

```kusto
requests
| where timestamp > ago(24h)
| where tostring(customDimensions["api.outcome"]) == "storage_failed"
| extend route = tostring(customDimensions["api.route"]),
         reason = tostring(customDimensions["api.reason"])
| summarize count() by route, reason
```

### Config health

```kusto
AppTraces
| where timestamp > ago(24h)
| where Message has "config_health"
| summarize count() by bin(timestamp, 1h)
```

## 6. Alerts

Create these in Azure Monitor → Alerts. Thresholds are starting points; tune
after one week of baseline data.

| Alert            | Condition                                  | Window        | Severity |
| ---------------- | ------------------------------------------ | ------------- | -------- |
| Assist 403 spike | 403 count > 2× the same-hour 7-day average | 15 min        | 2        |
| Rate limiting    | 429 count > 25                             | 15 min        | 3        |
| Assist latency   | p95 > 3000 ms                              | 15 min        | 2        |
| Model errors     | model failure rate > 5%                    | 15 min        | 1        |
| Verify failures  | `/api/verify` non-2xx > 5%                 | 15 min        | 2        |
| HubSpot writes   | `storage_failed` > 0                       | 15 min        | 1        |
| Missing secret   | `config_health` warning present            | 1 h           | 1        |
| Health probe     | `/api/search/health` non-200               | 2 consecutive | 1        |
| Foundry budget   | spend > 50% / 100% of $5                   | daily         | 2 / 1    |

## 7. Synthetic probe

Azure Monitor availability test (hourly, 3 regions):

- URL: `https://<host>/api/search/health`
- Method: `GET`
- Expected: HTTP 200, JSON `ok: true`, `area: "Nursing"`
- Optional header: `x-health-token: $SEARCH_HEALTH_TOKEN`

The probe exercises the deterministic keyword path only; it never calls the
model and never returns PII. A 503 means the catalog or keyword extractor
regressed.

## 8. Cost tracking

- `search/assist` spans carry `tokens.prompt`, `tokens.completion`,
  `tokens.total`, `tokens.saved_total`, `model.name`, and `cacheHit`.
- Cost rollup excludes `cacheHit == true` because those calls spend zero tokens.
- Foundry provides deployment-level TPM, latency, and spend metrics; join on the
  `model.name` / deployment name.
- Add a weekly line to the dashboard doc: model calls per 1,000 searches, total
  tokens, estimated cost, cache-hit rate, and 50%/100% budget status.

## 9. Runbook

1. **Alert fires.** Open the alert, copy the `traceId` from the failing span.
2. **Find the request.** Query `requests | where customDimensions["trace.id"] == "<id>"`.
3. **Read the decision.** Check `decision.path`, `decision.reason`, `gate`, and
   `usage`. Every refusal has a reason code.
4. **Join analytics.** GA4 `provider_search_submit` carries `trace_id`; use it to
   see whether the user navigated, got a suggestion, or was refused.
5. **Roll back if user-facing.** Set `ASSIST_CACHE=off` for cache problems, or
   `LEAD_CAPTURE_ENABLED=false` to disable lead capture. Search still works.
6. **Escalate data issues.** A bad ranking is a catalog/data fix, not a code fix;
   log it in the ranking review sheet.

## 10. Local verification

```bash
# No Azure connection string: spans are no-ops, JSON logs still print.
npm run test -- src/app/utilities/observability

# Inspect a trace in a route test
DEBUG_TEST_CONSOLE=1 npm run test -- src/app/api/__tests__/searchAssist.test.ts
```
