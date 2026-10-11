'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { internshipsApi, applicationsApi, visitsApi, companiesApi, type Internship, type Application, type IndustrialVisit } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const statusColor: Record<string, string> = {
  applied:      'bg-slate-100 text-slate-700',
  under_review: 'bg-blue-100 text-blue-700',
  shortlisted:  'bg-green-100 text-green-700',
  rejected:     'bg-red-100 text-red-700',
  offered:      'bg-purple-100 text-purple-700',
};

export default function IndustryDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [visits, setVisits] = useState<IndustrialVisit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companiesApi.mine()
      .catch((err) => {
        if (err.status === 404) router.push('/industry-setup');
        throw err;
      })
      .then(() =>
        Promise.all([
          internshipsApi.mine({ page: 1, page_size: 10 }),
          applicationsApi.received({ page: 1 }),
          visitsApi.mine({ page: 1, page_size: 10 }),
        ])
      )
      .then(([iRes, aRes, vRes]) => {
        setInternships(iRes.items);
        setApplications(aRes.items);
        setVisits(vRes.items);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  const activeInternships = internships.filter((i) => i.status === 'open');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {user ? `Welcome, ${user.full_name.split(' ')[0]}` : 'Industry Dashboard'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your company, postings, and candidates.</p>
        </div>
        <Link href="/industry/internships" className={buttonVariants({ variant: 'default' }) + ' gap-2 shrink-0'}>
          <Plus className="h-4 w-4" /> Post Opportunity
        </Link>
      </div>

      {/* Stats strip — plain numbers, no icons */}
      <div className="grid grid-cols-3 gap-px border rounded-lg overflow-hidden bg-border">
        {[
          { label: 'Active Internships',  value: activeInternships.length },
          { label: 'Total Applications',  value: applications.length },
          { label: 'Industrial Visits',   value: visits.length },
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
          <Link href="/industry/applicants" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            View all
          </Link>
        </div>
        <div className="border rounded-lg overflow-hidden">
          {applications.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No applications received yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.slice(0, 8).map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      {a.internship?.title ?? `#${a.internship_id}`}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {`Applicant #${a.applicant_id}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${statusColor[a.status] ?? ''} border-none capitalize`}>
                        {a.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs tabular-nums">
                      {new Date(a.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>

      {/* Internships table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Your Internship Postings</h2>
          <Link href="/industry/internships" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            Manage
          </Link>
        </div>
        <div className="border rounded-lg overflow-hidden">
          {internships.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No internships posted yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {internships.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.title}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{i.location ?? '—'}</TableCell>
                    <TableCell className="text-muted-foreground text-sm tabular-nums">{i.vacancies}</TableCell>
                    <TableCell>
                      <Badge variant={i.status === 'open' ? 'default' : 'secondary'} className="capitalize">
                        {i.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs tabular-nums">
                      {i.application_deadline ? new Date(i.application_deadline).toLocaleDateString() : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </section>

      {/* Visits table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Industrial Visits</h2>
          <Link href="/industry/industrial-visits" className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
            Manage
          </Link>
        </div>
        <div className="border rounded-lg overflow-hidden">
          {visits.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No visits posted yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Visit Date</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.title}</TableCell>
                    <TableCell className="text-muted-foreground text-sm tabular-nums">
                      {new Date(v.visit_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm tabular-nums">{v.max_participants}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{v.status}</Badge>
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
