# Testing Guide

This guide covers testing strategies and implementation details for the SupaNext Template.

## Overview

The template includes a comprehensive testing setup with:

- Jest as the test runner
- React Testing Library for component testing
- Support for testing both client and server components
- Mock implementations for Supabase and other services

## Testing Architecture

### Configuration Files

- `jest.config.js` - Core Jest configuration
- `jest.setup.js` - Global test setup and mocks

### Directory Structure

Tests are organized in `__tests__` directories close to the code they test:

```
app/
  __tests__/           # Page tests
    page.test.tsx
    dashboard/
      page.test.tsx
components/
  __tests__/           # Component tests
    forms/
      LoginForm.test.tsx
    ui/
      button.test.tsx
lib/
  __tests__/           # Utility tests
    utils.test.ts
```

This structure makes it easy to find tests related to specific components or modules.

## Running Tests

### Basic Commands

Run all tests:

```bash
npm test
```

Run tests in watch mode (for development):

```bash
npm run test:watch
```

Run tests with coverage report:

```bash
npm run test:coverage
```

### Running Specific Tests

Run tests that match a filename pattern:

```bash
npm test -- button
```

## Writing Tests

### Testing Components

#### Basic Component Test

```tsx
// components/__tests__/ui/button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
    expect(button).toHaveClass('text-destructive-foreground');
  });
});
```

#### Testing with Context Providers

Many components rely on context providers like `AuthContext`. Wrap these components with the necessary providers:

```tsx
// Example of testing a component that uses AuthContext
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProfileButton } from '@/components/ProfileButton';

// Create a wrapper function
function renderWithAuth(ui, authValue = {}) {
  return render(
    <AuthProvider initialAuthState={authValue}>
      {ui}
    </AuthProvider>
  );
}

test('shows login button when user is not authenticated', () => {
  renderWithAuth(<ProfileButton />, { user: null, isLoading: false });
  expect(screen.getByText(/log in/i)).toBeInTheDocument();
});

test('shows user email when authenticated', () => {
  renderWithAuth(
    <ProfileButton />,
    { user: { email: 'test@example.com' }, isLoading: false }
  );
  expect(screen.getByText('test@example.com')).toBeInTheDocument();
});
```

### Testing Pages

#### Testing Server Components

For server components, create mocks for server-side APIs and use them in your tests:

```tsx
// app/__tests__/dashboard/page.test.tsx
import { render, screen } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';

// Mock the createServerClient function
jest.mock('@/lib/supabase', () => ({
  createServerClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(() => ({
        data: {
          session: { user: { email: 'test@example.com' } }
        }
      }))
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: { full_name: 'Test User' }
          }))
        }))
      }))
    }))
  }))
}));

// Mock the Next.js redirect function
jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}));

describe('Dashboard Page', () => {
  it('renders user information when authenticated', async () => {
    render(await DashboardPage());
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
  });
});
```

#### Testing Client Components

For client components, especially those with API calls or state:

```tsx
// Example of testing a client component that fetches data
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClientSideList } from '@/components/ClientSideList';

// Mock fetch
global.fetch = jest.fn();

describe('ClientSideList', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('fetches and displays items', async () => {
    // Mock fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ([{ id: '1', name: 'Item 1' }])
    });

    render(<ClientSideList />);
    
    // Initially shows loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
    
    // Verify fetch was called correctly
    expect(fetch).toHaveBeenCalledWith('/api/items');
  });

  it('handles fetch errors', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<ClientSideList />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

### Testing Hooks

Custom hooks can be tested using `@testing-library/react-hooks`:

```tsx
// hooks/__tests__/use-mobile.test.tsx
import { renderHook } from '@testing-library/react-hooks';
import { useMobile } from '@/hooks/use-mobile';

