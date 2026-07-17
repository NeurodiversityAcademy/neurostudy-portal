import React from 'react';
import { render, screen } from '@testing-library/react';
import Typography, { TypographyVariant } from '../Typography';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

describe('Typography', () => {
  it('renders children text', () => {
    render(<Typography variant={TypographyVariant.Body1}>Hello World</Typography>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders an h1 tag for H1 variant', () => {
    render(<Typography variant={TypographyVariant.H1}>Heading</Typography>);
    const el = screen.getByText('Heading');
    expect(el.tagName).toBe('H1');
  });

  it('renders an h2 tag for H2 variant', () => {
    render(<Typography variant={TypographyVariant.H2}>Sub Heading</Typography>);
    expect(screen.getByText('Sub Heading').tagName).toBe('H2');
  });

  it('renders an h3 tag for H3 variant', () => {
    render(<Typography variant={TypographyVariant.H3}>Minor</Typography>);
    expect(screen.getByText('Minor').tagName).toBe('H3');
  });

  it('renders a span for Body1 variant', () => {
    render(<Typography variant={TypographyVariant.Body1}>Body</Typography>);
    expect(screen.getByText('Body').tagName).toBe('SPAN');
  });

  it('renders a span for Body2 variant', () => {
    render(<Typography variant={TypographyVariant.Body2}>Body2</Typography>);
    expect(screen.getByText('Body2').tagName).toBe('SPAN');
  });

  it('renders a span for Body2Strong variant', () => {
    render(<Typography variant={TypographyVariant.Body2Strong}>Bold</Typography>);
    expect(screen.getByText('Bold').tagName).toBe('SPAN');
  });

  it('renders a span for Body3 variant', () => {
    render(<Typography variant={TypographyVariant.Body3}>Small</Typography>);
    expect(screen.getByText('Small').tagName).toBe('SPAN');
  });

  it('renders a span for Body3Strong variant', () => {
    render(<Typography variant={TypographyVariant.Body3Strong}>SmallStrong</Typography>);
    expect(screen.getByText('SmallStrong').tagName).toBe('SPAN');
  });

  it('renders a span for LABELtext variant', () => {
    render(<Typography variant={TypographyVariant.LABELtext}>Label</Typography>);
    expect(screen.getByText('Label').tagName).toBe('SPAN');
  });

  it('renders a span for BenefitTabText variant', () => {
    render(<Typography variant={TypographyVariant.BenefitTabText}>Tab</Typography>);
    expect(screen.getByText('Tab').tagName).toBe('SPAN');
  });

  it('applies a color className when a known color token is provided', () => {
    render(
      <Typography variant={TypographyVariant.Body1} color='var(--GhostWhite)'>
        Colored
      </Typography>,
    );
    expect(screen.getByText('Colored')).toBeInTheDocument();
  });

  it('warns for unmapped color tokens in non-production', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Typography variant={TypographyVariant.Body1} color='var(--Unknown)'>
        Unknown Color
      </Typography>,
    );
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Unmapped color prop'));
    warnSpy.mockRestore();
  });

  it('does not warn when color is false', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Typography variant={TypographyVariant.Body1} color={false}>
        No Color
      </Typography>,
    );
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('passes additional className and HTML attributes', () => {
    render(
      <Typography variant={TypographyVariant.Body1} className='custom-class' data-testid='typ'>
        Custom
      </Typography>,
    );
    const el = screen.getByTestId('typ');
    expect(el).toHaveClass('custom-class');
  });
});
