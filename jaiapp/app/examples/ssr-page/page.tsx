import { SupabaseServerHelper } from '@/lib/supabase/server-client';
import { Card } from '@/components/ui/card';

// Fix imports for PageHeader and PageContainer
import PageHeader from '@/components/layout/PageHeader';
import PageContainer from '@/components/layout/PageContainer';

// Define type for post objects
interface Post {
  id: number;
  title: string;
  [key: string]: unknown;
}

export const dynamic = 'force-dynamic'; // Ensures SSR on every request

async function getServerData() {
  // Use our server helper class to create a server client
  const supabase = await SupabaseServerHelper.createServerClient();

  // Get the current user if authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get some example data from a table - properly handle potential errors
  let posts: Post[] = [];
  try {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .limit(5);
      
    posts = data || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Posts will remain an empty array
  }
  
  return {
    user,
    posts,
    timestamp: new Date().toISOString(),
  };
}

export default async function SSRPage() {
  const data = await getServerData();
  
  return (
    <PageContainer>
      <PageHeader title="Server-Side Rendering Example" />
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">SSR Data Example</h2>
          <p className="mb-2">This page is rendered on the server using SSR.</p>
          <p className="mb-2">Generated at: {data.timestamp}</p>
          <p className="mb-2">User: {data.user ? data.user.email : 'Not logged in'}</p>
        </Card>
          
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Data from Supabase</h2>
          {data.posts.length > 0 ? (
            <ul className="list-disc pl-5">
              {data.posts.map((post: Post) => (
                <li key={post.id}>{post.title}</li>
              ))}
            </ul>
          ) : (
            <p>No posts found or table doesn&apos;t exist.</p>
          )}
          <div className="mt-4 p-4 bg-muted rounded border border-border">
            <p className="text-sm font-mono text-foreground">This data was fetched server-side.</p>
            <p className="text-sm font-mono text-foreground">The API request is not visible to the client.</p>
          </div>
        </Card>
        
        <Card className="p-6 bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 dark:border-emerald-800">
          <h2 className="text-xl font-bold mb-4">Benefits of SSR in this example:</h2>
          <ul className="list-disc pl-5 text-muted-foreground">
            <li>Data is fetched on the server before the page is sent to the browser</li>
            <li>API keys and queries are not exposed to the client</li>
            <li>Content is ready immediately (no loading states needed)</li>
            <li>Search engines see the full content for better SEO</li>
            <li>Works even if JavaScript is disabled in the browser</li>
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}