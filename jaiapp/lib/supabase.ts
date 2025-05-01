import { createBrowserClient } from '@supabase/ssr';
import { Database } from './database.types';
import { User } from '@supabase/supabase-js';

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client
export const getSupabaseClient = () => {
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );
};

// Define database types
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

// Auth helpers
export async function getCurrentUser(): Promise<User | null> {
  const supabase = getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }
  
  return getUserProfileById(user.id);
}

export async function getUserProfileById(userId: string): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
}

export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();
  await supabase.auth.signOut();
}

/**
 * Create or update a user profile
 * 
 * Centralized function for user profile management - use this instead of direct
 * database operations to ensure consistent profile creation across the app.
 * Automatically generates full_name and avatar_url if not provided.
 */
export async function createOrUpdateUserProfile(
  userId: string,
  profileData: Partial<UserProfile>
): Promise<UserProfile | null> {
  try {
    const supabase = getSupabaseClient();
    
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id, created_at, username, full_name, avatar_url')
      .eq('id', userId)
      .single();
    
    // Generate or use provided full_name
    const fullName = profileData.full_name || 
                     existingProfile?.full_name || 
                     profileData.username || 
                     existingProfile?.username;
    
    // Generate avatar URL if not provided
    const avatarUrl = profileData.avatar_url || 
                      existingProfile?.avatar_url || 
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || 'User')}&background=random&color=fff&size=256`;
    
    // Prepare data for insert or update
    const profileToSave = {
      id: userId,
      ...profileData,
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
      // Only set created_at if this is a new profile
      ...(existingProfile ? {} : { created_at: new Date().toISOString() })
    };
    
    // Use upsert to either insert or update
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(profileToSave)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating/updating user profile:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Exception in createOrUpdateUserProfile:', err);
    return null;
  }
}

// Data fetching helper
export async function fetchFromTable<T = Record<string, unknown>>(
  tableName: keyof Database['public']['Tables'],
  options?: {
    select?: string;
    eq?: [string, unknown];
    limit?: number;
    order?: [string, { ascending?: boolean }];
  }
): Promise<T[]> {
  const supabase = getSupabaseClient();
  
  let query = supabase
    .from(tableName)
    .select(options?.select || '*');
    
  if (options?.eq) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query = query.eq(options.eq[0], options.eq[1] as any);
  }
  
  if (options?.order) {
    query = query.order(options.order[0], options.order[1]);
  }
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error(`Error fetching from ${tableName}:`, error);
    return [];
  }
  
  return data as T[];
}