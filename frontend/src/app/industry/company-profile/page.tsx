'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ApiError, companiesApi, type Company } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Company>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    companiesApi.mine()
      .then((c) => { setCompany(c); setForm(c); })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load company.'))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    if (!company) return;
    setSaving(true); setError('');
    try {
      const updated = await companiesApi.update(company.id, { name: form.name, email: form.email, phone: form.phone, city: form.city, address: form.address, description: form.description, website: form.website });
      setCompany(updated); setEditing(false);
    } catch (err) { setError(err instanceof ApiError ? err.message : 'Failed to save profile.'); }
    finally { setSaving(false); }
  };

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  if (loading) return <div className="flex items-center justify-center py-24"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  if (!company) return <p className="text-center text-muted-foreground py-12">{error || 'No company profile found.'}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Company Profile</h1>
        {!editing ? <Button variant="outline" onClick={() => setEditing(true)}>Edit</Button> : <div className="flex gap-2"><Button variant="outline" onClick={() => { setEditing(false); setForm(company); }}>Cancel</Button><Button onClick={save} disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Save</Button></div>}
      </div>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">{company.name[0]}</div>
            <div><h2 className="text-lg font-semibold">{company.name}</h2><Badge variant="secondary" className="capitalize">{company.status}</Badge></div>
          </div>
          {editing ? (
            <div className="space-y-3">
              <div><label className="text-sm font-medium">Name</label><Input value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} /></div>
              <div><label className="text-sm font-medium">Email</label><Input value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} /></div>
              <div><label className="text-sm font-medium">Phone</label><Input value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} /></div>
              <div><label className="text-sm font-medium">Website</label><Input value={form.website ?? ''} onChange={(e) => set('website', e.target.value)} /></div>
              <div><label className="text-sm font-medium">City</label><Input value={form.city ?? ''} onChange={(e) => set('city', e.target.value)} /></div>
              <div><label className="text-sm font-medium">Address</label><Input value={form.address ?? ''} onChange={(e) => set('address', e.target.value)} /></div>
              <div><label className="text-sm font-medium">Description</label><textarea className="w-full min-h-[80px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm" value={form.description ?? ''} onChange={(e) => set('description', e.target.value)} /></div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          ) : (
            <div className="grid gap-3 text-sm">
              {[['Type', company.company_type], ['Email', company.email], ['Phone', company.phone], ['Website', company.website], ['City', company.city], ['State', company.state], ['Address', company.address]].map(([label, val]) => val ? <div key={label}><span className="font-medium">{label}:</span> <span className="text-muted-foreground">{val}</span></div> : null)}
              {company.description && <div><span className="font-medium">Description:</span><p className="text-muted-foreground mt-1">{company.description}</p></div>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
