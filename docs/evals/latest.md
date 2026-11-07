# Search intent eval — latest

- Mode: **offline**
- Run: 2026-11-07T01:11:41.259Z
- Golden set: `docs/evals/golden-search.json` (75 cases: 25 keyword, 25 model/synonym, 15 location-only, 10 off-topic/injection)

| Metric                 | Result         | Threshold | Status |
| ---------------------- | -------------- | --------- | ------ |
| extraction accuracy    | 0/0 (n/a)      | ≥ 95%     | pass   |
| keyword-hit rate       | 25/25 (100.0%) | ≥ 100%    | pass   |
| scope/refusal accuracy | 10/10 (100.0%) | ≥ 100%    | pass   |
| zero-result rate       | 0/65 (0.0%)    | ≤ 0%      | pass   |
| top-3 relevance        | 50/50 (100.0%) | ≥ 85%     | pass   |

**Result: all thresholds met.**

Failures: 0
