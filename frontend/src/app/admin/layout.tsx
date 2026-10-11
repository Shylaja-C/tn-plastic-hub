'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Building2, Briefcase, ShieldCheck } from 'lucide-react';
import { RoleGuard } from '@/components/RoleGuard';

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Companies', href: '/admin/companies', icon: Building2 },
  { name: 'Internships', href: '/admin/internships', icon: Briefcase },
  { name: 'Verification', href: '/admin/verification', icon: ShieldCheck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <RoleGuard roles={['admin']}>
      <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row gap-8 items-start">
        <aside className="w-full md:w-56 shrink-0 md:sticky md:top-6">
          <div className="border rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/40">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Admin</p>
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
