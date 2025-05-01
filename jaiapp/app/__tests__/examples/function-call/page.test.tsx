import { render, screen } from '@testing-library/react';
import FunctionCallPage from '../../../examples/function-call/page';

// Mock the required modules
jest.mock('@/lib/supabase/server-client', () => ({
  SupabaseServerHelper: {
    createServerClient: jest.fn().mockResolvedValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: null } })
      },
      functions: {
        invoke: jest.fn().mockResolvedValue({
          data: {
            message: 'Hello from Edge Function!',
            timestamp: '2025-01-01T00:00:00Z',
            authenticated: false,
          },
          error: null
        })
      }
    })
  }
}));

// Mock the ClientFunctionExample component
jest.mock('../../../examples/function-call/ClientFunctionExample', () => {
  return function MockClientFunctionExample() {
    return <div data-testid="client-function-example">Client Function Example</div>;
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

jest.mock('@/components/ui/codeblock', () => ({
  CodeBlock: ({ children, language, title }: { children: React.ReactNode, language?: string, title?: string, className?: string, maxHeight?: string }) => (
    <div data-testid={`codeblock-${language || 'default'}-${title?.replace(/\s+/g, '-').toLowerCase() || 'notitle'}`} className="code-block">
      {title && <div className="code-title">{title}</div>}
      <pre>{children}</pre>
    </div>
  )
}));

describe('FunctionCallPage', () => {
  it('renders the function call page with server and client examples', async () => {
    const page = await FunctionCallPage();
    render(page);
    
    // Check if page header is rendered
    expect(screen.getByTestId('page-header')).toHaveTextContent('Edge Functions Example');
    
    // Check for server function call section
    expect(screen.getByText('Server-Side Edge Function Call')).toBeInTheDocument();
    expect(screen.getByText('This example demonstrates calling a Supabase Edge Function from a server component.')).toBeInTheDocument();
    
    // Check if it shows the function response status
    expect(screen.getByText('Status: Public Access (Not Authenticated)')).toBeInTheDocument();
    
    // Check if code blocks are rendered - now with more specific testids
    expect(screen.getByTestId('codeblock-typescript-initialize-client')).toBeInTheDocument();
    expect(screen.getByTestId('codeblock-typescript-basic-function-call')).toBeInTheDocument();
    
    // Check if client function example component is rendered
    expect(screen.getByTestId('client-function-example')).toBeInTheDocument();
  });
});