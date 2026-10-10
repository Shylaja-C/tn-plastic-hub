'use client';

import { useEffect, useState, useCallback } from 'react';
import { CreditCard, ExternalLink, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { loansApi, type Loan, type Paginated } from '@/lib/api';

const categoryColors: Record<string, string> = {
  term_loan: 'bg-blue-100 text-blue-700',
  working_capital: 'bg-green-100 text-green-700',
  equipment: 'bg-orange-100 text-orange-700',
  startup: 'bg-purple-100 text-purple-700',
  msme: 'bg-cyan-100 text-cyan-700',
  other: 'bg-slate-100 text-slate-700',
};

export default function LoansPage() {
  const [data, setData] = useState<Paginated<Loan> | null>(null);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await loansApi.list({ page, category: category || undefined });
      setData(res);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, category]);

  useEffect(() => { load(); }, [load]);

  const categories = ['', 'term_loan', 'working_capital', 'equipment', 'startup', 'msme'];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Financial Assistance</h1>
        <p className="text-muted-foreground mt-2">Loans and credit facilities for plastics industry businesses.</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map((c) => (
          <Button key={c} size="sm" variant={category === c ? 'default' : 'outline'}
            onClick={() => { setCategory(c); setPage(1); }} className="capitalize">
            {c ? c.replace('_', ' ') : 'All Types'}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : !data || data.items.length === 0 ? (
        <div className="text-center py-24">
          <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">No loan schemes available yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Admins can add loan schemes from the admin panel.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((l) => (
              <Card key={l.id} className="flex flex-col hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-tight">{l.title}</CardTitle>
                    {l.is_featured && <Badge className="shrink-0 bg-amber-100 text-amber-700 border-none">Featured</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">{l.provider}</p>
                  <Badge className={`${categoryColors[l.category] ?? categoryColors.other} border-none text-xs w-fit capitalize`}>
                    {l.category.replace('_', ' ')}
                  </Badge>
                </CardHeader>
                <CardContent className="flex flex-col flex-1 gap-3">
                  {l.description && <p className="text-sm text-muted-foreground line-clamp-3">{l.description}</p>}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {(l.interest_rate_min || l.interest_rate_max) && (
                      <div className="rounded bg-muted p-2">
                        <p className="font-semibold text-foreground">Interest Rate</p>
                        <p className="text-muted-foreground">{l.interest_rate_min}{l.interest_rate_max ? `–${l.interest_rate_max}` : ''}</p>
                      </div>
                    )}
                    {l.max_amount && (
                      <div className="rounded bg-muted p-2">
                        <p className="font-semibold text-foreground">Max Amount</p>
                        <p className="text-muted-foreground">₹{l.max_amount} L</p>
                      </div>
                    )}
                    {l.collateral_required !== undefined && (
                      <div className="rounded bg-muted p-2">
                        <p className="font-semibold text-foreground">Collateral</p>
                        <p className="text-muted-foreground">{l.collateral_required ? 'Required' : 'Not required'}</p>
                      </div>
                    )}
                  </div>
                  {l.application_url && (
                    <a href={l.application_url} target="_blank" rel="noopener noreferrer"
                      className="mt-auto flex items-center gap-1 text-sm text-primary hover:underline">
                      Apply Now <ExternalLink className="h-3 w-3" />
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
