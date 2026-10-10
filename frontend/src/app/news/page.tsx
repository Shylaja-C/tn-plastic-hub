'use client';

import { useEffect, useState, useCallback } from 'react';
import { Newspaper, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { newsApi, type NewsItem, type Paginated } from '@/lib/api';

const categoryColors: Record<string, string> = {
  industry: 'bg-blue-100 text-blue-700',
  government: 'bg-orange-100 text-orange-700',
  technology: 'bg-cyan-100 text-cyan-700',
  event: 'bg-purple-100 text-purple-700',
  announcement: 'bg-green-100 text-green-700',
  other: 'bg-slate-100 text-slate-700',
};

export default function NewsPage() {
  const [data, setData] = useState<Paginated<NewsItem> | null>(null);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await newsApi.list({ page, category: category || undefined });
      setData(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, category]);

  useEffect(() => { load(); }, [load]);

  const categories = ['', 'industry', 'government', 'technology', 'event', 'announcement'];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Industry News</h1>
        <p className="text-muted-foreground mt-2">Latest news and updates from Tamil Nadu&apos;s plastics industry.</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((c) => (
          <Button key={c} size="sm" variant={category === c ? 'default' : 'outline'}
            onClick={() => { setCategory(c); setPage(1); }} className="capitalize">
            {c || 'All'}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : !data || data.items.length === 0 ? (
        <div className="text-center py-24">
          <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">No news articles published yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Admins can publish news from the admin panel.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((n) => (
              <Card key={n.id} className="flex flex-col hover:border-primary/50 transition-colors">
                {n.thumbnail_url && (
                  <div className="h-40 overflow-hidden rounded-t-lg bg-muted">
                    <img src={n.thumbnail_url} alt={n.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`${categoryColors[n.category] ?? categoryColors.other} border-none text-xs capitalize`}>
                      {n.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <CardTitle className="text-base leading-snug line-clamp-2">{n.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-1">
                  {n.summary && <p className="text-sm text-muted-foreground line-clamp-3">{n.summary}</p>}
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
