import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '../../dashboard/page';
import { getCurrentUser, getUserProfile } from '../../../lib/supabase';

// Mock the hooks and functions used in the component
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../../../lib/supabase', () => ({
  getCurrentUser: jest.fn(),
  getUserProfile: jest.fn(),
  signOut: jest.fn(),
}));

describe('DashboardPage', () => {
  
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    // Setup mocks to simulate loading state
    (getCurrentUser as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    render(<DashboardPage />);
    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
  });

  it('renders dashboard content when user is authenticated', async () => {
    // Setup mocks to return authentication data
    (getCurrentUser as jest.Mock).mockResolvedValue({ 
      id: 'test-user-id', 
      email: 'test@example.com' 
    });
    
    (getUserProfile as jest.Mock).mockResolvedValue({
      id: 'test-profile-id',
      user_id: 'test-user-id',
      username: 'testuser',
    });
    
    render(<DashboardPage />);
    
    // Wait for the async operations to complete
    await waitFor(() => {
      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
    });
    
    // Verify that getCurrentUser was called
    expect(getCurrentUser).toHaveBeenCalled();
  });
});