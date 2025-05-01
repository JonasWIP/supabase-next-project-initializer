import React from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';

type NavbarProps = {
  logo?: string;
  links?: Array<{ label: string; href: string }>;
  isAuthenticated?: boolean;
  onLogout?: () => void;
  userName?: string | null;
};

const Navbar: React.FC<NavbarProps> = ({
  logo = 'Your Logo',
  links = [],
  isAuthenticated = false,
  onLogout,
  userName,
}) => {
  // Filter links - only show Dashboard if the user is authenticated
  const filteredLinks = links.filter(link => 
    link.href !== '/dashboard' || isAuthenticated
  );

  return (
    <nav className="bg-background border-b border-border shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        <div className="text-xl font-bold text-foreground">
          <Link href="/">
            {logo}
          </Link>
        </div>
        
        <div className="flex items-center">
          <ul className="flex space-x-6 mr-6">
            {filteredLinks.map((link, index) => (
              <li key={index}>
                <Link 
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mr-4">
            <ThemeToggle />
          </div>
          
          {isAuthenticated ? (
            <div className="flex items-center">
              {userName && (
                <span className="mr-4 text-sm text-muted-foreground">
                  Hello, {userName}
                </span>
              )}
              <Button
                onClick={onLogout}
                variant="destructive"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Link href="/register">
                <Button variant="secondary">
                  Register
                </Button>
              </Link>
              <Link href="/login">
                <Button>
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;