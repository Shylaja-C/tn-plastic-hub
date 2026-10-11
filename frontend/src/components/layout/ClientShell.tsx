'use client';

import { AuthProvider } from '@/lib/auth-context';
import { RegistrationNotification } from '@/components/RegistrationNotification';

export function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RegistrationNotification />
      {children}
    </AuthProvider>
  );
}

