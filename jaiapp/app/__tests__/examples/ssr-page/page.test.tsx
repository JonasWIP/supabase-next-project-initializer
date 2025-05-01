import { render, screen } from '@testing-library/react';
import SSRPage from '../../../examples/ssr-page/page';

// Mock the required modules
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
            { id: 1, title: 'Test Post 1' },
            { id: 2, title: 'Test Post 2' }
          ]
        })
      })
    })
  }
}));

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

describe('SSRPage', () => {
  it('renders the SSR page with data from server', async () => {
    const page = await SSRPage();
    render(page);
    
    // Check if page header is rendered
    expect(screen.getByTestId('page-header')).toHaveTextContent('Server-Side Rendering Example');
    
    // Check for SSR-specific content
    expect(screen.getByText('This page is rendered on the server using SSR.')).toBeInTheDocument();
    expect(screen.getByText(/Generated at:/)).toBeInTheDocument();
    expect(screen.getByText(/User: test@example.com/)).toBeInTheDocument();
    
    // Check for the benefits section
    expect(screen.getByText('Benefits of SSR in this example:')).toBeInTheDocument();
  });
});