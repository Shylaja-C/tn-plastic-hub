'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, Briefcase, Search, Loader2, IndianRupee, Calendar, SlidersHorizontal, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { internshipsApi, ApiError, type Internship, type Paginated } from '@/lib/api';

// ── Filter sidebar ────────────────────────────────────────────────────────────

const TYPES = ['full_time', 'part_time', 'remote', 'hybrid'] as const;
const STATUSES = ['open', 'closed'] as const;

type Filters = { status: string; type: string };

function FilterPanel({
  filters,
  onChange,
  onReset,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
}) {
  const active = filters.status !== '' || filters.type !== '';
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Filters</span>
        {active && (
          <button onClick={onReset} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      {/* Status */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Status</p>
        <div className="flex flex-col gap-1.5">
          {STATUSES.map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="status"
                value={s}
                checked={filters.status === s}
                onChange={() => onChange({ ...filters, status: filters.status === s ? '' : s })}
                className="accent-primary"
              />
              <span className="capitalize">{s}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Type */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Type</p>
        <div className="flex flex-col gap-1.5">
          {TYPES.map((t) => (
            <label key={t} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="type"
                value={t}
                checked={filters.type === t}
                onChange={() => onChange({ ...filters, type: filters.type === t ? '' : t })}
                className="accent-primary"
              />
              <span className="capitalize">{t.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Row item ──────────────────────────────────────────────────────────────────

function InternshipRow({ item }: { item: Internship }) {
  return (
    <Link href={`/internships/${item.id}`} className="block group">
      <div className="flex items-start gap-4 py-4 px-1 hover:bg-muted/40 rounded-md transition-colors">
        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-start gap-2 flex-wrap">
            <span className="font-semibold text-sm group-hover:text-primary transition-colors leading-snug">
              {item.title}
            </span>
            <Badge variant={item.status === 'open' ? 'default' : 'secondary'} className="capitalize text-xs shrink-0">
              {item.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            {item.company?.name ?? `Company #${item.company_id}`}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {item.location && (
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.location}</span>
            )}
            {item.duration_months && (
              <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{item.duration_months} mo</span>
            )}
            {item.stipend_amount != null && (
              <span className="flex items-center gap-1"><IndianRupee className="h-3 w-3" />₹{item.stipend_amount.toLocaleString()}/mo</span>
            )}
            {item.application_deadline && (
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due {new Date(item.application_deadline).toLocaleDateString()}</span>
            )}
          </div>
          {item.skills_required && (
            <div className="flex flex-wrap gap-1 pt-0.5">
              {item.skills_required.split(',').slice(0, 4).map((s) => (
                <Badge key={s} variant="outline" className="text-xs">{s.trim()}</Badge>
              ))}
            </div>
          )}
        </div>

        {/* Type badge — right side */}
        <Badge variant="secondary" className="capitalize text-xs shrink-0 mt-0.5">
          {item.internship_type.replace('_', ' ')}
        </Badge>
      </div>
    </Link>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function InternshipsPage() {
  const [data, setData] = useState<Paginated<Internship> | null>(null);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({ status: 'open', type: '' });
  const [sheetOpen, setSheetOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await internshipsApi.list({
        page,
        page_size: 15,
        search: query || undefined,
        status: (filters.status as 'open' | 'closed') || undefined,
      });
      setData(res);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to load internships.');
    } finally {
      setLoading(false);
    }
  }, [page, query, filters.status]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
    setPage(1);
  };

  const handleFilterChange = (f: Filters) => {
    setFilters(f);
    setPage(1);
    setSheetOpen(false);
  };

  const handleReset = () => {
    setFilters({ status: '', type: '' });
    setPage(1);
    setSheetOpen(false);
  };

  const activeFilterCount = (filters.status ? 1 : 0) + (filters.type ? 1 : 0);

  return (
    <div className="container mx-auto py-10 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Internships</h1>
        <p className="text-muted-foreground mt-1">Explore opportunities in Tamil Nadu&apos;s plastics industry.</p>
      </div>

      {/* Search + mobile filter toggle */}
      <div className="flex gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by role, skills..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {/* Mobile: sheet trigger */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger
            className="lg:hidden inline-flex items-center gap-2 border rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </SheetTrigger>
          <SheetContent side="left" className="w-72 pt-10">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterPanel filters={filters} onChange={handleFilterChange} onReset={handleReset} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Two-column layout */}
      <div className="flex gap-8 items-start">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-52 shrink-0 border rounded-lg p-5 sticky top-6">
          <FilterPanel filters={filters} onChange={handleFilterChange} onReset={handleReset} />
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-16 space-y-4">
              <p className="text-destructive font-medium">{error}</p>
              <Button variant="outline" onClick={load}>Retry</Button>
            </div>
          ) : !data || data.items.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              No internships found. Try adjusting your filters.
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-2">
                {data.total} internship{data.total !== 1 ? 's' : ''} found
              </p>

              {/* Divided row list */}
              <div className="divide-y border rounded-lg overflow-hidden">
                {data.items.map((item) => (
                  <div key={item.id} className="px-4">
                    <InternshipRow item={item} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground flex items-center px-2">
                    Page {page} of {data.pages}
                  </span>
                  <Button variant="outline" size="sm" disabled={page >= data.pages} onClick={() => setPage((p) => p + 1)}>
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
