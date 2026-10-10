'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiError, internshipsApi, type Internship } from '@/lib/api';
import { Loader2, Plus, X } from 'lucide-react';

export default function IndustryInternshipsPage() {
  const [items, setItems] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', location: '', internship_type: 'in_person', vacancies: '1', duration_months: '', stipend_amount: '', skills_required: '', application_deadline: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    internshipsApi.mine({ page: 1, page_size: 50 })
      .then((r) => setItems(r.items))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load internships.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await internshipsApi.create({ title: form.title, description: form.description || undefined, location: form.location || undefined, internship_type: form.internship_type, vacancies: Number(form.vacancies), duration_months: form.duration_months ? Number(form.duration_months) : undefined, stipend_amount: form.stipend_amount ? Number(form.stipend_amount) : undefined, skills_required: form.skills_required || undefined, application_deadline: form.application_deadline || undefined });
      setShowForm(false); setForm({ title: '', description: '', location: '', internship_type: 'in_person', vacancies: '1', duration_months: '', stipend_amount: '', skills_required: '', application_deadline: '' }); load();
    } catch (err) { setError(err instanceof ApiError ? err.message : 'Failed to create internship.'); }
    finally { setSaving(false); }
  };

  const close = async (id: number) => {
    try { await internshipsApi.update(id, { status: 'closed' }); load(); } catch (e) { console.error(e); }
  };

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Internships</h1>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'outline' : 'default'}>{showForm ? <><X className="h-4 w-4 mr-1" />Cancel</> : <><Plus className="h-4 w-4 mr-1" />New Internship</>}</Button>
      </div>
      {error && !showForm && <p className="text-sm text-destructive">{error}</p>}
      {showForm && (
        <Card><CardContent className="pt-6"><form onSubmit={create} className="space-y-3">
          <div><label className="text-sm font-medium">Title *</label><Input required value={form.title} onChange={(e) => set('title', e.target.value)} /></div>
          <div><label className="text-sm font-medium">Description</label><textarea className="w-full min-h-[60px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm" value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">Location</label><Input value={form.location} onChange={(e) => set('location', e.target.value)} /></div>
            <div><label className="text-sm font-medium">Vacancies</label><Input type="number" min="1" value={form.vacancies} onChange={(e) => set('vacancies', e.target.value)} /></div>
            <div><label className="text-sm font-medium">Duration (months)</label><Input type="number" min="1" value={form.duration_months} onChange={(e) => set('duration_months', e.target.value)} /></div>
            <div><label className="text-sm font-medium">Stipend (₹)</label><Input type="number" value={form.stipend_amount} onChange={(e) => set('stipend_amount', e.target.value)} /></div>
          </div>
          <div><label className="text-sm font-medium">Skills Required</label><Input value={form.skills_required} onChange={(e) => set('skills_required', e.target.value)} /></div>
          <div><label className="text-sm font-medium">Application Deadline</label><Input type="date" value={form.application_deadline} onChange={(e) => set('application_deadline', e.target.value)} /></div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Create</Button>
        </form></CardContent></Card>
      )}
      {items.length === 0 ? <p className="text-center text-muted-foreground py-12">No internships posted yet.</p> : (
        <Card><CardContent className="pt-0"><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Location</TableHead><TableHead>Vacancies</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>
          {items.map((i) => (
            <TableRow key={i.id}>
              <TableCell className="font-medium">{i.title}</TableCell>
              <TableCell>{i.location ?? '—'}</TableCell>
              <TableCell>{i.vacancies}</TableCell>
              <TableCell><Badge variant={i.status === 'open' ? 'default' : 'secondary'} className="capitalize">{i.status}</Badge></TableCell>
              <TableCell>{i.status === 'open' && <Button size="sm" variant="outline" onClick={() => close(i.id)}>Close</Button>}</TableCell>
            </TableRow>
          ))}
        </TableBody></Table></CardContent></Card>
      )}
    </div>
  );
}
