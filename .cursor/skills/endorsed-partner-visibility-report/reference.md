# Partner visibility report — reference

## Service account

- Email: `ga4-partner-reports-viewer@natural-nebula-495411-v9.iam.gserviceaccount.com`
- Key file (local only): `~/.secrets/ga-viewer.json`
- GA4 role: **Viewer** on property `422109154`
- Cloud API: **Google Analytics Data API** (`analyticsdata.googleapis.com`)

## Live slugs (typical)

Derived from `endorsedProviders.json` via `slugify(id)`:

| Slug | Display name in reports |
|------|-------------------------|
| `nepean-community-college` | Nepean Community College |
| `hsh` | **Health Science Hub** (`DISPLAY_NAME_BY_SLUG`) |
| `blueprint-career-development` | Blueprint Career Development |
| `collarts` | Collarts |

Partner logos: `src/app/images/emergingInstitutions/*-large-logo.png`
(Nepean file may be named `napean-large-logo.png`).

## Final deliverable anatomy

```
partner-reports/
  INDEX.md
  {slug}.html              # Outlook-safe email body (1100px)
  {slug}.md
  {slug}-above-cta.png     # hero → visibility (embedded)
  {slug}-cta.png           # Open live — only real link
  {slug}-below-cta.png     # channels → footer (embedded)
  {slug}-chart.png         # month chart — attach to email
  {slug}-*-capture.html    # headless Chrome inputs (throwaway)
```

### HTML construction (`ga_partner_report_html.py`)

1. Outer **1100px** (`EMAIL_WIDTH`) table, page bg `#f0eef8`
2. **Above CTA** = `<img width="1100">` of `{slug}-above-cta.png`
3. **CTA** = linked `{slug}-cta.png` — fixed pixel width; **only** interactive element
4. **Below CTA** = `<img width="1100">` of `{slug}-below-cta.png`
5. CTA label text uses **regular** weight (`font-weight:400`), not bold

### Screenshot pipeline (`ga-partner-reports.py`)

1. Write `{slug}-chart-capture.html` → `{slug}-chart.png` (attachment only)
2. Write `{slug}-above-cta-capture.html` → `{slug}-above-cta.png`
3. Write `{slug}-cta-capture.html` → `{slug}-cta.png` (regular-weight label)
4. Write `{slug}-below-cta-capture.html` → `{slug}-below-cta.png`
5. Pillow crop near-white margins
6. `pad_png_to_width(..., EMAIL_WIDTH)` so above/below stay **1100px** wide
7. Embed above / CTA / below as data URIs in `{slug}.html`

Requires Chrome at a standard macOS/Linux path (`find_chrome()`).

**Do not** put live HTML tables for snapshot / quick key / quality / channels /
scroll in the final email — those belong inside the above/below screenshots.

## GA4 sources used by the script

| Metric | Filter |
|--------|--------|
| Profile views / users / engagement | `pagePath` **exact** `/endorsedproviders/{slug}` |
| Explore clicks | event `endorsed_explore_click` + same `pagePath` |
| Channels | `sessionDefaultChannelGroup` on profile page |
| Scroll | enhanced `scroll` + `percentScrolled` on profile page |

Custom dimension: `customEvent:provider_slug` (engagement events).

### Period rules

- Default report month = calendar month of `--as-of` (default yesterday)
- Month series starts at `MONTHLY_REPORTS_START = 2026-07-01`
- Incomplete month end is clamped to `--as-of`

## Known gaps

1. **`endorsed_cta_click`** sends `provider_id` / `provider_name`, not
   `provider_slug` — listing→profile clicks are **not** per-org. Profile
   **page views** are the partner-facing interest signal.
2. **GA title vs slug path:** Pages report by title can sum slug URL + legacy
   UUID URL for the same title (e.g. Collarts 47 + 25 = 72). Script uses slug
   path only.
3. Section-level interest is not a custom dimension; scroll depth is the proxy.

## Dependencies

