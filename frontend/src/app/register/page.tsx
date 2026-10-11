'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2,
  GraduationCap,
  Building2,
  Rocket,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { ApiError, type UserRole } from '@/lib/api';
import { Logo } from '@/components/layout/Logo';

const roles: { value: UserRole; label: string; description: string; icon: any }[] = [
  {
    value: 'student',
    label: 'Student / Researcher',
    description: 'Looking for plastics internships, plant visits & research projects',
    icon: GraduationCap,
  },
  {
    value: 'industry',
    label: 'Industry / Recycler / Manufacturer',
    description: 'Posting material lots, hiring talent & finding circular partners',
    icon: Building2,
  },
  {
    value: 'entrepreneur',
    label: 'Entrepreneur / Aggregator',
    description: 'Setting up new plastics unit, accessing SIPCOT land & MSME schemes',
    icon: Rocket,
  },
];

const dashboardHref = (role: string) => {
  if (role === 'admin') return '/admin';
  if (role === 'industry' || role === 'entrepreneur') return '/industry';
  return '/student';
};

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        email,
        password,
        full_name: fullName,
        role,
        phone: phone || undefined,
        college_name: role === 'student' ? collegeName || undefined : undefined,
        department: role === 'student' ? department || undefined : undefined,
      });
      router.push('/?registered=true');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 409 ? 'An account with this email already exists.' : err.message);
      } else {
        setError('Something went wrong. Please check your details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center py-16 px-4 bg-gradient-to-b from-slate-50 via-white to-teal-50/30 dark:from-slate-950 dark:to-slate-900">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Brand identity center */}
        <div className="text-center flex justify-center">
          <Link href="/" className="inline-block hover:opacity-95 transition-opacity">
            <Logo variant="full" size="lg" />
          </Link>
        </div>

        <Card className="rounded-3xl border-border/80 shadow-xl bg-card">
          <CardHeader className="text-center space-y-1 pb-4">
            <CardTitle className="text-2xl font-extrabold tracking-tight text-foreground">
              Create your account
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Join Tamil Nadu&apos;s circular plastics & recycling ecosystem
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 text-xs font-semibold">
                  {error}
                </div>
              )}

              {/* Role selector buttons */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground">
                  I want to join as a:
                </label>
                <div className="grid gap-2">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const isSelected = role === r.value;
                    return (
                      <button
                        type="button"
                        key={r.value}
                        onClick={() => setRole(r.value)}
                        className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/5 ring-1 ring-primary/40'
                            : 'border-border/80 hover:border-primary/40 hover:bg-slate-50/50'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-primary text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-foreground">{r.label}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{r.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form inputs */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-xs font-bold text-foreground">
                  Full Name / Organization Head *
                </label>
                <Input
                  id="fullName"
                  placeholder="e.g. S. Meenakshi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-foreground">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-10 rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-bold text-foreground">
                    Phone / WhatsApp (optional)
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-bold text-foreground">
                  Password (min 8 characters) *
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              {role === 'student' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label htmlFor="college" className="text-xs font-bold text-foreground">
                      College / University
                    </label>
                    <Input
                      id="college"
                      placeholder="e.g. PSG College of Tech / CIPET"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="h-10 rounded-xl text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="dept" className="text-xs font-bold text-foreground">
                      Department / Specialization
                    </label>
                    <Input
                      id="dept"
                      placeholder="e.g. Polymer / Chemical Engg"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="h-10 rounded-xl text-xs"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-md mt-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Your Account...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-border/80 text-center text-xs text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-bold">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Trust Footnote */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Compliant with Tamil Nadu Plastics Industry and Environmental Standards</span>
        </div>

      </div>
    </div>
  );
}
