'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiError, visitsApi, type IndustrialVisit } from '@/lib/api';
import { Loader2, Plus, X } from 'lucide-react';

export default function IndustryVisitsPage() {
  const [items, setItems] = useState<IndustrialVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', visit_date: '', max_participants: '30', location: '', target_audience: '', registration_deadline: '', duration_hours: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    visitsApi.mine({ page: 1, page_size: 50 })
      .then((r) => setItems(r.items))
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load visits.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await visitsApi.create({ title: form.title, description: form.description || undefined, visit_date: form.visit_date, max_participants: Number(form.max_participants), location: form.location || undefined, target_audience: form.target_audience || undefined, registration_deadline: form.registration_deadline || undefined, duration_hours: form.duration_hours ? Number(form.duration_hours) : undefined });
      setShowForm(false); setForm({ title: '', description: '', visit_date: '', max_participants: '30', location: '', target_audience: '', registration_deadline: '', duration_hours: '' }); load();
    } catch (err) { setError(err instanceof ApiError ? err.message : 'Failed to create visit.'); }
    finally { setSaving(false); }
  };

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Industrial Visits</h1>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'outline' : 'default'}>{showForm ? <><X className="h-4 w-4 mr-1" />Cancel</> : <><Plus className="h-4 w-4 mr-1" />New Visit</>}</Button>
      </div>
      {error && !showForm && <p className="text-sm text-destructive">{error}</p>}
      {showForm && (
        <Card><CardContent className="pt-6"><form onSubmit={create} className="space-y-3">
          <div><label className="text-sm font-medium">Title *</label><Input required value={form.title} onChange={(e) => set('title', e.target.value)} /></div>
          <div><label className="text-sm font-medium">Description</label><textarea className="w-full min-h-[60px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm" value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium">Visit Date *</label><Input type="date" required value={form.visit_date} onChange={(e) => set('visit_date', e.target.value)} /></div>
            <div><label className="text-sm font-medium">Max Participants</label><Input type="number" min="1" value={form.max_participants} onChange={(e) => set('max_participants', e.target.value)} /></div>
            <div><label className="text-sm font-medium">Location</label><Input value={form.location} onChange={(e) => set('location', e.target.value)} /></div>
            <div><label className="text-sm font-medium">Duration (hours)</label><Input type="number" min="1" value={form.duration_hours} onChange={(e) => set('duration_hours', e.target.value)} /></div>
          </div>
          <div><label className="text-sm font-medium">Target Audience</label><Input value={form.target_audience} onChange={(e) => set('target_audience', e.target.value)} /></div>
          <div><label className="text-sm font-medium">Registration Deadline</label><Input type="date" value={form.registration_deadline} onChange={(e) => set('registration_deadline', e.target.value)} /></div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Create</Button>
        </form></CardContent></Card>
      )}
      {items.length === 0 ? <p className="text-center text-muted-foreground py-12">No visits created yet.</p> : (
        <Card><CardContent className="pt-0"><Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Date</TableHead><TableHead>Location</TableHead><TableHead>Capacity</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>
          {items.map((v) => (
            <TableRow key={v.id}>
              <TableCell className="font-medium">{v.title}</TableCell>
              <TableCell>{new Date(v.visit_date).toLocaleDateString()}</TableCell>
              <TableCell>{v.location ?? '—'}</TableCell>
              <TableCell>{v.max_participants}</TableCell>
              <TableCell><Badge variant="outline" className="capitalize">{v.status}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody></Table></CardContent></Card>
      )}
    </div>
  );
}