// Mock the window.matchMedia function
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('useMobile', () => {
  it('returns false for desktop viewport', () => {
    const { result } = renderHook(() => useMobile());
    expect(result.current).toBe(false);
  });

  it('returns true for mobile viewport', () => {
    window.matchMedia.mockImplementationOnce(query => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    
    const { result } = renderHook(() => useMobile());
    expect(result.current).toBe(true);
  });
});
```

### Testing Utilities

Pure utility functions can be tested directly without rendering components:

```tsx
// lib/__tests__/utils.test.ts
import { cn } from '@/lib/utils';

describe('cn function', () => {
  it('merges class names correctly', () => {
    const result = cn('class1', 'class2', { conditionalClass: true });
    expect(result).toBe('class1 class2 conditionalClass');
  });
  
  it('handles conditional classes', () => {
    const result = cn('base', { active: true, disabled: false });
    expect(result).toBe('base active');
    expect(result).not.toContain('disabled');
  });
  
  it('resolves tailwind conflicts correctly', () => {
    const result = cn('px-4', 'px-6');
    expect(result).toBe('px-6');
  });
});
```

## Mocking Services

### Mocking Supabase

Create dedicated mock functions for Supabase operations:

```typescript
// __mocks__/supabase.ts
export const mockSupabase = {
  auth: {
    getSession: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
      })),
      order: jest.fn(() => ({
        limit: jest.fn(),
      })),
    })),
    insert: jest.fn(() => ({
      select: jest.fn(),
    })),
    update: jest.fn(() => ({
      eq: jest.fn(),
    })),
    delete: jest.fn(() => ({
      eq: jest.fn(),
    })),
  })),
};

// Then in your tests
jest.mock('@/lib/supabase', () => ({
  createServerClient: jest.fn(() => mockSupabase),
  createBrowserClient: jest.fn(() => mockSupabase),
}));
```

### Mocking Next.js Functions

```typescript
// Mock Next.js navigation functions
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
  redirect: jest.fn(),
}));

// Mock Next.js cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    getAll: jest.fn(() => []),
    get: jest.fn(),
    set: jest.fn(),
  })),
}));
```

## Testing Best Practices

### User-Centric Testing

Test from the user's perspective, focusing on what the user sees and interacts with:

```tsx
// Good: Tests what the user experiences
test('user can submit the form with valid inputs', async () => {
  render(<LoginForm />);
  await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'password123');
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
  
  expect(screen.getByText(/signing in/i)).toBeInTheDocument();
  // ... verify the expected outcome
});

// Bad: Tests implementation details
test('form sets isLoading state to true on submit', () => {
  // Implementation details may change but user experience stays the same
});
```

### Test Accessibility

Include accessibility testing in your components:

```tsx
test('form is accessible', async () => {
  const { container } = render(<LoginForm />);
  
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Snapshot Testing

Use snapshot testing for UI components that don't change often:

```tsx
test('button matches snapshot', () => {
  const { container } = render(<Button>Click me</Button>);
  expect(container).toMatchSnapshot();
});
```

### Test Coverage

The template aims for high test coverage, especially for critical paths:

- Authentication flows
- Form submissions
- Data fetching
- Component rendering

Run coverage reports to identify areas that need more testing:

```bash
npm run test:coverage
```

## Testing Real-World Scenarios

### Testing Authentication Flows

```tsx
test('user can log in and access protected content', async () => {
  // Mock successful auth
  mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
    data: { session: { user: { email: 'test@example.com' } } },
    error: null,
  });
  
  // Render login form
  render(<LoginForm />);
  
  // Fill out and submit form
  await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
  await userEvent.type(screen.getByLabelText(/password/i), 'password123');
  await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
  
  // Verify Supabase was called correctly
  expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  });
});
```

### Testing API Integrations

```tsx
test('items are fetched and displayed', async () => {
  // Mock API response
  mockSupabase.from().select().mockReturnValue({
    data: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ],
    error: null,
  });
  
  // Render component
  render(<ItemList />);
  
  // Check loading state
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  // Wait for data to be displayed
  await waitFor(() => {
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
});
```

### Testing Error Handling

```tsx
test('displays error message when API call fails', async () => {
  // Mock API error
  mockSupabase.from().select().mockReturnValue({
    data: null,
    error: { message: 'Failed to fetch data' },
  });
  
  // Render component
  render(<ItemList />);
  
  // Wait for error message
  await waitFor(() => {
    expect(screen.getByText(/failed to fetch data/i)).toBeInTheDocument();
  });
});
```

## Continuous Integration

The project is configured for CI testing with GitHub Actions. Tests run automatically on:

- Pull requests
- Pushes to main branch
- Scheduled nightly builds

See the `.github/workflows` directory for CI configuration details.

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro)
- [Testing Next.js Applications](https://nextjs.org/docs/testing)