#!/usr/bin/env python3
"""Generate branded partner badge guideline PDFs and HTML."""

from __future__ import annotations

import argparse
import base64
import shutil
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
OUT_DIR = Path(__file__).resolve().parent
DOWNLOADS = Path.home() / 'Downloads'

PATHS = {
    'nda_logo': ROOT / 'src/app/images/Logo-navbar.svg',
    'nda_logo_light': ROOT / 'src/app/images/footerLogo.svg',
    'badge': OUT_DIR / 'NDA-Endorsed-Badge-Circular-1000px.png',
    'hsh_logo': ROOT / 'src/app/images/emergingInstitutions/hsh-large-logo.png',
    'bcd_logo': ROOT / 'src/app/images/emergingInstitutions/blueprint-large-logo.png',
    'nepean_logo': ROOT / 'src/app/images/emergingInstitutions/napean-large-logo.png',
    'collarts_logo': ROOT / 'src/app/images/emergingInstitutions/collarts-large-logo.png',
}

ONEDRIVE_ROOT = (
    Path.home() / 'Library/CloudStorage/OneDrive-NeurodiversityAcademy'
)

KIT_FOLDERS = {
    'hsh': 'Neurodiversity Academy Media Kit HSH',
    'bcd': 'Neurodiversity Academy Media Kit BCD',
    'nepean': 'Neurodiversity Academy Media Kit Nepean Community College',
    'collarts': 'Neurodiversity Academy Media Kit Collarts',
}


def to_data_uri(path: Path, mime: str) -> str:
    encoded = base64.b64encode(path.read_bytes()).decode('ascii')
    return f'data:{mime};base64,{encoded}'


def build_assets() -> dict[str, str]:
    return {
        'nda_logo': to_data_uri(PATHS['nda_logo'], 'image/svg+xml'),
        'nda_logo_light': to_data_uri(PATHS['nda_logo_light'], 'image/svg+xml'),
        'badge': to_data_uri(PATHS['badge'], 'image/png'),
        'hsh_logo': to_data_uri(PATHS['hsh_logo'], 'image/png'),
        'bcd_logo': to_data_uri(PATHS['bcd_logo'], 'image/png'),
        'nepean_logo': to_data_uri(PATHS['nepean_logo'], 'image/png'),
        'collarts_logo': to_data_uri(PATHS['collarts_logo'], 'image/png'),
    }


def get_partners(assets: dict[str, str]) -> list[dict]:
    return [
        {
            'id': 'hsh',
            'file_name': 'HSH-Badge-Usage-Guidelines.pdf',
            'org_name': 'Health Science Hub',
            'org_short': 'HSH',
            'endorsement_id': '84173',
            'utm_source': 'hsh',
            'slug': 'hsh',
            'partner_logo': assets['hsh_logo'],
            'website': 'www.hsh.edu.au',
            'focus': 'vocational education',
        },
        {
            'id': 'bcd',
            'file_name': 'BCD-Badge-Usage-Guidelines.pdf',
            'org_name': 'Blueprint Career Development',
            'org_short': 'BCD',
            'endorsement_id': '29560',
            'utm_source': 'blueprint-career-development',
            'slug': 'blueprint-career-development',
            'partner_logo': assets['bcd_logo'],
            'website': 'www.blueprintcd.com.au',
            'focus': 'career education',
        },
        {
            'id': 'nepean',
            'file_name': 'Nepean-Badge-Usage-Guidelines.pdf',
            'org_name': 'Nepean Community College',
            'org_short': 'Nepean',
            'endorsement_id': '47283',
            'utm_source': 'nepean-community-college',
            'slug': 'nepean-community-college',
            'partner_logo': assets['nepean_logo'],
            'website': 'ncc.nsw.edu.au',
            'focus': 'community education',
        },
        {
            'id': 'collarts',
            'file_name': 'Collarts-Badge-Usage-Guidelines.pdf',
            'org_name': 'Collarts',
            'org_short': 'Collarts',
            'endorsement_id': '61847',
            'utm_source': 'collarts',
            'slug': 'collarts',
            'partner_logo': assets['collarts_logo'],
            'website': 'www.collarts.edu.au',
            'focus': 'higher education',
        },
    ]


