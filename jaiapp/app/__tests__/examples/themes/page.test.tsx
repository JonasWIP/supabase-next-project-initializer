import { render, screen } from '@testing-library/react';
import ThemeShowcasePage from '../../../examples/themes/page';

// Mock the required components
jest.mock('@/components/ThemeShowcase', () => {
  return {
    ThemeShowcase: function MockThemeShowcase() {
      return <div data-testid="theme-showcase">Theme Showcase Component</div>;
    }
  };
});

jest.mock('@/components/layout/PageContainer', () => {
  return function MockPageContainer({ children }: { children: React.ReactNode }) {
    return <div data-testid="page-container">{children}</div>;
  };
});

jest.mock('@/components/layout/PageHeader', () => {
  return function MockPageHeader({ title, description }: { title: string, description?: string }) {
    return (
      <header data-testid="page-header">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </header>
    );
  };
});

describe('ThemeShowcasePage', () => {
  it('renders the themes showcase page correctly', () => {
    render(<ThemeShowcasePage />);
    
    // Check if page header is rendered with correct content
    expect(screen.getByTestId('page-header')).toBeInTheDocument();
    expect(screen.getByText('Theme Showcase')).toBeInTheDocument();
    expect(screen.getByText('Explore the different themes available in the application')).toBeInTheDocument();
    
    // Check if theme showcase component is rendered
    expect(screen.getByTestId('theme-showcase')).toBeInTheDocument();
  });
});