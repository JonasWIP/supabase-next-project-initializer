import { render, screen } from '@testing-library/react';
import HomePage from '../page';

describe('HomePage', () => {
  it('renders the homepage correctly', () => {
    render(<HomePage />);
    
    // Check if main heading exists
    expect(screen.getByText('Welcome to SupaNext Template')).toBeInTheDocument();
    
    // Check for sub-heading with updated text
    expect(screen.getByText('A modern, production-ready template using Next.js and Supabase with TypeScript and Tailwind CSS.')).toBeInTheDocument();
  });
});