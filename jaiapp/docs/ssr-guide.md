# Server-Side Rendering (SSR) vs. Client-Side Rendering Guide

This guide explains how to use Server-Side Rendering (SSR) and Client-Side Rendering approaches with Next.js and Supabase.

## What is SSR?

Server-Side Rendering (SSR) means the page is fully rendered on the server before being sent to the client. Benefits include:

- Better SEO (search engines see the full content)
- Faster initial page load
- Works without JavaScript
- Better for content-heavy sites

## What is Client-Side Rendering?

Client-Side Rendering means the browser loads a minimal HTML page and JavaScript, then JavaScript renders the page in the browser. Benefits include:

- More interactive experiences
- Less server load
- Faster page transitions after initial load
- Better for highly interactive applications

## Supabase Authentication in Server Components

When using Supabase authentication in server components, use the `createServerClient` approach:

```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function ServerComponent() {
  const cookieStore = cookies();
  
  const supabase = createServerClient(
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
            // Handle cookie setting
          });
        },
      },
    }
  );

  // Now you can use supabase to fetch data
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .single();

  return <div>{profile?.full_name}</div>;
}
```

## Supabase in Client Components

For client components, use the `createBrowserClient` approach:

```typescript
'use client';
import { createBrowserClient } from '@supabase/ssr';
import { useState, useEffect } from 'react';

function ClientComponent() {
  const [profile, setProfile] = useState(null);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .single();
        
      setProfile(data);
    }
    
    fetchProfile();
  }, []);

  return <div>{profile?.full_name}</div>;
}
```

## When to Use Each Approach

Use **Server Components (SSR)** when:
- You need SEO
- The page doesn't require much user interaction
- You want the fastest initial load
- You're dealing with sensitive queries that shouldn't be visible in the client

Use **Client Components** when:
- You need highly interactive features
- The component relies heavily on browser APIs
- You need to respond to frequent user events
- You want to reduce server load

## Example Workflow

See the example files in:
- `/app/examples/ssr-page/page.tsx` (Server-side example)
- `/app/examples/client-page/page.tsx` (Client-side example)