import { sanitizeHtml } from '../sanitizeHtml';

describe('sanitizeHtml', () => {
  it('returns empty string for nullish input', () => {
    expect(sanitizeHtml(null)).toBe('');
    expect(sanitizeHtml(undefined)).toBe('');
    expect(sanitizeHtml('')).toBe('');
  });

  it('strips script tags by default', () => {
    expect(sanitizeHtml('<p>ok</p><script>alert(1)</script>')).toBe('<p>ok</p>');
  });

  it('allows target on anchors when requested', () => {
    const result = sanitizeHtml('<a href="https://example.com" target="_blank">link</a>', {
      allowTargetAttr: true,
    });

    expect(result).toContain('target="_blank"');
    expect(result).toContain('href="https://example.com"');
  });

  it('allows youtube iframes when requested', () => {
    const result = sanitizeHtml(
      '<iframe src="https://www.youtube.com/embed/abc" width="560" height="315"></iframe>',
      { allowIframes: true },
    );

    expect(result).toContain('<iframe');
    expect(result).toContain('youtube.com/embed/abc');
  });

  it('removes iframes when not allowed', () => {
    const result = sanitizeHtml(
      '<p>before</p><iframe src="https://www.youtube.com/embed/abc"></iframe>',
    );

    expect(result).toBe('<p>before</p>');
  });
});
