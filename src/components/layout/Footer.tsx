import Link from 'next/link';
import { Factory } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center space-x-2">
              <Factory className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight text-primary">TNPlasticHub</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The premier professional digital ecosystem connecting the Tamil Nadu plastics industry, facilitating growth, innovation, and career opportunities.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Industry Hub</h3>
            <ul className="space-y-3">
              <li><Link href="/companies" className="text-sm text-muted-foreground hover:text-primary transition-colors">Companies Directory</Link></li>
              <li><Link href="/industry-setup" className="text-sm text-muted-foreground hover:text-primary transition-colors">Industry Setup Guide</Link></li>
              <li><Link href="/schemes" className="text-sm text-muted-foreground hover:text-primary transition-colors">Government Schemes</Link></li>
              <li><Link href="/associations" className="text-sm text-muted-foreground hover:text-primary transition-colors">Associations</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Opportunities</h3>
            <ul className="space-y-3">
              <li><Link href="/internships" className="text-sm text-muted-foreground hover:text-primary transition-colors">Internships</Link></li>
              <li><Link href="/industrial-visits" className="text-sm text-muted-foreground hover:text-primary transition-colors">Industrial Visits</Link></li>
              <li><Link href="/student" className="text-sm text-muted-foreground hover:text-primary transition-colors">Student Portal</Link></li>
              <li><Link href="/technologies" className="text-sm text-muted-foreground hover:text-primary transition-colors">Technology Learning</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Connect</h3>
            <ul className="space-y-3">
              <li><Link href="/contacts" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About the Platform</Link></li>
              <li><Link href="/ai-assistant" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Assistant</Link></li>
              <li><Link href="/news" className="text-sm text-muted-foreground hover:text-primary transition-colors">Industry News</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TNPlasticHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
