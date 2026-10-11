"""Outlook-safe monthly HTML for NDA endorsed-partner visibility reports.

Pure helpers only — no GA client. Imported by ``ga-partner-reports.py``;
do not import that module from here (circular).

Layout uses nested tables + inline styles so Outlook Web / desktop can render
the report when pasted or attached as HTML.
"""

from __future__ import annotations

import calendar
import base64
import html
from datetime import date

# Partner monthly visibility reports begin here (no Jan–Jun 2026 bars).
MONTHLY_REPORTS_START = date(2026, 7, 1)

_FONT = 'Arial,Helvetica,sans-serif'
_CHERRY = '#330066'
_VARIANT = '#6600cc'
_BG = '#f0eef8'
_INK = '#070707'
_MUTED = '#5c5b5b'
_LINE = '#efefff'
_CARD = '#f8f8ff'
_WHITE = '#ffffff'
# Outlook remaps pure #ffffff text on dark backgrounds to black — use off-white.
_ON_PURPLE = '#fffffe'
_UP = '#0f7b4a'
_DOWN = '#a1284a'
_FLAT = '#5c5b5b'
_BAR_MAX_PX = 140
# Wide Outlook-safe canvas (almost everything is a screenshot).
EMAIL_WIDTH = 1100
_CONTENT_PAD_X = 36
_CONTENT_INNER = EMAIL_WIDTH - (2 * _CONTENT_PAD_X)

# Count metrics on one shared scale (heights comparable). Explore rate is % text only.
SERIES_CHART_METRICS: tuple[tuple[str, str, str], ...] = (
    ('profile_views', 'Page views', '#330066'),
    ('profile_users', 'Unique visitors', '#6600cc'),
    ('explore_clicks', 'Explore clicks', '#0f7b4a'),
)

_CHART_CSS = '''
.chart-legend{display:flex;flex-wrap:wrap;gap:8px 14px;margin:0 0 14px;padding:10px 12px;
border-radius:12px;background:#faf8ff;border:1px solid #efefff;font-size:12px;color:#5c5b5b;
font-family:Arial,Helvetica,sans-serif}
.chart-legend .swatch{display:inline-block;width:11px;height:11px;border-radius:3px;
margin-right:6px;vertical-align:-1px}
.month-series{display:flex;align-items:flex-end;gap:14px;overflow-x:auto;padding:8px 0 4px}
.month-col{flex:1 1 0;min-width:88px;text-align:center;font-family:Arial,Helvetica,sans-serif}
.month-col.current .month-name{color:#330066;font-weight:800}
.month-col.current .month-bar-group{box-shadow:inset 0 0 0 2px rgba(102,0,204,.18);
border-radius:10px;padding:4px 4px 0}
.month-bar-group{height:160px;display:flex;align-items:flex-end;justify-content:center;
gap:5px;margin-bottom:8px}
.month-bar{display:block;width:16px;min-height:4px;border-radius:5px 5px 2px 2px}
.month-name{margin:0;font-size:12px;font-weight:700;color:#330066}
.month-stats{margin:4px 0 0;font-size:10px;color:#5c5b5b;line-height:1.35}
.series-key{margin:10px 0 0;font-size:12px;color:#5c5b5b;font-family:Arial,Helvetica,sans-serif}
'''.strip()


def format_month_label(year: int, month: int) -> str:
    return f'{calendar.month_name[month]} {year}'


def first_series_month(report_year: int) -> int:
    """First calendar month included in the year chart for a report year."""
    if report_year < MONTHLY_REPORTS_START.year:
        return MONTHLY_REPORTS_START.month
    if report_year == MONTHLY_REPORTS_START.year:
        return MONTHLY_REPORTS_START.month
    return 1


def month_bounds(year: int, month: int, as_of: date) -> tuple[date, date]:
    start = date(year, month, 1)
    end = date(year, month, calendar.monthrange(year, month)[1])
    if end > as_of:
        end = as_of
    if start > end:
        return as_of, as_of
    return start, end


def resolve_report_month(month_arg: str | None, as_of: date) -> tuple[int, int]:
    if not month_arg:
        return as_of.year, as_of.month
    raw = month_arg.strip()
    if '-' not in raw:
        raise ValueError(f'Invalid --month value {month_arg!r}; expected YYYY-MM')
    year_s, month_s = raw.split('-', 1)
    year, month = int(year_s), int(month_s)
    if month < 1 or month > 12:
        raise ValueError(f'Invalid month in {month_arg!r}')
    return year, month


