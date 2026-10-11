'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { Mail, CheckCircle2, Phone, MapPin, Send, ShieldCheck, Heart } from 'lucide-react';

const columns = [
  {
    heading: 'Circular Marketplace',
    links: [
      { name: 'PET Flakes & Bottle Scrap', href: '/products?category=PET' },
      { name: 'HDPE Regrind & Granules',   href: '/products?category=HDPE' },
      { name: 'LDPE Film & Agglomerate',   href: '/products?category=LDPE' },
      { name: 'PP Polymers & Reprocessed', href: '/products?category=PP' },
      { name: 'Post-Industrial Scrap',     href: '/products?type=scrap' },
    ],
  },
  {
    heading: 'Industry & Schemes',
    links: [
      { name: 'TNPCB Pollution Approvals', href: '/schemes' },
      { name: 'SIPCOT Industrial Parks',   href: '/industry-setup' },
      { name: 'MSME Capital Subsidies',    href: '/schemes' },
      { name: 'Green Credit & EPR Portals',href: '/schemes' },
      { name: 'Machinery & Working Loans', href: '/loans' },
    ],
  },
  {
    heading: 'Talent & Capacity',
    links: [
      { name: 'Plastics Internships',      href: '/internships' },
      { name: 'Industrial Factory Visits', href: '/industrial-visits' },
      { name: 'CIPET Training Programs',   href: '/technologies' },
      { name: 'Verified Company Directory',href: '/companies' },
      { name: 'AI Plastics Assistant',     href: '/ai-assistant' },
    ],
  },
  {
    heading: 'Connect & Legal',
    links: [
      { name: 'About TN Plastic Hub',      href: '/about' },
      { name: 'Contact & Grievances',      href: '/contacts' },
      { name: 'State Recycling Associations', href: '/associations' },
      { name: 'Privacy Policy',            href: '/privacy' },
      { name: 'Terms of Platform',         href: '/terms' },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubscribed(true);
    }, 600);
  };

  return (
    <footer className="bg-slate-900 text-slate-100 border-t border-slate-800">
      {/* ── Top Newsletter & Partnership Banner ────────────────────────── */}
      <div className="border-b border-slate-800 bg-slate-950/40">
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/60 border border-teal-700/50 text-teal-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                Tamil Nadu Circular Plastics Ecosystem
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Stay updated with polymer prices, tenders & TNPCB guidelines
              </h3>
              <p className="text-sm text-slate-400 max-w-xl">
                Get weekly market rate updates for recycled plastic granules, regulatory circulars, and verified Tamil Nadu buyer inquiries directly to your inbox.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="flex items-center gap-2.5 p-4 rounded-xl bg-teal-950/80 border border-teal-800/80 text-teal-300">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-teal-400" />
                  <p className="text-sm font-medium">Thank you for subscribing to TN Plastic Hub Weekly!</p>
                </div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      required
                      placeholder="Enter your official or business email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="h-11 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-98 text-slate-950 font-bold text-sm inline-flex items-center justify-center gap-2 transition-all shrink-0 disabled:opacity-50"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── Main 4-Column Navigation Grid ──────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-8 mb-12">
          
          {/* Brand identity column */}
          <div className="col-span-2 md:col-span-6 lg:col-span-4 flex flex-col gap-4 pr-0 lg:pr-6">
            <Link href="/" className="inline-block">
              <Logo variant="full" size="md" />
            </Link>
            
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Empowering Tamil Nadu&apos;s circular plastics future. We bridge waste collectors, reprocessors, compounders, and manufacturing industries to eliminate landfill plastic through transparent trade and modern compliance.
            </p>

            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Chennai & Coimbatore Coordination Cells, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+91 44 2852 4000 / helpdesk@tnplastichub.in</span>
              </div>
            </div>

            {/* Social handles */}
            <div className="flex items-center gap-3 pt-2">
              {['LinkedIn', 'Twitter', 'YouTube', 'WhatsApp'].map((platform) => (
                <span
                  key={platform}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-teal-900/60 border border-slate-700 cursor-pointer transition-colors"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>

          {/* Nav links */}
          {columns.map((col) => (
            <div key={col.heading} className="col-span-1 md:col-span-3 lg:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* ── Bottom Strip ──────────────────────────────────────────────── */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} TN Plastic Hub. State Nodal Plastics & Recycling Network. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built for sustainable Tamil Nadu industry</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-1" />
            <span>Zero Plastic to Landfill</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
