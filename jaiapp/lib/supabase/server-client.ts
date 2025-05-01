import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type SupabaseClient } from '@supabase/supabase-js';

/**
 * Helper class to create Supabase client for server environments
 * IMPORTANT: Only use in server components (not in client components)
 */
export class SupabaseServerHelper {
  /**
   * Creates a Supabase client for server components
   */
  static async createServerClient(): Promise<SupabaseClient> {
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async getAll() {
            const cookieStore = await cookies();
            return cookieStore.getAll().map((cookie) => ({
              name: cookie.name,
              value: cookie.value,
            }));
          },
          async setAll(cookiesToSet) {
            const cookieStore = await cookies();
            cookiesToSet.forEach(({ name, value, ...options }) => {
              cookieStore.set({ name, value, ...options });
            });
          },
        },
      }
    );
  }
}