def _delta_label(current: float, previous: float) -> str:
    if previous <= 0 and current <= 0:
        return 'flat vs prior period'
    if previous <= 0:
        return 'new vs prior period'
    change = (current - previous) / previous
    sign = '+' if change >= 0 else ''
    return f'{sign}{change * 100:.0f}% vs prior period'


def delta_vs_month(current: float, previous: float, prior_month_label: str) -> str:
    base = _delta_label(current, previous)
    if base == 'flat vs prior period':
        return f'flat vs {prior_month_label}'
    if base == 'new vs prior period':
        return f'new vs {prior_month_label}'
    return base.replace('vs prior period', f'vs {prior_month_label}')


def trend_class(label: str) -> str:
    if label.startswith('+') or label.startswith('new'):
        return 'up'
    if label.startswith('-'):
        return 'down'
    return 'flat'


def _trend_color(label: str) -> str:
    kind = trend_class(label)
    if kind == 'up':
        return _UP
    if kind == 'down':
        return _DOWN
    return _FLAT


def _fmt_int(value: float) -> str:
    return f'{int(round(value)):,}'


def _fmt_pct(value: float) -> str:
    return f'{value * 100:.1f}%'


def _fmt_duration(seconds: float) -> str:
    total = int(round(seconds))
    minutes, secs = divmod(total, 60)
    if minutes <= 0:
        return f'{secs}s'
    return f'{minutes}m {secs:02d}s'


def _through_suffix(current_end: date, report_year: int, report_month: int) -> str:
    month_end = date(report_year, report_month, calendar.monthrange(report_year, report_month)[1])
    if current_end < month_end:
        return f' (through {current_end.day} {current_end.strftime("%b")})'
    return ''


def _year_comparison_label(year: int, report_month: int) -> str:
    start_month = first_series_month(year)
    if report_month <= start_month:
        return f'— ({year}; series starts {calendar.month_abbr[start_month]})'
    if report_month == start_month + 1:
        return f'{calendar.month_abbr[start_month]} {year}'
    return (
        f'{calendar.month_abbr[start_month]}–{calendar.month_abbr[report_month - 1]} {year}'
    )


def _value_trend(
    key: str,
    current: dict,
    previous: dict | None,
    prior_label: str,
    *,
    as_pct: bool = False,
    as_duration: bool = False,
) -> tuple[str, str]:
    value = float(current.get(key, 0) or 0)
    if as_duration:
        display = _fmt_duration(value)
    elif as_pct:
        display = _fmt_pct(value)
    else:
        display = _fmt_int(value)
    if previous is None:
        return display, '—'
    return display, delta_vs_month(value, float(previous.get(key, 0) or 0), prior_label)


def _on_purple(inner_html: str) -> str:
    """Force light text on purple — Outlook ignores CSS color without <font>."""
    return f'<font color="{_ON_PURPLE}">{inner_html}</font>'


def _section_heading(title: str, month_label: str) -> str:
    return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" '
        'style="margin:0 0 12px 0;">'
        '<tr>'
        f'<td align="left" style="font-family:{_FONT};font-size:16px;line-height:1.3;'
        f'font-weight:700;color:{_CHERRY};padding:18px 0 0 0;">{html.escape(title)}</td>'
        f'<td align="right" valign="bottom" style="font-family:{_FONT};font-size:11px;'
        f'font-weight:700;color:{_VARIANT};padding:18px 0 0 8px;white-space:nowrap;">'
        f'{html.escape(month_label)}</td>'
        '</tr></table>'
    )


def _logo_row(
    name: str,
    nda_logo_uri: str | None,
    partner_logo_uri: str | None,
) -> str:
    if not nda_logo_uri and not partner_logo_uri:
        return ''
    nda_cell = (
        f'<td bgcolor="{_WHITE}" style="background-color:{_WHITE};padding:8px 10px;'
        f'border-radius:6px;">'
        f'<img src="{nda_logo_uri}" width="140" alt="Neurodiversity Academy" '
        f'style="display:block;width:140px;max-width:140px;height:auto;border:0;" /></td>'
        if nda_logo_uri
        else ''
    )
    partner_cell = (
        f'<td bgcolor="{_WHITE}" style="background-color:{_WHITE};padding:8px 12px;'
        f'border-radius:6px;">'
        f'<img src="{partner_logo_uri}" width="150" alt="{name}" '
        f'style="display:block;width:150px;max-width:150px;height:auto;border:0;" /></td>'
        if partner_logo_uri
        else (
            f'<td style="font-family:{_FONT};font-size:16px;font-weight:700;'
            f'color:{_ON_PURPLE};">{_on_purple(name)}</td>'
        )
    )
    return (
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" '
        'style="margin:0 0 18px 0;">'
        f'<tr>{nda_cell}'
        f'<td style="padding:0 10px;font-family:{_FONT};font-size:18px;font-weight:700;'
        f'color:{_ON_PURPLE};">{_on_purple("×")}</td>'
        f'{partner_cell}</tr></table>'
    )


