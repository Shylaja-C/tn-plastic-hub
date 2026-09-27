const fs = require('fs');
const path = require('path');

const routes = [
  'about',
  'industry-setup',
  'schemes',
  'loans',
  'contacts',
  'associations',
  'internships',
  'industrial-visits',
  'companies',
  'technologies',
  'news',
  'ai-assistant',
  'login',
  'register',
  'student',
  'industry',
  'admin'
];

const basePath = path.join(__dirname, 'src', 'app');

routes.forEach(route => {
  const routePath = path.join(basePath, route);
  if (!fs.existsSync(routePath)) {
    fs.mkdirSync(routePath, { recursive: true });
  }

  const pageContent = `export default function ${route.replace(/-./g, x=>x[1].toUpperCase()).replace(/^./, x=>x.toUpperCase())}Page() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold tracking-tight mb-6 capitalize">${route.replace(/-/g, ' ')}</h1>
      <p className="text-muted-foreground">
        This is the professional ${route.replace(/-/g, ' ')} section of TNPlasticHub.
      </p>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(routePath, 'page.tsx'), pageContent);
  console.log(`Created route: /${route}`);
});
