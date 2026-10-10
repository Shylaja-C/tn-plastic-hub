'use client';

import { useEffect, useState, useCallback } from 'react';
import { MapPin, Calendar, Users, Loader2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { visitsApi, type IndustrialVisit, type Paginated, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function IndustrialVisitsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Paginated<IndustrialVisit> | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<number | null>(null);
  const [booked, setBooked] = useState<Set<number>>(new Set());
  const [bookError, setBookError] = useState<Record<number, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await visitsApi.list({ page, page_size: 9, status: 'upcoming' });
      setData(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleBook = async (visitId: number) => {
    if (!user) { router.push('/login'); return; }
    setBooking(visitId);
    setBookError(prev => ({ ...prev, [visitId]: '' }));
    try {
      await visitsApi.book(visitId);
      setBooked(prev => new Set(prev).add(visitId));
    } catch (err) {
      const msg = err instanceof ApiError
        ? (err.status === 409 ? 'Already booked.' : err.message)
        : 'Booking failed.';
      setBookError(prev => ({ ...prev, [visitId]: msg }));
    } finally {
      setBooking(null);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Industrial Visits</h1>
        <p className="text-muted-foreground mt-2">Book a guided tour of leading plastics manufacturing facilities.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : !data || data.items.length === 0 ? (
        <div className="text-center py-24">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">No upcoming visits available.</p>
          <p className="text-sm text-muted-foreground mt-1">Industry companies can add visits from their dashboard.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">{data.total} visit{data.total !== 1 ? 's' : ''} available</p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((v) => (
              <Card key={v.id} className="flex flex-col hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-tight">{v.title}</CardTitle>
                    <Badge variant="outline" className="shrink-0 capitalize">{v.status}</Badge>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{v.company?.name ?? `Company #${v.company_id}`}</p>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-3">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(v.visit_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    {v.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{v.location}</span>}
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{v.max_participants} seats</span>
                  </div>
                  {v.description && <p className="text-sm text-muted-foreground line-clamp-2">{v.description}</p>}
                  {v.target_audience && (
                    <p className="text-xs text-muted-foreground">For: {v.target_audience}</p>
                  )}
                  <div className="mt-auto pt-2 space-y-1">
                    {bookError[v.id] && <p className="text-xs text-destructive">{bookError[v.id]}</p>}
                    {booked.has(v.id) ? (
                      <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <CheckCircle className="h-4 w-4" /> Slot Booked!
                      </span>
                    ) : (
                      <Button size="sm" className="w-full" disabled={booking === v.id}
                        onClick={() => handleBook(v.id)}>
                        {booking === v.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        {user ? 'Book Slot' : 'Login to Book'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {data.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <span className="text-sm text-muted-foreground flex items-center px-2">Page {page} of {data.pages}</span>
              <Button variant="outline" size="sm" disabled={page >= data.pages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
