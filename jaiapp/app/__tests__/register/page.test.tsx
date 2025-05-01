import { render, screen } from '@testing-library/react';
import RegisterPage from '../../register/page';

// Mock the RegisterForm component
jest.mock('@/components/forms/RegisterForm', () => {
  return function MockRegisterForm() {
    return <div data-testid="register-form">Register Form Component</div>;
  };
});

describe('RegisterPage', () => {
  it('renders the register page with registration form', () => {
    render(<RegisterPage />);
    
    // Check if register form is rendered
    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });
});