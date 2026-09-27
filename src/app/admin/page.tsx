import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Building2, Briefcase, MapPin, ShieldCheck, BookOpen, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
        <p className="text-muted-foreground mt-2">Platform overview and global management.</p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { title: 'Total Students', value: '12,450', icon: Users },
          { title: 'Total Companies', value: '5,102', icon: Building2 },
          { title: 'Active Internships', value: '845', icon: Briefcase },
          { title: 'Industrial Visits', value: '112', icon: MapPin },
          { title: 'Pending Verifications', value: '34', icon: ShieldCheck, alert: true },
          { title: 'Knowledge Resources', value: '1,205', icon: BookOpen },
        ].map((stat, i) => (
          <Card key={i} className={stat.alert ? "border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/10" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.alert ? 'text-amber-500' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Verification Queue Table */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <CardTitle>Company Verification Queue</CardTitle>
                <CardDescription>Review and approve new industry registrations.</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search..." className="pl-8 w-[200px]" />
                </div>
                <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: 'Salem Polymers Pvt Ltd', location: 'Salem', type: 'Manufacturer', date: '2 hours ago' },
                  { name: 'TN EcoPlastics', location: 'Chennai', type: 'Recycler', date: '5 hours ago' },
                  { name: 'Global Mouldings', location: 'Coimbatore', type: 'Supplier', date: '1 day ago' },
                  { name: 'Sri Ram Packaging', location: 'Madurai', type: 'Manufacturer', date: '1 day ago' },
                ].map((company, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.location}</TableCell>
                    <TableCell><Badge variant="secondary">{company.type}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-sm">{company.date}</TableCell>
                    <TableCell>
                      <Button size="sm">Review</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* System Alerts & Quick Links */}
        <div className="space-y-8 col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 rounded-md border p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-900">
                <ShieldCheck className="h-5 w-5 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">34 Pending Verifications</p>
                  <p className="text-sm opacity-80">Company profiles awaiting manual review.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-md border p-4">
                <Users className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">High Traffic</p>
                  <p className="text-sm text-muted-foreground">Student portal experiencing 2x normal traffic.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">Publish Industry News</Button>
              <Button variant="outline" className="w-full justify-start">Update Government Schemes</Button>
              <Button variant="outline" className="w-full justify-start">Manage Technologies Database</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
