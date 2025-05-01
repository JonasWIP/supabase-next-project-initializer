# Quick Start Guide

This guide will help you get started with the SupaNext Template quickly.

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- [Git](https://git-scm.com/)
- A [Supabase](https://supabase.com/) account (free tier is fine for development)

## Setup Steps

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/supanexttemplate.git
cd supanexttemplate
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project on [Supabase](https://app.supabase.com/)
2. Once your project is created, go to Project Settings > API
3. Copy the "URL" and "anon public" key

### 4. Configure Environment Variables

1. Create a `.env.local` file in the root of your project
2. Add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Initialize the Database

The template includes database schema migrations and seed data in the `/supabase` folder.

1. Install the Supabase CLI (if you haven't already):
   ```bash
   npm install -g supabase
   ```

2. Link to your Supabase project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Apply the migrations:
   ```bash
   supabase db push
   ```

### 6. Run the Development Server

```bash
npm run dev
```

Your application should now be running at [http://localhost:3000](http://localhost:3000)

## What's Next?

Now that you have the template running, here are some things you can explore:

### Project Structure Tour

- `/app` contains all the pages and layouts using Next.js App Router
- `/components` contains reusable React components
- `/lib` contains utility functions and configurations

### Explore Example Pages

- Visit `/examples` to see demonstrations of different features
- Check out `/dashboard` to see a protected route with user profile

### Authentication

- Try registering a new user at `/register`
- Login with your credentials at `/login`
- See how protected routes work by visiting `/dashboard`

### Customize the Theme

1. Open `/lib/themes.ts` to see the available themes
2. Visit `/examples/themes` to preview and switch between themes
3. Explore creating your own theme by adding a new theme definition

## Customization

### Project Branding

1. Update the site title and metadata in `app/layout.tsx`
2. Replace the logo in `components/Navbar.tsx`
3. Customize the primary colors in `lib/themes.ts`

### Navigation

Modify the navigation links in `components/Navbar.tsx` to match your project's structure.

### Styling

The project uses Tailwind CSS for styling. You can customize the theme in `tailwind.config.js`.

## Troubleshooting

### Authentication Issues

If you're having problems with authentication:

1. Check that your Supabase URL and anon key are correct in `.env.local`
2. Make sure the Supabase project has Auth enabled in the dashboard
3. Check if email confirmations are required (can be disabled in Supabase dashboard)

### Database Errors

If you encounter database errors:

1. Check that your database schema matches what the application expects
2. Run `supabase db reset` to reset your database to match the migrations
3. Check the Supabase dashboard for any policy restrictions

### Styling Problems

If styles aren't working as expected:

1. Make sure you've installed all dependencies with `npm install`
2. Check that Tailwind is properly configured
3. Verify that your theme is correctly set up in `lib/themes.ts`

## Getting Help

If you're stuck, try these resources:

- Check the [documentation](./README.md) for more detailed guides
- Look at the example implementations in the `/app/examples` directory
- Consult the official docs for [Next.js](https://nextjs.org/docs), [Supabase](https://supabase.com/docs), and [Tailwind CSS](https://tailwindcss.com/docs)
- Join the [Supabase Discord](https://discord.supabase.com) or [Next.js Discord](https://discord.gg/nextjs) for community help