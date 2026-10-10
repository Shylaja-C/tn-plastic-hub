'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Factory, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { ApiError, type UserRole } from '@/lib/api';

const roles: { value: UserRole; label: string; description: string }[] = [
  { value: 'student', label: 'Student', description: 'Looking for internships and industrial visits' },
  { value: 'industry', label: 'Industry Professional', description: 'Company representative posting opportunities' },
  { value: 'entrepreneur', label: 'Entrepreneur', description: 'Starting or scaling a plastics business' },
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
      router.push(dashboardHref(role));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.status === 409 ? 'An account with this email already exists.' : err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center py-16 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Factory className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Join the Tamil Nadu plastics industry ecosystem</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Role selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">I am a…</label>
              <div className="grid gap-2">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`flex flex-col items-start rounded-lg border px-4 py-3 text-left transition-colors ${
                      role === r.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <span className="text-sm font-medium">{r.label}</span>
                    <span className="text-xs text-muted-foreground">{r.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
              <Input id="fullName" placeholder="Your full name" value={fullName}
                onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input id="email" type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input id="password" type="password" placeholder="Min. 8 chars, include a number" value={password}
                onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone <span className="text-muted-foreground">(optional)</span></label>
              <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" value={phone}
                onChange={(e) => setPhone(e.target.value)} />
            </div>

            {role === 'student' && (
              <>
                <div className="space-y-2">
                  <label htmlFor="college" className="text-sm font-medium">College / University</label>
                  <Input id="college" placeholder="e.g. PSG College of Technology" value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="dept" className="text-sm font-medium">Department</label>
                  <Input id="dept" placeholder="e.g. Polymer Technology" value={department}
                    onChange={(e) => setDepartment(e.target.value)} />
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