```bash
.secrets-venv/bin/pip install -q \
  'google-analytics-data>=0.18.0' 'google-auth>=2.0.0' 'pillow>=10.0.0'
```

Plus system **Google Chrome** for screenshots.

## Email body (copy into skill handoff)

See **Email text / body** in [SKILL.md](SKILL.md). Always fill numbers from the
generated HTML / `INDEX.md` before showing the user. Attach `{slug}-chart.png`.

Sign-off:

```
Warm regards,
Pratik
Neurodiversity Academy
```

### July 2026 filled examples (first monthly report)

Use as tone/structure reference; regenerate numbers from the latest HTML each month.
Never use “HSH” in partner-facing copy — always **Health Science Hub**.

#### Nepean Community College

**Subject:** Your NDA partner visibility report — July 2026

```
Hi team,

Sharing your first monthly Neurodiversity Academy partner visibility report for July 2026.

In July, your endorsed Nepean Community College profile on NDA saw 68 page views
from 34 unique visitors, with 2 Explore clicks through to your website. Average
time on your profile was about 1 minute 20 seconds, with a strong 87% engagement
rate.

This is the start of a regular monthly snapshot so you can see how neurodivergent
learners are finding and engaging with Nepean via NDA.

Your live profile: https://www.neurodiversityacademy.com/endorsedproviders/nepean-community-college

Full detail (including traffic sources and scroll depth) is in the report —
paste/attach the HTML or PDF, and attach nepean-community-college-chart.png.

Happy to walk through the numbers anytime.

Warm regards,
Pratik
Neurodiversity Academy
```

#### Collarts

**Subject:** Your NDA partner visibility report — July 2026

```
Hi team,

Sharing your first monthly Neurodiversity Academy partner visibility report for July 2026.

In July, your endorsed Collarts profile on NDA saw 47 page views from 37 unique
visitors, with 2 Explore clicks to your courses site. Engagement was strong at
93%, with visitors spending about 31 seconds on average on your profile.

This is the start of a regular monthly snapshot so you can see how neurodivergent
learners are finding and engaging with Collarts via NDA.

Your live profile: https://www.neurodiversityacademy.com/endorsedproviders/collarts

Full detail is in the report — paste/attach the HTML or PDF, and attach
collarts-chart.png.

Happy to walk through the numbers anytime.

Warm regards,
Pratik
Neurodiversity Academy
```

#### Blueprint Career Development

**Subject:** Your NDA partner visibility report — July 2026

```
Hi team,

Sharing your first monthly Neurodiversity Academy partner visibility report for July 2026.

In July, your endorsed Blueprint profile on NDA saw 44 page views from 33 unique
visitors, and 4 Explore clicks through to your website — a solid 12% Explore rate.
Engagement rate sat at 83%, with about 43 seconds average time on profile.

This is the start of a regular monthly snapshot so you can see how neurodivergent
learners are finding and engaging with Blueprint via NDA.

Your live profile: https://www.neurodiversityacademy.com/endorsedproviders/blueprint-career-development

Full detail is in the report — paste/attach the HTML or PDF, and attach
blueprint-career-development-chart.png.

Happy to unpack the numbers with you.

Warm regards,
Pratik
Neurodiversity Academy
```

#### Health Science Hub (`hsh`)

**Subject:** Your NDA partner visibility report — July 2026

```
Hi team,

Sharing your first monthly Neurodiversity Academy partner visibility report for July 2026.

In July, your endorsed Health Science Hub profile on NDA saw 34 page views from
27 unique visitors, with 1 Explore click to your website. Attention quality was
excellent — 94% engagement rate and about 34 seconds average time on profile.

This is the start of a regular monthly snapshot so you can see how neurodivergent
learners are finding and engaging with Health Science Hub via NDA.

Your live profile: https://www.neurodiversityacademy.com/endorsedproviders/hsh

Full detail is in the report — paste/attach the HTML or PDF, and attach hsh-chart.png.

Happy to talk through the figures anytime.

Warm regards,
Pratik
Neurodiversity Academy
```
