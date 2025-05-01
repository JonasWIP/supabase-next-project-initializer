'use client';

import React from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

interface DashboardActionsProps {
  onSignOut: () => Promise<void>;
}

export default function DashboardActions({ onSignOut }: DashboardActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={onSignOut}
        >
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
}