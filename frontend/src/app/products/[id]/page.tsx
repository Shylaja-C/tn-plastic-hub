'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronRight,
  ShieldCheck,
  MapPin,
  Layers,
  FileCheck,
  CheckCircle2,
  Clock,
  Building2,
  Phone,
  Mail,
  ArrowLeft,
  Truck,
  Award,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock product repository matching the marketplace
const mockProductsRecord: Record<string, any> = {
  '1': {
    id: 1,
    title: 'Hot-Washed Clear PET Bottle Flakes',
    category: 'PET Flakes',
    polymer: 'Polyethylene Terephthalate',
    form: 'Flakes (< 12mm)',
    pricePerKg: 54,
    minOrderTons: 5,
    quantityTons: 28,
    location: 'Sulur Industrial Cluster, Coimbatore',
    district: 'Coimbatore',
    supplier: 'Kongu Green Polymers Pvt Ltd',
    verified: true,
    mfi: '0.78 - 0.82 dl/g Intrinsic Viscosity',
    purity: '99.4% (PVC < 30 ppm, Polyolefin < 50 ppm)',
    color: 'Crystal Clear Natural (Cold Wash & Hot Caustic Wash)',
    moisture: '< 0.8% after spin dry',
    tnpcbConsentNo: 'TNPCB/RO-CBE/CTO-R-19842',
    description: 'Triple-sorted post-consumer PET bottles processed through high-temperature caustic hot-washing, optical color sorting, and metal separation. Ideal for polyester filament, strapping tape, and sheet manufacturing.',
  },
  '2': {
    id: 2,
    title: 'HDPE Blue Drum Regrind (Blow Grade)',
    category: 'HDPE Regrind',
    polymer: 'High-Density Polyethylene',
    form: 'Clean Regrind Flakes',
    pricePerKg: 68,
    minOrderTons: 3,
    quantityTons: 20,
    location: 'Perundurai SIPCOT, Erode',
    district: 'Erode',
    supplier: 'Cauvery Plastic Reprocessors',
    verified: true,
    mfi: '0.35 - 0.45 g/10min (190°C / 2.16kg)',
    purity: '98.8% Single Polymer Content',
    color: 'Ocean Blue',
    moisture: '< 0.5%',
    tnpcbConsentNo: 'TNPCB/RO-ERD/CTO-A-44321',
    description: 'Post-industrial clean chemical and lubricant 200L drums decontaminated and chipped into uniform 8-10mm flakes. Excellent environmental stress crack resistance (ESCR).',
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const idStr = Array.isArray(params?.id) ? params.id[0] : params?.id ?? '1';
  const product = mockProductsRecord[idStr] || mockProductsRecord['1'];

  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    quantity: '5',
    destinationDistrict: 'Coimbatore',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl">
      
      {/* ── Breadcrumb & Back Link ─────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/products" className="inline-flex items-center gap-1 hover:text-primary font-semibold">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Marketplace
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span>{product.category}</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-semibold truncate max-w-xs">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Left Column: Product Specifications & Verification ─────── */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-sm space-y-4">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {product.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                TNPCB Certified Facility
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                In Stock ({product.quantityTons} MT Available)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {product.title}
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="pt-4 border-t border-border flex items-baseline gap-2">
              <span className="text-3xl font-black text-foreground">₹{product.pricePerKg}</span>
              <span className="text-sm text-muted-foreground font-medium">/ kg (Ex-Factory)</span>
              <span className="text-xs text-muted-foreground ml-auto">
                Min. Order: <strong>{product.minOrderTons} MT</strong>
              </span>
            </div>

          </div>

          {/* Technical Specifications Table */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-primary" />
              Polymer Specifications & Lab Standards
            </h2>

            <div className="divide-y divide-border/70 text-xs sm:text-sm">
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground font-medium">Polymer Base</span>
                <span className="font-semibold text-foreground text-right">{product.polymer}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground font-medium">Form / Granulometry</span>
                <span className="font-semibold text-foreground text-right">{product.form}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground font-medium">Melt Flow / Intrinsic Viscosity</span>
                <span className="font-semibold text-foreground text-right">{product.mfi}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground font-medium">Purity / Contamination Limits</span>
                <span className="font-semibold text-foreground text-right">{product.purity}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground font-medium">Visual Shade & Color</span>
                <span className="font-semibold text-foreground text-right">{product.color}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground font-medium">Residual Moisture</span>
                <span className="font-semibold text-foreground text-right">{product.moisture}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-muted-foreground font-medium">State PCB Consent Order</span>
                <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400 text-right">
                  {product.tnpcbConsentNo}
                </span>
              </div>
            </div>
          </div>

          {/* Supplier Trust & Logistics Note */}
          <div className="p-6 rounded-3xl border border-border bg-slate-50 dark:bg-slate-900/50 space-y-3">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              Tamil Nadu Logistics & Weighment Guarantee
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dispatches accompanied by authorized weighbridge slips, Certificate of Analysis (CoA), and e-way bill. Logistics coordination available across all 38 Tamil Nadu industrial corridors including Coimbatore, Chennai, Salem, and Madurai.
            </p>
          </div>

        </div>

        {/* ── Right Column: Supplier Card & Instant Request Form ───────── */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Supplier Info Box */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Verified Seller
            </span>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">{product.supplier}</h3>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  {product.location}
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 flex items-center justify-center font-bold text-blue-700">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span>Member Since: <strong>2023</strong></span>
              <span className="text-blue-600 font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> 98% On-Time Dispatch
              </span>
            </div>
          </div>

          {/* Quote & Sample Inquiry Form */}
          <div className="p-6 sm:p-7 rounded-3xl border border-blue-500/30 bg-card shadow-lg space-y-4">
            
            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-foreground">Inquiry Sent Successfully!</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The supplier at {product.district} has received your requirement. A representative will contact you with ex-factory pricing and sample dispatch details.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="rounded-xl text-xs font-bold mt-2"
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-extrabold text-foreground">Request Price Quote & Sample</h3>
                <p className="text-xs text-muted-foreground mt-0.5 mb-4">
                  Direct connection. No commission markup.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-foreground">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Kumar"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-xs text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-foreground">Company / Manufacturing Unit *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kongu Tech Polymers"
                      value={inquiryForm.company}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, company: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-xs text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-foreground">WhatsApp / Mobile *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98XXXXXXXX"
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-xs text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-foreground">Required Tons (MT)</label>
                      <input
                        type="number"
                        min={product.minOrderTons}
                        value={inquiryForm.quantity}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, quantity: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-xs text-foreground focus:ring-2 focus:ring-primary/40 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-foreground">Delivery District in TN</label>
                    <select
                      value={inquiryForm.destinationDistrict}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, destinationDistrict: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-xs text-foreground focus:ring-2 focus:ring-primary/40 outline-none font-medium"
                    >
                      <option value="Coimbatore">Coimbatore</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Tiruppur">Tiruppur</option>
                      <option value="Erode">Erode</option>
                      <option value="Salem">Salem</option>
                      <option value="Madurai">Madurai</option>
                      <option value="Ranipet">Ranipet</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-foreground">Message / Sample Instructions</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Please send a 2kg sample for lab MFI test before ordering 10 MT lot."
                      value={inquiryForm.notes}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, notes: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-xs text-foreground focus:ring-2 focus:ring-primary/40 outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold shadow-md"
                    >
                      {submitting ? 'Connecting with Supplier...' : 'Submit Inquiry & Request Sample'}
                    </Button>
                  </div>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
