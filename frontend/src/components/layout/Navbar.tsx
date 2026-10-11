'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Menu,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  User,
  Search,
  Globe,
  Sparkles,
  ShoppingBag,
  Layers,
  Building2,
  FileText,
  X
} from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/lib/auth-context';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Language toggle state
  const [lang, setLang] = useState<'en' | 'ta'>('en');
  // Services dropdown state
  const [servicesOpen, setServicesOpen] = useState(false);
  // User profile dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Search bar modal or expand state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    router.push('/');
  };

  const dashboardHref = (role: string) => {
    if (role === 'admin') return '/admin';
    if (role === 'industry' || role === 'entrepreneur') return '/industry';
    return '/student';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'ta' : 'en'));
  };

  const serviceLinks = [
    { name: lang === 'en' ? 'Recycling & Materials' : 'மறுசுழற்சி பொருட்கள்', href: '/products', icon: ShoppingBag, desc: 'Buy & sell verified plastic scrap & granules' },
    { name: lang === 'en' ? 'Government Schemes' : 'அரசு திட்டங்கள்', href: '/schemes', icon: FileText, desc: 'Subsidies, grants & PCB compliance assistance' },
    { name: lang === 'en' ? 'Industry Setup Guide' : 'தொழில் வழிகாட்டி', href: '/industry-setup', icon: Building2, desc: 'SIPCOT land, approvals & pollution control' },
    { name: lang === 'en' ? 'Internships & Visits' : 'பயிற்சி & பார்வைகள்', href: '/internships', icon: Layers, desc: 'Skill building, industrial tours & talent' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 transition-all">
      {/* ── Top Announcement / Trust Ribbon ── */}
      <div className="bg-secondary text-white text-[11px] font-medium py-1 px-4 text-center hidden lg:block tracking-wide">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Tamil Nadu Plastics Circularity Network — Connecting 850+ Verified Aggregators, Recyclers & Industries across 38 Districts
        </span>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">

        {/* ── Brand Logo ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-6 xl:gap-8">
          <Link href="/" className="transition-transform hover:opacity-95 active:scale-98">
            <Logo variant="full" size="md" />
          </Link>

          {/* ── Desktop Navigation ────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link
              href="/"
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                pathname === '/' ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {lang === 'en' ? 'Home' : 'முகப்பு'}
            </Link>

            <Link
              href="/products"
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 ${
                pathname?.startsWith('/products') ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-primary" />
              {lang === 'en' ? 'Marketplace' : 'சந்தை'}
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                Live
              </span>
            </Link>

            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                type="button"
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors inline-flex items-center gap-1 ${
                  servicesOpen ? 'text-primary bg-slate-100 dark:bg-slate-800' : 'text-foreground/80 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                aria-expanded={servicesOpen}
              >
                <span>{lang === 'en' ? 'Services' : 'சேவைகள்'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${servicesOpen ? 'rotate-180 text-primary' : ''}`} />
              </button>

              {servicesOpen && (
                <div className="absolute left-0 top-full mt-2 w-80 rounded-xl border border-border bg-white dark:bg-slate-900 shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 mb-1">
                    Ecosystem Solutions
                  </div>
                  {serviceLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setServicesOpen(false)}
                      className="flex items-start gap-3 px-3 py-2.5 rounded-lg mx-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <item.icon className="w-4 h-4 text-primary mt-0.5 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="text-sm font-semibold text-foreground group-hover:text-primary">
                          {item.name}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-border/60 mt-1 pt-1">
                    <Link
                      href="/companies"
                      onClick={() => setServicesOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>Explore Company Directory →</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                pathname === '/about' ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {lang === 'en' ? 'About' : 'எங்களை பற்றி'}
            </Link>

            <Link
              href="/contacts"
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                pathname === '/contacts' ? 'text-primary bg-primary/10' : 'text-foreground/80 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {lang === 'en' ? 'Contact' : 'தொடர்பு'}
            </Link>
          </nav>
        </div>

        {/* ── Right Actions: Search, Language, Auth ─────────────────── */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Quick Search Button / Expandable Input */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center relative">
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'Search PET, HDPE, units...' : 'தேடுக...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-48 sm:w-64 h-9 pl-8 pr-7 text-xs rounded-full border border-primary bg-slate-50 dark:bg-slate-800 text-foreground outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                />
                <Search className="w-3.5 h-3.5 text-primary absolute left-2.5 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-border bg-slate-50 dark:bg-slate-800 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                title="Search materials and directories"
              >
                <Search className="w-3.5 h-3.5 text-primary" />
                <span className="hidden md:inline">Search...</span>
              </button>
            )}
          </div>

          {/* Language Toggle (English / தமிழ்) */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-border hover:border-primary/50 bg-white dark:bg-slate-800 text-xs font-semibold text-foreground transition-all hover:bg-slate-50"
            title="Toggle Language / மொழியை மாற்றுக"
          >
            <Globe className="w-3.5 h-3.5 text-teal-600" />
            <span>{lang === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Desktop Auth */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-foreground hover:border-primary transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">
                    {user.full_name?.charAt(0) ?? 'U'}
                  </div>
                  <span className="max-w-[110px] truncate">{user.full_name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-border bg-white dark:bg-slate-900 shadow-xl py-1.5 z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="px-3 py-2 border-b border-border/60">
                      <p className="text-xs font-bold text-foreground truncate">{user.full_name}</p>
                      <p className="text-[10px] text-muted-foreground capitalize font-medium">{user.role} Account</p>
                    </div>
                    <Link
                      href={dashboardHref(user.role)}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
                      Dashboard
                    </Link>
                    <div className="my-1 h-px bg-border/60" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-foreground/80 hover:text-primary transition-colors"
                >
                  {lang === 'en' ? 'Log in' : 'உள்நுழைக'}
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white rounded-full font-semibold shadow-sm hover:shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-300" />
                    {lang === 'en' ? 'Register' : 'பதிவு செய்க'}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger Drawer ─────────────────────────────── */}
          <Sheet>
            <SheetTrigger render={
              <button
                type="button"
                className="lg:hidden flex items-center justify-center h-9 w-9 rounded-lg border border-border text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            }>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between">
              <div>
                <div className="mb-6">
                  <Logo variant="full" size="md" />
                </div>

                {/* Mobile Search */}
                <form onSubmit={handleSearchSubmit} className="mb-6 relative">
                  <input
                    type="text"
                    placeholder="Search materials, scrap, units..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 text-xs rounded-xl border border-border bg-slate-50 dark:bg-slate-800 text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3 pointer-events-none" />
                </form>

                {/* Mobile Links */}
                <nav className="flex flex-col gap-1">
                  <Link
                    href="/"
                    className="px-3 py-2.5 text-sm font-semibold text-foreground hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    {lang === 'en' ? 'Home' : 'முகப்பு'}
                  </Link>
                  <Link
                    href="/products"
                    className="px-3 py-2.5 text-sm font-semibold text-primary bg-primary/5 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-primary" />
                      {lang === 'en' ? 'Marketplace / Materials' : 'சந்தை'}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                      Buy / Sell
                    </span>
                  </Link>

                  <div className="pt-2 pb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Services & Hub
                  </div>

                  {serviceLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="px-3 py-2 text-xs font-medium text-foreground/80 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2.5"
                    >
                      <item.icon className="w-3.5 h-3.5 text-teal-600" />
                      <span>{item.name}</span>
                    </Link>
                  ))}

                  <div className="my-2 border-t border-border/60" />

                  <Link
                    href="/about"
                    className="px-3 py-2.5 text-sm font-semibold text-foreground hover:text-primary hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {lang === 'en' ? 'About Platform' : 'எங்களை பற்றி'}
                  </Link>
                  <Link
                    href="/contacts"
                    className="px-3 py-2.5 text-sm font-semibold text-foreground hover:text-primary hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {lang === 'en' ? 'Contact & Support' : 'தொடர்பு'}
                  </Link>
                </nav>
              </div>

              {/* Mobile Auth & Language Footer */}
              <div className="pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-muted-foreground">Language / மொழி:</span>
                  <button
                    onClick={toggleLanguage}
                    className="text-xs font-bold text-primary px-3 py-1 rounded-full border border-primary/30 bg-primary/5"
                  >
                    {lang === 'en' ? 'தமிழ்' : 'English'}
                  </button>
                </div>

                {user ? (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-foreground truncate px-1">
                      {user.full_name} ({user.role})
                    </p>
                    <Link href={dashboardHref(user.role)}>
                      <Button className="w-full bg-primary text-white" size="sm">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Go to Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      size="sm"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/login">
                      <Button variant="outline" className="w-full" size="sm">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full bg-primary text-white" size="sm">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>

        </div>

      </div>
    </header>
  );
}

export default Navbar;
