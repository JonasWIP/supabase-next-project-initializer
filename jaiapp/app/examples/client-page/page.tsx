'use client'; // Mark as client component

import { useState, useEffect } from 'react';
import { SupabaseClientHelper } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Fix imports for PageHeader and PageContainer
import PageHeader from '@/components/layout/PageHeader';
import PageContainer from '@/components/layout/PageContainer';

// Define types for user and posts
interface Post {
  id: number;
  title: string;
  [key: string]: unknown;
}

export default function ClientPage() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);
  
  // Create Supabase client for browser using our helper
  const supabase = SupabaseClientHelper.createBrowserClient();

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setTimestamp(new Date().toISOString());
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // Get example posts data with proper error handling
      try {
        const { data } = await supabase
          .from('posts')
          .select('*')
          .limit(5);
          
        setPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [refreshCount, supabase]); // Added supabase dependency
  
  // Handler for manual refresh
  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };

  return (
    <PageContainer>
      <PageHeader title="Client-Side Rendering Example" />
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Client-Side Data Example</h2>
          <p className="mb-2">This page is rendered client-side using CSR.</p>
          <p className="mb-2">Generated at: {timestamp}</p>
          <p className="mb-2">User: {user ? user.email : 'Not logged in'}</p>
          <Button onClick={handleRefresh} className="mt-4">
            Refresh Data
          </Button>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Data from Supabase</h2>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : posts.length > 0 ? (
            <ul className="list-disc pl-5">
              {posts.map((post: Post) => (
                <li key={post.id}>{post.title}</li>
              ))}
            </ul>
          ) : (
            <p>No posts found or table doesn&apos;t exist.</p>
          )}
          <div className="mt-4 p-4 bg-muted rounded border border-border">
            <p className="text-sm font-mono text-foreground">This data was fetched client-side.</p>
            <p className="text-sm font-mono text-foreground">You can see the network requests in browser DevTools.</p>
          </div>
        </Card>
        
        <Card className="p-6 bg-sky-50 dark:bg-sky-950/20 border-l-4 border-sky-500 dark:border-sky-800">
          <h2 className="text-xl font-bold mb-4">Benefits of CSR in this example:</h2>
          <ul className="list-disc pl-5 text-muted-foreground">
            <li>Interactive experience with dynamic data refreshing</li>
            <li>No server reloads needed when refreshing content</li>
            <li>Better for highly interactive interfaces</li>
            <li>Lower server load (computation happens in user&apos;s browser)</li>
            <li>SPA-like experience with smoother transitions</li>
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}