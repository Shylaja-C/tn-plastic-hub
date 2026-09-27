import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LayoutDashboard, User, Briefcase, FileText, Building2, Bookmark, Bot } from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/student', icon: LayoutDashboard },
  { name: 'My Profile', href: '/student/my-profile', icon: User },
  { name: 'Internships', href: '/student/internships', icon: Briefcase },
  { name: 'Applications', href: '/student/applications', icon: FileText },
  { name: 'Industrial Visits', href: '/student/industrial-visits', icon: Building2 },
  { name: 'Saved Opportunities', href: '/student/saved-opportunities', icon: Bookmark },
  { name: 'AI Assistant', href: '/student/ai-assistant', icon: Bot },
];

export default function StudentLayout({
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
