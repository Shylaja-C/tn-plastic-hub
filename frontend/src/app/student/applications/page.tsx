'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiError, applicationsApi, type Application } from '@/lib/api';
import { Loader2 } from 'lucide-react';

const statusColor: Record<string, string> = {
  applied: 'bg-slate-100 text-slate-700', under_review: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700',
  offered: 'bg-purple-100 text-purple-700', accepted: 'bg-emerald-100 text-emerald-700',
  withdrawn: 'bg-gray-100 text-gray-500',
};

export default function StudentApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [withdrawing, setWithdrawing] = useState<number | null>(null);

  useEffect(() => {
    applicationsApi.my({ page: 1 })
      .then((r) => setApps(r.items))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load applications.'))
      .finally(() => setLoading(false));
  }, []);

  const withdraw = async (id: number) => {
    setWithdrawing(id);
    try {
      await applicationsApi.withdraw(id);
      setApps((prev) => prev.map((a) => a.id === id ? { ...a, status: 'withdrawn' } : a));
    } catch (e) { console.error(e); }
    finally { setWithdrawing(null); }
  };

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Applications</h1>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {apps.length === 0 ? <p className="text-center text-muted-foreground py-12">No applications yet.</p> : (
        <Card><CardContent className="pt-0"><Table><TableHeader><TableRow>
          <TableHead>Internship</TableHead><TableHead>Company</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead>
        </TableRow></TableHeader><TableBody>
          {apps.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">{a.internship?.title ?? `#${a.internship_id}`}</TableCell>
              <TableCell>{a.internship?.company?.name ?? '—'}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</TableCell>
              <TableCell><Badge variant="outline" className={`${statusColor[a.status] ?? ''} border-none capitalize`}>{a.status.replace(/_/g, ' ')}</Badge></TableCell>
              <TableCell>{!['withdrawn', 'rejected'].includes(a.status) && <Button size="sm" variant="outline" disabled={withdrawing === a.id} onClick={() => withdraw(a.id)}>{withdrawing === a.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Withdraw'}</Button>}</TableCell>
            </TableRow>
          ))}
        </TableBody></Table></CardContent></Card>
      )}
    </div>
  );
}
