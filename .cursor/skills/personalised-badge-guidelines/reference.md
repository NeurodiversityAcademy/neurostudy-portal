# Badge guidelines — reference

## Tracked URL pattern

```
https://neurodiversityacademy.com{path}?utm_source={utm_source}&utm_medium=partner_badge&utm_campaign=endorsed_learning_organisation[&utm_content={content}]
```

| Label | Path | Optional content |
|-------|------|------------------|
| Primary (profile) | `/endorsedproviders/{slug}` | — |
| Homepage | `/` | — |
| Endorsements | `/endorsements` | — |
| Footer example | `/endorsedproviders/{slug}` | `footer` |

## Existing partners (seed data)

| id | org_name | endorsement_id | slug / utm_source | website | focus |
|----|----------|----------------|-------------------|---------|-------|
| hsh | Health Science Hub | 84173 | hsh | www.hsh.edu.au | vocational education |
| bcd | Blueprint Career Development | 29560 | blueprint-career-development | www.blueprintcd.com.au | career education |
| nepean | Nepean Community College | 47283 | nepean-community-college | ncc.nsw.edu.au | community education |
| collarts | Collarts | 61847 | collarts | www.collarts.edu.au | higher education |

## PDF structure (5 pages)

1. **Cover** — purple gradient, light NDA wordmark, badge, partner card  
2. **About** — mission/vision cards, partnership highlight, badge file table  
3. **Usage** — do/don’t, placements, alt text  
4. **Tracked links** — light purple URL boxes (dark text for contrast)  
5. **Contact** — info@neurodiversityacademy.com + endorsement ref  

## Brand tokens

- Cherry: `#330066` / `#6600cc`
- Ghost: `#f8f8ff` / `#efefff`
- Text: `#070707` / `#3e3e3e`
- Font: Poppins (Google Fonts in print HTML)

## CLI reminders

```bash
python3 generate-pdfs.py                        # all partners
python3 generate-pdfs.py --partners nepean      # one
python3 generate-pdfs.py --copy-downloads       # also ~/Downloads + OneDrive kits
```
