import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, CheckCircle2, Building2, Bookmark, MapPin, Calendar, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back! Here's an overview of your industry opportunities.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Applications', value: '12', icon: FileText, color: 'text-blue-500' },
          { title: 'Shortlisted', value: '3', icon: CheckCircle2, color: 'text-green-500' },
          { title: 'Upcoming Visits', value: '1', icon: Building2, color: 'text-purple-500' },
          { title: 'Saved Opportunities', value: '8', icon: Bookmark, color: 'text-amber-500' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Applications Table */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Status of your recent internship applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { company: 'Chennai Plastics', role: 'Production Intern', status: 'Shortlisted', statusClass: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
                  { company: 'Madurai Packaging', role: 'Maintenance Trainee', status: 'Under Review', statusClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
                  { company: 'Kovai Polymers', role: 'Quality Analyst', status: 'Applied', statusClass: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400' },
                ].map((app, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{app.company}</TableCell>
                    <TableCell>{app.role}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={app.statusClass + " border-none"}>
                        {app.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Upcoming Industrial Visits */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Upcoming Industrial Visits</CardTitle>
            <CardDescription>Your booked industry tours.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Advanced Mouldings TN</p>
                <div className="flex items-center text-sm text-muted-foreground pt-1">
                  <Calendar className="mr-1 h-3 w-3" /> Oct 15, 2026
                  <MapPin className="ml-3 mr-1 h-3 w-3" /> Sriperumbudur
                </div>
              </div>
              <Badge>Confirmed</Badge>
            </div>
            <Button variant="outline" className="w-full">Browse More Visits</Button>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Internships */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recommended Internships</CardTitle>
              <CardDescription>Based on your profile and skills.</CardDescription>
            </div>
            <Link href="/internships" className={buttonVariants({ variant: "ghost" })}>View All</Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { company: 'TechPlast Solutions', role: 'CAD Design Intern', location: 'Chennai', duration: '6 Months' },
              { company: 'GreenCycle Polymers', role: 'Recycling Research', location: 'Tiruppur', duration: '3 Months' },
              { company: 'AutoMould India', role: 'Automation Trainee', location: 'Coimbatore', duration: '6 Months' },
            ].map((internship, i) => (
              <div key={i} className="flex flex-col rounded-lg border p-4 hover:border-primary/50 transition-colors">
                <h3 className="font-semibold">{internship.role}</h3>
                <p className="text-sm text-muted-foreground mb-4">{internship.company}</p>
                <div className="flex flex-col gap-2 text-xs text-muted-foreground mt-auto">
                  <span className="flex items-center"><MapPin className="mr-1 h-3 w-3" /> {internship.location}</span>
                  <span className="flex items-center"><Briefcase className="mr-1 h-3 w-3" /> {internship.duration}</span>
                </div>
                <Button size="sm" className="mt-4 w-full">Apply</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
