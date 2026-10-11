'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  MapPin,
  ShieldCheck,
  Layers,
  ArrowUpDown,
  Tag,
  CheckCircle2,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductItem {
  id: number;
  title: string;
  category: 'PET' | 'HDPE' | 'LDPE' | 'PP' | 'ABS' | 'Bio';
  categoryLabel: string;
  form: string;
  pricePerKg: number;
  minOrderTons: number;
  quantityTons: number;
  location: string;
  district: string;
  supplier: string;
  verified: boolean;
  mfi: string;
  purity: string;
  color: string;
  tnpcbCompliant: boolean;
  description: string;
}

const mockProducts: ProductItem[] = [
  {
    id: 1,
    title: 'Hot-Washed Clear PET Bottle Flakes',
    category: 'PET',
    categoryLabel: 'PET Flakes',
    form: 'Flakes (< 12mm)',
    pricePerKg: 54,
    minOrderTons: 5,
    quantityTons: 28,
    location: 'Sulur Industrial Estate',
    district: 'Coimbatore',
    supplier: 'Kongu Green Polymers Pvt Ltd',
    verified: true,
    mfi: '0.78 - 0.82 dl/g IV',
    purity: '99.4% (PVC < 30ppm)',
    color: 'Crystal Clear Natural',
    tnpcbCompliant: true,
    description: 'Hot washed, friction separated clear PET flakes suitable for polyester staple fiber (PSF) and thermoforming sheet extrusion.',
  },
  {
    id: 2,
    title: 'HDPE Blue Drum Regrind (Blow Grade)',
    category: 'HDPE',
    categoryLabel: 'HDPE Regrind',
    form: 'Granules / Regrind',
    pricePerKg: 68,
    minOrderTons: 3,
    quantityTons: 20,
    location: 'Perundurai SIPCOT',
    district: 'Erode',
    supplier: 'Cauvery Plastic Reprocessors',
    verified: true,
    mfi: '0.35 g/10min',
    purity: '98.8%',
    color: 'Ocean Blue',
    tnpcbCompliant: true,
    description: 'Crushed and washed blow-molding grade drums scrap. Uniform flake size with negligible oil residues. Ideal for pipe and drum extrusion.',
  },
  {
    id: 3,
    title: 'Clean Post-Industrial LDPE Film Bales',
    category: 'LDPE',
    categoryLabel: 'LDPE Scrap',
    form: 'Baled Film',
    pricePerKg: 42,
    minOrderTons: 10,
    quantityTons: 45,
    location: 'Sriperumbudur Auto Corridor',
    district: 'Kanchipuram',
    supplier: 'Apex Circular Logistics TN',
    verified: true,
    mfi: '1.8 - 2.2 g/10min',
    purity: '99.1% (Dry Baled)',
    color: 'Transparent 98/2',
    tnpcbCompliant: true,
    description: 'Clean warehouse packaging film and stretch wrap baled on-site. Moisture under 1.5%. Excellent melt strength for reprocessing.',
  },
  {
    id: 4,
    title: 'PP Copolymer Reprocessed Black Granules',
    category: 'PP',
    categoryLabel: 'PP Granules',
    form: 'Extruded Pellets',
    pricePerKg: 76,
    minOrderTons: 2,
    quantityTons: 32,
    location: 'Shevapet Industrial Area',
    district: 'Salem',
    supplier: 'Salem Poly-Compounders',
    verified: true,
    mfi: '12 - 14 g/10min',
    purity: 'Filter Mesh 100x100',
    color: 'Jet Black Glossy',
    tnpcbCompliant: true,
    description: 'Filtered through double vacuum degassing extruder. High impact strength for battery casings, crates, and automotive brackets.',
  },
  {
    id: 5,
    title: 'Recycled ABS High Impact Flakes (Electronic Scrap)',
    category: 'ABS',
    categoryLabel: 'ABS Regrind',
    form: 'Regrind Flakes',
    pricePerKg: 92,
    minOrderTons: 2,
    quantityTons: 15,
    location: 'Ambattur Industrial Estate',
    district: 'Chennai',
    supplier: 'Madras E-Waste & Polymer Recyclers',
    verified: true,
    mfi: '2.5 g/10min',
    purity: 'Flame Retardant Free',
    color: 'White & Grey sorted',
    tnpcbCompliant: true,
    description: 'Sink-float separated TV and printer casing ABS regrind. Impact strength tested according to ASTM D256 standards.',
  },
  {
    id: 6,
    title: 'Certified Compostable PLA/PBAT Granules',
    category: 'Bio',
    categoryLabel: 'Bio-Polymer',
    form: 'Virgin Pellets',
    pricePerKg: 165,
    minOrderTons: 1,
    quantityTons: 12,
    location: 'SIDCO Industrial Estate, Kurichi',
    district: 'Coimbatore',
    supplier: 'Tamil Bio-Plastics Corporation',
    verified: true,
    mfi: '4.0 g/10min',
    purity: '100% Bio-Certified (CIPET)',
    color: 'Milky White',
    tnpcbCompliant: true,
    description: 'Certified ISO 17088 biodegradable polymer resin for shopping bags, mulch films, and food packaging approved under Tamil Nadu Green Mission.',
  },
  {
    id: 7,
    title: 'HDPE Milky White Injection Molding Pellets',
    category: 'HDPE',
    categoryLabel: 'HDPE Granules',
    form: 'Pellets',
    pricePerKg: 82,
    minOrderTons: 2,
    quantityTons: 25,
    location: 'Madurai SIPCOT',
    district: 'Madurai',
    supplier: 'Pandian Polymers & Recycling',
    verified: true,
    mfi: '7.0 g/10min',
    purity: '99.5%',
    color: 'Milky White',
    tnpcbCompliant: true,
    description: 'High flow injection grade reprocessed pellets for caps, household containers, and automotive components.',
  },
  {
    id: 8,
    title: 'Post-Consumer PET Green Bottle Flakes',
    category: 'PET',
    categoryLabel: 'PET Flakes',
    form: 'Flakes (< 10mm)',
    pricePerKg: 46,
    minOrderTons: 5,
    quantityTons: 18,
    location: 'Tiruppur Knitting Cluster',
    district: 'Tiruppur',
    supplier: 'Noyyal Eco Reclaimers',
    verified: true,
    mfi: '0.74 dl/g',
    purity: '98.5%',
    color: 'Emerald Green',
    tnpcbCompliant: true,
    description: 'Green soda bottle washed flakes suitable for strapping band manufacturing and geo-textiles.',
  },
];

