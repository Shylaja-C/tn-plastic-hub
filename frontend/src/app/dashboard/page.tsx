'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Loader2 } from 'lucide-react';

export default function DashboardRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login');
      } else if (user.role === 'admin') {
        router.replace('/admin');
      } else if (user.role === 'industry' || user.role === 'entrepreneur') {
        router.replace('/industry');
      } else {
        router.replace('/student');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <p className="text-xs text-muted-foreground font-medium">Loading your TN Plastic Hub dashboard...</p>
      </div>
    </div>
  );
}
