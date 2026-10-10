'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiError, associationsApi, type Association } from '@/lib/api';
import { Loader2, Globe, Mail } from 'lucide-react';

export default function AssociationsPage() {
  const [items, setItems] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    associationsApi.list({ page: 1 })
      .then((r) => setItems(r.items))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load associations.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Industry Associations</h1>
      <p className="text-muted-foreground mb-8">Key plastics industry associations and bodies in Tamil Nadu.</p>
      {error && <p className="text-sm text-destructive mb-4">{error}</p>}
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No associations listed yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <Card key={a.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  {a.logo_url ? <img src={a.logo_url} alt={a.name} className="h-10 w-10 rounded-full object-cover" /> : <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{a.name[0]}</div>}
                  <div>
                    <CardTitle className="text-base">{a.name}</CardTitle>
                    {a.acronym && <p className="text-xs text-muted-foreground">{a.acronym}</p>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {a.description && <p className="text-muted-foreground line-clamp-3">{a.description}</p>}
                {a.headquarters && <p className="text-xs">📍 {a.headquarters}</p>}
                <div className="flex gap-3 pt-1">
                  {a.website && <a href={a.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 text-xs"><Globe className="h-3 w-3" />Website</a>}
                  {a.contact_email && <a href={`mailto:${a.contact_email}`} className="text-primary hover:underline flex items-center gap-1 text-xs"><Mail className="h-3 w-3" />Email</a>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
