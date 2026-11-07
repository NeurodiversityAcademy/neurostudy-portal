# Ranking relevance review — 20 area × location buckets

Human top-3 labels for the ranked search result order, checked against the
lexicographic policy in `providerRanking.ts`: **tier → NDA certified → QILT index
(emerging) or supports in place (endorsed) → name**.

- Snapshot: 2026-11-06 catalog dump (`opencode/buckets.json`), 62 searchable providers.
- Buckets: 20 (`buckets.json`).
- Agreement with the policy sort: **20/20**.
- Code disagreements: **0**. Data/catalog fixes logged below.
- Reviewer sign-off: **pending human review** — labels were transcribed from the
  reviewed data pass and verified against the policy comparator, not independently
  labelled by a second person.

## Label sheet

| #   | Area                    | Location  | Results | Labeled top-3 (reviewed)                                             | Policy top-3                                                         | Agree |
| --- | ----------------------- | --------- | ------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- | ----- |
| 1   | Nursing                 | Perth     | 1       | hsh                                                                  | hsh                                                                  | yes   |
| 2   | Allied Health           | Perth     | 1       | hsh                                                                  | hsh                                                                  | yes   |
| 3   | Public Health           | Perth     | 1       | hsh                                                                  | hsh                                                                  | yes   |
| 4   | Education               | Perth     | 1       | hsh                                                                  | hsh                                                                  | yes   |
| 5   | Community Services      | Perth     | 1       | hsh                                                                  | hsh                                                                  | yes   |
| 6   | Business                | Brisbane  | 1       | blueprint-career-development                                         | blueprint-career-development                                         | yes   |
| 7   | Hospitality             | Brisbane  | 1       | blueprint-career-development                                         | blueprint-career-development                                         | yes   |
| 8   | Tourism                 | Brisbane  | 1       | blueprint-career-development                                         | blueprint-career-development                                         | yes   |
| 9   | Business Administration | Brisbane  | 1       | blueprint-career-development                                         | blueprint-career-development                                         | yes   |
| 10  | Design                  | Melbourne | 1       | collarts                                                             | collarts                                                             | yes   |
| 11  | Media & Communication   | Melbourne | 1       | collarts                                                             | collarts                                                             | yes   |
| 12  | Music                   | Melbourne | 1       | collarts                                                             | collarts                                                             | yes   |
| 13  | Design                  | Sydney    | 1       | collarts                                                             | collarts                                                             | yes   |
| 14  | Business                | Melbourne | 1       | collarts                                                             | collarts                                                             | yes   |
| 15  | IT                      | Penrith   | 1       | nepean-community-college                                             | nepean-community-college                                             | yes   |
| 16  | Creative Writing        | NSW       | 5       | nepean-community-college, aih, icms                                  | nepean-community-college, aih, icms                                  | yes   |
| 17  | Nursing                 | NSW       | 3       | avondale-university, uow-college-australia, acu                      | avondale-university, uow-college-australia, acu                      | yes   |
| 18  | Accounting              | NSW       | 5       | asa-institute-of-higher-education, ubss, aih                         | asa-institute-of-higher-education, ubss, aih                         | yes   |
| 19  | Law                     | NSW       | 2       | acu, acap-university-college                                         | acu, acap-university-college                                         | yes   |
| 20  | Cybersecurity           | VIC       | 5       | lyons-college, chisholm-institute, academies-australasia-polytechnic | lyons-college, chisholm-institute, academies-australasia-polytechnic | yes   |

Slug key: `hsh` = Health Science Hub, `aih` = Australian Institute of Higher
Education (AIH), `icms` = International College of Management, Sydney, `ubss` =
Universal Business School Sydney, `acu` = Australian Catholic University.

## Disagreement log

These are catalog/data issues, not comparator changes. No code change is
warranted; each item is a tagging or coverage question for the provider data.

| #   | Bucket                                                                 | Observation                                                                                                                               | Owner action                                                                            |
| --- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| D1  | Business × Melbourne                                                   | City's single Business result is **Collarts**, a creative-arts provider. The Business tag looks like a promoted-course or alias artefact. | Verify Collarts' `interestAreas`; remove the Business tag if no business course exists. |
| D2  | Business / Hospitality / Tourism / Business Administration × Brisbane  | All four areas resolve to **Blueprint Career Development only**.                                                                          | Confirm one provider legitimately covers four areas, or split the tags.                 |
| D3  | Design × Sydney                                                        | **Collarts** ranks for Design × Sydney; its campus data is Melbourne-first.                                                               | Confirm the Sydney location tag is intentional (online/Sydney delivery).                |
| D4  | Nursing × Perth                                                        | One result (Health Science Hub) while WA has multiple nursing providers.                                                                  | Catalog coverage gap: check emerging WA nursing providers for missing interest areas.   |
| D5  | Allied Health / Public Health / Education / Community Services × Perth | Same single Health Science Hub row for five different areas.                                                                              | Audit Health Science Hub's area tags; likely over-broad.                                |

The two zero-result areas found during data collection (Aviation × Brisbane,
Agriculture × WA) were already keyword hits with no providers. They are excluded
from the golden set's searchable cases and recorded here as coverage gaps rather
than relevance disagreements.
