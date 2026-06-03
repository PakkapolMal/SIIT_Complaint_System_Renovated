import React from 'react';
import AppLayout from './AppLayout';
import AuthNav from './AuthNav';
import { useHomePath } from './useHomePath';

function AuthenticatedLayout({ children, mainClassName }) {
  const homeTo = useHomePath();

  return (
    <AppLayout headerRight={<AuthNav />} homeTo={homeTo} mainClassName={mainClassName}>
      {children}
    </AppLayout>
  );
}

export default AuthenticatedLayout;
