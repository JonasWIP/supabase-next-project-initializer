# Authentication Guide

This guide explains how to use and customize the authentication system in the SupaNext Template, which is powered by Supabase Auth.

## Overview

The template includes a complete authentication system with:

- User registration
- Login/logout functionality
- Protected routes
- User profile management
- Authentication state management with React Context

## Authentication Architecture

### Auth Context

The authentication state is managed through a React Context located at `contexts/AuthContext.tsx`. This context:

- Provides the current user state throughout your application
- Handles login, logout, and registration functionality
- Tracks authentication status (loading, authenticated, error)
- Persists sessions across page reloads

### Supabase Auth Integration

The template uses Supabase Authentication with:

- Email/password authentication (default)
- Session persistence using cookies
- Separate configurations for server and client components

## Using Authentication

### Protected Routes

To protect a route so that only authenticated users can access it:

1. Use the `AuthProvider` context to access the authentication state
2. Implement redirect logic based on authentication status

Example of protecting a route (server-side):

```tsx
// In app/dashboard/page.tsx or similar protected route
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

export default async function ProtectedPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Redirect unauthenticated users to the login page
    redirect('/login');
  }

  // Only authenticated users will see this content
  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {session.user.email}</p>
    </div>
  );
}
```

### Accessing the Current User

In client components:

```tsx
'use client';
import { useAuth } from '@/contexts/AuthContext';

export function ProfileButton() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  if (!user) return <button>Sign In</button>;
  
  return <div>Welcome, {user.email}</div>;
}
```

In server components:

```tsx
import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';

export default async function UserProfile() {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
  
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;
  
  if (!user) {
    return <div>Not logged in</div>;
  }
  
  // Fetch user profile data from database
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return (
    <div>
      <h1>User Profile</h1>
      <p>Email: {user.email}</p>
      <p>Name: {profile.full_name}</p>
    </div>
  );
}
```

## Auth Components

The template includes several ready-to-use authentication components:

### Login Form

The `LoginForm` component (`components/forms/LoginForm.tsx`) provides a complete login form with:

- Email and password inputs
- Form validation
- Error messaging
- Submission handling

### Registration Form

The `RegisterForm` component (`components/forms/RegisterForm.tsx`) includes:

- Email and password inputs
- Password confirmation
- Form validation
- User creation logic

### Authenticated Navigation

The `NavbarWithAuth` component (`components/NavbarWithAuth.tsx`) is a navigation bar that dynamically changes based on authentication status.

## Customizing Authentication

### Adding Social Providers

To add social login providers (Google, GitHub, etc.):

1. Configure the provider in your Supabase dashboard (Auth > Providers)
2. Update the login component to include the social login buttons:

```tsx
// In LoginForm.tsx
import { supabase } from '@/lib/supabase';

// Add this function
const handleGoogleSignIn = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
};

// Then add a button in your form
<button type="button" onClick={handleGoogleSignIn}>
  Sign in with Google
</button>
```

### Custom User Metadata

To store additional user information:

1. Use the profiles table in your Supabase database
2. Update your registration form to store this data after user creation:

```tsx
// After creating the user
const { data: { user } } = await supabase.auth.signUp({
  email,
  password,
});

if (user) {
  // Insert into profiles table
  await supabase.from('profiles').insert({
    id: user.id,
    full_name: name,
    avatar_url: avatarUrl,
    // any other fields
  });
}
```

### Password Reset

To implement password reset:

1. Add a "Forgot Password" link to your login form
2. Create a password reset page that calls:

```tsx
await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/reset-password`,
});
```

3. Create a page to handle the reset token and allow setting a new password

## Security Considerations

- The template uses HttpOnly cookies for session storage to prevent XSS attacks
- API routes are protected using middleware that validates authentication
- Forms implement CSRF protection
- Passwords are handled securely by Supabase (never stored in plain text)

## Common Issues

### Session Not Persisting

If sessions aren't being persisted:

1. Check that cookies are being properly set
2. Ensure your app is using the `supabase-ssr` package correctly
3. Verify that the Supabase client is consistently initialized

### Email Verification

By default, Supabase requires email verification. You can:

1. Keep this behavior (more secure)
2. Disable it in the Supabase dashboard for development
3. Implement a custom verification flow using the template's components

## Extending the Auth System

Ideas for extending the authentication system:

1. Add multi-factor authentication
2. Implement role-based access control
3. Create a user management dashboard
4. Add account linking (connect multiple auth providers)

## Testing Auth

The template includes tests for authentication in the `__tests__` directory, demonstrating:

- Mocking authentication state for component tests
- Testing protected routes
- Simulating login/logout actions