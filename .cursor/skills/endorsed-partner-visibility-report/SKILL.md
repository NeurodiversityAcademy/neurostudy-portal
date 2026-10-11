---
name: endorsed-partner-visibility-report
description: >-
  Generate personalised NDA endorsed-org visibility reports from GA4 (profile
  page views, Explore clicks, engagement, channels) via the repo script, and
  draft the Outlook email subject/body per partner. Use when the user asks for
  partner analytics reports, endorsed provider visibility digests, institute GA
  updates, Nepean/Collarts/Health Science Hub/Blueprint traffic reports, email
  copy for partner reports, or to regenerate partner-reports HTML for Outlook.
---

# Endorsed partner visibility report

Pull **per-org GA4 metrics** and write **Outlook-safe HTML** (+ markdown twin).
Do **not** rebuild the GA client or invent metrics — run the script.

## Defaults

| Item | Value |
|------|--------|
| Property ID | `422109154` |
| Credentials | `~/.secrets/ga-viewer.json` (Viewer service account) |
| Script | `scripts/ga-partner-reports.py` |
| HTML renderer | `scripts/ga_partner_report_html.py` |
| Python venv | `.secrets-venv/` (repo root) |
| Output dir | `partner-reports/` (gitignored) |
| Period | **Calendar month** (default: month of `--as-of`, usually yesterday) |
| Series start | **July 2026** — no Jan–Jun bars; refuse `--month` before `2026-07` |
| NDA logo (raster) | `scripts/assets/nda-logo-email.png` (black on white) |
| Display name | **Health Science Hub** for slug `hsh` (never “HSH” in partner copy) |
| Email width | **1100px** (`EMAIL_WIDTH` in `ga_partner_report_html.py`) |

Live orgs: `src/app/components/endorsedProviders/endorsedProviders.json` (`live: true`).

## Final HTML format (Outlook) — approved

The deliverable is a **wide (1100px) almost entirely baked-image email** so Outlook
cannot remapping colours, inflate buttons, or drop bar fills.

| Section | Format |
|---------|--------|
| **Above CTA** | One Chrome screenshot (`{slug}-above-cta.png`) — hero, snapshot, quick key, month chart, quality, visibility |
| **CTA only** | Baked PNG button (`{slug}-cta.png`, **regular** weight text) wrapped in `<a href="{live profile}">` — the **only** live link in the HTML |
| **Below CTA** | One Chrome screenshot (`{slug}-below-cta.png`) — channels, scroll, footer |
| **Chart attach** | `{slug}-chart.png` generated separately to **attach** to the email |
| Width | **1100px** canvas; above/below PNGs are padded to this width after crop |
| Colours | Cherry `#330066`, variant `#6600cc`, page bg `#f0eef8` |

### Why images

- Outlook remaps live `#ffffff` / light text on purple → dark (unreadable).
- Live tables (quick key, quality tiles), flex charts, and purple channel bars distort or lose colour.
- Do **not** revert sections to live Outlook HTML — keep above + CTA link + below.

### Output files per org

```
partner-reports/
  INDEX.md
  {slug}.html                 ← paste/open this (Outlook-safe)
  {slug}.md                   ← plain-text fallback
  {slug}-above-cta.png        ← baked top of report (embedded)
  {slug}-cta.png              ← Open live button (linked in HTML)
  {slug}-below-cta.png        ← baked bottom of report (embedded)
  {slug}-chart.png            ← month chart — ATTACH to email
  {slug}-*-capture.html       ← intermediates (ignore)
```

## Outlook send checklist

```
Send progress:
- [ ] Generate reports (script below)
- [ ] Preview {slug}.html in browser (Chrome or Cursor browser via local http.server)
- [ ] Confirm above-CTA image looks correct (hero → visibility)
- [ ] Confirm Open live CTA is image + clickable (only live link)
- [ ] Confirm below-CTA image looks correct (channels → footer)
- [ ] Confirm page is wide (~1100px)
- [ ] Copy HTML → paste into a **new** Outlook message
      OR Print → PDF and attach
- [ ] Attach {slug}-chart.png
- [ ] Use **Health Science Hub** (not HSH) for that partner
```

Preview tip (Cursor browser blocks `file://`):

```bash
cd partner-reports && python3 -m http.server 8765
# then open http://127.0.0.1:8765/{slug}.html in Cursor browser
```

## Workflow

```
Report progress:
- [ ] Confirm ~/.secrets/ga-viewer.json exists
- [ ] Ensure .secrets-venv deps (bootstrap if missing)
- [ ] Confirm Google Chrome is installed (needed for above/below/CTA/chart screenshots)
- [ ] Run script (all live orgs, or --slug for one)
- [ ] Show INDEX.md summary to user
- [ ] Preview {slug}.html (1100px; only CTA should be a live link)
- [ ] Point to {slug}-chart.png for attachment
- [ ] Draft filled subject + body per org (see Email text / body)
- [ ] Optional: user sends; do not leave {placeholders} in the draft
```

### 1. Bootstrap venv (only if missing)

```bash
python3 -m venv .secrets-venv
.secrets-venv/bin/pip install -q \
  'google-analytics-data>=0.18.0' 'google-auth>=2.0.0' 'pillow>=10.0.0'
```

