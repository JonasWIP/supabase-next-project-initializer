import { render, screen } from '@testing-library/react';
import HybridPage from '../../../examples/hybrid-page/page';

// Mock the server components and client components
jest.mock('@/lib/supabase/server-client', () => ({
  SupabaseServerHelper: {
    createServerClient: jest.fn().mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: { email: 'test@example.com' } } })
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({
          data: [
            { id: 1, title: 'Server Post 1' },
            { id: 2, title: 'Server Post 2' },
            { id: 3, title: 'Server Post 3' }
          ]
        })
      })
    })
  }
}));

// Mock the ClientInteractiveSection component
jest.mock('../../../examples/hybrid-page/ClientInteractiveSection', () => {
  return function MockClientInteractiveSection({ initialPostCount }: { initialPostCount: number }) {
    return (
      <div data-testid="client-interactive-section">
        <p>Client Interactive Section with {initialPostCount} initial posts</p>
      </div>
    );
  };
});

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

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  )
}));

describe('HybridPage', () => {
  it('renders the hybrid page with server data and client component', async () => {
    const page = await HybridPage();
    render(page);
    
    // Check if page header is rendered
    expect(screen.getByTestId('page-header')).toHaveTextContent('Hybrid Rendering Example');
    
    // Check for server-rendered content
    expect(screen.getByText('This section was rendered on the server.')).toBeInTheDocument();
    expect(screen.getByText(/Generated at:/)).toBeInTheDocument();
    expect(screen.getByText(/User: test@example.com/)).toBeInTheDocument();
    
    // Check if server posts are rendered
    expect(screen.getByText('Server Post 1')).toBeInTheDocument();
    expect(screen.getByText('Server Post 2')).toBeInTheDocument();
    expect(screen.getByText('Server Post 3')).toBeInTheDocument();
    
    // Check if client interactive section is rendered with correct props
    expect(screen.getByTestId('client-interactive-section')).toBeInTheDocument();
    expect(screen.getByText('Client Interactive Section with 3 initial posts')).toBeInTheDocument();
  });
});