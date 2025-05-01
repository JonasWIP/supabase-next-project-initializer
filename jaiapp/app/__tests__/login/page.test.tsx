import { render, screen } from '@testing-library/react';
import LoginPage from '../../login/page';

// Mock the LoginForm component
jest.mock('@/components/forms/LoginForm', () => {
  return function MockLoginForm() {
    return <div data-testid="login-form">Login Form Component</div>;
  };
});

describe('LoginPage', () => {
  it('renders the login page with login form', () => {
    render(<LoginPage />);
    
    // Check if login form is rendered
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});