import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = {
  title: 'About - SupaNext Template',
  description: 'Learn about the SupaNext Template project and its features',
};

export default function AboutPage() {
  return (
    <PageContainer maxWidth="lg">
      <PageHeader 
        title="About SupaNext Template"
        description="A modern, production-ready template for building web applications"
      />

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              SupaNext Template was created to help developers quickly build robust, type-safe web applications
              using a modern technology stack that emphasizes developer experience and performance.
            </p>
            
            <p className="mb-4">
              Our goal is to provide a solid foundation that eliminates boilerplate setup,
              allowing you to focus on building your unique features rather than configuring infrastructure.
            </p>

            <p>
              By combining Next.js and Supabase, we offer a streamlined development experience
              with powerful backend capabilities, all while maintaining optimal frontend performance.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Core Principles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <h3 className="text-xl font-medium mb-2">Developer Experience</h3>
                <p className="text-muted-foreground mb-2">
                  Type safety, hot reloading, and intuitive APIs make development efficient and enjoyable.
                </p>
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-xl font-medium mb-2">Performance</h3>
                <p className="text-muted-foreground mb-2">
                  Server-side rendering, edge functions, and optimized assets deliver excellent user experiences.
                </p>
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-xl font-medium mb-2">Maintainability</h3>
                <p className="text-muted-foreground mb-2">
                  Clean architecture, consistent patterns, and comprehensive documentation for long-term success.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>The Team</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              SupaNext Template is maintained by a dedicated team of web developers passionate about 
              modern web technologies and best practices. Our diverse backgrounds in frontend and backend
              development inform the architecture and feature set of this template.
            </p>

            <p>
              We actively incorporate community feedback and continuously improve the template to meet
              the evolving needs of web developers and the changing landscape of web development.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Open Source</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              SupaNext Template is open source and available under the MIT license. We believe in the power
              of community-driven development and welcome contributions from developers around the world.
            </p>
            
            <p>
              Whether you&apos;re fixing bugs, adding features, or improving documentation, your contributions
              help make this template better for everyone. Visit our GitHub repository to learn how you can
              get involved.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}