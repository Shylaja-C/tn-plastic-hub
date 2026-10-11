'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Briefcase, IndianRupee, Calendar,
  ChevronLeft, Loader2, CheckCircle, Users,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { internshipsApi, type Internship, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

// ── Section block ─────────────────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      <div className="text-sm text-foreground leading-relaxed">{children}</div>
    </div>
  );
}

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
    internshipsApi
      .get(Number(id))
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

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="container mx-auto py-16 text-center text-muted-foreground">
        Internship not found.
      </div>
    );
  }

  const isOpen = internship.status === 'open';

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      {/* Back link */}
      <Link
        href="/internships"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 gap-1"
      >
        <ChevronLeft className="h-4 w-4" /> Back to internships
      </Link>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ── Left: main content ────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Title block */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 flex-wrap">
              <h1 className="text-2xl font-bold leading-tight flex-1">{internship.title}</h1>
              <Badge variant={isOpen ? 'default' : 'secondary'} className="capitalize shrink-0">
                {internship.status}
              </Badge>
            </div>
            <p className="text-base text-muted-foreground font-medium">
              {internship.company?.name ?? `Company #${internship.company_id}`}
            </p>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {internship.location && (
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{internship.location}</span>
              )}
              {internship.duration_months && (
                <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" />{internship.duration_months} months</span>
              )}
              {internship.stipend_amount != null && (
                <span className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4" />₹{internship.stipend_amount.toLocaleString()}/month</span>
              )}
              {internship.application_deadline && (
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />Deadline: {new Date(internship.application_deadline).toLocaleDateString()}</span>
              )}
              {internship.vacancies != null && (
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" />{internship.vacancies} opening{internship.vacancies !== 1 ? 's' : ''}</span>
              )}
            </div>

            {/* Skill tags */}
            {internship.skills_required && (
              <div className="flex flex-wrap gap-2 pt-1">
                {internship.skills_required.split(',').map((s) => (
                  <Badge key={s} variant="outline">{s.trim()}</Badge>
                ))}
              </div>
            )}
          </div>

          <hr />

          {internship.description && (
            <Section title="About This Internship">
              <p className="whitespace-pre-wrap">{internship.description}</p>
            </Section>
          )}

          {internship.requirements && (
            <Section title="Requirements">
              <p className="whitespace-pre-wrap">{internship.requirements}</p>
            </Section>
          )}

          {internship.responsibilities && (
            <Section title="Responsibilities">
              <p className="whitespace-pre-wrap">{internship.responsibilities}</p>
            </Section>
          )}
        </div>

        {/* ── Right: sticky apply panel ─────────────────────────────────── */}
        <div className="w-full lg:w-72 shrink-0 lg:sticky lg:top-6">
          <div className="border rounded-xl p-6 space-y-4">
            <div className="space-y-1">
              <p className="font-semibold text-base">
                {isOpen ? 'Apply for this role' : 'Applications closed'}
              </p>
              {internship.application_deadline && (
                <p className="text-xs text-muted-foreground">
                  Deadline: {new Date(internship.application_deadline).toLocaleDateString()}
                </p>
              )}
            </div>

            {internship.stipend_amount != null && (
              <div className="bg-muted rounded-lg px-4 py-3 text-center">
                <p className="text-xs text-muted-foreground">Monthly Stipend</p>
                <p className="text-lg font-bold">₹{internship.stipend_amount.toLocaleString()}</p>
              </div>
            )}

            {applied ? (
              <div className="flex items-center gap-2 text-green-600 font-medium text-sm py-2">
                <CheckCircle className="h-5 w-5 shrink-0" />
                Application submitted!
              </div>
            ) : (
              <Button
                className="w-full"
                disabled={applying || !isOpen}
                onClick={handleApply}
              >
                {applying && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {!isOpen ? 'Closed' : user ? 'Apply Now' : 'Login to Apply'}
              </Button>
            )}

            {applyError && (
              <p className="text-xs text-destructive">{applyError}</p>
            )}

            <hr />

            <div className="text-xs text-muted-foreground space-y-1">
              <p className="flex justify-between">
                <span>Type</span>
                <span className="capitalize font-medium text-foreground">
                  {internship.internship_type.replace('_', ' ')}
                </span>
              </p>
              {internship.duration_months && (
                <p className="flex justify-between">
                  <span>Duration</span>
                  <span className="font-medium text-foreground">{internship.duration_months} months</span>
                </p>
              )}
              {internship.vacancies != null && (
                <p className="flex justify-between">
                  <span>Openings</span>
                  <span className="font-medium text-foreground">{internship.vacancies}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
