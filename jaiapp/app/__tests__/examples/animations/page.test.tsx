import { render, screen, fireEvent } from '@testing-library/react';
import AnimationsExamplePage from '../../../examples/animations/page';

// Define types for component props
type ChildrenProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

// Mock framer-motion to avoid animation implementation details
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onClick }: ChildrenProps) => (
      <div className={className} onClick={onClick} data-testid="motion-div">
        {children}
      </div>
    ),
    button: ({ children, className, onClick }: ChildrenProps) => (
      <button className={className} onClick={onClick} data-testid="motion-button">
        {children}
      </button>
    ),
  }
}));

// Mock the UI components
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

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
    <button data-testid="ui-button" onClick={onClick}>{children}</button>
  )
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  ),
  CardContent: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div data-testid="card-content" className={className}>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h3 data-testid="card-title">{children}</h3>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <p data-testid="card-description">{children}</p>
  ),
}));

describe('AnimationsExamplePage', () => {
  it('renders the animations page with tabs', () => {
    render(<AnimationsExamplePage />);
    
    // Check if page header is rendered
    expect(screen.getByTestId('page-header')).toHaveTextContent('Framer Motion Examples');
    
    // Check if all tabs are rendered
    expect(screen.getByText('Simple')).toBeInTheDocument();
    expect(screen.getByText('Stagger')).toBeInTheDocument();
    expect(screen.getByText('Gestures')).toBeInTheDocument();
    
    // Check if the initial tab content is rendered
    expect(screen.getByText('Fade and Scale')).toBeInTheDocument();
    expect(screen.getByText('Hover Animation')).toBeInTheDocument();
    
    // Simple tab should be active by default
    expect(screen.getByText('Show Element')).toBeInTheDocument();
  });

  it('allows switching between tabs', () => {
    render(<AnimationsExamplePage />);
    
    // Click the Stagger tab
    fireEvent.click(screen.getByText('Stagger'));
    
    // Check if the content changes to stagger animations
    expect(screen.getByText('Staggered Animation')).toBeInTheDocument();
    expect(screen.getByText('Elements that animate in sequence')).toBeInTheDocument();
    
    // Click the Gestures tab
    fireEvent.click(screen.getByText('Gestures'));
    
    // Check if the content changes to gesture animations
    expect(screen.getByText('Gesture Animations')).toBeInTheDocument();
    expect(screen.getByText('Drag me!')).toBeInTheDocument();
  });

  it('toggles visibility when clicking the Show/Hide button', () => {
    render(<AnimationsExamplePage />);
    
    // Initially the animated element should not be visible
    expect(screen.queryByText('Hello Animation!')).not.toBeInTheDocument();
    
    // Click the Show Element button
    fireEvent.click(screen.getByText('Show Element'));
    
    // Now the animated element should be visible
    expect(screen.getByText('Hello Animation!')).toBeInTheDocument();
    expect(screen.getByText('This element animates in and out smoothly.')).toBeInTheDocument();
    
    // Button text should change to "Hide"
    expect(screen.getByText('Hide Element')).toBeInTheDocument();
    
    // Click the Hide Element button
    fireEvent.click(screen.getByText('Hide Element'));
    
    // The animated element should disappear
    expect(screen.queryByText('Hello Animation!')).not.toBeInTheDocument();
  });
});