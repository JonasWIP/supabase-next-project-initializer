// middleware.ts
import { type NextRequest, NextResponse } from "next/server";
import { SupabaseClientHelper } from "@/lib/supabase/client";

export async function middleware(request: NextRequest) {
  // Create an unmodified response
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a Supabase client using our helper class
  const supabase = SupabaseClientHelper.createMiddlewareClient(request, response);

  try {
    // Get the current path from the URL
    const path = request.nextUrl.pathname;
    
    // Check if we're already on the login page or other public routes to prevent redirect loops
    const publicRoutes = ['/', '/login', '/register', '/forgot-password'];
    const apiRoutes = ['/api/auth'];
    
    // Check for exact match on root path or startsWith for other paths
    const isPublicRoute = 
      path === '/' || 
      publicRoutes.some(route => path === route || path.startsWith(`${route}/`)) ||
      apiRoutes.some(route => path.startsWith(route));
      
    if (isPublicRoute) {
      return response;
    }
    
    // Check if user is authenticated
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error(`❌ Authentication error: ${error.message}`);
    }

    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.error(`💥 Middleware error: ${error instanceof Error ? error.message : String(error)}`);
    // On error, just continue without redirecting
  }

  return response;
}

// Add a matcher that defines which routes the middleware should run on
export const config = {
  matcher: [
    // Explicitly protect the dashboard route
    '/dashboard/:path*',
    
    // Match other routes except for:
    // - _next (Next.js internals)
    // - Public files (_static, robots.txt, favicon.ico, etc.)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
  ],
}
