'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Briefcase, Users, MapPin, Loader2, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { internshipsApi, applicationsApi, visitsApi, companiesApi, type Internship, type Application, type IndustrialVisit } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const statusColor: Record<string, string> = {
  applied: 'bg-slate-100 text-slate-700',
  under_review: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  offered: 'bg-purple-100 text-purple-700',
};

export default function IndustryDashboard() {
  const { user } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [visits, setVisits] = useState<IndustrialVisit[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    companiesApi.mine()
      .catch((err) => {
        if (err.status === 404) {
          router.push('/industry-setup');
        }
        throw err;
      })
      .then(() => {
        return Promise.all([
          internshipsApi.mine({ page: 1, page_size: 5 }),
          applicationsApi.received({ page: 1 }),
          visitsApi.mine({ page: 1, page_size: 5 }),
        ]);
      })
      .then((results) => {
        if (!results) return;
        const [iRes, aRes, vRes] = results;
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

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Industry Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back{user ? `, ${user.full_name.split(' ')[0]}` : ''}! Manage your company and opportunities.
          </p>
        </div>
        <Link href="/internships" className={buttonVariants({ variant: 'default' }) + ' gap-2'}>
          <Plus className="h-4 w-4" /> Post Opportunity
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Active Internships', value: internships.filter(i => i.status === 'open').length, icon: Briefcase, color: 'text-blue-500' },
          { title: 'Total Applications', value: applications.length, icon: Users, color: 'text-green-500' },
          { title: 'Industrial Visits', value: visits.length, icon: MapPin, color: 'text-purple-500' },
        ].map((s) => (
          <Card key={s.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{s.title}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{s.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest candidates for your openings.</CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No applications received yet.</p>
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
                  {applications.slice(0, 5).map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.internship?.title ?? `#${a.internship_id}`}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${statusColor[a.status] ?? ''} border-none capitalize`}>
                          {a.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(a.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Active Internships */}
        <Card>
          <CardHeader>
            <CardTitle>Active Opportunities</CardTitle>
            <CardDescription>Your posted internships and visits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {internships.length === 0 && visits.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No active opportunities.</p>
            ) : (
              <>
                {internships.slice(0, 3).map((i) => (
                  <div key={i.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{i.title}</p>
                      <p className="text-xs text-muted-foreground">{i.location ?? 'Location TBD'} · {i.vacancies} seats</p>
                    </div>
                    <Badge variant={i.status === 'open' ? 'default' : 'secondary'} className="capitalize">{i.status}</Badge>
                  </div>
                ))}
                {visits.slice(0, 2).map((v) => (
                  <div key={v.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{v.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(v.visit_date).toLocaleDateString()} · {v.max_participants} seats</p>
                    </div>
                    <Badge variant="outline" className="capitalize">{v.status}</Badge>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
