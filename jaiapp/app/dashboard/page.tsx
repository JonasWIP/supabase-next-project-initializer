'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, getUserProfile, signOut } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { Database } from '../../lib/database.types';
import UserProfile from '@/components/dashboard/UserProfile';
import DashboardActions from '@/components/dashboard/DashboardActions';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Define Auth User type separately from the database UserProfile type
type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, null>;
  app_metadata?: Record<string, null>;
};

// Use generated type from database.types.ts for user profile
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUserData() {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser as AuthUser);
          
          // Get user profile via Supabase client
          const userProfile = await getUserProfile();
          setProfile(userProfile);
        } else {
          // Redirect to login if no user is found
          router.push('/login');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [router, setError]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <PageContainer maxWidth="lg">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent text-primary rounded-full mb-4" role="status" aria-label="loading"></div>
            <p className="text-lg">Loading dashboard data...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer maxWidth="lg">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="lg">
      <PageHeader 
        title="User Dashboard"
        description="Manage your account and access your profile information"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="md:col-span-2 space-y-6">
          <UserProfile user={user} profile={profile} />
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/examples">
                <Button variant="secondary" className="w-full">
                  View Examples
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Home Page
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        
        {/* Actions Panel */}
        <div className="space-y-6">
          <DashboardActions onSignOut={handleSignOut} />
          
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span>Active</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your account is in good standing and has full access to all features.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}