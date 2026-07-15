# Welcome email — reference

## Structure (keep order)

1. Preheader (hidden)
2. Purple **image** header banner (partnerised alt text)
3. Greeting + congratulations + pack contents + social permission
4. Endorsement details card (org, ID, profile)
5. SharePoint folder CTA + folder contents list (guidelines PDF, logos, badge, certificate)
6. Social & quick-start bullets
7. Primary tracked profile CTA
8. Sign-off (Pratik)
9. Purple **image** footer banner
10. Fine-print receipt line

## Folder contents list (standard)

- `{Label}-Badge-Usage-Guidelines.pdf` — usage rules, placements, company details, tracked links  
- NDA logos — web, print, email, social  
- Badge & icon artwork (circular PNGs) — web/print/email/social  
- Shared endorsement certificate — social announcement OK  

## Banner assets

Co-located PNGs (data-URI embedded in HTML):

| Role | Pattern |
|------|---------|
| Header | `email-header-banner-{slug-or-short}.png` |
| Footer | `email-footer-banner-{slug-or-short}.png` |
| Shared NDA logo raster | `email-header-nda-logo.png` |

If creating a **new** partner banner set, clone HSH/Nepean banner generation approach (rasterised purple bar + partnerised title) — do not ship HTML text-only headers.

## Existing packs

| Partner | File |
|---------|------|
| Health Science Hub | `email-HSH-badge-pack.html` |
| Blueprint Career Development | `email-BCD-badge-pack.html` |
| Nepean Community College | `email-Nepean-badge-pack.html` |
| Collarts | `email-Collarts-badge-pack.html` |

## Outlook paste checklist

- [ ] Opened in browser (not raw source in Outlook)  
- [ ] Pasted into **new** message  
- [ ] Header/footer images visible; purple text readable  
- [ ] SharePoint button opens correct folder  
- [ ] Profile button uses tracked UTM URL  
