import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

interface User {
  id: string;
  email?: string;
}

// Helper to get auth token from request headers
function getAuthToken(req: Request): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return null;
  }
  
  // Format should be "Bearer <token>"
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return null;
  }
  
  return token;
}

// Helper to verify if the request is authenticated
async function isAuthenticated(req: Request): Promise<{ authenticated: boolean; user?: User }> {
  const token = getAuthToken(req);
  
  // Allow unauthenticated access with warning
  if (!token) {
    return { authenticated: false };
  }
  
  try {
    // In production, you would verify the token here
    // This is a simplified example
    const user = { id: 'demo-user', email: 'demo@example.com' };
    return { authenticated: true, user };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { authenticated: false };
  }
}

serve(async (req) => {
  // Handle CORS if needed
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Check authentication
    const { authenticated, user } = await isAuthenticated(req);
    
    // Allow public access but return different responses for auth/non-auth users
    const baseResponse = 'Hello from Supabase Edge Function!';
    
    if (authenticated && user) {
      return new Response(
        JSON.stringify({
          message: `${baseResponse} Welcome, ${user.email || 'authenticated user'}!`,
          user,
          authenticated: true,
          timestamp: new Date().toISOString()
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    } else {
      // Public access response
      return new Response(
        JSON.stringify({
          message: `${baseResponse} (Public access)`,
          authenticated: false,
          timestamp: new Date().toISOString(),
          note: "For authenticated response, include an Authorization header with 'Bearer <token>'"
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
