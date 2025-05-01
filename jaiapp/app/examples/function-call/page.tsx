import { Card } from '@/components/ui/card';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { SupabaseServerHelper } from '@/lib/supabase/server-client';
import ClientFunctionExample from './ClientFunctionExample';
import { CodeBlock } from '@/components/ui/codeblock';
import { uiStyles } from '@/lib/ui-styles';

// Define metadata for this page
export const metadata = {
  title: 'Edge Functions Example | SupaNext Template',
  description: 'Learn how to call Supabase Edge Functions from your Next.js app',
};

export default async function FunctionCallPage() {
  const supabase = await SupabaseServerHelper.createServerClient();
  // Auth check is performed but user isn't needed in this component
  await supabase.auth.getUser();
  
  let response = null;
  let error = null;

  try {
    // Call Edge Function from the server component
    const { data, error: functionError } = await supabase.functions.invoke('hello-world');
    
    if (functionError) {
      throw functionError;
    }
    
    response = data;
  } catch (err) {
    console.error('Error calling Edge Function:', err);
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  return (
    <PageContainer>
      <PageHeader title="Edge Functions Example" />
      
      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Server-Side Edge Function Call</h2>
          <p className="mb-4 text-muted-foreground">
            This example demonstrates calling a Supabase Edge Function from a server component.
          </p>
          
          <div className={`${uiStyles.border.default} ${uiStyles.bg.secondary} p-4 rounded-md`}>
            <h3 className="font-medium mb-2">Result:</h3>
            {error ? (
              <div className={uiStyles.text.error}>
                <p>Error: {error}</p>
              </div>
            ) : (
              <div>
                <div className={`mb-2 text-sm ${response?.authenticated ? uiStyles.text.success : uiStyles.text.warning}`}>
                  Status: {response?.authenticated ? 'Authenticated ✓' : 'Public Access (Not Authenticated)'}
                </div>
                <CodeBlock maxHeight="300px">
                  {JSON.stringify(response, null, 2)}
                </CodeBlock>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Server Component Code:</h3>
            <p className="text-muted-foreground text-sm mb-2">
              This is how we call Edge Functions from a Server Component:
            </p>
            
            <CodeBlock language="typescript" title="Initialize Client">
              const supabase = await SupabaseServerHelper.createServerClient();
            </CodeBlock>
            
            <CodeBlock language="typescript" title="Basic Function Call" className="mt-3">
              const {'{ data, error }'} = await supabase.functions.invoke(&apos;hello-world&apos;);
            </CodeBlock>
            
            <p className="text-muted-foreground text-sm mt-4 mb-2">
              With authentication:
            </p>
            
            <CodeBlock language="typescript" title="Authenticated Call">
              {/* Auth header is included automatically */}
              const {'{ data, error }'} = await supabase.functions.invoke(&apos;hello-world&apos;);
            </CodeBlock>
            
            <p className="text-muted-foreground text-sm mt-4 mb-2">
              With extra parameters:
            </p>
            <CodeBlock language="typescript" title="Parameterized Call">
              const {'{ data, error }'} = await supabase.functions.invoke(&apos;hello-world&apos;, {'{'}
                body: {'{ param1: "value1", param2: "value2" }'}
              {'}'});
            </CodeBlock>
          </div>
        </Card>
        
        <ClientFunctionExample />
      </div>
    </PageContainer>
  );
}