Requires **Google Chrome** on the machine for headless screenshots.

### 2. Generate reports

```bash
# Current calendar month (through yesterday), all live orgs
.secrets-venv/bin/python scripts/ga-partner-reports.py

# Specific month
.secrets-venv/bin/python scripts/ga-partner-reports.py --month 2026-07

# One org
.secrets-venv/bin/python scripts/ga-partner-reports.py --month 2026-07 --slug collarts
```

Needs network + `~/.secrets/ga-viewer.json`. Prefer `required_permissions: ["all"]`.

### 3. Hand off to user

- Summarise `partner-reports/INDEX.md`
- Primary: `partner-reports/{slug}.html`
- Attachment: `partner-reports/{slug}-chart.png`
- Markdown twin for plain-text fallback
- User sends email unless they ask for a draft wrapper

Do **not** paste the service-account JSON or private key into chat.

## Metric definitions (partner language)

| Report label | Meaning |
|--------------|---------|
| **Profile page views** | Times exact path `/endorsedproviders/{slug}` was opened |
| **Unique profile visitors** | Distinct users on that path |
| **Explore clicks** | `endorsed_explore_click` on that profile → their website |
| **Explore rate** | Explore clicks ÷ unique visitors |
| Engagement / channels / scroll | Quality + acquisition context |

Lead with **page views + Explore clicks**.

### GA UI vs report (path vs title)

GA **Pages and screens** by **page title** can be **higher** than the report:
the same title (e.g. `Collarts | NDA Endorsed Provider`) may include an old
UUID path (`/endorsedproviders/{uuid}`) plus the slug path. The report counts
**slug path only** unless the script is changed. Explain this if the partner
compares to the GA title table.

## Email text / body

When handing off for send, **draft the subject + body** filled with that org’s
numbers from `INDEX.md` / the HTML. Paste the HTML into Outlook (or PDF) and
**attach `{slug}-chart.png`**.

### Subject

```
Your NDA partner visibility report — {Month YYYY}
```

### Body template

Use this structure. Fill `{…}` from the report. For the **first** monthly
report (July 2026 programme start), keep the “first monthly” wording; from the
second month onward, drop that and mention MoM only if the HTML shows a prior
month comparison.

```
Hi team,

Sharing your {first monthly |}Neurodiversity Academy partner visibility report for {Month YYYY}.

In {Month}, your endorsed {Org} profile on NDA saw {views} page views from
{visitors} unique visitors, with {explore} Explore clicks through to your website
({explore_rate} Explore rate). {optional_quality_sentence}

{first_month_line}
Your live profile: https://www.neurodiversityacademy.com/endorsedproviders/{slug}

Full detail (including traffic sources and scroll depth) is in the report —
paste/attach the HTML or PDF, and attach the month chart PNG.

Happy to walk through the numbers anytime.

Warm regards,
Pratik
Neurodiversity Academy
```

**Optional quality sentence** (pick from HTML “Quality of attention” when strong):

```
Attention quality was strong — {engagement_rate} engagement rate and about
{avg_time} average time on profile.
```

**First-month line** (July 2026 / no prior month only):

```
This is the start of a regular monthly snapshot so you can see how neurodivergent
learners are finding and engaging with {Org} via NDA.
```

**Later months** (when a prior month exists): replace the first-month line with
nothing, or one short MoM clause from the HTML trends (e.g. “vs {Prior Month}”).

### Placeholders

| Token | Source |
|-------|--------|
| `{Org}` | Display name (`Health Science Hub` for `hsh`) |
| `{Month}` / `{Month YYYY}` | e.g. July / July 2026 |
| `{views}` `{visitors}` `{explore}` `{explore_rate}` | Snapshot cards |
| `{engagement_rate}` `{avg_time}` | Quality of attention |
| `{slug}` | Attachment filename + live profile path |
| Live profile URL | `https://www.neurodiversityacademy.com/endorsedproviders/{slug}` |

### Worked example (Collarts · July 2026)

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

### Agent handoff rule

After generating reports, for **each** live org produce a ready-to-send
subject + body (filled numbers). Do not leave `{placeholders}` for the user
unless a figure is missing from the HTML.

## Agent rules

1. **Run the script** — do not re-implement GA4 queries in a new one-off file.
2. Do not commit `partner-reports/`, `.secrets-venv/`, `scripts/.mplconfig/`, or credential JSON.
3. Keep the **baked above-CTA + linked CTA + baked below-CTA** format at
   **1100px** — do not revert sections to live Outlook HTML tables/bars.
4. Always display **Health Science Hub** for `hsh`.
5. If API auth fails: check Viewer access for
   `ga4-partner-reports-viewer@natural-nebula-495411-v9.iam.gserviceaccount.com`
   on property `422109154`.
6. Flags: `--month YYYY-MM`, `--slug`, `--as-of`, `--credentials`, `--property-id`, `--out`.

## Related

- Welcome pack emails: `personalised-welcome-email`
- Badge guidelines PDFs: `personalised-badge-guidelines`
- Detail notes: [reference.md](reference.md)
