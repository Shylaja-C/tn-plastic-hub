'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, Briefcase, Search, Loader2, IndianRupee, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { internshipsApi, ApiError, type Internship, type Paginated } from '@/lib/api';

export default function InternshipsPage() {
  const [data, setData] = useState<Paginated<Internship> | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await internshipsApi.list({ page, page_size: 12, search: query || undefined, status: 'open' });
      setData(res);
    } catch (e) {
      console.error(e);
      setError(e instanceof ApiError ? e.message : 'Failed to load internships.');
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
    setPage(1);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Internships</h1>
        <p className="text-muted-foreground mt-2">Explore opportunities in Tamil Nadu&apos;s plastics industry.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8 max-w-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by role, skills..." className="pl-9" value={search}
            onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button type="submit">Search</Button>
      </form>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : error ? (
        <div className="text-center py-16 space-y-4">
          <p className="text-destructive font-medium">{error}</p>
          <Button variant="outline" onClick={() => load()}>Retry</Button>
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">No internships found. Try a different search.</div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">{data.total} internship{data.total !== 1 ? 's' : ''} found</p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((i) => (
              <Card key={i.id} className="flex flex-col hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-tight">{i.title}</CardTitle>
                    <Badge variant="secondary" className="shrink-0 capitalize">{i.internship_type.replace('_', ' ')}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{i.company?.name ?? `Company #${i.company_id}`}</p>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-3">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {i.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{i.location}</span>}
                    {i.duration_months && <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{i.duration_months} months</span>}
                    {i.stipend_amount != null && <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />{i.stipend_amount.toLocaleString()}/mo</span>}
                    {i.application_deadline && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due {new Date(i.application_deadline).toLocaleDateString()}</span>}
                  </div>
                  {i.skills_required && (
                    <div className="flex flex-wrap gap-1">
                      {i.skills_required.split(',').slice(0, 4).map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">{s.trim()}</Badge>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto pt-2">
                    <Link href={`/internships/${i.id}`} className="w-full">
                      <Button size="sm" className="w-full">View & Apply</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
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
