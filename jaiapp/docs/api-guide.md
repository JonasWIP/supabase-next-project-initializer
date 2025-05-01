# API Integration Guide

This guide explains how to work with API routes and data fetching in the SupaNext Template using Supabase and Next.js.

## Overview

The template provides several methods for working with data:

1. **Direct Supabase Client** - For accessing Supabase data directly from components
2. **API Routes** - For creating custom API endpoints with Next.js
3. **Server Actions** - For handling form submissions and mutations

## Supabase Data Access

### Supabase Client Setup

The template includes preconfigured Supabase clients for both server and client components:

```tsx
// Server component usage
// lib/supabase.ts
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase';

export async function fetchData() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  
  const { data, error } = await supabase
    .from('your_table')
    .select('*');
    
  return data;
}

// Client component usage
// Use the AuthContext for authenticated requests
'use client';
import { useAuth } from '@/contexts/AuthContext';

function YourComponent() {
  const { supabase } = useAuth();
  
  async function handleAction() {
    const { data, error } = await supabase
      .from('your_table')
      .insert([{ name: 'New Item' }]);
  }
}
```

### Example Patterns

#### Fetching Data in Server Components

```tsx
// app/examples/ssr-page/page.tsx
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

export default async function ServerRenderedPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  
  // This query runs on the server
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false });
  
  return (
    <div>
      <h1>Items</h1>
      <ul>
        {items?.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

#### Fetching Data in Client Components

```tsx
'use client';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function ClientSideFetching() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*');
        
      setData(data);
      setLoading(false);
    }
    
    fetchData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>Items</h1>
      <ul>
        {data?.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## API Routes with Route Handlers

Next.js App Router allows you to create API routes using Route Handlers.

### Creating an API Route

```typescript
// app/api/items/route.ts
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  
  const { data, error } = await supabase
    .from('items')
    .select('*');
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  
  // Get request body
  const body = await request.json();
  
  const { data, error } = await supabase
    .from('items')
    .insert([body])
    .select();
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  
  return NextResponse.json(data, { status: 201 });
}
```

### Consuming API Routes

```tsx
'use client';
import { useState } from 'react';

export default function ApiConsumer() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  async function fetchItems() {
    setLoading(true);
    const response = await fetch('/api/items');
    const data = await response.json();
    setItems(data);
    setLoading(false);
  }
  
  async function createItem(newItem) {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem),
    });
    
    const data = await response.json();
    
    // Update local state
    setItems(prevItems => [...prevItems, data[0]]);
  }
  
  return (
    <div>
      <button onClick={fetchItems} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Items'}
      </button>
      
      <button onClick={() => createItem({ name: 'New Item' })}>
        Create Item
      </button>
      
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Server Actions (Form Submissions)

Next.js Server Actions allow you to handle form submissions directly from server components.

### Creating a Server Action

```tsx
// app/actions/create-item.ts
'use server';

import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function createItem(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  
  const name = formData.get('name') as string;
  
  const { data, error } = await supabase
    .from('items')
    .insert([{ name }])
    .select();
    
  // Revalidate the cache for the items page
  revalidatePath('/items');
  
  return { data, error };
}
```

### Using a Server Action in a Form

```tsx
// app/items/new/page.tsx
import { createItem } from '@/app/actions/create-item';

export default function NewItemPage() {
  return (
    <form action={createItem}>
      <label htmlFor="name">Item Name</label>
      <input id="name" name="name" required />
      <button type="submit">Create Item</button>
    </form>
  );
}
```

## Real-time Subscriptions

Supabase supports real-time updates. Here's how to implement them:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function RealtimeItems() {
  const [items, setItems] = useState([]);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  useEffect(() => {
    // Initial fetch
    const fetchItems = async () => {
      const { data } = await supabase.from('items').select('*');
      setItems(data || []);
    };
    
    fetchItems();
    
    // Subscribe to changes
    const subscription = supabase
      .channel('items')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'items' 
      }, (payload) => {
        console.log('Change received!', payload);
        
        if (payload.eventType === 'INSERT') {
          setItems(current => [...current, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          setItems(current => 
            current.map(item => item.id === payload.new.id ? payload.new : item)
          );
        } else if (payload.eventType === 'DELETE') {
          setItems(current => 
            current.filter(item => item.id !== payload.old.id)
          );
        }
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return (
    <div>
      <h1>Realtime Items</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Data Fetching Patterns

### SWR Pattern

For optimistic UI updates, the template uses the SWR (Stale-While-Revalidate) pattern:

```tsx
'use client';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function SWRExample() {
  const { data, error, isLoading, mutate } = useSWR('/api/items', fetcher);
  
  async function createItem(newItem) {
    // Optimistically update the UI
    const updatedItems = [...(data || []), { id: 'temp-id', ...newItem }];
    mutate(updatedItems, false);
    
    // Send the actual request
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    
    // Trigger a revalidation to get the actual data
    mutate();
  }
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  
  return (
    <div>
      <button onClick={() => createItem({ name: 'New Item' })}>
        Create Item
      </button>
      <ul>
        {data?.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Type Safety with Supabase

The template includes TypeScript types for your Supabase database schema.

### Database Types

The `lib/database.types.ts` file contains automatically generated types from your Supabase schema:

```typescript
export type Database = {
  public: {
    Tables: {
      items: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          // other columns
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          // other columns
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
          // other columns
        };
      };
      // other tables
    };
    // views, functions, etc.
  };
};
```

### Using Types with Supabase Client

```typescript
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/lib/database.types';

// Typed Supabase client
const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Now you get full type safety
const { data, error } = await supabase
  .from('items')
  .select('id, name, created_at');
  
// data has the correct type with all selected fields
```

## Best Practices

1. **Use Server Components** for initial data loading whenever possible
2. **Create API Routes** for operations that need to be accessible from client components
3. **Use Server Actions** for form submissions
4. **Implement Optimistic Updates** for responsive UIs
5. **Add Type Safety** to all Supabase operations
6. **Handle Loading States** to improve user experience
7. **Implement Error Handling** for all data operations

## Common Patterns

### Data Fetching with Loading UI

```tsx
'use client';
import { useState } from 'react';

export function DataFetchingExample() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  async function fetchData() {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/data');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div>
      <button onClick={fetchData} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>
      
      {error && <div className="error">{error}</div>}
      
      {data && (
        <div className="data">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

### CRUD Operations Pattern

The `RestApiExample` component in the template demonstrates a complete CRUD (Create, Read, Update, Delete) implementation.

See `components/RestApiExample.tsx` for a practical example that you can reuse in your application.