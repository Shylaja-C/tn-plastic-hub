const fs = require('fs');
const path = require('path');

const dashboards = {
  student: {
    sidebar: [
      { name: 'Overview', icon: 'LayoutDashboard' },
      { name: 'My Profile', icon: 'User' },
      { name: 'Internships', icon: 'Briefcase' },
      { name: 'Applications', icon: 'FileText' },
      { name: 'Industrial Visits', icon: 'Building2' },
      { name: 'Saved Opportunities', icon: 'Bookmark' },
      { name: 'AI Assistant', icon: 'Bot' },
    ]
  },
  industry: {
    sidebar: [
      { name: 'Overview', icon: 'LayoutDashboard' },
      { name: 'Company Profile', icon: 'Building' },
      { name: 'Internships', icon: 'Briefcase' },
      { name: 'Industrial Visits', icon: 'Building2' },
      { name: 'Applicants', icon: 'Users' },
      { name: 'Analytics', icon: 'BarChart' },
    ]
  },
  admin: {
    sidebar: [
      { name: 'Overview', icon: 'LayoutDashboard' },
      { name: 'Users', icon: 'Users' },
      { name: 'Companies', icon: 'Building2' },
      { name: 'Internships', icon: 'Briefcase' },
      { name: 'Industrial Visits', icon: 'MapPin' },
      { name: 'Schemes', icon: 'Landmark' },
      { name: 'Loans', icon: 'CreditCard' },
      { name: 'News', icon: 'Newspaper' },
      { name: 'Technologies', icon: 'Cpu' },
      { name: 'Knowledge Base', icon: 'BookOpen' },
      { name: 'Verification', icon: 'ShieldCheck' },
    ]
  }
};

const appDir = path.join(__dirname, 'src', 'app');

for (const [role, data] of Object.entries(dashboards)) {
  const roleDir = path.join(appDir, role);
  if (!fs.existsSync(roleDir)) {
    fs.mkdirSync(roleDir, { recursive: true });
  }

  // Create layout.tsx
  const layoutContent = `import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ${[...new Set(data.sidebar.map(i => i.icon))].join(', ')} } from 'lucide-react';

const navigation = [
${data.sidebar.map(i => `  { name: '${i.name}', href: '/${role}${i.name === 'Overview' ? '' : '/' + i.name.toLowerCase().replace(/ /g, '-')}', icon: ${i.icon} },`).join('\n')}
];

export default function ${role.charAt(0).toUpperCase() + role.slice(1)}Layout({
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
`;
  fs.writeFileSync(path.join(roleDir, 'layout.tsx'), layoutContent);
}
console.log('Layouts generated.');
