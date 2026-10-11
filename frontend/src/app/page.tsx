import { Suspense } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  IndianRupee,
  Recycle,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Building2,
  Layers,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Factory
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchForm } from '@/components/SearchForm';
import { LogoIcon } from '@/components/layout/Logo';

// ── Server-side fetch helpers (Backend intact) ──────────────────────────────────
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api/v1';

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

interface Paginated<T> { items: T[]; total: number }

interface Internship {
  id: number; title: string; company_id: number;
  location?: string; stipend_amount?: number; application_deadline?: string;
  company?: { name: string };
}

interface Visit {
  id: number; title: string; visit_date: string;
  max_participants: number; location?: string;
  company?: { name: string };
}

interface NewsItem { id: number; title: string; slug: string; category: string }
interface Scheme  { id: number; title: string; category: string; scheme_url?: string }

// ── Skeleton UI loaders ────────────────────────────────────────────────────────
function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl border border-border bg-card space-y-3">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="pt-2 flex justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

function HeadlineSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <ul className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <li key={i} className="p-2"><Skeleton className="h-4 w-full" /></li>
      ))}
    </ul>
  );
}

// ── Async Backend Sections ─────────────────────────────────────────────────────
async function InternshipRows() {
  const data = await fetchJson<Paginated<Internship>>('/internships?page=1&page_size=4&status=open');
  const items = data?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-slate-50/50 dark:bg-slate-900/50">
        <p className="text-sm text-muted-foreground mb-2">No open internships currently listed.</p>
        <Link href="/internships" className="text-sm font-semibold text-primary hover:underline">
          Browse all programs →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((i) => (
        <div
          key={i.id}
          className="p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-full border border-teal-200/60 dark:border-teal-800/60">
                Internship
              </span>
              {i.stipend_amount != null && (
                <span className="text-xs font-bold text-foreground flex items-center">
                  <IndianRupee className="h-3 w-3" />{i.stipend_amount.toLocaleString('en-IN')}/mo
                </span>
              )}
            </div>

            <Link
              href={`/internships/${i.id}`}
              className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1"
            >
              {i.title}
            </Link>

            <p className="text-xs text-muted-foreground mt-1 line-clamp-1 font-medium">
              {i.company?.name ?? `Company #${i.company_id}`}
            </p>

            <div className="flex flex-wrap gap-y-1 gap-x-3 mt-3 text-xs text-muted-foreground">
              {i.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />{i.location}
                </span>
              )}
              {i.application_deadline && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Due {new Date(i.application_deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/internships/${i.id}`}
            className="mt-4 pt-3 border-t border-border/60 text-xs font-bold text-primary group-hover:translate-x-0.5 transition-transform flex items-center justify-between"
          >
            <span>Apply Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ))}
    </div>
  );
}

async function VisitList() {
  const data = await fetchJson<Paginated<Visit>>('/industrial-visits?page=1&page_size=3&status=upcoming');
  const items = data?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-slate-50/50">
        <p className="text-sm text-muted-foreground mb-2">No upcoming industrial visits scheduled.</p>
        <Link href="/industrial-visits" className="text-sm font-semibold text-primary hover:underline">
          View schedule & request tours →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((v) => (
        <div key={v.id} className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-2">
              <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(v.visit_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-[11px]">
                {v.max_participants} seats max
              </span>
            </div>

            <h3 className="text-base font-bold text-foreground leading-snug">{v.title}</h3>
            {v.company?.name && <p className="text-xs text-muted-foreground mt-1">{v.company.name}</p>}

            {v.location && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <MapPin className="h-3.5 w-3.5 text-primary" />{v.location}
              </p>
            )}
          </div>

          <Link href="/industrial-visits" className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-primary hover:underline">
            <span>Book Seat</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ))}
    </div>
  );
}

async function NewsHeadlines() {
  const data = await fetchJson<Paginated<NewsItem>>('/news?page=1&page_size=4&status=published');
  const items = data?.items ?? [];

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No news announcements published yet.</p>;
  }

  return (
    <ul className="divide-y divide-border/70">
      {items.map((n) => (
        <li key={n.id} className="py-3 group">
          <Link href="/news" className="flex items-start justify-between gap-3 text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
            <span>{n.title}</span>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

async function SchemeHeadlines() {
  const data = await fetchJson<Paginated<Scheme>>('/schemes?page=1&page_size=4&status=active');
  const items = data?.items ?? [];

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No government schemes listed yet.</p>;
  }

  return (
    <ul className="divide-y divide-border/70">
      {items.map((s) => (
        <li key={s.id} className="py-3 group">
          {s.scheme_url ? (
            <a
              href={s.scheme_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between gap-3 text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug"
            >
              <span>{s.title}</span>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            </a>
          ) : (
            <Link href="/schemes" className="flex items-start justify-between gap-3 text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
              <span>{s.title}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}

// ── Curated Featured Plastic Materials / Scrap Offerings ─────────────────────────
const featuredProducts = [
  {
    id: 1,
    title: 'Hot-Washed PET Clear Bottle Flakes',
    category: 'PET Flakes',
    form: 'Flakes (< 12mm)',
    price: '₹54 / kg',
    quantity: '25 Metric Tons',
    location: 'Coimbatore, Tamil Nadu',
    verified: true,
    grade: 'Purity > 99.2%, PVC < 50ppm',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
  },
  {
    id: 2,
    title: 'HDPE Blue Drum Regrind (Blow Grade)',
    category: 'HDPE Regrind',
    form: 'Granules / Regrind',
    price: '₹68 / kg',
    quantity: '18 Metric Tons',
    location: 'Tiruppur, Tamil Nadu',
    verified: true,
    grade: 'MFI: 0.35 - 0.45 g/10min',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
  },
  {
    id: 3,
    title: 'Post-Industrial LDPE Clean Film Scrap',
    category: 'LDPE Scrap',
    form: 'Baled Film',
    price: '₹42 / kg',
    quantity: '40 Metric Tons',
    location: 'Sriperumbudur, Kanchipuram',
    verified: true,
    grade: 'Moisture < 1.5%, Natural Clear',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
  },
  {
    id: 4,
    title: 'Reprocessed PP Copolymer Black Pellets',
    category: 'PP Granules',
    form: 'Extruded Pellets',
    price: '₹76 / kg',
    quantity: '30 Metric Tons',
    location: 'Salem, Tamil Nadu',
    verified: true,
    grade: 'Impact modified, Automotive grade',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">

      {/* ── 1. Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative border-b border-border bg-gradient-to-b from-teal-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 pt-10 pb-16 lg:pt-16 lg:pb-24">
        
        {/* Subtle background circular glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Value Prop + Action */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/80 dark:bg-teal-950/80 border border-teal-300/80 dark:border-teal-700/60 text-teal-900 dark:text-teal-200 text-xs font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Tamil Nadu Circular Plastics & Recycling Exchange
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-[1.15] text-foreground">
                Connecting Plastic Waste, Recyclers & Industries across{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-amber-600">
                  Tamil Nadu
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl font-normal">
                Trade verified plastic scrap, PET flakes, and reprocessed granules with guaranteed purity and transparent pricing. Access SIPCOT incentives, TNPCB approvals, and student industry talent in one platform.
              </p>

              {/* 2 Primary CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    <Recycle className="w-4 h-4 mr-2" />
                    Explore Marketplace
                  </Button>
                </Link>

                <Link href="/register">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-6 rounded-xl border-border bg-white dark:bg-slate-800 text-foreground hover:bg-slate-100 font-bold text-sm shadow-sm hover:border-primary/50 transition-all"
                  >
                    Join as Recycler / Supplier
                  </Button>
                </Link>
              </div>

              {/* Search Form component */}
              <div className="pt-2 max-w-xl">
                <SearchForm />
              </div>

              {/* Mini trust checklist */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs font-semibold text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5 text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  TNPCB & SIPCOT Aligned
                </span>
                <span className="flex items-center gap-1.5 text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  EPR Credit Facilitation
                </span>
                <span className="flex items-center gap-1.5 text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Direct Factory-to-Factory Rates
                </span>
              </div>

            </div>

            {/* Right Column: Visual Eco-Industrial Hub Card / Illustration */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-secondary to-teal-950 text-white shadow-2xl border border-teal-500/30 overflow-hidden">
                
                {/* Visual recycling flow lines overlay */}
                <div className="absolute -right-8 -bottom-8 opacity-20 pointer-events-none">
                  <LogoIcon size={240} />
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center">
                      <LogoIcon size={24} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-teal-300 uppercase tracking-widest">TN Plastic Hub</div>
                      <div className="text-sm font-semibold text-white">State Circular Engine</div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Live TN Rates
                  </span>
                </div>

                {/* Interactive polymer rate cards */}
                <div className="space-y-3 relative z-10">
                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-teal-200 font-medium">PET Bottle Flakes (Clear)</span>
                      <p className="text-sm font-bold text-white">Coimbatore & Erode Clusters</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-amber-400">₹52 - ₹56 / kg</div>
                      <span className="text-[10px] text-emerald-400 font-medium">↑ High Demand</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-teal-200 font-medium">HDPE Blow Molding Regrind</span>
                      <p className="text-sm font-bold text-white">Chennai & Ranipet Hubs</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-amber-400">₹66 - ₹71 / kg</div>
                      <span className="text-[10px] text-teal-300 font-medium">Stable</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-teal-200 font-medium">PP Injection Reprocessed</span>
                      <p className="text-sm font-bold text-white">Madurai & Salem Units</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-amber-400">₹74 - ₹79 / kg</div>
                      <span className="text-[10px] text-emerald-400 font-medium">↑ Active Inquiries</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Verified GST & Pollution Clearance
                  </span>
                  <Link href="/products" className="font-bold text-amber-300 hover:underline">
                    Trade Now →
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. Key Stats Strip ─────────────────────────────────────────────────── */}
      <section className="bg-secondary text-white py-10 border-b border-secondary/80">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center sm:text-left">
            
            <div className="border-r border-white/10 last:border-none pr-4">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400">
                18,400+ MT
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                Plastic Waste Reprocessed
              </p>
            </div>

            <div className="border-r border-white/10 last:border-none pr-4">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-teal-300">
                850+ Units
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                Active Recyclers & Compounders
              </p>
            </div>

            <div className="border-r border-white/10 last:border-none pr-4">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400">
                38 Districts
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                Tamil Nadu Wide Logistics
              </p>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-teal-300">
                ₹14.8 Cr+
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                Facilitated Trade & Subsidies
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. How It Works (4 Simple Steps) ───────────────────────────────────── */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Simple & Transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
              How TN Plastic Hub Works
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              From plastic waste segregation to certified recycled compound manufacturing in 4 streamlined steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl border border-border/80 bg-slate-50/60 dark:bg-slate-800/40 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white font-black flex items-center justify-center text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-foreground">Source & Post Scrap</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Aggregators & factories list scrap materials (bottles, films, drums, purge) with quantity and Tamil Nadu district location.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-slate-50/60 dark:bg-slate-800/40 relative">
              <div className="w-10 h-10 rounded-xl bg-teal-700 text-white font-black flex items-center justify-center text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-foreground">Verified Matching</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Connect directly with TNPCB-compliant reprocessors and granulation units with transparent quote comparisons.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-slate-50/60 dark:bg-slate-800/40 relative">
              <div className="w-10 h-10 rounded-xl bg-secondary text-white font-black flex items-center justify-center text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-foreground">Quality & Lab Testing</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Ensure polymer grade (MFI, moisture content, ash percentage, tensile strength) meets manufacturing specifications.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-border/80 bg-slate-50/60 dark:bg-slate-800/40 relative">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm mb-4">
                04
              </div>
              <h3 className="text-base font-bold text-foreground">Close Loop & EPR Credits</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Complete transacting, obtain EPR recycling certificates, and redirect materials into high-value manufacturing.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. Featured Categories & Marketplace Listings ────────────────────────── */}
      <section className="py-16 bg-slate-50/70 dark:bg-slate-950/70 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                Verified Exchange
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
                Featured Materials & Recycled Polymers
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Real-time stock lots available from verified suppliers in Tamil Nadu industrial corridors.
              </p>
            </div>
            <Link href="/products" className="shrink-0">
              <Button variant="outline" className="rounded-xl font-bold text-xs gap-1">
                View All Marketplace Lots <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${p.badgeColor}`}>
                      {p.category}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                    {p.title}
                  </h3>

                  <div className="space-y-1.5 mt-3 text-xs text-muted-foreground">
                    <p className="text-foreground font-semibold">
                      Spec: <span className="font-normal text-muted-foreground">{p.grade}</span>
                    </p>
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> {p.location}
                    </p>
                    <p className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-muted-foreground" /> Lot: {p.quantity}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-border/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Ex-Factory Rate</span>
                    <div className="text-base font-extrabold text-foreground">{p.price}</div>
                  </div>
                  <Link href={`/products/${p.id}`}>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold">
                      Inquire / Buy
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Live Ecosystem Sections (Internships & Industrial Visits) ─────────── */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 space-y-14">

          {/* Internships Strip */}
          <div>
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Talent Pipeline
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  Latest Plastics Industry Internships
                </h2>
              </div>
              <Link href="/internships" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                Browse all openings <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <Suspense fallback={<CardSkeleton count={4} />}>
              <InternshipRows />
            </Suspense>
          </div>

          {/* Industrial Visits Strip */}
          <div className="pt-8 border-t border-border/70">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Factory Exposure
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  Upcoming Industrial Plant Visits
                </h2>
              </div>
              <Link href="/industrial-visits" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                View all tours <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <Suspense fallback={<CardSkeleton count={3} />}>
              <VisitList />
            </Suspense>
          </div>

        </div>
      </section>

      {/* ── 6. News & Government Schemes 2-Column ───────────────────────────────── */}
      <section className="py-14 bg-slate-50 dark:bg-slate-950/40 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

            {/* News */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm">
              <div className="flex items-baseline justify-between mb-4 border-b border-border/80 pb-3">
                <h3 className="text-lg font-bold text-foreground">Industry News & Trends</h3>
                <Link href="/news" className="text-xs font-bold text-primary hover:underline">
                  All updates →
                </Link>
              </div>
              <Suspense fallback={<HeadlineSkeleton rows={4} />}>
                <NewsHeadlines />
              </Suspense>
            </div>

            {/* Schemes */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm">
              <div className="flex items-baseline justify-between mb-4 border-b border-border/80 pb-3">
                <h3 className="text-lg font-bold text-foreground">Government Subsidies & Schemes</h3>
                <Link href="/schemes" className="text-xs font-bold text-primary hover:underline">
                  All schemes →
                </Link>
              </div>
              <Suspense fallback={<HeadlineSkeleton rows={4} />}>
                <SchemeHeadlines />
              </Suspense>
            </div>

          </div>
        </div>
      </section>

      {/* ── 7. Testimonials & Trusted Partners Section ─────────────────────────── */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
              Reputation & Trust
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
              Endorsed by Tamil Nadu&apos;s Eco-Industrial Leaders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl border border-border bg-slate-50/60 dark:bg-slate-800/40">
              <p className="text-xs sm:text-sm text-foreground leading-relaxed italic">
                &ldquo;TN Plastic Hub helped our recycling facility source over 45 metric tons of clean PET baled flakes directly from textile aggregators in Tiruppur. Transparent rates and verified lots.&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                  R
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">R. Sundararajan</h4>
                  <p className="text-[11px] text-muted-foreground">MD, Kongu Polymer Recyclers, Coimbatore</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-slate-50/60 dark:bg-slate-800/40">
              <p className="text-xs sm:text-sm text-foreground leading-relaxed italic">
                &ldquo;Obtaining TNPCB consent guidelines and SIPCOT plastics cluster applications was seamless through the portal&apos;s Industry Setup section. It saved our new compounding unit months.&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary text-white font-bold text-xs flex items-center justify-center">
                  P
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Priya Manickam</h4>
                  <p className="text-[11px] text-muted-foreground">Founder, EcoPellets Manufacturing, Ranipet</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-slate-50/60 dark:bg-slate-800/40">
              <p className="text-xs sm:text-sm text-foreground leading-relaxed italic">
                &ldquo;Our polymer technology students from PSG and CIPET secured core manufacturing internships directly via TNPlasticHub. It&apos;s a game changer for industry talent.&rdquo;
              </p>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                  D
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Dr. K. Jayachandran</h4>
                  <p className="text-[11px] text-muted-foreground">Head of Polymer Science, Guindy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Partner logos / network banners */}
          <div className="pt-6 border-t border-border/60 text-center">
            <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground mb-4">
              Collaborating Across Tamil Nadu Industrial Ecosystem
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-bold text-foreground/70">
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">SIPCOT Industrial Parks</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">CIPET Plastics Institute</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">TNPCB Circular Guidelines</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">TAPMA Manufacturers</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">TIDCO Innovation Clusters</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 8. Final CTA Banner ────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-teal-900 via-secondary to-slate-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Join the Clean Tamil Nadu Industry Movement
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Ready to turn plastic waste into verified manufacturing value?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
            Whether you are a scrap collector, recycling factory, compounder or enterprise needing EPR compliance, TN Plastic Hub is your trusted regional partner.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link href="/register">
              <Button
                size="lg"
                className="h-12 px-7 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg hover:shadow-xl transition-all"
              >
                Register Your Unit / Account
              </Button>
            </Link>
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-7 rounded-xl border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold text-sm"
              >
                Browse Materials Exchange
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
