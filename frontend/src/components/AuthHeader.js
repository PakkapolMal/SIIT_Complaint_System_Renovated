import React from 'react';
import AppShellHeader from './layout/AppShellHeader';
import AuthNav from './layout/AuthNav';
import { useHomePath } from './layout/useHomePath';

const AuthHeader = () => {
  const homeTo = useHomePath();

  return (
    <AppShellHeader homeTo={homeTo}>
      <AuthNav />
    </AppShellHeader>
  );
};

export { AuthNav };
export default AuthHeader;