def _metric_card(title: str, meaning: str, value: str, period: str, trend: str) -> str:
    color = _trend_color(trend)
    return (
        f'<td width="50%" valign="top" style="width:50%;padding:6px;">'
        f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" '
        f'style="background-color:{_CARD};border:1px solid {_LINE};border-radius:8px;">'
        f'<tr><td style="padding:14px 14px 16px 14px;font-family:{_FONT};">'
        f'<p style="margin:0;font-size:11px;letter-spacing:0.04em;text-transform:uppercase;'
        f'font-weight:700;color:{_VARIANT};">{html.escape(title)}</p>'
        f'<p style="margin:6px 0 0 0;font-size:12px;line-height:1.35;color:{_INK};'
        f'font-weight:600;">{html.escape(meaning)}</p>'
        f'<p style="margin:12px 0 4px 0;font-size:28px;line-height:1;font-weight:700;'
        f'color:{_CHERRY};">{html.escape(value)}</p>'
        f'<p style="margin:0 0 6px 0;font-size:12px;color:{_MUTED};font-weight:600;">'
        f'{html.escape(period)}</p>'
        f'<p style="margin:0;font-size:12px;line-height:1.35;font-weight:700;color:{color};">'
        f'{html.escape(trend)}</p>'
        f'</td></tr></table></td>'
    )


def _shared_count_max(month_series: list[dict]) -> float:
    peak = 0.0
    for row in month_series:
        metrics = row.get('metrics') or {}
        for key, *_ in SERIES_CHART_METRICS:
            peak = max(peak, float(metrics.get(key, 0) or 0))
    return peak or 1.0


def _bar_height_px(value: float, scale_max: float) -> int:
    if value <= 0:
        return 4
    return max(6, min(_BAR_MAX_PX, round(_BAR_MAX_PX * value / scale_max)))


def _month_series_live_html(
    month_series: list[dict],
    report_year: int,
    report_month: int,
) -> str:
    """Browser-rendered grouped bars (shared scale) — used for Chrome screenshots."""
    if not month_series:
        return (
            f'<p style="margin:0;font-family:{_FONT};font-size:13px;color:{_MUTED};">'
            'No month-by-month data yet.</p>'
        )
    scale_max = _shared_count_max(month_series)
    legend = ''.join(
        f'<span><span class="swatch" style="background:{color}"></span>'
        f'{html.escape(label)}</span>'
        for _key, label, color in SERIES_CHART_METRICS
    )
    cols: list[str] = []
    for row in month_series:
        y, m = int(row['year']), int(row['month'])
        metrics = row.get('metrics') or {}
        bars: list[str] = []
        stats: list[str] = []
        for key, metric_label, color in SERIES_CHART_METRICS:
            value = float(metrics.get(key, 0) or 0)
            height = _bar_height_px(value, scale_max)
            title = f'{metric_label}: {_fmt_int(value)}'
            bars.append(
                f'<span class="month-bar" style="height:{height}px;background:{color}" '
                f'title="{html.escape(title)}"></span>'
            )
            stats.append(_fmt_int(value))
        rate = float(metrics.get('explore_rate', 0) or 0)
        stats.append(_fmt_pct(rate))
        current_cls = ' current' if y == report_year and m == report_month else ''
        cols.append(
            f'<div class="month-col{current_cls}">'
            f'<div class="month-bar-group">{"".join(bars)}</div>'
            f'<p class="month-name">{html.escape(calendar.month_abbr[m])}</p>'
            f'<p class="month-stats">{html.escape(" · ".join(stats))}</p></div>'
        )
    return (
        f'<div id="month-chart" style="padding:8px 0;">'
        f'<div class="chart-legend">{legend}</div>'
        f'<div class="month-series">{"".join(cols)}</div>'
        f'<p class="series-key">Same scale for all three counts (taller = larger number). '
        'Figures: views · visitors · Explore · Explore rate.</p></div>'
    )


