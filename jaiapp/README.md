# SupaNext Template

A modern, production-ready template for building web applications with Next.js and Supabase, featuring TypeScript and Tailwind CSS.

## Overview

SupaNext Template provides a solid foundation for developing web applications with:

- **Next.js 14+** with App Router for server components, streaming, and more
- **Supabase** for authentication, database, and edge functions
- **TypeScript** for type safety and improved developer experience
- **Tailwind CSS** with a customizable multi-theme system
- **shadcn/ui** components for beautiful, accessible UI elements
- **Testing** framework with Jest and React Testing Library

## Documentation

Comprehensive documentation is available in the `/docs` directory:

- [Documentation Home](./docs/README.md) - Overview of all documentation
- [Project Overview](./docs/project-overview.md) - Introduction to the project structure and technologies
- [Quick Start Guide](./docs/quick-start.md) - Set up your development environment

### Core Technologies

- [Styling Guide](./docs/styling-guide.md) - How to use Tailwind CSS and the styling system
- [Theme System Guide](./docs/theme-system-guide.md) - Customize the multi-theme capabilities
- [shadcn/ui Guide](./docs/shadcn-ui-guide.md) - Use and customize UI components
- [Server vs. Client Rendering](./docs/ssr-guide.md) - Understanding Next.js rendering strategies

### Development Guides

- [Authentication Guide](./docs/auth-guide.md) - Working with Supabase authentication
- [API Integration](./docs/api-guide.md) - Using Supabase data and Next.js API routes
- [Testing Guide](./docs/testing-guide.md) - Writing and running tests

## Quick Start

### Creating Your Project

```bash
# Using npx create-supabase-next
npx create-supabase-next <project-name>

# Or with custom template
npx create-supabase-next --template <template-url>

# Navigate to project directory
cd <project-name>

# Install dependencies
npm install
```

### Running Local Development Environment

1. **Start Supabase** (ensure Docker is running):
   ```bash
   npm run supabase:start
   # Or directly: npx supabase start
   ```

2. **Configure Environment Variables**:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key-from-supabase-start>
   ```

3. **Start Next.js Development Server**:
   ```bash
   npm run dev
   ```

4. **Access Local Development**:
   - Next.js: http://localhost:3000
   - Supabase Studio: http://127.0.0.1:54323

## Database Migrations

```bash
# Create a new migration
npx supabase migration new migration_name

# Edit the migration file in supabase/migrations/<timestamp>_migration_name.sql

# Apply migrations
npx supabase db reset  # For development (destructive)
# Or
npx supabase db push   # For production
```

## Deployment

### Setup

1. Push your repository to GitHub
2. Configure GitHub repository secrets under Settings → Secrets and Variables → Actions:

   ```
   VERCEL_TOKEN = Your Vercel access token with organization access
   NEXT_PUBLIC_SUPABASE_URL = https://<project-id>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = Your Supabase anon key
   SUPABASE_ACCESS_TOKEN = Your Supabase personal access token
   SUPABASE_DB_PASSWORD = Your Supabase database password
   YOUR_PROJECT_REF = Your Supabase project ID
   ```

3. Push changes to main branch to trigger deployment

### Supabase Edge Functions

This template includes support for [Supabase Edge Functions](https://supabase.com/docs/guides/functions).

```bash
# Serve all functions locally
npm run supabase:functions:serve

# Serve a specific function
npm run supabase:functions:serve:hello-world

# Create a new function
npm run supabase:functions:new my-function-name

# Deploy all functions
npm run supabase:functions:deploy

# Deploy a specific function
npm run supabase:functions:deploy:hello-world
```

Edge Functions can be called from server or client components - see examples in:
- Server: `/app/examples/function-call/page.tsx`
- Client: `/app/examples/function-call/ClientFunctionExample.tsx`

## Troubleshooting

### Supabase CLI Issues
```bash
# Update Supabase CLI to latest version
npm install -g supabase@latest
```

### GitHub Workflow Deployment Issues
- Verify all secrets are correctly set in GitHub repository
- Ensure your database password doesn't contain special characters
- Confirm your project reference matches exactly with your Supabase project ID
- Test linking process locally: `npx supabase link --project-ref YOUR_PROJECT_REF`

### Authentication Setup
1. Open Supabase Dashboard → your project
2. Go to Settings → Auth → URL Configuration
3. Update "Site URL" with your production domain

## Current TODOs

- Test the npx creation tool
- Final Testing 

## Future Improvements
- https://magicui.design/docs/components/marquee magicui ?
- Tests for Utisl and functions / auth / unauthenticated
- Add more examples for Edge Functions
- Metadata for SEO
- SEO
- Analytics
- Mobile Support (Capacitor?)
- Include knowledge gaps for ai models 
- Revampl the documentation to explain/summarize the project for ai models
- Add roomodes, project specific instructions, fill gaps of knowledge for ai models (context7,claude-task-master,https://github.com/modelcontextprotocol/servers/tree/main/src/memory)
- Add mcp tools for the used ai agent models
- Project summary
- Module hinzufügbar wie Zahlungsdienstleister, Three.js, Advertisment
- Automating More of the setup process
- Full integration into a Custom Managment System  with frontend and development tools or mcp usage
- Libraries to look at : https://uiverse.io/, https://ludo.ai/, https://spacetimedb.com/, https://magicui.design/docs/components/marquee, https://github.com/Tencent/Hunyuan3D-2 (or simmilar game asset mcps)
## License

MIT
