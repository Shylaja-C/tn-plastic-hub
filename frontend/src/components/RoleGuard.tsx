'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import type { UserRole } from '@/lib/api';

export function RoleGuard({ roles, children }: { roles: UserRole[]; children: React.ReactNode }) {
  const { user, loading, isRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!isRole(...roles)) {
        if (user.role === 'admin') router.push('/admin');
        else if (user.role === 'industry') router.push('/industry');
        else if (user.role === 'student') router.push('/student');
        else router.push('/');
      }
    }
  }, [user, loading, router, roles, isRole]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user || !isRole(...roles)) {
    return null;
  }

  return <>{children}</>;
}