def _month_series_html(
    month_series: list[dict],
    report_year: int,
    report_month: int,
    *,
    chart_png_uri: str | None = None,
) -> str:
    if chart_png_uri:
        return (
            f'<img src="{chart_png_uri}" width="552" alt="Month by month chart" '
            f'style="display:block;width:100%;max-width:552px;height:auto;border:0;" />'
            f'<p style="margin:8px 0 0 0;font-family:{_FONT};font-size:12px;color:{_MUTED};">'
            'Chart image attached for email — same scale for all three counts.</p>'
        )
    return _month_series_live_html(month_series, report_year, report_month)


def render_chart_capture_html(
    *,
    provider_name: str,
    month_series: list[dict],
    report_year: int,
    report_month: int,
) -> str:
    """Minimal page used to screenshot the live HTML chart in Chrome."""
    month_label = format_month_label(report_year, report_month)
    return '\n'.join([
        '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" />',
        f'<title>{html.escape(provider_name)} chart — {html.escape(month_label)}</title>',
        f'<style>body{{margin:0;padding:28px 32px;background:#ffffff;}}{_CHART_CSS}</style>',
        '</head><body>',
        f'<div style="width:{EMAIL_WIDTH - 64}px;">',
        f'<p style="margin:0 0 12px 0;font-family:{_FONT};font-size:13px;font-weight:700;'
        f'color:{_CHERRY};">{html.escape(provider_name)} · {html.escape(month_label)}</p>',
        _month_series_live_html(month_series, report_year, report_month),
        '</div>',
        '</body></html>',
        '',
    ])


def render_hero_band_html(
    *,
    provider_name: str,
    month_label: str,
    hero_period: str,
    compared_line: str,
    year_cmp: str,
    nda_logo_uri: str | None,
    partner_logo_uri: str | None,
    width: int = EMAIL_WIDTH,
) -> str:
    """Purple hero + period bar (used inside above-CTA capture)."""
    name = html.escape(provider_name)
    return '\n'.join([
        f'<div style="width:{width}px;background:{_CHERRY};padding:28px 32px 22px 32px;'
        f'font-family:{_FONT};color:{_ON_PURPLE};box-sizing:border-box;">',
        _logo_row(name, nda_logo_uri, partner_logo_uri),
        f'<p style="margin:0 0 8px 0;font-size:11px;letter-spacing:0.1em;'
        f'text-transform:uppercase;color:{_ON_PURPLE};">'
        'Neurodiversity Academy · Partner visibility</p>',
        f'<h1 style="margin:0 0 10px 0;font-size:28px;line-height:1.2;font-weight:700;'
        f'color:{_ON_PURPLE};">{name}</h1>',
        f'<p style="margin:0;font-size:15px;line-height:1.5;color:{_ON_PURPLE};">'
        f'Your endorsed profile results for <strong>{html.escape(hero_period)}</strong> — '
        f'{html.escape(compared_line)}.</p>',
        '</div>',
        f'<div style="width:{width}px;background:#2a0055;padding:10px 32px;font-family:{_FONT};'
        f'font-size:12px;color:{_ON_PURPLE};box-sizing:border-box;">'
        f'This report: <strong>{html.escape(month_label)}</strong>'
        f'&nbsp;&nbsp;·&nbsp;&nbsp;Year comparison: <strong>{html.escape(year_cmp)}</strong>'
        '</div>',
    ])


def render_cta_capture_html() -> str:
    """Lavender CTA button page for Chrome screenshot (Outlook cannot resize live buttons)."""
    return '\n'.join([
        '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" />',
        '<title>Open live NDA profile CTA</title>',
        '<style>body{margin:0;padding:24px;background:#ffffff;}</style></head><body>',
        f'<div style="display:inline-block;background-color:#f3edff;border:2px solid {_VARIANT};'
        f'border-radius:6px;padding:12px 18px;font-family:{_FONT};font-size:14px;'
        f'font-weight:400;line-height:1.2;color:{_CHERRY};white-space:nowrap;">'
        'Open live NDA profile →'
        '</div>',
        '</body></html>',
        '',
    ])


