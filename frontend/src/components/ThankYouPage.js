import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import AuthenticatedLayout from './layout/AuthenticatedLayout';
import { layout } from '../lib/designTokens';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const ThankYouPage = () => {
  const location = useLocation();
  const submissionId = location.state?.submissionId;
  const { isAdmin } = useAuth();

  if (!submissionId) {
    const homePortal = isAdmin ? '/admin' : '/portal';
    return <Navigate to={homePortal} replace />;
  }

  return (
    <AuthenticatedLayout
      mainClassName={cn('flex items-center justify-center', layout.mainPadding)}
    >
      <Card className="w-full max-w-3xl text-center shadow-md">
        <CardContent className="p-8 sm:p-10">
          <h1 className="mb-4 text-2xl font-bold text-foreground">
            Submission Successful!
          </h1>
          <p className="mb-6 text-muted-foreground">
            Thank you for your feedback. Your complaint has been submitted.
          </p>
          <div className="mb-8 rounded-lg bg-muted p-4">
            <span className="text-sm text-muted-foreground">Your Submission ID is:</span>
            <p className="mt-1 font-mono text-2xl font-bold text-primary">
              #{submissionId}
            </p>
          </div>
          <Button asChild size="lg" className="w-full">
            <Link to={isAdmin ? '/admin' : '/portal'}>
              {isAdmin ? 'Back to dashboard' : 'Back to portal'}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </AuthenticatedLayout>
  );
};

export default ThankYouPage;
