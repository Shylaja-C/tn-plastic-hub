'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ApiError, technologiesApi, type Technology } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function TechnologiesPage() {
  const [items, setItems] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    technologiesApi.list({ page: 1 })
      .then((r) => setItems(r.items))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load technologies.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Plastics Technologies</h1>
      <p className="text-muted-foreground mb-8">Modern technologies transforming the plastics industry.</p>
      {error && <p className="text-sm text-destructive mb-4">{error}</p>}
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No technologies listed yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <Card key={t.id}>
              {t.image_url && <img src={t.image_url} alt={t.name} className="w-full h-40 object-cover rounded-t-lg" />}
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{t.name}</CardTitle>
                  <Badge variant="secondary" className="capitalize">{t.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {t.description && <p className="line-clamp-3">{t.description}</p>}
                {t.applications && <p><span className="font-medium text-foreground">Applications:</span> {t.applications}</p>}
                {t.advantages && <p><span className="font-medium text-foreground">Advantages:</span> {t.advantages}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
