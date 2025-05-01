import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UIComponentsPage from '../../../examples/ui-components/page';

// Common types for component props
type ChildrenProps = {
  children?: React.ReactNode;
  className?: string;
};

// Helper function to filter out special props that shouldn't be passed to DOM elements
const filterSpecialProps = (props: Record<string, unknown>): Record<string, unknown> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { asChild, collapsible, decorative, ...filteredProps } = props;
  return filteredProps;
};

// Mock all of the UI components to simplify testing
jest.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, defaultValue }: { children: React.ReactNode, defaultValue: string }) => (
    <div data-testid={`tabs-container-${defaultValue}`}>{children}</div>
  ),
  TabsList: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tabs-list">{children}</div>
  ),
  TabsTrigger: ({ children, value }: { children: React.ReactNode, value: string }) => (
    <button data-testid={`tab-${value}`} data-value={value}>{children}</button>
  ),
  TabsContent: ({ children, value }: { children: React.ReactNode, value: string }) => (
    <div data-testid={`tab-content-${value}`}>{children}</div>
  ),
}));

// Mock other UI components
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

// Mock individual UI components explicitly
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-button" className={className} {...filterSpecialProps(props)}>{children}</div>
  )
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-card" className={className} {...filterSpecialProps(props)}>{children}</div>
  ),
  CardHeader: ({ children, className, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-cardheader" className={className} {...filterSpecialProps(props)}>{children}</div>
  ),
  CardTitle: ({ children, className, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-cardtitle" className={className} {...filterSpecialProps(props)}>{children}</div>
  ),
  CardDescription: ({ children, className, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-carddescription" className={className} {...filterSpecialProps(props)}>{children}</div>
  ),
  CardContent: ({ children, className, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-cardcontent" className={className} {...filterSpecialProps(props)}>{children}</div>
  ),
  CardFooter: ({ children, className, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-cardfooter" className={className} {...filterSpecialProps(props)}>{children}</div>
  )
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ className, ...props }: { className?: string } & Record<string, unknown>) => (
    <div data-testid="ui-input" className={className} {...filterSpecialProps(props)} />
  )
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, className, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-badge" className={className} {...filterSpecialProps(props)}>{children}</div>
  )
}));

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

jest.mock('@/components/ui/switch', () => ({
  Switch: ({ checked, onCheckedChange, ...props }: SwitchProps & Record<string, unknown>) => (
    <button 
      data-testid="ui-switch" 
      data-checked={checked}
      onClick={() => onCheckedChange && onCheckedChange(!checked)}
      {...filterSpecialProps(props)}
    />
  )
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, className, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-label" className={className} {...filterSpecialProps(props)}>{children}</div>
  )
}));

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({ className, ...props }: { className?: string } & Record<string, unknown>) => (
    <div data-testid="ui-checkbox" className={className} {...filterSpecialProps(props)} />
  )
}));

jest.mock('@/components/ui/radio-group', () => ({
  RadioGroup: ({ children, className, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-radiogroup" className={className} {...filterSpecialProps(props)}>{children}</div>
  ),
  RadioGroupItem: ({ className, ...props }: { className?: string } & Record<string, unknown>) => (
    <div data-testid="ui-radiogroupitem" className={className} {...filterSpecialProps(props)} />
  )
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children, className, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-select" className={className} {...filterSpecialProps(props)}>{children}</div>
  ),
  SelectContent: ({ children, className, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-selectcontent" className={className} {...filterSpecialProps(props)}>{children}</div>
  ),
  SelectItem: ({ children, className, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-selectitem" className={className} {...filterSpecialProps(props)}>{children}</div>
  ),
  SelectTrigger: ({ children, className, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-selecttrigger" className={className} {...filterSpecialProps(props)}>{children}</div>
  ),
  SelectValue: ({ children, className, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-selectvalue" className={className} {...filterSpecialProps(props)}>{children}</div>
  )
}));

interface ToggleProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

jest.mock('@/components/ui/toggle-group', () => ({
  ToggleGroup: ({ children, value, onValueChange, ...props }: ToggleProps & Record<string, unknown>) => (
    <div data-testid="ui-toggle-group" data-value={value} {...filterSpecialProps(props)}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { 
          onClick: () => onValueChange && onValueChange(child.props.value) 
        })
      )}
    </div>
  ),
  ToggleGroupItem: ({ children, value, onClick, ...props }: {
    children?: React.ReactNode;
    value?: string;
    onClick?: () => void;
  } & Record<string, unknown>) => (
    <button 
      data-testid={`toggle-item-${value}`} 
      data-value={value}
      onClick={onClick}
      {...filterSpecialProps(props)}
    >
      {children}
    </button>
  )
}));

interface SliderProps {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  className?: string;
}

jest.mock('@/components/ui/slider', () => ({
  Slider: ({ value, onValueChange, ...props }: SliderProps & Record<string, unknown>) => (
    <div 
      data-testid="ui-slider" 
      data-value={value?.[0]} 
      onClick={() => onValueChange && onValueChange([value?.[0] ? value[0] + 10 : 10])}
      {...filterSpecialProps(props)}
    />
  )
}));

jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value, ...props }: { value?: number } & Record<string, unknown>) => (
    <div data-testid="ui-progress" data-value={value} {...filterSpecialProps(props)} />
  )
}));