def _cta_button_html(
    *,
    profile_url: str,
    cta_png_uri: str | None,
    cta_png_width: int | None,
    cta_png_height: int | None,
) -> str:
    """Linked CTA — prefer baked PNG so Outlook cannot inflate the button."""
    href = html.escape(profile_url)
    if cta_png_uri:
        width = cta_png_width or 240
        height_attr = f' height="{cta_png_height}"' if cta_png_height else ''
        return (
            f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" '
            f'style="margin:0;"><tr><td style="padding:0;line-height:0;font-size:0;">'
            f'<a href="{href}" target="_blank" style="text-decoration:none;border:0;">'
            f'<img src="{cta_png_uri}" width="{width}"{height_attr} '
            f'alt="Open live NDA profile" '
            f'style="display:block;border:0;outline:none;text-decoration:none;'
            f'width:{width}px;max-width:{width}px;height:auto;" />'
            f'</a></td></tr></table>'
        )
    return (
        f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" '
        f'style="margin:0;"><tr>'
        f'<td bgcolor="#f3edff" style="background-color:#f3edff;border:2px solid {_VARIANT};'
        f'border-radius:6px;">'
        f'<a href="{href}" '
        f'style="display:inline-block;padding:12px 18px;font-family:{_FONT};font-size:14px;'
        f'font-weight:400;color:{_CHERRY};text-decoration:none;">'
        f'<font color="{_CHERRY}">Open live NDA profile →</font></a></td></tr></table>'
    )


def _channels_html(sources: list) -> str:
    if not sources:
        return (
            f'<p style="margin:0;font-family:{_FONT};font-size:13px;color:{_MUTED};">'
            'No traffic-source data for this period.</p>'
        )
    max_sessions = max((float(r.get('sessions', 0) or 0) for r in sources), default=1) or 1
    rows: list[str] = []
    for row in sources:
        channel = str(row.get('sessionDefaultChannelGroup') or '(not set)')
        sessions = float(row.get('sessions', 0) or 0)
        users = float(row.get('totalUsers', 0) or 0)
        width = max(8, round(100 * sessions / max_sessions))
        rows.append(
            f'<tr><td style="padding:0 0 14px 0;font-family:{_FONT};">'
            f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">'
            f'<tr><td style="font-size:15px;color:{_INK};padding:0 0 4px 0;">'
            f'{html.escape(channel)}</td>'
            f'<td align="right" style="font-size:13px;color:{_MUTED};padding:0 0 4px 0;">'
            f'{_fmt_int(sessions)} visits · {_fmt_int(users)} people</td></tr>'
            f'<tr><td colspan="2" bgcolor="#ece7fb" style="background-color:#ece7fb;'
            f'border-radius:4px;height:12px;line-height:12px;font-size:0;">'
            f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" '
            f'width="{width}%" bgcolor="{_CHERRY}" '
            f'style="width:{width}%;background-color:{_CHERRY};height:12px;">'
            f'<tr><td height="12" style="font-size:0;line-height:0;height:12px;">&nbsp;</td>'
            f'</tr></table></td></tr></table></td></tr>'
        )
    return (
        f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">'
        f'{"".join(rows)}</table>'
    )


def _scroll_html(scroll_depth: list) -> str:
    items: list[str] = []
    for row in scroll_depth:
        depth = str(row.get('percentScrolled') or '')
        if depth in {'', '(not set)'}:
            continue
        label = f'{depth}%' if depth.isdigit() else depth
        items.append(
            f'<tr><td style="padding:4px 0;font-family:{_FONT};font-size:14px;'
            f'line-height:1.5;color:{_MUTED};">'
            f'<strong style="color:{_INK};">{html.escape(label)}</strong> of the page — '
            f'{_fmt_int(float(row.get("eventCount", 0)))} times · '
            f'{_fmt_int(float(row.get("totalUsers", 0)))} people</td></tr>'
        )
    if not items:
        return (
            f'<p style="margin:0;font-family:{_FONT};font-size:13px;color:{_MUTED};">'
            'No scroll data for this period.</p>'
        )
    return (
        f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">'
        f'{"".join(items)}</table>'
    )


def _quality_cell(label: str, value: str, note: str) -> str:
    return (
        f'<td width="33%" valign="top" style="width:33%;padding:6px;">'
        f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" '
        f'style="border:1px solid {_LINE};border-radius:8px;background-color:{_WHITE};">'
        f'<tr><td style="padding:14px 16px;font-family:{_FONT};">'
        f'<p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:0.04em;'
        f'text-transform:uppercase;color:{_VARIANT};">{html.escape(label)}</p>'
        f'<p style="margin:0 0 4px 0;font-size:20px;font-weight:700;color:{_CHERRY};">'
        f'{html.escape(value)}</p>'
        f'<p style="margin:0;font-size:12px;color:{_MUTED};">{html.escape(note)}</p>'
        f'</td></tr></table></td>'
    )


