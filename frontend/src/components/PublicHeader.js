import React from 'react';
import AppShellHeader from './layout/AppShellHeader';
import PublicNav from './layout/PublicNav';

const PublicHeader = ({ page }) => (
  <AppShellHeader homeTo="/">
    <PublicNav page={page} />
  </AppShellHeader>
);

export { PublicNav };
export default PublicHeader;
