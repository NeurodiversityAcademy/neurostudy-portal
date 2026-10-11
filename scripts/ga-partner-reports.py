#!/usr/bin/env python3
"""Pull GA4 partner visibility metrics for live endorsed orgs and write email-ready reports."""

from __future__ import annotations

import argparse
import base64
import calendar
import html
import json
import mimetypes
import shutil
import subprocess
from dataclasses import dataclass
from datetime import date, timedelta
from pathlib import Path

from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import (
    DateRange,
    Dimension,
    Filter,
    FilterExpression,
    FilterExpressionList,
    Metric,
    OrderBy,
    RunReportRequest,
)
from google.oauth2 import service_account

DEFAULT_PROPERTY_ID = '422109154'
DEFAULT_CREDS = Path.home() / '.secrets' / 'ga-viewer.json'
REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUT = REPO_ROOT / 'partner-reports'
PROVIDERS_JSON = (
    REPO_ROOT / 'src' / 'app' / 'components' / 'endorsedProviders' / 'endorsedProviders.json'
)
SITE_ORIGIN = 'https://www.neurodiversityacademy.com'
NDA_LOGO_PATH = REPO_ROOT / 'scripts' / 'assets' / 'nda-logo-email.png'
PARTNER_LOGO_BY_SLUG = {
    'collarts': REPO_ROOT
    / 'src'
    / 'app'
    / 'images'
    / 'emergingInstitutions'
    / 'collarts-large-logo.png',
    'hsh': REPO_ROOT / 'src' / 'app' / 'images' / 'emergingInstitutions' / 'hsh-large-logo.png',
    'blueprint-career-development': REPO_ROOT
    / 'src'
    / 'app'
    / 'images'
    / 'emergingInstitutions'
    / 'blueprint-large-logo.png',
    'nepean-community-college': REPO_ROOT
    / 'src'
    / 'app'
    / 'images'
    / 'emergingInstitutions'
    / 'napean-large-logo.png',
}
# JSON still uses id "HSH" (slug stays hsh); display name matches the live profile.
DISPLAY_NAME_BY_SLUG = {
    'hsh': 'Health Science Hub',
}


@dataclass(frozen=True)
class Provider:
    name: str
    slug: str
    courses_url: str


def file_to_data_uri(path: Path) -> str | None:
    if not path.is_file():
        return None
    mime, _ = mimetypes.guess_type(str(path))
    if mime is None:
        mime = 'image/png'
    encoded = base64.b64encode(path.read_bytes()).decode('ascii')
    return f'data:{mime};base64,{encoded}'


def find_chrome() -> str | None:
    candidates = [
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        '/Applications/Chromium.app/Contents/MacOS/Chromium',
        shutil.which('google-chrome'),
        shutil.which('chromium'),
        shutil.which('chromium-browser'),
    ]
    for candidate in candidates:
        if candidate and Path(candidate).exists():
            return candidate
    return None


