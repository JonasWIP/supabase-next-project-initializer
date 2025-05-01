import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClientPage from '../../../examples/client-page/page';

// Mock the required modules
jest.mock('@/lib/supabase/client', () => ({
  SupabaseClientHelper: {
    createBrowserClient: jest.fn().mockReturnValue({
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

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
    <button data-testid="button" onClick={onClick}>{children}</button>
  )
}));

describe('ClientPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the client-side page with loading state initially', async () => {
    render(<ClientPage />);
    
    // Check if page header is rendered
    expect(screen.getByTestId('page-header')).toHaveTextContent('Client-Side Rendering Example');
    
    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText(/User: test@example.com/)).toBeInTheDocument();
    });
    
    // Check for client-side specific content
    expect(screen.getByText('This page is rendered client-side using CSR.')).toBeInTheDocument();
    expect(screen.getByText('Refresh Data')).toBeInTheDocument();
    
    // Check for the benefits section
    expect(screen.getByText('Benefits of CSR in this example:')).toBeInTheDocument();
  });

  it('allows refreshing data with the refresh button', async () => {
    render(<ClientPage />);
    
    // Wait for initial render to complete
    await waitFor(() => {
      expect(screen.getByText(/User: test@example.com/)).toBeInTheDocument();
    });
    
    // Get the refresh button and click it
    const refreshButton = screen.getByText('Refresh Data');
    fireEvent.click(refreshButton);
    
    // Verify the page refreshes data (by checking it renders again)
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
      expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    });
  });
});