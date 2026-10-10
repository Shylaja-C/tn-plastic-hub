'use client';

import { useEffect, useState, useCallback } from 'react';
import { Landmark, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { schemesApi, type Scheme, type Paginated } from '@/lib/api';

const categoryColors: Record<string, string> = {
  startup: 'bg-purple-100 text-purple-700',
  msme: 'bg-blue-100 text-blue-700',
  technology: 'bg-cyan-100 text-cyan-700',
  export: 'bg-green-100 text-green-700',
  environment: 'bg-emerald-100 text-emerald-700',
  other: 'bg-slate-100 text-slate-700',
};

export default function SchemesPage() {
  const [data, setData] = useState<Paginated<Scheme> | null>(null);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await schemesApi.list({ page, category: category || undefined, status: 'active' });
      setData(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, category]);

  useEffect(() => { load(); }, [load]);

  const categories = ['', 'startup', 'msme', 'technology', 'export', 'environment', 'other'];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Government Schemes</h1>
        <p className="text-muted-foreground mt-2">Financial support and incentive schemes for the plastics industry.</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((c) => (
          <Button key={c} size="sm" variant={category === c ? 'default' : 'outline'}
            onClick={() => { setCategory(c); setPage(1); }} className="capitalize">
            {c || 'All Categories'}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : !data || data.items.length === 0 ? (
        <div className="text-center py-24">
          <Landmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">No schemes available yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Admins can add schemes from the admin panel.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((s) => (
              <Card key={s.id} className="flex flex-col hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-tight">{s.title}</CardTitle>
                    {s.is_featured && <Badge className="shrink-0 bg-amber-100 text-amber-700 border-none">Featured</Badge>}
                  </div>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <Badge className={`${categoryColors[s.category] ?? categoryColors.other} border-none text-xs capitalize`}>
                      {s.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs capitalize">{s.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-3">
                  {s.issuing_authority && (
                    <p className="text-xs font-medium text-muted-foreground">{s.issuing_authority}</p>
                  )}
                  {s.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{s.description}</p>
                  )}
                  {s.benefits && (
                    <div>
                      <p className="text-xs font-semibold mb-1">Benefits</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{s.benefits}</p>
                    </div>
                  )}
                  {s.application_deadline && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Deadline: {new Date(s.application_deadline).toLocaleDateString()}
                    </p>
                  )}
                  {s.scheme_url && (
                    <a href={s.scheme_url} target="_blank" rel="noopener noreferrer"
                      className="mt-auto flex items-center gap-1 text-sm text-primary hover:underline">
                      Apply / Learn More <ExternalLink className="h-3 w-3" />
                    </a>
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