def _quick_key_html(month_label: str) -> str:
    return (
        f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" '
        f'style="margin:12px 0 0 0;background-color:{_CARD};border:1px solid {_LINE};'
        f'border-radius:8px;"><tr><td style="padding:14px 16px;font-family:{_FONT};'
        f'font-size:13px;line-height:1.55;color:{_MUTED};">'
        f'<strong style="color:{_CHERRY};">Quick key · {html.escape(month_label)}</strong><br />'
        '<strong>Profile page views</strong> = times your NDA page was opened · '
        '<strong>Unique visitors</strong> = different people · '
        '<strong>Explore clicks</strong> = clicked through to your website · '
        '<strong>Explore rate</strong> = Explore clicks ÷ unique visitors'
        '</td></tr></table>'
    )


def _visibility_html(*, month_label: str, current: dict, courses_url: str) -> str:
    courses = ''
    if courses_url:
        # Plain URL in the baked image (only the CTA remains a real link).
        courses = (
            f'<p style="margin:10px 0 0 0;font-family:{_FONT};font-size:13px;color:{_MUTED};'
            f'line-height:1.45;">Your website link used on NDA: '
            f'<span style="color:{_VARIANT};">{html.escape(courses_url)}</span></p>'
        )
    return '\n'.join([
        _section_heading('Visibility → your website', month_label),
        f'<p style="margin:0;font-family:{_FONT};font-size:14px;line-height:1.5;color:{_MUTED};">'
        f'In <strong style="color:{_INK};">{html.escape(month_label)}</strong>: '
        f'<strong style="color:{_INK};">{_fmt_int(float(current.get("profile_views", 0) or 0))}</strong> '
        'page views · '
        f'<strong style="color:{_INK};">{_fmt_int(float(current.get("profile_users", 0) or 0))}</strong> '
        'visitors · '
        f'<strong style="color:{_INK};">{_fmt_int(float(current.get("explore_clicks", 0) or 0))}</strong> '
        'went to your website</p>',
        courses,
    ])


def _snapshot_and_quality_html(
    *,
    current: dict,
    previous: dict | None,
    prior_label: str,
    month_label: str,
) -> tuple[str, str]:
    snapshot = [
        ('Profile page views', 'profile_views', 'How many times your NDA page was opened', False),
        ('Unique visitors', 'profile_users', 'How many different people opened it', False),
        ('Explore clicks', 'explore_clicks', 'How many clicked through to your website', False),
        ('Explore rate', 'explore_rate', 'Share of visitors who went to your site', True),
    ]
    card_cells: list[str] = []
    for title, key, meaning, as_pct in snapshot:
        value, trend = _value_trend(key, current, previous, prior_label, as_pct=as_pct)
        card_cells.append(
            _metric_card(title, meaning, value, f'in {month_label}', trend)
        )
    snapshot_html = (
        f'{_section_heading("Snapshot", month_label)}'
        f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">'
        f'<tr>{card_cells[0]}{card_cells[1]}</tr>'
        f'<tr>{card_cells[2]}{card_cells[3]}</tr></table>'
    )

    eng_val, eng_trend = _value_trend(
        'avg_engagement_sec', current, previous, prior_label, as_duration=True,
    )
    rate_val, rate_trend = _value_trend(
        'engagement_rate', current, previous, prior_label, as_pct=True,
    )
    sessions_note = (
        f'{_fmt_int(float(current.get("engaged_sessions", 0) or 0))} engaged visits'
    )
    quality_html = (
        f'{_section_heading("Quality of attention", month_label)}'
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>'
        f'{_quality_cell("Avg time on your page", eng_val, eng_trend)}'
        f'{_quality_cell("Engagement rate", rate_val, rate_trend)}'
        f'{_quality_cell("Visits to your page", _fmt_int(float(current.get("sessions", 0) or 0)), sessions_note)}'
        '</tr></table>'
    )
    return snapshot_html, quality_html


