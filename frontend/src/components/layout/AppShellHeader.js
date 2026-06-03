import React from 'react';
import SiteBrand from './SiteBrand';

function AppShellHeader({ homeTo = '/', children }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <SiteBrand homeTo={homeTo} />
        {children ? (
          <div className="flex shrink-0 items-center">{children}</div>
        ) : null}
      </div>
    </header>
  );
}

export default AppShellHeader;