jest.mock('@/components/ui/avatar', () => ({
  Avatar: ({ children, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-avatar" {...filterSpecialProps(props)}>{children}</div>
  ),
  AvatarImage: (props: Record<string, unknown>) => (
    <div data-testid="ui-avatarimage" {...filterSpecialProps(props)} />
  ),
  AvatarFallback: ({ children, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-avatarfallback" {...filterSpecialProps(props)}>{children}</div>
  )
}));

type DialogProps = ChildrenProps & Record<string, unknown>;

jest.mock('@/components/ui/alert-dialog', () => ({
  AlertDialog: ({ children, ...props }: DialogProps) => (
    <div data-testid="ui-alertdialog" {...filterSpecialProps(props)}>{children}</div>
  ),
  AlertDialogAction: ({ children, ...props }: DialogProps) => (
    <button data-testid="ui-alertdialogaction" {...filterSpecialProps(props)}>{children}</button>
  ),
  AlertDialogCancel: ({ children, ...props }: DialogProps) => (
    <button data-testid="ui-alertdialogcancel" {...filterSpecialProps(props)}>{children}</button>
  ),
  AlertDialogContent: ({ children, ...props }: DialogProps) => (
    <div data-testid="ui-alertdialogcontent" {...filterSpecialProps(props)}>{children}</div>
  ),
  AlertDialogDescription: ({ children, ...props }: DialogProps) => (
    <div data-testid="ui-alertdialogdescription" {...filterSpecialProps(props)}>{children}</div>
  ),
  AlertDialogFooter: ({ children, ...props }: DialogProps) => (
    <div data-testid="ui-alertdialogfooter" {...filterSpecialProps(props)}>{children}</div>
  ),
  AlertDialogHeader: ({ children, ...props }: DialogProps) => (
    <div data-testid="ui-alertdialogheader" {...filterSpecialProps(props)}>{children}</div>
  ),
  AlertDialogTitle: ({ children, ...props }: DialogProps) => (
    <div data-testid="ui-alertdialogtitle" {...filterSpecialProps(props)}>{children}</div>
  ),
  AlertDialogTrigger: ({ children, ...props }: DialogProps) => (
    <div data-testid="ui-alertdialogtrigger" {...filterSpecialProps(props)}>{children}</div>
  )
}));

type TooltipProps = ChildrenProps & Record<string, unknown>;

jest.mock('@/components/ui/tooltip', () => ({
  Tooltip: ({ children, ...props }: TooltipProps) => (
    <div data-testid="ui-tooltip" {...filterSpecialProps(props)}>{children}</div>
  ),
  TooltipContent: ({ children, ...props }: TooltipProps) => (
    <div data-testid="ui-tooltipcontent" {...filterSpecialProps(props)}>{children}</div>
  ),
  TooltipProvider: ({ children, ...props }: TooltipProps) => (
    <div data-testid="ui-tooltipprovider" {...filterSpecialProps(props)}>{children}</div>
  ),
  TooltipTrigger: ({ children, ...props }: TooltipProps) => (
    <div data-testid="ui-tooltiptrigger" {...filterSpecialProps(props)}>{children}</div>
  )
}));

type AccordionProps = ChildrenProps & Record<string, unknown>;

jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children, ...props }: AccordionProps) => (
    <div data-testid="ui-accordion" {...filterSpecialProps(props)}>{children}</div>
  ),
  AccordionContent: ({ children, ...props }: AccordionProps) => (
    <div data-testid="ui-accordioncontent" {...filterSpecialProps(props)}>{children}</div>
  ),
  AccordionItem: ({ children, ...props }: AccordionProps) => (
    <div data-testid="ui-accordionitem" {...filterSpecialProps(props)}>{children}</div>
  ),
  AccordionTrigger: ({ children, ...props }: AccordionProps) => (
    <div data-testid="ui-accordiontrigger" {...filterSpecialProps(props)}>{children}</div>
  )
}));

