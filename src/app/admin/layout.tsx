import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Users, Building2, Briefcase, MapPin, Landmark, CreditCard, Newspaper, Cpu, BookOpen, ShieldCheck } from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Companies', href: '/admin/companies', icon: Building2 },
  { name: 'Internships', href: '/admin/internships', icon: Briefcase },
  { name: 'Industrial Visits', href: '/admin/industrial-visits', icon: MapPin },
  { name: 'Schemes', href: '/admin/schemes', icon: Landmark },
  { name: 'Loans', href: '/admin/loans', icon: CreditCard },
  { name: 'News', href: '/admin/news', icon: Newspaper },
  { name: 'Technologies', href: '/admin/technologies', icon: Cpu },
  { name: 'Knowledge Base', href: '/admin/knowledge-base', icon: BookOpen },
  { name: 'Verification', href: '/admin/verification', icon: ShieldCheck },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-8 px-4 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 shrink-0">
        <nav className="flex flex-col space-y-1">
          {navigation.map((item) => {
            const isActive = item.name === 'Overview'; // Simple active state for demo
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
