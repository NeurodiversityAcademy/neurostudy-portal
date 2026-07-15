# NDA Endorsed badge — partner packs

Partner badge usage guidelines (PDF + HTML) and Outlook-ready email HTML packs.

## Generate PDFs and HTML

Requires Python 3, Playwright, and Chromium:

```bash
python3 -m playwright install chromium
python3 generate-pdfs.py
# optional: also copy into ~/Downloads
python3 generate-pdfs.py --copy-downloads
# optional: subset of partners
python3 generate-pdfs.py --partners nepean collarts
```

Outputs (per partner) in this folder:

- `{Partner}-Badge-Usage-Guidelines.pdf`
- `{id}-guidelines.html` (print source used to build the PDF)

## Email packs

Open in a browser, select all, copy, paste into a **new** Outlook message:

| Partner | Email HTML |
|---------|------------|
| Health Science Hub | `email-HSH-badge-pack.html` |
| Blueprint Career Development | `email-BCD-badge-pack.html` |
| Nepean Community College | `email-Nepean-badge-pack.html` |
| Collarts | `email-Collarts-badge-pack.html` |
