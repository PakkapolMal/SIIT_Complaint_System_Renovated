import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthProvider';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

function AuthNav() {
  const { roleLabel, handleLogout } = useAuth();

  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      <Badge variant="secondary" className="hidden sm:inline-flex">
        {roleLabel}
      </Badge>
      <span className="sr-only sm:hidden">Role: {roleLabel}</span>
      <Separator orientation="vertical" className="hidden h-6 sm:block" />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleLogout}
        aria-label="Sign out of your account"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Sign out</span>
      </Button>
    </div>
  );
}

export default AuthNav;
