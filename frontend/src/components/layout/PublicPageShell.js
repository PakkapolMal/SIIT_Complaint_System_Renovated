import React from 'react';
import { cn } from '../../lib/utils';
import { layout } from '../../lib/designTokens';
import AppLayout from './AppLayout';
import PublicNav from './PublicNav';

/**
 * Matches landing page header alignment: same max-width container and vertical rhythm.
 */
function PublicPageShell({ page, children, centerContent = true, className }) {
  return (
    <AppLayout headerRight={<PublicNav page={page} />} homeTo="/">
      <div className={layout.container}>
        <div
          className={cn(
            'py-8 sm:py-10 lg:py-12',
            centerContent && 'flex justify-center',
            className
          )}
        >
          {children}
        </div>
      </div>
    </AppLayout>
  );
}

export default PublicPageShell;
