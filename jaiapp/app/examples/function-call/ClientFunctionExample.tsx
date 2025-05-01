'use client';

import React, { useState, useEffect } from 'react';
import { SupabaseClientHelper } from '@/lib/supabase/client';
import { callSupabaseFunction } from '@/lib/supabase/functions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/ui/codeblock';
import { uiStyles } from '@/lib/ui-styles';

type FunctionResponse = {
  message: string;
  authenticated: boolean;
  timestamp: string;
  user?: { id: string; email: string };
  note?: string;
};

export default function ClientFunctionExample() {
  const [result, setResult] = useState<FunctionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useAuth, setUseAuth] = useState(true); // Default to using authentication
  
  // Check if user is signed in
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  
  // Check authentication status on component mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = SupabaseClientHelper.createBrowserClient();
        const { data } = await supabase.auth.getSession();
        setIsSignedIn(!!data.session);
      } catch (err) {
        console.error("Error checking auth status:", err);
        setIsSignedIn(false);
      }
    }
    
    checkAuth();
  }, []);
  
  async function handleCallFunction() {
    setLoading(true);
    setError(null);
    
    try {
      // Call the hello-world edge function with or without auth
      const response = await callSupabaseFunction<FunctionResponse>('hello-world', {
        useAuth: useAuth,
      });
      
      setResult(response);
    } catch (err) {
      console.error('Error calling Edge Function:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <Card className="p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Client-Side Edge Function Call</h2>
      <p className="text-sm text-muted-foreground mb-4">
        This example demonstrates calling a Supabase Edge Function from a client component.
      </p>
      
      <div className="mb-4 flex items-center space-x-2">
        <label className="flex items-center cursor-pointer">
          <div className="relative inline-flex items-center">
            <input
              type="checkbox"
              checked={useAuth}
              onChange={() => setUseAuth(!useAuth)}
              className="sr-only" // Hide the actual checkbox but keep it accessible
            />
            <div className={`w-4 h-4 rounded border ${useAuth 
              ? 'bg-primary border-primary' 
              : 'bg-background border-input dark:bg-muted'}`}>
              {useAuth && (
                <svg 
                  className="w-4 h-4 text-primary-foreground" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M5 12l5 5L20 7" 
                  />
                </svg>
              )}
            </div>
          </div>
          <span className="ml-2 text-sm text-foreground">
            Include authentication token
          </span>
        </label>
        
        {isSignedIn === false && useAuth && (
          <div className={uiStyles.text.warning}>
            ⚠️ You are not signed in. Auth call will fail.
          </div>
        )}
      </div>
      
      <Button 
        onClick={handleCallFunction} 
        disabled={loading}
      >
        {loading ? 'Calling Function...' : 'Call hello-world Function'}
      </Button>
      
      {(result || error) && (
        <div className={`mt-4 p-4 rounded-md ${uiStyles.border.default} ${uiStyles.bg.secondary}`}>
          <h3 className="font-medium mb-2">Result:</h3>
          {error ? (
            <div className={uiStyles.text.error}>
              <p>Error: {error}</p>
            </div>
          ) : (
            <div>
              <div className={`mb-2 text-sm flex items-center ${result?.authenticated ? uiStyles.text.success : uiStyles.text.warning}`}>
                Status: {result?.authenticated ? (
                  <>
                    Authenticated 
                    <svg 
                      className="w-5 h-5 ml-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2.5} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                  </>
                ) : 'Public Access (Not Authenticated)'}
              </div>
              <CodeBlock>
                {JSON.stringify(result, null, 2)}
              </CodeBlock>
            </div>
          )}
        </div>
      )}

      <div className={`mt-4 p-4 rounded ${uiStyles.border.default} ${uiStyles.bg.secondary}`}>
        <h3 className="font-medium mb-2">About Authentication</h3>
        <p className="text-sm mb-2 text-muted-foreground">
          This example can run in two modes:
        </p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground">
          <li className="mb-1">
            <strong className="text-foreground">Authenticated:</strong> Sends your Supabase session token with the request
          </li>
          <li>
            <strong className="text-foreground">Public:</strong> Calls the function without authentication
          </li>
        </ul>
        <p className="text-sm mt-2 text-muted-foreground">
          Our Edge Function is configured to handle both authenticated and unauthenticated requests
          with different responses.
        </p>
      </div>
    </Card>
  );
}