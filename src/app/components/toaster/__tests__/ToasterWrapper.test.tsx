import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ToasterWrapper from '../ToasterWrapper';
import toast, { destructToast } from '../index';

jest.mock('@/app/utilities/common', () => ({
  getUniqueID: jest.fn(() => 'toast-id-1'),
}));

describe('ToasterWrapper', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    destructToast();
  });

  it('renders an empty container initially', () => {
    const { container } = render(<ToasterWrapper />);
    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild?.childNodes).toHaveLength(0);
  });

  it('initializes the toast API on mount', () => {
    render(<ToasterWrapper />);
    expect(toast.error).toBeDefined();
    expect(toast.success).toBeDefined();
    expect(toast.info).toBeDefined();
  });

  it('shows an error toast when toast.error is called', () => {
    render(<ToasterWrapper />);
    act(() => {
      toast.error('Something went wrong');
    });
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('shows a success toast when toast.success is called', () => {
    render(<ToasterWrapper />);
    act(() => {
      toast.success('Saved successfully');
    });
    expect(screen.getByText('Saved successfully')).toBeInTheDocument();
  });

  it('shows an info toast when toast.info is called', () => {
    render(<ToasterWrapper />);
    act(() => {
      toast.info('Information message');
    });
    expect(screen.getByText('Information message')).toBeInTheDocument();
  });

  it('marks toast as hidden after default duration', () => {
    render(<ToasterWrapper />);
    act(() => {
      toast.success('Quick toast');
    });
    const item = screen.getByText('Quick toast').closest('.containerItem');
    expect(item).toBeInTheDocument();
    expect(item).not.toHaveClass('hide');

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(item).toHaveClass('hide');
  });

  it('marks toast as hidden when close button is clicked', () => {
    render(<ToasterWrapper />);
    act(() => {
      toast.error('Dismissible');
    });
    const item = screen.getByText('Dismissible').closest('.containerItem');
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(item).toHaveClass('hide');
  });

  it('renders multiple toasts simultaneously', () => {
    render(<ToasterWrapper />);
    act(() => {
      toast.error('Error 1');
      toast.success('Success 1');
      toast.info('Info 1');
    });
    expect(screen.getByText('Error 1')).toBeInTheDocument();
    expect(screen.getByText('Success 1')).toBeInTheDocument();
    expect(screen.getByText('Info 1')).toBeInTheDocument();
  });

  it('uses custom duration from options', () => {
    render(<ToasterWrapper />);
    act(() => {
      toast.info('Custom duration', { duration: 10000 });
    });
    expect(screen.getByText('Custom duration')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByText('Custom duration')).toBeInTheDocument();
    expect(
      screen.getByText('Custom duration').closest('.containerItem')
    ).not.toHaveClass('hide');
  });

  it('resets toast API on unmount so further calls are no-ops in test', () => {
    const { unmount } = render(<ToasterWrapper />);
    unmount();

    expect(toast.error('after unmount')).toBeUndefined();
  });
});
