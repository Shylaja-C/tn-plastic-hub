'use client';

import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminApi, ApiError, type Company, type Paginated } from '@/lib/api';

export default function AdminVerificationPage() {
  const [data, setData] = useState<Paginated<Company> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await adminApi.pendingVerifications({ page }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load pending companies.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const decide = async (id: number, status: 'verified' | 'rejected') => {
    setBusy(id);
    try {
      await adminApi.verifyCompany(id, status);
      setData((prev) =>
        prev ? { ...prev, items: prev.items.filter((c) => c.id !== id), total: prev.total - 1 } : prev
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update verification.');
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Company Verification</h1>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!data || data.items.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No pending verifications.</p>
      ) : (
        <Card>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell><Badge variant="secondary" className="capitalize">{c.company_type}</Badge></TableCell>
                    <TableCell>{c.city ?? c.district ?? '—'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-green-600" disabled={busy === c.id} onClick={() => decide(c.id, 'verified')}>
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600" disabled={busy === c.id} onClick={() => decide(c.id, 'rejected')}>
                        <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
