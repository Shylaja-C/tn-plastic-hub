import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Building2, 
  Briefcase, 
  Settings, 
  Newspaper, 
  Landmark, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Bot, 
  ShieldCheck,
  TrendingUp,
  Factory
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* 2. Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900 border-b relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 bg-[size:3rem_3rem]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="px-3 py-1 bg-background text-sm font-medium border-primary/20 text-primary">
              The Premier Digital Ecosystem
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Connecting Tamil Nadu&apos;s <br className="hidden sm:block" />
              <span className="text-primary">Plastics Industry</span>
            </h1>
            <p className="mx-auto max-w-[800px] text-lg sm:text-xl text-muted-foreground leading-relaxed">
              PlasticX connects industries, students, entrepreneurs, and professionals with verified industry information, career opportunities, and advanced technology resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-8">
              <Link href="/industry-setup" className={cn(buttonVariants({ size: "lg" }), "h-12 px-8 text-base font-semibold")}>
                Explore Industry Setup
              </Link>
              <Link href="/ai-assistant" className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-12 px-8 text-base font-semibold bg-background")}>
                <Bot className="mr-2 h-5 w-5" /> Ask PlasticX AI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Industry Ecosystem Section */}
      <section className="w-full py-20 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Comprehensive Industry Ecosystem</h2>
            <p className="text-muted-foreground max-w-[700px] text-lg">
              Access vital resources designed for manufacturers, job seekers, and entrepreneurs.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'Industry Setup', icon: Factory, href: '/industry-setup' },
              { title: 'Government Schemes', icon: Landmark, href: '/schemes' },
              { title: 'Loans & Finance', icon: TrendingUp, href: '/loans' },
              { title: 'Internships', icon: Briefcase, href: '/internships' },
              { title: 'Industrial Visits', icon: Building2, href: '/industrial-visits' },
              { title: 'Technology', icon: Settings, href: '/technologies' },
              { title: 'Industry News', icon: Newspaper, href: '/news' },
              { title: 'Verified Contacts', icon: Phone, href: '/contacts' },
            ].map((item, i) => (
              <Link key={i} href={item.href} className="group block h-full">
                <Card className="h-full border-border/50 shadow-sm hover:border-primary/50 hover:shadow-md transition-all">
                  <CardHeader className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Industry Setup Section */}
      <section className="w-full py-20 bg-slate-50 dark:bg-slate-900 border-b">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="text-primary border-primary/20">For Entrepreneurs</Badge>
              <h2 className="text-3xl font-bold tracking-tight">Planning to start a plastics business?</h2>
              <p className="text-muted-foreground text-lg">
                Navigate the complexities of establishing a plastics manufacturing unit in Tamil Nadu with our step-by-step guidance.
              </p>
              <div className="space-y-4 pt-4">
                {[
                  'Business Strategy & Registration',
                  'Location & SIPCOT Approvals',
                  'Environmental & Pollution Control Board',
                  'Finance & Subsidies',
                  'Machinery & Technology Setup',
                  'Industry Networking & Support'
                ].map((step, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-primary mr-3 shrink-0" />
                    <span className="font-medium text-foreground">{step}</span>
                  </div>
                ))}
              </div>
              <div className="pt-6">
                <Link href="/industry-setup" className={cn(buttonVariants({ size: "lg" }))}>
                  Start Setup Guide <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 border shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                 <Factory className="h-48 w-48" />
               </div>
               <h3 className="text-xl font-bold mb-6 relative z-10">Standard Setup Journey</h3>
               <div className="space-y-6 relative z-10 border-l-2 border-primary/20 pl-6 ml-3">
                 <div className="relative">
                   <div className="absolute -left-[35px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                   <h4 className="font-semibold">1. Business Registration</h4>
                   <p className="text-sm text-muted-foreground">MSME Udyam, GST, Company Incorporation</p>
                 </div>
                 <div className="relative">
                   <div className="absolute -left-[35px] top-1 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
                   <h4 className="font-semibold">2. Licensing & Approvals</h4>
                   <p className="text-sm text-muted-foreground">TNPCB Consent, Factory License, Fire NOC</p>
                 </div>
                 <div className="relative">
                   <div className="absolute -left-[35px] top-1 h-4 w-4 rounded-full bg-muted ring-4 ring-background" />
                   <h4 className="font-semibold text-muted-foreground">3. Financial Assistance</h4>
                   <p className="text-sm text-muted-foreground">NEEDS Scheme, TIIC Loans (Pending)</p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Internship Section */}
      <section className="w-full py-20 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Student Opportunities</h2>
              <p className="text-muted-foreground text-lg">Verified internships across top plastics manufacturing units.</p>
            </div>
            <Link href="/internships" className={cn(buttonVariants({ variant: "outline" }))}>
              Explore Internships <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Demo Data for Internships */}
            {[
              {
                company: 'Chennai Plastics Ltd (Demo)',
                role: 'Production Intern',
                location: 'Ambattur Industrial Estate',
                duration: '3 Months',
                skills: ['Injection Moulding', 'Quality Control'],
                seats: 5,
                verified: true
              },
              {
                company: 'Kovai Polymers (Demo)',
                role: 'Quality Analyst Intern',
                location: 'Coimbatore',
                duration: '6 Months',
                skills: ['Testing', 'ISO Standards'],
                seats: 2,
                verified: true
              },
              {
                company: 'Madurai Packaging (Demo)',
                role: 'Maintenance Trainee',
                location: 'Madurai',
                duration: '2 Months',
                skills: ['Extrusion', 'Machine Maintenance'],
                seats: 4,
                verified: true
              }
            ].map((internship, i) => (
              <Card key={i} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary">{internship.duration}</Badge>
                    {internship.verified && (
                      <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50 dark:bg-green-950/20">
                        <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{internship.role}</CardTitle>
                  <CardDescription className="text-base font-medium text-foreground">
                    {internship.company}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" /> {internship.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" /> {internship.seats} Seats Available
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {internship.skills.map(skill => (
                        <Badge key={skill} variant="secondary" className="bg-muted text-xs font-normal">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/internships/${i}`} className={cn(buttonVariants({ variant: "default" }), "w-full")}>
                    Apply Now
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Industrial Visit Section */}
      <section className="w-full py-20 bg-slate-50 dark:bg-slate-900 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Upcoming Industrial Visits</h2>
              <p className="text-muted-foreground text-lg">Gain practical exposure to real-world manufacturing environments.</p>
            </div>
            <Link href="/industrial-visits" className={cn(buttonVariants({ variant: "outline" }))}>
              View Schedule <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                company: 'Advanced Mouldings TN (Demo)',
                date: 'Oct 15, 2026',
                location: 'Sriperumbudur',
                seats: '40 Student Limit',
                tech: 'Automated Injection Moulding & Robotics'
              },
              {
                company: 'EcoPlast Recycling Hub (Demo)',
                date: 'Nov 05, 2026',
                location: 'Tiruppur',
                seats: '30 Student Limit',
                tech: 'Circular Economy & Post-Consumer Recycling'
              }
            ].map((visit, i) => (
              <Card key={i} className="flex flex-col md:flex-row overflow-hidden border-border/50">
                <div className="md:w-1/3 bg-muted p-6 flex flex-col justify-center border-b md:border-b-0 md:border-r border-border/50">
                   <div className="flex items-center space-x-2 text-primary font-bold mb-2">
                     <Calendar className="h-5 w-5" /> <span>{visit.date}</span>
                   </div>
                   <div className="text-sm text-muted-foreground flex items-center">
                     <Users className="h-4 w-4 mr-1" /> {visit.seats}
                   </div>
                </div>
                <div className="md:w-2/3 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{visit.company}</h3>
                    <p className="text-muted-foreground text-sm flex items-center mb-4">
                      <MapPin className="h-4 w-4 mr-1" /> {visit.location}
                    </p>
                    <p className="text-sm font-medium">Technology Focus:</p>
                    <p className="text-sm text-muted-foreground">{visit.tech}</p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Link href={`/industrial-visits/${i}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                      Book Slot
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Technology Section */}
      <section className="w-full py-20 bg-background border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Master Plastics Technology</h2>
            <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
              Access comprehensive learning resources across modern manufacturing techniques.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              'Injection Moulding',
              'Blow Moulding',
              'Extrusion',
              'Compounding',
              'Recycling',
              'Automation',
              'Bioplastics',
              'Additive Manufacturing'
            ].map((tech) => (
              <Link key={tech} href={`/technologies`} className="group">
                <div className="h-full p-6 border rounded-lg bg-card text-card-foreground text-center hover:border-primary hover:shadow-sm transition-all flex items-center justify-center">
                  <span className="font-semibold group-hover:text-primary transition-colors">{tech}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Latest Industry News */}
      <section className="w-full py-20 bg-slate-50 dark:bg-slate-900 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Latest Industry News</h2>
              <p className="text-muted-foreground text-lg">Stay updated with policies, market trends, and innovations.</p>
            </div>
            <Link href="/news" className={cn(buttonVariants({ variant: "outline" }))}>
              Read All News <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                category: 'Government Policy',
                title: 'TN Government Announces Subsidies for MSME Plastics Recyclers (Sample)',
                source: 'TN Industries Dept',
                date: 'Sep 24, 2026',
                summary: 'A new comprehensive financial package aimed at boosting circular economy adoption among small to medium scale manufacturing units.'
              },
              {
                category: 'Market Trends',
                title: 'Surge in Demand for Engineering Plastics in Automotive Sector (Sample)',
                source: 'Industry Insights',
                date: 'Sep 21, 2026',
                summary: 'Local manufacturers are rapidly adopting advanced compounding techniques to meet the stringent requirements of EV components.'
              },
              {
                category: 'Innovation',
                title: 'New Bioplastic Alternatives Developed at Chennai Research Hub (Sample)',
                source: 'Tech Daily',
                date: 'Sep 18, 2026',
                summary: 'Researchers have formulated a starch-based polymer that breaks down 40% faster in industrial composting facilities.'
              }
            ].map((news, i) => (
              <Card key={i} className="flex flex-col h-full">
                <CardHeader className="pb-4">
                  <div className="mb-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      {news.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2 leading-snug">{news.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {news.summary}
                  </p>
                </CardContent>
                <CardFooter className="pt-4 border-t text-xs text-muted-foreground flex justify-between items-center mt-auto">
                  <span className="font-medium text-foreground/80">{news.source}</span>
                  <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {news.date}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 9. AI Assistant CTA Section */}
      <section className="w-full py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-foreground/5" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <div className="mx-auto w-16 h-16 bg-primary-foreground/10 flex items-center justify-center rounded-full mb-6">
            <Bot className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Have a question about the plastics industry?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-10">
            Get instant, verified answers regarding setup procedures, government schemes, technology processes, and compliance from our intelligent assistant.
          </p>
          <Link href="/ai-assistant" className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "h-14 px-10 text-lg font-bold text-primary shadow-lg hover:shadow-xl transition-shadow")}>
            <Bot className="mr-2 h-5 w-5" /> Ask PlasticX AI
          </Link>
        </div>
      </section>
    </div>
  );
}
