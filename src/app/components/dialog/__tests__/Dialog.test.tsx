import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Dialog from '../index';

jest.mock('@/app/hooks/useHideOverflowEffect', () => ({
  __esModule: true,
  default: () => () => () => {},
}));

describe('Dialog', () => {
  it('renders nothing when open is false and never opened', () => {
    const { container } = render(
      <Dialog open={false} usePortal={false}>
        <p>Dialog content</p>
      </Dialog>,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders children when open is true', () => {
    render(
      <Dialog open={true} usePortal={false}>
        <p>Dialog content</p>
      </Dialog>,
    );
    expect(screen.getByText('Dialog content')).toBeInTheDocument();
  });

  it('renders a dialog element with open attribute', () => {
    render(
      <Dialog open={true} usePortal={false}>
        <p>Content</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('open');
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = jest.fn();
    const { container } = render(
      <Dialog open={true} onClose={onClose} usePortal={false}>
        <p>Content</p>
      </Dialog>,
    );
    const outerWrapper = container.firstChild as HTMLElement;
    const backdrop = outerWrapper.firstChild as HTMLElement;
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders into a portal when usePortal is true', () => {
    render(
      <Dialog open={true} usePortal={true}>
        <p>Portal content</p>
      </Dialog>,
    );
    expect(screen.getByText('Portal content')).toBeInTheDocument();
    expect(
      document.body.querySelector('dialog'),
    ).toBeInTheDocument();
  });

  it('hides content after close with animation delay', () => {
    jest.useFakeTimers();
    const { rerender } = render(
      <Dialog open={true} usePortal={false}>
        <p>Fading</p>
      </Dialog>,
    );
    expect(screen.getByText('Fading')).toBeInTheDocument();

    rerender(
      <Dialog open={false} usePortal={false}>
        <p>Fading</p>
      </Dialog>,
    );

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(screen.queryByRole('dialog')).toBeNull();
    jest.useRealTimers();
  });

  it('preserves children ref across re-renders', () => {
    const { rerender } = render(
      <Dialog open={true} usePortal={false}>
        <p>Initial</p>
      </Dialog>,
    );
    expect(screen.getByText('Initial')).toBeInTheDocument();

    rerender(
      <Dialog open={true} usePortal={false}>
        <p>Updated</p>
      </Dialog>,
    );
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });
});
