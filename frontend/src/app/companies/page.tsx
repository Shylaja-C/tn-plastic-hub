'use client';

import { useEffect, useState, useCallback } from 'react';
import { MapPin, Search, Loader2, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { companiesApi, type Company, type Paginated } from '@/lib/api';

const typeColors: Record<string, string> = {
  manufacturer: 'bg-blue-100 text-blue-700',
  recycler: 'bg-green-100 text-green-700',
  supplier: 'bg-orange-100 text-orange-700',
  trader: 'bg-yellow-100 text-yellow-700',
  consultant: 'bg-purple-100 text-purple-700',
};

export default function CompaniesPage() {
  const [data, setData] = useState<Paginated<Company> | null>(null);
  const [city, setCity] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await companiesApi.list({
        page, page_size: 12, status: 'verified',
        city: cityQuery || undefined,
        company_type: typeFilter || undefined,
      });
      setData(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, cityQuery, typeFilter]);

  useEffect(() => { load(); }, [load]);

  const types = ['', 'manufacturer', 'recycler', 'supplier', 'trader', 'consultant'];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
        <p className="text-muted-foreground mt-2">Verified plastics industry companies in Tamil Nadu.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Filter by city..." className="pl-9 w-48" value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { setCityQuery(city); setPage(1); }}} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <Button key={t} size="sm" variant={typeFilter === t ? 'default' : 'outline'}
              onClick={() => { setTypeFilter(t); setPage(1); }}
              className="capitalize">
              {t || 'All Types'}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : !data || data.items.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">No companies found.</div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">{data.total} compan{data.total !== 1 ? 'ies' : 'y'} found</p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((c) => (
              <Card key={c.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-base truncate">{c.name}</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge className={`${typeColors[c.company_type] ?? 'bg-slate-100 text-slate-700'} border-none text-xs capitalize`}>
                          {c.company_type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {(c.city || c.district) && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                      <MapPin className="h-3 w-3" />{c.city ?? c.district}
                    </p>
                  )}
                  {c.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                  )}
                  {c.employee_count && (
                    <p className="text-xs text-muted-foreground mt-2">{c.employee_count} employees</p>
                  )}
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
