'use client';

import { useState, useEffect, useCallback } from 'react';
import { SupabaseClientHelper } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Define type for post objects
interface Post {
  id: number;
  title: string;
  created_at?: string;
  [key: string]: unknown;
}

export default function ClientInteractiveSection({ initialPostCount }: { initialPostCount: number }) {
  const [newPostTitle, setNewPostTitle] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientTimestamp, setClientTimestamp] = useState('');
  
  // Create Supabase client for browser using our helper class
  const supabase = SupabaseClientHelper.createBrowserClient();

  // Fetch latest posts with proper error handling - wrapped in useCallback
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setClientTimestamp(new Date().toISOString());
    
    try {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Create a new post
  const handleCreatePost = async () => {
    if (!newPostTitle.trim()) return;
    
    setLoading(true);
    
    try {
      // This is just a demonstration - you would need proper table setup
      await supabase.from('posts').insert({
        title: newPostTitle,
        created_at: new Date().toISOString()
      });
      
      // Clear input and refresh posts
      setNewPostTitle('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    setClientTimestamp(new Date().toISOString());
    fetchPosts();
  }, [fetchPosts]);

  return (
    <Card className="p-6 border-l-4 border-sky-500 dark:border-sky-800">
      <h2 className="text-xl font-bold mb-4">Client-Side Interactive Section</h2>
      <p className="mb-2">This section is rendered and updated client-side.</p>
      <p className="mb-2">Last client update: {clientTimestamp}</p>
      <p className="mb-4">Server provided {initialPostCount} initial posts.</p>
      
      <div className="flex gap-2 mb-6">
        <Input
          type="text"
          placeholder="Enter new post title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleCreatePost}
          disabled={loading || !newPostTitle.trim()}
        >
          Create Post
        </Button>
        <Button 
          onClick={fetchPosts}
          disabled={loading}
          variant="outline"
        >
          Refresh
        </Button>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Latest Posts (Client-Side):</h3>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        ) : posts.length > 0 ? (
          <ul className="list-disc pl-5">
            {posts.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No posts available.</p>
        )}
      </div>
      
      <div className="mt-6 bg-muted rounded border border-border p-4 text-sm">
        <p className="font-medium mb-2 text-foreground">How this hybrid approach works:</p>
        <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
          <li>The parent page loads with server-rendered data (fast initial load, good SEO)</li>
          <li>This client component initializes and fetches fresh data asynchronously</li>
          <li>User can interact with this component without page refreshes</li>
          <li>State is maintained client-side for a seamless experience</li>
        </ol>
      </div>
    </Card>
  );
}