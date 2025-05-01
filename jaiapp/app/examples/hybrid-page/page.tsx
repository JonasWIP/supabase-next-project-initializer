import { SupabaseServerHelper } from '@/lib/supabase/server-client';
import { Card } from '@/components/ui/card';

// Fix imports for PageHeader and PageContainer
import PageHeader from '@/components/layout/PageHeader';
import PageContainer from '@/components/layout/PageContainer';
import ClientInteractiveSection from './ClientInteractiveSection';

// Define type for post objects
interface Post {
  id: number;
  title: string;
  [key: string]: unknown;
}

// This is a Server Component
export default async function HybridPage() {
  // Use our server helper class to create a server client
  const supabase = await SupabaseServerHelper.createServerClient();

  // Server-side data fetch for initial render
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get some example data from a table - properly handle potential errors
  let posts: Post[] = [];
  try {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .limit(3);
      
    posts = data || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Posts will remain an empty array
  }

  const serverTimestamp = new Date().toISOString();
  
  return (
    <PageContainer>
      <PageHeader title="Hybrid Rendering Example" />
      
      <div className="space-y-6">
        <Card className="p-6 border-l-4 border-purple-500">
          <h2 className="text-xl font-bold mb-4">Hybrid Approach</h2>
          <p>
            This page demonstrates a hybrid approach combining server-side and client-side rendering.
            The initial page load uses server components for SEO and fast initial loading,
            while interactive elements use client components for dynamic updates without page refreshes.
          </p>
        </Card>
        
        <Card className="p-6 border-l-4 border-green-500">
          <h2 className="text-xl font-bold mb-4">Server-Side Rendered Section</h2>
          <p className="mb-2">This section was rendered on the server.</p>
          <p className="mb-2">Generated at: {serverTimestamp}</p>
          <p className="mb-2">User: {user ? user.email : 'Not logged in'}</p>
          
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Initial Posts:</h3>
            {(posts && posts.length > 0) ? (
              <ul className="list-disc pl-5">
                {posts.map((post: Post) => (
                  <li key={post.id}>{post.title}</li>
                ))}
              </ul>
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        </Card>
        
        {/* Client component for interactive features */}
        <ClientInteractiveSection initialPostCount={(posts?.length || 0)} />
      </div>
    </PageContainer>
  );
}