def _resolve_report_copy(
    *,
    report_year: int,
    report_month: int,
    current_end: date,
    previous: dict | None,
) -> dict[str, str]:
    month_label = format_month_label(report_year, report_month)
    through = _through_suffix(current_end, report_year, report_month)
    hero_period = f'{month_label}{through}'
    series_from = first_series_month(report_year)
    if previous is None or report_month <= series_from:
        prior_label = f'programme start ({MONTHLY_REPORTS_START:%B %Y})'
        compared_line = 'no prior month available for comparison'
    else:
        prior_year, prior_month = (
            (report_year - 1, 12) if report_month == 1 else (report_year, report_month - 1)
        )
        prior_label = format_month_label(prior_year, prior_month)
        compared_line = f'compared with {prior_label}'
    return {
        'month_label': month_label,
        'through': through,
        'hero_period': hero_period,
        'prior_label': prior_label,
        'compared_line': compared_line,
        'year_cmp': _year_comparison_label(report_year, report_month),
    }


def render_above_cta_capture_html(
    *,
    provider_name: str,
    courses_url: str,
    current: dict,
    previous: dict | None,
    month_series: list[dict],
    report_year: int,
    report_month: int,
    current_end: date,
    nda_logo_uri: str | None,
    partner_logo_uri: str | None,
) -> str:
    """Everything above the CTA — screenshotted so Outlook cannot distort colours."""
    copy = _resolve_report_copy(
        report_year=report_year,
        report_month=report_month,
        current_end=current_end,
        previous=previous,
    )
    snapshot_html, quality_html = _snapshot_and_quality_html(
        current=current,
        previous=previous,
        prior_label=copy['prior_label'],
        month_label=copy['month_label'],
    )
    inner = _CONTENT_INNER
    return '\n'.join([
        '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" />',
        f'<title>{html.escape(provider_name)} — above CTA</title>',
        f'<style>body{{margin:0;padding:0;background:{_WHITE};}}{_CHART_CSS}</style>',
        '</head><body>',
        f'<div style="width:{EMAIL_WIDTH}px;background:{_WHITE};box-sizing:border-box;">',
        render_hero_band_html(
            provider_name=provider_name,
            month_label=copy['month_label'],
            hero_period=copy['hero_period'],
            compared_line=copy['compared_line'],
            year_cmp=copy['year_cmp'],
            nda_logo_uri=nda_logo_uri,
            partner_logo_uri=partner_logo_uri,
        ),
        f'<div style="padding:12px {_CONTENT_PAD_X}px 8px {_CONTENT_PAD_X}px;'
        f'width:{EMAIL_WIDTH}px;box-sizing:border-box;">',
        f'<div style="width:{inner}px;">',
        snapshot_html,
        _quick_key_html(copy['month_label']),
        _section_heading(f'{report_year} month by month', copy['month_label']),
        _month_series_live_html(month_series, report_year, report_month),
        quality_html,
        _visibility_html(
            month_label=copy['month_label'],
            current=current,
            courses_url=courses_url,
        ),
        '</div></div></div>',
        '</body></html>',
        '',
    ])


def render_below_cta_capture_html(
    *,
    current: dict,
    report_year: int,
    report_month: int,
    current_end: date,
    previous: dict | None,
    generated_on: date,
) -> str:
    """Everything below the CTA — channels, scroll, footer."""
    copy = _resolve_report_copy(
        report_year=report_year,
        report_month=report_month,
        current_end=current_end,
        previous=previous,
    )
    footer = (
        f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" '
        f'style="margin:24px 0 0 0;border-top:1px solid {_LINE};">'
        f'<tr><td style="padding:16px 0 0 0;font-family:{_FONT};font-size:12px;'
        f'line-height:1.5;color:{_MUTED};">'
        f'All figures above are for <strong>{html.escape(copy["month_label"])}</strong>'
        f'{html.escape(copy["through"])}, {html.escape(copy["compared_line"])}.<br />'
        f'Generated {generated_on.isoformat()} · Questions? Reply to this email.'
        '</td></tr></table>'
    )
    return '\n'.join([
        '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" />',
        '<title>below CTA</title>',
        f'<style>body{{margin:0;padding:0;background:{_WHITE};}}</style></head><body>',
        f'<div style="width:{EMAIL_WIDTH}px;background:{_WHITE};box-sizing:border-box;'
        f'padding:8px {_CONTENT_PAD_X}px 28px {_CONTENT_PAD_X}px;">',
        f'<div style="width:{_CONTENT_INNER}px;">',
        _section_heading('How visitors found your profile', copy['month_label']),
        _channels_html(current.get('sources') or []),
        _section_heading('How far they scrolled', copy['month_label']),
        _scroll_html(current.get('scroll_depth') or []),
        footer,
        '</div></div>',
        '</body></html>',
        '',
    ])