jest.mock('@/components/ui/separator', () => ({
  Separator: (props: Record<string, unknown>) => (
    <div data-testid="ui-separator" {...filterSpecialProps(props)} />
  )
}));

jest.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children, ...props }: ChildrenProps & Record<string, unknown>) => (
    <div data-testid="ui-scrollarea" {...filterSpecialProps(props)}>{children}</div>
  )
}));

describe('UIComponentsPage', () => {
  it('renders the UI components page with tabs', () => {
    render(<UIComponentsPage />);
    
    // Check if page header is rendered
    expect(screen.getByTestId('page-header')).toHaveTextContent('UI Components Showcase');
    
    // Check if tabs are rendered
    expect(screen.getByTestId('tabs-container-inputs')).toBeInTheDocument();
    expect(screen.getByTestId('tab-inputs')).toBeInTheDocument();
    expect(screen.getByTestId('tab-display')).toBeInTheDocument();
    expect(screen.getByTestId('tab-feedback')).toBeInTheDocument();
    expect(screen.getByTestId('tab-layout')).toBeInTheDocument();
    
    // Check if the tabs content is rendered
    expect(screen.getByTestId('tab-content-inputs')).toBeInTheDocument();
    expect(screen.getByTestId('tab-content-display')).toBeInTheDocument();
    expect(screen.getByTestId('tab-content-feedback')).toBeInTheDocument();
    expect(screen.getByTestId('tab-content-layout')).toBeInTheDocument();
  });

  it('has interactive toggle group component that updates state', () => {
    render(<UIComponentsPage />);
    
    // Initial state should be "center"
    expect(screen.getByTestId('ui-toggle-group')).toHaveAttribute('data-value', 'center');
    
    // Click on the "left" alignment toggle
    fireEvent.click(screen.getByTestId('toggle-item-left'));
    
    // Verify the state changes
    expect(screen.getByTestId('ui-toggle-group')).toHaveAttribute('data-value', 'left');
  });

  it('has interactive switch component that updates state', () => {
    render(<UIComponentsPage />);
    
    // Get the switch element and check initial state
    const switchElement = screen.getByTestId('ui-switch');
    expect(switchElement).toHaveAttribute('data-checked', 'false');
    
    // Click the switch
    fireEvent.click(switchElement);
    
    // Check that the switch state has changed
    expect(switchElement).toHaveAttribute('data-checked', 'true');
  });

  it('contains examples of different UI component categories', () => {
    render(<UIComponentsPage />);
    
    // Check for headings of different UI component sections using more specific selectors
    expect(screen.getByRole('heading', { name: 'Input Controls' })).toBeInTheDocument();
    
    // Look for the specific card title with 'Buttons' text instead of using test ID alone
    const cardTitles = screen.getAllByTestId('ui-cardtitle');
    const buttonsTitle = cardTitles.find(element => element.textContent === 'Buttons');
    expect(buttonsTitle).toBeInTheDocument();
    
    expect(screen.getByRole('heading', { name: 'Form Controls' })).toBeInTheDocument();
    
    // Find display components tab content
    expect(screen.getByTestId('tab-display')).toBeInTheDocument();
    
    // Find feedback components tab content
    expect(screen.getByTestId('tab-feedback')).toBeInTheDocument();
    
    // Find layout components tab content
    expect(screen.getByTestId('tab-layout')).toBeInTheDocument();
    
    // Check for documentation section
    expect(screen.getByText('Component Documentation')).toBeInTheDocument();
  });
});