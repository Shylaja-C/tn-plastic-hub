'use client';

import { useEffect, useState } from 'react';
import { Users, Building2, Briefcase, MapPin, ShieldCheck, BookOpen, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminApi, type AdminDashboard, type Company } from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboard | null>(null);
  const [pending, setPending] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<number | null>(null);

  const load = async () => {
    try {
      const [dashRes, pendRes] = await Promise.all([
        adminApi.dashboard(),
        adminApi.pendingVerifications({ page: 1 }),
      ]);
      setStats(dashRes);
      setPending(pendRes.items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleVerify = async (id: number, status: 'verified' | 'rejected') => {
    setVerifying(id);
    try {
      await adminApi.verifyCompany(id, status);
      setPending((prev) => prev.filter((c) => c.id !== id));
      if (stats) {
        setStats({
          ...stats,
          companies: {
            ...stats.companies,
            pending_verification: stats.companies.pending_verification - 1,
            verified: status === 'verified' ? stats.companies.verified + 1 : stats.companies.verified,
          },
        });
      }
    } catch (e) { console.error(e); }
    finally { setVerifying(null); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  const statCards = stats ? [
    { title: 'Total Students', value: stats.users.students, icon: Users },
    { title: 'Total Companies', value: stats.companies.total, icon: Building2 },
    { title: 'Active Internships', value: stats.internships.active, icon: Briefcase },
    { title: 'Industrial Visits', value: stats.industrial_visits.total, icon: MapPin },
    { title: 'Pending Verifications', value: stats.companies.pending_verification, icon: ShieldCheck, alert: true },
    { title: 'Published News', value: stats.news.published, icon: BookOpen },
  ] : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
        <p className="text-muted-foreground mt-2">Platform overview and global management.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((s) => (
          <Card key={s.title} className={s.alert ? 'border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/10' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">{s.title}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.alert ? 'text-amber-500' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Verification Queue</CardTitle>
          <CardDescription>Review and approve new industry registrations.</CardDescription>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No pending verifications.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.city ?? c.district ?? '—'}</TableCell>
                    <TableCell><Badge variant="secondary" className="capitalize">{c.company_type}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(c.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm" variant="outline"
                          className="gap-1 text-green-600 border-green-300 hover:bg-green-50"
                          disabled={verifying === c.id}
                          onClick={() => handleVerify(c.id, 'verified')}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button
                          size="sm" variant="outline"
                          className="gap-1 text-red-600 border-red-300 hover:bg-red-50"
                          disabled={verifying === c.id}
                          onClick={() => handleVerify(c.id, 'rejected')}
                        >
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
