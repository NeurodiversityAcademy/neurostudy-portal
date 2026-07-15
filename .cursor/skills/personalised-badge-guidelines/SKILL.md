---
name: personalised-badge-guidelines
description: >-
  Create a personalised NDA Endorsed Learning Organisation Badge Usage Guidelines
  PDF (and print HTML) for a partner. Use when the user asks for badge guidelines,
  usage guidelines PDF, partner guide pack, HSH/BCD/Nepean/Collarts guidelines,
  or to regenerate generate-pdfs.py outputs for a new or existing endorsed provider.
---

# Personalised badge guidelines

Produce a partner-specific **Badge Usage Guidelines** PDF matching the HSH/Nepean pack format.

## When to use

- “Create guidelines for [partner]”
- “Generate Nepean/Collarts/HSH/BCD badge usage PDF”
- New endorsed provider needs a usage guide

Welcome / pack **emails** belong in `personalised-welcome-email` — use that skill instead.

## Required partner inputs

Ask for any missing fields before generating:

| Field | Example |
|-------|---------|
| `id` | `nepean` (kebab, used in filenames / CLI) |
| `org_name` | `Nepean Community College` |
| `org_short` | `Nepean` (page header tag) |
| `endorsement_id` | `47283` |
| `slug` | `nepean-community-college` (profile path) |
| `utm_source` | usually same as `slug` |
| `website` | `ncc.nsw.edu.au` (no protocol preferred) |
| `focus` | e.g. `community education`, `higher education` |
| `partner_logo` path | under `src/app/images/emergingInstitutions/` |

Optional: OneDrive media-kit folder name for auto-copy.

Full UTM / page content rules: [reference.md](reference.md).

## Workflow

Copy and track:

```
Guidelines progress:
- [ ] Gather partner fields
- [ ] Ensure logo + circular badge assets exist
- [ ] Add / update partner in generate-pdfs.py
- [ ] Generate PDF + HTML
- [ ] Copy to Downloads (and OneDrive kit if present)
- [ ] Spot-check cover ID, tracked links, partner name
```

### 1. Assets

Working dir:

`deliverables/nda-endorsed-badge-circular/`

Must exist:

- `NDA-Endorsed-Badge-Circular-1000px.png`
- Partner logo (PNG)
- `src/app/images/Logo-navbar.svg` + `footerLogo.svg` (script paths)

If logo is missing, place it under `src/app/images/emergingInstitutions/` and wire the path in `PATHS` / `get_partners`.

### 2. Register partner in `generate-pdfs.py`

Add entries to:

- `PATHS` (logo file)
- `build_assets()`
- `get_partners()` partner dict
- `KIT_FOLDERS` if OneDrive kit exists

Follow an existing partner block (HSH / Nepean). Do not invent endorsement IDs.

### 3. Generate

```bash
cd deliverables/nda-endorsed-badge-circular
python3 -m playwright install chromium   # if needed
python3 generate-pdfs.py --partners <id> --copy-downloads
```

Outputs:

- `{OrgShort-or-File}-Badge-Usage-Guidelines.pdf` (e.g. `Nepean-Badge-Usage-Guidelines.pdf`)
- `{id}-guidelines.html` (gitignored; rebuild anytime)

Default out dir is this deliverables folder; `--copy-downloads` also writes `~/Downloads`.

### 4. Verify

Confirm PDF has:

1. Cover — light NDA logo, partner logo, endorsement ID  
2. About — mission / vision + partner callout with correct `focus`  
3. Usage rules  
4. Tracked links — `utm_source`, profile/home/endorsements/footer URLs  
5. Contact — org name + ID + public profile path  

## Do not

- Change brand colours (`#330066`, `#6600cc`) or page structure casually  
- Put secret credentials in the PDF  
- Commit `*-guidelines.html` (gitignored; regenerate instead)  
- Invent SharePoint / endorsement IDs — ask the user  

## Aftercare

- Offer to run the welcome-email skill for the same partner  
- Mention PDF path(s) clearly in the reply  
