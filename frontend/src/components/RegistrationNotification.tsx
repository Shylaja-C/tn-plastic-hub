'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, X, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

function NotificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setShow(true);
      // Clean query parameter from address bar cleanly
      router.replace('/', { scroll: false });
      const timer = setTimeout(() => {
        setShow(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (!show) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="rounded-2xl border border-blue-500/30 bg-white dark:bg-slate-900 p-4 shadow-2xl flex items-start gap-3 relative overflow-hidden">
        {/* Subtle accent highlight line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-orange-400" />

        <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
          <CheckCircle2 className="w-5 h-5" />
        </div>

        <div className="flex-1 pr-4">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-foreground">
              User Created Successfully!
            </h4>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
            Welcome to TN Plastic Hub{user?.full_name ? `, ${user.full_name}` : ''}! Your account is active and you are now signed in.
          </p>
        </div>

        <button
          onClick={() => setShow(false)}
          className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function RegistrationNotification() {
  return (
    <Suspense fallback={null}>
      <NotificationContent />
    </Suspense>
  );
}

export default RegistrationNotification;
