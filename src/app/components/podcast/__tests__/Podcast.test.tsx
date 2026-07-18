import React from 'react';
import { render, screen, act } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

import BuzzsproutEmbed from '../Buzzsprout';
import PodcastUnavailableMessage from '../PodcastUnavailableMessage';

describe('BuzzsproutEmbed', () => {
  const originalIntersectionObserver = window.IntersectionObserver;

  beforeEach(() => {
    jest.useFakeTimers();
    Reflect.deleteProperty(window, 'IntersectionObserver');
  });

  afterEach(() => {
    jest.useRealTimers();
    document.body.innerHTML = '';
    if (originalIntersectionObserver) {
      window.IntersectionObserver = originalIntersectionObserver;
    } else {
      Reflect.deleteProperty(window, 'IntersectionObserver');
    }
  });

  it('loads the player when IntersectionObserver reports the section is visible', () => {
    let observerCallback: IntersectionObserverCallback = () => undefined;
    const observe = jest.fn();
    const disconnect = jest.fn();

    window.IntersectionObserver = jest.fn((callback: IntersectionObserverCallback) => {
      observerCallback = callback;
      return {
        observe,
        unobserve: jest.fn(),
        disconnect,
        root: null,
        rootMargin: '',
        thresholds: [],
        takeRecords: () => [],
      };
    }) as unknown as typeof IntersectionObserver;

    const container = document.createElement('div');
    container.id = 'observer-test';
    document.body.appendChild(container);

    render(
      <BuzzsproutEmbed
        scriptSrc='https://buzzsprout.com/observer.js'
        containerId='observer-test'
        singleBlog={false}
        embedAvailable={true}
      />,
    );

    expect(document.getElementById('observer-test-embed-script')).not.toBeInTheDocument();
    expect(observe).toHaveBeenCalled();

    act(() => {
      observerCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(document.getElementById('observer-test-embed-script')).toBeInTheDocument();
    expect(disconnect).toHaveBeenCalled();
  });

  it('renders podcast header for multi-blog view', () => {
    const container = document.createElement('div');
    container.id = 'podcast-test';
    document.body.appendChild(container);

    render(
      <BuzzsproutEmbed
        scriptSrc='https://buzzsprout.com/test.js'
        containerId='podcast-test'
        singleBlog={false}
        embedAvailable={true}
      />,
    );
    expect(screen.getByText('Explore more of our Podcast')).toBeInTheDocument();
  });

  it('renders podcast header for single-blog view', () => {
    const container = document.createElement('div');
    container.id = 'podcast-single';
    document.body.appendChild(container);

    render(
      <BuzzsproutEmbed
        scriptSrc='https://buzzsprout.com/test.js'
        containerId='podcast-single'
        singleBlog={true}
        embedAvailable={true}
      />,
    );
    expect(screen.getByText('Listen to our Podcast')).toBeInTheDocument();
  });

  it('shows fallback when embedAvailable is false', () => {
    render(
      <BuzzsproutEmbed
        scriptSrc='https://buzzsprout.com/test.js'
        containerId='unavailable-test'
        singleBlog={false}
        embedAvailable={false}
      />,
    );
    expect(screen.getByText(/temporarily unavailable/)).toBeInTheDocument();
  });

  it('shows fallback after timeout when player not rendered', () => {
    const container = document.createElement('div');
    container.id = 'timeout-test';
    document.body.appendChild(container);

    render(
      <BuzzsproutEmbed
        scriptSrc='https://buzzsprout.com/timeout.js'
        containerId='timeout-test'
        singleBlog={false}
        embedAvailable={true}
      />,
    );

    act(() => {
      jest.advanceTimersByTime(8000);
    });

    expect(screen.getByText(/temporarily unavailable/)).toBeInTheDocument();
  });

  it('creates and appends a script element to body', () => {
    const container = document.createElement('div');
    container.id = 'script-test';
    document.body.appendChild(container);

    render(
      <BuzzsproutEmbed
        scriptSrc='https://buzzsprout.com/script.js'
        containerId='script-test'
        singleBlog={false}
        embedAvailable={true}
      />,
    );

    const script = document.getElementById('script-test-embed-script');
    expect(script).toBeInTheDocument();
    expect(script).toHaveAttribute('src', 'https://buzzsprout.com/script.js');
  });

  it('renders player host container div', () => {
    const container = document.createElement('div');
    container.id = 'host-test';
    document.body.appendChild(container);

    render(
      <BuzzsproutEmbed
        scriptSrc='https://buzzsprout.com/host.js'
        containerId='host-test'
        singleBlog={false}
        embedAvailable={true}
      />,
    );
    expect(document.getElementById('host-test')).toBeInTheDocument();
  });
});

describe('PodcastUnavailableMessage', () => {
  it('renders single blog unavailable message', () => {
    render(<PodcastUnavailableMessage singleBlog={true} />);
    expect(screen.getByText(/This episode is temporarily unavailable/)).toBeInTheDocument();
  });

  it('renders multi-blog unavailable message', () => {
    render(<PodcastUnavailableMessage singleBlog={false} />);
    expect(
      screen.getByText(/Our podcast episodes are temporarily unavailable/),
    ).toBeInTheDocument();
  });

  it('renders Listen to our Podcast header for single blog', () => {
    render(<PodcastUnavailableMessage singleBlog={true} />);
    expect(screen.getByText('Listen to our Podcast')).toBeInTheDocument();
  });

  it('renders Explore more of our Podcast header for multi', () => {
    render(<PodcastUnavailableMessage singleBlog={false} />);
    expect(screen.getByText('Explore more of our Podcast')).toBeInTheDocument();
  });

  it('renders link to Neurodivergent Mates page', () => {
    render(<PodcastUnavailableMessage singleBlog={false} />);
    const link = screen.getByText('Neurodivergent Mates page');
    expect(link.closest('a')).toHaveAttribute('href', '/neurodivergentmates');
  });

  it('renders link to Buzzsprout', () => {
    render(<PodcastUnavailableMessage singleBlog={false} />);
    const link = screen.getByText('View on Buzzsprout');
    expect(link.closest('a')).toHaveAttribute('href', 'https://www.buzzsprout.com/2132579');
    expect(link.closest('a')).toHaveAttribute('target', '_blank');
  });

  it('has a role=status element', () => {
    render(<PodcastUnavailableMessage singleBlog={false} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
