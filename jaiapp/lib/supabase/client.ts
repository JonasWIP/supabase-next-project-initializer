import { createBrowserClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';
// Import the middleware client creation function properly
import { createServerClient } from '@supabase/ssr';

// Define types for request, response and cookie objects
interface Cookie {
  name: string;
  value: string;
  [key: string]: unknown;
}

interface RequestWithCookies {
  cookies: {
    getAll: () => Array<Cookie>;
  };
}

interface ResponseWithCookies {
  cookies: {
    set: (options: Cookie & { [key: string]: unknown }) => void;
  };
}

/**
 * Helper class to create Supabase client for browser environments
 * Safe to use in both client and server components
 */
export class SupabaseClientHelper {
  /**
   * Creates a Supabase client for client components
   */
  static createBrowserClient(): SupabaseClient {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  /**
   * Creates a Supabase client for the middleware
   * @param request NextRequest object
   * @param response NextResponse object
   */
  static createMiddlewareClient(
    request: RequestWithCookies, 
    response: ResponseWithCookies
  ): SupabaseClient {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll().map((cookie: Cookie) => ({
              name: cookie.name,
              value: cookie.value,
            }));
          },
          setAll(cookies) {
            cookies.forEach(({ name, value, ...options }) => {
              response.cookies.set({ name, value, ...options });
            });
          },
        },
      }
    );
  }
}