const categories = ['All', 'PET', 'HDPE', 'LDPE', 'PP', 'ABS', 'Bio'] as const;
const districts = ['All Districts', 'Coimbatore', 'Chennai', 'Erode', 'Tiruppur', 'Salem', 'Kanchipuram', 'Madurai'];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'qty-desc'>('price-asc');
  
  // Quick Quote Modal state
  const [quoteProduct, setQuoteProduct] = useState<ProductItem | null>(null);
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: '', phone: '', qtyTons: '5' });

  const filteredProducts = useMemo(() => {
    return mockProducts
      .filter((p) => {
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesDistrict = selectedDistrict === 'All Districts' || p.district === selectedDistrict;
        const matchesSearch =
          !search.trim() ||
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.supplier.toLowerCase().includes(search.toLowerCase()) ||
          p.district.toLowerCase().includes(search.toLowerCase()) ||
          p.color.toLowerCase().includes(search.toLowerCase());

        return matchesCategory && matchesDistrict && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerKg - b.pricePerKg;
        if (sortBy === 'price-desc') return b.pricePerKg - a.pricePerKg;
        if (sortBy === 'qty-desc') return b.quantityTons - a.quantityTons;
        return 0;
      });
  }, [selectedCategory, selectedDistrict, search, sortBy]);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteSuccess(false);
      setQuoteProduct(null);
      setQuoteForm({ name: '', phone: '', qtyTons: '5' });
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-7xl">
      
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-semibold">Plastic Materials Marketplace</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Tamil Nadu Plastic Materials & Scrap Marketplace
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Buy and sell verified PET flakes, HDPE regrind, LDPE film scrap, and reprocessed polymers with direct ex-factory pricing from Tamil Nadu reprocessors.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{filteredProducts.length} Lots Available Today</span>
          </div>
        </div>
      </div>

      {/* ── Filters & Search Control Bar ─────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm mb-8 space-y-4">
        
        {/* Row 1: Search & District + Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by polymer name, color, supplier, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
            >
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
              <option value="qty-desc">Sort: Available Quantity</option>
            </select>
          </div>

        </div>

        {/* Row 2: Category Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs font-bold text-muted-foreground uppercase mr-2 shrink-0">
            Polymer:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* ── Product Cards Grid ───────────────────────────────────────── */}
      {filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-slate-50/50 dark:bg-slate-900/40 my-6">
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No material lots found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1 mb-5">
            We couldn&apos;t find any active lots matching your search criteria. Try resetting filters or request a custom lot from Tamil Nadu suppliers.
          </p>
          <Button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDistrict('All Districts');
              setSearch('');
            }}
            variant="outline"
            className="rounded-xl font-bold text-xs"
          >
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Tag + Verified badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    {p.categoryLabel}
                  </span>
                  {p.verified && (
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                </div>

                <Link
                  href={`/products/${p.id}`}
                  className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2"
                >
                  {p.title}
                </Link>

                <p className="text-xs text-muted-foreground mt-1 line-clamp-1 font-medium">
                  {p.supplier}
                </p>

                {/* Specs Pill Summary */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-border/70 space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Melt Flow (MFI):</span>
                    <span className="font-semibold text-foreground">{p.mfi}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Purity / Grade:</span>
                    <span className="font-semibold text-foreground">{p.purity}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Color & Form:</span>
                    <span className="font-semibold text-foreground">{p.color}</span>
                  </div>
                </div>

                {/* Location & Quantity info */}
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{p.location}, {p.district}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span>Stock: <strong className="text-foreground">{p.quantityTons} Tons</strong> (Min: {p.minOrderTons}T)</span>
                  </div>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">Ex-Factory</span>
                  <div className="text-lg font-black text-foreground">
                    ₹{p.pricePerKg} <span className="text-xs font-normal text-muted-foreground">/ kg</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <Link href={`/products/${p.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-bold px-2.5 h-8"
                    >
                      Details
                    </Button>
                  </Link>

                  <Button
                    size="sm"
                    onClick={() => setQuoteProduct(p)}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold px-3 h-8"
                  >
                    Quote
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Quick Quote Modal ────────────────────────────────────────── */}
      {quoteProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setQuoteProduct(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            {quoteSuccess ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-foreground">Quote Request Dispatched!</h3>
                <p className="text-xs text-muted-foreground">
                  The verified supplier ({quoteProduct.supplier}) and our regional coordinator will call or WhatsApp you within 2 business hours.
                </p>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">
                  Direct Factory Inquiry
                </span>
                <h3 className="text-lg font-extrabold text-foreground mt-0.5">
                  Request Quote & Samples
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Material: <strong className="text-foreground">{quoteProduct.title}</strong> ({quoteProduct.district})
                </p>

                <form onSubmit={handleQuoteSubmit} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-semibold text-foreground">Your Name / Company *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Plastics, Chennai"
                      value={quoteForm.name}
                      onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-xs text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98XXXXXXXX"
                      value={quoteForm.phone}
                      onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-xs text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-foreground">Required Quantity (Metric Tons)</label>
                    <input
                      type="number"
                      min={quoteProduct.minOrderTons}
                      value={quoteForm.qtyTons}
                      onChange={(e) => setQuoteForm({ ...quoteForm, qtyTons: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-xs text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
                    />
                    <span className="text-[10px] text-muted-foreground">
                      Minimum order quantity: {quoteProduct.minOrderTons} Metric Tons
                    </span>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-bold">
                      Send Instant Inquiry
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
