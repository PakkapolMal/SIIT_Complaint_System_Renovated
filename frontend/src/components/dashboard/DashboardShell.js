import React from 'react';
import AppLayout from '../layout/AppLayout';
import AuthNav from '../layout/AuthNav';
import { useHomePath } from '../layout/useHomePath';

function DashboardShell({ children }) {
  const homeTo = useHomePath();

  return (
    <AppLayout headerRight={<AuthNav />} homeTo={homeTo}>
      {children}
    </AppLayout>
  );
}

export default DashboardShell;
