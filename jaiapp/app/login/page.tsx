import LoginForm from '@/components/forms/LoginForm';
import PageContainer from '@/components/layout/PageContainer';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Login - SupaNext Template',
  description: 'Log in to your account',
};

export default function LoginPage() {
  return (
    <PageContainer maxWidth="sm" className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full">
        <CardContent className="pt-6">
          <LoginForm />
        </CardContent>
      </Card>
    </PageContainer>
  );
}