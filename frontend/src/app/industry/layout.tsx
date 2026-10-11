'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Building, Briefcase, Building2, Users } from 'lucide-react';
import { RoleGuard } from '@/components/RoleGuard';

const navigation = [
  { name: 'Overview', href: '/industry', icon: LayoutDashboard },
  { name: 'Company Profile', href: '/industry/company-profile', icon: Building },
  { name: 'Internships', href: '/industry/internships', icon: Briefcase },
  { name: 'Industrial Visits', href: '/industry/industrial-visits', icon: Building2 },
  { name: 'Applicants', href: '/industry/applicants', icon: Users },
];

export default function IndustryLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <RoleGuard roles={['industry']}>
      <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-56 shrink-0 md:sticky md:top-6">
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/40">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Industry</p>
            </div>
            <nav className="flex flex-col p-2 gap-0.5">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className={cn('mr-2.5 h-4 w-4 shrink-0', isActive ? 'text-primary-foreground' : '')} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </RoleGuard>
  );
}