def screenshot_chart_html(
    chrome: str,
    html_path: Path,
    png_path: Path,
    *,
    window_size: str = '680,420',
    crop_pad: int = 16,
) -> None:
    """Render an HTML capture page to a PNG via headless Chrome."""
    png_path.parent.mkdir(parents=True, exist_ok=True)
    uri = html_path.resolve().as_uri()
    subprocess.run(
        [
            chrome,
            '--headless=new',
            '--disable-gpu',
            '--hide-scrollbars',
            f'--screenshot={png_path}',
            f'--window-size={window_size}',
            '--default-background-color=FFFFFFFF',
            uri,
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    if not png_path.is_file() or png_path.stat().st_size < 100:
        raise RuntimeError(f'Chrome screenshot failed for {html_path}')
    _crop_chart_whitespace(png_path, pad=crop_pad)


def _crop_chart_whitespace(png_path: Path, *, pad: int = 16) -> None:
    from PIL import Image

    img = Image.open(png_path).convert('RGBA')
    bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
    composed = Image.alpha_composite(bg, img).convert('RGB')
    pixels = composed.load()
    width, height = composed.size

    def is_content(x: int, y: int) -> bool:
        red, green, blue = pixels[x, y]
        return not (red > 250 and green > 250 and blue > 250)

    top = next((y for y in range(height) if any(is_content(x, y) for x in range(width))), 0)
    bottom = next(
        (y for y in range(height - 1, -1, -1) if any(is_content(x, y) for x in range(width))),
        height - 1,
    )
    left = next((x for x in range(width) if any(is_content(x, y) for y in range(height))), 0)
    right = next(
        (x for x in range(width - 1, -1, -1) if any(is_content(x, y) for y in range(height))),
        width - 1,
    )
    cropped = composed.crop(
        (
            max(0, left - pad),
            max(0, top - pad),
            min(width, right + pad + 1),
            min(height, bottom + pad + 1),
        )
    )
    cropped.save(png_path, 'PNG', optimize=True)


def pad_png_to_width(png_path: Path, target_width: int) -> None:
    """Keep a fixed email canvas width after whitespace crop."""
    from PIL import Image

    img = Image.open(png_path).convert('RGB')
    if img.width == target_width:
        return
    if img.width > target_width:
        img = img.resize(
            (target_width, max(1, round(img.height * target_width / img.width))),
            Image.Resampling.LANCZOS,
        )
        img.save(png_path, 'PNG', optimize=True)
        return
    canvas = Image.new('RGB', (target_width, img.height), (255, 255, 255))
    canvas.paste(img, ((target_width - img.width) // 2, 0))
    canvas.save(png_path, 'PNG', optimize=True)


def png_pixel_size(png_path: Path) -> tuple[int, int]:
    from PIL import Image

    with Image.open(png_path) as img:
        return img.size


def slugify(value: str) -> str:
    out = []
    prev_dash = False
    for ch in value.lower():
        if ch.isalnum():
            out.append(ch)
            prev_dash = False
        elif not prev_dash:
            out.append('-')
            prev_dash = True
    return ''.join(out).strip('-')


def load_live_providers() -> list[Provider]:
    rows = json.loads(PROVIDERS_JSON.read_text())
    providers: list[Provider] = []
    for row in rows:
        if not row.get('live'):
            continue
        slug = slugify(row['id'])
        providers.append(
            Provider(
                name=DISPLAY_NAME_BY_SLUG.get(slug, row['id']),
                slug=slug,
                courses_url=(row.get('institutionCoursesUrl') or '').strip(),
            )
        )
    return providers


def metric_map(response) -> dict[str, float]:
    names = [h.name for h in response.metric_headers]
    if not response.rows:
        return {name: 0.0 for name in names}
    values = [float(v.value or 0) for v in response.rows[0].metric_values]
    return dict(zip(names, values))


def rows_as_dicts(response) -> list[dict[str, str | float]]:
    dim_names = [h.name for h in response.dimension_headers]
    met_names = [h.name for h in response.metric_headers]
    out: list[dict[str, str | float]] = []
    for row in response.rows:
        item: dict[str, str | float] = {
            name: dim.value for name, dim in zip(dim_names, row.dimension_values)
        }
        for name, met in zip(met_names, row.metric_values):
            item[name] = float(met.value or 0)
        out.append(item)
    return out


def and_filters(*expressions: FilterExpression) -> FilterExpression:
    return FilterExpression(and_group=FilterExpressionList(expressions=list(expressions)))


def page_path_filter(slug: str) -> FilterExpression:
    return FilterExpression(
        filter=Filter(
            field_name='pagePath',
            string_filter=Filter.StringFilter(
                match_type=Filter.StringFilter.MatchType.EXACT,
                value=f'/endorsedproviders/{slug}',
            ),
        )
    )


def event_name_filter(event_name: str) -> FilterExpression:
    return FilterExpression(
        filter=Filter(
            field_name='eventName',
            string_filter=Filter.StringFilter(
                match_type=Filter.StringFilter.MatchType.EXACT,
                value=event_name,
            ),
        )
    )


def provider_slug_filter(slug: str) -> FilterExpression:
    return FilterExpression(
        filter=Filter(
            field_name='customEvent:provider_slug',
            string_filter=Filter.StringFilter(
                match_type=Filter.StringFilter.MatchType.EXACT,
                value=slug,
            ),
        )
    )


def run_report(client: BetaAnalyticsDataClient, property_id: str, **kwargs):
    return client.run_report(RunReportRequest(property=f'properties/{property_id}', **kwargs))


def fmt_int(value: float) -> str:
    return f'{int(round(value)):,}'


def fmt_pct(value: float) -> str:
    return f'{value * 100:.1f}%'


def fmt_duration(seconds: float) -> str:
    total = int(round(seconds))
    minutes, secs = divmod(total, 60)
    if minutes <= 0:
        return f'{secs}s'
    return f'{minutes}m {secs:02d}s'


def delta_label(current: float, previous: float) -> str:
    if previous <= 0 and current <= 0:
        return 'flat vs prior period'
    if previous <= 0:
        return 'new vs prior period'
    change = (current - previous) / previous
    sign = '+' if change >= 0 else ''
    return f'{sign}{change * 100:.0f}% vs prior period'


def avg_engagement_seconds(user_engagement_duration: float, users: float) -> float:
    if users <= 0:
        return 0.0
    return user_engagement_duration / users


def collect_period(
    client: BetaAnalyticsDataClient,
    property_id: str,
    provider: Provider,
    start: str,
    end: str,
) -> dict:
    date_ranges = [DateRange(start_date=start, end_date=end)]

    profile = metric_map(
        run_report(
            client,
            property_id,
            date_ranges=date_ranges,
            dimensions=[],
            metrics=[
                Metric(name='screenPageViews'),
                Metric(name='totalUsers'),
                Metric(name='sessions'),
                Metric(name='engagedSessions'),
                Metric(name='engagementRate'),
                Metric(name='userEngagementDuration'),
                Metric(name='averageSessionDuration'),
            ],
            dimension_filter=page_path_filter(provider.slug),
        )
    )

    explore = metric_map(
        run_report(
            client,
            property_id,
            date_ranges=date_ranges,
            metrics=[Metric(name='eventCount'), Metric(name='totalUsers')],
            dimension_filter=and_filters(
                event_name_filter('endorsed_explore_click'),
                page_path_filter(provider.slug),
            ),
        )
    )

    listing_cta = metric_map(
        run_report(
            client,
            property_id,
            date_ranges=date_ranges,
            metrics=[Metric(name='eventCount'), Metric(name='totalUsers')],
            dimension_filter=and_filters(
                event_name_filter('endorsed_cta_click'),
                provider_slug_filter(provider.slug),
            ),
        )
    )
    # endorsed_cta_click currently sends provider_id/name, not provider_slug —
    # and those params are not registered as GA4 custom dimensions, so per-org
    # listing CTA is usually 0 until tracking is aligned.
    listing_cta_attributable = listing_cta.get('eventCount', 0.0) > 0

    scroll_depth = rows_as_dicts(
        run_report(
            client,
            property_id,
            date_ranges=date_ranges,
            dimensions=[Dimension(name='percentScrolled')],
            metrics=[Metric(name='eventCount'), Metric(name='totalUsers')],
            dimension_filter=and_filters(
                event_name_filter('scroll'),
                page_path_filter(provider.slug),
            ),
            order_bys=[
                OrderBy(
                    dimension=OrderBy.DimensionOrderBy(dimension_name='percentScrolled'),
                    desc=False,
                ),
            ],
            limit=10,
        )
    )

    # Prefer enhanced measurement scroll; fall back to custom scroll_depth counts.
    if not scroll_depth:
        scroll_depth = rows_as_dicts(
            run_report(
                client,
                property_id,
                date_ranges=date_ranges,
                dimensions=[Dimension(name='eventName')],
                metrics=[Metric(name='eventCount'), Metric(name='totalUsers')],
                dimension_filter=and_filters(
                    event_name_filter('scroll_depth'),
                    page_path_filter(provider.slug),
                ),
                limit=5,
            )
        )
        for row in scroll_depth:
            row['percentScrolled'] = 'custom scroll_depth'

    sources = rows_as_dicts(
        run_report(
            client,
            property_id,
            date_ranges=date_ranges,
            dimensions=[Dimension(name='sessionDefaultChannelGroup')],
            metrics=[Metric(name='sessions'), Metric(name='totalUsers')],
            dimension_filter=page_path_filter(provider.slug),
            order_bys=[
                OrderBy(metric=OrderBy.MetricOrderBy(metric_name='sessions'), desc=True),
            ],
            limit=5,
        )
    )

    users = profile.get('totalUsers', 0.0)
    explore_clicks = explore.get('eventCount', 0.0)
    explore_rate = (explore_clicks / users) if users else 0.0

    return {
        'profile_views': profile.get('screenPageViews', 0.0),
        'profile_users': users,
        'sessions': profile.get('sessions', 0.0),
        'engaged_sessions': profile.get('engagedSessions', 0.0),
        'engagement_rate': profile.get('engagementRate', 0.0),
        'avg_engagement_sec': avg_engagement_seconds(
            profile.get('userEngagementDuration', 0.0),
            users,
        ),
        'avg_session_sec': profile.get('averageSessionDuration', 0.0),
        'explore_clicks': explore_clicks,
        'explore_users': explore.get('totalUsers', 0.0),
        'explore_rate': explore_rate,
        'listing_cta_clicks': listing_cta.get('eventCount', 0.0),
        'listing_cta_users': listing_cta.get('totalUsers', 0.0),
        'listing_cta_attributable': listing_cta_attributable,
        'sources': sources,
        'scroll_depth': scroll_depth,
    }


def render_report(
    provider: Provider,
    current: dict,
    previous: dict,
    current_label: str,
    previous_label: str,
    generated_on: date,
) -> str:
    profile_url = f'{SITE_ORIGIN}/endorsedproviders/{provider.slug}'
    lines = [
        f'# {provider.name} — NDA Partner Visibility Report',
        '',
        f'**Period:** {current_label}  ',
        f'**Compared to:** {previous_label}  ',
        f'**Generated:** {generated_on.isoformat()}  ',
        f'**Live profile:** {profile_url}',
        '',
        'Niche neurodiversity education discovery via Neurodiversity Academy.',
        '',
        '## Snapshot',
        '',
        f'| Metric | Current | Trend |',
        f'| --- | ---: | --- |',
        (
            f'| Profile page views | {fmt_int(current["profile_views"])} | '
            f'{delta_label(current["profile_views"], previous["profile_views"])} |'
        ),
        (
            f'| Unique profile visitors | {fmt_int(current["profile_users"])} | '
            f'{delta_label(current["profile_users"], previous["profile_users"])} |'
        ),
        (
            f'| Explore clicks (to your website) | {fmt_int(current["explore_clicks"])} | '
            f'{delta_label(current["explore_clicks"], previous["explore_clicks"])} |'
        ),
        (
            f'| Explore rate (clicks ÷ visitors) | {fmt_pct(current["explore_rate"])} | '
            f'{delta_label(current["explore_rate"], previous["explore_rate"])} |'
        ),
        '',
        '## Quality of attention',
        '',
        f'- **Avg engagement time on profile:** {fmt_duration(current["avg_engagement_sec"])} '
        f'({delta_label(current["avg_engagement_sec"], previous["avg_engagement_sec"])})',
        f'- **Engagement rate:** {fmt_pct(current["engagement_rate"])} '
        f'({delta_label(current["engagement_rate"], previous["engagement_rate"])})',
        f'- **Sessions on profile:** {fmt_int(current["sessions"])} '
        f'({fmt_int(current["engaged_sessions"])} engaged)',
        '',
        '## Visibility → your website',
        '',
        (
            f'- **Opened your NDA profile (page views):** {fmt_int(current["profile_views"])} '
            f'from {fmt_int(current["profile_users"])} visitors'
        ),
        (
            f'- **Clicked Explore to your website:** {fmt_int(current["explore_clicks"])} '
            f'from {fmt_int(current["explore_users"])} users'
        ),
    ]
    if provider.courses_url:
        lines.append(f'- **Destination:** {provider.courses_url}')

    lines.extend(['', '## How visitors found your profile', ''])
    if current['sources']:
        lines.append('| Channel | Sessions | Users |')
        lines.append('| --- | ---: | ---: |')
        for row in current['sources']:
            channel = str(row.get('sessionDefaultChannelGroup') or '(not set)')
            lines.append(
                f'| {channel} | {fmt_int(float(row.get("sessions", 0)))} | '
                f'{fmt_int(float(row.get("totalUsers", 0)))} |'
            )
    else:
        lines.append('_No channel data for this period._')

    lines.extend(['', '## How far they scrolled on your profile', ''])
    if current['scroll_depth']:
        lines.append('| Scroll depth | Events | Users |')
        lines.append('| --- | ---: | ---: |')
        for row in current['scroll_depth']:
            depth = str(row.get('percentScrolled') or '(not set)')
            if depth in {'(not set)', ''}:
                continue
            suffix = '%' if depth.isdigit() else ''
            lines.append(
                f'| {depth}{suffix} | {fmt_int(float(row.get("eventCount", 0)))} | '
                f'{fmt_int(float(row.get("totalUsers", 0)))} |'
            )
    else:
        lines.append('_Scroll-depth data not available for this period._')

    lines.extend(
        [
            '',
            '---',
            '',
            '_Profile page views = times your NDA endorsed profile was opened._',
            '_Explore clicks = people who left NDA for your website via the Explore button._',
            '_Questions about this report? Reply to this email._',
            '',
        ]
    )
    return '\n'.join(lines)


import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from ga_partner_report_html import (
    EMAIL_WIDTH,
    MONTHLY_REPORTS_START,
    first_series_month,
    format_month_label,
    month_bounds,
    render_above_cta_capture_html,
    render_below_cta_capture_html,
    render_chart_capture_html,
    render_cta_capture_html,
    render_html_report,
    resolve_report_month,
)


def main() -> None:
    parser = argparse.ArgumentParser(description='Generate endorsed-org GA partner reports')
    parser.add_argument('--property-id', default=DEFAULT_PROPERTY_ID)
    parser.add_argument('--credentials', type=Path, default=DEFAULT_CREDS)
    parser.add_argument(
        '--month',
        default=None,
        help='Report month as YYYY-MM (default: calendar month of --as-of)',
    )
    parser.add_argument(
        '--as-of',
        default='yesterday',
        help='YYYY-MM-DD or "yesterday" — clamps incomplete month end',
    )
    parser.add_argument('--out', type=Path, default=DEFAULT_OUT)
    parser.add_argument(
        '--slug',
        action='append',
        default=[],
        help='Limit to one or more provider slugs (repeatable)',
    )
    args = parser.parse_args()

    if args.as_of == 'yesterday':
        as_of = date.today() - timedelta(days=1)
    else:
        as_of = date.fromisoformat(args.as_of)

    report_year, report_month = resolve_report_month(args.month, as_of)
    report_month_start = date(report_year, report_month, 1)
    if report_month_start > as_of:
        raise SystemExit('Report month cannot be after --as-of date')
    if report_month_start < MONTHLY_REPORTS_START:
        raise SystemExit(
            f'Monthly reports start {MONTHLY_REPORTS_START:%Y-%m}; '
            f'got {report_year}-{report_month:02d}'
        )
    series_from = first_series_month(report_year)

    creds = service_account.Credentials.from_service_account_file(
        str(args.credentials),
        scopes=['https://www.googleapis.com/auth/analytics.readonly'],
    )
    client = BetaAnalyticsDataClient(credentials=creds)
    providers = load_live_providers()
    if args.slug:
        wanted = set(args.slug)
        providers = [p for p in providers if p.slug in wanted]
        missing = wanted - {p.slug for p in providers}
        if missing:
            raise SystemExit(f'Unknown or non-live slug(s): {", ".join(sorted(missing))}')

    month_label = format_month_label(report_year, report_month)
    args.out.mkdir(parents=True, exist_ok=True)
    index_lines = [
        f'# Partner visibility reports ({month_label})',
        '',
        (
            f'Compared with earlier months from '
            f'{format_month_label(report_year, series_from)} onward'
            if report_month > series_from
            else f'First monthly report month ({MONTHLY_REPORTS_START:%B %Y} programme start)'
        ),
        '',
    ]

    nda_logo_uri = file_to_data_uri(NDA_LOGO_PATH)
    chrome = find_chrome()
    if chrome is None:
        raise SystemExit(
            'Google Chrome not found — needed to screenshot the month chart for Outlook attachments'
        )

    for provider in providers:
        month_series: list[dict] = []
        for month in range(series_from, report_month + 1):
            start, end = month_bounds(report_year, month, as_of)
            if start > as_of:
                continue
            metrics = collect_period(
                client,
                args.property_id,
                provider,
                start.isoformat(),
                end.isoformat(),
            )
            month_series.append(
                {
                    'year': report_year,
                    'month': month,
                    'label': format_month_label(report_year, month),
                    'start': start,
                    'end': end,
                    'metrics': metrics,
                }
            )

        current_item = month_series[-1]
        current = current_item['metrics']
        previous = month_series[-2]['metrics'] if len(month_series) > 1 else None
        prev_label = (
            month_series[-2]['label']
            if len(month_series) > 1
            else f'programme start ({MONTHLY_REPORTS_START:%B %Y})'
        )

        markdown = render_report(
            provider,
            current,
            previous or current,
            month_label,
            prev_label,
            generated_on=date.today(),
        )
        partner_logo_path = PARTNER_LOGO_BY_SLUG.get(provider.slug)
        partner_logo_uri = (
            file_to_data_uri(partner_logo_path) if partner_logo_path is not None else None
        )

        chart_capture_path = args.out / f'{provider.slug}-chart-capture.html'
        chart_png_path = args.out / f'{provider.slug}-chart.png'
        chart_capture_path.write_text(
            render_chart_capture_html(
                provider_name=provider.name,
                month_series=month_series,
                report_year=report_year,
                report_month=report_month,
            )
        )
        screenshot_chart_html(
            chrome,
            chart_capture_path,
            chart_png_path,
            window_size=f'{EMAIL_WIDTH},520',
        )

        above_capture_path = args.out / f'{provider.slug}-above-cta-capture.html'
        above_png_path = args.out / f'{provider.slug}-above-cta.png'
        above_capture_path.write_text(
            render_above_cta_capture_html(
                provider_name=provider.name,
                courses_url=provider.courses_url,
                current=current,
                previous=previous,
                month_series=month_series,
                report_year=report_year,
                report_month=report_month,
                current_end=current_item['end'],
                nda_logo_uri=nda_logo_uri,
                partner_logo_uri=partner_logo_uri,
            )
        )
        screenshot_chart_html(
            chrome,
            above_capture_path,
            above_png_path,
            window_size=f'{EMAIL_WIDTH},2400',
            crop_pad=8,
        )
        pad_png_to_width(above_png_path, EMAIL_WIDTH)
        above_png_uri = file_to_data_uri(above_png_path)

        cta_capture_path = args.out / f'{provider.slug}-cta-capture.html'
        cta_png_path = args.out / f'{provider.slug}-cta.png'
        cta_capture_path.write_text(render_cta_capture_html())
        screenshot_chart_html(
            chrome,
            cta_capture_path,
            cta_png_path,
            window_size='420,120',
            crop_pad=8,
        )
        cta_png_uri = file_to_data_uri(cta_png_path)
        cta_w, cta_h = png_pixel_size(cta_png_path)

        below_capture_path = args.out / f'{provider.slug}-below-cta-capture.html'
        below_png_path = args.out / f'{provider.slug}-below-cta.png'
        below_capture_path.write_text(
            render_below_cta_capture_html(
                current=current,
                report_year=report_year,
                report_month=report_month,
                current_end=current_item['end'],
                previous=previous,
                generated_on=date.today(),
            )
        )
        screenshot_chart_html(
            chrome,
            below_capture_path,
            below_png_path,
            window_size=f'{EMAIL_WIDTH},1400',
            crop_pad=8,
        )
        pad_png_to_width(below_png_path, EMAIL_WIDTH)
        below_png_uri = file_to_data_uri(below_png_path)

        html_doc = render_html_report(
            provider_name=provider.name,
            provider_slug=provider.slug,
            courses_url=provider.courses_url,
            current=current,
            previous=previous,
            month_series=month_series,
            report_year=report_year,
            report_month=report_month,
            current_start=current_item['start'],
            current_end=current_item['end'],
            generated_on=date.today(),
            nda_logo_uri=nda_logo_uri,
            partner_logo_uri=partner_logo_uri,
            site_origin=SITE_ORIGIN,
            above_png_uri=above_png_uri,
            below_png_uri=below_png_uri,
            cta_png_uri=cta_png_uri,
            cta_png_width=cta_w,
            cta_png_height=cta_h,
        )
        md_path = args.out / f'{provider.slug}.md'
        html_path = args.out / f'{provider.slug}.html'
        md_path.write_text(markdown)
        html_path.write_text(html_doc)
        index_lines.append(
            f'- **{provider.name}**: page views {fmt_int(current["profile_views"])}, '
            f'visitors {fmt_int(current["profile_users"])}, '
            f'explore {fmt_int(current["explore_clicks"])} '
            f'→ `{html_path.name}` + attach `{chart_png_path.name}`'
        )
        print(f'Wrote {html_path}')
        print(f'Wrote {md_path}')
        print(f'Wrote {chart_png_path} (email attachment)')
        print(f'Wrote {above_png_path} (baked above CTA)')
        print(f'Wrote {cta_png_path} (baked CTA button)')
        print(f'Wrote {below_png_path} (baked below CTA)')

    index_path = args.out / 'INDEX.md'
    index_path.write_text('\n'.join(index_lines) + '\n')
    print(f'Wrote {index_path}')


if __name__ == '__main__':
    main()
