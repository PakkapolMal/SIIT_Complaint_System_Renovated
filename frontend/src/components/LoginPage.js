import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicPageShell from './layout/PublicPageShell';
import { useAuth } from '../contexts/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { layout } from '../lib/designTokens';

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

const LoginPage = () => {
  const navigate = useNavigate();
  const {
    signInWithGoogle,
    isLoading,
    authError,
    isAuthenticated,
    userRole,
    profileComplete,
  } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (userRole === 'Admin') {
      navigate('/admin', { replace: true });
      return;
    }

    if (userRole === 'Staff') {
      navigate(profileComplete ? '/admin' : '/signup', { replace: true });
      return;
    }

    navigate(profileComplete ? '/portal' : '/signup', { replace: true });
  }, [isAuthenticated, userRole, profileComplete, navigate]);

  return (
    <PublicPageShell page="login">
      <Card className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border shadow-sm">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-8 h-36 w-36 rounded-full bg-secondary/30 blur-3xl"
          aria-hidden="true"
        />

        <CardHeader className="relative space-y-3 px-6 pb-4 pt-8 sm:px-10 sm:pt-10">
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Sign In
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Use your SIIT Google account to file complaints and track submissions.
          </CardDescription>
        </CardHeader>

        <CardContent className="relative space-y-6 px-6 pb-8 sm:px-10 sm:pb-10">
          <div className="rounded-lg border border-border/80 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Allowed domains:</span>{' '}
            @siit.tu.ac.th | @g.siit.tu.ac.th
          </div>

          {authError && (
            <div
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive"
              role="alert"
            >
              {authError}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={signInWithGoogle}
            disabled={isLoading}
            className={cn('w-full text-base', layout.touchTarget)}
          >
            <GoogleIcon />
            {isLoading ? 'Redirecting to Google...' : 'Continue with Google'}
          </Button>
        </CardContent>
      </Card>
    </PublicPageShell>
  );
};

export default LoginPage;
