import React from 'react';
import { cn } from '../../lib/utils';
import { layout } from '../../lib/designTokens';
import SiteBrand from './SiteBrand';

function AppShellHeader({ homeTo = '/', children }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className={cn(layout.container, 'flex h-16 items-center justify-between gap-4')}>
        <SiteBrand homeTo={homeTo} />
        {children ? (
          <div className="ml-auto flex shrink-0 items-center">{children}</div>
        ) : null}
      </div>
    </header>
  );
}

export default AppShellHeader;