def render_html_report(
    *,
    provider_name: str,
    provider_slug: str,
    courses_url: str,
    current: dict,
    previous: dict | None,
    month_series: list[dict],
    report_year: int,
    report_month: int,
    current_start: date,
    current_end: date,
    generated_on: date,
    nda_logo_uri: str | None,
    partner_logo_uri: str | None,
    site_origin: str = 'https://www.neurodiversityacademy.com',
    above_png_uri: str | None = None,
    below_png_uri: str | None = None,
    cta_png_uri: str | None = None,
    cta_png_width: int | None = None,
    cta_png_height: int | None = None,
    # Unused legacy kwargs kept so older callers do not crash mid-refactor.
    chart_png_uri: str | None = None,
    hero_png_uri: str | None = None,
    channels_png_uri: str | None = None,
) -> str:
    """Outlook-safe report: baked above/below images + linked CTA only."""
    _ = (
        courses_url,
        previous,
        month_series,
        current_start,
        nda_logo_uri,
        partner_logo_uri,
        chart_png_uri,
        hero_png_uri,
        channels_png_uri,
        current,
        report_year,
        report_month,
        current_end,
        generated_on,
    )
    profile_url = f'{site_origin}/endorsedproviders/{provider_slug}'
    name = html.escape(provider_name)
    month_label = format_month_label(report_year, report_month)
    preheader = (
        f'{provider_name} NDA partner visibility — {month_label}: '
        f'{_fmt_int(float(current.get("profile_views", 0) or 0))} views, '
        f'{_fmt_int(float(current.get("profile_users", 0) or 0))} visitors, '
        f'{_fmt_int(float(current.get("explore_clicks", 0) or 0))} Explore clicks.'
    )
    w = EMAIL_WIDTH
    above = (
        f'<tr><td style="padding:0;line-height:0;font-size:0;">'
        f'<img src="{above_png_uri}" width="{w}" alt="{name} — NDA partner visibility" '
        f'style="display:block;width:100%;max-width:{w}px;height:auto;border:0;" />'
        f'</td></tr>'
        if above_png_uri
        else '<tr><td style="padding:24px;font-family:Arial,sans-serif;">Missing above-CTA image</td></tr>'
    )
    below = (
        f'<tr><td style="padding:0;line-height:0;font-size:0;">'
        f'<img src="{below_png_uri}" width="{w}" alt="Channels, scroll and footer" '
        f'style="display:block;width:100%;max-width:{w}px;height:auto;border:0;" />'
        f'</td></tr>'
        if below_png_uri
        else '<tr><td style="padding:24px;font-family:Arial,sans-serif;">Missing below-CTA image</td></tr>'
    )
    cta_row = (
        f'<tr><td style="padding:18px {_CONTENT_PAD_X}px;background-color:{_WHITE};">'
        f'{_cta_button_html(profile_url=profile_url, cta_png_uri=cta_png_uri, cta_png_width=cta_png_width, cta_png_height=cta_png_height)}'
        f'</td></tr>'
    )
    return '\n'.join([
        '<!DOCTYPE html>',
        '<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" '
        'xmlns:o="urn:schemas-microsoft-com:office:office">',
        '<head>',
        '<meta charset="UTF-8" />',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
        '<meta name="color-scheme" content="light only" />',
        '<meta name="supported-color-schemes" content="light only" />',
        f'<title>{name} — NDA Partner Visibility Report</title>',
        f'<!-- SUBJECT: {provider_name} — NDA partner visibility report ({month_label}) -->',
        '<style>'
        ':root{color-scheme:light only;supported-color-schemes:light only;}'
        '</style>',
        '<!--[if mso]><noscript><xml><o:OfficeDocumentSettings>'
        '<o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>'
        '</noscript><![endif]-->',
        '</head>',
        f'<body style="margin:0;padding:0;background-color:{_BG};-webkit-text-size-adjust:100%;">',
        f'<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">{html.escape(preheader)}</div>',
        f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" '
        f'style="background-color:{_BG};"><tr>',
        f'<td align="center" style="padding:28px 12px;">',
        f'<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="{w}" '
        f'style="max-width:{w}px;width:100%;background-color:{_WHITE};border-radius:12px;">',
        above,
        cta_row,
        below,
        '</table>',
        '</td></tr></table>',
        '</body></html>',
        '',
    ])
