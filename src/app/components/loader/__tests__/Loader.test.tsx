import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from '../Loader';
import LoaderWrapper from '../LoaderWrapper';

describe('Loader', () => {
  it('renders nothing when isLoading is false', () => {
    const { container } = render(<Loader isLoading={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders loader circles when isLoading is true', () => {
    const { container } = render(<Loader isLoading={true} />);
    const circles = container.querySelectorAll('span');
    expect(circles).toHaveLength(3);
  });

  it('sets aria-hidden on loader container', () => {
    const { container } = render(<Loader isLoading={true} />);
    const loader = container.firstChild as HTMLElement;
    expect(loader).toHaveAttribute('aria-hidden');
  });

  it('applies expand class when expand is true', () => {
    const { container } = render(
      <Loader isLoading={true} expand={true} />,
    );
    expect(container.firstChild).toHaveClass('expand');
  });

  it('applies alignTop class when alignTop is true', () => {
    const { container } = render(
      <Loader isLoading={true} alignTop={true} />,
    );
    expect(container.firstChild).toHaveClass('alignTop');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Loader isLoading={true} className='test-loader' />,
    );
    expect(container.firstChild).toHaveClass('test-loader');
  });

  it('adds loaderContainer class to parent when loading', () => {
    const parent = document.createElement('div');
    document.body.appendChild(parent);
    render(<Loader isLoading={true} target={parent} />);
    expect(parent).toHaveClass('loaderContainer');
    parent.remove();
  });
});

describe('LoaderWrapper', () => {
  it('renders children', () => {
    render(
      <LoaderWrapper isLoading={false}>
        <span>Content</span>
      </LoaderWrapper>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('shows loader when isLoading is true', () => {
    const { container } = render(
      <LoaderWrapper isLoading={true}>
        <span>Content</span>
      </LoaderWrapper>,
    );
    expect(screen.getByText('Content')).toBeInTheDocument();
    const circles = container.querySelectorAll('span');
    expect(circles.length).toBeGreaterThan(1);
  });

  it('does not show loader circles when isLoading is false', () => {
    const { container } = render(
      <LoaderWrapper isLoading={false}>
        <span>Content</span>
      </LoaderWrapper>,
    );
    expect(container.querySelector('[aria-hidden]')).toBeNull();
  });

  it('passes className to wrapper', () => {
    const { container } = render(
      <LoaderWrapper isLoading={false} className='wrap-test'>
        <span>Content</span>
      </LoaderWrapper>,
    );
    expect(container.firstChild).toHaveClass('wrap-test');
  });

  it('passes expandLoaderWidth and loaderAlignTop to Loader', () => {
    const { container } = render(
      <LoaderWrapper
        isLoading={true}
        expandLoaderWidth={true}
        loaderAlignTop={true}
      >
        <span>Content</span>
      </LoaderWrapper>,
    );
    expect(container.querySelector('[aria-hidden]')).toBeInTheDocument();
  });
});
