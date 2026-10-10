'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiError, visitsApi, type Booking } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function StudentVisitsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState<number | null>(null);

  useEffect(() => {
    visitsApi.myBookings({ page: 1 })
      .then((r) => setBookings(r.items))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load bookings.'))
      .finally(() => setLoading(false));
  }, []);

  const cancel = async (id: number) => {
    setCancelling(id);
    try {
      await visitsApi.updateBookingStatus(id, 'cancelled');
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'cancelled' } : b));
    } catch (e) { console.error(e); }
    finally { setCancelling(null); }
  };

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Industrial Visit Bookings</h1>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {bookings.length === 0 ? <p className="text-center text-muted-foreground py-12">No bookings yet.</p> : (
        <Card><CardContent className="pt-0"><Table><TableHeader><TableRow>
          <TableHead>Visit</TableHead><TableHead>Date</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead>
        </TableRow></TableHeader><TableBody>
          {bookings.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="font-medium">{b.visit?.title ?? `Visit #${b.visit_id}`}</TableCell>
              <TableCell>{b.visit ? new Date(b.visit.visit_date).toLocaleDateString() : '—'}</TableCell>
              <TableCell>{b.visit?.location ?? '—'}</TableCell>
              <TableCell><Badge variant="outline" className="capitalize">{b.status}</Badge></TableCell>
              <TableCell>{b.status !== 'cancelled' && <Button size="sm" variant="outline" disabled={cancelling === b.id} onClick={() => cancel(b.id)}>{cancelling === b.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Cancel'}</Button>}</TableCell>
            </TableRow>
          ))}
        </TableBody></Table></CardContent></Card>
      )}
    </div>
  );
}
