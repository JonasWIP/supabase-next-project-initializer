import { Card } from '@/components/ui/card';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import RestApiExample from '@/components/RestApiExample';
import ClientApiExample from './ClientApiExample';

// Define metadata for this page
export const metadata = {
  title: 'API Calls Example | SupaNext Template',
  description: 'Learn about different ways to interact with Supabase APIs',
};

export default async function ApiCallsPage() {
  return (
    <PageContainer>
      <PageHeader title="API Calls Examples" />
      
      <div className="space-y-4 mb-8">
        <p className="text-muted-foreground">
          These examples demonstrate different ways of making API calls to Supabase, both from the server and client.
        </p>
        <p className="text-muted-foreground">
          Some examples require you to be logged in to work properly.
        </p>
      </div>
      
      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Server-Side API Call</h2>
          <p className="text-muted-foreground mb-4">
            This example uses the Supabase server client to fetch data server-side.
          </p>
          
          <RestApiExample />
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">How it works:</h3>
            <ul className="list-disc pl-5 text-muted-foreground">
              <li className="mb-1">API calls are made on the server using server components</li>
              <li className="mb-1">Data is pre-rendered before being sent to the client</li>
              <li className="mb-1">API keys are kept secure on the server</li>
              <li>Reduces client-side JavaScript bundle size</li>
            </ul>
            
            <div className="bg-muted border border-border rounded p-4 mt-4">
              <h4 className="font-medium mb-1">Code example:</h4>
              <p className="text-sm text-muted-foreground mb-2">Server Component</p>
              <pre className="text-sm overflow-x-auto">
                <code>
                  {`const supabase = await SupabaseServerHelper.createServerClient();
const { data } = await supabase.from('table').select('*');`}
                </code>
              </pre>
            </div>
          </div>
        </Card>

        <ClientApiExample serverDataCount={5} />
      </div>
    </PageContainer>
  );
}