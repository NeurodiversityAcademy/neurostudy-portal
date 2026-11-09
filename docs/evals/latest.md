# Search intent eval — latest

- Mode: **offline**
- Run: 2026-11-09T09:03:00.478Z
- Golden set: `docs/evals/golden-search.json` (83 cases: 25 keyword, 25 model/synonym, 15 location-only, 8 area-only, 10 off-topic/injection)

| Metric                 | Result         | Threshold | Status  |
| ---------------------- | -------------- | --------- | ------- |
| extraction accuracy    | 0/0 (n/a)      | ≥ 95%     | not run |
| keyword-hit rate       | 25/25 (100.0%) | ≥ 100%    | pass    |
| area-only routing      | 8/8 (100.0%)   | ≥ 100%    | pass    |
| scope/refusal accuracy | 10/10 (100.0%) | ≥ 100%    | pass    |
| zero-result rate       | 0/73 (0.0%)    | ≤ 0%      | pass    |
| top-3 relevance        | 50/50 (100.0%) | ≥ 85%     | pass    |

Extraction accuracy is not measured offline; the nightly live job enforces the ≥95% gate.

**Result: all measured thresholds met; one or more metrics did not run.**

Failures: 0
