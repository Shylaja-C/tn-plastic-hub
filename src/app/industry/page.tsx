import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Briefcase, Building2, Users, BarChart, Plus, Settings } from 'lucide-react';
import Link from 'next/link';

export default function IndustryDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Industry Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your company profile, opportunities, and analytics.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Manage Profile</Button>
          <Button><Plus className="mr-2 h-4 w-4" /> Post Opportunity</Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Active Internships', value: '4', icon: Briefcase, action: 'Manage Posts' },
          { title: 'Upcoming Visits', value: '2', icon: Building2, action: 'Create Visit' },
          { title: 'Total Applicants', value: '156', icon: Users, action: 'View Applicants' },
          { title: 'Profile Views', value: '1.2k', icon: BarChart, action: 'View Analytics' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Button variant="link" className="px-0 mt-2 h-auto text-xs text-primary">{stat.action} &rarr;</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Applicants */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Applicants</CardTitle>
                <CardDescription>Candidates applying for your posted internships.</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Applied Role</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: 'Rahul M', role: 'Production Intern', date: 'Sep 26, 2026', status: 'Under Review' },
                  { name: 'Priya S', role: 'Quality Analyst', date: 'Sep 25, 2026', status: 'Shortlisted' },
                  { name: 'Karthik V', role: 'Maintenance Trainee', date: 'Sep 24, 2026', status: 'New' },
                  { name: 'Anita R', role: 'Production Intern', date: 'Sep 22, 2026', status: 'Rejected' },
                ].map((app, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell>{app.role}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{app.date}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={
                        app.status === 'Shortlisted' ? 'bg-green-100 text-green-800' :
                        app.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''
                      }>{app.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">Review</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Active Posts Overview */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Active Opportunities</CardTitle>
            <CardDescription>Your current live postings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Production Intern</h4>
                  <p className="text-xs text-muted-foreground mt-1">45 Applicants</p>
                </div>
                <Badge variant="outline" className="border-green-500 text-green-600">Live</Badge>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Quality Analyst</h4>
                  <p className="text-xs text-muted-foreground mt-1">12 Applicants</p>
                </div>
                <Badge variant="outline" className="border-green-500 text-green-600">Live</Badge>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Industrial Visit - Oct 15</h4>
                  <p className="text-xs text-muted-foreground mt-1">40/40 Seats Booked</p>
                </div>
                <Badge variant="outline" className="border-amber-500 text-amber-600">Full</Badge>
              </div>
            </div>
            <Button variant="secondary" className="w-full mt-2">Create New Post</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
