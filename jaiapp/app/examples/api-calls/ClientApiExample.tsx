'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import { api } from '@/lib/api';

// Type definition for API response
interface ExternalApiItem {
  id: string | number;
  title: string;
  body?: string;
  completed?: boolean;
  [key: string]: unknown;
}

export default function ClientApiExample({ serverDataCount }: { serverDataCount: number }) {
  const [data, setData] = useState<ExternalApiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState('/todos');
  const [clientTimestamp, setClientTimestamp] = useState('');
  
  // Function to fetch data from the API using our api utility
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setClientTimestamp(new Date().toISOString());
    
    try {
      // Using our API utility for better error handling and retry logic
      const result = await api.jsonPlaceholder.get<ExternalApiItem[]>(apiUrl, {
        // Optional: Set timeout for slow APIs
        timeout: 5000,
        // Optional: Add retry logic for unstable connections
        retry: { attempts: 2, delayMs: 500 }
      });
      
      // Only display first few items
      setData(result.slice(0, 5));
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);
  
  // Fetch data on initial render
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Handle API endpoint change
  const handleApiEndpointChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setApiUrl(e.target.value);
  };
  
  return (
    <Card className="p-6 border-l-4 border-blue-500 dark:border-blue-800">
      <h2 className="text-xl font-bold mb-4">Client-Side API Call</h2>
      <p className="mb-4 text-muted-foreground">
        This section demonstrates fetching data from an external API directly in the browser.
        The API request will appear in the browser&apos;s network tab.
      </p>
      
      <div className="mb-6">
        <div className="text-sm text-muted-foreground">Server provided {serverDataCount} items initially</div>
        <div className="text-sm text-muted-foreground">Last client update: {clientTimestamp}</div>
        
        <div className="mt-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="api-endpoint" className="block text-sm font-medium text-foreground mb-1">
              API Endpoint
            </label>
            <select 
              id="api-endpoint"
              className="w-full p-2 border border-input rounded-md bg-background text-foreground"
              value={apiUrl}
              onChange={handleApiEndpointChange}
            >
              <option value="/todos">JSON Placeholder - Todos</option>
              <option value="/posts">JSON Placeholder - Posts</option>
              <option value="/photos">JSON Placeholder - Photos</option>
            </select>
          </div>
          <div className="md:self-end">
            <Button 
              onClick={fetchData}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </Button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded">
          Error: {error}
        </div>
      )}
      
      <div className="mt-4">
        <h3 className="font-semibold mb-2">API Response:</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : data.length > 0 ? (
          <div className="bg-muted border border-border rounded p-4">
            <ul className="space-y-2">
              {data.map((item) => (
                <li key={item.id} className="border-b pb-2 border-border">
                  <div className="font-medium">{item.title}</div>
                  {item.body && <div className="text-sm truncate text-muted-foreground">{item.body}</div>}
                  {item.completed !== undefined && (
                    <div className="text-sm">
                      Status: <span className={item.completed ? "text-green-600 dark:text-green-500" : "text-amber-600 dark:text-amber-500"}>
                        {item.completed ? "Completed" : "Pending"}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-amber-600 dark:text-amber-500">No data received from API</div>
        )}
      </div>
      
      <div className="mt-6 bg-muted border border-border p-4 rounded text-sm">
        <h4 className="font-medium mb-1 text-foreground">Benefits of client-side API calls:</h4>
        <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
          <li>Interactive experience with dynamic data refreshing</li>
          <li>Reduces server load (computation happens in user&apos;s browser)</li>
          <li>Can be based on user interaction and state</li>
          <li>Allows for real-time updates without page reload</li>
          <li>Can use browser-specific features like geolocation</li>
        </ul>
      </div>
    </Card>
  );
}