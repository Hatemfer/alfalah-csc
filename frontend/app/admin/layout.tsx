import React from 'react';
import { AdminMuiProvider } from './AdminMuiProvider';
import { AdminAuthProvider } from './AdminAuthContext';
import { AdminShell } from './AdminShell';

export const metadata = {
  title: 'Alfalah CMS — Administrative Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminMuiProvider>
      <AdminAuthProvider>
        <AdminShell>{children}</AdminShell>
      </AdminAuthProvider>
    </AdminMuiProvider>
  );
}
