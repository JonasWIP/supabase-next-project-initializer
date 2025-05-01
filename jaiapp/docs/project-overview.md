# SupaNext Template Project Overview

## Introduction

SupaNext Template is a comprehensive starter template that combines the power of Next.js, Supabase, Tailwind CSS, and shadcn/ui to provide developers with a solid foundation for building modern web applications. This template is designed to accelerate development by providing pre-configured components, styling systems, authentication, and more.

## Core Technologies

### Next.js 14+

Next.js is a React framework that provides server-side rendering, static site generation, API routes, and more. This template uses the latest App Router architecture which provides:

- Built-in layouts and nested routing
- Server and client components
- Streaming capabilities
- Improved data fetching patterns

### Supabase

Supabase is an open-source Firebase alternative that provides:

- PostgreSQL database
- Authentication system
- Storage solutions
- Realtime subscriptions
- Edge Functions

Our template integrates Supabase for authentication and database operations, with separate configurations for server-side and client-side components.

### Tailwind CSS

Tailwind CSS is a utility-first CSS framework that allows for rapid UI development. The template includes:

- Custom theme configuration
- Dark mode support
- Responsive design utilities
- Integration with shadcn/ui components

### shadcn/ui Components

The template uses shadcn/ui, a collection of reusable components built with Radix UI and Tailwind CSS. These components are:

- Fully customizable (source code is directly in your project)
- Accessible
- Beautifully designed
- Themeable

## Key Features

### Authentication

Ready-to-use authentication flow with:

- Registration page
- Login page
- Protected routes
- User profile management
- Authentication context for easy access to user state

### Multi-theme Support

Beyond just dark/light mode, the template includes:

- Multiple color themes
- Custom typography options per theme
- Easy theme switching with persisted preferences
- Theme showcase page to preview all themes

### Component Library

A collection of pre-built components including:

- Navigation elements (Navbar, Footer)
- Form components (inputs, buttons, form handling)
- Layout components (containers, grids, etc.)
- UI elements (cards, alerts, modals, etc.)

### Example Pages

The template includes example implementations for:

- Dashboard with user profile
- Login and registration flows
- Server-side rendering examples
- Client-side rendering examples
- API calls with Supabase
- Animation examples
- UI component showcase

## Architecture

### Directory Structure

```
supanexttemplate/
├─ app/                 # Next.js App Router pages and layouts
├─ components/          # Reusable React components
├─ contexts/            # React context providers
├─ hooks/               # Custom React hooks
├─ lib/                 # Utility functions and configurations
├─ public/              # Static assets
├─ supabase/            # Supabase configuration and migrations
└─ docs/                # Documentation
```

### File Naming Conventions

- React components: PascalCase (e.g., `UserProfile.tsx`)
- Utility functions: camelCase (e.g., `utils.ts`)
- Page components: `page.tsx` (Next.js App Router convention)
- Layout components: `layout.tsx` (Next.js App Router convention)
- Test files: `ComponentName.test.tsx`

## Getting Started

To get started with the SupaNext Template, see the [Quick Start Guide](./quick-start.md) for detailed setup instructions.

## Next Steps

After getting familiar with the project structure, explore these resources:

- [Styling Guide](./styling-guide.md) for styling components
- [Authentication Guide](./auth-guide.md) for implementing user authentication
- [Theme System Guide](./theme-system-guide.md) for customizing themes
- [Server vs. Client Rendering Guide](./ssr-guide.md) for understanding rendering strategies

## Examples

The template includes various examples in the `/app/examples/` directory that demonstrate key features and patterns. These examples serve as both documentation and reference implementations for common use cases.