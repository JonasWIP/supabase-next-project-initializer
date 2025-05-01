import { render, screen } from '@testing-library/react';
import ExamplesOverviewPage from '../../examples/page';

// Mock the layout components and Next.js Link component
jest.mock('@/components/layout/PageContainer', () => {
  return function MockPageContainer({ children }: { children: React.ReactNode }) {
    return <div data-testid="page-container">{children}</div>;
  };
});

jest.mock('@/components/layout/PageHeader', () => {
  return function MockPageHeader({ title }: { title: string }) {
    return <h1 data-testid="page-header">{title}</h1>;
  };
});

jest.mock('next/link', () => {
  return function MockLink({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href} data-testid={`link-${href}`}>{children}</a>;
  };
});

describe('ExamplesOverviewPage', () => {
  it('renders the examples page with all example links', () => {
    render(<ExamplesOverviewPage />);
    
    // Check if page header is rendered
    expect(screen.getByTestId('page-header')).toHaveTextContent('Examples & Demos');
    
    // Check if all expected example links are rendered
    expect(screen.getByTestId('link-/examples/ssr-page')).toBeInTheDocument();
    expect(screen.getByTestId('link-/examples/client-page')).toBeInTheDocument();
    expect(screen.getByTestId('link-/examples/hybrid-page')).toBeInTheDocument();
    expect(screen.getByTestId('link-/examples/function-call')).toBeInTheDocument();
    expect(screen.getByTestId('link-/examples/themes')).toBeInTheDocument();
    expect(screen.getByTestId('link-/examples/animations')).toBeInTheDocument();
    expect(screen.getByTestId('link-/examples/ui-components')).toBeInTheDocument();
    
    // Check if the page contains the example descriptions
    expect(screen.getByText('Server-Side Rendering (SSR)')).toBeInTheDocument();
    expect(screen.getByText('Client-Side Rendering')).toBeInTheDocument();
  });
});