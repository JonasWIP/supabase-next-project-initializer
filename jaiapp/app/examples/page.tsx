import Link from 'next/link';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Examples Overview | SupaNext Template',
  description: 'Explore example implementations of different rendering strategies and Supabase features',
};

interface ExampleLink {
  title: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
}

export default function ExamplesOverviewPage() {
  const examples: ExampleLink[] = [
    {
      title: 'Server-Side Rendering (SSR)',
      description: 'Example of a page using SSR to fetch data from Supabase on the server.',
      href: '/examples/ssr-page',
      icon: '🖥️',
    },
    {
      title: 'Client-Side Rendering',
      description: 'Example of a page fetching data from Supabase in the browser.',
      href: '/examples/client-page',
      icon: '🌐',
    },
    {
      title: 'Hybrid Rendering',
      description: 'Combines server and client rendering for optimal user experience.',
      href: '/examples/hybrid-page',
      icon: '⚡',
      badge: 'Recommended',
    },
    {
      title: 'Edge Functions',
      description: 'Examples of calling Supabase Edge Functions from both server and client components.',
      href: '/examples/function-call',
      icon: '☁️',
    },
    {
      title: 'Theme Showcase',
      description: 'Explore and test the different themes available in the application.',
      href: '/examples/themes',
      icon: '🎨',
      badge: 'New',
    },
    {
      title: 'Animations with Framer Motion',
      description: 'Interactive UI animations using Framer Motion with various examples.',
      href: '/examples/animations',
      icon: '✨',
    },
    {
      title: 'UI Components',
      description: 'Explore and interact with the various UI components available in the project.',
      href: '/examples/ui-components',
      icon: '🧩',
      badge: 'New',
    },
  ];

  return (
    <PageContainer maxWidth="xl">
      <PageHeader 
        title="Examples & Demos"
        description="Explore these examples to learn how to use different features of the SupaNext template. Each example demonstrates a different rendering strategy or Supabase integration."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examples.map((example) => (
          <Link 
            href={example.href} 
            key={example.href}
            className="group no-underline"
          >
            <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary group-focus:ring-2 group-focus:ring-primary">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="text-3xl mr-4">{example.icon}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">{example.title}</h2>
                      {example.badge && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {example.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-2 text-muted-foreground">{example.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="text-primary text-sm font-medium group-hover:underline">
                    View Example →
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-12">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Looking for Documentation?</h2>
          <p className="mb-4 text-muted-foreground">
            Check out our comprehensive guides to understand how these examples work and best practices
            for your Next.js + Supabase application:
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href="/docs/ssr-guide" 
              className={cn(
                "inline-flex items-center px-4 py-2 bg-background border border-input rounded-md text-sm font-medium",
                "text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              )}
            >
              <span className="mr-2">📚</span>
              SSR Guide
            </Link>
            <a 
              href="https://supabase.com/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center px-4 py-2 bg-background border border-input rounded-md text-sm font-medium",
                "text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              )}
            >
              <span className="mr-2">🔗</span>
              Supabase Docs
            </a>
            <a 
              href="https://nextjs.org/docs" 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center px-4 py-2 bg-background border border-input rounded-md text-sm font-medium",
                "text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              )}
            >
              <span className="mr-2">🔗</span>
              Next.js Docs
            </a>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}