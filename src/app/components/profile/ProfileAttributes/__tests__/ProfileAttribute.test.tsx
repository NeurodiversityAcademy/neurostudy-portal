import React from 'react';
import { render, screen } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

import ProfileAttribute from '../ProfileAttribute';

describe('ProfileAttribute', () => {
  it('renders label and string value', () => {
    render(<ProfileAttribute label='Name' value='John' />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('renders N/A when value is undefined', () => {
    render(<ProfileAttribute label='Name' value={undefined} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders boolean true as Yes', () => {
    render(<ProfileAttribute label='Active' value={true} />);
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('renders boolean false as No', () => {
    render(<ProfileAttribute label='Active' value={false} />);
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('renders array as comma-separated string', () => {
    render(<ProfileAttribute label='Skills' value={['A', 'B', 'C']} />);
    expect(screen.getByText('A, B, C')).toBeInTheDocument();
  });

  it('renders number value as string', () => {
    render(<ProfileAttribute label='Age' value={25} />);
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('renders N/A for empty string', () => {
    render(<ProfileAttribute label='Name' value='' />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders N/A for empty array', () => {
    render(<ProfileAttribute label='Items' value={[]} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders empty label when label prop is empty', () => {
    const { container } = render(
      <ProfileAttribute label='' value='Value' />,
    );
    expect(container.querySelector('label')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });
});
