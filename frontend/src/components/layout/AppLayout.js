import React from 'react';
import { cn } from '../../lib/utils';
import AppShellHeader from './AppShellHeader';

function AppLayout({ children, headerRight, homeTo = '/', mainClassName }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>

      <AppShellHeader homeTo={homeTo}>{headerRight}</AppShellHeader>

      <main
        id="main-content"
        tabIndex={-1}
        className={cn('flex-1 outline-none', mainClassName)}
      >
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
