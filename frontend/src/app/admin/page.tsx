'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
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

  const statItems = stats ? [
    { label: 'Students',             value: stats.users.students },
    { label: 'Companies',            value: stats.companies.total },
    { label: 'Verified Companies',   value: stats.companies.verified },
    { label: 'Active Internships',   value: stats.internships.active },
    { label: 'Industrial Visits',    value: stats.industrial_visits.total },
    { label: 'Published News',       value: stats.news.published },
    { label: 'Pending Verification', value: stats.companies.pending_verification, alert: true },
  ] : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Administration</h1>
        <p className="text-sm text-muted-foreground mt-1">Platform overview and global management.</p>
      </div>

      {/* Stats strip — plain numbers, no icons */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-px border rounded-lg overflow-hidden bg-border">
          {statItems.map((s) => (
            <div
              key={s.label}
              className={`bg-background px-4 py-4 ${s.alert && s.value > 0 ? 'bg-amber-50' : ''}`}
            >
              <p className={`text-2xl font-bold tabular-nums ${s.alert && s.value > 0 ? 'text-amber-600' : ''}`}>
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Verification queue */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            Verification Queue
            {pending.length > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-semibold h-5 px-2">
                {pending.length}
              </span>
            )}
          </h2>
        </div>
        <div className="border rounded-lg overflow-hidden">
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No pending verifications.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
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
                    <TableCell className="text-muted-foreground text-sm">{c.city ?? c.district ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">{c.company_type}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs tabular-nums">
                      {new Date(c.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-green-600 border-green-300 hover:bg-green-50"
                          disabled={verifying === c.id}
                          onClick={() => handleVerify(c.id, 'verified')}
                        >
                          {verifying === c.id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <CheckCircle2 className="h-3.5 w-3.5" />
                          }
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
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
        </div>
      </section>
    </div>
  );
}
