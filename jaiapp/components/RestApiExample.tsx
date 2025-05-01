'use client';

import { useState } from 'react';
import { Database } from '../lib/database.types';
import { uiStyles } from '@/lib/ui-styles';
import { Button } from './ui/button';

// Define type for user profile based on database schema
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export default function RestApiExample() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Function to fetch user profile directly from Supabase REST API
  async function fetchUserProfile(userId: string) {
    setLoading(true);
    setError(null);
    
    try {
      // Get Supabase URL and anon key from env variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseAnonKey) {
        throw new Error('Supabase anon key is not defined');
      }
      
      // Construct the URL correctly
      const url = `${supabaseUrl}/rest/v1/user_profiles?select=*&id=eq.${userId}`;
      
      // Make the request with all required headers
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Prefer': 'return=representation'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      // REST API returns an array, even for single items
      setProfile(Array.isArray(data) && data.length > 0 ? data[0] : null);
      
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className={`p-4 rounded-lg ${uiStyles.border.default} ${uiStyles.bg.secondary}`}>
      <h2 className="text-xl font-bold mb-4">Supabase REST API Example</h2>
      
      <Button 
        onClick={() => fetchUserProfile('04a1652a-977d-47aa-a8d4-c53d107dfd76')}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Fetch User Profile'}
      </Button>
      
      {error && (
        <div className={`mt-4 p-3 rounded bg-red-100 dark:bg-red-900/20 ${uiStyles.text.error} ${uiStyles.border.error}`}>
          Error: {error}
        </div>
      )}
      
      {profile && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">User Profile</h3>
          <pre className={uiStyles.container.code}>
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-6">
        <h3 className="font-semibold">Required Headers</h3>
        <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
          <li><code>apikey</code>: Your Supabase anon key</li>
          <li><code>Authorization</code>: Bearer token with your anon key</li>
          <li><code>Content-Type</code>: application/json</li>
          <li><code>Accept</code>: application/json</li>
          <li><code>Prefer</code>: return=representation</li>
        </ul>
      </div>
    </div>
  );
}