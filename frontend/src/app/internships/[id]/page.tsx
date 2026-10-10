'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Briefcase, IndianRupee, Calendar, ChevronLeft, Loader2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { internshipsApi, type Internship, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function InternshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    internshipsApi.get(Number(id))
      .then(setInternship)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async () => {
    if (!user) { router.push('/login'); return; }
    setApplying(true);
    setApplyError('');
    try {
      await internshipsApi.apply(Number(id));
      setApplied(true);
    } catch (err) {
      if (err instanceof ApiError) {
        setApplyError(err.status === 409 ? 'You have already applied to this internship.' : err.message);
      } else {
        setApplyError('Failed to apply. Please try again.');
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  if (!internship) return <div className="container mx-auto py-16 text-center text-muted-foreground">Internship not found.</div>;

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Link href="/internships" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 gap-1">
        <ChevronLeft className="h-4 w-4" /> Back to internships
      </Link>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{internship.title}</h1>
            <p className="text-lg text-muted-foreground mt-1">{internship.company?.name ?? `Company #${internship.company_id}`}</p>
          </div>
          <Badge variant={internship.status === 'open' ? 'default' : 'secondary'} className="shrink-0 capitalize">{internship.status}</Badge>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {internship.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{internship.location}</span>}
          {internship.duration_months && <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" />{internship.duration_months} months</span>}
          {internship.stipend_amount != null && <span className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4" />₹{internship.stipend_amount.toLocaleString()}/month</span>}
          {internship.application_deadline && <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />Deadline: {new Date(internship.application_deadline).toLocaleDateString()}</span>}
        </div>

        {internship.skills_required && (
          <div className="flex flex-wrap gap-2">
            {internship.skills_required.split(',').map((s) => (
              <Badge key={s} variant="outline">{s.trim()}</Badge>
            ))}
          </div>
        )}

        {internship.description && (
          <Card>
            <CardHeader><CardTitle className="text-base">About This Internship</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{internship.description}</p></CardContent>
          </Card>
        )}

        {internship.requirements && (
          <Card>
            <CardHeader><CardTitle className="text-base">Requirements</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{internship.requirements}</p></CardContent>
          </Card>
        )}

        {internship.responsibilities && (
          <Card>
            <CardHeader><CardTitle className="text-base">Responsibilities</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-muted-foreground whitespace-pre-wrap">{internship.responsibilities}</p></CardContent>
          </Card>
        )}

        {/* Apply section */}
        <div className="rounded-lg border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Ready to apply?</p>
              <p className="text-sm text-muted-foreground">{internship.vacancies} position{internship.vacancies !== 1 ? 's' : ''} available</p>
            </div>
            {applied ? (
              <span className="flex items-center gap-2 text-green-600 font-medium text-sm">
                <CheckCircle className="h-5 w-5" /> Application Submitted!
              </span>
            ) : (
              <Button onClick={handleApply} disabled={applying || internship.status !== 'open'} className="gap-2">
                {applying && <Loader2 className="h-4 w-4 animate-spin" />}
                {internship.status !== 'open' ? 'Closed' : user ? 'Apply Now' : 'Login to Apply'}
              </Button>
            )}
          </div>
          {applyError && <p className="text-sm text-destructive">{applyError}</p>}
        </div>
      </div>
    </div>
  );
}
