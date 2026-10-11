'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { applicationsApi, visitsApi, internshipsApi, type Application, type Booking, type Internship } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const statusColor: Record<string, string> = {
  applied:      'bg-slate-100 text-slate-800',
  under_review: 'bg-blue-100 text-blue-800',
  shortlisted:  'bg-green-100 text-green-800',
  rejected:     'bg-red-100 text-red-800',
  offered:      'bg-purple-100 text-purple-800',
  accepted:     'bg-emerald-100 text-emerald-800',
  withdrawn:    'bg-gray-100 text-gray-500',
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      applicationsApi.my({ page: 1 }),
      visitsApi.myBookings({ page: 1 }),
      internshipsApi.list({ page: 1, page_size: 5, status: 'open' }),
    ])
      .then(([appsRes, bookingsRes, internRes]) => {
        setApps(appsRes.items);
        setBookings(bookingsRes.items);
        setInternships(internRes.items);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const shortlisted = apps.filter((a) => a.status === 'shortlisted').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {user ? `Welcome, ${user.full_name.split(' ')[0]}` : 'Student Dashboard'}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your applications and visits.</p>
      </div>

      {/* Stats strip — plain numbers, no icons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px border rounded-lg overflow-hidden bg-border">
        {[
          { label: 'Applications',    value: apps.length },
          { label: 'Shortlisted',     value: shortlisted },
          { label: 'Confirmed Visits',value: confirmedBookings.length },
          { label: 'Open Internships',value: internships.length },
        ].map((s) => (
          <div key={s.label} className="bg-background px-5 py-4">
            <p className="text-2xl font-bold tabular-nums">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Applications table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent Applications</h2>
          <Link href="/student/applications" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            View all
          </Link>
        </div>
        <div className="border rounded-lg overflow-hidden">
          {apps.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No applications yet.{' '}
              <Link href="/internships" className="text-primary hover:underline">Browse internships →</Link>
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps.slice(0, 5).map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">
                      {app.internship?.title ?? `Application #${app.id}`}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {app.internship?.company?.name ?? '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${statusColor[app.status] ?? ''} border-none capitalize`}>
                        {app.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs tabular-nums">
                      {new Date(app.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>

      {/* Upcoming visits table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Confirmed Industrial Visits</h2>
          <Link href="/student/industrial-visits" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            View all
          </Link>
        </div>
        <div className="border rounded-lg overflow-hidden">
          {confirmedBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No confirmed visits.{' '}
              <Link href="/industrial-visits" className="text-primary hover:underline">Browse visits →</Link>
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Visit</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {confirmedBookings.slice(0, 5).map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.visit?.title ?? `Visit #${b.visit_id}`}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {b.visit ? new Date(b.visit.visit_date).toLocaleDateString() : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge className="capitalize">{b.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>

      {/* Open internships table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Open Internships</h2>
          <Link href="/internships" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            View all
          </Link>
        </div>
        <div className="border rounded-lg overflow-hidden">
          {internships.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No open internships right now.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {internships.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.title}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {i.company?.name ?? `Company #${i.company_id}`}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{i.location ?? '—'}</TableCell>
                    <TableCell>
                      <Link
                        href={`/internships/${i.id}`}
                        className={buttonVariants({ variant: 'outline', size: 'sm' })}
                      >
                        Apply
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>
    </div>
  );
}
