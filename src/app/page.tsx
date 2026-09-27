import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Factory, GraduationCap, Briefcase, TrendingUp, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-slate-50 dark:bg-slate-900 border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 bg-[size:3rem_3rem]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="px-3 py-1 bg-background text-sm font-medium border-primary/20 text-primary">
              The Premier Digital Ecosystem for TN Plastics
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
              Empowering the Future of <br className="hidden sm:block" />
              <span className="text-primary">Plastics Manufacturing</span>
            </h1>
            <p className="mx-auto max-w-[800px] text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Connect with industry leaders, discover government schemes, explore cutting-edge technologies, and accelerate your career in Tamil Nadu&apos;s thriving plastics ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
              <Link href="/companies" className={cn(buttonVariants({ size: "lg" }), "h-12 px-8 text-base font-semibold")}>
                Explore Directory
              </Link>
              <Link href="/register" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12 px-8 text-base font-semibold bg-background")}>
                Join the Network
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 mt-12 border-t w-full opacity-80">
              {[
                { label: 'Registered Companies', value: '5,000+' },
                { label: 'Active Professionals', value: '12,000+' },
                { label: 'Student Opportunities', value: '850+' },
                { label: 'Technology Resources', value: '1,200+' }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center justify-center space-y-1">
                  <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Ecosystem Pillars */}
      <section className="w-full py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Core Ecosystem Pillars</h2>
            <p className="text-muted-foreground max-w-[600px] text-lg">
              A comprehensive platform designed for all stakeholders in the plastics manufacturing lifecycle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Factory className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Industry & Enterprises</CardTitle>
                <CardDescription className="text-base">For manufacturers, suppliers, and entrepreneurs.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 mr-2 text-primary" /> Access Government Schemes & Loans</li>
                  <li className="flex items-center text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 mr-2 text-primary" /> B2B Networking & Directory</li>
                  <li className="flex items-center text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 mr-2 text-primary" /> Technology Transfer & Updates</li>
                </ul>
                <Link href="/industry" className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-between")}>
                  Enter Industry Portal <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle className="text-xl">Students & Academia</CardTitle>
                <CardDescription className="text-base">For learners, researchers, and educational institutions.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 mr-2 text-blue-500" /> Internships & Placements</li>
                  <li className="flex items-center text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 mr-2 text-blue-500" /> Industrial Visit Bookings</li>
                  <li className="flex items-center text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 mr-2 text-blue-500" /> Knowledge & Learning Hub</li>
                </ul>
                <Link href="/student" className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-between")}>
                  Enter Student Portal <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-emerald-500" />
                </div>
                <CardTitle className="text-xl">AI Assistant & Resources</CardTitle>
                <CardDescription className="text-base">Intelligent tools to navigate the industry.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 mr-2 text-emerald-500" /> 24/7 AI Industry Consultant</li>
                  <li className="flex items-center text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 mr-2 text-emerald-500" /> Policy & Scheme Guidance</li>
                  <li className="flex items-center text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 mr-2 text-emerald-500" /> Latest Industry News & Insights</li>
                </ul>
                <Link href="/ai-assistant" className={cn(buttonVariants({ variant: "ghost" }), "w-full justify-between")}>
                  Launch AI Assistant <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="w-full py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Transform Your Operations?</h2>
          <p className="max-w-[700px] text-lg text-primary-foreground/80">
            Join thousands of professionals, companies, and students already leveraging TNPlasticHub to advance their objectives.
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="/register" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "h-12 px-8 font-semibold text-primary")}>
              Create Free Account
            </Link>
            <Link href="/contacts" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12 px-8 font-semibold border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary")}>
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
