---
name: personalised-welcome-email
description: >-
  Create a personalised Outlook-safe welcome email HTML pack for an NDA Endorsed
  Learning Organisation (badge, logos, certificate, SharePoint folder CTA). Use when
  the user asks for a partner welcome email, badge pack email, endorsed provider
  email HTML, or HSH/BCD/Nepean/Collarts style pack email.
---

# Personalised welcome email

Produce an Outlook-ready **badge & logo pack** HTML email for one endorsed partner.

## When to use

- “Create welcome email for [partner]”
- “Email HTML for Nepean / Collarts / HSH / BCD”
- Partner SharePoint folder is ready and needs a pack email

Guidelines PDFs belong in `personalised-badge-guidelines` — run that first if the PDF is missing.

## Required partner inputs

Ask for any missing fields:

| Field | Example |
|-------|---------|
| `org_name` | `Nepean Community College` |
| `org_short` / file label | `Nepean` → `email-Nepean-badge-pack.html` |
| `endorsement_id` | `47283` |
| `slug` | `nepean-community-college` |
| `utm_source` | usually same as `slug` |
| `sharepoint_folder_url` | full `:f:/g/...` SharePoint link |
| Guidelines PDF filename | `Nepean-Badge-Usage-Guidelines.pdf` |

CTA button label uses `org_short` (e.g. “Open Nepean badge & logo pack folder →”).

Copy blocks and Outlook rules: [reference.md](reference.md).

## Workflow

```
Email progress:
- [ ] Gather partner fields + SharePoint URL
- [ ] Confirm guidelines PDF name exists (or generate via guidelines skill)
- [ ] Clone nearest existing email-*-badge-pack.html
- [ ] Swap all partner-specific strings + tracked links
- [ ] Wire SharePoint href; remove PASTE_ / TODO placeholders
- [ ] Keep baked PNG header/footer (or regenerate partner banners)
- [ ] Preview in browser; copy paths for user
```

### 1. Template source

Dir: `deliverables/nda-endorsed-badge-circular/`

Clone the closest pack:

- `email-HSH-badge-pack.html`
- `email-BCD-badge-pack.html`
- `email-Nepean-badge-pack.html`
- `email-Collarts-badge-pack.html`

New file: `email-{Label}-badge-pack.html` (e.g. `email-Nepean-badge-pack.html`).

### 2. Replace partner strings

Update everywhere:

- HTML `<title>`, HTML comment `SUBJECT:` / `SHAREPOINT:`
- Preheader / body org name
- Endorsement details card (org, ID, public profile link)
- SharePoint button `href` + button label
- Guidelines PDF `<strong>` filename
- Profile CTA URL
- Footer “You’re receiving this because {org_name}…”

**Do not** leave `PASTE_SHAREPOINT_FOLDER_URL_HERE` or red TODO notes in send-ready mail.

### 3. Tracked links in the email

Profile (intro / details):

```
https://neurodiversityacademy.com/endorsedproviders/{slug}?utm_source={utm_source}&utm_medium=partner_badge&utm_campaign=endorsed_learning_organisation&utm_content=email_intro
```

Profile CTA (button):

```
https://neurodiversityacademy.com/endorsedproviders/{slug}?utm_source={utm_source}&utm_medium=partner_badge&utm_campaign=endorsed_learning_organisation
```

### 4. Outlook safety (non-negotiable)

- Keep **image** header/footer banners (`email-header-banner-*.png`, `email-footer-banner-*.png`) embedded as data URIs — do not switch back to HTML-only purple text headers (Outlook Web flips white text to black).
- Prefer Arial + table layout already in the template.
- White CTA labels: keep both CSS `color:#fffffe` and nested `<font color="#fffffe">`.
- Tell the user: open HTML in browser → Select All → Copy → paste into a **new** Outlook message (not Reply).

### 5. Sign-off (keep unless user overrides)

```
Warm regards,
Pratik Bhumkar
Head of Information Technology & Co-founder, Neurodiversity Academy
info@neurodiversityacademy.com
neurodiversityacademy.com
```

### 6. Deliver

- Save under `deliverables/nda-endorsed-badge-circular/`
- Optionally copy to `~/Downloads`
- Reply with file path, suggested subject, and Outlook paste tip

Suggested subject:

`NDA Endorsed badge & logo pack for {org_name} (Endorsement ID {endorsement_id})`

## Do not

- Invent SharePoint URLs or endorsement IDs  
- Strip social/media kit wording (logos, badge, certificate, FB/Insta/LinkedIn) unless asked  
- Use React / CSS Modules here — this is standalone email HTML with inline styles by design  