def tracked_url(partner: dict, path: str = '', content: str = '') -> str:
    base = f'https://neurodiversityacademy.com{path}'
    query = (
        f"utm_source={partner['utm_source']}"
        '&utm_medium=partner_badge'
        '&utm_campaign=endorsed_learning_organisation'
    )
    if content:
        query += f'&utm_content={content}'
    return f'{base}?{query}'


def build_html(partner: dict, assets: dict[str, str]) -> str:
    primary_link = tracked_url(partner, f"/endorsedproviders/{partner['slug']}")
    home_link = tracked_url(partner, '/')
    endorsements_link = tracked_url(partner, '/endorsements')
    footer_link = tracked_url(
        partner, f"/endorsedproviders/{partner['slug']}", 'footer'
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>NDA Endorsed Badge Guidelines — {partner['org_name']}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root {{
      --cherry-pie: #330066;
      --cherry-variant: #6600cc;
      --ghost-white: #f8f8ff;
      --ghost-variant: #efefff;
      --bond-black: #070707;
      --bond-variant: #3e3e3e;
      --white: #ffffff;
      --accent-pink: #e91e8c;
      --accent-blue: #2d9cdb;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    @page {{ size: A4; margin: 0; }}
    body {{
      font-family: 'Poppins', Arial, sans-serif;
      color: var(--bond-black);
      background: var(--white);
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
    .page {{
      width: 210mm;
      min-height: 297mm;
      page-break-after: always;
      position: relative;
      overflow: hidden;
    }}
    .page:last-child {{ page-break-after: auto; }}
    .cover {{
      background: linear-gradient(160deg, #6600cc 0%, #4a0080 42%, #2a0055 100%);
      color: #fff;
      padding: 18mm 16mm 14mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }}
    .cover-top {{ display: flex; justify-content: space-between; align-items: flex-start; }}
    .nda-logo {{ height: 11mm; width: auto; }}
    .cover-pill {{
      background: rgba(255,255,255,0.14);
      border: 1px solid rgba(255,255,255,0.28);
      border-radius: 999px;
      padding: 2.5mm 5mm;
      font-size: 8pt;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #fff;
    }}
    .cover-main {{ text-align: center; margin: 8mm 0 10mm; }}
    .cover-badge {{
      width: 52mm; height: 52mm; margin: 0 auto 8mm;
      filter: drop-shadow(0 8px 24px rgba(0,0,0,0.28));
    }}
    .cover h1 {{
      font-size: 24pt; font-weight: 800; line-height: 1.15;
      margin-bottom: 4mm; color: #fff;
    }}
    .cover .subtitle {{
      font-size: 12pt; font-weight: 400; color: #ece3ff;
      max-width: 140mm; margin: 0 auto; line-height: 1.5;
    }}
    .cover-partner {{
      margin-top: 10mm; background: #fff; color: #070707;
      border-radius: 5mm; padding: 6mm 8mm;
      display: flex; align-items: center; gap: 6mm;
      box-shadow: 0 10px 30px rgba(0,0,0,0.18);
    }}
    .cover-partner img {{ max-height: 14mm; max-width: 42mm; object-fit: contain; }}
    .cover-partner .label {{
      font-size: 8pt; text-transform: uppercase; letter-spacing: 0.08em;
      color: #6600cc; font-weight: 700; margin-bottom: 1mm;
    }}
    .cover-partner .name {{ font-size: 13pt; font-weight: 700; line-height: 1.25; }}
    .cover-partner .id {{ font-size: 9pt; color: #3e3e3e; margin-top: 1.5mm; }}
    .cover-footer {{
      display: flex; justify-content: space-between; align-items: flex-end;
      font-size: 8.5pt; color: rgba(255,255,255,0.88);
      border-top: 1px solid rgba(255,255,255,0.22); padding-top: 5mm;
    }}
    .inner {{ padding: 14mm 16mm 16mm; min-height: 297mm; background: #fff; }}
    .page-header {{
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 2px solid #d8c7f5; padding-bottom: 4mm; margin-bottom: 8mm;
    }}
    .page-header img {{ height: 7mm; }}
    .page-header .tag {{
      font-size: 7.5pt; font-weight: 600; color: #6600cc;
      text-transform: uppercase; letter-spacing: 0.06em;
    }}
    h2 {{ font-size: 17pt; font-weight: 800; color: #330066; margin-bottom: 4mm; }}
    h3 {{ font-size: 11pt; font-weight: 700; color: #6600cc; margin: 5mm 0 2.5mm; }}
    p, li {{ font-size: 9.5pt; line-height: 1.55; color: #3e3e3e; }}
    p {{ margin-bottom: 3mm; }}
    .lead {{ font-size: 10.5pt; color: #070707; font-weight: 500; }}
    .story-grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; margin-top: 4mm; }}
    .story-card {{
      background: #f8f8ff; border: 1px solid #efefff;
      border-radius: 4mm; padding: 5mm;
    }}
    .story-card .icon {{
      width: 8mm; height: 8mm; border-radius: 50%;
      background: linear-gradient(135deg, #e91e8c, #2d9cdb); margin-bottom: 3mm;
    }}
    .story-card h4 {{ font-size: 10pt; font-weight: 700; color: #330066; margin-bottom: 2mm; }}
    .highlight-band {{
      background: linear-gradient(90deg, #330066, #6600cc);
      color: #fff; border-radius: 4mm; padding: 5mm 6mm; margin: 5mm 0;
    }}
    .highlight-band p {{ color: rgba(255,255,255,0.95); margin: 0; font-size: 9.5pt; }}
    ul {{ padding-left: 5mm; margin-bottom: 3mm; }}
    li {{ margin-bottom: 1.5mm; }}
    .two-col {{ display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }}
    .do-box {{ background: #f3ecff; border: 1px solid #e2cffc; border-radius: 4mm; padding: 4.5mm; }}
    .dont-box {{ background: #fff5f8; border: 1px solid #ffd6e5; border-radius: 4mm; padding: 4.5mm; }}
    .do-box h3 {{ color: #5a189a; margin-top: 0; }}
    .dont-box h3 {{ color: #c2185b; margin-top: 0; }}
    table {{ width: 100%; border-collapse: collapse; margin: 4mm 0 5mm; font-size: 8.5pt; }}
    th {{ background: #330066; color: #fff; text-align: left; padding: 2.5mm 3mm; font-weight: 600; }}
    td {{ border-bottom: 1px solid #efefff; padding: 2.5mm 3mm; vertical-align: top; color: #3e3e3e; }}
    tr:nth-child(even) td {{ background: #f8f8ff; }}
    .url-box {{
      background: #f3ecff; color: #23004a; border: 1px solid #e2cffc;
      border-radius: 3mm; padding: 3.5mm 4mm; font-family: 'Courier New', monospace;
      font-size: 7.2pt; line-height: 1.45; word-break: break-all; margin: 2mm 0 4mm;
    }}
    .url-label {{
      font-size: 8pt; font-weight: 700; color: #330066;
      text-transform: uppercase; letter-spacing: 0.05em; margin-top: 3mm;
    }}
    .badge-row {{
      display: flex; align-items: center; gap: 6mm;
      background: #f8f8ff; border-radius: 4mm; padding: 5mm; margin: 4mm 0;
    }}
    .badge-row img {{ width: 22mm; height: 22mm; }}
    .contact-page {{ background: linear-gradient(160deg, #f8f8ff 0%, #efefff 100%); }}
    .contact-card {{
      background: #fff; border-radius: 5mm; padding: 8mm;
      border: 1px solid #efefff; box-shadow: 0 8px 24px rgba(51,0,102,0.08); margin-top: 8mm;
    }}
    .contact-line {{ font-size: 10pt; font-weight: 600; color: #6600cc; margin: 2mm 0; }}
    .subject-line {{ margin-top: 5mm; }}
    .partner-ref {{ margin-top: 8mm; }}
    .legal {{ margin-top: 10mm; font-size: 8pt; color: #888; }}
    .page-num {{ position: absolute; bottom: 8mm; right: 16mm; font-size: 8pt; color: #999; }}
  </style>
</head>
<body>
  <section class="page cover">
    <div class="cover-top">
      <img class="nda-logo" src="{assets['nda_logo_light']}" alt="Neurodiversity Academy" />
      <div class="cover-pill">Endorsed Learning Organisation</div>
    </div>
    <div class="cover-main">
      <img class="cover-badge" src="{assets['badge']}" alt="NDA Endorsed badge" />
      <h1>Badge Usage Guidelines</h1>
      <p class="subtitle">Official guide for displaying the Neurodiversity Academy Endorsed Learning Organisation badge on your website and marketing materials.</p>
    </div>
    <div class="cover-partner">
      <img src="{partner['partner_logo']}" alt="{partner['org_name']}" />
      <div class="meta">
        <div class="label">Prepared for</div>
        <div class="name">{partner['org_name']}</div>
        <div class="id">Endorsement ID: {partner['endorsement_id']} · Version 1.0 · July 2026</div>
      </div>
    </div>
    <div class="cover-footer">
      <span>neurodiversityacademy.com</span>
      <span>info@neurodiversityacademy.com</span>
    </div>
  </section>

  <section class="page inner">
    <div class="page-header">
      <img src="{assets['nda_logo']}" alt="Neurodiversity Academy" />
      <span class="tag">{partner['org_short']} · Badge Guidelines</span>
    </div>
    <h2>About Neurodiversity Academy</h2>
    <p class="lead">We connect neurodivergent people with education and careers where they are supported, understood, and able to thrive.</p>
    <p>Neurodiversity Academy was founded by Will Wheeler and Pratik Bhumkar after recognising a gap between learning organisations that want to support neurodistinct students and the practical knowledge needed to do it well. As a social enterprise, we help bridge that gap — creating more inclusive pathways from education into meaningful work.</p>
    <div class="story-grid">
      <div class="story-card">
        <div class="icon"></div>
        <h4>Our mission</h4>
        <p>To connect neurodivergent people with the right education and jobs, where they know they will be supported, understood and given the opportunity to progress in their careers.</p>
      </div>
      <div class="story-card">
        <div class="icon"></div>
        <h4>Our vision</h4>
        <p>To set the standard around neurodiversity in higher education and the working environment, allowing neurodivergent people to feel safe and supported while developing in their careers.</p>
      </div>
    </div>
    <div class="highlight-band">
      <p><strong>{partner['org_name']}</strong> has earned the Neurodiversity Academy <strong>Endorsed Learning Organisation</strong> status — recognising your commitment to inclusive, neurodiversity-aware {partner['focus']}. Displaying this badge proudly signals that commitment to students, employers, and the community.</p>
    </div>
    <h3>What's included in your badge pack</h3>
    <table>
      <thead><tr><th>File</th><th>Size</th><th>Best for</th></tr></thead>
      <tbody>
        <tr><td>NDA-Endorsed-Badge-Circular-2000px.png</td><td>2000 × 2000 px</td><td>Print, presentations, large web</td></tr>
        <tr><td>NDA-Endorsed-Badge-Circular-1000px.png</td><td>1000 × 1000 px</td><td>Website pages, email campaigns</td></tr>
        <tr><td>NDA-Endorsed-Badge-Circular-512px.png</td><td>512 × 512 px</td><td>Footers, email signatures</td></tr>
      </tbody>
    </table>
    <div class="page-num">2</div>
  </section>

  <section class="page inner">
    <div class="page-header">
      <img src="{assets['nda_logo']}" alt="Neurodiversity Academy" />
      <span class="tag">{partner['org_short']} · Usage rules</span>
    </div>
    <h2>How to use the badge</h2>
    <div class="badge-row">
      <img src="{assets['badge']}" alt="Badge" />
      <div>
        <p><strong>Required:</strong> The badge must always be hyperlinked to an approved Neurodiversity Academy URL using the tracked links on page 4. Keep the badge circular, maintain at least <strong>80 px</strong> diameter on screen (20 mm in print), and leave <strong>10% clear space</strong> around the badge.</p>
      </div>
    </div>
    <div class="two-col">
      <div class="do-box">
        <h3>✓ Permitted</h3>
        <ul>
          <li>Linking the badge to approved NDA URLs</li>
          <li>Scaling down proportionally</li>
          <li>Placing on white, light grey, or brand backgrounds</li>
          <li>Using on websites, course pages, brochures, and email footers</li>
        </ul>
      </div>
      <div class="dont-box">
        <h3>✗ Not permitted</h3>
        <ul>
          <li>Altering colours, text, or circular shape</li>
          <li>Cropping, stretching, or adding overlay text</li>
          <li>Linking to unapproved URLs</li>
          <li>Implying endorsement beyond your organisation's status</li>
        </ul>
      </div>
    </div>
    <h3>Recommended placements</h3>
    <table>
      <thead><tr><th>Placement</th><th>File</th><th>Display size</th></tr></thead>
      <tbody>
        <tr><td>Website footer</td><td>512 or 1000 px</td><td>80–120 px wide</td></tr>
        <tr><td>About / endorsement page</td><td>1000 px</td><td>120–180 px wide</td></tr>
        <tr><td>Course landing pages</td><td>1000 px</td><td>100–150 px wide</td></tr>
        <tr><td>Print brochure</td><td>2000 px</td><td>25–40 mm diameter</td></tr>
        <tr><td>Email signature</td><td>512 px</td><td>60–80 px wide</td></tr>
      </tbody>
    </table>
    <h3>Accessibility</h3>
    <p>Always use this alt text: <strong>"Neurodiversity Academy Endorsed Learning Organisation badge"</strong>. Use a standard hyperlink so the badge is keyboard-focusable.</p>
    <div class="page-num">3</div>
  </section>

  <section class="page inner">
    <div class="page-header">
      <img src="{assets['nda_logo']}" alt="Neurodiversity Academy" />
      <span class="tag">{partner['org_short']} · Tracked links</span>
    </div>
    <h2>Your tracked hyperlinks</h2>
    <p class="lead">Use these exact URLs when linking the badge so we can measure visitors coming from {partner['website']}.</p>
    <p>Each link includes UTM parameters read by Google Analytics. Your organisation appears as <strong>Source: {partner['utm_source']}</strong> and <strong>Medium: partner_badge</strong>.</p>
    <div class="url-label">Primary link — your endorsed profile (recommended)</div>
    <div class="url-box">{primary_link}</div>
    <div class="url-label">Neurodiversity Academy homepage</div>
    <div class="url-box">{home_link}</div>
    <div class="url-label">Endorsements programme</div>
    <div class="url-box">{endorsements_link}</div>
    <div class="url-label">Example — footer placement</div>
    <div class="url-box">{footer_link}</div>
    <h3>Optional placement tracking</h3>
    <p>Append <strong>&amp;utm_content=</strong> to any link above:</p>
    <table>
      <thead><tr><th>Where on your site</th><th>Add to URL</th></tr></thead>
      <tbody>
        <tr><td>Footer</td><td>&amp;utm_content=footer</td></tr>
        <tr><td>About page</td><td>&amp;utm_content=about_page</td></tr>
        <tr><td>Courses page</td><td>&amp;utm_content=courses_page</td></tr>
        <tr><td>Email signature</td><td>&amp;utm_content=email_signature</td></tr>
      </tbody>
    </table>
    <div class="page-num">4</div>
  </section>

  <section class="page inner contact-page">
    <div class="page-header">
      <img src="{assets['nda_logo']}" alt="Neurodiversity Academy" />
      <span class="tag">{partner['org_short']} · Contact</span>
    </div>
    <h2>Questions &amp; support</h2>
    <p>For new placements, co-branded materials, or updated tracking links, we're here to help.</p>
    <div class="contact-card">
      <h2>Neurodiversity Academy</h2>
      <p class="contact-line">info@neurodiversityacademy.com</p>
      <p class="contact-line">neurodiversityacademy.com</p>
      <p class="subject-line">Subject line: <em>Endorsed badge usage — {partner['org_name']}</em></p>
      <div class="highlight-band partner-ref">
        <p><strong>{partner['org_name']}</strong><br>Endorsement ID: <strong>{partner['endorsement_id']}</strong><br>Public profile: neurodiversityacademy.com/endorsedproviders/{partner['slug']}</p>
      </div>
    </div>
    <p class="legal">© Neurodiversity Academy. Badge artwork is provided for use by {partner['org_name']} only, in accordance with these guidelines.</p>
    <div class="page-num">5</div>
  </section>
</body>
</html>"""


def copy_outputs(partner: dict, pdf_path: Path, html_path: Path, copy_downloads: bool) -> None:
    if copy_downloads:
        downloads_pdf = DOWNLOADS / partner['file_name']
        downloads_html = DOWNLOADS / f"{partner['id']}-guidelines.html"
        DOWNLOADS.mkdir(parents=True, exist_ok=True)
        shutil.copy2(pdf_path, downloads_pdf)
        shutil.copy2(html_path, downloads_html)
        print(f'  → Downloads: {downloads_pdf.name}, {downloads_html.name}')

    kit_name = KIT_FOLDERS.get(partner['id'])
    if not kit_name:
        return
    onedrive = ONEDRIVE_ROOT / kit_name / 'Badge - Endorsed Organisations'
    if not onedrive.is_dir():
        return
    dest = onedrive / partner['file_name']
    shutil.copy2(pdf_path, dest)
    stale = onedrive / 'HSH-Badge-Usage-Guidelines.pdf'
    if partner['id'] != 'hsh' and stale.exists():
        stale.unlink()
    print(f'  → OneDrive: {dest}')


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        '--out-dir',
        type=Path,
        default=OUT_DIR,
        help='Directory to write PDFs/HTML (default: this deliverables folder)',
    )
    parser.add_argument(
        '--copy-downloads',
        action='store_true',
        help='Also copy generated PDF and HTML into ~/Downloads',
    )
    parser.add_argument(
        '--partners',
        nargs='*',
        default=None,
        help='Optional partner ids (hsh bcd nepean collarts). Default: all.',
    )
    args = parser.parse_args()
    out_dir: Path = args.out_dir
    out_dir.mkdir(parents=True, exist_ok=True)

    for key, path in PATHS.items():
        if not path.exists():
            raise FileNotFoundError(f'Missing asset {key}: {path}')

    assets = build_assets()
    partners = get_partners(assets)
    if args.partners:
        wanted = set(args.partners)
        partners = [p for p in partners if p['id'] in wanted]
        missing = wanted - {p['id'] for p in partners}
        if missing:
            raise SystemExit(f'Unknown partner id(s): {", ".join(sorted(missing))}')

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch()
        context = browser.new_context()
        for partner in partners:
            html = build_html(partner, assets)
            html_path = out_dir / f"{partner['id']}-guidelines.html"
            pdf_path = out_dir / partner['file_name']
            html_path.write_text(html, encoding='utf-8')

            page = context.new_page()
            page.set_content(html, wait_until='networkidle')
            page.pdf(
                path=str(pdf_path),
                format='A4',
                print_background=True,
                margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'},
            )
            page.close()
            print(f'Created {pdf_path.name} + {html_path.name}')
            copy_outputs(partner, pdf_path, html_path, args.copy_downloads)

        browser.close()


if __name__ == '__main__':
    main()
