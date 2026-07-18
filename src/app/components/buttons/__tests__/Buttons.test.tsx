import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('next/image', () => require('@/testUtils/mockNextImage'));

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

import CloseButton from '../CloseButton';
import MyPrimary from '../MyPrimary';
import MySecondary from '../MySecondary';
import MyTertiary from '../MyTertiary';
import ButtonDisplay from '../ButtonDisplay';

describe('CloseButton', () => {
  it('renders a button with aria-label Close', () => {
    render(<CloseButton />);
    const btn = screen.getByRole('button', { name: 'Close' });
    expect(btn).toBeInTheDocument();
  });

  it('renders a Close image', () => {
    render(<CloseButton />);
    expect(screen.getByAltText('Close')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const onClick = jest.fn();
    render(<CloseButton onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('passes additional className', () => {
    render(<CloseButton className='extra' />);
    const btn = screen.getByRole('button', { name: 'Close' });
    expect(btn).toHaveClass('extra');
  });

  it('forwards ref to button element', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<CloseButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

describe('MyPrimary', () => {
  it('renders Primary heading and four ActionButtons', () => {
    render(<MyPrimary />);
    expect(screen.getByText('Primary')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('renders Search labels', () => {
    render(<MyPrimary />);
    const labels = screen.getAllByText('Search');
    expect(labels).toHaveLength(4);
  });

  it('renders Default, Full Width, and disabled variants', () => {
    render(<MyPrimary />);
    expect(screen.getByText('Default')).toBeInTheDocument();
    expect(screen.getByText('Full Width')).toBeInTheDocument();
  });

  it('invokes onClick handler when a button is clicked', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<MyPrimary />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(logSpy).toHaveBeenCalledWith('clicked Primary button');
    logSpy.mockRestore();
  });
});

describe('MySecondary', () => {
  it('renders Secondary heading', () => {
    render(<MySecondary />);
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });

  it('renders four Search buttons', () => {
    render(<MySecondary />);
    const labels = screen.getAllByText('Search');
    expect(labels).toHaveLength(4);
  });

  it('invokes onClick handler when a button is clicked', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<MySecondary />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(logSpy).toHaveBeenCalledWith('clicked Secondary button');
    logSpy.mockRestore();
  });
});

describe('MyTertiary', () => {
  it('renders Tertiary heading', () => {
    render(<MyTertiary />);
    expect(screen.getByText('Tertiary')).toBeInTheDocument();
  });

  it('renders four Learn more buttons', () => {
    render(<MyTertiary />);
    const labels = screen.getAllByText('Learn more');
    expect(labels).toHaveLength(4);
  });

  it('invokes onClick handler when a button is clicked', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<MyTertiary />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(logSpy).toHaveBeenCalledWith('clicked Tertiary button');
    logSpy.mockRestore();
  });
});

describe('ButtonDisplay', () => {
  it('renders MyPrimary, MySecondary, and MyTertiary', () => {
    render(<ButtonDisplay />);
    expect(screen.getByText('Primary')).toBeInTheDocument();
    expect(screen.getByText('Secondary')).toBeInTheDocument();
    expect(screen.getByText('Tertiary')).toBeInTheDocument();
  });
});
