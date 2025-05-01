import React from 'react';
import { ThemeShowcase } from '@/components/ThemeShowcase';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';

export const metadata = {
  title: 'Theme Showcase',
  description: 'Explore and test different themes available in the application',
};

export default function ThemeShowcasePage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Theme Showcase" 
        description="Explore the different themes available in the application" 
      />
      <ThemeShowcase />
    </PageContainer>
  );
}