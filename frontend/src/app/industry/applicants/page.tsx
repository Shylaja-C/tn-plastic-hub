'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiError, applicationsApi, type Application } from '@/lib/api';
import { Loader2 } from 'lucide-react';

const statusOptions = ['applied', 'under_review', 'shortlisted', 'offered', 'rejected'];
const statusColor: Record<string, string> = {
  applied: 'bg-slate-100 text-slate-700', under_review: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700',
  offered: 'bg-purple-100 text-purple-700', accepted: 'bg-emerald-100 text-emerald-700',
};

export default function IndustryApplicantsPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);

  const load = () => {
    applicationsApi.received({ page: 1 })
      .then((r) => setApps(r.items))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load applications.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const changeStatus = async (id: number, status: string) => {
    setUpdating(id);
    try {
      const updated = await applicationsApi.updateStatus(id, status);
      setApps((prev) => prev.map((a) => a.id === id ? { ...a, status: updated.status } : a));
    } catch (e) { console.error(e); }
    finally { setUpdating(null); }
  };

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Received Applications</h1>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {apps.length === 0 ? <p className="text-center text-muted-foreground py-12">No applications received yet.</p> : (
        <Card><CardContent className="pt-0"><Table><TableHeader><TableRow>
          <TableHead>Internship</TableHead><TableHead>Applicant</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead>
        </TableRow></TableHeader><TableBody>
          {apps.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">{a.internship?.title ?? `#${a.internship_id}`}</TableCell>
              <TableCell>Applicant #{a.applicant_id}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</TableCell>
              <TableCell><Badge variant="outline" className={`${statusColor[a.status] ?? ''} border-none capitalize`}>{a.status.replace(/_/g, ' ')}</Badge></TableCell>
              <TableCell>
                <select className="h-8 rounded-lg border border-input bg-transparent px-2 text-xs" value={a.status} disabled={updating === a.id} onChange={(e) => changeStatus(a.id, e.target.value)}>
                  {statusOptions.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody></Table></CardContent></Card>
      )}
    </div>
  );
}
