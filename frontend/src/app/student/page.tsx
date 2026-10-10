'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, CheckCircle2, Building2, MapPin, Calendar, Briefcase, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { applicationsApi, visitsApi, internshipsApi, type Application, type Booking, type Internship } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const statusColor: Record<string, string> = {
  applied: 'bg-slate-100 text-slate-800',
  under_review: 'bg-blue-100 text-blue-800',
  shortlisted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  offered: 'bg-purple-100 text-purple-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  withdrawn: 'bg-gray-100 text-gray-500',
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
      internshipsApi.list({ page: 1, page_size: 3, status: 'open' }),
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back{user ? `, ${user.full_name.split(' ')[0]}` : ''}! Here&apos;s an overview of your industry opportunities.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Applications', value: apps.length, icon: FileText, color: 'text-blue-500' },
          { title: 'Shortlisted', value: shortlisted, icon: CheckCircle2, color: 'text-green-500' },
          { title: 'Confirmed Visits', value: confirmedBookings.length, icon: Building2, color: 'text-purple-500' },
          { title: 'Open Internships', value: internships.length, icon: Briefcase, color: 'text-amber-500' },
        ].map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Status of your internship applications.</CardDescription>
          </CardHeader>
          <CardContent>
            {apps.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No applications yet. <Link href="/internships" className="text-primary hover:underline">Browse internships →</Link></p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apps.slice(0, 5).map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.internship?.title ?? `Application #${app.id}`}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${statusColor[app.status] ?? ''} border-none capitalize`}>
                          {app.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {new Date(app.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Visits */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Industrial Visits</CardTitle>
            <CardDescription>Your booked industry tours.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {confirmedBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No confirmed visits yet. <Link href="/industrial-visits" className="text-primary hover:underline">Browse visits →</Link></p>
            ) : (
              confirmedBookings.slice(0, 2).map((b) => (
                <div key={b.id} className="flex items-center space-x-4 rounded-md border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{b.visit?.title ?? `Visit #${b.visit_id}`}</p>
                    <p className="text-xs text-muted-foreground">Date: {b.visit ? new Date(b.visit.visit_date).toLocaleDateString() : 'TBD'}</p>
                  </div>
                  <Badge>Confirmed</Badge>
                </div>
              ))
            )}
            <Link href="/industrial-visits" className={buttonVariants({ variant: 'outline' }) + ' w-full'}>
              Browse More Visits
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Internships */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Open Internships</CardTitle>
              <CardDescription>Latest opportunities in Tamil Nadu plastics industry.</CardDescription>
            </div>
            <Link href="/internships" className={buttonVariants({ variant: 'ghost' })}>View All</Link>
          </div>
        </CardHeader>
        <CardContent>
          {internships.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No open internships right now.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {internships.map((i) => (
                <div key={i.id} className="flex flex-col rounded-lg border p-4 hover:border-primary/50 transition-colors">
                  <h3 className="font-semibold">{i.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{i.company?.name ?? `Company #${i.company_id}`}</p>
                  <div className="flex flex-col gap-2 text-xs text-muted-foreground mt-auto">
                    {i.location && <span className="flex items-center"><MapPin className="mr-1 h-3 w-3" />{i.location}</span>}
                    {i.duration_months && <span className="flex items-center"><Briefcase className="mr-1 h-3 w-3" />{i.duration_months} Months</span>}
                  </div>
                  <Link href={`/internships/${i.id}`} className={buttonVariants({ size: 'sm' }) + ' mt-4 w-full'}>
                    View & Apply
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
