import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

import TabSection, { TabSectionTab } from '../TabSection';
import TabSectionStringList from '../TabSectionStringList';

const mockTabs: TabSectionTab[] = [
  { id: 'tab1', label: 'Tab One' },
  { id: 'tab2', label: 'Tab Two' },
  { id: 'tab3', label: 'Tab Three' },
];

describe('TabSection', () => {
  it('renders the section title', () => {
    render(
      <TabSection title='Test Title' tabs={mockTabs}>
        {() => <div>Content</div>}
      </TabSection>,
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders all tab buttons', () => {
    render(
      <TabSection title='Title' tabs={mockTabs}>
        {() => <div>Content</div>}
      </TabSection>,
    );
    expect(screen.getByText('Tab One')).toBeInTheDocument();
    expect(screen.getByText('Tab Two')).toBeInTheDocument();
    expect(screen.getByText('Tab Three')).toBeInTheDocument();
  });

  it('renders tabs with tablist role', () => {
    render(
      <TabSection title='Title' tabs={mockTabs}>
        {() => <div>Content</div>}
      </TabSection>,
    );
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('marks first tab as selected by default', () => {
    render(
      <TabSection title='Title' tabs={mockTabs}>
        {() => <div>Content</div>}
      </TabSection>,
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
  });

  it('passes the active tab id to children render function', () => {
    render(
      <TabSection title='Title' tabs={mockTabs}>
        {(activeTabId) => <div data-testid='content'>Active: {activeTabId}</div>}
      </TabSection>,
    );
    expect(screen.getByTestId('content')).toHaveTextContent('Active: tab1');
  });

  it('switches active tab when clicked', () => {
    render(
      <TabSection title='Title' tabs={mockTabs}>
        {(activeTabId) => <div data-testid='content'>Active: {activeTabId}</div>}
      </TabSection>,
    );
    fireEvent.click(screen.getByText('Tab Two'));
    expect(screen.getByTestId('content')).toHaveTextContent('Active: tab2');

    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('renders disclaimer when provided', () => {
    render(
      <TabSection title='Title' tabs={mockTabs} disclaimer='Test disclaimer'>
        {() => <div>Content</div>}
      </TabSection>,
    );
    expect(screen.getByText('Test disclaimer')).toBeInTheDocument();
  });

  it('does not render disclaimer when null', () => {
    render(
      <TabSection title='Title' tabs={mockTabs} disclaimer={null}>
        {() => <div>Content</div>}
      </TabSection>,
    );
    expect(screen.queryByText(/disclaimer/i)).not.toBeInTheDocument();
  });

  it('returns null when tabs array is empty', () => {
    const { container } = render(
      <TabSection title='Title' tabs={[]}>
        {() => <div>Content</div>}
      </TabSection>,
    );
    expect(container.innerHTML).toBe('');
  });

  it('applies sectionClassName to outer section', () => {
    render(
      <TabSection
        title='Title'
        tabs={mockTabs}
        sectionClassName='custom-section'
      >
        {() => <div>Content</div>}
      </TabSection>,
    );
    const section = screen.getByText('Title').closest('section');
    expect(section).toHaveClass('custom-section');
  });
});

describe('TabSectionStringList', () => {
  it('renders list items', () => {
    render(
      <TabSectionStringList
        items={['Item A', 'Item B', 'Item C']}
        iconType='none'
        listClassName='list'
        itemClassName='item'
      />,
    );
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('Item B')).toBeInTheDocument();
    expect(screen.getByText('Item C')).toBeInTheDocument();
  });

  it('renders check icons when iconType is check', () => {
    const { container } = render(
      <TabSectionStringList
        items={['Check Item']}
        iconType='check'
        listClassName='list'
        itemClassName='item'
        positiveIconClassName='positive'
      />,
    );
    expect(screen.getByText('Check Item')).toBeInTheDocument();
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThanOrEqual(1);
  });

  it('renders close icons when iconType is close', () => {
    render(
      <TabSectionStringList
        items={['Close Item']}
        iconType='close'
        listClassName='list'
        itemClassName='item'
      />,
    );
    expect(screen.getByText('Close Item')).toBeInTheDocument();
  });

  it('renders no icons when iconType is none', () => {
    const { container } = render(
      <TabSectionStringList
        items={['Plain Item']}
        iconType='none'
        listClassName='list'
        itemClassName='item'
      />,
    );
    expect(screen.getByText('Plain Item')).toBeInTheDocument();
    expect(container.querySelectorAll('svg')).toHaveLength(0);
  });

  it('applies listClassName and itemClassName', () => {
    const { container } = render(
      <TabSectionStringList
        items={['Styled']}
        iconType='none'
        listClassName='my-list'
        itemClassName='my-item'
      />,
    );
    expect(container.querySelector('.my-list')).toBeInTheDocument();
    expect(container.querySelector('.my-item')).toBeInTheDocument();
  });
});
