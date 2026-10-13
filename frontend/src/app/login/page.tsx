'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowRight, ShieldCheck, Lock, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api';
import { Logo } from '@/components/layout/Logo';

const dashboardHref = (role: string) => {
  if (role === 'admin') return '/admin';
  if (role === 'industry' || role === 'entrepreneur') return '/industry';
  return '/student';
};

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      router.push(dashboardHref(user.role));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 401 ? 'Invalid email or password.' : err.message);
      } else {
        setError('Something went wrong. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center py-16 px-4 bg-gradient-to-b from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand identity center */}
        <div className="text-center flex justify-center">
          <Link href="/" className="inline-block hover:opacity-95 transition-opacity">
            <Logo variant="full" size="lg" />
          </Link>
        </div>

        <Card className="rounded-3xl border-border/80 shadow-xl bg-card">
          <CardHeader className="text-center space-y-1.5 pb-4">
            <CardTitle className="text-2xl font-extrabold tracking-tight text-foreground">
              Welcome back
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Sign in to manage your marketplace listings, applications & dashboard
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 text-xs font-semibold">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-xs font-bold text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-11 rounded-xl pl-9 text-xs"
                  />
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-bold text-foreground">
                    Password
                  </label>
                  <span className="text-[11px] text-primary hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-11 rounded-xl pl-9 text-xs"
                  />
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-md mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In to TN Plastic Hub
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-border/80 text-center text-xs text-muted-foreground">
              Don&apos;t have an account yet?{' '}
              <Link href="/register" className="text-primary hover:underline font-bold">
                Register here
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Encrypted regional access for Tamil Nadu industry stakeholders</span>
        </div>

      </div>
    </div>
  );
}
