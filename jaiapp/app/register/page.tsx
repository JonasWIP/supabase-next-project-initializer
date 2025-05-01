import RegisterForm from '@/components/forms/RegisterForm';
import PageContainer from '@/components/layout/PageContainer';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Register - SupaNext Template',
  description: 'Create a new account',
};

export default function RegisterPage() {
  return (
    <PageContainer maxWidth="sm" className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full">
        <CardContent className="pt-6">
          <RegisterForm />
        </CardContent>
      </Card>
    </PageContainer>
  );
}