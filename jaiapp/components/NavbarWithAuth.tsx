'use client';

import { useAuth } from '@/contexts/AuthContext';
import Navbar from './Navbar';

type NavbarWithAuthProps = {
  logo?: string;
  links?: Array<{ label: string; href: string }>;
};

export default function NavbarWithAuth({
  logo = 'SupaNext',
  links = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]
}: NavbarWithAuthProps) {
  const { isAuthenticated, userName, isLoading, signOut } = useAuth();

  if (isLoading) {
    // Return a simplified navbar during loading
    return (
      <nav className="bg-background border-b border-border shadow-sm">
        <div className="container mx-auto flex justify-between items-center px-4 py-4">
          <div className="text-xl font-bold text-foreground">{logo}</div>
        </div>
      </nav>
    );
  }

  return (
    <Navbar
      logo={logo}
      links={links}
      isAuthenticated={isAuthenticated}
      onLogout={signOut}
      userName={userName}
    />
  );
}